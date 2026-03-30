import React from 'react';
import { deleteBin } from '../../lib/api';
import Link from 'next/link';

// ฟังก์ชันแปลงวันที่
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

export default function ManageBinTable({ bins, refreshData }: { bins: any[], refreshData?: () => void }) {

  // 1. เรียงลำดับข้อมูล (BIN-001, BIN-002...)
  const sortedBins = [...bins].sort((a, b) => 
    (a.bin_code || "").localeCompare(b.bin_code || "", undefined, { numeric: true })
  );

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`⚠️ คุณแน่ใจหรือไม่ที่จะลบถังขยะ "${code}"?\nข้อมูลประวัติและสถิติทั้งหมดของถังนี้จะหายไป!`)) {
      return;
    }

    try {
      await deleteBin(id);
      alert(`ลบถังขยะ ${code} เรียบร้อยแล้ว`);
      if (refreshData) {
        refreshData();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Delete failed", error);
      alert("เกิดข้อผิดพลาดในการลบ");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6 min-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">รายชื่อถังขยะทั้งหมด</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          ทั้งหมด {sortedBins.length} จุด
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="text-gray-500 border-b border-gray-100 text-base">
              <th className="py-4 pl-4 font-normal w-1/5">ชื่อถัง</th>
              <th className="py-4 font-normal w-1/6">ปริมาณขยะ %</th>
              <th className="py-4 font-normal w-1/4">ชื่อสถานที่ตั้ง</th>
              <th className="py-4 font-normal w-1/6 text-center">สถานะ</th>
              <th className="py-4 font-normal w-1/6 text-right pr-6">เวลา</th>
              <th className="py-4 font-normal w-32 text-center pr-4">จัดการ</th>
            </tr>
          </thead>
          <tbody className="text-base text-gray-700">
            {sortedBins.map((bin) => {
               const last = bin.sensorRecords?.[0];
               const fill = last?.fill_percentage || 0;
               
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
                  <td className="py-5 pl-4 font-medium text-gray-900">
                    {bin.bin_code}
                  </td>
                  
                  <td className={`py-5 font-medium ${showErrorText ? 'text-[#FF4D4F] font-bold' : 'text-gray-700'}`}>
                    {showErrorText ? 'Error' : `${fill} %`}
                  </td>
                  
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
                  
                  <td className="py-5 text-center">
                    <span className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${statusClass}`}>
                      {statusLabel}
                    </span>
                  </td>
                  
                  <td className="py-5 text-gray-500 text-right pr-6">
                    {last ? formatThaiDate(last.timestamp) : '-'}
                  </td>

                  {/* 🟢 ปุ่มจัดการ (มีทั้งแก้ไขและลบ) */}
                  <td className="py-5 text-center pr-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* ปุ่มแก้ไข */}
                      <Link href={`/admin/bins/${bin.id}`} legacyBehavior>
                        <a className="inline-flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-2 rounded-lg transition-colors border border-indigo-100" title="แก้ไข">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </a>
                      </Link>

                      {/* ปุ่มลบ */}
                      <button 
                        onClick={() => handleDelete(bin.id, bin.bin_code)}
                        className="inline-flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors border border-red-100"
                        title="ลบ"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
               );
            })}
            
            {sortedBins.length === 0 && (
              <tr><td colSpan={6} className="py-10 text-center text-gray-400">- ไม่มีข้อมูลถังขยะ -</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}