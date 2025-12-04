// pages/collector/tasks.tsx
import { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout";
import { getTasks } from "../../lib/api";

export default function CollectorTasks() {
  const [tasks, setTasks] = useState<any[]>([]);

  async function load() {
    try {
      const t = await getTasks();
      setTasks(t || []);
    } catch (e) {
      console.error(e);
      alert("Failed to load tasks");
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>
      </div>

      <div className="bg-white rounded shadow p-4">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="py-2">ID</th>
              <th>Status</th>
              <th>Bins</th>
              <th>Created</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(t => (
              <tr key={t.id} className="border-t">
                <td className="py-3">{t.id}</td>
                <td><span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm">{t.status}</span></td>
                <td>{(t.items || []).length}</td>
                <td>{new Date(t.created_at).toLocaleString()}</td>
                <td className="text-right">
                  <button onClick={() => (window.location.href = `/collector/tasks/${t.id}`)} className="bg-blue-600 text-white px-3 py-1 rounded">View</button>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (<tr><td colSpan={5} className="py-6 text-center text-gray-500">No tasks</td></tr>)}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
