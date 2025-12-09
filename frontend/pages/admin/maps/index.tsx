"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Layout from "../../../components/shared/Layout";

const AdminMapLeaflet = dynamic(
  () => import("../../../components/admin/AdminMapLeaflet"),
  { ssr: false }
);

export default function AdminMap() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [bins, setBins] = useState([]);
  const [creating, setCreating] = useState(false);
  const [newPos, setNewPos] = useState(null);

  async function loadBins() {
    const res = await fetch(`${API_URL}/api/bins/public`);
    const data = await res.json();
    setBins(data);
  }

  useEffect(() => {
    loadBins();
  }, []);

  async function submitCreate() {
    if (!newPos) return alert("กรุณาคลิกตำแหน่งบนแผนที่ก่อน");

    const zone = prompt("กรอกโซน เช่น A1") || "";
    const note = prompt("รายละเอียดเพิ่มเติม") || "";

    const payload = {
      latitude: newPos.lat,
      longitude: newPos.lng,
      zone,
      address_note: note,
    };

    const res = await fetch(`${API_URL}/api/bins`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) return alert("สร้างถังล้มเหลว");

    alert("สร้างถังสำเร็จ");
    setCreating(false);
    setNewPos(null);
    loadBins();
  }

  return (
    <Layout>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">SmartBin Map</h1>

        {creating ? (
          <div className="flex gap-2">
            <button
              onClick={submitCreate}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              บันทึกตำแหน่ง
            </button>

            <button
              onClick={() => {
                setCreating(false);
                setNewPos(null);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              ยกเลิก
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCreating(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            + เพิ่มหมุด (สร้างถัง)
          </button>
        )}
      </div>
      <AdminMapLeaflet
        bins={bins}
        creating={creating}
        onSelectPos={(lat, lng) => setNewPos({ lat, lng })}
      />
    </Layout>
  );
}
