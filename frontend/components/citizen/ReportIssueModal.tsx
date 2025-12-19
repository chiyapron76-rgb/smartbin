import React, { useState, useEffect, useRef } from "react";
import Swal from 'sweetalert2';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { issue_type: string, description: string, image?: File | null }) => void;
  binData: any; 
  loading?: boolean;
}

export default function CitizenReportModal({ 
  isOpen, onClose, onSubmit, binData, loading 
}: Props) {
  
  const [issueType, setIssueType] = useState("full");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const issueTypes = [
    { value: "full", label: "🗑️ ขยะล้นถัง (Bin Full)" },
    { value: "broken", label: "🛠️ ถังชำรุด (Broken)" },
    { value: "smell", label: "🤢 ส่งกลิ่นเหม็น (Bad Smell)" },
    { value: "dirty", label: "💩 สกปรกเลอะเทอะ (Dirty)" },
    { value: "blocked", label: "🚧 มีสิ่งกีดขวาง (Blocked)" },
    { value: "location_wrong", label: "📍 ตำแหน่งผิด (Location Wrong)" },
    { value: "vandalized", label: "🎨 ถูกทำลาย/ขีดเขียน (Vandalized)" },
    { value: "others", label: "📝 อื่นๆ (Others)" },
  ];

  useEffect(() => {
    if (isOpen) {
      setDescription("");
      setIssueType("full");
      setImage(null);
      setPreviewUrl(null);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const triggerCamera = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      fileInputRef.current?.click();
    } catch (err) {
      fileInputRef.current?.click();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in font-kanit">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[95vh]">
        
        {/* Header: ปรับสถานที่ตั้งให้ใหญ่ชัดเจน */}
        <div className="px-6 py-6 border-b border-slate-50 flex justify-between items-start bg-white sticky top-0 z-10">
          <div className="flex gap-4">
             <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
               </svg>
             </div>
             <div className="flex flex-col gap-1">
               <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-widest">แจ้งปัญหาขยะ</h3>
               {/* 🟢 สถานที่ตั้ง ตัวใหญ่สะใจ (text-xl ถึง 2xl) */}
               <h2 className="text-xl md:text-2xl font-black text-slate-800 leading-tight">
                 {binData?.address_note || binData?.location || "จุดติดตั้งทั่วไป"}
               </h2>
             </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-600 p-2 bg-slate-50 rounded-full transition-colors">✕</button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          
          {/* ส่วนถ่ายรูป */}
          <div className="space-y-3">
            <label className="block text-base font-bold text-slate-700 pl-1">
              ภาพถ่ายยืนยัน (ถ้ามี)
            </label>
            
            {previewUrl ? (
              <div className="relative rounded-[24px] overflow-hidden border-2 border-emerald-500 shadow-xl h-56 bg-slate-100 animate-in zoom-in-95 duration-300">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => { setImage(null); setPreviewUrl(null); }}
                  className="absolute top-3 right-3 bg-red-500 text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center font-bold hover:bg-red-600 transition-all"
                >✕</button>
              </div>
            ) : (
              <div 
                onClick={triggerCamera}
                className="border-3 border-dashed border-slate-200 rounded-[24px] p-10 flex flex-col items-center justify-center gap-3 bg-slate-50 hover:bg-slate-100 hover:border-emerald-300 transition-all cursor-pointer active:scale-95 duration-200"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-slate-100">📷</div>
                <div className="text-center">
                  <p className="font-extrabold text-slate-700 text-lg">แตะเพื่อถ่ายรูป</p>
                  <p className="text-sm text-slate-400 font-medium">ช่วยให้เจ้าหน้าที่ตรวจสอบได้แม่นยำขึ้น</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*" 
                  capture="environment" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          {/* ประเภทปัญหา */}
          <div className="space-y-3">
            <label className="block text-base font-bold text-slate-700 pl-1">ประเภทปัญหาที่พบ <span className="text-red-500">*</span></label>
            <div className="relative">
              <select
                className="w-full rounded-2xl border-2 border-slate-100 bg-white p-4 text-slate-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-bold text-lg appearance-none shadow-sm"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
              >
                {issueTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
            </div>
          </div>

          {/* รายละเอียด */}
          <div className="space-y-3">
            <label className="block text-base font-bold text-slate-700 pl-1">รายละเอียดเพิ่มเติม</label>
            <textarea
               rows={3}
               className="w-full rounded-2xl border-2 border-slate-100 bg-white p-4 text-slate-800 placeholder:text-slate-300 focus:border-emerald-500 outline-none transition-all resize-none shadow-sm text-lg"
               placeholder="เขียนข้อความที่นี่..."
               value={description}
               onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white flex gap-4">
           <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 transition-all text-lg active:scale-95">ยกเลิก</button>
           <button 
             onClick={() => onSubmit({ issue_type: issueType, description, image })}
             disabled={loading}
             className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-100 transition-all active:scale-95 disabled:opacity-70 text-lg flex items-center justify-center gap-2"
           >
             {loading ? 'กำลังส่งข้อมูล...' : '🚀 ยืนยันแจ้งปัญหา'}
           </button>
        </div>
      </div>
    </div>
  );
}