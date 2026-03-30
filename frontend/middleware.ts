import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. ดึง Path ที่ user กำลังจะเข้า
  const path = request.nextUrl.pathname;

  // 2. ดึง Cookie ที่ชื่อ "admin_token" (เปรียบเสมือนบัตรผ่าน)
  const token = request.cookies.get('admin_token')?.value;

  // 🚨 กฎเหล็ก: ถ้าจะเข้าหน้า /admin แต่ไม่มี token -> ดีดออกไปหน้า Login
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    if (!token) {
      // ไม่มีบัตรผ่าน ไล่ไปหน้า Login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // ถ้ามีบัตร หรือเข้าหน้าอื่นที่ไม่ใช่ admin ก็ปล่อยผ่าน
  return NextResponse.next();
}

// กำหนดว่า Middleware นี้จะทำงานที่ route ไหนบ้าง
export const config = {
  matcher: ['/admin/:path*'], // เฝ้าดูทุกหน้าใน /admin
};