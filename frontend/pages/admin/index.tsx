import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../components/shared/Layout";
import SummaryBar from "../../components/shared/SummaryBar";
import NotificationBell from "../../components/admin/NotificationBell";
import BinTable from "../../components/admin/BinTable"; // ✅ เรียกใช้ BinTable
import TrendsChart from "../../components/admin/TrendsChart";
import MostFullPieChart from "../../components/admin/MostFullPieChart"; // ✅ เพิ่มบรรทัดนี้

import {
  fetchBins,
  fetchAlertsForBin,
  fetchDashboardSummary,
  fetchZoneStats,
  fetchTrends,
  fetchDeviceHealth,
  fetchRecentAlerts,
} from "../../lib/api";

export default function AdminDashboard() {
  // --- STATE MANAGEMENT ---
  const [bins, setBins] = useState([]);
  const [summary, setSummary] = useState(null);
  const [zones, setZones] = useState([]);
  const [trends, setTrends] = useState([]);
  const [deviceHealth, setDeviceHealth] = useState(null);
  const [recentAlerts, setRecentAlertsState] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- DATA LOADING ---
  const loadData = async () => {
    try {
      const [
        sumData,
        zoneData,
        trendData,
        healthData,
        alertData,
        binData
      ] = await Promise.all([
        fetchDashboardSummary(),
        fetchZoneStats(),
        fetchTrends(),
        fetchDeviceHealth(),
        fetchRecentAlerts(),
        fetchBins()
      ]);

      setSummary(sumData);
      setZones(zoneData);
      setTrends(trendData);
      setDeviceHealth(healthData);
      setRecentAlertsState(alertData);

      if (Array.isArray(binData)) {
        // ดึง Alert ของแต่ละถังเพิ่มเติม
        await Promise.all(
          binData.map(async (bin) => {
            try {
              bin.alerts = await fetchAlertsForBin(bin.id);
            } catch {
              bin.alerts = [];
            }
          })
        );
        // เรียงตามรหัสถัง
        binData.sort((a: any, b: any) => a.bin_code.localeCompare(b.bin_code));
        setBins(binData);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); 
    return () => clearInterval(interval);
  }, []);

  // --- RENDER UI ---
  return (
    <Layout title="SmartBin Dashboard">
      <div className="fixed inset-0 bg-slate-50 -z-20"></div>
      <div className="fixed top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50 -z-10 blur-3xl opacity-60"></div>

      <div className="min-h-screen pb-20">
        
        {/* --- Header Section (ปรับปรุงใหม่: มีไอคอน) --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div className="flex items-center gap-5">
            {/* 🟢 ส่วนไอคอน Dashboard ที่เพิ่มเข้ามา */}
            <div className="p-2 bg-slate-100 rounded-lg flex items-center justify-center">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.6155 8.5C4.40267 8.5 4.22442 8.57183 4.08075 8.7155C3.93725 8.859 3.8655 9.03717 3.8655 9.25V12.5C3.8655 12.7128 3.93725 12.891 4.08075 13.0345C4.22442 13.1782 4.40267 13.25 4.6155 13.25C4.82817 13.25 5.00633 13.1782 5.15 13.0345C5.2935 12.891 5.36525 12.7128 5.36525 12.5V9.25C5.36525 9.03717 5.2935 8.859 5.15 8.7155C5.00633 8.57183 4.82817 8.5 4.6155 8.5ZM12.3845 3.5C12.1718 3.5 11.9937 3.57183 11.85 3.7155C11.7065 3.859 11.6348 4.03717 11.6348 4.25V12.5C11.6348 12.7128 11.7065 12.891 11.85 13.0345C11.9937 13.1782 12.1718 13.25 12.3845 13.25C12.5973 13.25 12.7756 13.1782 12.9193 13.0345C13.0628 12.891 13.1345 12.7128 13.1345 12.5V4.25C13.1345 4.03717 13.0628 3.859 12.9193 3.7155C12.7756 3.57183 12.5973 3.5 12.3845 3.5ZM8.5 10.5C8.28717 10.5 8.109 10.5718 7.9655 10.7155C7.82183 10.859 7.75 11.0372 7.75 11.25V12.5C7.75 12.7128 7.82183 12.891 7.9655 13.0345C8.109 13.1782 8.28717 13.25 8.5 13.25C8.71283 13.25 8.891 13.1782 9.0345 13.0345C9.17817 12.891 9.25 12.7128 9.25 12.5V11.25C9.25 11.0372 9.17817 10.859 9.0345 10.7155C8.891 10.5718 8.71283 10.5 8.5 10.5ZM1.80775 17C1.30258 17 0.875 16.825 0.525 16.475C0.175 16.125 0 15.6974 0 15.1923V1.80775C0 1.30258 0.175 0.875 0.525 0.525C0.875 0.175 1.30258 0 1.80775 0H15.1923C15.6974 0 16.125 0.175 16.475 0.525C16.825 0.875 17 1.30258 17 1.80775V15.1923C17 15.6974 16.825 16.125 16.475 16.475C16.125 16.825 15.6974 17 15.1923 17H1.80775ZM1.80775 15.5H15.1923C15.2693 15.5 15.3398 15.4679 15.4038 15.4038C15.4679 15.3398 15.5 15.2693 15.5 15.1923V1.80775C15.5 1.73075 15.4679 1.66025 15.4038 1.59625C15.3398 1.53208 15.2693 1.5 15.1923 1.5H1.80775C1.73075 1.5 1.66025 1.53208 1.59625 1.59625C1.53208 1.66025 1.5 1.73075 1.5 1.80775V15.1923C1.5 15.2693 1.53208 15.3398 1.59625 15.4038C1.66025 15.4679 1.73075 15.5 1.80775 15.5ZM8.5 8.25C8.71283 8.25 8.891 8.17817 9.0345 8.0345C9.17817 7.891 9.25 7.71283 9.25 7.5C9.25 7.28717 9.17817 7.109 9.0345 6.9655C8.891 6.82183 8.71283 6.75 8.5 6.75C8.28717 6.75 8.109 6.82183 7.9655 6.9655C7.82183 7.109 7.75 7.28717 7.75 7.5C7.75 7.71283 7.82183 7.891 7.9655 8.0345C8.109 8.17817 8.28717 8.25 8.5 8.25Z" fill="#1E7D55"/>
</svg>

            </div>

            {/* ส่วนชื่อหัวข้อ */}
            <div>
              <h1 className="text-3xl md:text-[48px] font-bold text-slate-800 tracking-tight mb-1">
                Dashboard ระบบความปลอดภัย
              </h1>
              <p className="text-slate-500 text-sm md:text-base font-medium">
                ภาพรวมการใช้งานบริการทั้งหมดในระบบ GovCenter
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            {/* NotificationBell (กระดิ่ง) */}
             <NotificationBell alerts={recentAlerts} />

             {/* <Link href="/admin/create-bin" legacyBehavior>
              <a className="flex-1 md:flex-none justify-center group relative overflow-hidden flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-0.5">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-200 group-hover:text-white transition-colors" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold tracking-wide whitespace-nowrap">เพิ่มจุดติดตั้งใหม่</span>
                </div>
              </a>
            </Link> */}
          </div>
        </div>

        {/* --- Summary --- */}
        {summary && (
          <div className="mb-10 transform hover:scale-[1.005] transition-transform duration-500">
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
              <SummaryBar
                total_bins={summary.total_bins}
                counts_by_device_status={summary.counts_by_device_status}
                avg_fill={summary.avg_fill}
                avg_battery={summary.avg_battery}
                alerts_today={summary.alerts_today}
              />
            </div>
          </div>
        )}

        {/* --- Bin Table Section (ตาราง) --- */}
        {/* ✅ ใช้โค้ดส่วนที่คุณต้องการตรงนี้ครับ */}
        <div className="mt-8 ">
          <div className="overflow-x-auto"> {/* ครอบเพื่อให้เลื่อนได้ในมือถือ */}
            {loading && bins.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-24">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                  <p className="text-slate-500">กำลังโหลดข้อมูล...</p>
                </div>
            ) : (
                <BinTable bins={bins} />
            )}
          </div>
        </div>

        {/* --- Analytics Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          
          {/* 🟢 กราฟเส้น (TrendsChart) */}
          <div className="lg:col-span-8 bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
             {/* ส่ง data ที่ fetch มา (trends) เข้าไป */}
             <TrendsChart data={trends} />
          </div>

          {/* 🟢 กราฟวงกลม (MostFullPieChart) */}
          <div className="lg:col-span-4 bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
             {/* ✅ ส่ง "bins" เข้าไปแทน "recentAlerts" 
                 เพื่อให้มันไปวนลูปเช็คค่า Sensor Records แทน
             */}
             <MostFullPieChart bins={bins} />
          </div>
        </div>
      </div>
    </Layout>
  );
}