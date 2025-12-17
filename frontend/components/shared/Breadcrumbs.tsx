import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Breadcrumbs() {
  const router = useRouter();
  
  // 1. เช็คว่าอยู่หน้า Citizen หรือไม่
  const isCitizen = router.pathname.startsWith('/citizen');

  const asPathWithoutQuery = router.asPath.split("?")[0];
  const asPathNestedRoutes = asPathWithoutQuery.split("/").filter((v) => v.length > 0);

  const pathTranslations: { [key: string]: string } = {
    admin: "ระบบจัดการ",
    citizen: "บริการประชาชน",
    bins: "จัดการถังขยะ",
    dashboard: "แดชบอร์ด",
    tasks: "มอบหมายงาน",
    map: "แผนที่",
    reports: "รายงาน",
    create: "เพิ่มข้อมูล",
    edit: "แก้ไขข้อมูล",
    history: "ประวัติการแจ้ง",
    rating: "ให้คะแนน",
  };

  const getLabel = (segment: string) => {
    if (segment.length > 20 || segment.includes("-")) {
      return "รายละเอียด"; 
    }
    return pathTranslations[segment] || segment;
  };

  // 🟢 2. แก้ลิงก์ Home ให้ถูกต้อง
  // - ถ้าเป็น Citizen -> ไป /citizen
  // - ถ้าเป็น Admin -> ไป /admin (ตามที่คุณบอก)
  const homeHref = isCitizen ? "/citizen" : "/admin";
  const homeLabel = isCitizen ? "หน้าหลัก" : "ระบบจัดการ";

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        
        {/* ปุ่ม Home */}
        <li className="inline-flex items-center">
          <Link href={homeHref} legacyBehavior>
            <a className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              {homeLabel}
            </a>
          </Link>
        </li>

        {asPathNestedRoutes.map((subpath, idx) => {
          // ซ่อนคำว่า admin หรือ citizen ใน breadcrumb text เพื่อไม่ให้ซ้ำกับปุ่ม Home
          if (subpath === 'admin' && !isCitizen) return null;
          if (subpath === 'citizen' && isCitizen) return null;

          const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
          const isLast = idx === asPathNestedRoutes.length - 1;
          const label = getLabel(subpath);

          return (
            <li key={subpath}>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                
                {isLast ? (
                  <span className="ml-1 text-sm font-bold text-slate-700 md:ml-2">
                    {label}
                  </span>
                ) : (
                  <Link href={href} legacyBehavior>
                    <a className="ml-1 text-sm font-medium text-slate-500 hover:text-emerald-600 md:ml-2 transition-colors">
                      {label}
                    </a>
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}