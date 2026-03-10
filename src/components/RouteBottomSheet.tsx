import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, ArrowRight } from "lucide-react";
import { Route } from "@/data/ticketData";
import { TicketCard } from "./TicketCard";

interface RouteBottomSheetProps {
  route: Route | null;
  onClose: () => void;
}

export function RouteBottomSheet({ route, onClose }: RouteBottomSheetProps) {
  return (
    <AnimatePresence>
      {route && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/40 backdrop-blur-sm z-[1000]"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[1001] bg-card border-t border-border rounded-t-2xl max-h-[75vh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            <div className="px-5 pb-4 pt-2 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2 font-display">
                <MapPin className="w-4 h-4 text-secondary" />
                <span className="font-bold text-lg">{route.origin.name}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <span className="font-bold text-lg">{route.destination.name}</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Badge */}
            <div className="px-5 py-3">
              <span className="text-sm font-medium text-secondary bg-secondary/15 px-3 py-1 rounded-full">
                {route.tickets.length} ticket{route.tickets.length > 1 ? "s" : ""} available
              </span>
            </div>

            {/* Ticket list */}
            <div className="px-5 pb-6 overflow-y-auto flex-1 space-y-3">
              {route.tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
