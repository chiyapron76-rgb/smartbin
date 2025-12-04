import React, { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/shared/Layout";
import { createBin } from "../../lib/api";

export default function CreateBin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ไม่ต้องมี bin_code แล้ว
  const [formData, setFormData] = useState({
    zone: "",
    address_note: "",
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // สร้าง payload ที่ไม่ใส่ bin_code
      const payload: any = {
        zone: formData.zone || undefined,
        address_note: formData.address_note || undefined,
      };

      if (typeof formData.latitude === "number") {
        payload.latitude = formData.latitude;
      }
      if (typeof formData.longitude === "number") {
        payload.longitude = formData.longitude;
      }

      await createBin(payload);

      alert("สร้างถังขยะสำเร็จเรียบร้อย!");
      router.push("/admin");
    } catch (err) {
      console.error(err);
      setError(
        "เกิดข้อผิดพลาด! โปรดตรวจสอบ backend ว่าทำงานอยู่หรือไม่ (ดู console เพื่อรายละเอียด)"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md mt-10">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          เพิ่มถังขยะใหม่
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">โซน (Zone)</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              placeholder="Ex. โรงอาหาร, หน้าตึก A"
              value={formData.zone}
              onChange={(e) =>
                setFormData({ ...formData, zone: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">
              จุดสังเกต (Address Note)
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              placeholder="Ex. ข้างตู้กดน้ำ, ใต้ต้นไม้ใหญ่"
              value={formData.address_note}
              onChange={(e) =>
                setFormData({ ...formData, address_note: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Latitude (optional)
              </label>
              <input
                type="number"
                step="any"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                value={formData.latitude ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    latitude: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Longitude (optional)
              </label>
              <input
                type="number"
                step="any"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                value={formData.longitude ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    longitude: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition font-bold"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`flex-1 text-white px-4 py-3 rounded-lg transition font-bold ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "กำลังบันทึก..." : "ยืนยันการเพิ่ม"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
