import { useState } from "react";
import ReactDOM from "react-dom";
import { Bus, Ship, Plane, Phone, MessageCircle, TrainFront, AlertTriangle, X, ArrowRight, MapPin } from "lucide-react";
import { TicketListing } from "@/data/ticketData";

const vehicleIcons = {
  Bus: Bus,
  Launch: Ship,
  Air: Plane,
  Train: TrainFront,
};

const vehicleColors: Record<string, { bg: string; text: string; badge: string }> = {
  Bus: { bg: "bg-emerald-50", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-700" },
  Train: { bg: "bg-blue-50", text: "text-blue-700", badge: "bg-blue-100 text-blue-700" },
  Launch: { bg: "bg-cyan-50", text: "text-cyan-700", badge: "bg-cyan-100 text-cyan-700" },
  Air: { bg: "bg-purple-50", text: "text-purple-700", badge: "bg-purple-100 text-purple-700" },
};

interface TicketCardProps {
  ticket: TicketListing;
  onReport: () => void;
}

export function TicketCard({ ticket, onReport }: TicketCardProps) {
  const Icon = vehicleIcons[ticket.vehicleType];
  const colors = vehicleColors[ticket.vehicleType];
  const [showWarning, setShowWarning] = useState(false);
  const [understood, setUnderstood] = useState(false);
  const [pendingAction, setPendingAction] = useState<"call" | "whatsapp" | null>(null);

  const triggerContact = (type: "call" | "whatsapp") => {
    setUnderstood(false);
    setPendingAction(type);
    setShowWarning(true);
  };

  const confirmContact = () => {
    if (!understood) return;
    if (pendingAction === "call") {
      window.open(`tel:${ticket.phone}`);
    } else {
      const message = encodeURIComponent(
        `Hi, I'm interested in your ${ticket.vehicleType} ticket from ${ticket.origin} to ${ticket.destination} for ৳${ticket.price}.`
      );
      window.open(`https://wa.me/${ticket.phone.replace("+", "")}?text=${message}`);
    }
    setShowWarning(false);
  };

  return (
    <>
      {/* Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Top strip: vehicle type badge + price */}
        <div className={`flex items-center justify-between px-4 py-2.5 ${colors.bg}`}>
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center bg-white shadow-sm`}>
              <Icon className={`w-4 h-4 ${colors.text}`} />
            </div>
            <span className={`text-xs font-bold ${colors.text} uppercase tracking-wide`}>{ticket.vehicleType}</span>
            {ticket.operatorName && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colors.badge}`}>
                {ticket.operatorName}
              </span>
            )}
          </div>
          <span className="font-black text-xl text-slate-900">৳{ticket.price}</span>
        </div>

        {/* Fraud Alert Bar */}
        {ticket.isFraud && (
          <div className="bg-red-500 text-white px-4 py-1.5 flex items-center gap-2 overflow-hidden relative">
            <div className="flex gap-2 animate-[pulse_1.5s_infinite] shrink-0">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">প্রতারণা সতর্কতা (FRAUD DETECTED)</span>
            </div>
            <div className="absolute right-0 top-0 bottom-0 flex items-center px-4 bg-gradient-to-l from-red-600 to-transparent">
              <span className="text-[9px] font-bold opacity-80 whitespace-nowrap">অধিক রিপোর্ট প্রাপ্ত</span>
            </div>
          </div>
        )}

        {/* Route row */}
        <div className="flex items-center gap-2 px-4 pt-3 pb-1">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className="font-bold text-sm text-slate-900">{ticket.origin}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-red-400 shrink-0" />
            <span className="font-bold text-sm text-slate-900">{ticket.destination}</span>
          </div>
        </div>

        {/* Description */}
        {ticket.description && (
          <p className="px-4 pt-1 pb-2 text-xs text-slate-500 leading-relaxed">{ticket.description}</p>
        )}

        {/* Footer: time + action buttons */}
        <div className="flex items-center justify-between px-4 pb-3 pt-1 gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium">{ticket.postedAt}</span>
            {ticket.reportCount && ticket.reportCount > 0 && (
              <span className="text-[9px] text-red-400 font-bold mt-0.5">{ticket.reportCount} reports</span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const reported = JSON.parse(localStorage.getItem('reported_tickets') || '[]');
                if (reported.includes(ticket.id)) {
                  alert("আপনি ইতিমধ্যে এই টিকিটটি রিপোর্ট করেছেন।");
                  return;
                }
                if (window.confirm("আপনি কি নিশ্চিত যে আপনি এই টিকিটটি রিপোর্ট করতে চান?")) {
                  onReport();
                  localStorage.setItem('reported_tickets', JSON.stringify([...reported, ticket.id]));
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-600 text-[11px] font-bold hover:bg-red-100 active:scale-95 transition-all border border-red-100"
            >
              <AlertTriangle className="w-3 h-3" />
              রিপোর্ট
            </button>
            <button
              onClick={() => triggerContact("call")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 active:scale-95 transition-all shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              কল করুন
            </button>
            <button
              onClick={() => triggerContact("whatsapp")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 active:scale-95 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Safety Warning Dialog — portalled to body to escape Drawer stacking context */}
      {showWarning && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowWarning(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-auto p-6 z-10">
            {/* Spacer instead of handle since it's now centered */}
            <div className="flex justify-center mb-4 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-slate-200" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">⚠️ সতর্কবার্তা!</h3>
                  <p className="text-[11px] text-slate-500">Safety Warning</p>
                </div>
              </div>
              <button onClick={() => setShowWarning(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200">
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 space-y-2">
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                টিকিট হাতে পাওয়ার আগে কখনোই <strong className="text-red-600">বিকাশ বা নগদে অগ্রিম টাকা পাঠাবেন না।</strong>
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                প্রতারকরা একই ডিজিটাল টিকিট একাধিক ব্যক্তির কাছে বিক্রি করতে পারে। এই প্ল্যাটফর্ম কেবল যোগাযোগ করিয়ে দেয় — লেনদেন সম্পূর্ণ আপনার দায়িত্বে।
              </p>
            </div>

            {/* Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer mb-5 bg-slate-50 rounded-xl p-3">
              <input
                type="checkbox"
                checked={understood}
                onChange={(e) => setUnderstood(e.target.checked)}
                className="w-5 h-5 accent-emerald-600 cursor-pointer rounded"
              />
              <span className="text-sm font-semibold text-slate-700 leading-snug">
                আমি বুঝতে পেরেছি এবং ঝুঁকি সম্পর্কে অবগত আছি
              </span>
            </label>

            {/* Action Button */}
            <button
              onClick={confirmContact}
              disabled={!understood}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${understood
                ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-[1.01]"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
            >
              {pendingAction === "call" ? "📞 বিক্রেতার নম্বরে কল করুন" : "💬 WhatsApp-এ যোগাযোগ করুন"}
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
