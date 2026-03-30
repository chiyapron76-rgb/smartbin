"use client";

import { useState } from "react";

export default function EditBinModal({ bin, onSave, onDelete }) {
  const [zone, setZone] = useState(bin.area || "");
  const [note, setNote] = useState(bin.description || "");
  const [lat, setLat] = useState(bin.latitude);
  const [lng, setLng] = useState(bin.longitude);

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded">
      <h2 className="font-bold text-lg mb-2">แก้ไขข้อมูลถัง</h2>

      <div className="flex flex-col gap-2">
        <input
          className="border p-2 rounded"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          placeholder="Zone"
        />

        <input
          className="border p-2 rounded"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note"
        />

        <input
          className="border p-2 rounded"
          type="number"
          value={lat}
          onChange={(e) => setLat(Number(e.target.value))}
          placeholder="Latitude"
        />

        <input
          className="border p-2 rounded"
          type="number"
          value={lng}
          onChange={(e) => setLng(Number(e.target.value))}
          placeholder="Longitude"
        />

        <button
          onClick={() =>
            onSave({
              zone,
              address_note: note,
              latitude: lat,
              longitude: lng,
            })
          }
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          บันทึก
        </button>

        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          ลบถัง
        </button>
      </div>
    </div>
  );
}
