import React from 'react';

type Props = {
  total_bins: number;
  counts_by_device_status: Record<string, number>;
  avg_fill?: number | null;
  avg_battery?: number | null;
  alerts_today: number;
};

export default function SummaryBar(props: Props) {
  const { total_bins, counts_by_device_status, alerts_today } = props;

  // กำหนดข้อมูลการ์ด และธีมสี (ใช้ชื่อสีเพื่อไปแมพกับ Gradient ด้านล่าง)
  const cards = [
    { 
      label: "จำนวนถังทั้งหมด", 
      value: total_bins, 
      color: "blue" 
    },
    { 
      label: "จำนวนถังที่ใช้งานได้", 
      value: counts_by_device_status?.active ?? 0, 
      color: "emerald" // สีเขียว (ทำงานปกติ)
    },
    { 
      label: "จำนวนถังที่ออฟไลน์", 
      value: counts_by_device_status?.offline ?? 0, 
      color: "orange" 
    },
    { 
      label: "จำนวนการแจ้งเตือนความผิดปกติ", 
      value: alerts_today, 
      color: "red" 
    }
  ];

  // ฟังก์ชันช่วยเลือกสี Gradient ของเส้นคลื่น
  const getGradient = (color: string) => {
    switch (color) {
      case 'blue': return ['#60A5FA', '#3B82F6'];    // ฟ้า
      case 'emerald': return ['#34D399', '#10B981']; // เขียว
      case 'orange': return ['#FB923C', '#F97316'];  // ส้ม
      case 'red': return ['#F87171', '#EF4444'];     // แดง
      default: return ['#94A3B8', '#64748B'];       // เทา
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const [stop1, stop2] = getGradient(card.color);
        const gradientId = `wave-gradient-${index}`; // ID ห้ามซ้ำกัน

        return (
          <div 
            key={index} 
            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] relative overflow-hidden h-[150px] flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300"
          >
            {/* 1. หัวข้อ (Label) */}
            <p className="text-slate-400 text-[16px] font-medium ml-1">
              {card.label}
            </p>

            {/* 2. ตัวเลข (Value) */}
            <h3 className="text-5xl font-bold text-slate-800 tracking-tight z-10">
              {card.value}
            </h3>

            {/* 3. กราฟเส้นคลื่น (Wave SVG) */}
            <div className="absolute bottom-4 right-0 w-32 h-16 opacity-90 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M0 50 C 30 50, 40 20, 70 35 S 100 10, 120 20" 
                  stroke={`url(#${gradientId})`} 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  fill="none"
                />
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={stop1} stopOpacity="0.2" />
                    <stop offset="50%" stopColor={stop1} stopOpacity="1" />
                    <stop offset="100%" stopColor={stop2} stopOpacity="1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}