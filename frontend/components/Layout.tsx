import React from "react";
import Link from "next/link";

const Layout = ({ children }) => {
  return (
    <div style={{ padding: 20 }}>
      <header style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 600 }}>
          SmartBin
        </div>

        <nav style={{ marginTop: 10 }}>
          <Link href="/tasks" style={{ marginRight: 20 }}>Tasks</Link>
          <Link href="/reports">Reports</Link>
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );
};

export default Layout;
