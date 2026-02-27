import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Star, TrendingUp, LogOut, Home, Plus } from "lucide-react";
import logoMo from "@/assets/logo-mo-alimenta.jpg";

const VendorDashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
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
      if (data?.role === "store" || data?.role === "admin") {
        setAuthorized(true);
      }
      setChecking(false);
    };
    if (!authLoading) checkRole();
  }, [user, authLoading]);

  if (authLoading || checking) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-pulse text-muted-foreground font-body">A carregar...</div></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className="font-display text-2xl font-bold text-foreground">Acesso Restrito</h1>
          <p className="text-muted-foreground font-body">Precisa entrar na sua conta para aceder ao painel.</p>
          <Link to="/auth"><Button className="bg-accent text-accent-foreground rounded-full">Entrar</Button></Link>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className="font-display text-2xl font-bold text-foreground">Sem Permissão</h1>
          <p className="text-muted-foreground font-body">A sua conta não tem acesso ao painel de vendedor.</p>
          <Link to="/"><Button className="bg-accent text-accent-foreground rounded-full">Voltar ao Início</Button></Link>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Produtos", value: "0", icon: Package, color: "text-accent" },
    { label: "Encomendas", value: "0", icon: ShoppingCart, color: "text-accent" },
    { label: "Avaliação", value: "N/A", icon: Star, color: "text-accent" },
    { label: "Receita", value: "0 Kz", icon: TrendingUp, color: "text-accent" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoMo} alt="Mo Alimenta" className="h-8 w-8 rounded-full object-cover" />
            <span className="font-display font-bold text-lg">Painel Vendedor</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/"><Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10"><Home className="h-5 w-5" /></Button></Link>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10" onClick={signOut}><LogOut className="h-5 w-5" /></Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Bem-vindo, Vendedor 👋</h1>
        <p className="text-muted-foreground font-body mb-8">Gerencie a sua loja, produtos e encomendas.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                  <span className="text-sm text-muted-foreground font-body">{stat.label}</span>
                </div>
                <span className="font-display text-2xl font-bold text-foreground">{stat.value}</span>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-display text-xl font-bold text-foreground mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl h-12 gap-2">
              <Plus className="h-4 w-4" /> Adicionar Produto
            </Button>
            <Button variant="outline" className="rounded-xl h-12 gap-2">
              <ShoppingCart className="h-4 w-4" /> Ver Encomendas
            </Button>
            <Button variant="outline" className="rounded-xl h-12 gap-2">
              <Star className="h-4 w-4" /> Ver Avaliações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
