"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../../components/shared/Layout";
import EditBinModal from "../../../components/admin/EditBinModal";

type BinDetail = {
  id: string;               // smartBin UUID
  code: string;             // BIN-001
  zone: string | null;
  address_note: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string | null;
};

export default function EditBinPage() {
  const router = useRouter();
  const { id } = router.query;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const [bin, setBin] = useState<BinDetail | null>(null);
  const [loading, setLoading] = useState(true);

  /** โหลดข้อมูลจาก code (BIN-001) ให้ถูกต้อง */
  async function loadBin() {
    if (!id) return;

    setLoading(true);

    try {
      // GET /api/bins/code/BIN-001
      const res = await fetch(`${API_URL}/api/bins/code/${id}`);
      const data = await res.json();

      // mapping ให้ตรง field backend
      setBin({
        id: data.device.id,
        code: data.bin_code,
        zone: data.area,
        address_note: data.device.address_note,  // FIX: ดึง note ที่ถูกต้อง
        latitude: data.latitude,
        longitude: data.longitude,
        status: data.device.status,
      });
    } catch (err) {
      console.error("Load error:", err);
      setBin(null);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadBin();
  }, [id]);

  /** UPDATE */
  async function handleSave(updated: any) {
    if (!bin) return;

    const payload: any = {
      zone: updated.zone,
      address_note: updated.address_note ?? updated.note ?? "",   // FIX
      latitude: Number(updated.latitude),
      longitude: Number(updated.longitude),
    };

    const res = await fetch(`${API_URL}/api/bins/${bin.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error(await res.text());
      return alert("Update failed");
    }

    alert("อัปเดตสำเร็จ");
    loadBin();
  }

  /** DELETE */
  async function handleDelete() {
    if (!bin) return;

    if (!confirm("ต้องการลบถังนี้จริงหรือไม่?")) return;

    const res = await fetch(`${API_URL}/api/bins/${bin.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error(await res.text());
      return alert("Delete failed");
    }

    alert("ลบสำเร็จ");
    router.push("/admin/bins");
  }

  if (loading) return <Layout>Loading...</Layout>;
  if (!bin) return <Layout>ไม่พบข้อมูลถัง</Layout>;

  return (
    <Layout>
      <h1 className="text-xl font-bold mb-4">Edit Bin – {bin.code}</h1>

      <div className="bg-white p-4 rounded shadow mb-4">
        <p><strong>Zone:</strong> {bin.zone || "-"}</p>
        <p><strong>Latitude:</strong> {bin.latitude}</p>
        <p><strong>Longitude:</strong> {bin.longitude}</p>
        <p><strong>Note:</strong> {bin.address_note || "-"}</p>
      </div>

      <EditBinModal
        bin={{
          id: bin.id,
          zone: bin.zone,
          address_note: bin.address_note,
          latitude: bin.latitude,
          longitude: bin.longitude,
        }}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </Layout>
  );
}
