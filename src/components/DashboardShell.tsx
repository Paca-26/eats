import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";
import logoMo from "@/assets/logo-mo-alimenta.jpg";

interface DashboardShellProps {
  title: string;
  children: ReactNode;
  bottomNav: ReactNode;
}

const DashboardShell = ({ title, children, bottomNav }: DashboardShellProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoMo} alt="asap" className="h-8 w-8 rounded-full object-cover" />
            <span className="font-display font-bold text-lg leading-tight">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      {bottomNav}
    </div>
  );
};

export default DashboardShell;
