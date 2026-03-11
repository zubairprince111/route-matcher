import { useNavigate } from "react-router-dom";
import { Search, Map as MapIcon, Bus, Car, TrafficCone, MapPin, AlertCircle, ArrowRight, Bell, Train, Ticket, Coffee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-slate-800 pb-28 font-sans">
            {/* Top Section with Yellowish Header */}
            <div className="bg-[#FFC72C] pb-2 rounded-b-[40px] shadow-sm mb-6 border-b border-[#E5B127]">
                {/* Header */}
                <div className="px-6 pt-12 pb-6 flex items-center justify-center relative">
                    <h1 className="font-extrabold text-4xl tracking-tight leading-none text-slate-900 text-center">
                        DEK<span className="text-primary">Hoo</span>
                    </h1>
                    <button className="absolute right-6 w-11 h-11 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors border border-[#E5B127]/30">
                        <Bell className="w-5 h-5 text-slate-600" />
                        <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                    </button>
                </div>

                {/* Global Search */}
                <div className="px-6 pb-4">
                    <div className="relative shadow-md rounded-2xl bg-white flex items-center h-14 border border-slate-100/50">
                        <div className="pl-4 flex items-center justify-center shrink-0">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <Input
                            type="text"
                            className="w-full pl-3 pr-4 h-full rounded-2xl border-none bg-transparent text-sm focus-visible:ring-0 shadow-none placeholder:text-slate-400 font-medium"
                            placeholder="Search routes or terminals..."
                        />
                    </div>
                </div>
            </div>

            <div className="px-6 space-y-6">
                {/* TicketAche Hero Card */}
                <div
                    onClick={() => navigate("/tickets")}
                    className="relative bg-white rounded-2xl p-4 shadow-sm border border-slate-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow min-h-[160px] flex flex-col"
                >
                    {/* Faint map background pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="inline-flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full w-fit mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-emerald-600 tracking-wider">LIVE NOW</span>
                        </div>

                        <h2 className="text-2xl font-black tracking-tight text-slate-900 mb-1">
                            Ticket<span className="text-primary">Ache</span>
                        </h2>
                        <p className="text-xs font-medium text-slate-500 max-w-[200px] leading-snug">
                            Bangladesh's ticket exchange network.
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                            <button className="bg-primary hover:bg-emerald-900 text-white font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 transition-colors">
                                Explore Map
                                <MapIcon className="w-3.5 h-3.5" />
                            </button>

                            <div className="flex -space-x-3">
                                <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white"></div>
                                <div className="w-7 h-7 rounded-full bg-slate-300 border-2 border-white"></div>
                                <div className="w-7 h-7 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center">
                                    <span className="text-[9px] font-bold text-emerald-700">+12</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* VaraKoto Card (Row Style like SOS Hub) */}
                <div
                    onClick={() => navigate("/varakoto")}
                    className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            <div className="w-11 h-11 rounded-full bg-yellow-50 flex items-center justify-center border-2 border-white shadow-sm">
                                <Bus className="w-5 h-5 text-yellow-600" fill="currentColor" />
                            </div>
                            <div className="w-11 h-11 rounded-full bg-emerald-950/10 flex items-center justify-center border-2 border-white shadow-sm">
                                <Train className="w-5 h-5 text-primary" fill="currentColor" />
                            </div>
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-slate-900 text-sm">VaraKoto</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fare comparison</p>
                        </div>
                    </div>
                    <ArrowRight className="text-slate-900/30" size={20} />
                </div>

                {/* Local Rates Card (Row Style like SOS Hub) - Renamed to VaraKoto Local */}
                <div
                    onClick={() => navigate("/local-rates")}
                    className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-emerald-950/10 flex items-center justify-center shadow-sm">
                            <img src="/rickshaw.png" alt="Rickshaw" className="h-6 object-contain" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-slate-900 text-sm">VaraKoto Local</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">BUS, Rickshaw & CNG</p>
                        </div>
                    </div>
                    <ArrowRight className="text-slate-900/30" size={20} />
                </div>

                {/* 1x2 Utility Grid for secondary items */}
                <div className="grid grid-cols-2 gap-4">

                    {/* TONG (Boutique & Hangout spots) */}
                    <div
                        onClick={() => navigate("/tong")}
                        className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow"
                    >
                        <div className="relative w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 p-1.5 shadow-inner">
                            <img src="/tong_logo.png" alt="TONG" className="w-full h-full object-contain mix-blend-multiply" />
                            <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white shadow-sm" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm mb-1">TONG</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Boutique & Hangout</p>
                    </div>

                    {/* Rest Stops */}
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-full bg-emerald-950/10 flex items-center justify-center mb-3">
                            <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm mb-1">Rest Stops</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Highway Food</p>
                    </div>

                </div>

                {/* SOS Hub as its own wide-ish row or kept prominent */}
                <div className="bg-yellow-500 p-5 rounded-3xl shadow-sm border border-yellow-600 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-slate-900" fill="currentColor" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-slate-900 text-sm">SOS Hub</h3>
                            <p className="text-[9px] font-black text-slate-900/60 uppercase tracking-widest">Emergency Assistance</p>
                        </div>
                    </div>
                    <ArrowRight className="text-slate-900/40" size={20} />
                </div>

                {/* Advisory Dark Card */}
                <div className="bg-[#0F172A] rounded-3xl p-6 shadow-lg relative overflow-hidden">
                    {/* Subtle logo bg */}
                    <div className="absolute -right-12 -top-12 opacity-10 pointer-events-none scale-150">
                        <Search className="w-48 h-48 text-white" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            <span className="text-[10px] font-bold tracking-widest text-yellow-500 uppercase">Advisory</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 leading-tight">Ready for the journey?</h2>
                        <p className="text-sm font-medium text-slate-400 mb-6 leading-relaxed max-w-[260px]">
                            Get real-time updates on highway conditions and intercity terminal schedules.
                        </p>
                        <button className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-3 rounded-2xl flex items-center gap-2 transition-colors">
                            Read Updates
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
