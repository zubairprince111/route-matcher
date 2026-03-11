import { useState } from "react";
import { createPortal } from "react-dom";
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
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY
        },
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

  const modalContent = (
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
                />
              </div>

              <div className="relative">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Date, seat details, class..."
                  className={`${inputClasses} min-h-[100px] resize-none pb-8`}
                />
                <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground">
                  {description.length}/200
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Phone / WhatsApp</label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+8801XXXXXXXXX"
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={addTicketMutation.isPending}
                    className="w-full py-3.5 px-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {addTicketMutation.isPending ? "Posting..." : "Post Listing Live"}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
