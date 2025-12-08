import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  const router = useRouter();
  const path = router.pathname;

  // Detect role by current path
  const isAdmin = path.startsWith("/admin");
  const isCollector = path.startsWith("/collector");

  return (
    <div style={{ padding: 20 }}>
      <header style={{ marginBottom: 20 }}>

        {/* Top-left project name */}
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>
          {isAdmin
            ? "SmartBin (Admin Portal)"
            : isCollector
            ? "SmartBin (Collector App)"
            : "SmartBin (Citizen Portal)"}
        </div>

        {/* ====================================================== */}
        {/*                     ADMIN NAVIGATION                   */}
        {/* ====================================================== */}
        {isAdmin && (
          <nav style={{ marginTop: 10, display: "flex", gap: 20 }}>
            <Link
              href="/admin"
              style={{ fontWeight: path === "/admin" ? "bold" : "normal" }}
            >
              Dashboard
            </Link>

            <Link
              href="/admin/tasks"
              style={{
                fontWeight: path.startsWith("/admin/tasks") ? "bold" : "normal",
              }}
            >
              Manage Tasks
            </Link>

            <Link
              href="/admin/reports"
              style={{
                fontWeight: path.startsWith("/admin/reports") ? "bold" : "normal",
              }}
            >
              Issue Reports
            </Link>

            <Link
              href="/admin/citizen-reports"
              style={{
                fontWeight: path.startsWith("/admin/citizen-reports")
                  ? "bold"
                  : "normal",
              }}
            >
              Citizen Reports
            </Link>

            <Link
              href="/admin/ratings"
              style={{
                fontWeight: path.startsWith("/admin/ratings") ? "bold" : "normal",
              }}
            >
              Ratings
            </Link>

            <Link
              href="/admin/create-bin"
              style={{
                fontWeight: path.startsWith("/admin/create-bin")
                  ? "bold"
                  : "normal",
              }}
            >
              Create Bin
            </Link>
          </nav>
        )}

        {/* ====================================================== */}
        {/*                    COLLECTOR NAVIGATION                */}
        {/* ====================================================== */}
        {isCollector && (
          <nav style={{ marginTop: 10, display: "flex", gap: 20 }}>
            <Link
              href="/collector"
              style={{ fontWeight: path === "/collector" ? "bold" : "normal" }}
            >
              Dashboard
            </Link>

            <Link
              href="/collector/tasks"
              style={{
                fontWeight: path.startsWith("/collector/tasks")
                  ? "bold"
                  : "normal",
              }}
            >
              My Tasks
            </Link>

            <Link
              href="/collector/history"
              style={{
                fontWeight: path.startsWith("/collector/history")
                  ? "bold"
                  : "normal",
              }}
            >
              Task History
            </Link>
          </nav>
        )}

        {/* ====================================================== */}
        {/*                     CITIZEN NAVIGATION                 */}
        {/* ====================================================== */}
        {!isAdmin && !isCollector && (
          <nav style={{ marginTop: 10, display: "flex", gap: 20 }}>

            <Link
              href="/citizen"
              style={{ fontWeight: path === "/citizen" ? "bold" : "normal" }}
            >
              Home
            </Link>

            <Link
              href="/citizen/bins"
              style={{
                fontWeight: path.startsWith("/citizen/bins")
                  ? "bold"
                  : "normal",
              }}
            >
              Find Bins
            </Link>

            <Link
              href="/citizen/my-reports"
              style={{
                fontWeight: path.startsWith("/citizen/my-reports")
                  ? "bold"
                  : "normal",
              }}
            >
              My Reports
            </Link>

            <Link
              href="/citizen/rate"
              style={{
                fontWeight: path.startsWith("/citizen/rate")
                  ? "bold"
                  : "normal",
              }}
            >
              Rate App
            </Link>

            <Link
              href="/"
              style={{ fontWeight: path === "/" ? "bold" : "normal" }}
            >
              Home (Landing)
            </Link>
          </nav>
        )}
      </header>

      {/* =================== MAIN CONTENT =================== */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
