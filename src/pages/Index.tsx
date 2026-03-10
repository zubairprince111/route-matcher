import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { TicketMap } from "@/components/TicketMap";
import { RouteBottomSheet } from "@/components/RouteBottomSheet";
import { SellTicketModal } from "@/components/SellTicketModal";
import { getRoutes, Route, TicketListing, cities } from "@/data/ticketData";

const Index = () => {
  const [tickets, setTickets] = useState<TicketListing[]>(() => {
    const routes = getRoutes();
    return routes.flatMap((r) => r.tickets);
  });
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [sellModalOpen, setSellModalOpen] = useState(false);

  const routes = useCallback(() => {
    const routeMap = new Map<string, Route>();
    tickets.forEach((ticket) => {
      const key = `${ticket.origin}-${ticket.destination}`;
      if (!routeMap.has(key)) {
        routeMap.set(key, {
          origin: cities[ticket.origin],
          destination: cities[ticket.destination],
          tickets: [],
        });
      }
      routeMap.get(key)!.tickets.push(ticket);
    });
    return Array.from(routeMap.values());
  }, [tickets])();

  const handleAddTicket = (ticket: TicketListing) => {
    setTickets((prev) => [...prev, ticket]);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Map */}
      <TicketMap routes={routes} onRouteClick={setSelectedRoute} />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-[999] pointer-events-none">
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="pointer-events-auto bg-card/90 backdrop-blur-md border border-border rounded-xl px-4 py-2.5 shadow-lg">
            <h1 className="font-display font-bold text-base tracking-tight">
              <span className="text-primary">Ticket</span>
              <span className="text-secondary">Map</span>
            </h1>
            <p className="text-[10px] text-muted-foreground -mt-0.5">Holiday travel tickets</p>
          </div>

          <div className="pointer-events-auto bg-card/90 backdrop-blur-md border border-border rounded-xl px-3 py-2 shadow-lg">
            <p className="text-xs text-muted-foreground">
              <span className="font-bold text-secondary">{tickets.length}</span> tickets live
            </p>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setSellModalOpen(true)}
        className="absolute bottom-6 right-6 z-[999] w-14 h-14 rounded-full bg-secondary text-secondary-foreground shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6" strokeWidth={2.5} />
      </button>

      {/* FAB label */}
      <div className="absolute bottom-8 right-[5.5rem] z-[999] bg-card/90 backdrop-blur-md border border-border rounded-lg px-3 py-1.5 shadow-lg">
        <span className="text-xs font-medium text-foreground">Sell Ticket</span>
      </div>

      {/* Bottom Sheet */}
      <RouteBottomSheet route={selectedRoute} onClose={() => setSelectedRoute(null)} />

      {/* Sell Modal */}
      <SellTicketModal
        open={sellModalOpen}
        onClose={() => setSellModalOpen(false)}
        onSubmit={handleAddTicket}
      />
    </div>
  );
};

export default Index;
