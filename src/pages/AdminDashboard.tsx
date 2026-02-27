import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Users, Store, MapPin, ShieldCheck, LogOut, Home, Package } from "lucide-react";
import logoMo from "@/assets/logo-mo-alimenta.jpg";

const AdminDashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) { setChecking(false); return; }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      if (data?.role === "admin") {
        setAuthorized(true);
      }
      setChecking(false);
    };
    if (!authLoading) checkRole();
  }, [user, authLoading]);

  if (authLoading || checking) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-pulse text-muted-foreground font-body">A carregar...</div></div>;
  }

  if (!user || !authorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <ShieldCheck className="h-12 w-12 mx-auto text-destructive" />
          <h1 className="font-display text-2xl font-bold text-foreground">Acesso Restrito</h1>
          <p className="text-muted-foreground font-body">Apenas administradores podem aceder a esta área.</p>
          <Link to="/"><Button className="bg-accent text-accent-foreground rounded-full">Voltar ao Início</Button></Link>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Utilizadores", value: "—", icon: Users },
    { label: "Lojas", value: "—", icon: Store },
    { label: "Encomendas", value: "—", icon: Package },
    { label: "Zonas", value: "—", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoMo} alt="Mo Alimenta" className="h-8 w-8 rounded-full object-cover" />
            <span className="font-display font-bold text-lg">Admin Mo Alimenta</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/"><Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10"><Home className="h-5 w-5" /></Button></Link>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10" onClick={signOut}><LogOut className="h-5 w-5" /></Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Painel Administrativo 🛡️</h1>
        <p className="text-muted-foreground font-body mb-8">Gestão central da plataforma Mo Alimenta.</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-5 w-5 text-accent" />
                  <span className="text-sm text-muted-foreground font-body">{stat.label}</span>
                </div>
                <span className="font-display text-2xl font-bold text-foreground">{stat.value}</span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">Gestão de Lojas</h2>
            <p className="text-muted-foreground font-body text-sm mb-4">Aprovar, editar e gerir todas as lojas da plataforma.</p>
            <Button variant="outline" className="rounded-xl">Ver Lojas</Button>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">Gestão de Zonas</h2>
            <p className="text-muted-foreground font-body text-sm mb-4">Configurar zonas de entrega e taxas de delivery.</p>
            <Button variant="outline" className="rounded-xl">Ver Zonas</Button>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">Utilizadores</h2>
            <p className="text-muted-foreground font-body text-sm mb-4">Gerir contas de clientes, vendedores e logística.</p>
            <Button variant="outline" className="rounded-xl">Ver Utilizadores</Button>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">Encomendas</h2>
            <p className="text-muted-foreground font-body text-sm mb-4">Acompanhar todas as encomendas da plataforma.</p>
            <Button variant="outline" className="rounded-xl">Ver Encomendas</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
