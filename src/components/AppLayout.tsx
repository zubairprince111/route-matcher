import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";

export function AppLayout() {
    return (
        <div className="relative min-h-screen w-full flex flex-col bg-background text-foreground overflow-hidden">
            <main className="flex-1 overflow-y-auto pb-[72px] md:pb-[80px]">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
}
