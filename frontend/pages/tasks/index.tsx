import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import TaskTable from "../../components/TaskTable";
import { getTasks, startTask } from "../../lib/api";
import { useRouter } from "next/router";

export default function TaskListPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (e) {
      console.error(e);
      alert("Failed to load tasks");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>

        <button
          onClick={() => router.push("/tasks/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Task
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <TaskTable
          tasks={tasks}
          onView={(id) => router.push(`/tasks/${id}`)}
          onStart={async (id) => {
            await startTask(id);
            await load();
          }}
        />
      )}
    </Layout>
  );
}
