import React from "react";

export default function BinCard({ bin }: any) {
  const latest =
    bin.sensorRecords && bin.sensorRecords.length > 0
      ? bin.sensorRecords[0]
      : null;

  // จำกัดแค่ 3 รายการ
  const alerts = bin.alerts ? bin.alerts.slice(0, 3) : [];

  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "8px",
        background: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        marginBottom: "20px",
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

      {/* ---------- ALERTS ---------- */}
      {alerts.length > 0 && (
        <div
          style={{
            marginTop: 16,
            padding: "12px",
            background: "#ffecec",
            border: "1px solid #ffc2c2",
            borderRadius: 6,
          }}
        >
          <strong style={{ color: "#c80000" }}>Alerts:</strong>

          {alerts.map((a: any) => (
            <p
              key={a.id}
              style={{
                margin: "4px 0",
                color: "#a10000",
                fontSize: 14,
              }}
            >
              • {a.alert_type.toUpperCase()} — {a.message}
            </p>
          ))}

          {bin.alerts.length > 3 && (
            <p style={{ color: "#666", fontSize: 12 }}>(+ more alerts)</p>
          )}
        </div>
      )}
    </div>
  );
}
