import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'; // ต้องลง npm install js-cookie @types/js-cookie ก่อนนะครับ

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🔥 Mock Login ง่ายๆ (ของจริงต้องเช็คกับ Database)
    if (password === "admin1234") { 
      // 1. ฝัง Cookie "admin_token" (บัตรผ่าน)
      Cookies.set('admin_token', 'true', { expires: 1 }); // อายุ 1 วัน
      
      // 2. พาเข้า Dashboard
      router.push('/admin');
    } else {
      alert("รหัสผ่านไม่ถูกต้อง!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm border border-slate-100">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            🔒
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Login</h1>
          <p className="text-slate-500 text-sm">เฉพาะเจ้าหน้าที่เท่านั้น</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              type="password" 
              placeholder="รหัสผ่าน (admin1234)" 
              className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
            เข้าสู่ระบบ
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-slate-400 hover:text-emerald-600">← กลับหน้าหลัก</a>
        </div>
      </div>
    </div>
  );
}