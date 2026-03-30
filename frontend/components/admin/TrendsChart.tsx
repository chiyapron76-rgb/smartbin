import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// ข้อมูลจำลองรายเดือน (สำหรับโชว์ตอนไม่มีข้อมูลจริง)
const MOCK_MONTHLY_DATA = [
  { name: 'ม.ค.', value: 20 },
  { name: 'ก.พ.', value: 35 },
  { name: 'มี.ค.', value: 18 },
  { name: 'เม.ย.', value: 30 },
  { name: 'พ.ค.', value: 45 },
  { name: 'มิ.ย.', value: 32 },
  { name: 'ก.ค.', value: 50 },
  { name: 'ส.ค.', value: 38 },
  { name: 'ก.ย.', value: 25 },
  { name: 'ต.ค.', value: 30 },
  { name: 'พ.ย.', value: 22 },
  { name: 'ธ.ค.', value: 40 },
];

export default function TrendsChart({ data = [] }: { data: any[] }) {
  
  // 🟢 เช็คว่าข้อมูลที่ส่งมามีค่าจริงไหม? (ถ้าเป็น 0 หมด หรือไม่มีข้อมูล ให้ใช้ Mock รายเดือนแทน)
  const hasRealData = data.length > 0 && data.some(item => (item.value || item.average_fill) > 0);

  // เลือกใช้ข้อมูล: ถ้ามีของจริงใช้ของจริง, ถ้าไม่มีใช้ Mock รายเดือน
  const chartData = hasRealData 
    ? data.map(item => ({
        name: item.date || item.name,
        value: item.average_fill || item.value || 0
      }))
    : MOCK_MONTHLY_DATA;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">
          {hasRealData ? "ปริมาณขยะย้อนหลัง (Real-time)" : "ปริมาณการเก็บขยะเฉลี่ยรายเดือน"}
        </h3>
        
        {/* Badge บอกสถานะข้อมูล */}
        {!hasRealData && (
           <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md border border-slate-200">
             ข้อมูลตัวอย่าง (Mock)
           </span>
        )}
      </div>
      
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {/* Gradient สีเขียว */}
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748B', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748B', fontSize: 12 }} 
            />
            
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            />

            {/* เส้นกราฟสีเขียว (Curve) */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="#059669"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
              dot={{ r: 4, fill: '#059669', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}