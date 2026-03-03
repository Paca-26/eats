import { Search, MapPin, ShoppingCart, User, Home, Grid3X3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logoMo from "@/assets/logo-mo-alimenta.jpg";

const navLinks = [
  { label: "Início", icon: Home, path: "/" },
  { label: "Categorias", icon: Grid3X3, path: "/categorias" },
  { label: "Pesquisar", icon: Search, path: "/pesquisar" },
  { label: "Carrinho", icon: ShoppingCart, path: "/carrinho" },
  { label: "Conta", icon: User, path: "/auth" },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoMo} alt="asap" className="h-10 w-10 rounded-full object-cover" />
          <span className="font-display text-xl font-bold text-primary-foreground hidden sm:block">
            asap
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1 font-body text-sm">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
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
