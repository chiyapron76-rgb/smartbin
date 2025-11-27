import React from "react";

export default function BinCard({ bin }: any) {
  // ดึงข้อมูลล่าสุดจาก sensorRecords (เรียง desc แล้ว index 0 คือล่าสุด)
  const latest =
    bin.sensorRecords && bin.sensorRecords.length > 0
      ? bin.sensorRecords[0]
      : null;

  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "8px",
        background: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ marginBottom: "6px" }}>{bin.bin_code}</h2>
      <p>Zone: {bin.zone || "-"}</p>

      {latest ? (
        <>
          <p>Distance: {latest.distance_cm} cm</p>
          <p>Fill: {latest.fill_percentage}%</p>
          <p>Battery: {latest.battery_voltage?.toFixed(2)} V</p>
          <p>{new Date(latest.timestamp).toLocaleString()}</p>
        </>
      ) : (
        <p style={{ color: "gray" }}>No sensor data</p>
      )}
    </div>
  );
}
