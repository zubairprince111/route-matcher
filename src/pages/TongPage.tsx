import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Coffee, Clock, MapPin, Star, Plus, ChevronLeft, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isTongOpen, TongLocation } from "@/data/tongData";
import { renderToStaticMarkup } from "react-dom/server";
import { Input } from "@/components/ui/input";
import { TongBottomSheet } from "@/components/TongBottomSheet";
import { AddTongBottomSheet } from "@/components/AddTongBottomSheet";
import { useQuery } from "@tanstack/react-query";
import "leaflet/dist/leaflet.css";

function MapBounds({ locations }: { locations: TongLocation[] }) {
    const map = useMap();
    useMemo(() => {
        if (locations.length > 0) {
            const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [map, locations]);
    return null;
}

function MapClick({ onMapClick, enabled }: { onMapClick: (lat: number, lng: number) => void; enabled: boolean }) {
    useMapEvents({
        click(e) {
            if (enabled) {
                onMapClick(e.latlng.lat, e.latlng.lng);
            }
        },
    });
    return null;
}

const typeColors = {
    Tong: "#f59e0b",
    Boutique: "#10b981",
    Hangout: "#3b82f6",
};

export default function TongPage() {
    const navigate = useNavigate();

    const { data: allTongs = [], isLoading } = useQuery({
        queryKey: ["tongs"],
        queryFn: async () => {
            const res = await fetch("/api/tongs");
            if (!res.ok) throw new Error("Failed to fetch tongs");
            return (await res.json()) as TongLocation[];
        }
    });

    const [filter, setFilter] = useState<"All" | "Open Now">("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedTong, setSelectedTong] = useState<TongLocation | null>(null);
    const [isMenuExpanded, setIsMenuExpanded] = useState(false);
    const [newSpotCoords, setNewSpotCoords] = useState<{ lat: number; lng: number } | null>(null);

    const filteredTongs = useMemo(() => {
        return allTongs.filter(tong => {
            const matchesSearch = tong.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (tong.description && tong.description.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesFilter = filter === "All" || isTongOpen(tong);
            return matchesSearch && matchesFilter;
        });
    }, [allTongs, searchQuery, filter]);

    const createCustomIcon = (tong: TongLocation) => {
        const color = typeColors[tong.type];
        const isSelected = selectedTong?.id === tong.id;
        const iconHtml = renderToStaticMarkup(
            <div className={`custom-pin-marker ${isSelected ? 'scale-125' : ''}`} style={{ "--pin-color": color } as any}>
                <div className="pin-shadow"></div>
                <div className="pin-body" style={{ transform: isSelected ? 'rotate(-45deg) scale(1.2)' : 'rotate(-45deg)' }}>
                    <div className="pin-icon">
                        <Coffee size={16} />
                    </div>
                </div>
            </div>
        );

        return L.divIcon({
            html: iconHtml,
            className: "",
            iconSize: [32, 42],
            iconAnchor: [16, 42],
        });
    };

    return (
        <>
            <div className="relative w-full h-screen overflow-hidden bg-background font-sans">
                {/* Map Background */}
                <MapContainer
                    center={[23.7485, 90.38]}
                    zoom={13}
                    className="w-full h-full z-0"
                    zoomControl={false}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap'
                    />
                    <MapBounds locations={filteredTongs} />
                    <MapClick
                        enabled={isAddModalOpen}
                        onMapClick={(lat, lng) => setNewSpotCoords({ lat, lng })}
                    />

                    {/* New Spot Preview Marker */}
                    {isAddModalOpen && newSpotCoords && (
                        <Marker
                            position={[newSpotCoords.lat, newSpotCoords.lng]}
                            icon={L.divIcon({
                                html: renderToStaticMarkup(
                                    <div className="custom-pin-marker" style={{ "--pin-color": "#ef4444" } as any}>
                                        <div className="pin-shadow"></div>
                                        <div className="pin-body">
                                            <div className="pin-icon">
                                                <Plus size={16} />
                                            </div>
                                        </div>
                                    </div>
                                ),
                                className: "",
                                iconSize: [32, 42],
                                iconAnchor: [16, 42],
                            })}
                        />
                    )}
                    {filteredTongs.map(tong => (
                        <Marker
                            key={tong.id}
                            position={[tong.lat, tong.lng]}
                            icon={createCustomIcon(tong)}
                            eventHandlers={{
                                click: () => setSelectedTong(tong)
                            }}
                        >
                            <Tooltip
                                direction="top"
                                offset={[0, -40]}
                                className="!bg-white !border-slate-200 !shadow-lg !rounded-2xl !p-0 !overflow-hidden"
                            >
                                <div className="px-4 py-3 min-w-[200px]">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${tong.type === 'Tong' ? 'bg-amber-100 text-amber-700' :
                                            tong.type === 'Boutique' ? 'bg-emerald-100 text-emerald-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {tong.type}
                                        </span>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span className="text-[11px] font-bold">{tong.rating}</span>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-sm text-slate-900 mb-1">{tong.name}</h3>
                                    <p className="text-[10px] text-slate-500 leading-relaxed mb-2">{tong.description}</p>
                                    <div className="flex items-center gap-3 border-t border-slate-50 pt-2">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-slate-400" />
                                            <span className="text-[10px] font-bold text-slate-600">{tong.openTime} - {tong.closeTime}</span>
                                        </div>
                                        {isTongOpen(tong) ? (
                                            <span className="text-[10px] font-black text-emerald-600">OPEN NOW</span>
                                        ) : (
                                            <span className="text-[10px] font-black text-red-500">CLOSED</span>
                                        )}
                                    </div>
                                </div>
                            </Tooltip>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Top UI Overlay */}
                <div className="absolute top-0 left-0 right-0 z-[1000] p-4 pointer-events-none">
                    <div className="max-w-md mx-auto flex items-center gap-2 w-full">
                        <button
                            onClick={() => navigate(-1)}
                            className="pointer-events-auto shrink-0 w-10 h-11 rounded-full bg-white shadow-xl flex items-center justify-center border border-slate-100 active:scale-95 transition-all"
                        >
                            <ChevronLeft className="w-5 h-5 text-slate-700" />
                        </button>
                        <div className="pointer-events-auto shrink-0 bg-[#FFC72C] text-slate-900 px-3 h-11 rounded-full shadow-xl flex items-center justify-center border border-[#E5B127]">
                            <h1 className="font-black text-sm tracking-widest whitespace-nowrap"> টং </h1>
                        </div>
                        <div className="relative flex-1 pointer-events-auto min-w-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="w-full bg-white/95 backdrop-blur-md rounded-full border-none shadow-xl pl-9 pr-3 h-11 text-xs font-medium focus-visible:ring-emerald-500"
                            />
                        </div>
                        <button
                            onClick={() => setFilter(prev => prev === "All" ? "Open Now" : "All")}
                            className={`pointer-events-auto shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-xl ${filter === "Open Now"
                                ? "bg-emerald-600 text-white ring-2 ring-emerald-300 ring-offset-2"
                                : "bg-white text-slate-700 border border-slate-100"
                                }`}
                        >
                            <Clock className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Bottom Sheet Menu */}
                <TongBottomSheet
                    tongs={filteredTongs}
                    selectedTong={selectedTong}
                    onSelectTong={(tong) => setSelectedTong(tong)}
                    onClose={() => setSelectedTong(null)}
                    onSnapChange={(snap) => setIsMenuExpanded(snap === 0.85)}
                />
            </div>

            {/* FAB — OUTSIDE overflow-hidden so it beats the portal-rendered drawer */}
            {!isAddModalOpen && (
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    style={{ zIndex: 9999 }}
                    className={`fixed bottom-24 right-6 bg-yellow-400 hover:bg-yellow-500 text-slate-900 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center border-4 border-white/50 animate-bounce-subtle active:scale-90 transition-all ${isMenuExpanded ? "opacity-50 scale-90" : "opacity-100 scale-100"}`}
                >
                    <Plus className="w-8 h-8" strokeWidth={4} />
                </button>
            )}

            {/* Add Spot Forms Modal */}
            <AddTongBottomSheet
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setNewSpotCoords(null);
                }}
                initialCoords={newSpotCoords}
            />
        </>
    );
}
