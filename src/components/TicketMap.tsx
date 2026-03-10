import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Route, cities } from "@/data/ticketData";
import { renderToStaticMarkup } from "react-dom/server";
import { Bus, Ship, Plane, TrainFront } from "lucide-react";

interface TicketMapProps {
  routes: Route[];
  onRouteClick: (route: Route) => void;
}

const vehicleIcons = {
  Bus: Bus,
  Launch: Ship,
  Air: Plane,
  Train: TrainFront,
};

const vehicleColors = {
  Bus: "#10b981", // Emerald 500
  Train: "#3b82f6", // Blue 500
  Launch: "#06b6d4", // Cyan 500
  Air: "#a855f7", // Purple 500
};

function MapBounds() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds([
      [20.5, 87.5],
      [26.7, 93.0],
    ]);
  }, [map]);
  return null;
}

export function TicketMap({ routes, onRouteClick }: TicketMapProps) {
  return (
    <MapContainer
      center={[23.8103, 90.4125]}
      zoom={7}
      className="w-full h-full"
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapBounds />

      {/* Destination markers */}
      {routes.map((route) => {
        const ticketCount = route.tickets.length;
        const destination = route.destination;
        const firstTicket = route.tickets[0];
        const vehicleType = firstTicket?.vehicleType || "Bus";
        const color = vehicleColors[vehicleType as keyof typeof vehicleColors] || "#10b981";
        const Icon = vehicleIcons[vehicleType as keyof typeof vehicleIcons] || Bus;

        const iconHtml = renderToStaticMarkup(
          <div className="custom-pin-marker" style={{ "--pin-color": color } as any}>
            <div className="pin-shadow"></div>
            <div className="pin-body">
              <div className="pin-icon">
                <Icon size={16} />
              </div>
            </div>
          </div>
        );

        const customIcon = L.divIcon({
          html: iconHtml,
          className: "",
          iconSize: [32, 42],
          iconAnchor: [16, 42],
        });

        return (
          <Marker
            key={`${route.origin.name}-${route.destination.name}`}
            position={[destination.lat, destination.lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => onRouteClick(route),
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -40]}
              className="!bg-white !border-slate-200 !shadow-lg !rounded-xl !p-0 !overflow-hidden"
            >
              <div className="px-3 py-2">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="font-bold text-xs text-slate-900">{route.destination.name}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
                  {route.origin.name} থেকে {ticketCount}টি টিকিট
                </div>
              </div>
            </Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
