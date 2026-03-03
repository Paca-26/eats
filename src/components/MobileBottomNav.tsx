import { Home, Search, ShoppingCart, User, Grid3X3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const tabs = [
  { label: "Início", icon: Home, path: "/" },
  { label: "Categorias", icon: Grid3X3, path: "/categorias" },
  { label: "Pesquisar", icon: Search, path: "/pesquisar" },
  { label: "Carrinho", icon: ShoppingCart, path: "/carrinho" },
  { label: "Conta", icon: User, path: "/auth" },
];

const MobileBottomNav = () => {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-200 min-w-[56px] ${
                isActive
                  ? "text-accent scale-105"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? "bg-accent/10" : ""}`}>
                <Icon className={`h-5 w-5 transition-all duration-200 ${isActive ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
              </div>
              <span className={`text-[10px] font-body transition-all duration-200 ${isActive ? "font-bold" : "font-medium"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
};

export default MobileBottomNav;
