import { Coffee, Clock, Star, MapPin } from "lucide-react";
import { TongLocation, isTongOpen } from "@/data/tongData";

interface TongCardProps {
    tong: TongLocation;
    isSelected?: boolean;
    onClick?: () => void;
}

export function TongCard({ tong, isSelected, onClick }: TongCardProps) {
    const isOpen = isTongOpen(tong);

    return (
        <div
            onClick={onClick}
            className={`p-4 rounded-2xl shadow-sm border transition-all cursor-pointer group active:scale-[0.98] ${isSelected ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200' : 'bg-white border-slate-100 hover:shadow-md'
                }`}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col gap-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full w-fit ${tong.type === 'Tong' ? 'bg-amber-100 text-amber-700' :
                        tong.type === 'Boutique' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-blue-100 text-blue-700'
                        }`}>
                        {tong.type}
                    </span>
                    <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors uppercase tracking-tight">
                        {tong.name}
                    </h3>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-bold text-yellow-700">{tong.rating}</span>
                </div>
            </div>

            <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                {tong.description}
            </p>

            <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px] font-medium text-slate-500 truncate max-w-[120px]">
                        {tong.address}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-slate-600 leading-none mb-1">
                            {tong.openTime} - {tong.closeTime}
                        </span>
                        {isOpen ? (
                            <span className="text-[10px] font-black text-emerald-600 tracking-wider">OPEN NOW</span>
                        ) : (
                            <span className="text-[10px] font-black text-red-500 tracking-wider">CLOSED</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
