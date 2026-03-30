import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/shared/Layout";
import { getBin, updateBin } from "../../../lib/api";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function EditBinPage() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // State เก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    bin_code: "",
    zone: "",         // โซนพื้นที่
    address_note: "", // 🟢 รายละเอียดเพิ่มเติม (เพิ่มตัวนี้เข้ามา)
    status: "inactive",
  });

  // โหลดข้อมูล
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getBin(id as string);
        if (data) {
          setFormData({
            bin_code: data.bin_code || "",
            zone: data.zone || data.area || "",
            // ดึงข้อมูลจุดสังเกต หรือ description มาใส่
            address_note: data.address_note || data.description || "", 
            status: data.status || "inactive",
          });
        }
      } catch (error) {
        console.error("Load bin failed", error);
        toast.error("ไม่พบข้อมูลถังขยะ");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // บันทึกข้อมูล
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🟢 Validation: ตรวจสอบว่ากรอกครบไหม
    if (!formData.zone.trim()) {
      toast.error("กรุณาระบุ โซนพื้นที่ (Zone)");
      return;
    }
    if (!formData.address_note.trim()) {
      toast.error("กรุณาระบุ รายละเอียดเพิ่มเติม");
      return;
    }

    setSaving(true);
    try {
      await updateBin(id as string, formData);
      toast.success("บันทึกข้อมูลสำเร็จ!");
      setTimeout(() => router.push("/admin/bins"), 1000);
    } catch (error) {
      console.error(error);
      toast.error("บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  // 🟢 เหลือแค่ 2 สถานะตามที่ขอ
  const statusOptions = [
    { value: "active", label: "ทำงานปกติ", color: "emerald" },
    { value: "offline", label: "ไม่ทำงาน", color: "red" }, // ใช้ offline แทน ไม่ทำงาน
  ];

  if (loading) return <Layout><div className="p-10 text-center text-gray-400">กำลังโหลด...</div></Layout>;

  return (
    <Layout title="จัดการข้อมูลถัง">
      <Toaster position="top-center" />
      
      <div className="max-w-3xl mx-auto mt-6">
        <div className="flex items-center gap-3 mb-8">
          <svg className="w-8 h-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <h1 className="text-2xl font-bold text-slate-900">จัดการข้อมูลถัง</h1>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. รหัสถัง */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 pl-1">รหัสถัง</label>
              <input
                type="text"
                value={formData.bin_code}
                disabled
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 focus:outline-none"
              />
            </div>

            {/* 2. โซนพื้นที่ (Zone) */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 pl-1">
                โซนพื้นที่ (Zone) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                placeholder="เช่น Zone A, ตลาดสด"
                required
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-slate-800 placeholder:text-slate-300"
              />
            </div>

            {/* 3. รายละเอียดเพิ่มเติม (เพิ่มใหม่ + บังคับกรอก) */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 pl-1">
                รายละเอียดเพิ่มเติม <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address_note}
                onChange={(e) => setFormData({ ...formData, address_note: e.target.value })}
                placeholder="ระบุจุดสังเกต..."
                required
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-slate-800 placeholder:text-slate-300"
              />
            </div>

            {/* 4. สถานะ (เหลือ 2 ปุ่ม) */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 pl-1">รายละเอียด(สถานะ)</label>
              <div className="flex flex-col gap-3 mt-2">
                {statusOptions.map((option) => {
                  const isActive = formData.status === option.value;
                  // กำหนดสี Active ตามค่า (เขียว หรือ แดง)
                  const activeClass = option.color === 'emerald' 
                    ? 'border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/50 text-emerald-700' 
                    : 'border-red-500 ring-1 ring-red-500 bg-red-50/50 text-red-700';

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: option.value })}
                      className={`w-full py-3 px-6 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group
                        ${isActive ? activeClass : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'}`}
                    >
                      <span className="font-medium">{option.label}</span>
                      {isActive && (
                        <svg className={`w-5 h-5 ${option.color === 'emerald' ? 'text-emerald-600' : 'text-red-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 flex gap-4">
              <Link href="/admin/bins" legacyBehavior>
                <a className="flex-1 py-3 text-center border border-emerald-500 text-emerald-600 font-bold rounded-full hover:bg-emerald-50 transition-colors">
                  ยกเลิก
                </a>
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? "กำลังบันทึก..." : "ตกลง"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </Layout>
  );
}