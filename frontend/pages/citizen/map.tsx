import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Layout from "../../components/shared/Layout";
import ReportIssueModal from "../../components/citizen/ReportIssueModal";

// โหลด Map แบบ Dynamic (แก้ Error window is not defined)
const CitizenMapLeaflet = dynamic(
  () => import('../../components/citizen/CitizenMapLeaflet'), 
  { ssr: false } 
);

export default function CitizenMap() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const [bins, setBins] = useState<any[]>([]); 
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // State ควบคุม Modal และการส่งข้อมูล
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedBin, setSelectedBin] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ดึงข้อมูลถังขยะ
  async function loadBins() {
    try {
      const res = await fetch(`${API_URL}/api/bins/public`);
      const data = await res.json();
      
      if (!Array.isArray(data) || data.length === 0) {
         // Mock Data กรณี API ยังไม่พร้อม
         setBins([
            { id: 1, code: 'BIN-001', location: 'จุดตลาดสด', address_note: 'หน้าตลาดสดเทศบาล 1', lat: 13.7563, lng: 100.5018, status: 'Normal' },
            { id: 2, code: 'BIN-002', location: 'หน้าโรงเรียน', address_note: 'ประตู 2 โรงเรียนอนุบาล', lat: 13.7550, lng: 100.5050, status: 'Full' },
            { id: 3, code: 'BIN-003', location: 'สวนสาธารณะ', address_note: 'ศาลาริมน้ำ', lat: 13.7580, lng: 100.5030, status: 'Normal' },
         ]);
      } else {
         setBins(data);
      }
    } catch (error) {
      console.error("Failed to load bins", error);
    }
  }

  useEffect(() => {
    loadBins();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  }, []);

  // เปิด Modal เมื่อกดที่ถัง
  const handleOpenReport = (bin: any) => {
    setSelectedBin(bin);
    setIsReportModalOpen(true);
  };

  // 🟢 ฟังก์ชันส่งข้อมูลเข้า API จริง
  const handleSubmitReport = async (issues: string[], note: string) => {
    setIsSubmitting(true);

    // 1. ตรวจสอบ/สร้าง Device ID (เพื่อระบุตัวตนคนแจ้ง โดยไม่ต้อง Login)
    let deviceId = localStorage.getItem("device_uuid");
    if (!deviceId) {
      deviceId = crypto.randomUUID(); // สร้างรหัสสุ่มใหม่
      localStorage.setItem("device_uuid", deviceId);
    }

    try {
      // 2. ยิง API ส่งข้อมูล
      const response = await fetch(`${API_URL}/api/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bin_id: selectedBin.id,
          bin_code: selectedBin.code,
          issues: issues,              // ส่ง array ปัญหาที่เลือก ["เหม็น", "เต็ม"]
          description: note,           // รายละเอียดเพิ่มเติม
          location: { lat: selectedBin.lat, lng: selectedBin.lng },
          device_uuid: deviceId,       // 🔑 กุญแจสำคัญสำหรับดูประวัติ
          status: "pending"            // สถานะเริ่มต้น
        }),
      });

      if (response.ok) {
        alert("✅ ส่งเรื่องแจ้งปัญหาเรียบร้อยแล้ว! เจ้าหน้าที่จะรีบตรวจสอบครับ");
        setIsReportModalOpen(false);
      } else {
        alert("❌ เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่");
      }

    } catch (error) {
      console.error("Error submitting report:", error);
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="เลือกถังขยะ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
            </svg>
            Citizen Map (แจ้งปัญหา)
          </h1>
          <p className="text-slate-500 text-sm ml-10">เลือกตำแหน่งถังขยะเพื่อแจ้งปัญหา</p>
        </div>
      </div>
      
      <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative z-0 h-[70vh]">
        <CitizenMapLeaflet 
           userLocation={userLocation}
           bins={bins}
           onReportClick={handleOpenReport} 
        />
      </div>

      <ReportIssueModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleSubmitReport}
        binData={selectedBin}
        loading={isSubmitting}
      />
    </Layout>
  );
}