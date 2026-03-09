import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "@/components/DashboardShell";
import BottomNav, { BottomNavItem } from "@/components/BottomNav";
import StatCard from "@/components/StatCard";
import AnimatedTabContent from "@/components/AnimatedTabContent";
import { ShoppingBag, Heart, MapPin, Clock, Home, Search, User, Bell, UtensilsCrossed, ShoppingCart, Beef, Fish, Star, ChevronRight, Package, CreditCard, HelpCircle, LogOut, Edit, Camera, Phone, Mail, Zap, Timer, Store, ArrowLeft } from "lucide-react";
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
      case "orders": return <ClientOrders onNewOrder={() => setActiveTab("explore")} />;
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

      <div className="hidden lg:grid grid-cols-2 gap-3">
        {/* Statistics cards hidden on mobile as per user request to remove them, but kept hidden in code for potential desktop use or future reference */}
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

      {/* Points card removed as per user request */}
    </div>
    </div >
  );
};

const ClientExplore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [stores, setStores] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("Tudo");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: storesData } = await supabase
          .from("stores")
          .select("*, categories(name)")
          .eq("is_active", true);

        const { data: categoriesData } = await supabase
          .from("categories")
          .select("*")
          .order("sort_order");

        if (storesData) setStores(storesData);
        if (categoriesData) setCategories(categoriesData);
      } catch (error) {
        console.error("Erro ao procurar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "Tudo" || store.categories?.name === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl font-bold text-foreground">Explorar</h2>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquisar lojas, produtos..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent font-body shadow-sm"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setActiveCategory("Tudo")}
          className={`px-4 py-2 rounded-full text-sm font-body font-medium whitespace-nowrap transition-all duration-200 ${activeCategory === "Tudo" ? "bg-accent text-accent-foreground shadow-sm" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}
        >
          Tudo
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.name)}
            className={`px-4 py-2 rounded-full text-sm font-body font-medium whitespace-nowrap transition-all duration-200 ${activeCategory === cat.name ? "bg-accent text-accent-foreground shadow-sm" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3 pt-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 w-full bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStores.length > 0 ? (
            filteredStores.map((store) => (
              <Link key={store.id} to={`/loja/${store.id}`} className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-muted rounded-xl overflow-hidden shrink-0">
                  {store.logo_url ? (
                    <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover" />
                  ) : (
                    <Store className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-display font-bold text-foreground block truncate">{store.name}</span>
                  <span className="text-xs text-muted-foreground font-body">{store.categories?.name || "Loja"} · {store.opening_time || "Aberto"}</span>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-accent">
                    <Star className="h-3.5 w-3.5 fill-accent" />
                    <span className="text-sm font-body font-bold">{store.average_rating || "N/A"}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </Link>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-body">Nenhuma loja encontrada.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ClientOrders = ({ onNewOrder }: { onNewOrder: () => void }) => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("orders")
          .select("*, stores(name, logo_url)")
          .eq("customer_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) setOrders(data);
      } catch (error) {
        console.error("Erro ao procurar encomendas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const fetchOrderItems = async (orderId: string) => {
    setLoadingItems(true);
    try {
      const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);
      if (error) throw error;
      if (data) setOrderItems(data);
    } catch (error) {
      console.error("Erro ao procurar itens da encomenda:", error);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleOpenDetails = (order: any) => {
    setSelectedOrder(order);
    fetchOrderItems(order.id);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.stores?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesFilter = true;
    if (filter === "active") {
      matchesFilter = ["Pendente", "Em preparação", "A caminho"].includes(order.status);
    } else if (filter === "delivered") {
      matchesFilter = order.status === "Entregue";
    } else if (filter === "cancelled") {
      matchesFilter = order.status === "Cancelado";
    }

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente": return "bg-zinc-100 text-zinc-600";
      case "Em preparação": return "bg-amber-100 text-amber-700";
      case "A caminho": return "bg-blue-100 text-blue-700";
      case "Entregue": return "bg-emerald-100 text-emerald-700";
      case "Cancelado": return "bg-red-100 text-red-700";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (selectedOrder) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedOrder(null)}
          className="flex items-center gap-2 text-sm font-body font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar aos pedidos
        </button>

        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-border pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center overflow-hidden shrink-0">
                {selectedOrder.stores?.logo_url ? (
                  <img src={selectedOrder.stores.logo_url} alt={selectedOrder.stores.name} className="w-full h-full object-cover" />
                ) : (
                  <Store className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-foreground">{selectedOrder.stores?.name}</h3>
                <p className="text-xs text-muted-foreground font-body">Pedido #{selectedOrder.id.slice(0, 8)}</p>
              </div>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-xs font-body font-bold text-center ${getStatusColor(selectedOrder.status)}`}>
              {selectedOrder.status}
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h4 className="font-display font-bold text-foreground text-sm flex items-center gap-2">
              <Package className="h-4 w-4 text-accent" /> Itens do Pedido
            </h4>
            {loadingItems ? (
              <div className="animate-pulse space-y-2">
                <div className="h-10 bg-muted rounded-xl" />
                <div className="h-10 bg-muted rounded-xl" />
              </div>
            ) : (
              <div className="bg-muted/30 rounded-2xl p-2 divide-y divide-border/50">
                {orderItems.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between font-body">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-lg">{item.quantity}x</span>
                      <span className="text-sm font-medium text-foreground">{item.product_name}</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">{item.total_price.toLocaleString()} Kz</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3 bg-muted/20 p-5 rounded-2xl border border-border/50">
            <div className="flex justify-between text-sm font-body text-muted-foreground">
              <span>Subtotal</span>
              <span>{selectedOrder.subtotal.toLocaleString()} Kz</span>
            </div>
            <div className="flex justify-between text-sm font-body text-muted-foreground">
              <span>Taxa de Entrega</span>
              <span>{selectedOrder.delivery_fee.toLocaleString()} Kz</span>
            </div>
            <div className="flex justify-between text-lg font-display font-bold text-foreground pt-3 border-t border-border">
              <span>Total</span>
              <span>{selectedOrder.total.toLocaleString()} Kz</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <h4 className="font-display font-bold text-foreground text-sm mb-3">Endereço de Entrega</h4>
            <div className="flex items-start gap-2 text-sm font-body text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
              <p>{selectedOrder.delivery_address || "Endereço não especificado"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filters = ["all", "active", "delivered", "cancelled"];
  const filterLabels: Record<string, string> = { all: "Todos", active: "Activos", delivered: "Entregues", cancelled: "Cancelados" };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Meus Pedidos</h2>
        <Button onClick={onNewOrder} className="rounded-2xl gap-2 font-display bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20">
          <ShoppingBag className="h-4 w-4" /> Fazer Pedido
        </Button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por loja ou ID..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent font-body shadow-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-body font-bold whitespace-nowrap transition-all ${filter === f ? "bg-accent text-accent-foreground shadow-md" : "bg-card border border-border text-muted-foreground hover:border-accent/50"}`}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => handleOpenDetails(order)}
              className="bg-card border border-border rounded-[2rem] p-5 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform duration-500">
                <Package className="h-16 w-16" />
              </div>

              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center overflow-hidden shrink-0">
                    {order.stores?.logo_url ? (
                      <img src={order.stores.logo_url} alt={order.stores.name} className="w-full h-full object-cover" />
                    ) : (
                      <Store className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <span className="font-display font-bold text-foreground text-sm block group-hover:text-accent transition-colors">{order.stores?.name}</span>
                    <span className="text-[10px] text-muted-foreground font-body">#{order.id.slice(0, 8)} · {new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-body font-bold px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50 relative z-10">
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Total</p>
                  <p className="font-display font-bold text-foreground text-base tracking-tight">{order.total.toLocaleString()} Kz</p>
                </div>
                <Button variant="ghost" size="sm" className="text-accent hover:text-accent hover:bg-accent/10 font-bold text-xs h-9 gap-2 rounded-xl group-hover:translate-x-1 transition-all">
                  Ver detalhes <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-muted/20 rounded-[2rem] border-2 border-dashed border-border/50">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-body font-medium mb-4">Ainda não tem pedidos.</p>
            <Button onClick={onNewOrder} className="rounded-2xl bg-accent text-accent-foreground">Fazer primeiro pedido</Button>
          </div>
        )}
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione uma imagem válida");
      return;
    }

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilizador não autenticado");

      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("store-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("store-images")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      toast.success("Foto de perfil atualizada!");
      onRefresh();
    } catch (error: any) {
      console.error("Erro ao carregar avatar:", error);
      toast.error("Erro ao carregar imagem");
    } finally {
      setIsSaving(false);
    }
  };

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
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isSaving}
                className="absolute bottom-0 right-0 p-2 rounded-xl bg-accent text-accent-foreground shadow-lg hover:scale-110 active:scale-90 transition-transform group-hover:rotate-12 disabled:opacity-50"
              >
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
