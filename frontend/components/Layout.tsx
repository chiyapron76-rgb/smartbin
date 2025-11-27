import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ padding: 20, fontFamily: "Arial, Helvetica, sans-serif" }}>
      <header style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: "#666" }}>SmartBin</div>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
