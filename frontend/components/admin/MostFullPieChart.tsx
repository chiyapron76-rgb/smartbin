import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// เฉดสีเขียว (เข้ม -> อ่อน)
const COLORS = ['#15803d', '#4ade80', '#bbf7d0', '#dcfce7'];

type SensorRecord = {
  fill_percentage: number;
  timestamp: string;
};

type Bin = {
  bin_code: string;
  sensorRecords?: SensorRecord[];
};

export default function MostFullPieChart({ bins = [] }: { bins: Bin[] }) {
  // ตั้งค่าเริ่มต้นเป็นเดือน/ปีปัจจุบัน
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // รายชื่อเดือนภาษาไทย
  const months = [
    { value: 1, label: 'มกราคม' },
    { value: 2, label: 'กุมภาพันธ์' },
    { value: 3, label: 'มีนาคม' },
    { value: 4, label: 'เมษายน' },
    { value: 5, label: 'พฤษภาคม' },
    { value: 6, label: 'มิถุนายน' },
    { value: 7, label: 'กรกฎาคม' },
    { value: 8, label: 'สิงหาคม' },
    { value: 9, label: 'กันยายน' },
    { value: 10, label: 'ตุลาคม' },
    { value: 11, label: 'พฤศจิกายน' },
    { value: 12, label: 'ธันวาคม' },
  ];

  // สร้างตัวเลือกปี (ย้อนหลัง 3 ปี)
  const years = [0, 1, 2].map(offset => currentDate.getFullYear() - offset);

  // 🟢 Logic คำนวณแบบใหม่ (กรองตามเดือน/ปีที่เลือก)
  const data = useMemo(() => {
    const results = bins.map((bin) => {
      const records = bin.sensorRecords || [];
      
      // กรองเฉพาะ Record ที่:
      // 1. เกิน 80% (เต็ม)
      // 2. ตรงกับเดือนที่เลือก
      // 3. ตรงกับปีที่เลือก
      const fullCount = records.filter(record => {
        const date = new Date(record.timestamp);
        const isFull = record.fill_percentage >= 80;
        const isMonthMatch = (date.getMonth() + 1) === Number(selectedMonth);
        const isYearMatch = date.getFullYear() === Number(selectedYear);

        return isFull && isMonthMatch && isYearMatch;
      }).length;
      
      return {
        name: bin.bin_code,
        value: fullCount
      };
    });

    // เรียงลำดับและตัดมาเฉพาะที่มีข้อมูล
    return results
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [bins, selectedMonth, selectedYear]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* ส่วนหัว + Dropdown เลือกเดือน/ปี */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 leading-tight">
            ถังที่เต็มบ่อยที่สุด
          </h3>
          <p className="text-xs text-slate-400 mt-1">จำนวนครั้งที่ขยะ ≥ 80%</p>
        </div>

        {/* 🟢 Dropdown Selectors */}
        <div className="flex gap-2">
          {/* เลือกเดือน */}
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer hover:bg-slate-100 transition-colors"
          >
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>

          {/* เลือกปี (โชว์เป็น พ.ศ. แต่ value เป็น ค.ศ.) */}
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer hover:bg-slate-100 transition-colors"
          >
            {years.map(y => (
              <option key={y} value={y}>{y + 543}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 min-h-[250px] relative">
        {data.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
             <div className="bg-slate-50 p-4 rounded-full mb-3">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
             </div>
            <p className="text-sm">ไม่มีข้อมูลถังเต็มในเดือนนี้</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={0}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
              />
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                iconType="circle"
                formatter={(value, entry: any) => (
                  <span className="text-slate-600 text-xs ml-2 font-medium">
                    {value} <span className="text-slate-400 ml-1">({entry.payload.value} ครั้ง)</span>
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}