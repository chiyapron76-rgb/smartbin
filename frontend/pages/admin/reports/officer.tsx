import React, { useEffect, useState } from 'react';
import Layout from '../../../components/shared/Layout';
// Import API สำหรับเจ้าหน้าที่
import { fetchIssues, updateIssueStatus } from '../../../lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function OfficerReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูล
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchIssues();
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
      await updateIssueStatus(id, newStatus);
      toast.success("อัปเดตสถานะเรียบร้อย");
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  // ตัวช่วยแปลภาษา (เหมือนหน้า Citizen)
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

  // สถิติ
  const stats = {
    total: reports.length,
    open: reports.filter(r => r.status === 'open').length,
    resolved: reports.filter(r => r.status === 'resolved').length
  };

  return (
    <Layout title="รายงานปัญหา (Officer)">
      {/* แทนที่ <Toaster ... /> เดิมด้วยอันนี้ครับ */}
<Toaster
  position="top-center" // ย้ายมาตรงกลางบน จะดูเด่นขึ้น
  reverseOrder={false}
  gutter={8} // ระยะห่างระหว่างการแจ้งเตือน
  toastOptions={{
    // กำหนดสไตล์พื้นฐาน
    className: '',
    style: {
      borderRadius: '16px', // ขอบมนสวย
      background: '#333',
      color: '#fff',
      padding: '12px 20px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // เงานุ่มๆ
      fontSize: '14px',
      fontWeight: '500',
    },
    // ✅ สไตล์เฉพาะสำหรับ "สถานะสำเร็จ" (สีเขียวสวยๆ)
    success: {
      style: {
        background: '#ECFDF5', // พื้นหลังเขียวอ่อน (emerald-50)
        color: '#065F46',      // ตัวหนังสือเขียวเข้ม (emerald-800)
        border: '1px solid #A7F3D0', // ขอบเขียว (emerald-200)
      },
      iconTheme: {
        primary: '#10B981', // วงกลมสีเขียว (emerald-500)
        secondary: '#ECFDF5', // เครื่องหมายถูกสีขาว/อ่อน
      },
      // เพิ่มระยะเวลาโชว์ให้นานขึ้นนิดนึง
      duration: 3000, 
    },
    // ❌ สไตล์สำหรับ "สถานะ error" (เผื่อไว้)
    error: {
       style: {
         background: '#FEF2F2', // แดงอ่อน
         color: '#991B1B',      // แดงเข้ม
         border: '1px solid #FECaca',
       },
    }
  }}
/>
      
      {/* --- Header สวยๆ --- */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            รายงานปัญหา (Officer)
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1 ml-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            แจ้งโดยเจ้าหน้าที่
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

      {/* --- Table Layout ใหม่ --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-slate-100 text-slate-500">
              <tr>
                <th className="py-4 px-6 font-medium">รหัสถัง</th>
                <th className="py-4 px-6 font-medium">สถานที่ / จุดสังเกต</th>
                <th className="py-4 px-6 font-medium">ปัญหาที่พบ</th>
                <th className="py-4 px-6 font-medium">เวลา / วันที่</th>
                <th className="py-4 px-6 font-medium text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {loading ? (
                <tr><td colSpan={5} className="py-10 text-center text-slate-400">กำลังโหลดข้อมูล...</td></tr>
              ) : reports.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-slate-400">ไม่พบรายงานแจ้งปัญหา</td></tr>
              ) : (
                reports.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    {/* รหัสถัง */}
                    <td className="py-4 px-6 font-medium text-indigo-600 align-top pt-5">
                      {item.bin?.bin_code || item.bin_id}
                    </td>

                    {/* รายละเอียดสถานที่ */}
                    <td className="py-4 px-6 align-top">
                      <div className="flex flex-col">
                        <span className="text-slate-800 font-bold">
                          {item.bin?.area || item.bin?.zone || "ไม่ระบุโซน"}
                        </span>
                        <span className="text-slate-500 text-xs mt-0.5 line-clamp-2">
                          {item.bin?.description || item.bin?.address_note || item.description || "ไม่มีรายละเอียดเพิ่มเติม"}
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

                    {/* วันเวลา */}
                    <td className="py-4 px-6 text-slate-500 align-top pt-5">
                      <div className="flex flex-col">
                        <span>{new Date(item.created_at).toLocaleDateString('th-TH', { dateStyle: 'medium' })}</span>
                        <span className="text-xs text-slate-400">{new Date(item.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.</span>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-6 text-center align-top pt-4">
                      <select 
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border outline-none cursor-pointer transition-all appearance-none min-w-[120px] text-center
                          ${item.status === 'open' ? 'bg-orange-50 text-orange-600 border-orange-200' : 
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

// Reuse Component Card
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