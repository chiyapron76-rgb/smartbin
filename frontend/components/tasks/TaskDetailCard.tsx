import React from "react";

interface TaskDetailProps {
  task: any;
  onStart: () => void;
  onComplete: () => void;
  actionLoading: boolean;
}

export default function TaskDetailCard({
  task,
  onStart,
  onComplete,
  actionLoading
}: TaskDetailProps) {

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            
      {/* ฝั่งซ้าย: แสดงชื่องาน (Title) และวันที่ */}
      <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            {/* ✅ แสดงชื่องาน (Title) ตัวใหญ่ */}
            <h1 className="text-2xl font-bold text-slate-800 leading-tight">
              {task.title || "งานไม่มีชื่อ"}
            </h1>
            {/* แสดงวันที่สร้างเล็กๆ */}
            <p className="text-slate-400 text-xs mt-1">
              สร้างเมื่อ: {new Date(task.created_at).toLocaleString('th-TH')}
            </p>
          </div>
      </div>

      {/* ฝั่งขวา: ปุ่ม Action (ตามสถานะ) */}
      <div className="flex gap-3">
        {/* ปุ่มเริ่มงาน (แสดงเมื่อ pending) */}
        {task.status === 'pending' && (
          <button 
            onClick={onStart}
            disabled={actionLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-md shadow-blue-200 transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
            เริ่มงาน
          </button>
        )}

        {/* ปุ่มจบงาน (แสดงเมื่อ in_progress) */}
        {task.status === 'in_progress' && (
          <button 
            onClick={onComplete}
            disabled={actionLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-bold shadow-md shadow-emerald-200 transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            เสร็จสิ้นงาน
          </button>
        )}

        {/* ป้ายเสร็จสิ้น (แสดงเมื่อ completed) */}
        {task.status === 'completed' && (
          <div className="bg-slate-100 text-slate-500 px-6 py-3 rounded-full font-bold flex items-center gap-2 cursor-default border border-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            งานเสร็จสิ้นแล้ว
          </div>
        )}
      </div>
    </div>
  );
}