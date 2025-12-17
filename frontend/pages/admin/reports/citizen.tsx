import React, { useEffect, useState } from "react";
import Layout from "../../../components/shared/Layout";

export default function AdminCitizenReports() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const [reports, setReports] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });

  useEffect(() => {
    // ดึงข้อมูลทั้งหมด (ไม่ต้องใส่ UUID)
    fetch(`${API_URL}/api/reports`)
      .then((res) => res.json())
      .then((data) => {
        if(Array.isArray(data)) {
          setReports(data);
          // คำนวณยอดสถิติ
          setStats({
            total: data.length,
            pending: data.filter((r:any) => r.status === 'pending').length,
            completed: data.filter((r:any) => r.status === 'completed').length
          });
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <Layout title="รายงานปัญหาจากประชาชน">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">📄 รายงานปัญหา (Citizen)</h1>
          <p className="text-slate-500">รายการแจ้งปัญหาที่ส่งมาจากแอปพลิเคชันประชาชน</p>
        </div>
        <button className="text-sm text-blue-600 font-bold hover:underline" onClick={() => window.location.reload()}>
           🔄 รีเฟรชข้อมูล
        </button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <span className="text-slate-500 text-sm font-bold mb-1 block">📝 ทั้งหมด</span>
           <span className="text-4xl font-black text-slate-800">{stats.total}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
           <span className="text-orange-600 text-sm font-bold mb-1 block">⏳ รอดำเนินการ</span>
           <span className="text-4xl font-black text-orange-600">{stats.pending}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
           <span className="text-emerald-600 text-sm font-bold mb-1 block">✅ เสร็จสิ้น</span>
           <span className="text-4xl font-black text-emerald-600">{stats.completed}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-bold whitespace-nowrap">เวลาที่แจ้ง</th>
                <th className="p-4 font-bold whitespace-nowrap">รหัสถัง</th>
                <th className="p-4 font-bold">ปัญหาที่พบ</th>
                <th className="p-4 font-bold">รายละเอียด</th>
                <th className="p-4 font-bold text-center">สถานะ</th>
                <th className="p-4 font-bold text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-400">ยังไม่มีรายงานเข้ามา</td>
                </tr>
              ) : (
                reports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors text-sm text-slate-700">
                    <td className="p-4 whitespace-nowrap text-slate-500">
                      <div className="font-bold text-slate-700">{new Date(r.created_at || Date.now()).toLocaleDateString('th-TH')}</div>
                      <div className="text-xs">{new Date(r.created_at || Date.now()).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})}</div>
                    </td>
                    <td className="p-4">
                       <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-xs border border-indigo-100">
                         {r.bin_code || "N/A"}
                       </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[250px]">
                        {Array.isArray(r.issues) ? r.issues.map((issue:string, i:number) => (
                           <span key={i} className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-100 font-medium">{issue}</span>
                        )) : r.issues}
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 max-w-[200px] truncate" title={r.description}>
                      {r.description || "-"}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block w-[100px] text-center
                        ${r.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}
                      `}>
                        {r.status === 'completed' ? 'เสร็จสิ้น' : 'รอดำเนินการ'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                       <button 
                         className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg font-bold transition-colors border border-transparent hover:border-blue-100"
                         onClick={() => alert(`ส่วนนี้ต้องเชื่อมกับ API อัปเดตสถานะ Report ID: ${r.id}`)}
                       >
                         เปลี่ยนสถานะ
                       </button>
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