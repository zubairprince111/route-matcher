import { ArrowLeft, Globe, Map, Ticket, Bus, Coffee, MapPin, Users, Star, Heart, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
    {
        icon: Ticket,
        title: "TicketAche",
        description: "Bangladesh's first peer-to-peer intercity bus ticket exchange network. Buy, sell, and transfer tickets with full transparency.",
        color: "bg-emerald-50 text-emerald-700",
    },
    {
        icon: Bus,
        title: "VaraKoto",
        description: "Real-time intercity fare comparison across bus operators. Know what others are paying before you book.",
        color: "bg-yellow-50 text-yellow-700",
    },
    {
        icon: Bus,
        title: "VaraKoto Local",
        description: "Community-reported local transport fares — rickshaw, CNG, and local bus rates across Dhaka neighborhoods.",
        color: "bg-blue-50 text-blue-700",
    },
    {
        icon: () => <img src="/tong_logo.png" alt="TONG" className="w-6 h-6 object-contain" />,
        title: "TONG",
        description: "Discover boutique roadside tea stalls and hangout spots along major Bangladesh highways.",
        color: "bg-amber-50 text-amber-700",
    },
    {
        icon: MapPin,
        title: "Rest Stops",
        description: "Find verified highway rest stops, fuel stations, and food points on your journey route.",
        color: "bg-rose-50 text-rose-700",
    },
    {
        icon: Map,
        title: "Live Map",
        description: "Interactive route and terminal map helping you navigate Bangladesh's intercity bus ecosystem in real time.",
        color: "bg-indigo-50 text-indigo-700",
    },
];

const values = [
    { icon: Shield, title: "Transparency", desc: "No hidden fares. Community-verified pricing for every route." },
    { icon: Users, title: "Community First", desc: "Built by and for Bangladesh's 170 million everyday travellers." },
    { icon: Zap, title: "Real-Time", desc: "Always live data — from ticket availability to local bus fares." },
    { icon: Heart, title: "Made with Love", desc: "Proudly made in Bangladesh for Bangladeshis, everywhere." },
];

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans pb-28">
            {/* Hero Header */}
            <div className="bg-[#FFC72C] pb-8 rounded-b-[40px] shadow-sm border-b border-[#E5B127] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#92400e 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-12 left-5 w-10 h-10 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors border border-[#E5B127]/40"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-700" />
                </button>
                <div className="pt-14 pb-2 flex flex-col items-center text-center px-6">
                    <h1 className="font-extrabold text-4xl tracking-tight leading-none text-slate-900 mb-2">
                        DEK<span className="text-emerald-800">Hoo</span>
                    </h1>
                    <p className="text-sm font-semibold text-slate-800/80 max-w-xs">Community-Powered. Open to Ideas.</p>
                    <div className="mt-4 flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-[#E5B127]/40">
                        <Globe className="w-4 h-4 text-emerald-700" />
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Crowd Opinion · Free to Use</span>
                    </div>
                </div>
            </div>

            <div className="px-5 mt-6 space-y-6">

                {/* Mission */}
                <div className="bg-[#0F172A] rounded-3xl p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-[#FFC72C]" />
                        <span className="text-[10px] font-bold tracking-widest text-[#FFC72C] uppercase">What We Are</span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-3 leading-tight">
                        Not just a platform — a crowd-driven idea engine.
                    </h2>
                    <p className="text-sm font-medium text-slate-400 leading-relaxed">
                        DEKHoo is an open, community-powered platform built for Bangladesh. We're not just a travel app — we're a space where you can suggest any useful feature, propose ideas, and influence what gets built next. If the community wants it, we'll work to build it.
                    </p>
                    <div className="mt-4 p-3 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-xs text-[#FFC72C] font-bold uppercase tracking-widest mb-1">Have an idea?</p>
                        <p className="text-xs text-slate-400 font-medium">Suggest a feature, report a gap, or tell us what Bangladesh needs. Your voice shapes DEKHoo.</p>
                    </div>
                </div>

                {/* Features */}
                <div>
                    <h2 className="text-lg font-black text-slate-900 mb-4 px-1">What We Offer</h2>
                    <div className="grid grid-cols-1 gap-3">
                        {features.map((f) => (
                            <div key={f.title} className="bg-white rounded-2xl p-4 flex items-start gap-4 shadow-sm border border-slate-100">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${f.color}`}>
                                    <f.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm mb-0.5">{f.title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{f.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Values */}
                <div>
                    <h2 className="text-lg font-black text-slate-900 mb-4 px-1">Our Values</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {values.map((v) => (
                            <div key={v.title} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                                <div className="w-10 h-10 rounded-full bg-[#FFC72C]/20 flex items-center justify-center mb-2">
                                    <v.icon className="w-5 h-5 text-[#9a6700]" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-xs mb-1">{v.title}</h3>
                                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-[#FFC72C] rounded-3xl p-6 border border-[#E5B127]">
                    <h2 className="text-lg font-black text-slate-900 mb-4 text-center">By the Numbers</h2>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        {[
                            { num: "64+", label: "Districts" },
                            { num: "100+", label: "Routes" },
                        ].map((s) => (
                            <div key={s.label}>
                                <div className="font-black text-2xl text-slate-900">{s.num}</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-700">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center pb-4">
                    <p className="text-xs text-slate-400 font-medium">© 2026 DEKHoo · Made in Bangladesh 🇧🇩</p>
                    <p className="text-[10px] text-slate-300 mt-1">Proudly serving intercity and local travellers across Bangladesh.</p>
                </div>
            </div>
        </div>
    );
}
