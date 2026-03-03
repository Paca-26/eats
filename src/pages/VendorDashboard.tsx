import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "@/components/DashboardShell";
import BottomNav, { BottomNavItem } from "@/components/BottomNav";
import StatCard from "@/components/StatCard";
import AnimatedTabContent from "@/components/AnimatedTabContent";
import { Package, ShoppingCart, Star, TrendingUp, Plus, BarChart3, Settings, MessageSquare, Grid3X3, Store, Eye, Clock, Edit, Trash2, Image, MapPin, Phone, Mail, Save, ChevronRight, AlertCircle, LogOut, ToggleLeft, ToggleRight } from "lucide-react";
import AddProductDialog, { type Product } from "@/components/vendor/AddProductDialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useDisplayUser } from "@/hooks/useDisplayUser";
import heroVendor from "@/assets/hero-vendor.jpg";

const navItems: BottomNavItem[] = [
  { label: "Início", icon: BarChart3, id: "home" },
  { label: "Produtos", icon: Grid3X3, id: "products" },
  { label: "Encomendas", icon: ShoppingCart, id: "orders" },
  { label: "Avaliações", icon: MessageSquare, id: "reviews" },
  { label: "Definições", icon: Settings, id: "settings" },
];

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home": return <VendorHome />;
      case "products": return <VendorProducts />;
      case "orders": return <VendorOrders />;
      case "reviews": return <VendorReviews />;
      case "settings": return <VendorSettings />;
      default: return <VendorHome />;
    }
  };

  return (
    <DashboardShell
      title="Painel Vendedor"
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

const VendorHome = () => {
  const { name } = useDisplayUser();
  return (
  <div className="space-y-6">
    <div className="relative rounded-2xl overflow-hidden h-44">
      <img src={heroVendor} alt="Loja" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
      <div className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
        <p className="text-white/80 font-body text-sm">Painel do Vendedor</p>
        <h1 className="font-display text-2xl font-bold mt-1 flex items-center gap-2">
          {name} <Store className="h-6 w-6" />
        </h1>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-body px-2.5 py-0.5 rounded-full flex items-center gap-1"><MapPin className="h-3 w-3" /> Maianga</span>
          <span className="bg-amber-500/80 backdrop-blur-sm text-white text-xs font-body px-2.5 py-0.5 rounded-full flex items-center gap-1"><Star className="h-3 w-3 fill-white" /> 4.7</span>
          <span className="bg-emerald-500/80 backdrop-blur-sm text-white text-xs font-body px-2.5 py-0.5 rounded-full">Aberta</span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard label="Produtos" value="24" icon={Package} trend="+3" trendUp />
      <StatCard label="Encomendas" value="12" icon={ShoppingCart} trend="+5 hoje" trendUp />
      <StatCard label="Avaliação" value="4.7" icon={Star} />
      <StatCard label="Receita" value="85K Kz" icon={TrendingUp} trend="+18%" trendUp />
    </div>

    <div className="bg-card border border-border rounded-2xl p-5">
      <h2 className="font-display text-lg font-bold text-foreground mb-4">Ações Rápidas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 rounded-xl h-12 gap-2 font-body shadow-sm">
          <Plus className="h-4 w-4" /> Adicionar Produto
        </Button>
        <Button variant="outline" className="rounded-xl h-12 gap-2 font-body">
          <ShoppingCart className="h-4 w-4" /> Ver Encomendas
        </Button>
        <Button variant="outline" className="rounded-xl h-12 gap-2 font-body">
          <BarChart3 className="h-4 w-4" /> Relatório
        </Button>
      </div>
    </div>

    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-foreground">Encomendas Recentes</h2>
        <span className="bg-amber-100 text-amber-700 text-[10px] font-body font-bold px-2 py-0.5 rounded-full">3 novas</span>
      </div>
      <div className="divide-y divide-border">
        {[
          { id: "#2045", client: "Maria S.", items: "2x Frango, 1x Arroz", total: "4.500 Kz", status: "Nova", statusColor: "bg-amber-100 text-amber-700", time: "há 5 min" },
          { id: "#2044", client: "Pedro M.", items: "3x Bifes, Salada", total: "7.200 Kz", status: "Preparando", statusColor: "bg-blue-100 text-blue-700", time: "há 20 min" },
          { id: "#2043", client: "Ana L.", items: "1x Menu Completo", total: "3.800 Kz", status: "Pronto", statusColor: "bg-emerald-100 text-emerald-700", time: "há 45 min" },
        ].map((order, i) => (
          <div key={i} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-body font-bold text-foreground text-sm">{order.id}</span>
                <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${order.statusColor}`}>{order.status}</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-body">{order.time}</span>
            </div>
            <p className="text-xs text-muted-foreground font-body">{order.client} — {order.items}</p>
            <p className="text-sm font-body font-semibold text-foreground mt-1">{order.total}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div className="bg-card border border-border rounded-2xl p-4">
        <Eye className="h-5 w-5 text-accent mb-2" />
        <span className="font-display font-bold text-foreground text-2xl block">342</span>
        <span className="text-xs text-muted-foreground font-body">Visitas esta semana</span>
      </div>
      <div className="bg-card border border-border rounded-2xl p-4">
        <Clock className="h-5 w-5 text-accent mb-2" />
        <span className="font-display font-bold text-foreground text-2xl block">18 min</span>
        <span className="text-xs text-muted-foreground font-body">Tempo médio de preparo</span>
      </div>
    </div>
  </div>
  );
};
const VendorProducts = () => {
  const [products, setProducts] = useState<Product[]>([
    { name: "Frango Grelhado", price: "2.500 Kz", category: "Pratos", stock: 15, active: true },
    { name: "Arroz de Marisco", price: "4.800 Kz", category: "Pratos", stock: 8, active: true },
    { name: "Sumo Natural", price: "800 Kz", category: "Bebidas", stock: 30, active: true },
    { name: "Bife à Café", price: "3.200 Kz", category: "Pratos", stock: 0, active: false },
    { name: "Salada Mista", price: "1.500 Kz", category: "Entradas", stock: 20, active: true },
    { name: "Cerveja Cuca", price: "500 Kz", category: "Bebidas", stock: 50, active: true },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState("Todos");

  const allCategories = ["Todos", ...Array.from(new Set(products.map((p) => p.category)))];
  const filtered = activeFilter === "Todos" ? products : products.filter((p) => p.category === activeFilter);

  const handleAdd = (product: Product) => {
    if (editIndex !== null) {
      setProducts((prev) => prev.map((p, i) => (i === editIndex ? product : p)));
      setEditIndex(null);
    } else {
      setProducts((prev) => [product, ...prev]);
    }
  };

  const handleDelete = (index: number) => {
    const realIndex = products.indexOf(filtered[index]);
    setProducts((prev) => prev.filter((_, i) => i !== realIndex));
    toast.success("Produto removido");
  };

  const handleToggleActive = (index: number) => {
    const realIndex = products.indexOf(filtered[index]);
    setProducts((prev) => prev.map((p, i) => (i === realIndex ? { ...p, active: !p.active } : p)));
  };

  const handleEdit = (index: number) => {
    const realIndex = products.indexOf(filtered[index]);
    setEditIndex(realIndex);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground">Produtos ({products.length})</h2>
        <Button onClick={() => { setEditIndex(null); setDialogOpen(true); }} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl gap-2 font-body shadow-sm" size="sm">
          <Plus className="h-4 w-4" /> Novo
        </Button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {allCategories.map((cat) => (
          <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-3 py-1.5 rounded-full text-xs font-body font-medium whitespace-nowrap transition-all ${activeFilter === cat ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>{cat}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground font-body">
          <Package className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Nenhum produto nesta categoria.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p, i) => (
            <div key={i} className={`bg-card border border-border rounded-2xl p-4 flex items-center gap-4 transition-all hover:shadow-md ${!p.active ? "opacity-60" : ""}`}>
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center"><Image className="h-5 w-5 text-muted-foreground" /></div>
              <div className="flex-1 min-w-0">
                <span className="font-display font-bold text-foreground text-sm block">{p.name}</span>
                <span className="text-xs text-muted-foreground font-body">{p.category} · Stock: {p.stock}</span>
              </div>
              <span className="font-body font-bold text-foreground text-sm whitespace-nowrap">{p.price}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => handleToggleActive(i)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title={p.active ? "Desativar" : "Ativar"}>
                  {p.active ? <ToggleRight className="h-4 w-4 text-emerald-500" /> : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}
                </button>
                <button onClick={() => handleEdit(i)} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
                <button onClick={() => handleDelete(i)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <AddProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={handleAdd}
        editProduct={editIndex !== null ? products[editIndex] : null}
      />
    </div>
  );
};

const VendorOrders = () => {
  const [filter, setFilter] = useState("all");
  const orders = [
    { id: "#2045", client: "Maria Silva", items: "2x Frango Grelhado, 1x Sumo", total: "5.800 Kz", status: "Nova", statusColor: "bg-amber-100 text-amber-700", time: "14:30", address: "Talatona, Rua 21" },
    { id: "#2044", client: "Pedro Moreira", items: "3x Bifes, 1x Salada", total: "7.200 Kz", status: "Preparando", statusColor: "bg-blue-100 text-blue-700", time: "14:10", address: "Maianga, Rua Principal" },
    { id: "#2043", client: "Ana Lopes", items: "1x Menu Completo", total: "3.800 Kz", status: "Pronto", statusColor: "bg-emerald-100 text-emerald-700", time: "13:45", address: "Viana, Bloco 5" },
    { id: "#2040", client: "João Costa", items: "2x Arroz Marisco", total: "9.600 Kz", status: "Entregue", statusColor: "bg-emerald-100 text-emerald-700", time: "12:30", address: "Talatona" },
  ];

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl font-bold text-foreground">Encomendas</h2>
      <div className="flex gap-2">
        {[["all","Todas"],["new","Novas"],["preparing","Preparando"],["done","Concluídas"]].map(([k,v]) => (
          <button key={k} onClick={() => setFilter(k)} className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all ${filter === k ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>{v}</button>
        ))}
      </div>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-body font-bold text-foreground text-sm">{o.id}</span>
                <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${o.statusColor}`}>{o.status}</span>
              </div>
              <span className="text-xs text-muted-foreground font-body">{o.time}</span>
            </div>
            <p className="font-display font-bold text-foreground text-sm">{o.client}</p>
            <p className="text-xs text-muted-foreground font-body mt-0.5">{o.items}</p>
            <p className="text-xs text-muted-foreground font-body mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {o.address}</p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <span className="font-body font-bold text-foreground">{o.total}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="rounded-xl h-8 text-xs font-body">Detalhes</Button>
                <Button size="sm" className="rounded-xl h-8 text-xs font-body bg-gradient-to-r from-amber-500 to-orange-500 text-white">Aceitar</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const VendorReviews = () => {
  const reviews = [
    { name: "Maria S.", rating: 5, text: "Comida excelente! Frango muito bem temperado.", date: "Hoje", product: "Frango Grelhado" },
    { name: "João M.", rating: 4, text: "Boa porção, entrega rápida. Voltarei a pedir.", date: "Ontem", product: "Arroz de Marisco" },
    { name: "Ana P.", rating: 5, text: "Melhor restaurante da zona! Recomendo.", date: "25 Fev", product: "Menu Completo" },
    { name: "Pedro L.", rating: 3, text: "Comida boa mas chegou um pouco fria.", date: "23 Fev", product: "Bife à Café" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground">Avaliações</h2>
        <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full">
          <Star className="h-4 w-4 fill-amber-500" />
          <span className="font-body font-bold text-sm">4.7</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[{label: "Total", value: "47"}, {label: "Este mês", value: "12"}, {label: "Positivas", value: "92%"}].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-3 text-center">
            <span className="font-display font-bold text-foreground text-xl block">{s.value}</span>
            <span className="text-[10px] text-muted-foreground font-body">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {reviews.map((r, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">{r.name[0]}</div>
                <div>
                  <span className="font-body font-bold text-foreground text-sm block">{r.name}</span>
                  <span className="text-[10px] text-muted-foreground font-body">{r.product}</span>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className={`h-3 w-3 ${s < r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                ))}
              </div>
            </div>
            <p className="text-sm text-foreground font-body">{r.text}</p>
            <span className="text-[10px] text-muted-foreground font-body mt-2 block">{r.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const VendorSettings = () => {
  const { name, email } = useDisplayUser();
  return (
  <div className="space-y-5">
    <h2 className="font-display text-2xl font-bold text-foreground">Definições da Loja</h2>
    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="font-display font-bold text-foreground mb-4">Informações Gerais</h3>
      <div className="space-y-4">
        {[
          { label: "Nome da Loja", value: name, icon: Store },
          { label: "Endereço", value: "Rua Principal, Maianga, Luanda", icon: MapPin },
          { label: "Telefone", value: "+244 923 111 222", icon: Phone },
          { label: "Email", value: email || "joao@demo.ao", icon: Mail },
        ].map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.label} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <span className="text-[10px] text-muted-foreground font-body block">{field.label}</span>
                <span className="text-sm font-body text-foreground">{field.value}</span>
              </div>
              <Edit className="h-3.5 w-3.5 text-muted-foreground cursor-pointer" />
            </div>
          );
        })}
      </div>
    </div>
    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="font-display font-bold text-foreground mb-4">Horário de Funcionamento</h3>
      <div className="space-y-2">
        {[
          { day: "Segunda - Sexta", hours: "08:00 - 22:00" },
          { day: "Sábado", hours: "09:00 - 23:00" },
          { day: "Domingo", hours: "10:00 - 20:00" },
        ].map((h) => (
          <div key={h.day} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
            <span className="text-sm font-body text-foreground">{h.day}</span>
            <span className="text-sm font-body font-semibold text-foreground">{h.hours}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
      {[
        { label: "Receber notificações", desc: "Alertas de novas encomendas", active: true },
        { label: "Loja visível", desc: "Aparecer nos resultados de pesquisa", active: true },
        { label: "Aceitar encomendas", desc: "Permitir novos pedidos", active: true },
      ].map((toggle) => (
        <div key={toggle.label} className="flex items-center justify-between p-4">
          <div>
            <span className="font-body font-semibold text-foreground text-sm block">{toggle.label}</span>
            <span className="text-xs text-muted-foreground font-body">{toggle.desc}</span>
          </div>
          <div className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${toggle.active ? "bg-emerald-500" : "bg-muted"}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${toggle.active ? "right-1" : "left-1"}`} />
          </div>
        </div>
      ))}
    </div>
    <Button className="w-full rounded-xl h-12 gap-2 font-body bg-gradient-to-r from-amber-500 to-orange-500 text-white">
      <Save className="h-4 w-4" /> Guardar Alterações
    </Button>
    <VendorLogoutButton />
  </div>
  );
};

const VendorLogoutButton = () => {
  const { demoLogout } = useDemoAuth();
  const navigate = useNavigate();
  const handleLogout = () => { demoLogout(); navigate("/auth"); };
  return (
    <Button variant="outline" onClick={handleLogout} className="w-full rounded-xl h-12 gap-2 font-body text-destructive border-destructive/20 hover:bg-destructive/10">
      <LogOut className="h-4 w-4" /> Terminar Sessão
    </Button>
  );
};

export default VendorDashboard;
