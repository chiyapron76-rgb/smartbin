import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// --- Icons (เหมือนเดิม) ---
const Icons = {
  CustomDashboard: () => <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.6155 8.5C4.40267 8.5 4.22442 8.57183 4.08075 8.7155C3.93725 8.859 3.8655 9.03717 3.8655 9.25V12.5C3.8655 12.7128 3.93725 12.891 4.08075 13.0345C4.22442 13.1782 4.40267 13.25 4.6155 13.25C4.82817 13.25 5.00633 13.1782 5.15 13.0345C5.2935 12.891 5.36525 12.7128 5.36525 12.5V9.25C5.36525 9.03717 5.2935 8.859 5.15 8.7155C5.00633 8.57183 4.82817 8.5 4.6155 8.5ZM12.3845 3.5C12.1718 3.5 11.9937 3.57183 11.85 3.7155C11.7065 3.859 11.6348 4.03717 11.6348 4.25V12.5C11.6348 12.7128 11.7065 12.891 11.85 13.0345C11.9937 13.1782 12.1718 13.25 12.3845 13.25C12.5973 13.25 12.7756 13.1782 12.9193 13.0345C13.0628 12.891 13.1345 12.7128 13.1345 12.5V4.25C13.1345 4.03717 13.0628 3.859 12.9193 3.7155C12.7756 3.57183 12.5973 3.5 12.3845 3.5ZM8.5 10.5C8.28717 10.5 8.109 10.5718 7.9655 10.7155C7.82183 10.859 7.75 11.0372 7.75 11.25V12.5C7.75 12.7128 7.82183 12.891 7.9655 13.0345C8.109 13.1782 8.28717 13.25 8.5 13.25C8.71283 13.25 8.891 13.1782 9.0345 13.0345C9.17817 12.891 9.25 12.7128 9.25 12.5V11.25C9.25 11.0372 9.17817 10.859 9.0345 10.7155C8.891 10.5718 8.71283 10.5 8.5 10.5ZM1.80775 17C1.30258 17 0.875 16.825 0.525 16.475C0.175 16.125 0 15.6974 0 15.1923V1.80775C0 1.30258 0.175 0.875 0.525 0.525C0.875 0.175 1.30258 0 1.80775 0H15.1923C15.6974 0 16.125 0.175 16.475 0.525C16.825 0.875 17 1.30258 17 1.80775V15.1923C17 15.6974 16.825 16.125 16.475 16.475C16.125 16.825 15.6974 17 15.1923 17H1.80775ZM1.80775 15.5H15.1923C15.2693 15.5 15.3398 15.4679 15.4038 15.4038C15.4679 15.3398 15.5 15.2693 15.5 15.1923V1.80775C15.5 1.73075 15.4679 1.66025 15.4038 1.59625C15.3398 1.53208 15.2693 1.5 15.1923 1.5H1.80775C1.73075 1.5 1.66025 1.53208 1.59625 1.59625C1.53208 1.66025 1.5 1.73075 1.5 1.80775V15.1923C1.5 15.2693 1.53208 15.3398 1.59625 15.4038C1.66025 15.4679 1.73075 15.5 1.80775 15.5ZM8.5 8.25C8.71283 8.25 8.891 8.17817 9.0345 8.0345C9.17817 7.891 9.25 7.71283 9.25 7.5C9.25 7.28717 9.17817 7.109 9.0345 6.9655C8.891 6.82183 8.71283 6.75 8.5 6.75C8.28717 6.75 8.109 6.82183 7.9655 6.9655C7.82183 7.109 7.75 7.28717 7.75 7.5C7.75 7.71283 7.82183 7.891 7.9655 8.0345C8.109 8.17817 8.28717 8.25 8.5 8.25Z" fill="#05010E"/></svg>,
  Services: () => <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.80775 17.5C1.30258 17.5 0.875 17.325 0.525 16.975C0.175 16.625 0 16.1974 0 15.6923V5.30775C0 4.80258 0.175 4.375 0.525 4.025C0.875 3.675 1.30258 3.5 1.80775 3.5H6V1.80775C6 1.30258 6.175 0.875 6.525 0.525C6.875 0.175 7.30258 0 7.80775 0H11.1923C11.6974 0 12.125 0.175 12.475 0.525C12.825 0.875 13 1.30258 13 1.80775V3.5H17.1923C17.6974 3.5 18.125 3.675 18.475 4.025C18.825 4.375 19 4.80258 19 5.30775V15.6923C19 16.1974 18.825 16.625 18.475 16.975C18.125 17.325 17.6974 17.5 17.1923 17.5H1.80775ZM1.80775 16H17.1923C17.2693 16 17.3398 15.9679 17.4038 15.9038C17.4679 15.8398 17.5 15.7693 17.5 15.6923V5.30775C17.5 5.23075 17.4679 5.16025 17.4038 5.09625C17.3398 5.03208 17.2693 5 17.1923 5H1.80775C1.73075 5 1.66025 5.03208 1.59625 5.09625C1.53208 5.16025 1.5 5.23075 1.5 5.30775V15.6923C1.5 15.7693 1.53208 15.8398 1.59625 15.9038C1.66025 15.9679 1.73075 16 1.80775 16ZM7.5 3.5H11.5V1.80775C11.5 1.73075 11.4679 1.66025 11.4038 1.59625C11.3398 1.53208 11.2693 1.5 11.1923 1.5H7.80775C7.73075 1.5 7.66025 1.53208 7.59625 1.59625C7.53208 1.66025 7.5 1.73075 7.5 1.80775V3.5Z" fill="#05010E"/></svg>,
  Task: () => <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.6571 17.4167C1.20137 17.4167 0.81125 17.2544 0.48675 16.9299C0.16225 16.6054 0 16.2153 0 15.7596V3.49044C0 3.0347 0.16225 2.64458 0.48675 2.32008C0.81125 1.99558 1.20137 1.83333 1.6571 1.83333H5.73627C5.79387 1.32443 6.01601 0.891687 6.40269 0.535104C6.78922 0.178368 7.25366 0 7.79602 0C8.33838 0 8.8029 0.178368 9.18958 0.535104C9.57626 0.891687 9.79542 1.32443 9.84706 1.83333H13.9262C14.382 1.83333 14.7721 1.99558 15.0966 2.32008C15.4211 2.64458 15.5833 3.0347 15.5833 3.49044V8.14962C15.5833 8.34442 15.5174 8.50766 15.3856 8.63935C15.2537 8.7712 15.0904 8.83712 14.8956 8.83712C14.7007 8.83712 14.5374 8.7712 14.4059 8.63935C14.2742 8.50766 14.2083 8.34442 14.2083 8.14962V3.49044C14.2083 3.41985 14.1789 3.35523 14.1201 3.29656C14.0614 3.23774 13.9968 3.20833 13.9262 3.20833H1.6571C1.58652 3.20833 1.5219 3.23774 1.46323 3.29656C1.40441 3.35523 1.375 3.41985 1.375 3.49044V15.7596C1.375 15.8301 1.40441 15.8948 1.46323 15.9534C1.5219 16.0123 1.58652 16.0417 1.6571 16.0417H6.29337C6.48817 16.0417 6.65141 16.1076 6.7831 16.2394C6.91495 16.3713 6.98087 16.5346 6.98087 16.7294C6.98087 16.9243 6.91495 17.0876 6.7831 17.2191C6.65141 17.3508 6.48817 17.4167 6.29337 17.4167H1.6571ZM1.375 16.0417V3.20833V8.88296V8.81421V16.0417ZM4.125 13.8733H6.82206C7.01685 13.8733 7.18017 13.8074 7.31202 13.6755C7.44372 13.5438 7.50956 13.3805 7.50956 13.1856C7.50956 12.9908 7.44372 12.8275 7.31202 12.6958C7.18017 12.5643 7.01685 12.4985 6.82206 12.4985H4.125C3.93021 12.4985 3.76697 12.5644 3.63527 12.6961C3.50342 12.8279 3.4375 12.9913 3.4375 13.1863C3.4375 13.381 3.50342 13.5443 3.63527 13.676C3.76697 13.8075 3.93021 13.8733 4.125 13.8733ZM4.125 10.3125H9.38713C9.58192 10.3125 9.74516 10.2466 9.87685 10.1147C10.0087 9.98288 10.0746 9.81956 10.0746 9.62477C10.0746 9.42983 10.0087 9.26658 9.87685 9.13504C9.74516 9.00335 9.58192 8.9375 9.38713 8.9375H4.125C3.93021 8.9375 3.76697 9.00342 3.63527 9.13527C3.50342 9.26712 3.4375 9.43044 3.4375 9.62523C3.4375 9.82017 3.50342 9.98342 3.63527 10.115C3.76697 10.2467 3.93021 10.3125 4.125 10.3125ZM4.125 6.75148H11.4583C11.6531 6.75148 11.8164 6.68563 11.9481 6.55394C12.0799 6.42209 12.1458 6.25869 12.1458 6.06375C12.1458 5.86896 12.0799 5.70572 11.9481 5.57402C11.8164 5.44248 11.6531 5.37671 11.4583 5.37671H4.125C3.93021 5.37671 3.76697 5.44263 3.63527 5.57448C3.50342 5.70617 3.4375 5.86949 3.4375 6.06444C3.4375 6.25923 3.50342 6.42247 3.63527 6.55417C3.76697 6.68571 3.93021 6.75148 4.125 6.75148ZM7.79167 2.60906C7.99028 2.60906 8.15451 2.54413 8.28438 2.41427C8.41424 2.28441 8.47917 2.12017 8.47917 1.92156C8.47917 1.72295 8.41424 1.55871 8.28438 1.42885C8.15451 1.29899 7.99028 1.23406 7.79167 1.23406C7.59306 1.23406 7.42882 1.29899 7.29896 1.42885C7.1691 1.55871 7.10417 1.72295 7.10417 1.92156C7.10417 2.12017 7.1691 2.28441 7.29896 2.41427C7.42882 2.54413 7.59306 2.60906 7.79167 2.60906ZM13.2917 19.3029C12.1471 19.3029 11.1734 18.9016 10.3707 18.0989C9.56801 17.2962 9.16667 16.3225 9.16667 15.1779C9.16667 14.0333 9.56801 13.0597 10.3707 12.257C11.1734 11.4543 12.1471 11.0529 13.2917 11.0529C14.4363 11.0529 15.4099 11.4543 16.2126 12.257C17.0153 13.0597 17.4167 14.0333 17.4167 15.1779C17.4167 16.3225 17.0153 17.2962 16.2126 18.0989C15.4099 18.9016 14.4363 19.3029 13.2917 19.3029ZM12.8863 15.5833V17.4696C12.8863 17.5776 12.9268 17.6722 13.008 17.7533C13.0889 17.8344 13.1835 17.875 13.2917 17.875C13.3998 17.875 13.4944 17.8344 13.5754 17.7533C13.6565 17.6722 13.6971 17.5776 13.6971 17.4696V15.5833H15.5833C15.6915 15.5833 15.7861 15.5428 15.867 15.4616C15.9482 15.3805 15.9887 15.286 15.9887 15.1779C15.9887 15.0698 15.9482 14.9751 15.867 14.894C15.7861 14.813 15.6915 14.7725 15.5833 14.7725H13.6971V12.8863C13.6971 12.7781 13.6565 12.6835 13.5754 12.6023C13.4944 12.5214 13.3998 12.4809 13.2917 12.4809C13.1835 12.4809 13.0889 12.5214 13.008 12.6023C12.9268 12.6835 12.8863 12.7781 12.8863 12.8863V14.7725H11C10.8918 14.7725 10.7973 14.813 10.7163 14.894C10.6352 14.9751 10.5946 15.0698 10.5946 15.1779C10.5946 15.286 10.6352 15.3805 10.7163 15.4616C10.7973 15.5428 10.8918 15.5833 11 15.5833H12.8863Z" fill="#1C1B1F"/></svg>,
  Report: () => <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.69225 10.1538H11.3077V8.65375H3.69225V10.1538ZM3.69225 13.0385H11.3077V11.5385H3.69225V13.0385ZM3.69225 15.923H8.30775V14.423H3.69225V15.923ZM1.80775 19C1.30258 19 0.875 18.825 0.525 18.475C0.175 18.125 0 17.6974 0 17.1923V1.80775C0 1.30258 0.175 0.875 0.525 0.525C0.875 0.175 1.30258 0 1.80775 0H9.75L15 5.25V17.1923C15 17.6974 14.825 18.125 14.475 18.475C14.125 18.825 13.6974 19 13.1923 19H1.80775ZM9 6V1.5H1.80775C1.73075 1.5 1.66025 1.53208 1.59625 1.59625C1.53208 1.66025 1.5 1.73075 1.5 1.80775V17.1923C1.5 17.2693 1.53208 17.3398 1.59625 17.4038C1.66025 17.4679 1.73075 17.5 1.80775 17.5H13.1923C13.2693 17.5 13.3398 17.4679 13.4038 17.4038C13.4679 17.3398 13.5 17.2693 13.5 17.1923V6H9Z" fill="#1C1B1F"/></svg>,
  Manage: () => <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.69225 6.19225V4.69225H14.3077V6.19225H5.69225ZM5.69225 9.077V7.577H14.3077V9.077H5.69225ZM8.423 19H2.5C1.80133 19 1.21 18.758 0.726 18.274C0.242 17.79 0 17.1987 0 16.5V13.6155H3V0H17V8.45775C16.7435 8.44358 16.4893 8.45925 16.2375 8.50475C15.9855 8.55025 15.7397 8.62558 15.5 8.73075V1.5H4.5V13.6155H10.173L8.673 15.1152H1.5V16.5C1.5 16.7833 1.59583 17.0208 1.7875 17.2125C1.97917 17.4042 2.21667 17.5 2.5 17.5H8.423V19ZM10.6155 19V16.3577L16.0443 10.9537C16.1686 10.8294 16.3032 10.7419 16.448 10.6912C16.5928 10.6407 16.7377 10.6155 16.8827 10.6155C17.0377 10.6155 17.1893 10.6449 17.3375 10.7037C17.4855 10.7627 17.6185 10.8512 17.7365 10.9692L18.6615 11.9038C18.7692 12.0283 18.8525 12.1629 18.9115 12.3077C18.9705 12.4526 19 12.5974 19 12.7423C19 12.8871 18.9731 13.0345 18.9193 13.1845C18.8654 13.3345 18.7795 13.4717 18.6615 13.596L13.2578 19H10.6155ZM11.8077 17.8078H12.7578L16.0038 14.546L15.5443 14.071L15.0788 13.602L11.8077 16.8577V17.8078ZM15.5443 14.071L15.0788 13.602L16.0038 14.546L15.5443 14.071Z" fill="#05010E"/></svg>,
  Home: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>,
  ChevronDown: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>,
  ChevronUp: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>,
  ChevronLeft: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>,
  ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>,
  Logout: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" /></svg>,
  Map: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" /></svg>,
};

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
  isMobile: boolean;
}

export default function Sidebar({ isOpen, toggle, isMobile }: SidebarProps) {
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({ 'services': true, 'manage': true });

  // 🟢 เช็คว่าตอนนี้อยู่หน้า Citizen หรือเปล่า
  const isCitizenPage = router.pathname.startsWith('/citizen');

  useEffect(() => {
    const savedState = localStorage.getItem('smartbin_sidebar_state');
    if (savedState) {
      try { setOpenMenus(JSON.parse(savedState)); } catch (e) { console.error(e); }
    }
  }, []);

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => {
      const newState = { ...prev, [key]: !prev[key] };
      localStorage.setItem('smartbin_sidebar_state', JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <>
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300" onClick={toggle}></div>
      )}

      <aside className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-100 shadow-xl z-[9999] flex flex-col transition-all duration-300
        ${isMobile ? (isOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full w-[280px]') : (isOpen ? 'w-[280px]' : 'w-[80px]')}
      `}>
        
        {!isMobile && (
          <button onClick={toggle} className="absolute -right-3 top-10 bg-white border border-gray-200 shadow-sm rounded-full p-1.5 text-slate-500 hover:text-indigo-600 z-50 flex items-center justify-center cursor-pointer hover:shadow-md transition-all">
             {isOpen ? <Icons.ChevronLeft /> : <Icons.ChevronRight />}
          </button>
        )}

        {/* 🟢 Header: Logo (เปลี่ยนข้อความถ้าเป็น Citizen) */}
        <div className={`p-6 flex items-center gap-3 border-b border-gray-50 min-h-[88px] ${(!isOpen && !isMobile) ? 'justify-center px-2' : ''}`}>
           <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 shadow-sm ${isCitizenPage ? 'bg-emerald-100 border-emerald-200 text-emerald-600' : 'bg-orange-100 border-orange-200 text-orange-600'}`}>
              <span className="text-xl">{isCitizenPage ? '🏠' : '🏛️'}</span>
           </div>
           <div className={`transition-all duration-200 overflow-hidden ${(!isOpen && !isMobile) ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
             <h1 className="text-[18px] font-bold text-slate-800 leading-tight whitespace-nowrap">
                {isCitizenPage ? 'Citizen Portal' : 'เทศบาลตำบลหลักเมือง'}
             </h1>
             <p className="text-[16px] text-slate-500 mt-0.5 whitespace-nowrap font-medium">
                {isCitizenPage ? 'บริการประชาชน' : 'จังหวัด ราชบุรี'}
             </p>
           </div>
        </div>

        {/* Scrollable Menu Area */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4 custom-scrollbar">
           
           {/* ------------------------------------------------ */}
           {/* 🔴 ถ้าเป็น Citizen -> แสดงเฉพาะเมนูประชาชน */}
           {/* ------------------------------------------------ */}
           {isCitizenPage && (
             <div className="space-y-1">
                <MenuItem href="/citizen" label="หน้าหลักบริการ" icon={<Icons.Home />} active={router.pathname === '/citizen'} isOpen={isOpen} isMobile={isMobile} />
                <MenuItem href="/citizen/map" label="แผนที่ถังขยะ" icon={<Icons.Map />} active={router.pathname === '/citizen/map'} isOpen={isOpen} isMobile={isMobile} />
                <MenuItem href="/citizen/my-reports" label="ประวัติการแจ้ง" icon={<Icons.Report />} active={router.pathname === '/citizen/history'} isOpen={isOpen} isMobile={isMobile} />
             </div>
           )}

           {/* ------------------------------------------------ */}
           {/* 🔴 ถ้าเป็น Admin -> แสดงเมนูเจ้าหน้าที่ครบชุด */}
           {/* ------------------------------------------------ */}
           {!isCitizenPage && (
             <>
               {/* 1. กลุ่มงานบริการ (Services) */}
               <div>
                  <button onClick={() => toggleMenu('services')} className={`flex items-center justify-between w-full px-3 py-2 text-[16px] font-semibold text-slate-800 rounded-lg bg-slate-50 hover:bg-slate-100 mb-1 ${(!isOpen && !isMobile) ? 'justify-center px-2' : ''}`}>
                     <div className="flex items-center gap-3"><Icons.Services /><span className={`${(!isOpen && !isMobile) ? 'hidden' : 'block'}`}>งานบริการ</span></div>
                     <div className={`${(!isOpen && !isMobile) ? 'hidden' : 'block'}`}>{openMenus['services'] ? <Icons.ChevronUp /> : <Icons.ChevronDown />}</div>
                  </button>
                  {openMenus['services'] && (
                    <div className={`space-y-1 mt-1 ${(!isOpen && !isMobile) ? 'hidden' : 'block'}`}>
                       <MenuItem href="#" label="ระบบบริหารจัดการแผนที่ภาษี" indent />
                       <MenuItem href="#" label="ระบบตรวจสอบปริมาณน้ำ" indent />
                       <MenuItem href="#" label="ระบบความปลอดภัย" indent />
                       <Link href="/admin/maps" legacyBehavior><a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[16px] font-medium transition-all shadow-sm bg-emerald-400 text-white hover:bg-emerald-500"><span className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></span><span>ระบบตรวจสอบปริมาณขยะ</span></a></Link>
                    </div>
                  )}
               </div>

               <hr className="border-gray-100" />

               {/* 2. เมนูหลัก */}
               <div className="space-y-1">
                  <MenuItem href="/admin/maps" label="แผนที่ถังขยะ" icon={<Icons.Map />} active={router.pathname === '/admin/maps'} isOpen={isOpen} isMobile={isMobile} />
                  <MenuItem href="/admin" label="แดชบอร์ด" icon={<Icons.CustomDashboard />} active={router.pathname === '/admin'} isOpen={isOpen} isMobile={isMobile} />
                  <MenuItem href="/admin/tasks" label="มอบหมายงาน" icon={<Icons.Task />} active={router.pathname.startsWith('/admin/tasks')} isOpen={isOpen} isMobile={isMobile} />
                  
                  {/* เมนูรายงาน */}
                  <div>
                    <button onClick={() => toggleMenu('reports')} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[16px] font-medium transition-all duration-200 w-full hover:bg-slate-50 text-slate-500 hover:text-slate-900 ${(!isOpen && !isMobile) ? 'justify-center' : 'justify-between'}`}>
                       <div className="flex items-center gap-3"><span className="shrink-0"><Icons.Report /></span><span className={`${(!isOpen && !isMobile) ? 'hidden' : 'block'}`}>รายงาน</span></div>
                       <div className={`${(!isOpen && !isMobile) ? 'hidden' : 'block'}`}>{openMenus['reports'] ? <Icons.ChevronUp /> : <Icons.ChevronDown />}</div>
                    </button>
                    {openMenus['reports'] && (
                      <div className={`space-y-1 mt-1 ${(!isOpen && !isMobile) ? 'hidden' : 'block'}`}>
                         <MenuItem href="/admin/reports/officer" label="เจ้าหน้าที่" indent active={router.pathname.includes('/reports/officer')} />
                         <MenuItem href="/admin/reports/citizen" label="ประชาชน" indent active={router.pathname.includes('/reports/citizen')} />
                      </div>
                    )}
                  </div>
               </div>

               <hr className="border-gray-100" />

               {/* 3. จัดการ */}
               <div>
                  <button onClick={() => toggleMenu('manage')} className={`flex items-center justify-between w-full px-3 py-2 text-[16px] font-semibold text-slate-800 rounded-lg hover:bg-slate-50 mb-1 ${(!isOpen && !isMobile) ? 'justify-center px-2' : ''}`}>
                     <div className="flex items-center gap-3"><Icons.Manage /><span className={`${(!isOpen && !isMobile) ? 'hidden' : 'block'}`}>จัดการ</span></div>
                     <div className={`${(!isOpen && !isMobile) ? 'hidden' : 'block'}`}>{openMenus['manage'] ? <Icons.ChevronUp /> : <Icons.ChevronDown />}</div>
                  </button>
                  {openMenus['manage'] && (
                    <div className={`space-y-1 mt-1 ${(!isOpen && !isMobile) ? 'hidden' : 'block'}`}>
                       <MenuItem href="/admin/bins" label="ถังขยะ" indent active={router.pathname === '/admin/bins' || router.pathname.startsWith('/admin/bins/')} />
                    </div>
                  )}
               </div>
             </>
           )}

           {/* 4. เมนูล่างสุด (ปุ่มกลับหน้าแรก) */}
           <div className="pt-4 mt-auto">
             <MenuItem href="/" label="ออกจากระบบ (หน้าแรก)" icon={<Icons.Logout />} isOpen={isOpen} isMobile={isMobile} />
           </div>

        </nav>

        {/* Footer: User Profile */}
        <div className={`p-4 border-t border-gray-100 bg-gray-50 flex items-center gap-3 ${(!isOpen && !isMobile) ? 'justify-center px-2' : ''}`}>
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-10 h-10 rounded-full border border-white shadow-sm bg-white" />
           <div className={`flex-1 overflow-hidden ${(!isOpen && !isMobile) ? 'hidden' : 'block'}`}>
              <p className="text-sm font-bold text-slate-800 truncate">
                 {isCitizenPage ? 'Citizen User' : 'Full Name'}
              </p>
              <p className="text-xs text-slate-500">
                 {isCitizenPage ? 'ประชาชนทั่วไป' : 'เจ้าหน้าที่'}
              </p>
           </div>
        </div>

      </aside>
    </>
  );
}

// Helper Component (เหมือนเดิม)
function MenuItem({ href, label, icon, active, indent, isOpen, isMobile }: any) {
  return (
    <Link href={href} legacyBehavior>
      <a className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[16px] font-medium transition-all duration-200 group
          ${active ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
          ${(indent) ? 'pl-9' : ''} 
          ${(!isOpen && !isMobile && !indent) ? 'justify-center' : ''}
        `}
      >
        {icon && (<span className={`shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>{icon}</span>)}
        {indent && (<span className={`w-1.5 h-1.5 rounded-full shrink-0 ${active ? 'bg-white' : 'bg-slate-300 group-hover:bg-slate-500'}`}></span>)}
        <span className={`overflow-hidden ${(!isOpen && !isMobile && !indent && icon) ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}`}>{label}</span>
      </a>
    </Link>
  );
}