import { useState } from "react";
import { X, MapPin, Clock, Coffee, Plus, Check } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { TongLocation } from "@/data/tongData";
import { useToast } from "@/hooks/use-toast";

interface AddTongBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (tong: Omit<TongLocation, "id" | "rating">) => void;
}

export function AddTongBottomSheet({ isOpen, onClose, onAdd }: AddTongBottomSheetProps) {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        type: "Tong" as TongLocation["type"],
        description: "",
        openTime: "10:00",
        closeTime: "22:00",
        address: "",
        lat: 23.7485,
        lng: 90.3752,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.address) {
            toast({
                title: "Error",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        onAdd(formData);
        setFormData({
            name: "",
            type: "Tong",
            description: "",
            openTime: "10:00",
            closeTime: "22:00",
            address: "",
            lat: 23.7485,
            lng: 90.3752,
        });
        onClose();
        toast({
            title: "Success",
            description: "Tong spot added successfully!",
        });
    };

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className="fixed bottom-0 left-0 right-0 z-[6001] bg-white border-t-0 rounded-t-3xl shadow-2xl flex flex-col focus-visible:outline-none focus:outline-none mx-auto w-full md:max-w-xl px-0">
                <DrawerHeader className="border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between">
                        <DrawerTitle className="font-black text-xl text-slate-900 font-display">নতুন স্পট যুক্ত করুন</DrawerTitle>
                        <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <X className="w-4 h-4 text-slate-500" />
                        </button>
                    </div>
                </DrawerHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[75vh] pb-32">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-widest">স্পটের নাম (Required)</Label>
                            <Input
                                id="name"
                                placeholder="Ex: Dhanmondi 32 Chayer Tong"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="rounded-xl border-slate-200 focus:ring-emerald-500"
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
