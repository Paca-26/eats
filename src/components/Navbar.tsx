import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
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

  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoMo} alt="Mmm" className="h-10 w-10 rounded-full object-cover" />
          <span className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
            Mmm
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 font-body text-sm">
          {[
            { label: "Início", icon: Home, path: "/" },
            { label: "Categorias", icon: Grid3X3, path: "/categorias" },
            { label: "Pesquisar", icon: Search, path: "/pesquisar" },
            { label: "Carrinho", icon: ShoppingCart, path: "/carrinho" },
            { label: "Conta", icon: User, path: getDashboardPath() },
          ].map((link) => {
            const Icon = link.icon;
            const path = link.path;
            const isActive = location.pathname === path;
            
            // Special handling for "Conta" link to show profile if logged in
            if (link.label === "Conta" && isLoggedIn) {
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden border border-primary-foreground/20">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-bold text-white">
                        {name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="max-w-[100px] truncate">{name.split(" ")[0]}</span>
                </Link>
              );
            }

            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Location */}
        <div className="hidden lg:flex items-center gap-1 text-primary-foreground/80 text-sm cursor-pointer hover:text-primary-foreground transition-colors">
          <MapPin className="h-4 w-4 text-accent" />
          <span>Luanda, Talatona</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
