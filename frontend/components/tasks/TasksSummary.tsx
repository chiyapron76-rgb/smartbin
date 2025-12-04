// frontend/components/TasksSummary.tsx
import React from "react";

export default function TasksSummary({ data }: any) {
  if (!data)
    return (
      <div className="p-4 bg-gray-100 rounded-lg shadow">
        <h3 className="text-lg font-bold">Task Summary</h3>
        <p>No data</p>
      </div>
    );

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-2">Task Summary</h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow border">
          <p>Total Today</p>
          <h2 className="text-2xl font-bold">{data.totalToday}</h2>
        </div>

        <div className="bg-green-100 p-4 rounded shadow border">
          <p>Completed</p>
          <h2 className="text-2xl font-bold">{data.completed}</h2>
        </div>

        <div className="bg-yellow-100 p-4 rounded shadow border">
          <p>In Progress</p>
          <h2 className="text-2xl font-bold">{data.inProgress}</h2>
        </div>

        <div className="bg-blue-100 p-4 rounded shadow border">
          <p>Completion (%)</p>
          <h2 className="text-2xl font-bold">{data.completionRate}%</h2>
        </div>
      </div>
    </div>
  );
}
