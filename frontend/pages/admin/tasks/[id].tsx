import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../../components/shared/Layout";
import TaskItemRow from "../../../components/tasks/TaskItemRow"; 
import ReportIssueModal from "../../../components/tasks/ReportIssueModal"; 
import {
  getTask,
  getTasks,
  completeTaskItem,
  reportIssue,
  startTask,
  completeTask,
} from "../../../lib/api";
import toast, { Toaster } from 'react-hot-toast';

export default function AdminTaskDetail() {
  const router = useRouter();
  const { id } = router.query;
  const taskId = Array.isArray(id) ? id[0] : id || "";

  const [task, setTask] = useState<any | null>(null);
  const [displayTitle, setDisplayTitle] = useState(""); 
  
  // State สำหรับ Modal
  const [issueData, setIssueData] = useState<{ itemId: string; binId: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // โหลดข้อมูล
  async function load() {
    if (!taskId) return;
    try {
      const t = await getTask(taskId);
      setTask(t);

      if (!t.title) {
        const allTasks = await getTasks();
        const index = allTasks.findIndex((item: any) => item.id === t.id);
        if (index !== -1) {
          const sequence = allTasks.length - index;
          setDisplayTitle(`งานที่ ${sequence}`);
        } else {
          setDisplayTitle("รายละเอียดงาน");
        }
      } else {
        setDisplayTitle(t.title); 
      }

    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    load();
  }, [taskId]);

  // หาข้อมูล Item ที่เลือก
  const getSelectedBinInfo = () => {
    if (!task || !issueData) return null;
    return task.items?.find((it: any) => it.id === issueData.itemId);
  };
  const selectedItem = getSelectedBinInfo();

  // 🟢 แก้ไขฟังก์ชันส่งรายงาน ให้รับ object
  const handleSubmitIssue = async (data: { issue_type: string, description: string }) => {
    if (!issueData) return;

    setSubmitting(true);
    try {
      // ส่งข้อมูลไป API (ส่งทั้ง bin_id, issue_type, และ description)
      await reportIssue(issueData.itemId, {
        bin_id: issueData.binId,
        issue_type: data.issue_type,   // ✅ ส่งประเภทปัญหาที่เลือกจาก Modal
        description: data.description, // ✅ ส่งรายละเอียด
      });
      
      toast.success("รายงานปัญหาเรียบร้อย");
      setIssueData(null); // ปิด Modal
      await load(); // โหลดข้อมูลใหม่

    } catch (error: any) {
      console.error(error);
      // แสดง Error message จาก Backend ถ้ามี
      const msg = error.message || "เกิดข้อผิดพลาดในการรายงาน";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStart = async () => {
    if (!confirm("ต้องการเริ่มงานนี้ใช่หรือไม่?")) return;
    setLoading(true);
    try {
      await startTask(taskId);
      await load();
    } catch (e) { alert("เกิดข้อผิดพลาด"); } finally { setLoading(false); }
  };

  const handleComplete = async () => {
    if (!confirm("ยืนยันการจบงาน?")) return;
    setLoading(true);
    try {
      await completeTask(taskId);
      await load();
    } catch (e) { alert("เกิดข้อผิดพลาด"); } finally { setLoading(false); }
  };

  return (
    <Layout title="รายละเอียดงาน">
      <Toaster position="top-center" />
      
      <div className="mb-6">
        <button onClick={() => router.push("/admin/tasks")} className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
          ย้อนกลับ
        </button>
      </div>

      {!task ? (
        <div className="p-10 text-center text-slate-400">กำลังโหลดข้อมูล...</div>
      ) : (
        <>
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
               <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
               </div>
               <div>
                 <h1 className="text-2xl font-bold text-slate-800 leading-tight">{displayTitle}</h1>
                 <p className="text-slate-400 text-xs mt-1">สร้างเมื่อ: {new Date(task.created_at).toLocaleString('th-TH')}</p>
               </div>
            </div>
            <div className="flex gap-3">
              {task.status === 'pending' && (
                <button onClick={handleStart} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-md shadow-blue-200 transition-all flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg> เริ่มงาน
                </button>
              )}
              {task.status === 'in_progress' && (
                <button onClick={handleComplete} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-bold shadow-md shadow-emerald-200 transition-all flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> เสร็จสิ้นงาน
                </button>
              )}
              {task.status === 'completed' && (
                <div className="bg-slate-100 text-slate-500 px-6 py-3 rounded-full font-bold flex items-center gap-2 cursor-default border border-slate-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> งานเสร็จสิ้นแล้ว
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <h3 className="text-lg font-bold text-slate-800">รายการจุดเก็บขยะ</h3>
               <span className="bg-slate-200 text-slate-600 text-xs px-3 py-1 rounded-full font-bold">{task.items?.length || 0} จุด</span>
            </div>
            <div className="p-0">
              <table className="w-full text-left">
                <thead className="bg-white text-slate-500 text-sm border-b border-slate-100">
                  <tr>
                    <th className="p-4 pl-6 font-semibold w-20 text-center">ลำดับ</th>
                    <th className="p-4 font-semibold text-left">รหัสถัง/จุดเก็บ</th>
                    <th className="p-4 font-semibold text-center">สถานะ</th>
                    <th className="p-4 font-semibold text-left">เวลาล่าสุด</th>
                    <th className="p-4 pr-6 font-semibold text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {task.items?.map((it: any, index: number) => (
                    <TaskItemRow
                      key={it.id}
                      item={it}
                      index={index + 1}
                      onComplete={async () => {
                        await completeTaskItem(taskId, it.id);
                        await load();
                      }}
                      onReport={({ itemId, binId }) => setIssueData({ itemId, binId })}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* เรียกใช้ Component ใหม่ และส่ง handleSubmitIssue เข้าไป */}
      <ReportIssueModal 
        isOpen={!!issueData && !!selectedItem}
        onClose={() => setIssueData(null)}
        onSubmit={handleSubmitIssue}
        taskTitle={displayTitle}
        binCode={selectedItem?.bin?.bin_code || selectedItem?.bin_id || '-'}
        status={selectedItem?.status || 'pending'}
        loading={submitting}
      />

    </Layout>
  );
}