import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../components/shared/Layout";
import { getTasks, deleteTask } from "../../lib/api"; // ✅ นำเข้า deleteTask มาใช้

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูล
  async function load() {
    try {
      const t = await getTasks();
      setTasks(t || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // 🟢 ฟังก์ชันลบงาน
  const handleDelete = async (id: string) => {
    if (!confirm("⚠️ คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้?\nการกระทำนี้ไม่สามารถย้อนกลับได้")) return;

    try {
      await deleteTask(id);
      alert("ลบงานเรียบร้อยแล้ว");
      load(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Delete failed", error);
      alert("เกิดข้อผิดพลาดในการลบงาน (ตรวจสอบว่า Backend มี API Delete หรือยัง)");
    }
  };

  // คำนวณสถิติ
  const stats = {
    total: tasks.length,
    inProgress: tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('th-TH', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const renderStatusBadge = (status: string) => {
    if (status === 'completed') {
      return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200">เสร็จสิ้นแล้ว</span>;
    } else {
      return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200">กำลังดำเนินการ</span>;
    }
  };

  return (
    <Layout title="มอบหมายงาน">
      <div className="min-h-screen pb-20">
        
        <h1 className="text-3xl font-bold text-slate-800 mb-6">มอบหมายงาน</h1>

        {/* Cards Section */}
        <div className="flex flex-col xl:flex-row gap-6 mb-10 items-start">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
              <div className="flex justify-between items-start">
                <span className="text-slate-500 font-medium text-sm">งานทั้งหมด</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/></svg>
              </div>
              <span className="text-3xl font-bold text-slate-800">{stats.total}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
              <div className="flex justify-between items-start">
                <span className="text-slate-500 font-medium text-sm">กำลังดำเนินการ</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg>
              </div>
              <span className="text-3xl font-bold text-blue-600">{stats.inProgress}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
              <div className="flex justify-between items-start">
                <span className="text-slate-500 font-medium text-sm">เสร็จสิ้นแล้ว</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              </div>
              <span className="text-3xl font-bold text-emerald-600">{stats.completed}</span>
            </div>
          </div>

          <div className="flex justify-end xl:w-auto mt-2 xl:mt-0">
            <Link href="/admin/create-task" legacyBehavior>
              <a className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-bold shadow-md transition-all hover:-translate-y-0.5 whitespace-nowrap">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                 สร้างงานใหม่
              </a>
            </Link>
          </div>
        </div>

        {/* Task Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                  <th className="p-5 font-semibold">ชื่องาน</th>
                  <th className="p-5 font-semibold text-center">สถานะ</th>
                  <th className="p-5 font-semibold text-center">จำนวนถัง</th>
                  <th className="p-5 font-semibold text-right">วันที่สร้าง</th>
                  <th className="p-5 font-semibold text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {tasks.length > 0 ? (
                  tasks.map((t, index) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="p-5 font-medium text-slate-900">
                        {t.title || `งานที่ ${tasks.length - index}`}
                      </td>
                      <td className="p-5 text-center">{renderStatusBadge(t.status)}</td>
                      <td className="p-5 text-center">{(t.items || []).length} จุด</td>
                      <td className="p-5 text-right text-slate-500">{formatDate(t.created_at)}</td>
                      
                      {/* 🟢 ส่วนปุ่มจัดการ: เพิ่มปุ่มลบ */}
                      <td className="p-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          
                          {/* ปุ่มดูรายละเอียด */}
                          <Link href={`/admin/tasks/${t.id}`} legacyBehavior>
                            <a className="inline-flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors border border-indigo-100">
                              ดูรายละเอียด
                            </a>
                          </Link>

                          {/* 🟢 ปุ่มลบ (Trash Icon) */}
                          <button 
                            onClick={() => handleDelete(t.id)}
                            className="inline-flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-lg transition-colors border border-red-100"
                            title="ลบงานนี้"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      {loading ? "กำลังโหลด..." : "ยังไม่มีรายการงานในระบบ"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
}