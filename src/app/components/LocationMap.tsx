"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon paths (a common Leaflet + bundler quirk)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface LocationMapProps {
  latitude: number;
  longitude: number;
  label?: string;
}

export default function LocationMap({ latitude, longitude, label }: LocationMapProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      style={{ height: "260px", width: "100%", borderRadius: "0.75rem" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={[latitude, longitude]}>
        {label && <Popup>{label}</Popup>}
      </Marker>
    </MapContainer>
  );
}