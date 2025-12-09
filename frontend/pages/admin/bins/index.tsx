"use client";

import { useEffect, useState } from "react";
import Layout from "../../../components/shared/Layout";
import Link from "next/link";

export default function ManageBinsPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const [bins, setBins] = useState([]);

  async function loadBins() {
    const res = await fetch(`${API_URL}/api/bins/public`);
    const data = await res.json();
    setBins(data);
  }

  async function deleteBin(id: string) {
    if (!confirm("ต้องการลบถังนี้ใช่ไหม?")) return;

    const res = await fetch(`${API_URL}/api/bins/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) return alert("ลบไม่สำเร็จ");

    alert("ลบถังสำเร็จ");
    loadBins();
  }

  useEffect(() => {
    loadBins();
  }, []);

  return (
    <Layout>
      <h1 className="text-xl font-bold mb-4">จัดการข้อมูลถังขยะ</h1>

      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Code</th>
            <th className="p-2">Zone</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {bins.map((bin: any) => (
            <tr key={bin.id} className="border-b">
              <td className="p-2">{bin.code}</td>
              <td className="p-2">{bin.zone || "-"}</td>
              <td className="p-2">{bin.status}</td>

              <td className="p-2 flex gap-3">
                {/* ไปหน้าแก้ไขด้วย bin.code (ยังคงใช้รูปแบบเดิมของโครงสร้างโปรเจค) */}
                <Link
                  href={`/admin/bins/${bin.code}`}
                  className="text-blue-600 underline"
                >
                  แก้ไข
                </Link>

                {/* ลบโดยใช้ smartbin.id (UUID) */}
                <button
                  className="text-red-600 underline"
                  onClick={() => deleteBin(bin.id)}
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
