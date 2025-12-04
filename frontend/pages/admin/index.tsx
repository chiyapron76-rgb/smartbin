import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../components/shared/Layout";
import BinCard from "../../components/admin/BinCard";
import SummaryBar from "../../components/shared/SummaryBar";
import ZoneStats from "../../components/admin/ZoneStats";
import TrendsChart from "../../components/admin/TrendsChart";
import DeviceHealth from "../../components/admin/DeviceHealth";
import RecentAlerts from "../../components/RecentAlerts";

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
  // --- LOGIC SECTION (KEPT EXACTLY THE SAME) ---
  const [bins, setBins] = useState([]);
  const [summary, setSummary] = useState(null);
  const [zones, setZones] = useState([]);
  const [trends, setTrends] = useState([]);
  const [deviceHealth, setDeviceHealth] = useState(null);
  const [recentAlerts, setRecentAlertsState] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      // Parallel fetching for performance
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
        // Fetch alerts for each bin individually
        await Promise.all(
          binData.map(async (bin) => {
            try {
              bin.alerts = await fetchAlertsForBin(bin.id);
            } catch {
              bin.alerts = [];
            }
          })
        );
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
    const interval = setInterval(loadData, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);
  // --- END LOGIC SECTION ---

  // --- START UI REDESIGN ---
  return (
    <Layout>
      {/* Background Decor */}
      <div className="fixed inset-0 bg-slate-50 -z-20"></div>
      <div className="fixed top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50 -z-10 blur-3xl opacity-60"></div>

      <div className="min-h-screen pb-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          
          {/* --- Header Section --- */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
                Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Dashboard</span>
              </h1>
              <p className="text-slate-500 text-base font-medium">
                ภาพรวมสถานะถังขยะและการแจ้งเตือนอัจฉริยะ (Real-time Monitoring)
              </p>
            </div>
            
            <Link href="/admin/create-bin" legacyBehavior>
              <a className="group relative overflow-hidden flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-0.5">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-200 group-hover:text-white transition-colors" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold tracking-wide">เพิ่มจุดติดตั้งใหม่</span>
                </div>
              </a>
            </Link>
          </div>

          {/* --- Summary Section --- */}
          {summary && (
            <div className="mb-10 transform hover:scale-[1.01] transition-transform duration-500">
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

          {/* --- Analytics Grid --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
            
            {/* Chart Area: Takes up 8/12 cols */}
            <div className="lg:col-span-8 bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/60 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">แนวโน้มปริมาณขยะ</h3>
                  <p className="text-sm text-slate-400">สถิติย้อนหลัง 7 วัน</p>
                </div>
                <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
              </div>
              <div className="h-[350px] w-full"> 
                 <TrendsChart data={trends} />
              </div>
            </div>

            {/* Zone Stats: Takes up 4/12 cols */}
            <div className="lg:col-span-4 bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/60 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xl font-bold text-slate-800">สถานะรายโซน</h3>
                 <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">Real-time</span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <ZoneStats zones={zones} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Device Health */}
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/60 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                สุขภาพอุปกรณ์ (Device Health)
              </h3>
              <DeviceHealth data={deviceHealth} />
            </div>

            {/* Recent Alerts */}
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/60 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  แจ้งเตือนล่าสุด
                </h3>
                <span className="animate-pulse flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
              <RecentAlerts alerts={recentAlerts} />
            </div>
          </div>

          {/* --- Bin Grid Section --- */}
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
              <div className="flex items-baseline gap-4">
                <h2 className="text-2xl font-extrabold text-slate-800">จุดติดตั้งทั้งหมด</h2>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-sm font-semibold">
                  {bins.length} จุด
                </span>
              </div>
              {/* Optional: Filter Placeholder */}
              <div className="flex gap-2">
                 {/* Can add filter buttons here later */}
              </div>
            </div>

            {loading && bins.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-32 bg-white/50 rounded-3xl border border-dashed border-slate-300">
                 <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                 <p className="text-slate-500 animate-pulse">กำลังโหลดข้อมูล...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {bins.length > 0 ? (
                  bins.map((b) => (
                    <div key={b.id} className="group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 rounded-2xl">
                      {/* Wrapping BinCard to ensure it renders correctly but we can control container */}
                      <div className="h-full">
                        <BinCard bin={b} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="bg-slate-50 p-6 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-600">ยังไม่มีข้อมูลถังขยะในระบบ</h3>
                    <p className="text-slate-400 mt-1">เริ่มโดยการกดปุ่ม "เพิ่มจุดติดตั้งใหม่" ด้านบน</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </Layout>
  );
}