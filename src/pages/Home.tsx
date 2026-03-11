import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Map as MapIcon, Bus, Car, TrafficCone, MapPin, AlertCircle, ArrowRight, Bell, Train, Ticket, Coffee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function Home() {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-slate-800 pb-28 font-sans">
            {/* Top Section with Yellowish Header */}
            <div className="bg-[#FFC72C] pb-2 rounded-b-[40px] shadow-sm mb-6 border-b border-[#E5B127]">
                {/* Header */}
                <div className="px-6 pt-12 pb-6 flex items-center justify-center relative">
                    <h1 className="font-extrabold text-4xl tracking-tight leading-none text-slate-900 text-center">
                        DEK<span className="text-primary">Hoo</span>
                    </h1>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="absolute right-6 w-11 h-11 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors border border-[#E5B127]/30"
                    >
                        <Bell className="w-5 h-5 text-slate-600" />
                        <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute top-20 right-6 w-[320px] bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-[9000] animate-in slide-in-from-top-2 text-left">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-50">
                                <h3 className="font-bold text-slate-900">Notifications</h3>
                                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">1 New</span>
                            </div>

                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-inner">
                                    <img src="/cover-modified.png" alt="Developer" className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div className="text-left flex-1">
                                    <h4 className="text-xs font-bold text-slate-900 mb-1">Message from Developer</h4>
                                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                        Thank you for being with us! We are glad to have you here. Keep exploring DEKHoo, and we are open for your suggestions for future upgrades.
                                        <span className="font-bold text-slate-800">- Jubair Prince</span><br />
                                        <a href="https://www.facebook.com/jubair.prince009" target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:text-blue-700 underline font-semibold inline-block mt-0.5">
                                            Follow on Facebook
                                        </a>
                                    </p>
                                    <span className="text-[9px] font-bold text-slate-400 mt-2 block">Just now</span>
                                </div>
                            </div>
                        </div>
                    )}
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

                    {/* Coming Soon Placeholder */}
                    <div className="bg-white/50 p-5 rounded-3xl border border-slate-100 border-dashed flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full border-2 border-slate-200 border-dashed flex items-center justify-center mb-3">
                            <span className="text-slate-300 font-bold text-lg">+</span>
                        </div>
                        <h3 className="font-bold text-slate-400 text-sm mb-1">More Features</h3>
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Coming Soon</p>
                    </div>

                </div>

                {/* Biriyani Dibe Redirect Card */}
                <div
                    onClick={() => window.open('https://www.biriyanidibe.me', '_blank')}
                    className="bg-yellow-500 p-5 rounded-3xl shadow-sm border border-yellow-600 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow mb-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center p-2 shadow-inner">
                            <img src="/biriyanidibe.ico" alt="Biriyani Dibe Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-slate-900 text-sm">বিরিয়ানি দিবে</h3>
                            <p className="text-[9px] font-black text-slate-900/60 uppercase tracking-widest">Food Platform</p>
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
