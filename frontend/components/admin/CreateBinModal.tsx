import { useState } from "react";

export default function CreateBinModal({ position, onClose, onCreated }) {
  const [zone, setZone] = useState("");
  const [address, setAddress] = useState("");

  async function submit() {
    const res = await fetch("/api/bins/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        zone,
        address_note: address,
        latitude: position.lat,
        longitude: position.lng,
      }),
    });

    if (res.ok) {
      onCreated();
    } else {
      alert("Error creating bin");
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow w-[360px]">

        <h2 className="text-lg font-bold mb-2">เพิ่มจุดติดตั้งใหม่</h2>

        <label>Zone</label>
        <input className="border w-full p-2 mb-2"
               value={zone}
               onChange={(e) => setZone(e.target.value)} />

        <label>Address Note</label>
        <input className="border w-full p-2 mb-2"
               value={address}
               onChange={(e) => setAddress(e.target.value)} />

        <p className="text-sm text-gray-600 mb-2">
          Latitude: {position.lat.toFixed(6)}  
          <br />
          Longitude: {position.lng.toFixed(6)}
        </p>

        <div className="flex gap-2 justify-end">
          <button className="px-3 py-1 bg-gray-300 rounded" onClick={onClose}>
            ยกเลิก
          </button>
          <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={submit}>
            เพิ่มหมุด
          </button>
        </div>

      </div>
    </div>
  );
}
