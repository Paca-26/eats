import { LucideIcon } from "lucide-react";

export interface BottomNavItem {
  label: string;
  icon: LucideIcon;
  id: string;
  badgeCount?: number;
}

interface BottomNavProps {
  items: BottomNavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
}

const BottomNav = ({ items, activeId, onNavigate }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around px-2 py-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-200 min-w-[64px] relative ${isActive
                  ? "text-accent scale-105"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? "bg-accent/10" : ""}`}>
                <Icon className={`h-5 w-5 transition-all duration-200 ${isActive ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
              </div>

              {item.badgeCount && item.badgeCount > 0 ? (
                <span className="absolute top-1.5 right-3 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-card shadow-sm animate-in zoom-in duration-300">
                  {item.badgeCount > 9 ? "9+" : item.badgeCount}
                </span>
              ) : null}

              <span className={`text-[10px] font-body transition-all duration-200 ${isActive ? "font-bold" : "font-medium"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
};

export default BottomNav;
