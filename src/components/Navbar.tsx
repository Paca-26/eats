import { Search, MapPin, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logoMo from "@/assets/logo-mo-alimenta.jpg";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoMo} alt="Mo Alimenta" className="h-10 w-10 rounded-full object-cover" />
          <span className="font-display text-xl font-bold text-primary-foreground hidden sm:block">
            Mo Alimenta
          </span>
        </div>

        {/* Search bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar produtos, lojas..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-primary-foreground text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        {/* Location */}
        <div className="hidden lg:flex items-center gap-1 text-primary-foreground/80 text-sm cursor-pointer hover:text-primary-foreground transition-colors">
          <MapPin className="h-4 w-4 text-accent" />
          <span>Luanda, Talatona</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-forest-light">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-forest-light">
            <User className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-primary-foreground hover:bg-forest-light"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile search */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-3 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar produtos, lojas..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-primary-foreground text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex items-center gap-1 text-primary-foreground/80 text-sm mt-2">
            <MapPin className="h-4 w-4 text-accent" />
            <span>Luanda, Talatona</span>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
