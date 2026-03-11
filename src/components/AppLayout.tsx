import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";

export function AppLayout() {
    return (
        <div className="relative flex flex-col bg-background text-foreground overflow-hidden" style={{ height: '100dvh' }}>
            <main className="flex-1 overflow-y-auto pb-[72px] md:pb-[80px]" style={{ WebkitOverflowScrolling: 'touch' }}>
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
}
