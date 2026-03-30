import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Layout from "../../components/shared/Layout";
import ReportIssueModal from "../../components/citizen/ReportIssueModal"; 
import Swal from 'sweetalert2';
// ✅ 1. เพิ่ม useRouter และ fetchMyReports
import { useRouter } from "next/router";
import { createCitizenReport, fetchPublicBins, fetchMyReports } from "../../lib/api"; 

// Dynamic Import แผนที่
const CitizenMapLeaflet = dynamic(
  () => import('../../components/citizen/CitizenMapLeaflet'), 
  { ssr: false } 
);

export default function CitizenMap() {
  const router = useRouter(); // ✅ เรียกใช้ Router
  const [bins, setBins] = useState<any[]>([]); 
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedBin, setSelectedBin] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // โหลดข้อมูลถัง
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchPublicBins();
        if (Array.isArray(data) && data.length > 0) {
          setBins(data);
        } else {
          // Mock Data
          setBins([
             { id: 1, code: 'BIN-001', location: 'จุดตลาดสด', address_note: 'หน้าตลาดสดเทศบาล 1', lat: 13.7563, lng: 100.5018, status: 'Normal' },
             { id: 2, code: 'BIN-002', location: 'หน้าโรงเรียน', address_note: 'ประตู 2 โรงเรียนอนุบาล', lat: 13.7550, lng: 100.5050, status: 'Full' },
          ]);
        }
      } catch (error) {
        console.error("Load bins error:", error);
      }
    }
    loadData();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  }, []);

  // 🟢 แก้ไข: ฟังก์ชันกดเลือกถัง (เพิ่ม Logic เช็คการประเมิน)
  const handleOpenReport = async (bin: any) => {
    const deviceId = localStorage.getItem("device_uuid");

    // ถ้าเคยใช้งานแล้ว ลองเช็คประวัติก่อน
    if (deviceId) {
      try {
        const reports = await fetchMyReports(deviceId);
        
        // 🔍 ค้นหาว่ามีรายการไหนที่ "เสร็จแล้ว" แต่ "ยังไม่มี rating" ไหม?
        const unratedReport = reports.find((r: any) => r.status === 'resolved' && !r.rating);

        if (unratedReport) {
          // 🛑 เจอคนยังไม่จ่ายค่าผ่านทาง! เด้ง Popup ดักไว้
          Swal.fire({
            icon: 'warning',
            title: 'กรุณาประเมินความพึงพอใจก่อนแจ้งปัญหาใหม่',
            html: `
              <div class="text-slate-500 text-sm mt-2">
                คุณยังมีรายงานก่อนหน้าที่ยังไม่ได้ประเมิน<br/>
                เพื่อพัฒนาการให้บริการ กรุณาให้คะแนนก่อนนะคะ
              </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'ไปที่หน้าแบบประเมิน',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#15803d', // เขียวสวยๆ
            cancelButtonColor: '#cbd5e1', // เทาๆ
            reverseButtons: true, // สลับปุ่มให้ confirm อยู่ขวา
            customClass: {
              popup: 'rounded-[32px] font-kanit py-8',
              title: 'text-xl text-slate-800 font-bold',
              confirmButton: 'rounded-xl px-6 py-2 shadow-md',
              cancelButton: 'rounded-xl px-6 py-2 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50'
            }
          }).then((result) => {
            if (result.isConfirmed) {
              // 👉 พาไปหน้าประวัติ
              router.push('/citizen/my-reports');
            }
          });
          return; // ⛔ จบการทำงาน ไม่เปิด Modal แจ้งปัญหา
        }

      } catch (error) {
        console.error("Check history error", error);
        // ถ้าเช็คไม่ได้ (เช่น เน็ตหลุด) ก็หยวนๆ ให้เปิดไปก่อน หรือจะ Block ก็ได้แล้วแต่ design
      }
    }

    // ✅ ถ้าผ่านฉลุย ก็เปิด Modal ตามปกติ
    setSelectedBin(bin);
    setIsReportModalOpen(true);
  };

  // ฟังก์ชันส่งข้อมูล
  const handleSubmitReport = async (data: { issue_type: string, description: string }) => {
    setIsSubmitting(true);

    let deviceId = localStorage.getItem("device_uuid");
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem("device_uuid", deviceId);
    }

    try {
      const lat = selectedBin.latitude || selectedBin.lat;
      const lng = selectedBin.longitude || selectedBin.lng;

      const payload = {
        bin_id: selectedBin.id,
        issue_type: data.issue_type,
        description: data.description,
        device_uuid: deviceId,
        location_lat: lat,
        location_lng: lng,
      };

      await createCitizenReport(payload);

      setIsReportModalOpen(false);

      await Swal.fire({
        title: 'แจ้งปัญหาเรียบร้อย!',
        text: 'ขอบคุณที่ช่วยเป็นหูเป็นตาให้เราครับ',
        icon: 'success',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#10b981',
        background: '#fff',
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'rounded-3xl shadow-xl font-kanit',
          title: 'text-slate-800 font-bold',
          htmlContainer: 'text-slate-500'
        }
      });

    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: 'ส่งข้อมูลไม่สำเร็จ',
        text: 'เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง',
        icon: 'error',
        confirmButtonText: 'ปิด',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-3xl shadow-xl font-kanit',
          title: 'text-slate-800 font-bold',
          htmlContainer: 'text-slate-500'
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="เลือกถังขยะ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Citizen Map (แจ้งปัญหา)
          </h1>
          <p className="text-slate-500 text-sm ml-1">เลือกตำแหน่งถังขยะเพื่อแจ้งปัญหา</p>
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