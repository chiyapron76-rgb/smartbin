import React, { useState, useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // เจ้าหน้าที่อาจจะมี binCode หรือไม่มีก็ได้ ขึ้นอยู่กับบริบท
  onSubmit: (data: { issue_type: string, description: string }) => void;
  taskTitle?: string;
  binCode?: string;
  status?: string;
  loading?: boolean;
}

export default function OfficerReportModal({ 
  isOpen, onClose, onSubmit, taskTitle, binCode, status, loading 
}: Props) {
  
  const [issueType, setIssueType] = useState("full");
  const [description, setDescription] = useState("");

  // 🟢 รายการตัวเลือกสำหรับ "เจ้าหน้าที่" (มี Sensor Error ครบ)
  // Value ต้องตรงกับ enum IssueType ใน schema.prisma
  const issueTypes = [
    { value: "full", label: "🗑️ ขยะล้นถัง (Bin Full)" },
    { value: "broken", label: "🛠️ ถังชำรุด (Broken)" },
    { value: "sensor_error", label: "🔋 เซ็นเซอร์เสีย (Sensor Error)" }, // ✅ มีอันนี้
    { value: "blocked", label: "🚧 มีสิ่งกีดขวาง (Blocked)" },
    { value: "smell", label: "🤢 ส่งกลิ่นเหม็น (Bad Smell)" },
    { value: "dirty", label: "💩 สกปรกเลอะเทอะ (Dirty)" },
    { value: "location_wrong", label: "📍 ตำแหน่งผิด (Location Wrong)" },
    { value: "vandalized", label: "🎨 ถูกทำลาย/ขีดเขียน (Vandalized)" },
    { value: "others", label: "📝 อื่นๆ (Others)" },
  ];

  useEffect(() => {
    if (isOpen) {
      setDescription("");
      setIssueType("full");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden border border-slate-200 transform transition-all scale-100">
        
        {/* Header (สีแดงสำหรับ Admin/Officer เพื่อความแตกต่าง) */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
             <div className="bg-red-50 p-2 rounded-xl text-red-500">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
             </div>
             <div>
               <h3 className="text-xl font-bold text-slate-800">รายงานปัญหา (Officer)</h3>
               <p className="text-xs text-slate-500">
                 {taskTitle ? `งาน: ${taskTitle}` : 'แจ้งเหตุขัดข้อง'} 
                 {binCode && ` (${binCode})`}
               </p>
             </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 pl-1">
              ประเภทปัญหา <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all appearance-none font-medium"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
              >
                {issueTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 pl-1">
              รายละเอียดเพิ่มเติม
            </label>
            <textarea
               rows={3}
               className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-700 placeholder:text-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all resize-none shadow-sm"
               placeholder="ระบุรายละเอียดปัญหาที่พบ..."
               value={description}
               onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex justify-end gap-3">
           <button 
             onClick={onClose}
             className="px-6 py-2.5 rounded-xl text-slate-500 font-bold hover:bg-slate-100 transition-colors"
           >
             ยกเลิก
           </button>
           <button 
             onClick={() => onSubmit({ issue_type: issueType, description })}
             disabled={loading}
             className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-8 rounded-xl shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2"
           >
             {loading ? 'กำลังบันทึก...' : 'ยืนยัน'}
           </button>
        </div>

      </div>
    </div>
  );
}