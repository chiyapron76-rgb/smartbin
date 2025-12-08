import { useEffect, useState } from "react";
import { fetchPublicBins } from "../../lib/api";
import Link from "next/link";

export default function CitizenBins() {
  const [bins, setBins] = useState([]);

  useEffect(() => {
    fetchPublicBins().then(setBins);
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">เลือกถังขยะ</h1>

      {bins.map((smart: any) =>
        smart.bins.map((bin: any) => (
          <div key={bin.id} className="p-3 border rounded mb-2">
            <div className="font-bold">{bin.bin_code}</div>
            <div className="text-sm text-gray-500">Zone: {smart.zone}</div>

            <Link href={`/citizen/report?bin_id=${bin.id}`}>
              <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">
                แจ้งปัญหา
              </button>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
