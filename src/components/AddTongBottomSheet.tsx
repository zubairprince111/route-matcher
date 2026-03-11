import { useState, useEffect } from "react";
import { X, MapPin, Clock, Coffee, Plus, Check, Star } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { TongLocation } from "@/data/tongData";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddTongBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    initialCoords?: { lat: number; lng: number } | null;
}

export function AddTongBottomSheet({ isOpen, onClose, initialCoords }: AddTongBottomSheetProps) {
    const { toast } = useToast();
    const [isPickingLocation, setIsPickingLocation] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        type: "Tong" as TongLocation["type"],
        description: "",
        openTime: "10:00",
        closeTime: "22:00",
        address: "",
        rating: 5,
        lat: 23.7485,
        lng: 90.3752,
    });

    const queryClient = useQueryClient();

    const addTongMutation = useMutation({
        mutationFn: async (spot: any) => {
            const res = await fetch("/api/tongs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(spot),
            });
            if (!res.ok) throw new Error("Failed to post Tong spot");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tongs"] });
            toast({ title: "Success", description: "Tong spot added successfully!" });
            setFormData({
                name: "",
                type: "Tong",
                description: "",
                openTime: "10:00",
                closeTime: "22:00",
                rating: 5,
                address: "",
                lat: 23.7485,
                lng: 90.3752,
            });
            onClose();
            setIsPickingLocation(false);
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to add spot.", variant: "destructive" });
        }
    });

    // Auto-resume form when map is clicked
    useEffect(() => {
        if (initialCoords && isPickingLocation) {
            setFormData(prev => ({
                ...prev,
                lat: initialCoords.lat,
                lng: initialCoords.lng,
                address: prev.address || "Selected via Map"
            }));
            setIsPickingLocation(false); // Map clicked, bring form back!
        } else if (initialCoords) {
            setFormData(prev => ({
                ...prev,
                lat: initialCoords.lat,
                lng: initialCoords.lng,
            }));
        }
    }, [initialCoords]);

    // Force form closed when global modal is closed
    useEffect(() => {
        if (!isOpen) {
            setIsPickingLocation(false);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.address) {
            toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" });
            return;
        }
        addTongMutation.mutate(formData);
    };

    if (isOpen && isPickingLocation) {
        return (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[8000] bg-white text-emerald-800 px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-3 border border-emerald-100 animate-in slide-in-from-bottom-5">
                <MapPin className="animate-bounce" />
                Tap on the map to place pin
                <button
                    onClick={() => setIsPickingLocation(false)}
                    className="ml-2 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
                >
                    <X size={14} />
                </button>
            </div>
        );
    }

    return (
        <Drawer open={isOpen && !isPickingLocation} onOpenChange={onClose} modal={false} dismissible={false}>
            <DrawerContent className="fixed bottom-0 left-0 right-0 z-[6001] bg-white border-t-0 rounded-t-3xl shadow-2xl flex flex-col focus-visible:outline-none focus:outline-none mx-auto w-full md:max-w-xl px-0 max-h-[90vh]">
                <DrawerHeader className="border-b border-slate-100 pb-4 shrink-0">
                    <div className="flex items-center justify-between">
                        <DrawerTitle className="font-black text-xl text-slate-900 font-display">নতুন স্পট যুক্ত করুন</DrawerTitle>
                        <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <X className="w-4 h-4 text-slate-500" />
                        </button>
                    </div>
                </DrawerHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto pb-8">
                    <div className="space-y-4">
                        {/* Map Picker Guide */}
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-start gap-4 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="space-y-1 mt-0.5">
                                    <h3 className="font-bold text-sm text-blue-900">ম্যাপে স্পটটি চিহ্নিত করুন</h3>
                                    <p className="text-xs text-blue-700 leading-relaxed">
                                        নিচ থেকে ফর্ম পূরণ করার সময় ম্যাপের যেকোনো জায়গায় ট্যাপ করে সঠিক লোকেশনটি সেট করুন।
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsPickingLocation(true)}
                                className="w-full sm:w-auto shrink-0 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <MapPin size={14} />
                                Select on Map
                            </button>
                        </div>


                        {/* Status/Help message if location is picked from map */}
                        {initialCoords && (
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                    <Check className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div className="text-xs text-emerald-700 leading-tight">
                                    <span className="font-bold block mb-0.5">লোকেশন সেট করা হয়েছে</span>
                                    ম্যাপ থেকে আপনার পছন্দের জায়গাটি চিহ্নিত করেছেন।
                                </div>
                            </div>
                        )}

                        {/* Rating Selection */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center block">রেটিং দিন</Label>
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        className="transition-all active:scale-90"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${formData.rating >= star
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-slate-200 fill-slate-100"
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-widest">স্পটের নাম (Required)</Label>
                            <Input
                                id="name"
                                placeholder="Ex: Dhanmondi 32 Chayer Tong"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="rounded-xl border-slate-200 focus:ring-emerald-500"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">ধরণ</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {["Tong", "Boutique", "Hangout"].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: type as any })}
                                        className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${formData.type === type
                                            ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                                            : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-xs font-bold text-slate-500 uppercase tracking-widest">ঠিকানা / এলাকা (Required)</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    id="address"
                                    placeholder="Ex: Dhanmondi, Dhaka"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="rounded-xl pl-10 border-slate-200 focus:ring-emerald-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="openTime" className="text-xs font-bold text-slate-500 uppercase tracking-widest">খোলে (Time)</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    <Input
                                        id="openTime"
                                        type="time"
                                        value={formData.openTime}
                                        onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                                        className="rounded-xl pl-10 border-slate-200 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="closeTime" className="text-xs font-bold text-slate-500 uppercase tracking-widest">বন্ধ হয় (Time)</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    <Input
                                        id="closeTime"
                                        type="time"
                                        value={formData.closeTime}
                                        onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                                        className="rounded-xl pl-10 border-slate-200 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Direct Location Manual Entry */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="lat" className="text-xs font-bold text-slate-500 uppercase tracking-widest">Latitude</Label>
                                <Input
                                    id="lat"
                                    type="number"
                                    step="any"
                                    value={formData.lat}
                                    onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                                    className="rounded-xl border-slate-200 focus:ring-emerald-500 text-xs font-mono"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lng" className="text-xs font-bold text-slate-500 uppercase tracking-widest">Longitude</Label>
                                <Input
                                    id="lng"
                                    type="number"
                                    step="any"
                                    value={formData.lng}
                                    onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                                    className="rounded-xl border-slate-200 focus:ring-emerald-500 text-xs font-mono"
                                    required
                                />
                            </div>
                        </div>


                        <div className="space-y-2">
                            <Label htmlFor="desc" className="text-xs font-bold text-slate-500 uppercase tracking-widest">বর্ণনা (Optional)</Label>
                            <Input
                                id="desc"
                                placeholder="Tell us why this spot is special..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="rounded-xl border-slate-200 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-base shadow-lg transition-transform active:scale-[0.98]">
                        <Plus className="w-5 h-5 mr-2" strokeWidth={3} />
                        স্পট লিস্টিং এ যোগ করুন
                    </Button>
                </form>
            </DrawerContent>
        </Drawer>
    );
}
