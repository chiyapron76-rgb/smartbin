import React, { useEffect, useState } from 'react';
import Layout from '../../../components/shared/Layout';
import { fetchIssues, updateIssueStatus } from '../../../lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function OfficerReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateIssueStatus(id, newStatus);
      toast.success("อัปเดตสถานะเรียบร้อย");
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const stats = {
    total: reports.length,
    // 🟢 เปลี่ยนจาก inProgress เป็น open (รอดำเนินการ)
    open: reports.filter(r => r.status === 'open').length,
    resolved: reports.filter(r => r.status === 'resolved').length
  };

  return (
    <Layout title="รายงานปัญหา (เจ้าหน้าที่)">
      <Toaster position="top-right" />
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          รายงานปัญหา
        </h1>
        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1 ml-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
          เจ้าหน้าที่
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="รายงานปัญหาทั้งหมด" value={stats.total} color="blue" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />} />
        {/* 🟢 การ์ดตรงกลาง: โชว์ยอดที่ "รอทำ" */}
        <StatCard label="รอดำเนินการ" value={stats.open} color="orange" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />} />
        <StatCard label="เสร็จสิ้น" value={stats.resolved} color="green" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />} />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-slate-100 text-slate-500">
              <tr>
                <th className="py-4 px-6 font-medium">ชื่อถัง</th>
                <th className="py-4 px-6 font-medium">ชื่อสถานที่ตั้ง / จุดสังเกต</th>
                <th className="py-4 px-6 font-medium">รายละเอียดปัญหา</th>
                <th className="py-4 px-6 font-medium">เวลา / วันที่</th>
                <th className="py-4 px-6 font-medium text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {loading ? (
                <tr><td colSpan={5} className="py-10 text-center text-slate-400">กำลังโหลดข้อมูล...</td></tr>
              ) : reports.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-slate-400">ไม่พบข้อมูลรายงาน</td></tr>
              ) : (
                reports.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-900 align-top pt-5">
                      {item.bin?.bin_code || item.bin_id}
                    </td>
                    <td className="py-4 px-6 align-top">
                      <div className="flex flex-col">
                        <span className="text-slate-800 font-bold">
                          {item.bin?.area || item.bin?.zone || "-"}
                        </span>
                        <span className="text-slate-500 text-xs mt-0.5">
                          {item.bin?.description || item.bin?.address_note || "ไม่มีรายละเอียดเพิ่มเติม"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 align-top pt-5">
                      <span className="text-red-500 font-medium bg-red-50 px-2 py-1 rounded-md">
                        {item.description || item.issue_type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 align-top pt-5">
                      {new Date(item.created_at).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="py-4 px-6 text-center align-top pt-4">
                      {/* 🟢 เหลือแค่ 2 ตัวเลือก */}
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