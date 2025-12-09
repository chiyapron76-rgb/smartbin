import React from "react";
import Link from "next/link";
import Head from "next/head";

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>Smart waste</title>
      </Head>

      {/* Background Gradient */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 flex flex-col justify-center items-center p-6 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-green-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl w-full flex flex-col items-center">
          {/* --- Hero Section --- */}
          <div className="text-center mb-16 animate-fade-in-down">
            <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-6 border border-slate-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4">
              Smart<span className="text-green-600">Waste</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-lg mx-auto leading-relaxed">
              ระบบจัดการขยะอัจฉริยะเพื่อเมืองที่ยั่งยืน
              <br />
              กรุณาเลือกส่วนงานที่คุณต้องการเข้าถึง
            </p>
          </div>

          {/* --- Role Selection Cards --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
            {/* Admin Card */}
            <Link href="/admin/maps" legacyBehavior>
              <a className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-blue-200 hover:-translate-y-1 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-32 w-32 text-blue-600 transform rotate-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"
                    />
                  </svg>
                </div>

                <div className="relative z-10">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
                    Admin Portal
                  </h2>
                  <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                    ระบบจัดการส่วนกลาง ดู Dashboard ภาพรวม
                    <br />
                    ตรวจสอบสถานะ และจัดการอุปกรณ์
                  </p>

                  <span className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                    เข้าสู่ระบบ
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
              </a>
            </Link>

            {/* Collector Card */}
            {/* <Link href="/collector" legacyBehavior>
              <a className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-green-200 hover:-translate-y-1 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-32 w-32 text-green-600 transform -rotate-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                    />
                  </svg>
                </div>

                <div className="relative z-10">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-green-700 transition-colors">
                    Collector App
                  </h2>
                  <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                    สำหรับพนักงานขับรถเก็บขยะ
                    <br />
                    ดูรายการงาน เส้นทาง และจุดที่ต้องเข้าเก็บ
                  </p>

                  <span className="inline-flex items-center text-sm font-semibold text-green-600 group-hover:translate-x-1 transition-transform">
                    เข้าใช้งาน
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
              </a>
            </Link> */}
            <Link href="/citizen" legacyBehavior>
              <a className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-yellow-200 hover:-translate-y-1 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-32 w-32 text-yellow-600 rotate-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4h16v16H4z"
                    />
                  </svg>
                </div>

                <div className="relative z-10">
                  <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-yellow-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
                      />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-yellow-700 transition-colors">
                    Citizen Portal
                  </h2>
                  <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                    สำหรับประชาชนทั่วไป แจ้งปัญหาเกี่ยวกับจุดทิ้งขยะ
                    <br />
                    และตรวจสอบสถานะการแจ้งของคุณ
                  </p>

                  <span className="inline-flex items-center text-sm font-semibold text-yellow-600 group-hover:translate-x-1 transition-transform">
                    เข้าใช้งาน
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
              </a>
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <p className="text-slate-400 text-sm font-medium">
              © 2025 SmartBin Project. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
