import { useState } from "react";
import { createAppRating } from "../../lib/api";
import Layout from "../../components/shared/Layout";
import { useRouter } from "next/router";

export default function CitizenRatePage() {
  const router = useRouter();
  const { device_uuid } = router.query;

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [platform] = useState<"web" | "mobile">("web");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await createAppRating({
        device_uuid:
          typeof device_uuid === "string" ? device_uuid : undefined,
        rating,
        comment,
        platform,
        app_version: "web-0.1",
        device_info: navigator.userAgent,
      });

      alert("ขอบคุณสำหรับคะแนนของคุณ!");

      router.push("/citizen/my-reports");
    } catch (err) {
      alert("ส่งคะแนนไม่สำเร็จ");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">ให้คะแนนแอป</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
          <div className="mb-4">
            <label className="block font-semibold mb-2">คะแนน (1–5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setRating(n)}
                  className={`px-3 py-1 rounded ${
                    rating === n ? "bg-yellow-400" : "bg-gray-200"
                  }`}
                >
                  {n} ★
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">
              ความเห็นเพิ่มเติม (ไม่บังคับ)
            </label>
            <textarea
              className="w-full border p-2 rounded"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "กำลังส่ง..." : "ส่งคะแนน"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
