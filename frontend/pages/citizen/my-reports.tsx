import { useEffect, useState } from "react";
import { fetchCitizenReports } from "../../lib/api";

export default function MyReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const device = localStorage.getItem("device_uuid") || "guest-device";
    fetchCitizenReports(device).then(setReports);
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">รายการแจ้งของฉัน</h1>

      {reports.map((r: any) => (
        <div key={r.id} className="border rounded p-3 mb-3 bg-white">
          <div className="font-bold">{r.bin?.bin_code}</div>
          <div>ปัญหา: {r.issue_type}</div>
          <div>สถานะ: {r.status}</div>
          <div className="text-sm text-gray-500">
            {new Date(r.created_at).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
