// frontend/components/DeviceHealth.tsx
import React from "react";

export default function DeviceHealth({ data }: any) {
  if (!data)
    return (
      <div className="p-4 bg-gray-100 rounded-lg shadow">
        <h3 className="text-lg font-bold">Device Health</h3>
        <p>No data</p>
      </div>
    );

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">Device Health</h3>

      <div className="flex gap-4">
        <div className="bg-white p-4 rounded shadow border">
          <p>Total</p>
          <h2 className="text-2xl font-bold">{data.total}</h2>
        </div>
        <div className="bg-green-100 p-4 rounded shadow border">
          <p>Online</p>
          <h2 className="text-2xl font-bold">{data.online}</h2>
        </div>
        <div className="bg-red-100 p-4 rounded shadow border">
          <p>Offline</p>
          <h2 className="text-2xl font-bold">{data.offline}</h2>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-bold mb-2">Firmware</h4>
        <pre className="bg-white p-2 rounded border text-sm">
          {JSON.stringify(data.firmware, null, 2)}
        </pre>
      </div>
    </div>
  );
}
