import React, { useState } from "react";
import { X, Bus, Train, TrendingUp, TrendingDown, Plus, Send, ArrowRight, AlertTriangle, Phone } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface FareReport {
    id: string;
    from_city: string;
    to_city: string;
    transport_type: string;
    fare: number;
    company_name: string | null;
    seat_class: string | null;
    upvotes: number;
    downvotes: number;
    created_at: string;
}

const SEAT_CLASSES: Record<string, { val: string; label: string }[]> = {
    bus: [
        { val: "ac", label: "❄️ এসি" },
        { val: "non_ac", label: "🪟 নন-এসি" },
    ],
    train: [
        { val: "ac", label: "❄️ এসি" },
        { val: "non_ac", label: "🪟 নন-এসি" },
    ],
    launch: [
        { val: "cabin", label: "🛏️ কেবিন" },
        { val: "deck", label: "🪑 ডেক" },
    ],
};

const POPULAR_CITIES = [
    "ঢাকা", "চট্টগ্রাম", "সিলেট", "রাজশাহী", "খুলনা",
    "বরিশাল", "রংপুর", "ময়মনসিংহ", "কক্সবাজার", "কুমিল্লা",
    "দিনাজপুর", "গাজীপুর", "নারায়ণগঞ্জ", "ফরিদপুর", "যশোর",
    "বগুড়া", "টাঙ্গাইল", "নোয়াখালী", "পাবনা", "ব্রাহ্মণবাড়িয়া",
    "কিশোরগঞ্জ", "জামালপুর", "শেরপুর", "নেত্রকোনা", "হবিগঞ্জ",
    "মৌলভীবাজার", "সুনামগঞ্জ", "নরসিংদী", "মানিকগঞ্জ", "মুন্সিগঞ্জ",
    "মাদারীপুর", "গোপালগঞ্জ", "শরীয়তপুর", "রাজবাড়ী", "নড়াইল",
    "মাগুরা", "কুষ্টিয়া", "মেহেরপুর", "চুয়াডাঙ্গা", "ঝিনাইদহ",
    "সাতক্ষীরা", "বাগেরহাট", "পটুয়াখালী", "পিরোজপুর", "ঝালকাঠি",
    "ভোলা", "বরগুনা", "নওগাঁ", "নাটোর", "চাঁপাইনবাবগঞ্জ",
    "জয়পুরহাট", "সিরাজগঞ্জ", "ঠাকুরগাঁও", "পঞ্চগড়", "নীলফামারী",
    "লালমনিরহাট", "কুড়িগ্রাম", "গাইবান্ধা", "চাঁদপুর",
    "লক্ষ্মীপুর", "ফেনী", "খাগড়াছড়ি", "রাঙ্গামাটি", "বান্দরবান",
];

function useFareReports() {
    return useQuery({
        queryKey: ["fare_reports"],
        queryFn: async () => {
            const res = await fetch("/api/fare-reports", {
                headers: {
                    "x-api-key": import.meta.env.VITE_API_KEY
                }
            });
            if (!res.ok) throw new Error("Failed to fetch");
            return (await res.json()) as FareReport[];
        },
        staleTime: 30000,
    });
}

function useAddFareReport() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (report: { from_city: string; to_city: string; transport_type: string; fare: number; company_name?: string; seat_class?: string }) => {
            const res = await fetch("/api/fare-reports", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": import.meta.env.VITE_API_KEY
                },
                body: JSON.stringify(report),
            });

            const text = await res.text();
            let data: any;
            try { data = JSON.parse(text); } catch (e) { /* ignore */ }

            if (!res.ok) {
                throw new Error(data?.error || data?.trace || text || "Failed to submit report");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fare_reports"] });
            toast.success("ভাড়া রিপোর্ট সফলভাবে যোগ হয়েছে!");
        },
        onError: (err: any) => toast.error(err.message || "রিপোর্ট যোগ করতে সমস্যা হয়েছে।"),
    });
}

function useVoteFare() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, type }: { id: string; type: "upvote" | "downvote" }) => {
            const res = await fetch("/api/vote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": import.meta.env.VITE_API_KEY
                },
                body: JSON.stringify({ item_id: id, item_type: "fare_report", vote_type: type }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to vote");
            }
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fare_reports"] }),
        onError: (err: any) => toast.error(err.message),
    });
}

interface FareReporterProps {
    open: boolean;
    onClose: () => void;
    pageMode?: boolean;
}

export function FareReporter({ open, onClose, pageMode = false }: FareReporterProps) {
    const [showForm, setShowForm] = useState(false);
    const [fromCity, setFromCity] = useState("");
    const [toCity, setToCity] = useState("");
    const [transportType, setTransportType] = useState("bus");
    const [fare, setFare] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [seatClass, setSeatClass] = useState("");

    const { data: reports = [], isLoading } = useFareReports();
    const addReport = useAddFareReport();
    const voteFare = useVoteFare();
    const votedIds = React.useRef<Set<string>>(new Set());

    if (!open) return null;

    const handleSubmit = () => {
        if (!fromCity || !toCity || !fare) {
            toast.error("সব তথ্য পূরণ করুন");
            return;
        }
        if (fromCity === toCity) {
            toast.error("যাত্রা শুরু ও গন্তব্য আলাদা হতে হবে");
            return;
        }
        addReport.mutate(
            { from_city: fromCity, to_city: toCity, transport_type: transportType, fare: parseInt(fare), company_name: companyName || undefined, seat_class: seatClass || undefined },
            { onSuccess: () => { setShowForm(false); setFromCity(""); setToCity(""); setFare(""); setCompanyName(""); setSeatClass(""); } }
        );
    };

    const handleVote = (id: string, type: "upvote" | "downvote") => {
        if (votedIds.current.has(id)) { toast.info("আপনি ইতোমধ্যে ভোট দিয়েছেন"); return; }
        votedIds.current.add(id);
        voteFare.mutate({ id, type });
    };

    const inner = (
        <div
            className={pageMode
                ? "w-full flex flex-col bg-background"
                : "relative w-full max-w-md max-h-[85vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            }
            style={{ background: "hsl(var(--background))" }}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
                style={{ background: "#FFC72C", borderColor: "#E5B127" }}
            >
                <div className="flex items-center gap-2">
                    <Bus size={20} className="text-slate-900" />
                    <h2 className="text-lg font-black text-slate-900">ভাড়া কত</h2>
                </div>
                {!pageMode && (
                    <button onClick={onClose} className="p-1.5 rounded-full transition-all active:scale-90" style={{ background: "rgba(0,0,0,0.1)" }}>
                        <X size={16} className="text-slate-900" />
                    </button>
                )}
            </div>

            {/* Initiative note */}
            <div className="flex items-start gap-2 mx-4 mt-3 px-3 py-2.5 rounded-xl" style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                <Bus size={14} className="flex-shrink-0 mt-0.5" style={{ color: "rgb(16, 185, 129)" }} />
                <p className="text-xs leading-relaxed text-slate-900">
                    ঈদে বাস-ট্রেনের ভাড়া বেড়ে যায়। এখানে আসল ভাড়া <strong>রিপোর্ট করুন</strong> ও অন্যদের রিপোর্ট <strong>দেখুন</strong> — যাতে কেউ প্রতারিত না হন।
                </p>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-2 mx-4 mt-2 px-3 py-2.5 rounded-xl" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5 text-red-500" />
                <p className="text-xs leading-relaxed text-slate-900">
                    অতিরিক্ত ভাড়া নিলে <strong>BRTA হেল্পলাইন</strong>-এ অভিযোগ করুন।
                    <a href="tel:16263" className="inline-flex items-center gap-1 ml-1 font-bold underline text-red-500">
                        <Phone size={10} /> ১৬২৬৩
                    </a>
                </p>
            </div>

            {/* Content */}
            <div className={`flex-1 overflow-y-auto px-4 py-3 ${pageMode ? 'pb-24' : ''}`}>
                {/* Add Report Button / Form */}
                {!showForm ? (
                    <button
                        onClick={() => setShowForm(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] mb-3 shadow-md"
                        style={{ background: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))" }}
                    >
                        <Plus size={16} /> ভাড়া রিপোর্ট করুন
                    </button>
                ) : (
                    <div className="rounded-xl p-4 mb-3 space-y-3" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                        <h3 className="text-sm font-bold" style={{ color: "hsl(var(--secondary))" }}>নতুন ভাড়া রিপোর্ট</h3>

                        {/* From / To */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] font-medium block mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>যাত্রা শুরু</label>
                                <select
                                    value={fromCity} onChange={(e) => setFromCity(e.target.value)}
                                    className="w-full px-2 py-2 rounded-lg text-xs" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
                                >
                                    <option value="">শহর বাছুন</option>
                                    {POPULAR_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-medium block mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>গন্তব্য</label>
                                <select
                                    value={toCity} onChange={(e) => setToCity(e.target.value)}
                                    className="w-full px-2 py-2 rounded-lg text-xs" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
                                >
                                    <option value="">শহর বাছুন</option>
                                    {POPULAR_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Transport type */}
                        <div className="flex gap-2">
                            {[{ val: "bus", label: "🚌 বাস" }, { val: "train", label: "🚂 ট্রেন" }, { val: "launch", label: "⛴️ লঞ্চ" }].map(t => (
                                <button
                                    key={t.val}
                                    onClick={() => { setTransportType(t.val); setSeatClass(""); }}
                                    className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                                    style={{
                                        background: transportType === t.val ? "hsl(var(--secondary))" : "hsl(var(--muted))",
                                        color: transportType === t.val ? "white" : "hsl(var(--muted-foreground))",
                                    }}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Seat class */}
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-800 text-sm">রিপোর্ট করা ভাড়া</h4>
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-950/10 rounded-full">
                                <TrendingUp size={10} className="text-primary" />
                                <span className="text-[9px] font-black text-primary uppercase">Recently Updated</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {SEAT_CLASSES[transportType]?.map(sc => <button
                                key={sc.val}
                                onClick={() => setSeatClass(sc.val)}
                                className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                                style={{
                                    background: seatClass === sc.val ? "hsl(var(--secondary))" : "hsl(var(--muted))",
                                    color: seatClass === sc.val ? "hsl(var(--secondary-foreground))" : "hsl(var(--muted-foreground))",
                                }}
                            >
                                {sc.label}
                            </button>
                            )}
                        </div>

                        {/* Fare + Company */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] font-medium block mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>ভাড়া (টাকা)</label>
                                <input
                                    type="number" value={fare} onChange={(e) => setFare(e.target.value)} placeholder="৳"
                                    className="w-full px-2 py-2 rounded-lg text-xs" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-medium block mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>কোম্পানি (ঐচ্ছিক)</label>
                                <input
                                    type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="যেমন: গ্রীনলাইন"
                                    className="w-full px-2 py-2 rounded-lg text-xs" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg text-xs font-bold" style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
                                বাতিল
                            </button>
                            <button
                                onClick={handleSubmit} disabled={addReport.isPending}
                                className="flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-[0.98]"
                                style={{ background: "hsl(var(--primary))", color: "white" }}
                            >
                                <Send size={12} /> {addReport.isPending ? "পাঠানো হচ্ছে…" : "রিপোর্ট করুন"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Reports List */}
                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="text-3xl animate-bounce mb-2">🚌</div>
                        <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>রিপোর্ট লোড হচ্ছে…</p>
                    </div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-3xl mb-2">📋</div>
                        <p className="text-sm font-bold" style={{ color: "hsl(var(--muted-foreground))" }}>এখনও কোনো রিপোর্ট নেই</p>
                        <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>প্রথম রিপোর্ট করুন!</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p className="text-xs font-bold px-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                            সাম্প্রতিক রিপোর্ট ({reports.length}টি)
                        </p>
                        {reports.map((r) => {
                            const net = r.upvotes - r.downvotes;
                            return (
                                <div key={r.id} className="rounded-xl p-3 shadow-sm" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm">{r.transport_type === "bus" ? "🚌" : r.transport_type === "train" ? "🚂" : "⛴️"}</span>
                                            <span className="text-xs font-bold" style={{ color: "hsl(var(--secondary))" }}>{r.from_city}</span>
                                            <ArrowRight size={12} style={{ color: "hsl(var(--muted-foreground))" }} />
                                            <span className="text-[10px] font-black uppercase tracking-tighter" style={{ color: "hsl(var(--primary))" }}>
                                                {transportType}
                                            </span>
                                            <span className="text-xs font-bold" style={{ color: "hsl(var(--secondary))" }}>{r.to_city}</span>
                                        </div>
                                        <span className="text-sm font-black" style={{ color: "hsl(var(--primary))" }}>৳{r.fare}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {r.seat_class && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))" }}>
                                                    {r.seat_class === "ac" ? "❄️ এসি" : r.seat_class === "non_ac" ? "🪟 নন-এসি" : r.seat_class === "cabin" ? "🛏️ কেবিন" : "🪑 ডেক"}
                                                </span>
                                            )}
                                            {r.company_name && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
                                                    {r.company_name}
                                                </span>
                                            )}
                                            <span className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                                                {new Date(r.created_at).toLocaleDateString("bn-BD")}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => handleVote(r.id, "upvote")} className="p-1 rounded-md transition-all active:scale-90" style={{ background: "hsl(var(--secondary) / 0.2)" }}>
                                                <TrendingUp size={12} style={{ color: "hsl(var(--secondary-foreground))" }} />
                                            </button>
                                            <span className="text-xs font-bold min-w-[20px] text-center" style={{ color: net >= 0 ? "hsl(var(--secondary))" : "hsl(var(--destructive))" }}>
                                                {net}
                                            </span>
                                            <button onClick={() => handleVote(r.id, "downvote")} className="p-1 rounded-md transition-all active:scale-90" style={{ background: "hsl(var(--destructive) / 0.1)" }}>
                                                <TrendingDown size={12} style={{ color: "hsl(var(--destructive))" }} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );

    if (pageMode) return inner;

    return (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            {inner}
        </div>
    );
}
