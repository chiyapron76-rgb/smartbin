import React from "react";

interface TaskItemRowProps {
  item: any;
  index: number; // รับค่าลำดับที่ส่งมาจากแม่
  onComplete: () => void;
  onReport: (data: { itemId: string; binId: string }) => void;
}

export default function TaskItemRow({ item, index, onComplete, onReport }: TaskItemRowProps) {
  
  // ฟังก์ชันแปลงวันที่ให้สวยงาม
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-US", { 
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-none">
      
      {/* 1. ลำดับ (จัดกึ่งกลาง + Padding ซ้ายเท่าหัวตาราง) */}
      <td className="p-4 pl-6 text-center text-slate-500 font-medium">
        {index} 
      </td>

      {/* 2. รหัสถัง (ชิดซ้ายตัวหนา) */}
      <td className="p-4 font-bold text-slate-700">
        {item.bin?.bin_code || item.bin_code || "Unknown"}
        {/* แสดงโซนถ้ามี */}
        {(item.bin?.zone || item.zone) && (
           <span className="ml-2 text-xs font-normal text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
             {item.bin?.zone || item.zone}
           </span>
        )}
      </td>

      {/* 3. สถานะ (จัดกึ่งกลาง) */}
      <td className="p-4 text-center">
        {item.status === "completed" ? (
          <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 shadow-sm">
            เสร็จสิ้นแล้ว
          </span>
        ) : (
          <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200 shadow-sm">
            รอดำเนินการ
          </span>
        )}
      </td>

      {/* 4. เวลาล่าสุด (ชิดซ้าย) */}
      <td className="p-4 text-sm text-slate-500 font-medium">
        {formatDate(item.completed_at || item.updated_at || item.created_at)}
      </td>

      {/* 5. จัดการ (ชิดขวา + Padding ขวาเท่าหัวตาราง) */}
      <td className="p-4 pr-6 text-right">
        <div className="flex justify-end gap-2">
           {/* ปุ่ม Complete */}
           {item.status !== "completed" && (
             <button
               onClick={onComplete}
               className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95"
             >
               Complete
             </button>
           )}
           
           {/* ปุ่ม Report Issue */}
           <button
             onClick={() => onReport({ itemId: item.id, binId: item.bin_id })}
             className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95"
           >
             Report Issue
           </button>
        </div>
      </td>
    </tr>
  );
}