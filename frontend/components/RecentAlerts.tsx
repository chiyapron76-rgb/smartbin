// frontend/components/RecentAlerts.tsx
import React from "react";

export default function RecentAlerts({ alerts }: any) {
  if (!alerts)
    return (
      <div className="p-4 bg-gray-100 rounded-lg shadow">
        <h3 className="text-lg font-bold">Recent Alerts</h3>
        <p>No data</p>
      </div>
    );

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow overflow-x-auto">
      <h3 className="text-lg font-bold mb-2">Recent Alerts</h3>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2">Time</th>
            <th className="p-2">Bin</th>
            <th className="p-2">Zone</th>
            <th className="p-2">Type</th>
            <th className="p-2">Message</th>
          </tr>
        </thead>

        <tbody>
          {alerts.map((a: any) => (
            <tr key={a.id} className="border-b">
              <td className="p-2">{new Date(a.created_at).toLocaleString()}</td>
              <td className="p-2">{a.bin?.bin_code ?? "-"}</td>
              <td className="p-2">{a.bin?.zone ?? "-"}</td>
              <td className="p-2">{a.alert_type}</td>
              <td className="p-2">{a.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
