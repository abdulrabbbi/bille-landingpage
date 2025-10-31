import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import React, { useEffect } from "react";
import { MAP_CARD_PLACEHOLDER } from "../../images";

// Fix Leaflet default icon issue in React
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapCard() {
  // Example locations (London area)
  const locations = [
    { id: 1, name: "Danish Bar", coords: [51.5074, -0.1278] },
    { id: 2, name: "Waterloo Spot", coords: [51.5033, -0.1195] },
    { id: 3, name: "Westminster Pub", coords: [51.501, -0.1416] },
    { id: 4, name: "South Bank Lounge", coords: [51.5055, -0.09] },
    { id: 5, name: "Lambeth Tavern", coords: [51.495, -0.11] },
  ];

  useEffect(() => {
    document.title = "Map Card Demo";
  }, []);

  return (
    <section className="bg-[#1d1d1d] rounded-3xl p-6 sm:p-7 md:p-8 text-white flex flex-col md:flex-row gap-6 md:gap-7 items-stretch justify-between w-full max-w-screen-xl mx-auto shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
      {/* Map Section */}
      <div className="w-full md:w-2/3 h-[380px] sm:h-[420px] rounded-2xl overflow-hidden">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((loc) => (
            <Marker key={loc.id} position={loc.coords}>
              <Popup>{loc.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Info Section */}
      <div className="bg-[#2a2a2a] rounded-2xl p-4 sm:p-5 w-full md:w-1/3 space-y-4 flex flex-col">
        <img
          src={MAP_CARD_PLACEHOLDER}
          alt="Venue"
          className="w-full h-40 object-cover rounded-xl"
          loading="eager"
        />
        <h2 className="text-accent text-xl sm:text-2xl font-semibold">Danish Bar</h2>

        <div className="bg-[#9333ea] text-white rounded-lg py-2 px-4 flex items-center justify-between text-sm font-semibold">
          <span>Match Screening</span>
          <div className="flex items-center gap-4">
            <span>CHL</span>
            <span className="text-lg">VS</span>
            <span>RMD</span>
          </div>
        </div>

        <p className="text-gray-400 text-sm">
          Lorem ipsum dolor sit amet consectetur. Nunc ipsum mauris quis
          bibendum volutpat amet. Eleifend amet porttitor vestibulum elit lectus
          vitae pellentesque. Urna tellus at elit nunc tortor.
        </p>
      </div>
    </section>
  );
}
