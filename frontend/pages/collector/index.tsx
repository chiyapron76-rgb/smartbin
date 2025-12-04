// ไฟล์: pages/collector/index.tsx
import React from 'react';
import Layout from '../../components/shared/Layout';// ถอยหลัง 2 ทีเพื่อหา components

export default function CollectorDashboard() {
  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Collector Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600">
            หน้านี้สำหรับพนักงานเก็บขยะ (Collector)<br />
            รายการงาน (Tasks) จะย้ายมาแสดงที่นี่เร็วๆ นี้
          </p>
        </div>
      </div>
    </Layout>
  );
}