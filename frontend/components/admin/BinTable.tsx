import React from 'react';

// ฟังก์ชันแปลงวันที่ให้เป็นรูปแบบไทย
const formatThaiDate = (isoString: string) => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear() + 543;

  return `${hours}:${minutes} (${day}/${month}/${year})`;
};

export default function BinTable({ bins }: { bins: any[] }) {

  // เรียงลำดับข้อมูล (BIN-001, BIN-002...) เพื่อความสวยงาม
  const sortedBins = [...bins].sort((a, b) => 
    (a.bin_code || "").localeCompare(b.bin_code || "", undefined, { numeric: true })
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6 min-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">ปริมาณขยะรายวัน</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          ทั้งหมด {sortedBins.length} จุด
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="text-gray-500 border-b border-gray-100 text-base">
              <th className="py-4 pl-4 font-normal w-1/5">ชื่อถัง</th>
              <th className="py-4 font-normal w-1/5">ปริมาณขยะ %</th>
              <th className="py-4 font-normal w-1/4">ชื่อสถานที่ตั้ง</th>
              <th className="py-4 font-normal w-1/6 text-center">สถานะ</th>
              {/* 🟢 ตัดคอลัมน์จัดการออก ปรับความกว้างเวลาให้เหมาะสม */}
              <th className="py-4 font-normal w-1/6 text-right pr-6">เวลา</th>
            </tr>
          </thead>
          <tbody className="text-base text-gray-700">
            {sortedBins.map((bin) => {
               const last = bin.sensorRecords?.[0];
               const fill = last?.fill_percentage || 0;
               
               // Logic สีสถานะ (คงเดิมตามที่คุณชอบ)
               let statusLabel = 'ทำงานปกติ';
               let statusClass = 'text-blue-600 bg-blue-50 border border-blue-200'; 
               
               if (bin.status === 'offline' || bin.status === 'maintenance') {
                 statusLabel = 'ไม่ทำงาน'; 
                 statusClass = 'text-red-600 bg-red-50 border border-red-200'; 
               } else if (fill > 100) {
                 statusLabel = 'Error';
                 statusClass = 'text-red-700 bg-red-100 border border-red-300';
               } else if (fill >= 80) {
                 statusLabel = 'ขยะใกล้เต็ม';
                 statusClass = 'text-orange-600 bg-orange-50 border border-orange-200';
               }

               const isStatusError = bin.status !== 'active';
               const isSensorError = fill > 100 || !last;
               const showErrorText = isStatusError || isSensorError;

               return (
                <tr key={bin.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  {/* 1. ชื่อถัง */}
                  <td className="py-5 pl-4 font-medium text-gray-900">
                    {bin.bin_code}
                  </td>
                  
                  {/* 2. ปริมาณขยะ */}
                  <td className={`py-5 font-medium ${showErrorText ? 'text-[#FF4D4F] font-bold' : 'text-gray-700'}`}>
                    {showErrorText ? 'Error' : `${fill} %`}
                  </td>
                  
                  {/* 3. ชื่อสถานที่ตั้ง (2 บรรทัด) */}
                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-col justify-center h-full">
                      <span className="text-sm font-bold text-slate-800">
                        {bin.zone || "-"}
                      </span>
                      <span className="text-xs text-slate-500 mt-0.5 max-w-[200px] truncate">
                        {bin.address_note || bin.description || "ไม่มีรายละเอียด"}
                      </span>
                    </div>
                  </td>
                  
                  {/* 4. สถานะ */}
                  <td className="py-5 text-center">
                    <span className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${statusClass}`}>
                      {statusLabel}
                    </span>
                  </td>
                  
                  {/* 5. เวลา */}
                  <td className="py-5 text-gray-500 text-right pr-6">
                    {last ? formatThaiDate(last.timestamp) : '-'}
                  </td>

                  {/* ❌ เอาปุ่มจัดการออกไปแล้ว */}
                </tr>
               );
            })}
            
            {sortedBins.length === 0 && (
              <tr><td colSpan={5} className="py-10 text-center text-gray-400">- ไม่มีข้อมูลถังขยะ -</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}