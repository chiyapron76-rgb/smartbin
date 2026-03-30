//####✨SideBar✨####
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Sidebar from "./Sidebar"; // เปลี่ยน path ให้ตรงกับโครงสร้างจริงของคุณ
import Breadcrumbs from './Breadcrumbs'; // เปลี่ยน path ให้ตรง

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

export default function Layout({ children, title = "Smart Bin Dashboard" }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setIsSidebarOpen(false);
      } else {
        setIsMobile(false);
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 font-kanit">
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} isMobile={isMobile} />

      {/* ส่วนเนื้อหาหลัก (Main Layout) */}
      <div className={`flex-1 transition-all duration-300 ease-in-out min-w-0 flex flex-col
          ${isMobile ? 'ml-0' : (isSidebarOpen ? 'ml-[280px]' : 'ml-[80px]')}
      `}>
        
        {/* Mobile Header (แสดงเฉพาะมือถือ) */}
        <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-30">
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
           </button>
           <span className="font-bold text-lg text-slate-800">SmartBin</span>
           <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-bold">AD</div>
        </div>

        {/* เนื้อหาจริง */}
        <main className="flex-1 p-4 lg:p-8 max-w-[1600px] mx-auto w-full">
          
          {/* 🟢 Breadcrumbs วางที่นี่ (บนสุดของเนื้อหา) */}
          <div className="mb-6">
            <Breadcrumbs />
          </div>

          {/* Children (เนื้อหาของแต่ละหน้า) */}
          {children}
        </main>

      </div>
    </div>
  );
}