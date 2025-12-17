import React from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { binIcon, userIcon } from '../map/MapIcons'; // เรียกไอคอนจากไฟล์เดิม

// โหลด Map แบบ Dynamic
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// กำหนดว่า Map นี้รับค่าอะไรบ้าง
interface Props {
  bins: any[]; // ข้อมูลถัง
  userLocation: [number, number] | null;
  onBinClick: (bin: any) => void; // 🟢 ฟังก์ชันเมื่อกดถัง (ส่งมาจากข้างนอก)
  actionLabel: string; // 🟢 ข้อความบนปุ่ม (เช่น "แจ้งปัญหา" หรือ "แก้ไข")
  actionColor: string; // 🟢 สีปุ่ม
}

export default function SharedMap({ bins, userLocation, onBinClick, actionLabel, actionColor }: Props) {
  return (
    <div className="w-full h-full rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
      <MapContainer 
        center={userLocation || [13.7563, 100.5018]} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>📍 คุณอยู่ที่นี่</Popup>
          </Marker>
        )}

        {bins.map((bin) => (
          <Marker key={bin.id} position={[bin.lat, bin.lng]} icon={binIcon}>
            <Popup>
              <div className="text-center min-w-[150px] p-2">
                <h3 className="font-bold text-slate-800 text-lg mb-1">{bin.name}</h3>
                <div className="mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white
                      ${bin.status === 'Full' ? 'bg-red-500' : bin.status === 'Offline' ? 'bg-gray-400' : 'bg-emerald-500'}
                    `}>
                      {bin.status === 'Full' ? 'เต็ม' : bin.status === 'Offline' ? 'ออฟไลน์' : 'ปกติ'}
                    </span>
                </div>
                
                {/* 🟢 ปุ่ม Action ที่เปลี่ยนไปตามคนเรียกใช้ */}
                <button 
                  className={`w-full text-white text-sm font-bold py-2 rounded-lg transition-colors shadow-sm ${actionColor}`}
                  onClick={() => onBinClick(bin)}
                >
                  {actionLabel}
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}