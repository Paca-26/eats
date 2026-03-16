import { Home, Search, ShoppingCart, User, Grid3X3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useDisplayUser } from "@/hooks/useDisplayUser";
import { useAuth } from "@/contexts/AuthContext";

const MobileBottomNav = () => {
  const location = useLocation();
  const { name, avatarUrl, email } = useDisplayUser();
  const { role } = useAuth();
  const isLoggedIn = !!email;

  const getDashboardPath = () => {
    if (!isLoggedIn) return "/auth";
    const roleRoute: Record<string, string> = {
      client: "/cliente",
      store: "/vendedor",
      logistics: "/logistica",
      admin: "/admin",
    };
    return roleRoute[role ?? "client"] ?? "/cliente";
  };

  const tabs = [
    { label: "Início", icon: Home, path: "/" },
    { label: "Categorias", icon: Grid3X3, path: "/categorias" },
    { label: "Pesquisar", icon: Search, path: "/pesquisar" },
    { label: "Carrinho", icon: ShoppingCart, path: "/carrinho" },
    { label: "Conta", icon: User, path: getDashboardPath() },
  ];

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
                {tab.label === "Conta" && isLoggedIn ? (
                  <div className={`w-5 h-5 rounded-full overflow-hidden border ${isActive ? "border-accent ring-2 ring-accent/20" : "border-muted-foreground/30"}`}>
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-accent text-white flex items-center justify-center text-[8px] font-bold">
                        {name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                ) : (
                  <Icon className={`h-5 w-5 transition-all duration-200 ${isActive ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
                )}
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
