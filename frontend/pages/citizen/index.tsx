import React from 'react';
import Link from 'next/link';
import Layout from '../../components/shared/Layout'; // ใช้ Layout ตัวเดิมเพื่อให้มี Header/Hamburger

export default function CitizenPortal() {
  
  // รายการเมนูตามรูปภาพ
  const menuItems = [
    {
      title: "เลือกถังขยะ",
      description: "ค้นหาถังใกล้เคียงและแจ้งปัญหา",
      href: "/citizen/bins", // ลิงก์ไปหน้าแผนที่ (เดี๋ยวค่อยสร้าง)
    },
    {
      title: "ประวัติการแจ้งปัญหา",
      description: "ดูสถานะการแจ้งที่คุณเคยส่ง",
      href: "/citizen/my-reports", // ลิงก์ไปหน้าประวัติ
    },
    {
      title: "ให้คะแนนการใช้งาน",
      description: "ประเมินความพึงพอใจต่อระบบ",
      href: "/citizen/rate", // ลิงก์ไปหน้าประเมิน
    }
  ];

  return (
    <Layout title="Citizen Portal">
      
      {/* หัวข้อหน้า */}
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6">
        Citizen Portal
      </h1>

      {/* รายการเมนู (Cards) */}
      <div className="space-y-4">
        {menuItems.map((item, index) => (
          <Link href={item.href} legacyBehavior key={index}>
            <a className="block bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all active:scale-[0.98]">
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                {item.description}
              </p>
            </a>
          </Link>
        ))}
      </div>

    </Layout>
  );
}