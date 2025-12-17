import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout";
import Link from "next/link";

export default function MyReports() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ดึง Device ID จากเครื่อง
    const deviceId = localStorage.getItem("device_uuid");
    
    if (deviceId) {
      // ดึงรายงานเฉพาะของเครื่องนี้
      fetch(`${API_URL}/api/reports?device_uuid=${deviceId}`)
        .then((res) => res.json())
        .then((data) => {
           if(Array.isArray(data)) setReports(data);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false); // ถ้าไม่มี ID แสดงว่ายังไม่เคยแจ้ง
    }
  }, []);

  // แปลงสถานะเป็นป้ายสวยๆ
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed': return <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">✅ แก้ไขแล้ว</span>;
      case 'in_progress': return <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">🛠️ กำลังดำเนินการ</span>;
      default: return <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">⏳ รอดำเนินการ</span>;
    }
  };

  return (
    <Layout title="ประวัติการแจ้งปัญหา">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/citizen" legacyBehavior>
           <a className="p-2 bg-white rounded-full border border-slate-200 shadow-sm text-slate-500 hover:bg-slate-50 transition-colors">←</a>
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">ประวัติการแจ้งปัญหา</h1>
      </div>

      {loading ? (
        <div className="text-center p-10 text-slate-400">กำลังโหลดข้อมูล...</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 mx-4">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-slate-400 mb-4">คุณยังไม่เคยแจ้งปัญหา</p>
          <Link href="/citizen/map" legacyBehavior>
            <a className="text-indigo-600 font-bold hover:underline bg-indigo-50 px-4 py-2 rounded-lg">ไปที่แผนที่เพื่อแจ้งปัญหา</a>
          </Link>
        </div>
      ) : (
        <div className="space-y-4 px-1 pb-20">
          {reports.map((report) => (
            <div key={report.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-3 border-b border-slate-50 pb-3">
                <div>
                   <div className="flex items-center gap-2">
                     <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded">
                       {report.bin_code || "ไม่ระบุรหัส"}
                     </span>
                     <span className="text-xs text-slate-400">
                       {new Date(report.created_at || Date.now()).toLocaleDateString('th-TH')}
                     </span>
                   </div>
                </div>
                {getStatusBadge(report.status)}
              </div>
              
              <div className="mb-3">
                 <p className="text-sm font-bold text-slate-700 mb-2">ปัญหาที่พบ:</p>
                 <div className="flex flex-wrap gap-2">
                   {/* รองรับข้อมูลทั้งแบบ Array และ String */}
                   {Array.isArray(report.issues) ? report.issues.map((issue:string, i:number) => (
                      <span key={i} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-lg border border-red-100 font-medium">
                        {issue}
                      </span>
                   )) : <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-lg border border-red-100 font-medium">{report.issues}</span>}
                 </div>
              </div>

              {report.description && (
                <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                  "{report.description}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}