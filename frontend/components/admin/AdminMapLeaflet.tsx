// @ts-nocheck
"use client";

import L from "leaflet";
// @ts-ignore
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

// fix icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

export default function AdminMapLeaflet({ bins = [], creating, onSelectPos }) {
  const [tempPos, setTempPos] = useState(null);

  function ClickHandler() {
    useMapEvents({
      click(e) {
        if (!creating) return;
        const { lat, lng } = e.latlng;
        setTempPos([lat, lng]);
        onSelectPos(lat, lng);
      },
    });
    return null;
  }

  return (
    <MapContainer
      center={[13.736717, 100.523186]}
      zoom={13}
      style={{ height: "80vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {bins.map((bin) => (
        <Marker key={bin.id} position={[bin.lat, bin.lng]}>
          <Popup>
            <strong>{bin.code}</strong><br />
            Zone: {bin.zone}<br />
            Status: {bin.status}
          </Popup>
        </Marker>
      ))}

      {tempPos && creating && (
        <Marker position={tempPos}>
          <Popup>ตำแหน่งใหม่</Popup>
        </Marker>
      )}

      <ClickHandler />
    </MapContainer>
  );
}
