import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "@/components/DashboardShell";
import BottomNav, { BottomNavItem } from "@/components/BottomNav";
import StatCard from "@/components/StatCard";
import AnimatedTabContent from "@/components/AnimatedTabContent";
import { Users, Store, Package, MapPin, ShieldCheck, TrendingUp, Settings, BarChart3, Bell, Search, ChevronRight, Star, Eye, CheckCircle2, XCircle, Clock, AlertCircle, Edit, Shield, Mail, Phone, Save, Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useDisplayUser } from "@/hooks/useDisplayUser";
import heroAdmin from "@/assets/hero-admin.jpg";

const navItems: BottomNavItem[] = [
  { label: "Início", icon: BarChart3, id: "home" },
  { label: "Lojas", icon: Store, id: "stores" },
  { label: "Encomendas", icon: Package, id: "orders" },
  { label: "Utilizadores", icon: Users, id: "users" },
  { label: "Definições", icon: Settings, id: "settings" },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home": return <AdminHome />;
      case "stores": return <AdminStores />;
      case "orders": return <AdminOrders />;
      case "users": return <AdminUsers />;
      case "settings": return <AdminSettings />;
      default: return <AdminHome />;
    }
  };

  return (
    <DashboardShell
      title="Admin Mmm"
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

const AdminHome = () => {
  const { name } = useDisplayUser();
  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden h-44">
        <img src={heroAdmin} alt="Admin" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
          <p className="text-white/80 font-body text-sm">Administração</p>
          <h1 className="font-display text-2xl font-bold mt-1 flex items-center gap-2">{name} <ShieldCheck className="h-6 w-6" /></h1>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-body px-2.5 py-0.5 rounded-full">Gestão central</span>
            <span className="bg-purple-500/80 backdrop-blur-sm text-white text-xs font-body px-2.5 py-0.5 rounded-full flex items-center gap-1"><Users className="h-3 w-3" /> 128 users</span>
            <span className="bg-emerald-500/80 backdrop-blur-sm text-white text-xs font-body px-2.5 py-0.5 rounded-full flex items-center gap-1"><Store className="h-3 w-3" /> 24 lojas</span>
          </div>
        </div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
        <p className="text-sm font-body text-amber-800"><span className="font-semibold">3 lojas</span> aguardam aprovação. <span className="font-semibold cursor-pointer underline">Rever agora →</span></p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Utilizadores" value="128" icon={Users} trend="+12%" trendUp />
        <StatCard label="Lojas Activas" value="24" icon={Store} trend="+3" trendUp />
        <StatCard label="Encomendas Hoje" value="47" icon={Package} trend="+18%" trendUp />
        <StatCard label="Receita Mensal" value="2.4M Kz" icon={TrendingUp} trend="+8%" trendUp />
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border"><h2 className="font-display text-lg font-bold text-foreground">Actividade Recente</h2></div>
        <div className="divide-y divide-border">
          {[
            { text: "Nova loja registada: Supermercado Kero", time: "há 2min", dot: "bg-emerald-500" },
            { text: "Encomenda #1042 entregue com sucesso", time: "há 15min", dot: "bg-blue-500" },
            { text: "Novo utilizador: João M. (Cliente)", time: "há 1h", dot: "bg-purple-500" },
            { text: "Reclamação recebida: Encomenda #1038", time: "há 2h", dot: "bg-red-500" },
            { text: "Loja 'Mercearia Central' actualizada", time: "há 3h", dot: "bg-amber-500" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className={`h-2.5 w-2.5 rounded-full ${item.dot} shrink-0`} />
              <span className="text-sm font-body text-foreground flex-1">{item.text}</span>
              <span className="text-xs text-muted-foreground font-body">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-2xl p-4">
          <Eye className="h-5 w-5 text-accent mb-2" />
          <span className="font-display font-bold text-foreground text-2xl block">1.2K</span>
          <span className="text-xs text-muted-foreground font-body">Visitas hoje</span>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <Star className="h-5 w-5 text-accent mb-2" />
          <span className="font-display font-bold text-foreground text-2xl block">4.6</span>
          <span className="text-xs text-muted-foreground font-body">Avaliação média</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "Zonas de Entrega", desc: "Configurar zonas e taxas de delivery.", icon: MapPin },
          { title: "Segurança", desc: "Logs de acesso e permissões.", icon: Shield },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-purple-100"><Icon className="h-5 w-5 text-purple-600" /></div>
                <h3 className="font-display font-bold text-foreground">{card.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground font-body">{card.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AdminStores = () => {
  const [filter, setFilter] = useState("all");
  const stores = [
    { name: "MMM' All4You", category: "Restaurante", status: "Activa", statusColor: "bg-emerald-100 text-emerald-700", rating: 4.8, orders: 156, revenue: "450K Kz" },
    { name: "Super Luanda", category: "Supermercado", status: "Activa", statusColor: "bg-emerald-100 text-emerald-700", rating: 4.6, orders: 89, revenue: "320K Kz" },
    { name: "Talho Premium", category: "Talho", status: "Activa", statusColor: "bg-emerald-100 text-emerald-700", rating: 4.9, orders: 67, revenue: "280K Kz" },
    { name: "Peixaria Atlântico", category: "Peixaria", status: "Activa", statusColor: "bg-emerald-100 text-emerald-700", rating: 4.7, orders: 45, revenue: "190K Kz" },
    { name: "Novo Mercado", category: "Mercearia", status: "Pendente", statusColor: "bg-amber-100 text-amber-700", rating: 0, orders: 0, revenue: "0 Kz" },
    { name: "Cantina Boa", category: "Restaurante", status: "Pendente", statusColor: "bg-amber-100 text-amber-700", rating: 0, orders: 0, revenue: "0 Kz" },
    { name: "Mini Preço", category: "Supermercado", status: "Suspensa", statusColor: "bg-red-100 text-red-700", rating: 3.2, orders: 12, revenue: "45K Kz" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground">Gestão de Lojas</h2>
        <span className="text-sm text-muted-foreground font-body">{stores.length} lojas</span>
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {[["all", "Todas"], ["active", "Activas"], ["pending", "Pendentes"], ["suspended", "Suspensas"]].map(([k, v]) => (
          <button key={k} onClick={() => setFilter(k)} className={`px-3 py-1.5 rounded-full text-xs font-body font-medium whitespace-nowrap transition-all ${filter === k ? "bg-purple-600 text-white" : "bg-muted text-muted-foreground"}`}>{v}</button>
        ))}
      </div>
      <div className="space-y-2">
        {stores.map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold">{s.name[0]}</div>
                <div>
                  <span className="font-display font-bold text-foreground text-sm block">{s.name}</span>
                  <span className="text-[10px] text-muted-foreground font-body">{s.category}</span>
                </div>
              </div>
              <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${s.statusColor}`}>{s.status}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground font-body mt-2">
              {s.rating > 0 && <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {s.rating}</span>}
              <span>{s.orders} pedidos</span>
              <span>{s.revenue}</span>
            </div>
            {s.status === "Pendente" && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <Button size="sm" className="rounded-xl h-8 text-xs font-body bg-emerald-500 text-white flex-1 gap-1"><CheckCircle2 className="h-3 w-3" /> Aprovar</Button>
                <Button size="sm" variant="outline" className="rounded-xl h-8 text-xs font-body text-destructive flex-1 gap-1"><XCircle className="h-3 w-3" /> Rejeitar</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminOrders = () => {
  const [filter, setFilter] = useState("all");
  const orders = [
    { id: "#1045", store: "MMM' All4You", client: "Maria Silva", total: "4.500 Kz", status: "Em preparação", statusColor: "bg-amber-100 text-amber-700", date: "Hoje, 14:30", driver: "Pedro E." },
    { id: "#1044", store: "Peixaria Atlântico", client: "João Costa", total: "12.000 Kz", status: "A caminho", statusColor: "bg-blue-100 text-blue-700", date: "Hoje, 11:20", driver: "Carlos M." },
    { id: "#1043", store: "Super Luanda", client: "Ana Lopes", total: "8.200 Kz", status: "Entregue", statusColor: "bg-emerald-100 text-emerald-700", date: "Hoje, 10:00", driver: "Pedro E." },
    { id: "#1042", store: "Talho Premium", client: "Sofia R.", total: "15.800 Kz", status: "Entregue", statusColor: "bg-emerald-100 text-emerald-700", date: "Ontem", driver: "Carlos M." },
    { id: "#1038", store: "Mercearia Central", client: "Luís A.", total: "3.200 Kz", status: "Reclamação", statusColor: "bg-red-100 text-red-700", date: "Ontem", driver: "Pedro E." },
  ];

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl font-bold text-foreground">Todas as Encomendas</h2>
      <div className="flex gap-2 overflow-x-auto">
        {[["all", "Todas"], ["active", "Activas"], ["delivered", "Entregues"], ["issues", "Problemas"]].map(([k, v]) => (
          <button key={k} onClick={() => setFilter(k)} className={`px-3 py-1.5 rounded-full text-xs font-body font-medium whitespace-nowrap transition-all ${filter === k ? "bg-purple-600 text-white" : "bg-muted text-muted-foreground"}`}>{v}</button>
        ))}
      </div>
      <div className="space-y-2">
        {orders.map((o) => (
          <div key={o.id} className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-body font-bold text-foreground text-sm">{o.id}</span>
                <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${o.statusColor}`}>{o.status}</span>
              </div>
              <span className="text-xs text-muted-foreground font-body">{o.date}</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs font-body">
              <p className="text-muted-foreground">Loja: <span className="text-foreground font-semibold">{o.store}</span></p>
              <p className="text-muted-foreground">Cliente: <span className="text-foreground font-semibold">{o.client}</span></p>
              <p className="text-muted-foreground">Motorista: <span className="text-foreground font-semibold">{o.driver}</span></p>
              <p className="text-muted-foreground">Total: <span className="text-foreground font-semibold">{o.total}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const [filter, setFilter] = useState("all");
  const users = [
    { name: "Maria Silva", email: "maria@demo.ao", role: "Cliente", status: "Activo", orders: 12, joined: "Jan 2026" },
    { name: "João Costa", email: "joao@demo.ao", role: "Vendedor", status: "Activo", orders: 0, joined: "Dez 2025" },
    { name: "Pedro Entrega", email: "pedro@demo.ao", role: "Motorista", status: "Activo", orders: 156, joined: "Nov 2025" },
    { name: "Ana Lopes", email: "ana@demo.ao", role: "Cliente", status: "Activo", orders: 5, joined: "Fev 2026" },
    { name: "Carlos Mendes", email: "carlos@demo.ao", role: "Motorista", status: "Inactivo", orders: 34, joined: "Out 2025" },
    { name: "Sofia Ribeiro", email: "sofia@demo.ao", role: "Vendedor", status: "Pendente", orders: 0, joined: "Fev 2026" },
  ];
  const roleColors: Record<string, string> = { Cliente: "bg-blue-100 text-blue-700", Vendedor: "bg-amber-100 text-amber-700", Motorista: "bg-emerald-100 text-emerald-700" };
  const statusColors: Record<string, string> = { Activo: "bg-emerald-100 text-emerald-700", Inactivo: "bg-muted text-muted-foreground", Pendente: "bg-amber-100 text-amber-700" };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground">Utilizadores</h2>
        <span className="text-sm text-muted-foreground font-body">{users.length} registados</span>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type="text" placeholder="Pesquisar utilizadores..." className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 font-body" />
      </div>
      <div className="flex gap-2">
        {[["all", "Todos"], ["clients", "Clientes"], ["vendors", "Vendedores"], ["drivers", "Motoristas"]].map(([k, v]) => (
          <button key={k} onClick={() => setFilter(k)} className={`px-3 py-1.5 rounded-full text-xs font-body font-medium whitespace-nowrap transition-all ${filter === k ? "bg-purple-600 text-white" : "bg-muted text-muted-foreground"}`}>{v}</button>
        ))}
      </div>
      <div className="space-y-2">
        {users.map((u, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {u.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-body font-bold text-foreground text-sm block">{u.name}</span>
              <span className="text-xs text-muted-foreground font-body">{u.email}</span>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${roleColors[u.role]}`}>{u.role}</span>
              <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${statusColors[u.status]}`}>{u.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminSettings = () => (
  <div className="space-y-5">
    <h2 className="font-display text-2xl font-bold text-foreground">Definições</h2>
    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="font-display font-bold text-foreground mb-4">Plataforma</h3>
      <div className="space-y-3">
        {[
          { label: "Nome da plataforma", value: "Mmm" },
          { label: "Moeda", value: "Kwanza (Kz)" },
          { label: "Taxa de serviço", value: "5%" },
          { label: "Taxa de entrega base", value: "500 Kz" },
        ].map((f) => (
          <div key={f.label} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
            <span className="text-sm font-body text-muted-foreground">{f.label}</span>
            <span className="text-sm font-body font-semibold text-foreground">{f.value}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="font-display font-bold text-foreground mb-4">Zonas de Entrega</h3>
      <div className="space-y-2">
        {[
          { zone: "Talatona", fee: "500 Kz", active: true },
          { zone: "Maianga", fee: "700 Kz", active: true },
          { zone: "Viana", fee: "1.000 Kz", active: true },
          { zone: "Cacuaco", fee: "1.200 Kz", active: false },
        ].map((z) => (
          <div key={z.zone} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
            <div>
              <span className="text-sm font-body font-semibold text-foreground">{z.zone}</span>
              <span className="text-xs text-muted-foreground font-body block">Taxa: {z.fee}</span>
            </div>
            <div className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${z.active ? "bg-emerald-500" : "bg-muted"}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${z.active ? "right-1" : "left-1"}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
      {[
        { label: "Manutenção", desc: "Colocar plataforma em manutenção", active: false },
        { label: "Registos abertos", desc: "Permitir novos registos", active: true },
        { label: "Notificações push", desc: "Enviar notificações aos utilizadores", active: true },
      ].map((toggle) => (
        <div key={toggle.label} className="flex items-center justify-between p-4">
          <div>
            <span className="font-body font-semibold text-foreground text-sm block">{toggle.label}</span>
            <span className="text-xs text-muted-foreground font-body">{toggle.desc}</span>
          </div>
          <div className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${toggle.active ? "bg-purple-500" : "bg-muted"}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${toggle.active ? "right-1" : "left-1"}`} />
          </div>
        </div>
      ))}
    </div>
    <Button className="w-full rounded-xl h-12 gap-2 font-body bg-gradient-to-r from-purple-500 to-violet-600 text-white">
      <Save className="h-4 w-4" /> Guardar Alterações
    </Button>
    <AdminLogoutButton />
  </div>
);

const AdminLogoutButton = () => {
  const { demoLogout } = useDemoAuth();
  const navigate = useNavigate();
  const handleLogout = () => { demoLogout(); navigate("/auth"); };
  return (
    <Button variant="outline" onClick={handleLogout} className="w-full rounded-xl h-12 gap-2 font-body text-destructive border-destructive/20 hover:bg-destructive/10">
      <LogOut className="h-4 w-4" /> Terminar Sessão
    </Button>
  );
};

export default AdminDashboard;
