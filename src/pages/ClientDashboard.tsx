import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "@/components/DashboardShell";
import BottomNav, { BottomNavItem } from "@/components/BottomNav";
import StatCard from "@/components/StatCard";
import AnimatedTabContent from "@/components/AnimatedTabContent";
import { ShoppingBag, Heart, MapPin, Clock, Home, Search, User, Bell, UtensilsCrossed, ShoppingCart, Beef, Fish, Star, ChevronRight, Package, CreditCard, HelpCircle, LogOut, Edit, Camera, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useDisplayUser } from "@/hooks/useDisplayUser";
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

  const renderContent = () => {
    switch (activeTab) {
      case "home": return <ClientHome />;
      case "explore": return <ClientExplore />;
      case "orders": return <ClientOrders />;
      case "alerts": return <ClientAlerts />;
      case "profile": return <ClientProfile />;
      default: return <ClientHome />;
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

const ClientHome = () => {
  const { name } = useDisplayUser();
  return (
  <div className="space-y-6">
    <div className="relative rounded-2xl overflow-hidden h-44">
      <img src={heroClient} alt="Comida" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
      <div className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
        <p className="text-white/80 font-body text-sm">Bom dia 👋</p>
        <h1 className="font-display text-2xl font-bold mt-1">{name}</h1>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-body px-2.5 py-0.5 rounded-full flex items-center gap-1"><MapPin className="h-3 w-3" /> Talatona</span>
          <span className="bg-emerald-500/80 backdrop-blur-sm text-white text-xs font-body px-2.5 py-0.5 rounded-full flex items-center gap-1"><Star className="h-3 w-3" /> 150 pts</span>
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
      <h2 className="font-display text-lg font-bold text-foreground mb-3">Categorias</h2>
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: "Supermercados", icon: ShoppingCart, slug: "supermercados", color: "from-emerald-400 to-emerald-600" },
          { name: "Restaurantes", icon: UtensilsCrossed, slug: "restaurantes", color: "from-orange-400 to-red-500" },
          { name: "Talhos", icon: Beef, slug: "talhos", color: "from-red-400 to-rose-600" },
          { name: "Peixarias", icon: Fish, slug: "peixarias", color: "from-cyan-400 to-blue-500" },
        ].map((cat) => {
          const Icon = cat.icon;
          return (
            <Link key={cat.slug} to={`/categoria/${cat.slug}`} className="block">
              <div className="bg-card border border-border rounded-2xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] group">
                <span className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${cat.color} mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-5 w-5 text-white" />
                </span>
                <span className="font-display font-bold text-foreground text-sm block">{cat.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>

    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-foreground">Encomendas Recentes</h2>
        <span className="text-xs text-accent font-body font-semibold cursor-pointer">Ver todas</span>
      </div>
      <div className="divide-y divide-border">
        {[
          { store: "MMM' All4You", items: "2x Frango Grelhado, 1x Sumo", status: "Em preparação", statusColor: "bg-amber-100 text-amber-700", price: "4.500 Kz" },
          { store: "Super Luanda", items: "Arroz, Óleo, Feijão", status: "Entregue", statusColor: "bg-emerald-100 text-emerald-700", price: "8.200 Kz" },
          { store: "Peixaria Atlântico", items: "1kg Camarão, 2kg Peixe", status: "A caminho", statusColor: "bg-blue-100 text-blue-700", price: "12.000 Kz" },
        ].map((order, i) => (
          <div key={i} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group">
            <div className="flex items-center justify-between mb-1">
              <span className="font-display font-bold text-foreground text-sm">{order.store}</span>
              <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${order.statusColor}`}>{order.status}</span>
            </div>
            <p className="text-xs text-muted-foreground font-body">{order.items}</p>
            <p className="text-sm font-body font-semibold text-foreground mt-1">{order.price}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-2xl p-4 flex items-center gap-3">
      <Star className="h-6 w-6 text-accent shrink-0" />
      <div className="flex-1">
        <p className="font-display font-bold text-foreground text-sm">Ganhe pontos!</p>
        <p className="text-xs text-muted-foreground font-body">Cada compra acumula pontos para descontos.</p>
      </div>
      <span className="text-accent font-display font-bold text-lg">150</span>
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

const ClientProfile = () => {
  const { name, email, initials } = useDisplayUser();
  return (
  <div className="space-y-5">
    <h2 className="font-display text-2xl font-bold text-foreground">Meu Perfil</h2>
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center">
      <div className="relative mb-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-display font-bold">{initials}</div>
        <button className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-accent text-accent-foreground shadow-sm"><Camera className="h-3.5 w-3.5" /></button>
      </div>
      <h3 className="font-display font-bold text-foreground text-lg">{name}</h3>
      <p className="text-sm text-muted-foreground font-body">{email}</p>
      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground font-body">
        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Talatona</span>
        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> +244 923 456 789</span>
      </div>
    </div>
    <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
      {[
        { icon: Edit, label: "Editar Perfil", desc: "Nome, email, telefone" },
        { icon: MapPin, label: "Endereços", desc: "2 endereços guardados" },
        { icon: CreditCard, label: "Pagamentos", desc: "Multicaixa Express" },
        { icon: Bell, label: "Notificações", desc: "Configurar alertas" },
        { icon: Star, label: "Programa de Pontos", desc: "150 pontos acumulados" },
        { icon: HelpCircle, label: "Ajuda & Suporte", desc: "FAQ, contacto" },
      ].map((item, i) => {
        const Icon = item.icon;
        return (
          <button key={i} className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left">
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
    <LogoutButton />
  </div>
  );
};

export default ClientDashboard;
