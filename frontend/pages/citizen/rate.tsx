import { useState } from "react";
import { createAppRating } from "../../lib/api";
import Layout from "../../components/shared/Layout";
import { useRouter } from "next/router";
import Swal from "sweetalert2"; // ✅ ใช้ SweetAlert2 เพื่อความสวยงาม

export default function CitizenRatePage() {
  const router = useRouter();
  const { device_uuid } = router.query;

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0); // สำหรับ Effect ตอนเอาเมาส์ชี้
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [platform] = useState<"web" | "mobile">("web");

  // ข้อความประกอบคะแนน
  const getRatingLabel = (score: number) => {
    switch (score) {
      case 5: return "ยอดเยี่ยมไปเลย! 🎉";
      case 4: return "ดีมากครับ 😊";
      case 3: return "ปานกลาง 🙂";
      case 2: return "พอใช้ได้ 😐";
      case 1: return "ควรปรับปรุง 😫";
      default: return "แตะเพื่อใหัคะแนน";
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (rating === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'ลืมให้ดาวหรือเปล่า?',
        text: 'กรุณากดเลือกดาวก่อนส่งคะแนนนะคะ',
        confirmButtonColor: '#fbbf24',
        customClass: { popup: 'rounded-3xl font-kanit' }
      });
      return;
    }

    setLoading(true);

    try {
      await createAppRating({
        device_uuid: typeof device_uuid === "string" ? device_uuid : undefined,
        rating,
        comment,
        platform,
        app_version: "web-0.1",
        device_info: navigator.userAgent,
      });

      await Swal.fire({
        icon: 'success',
        title: 'ขอบคุณสำหรับคะแนน!',
        text: 'ความคิดเห็นของคุณคือกำลังใจของเรา',
        timer: 3000,
        showConfirmButton: false,
        customClass: { popup: 'rounded-3xl font-kanit' }
      });

      router.push("/citizen/my-reports");
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'ส่งไม่สำเร็จ',
        text: 'เกิดข้อผิดพลาด กรุณาลองใหม่',
        confirmButtonColor: '#ef4444',
        customClass: { popup: 'rounded-3xl font-kanit' }
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="ให้คะแนนแอป">
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[32px] shadow-xl border border-slate-100 p-8 text-center relative overflow-hidden">
          
          {/* Background Decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

          <h1 className="text-2xl font-black text-slate-800 mb-2 mt-4 relative z-10">
            ชอบ SmartBin ไหม?
          </h1>
          <p className="text-slate-500 text-sm mb-8 font-medium">
            ช่วยให้คะแนนประสบการณ์การใช้งานของคุณ <br/> เพื่อให้เราพัฒนาให้ดียิ่งขึ้น
          </p>

          <form onSubmit={handleSubmit} className="relative z-10">
            
            {/* 🌟 Star Rating Section */}
            <div className="mb-2 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-all duration-200 transform hover:scale-110 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={(hoverRating || rating) >= star ? "#fbbf24" : "#e2e8f0"} // สีเหลืองเมื่อเลือก/Hover, สีเทาเมื่อไม่เลือก
                    className={`w-12 h-12 drop-shadow-sm transition-colors duration-200 
                      ${(hoverRating || rating) >= star ? "text-yellow-400" : "text-slate-200"}`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              ))}
            </div>

            {/* คำบรรยายคะแนน (Feedback Text) */}
            <div className={`h-8 mb-6 font-bold text-lg transition-all duration-300 ${rating > 0 ? 'text-emerald-600' : 'text-slate-300'}`}>
              {getRatingLabel(hoverRating || rating)}
            </div>

            {/* 📝 Comment Section */}
            <div className="mb-6 text-left">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                ข้อเสนอแนะเพิ่มเติม (ถ้ามี)
              </label>
              <textarea
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none text-slate-600 text-sm"
                rows={4}
                placeholder="บอกเล่าปัญหา หรือสิ่งที่อยากให้เราปรับปรุง..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg shadow-emerald-200 transform active:scale-95 transition-all
                ${loading 
                  ? "bg-slate-300 cursor-not-allowed shadow-none" 
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-emerald-300 hover:-translate-y-1"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังส่งข้อมูล...
                </span>
              ) : (
                "ส่งผลประเมิน 🚀"
              )}
            </button>

          </form>
        </div>
      </div>
    </Layout>
  );
}