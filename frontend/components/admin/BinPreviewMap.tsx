// @ts-nocheck
"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
// @ts-ignore
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// --- Fix Leaflet Icon ---
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

// 🟢 แก้ไข: ใช้ setView แทน flyTo และเช็คระยะห่างก่อนขยับ
function ChangeView({ lat, lng }) {
  const map = useMap();
  
  useEffect(() => {
    if (lat && lng && lat !== 0 && lng !== 0) {
       // 1. เช็คว่าตำแหน่งปัจจุบัน ต่างจากเป้าหมายไหม (ป้องกันการขยับซ้ำๆ จนสั่น)
       const current = map.getCenter();
       const dist = Math.sqrt(Math.pow(current.lat - lat, 2) + Math.pow(current.lng - lng, 2));
       
       // ถ้าห่างกันมากพอ ค่อยขยับ (0.000001 คือขยับระดับเซนติเมตร)
       if (dist > 0.000001) {
          // 🟢 ใช้ setView (ไปทันที) แทน flyTo (ค่อยๆ บิน) เพื่อแก้ปัญหาภาพสั่น
          map.setView([lat, lng], 19); // 🟢 ปรับ Zoom เป็น 19 (ซูมลึกสุดๆ เห็นหลังคาชัดเจน)
       }
    }
  }, [lat, lng, map]);

  return null;
}

export default function BinPreviewMap({ lat, lng }) {
  if (!lat || !lng) {
    return (
      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-2">
          <span>กำลังระบุพิกัด...</span>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={19} // 🟢 ตั้งค่าเริ่มต้นเป็น 19
      style={{ height: "100%", width: "100%" }}
      zoomControl={false} 
      dragging={true}     
      scrollWheelZoom={false} 
      doubleClickZoom={false}
      touchZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap'
      />
      
      <Marker position={[lat, lng]}>
        <Popup>📍 จุดติดตั้งตรงนี้</Popup>
      </Marker>

      <ChangeView lat={lat} lng={lng} />
    </MapContainer>
  );
}