import { useState } from "react";
import { ListFilter, ChevronUp } from "lucide-react";
import { TicketListing } from "@/data/ticketData";
import { TicketCard } from "./TicketCard";
import { Drawer, DrawerContent } from "./ui/drawer";

interface ListingsBottomSheetProps {
    tickets: TicketListing[];
    onReportTicket: (ticketId: string) => void;
}

export function ListingsBottomSheet({ tickets, onReportTicket }: ListingsBottomSheetProps) {
    const [snap, setSnap] = useState<number | string | null>(0.30);
    const isExpanded = snap === 0.85;

    return (
        <Drawer
            open={true}
            onOpenChange={() => { }}
            snapPoints={[0.30, 0.75]}
            activeSnapPoint={snap}
            setActiveSnapPoint={setSnap}
            modal={false}
            dismissible={false}
        >
            <DrawerContent
                className="fixed bottom-[72px] md:bottom-[80px] left-0 right-0 z-[1000] bg-[#F8F9FA] border-t-0 rounded-t-3xl shadow-[0_-8px_30px_-5px_rgba(0,0,0,0.1)] flex flex-col focus-visible:outline-none focus:outline-none mx-auto w-full md:max-w-2xl px-0 overflow-hidden"
                style={{ height: 'calc(75vh - 72px)' }}
            >
                {/* Drag Handle + Header */}
                <div
                    className="bg-white rounded-t-3xl cursor-grab active:cursor-grabbing px-4 pt-3 pb-4 shrink-0 border-b border-slate-100"
                    onClick={() => setSnap(isExpanded ? 0.45 : 0.85)}
                >
                    {/* Handle bar */}
                    <div className="flex justify-center mb-3">
                        <div className="w-10 h-1 rounded-full bg-slate-300" />
                    </div>

                    {/* Header row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                <ListFilter className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                                <span className="font-black text-base text-slate-900 leading-none">সকল লিস্টিং</span>
                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{tickets.length}টি সক্রিয় টিকিট পাওয়া গেছে</p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full transition-all`}>
                            <ChevronUp className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                            {isExpanded ? "সংক্ষিপ্ত" : "সব দেখুন"}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-28">
                    {tickets.length > 0 ? (
                        tickets.map((ticket) => (
                            <TicketCard
                                key={ticket.id}
                                ticket={ticket}
                                onReport={() => onReportTicket(ticket.id)}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                <ListFilter className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="font-bold text-slate-600 text-sm">কোনো টিকিট পাওয়া যায়নি</p>
                            <p className="text-xs text-slate-400 mt-1">ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন</p>
                        </div>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
}
