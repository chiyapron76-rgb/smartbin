// frontend/pages/index.tsx

import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import BinCard from "../components/BinCard";
import SummaryBar from "../components/SummaryBar";

import {
  fetchBins,
  fetchAlertsForBin,
  fetchDashboardSummary,
  fetchZoneStats,
  fetchTrends,
  fetchDeviceHealth,
  fetchRecentAlerts,
} from "../lib/api";

import ZoneStats from "../components/ZoneStats";
import TrendsChart from "../components/TrendsChart";
import DeviceHealth from "../components/DeviceHealth";
import RecentAlerts from "../components/RecentAlerts";

export default function Home() {
  const [bins, setBins] = useState([]);
  const [summary, setSummary] = useState(null);
  const [zones, setZones] = useState([]);
  const [trends, setTrends] = useState([]);
  const [deviceHealth, setDeviceHealth] = useState(null);
  const [recentAlerts, setRecentAlertsState] = useState([]);

  const loadData = async () => {
    setSummary(await fetchDashboardSummary());
    setZones(await fetchZoneStats());
    setTrends(await fetchTrends());
    setDeviceHealth(await fetchDeviceHealth());
    setRecentAlertsState(await fetchRecentAlerts());

    const b = await fetchBins();
    await Promise.all(
      b.map(async (bin: any) => {
        try {
          bin.alerts = await fetchAlertsForBin(bin.id);
        } catch {
          bin.alerts = [];
        }
      })
    );
    setBins(b);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">SmartBin Dashboard</h1>

      {summary && (
        <SummaryBar
          total_bins={summary.total_bins}
          counts_by_device_status={summary.counts_by_device_status}
          avg_fill={summary.avg_fill}
          avg_battery={summary.avg_battery}
          alerts_today={summary.alerts_today}
        />
      )}

      <div className="space-y-6">
        {/* Zone overview */}
        <ZoneStats zones={zones} />

        {/* Trends */}
        <TrendsChart data={trends} />

        {/* Device health + Recent alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DeviceHealth data={deviceHealth} />
          <RecentAlerts alerts={recentAlerts} />
        </div>

        {/* All bins */}
        <h2 className="text-xl font-bold mt-6">All Bins</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bins.map((b: any) => (
            <BinCard key={b.id} bin={b} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
