import React from 'react';
import Layout from '../../components/shared/Layout';
import Link from 'next/link';

export default function CitizenHome() {
  
  // เมนูสำหรับประชาชน (ตัดข้อมูลขยะออก เหลือ 2 ปุ่มสวยๆ)
  const menuItems = [
    {
      title: "ประวัติการแจ้ง",
      subtitle: "ติดตามสถานะงาน",
      icon: "clock", 
      emoji: "📋",
      color: "bg-blue-500",
      shadow: "shadow-blue-200",
      href: "/citizen/my-reports"
    },
    {
      title: "ให้คะแนนบริการ",
      subtitle: "ประเมินความพึงพอใจ",
      icon: "star",
      emoji: "⭐",
      color: "bg-orange-400",
      shadow: "shadow-orange-200",
      href: "/citizen/rate" 
    }
  ];

  return (
    <Layout title="บริการประชาชน">
      {/* Header ส่วนต้อนรับ */}
      <div className="mb-6 mt-2">
        <h1 className="text-2xl font-bold text-slate-800">สวัสดีครับ 👋</h1>
        <p className="text-slate-500">ช่วยกันดูแลเมืองให้น่าอยู่ เริ่มต้นที่ตัวเรา</p>
      </div>

      {/* Hero Card (ปุ่มใหญ่สุด) - แจ้งปัญหาด่วน */}
      <Link href="/citizen/map" legacyBehavior>
        <a className="block w-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-6 shadow-xl shadow-emerald-100 mb-8 transform transition-all active:scale-95 text-white relative overflow-hidden group">
           <div className="absolute right-[-20px] bottom-[-20px] text-[120px] opacity-20 rotate-12 group-hover:rotate-0 transition-transform">
             🗑️
           </div>
           <div className="relative z-10">
             <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 backdrop-blur-sm">
               📍
             </div>
             <h2 className="text-2xl font-bold mb-1">แจ้งปัญหาขยะ</h2>
             <p className="text-emerald-50 opacity-90">พบขยะล้นถัง ถังเสีย หรือส่งกลิ่นเหม็น <br/> แจ้งพิกัดให้เจ้าหน้าที่ทราบทันที</p>
             <div className="mt-4 inline-block bg-white text-emerald-600 px-4 py-2 rounded-full text-sm font-bold">
               คลิกเพื่อแจ้งเหตุ →
             </div>
           </div>
        </a>
      </Link>

      {/* Grid Menu (เหลือ 2 ปุ่ม วางคู่กันพอดีเป๊ะ) */}
      <h3 className="text-lg font-bold text-slate-800 mb-4">บริการอื่นๆ</h3>
      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item, index) => (
          <Link key={index} href={item.href} legacyBehavior>
            <a className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-95 flex flex-col justify-between h-[160px]">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${item.color} text-white shadow-lg ${item.shadow}`}>
                {item.emoji}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{item.subtitle}</p>
              </div>z
            </a>
          </Link>
        ))}
      </div>

      {/* Footer เล็กๆ
      <div className="mt-10 text-center text-xs text-slate-300">
        SmartBin Application v1.0
      </div> */}
    </Layout>
  );
}