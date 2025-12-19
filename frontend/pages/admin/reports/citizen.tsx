import React, { useEffect, useState } from 'react';
import Layout from '../../../components/shared/Layout';
import { fetchCitizenReports, updateCitizenReportStatus } from '../../../lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminCitizenReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูล
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchCitizenReports();
      setReports(data || []);
    } catch (err) {
      console.error(err);
      toast.error("โหลดข้อมูลล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ฟังก์ชันเปลี่ยนสถานะ
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateCitizenReportStatus(id, newStatus);
      toast.success("อัปเดตสถานะเรียบร้อย");
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  // ตัวช่วยแปลภาษาประเภทปัญหา
  const getIssueLabel = (key: string) => {
    const map: any = { 
      full: "ขยะล้นถัง", 
      broken: "ถังชำรุด", 
      smell: "ส่งกลิ่นเหม็น", 
      dirty: "สกปรกเลอะเทอะ",
      blocked: "มีสิ่งกีดขวาง", 
      sensor_error: "เซ็นเซอร์เสีย", 
      location_wrong: "ตำแหน่งผิด",
      vandalized: "ถูกทำลาย",
      others: "อื่นๆ" 
    };
    return map[key] || key;
  };

  // ✅ [ใหม่] ฟังก์ชันแสดงหน้ายิ้มตามคะแนน
  const getRatingDisplay = (rating: number | null, feedback: string | null) => {
    if (!rating) return <span className="text-slate-300 text-sm">-</span>; // ถ้าไม่มีคะแนน

    let emoji = "";
    let label = "";
    let styleClass = "";

    switch (rating) {
      case 1:
        emoji = "😫"; // หน้าบึ้ง
        label = "แย่/ปรับปรุง";
        styleClass = "bg-red-50 text-red-700 border-red-200";
        break;
      case 2:
        emoji = "😐"; // หน้าเฉย
        label = "พอใช้";
        styleClass = "bg-orange-50 text-orange-700 border-orange-200";
        break;
      case 3:
        emoji = "😍"; // หน้าตายิ้ม
        label = "ดีมาก";
        styleClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
        break;
      default:
        return <span>{rating}</span>;
    }

    return (
      <div className="flex flex-col gap-1 items-start">
        {/* ป้ายแสดงอารมณ์ */}
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-bold ${styleClass}`}>
          <span className="text-base">{emoji}</span>
          <span>{label}</span>
        </div>
        {/* แสดงข้อความ Feedback ถ้ามี */}
        {feedback && (
          <span className="text-[11px] text-slate-500 italic max-w-[150px] leading-tight">
            "{feedback}"
          </span>
        )}
      </div>
    );
  };

  // คำนวณสถิติ
  const stats = {
    total: reports.length,
    open: reports.filter(r => r.status === 'open' || r.status === 'in_progress').length,
    resolved: reports.filter(r => r.status === 'resolved').length
  };

  return (
    <Layout title="รายงานปัญหา (Citizen)">
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          className: '',
          style: {
            borderRadius: '16px',
            background: '#333',
            color: '#fff',
            padding: '12px 20px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            style: {
              background: '#ECFDF5',
              color: '#065F46',
              border: '1px solid #A7F3D0',
            },
            iconTheme: {
              primary: '#10B981',
              secondary: '#ECFDF5',
            },
            duration: 3000, 
          },
          error: {
             style: {
               background: '#FEF2F2',
               color: '#991B1B',
               border: '1px solid #FECaca',
             },
          }
        }}
      />
      
      {/* --- Header --- */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            รายงานปัญหา (Citizen)
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1 ml-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            แจ้งโดยประชาชน
          </div>
        </div>
        <button onClick={loadData} className="text-indigo-600 font-bold text-sm hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
           รีเฟรช
        </button>
      </div>

      {/* --- Stat Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="รายงานทั้งหมด" value={stats.total} color="blue" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />} />
        <StatCard label="รอดำเนินการ" value={stats.open} color="orange" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />} />
        <StatCard label="เสร็จสิ้น" value={stats.resolved} color="green" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />} />
      </div>

      {/* --- Table --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-slate-100 text-slate-500">
              <tr>
                <th className="py-4 px-6 font-medium">รหัสถัง</th>
                <th className="py-4 px-6 font-medium">สถานที่ / รายละเอียด</th>
                <th className="py-4 px-6 font-medium">ปัญหาที่พบ</th>
                <th className="py-4 px-6 font-medium">เวลา / วันที่</th>
                {/* ✅ เพิ่ม Column ความพึงพอใจ */}
                <th className="py-4 px-6 font-medium">ความพึงพอใจ</th> 
                <th className="py-4 px-6 font-medium text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {loading ? (
                <tr><td colSpan={6} className="py-10 text-center text-slate-400">กำลังโหลดข้อมูล...</td></tr>
              ) : reports.length === 0 ? (
                <tr><td colSpan={6} className="py-10 text-center text-slate-400">ไม่พบรายงานแจ้งปัญหา</td></tr>
              ) : (
                reports.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    {/* รหัสถัง */}
                    <td className="py-4 px-6 font-medium text-indigo-600 align-top pt-5">
                      {item.bin?.bin_code || item.bin_id || "-"}
                    </td>

                    {/* รายละเอียดสถานที่ */}
                    <td className="py-4 px-6 align-top">
                      <div className="flex flex-col">
                        <span className="text-slate-800 font-bold">
                          {item.bin?.area || item.bin?.zone || "ไม่ระบุโซน"}
                        </span>
                        <span className="text-slate-500 text-xs mt-0.5 line-clamp-2">
                          {item.bin?.description || item.bin?.address_note || item.description || "-"}
                        </span>
                      </div>
                    </td>

                    {/* ปัญหาที่พบ */}
                    <td className="py-4 px-6 align-top pt-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded-md w-fit text-xs border border-red-100">
                          {getIssueLabel(item.issue_type)}
                        </span>
                        {item.description && (
                           <span className="text-xs text-slate-400 italic">"{item.description}"</span>
                        )}
                      </div>
                    </td>

                    {/* เวลา */}
                    <td className="py-4 px-6 text-slate-500 align-top pt-5">
                      <div className="flex flex-col">
                        <span>{new Date(item.created_at).toLocaleDateString('th-TH', { dateStyle: 'medium' })}</span>
                        <span className="text-xs text-slate-400">{new Date(item.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.</span>
                      </div>
                    </td>

                    {/* ✅ แสดงคะแนนความพึงพอใจ */}
                    <td className="py-4 px-6 align-top pt-5">
                       {getRatingDisplay(item.rating, item.feedback)}
                    </td>

                    {/* Dropdown สถานะ */}
                    <td className="py-4 px-6 text-center align-top pt-4">
                      <select 
                        value={item.status === 'in_progress' ? 'open' : item.status} 
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border outline-none cursor-pointer transition-all appearance-none min-w-[120px] text-center
                          ${(item.status === 'open' || item.status === 'in_progress') ? 'bg-orange-50 text-orange-600 border-orange-200' : 
                            'bg-emerald-50 text-emerald-600 border-emerald-200'}`}
                      >
                        <option value="open">รอดำเนินการ</option>
                        <option value="resolved">เสร็จสิ้น</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

// --- Component ย่อยสำหรับ Card ---
function StatCard({ label, value, color, icon }: any) {
  const colors: any = {
    red: "text-red-500 bg-red-50",
    blue: "text-blue-500 bg-blue-50",
    green: "text-emerald-500 bg-emerald-50",
    orange: "text-orange-500 bg-orange-50"
  };
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
      <div className={`flex items-center gap-2 text-sm font-bold ${colors[color].split(" ")[0]}`}>
         <div className={`w-6 h-6 rounded-full flex items-center justify-center ${colors[color].split(" ")[1]}`}>
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             {icon}
           </svg>
         </div>
         {label}
      </div>
      <span className="text-3xl font-bold text-slate-800">{value}</span>
    </div>
  );
}