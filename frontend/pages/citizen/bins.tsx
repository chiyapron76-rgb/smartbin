import { useEffect, useState } from "react";
import Link from "next/link";

export default function CitizenBins() {
  const [bins, setBins] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bins/public`)
      .then((r) => r.json())
      .then((rows) => {
        // rows มาจาก BinService.getPublicBins()
        // ตรวจว่าเป็น array จริง
        if (Array.isArray(rows)) setBins(rows);
      })
      .catch((err) => console.error("Load bins failed:", err));
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">เลือกถังขยะ</h1>

      {bins.length === 0 && (
        <p className="text-gray-500">ไม่มีถังขยะให้เลือก</p>
      )}

      {bins.map((bin: any) => (
        <div key={bin.id} className="p-3 border rounded mb-2 bg-white">
          <div className="font-bold">{bin.code}</div>
          <div className="text-sm text-gray-500">Zone: {bin.zone || "-"}</div>
          <div className="text-sm text-gray-500">
            Note: {bin.address_note || "-"}
          </div>

          <Link href={`/citizen/report?bin_id=${bin.id}`}>
            <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">
              แจ้งปัญหา
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}
