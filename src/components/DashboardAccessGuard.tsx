import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2 } from "lucide-react";

interface DashboardAccessGuardProps {
  allowedRoles: string[];
  children: ReactNode;
}

const DashboardAccessGuard = ({ allowedRoles, children }: DashboardAccessGuardProps) => {
  const { demoUser, isDemoMode } = useDemoAuth();
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="h-10 w-10 text-accent animate-spin" />
        <p className="text-muted-foreground font-body">Verificando permissões...</p>
      </div>
    );
  }

  const currentRole = isDemoMode ? demoUser?.role : role;
  const isAuthenticated = isDemoMode ? !!demoUser : !!user;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 animate-fade-in">
        <div className="text-center space-y-4 max-w-sm">
          <ShieldCheck className="h-12 w-12 mx-auto text-accent" />
          <h1 className="font-display text-2xl font-bold text-foreground">Acesso Restrito</h1>
          <p className="text-muted-foreground font-body">Precisa entrar na sua conta para aceder a esta área.</p>
          <Link to="/auth">
            <Button className="bg-accent text-accent-foreground rounded-full px-8">Entrar</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!currentRole || !allowedRoles.includes(currentRole as string)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 animate-fade-in">
        <div className="text-center space-y-4 max-w-sm">
          <ShieldCheck className="h-12 w-12 mx-auto text-destructive" />
          <h1 className="font-display text-2xl font-bold text-foreground">Sem Permissão</h1>
          <p className="text-muted-foreground font-body">A sua conta não tem acesso a esta área.</p>
          <Link to="/auth">
            <Button className="bg-accent text-accent-foreground rounded-full px-8">Voltar ao Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default DashboardAccessGuard;
