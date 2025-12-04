// pages/collector/tasks/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../../components/shared/Layout";
import TaskItemRow from "../../../components/tasks/TaskItemRow";
import IssueModal from "../../../components/IssueModal";
import { getTask, completeTaskItem, reportIssue } from "../../../lib/api";

export default function CollectorTaskDetail() {
  const router = useRouter();
  const { id } = router.query;
  const taskId = Array.isArray(id) ? id[0] : id || "";

  const [task, setTask] = useState<any | null>(null);
  const [issueData, setIssueData] = useState<any | null>(null);

  async function load() {
    if (!taskId) return;
    try {
      const t = await getTask(taskId);
      setTask(t);
    } catch (e) {
      console.error(e);
      alert("Failed to load task");
    }
  }

  useEffect(() => { load(); }, [taskId]);

  return (
    <Layout>
      <div className="mb-4">
        <button onClick={() => router.push("/collector/tasks")} className="text-indigo-600 hover:underline">
          ← My Tasks
        </button>
      </div>

      {!task ? <div>Loading...</div> : (
        <>
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-bold">{task.id}</h2>
            <div className="text-sm text-gray-600">Status: <strong>{task.status}</strong></div>
            <div className="mt-3">Assigned to: {task.assigned_to || "-"}</div>
          </div>

          <div className="bg-white rounded shadow p-4 mt-6">
            <h3 className="text-lg font-bold mb-3">Task Items</h3>
            <table className="w-full">
              <tbody>
                {task.items.map((it: any) => (
                  <TaskItemRow
                    key={it.id}
                    item={it}
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
        </>
      )}

      <IssueModal open={!!issueData} data={issueData} onClose={() => setIssueData(null)} onSubmit={async (payload) => {
        await reportIssue(issueData.itemId, payload);
        await load();
      }} />
    </Layout>
  );
}
