import { useState } from "react";
import { Coffee, ChevronUp, Map as MapIcon } from "lucide-react";
import { TongLocation } from "@/data/tongData";
import { TongCard } from "./TongCard";
import { Drawer, DrawerContent } from "./ui/drawer";

interface TongBottomSheetProps {
    tongs: TongLocation[];
    selectedTong: TongLocation | null;
    onSelectTong: (tong: TongLocation) => void;
    onClose: () => void;
    onSnapChange?: (snap: number | string | null) => void;
}

export function TongBottomSheet({ tongs, selectedTong, onSelectTong, onClose, onSnapChange }: TongBottomSheetProps) {
    const [snap, setSnap] = useState<number | string | null>(0.45);
    const isExpanded = snap === 0.85;

    const handleSnapChange = (newSnap: number | string | null) => {
        setSnap(newSnap);
        onSnapChange?.(newSnap);
    };

    return (
        <Drawer
            open={true}
            onOpenChange={() => { }}
            snapPoints={[0.45, 0.85]}
            activeSnapPoint={snap}
            setActiveSnapPoint={handleSnapChange}
            modal={false}
            dismissible={false}
        >
            <DrawerContent
                className="fixed bottom-[72px] md:bottom-[80px] left-0 right-0 z-[4000] bg-[#F8F9FA] border-t-0 rounded-t-3xl shadow-[0_-8px_30px_-5px_rgba(0,0,0,0.1)] flex flex-col focus-visible:outline-none focus:outline-none mx-auto w-full md:max-w-xl px-0 overflow-hidden"
                style={{ height: 'calc(85vh - 72px)' }}
            >
                {/* Drag Handle + Header */}
                <div
                    className="bg-white rounded-t-3xl cursor-grab active:cursor-grabbing px-4 pt-3 pb-4 shrink-0 border-b border-slate-100"
                    onClick={() => handleSnapChange(isExpanded ? 0.45 : 0.85)}
                >
                    {/* Handle bar */}
                    <div className="flex justify-center mb-3">
                        <div className="w-10 h-1 rounded-full bg-slate-300" />
                    </div>

                    {/* Header row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Coffee className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                                <span className="font-black text-base text-slate-900 leading-none font-display uppercase tracking-tight">সকল স্পট লিস্টিং</span>
                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{tongs.length}টি স্পট পাওয়া গেছে</p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full transition-all`}>
                            <ChevronUp className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                            {isExpanded ? "সংক্ষিপ্ত" : "সব দেখুন"}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-28">
                    {tongs.length > 0 ? (
                        tongs.map((tong) => (
                            <TongCard
                                key={tong.id}
                                tong={tong}
                                isSelected={selectedTong?.id === tong.id}
                                onClick={() => {
                                    onSelectTong(tong);
                                    if (isExpanded) {
                                        handleSnapChange(0.35);
                                    }
                                }}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                <MapIcon className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="font-bold text-slate-600 text-sm">কোনো স্পট পাওয়া যায়নি</p>
                            <p className="text-xs text-slate-400 mt-1">ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন</p>
                        </div>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
}
