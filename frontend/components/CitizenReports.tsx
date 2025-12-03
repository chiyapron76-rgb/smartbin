// frontend/components/CitizenReports.tsx
import React from "react";

export default function CitizenReports({ data }: any) {
  if (!data)
    return (
      <div className="p-4 bg-gray-100 rounded-lg shadow">
        <h3 className="text-lg font-bold">Citizen Reports</h3>
        <p>No data</p>
      </div>
    );

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-2">Citizen Reports</h3>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-100 p-4 rounded shadow border">
          <p>Open</p>
          <h2 className="text-2xl font-bold">{data.open}</h2>
        </div>

        <div className="bg-yellow-100 p-4 rounded shadow border">
          <p>In Progress</p>
          <h2 className="text-2xl font-bold">{data.inProgress}</h2>
        </div>

        <div className="bg-green-100 p-4 rounded shadow border">
          <p>Resolved</p>
          <h2 className="text-2xl font-bold">{data.resolved}</h2>
        </div>
      </div>
    </div>
  );
}
