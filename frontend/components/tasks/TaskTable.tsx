import React from "react";

interface TaskTableProps {
  tasks: any[];
  onView: (id: string) => void;
  onStart: (id: string) => void;
}

export default function TaskTable({ tasks, onView, onStart }: TaskTableProps) {
  const badge = (status: string) => {
    const map: any = {
      pending: "bg-gray-200 text-gray-700",
      in_progress: "bg-yellow-200 text-yellow-700",
      completed: "bg-green-200 text-green-700",
      cancelled: "bg-red-200 text-red-700",
    };
    return map[status] || "bg-gray-200 text-gray-700";
  };

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-xl font-bold mb-4">Tasks</h2>

      <table className="w-full text-left">
        <thead>
          <tr className="text-sm border-b text-gray-600">
            <th className="p-2">ID</th>
            <th className="p-2">Status</th>
            <th className="p-2">Assigned To</th>
            <th className="p-2">Bins</th>
            <th className="p-2">Created</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((t) => (
            <tr key={t.id} className="border-b hover:bg-gray-50 text-sm">
              <td className="p-2">{t.id.slice(0, 8)}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-xs ${badge(t.status)}`}>
                  {t.status}
                </span>
              </td>
              <td className="p-2">{t.assigned_to || "-"}</td>
              <td className="p-2">{t.total_bins}</td>
              <td className="p-2">
                {new Date(t.created_at).toLocaleString()}
              </td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => onView(t.id)}
                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                >
                  View
                </button>

                {t.status === "pending" && (
                  <button
                    onClick={() => onStart(t.id)}
                    className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                  >
                    Start
                  </button>
                )}
              </td>
            </tr>
          ))}

          {tasks.length === 0 && (
            <tr>
              <td className="p-4 text-center text-gray-500" colSpan={6}>
                No tasks available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
