"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Layout from "../../../components/shared/Layout";
import NotificationBell from "../../../components/admin/NotificationBell";
import AddBinModal from "../../../components/admin/AddBinModal";
import { fetchRecentAlerts } from "../../../lib/api";
// 🟢 1. Import 'Toaster' เพิ่มเข้ามาครับ
import toast, { Toaster } from "react-hot-toast";

const AdminMapLeaflet = dynamic(
  () => import("../../../components/admin/AdminMapLeaflet"),
  { ssr: false }
);

export default function AdminMap() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const [bins, setBins] = useState([]);
  const [creating, setCreating] = useState(false);
  const [newPos, setNewPos] = useState<any>(null);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
// 🟢 1. เพิ่ม State เก็บตำแหน่งแอดมิน
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  async function loadBins() {
    try {
      const res = await fetch(`${API_URL}/api/bins/public`);
      const data = await res.json();
      setBins(data);
    } catch (error) {
      console.error("Failed to load bins", error);
    }
  }

  async function loadAlerts() {
    try {
      const alerts = await fetchRecentAlerts();
      setRecentAlerts(alerts);
    } catch (error) {
      console.error("Failed to load alerts");
    }
  }

  useEffect(() => {
    loadBins();
    loadAlerts();
    // 🟢 2. เพิ่มการหาพิกัด GPS ตรงนี้
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        console.log("Admin Location:", pos.coords.latitude, pos.coords.longitude);
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        });
        }
  }, []);
  

  useEffect(() => {
    if (newPos && creating) {
      setIsModalOpen(true);
    }
  }, [newPos, creating]);

  const handleSubmitModal = async (formData: any) => {
    if (!newPos) return;

    const payload = {
      latitude: newPos.lat,
      longitude: newPos.lng,
      zone: formData.zone,
      sensor_type: formData.sensor_type,
      address_note: formData.address_note,
      status: "active",
      is_online: true
    };

    try {
      const res = await fetch(`${API_URL}/api/bins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        toast.error("สร้างถังล้มเหลว! (ชื่ออาจซ้ำ)");
        return;
      }

      // 🟢 2. แก้ข้อความแจ้งเตือนตรงนี้ครับ
      toast.success("สร้างถังขยะสำเร็จเรียบร้อย");
      
      setIsModalOpen(false);
      setCreating(false);
      setNewPos(null);
      loadBins();
      
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCreating(false);
    setNewPos(null);
  };

  return (
    <Layout title="แผนที่ถังขยะ">
      
      {/* 🟢 3. วาง <Toaster /> ไว้ตรงนี้ เพื่อให้แจ้งเตือนเด้งขึ้นมาได้ */}
      <Toaster position="top-center" reverseOrder={false} />

      <AddBinModal 
        key={`${newPos?.lat}-${newPos?.lng}`}
        isOpen={isModalOpen}
        lat={newPos?.lat || 0}
        lng={newPos?.lng || 0}
        onClose={handleCloseModal}
        onSubmit={handleSubmitModal}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
            </svg>
            SmartBin Map
          </h1>
          <p className="text-slate-500 text-sm ml-10">จัดการตำแหน่งจุดติดตั้งถังขยะ</p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <NotificationBell alerts={recentAlerts} />
          <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

          {creating ? (
             <div className="flex items-center bg-amber-50 text-amber-700 px-4 py-2 rounded-xl border border-amber-200 animate-pulse">
                <span className="text-sm font-bold mr-2">📍 กรุณาคลิกบนแผนที่</span>
                <button 
                  onClick={handleCloseModal} 
                  className="text-xs bg-white border border-amber-300 px-2 py-1 rounded hover:bg-amber-100"
                >
                  ยกเลิก
                </button>
             </div>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              เพิ่มหมุด (สร้างถัง)
            </button>
          )}
        </div>
      </div>
      
      <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative z-0 h-[70vh]">
        <AdminMapLeaflet
            bins={bins}
            creating={creating}
            onSelectPos={(lat: any, lng: any) => setNewPos({ lat, lng })}
            // 🟢 3. ส่งค่า userLocation ไปให้แผนที่
            userLocation={userLocation}
        />
      </div>
    </Layout>
  );
}