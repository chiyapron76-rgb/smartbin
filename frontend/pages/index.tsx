import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import BinCard from "../components/BinCard";

type SensorRecord = {
  distance_cm: number;
  fill_percentage: number;
  battery_voltage: number;
  timestamp: string;
};

type Alert = {
  id: string;
  alert_type: string;
  message: string;
  createdAt: string;
};

type Bin = {
  id: string;
  bin_code: string;
  zone?: string;
  sensorRecords: SensorRecord[];
  alerts?: Alert[];
};

export default function Home() {
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBins = async () => {
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bins`);
      const binsData: Bin[] = await r.json();

      // โหลด alerts ของแต่ละถัง
      for (const b of binsData) {
        const ar = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/alerts/${b.id}`
        );
        b.alerts = await ar.json();
      }

      console.log("BINS + ALERTS:", binsData);

      setBins(binsData);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBins();
    const interval = setInterval(fetchBins, 10000); // refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <h1>SmartBin Dashboard</h1>
      {loading && <p>Loading...</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: 12,
        }}
      >
        {bins.map((b) => (
          <BinCard key={b.id} bin={b} />
        ))}
      </div>
    </Layout>
  );
}
