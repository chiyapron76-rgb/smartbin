import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import BinCard from "../components/BinCard";

type SensorRecord = {
  distance_cm: number;
  fill_percentage: number;
  battery_voltage: number;
  timestamp: string;
};

type Bin = {
  id: string;
  bin_code: string;
  zone?: string;
  sensorRecords: SensorRecord[];
};

export default function Home() {
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBins = async () => {
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bins`);
      const data = await r.json();

      console.log("API RESULT:", data);

      setBins(data);
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
