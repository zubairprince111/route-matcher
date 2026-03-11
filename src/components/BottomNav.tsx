import { NavLink } from "react-router-dom";
import { Home, Ticket, Calculator, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const navItems = [
        { name: "Home", path: "/", icon: Home },
        { name: "Tickets", path: "/tickets", icon: Ticket },
        {
            name: "Tong",
            path: "/tong",
            icon: ({ className }: { className?: string }) => (
                <img src="/tong_logo.png" alt="Tong" className={cn(className, "object-contain")} />
            )
        },
        { name: "About", path: "/about", icon: Info },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[5000] bg-background border-t border-border pb-safe pt-2">
            <div className="flex items-center justify-around px-2 pb-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex flex-col items-center justify-center w-full py-1 gap-1 rounded-xl transition-all",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className="relative">
                                    {item.name === "Tong" ? (
                                        <item.icon
                                            className={cn(
                                                "w-8 h-8 transition-transform duration-300",
                                                isActive ? "scale-110" : "scale-100"
                                            )}
                                        />
                                    ) : (
                                        <item.icon
                                            className={cn(
                                                "w-6 h-6 transition-transform duration-300",
                                                isActive ? "scale-110 fill-primary text-primary" : "scale-100"
                                            )}
                                            strokeWidth={isActive ? 2.5 : 2}
                                        />
                                    )}
                                    {isActive && item.name === "Home" && (
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-secondary rounded-full shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                                    )}
                                </div>
                                <span className={cn("text-[10px] uppercase font-bold tracking-wider mt-1 transition-all duration-300", isActive ? "text-primary" : "font-semibold")}>
                                    {item.name}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}
