import { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout";
import { fetchAppRatingSummary, fetchAppRatings } from "../../lib/api";

export default function AdminRatingsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const s = await fetchAppRatingSummary();
      const list = await fetchAppRatings();
      setSummary(s);
      setRatings(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">App Ratings</h1>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="bg-white p-4 rounded shadow mb-6">
              <h2 className="font-semibold">Summary</h2>
              <p>
                Average: {summary?.avg ? Number(summary.avg).toFixed(2) : "0"}
              </p>
              <p>Total ratings: {summary?.total ?? 0}</p>
              <div className="mt-2">
                {(() => {
                  const dist: Record<string, number> =
                    summary?.distribution ?? {};

                  return Object.entries(dist).map(([rating, count]) => (
                    <div key={rating} className="flex justify-between">
                      <div>{rating} ★</div>
                      <div>{count}</div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h2 className="font-semibold mb-2">Recent feedback</h2>
              <ul>
                {ratings.map((r) => (
                  <li key={r.id} className="border-b py-2">
                    <div className="flex justify-between">
                      <div>
                        <strong>{r.rating} ★</strong> — {r.comment ?? "-"}
                        <div className="text-xs text-gray-500">
                          {r.device_uuid ?? "anonymous"} •{" "}
                          {new Date(r.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">{r.platform}</div>
                    </div>
                  </li>
                ))}
                {ratings.length === 0 && (
                  <li className="text-gray-500">No ratings yet</li>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
