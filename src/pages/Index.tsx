import { useState, useCallback, useMemo } from "react";
import { Plus, Search, Bus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TicketMap } from "@/components/TicketMap";
import { RouteBottomSheet } from "@/components/RouteBottomSheet";
import { SellTicketModal } from "@/components/SellTicketModal";
import { ListingsBottomSheet } from "@/components/ListingsBottomSheet";
import { Route, TicketListing, cities } from "@/data/ticketData";

import { Input } from "@/components/ui/input";

const Index = () => {
  const queryClient = useQueryClient();

  const { data: allTickets = [], isLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const res = await fetch("/api/tickets");
      if (!res.ok) throw new Error("Failed to fetch tickets");
      return (await res.json()) as TicketListing[];
    },
  });

  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");

  const vehicleTypes = ["All", "Bus", "Train", "Launch", "Air"];

  const filteredTickets = useMemo(() => {
    return allTickets.filter((ticket) => {
      const matchesType = selectedType === "All" || ticket.vehicleType === selectedType;
      const matchesSearch =
        ticket.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.destination.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [allTickets, searchQuery, selectedType]);

  const routes = useMemo(() => {
    const routeMap = new Map<string, Route>();
    filteredTickets.forEach((ticket) => {
      const key = `${ticket.origin}-${ticket.destination}`;
      if (!routeMap.has(key)) {
        routeMap.set(key, {
          origin: cities[ticket.origin] || { name: ticket.origin, lat: 23.8, lng: 90.4 },
          destination: cities[ticket.destination] || { name: ticket.destination, lat: 23.8, lng: 90.4 },
          tickets: [],
        });
      }
      routeMap.get(key)!.tickets.push(ticket);
    });
    return Array.from(routeMap.values());
  }, [filteredTickets]);

  const handleAddTicket = (ticket: TicketListing) => {
    // Ticket adding is now handled inside SellTicketModal's mutation mapping directly, 
    // but in case it bubbles up, we trigger a refetch
    queryClient.invalidateQueries({ queryKey: ["tickets"] });
  };

  const handleReportTicket = (ticketId: string) => {
    // Basic local optimism for reporting
    queryClient.setQueryData(["tickets"], (old: TicketListing[] | undefined) =>
      old ? old.map(t => t.id === ticketId ? { ...t, reportCount: (t.reportCount || 0) + 1 } : t) : []
    );
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Map */}
      <TicketMap routes={routes} onRouteClick={setSelectedRoute} />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-[990] pointer-events-none">
        <div className="flex flex-col gap-2 px-4 pt-4 md:flex-row md:items-center md:justify-between">

          {/* Top Row: Logo & Search (Beside each other on mobile) */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="pointer-events-auto bg-card border-border rounded-full px-4 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.08)] shrink-0 flex items-center justify-center">
              <h1 className="font-display font-bold text-base tracking-tight leading-none">
                <span className="text-secondary">Ticket</span>
                <span className="text-primary font-black">আছে</span>
              </h1>
            </div>

            <div className="pointer-events-auto relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-primary" />
              <Input
                type="text"
                placeholder="Search location..."
                className="pl-9 h-[40px] rounded-full bg-card border-none shadow-[0_2px_10px_rgba(0,0,0,0.08)] w-full text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Bottom Row: Filters */}
          <div className="pointer-events-auto flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar mt-1">
            <div className="flex gap-2 shrink-0 overflow-x-auto hide-scrollbar px-1 py-1">
              {vehicleTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors whitespace-nowrap shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${selectedType === type
                    ? "bg-primary text-primary-foreground border-2 border-primary"
                    : "bg-card text-foreground/80 border-2 border-transparent hover:border-primary/30"
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Persistent Safety Banner — always below filters */}
          <div className="pointer-events-auto flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 shadow-sm mx-1">
            <span className="text-amber-600 text-sm shrink-0">⚠️</span>
            <p className="text-[11px] font-medium text-amber-800 leading-snug">
              <strong>সতর্কতা:</strong> আমরা কোনো টিকিট ভেরিফাই করি না। যাচাই না করে কাউকে অগ্রিম টাকা দেবেন না। নিজ দায়িত্বে লেনদেন করুন!
            </p>
          </div>

        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setSellModalOpen(true)}
        className="fixed bottom-24 right-4 md:bottom-28 md:right-8 z-[2000] w-14 h-14 rounded-full bg-secondary text-secondary-foreground shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-2 border-yellow-600/20"
      >
        <Plus className="w-6 h-6" strokeWidth={3} />
      </button>

      {/* FAB label */}
      <div className="absolute bottom-[5rem] right-[4.5rem] md:bottom-[6.5rem] md:right-[5.5rem] z-[990] bg-card/90 backdrop-blur-md border border-border rounded-lg px-3 py-1.5 shadow-lg hidden sm:block">
        <span className="text-xs font-medium text-foreground">Sell Ticket</span>
      </div>

      {/* Bottom Sheet for all listings */}
      <ListingsBottomSheet
        tickets={filteredTickets}
        onReportTicket={handleReportTicket}
      />

      {/* Route Bottom Sheet (Overrides listings sheet when active) */}
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
