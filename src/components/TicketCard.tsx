import { Bus, Ship, Plane, Phone, MessageCircle, TrainFront } from "lucide-react";
import { TicketListing } from "@/data/ticketData";

const vehicleIcons = {
  Bus: Bus,
  Launch: Ship,
  Air: Plane,
  Train: TrainFront,
};

interface TicketCardProps {
  ticket: TicketListing;
}

export function TicketCard({ ticket }: TicketCardProps) {
  const Icon = vehicleIcons[ticket.vehicleType];

  const handleCall = () => {
    window.open(`tel:${ticket.phone}`);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi, I'm interested in your ${ticket.vehicleType} ticket from ${ticket.origin} to ${ticket.destination} for ৳${ticket.price}.`
    );
    window.open(`https://wa.me/${ticket.phone.replace("+", "")}?text=${message}`);
  };

  return (
    <div className="rounded-lg bg-card border border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">{ticket.vehicleType}</span>
            {ticket.operatorName && (
              <p className="text-xs text-foreground/70 leading-tight">{ticket.operatorName}</p>
            )}
          </div>
        </div>
        <span className="font-display font-bold text-secondary text-lg">৳{ticket.price}</span>
      </div>

      <p className="text-sm text-foreground/80 leading-relaxed">{ticket.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{ticket.postedAt}</span>
        <div className="flex gap-2">
          <button
            onClick={handleCall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            Call
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-glow-green/20 text-primary text-sm font-medium hover:bg-glow-green/30 transition-colors border border-primary/30"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
