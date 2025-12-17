import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/shared/Layout";
import { fetchBins, createTask } from "../../lib/api";

export default function CreateTaskPage() {
  const router = useRouter();
  
  // --- State ---
  const [bins, setBins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 🟢 ใช้ string[] เก็บ bin_code ตามไฟล์ที่ทำงานได้
  const [selectedBins, setSelectedBins] = useState<string[]>([]);
  
  const [priority, setPriority] = useState("medium");
  const [notes, setNotes] = useState("");

  // --- Load Data ---
  useEffect(() => {
    fetchBins()
      .then((data) => {
        setBins(data || []);
      })
      .catch((err) => console.error("Load bins failed", err))
      .finally(() => setLoading(false));
  }, []);

  // --- Logic ---
  
  // Toggle โดยใช้ bin_code (String)
  const toggleBin = (binCode: string) => {
    setSelectedBins((prev) => 
      prev.includes(binCode) ? prev.filter(b => b !== binCode) : [...prev, binCode]
    );
  };

  // Select All
  const handleSelectAll = () => {
    if (selectedBins.length === bins.length) {
      setSelectedBins([]);
    } else {
      setSelectedBins(bins.map(b => b.bin_code));
    }
  };

  // Submit
  const submit = async () => {
    if (selectedBins.length === 0) {
      alert("กรุณาเลือกจุดเก็บขยะอย่างน้อย 1 จุด");
      return;
    }

    // 🟢 Payload ที่ถูกต้องตาม DTO เป๊ะๆ
    const payload = {
      created_by: "admin", // ✅ ต้องใส่! (DTO บังคับ)
      // assigned_to: null, // ตัดออกได้เลยถ้า DTO ไม่มี
      priority,
      notes,
      bin_ids: selectedBins, // ✅ ส่งเป็น Array ของ bin_code (String)
    };

    try {
      console.log("Sending Payload:", payload);
      await createTask(payload);
      alert("มอบหมายงานสำเร็จ!");
      router.push("/admin/tasks");
    } catch (e) {
      console.error("Create Task Error:", e);
      alert("เกิดข้อผิดพลาดในการสร้างงาน (ตรวจสอบ Console)");
    }
  };

  // Helper ดึงค่า % ความจุ
  const getFillLevel = (bin: any) => {
    if (typeof bin.fill_level === 'number') return bin.fill_level;
    if (bin.sensorRecords && bin.sensorRecords.length > 0) {
      return bin.sensorRecords[0].fill_percentage;
    }
    return 0;
  };

  return (
    <Layout title="สร้างงานใหม่">
      
      {/* 🟢 เพิ่มส่วนปุ่มย้อนกลับตรงนี้ */}
      <div className="mb-6">
        <button 
          onClick={() => router.push("/admin/tasks")} 
          className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          ย้อนกลับ
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 min-h-[85vh] relative">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-4 mb-8">
          <h1 className="text-2xl font-bold text-slate-800">มอบหมายงาน</h1>
        </div>

        <div className="space-y-8">
          
          {/* Bin Selection (Card UI) */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <label className="flex items-center gap-2 text-slate-700 font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                เลือกจุดเก็บขยะ
              </label>
              
              <div className="flex items-center gap-4 text-sm">
                <span className="text-emerald-600 font-medium">
                  เลือกแล้ว {selectedBins.length} จุด
                </span>
                <button 
                  onClick={handleSelectAll}
                  className="text-slate-400 hover:text-slate-600 transition-colors underline decoration-dotted"
                >
                  {selectedBins.length === bins.length && bins.length > 0 ? "ยกเลิกทั้งหมด" : "เลือกทั้งหมด"}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-10 text-slate-400">กำลังโหลดข้อมูล...</div>
            ) : bins.length === 0 ? (
              <div className="text-center py-10 text-slate-400 border-2 border-dashed rounded-xl">ไม่พบข้อมูลถังขยะ</div>
            ) : (
              /* Grid Cards */
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {bins.map((bin) => {
                  // 🟢 เช็คด้วย bin_code
                  const isSelected = selectedBins.includes(bin.bin_code);
                  const isError = bin.status === "offline" || bin.status === "maintenance" || bin.status === "error";
                  const fillLevel = getFillLevel(bin);

                  return (
                    <div
                      key={bin.id}
                      onClick={() => toggleBin(bin.bin_code)} // 🟢 ส่ง bin_code ไป toggle
                      className={`
                        relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col items-center justify-center h-28 shadow-sm select-none
                        ${isSelected 
                          ? "bg-emerald-300 border-emerald-400 shadow-emerald-100 transform scale-[1.02]" 
                          : "bg-white border-slate-100 hover:border-emerald-300 hover:shadow-md"
                        }
                        ${isError && !isSelected ? "border-orange-300 bg-orange-50" : ""}
                      `}
                    >
                      <span className={`text-xs font-medium mb-1.5 ${isSelected ? "text-emerald-900" : "text-slate-500"}`}>
                        {bin.bin_code}
                      </span>
                      
                      {isError ? (
                        <span className="text-orange-500 font-bold text-sm bg-white/50 px-2 py-0.5 rounded">
                          {bin.status === 'offline' ? 'Offline' : 'Error'}
                        </span>
                      ) : (
                        <span className={`text-xl font-bold ${isSelected ? "text-emerald-900" : "text-slate-700"}`}>
                          {fillLevel}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-12">
          <button
            onClick={submit}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            มอบหมายงาน
          </button>
        </div>

      </div>
    </Layout>
  );
}