import React, { useState, useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (selectedIssues: string[], description: string) => void;
  binData: any; 
  loading?: boolean;
}

export default function ReportIssueModal({ 
  isOpen, onClose, onSubmit, binData, loading 
}: Props) {
  
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  const issueOptions = [
    { id: 'full', label: '🗑️ ขยะล้นถัง / เก็บไม่ทัน' },
    { id: 'smell', label: '🤢 ส่งกลิ่นเหม็นรบกวน' },
    { id: 'broken', label: '🛠️ ตัวถังชำรุด / ฝาปิดไม่ได้' },
    { id: 'block', label: '🚧 ขวางทางเดิน / จราจร' },
    { id: 'pest', label: '🐜 มีมด / แมลง / สัตว์รบกวน' }
  ];

  useEffect(() => {
    if (isOpen) {
      setSelectedIssues([]);
      setDescription("");
    }
  }, [isOpen]);

  const toggleIssue = (label: string) => {
    if (selectedIssues.includes(label)) {
      setSelectedIssues(selectedIssues.filter(item => item !== label));
    } else {
      setSelectedIssues([...selectedIssues, label]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden border border-slate-100 transform transition-all scale-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
             <div className="bg-red-50 p-2 rounded-xl text-red-500">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
             </div>
             <div>
               <h3 className="text-xl font-bold text-slate-800">แจ้งปัญหา</h3>
               <p className="text-xs text-slate-500">ช่วยเราตรวจสอบเพื่อความสะอาด</p>
             </div>
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

        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {/* 🟢 ส่วนแสดงข้อมูลถัง (ปรับดีไซน์ใหม่) */}
          <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
             
             {/* จุดติดตั้ง */}
             <div className="mb-4">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">จุดติดตั้ง / สถานที่:</span>
               <div className="text-lg font-bold text-slate-800 mt-1 leading-snug">
                 {binData?.address_note || binData?.location || binData?.zone || "ไม่ระบุ"}
               </div>
             </div>

             {/* รหัสถัง (ทำให้เด่นชัด) */}
             <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
               <span className="text-sm font-bold text-slate-500 flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                 </svg>
                 รหัสถัง:
               </span>
               <span className="text-xl font-black text-indigo-600 bg-indigo-50 px-4 py-1 rounded-lg border border-indigo-100 tracking-wider">
                 {binData?.code || `BIN-${binData?.id}`}
               </span>
             </div>

          </div>

          {/* รายการปัญหา */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-800 mb-3">
              พบปัญหาอะไรบ้าง? <span className="text-slate-400 font-normal">(เลือกได้มากกว่า 1)</span>
            </label>
            
            <div className="grid grid-cols-1 gap-3">
              {issueOptions.map((option) => {
                const isSelected = selectedIssues.includes(option.label);
                return (
                  <div 
                    key={option.id}
                    onClick={() => toggleIssue(option.label)}
                    className={`cursor-pointer p-3 rounded-xl border-2 transition-all flex items-center gap-3 active:scale-[0.98]
                      ${isSelected 
                        ? 'border-red-500 bg-red-50 shadow-sm' 
                        : 'border-slate-100 bg-white hover:border-slate-300'}
                    `}
                  >
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors shrink-0
                       ${isSelected ? 'bg-red-500 border-red-500' : 'border-slate-300 bg-white'}
                    `}>
                      {isSelected && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className={`text-sm font-medium ${isSelected ? 'text-red-700' : 'text-slate-600'}`}>
                      {option.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* รายละเอียดเพิ่มเติม */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-500 pl-1">
              รายละเอียดเพิ่มเติม (ไม่บังคับ)
            </label>
            <textarea
               rows={2}
               className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50 transition-all resize-none text-sm"
               placeholder="เช่น ถังบุบ, มีสุนัขคุ้ยขยะ..."
               value={description}
               onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white sticky bottom-0 z-10">
           <button 
             onClick={() => onSubmit(selectedIssues, description)}
             disabled={loading || selectedIssues.length === 0}
             className={`w-full font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all transform flex items-center justify-center gap-2
               ${loading || selectedIssues.length === 0 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                  : 'bg-red-500 hover:bg-red-600 text-white shadow-red-200 hover:scale-[1.02] active:scale-95'}
             `}
           >
             {loading ? 'กำลังส่งข้อมูล...' : 'ยืนยันการแจ้งปัญหา'}
           </button>
        </div>
      </div>
    </div>
  );
}