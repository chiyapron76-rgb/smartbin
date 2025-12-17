// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
// 🟢 1. Import 'useMap' เพิ่มเข้ามาครับ
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// --- Fix Leaflet Icon ---
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

// 🟢 2. ไอคอนคน (สีฟ้า) ที่คุณต้องการ
const userIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// 🟢 3. สร้าง Component พิเศษสำหรับ "บิน" ไปหาตำแหน่ง
function FlyToLocation({ location }) {
  const map = useMap(); // เรียกใช้ตัวแผนที่

  useEffect(() => {
    if (location) {
      // สั่งให้บินไปที่พิกัด (flyTo จะสมูทกว่า setView)
      map.flyTo(location, 15, {
        animate: true,
        duration: 1.5 // ระยะเวลาบิน (วินาที)
      });
    }
  }, [location, map]);

  return null;
}

// Component ดักจับคลิก (อันเดิม)
function MapClickHandler({ creating, onSelectPos, setTempPos }) {
  const map = useMapEvents({
    click(e) {
      if (!creating) return;
      const { lat, lng } = e.latlng;
      setTempPos([lat, lng]); 
      onSelectPos(lat, lng);  
    },
  });

  useEffect(() => {
    if (creating) {
      map.getContainer().style.cursor = "crosshair";
    } else {
      map.getContainer().style.cursor = "";
    }
  }, [creating, map]);

  return null;
}

export default function AdminMapLeaflet({ bins = [], creating, onSelectPos, userLocation }) {
  const [tempPos, setTempPos] = useState(null);

  useEffect(() => {
    if (!creating) {
      setTempPos(null);
    }
  }, [creating]);

  return (
    <MapContainer
      center={userLocation || [13.736717, 100.523186]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        attribution='&copy; OpenStreetMap contributors'
      />

      {/* 🟢 4. เรียกใช้ตัวช่วยบิน (ใส่ไว้ใน MapContainer) */}
      <FlyToLocation location={userLocation} />

      {/* แสดงหมุดตำแหน่งแอดมิน */}
      {userLocation && (
        <Marker position={userLocation} icon={userIcon}>
          <Popup>
            <div className="text-center font-sans">
              <b className="text-indigo-600">📍 ตำแหน่งของคุณ</b><br/>
              <span className="text-xs text-slate-500">Admin GPS</span>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Loop แสดงหมุดถังขยะ */}
      {bins.map((bin) => {
        const isStatusError = bin.status !== 'active';
        const isSensorError = (bin.fill_level > 100);
        const isError = isStatusError || isSensorError;

        let statusColor = "text-emerald-600";
        if (isError) statusColor = "text-red-500";
        else if (bin.fill_level >= 80) statusColor = "text-orange-500";

        return (
          <Marker key={bin.id} position={[bin.lat, bin.lng]}>
            <Popup className="custom-popup-clean">
              <div className="min-w-[240px] p-2 font-sans">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isError ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 m-0 leading-none">ข้อมูลถังขยะ</h3>
                    <span className={`text-xs font-bold ${isError ? 'text-red-500' : 'text-emerald-600'}`}>
                      {isError ? 'ต้องการการดูแล' : 'สถานะปกติ'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">รหัสถัง:</span>
                    <span className="text-slate-800 font-bold bg-slate-100 px-2 py-0.5 rounded text-xs">
                      {bin.code}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">ความจุถัง:</span>
                    <span className="text-slate-700 font-medium">60 ลิตร</span> 
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-slate-500 font-medium">ปริมาณขยะ:</span>
                     <span className={`font-bold text-base ${statusColor}`}>
                       {isError ? 'Error' : `${bin.fill_level}%`}
                     </span>
                  </div>
                  <div className="flex justify-between items-start">
                     <span className="text-slate-500 font-medium">ตำแหน่ง:</span>
                     <span className="text-slate-700 text-right max-w-[140px] leading-tight font-medium">
                       {bin.zone || "-"}
                     </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-100 mt-2">
                     <span className="text-slate-400 text-xs font-medium">แบตเตอรี่:</span>
                     <div className="flex items-center gap-1.5">
                        <div className="w-5 h-2.5 border border-slate-300 rounded-[2px] relative p-[1px]">
                          <div className="h-full bg-emerald-500 w-[85%] rounded-[1px]"></div>
                        </div>
                        <span className="text-slate-500 text-xs">85%</span>
                     </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {tempPos && creating && (
        <Marker position={tempPos}>
          <Popup>📍 ตำแหน่งที่เลือก</Popup>
        </Marker>
      )}

      <MapClickHandler 
        creating={creating} 
        onSelectPos={onSelectPos} 
        setTempPos={setTempPos} 
      />
    </MapContainer>
  );
}