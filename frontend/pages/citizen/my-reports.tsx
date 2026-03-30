import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout";
import Link from "next/link";
import { fetchMyReports, deleteCitizenReport, submitReportRating } from "../../lib/api"; 
import Swal from 'sweetalert2';

export default function MyReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    const deviceId = localStorage.getItem("device_uuid");
    if (deviceId) {
      setLoading(true);
      fetchMyReports(deviceId)
        .then((data) => {
           if(Array.isArray(data)) setReports(data);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🟢 ฟังก์ชันเปิด Popup ประเมินความพึงพอใจ
  const handleOpenRatingModal = (reportId: string) => {
    Swal.fire({
      title: 'แบบประเมินความพึงพอใจ',
      html: `
        <div class="flex justify-around my-8">
          <button id="rate-1" class="flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-all">
            <span class="text-5xl">😫</span>
            <span class="text-sm font-bold text-slate-500">แย่</span>
          </button>
          <button id="rate-2" class="flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-all">
            <span class="text-5xl">😐</span>
            <span class="text-sm font-bold text-slate-500">พอใช้</span>
          </button>
          <button id="rate-3" class="flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-all">
            <span class="text-5xl">😍</span>
            <span class="text-sm font-bold text-slate-500">ดีมาก</span>
          </button>
        </div>
        <div class="text-left mb-2 ml-1 font-bold text-slate-700">ข้อเสนอแนะเพิ่มเติม :</div>
        <textarea id="rating-comment" class="w-full p-4 border border-slate-200 rounded-[20px] font-kanit focus:ring-2 focus:ring-emerald-500 outline-none" rows="3" placeholder="เขียนความเห็นของคุณที่นี่..."></textarea>
      `,
      showConfirmButton: true,
      confirmButtonText: 'ส่งผลประเมิน',
      confirmButtonColor: '#15803d', 
      customClass: { popup: 'rounded-[32px] font-kanit p-8' },
      didOpen: () => {
        let selectedRating = 0;
        const btns = [
          document.getElementById('rate-1'),
          document.getElementById('rate-2'),
          document.getElementById('rate-3')
        ];
        
        btns.forEach((btn, index) => {
          btn?.addEventListener('click', () => {
            selectedRating = index + 1;
            btns.forEach((b, i) => b!.style.opacity = (i === index) ? '1' : '0.2');
          });
        });

        (window as any).getCurrentRating = () => selectedRating;
      },
      preConfirm: () => {
        const rating = (window as any).getCurrentRating();
        const comment = (document.getElementById('rating-comment') as HTMLTextAreaElement).value;
        if (!rating) {
          Swal.showValidationMessage('กรุณาเลือกความพึงพอใจก่อนส่ง');
          return false;
        }
        return { rating, comment };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const device_uuid = localStorage.getItem("device_uuid") || "";
          await submitReportRating(reportId, { ...result.value, device_uuid });
          Swal.fire({
            icon: 'success',
            title: 'ขอบคุณที่ประเมิน!',
            timer: 2000,
            showConfirmButton: false,
            customClass: { popup: 'rounded-[24px]' }
          });
          loadData(); 
        } catch (error) {
          Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถส่งผลประเมินได้', 'error');
        }
      }
    });
  };

  const handleDelete = async (report: any) => {
    if (report.status === 'resolved' && !report.rating) {
      handleOpenRatingModal(report.id);
      return;
    }

    const result = await Swal.fire({
      title: 'ยืนยันการลบ?',
      text: "ข้อมูลนี้จะถูกลบออกอย่างถาวร",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'ลบข้อมูล',
      cancelButtonText: 'ยกเลิก',
      customClass: { popup: 'rounded-[32px] font-kanit' }
    });

    if (result.isConfirmed) {
      try {
        await deleteCitizenReport(report.id); 
        setReports(prev => prev.filter(r => r.id !== report.id));
        Swal.fire({ title: 'ลบสำเร็จ', icon: 'success', timer: 1500, showConfirmButton: false });
      } catch (error) {
        Swal.fire('Error', 'ไม่สามารถลบได้', 'error');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'resolved') return <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">✅ เสร็จสิ้น</span>;
    if (s === 'in_progress') return <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">🛠️ ดำเนินการ</span>;
    return <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">⏳ รอรับเรื่อง</span>;
  };

  // ✅ แก้ไขตรงนี้: เพิ่มคำแปลให้ครบทุกประเภท
  const getIssueLabel = (key: string) => {
    const map: Record<string, string> = {
      full: "🗑️ ขยะล้นถัง", 
      broken: "🛠️ ถังชำรุด", 
      smell: "🤢 ส่งกลิ่นเหม็น",
      dirty: "💩 สกปรกเลอะเทอะ", 
      blocked: "🚧 มีสิ่งกีดขวาง",
      sensor_error: "⚠️ เซ็นเซอร์เสีย",
      location_wrong: "📍 ตำแหน่งผิด", // เพิ่มอันนี้
      vandalized: "🔨 ถูกทำลาย",
      others: "📝 อื่นๆ"
    };
    return map[key] || key;
  };

  const getRatingEmoji = (rating: number) => {
    if (rating === 1) return "😫";
    if (rating === 2) return "😐";
    return "😍";
  };

  return (
    <Layout title="ประวัติการแจ้ง">
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-3">
          <Link href="/citizen" className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm text-slate-400">←</Link>
          <h1 className="text-xl font-bold text-slate-800">ประวัติการแจ้ง</h1>
        </div>
        <button onClick={loadData} className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-xl">🔄 รีเฟรช</button>
      </div>

      {loading ? (
        <div className="text-center p-20 text-slate-400 font-kanit">กำลังโหลด...</div>
      ) : (
        <div className="space-y-4 px-1 pb-24">
          {reports.map((report) => (
            <div key={report.id} className="bg-white p-5 rounded-[28px] shadow-sm border border-slate-50 relative">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl">📄</div>
                  <div>
                    <div className="text-base font-black text-slate-800 leading-tight">
                      {report.bin?.address_note || "จุดติดตั้งทั่วไป"}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {new Date(report.created_at).toLocaleDateString('th-TH')}
                    </div>
                  </div>
                </div>

                {report.status !== 'resolved' && (
                  <button onClick={() => handleDelete(report)} className="w-8 h-8 bg-red-50 text-red-400 rounded-full flex items-center justify-center hover:bg-red-100 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {getStatusBadge(report.status)}
                
                {report.status === 'resolved' && (
                  !report.rating ? (
                    <button 
                      onClick={() => handleOpenRatingModal(report.id)}
                      className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md shadow-emerald-100 animate-pulse hover:scale-105 transition-transform"
                    >
                      ⭐ คลิกเพื่อประเมิน
                    </button>
                  ) : (
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold border border-slate-200 flex items-center gap-1">
                       ✅ ประเมินแล้ว <span className="text-base leading-none">{getRatingEmoji(report.rating)}</span>
                    </span>
                  )
                )}

                <span className="bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-100">
                  {getIssueLabel(report.issue_type)}
                </span>
              </div>
              
              <p className="text-sm text-slate-500 line-clamp-2 bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                {report.description || "ไม่มีรายละเอียดเพิ่มเติม"}
              </p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}