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

// Helper บินไปหาตำแหน่ง
function FlyToLocation({ location }: { location: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo(location, 15, { animate: true, duration: 1.5 });
    }
  }, [location, map]);
  return null;
}

type Props = {
  userLocation: [number, number] | null;
  bins: any[];
  onReportClick: (bin: any) => void; // ✅ เพิ่มบรรทัดนี้เพื่อรับฟังก์ชันกดปุ่ม
};

export default function CitizenMapLeaflet({ userLocation, bins, onReportClick }: Props) {

  return (
    <MapContainer 
      center={userLocation || [13.7563, 100.5018]} 
      zoom={14} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FlyToLocation location={userLocation} />

      {/* ตำแหน่งผู้ใช้ */}
      {userLocation && (
        <Marker position={userLocation} icon={userIcon}>
          <Popup>📍 คุณอยู่ที่นี่</Popup>
        </Marker>
      )}

      {/* วนลูปแสดงถังขยะ */}
      {bins.map((bin, index) => {
        const lat = bin.latitude || bin.lat;
        const lng = bin.longitude || bin.lng;
        const name = bin.location || bin.zone || `Bin-${bin.id}`;
        const status = bin.status || "active"; 
        const isFull = status === 'full';
        const battery = bin.battery || 85; 
        const capacity = bin.capacity || "60 ลิตร";
        const binCode = bin.code || `BIN-0${bin.id || index + 1}`;

        return (
          <Marker 
            key={bin.id || index} 
            position={[lat, lng]} 
            icon={isFull ? iconFull : iconNormal}
          >
            <Popup className="custom-popup">
              <div className="min-w-[280px] font-kanit">
                
                {/* Header Popup */}
                <div className="flex items-start gap-3 border-b border-gray-100 pb-3 mb-3">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 
                     ${isFull ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      🗑️
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight">ข้อมูลถังขยะ</h3>
                      <p className={`text-xs font-bold mt-1 ${isFull ? 'text-red-500' : 'text-emerald-500'}`}>
                        {isFull ? '⚠️ ถังเต็ม / ต้องการการดูแล' : '✅ สถานะปกติ'}
                      </p>
                   </div>
                </div>

                {/* Details */}
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
                      <span className={`font-bold ${isFull ? 'text-red-500' : 'text-emerald-500'}`}>
                        {isFull ? '100% (เต็ม)' : '45%'}
                      </span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-slate-400">ตำแหน่ง:</span>
                      <span className="font-medium">{name}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-slate-400">แบตเตอรี่:</span>
                      <div className="flex items-center gap-2">
                         <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${battery}%` }}></div>
                         </div>
                         <span className="text-xs text-green-600 font-bold">{battery}%</span>
                      </div>
                   </div>
                </div>

                {/* ปุ่มกดแจ้งปัญหา (เรียก function) */}
                <button 
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-bold shadow-md shadow-red-100 transition-all flex items-center justify-center gap-2 active:scale-95"
                  onClick={() => onReportClick(bin)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  แจ้งปัญหาถังนี้
                </button>

              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}