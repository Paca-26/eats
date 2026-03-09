import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "@/components/DashboardShell";
import BottomNav, { BottomNavItem } from "@/components/BottomNav";
import StatCard from "@/components/StatCard";
import AnimatedTabContent from "@/components/AnimatedTabContent";
import { ShoppingBag, Heart, MapPin, Clock, Home, Search, User, Bell, UtensilsCrossed, ShoppingCart, Beef, Fish, Star, ChevronRight, Package, CreditCard, HelpCircle, LogOut, Edit, Camera, Phone, Mail, Zap, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useDisplayUser } from "@/hooks/useDisplayUser";
import { supabase } from "@/integrations/supabase/client";
import heroClient from "@/assets/hero-client.jpg";

const navItems: BottomNavItem[] = [
  { label: "Início", icon: Home, id: "home" },
  { label: "Explorar", icon: Search, id: "explore" },
  { label: "Pedidos", icon: ShoppingBag, id: "orders" },
  { label: "Alertas", icon: Bell, id: "alerts" },
  { label: "Perfil", icon: User, id: "profile" },
];

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("*, zones(name)")
        .eq("id", user.id)
        .maybeSingle();
      setProfile(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "home": return <ClientHome profile={profile} />;
      case "explore": return <ClientExplore />;
      case "orders": return <ClientOrders />;
      case "alerts": return <ClientAlerts />;
      case "profile": return <ClientProfile profile={profile} onRefresh={fetchProfile} />;
      default: return <ClientHome profile={profile} />;
    }
  };

  return (
    <DashboardShell
      title="Minha Conta"
      bottomNav={<BottomNav items={navItems} activeId={activeTab} onNavigate={setActiveTab} />}
    >
      <div className="container mx-auto px-4 py-6">
        <AnimatedTabContent activeTab={activeTab}>
          {renderContent()}
        </AnimatedTabContent>
      </div>
    </DashboardShell>
  );
};

const ClientHome = ({ profile }: { profile: any }) => {
  const { name, initials } = useDisplayUser();

  return (
    <div className="space-y-7">
      <div className="relative rounded-[2.5rem] p-8 shadow-2xl overflow-hidden border border-white/10 group transition-all duration-500 hover:shadow-blue-500/10 active:scale-[0.99] bg-zinc-900 lg:p-10 mb-8">
        {/* Procedural Mesh Background */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[80px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[80px] animate-pulse delay-700" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          <div className="relative shrink-0">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-[6px] border-zinc-800 shadow-2xl flex items-center justify-center text-white text-3xl font-display font-bold overflow-hidden ring-1 ring-white/20">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-zinc-800 border-4 border-emerald-500 rounded-full shadow-lg flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping absolute" />
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <p className="text-blue-100/80 font-body text-[10px] font-bold uppercase tracking-[0.2em]">Seja bem-vindo</p>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-sm">
              {profile?.full_name || name}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <div className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 transition-colors px-4 py-2 rounded-2xl border border-white/5 backdrop-blur-sm group/item">
                <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"><Phone className="h-3.5 w-3.5" /></div>
                <span className="text-sm font-body font-medium text-zinc-300 group-hover/item:text-white transition-colors">{profile?.phone || "Não definido"}</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 transition-colors px-4 py-2 rounded-2xl border border-white/5 backdrop-blur-sm group/item">
                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400"><MapPin className="h-3.5 w-3.5" /></div>
                <span className="text-sm font-body font-medium text-zinc-300 group-hover/item:text-white transition-colors">{profile?.zones?.name || "Luanda, Angola"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Encomendas" value="3" icon={ShoppingBag} />
        <StatCard label="Favoritos" value="7" icon={Heart} />
        <StatCard label="Endereços" value="2" icon={MapPin} />
        <StatCard label="Última Compra" value="Hoje" icon={Clock} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500 fill-amber-500" /> Categorias
          </h2>
          <span className="text-xs font-body font-medium text-muted-foreground bg-muted p-1 px-2 rounded-lg">Ver todas</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: "Supermercados", icon: ShoppingCart, slug: "supermercados", color: "from-emerald-500/10 to-emerald-500/5", iconColor: "text-emerald-500", shadow: "shadow-emerald-500/10" },
            { name: "Restaurantes", icon: UtensilsCrossed, slug: "restaurantes", color: "from-orange-500/10 to-orange-500/5", iconColor: "text-orange-500", shadow: "shadow-orange-500/10" },
            { name: "Talhos", icon: Beef, slug: "talhos", color: "from-rose-500/10 to-rose-500/5", iconColor: "text-rose-500", shadow: "shadow-rose-500/10" },
            { name: "Peixarias", icon: Fish, slug: "peixarias", color: "from-sky-500/10 to-sky-500/5", iconColor: "text-sky-500", shadow: "shadow-sky-500/10" },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.slug} to={`/categoria/${cat.slug}`} className="block group">
                <div className={`bg-gradient-to-br ${cat.color} border border-border/50 rounded-3xl p-5 transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden`}>
                  <div className={`absolute -right-2 -bottom-2 opacity-5 scale-150 rotate-12 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-125 ${cat.iconColor}`}>
                    <Icon className="h-16 w-16" />
                  </div>
                  <div className={`w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center mb-4 transition-transform duration-300 group-hover:-translate-y-1 ${cat.shadow}`}>
                    <Icon className={`h-6 w-6 ${cat.iconColor}`} />
                  </div>
                  <span className="font-display font-bold text-foreground text-base">{cat.name}</span>
                  <p className="text-[10px] text-muted-foreground font-body mt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explorar agora <ChevronRight className="h-3 w-3" />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
          <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" /> Pedidos Recentes
          </h2>
          <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-body font-bold rounded-xl h-8">Ver Histórico</Button>
        </div>
        <div className="divide-y divide-border/50">
          {[
            { store: "MMM' All4You", items: "2x Frango Grelhado, 1x Sumo", status: "Em preparação", statusColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400", price: "4.500 Kz", icon: UtensilsCrossed },
            { store: "Super Luanda", items: "Arroz, Óleo, Feijão", status: "Entregue", statusColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", price: "8.200 Kz", icon: ShoppingBag },
            { store: "Peixaria Atlântico", items: "1kg Camarão, 2kg Peixe", status: "A caminho", statusColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400", price: "12.000 Kz", icon: Fish },
          ].map((order, i) => {
            const Icon = order.icon;
            return (
              <div key={i} className="p-4 hover:bg-muted/50 transition-all cursor-pointer group flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-display font-bold text-foreground text-sm group-hover:text-blue-600 transition-colors">{order.store}</span>
                    <span className={`text-[10px] font-body font-bold px-2.5 py-1 rounded-full ${order.statusColor}`}>{order.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-body truncate">{order.items}</p>
                  <p className="text-sm font-body font-bold text-foreground mt-1.5">{order.price}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-6 flex items-center gap-4 shadow-lg shadow-amber-500/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform duration-700">
          <Star className="h-20 w-20 fill-white" />
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
          <Star className="h-6 w-6 text-white fill-white" />
        </div>
        <div className="flex-1 relative z-10">
          <p className="font-display font-bold text-lg">Pronto para poupar?</p>
          <p className="text-xs text-white/80 font-body">Acumulou 150 pontos para a próxima refeição.</p>
        </div>
        <div className="text-right relative z-10">
          <span className="font-display font-bold text-3xl">150</span>
          <p className="text-[10px] uppercase font-bold tracking-tighter opacity-80">pts</p>
        </div>
      </div>
    </div>
  );
};

const ClientExplore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const categories = ["Tudo", "Restaurantes", "Supermercados", "Talhos", "Peixarias", "Mercearias"];
  const [activeCategory, setActiveCategory] = useState("Tudo");

  const popularStores = [
    { name: "MMM' All4You", category: "Restaurante", rating: 4.8, deliveryTime: "25-35 min", image: "🍽️" },
    { name: "Super Luanda", category: "Supermercado", rating: 4.6, deliveryTime: "30-45 min", image: "🛒" },
    { name: "Talho Premium", category: "Talho", rating: 4.9, deliveryTime: "20-30 min", image: "🥩" },
    { name: "Peixaria Atlântico", category: "Peixaria", rating: 4.7, deliveryTime: "25-40 min", image: "🐟" },
    { name: "Mercearia da Avó", category: "Mercearia", rating: 4.5, deliveryTime: "15-25 min", image: "🏪" },
    { name: "Grelha de Ouro", category: "Restaurante", rating: 4.8, deliveryTime: "30-40 min", image: "🔥" },
  ];

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl font-bold text-foreground">Explorar</h2>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Pesquisar lojas, produtos..." className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent font-body shadow-sm" />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-body font-medium whitespace-nowrap transition-all duration-200 ${activeCategory === cat ? "bg-accent text-accent-foreground shadow-sm" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>{cat}</button>
        ))}
      </div>
      <div className="space-y-3">
        {popularStores.map((store, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center gap-4">
            <span className="text-3xl w-12 h-12 flex items-center justify-center bg-muted rounded-xl">{store.image}</span>
            <div className="flex-1 min-w-0">
              <span className="font-display font-bold text-foreground block">{store.name}</span>
              <span className="text-xs text-muted-foreground font-body">{store.category} · {store.deliveryTime}</span>
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-center gap-1 text-accent">
                <Star className="h-3.5 w-3.5 fill-accent" />
                <span className="text-sm font-body font-bold">{store.rating}</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
};

const ClientOrders = () => {
  const [filter, setFilter] = useState("all");
  const orders = [
    { id: "#1045", store: "MMM' All4You", date: "Hoje, 14:30", status: "Em preparação", statusColor: "bg-amber-100 text-amber-700", items: "2x Frango, 1x Sumo Natural", total: "4.500 Kz" },
    { id: "#1044", store: "Peixaria Atlântico", date: "Hoje, 11:20", status: "A caminho", statusColor: "bg-blue-100 text-blue-700", items: "1kg Camarão, 2kg Corvina", total: "12.000 Kz" },
    { id: "#1040", store: "Super Luanda", date: "Ontem", status: "Entregue", statusColor: "bg-emerald-100 text-emerald-700", items: "Arroz 5kg, Óleo, Feijão", total: "8.200 Kz" },
    { id: "#1035", store: "Talho Premium", date: "25 Fev", status: "Entregue", statusColor: "bg-emerald-100 text-emerald-700", items: "2kg Picanha, 1kg Costela", total: "15.800 Kz" },
    { id: "#1028", store: "Mercearia da Avó", date: "23 Fev", status: "Cancelado", statusColor: "bg-red-100 text-red-700", items: "Temperos variados", total: "3.200 Kz" },
  ];
  const filters = ["all", "active", "delivered", "cancelled"];
  const filterLabels: Record<string, string> = { all: "Todos", active: "Activos", delivered: "Entregues", cancelled: "Cancelados" };

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl font-bold text-foreground">Meus Pedidos</h2>
      <div className="flex gap-2">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all ${filter === f ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>{filterLabels[f]}</button>
        ))}
      </div>
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-body font-bold text-foreground text-sm">{order.id}</span>
                <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${order.statusColor}`}>{order.status}</span>
              </div>
              <span className="text-xs text-muted-foreground font-body">{order.date}</span>
            </div>
            <p className="font-display font-bold text-foreground text-sm">{order.store}</p>
            <p className="text-xs text-muted-foreground font-body mt-0.5">{order.items}</p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <span className="font-body font-bold text-foreground">{order.total}</span>
              <Button variant="ghost" size="sm" className="text-accent font-body text-xs h-8">Ver detalhes</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ClientAlerts = () => {
  const notifications = [
    { title: "Encomenda a caminho!", desc: "O seu pedido #1044 saiu para entrega.", time: "há 5 min", icon: Package, color: "bg-blue-100 text-blue-600", unread: true },
    { title: "Pedido confirmado", desc: "MMM' All4You aceitou o seu pedido #1045.", time: "há 20 min", icon: ShoppingBag, color: "bg-emerald-100 text-emerald-600", unread: true },
    { title: "Promoção!", desc: "Super Luanda: 20% desconto em frescos hoje.", time: "há 1h", icon: Star, color: "bg-amber-100 text-amber-600", unread: false },
    { title: "Entrega concluída", desc: "Pedido #1040 entregue com sucesso.", time: "há 3h", icon: Package, color: "bg-emerald-100 text-emerald-600", unread: false },
    { title: "Novidade", desc: "Grelha de Ouro adicionou novos pratos!", time: "Ontem", icon: UtensilsCrossed, color: "bg-orange-100 text-orange-600", unread: false },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground">Notificações</h2>
        <span className="bg-accent text-accent-foreground text-[10px] font-body font-bold px-2 py-0.5 rounded-full">2 novas</span>
      </div>
      <div className="space-y-2">
        {notifications.map((n, i) => {
          const Icon = n.icon;
          return (
            <div key={i} className={`bg-card border rounded-2xl p-4 flex items-start gap-3 transition-all cursor-pointer hover:shadow-md ${n.unread ? "border-accent/30 bg-accent/5" : "border-border"}`}>
              <div className={`p-2 rounded-xl ${n.color} shrink-0`}><Icon className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-foreground text-sm">{n.title}</span>
                  {n.unread && <div className="h-2 w-2 rounded-full bg-accent" />}
                </div>
                <p className="text-xs text-muted-foreground font-body mt-0.5">{n.desc}</p>
              </div>
              <span className="text-[10px] text-muted-foreground font-body whitespace-nowrap">{n.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LogoutButton = () => {
  const { demoLogout } = useDemoAuth();
  const navigate = useNavigate();
  const handleLogout = () => { demoLogout(); navigate("/auth"); };
  return (
    <Button variant="outline" onClick={handleLogout} className="w-full rounded-xl h-12 gap-2 font-body text-destructive border-destructive/20 hover:bg-destructive/10">
      <LogOut className="h-4 w-4" /> Terminar Sessão
    </Button>
  );
};

const ClientProfile = ({ profile, onRefresh }: { profile: any; onRefresh: () => void }) => {
  const { name, email, initials } = useDisplayUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [zones, setZones] = useState<any[]>([]);

  const [editForm, setEditForm] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    zone_id: profile?.zone_id || "",
  });

  useEffect(() => {
    const fetchZones = async () => {
      const { data } = await supabase
        .from("zones")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (data) setZones(data);
    };
    fetchZones();
  }, []);

  useEffect(() => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        zone_id: profile.zone_id || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilizador não autenticado");

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editForm.full_name,
          phone: editForm.phone,
          zone_id: editForm.zone_id === "" ? null : editForm.zone_id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Perfil atualizado com sucesso!");
      setIsEditing(false);
      onRefresh();
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error(`Erro: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = profile?.full_name || name;
  const displayEmail = email;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Meu Perfil</h2>

      {!isEditing ? (
        <>
          <div className="bg-card border border-border rounded-3xl p-8 flex flex-col items-center text-center shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500/10 to-indigo-500/10" />
            <div className="relative mb-5 z-10 pt-2">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-4 border-white dark:border-zinc-800 shadow-xl flex items-center justify-center text-white text-3xl font-display font-bold overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <button className="absolute bottom-0 right-0 p-2 rounded-xl bg-accent text-accent-foreground shadow-lg hover:scale-110 active:scale-90 transition-transform group-hover:rotate-12">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="relative z-10 w-full">
              <h3 className="font-display font-bold text-foreground text-xl leading-tight">{displayName}</h3>
              <p className="text-sm text-muted-foreground font-body mt-1">{displayEmail}</p>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-2xl border border-border/50 text-xs text-muted-foreground font-body">
                  <MapPin className="h-3.5 w-3.5 text-blue-500" /> {profile?.zones?.name || "Luanda"}
                </div>
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-2xl border border-border/50 text-xs text-muted-foreground font-body">
                  <Phone className="h-3.5 w-3.5 text-emerald-500" /> {profile?.phone || "Não definido"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {[
              { icon: Edit, label: "Editar Perfil", desc: "Nome, email, telefone", action: () => setIsEditing(true) },
              { icon: MapPin, label: "Endereços", desc: "2 endereços guardados" },
              { icon: CreditCard, label: "Pagamentos", desc: "Multicaixa Express" },
              { icon: Bell, label: "Notificações", desc: "Configurar alertas" },
              { icon: Star, label: "Programa de Pontos", desc: "150 pontos acumulados" },
              { icon: HelpCircle, label: "Ajuda & Suporte", desc: "FAQ, contacto" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  onClick={item.action}
                  className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="p-2 rounded-xl bg-muted"><Icon className="h-4 w-4 text-foreground" /></div>
                  <div className="flex-1">
                    <span className="font-body font-semibold text-foreground text-sm block">{item.label}</span>
                    <span className="text-xs text-muted-foreground font-body">{item.desc}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="full_name" className="text-sm font-body font-semibold px-1">Nome Completo</label>
              <Input
                id="full_name"
                value={editForm.full_name}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                className="rounded-xl border-border bg-background h-12"
                placeholder="Introduza o seu nome"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-body font-semibold px-1">Telefone</label>
              <Input
                id="phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="rounded-xl border-border bg-background h-12"
                placeholder="Ex: 923 000 000"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="zone" className="text-sm font-body font-semibold px-1">Localização (Zona)</label>
              <select
                id="zone"
                value={editForm.zone_id || ""}
                onChange={(e) => setEditForm({ ...editForm, zone_id: e.target.value })}
                className="w-full rounded-xl border border-border bg-background h-12 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent font-body"
              >
                <option value="">Selecionar zona...</option>
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>{zone.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="flex-1 h-12 rounded-xl font-body font-bold"
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 h-12 rounded-xl font-body font-bold bg-accent text-white hover:bg-accent/90"
              disabled={isSaving}
            >
              {isSaving ? "A guardar..." : "Guardar Alterações"}
            </Button>
          </div>
        </div>
      )}

      <LogoutButton />
    </div>
  );
};

export default ClientDashboard;
