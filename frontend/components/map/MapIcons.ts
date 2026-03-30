import L from 'leaflet';

// 🟡 ไอคอนถังขยะ (สีเหลือง - เหมือนในรูป Admin)
export const binIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/787/787535.png', // รูปหมุดสีเหลือง/ส้ม
  iconSize: [35, 35],     // ขนาด
  iconAnchor: [17, 35],   // จุดชี้ (ปลายหมุด)
  popupAnchor: [0, -35],  // จุดที่ Popup เด้งขึ้นมา
});

// 🔵 ไอคอนตำแหน่งผู้ใช้ (สีฟ้า)
export const userIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/9356/9356230.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});