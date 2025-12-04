import React from "react";

function getStatusColor(status: string) {
  switch (status) {
    case "critical":
      return "bg-red-100 border-red-500";
    case "warning":
      return "bg-yellow-100 border-yellow-500";
    default:
      return "bg-green-100 border-green-500";
  }
}

function getStatusBadgeColor(status: string) {
  switch (status) {
    case "critical":
      return "bg-red-600 text-white";
    case "warning":
      return "bg-yellow-600 text-white";
    default:
      return "bg-green-600 text-white";
  }
}

export default function BinCard({ bin }: any) {
  const last = bin.sensorRecords?.[0];

  return (
    <div className={`p-4 rounded-lg shadow border ${getStatusColor(bin.status)}`}>

      {/* Status Badge */}
      <div className={`inline-block px-3 py-1 rounded mb-3 text-sm font-bold ${getStatusBadgeColor(bin.status)}`}>
        {bin.status.toUpperCase()}
      </div>

      <h2 className="text-xl font-bold">{bin.bin_code}</h2>

      <p><strong>Zone:</strong> {bin.zone}</p>

      {last && (
        <>
          <p><strong>Distance:</strong> {last.distance_cm} cm</p>
          <p><strong>Fill:</strong> {last.fill_percentage}%</p>
          <p><strong>Battery:</strong> {last.battery_voltage} V</p>
          <p><strong>Temperature:</strong> {last.temperature}°C</p>
          <p className="text-gray-600 text-sm">
            {new Date(last.timestamp).toLocaleString()}
          </p>
        </>
      )}

      {/* Alerts */}
      {bin.alerts?.length > 0 && (
        <div className="mt-3 p-2 bg-red-100 border border-red-500 rounded">
          <strong>Alerts:</strong>
          <ul className="list-disc pl-5">
            {bin.alerts.map((a: any) => (
              <li key={a.id}>
                <strong>{a.alert_type}</strong> — {a.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
