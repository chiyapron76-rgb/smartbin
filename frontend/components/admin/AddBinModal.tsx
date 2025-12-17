import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// โหลดแผนที่ Preview แบบ Dynamic
const BinPreviewMap = dynamic(() => import("./BinPreviewMap"), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-50 text-slate-400 animate-pulse">
      <div className="flex flex-col items-center gap-2">
        <svg className="animate-spin h-6 w-6 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>กำลังโหลดแผนที่...</span>
      </div>
    </div>
  )
});

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  lat: number;
  lng: number;
}

export default function AddBinModal({ isOpen, onClose, onSubmit, lat, lng }: Props) {
  const [formData, setFormData] = useState({
    zone: "",
    model: "",
    sensor_type: "ultrasonic",
    address_note: "",
    is_public: true,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        zone: "",
        model: "",
        sensor_type: "ultrasonic",
        address_note: "",
        is_public: true,
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // 🟢 เพิ่ม Validation: เช็คว่ากรอกครบไหม
    if (!formData.zone.trim()) {
      alert("⚠️ กรุณาระบุ 'โซนพื้นที่ (Zone)' ให้ครบถ้วน");
      return;
    }
    if (!formData.address_note.trim()) {
      alert("⚠️ กรุณาระบุ 'รายละเอียดเพิ่มเติม' ให้ครบถ้วน");
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[85vh]">
        
        {/* --- ฝั่งซ้าย: แบบฟอร์ม --- */}
        <div className="flex-1 flex flex-col h-full bg-white relative z-10 border-r border-slate-100">
          
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 className="text-2xl font-bold text-slate-800">เพิ่มหมุดใหม่</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            <div className="space-y-6">
              
              {/* Toggle */}
              <div>
                <label className="text-sm font-bold text-slate-700 mb-3 block uppercase tracking-wider">การมองเห็น</label>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4">
                  <div className="flex items-center gap-3">
                     <div 
                        className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${formData.is_public ? 'bg-emerald-500' : 'bg-slate-300'}`} 
                        onClick={() => setFormData(p => ({...p, is_public: !p.is_public}))}
                     >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${formData.is_public ? 'translate-x-5' : 'translate-x-0'}`}></div>
                     </div>
                     <span className="font-medium text-slate-700">{formData.is_public ? 'สาธารณะ (Public)' : 'ส่วนตัว (Private)'}</span>
                  </div>
                </div>
              </div>

              {/* Auto Code */}
              <div>
                 <label className="text-sm font-bold text-slate-700 mb-2 block uppercase tracking-wider">รหัสถัง (Bin Code)</label>
                 <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center gap-3">
                    <span className="bg-indigo-200 text-indigo-700 text-xs font-bold px-2 py-1 rounded">AUTO</span>
                    <span className="text-indigo-900 font-medium text-sm">ระบบจะสร้างรหัสให้อัตโนมัติ (เช่น BIN-XXX)</span>
                 </div>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 gap-5">
                <div>
                  {/* 🟢 เพิ่มดอกจันสีแดง */}
                  <label className="text-sm font-bold text-slate-700 mb-2 block">
                    โซนพื้นที่ (Zone) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="zone"
                    value={formData.zone}
                    onChange={handleChange}
                    type="text" 
                    placeholder="เช่น Zone A, ตลาดสด" 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">ประเภทเซ็นเซอร์</label>
                  <div className="relative">
                    <select 
                      name="sensor_type" 
                      value={formData.sensor_type} 
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none transition-all"
                    >
                      <option value="ultrasonic">Ultrasonic (วัดระยะทาง)</option>
                      <option value="infrared">Infrared (อินฟราเรด)</option>
                      <option value="weight">Load Cell (วัดน้ำหนัก)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">พิกัดตำแหน่ง</label>
                  <div className="flex gap-3">
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                       <span className="text-xs text-slate-400 block mb-1">LATITUDE</span>
                       <span className="font-mono font-bold text-slate-700">{lat.toFixed(6)}</span>
                    </div>
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                       <span className="text-xs text-slate-400 block mb-1">LONGITUDE</span>
                       <span className="font-mono font-bold text-slate-700">{lng.toFixed(6)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {/* 🟢 เพิ่มดอกจันสีแดง */}
                  <label className="text-sm font-bold text-slate-700 mb-2 block">
                    รายละเอียดเพิ่มเติม <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    name="address_note"
                    value={formData.address_note}
                    onChange={handleChange}
                    rows={3}
                    placeholder="ระบุจุดสังเกต..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none transition-all placeholder:text-slate-400"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- ฝั่งขวา: แผนที่ + ปุ่มกด --- */}
        <div className="hidden md:flex w-1/2 bg-slate-100 flex-col h-full">
           <div className="flex-1 relative w-full h-full">
             <BinPreviewMap lat={lat} lng={lng} />
             <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-black/5 to-transparent pointer-events-none z-[400]"></div>
           </div>
           
           <div className="bg-white p-6 border-t border-slate-200 flex justify-end gap-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <button 
                onClick={onClose}
                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all font-bold text-sm"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleSubmit}
                className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all font-bold text-sm flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
                ยืนยันการเพิ่มหมุด
              </button>
           </div>
        </div>

        <div className="md:hidden p-4 border-t border-slate-200 bg-white flex gap-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
           <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold">ยกเลิก</button>
           <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold shadow-md">ยืนยัน</button>
        </div>

      </div>
    </div>
  );
}