import type { AppProps } from 'next/app';
import '../styles/global.css'; // หรือ path css ของคุณ
import { Kanit } from 'next/font/google';
import 'leaflet/dist/leaflet.css';

// 1. ตั้งค่า Font Kanit (เอาทั้งภาษาไทยและอังกฤษ)
const kanit = Kanit({
  subsets: ['thai', 'latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-kanit', // (Optional) เผื่อใช้ใน Tailwind config
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    // 2. ครอบด้วย className ของ kanit
    <main className={kanit.className}>
      <style jsx global>{`
        :root {
          --font-kanit: ${kanit.style.fontFamily};
        }
        body {
          font-family: ${kanit.style.fontFamily}, sans-serif;
        }
      `}</style>
      <Component {...pageProps} />
    </main>
  );
}