import React, { useState, useRef, useEffect } from 'react';

// ฟังก์ชันแปลงวันที่
const formatTime = (isoString: string) => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return date.toLocaleString('en-US', { 
    hour12: true, 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    second: 'numeric' 
  });
};

export default function NotificationBell({ alerts }: { alerts: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ปิด Dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const hasNewAlerts = alerts && alerts.length > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* --- 🔔 ปุ่มกระดิ่ง --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-3 rounded-full border shadow-sm transition-all active:scale-95
          ${isOpen ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white hover:bg-gray-100 border-gray-200 text-gray-600'}
        `}
      >
         {/* รูปกระดิ่ง */}
        <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.1769 10.2448L14.7519 5.1178C14.3342 3.6158 13.4264 2.29652 12.1729 1.36966C10.9193 0.442793 9.39191 -0.0384572 7.83346 0.00240287C6.275 0.043263 4.77491 0.603888 3.57165 1.59516C2.36839 2.58644 1.53101 3.95148 1.19261 5.4733L0.0893565 10.4346C-0.032507 10.9828 -0.0296895 11.5513 0.0976011 12.0983C0.224892 12.6453 0.473405 13.1567 0.824793 13.5947C1.17618 14.0328 1.62147 14.3863 2.12779 14.6293C2.63411 14.8722 3.18852 14.9983 3.75011 14.9983H4.58561C4.75774 15.846 5.21765 16.6082 5.88741 17.1556C6.55717 17.703 7.39559 18.0021 8.26061 18.0021C9.12562 18.0021 9.96404 17.703 10.6338 17.1556C11.3036 16.6082 11.7635 15.846 11.9356 14.9983H12.5641C13.1422 14.9983 13.7125 14.8647 14.2304 14.6079C14.7483 14.351 15.1999 13.9779 15.5497 13.5177C15.8996 13.0575 16.1383 12.5226 16.2472 11.9548C16.3561 11.3871 16.3316 10.8018 16.1769 10.2448ZM8.26061 16.4983C7.79691 16.4964 7.34513 16.3512 6.96708 16.0827C6.58903 15.8142 6.30317 15.4355 6.14861 14.9983H10.3726C10.218 15.4355 9.93218 15.8142 9.55413 16.0827C9.17608 16.3512 8.7243 16.4964 8.26061 16.4983ZM14.3551 12.6096C14.1461 12.8868 13.8753 13.1115 13.5643 13.2658C13.2533 13.4201 12.9105 13.4997 12.5634 13.4983H3.75011C3.4132 13.4982 3.0806 13.4225 2.77686 13.2767C2.47313 13.1309 2.20601 12.9188 1.99523 12.656C1.78444 12.3931 1.63538 12.0863 1.55903 11.7582C1.48268 11.43 1.481 11.0889 1.55411 10.7601L2.65661 5.79805C2.92237 4.60271 3.58009 3.53051 4.5252 2.75189C5.47031 1.97327 6.64858 1.53293 7.87269 1.50086C9.0968 1.4688 10.2965 1.84684 11.2811 2.5749C12.2657 3.30297 12.9786 4.33926 13.3066 5.51905L14.7316 10.6461C14.8258 10.9801 14.8408 11.3315 14.7754 11.6723C14.7101 12.0131 14.5661 12.334 14.3551 12.6096Z" fill="#060D26"/>
</svg>

        
        {/* จุดแดงแจ้งเตือน */}
        {hasNewAlerts && (
          <span className="absolute top-2 right-2 h-3 w-3 rounded-full bg-red-500 border-2 border-white animate-pulse"></span>
        )}
      </button>

      {/* --- 📦 Dropdown ตารางแจ้งเตือน --- */}
      {isOpen && (
        <>
          {/* 🌑 Overlay ฉากหลังมืด (เฉพาะมือถือ) เพื่อให้แตะปิดง่าย */}
          <div className="fixed inset-0 bg-black/30 z-[9998] md:hidden" onClick={() => setIsOpen(false)}></div>

          {/* ตัวกล่อง Popup */}
          <div className={`
            bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] overflow-hidden flex flex-col
            
            /* 📱 Mobile: ลอยกลางจอ + กว้างเกือบเต็มจอ */
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-h-[70vh]
            
            /* 💻 PC: ลอยติดปุ่มด้านขวา + กว้าง 650px */
            md:absolute md:top-full md:left-auto md:right-0 md:translate-x-0 md:translate-y-3 md:w-[650px] md:max-h-[500px]
          `}>
            
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm md:text-base">
                <span className="text-red-500">🔔</span> แจ้งเตือนล่าสุด
              </h3>
              <span className="text-xs text-white bg-red-500 px-2 py-0.5 rounded-full font-bold">
                {alerts.length}
              </span>
            </div>

            {/* Table Content (ใส่ overflow-x-auto ให้เลื่อนซ้ายขวาได้ในมือถือ) */}
            <div className="overflow-y-auto custom-scrollbar bg-white flex-1">
              <div className="overflow-x-auto"> {/* 👈 ตัวช่วยสำหรับมือถือ */}
                {alerts.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    <span>ไม่มีการแจ้งเตือนใหม่</span>
                  </div>
                ) : (
                  <table className="w-full text-left text-xs md:text-sm min-w-[600px]">
                    <thead className="bg-gray-50 text-gray-600 sticky top-0 z-0">
                      <tr>
                        <th className="py-3 px-4 font-semibold w-[140px]">Time</th>
                        <th className="py-3 px-4 font-semibold w-[100px]">Bin</th>
                        <th className="py-3 px-4 font-semibold w-[80px]">Zone</th>
                        <th className="py-3 px-4 font-semibold w-[120px]">Type</th>
                        <th className="py-3 px-4 font-semibold">Message</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {alerts.map((alert, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 text-gray-500 whitespace-nowrap align-top">
                            {formatTime(alert.created_at)}
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-900 align-top">
                            {alert.bin?.bin_code || 'Unknown'}
                          </td>
                          <td className="py-3 px-4 text-gray-600 align-top">
                            {alert.bin?.zone || '-'}
                          </td>
                          <td className="py-3 px-4 align-top">
                            <span className={`px-2 py-1 rounded-md text-[10px] md:text-xs font-bold border
                              ${alert.alert_type === 'fire' ? 'bg-red-50 text-red-600 border-red-100' : 
                                alert.alert_type === 'full' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                                'bg-yellow-50 text-yellow-700 border-yellow-100'}
                            `}>
                              {alert.alert_type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-700 align-top">
                            {alert.message}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-3 bg-gray-50 border-t border-gray-100 text-center sticky bottom-0 z-10 md:hidden">
               <button onClick={() => setIsOpen(false)} className="text-gray-500 text-sm font-medium">ปิดหน้าต่าง</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}