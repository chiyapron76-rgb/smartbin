import React, { useState, useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (description: string) => void;
  taskTitle: string;
  binCode: string;
  status: string;
  loading?: boolean;
}

export default function ReportIssueModal({ 
  isOpen, onClose, onSubmit, taskTitle, binCode, status, loading 
}: Props) {
  
  const [description, setDescription] = useState("");

  // ล้างข้อมูลเมื่อเปิด Modal ใหม่
  useEffect(() => {
    if (isOpen) setDescription("");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden border border-slate-100 transform transition-all scale-100">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
             <div className="bg-slate-50 p-2 rounded-xl text-slate-600">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
             </div>
             <h3 className="text-xl font-bold text-slate-800">รายงานปัญหา</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          
          {/* ข้อมูลงานและถัง */}
          <div className="space-y-4">
             <div className="flex flex-col">
               <span className="text-sm font-bold text-slate-500 mb-1">ชื่องาน</span>
               <span className="text-base font-bold text-slate-800">{taskTitle}</span>
             </div>
             
             <div className="flex flex-col">
               <span className="text-sm font-bold text-slate-500 mb-1">รหัสถัง : จุดเก็บ</span>
               <span className="text-base font-bold text-slate-800">{binCode}</span>
             </div>

             <div className="flex flex-col">
               <span className="text-sm font-bold text-slate-500 mb-1">สถานะ</span>
               <span className={`text-base font-bold ${status === 'completed' ? 'text-emerald-600' : 'text-slate-800'}`}>
                 {status === 'completed' ? 'เสร็จสิ้น' : 'รอดำเนินการ'}
               </span>
             </div>
          </div>

          {/* เส้นคั่น */}
          <hr className="border-slate-100" />

          {/* ฟอร์มกรอกข้อมูล */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-orange-500 pl-1">
              รายงานปัญหาเพิ่มเติม
            </label>
            <textarea
               rows={4}
               className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-slate-700 placeholder:text-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all resize-none shadow-sm text-base"
               placeholder="ระบุรายละเอียดปัญหาที่พบ..."
               value={description}
               onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* ปุ่มยืนยัน */}
          <div className="pt-2 flex justify-center">
             <button 
               onClick={() => onSubmit(description)}
               disabled={loading}
               className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-12 rounded-full shadow-lg shadow-emerald-200 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
             >
               {loading ? 'กำลังส่ง...' : 'ยืนยัน'}
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}