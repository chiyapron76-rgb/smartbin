// frontend/components/TrendsChart.tsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

export default function TrendsChart({ data }: any) {
  if (!data || data.length === 0)
    return (
      <div className="p-4 bg-gray-100 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-2">Trends</h3>
        <p>No trend data</p>
      </div>
    );

  const formatted = data.map((d: any) => ({
    date: d.date,
    fill: d.avg_fill ?? 0,
    alerts: d.alerts,
  }));

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">Trends</h3>
      <div className="flex flex-col lg:flex-row gap-6">
        <LineChart width={500} height={250} data={formatted}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line dataKey="fill" stroke="#2563eb" name="Avg Fill (%)" />
        </LineChart>

        <BarChart width={400} height={250} data={formatted}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="alerts" fill="#f97316" name="Alerts" />
        </BarChart>
      </div>
    </div>
  );
}
