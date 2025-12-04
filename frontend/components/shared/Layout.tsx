import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  const router = useRouter();
  const path = router.pathname;

  // ตรวจ role จาก path (ไม่ต้องใช้ props)
  const isAdmin = path.startsWith("/admin");
  const isCollector = path.startsWith("/collector");

  return (
    <div style={{ padding: 20 }}>
      <header style={{ marginBottom: 20 }}>
        {/* ชื่อมุมซ้ายบน */}
        <div style={{ fontSize: 18, fontWeight: 600 }}>
          {isAdmin ? "SmartBin (Admin Mode)" : "SmartBin"}
        </div>

        {/* เมนู Navigation */}
        <nav style={{ marginTop: 10 }}>
          {/* ======================== */}
          {/*     ADMIN NAVIGATION     */}
          {/* ======================== */}
          {isAdmin && (
            <>
              <Link
                href="/admin"
                style={{
                  marginRight: 20,
                  fontWeight: path === "/admin" ? "bold" : "normal",
                }}
              >
                Dashboard
              </Link>

              <Link
                href="/admin/tasks"
                style={{
                  marginRight: 20,
                  fontWeight: path.startsWith("/admin/tasks")
                    ? "bold"
                    : "normal",
                }}
              >
                Manage Tasks
              </Link>

              <Link
                href="/admin/reports"
                style={{
                  marginRight: 20,
                  fontWeight: path.startsWith("/admin/reports")
                    ? "bold"
                    : "normal",
                }}
              >
                Manage Reports
              </Link>
            </>
          )}

          {/* ======================== */}
          {/*    COLLECTOR NAVIGATION  */}
          {/* ======================== */}
          {!isAdmin && (
            <>
              <Link
                href="/collector/tasks"
                style={{
                  marginRight: 20,
                  fontWeight: path.startsWith("/collector/tasks")
                    ? "bold"
                    : "normal",
                }}
              >
                My Tasks
              </Link>

              <Link
                href="/"
                style={{
                  marginRight: 20,
                  fontWeight: path === "/" ? "bold" : "normal",
                }}
              >
                Home
              </Link>
            </>
          )}
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );
};

export default Layout;