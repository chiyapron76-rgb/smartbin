// frontend/components/ZoneStats.tsx
import React from "react";

export default function ZoneStats({ zones }: any) {
  if (!zones || zones.length === 0)
    return (
      <div className="p-4 bg-gray-100 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-2">Zone Overview</h3>
        <p>No data</p>
      </div>
    );

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">Zone Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {zones.map((z: any) => (
          <div key={z.zone} className="bg-white p-4 rounded border shadow">
            <h4 className="font-bold text-md mb-2">Zone {z.zone}</h4>
            <p>Total Bins: {z.bins}</p>
            <p>Avg Fill: {z.avg_fill ?? "-"}%</p>
            <p>Full Count: {z.full_count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
