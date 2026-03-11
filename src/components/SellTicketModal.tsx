import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ticket } from "lucide-react";
import { cities, TicketListing } from "@/data/ticketData";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SellTicketModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (ticket: TicketListing) => void;
}

const cityNames = Object.keys(cities).sort();

export function SellTicketModal({ open, onClose, onSubmit }: SellTicketModalProps) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState<"Bus" | "Launch" | "Air" | "Train">("Bus");
  const [operatorName, setOperatorName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");

  const queryClient = useQueryClient();

  const addTicketMutation = useMutation({
    mutationFn: async (ticket: any) => {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticket),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to post ticket");
      }
      return res.json();
    },
    onSuccess: (data) => {
      // Bubble up to trigger re-renders if needed
      onSubmit(data as TicketListing);
      toast.success("Ticket posted! Your route is now live on the map.");
      onClose();

      setOrigin("");
      setDestination("");
      setVehicleType("Bus");
      setOperatorName("");
      setPrice("");
      setDescription("");
      setPhone("");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to post ticket.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!origin || !destination || !price || !phone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (origin === destination) {
      toast.error("Origin and destination must be different.");
      return;
    }

    const priceNum = parseInt(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    const phoneClean = phone.trim();
    if (phoneClean.length < 10 || phoneClean.length > 15) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    addTicketMutation.mutate({
      origin,
      destination,
      vehicleType,
      operatorName: operatorName.trim() || undefined,
      price: priceNum,
      description: description.trim().slice(0, 200),
      phone: phoneClean,
    });
  };

  const selectClasses =
    "w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";
  const inputClasses = selectClasses;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[9998]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-[5%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md z-[9999] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Ticket className="w-4 h-4 text-secondary" />
                </div>
                <h2 className="font-display font-bold text-lg">Sell Your Ticket</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Origin</label>
                  <select value={origin} onChange={(e) => setOrigin(e.target.value)} className={selectClasses}>
                    <option value="">Select district</option>
                    {cityNames.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Destination</label>
                  <select value={destination} onChange={(e) => setDestination(e.target.value)} className={selectClasses}>
                    <option value="">Select district</option>
                    {cityNames.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Vehicle Type</label>
                  <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value as any)} className={selectClasses}>
                    <option value="Bus">🚌 Bus</option>
                    <option value="Train">🚆 Train</option>
                    <option value="Launch">🚢 Launch</option>
                    <option value="Air">✈️ Air</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Price (৳)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1200"
                    className={inputClasses}
                    min="1"
                    max="100000"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Operator / Service Name</label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  placeholder="e.g. Greenline, Sonar Bangla Express, Biman..."
                  className={inputClasses}
                  maxLength={60}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Date, seat details, class..."
                  rows={2}
                  maxLength={200}
                  className={`${inputClasses} resize-none`}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Phone / WhatsApp</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+8801XXXXXXXXX"
                  className={inputClasses}
                  maxLength={15}
                />
              </div>

              {/* Seller Warning */}
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 space-y-1">
                <p className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                  ⚠️ বিক্রেতাদের জন্য নোটিশ
                </p>
                <p className="text-xs text-red-700 leading-relaxed">
                  টিকিটের গায়ে লেখা মূল্যের (MRP) চেয়ে <strong>বেশি দামে টিকিট বিক্রি করা সম্পূর্ণ বেআইনি।</strong> অতিরিক্ত দাম দিলে আপনার পোস্টটি সাথে সাথে ডিলিট করা হবে এবং আপনার ফোন নম্বরটি এই প্ল্যাটফর্ম থেকে স্থায়ীভাবে ব্যান করা হবে।
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm hover:bg-primary/90 transition-colors"
              >
                Post Ticket — Go Live on Map
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
