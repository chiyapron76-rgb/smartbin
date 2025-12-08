import { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout";
import { fetchAllCitizenReports, updateCitizenReportStatus } from "../../lib/api";

export default function AdminCitizenReports() {
  const [reports, setReports] = useState([]);

  async function load() {
    const data = await fetchAllCitizenReports();
    setReports(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpdate(id: string, status: string) {
    await updateCitizenReportStatus(id, status);
    load();
  }

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Citizen Reports</h1>

        <div className="bg-white rounded shadow p-4">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-2">Bin</th>
                <th className="p-2">Type</th>
                <th className="p-2">Description</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{r.bin?.bin_code}</td>
                  <td className="p-2">{r.issue_type}</td>
                  <td className="p-2">{r.description}</td>
                  <td className="p-2">{r.status}</td>
                  <td className="p-2 space-x-2">
                    <button
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                      onClick={() => handleUpdate(r.id, "in_progress")}
                    >
                      In Progress
                    </button>
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded"
                      onClick={() => handleUpdate(r.id, "resolved")}
                    >
                      Resolve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </Layout>
  );
}
