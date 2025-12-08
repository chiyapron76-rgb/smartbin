import { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout";
import { getTasks } from "../../lib/api";

export default function CollectorTaskHistory() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getTasks();
    const completed = data.filter((t: any) => t.status === "completed");
    setTasks(completed);
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Task History</h1>

        <div className="bg-white shadow rounded p-4">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Bins</th>
                <th className="p-2">Completed At</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-2">{t.id}</td>
                  <td className="p-2">{t.total_bins}</td>
                  <td className="p-2">
                    {t.completed_at ? new Date(t.completed_at).toLocaleString() : "-"}
                  </td>
                </tr>
              ))}

              {tasks.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    No completed tasks yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
