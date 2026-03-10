import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Route, cities } from "@/data/ticketData";

interface TicketMapProps {
  routes: Route[];
  onRouteClick: (route: Route) => void;
}

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
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution=""
      />
      <MapBounds />

      {/* City markers */}
      {Object.values(cities).map((city) => (
        <CircleMarker
          key={city.name}
          center={[city.lat, city.lng]}
          radius={5}
          pathOptions={{
            color: "hsl(48, 96%, 53%)",
            fillColor: "hsl(48, 96%, 53%)",
            fillOpacity: 0.9,
            weight: 2,
          }}
        >
          <Tooltip
            permanent
            direction="top"
            offset={[0, -8]}
            className="!bg-transparent !border-none !shadow-none !text-xs !font-display !font-semibold"
          >
            <span style={{ color: "hsl(60, 10%, 95%)", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
              {city.name}
            </span>
          </Tooltip>
        </CircleMarker>
      ))}

      {/* Route lines */}
      {routes.map((route) => {
        const ticketCount = route.tickets.length;
        const weight = Math.min(3 + ticketCount * 2, 10);

        return (
          <Polyline
            key={`${route.origin.name}-${route.destination.name}`}
            positions={[
              [route.origin.lat, route.origin.lng],
              [route.destination.lat, route.destination.lng],
            ]}
            pathOptions={{
              color: "hsl(145, 65%, 42%)",
              weight,
              opacity: 0.8,
              lineCap: "round",
              lineJoin: "round",
            }}
            eventHandlers={{
              click: () => onRouteClick(route),
              mouseover: (e) => {
                e.target.setStyle({ color: "hsl(145, 65%, 55%)", opacity: 1 });
              },
              mouseout: (e) => {
                e.target.setStyle({ color: "hsl(145, 65%, 42%)", opacity: 0.8 });
              },
            }}
          >
            <Tooltip>
              <span className="font-display font-semibold">
                {route.origin.name} → {route.destination.name}
              </span>
              <br />
              <span className="text-sm">{ticketCount} ticket{ticketCount > 1 ? "s" : ""} available</span>
            </Tooltip>
          </Polyline>
        );
      })}
    </MapContainer>
  );
}
