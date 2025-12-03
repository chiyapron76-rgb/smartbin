import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import TaskDetailCard from "../../components/TaskDetailCard";
import TaskItemRow from "../../components/TaskItemRow";
import IssueModal from "../../components/IssueModal";

import {
  getTask,
  assignTask,
  completeTaskItem,
  reportIssue,
  startTask,
  completeTask,
} from "../../lib/api";

export default function TaskDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  // บังคับเป็น string เสมอ
  const taskId = Array.isArray(id) ? id[0] : id || "";

  const [task, setTask] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [issueData, setIssueData] = useState<{
    itemId: string;
    binId: string;
  } | null>(null);

  async function load() {
    if (!taskId) return;

    setLoading(true);
    try {
      const t = await getTask(taskId);
      setTask(t);
    } catch (e) {
      console.error(e);
      alert("Failed to load task");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [taskId]);

  return (
    <Layout>
      <div className="mb-4">
        <button
          className="text-sm text-indigo-600"
          onClick={() => router.push("/tasks")}
        >
          ← Back to tasks
        </button>
      </div>

      {!task ? (
        <div>Loading...</div>
      ) : (
        <>
          <TaskDetailCard
            task={task}
            onAssign={async (assigned) => {
              await assignTask(taskId, assigned);
              await load();
            }}
            onStart={async () => {
              await startTask(taskId);
              await load();
            }}
            onComplete={async () => {
              await completeTask(taskId);
              await load();
            }}
            actionLoading={false}
          />

          <div className="bg-white rounded shadow p-4 mt-6">
            <h3 className="text-lg font-bold mb-3">Task Items</h3>
            <table className="w-full text-left">
              <tbody>
                {task.items.map((it: any) => (
                  <TaskItemRow
                    key={it.id}
                    item={it}
                    onComplete={async () => {
                      await completeTaskItem(taskId, it.id);
                      await load();
                    }}
                    onReport={({ itemId, binId }) =>
                      setIssueData({ itemId, binId })
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <IssueModal
        open={!!issueData}
        data={issueData}
        onClose={() => setIssueData(null)}
        onSubmit={async (payload) => {
          await reportIssue(issueData!.itemId, payload);
          await load();
        }}
      />
    </Layout>
  );
}
