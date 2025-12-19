import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- 🎨 ชุดไอคอน ---
const iconNormal = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconFull = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// 1. ตัวช่วยสั่งแผนที่บินไปหาพิกัด (Auto-Fly)
function FlyToLocation({ location }: { location: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo(location, 16, { animate: true, duration: 1.5 });
    }
  }, [location, map]);
  return null;
}

// 🟢 2. ปุ่มกดเพื่อกลับมาจุดปัจจุบัน (เปลี่ยนเป็นไอคอน Minimal)
function LocationButton({ location }: { location: [number, number] | null }) {
  const map = useMap();

  const handleCenter = () => {
    if (location) {
      map.flyTo(location, 16, { animate: true, duration: 1 });
    } else {
      alert("กำลังค้นหาพิกัด GPS ของคุณ...");
    }
  };

  return (
    <div className="leaflet-bottom leaflet-right" style={{ marginBottom: '20px', marginRight: '10px', pointerEvents: 'auto', zIndex: 999 }}>
       <button 
         onClick={handleCenter}
         // ลบ text-2xl ออก เพราะเราใช้ SVG แล้ว
         className="bg-white w-12 h-12 rounded-full shadow-md border border-slate-100 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all group"
         title="กลับไปจุดปัจจุบัน"
       >
         {/* ไอคอน Minimal (Target) */}
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 group-hover:text-indigo-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="22" y1="12" x2="18" y2="12"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="22" x2="12" y2="18"></line>
         </svg>
       </button>
    </div>
  );
}

type Props = {
  userLocation: [number, number] | null;
  bins: any[];
  onReportClick: (bin: any) => void;
};

export default function CitizenMapLeaflet({ userLocation, bins, onReportClick }: Props) {
  const defaultCenter: [number, number] = [13.7563, 100.5018]; 

  return (
    <MapContainer 
      // @ts-ignore
      center={userLocation || defaultCenter} 
      zoom={14} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      <FlyToLocation location={userLocation} />
      <LocationButton location={userLocation} />

      {userLocation && (
        <Marker position={userLocation} icon={userIcon}>
          <Popup>📍 คุณอยู่ที่นี่</Popup>
        </Marker>
      )}

      {bins.map((bin, index) => {
        const lat = bin.latitude || bin.lat;
        const lng = bin.longitude || bin.lng;
        if (!lat || !lng) return null;

        const name = bin.location || bin.zone || `Bin-${bin.id}`;
        const isBinFull = String(bin.status).toLowerCase() === 'full' || bin.is_full === true;
        const capacity = bin.capacity || "60 ลิตร";
        const binCode = bin.code || bin.bin_code || `BIN-0${bin.id || index + 1}`;

        return (
          <Marker 
            key={bin.id || index} 
            position={[lat, lng]} 
            icon={isBinFull ? iconFull : iconNormal}
          >
            <Popup className="custom-popup">
              <div className="min-w-[260px] font-kanit">
                <div className="flex items-start gap-3 border-b border-gray-100 pb-3 mb-3">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 
                     ${isBinFull ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      🗑️
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight">ข้อมูลถังขยะ</h3>
                      <p className={`text-xs font-bold mt-1 ${isBinFull ? 'text-red-500' : 'text-emerald-500'}`}>
                        {isBinFull ? '⚠️ ถังเต็ม / ต้องการการดูแล' : '✅ สถานะปกติ'}
                      </p>
                   </div>
                </div>
                <div className="space-y-2 text-sm text-slate-600 mb-4">
                   <div className="flex justify-between">
                      <span className="text-slate-400">รหัสถัง:</span>
                      <span className="font-bold text-slate-700">{binCode}</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-slate-400">ความจุถัง:</span>
                      <span className="font-medium">{capacity}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-slate-400">ปริมาณขยะ:</span>
                      <span className={`font-bold ${isBinFull ? 'text-red-500' : 'text-emerald-500'}`}>
                        {isBinFull ? '100% (เต็ม)' : '45%'}
                      </span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-slate-400">ตำแหน่ง:</span>
                      <span className="font-medium text-right max-w-[150px] truncate">{name}</span>
                   </div>
                </div>
                <button 
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-2.5 rounded-xl font-bold shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 active:scale-95"
                  onClick={() => onReportClick(bin)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  แจ้งปัญหา
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}