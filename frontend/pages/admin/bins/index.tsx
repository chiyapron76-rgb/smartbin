import { useEffect, useState } from "react";
import Layout from "../../../components/shared/Layout";
import { fetchBins } from "../../../lib/api";
import Link from "next/link";
// 🟢 Import ตารางตัวใหม่ (ManageBinTable)
import ManageBinTable from "../../../components/admin/ManageBinTable";

export default function BinsPage() {
  const [bins, setBins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchBins();
      setBins(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Layout title="จัดการข้อมูลถังขยะ">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">จัดการข้อมูลถังขยะ</h1>
          <p className="text-slate-500 text-sm mt-1">ลบ/แก้ไข ข้อมูลจุดติดตั้งถังขยะ</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">กำลังโหลดข้อมูล...</div>
      ) : (
        // 🟢 เรียกใช้ Component นี้แทน BinTable
        <ManageBinTable bins={bins} refreshData={loadData} />
      )}
    </Layout>
  );
}