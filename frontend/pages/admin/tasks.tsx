// pages/admin/tasks.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../components/shared/Layout";
import { getTasks } from "../../lib/api";

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const t = await getTasks();
      setTasks(t || []);
    } catch (e) {
      console.error(e);
      alert("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Link href="/admin/create-task">
          <a className="bg-blue-600 text-white px-4 py-2 rounded">+ Create Task</a>
        </Link>
      </div>

      <div className="bg-white rounded shadow p-4">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="py-2">ID</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Bins</th>
              <th>Created</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t: any) => (
              <tr key={t.id} className="border-t">
                <td className="py-3">{t.id}</td>
                <td><span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm">{t.status}</span></td>
                <td>{t.assigned_to || "-"}</td>
                <td>{(t.items || []).length}</td>
                <td>{new Date(t.created_at).toLocaleString()}</td>
                <td className="text-right">
                  <button
                    onClick={() => (window.location.href = `/admin/tasks/${t.id}`)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500">No tasks</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}