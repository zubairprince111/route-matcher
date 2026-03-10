import React, { useState } from "react";
import { X, Bus, Car, Bike, Info, Plus, Send, ArrowRight, AlertTriangle, Phone, MapPin, GraduationCap } from "lucide-react";
import { toast } from "sonner";

interface LocalFareReport {
    id: string;
    fromArea: string;
    toArea: string;
    vehicleType: string;
    price: number;
    description?: string;
    postedAt: string;
    upvotes: number;
    downvotes: number;
    isStudent?: boolean;
    rickshawType?: 'manual' | 'auto';
    isShared?: boolean;
}

const LOCAL_AREAS = [
    "Uttara", "Banani", "Gulshan", "Dhanmondi", "Farmgate",
    "Mirpur", "Motijheel", "Mohakhali", "Badda", "Rampura",
    "Bashundhara", "Paltan", "Khilgaon", "Malibagh", "Azimpur"
];

const VEHICLE_TYPES = [
    { val: "bus", label: "🚌 Local Bus", icon: Bus },
    { val: "rickshaw", label: "🚲 Rickshaw", icon: Bike },
    { val: "cng", label: "🛺 CNG", icon: Car }, // Using Car as placeholder in code, but will render emoji
];

interface LocalFareReporterProps {
    open: boolean;
    onClose: () => void;
    pageMode?: boolean;
}

export function LocalFareReporter({ open, onClose, pageMode = false }: LocalFareReporterProps) {
    const [showForm, setShowForm] = useState(false);
    const [fromArea, setFromArea] = useState("");
    const [toArea, setToArea] = useState("");
    const [vehicleType, setVehicleType] = useState("bus");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [isStudent, setIsStudent] = useState(false);
    const [rickshawType, setRickshawType] = useState<'manual' | 'auto'>('manual');
    const [isShared, setIsShared] = useState(false);

    // Local state for reports since backend for local fares isn't established yet
    const [reports, setReports] = useState<LocalFareReport[]>([
        { id: "1", fromArea: "Uttara", toArea: "Banani", vehicleType: "bus", price: 30, postedAt: "1 hour ago", upvotes: 12, downvotes: 2, description: "Raida Poribahan" },
        { id: "2", fromArea: "Dhanmondi", toArea: "Farmgate", vehicleType: "rickshaw", price: 60, postedAt: "30 min ago", upvotes: 5, downvotes: 1, rickshawType: 'manual' },
        { id: "3", fromArea: "Mohakhali", toArea: "Gulshan 1", vehicleType: "cng", price: 150, postedAt: "2 hours ago", upvotes: 2, downvotes: 8 },
        { id: "5", fromArea: "Dhanmondi", toArea: "Shahbagh", vehicleType: "bus", price: 10, postedAt: "Just now", upvotes: 15, downvotes: 0, description: "Student Half Fare", isStudent: true },
    ]);

    if (!open) return null;

    const handleSubmit = () => {
        if (!fromArea || !toArea || !price) {
            toast.error("সব তথ্য পূরণ করুন");
            return;
        }

        const newReport: LocalFareReport = {
            id: Date.now().toString(),
            fromArea,
            toArea,
            vehicleType,
            price: parseInt(price),
            description: description || undefined,
            postedAt: "Just now",
            upvotes: 0,
            downvotes: 0,
            isStudent: vehicleType === 'bus' ? isStudent : false,
            rickshawType: vehicleType === 'rickshaw' ? rickshawType : undefined,
            isShared: (vehicleType === 'rickshaw' && rickshawType === 'auto') ? isShared : undefined
        };

        setReports([newReport, ...reports]);
        setShowForm(false);
        setFromArea("");
        setToArea("");
        setPrice("");
        setDescription("");
        setIsStudent(false);
        setRickshawType('manual');
        setIsShared(false);
        toast.success("রিপোর্ট সফলভাবে যোগ হয়েছে!");
    };

    const handleVote = (id: string, type: 'up' | 'down') => {
        setReports(reports.map(r => {
            if (r.id === id) {
                return {
                    ...r,
                    upvotes: type === 'up' ? r.upvotes + 1 : r.upvotes,
                    downvotes: type === 'down' ? r.downvotes + 1 : r.downvotes
                };
            }
            return r;
        }));
    };

    const inner = (
        <div
            className={pageMode
                ? "w-full flex-1 flex flex-col bg-[#F8F9FA]"
                : "relative w-full max-w-md max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden bg-white"
            }
        >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-5 border-b shrink-0 ${pageMode ? 'pt-8' : ''}`} style={{ background: "hsl(var(--primary))" }}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <Car size={22} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white leading-none">Local Rates</h2>
                        <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mt-1">DEKHoo • BUS, Rickshaw & CNG</p>
                    </div>
                </div>
                {!pageMode && (
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-white hover:bg-black/20 transition-colors">
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Info Card */}
            <div className="mx-4 mt-4 p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                    লোকাল বাস, রিকশা বা সিএনজি ভাড়া অনেক সময় বাড়তি চাওয়া হয়। এখানে সঠিক ভাড়া রিপোর্ট করুন যাতে অন্যরা প্রতারিত না হয়।
                </p>
            </div>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

                {/* Add Box */}
                {!showForm ? (
                    <button
                        onClick={() => setShowForm(true)}
                        className="w-full bg-white border-2 border-dashed border-slate-200 rounded-2xl py-6 flex flex-col items-center justify-center hover:border-primary/50 transition-colors group"
                    >
                        <div className="w-12 h-12 rounded-full bg-emerald-950/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <Plus size={24} className="text-primary" />
                        </div>
                        <span className="font-bold text-slate-700">ভাড়া রিপোর্ট করুন</span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase mt-1">Share the fare details</span>
                    </button>
                ) : (
                    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex items-center justify-between">
                            <h3 className="font-black text-slate-800">নতুন ভাড়া রিপোর্ট</h3>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Area Selects */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">কোথা থেকে</label>
                                <input
                                    list="areas" value={fromArea} onChange={(e) => setFromArea(e.target.value)}
                                    placeholder="Area Name"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">গন্তব্য</label>
                                <input
                                    list="areas" value={toArea} onChange={(e) => setToArea(e.target.value)}
                                    placeholder="Area Name"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                        </div>
                        <datalist id="areas">
                            {LOCAL_AREAS.map(a => <option key={a} value={a} />)}
                        </datalist>

                        {/* Vehicle Select */}
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                                {VEHICLE_TYPES.map(vt => (
                                    <button
                                        key={vt.val}
                                        onClick={() => {
                                            setVehicleType(vt.val);
                                            if (vt.val !== 'bus') setIsStudent(false);
                                        }}
                                        className={`flex-1 py-2.5 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${vehicleType === vt.val ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        {vt.val === 'rickshaw' ? (
                                            <img src="/rickshaw.png" alt="Rickshaw" className="h-6 object-contain" />
                                        ) : (
                                            <span className="text-lg">{vt.label.split(' ')[0]}</span>
                                        )}
                                        <span className="text-[10px] font-bold whitespace-nowrap">{vt.label.split(' ')[1]}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Student Segment (Only for Bus) */}
                            {vehicleType === 'bus' && (
                                <div className="flex items-center gap-2 p-1 bg-yellow-50 rounded-xl">
                                    <button
                                        onClick={() => setIsStudent(false)}
                                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${!isStudent ? 'bg-white shadow-sm text-yellow-700' : 'text-yellow-500/60'}`}
                                    >
                                        General
                                    </button>
                                    <button
                                        onClick={() => setIsStudent(true)}
                                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${isStudent ? 'bg-yellow-500 text-slate-900 shadow-md' : 'text-yellow-700'}`}
                                    >
                                        <GraduationCap size={12} />
                                        Student (Half)
                                    </button>
                                </div>
                            )}

                            {/* Rickshaw Options (Only for Rickshaw) */}
                            {vehicleType === 'rickshaw' && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 p-1 bg-yellow-50 rounded-xl">
                                        <button
                                            onClick={() => {
                                                setRickshawType('manual');
                                                setIsShared(false);
                                            }}
                                            className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${rickshawType === 'manual' ? 'bg-white shadow-sm text-yellow-700' : 'text-yellow-500/60'}`}
                                        >
                                            Manual
                                        </button>
                                        <button
                                            onClick={() => setRickshawType('auto')}
                                            className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${rickshawType === 'auto' ? 'bg-yellow-500 text-slate-900 shadow-md' : 'text-yellow-700'}`}
                                        >
                                            Auto
                                        </button>
                                    </div>

                                    {rickshawType === 'auto' && (
                                        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl animate-in fade-in slide-in-from-top-1">
                                            <button
                                                onClick={() => setIsShared(false)}
                                                className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold transition-all ${!isShared ? 'bg-white shadow-sm text-slate-700' : 'text-slate-400'}`}
                                            >
                                                Private
                                            </button>
                                            <button
                                                onClick={() => setIsShared(true)}
                                                className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold transition-all ${isShared ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500'}`}
                                            >
                                                Shared
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Fare + Details */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">ভাড়া (টাকা)</label>
                                <div className="relative">
                                    <input
                                        type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                                        placeholder="0"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-8 pr-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">৳</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">বিস্তারিত (ঐচ্ছিক)</label>
                                <input
                                    type="text" value={description} onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Bus name, etc."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full py-4 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-emerald-950 shadow-lg shadow-emerald-900/10 transition-all active:scale-[0.98]"
                        >
                            <Send size={18} /> সাবমিট রিপোর্ট
                        </button>
                    </div>
                )}

                {/* List Header */}
                <div className="flex items-center justify-between px-1 pt-2">
                    <h4 className="font-black text-slate-900">সাম্প্রতিক ভাড়া</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">Latest Reports</span>
                </div>

                {/* Reports List */}
                <div className="space-y-3 pb-10">
                    {reports.map((report) => (
                        <div key={report.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${report.vehicleType === 'bus' ? (report.isStudent ? 'bg-yellow-500 shadow-[0_0_10px_rgba(250,204,21,0.3)]' : 'bg-primary') :
                                        report.vehicleType === 'rickshaw' ? 'bg-yellow-400' :
                                            report.vehicleType === 'cng' ? 'bg-primary' : 'bg-purple-500'
                                        }`}>
                                        <span className={`text-sm flex py-1 ${report.isStudent ? 'text-slate-900' : ''}`}>
                                            {report.vehicleType === 'bus' ? (report.isStudent ? '🎓' : '🚌') :
                                                report.vehicleType === 'rickshaw' ? <img src="/rickshaw.png" alt="🛺" className="h-6" /> :
                                                    report.vehicleType === 'cng' ? '🛺' : '🛺'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">
                                            {report.vehicleType === 'rickshaw' ? (
                                                `${report.rickshawType || 'manual'} Rickshaw`
                                            ) : (
                                                VEHICLE_TYPES.find(v => v.val === report.vehicleType)?.label?.split(' ')[1] || report.vehicleType
                                            )}
                                        </span>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            {report.isStudent && (
                                                <span className="text-[8px] font-black text-yellow-600 uppercase tracking-tighter bg-yellow-50 px-1 rounded-sm">Student Rate</span>
                                            )}
                                            {report.vehicleType === 'rickshaw' && report.rickshawType === 'auto' && (
                                                <span className={`text-[8px] font-black uppercase tracking-tighter px-1 rounded-sm ${report.isShared ? 'bg-slate-100 text-slate-600' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {report.isShared ? 'Shared Ride' : 'Private Ride'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="font-black text-xl text-slate-900 leading-none">৳{report.price}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-bold text-sm text-slate-700">{report.fromArea}</span>
                                <ArrowRight size={14} className="text-slate-300" />
                                <span className="font-bold text-sm text-slate-700">{report.toArea}</span>
                            </div>

                            {report.description && (
                                <p className="text-xs text-slate-400 mb-3 bg-slate-50 px-3 py-1.5 rounded-lg inline-block">
                                    {report.description}
                                </p>
                            )}

                            <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                                <span className="text-[10px] font-bold text-slate-300">{report.postedAt}</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleVote(report.id, 'down')}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                    >
                                        <ArrowRight size={14} className="rotate-90" />
                                        <span className="text-xs font-bold">{report.downvotes} কম</span>
                                    </button>
                                    <button
                                        onClick={() => handleVote(report.id, 'up')}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                    >
                                        <Plus size={14} />
                                        <span className="text-xs font-bold">{report.upvotes} বেশি</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (pageMode) return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
            {inner}
        </div>
    );

    return (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="animate-in fade-in zoom-in-95 duration-200">
                {inner}
            </div>
        </div>
    );
}
