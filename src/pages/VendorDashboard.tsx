import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "@/components/DashboardShell";
import BottomNav, { BottomNavItem } from "@/components/BottomNav";
import StatCard from "@/components/StatCard";
import AnimatedTabContent from "@/components/AnimatedTabContent";
import { Package, ShoppingCart, Star, TrendingUp, Plus, BarChart3, Settings, MessageSquare, Grid3X3, Store, Eye, Clock, Edit, Trash2, MapPin, Phone, Mail, Save, LogOut, ToggleLeft, ToggleRight, Loader2, UserPlus, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import AddProductDialog, { type Product } from "@/components/vendor/AddProductDialog";
import StoreSetupDialog from "@/components/vendor/StoreSetupDialog";
import ImageUpload from "@/components/vendor/ImageUpload";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useDisplayUser } from "@/hooks/useDisplayUser";
import { supabase } from "@/integrations/supabase/client";
import heroVendor from "@/assets/hero-vendor.jpg";

const initialNavItems: BottomNavItem[] = [
  { label: "Início", icon: BarChart3, id: "home" },
  { label: "Produtos", icon: Grid3X3, id: "products" },
  { label: "Encomendas", icon: ShoppingCart, id: "orders" },
  { label: "Avaliações", icon: MessageSquare, id: "reviews" },
  { label: "Definições", icon: Settings, id: "settings" },
];

interface StoreData {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  average_rating: number | null;
  is_active: boolean;
  category_id: string | null;
}

interface DashboardStats {
  productsCount: number;
  ordersCount: number;
  revenue: number;
}

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [store, setStore] = useState<StoreData | null>(null);
  const [stats, setStats] = useState<DashboardStats>({ productsCount: 0, ordersCount: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchStore = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from("stores")
        .select("id, name, address, phone, description, logo_url, cover_url, average_rating, is_active, category_id")
        .eq("owner_id", user.id)
        .maybeSingle();

      setStore(data);

      if (data) {
        // Fetch stats
        const [productsRes, ordersRes, unreadRes] = await Promise.all([
          supabase.from("products").select("id", { count: "exact", head: true }).eq("store_id", data.id),
          supabase.from("orders").select("id, total", { count: "exact" }).eq("store_id", data.id),
          supabase.from("orders").select("id", { count: "exact", head: true }).eq("store_id", data.id).eq("status", "pending")
        ]);

        const productsCount = productsRes.count || 0;
        const ordersCount = ordersRes.count || 0;
        const revenue = ordersRes.data?.reduce((acc, order) => acc + (order.total || 0), 0) || 0;

        setStats({ productsCount, ordersCount, revenue });
        setUnreadCount(unreadRes.count || 0);

        // Subscribe to new orders
        const subscription = supabase
          .channel(`store-orders-${data.id}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `store_id=eq.${data.id}`
          }, () => {
            refreshStore();
          })
          .subscribe();

        return () => {
          supabase.removeChannel(subscription);
        };
      }

      setLoading(false);
    };
    fetchStore();
  }, []);

  const refreshStore = async () => {
    if (!userId) return;

    // We need to get the store ID again or use the existing one
    const { data } = await supabase
      .from("stores")
      .select("id, name, address, phone, description, logo_url, cover_url, average_rating, is_active, category_id")
      .eq("owner_id", userId)
      .maybeSingle();
    setStore(data);

    if (data) {
      const [productsRes, ordersRes, unreadRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).eq("store_id", data.id),
        supabase.from("orders").select("id, total", { count: "exact" }).eq("store_id", data.id),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("store_id", data.id).eq("status", "pending")
      ]);
      setStats({
        productsCount: productsRes.count || 0,
        ordersCount: ordersRes.count || 0,
        revenue: ordersRes.data?.reduce((acc, order) => acc + (order.total || 0), 0) || 0
      });
      setUnreadCount(unreadRes.count || 0);
    }
  };

  if (loading) {
    return (
      <DashboardShell title="Painel Vendedor" bottomNav={<BottomNav items={navItems} activeId="home" onNavigate={() => { }} />}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardShell>
    );
  }

  if (!store) {
    return (
      <DashboardShell title="Painel Vendedor" bottomNav={<BottomNav items={navItems} activeId="home" onNavigate={() => { }} />}>
        <div className="container mx-auto px-4 py-12 text-center space-y-4">
          <Store className="h-16 w-16 mx-auto text-muted-foreground/40" />
          <h2 className="font-display text-2xl font-bold text-foreground">Conta Criada com Sucesso!</h2>
          <p className="text-muted-foreground font-body max-w-sm mx-auto">Para começar a vender os seus produtos, precisa primeiro configurar a sua loja.</p>
          <Button onClick={() => setShowSetup(true)} className="rounded-xl h-12 gap-2 font-body bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8">
            <Store className="h-5 w-5" /> Configurar minha Loja
          </Button>
          <p className="text-xs text-muted-foreground font-body pt-4">Pode completar esta etapa agora ou mais tarde.</p>
          <StoreSetupDialog open={showSetup} onOpenChange={setShowSetup} onCreated={refreshStore} userId={userId} />
        </div>
      </DashboardShell>
    );
  }

  const navItems = initialNavItems.map(item =>
    item.id === "orders" ? { ...item, badgeCount: unreadCount } : item
  );

  const renderContent = () => {
    switch (activeTab) {
      case "home": return <VendorHome store={store} stats={stats} unreadCount={unreadCount} onNavigate={setActiveTab} onAddProduct={() => { setActiveTab("products"); setIsAddProductOpen(true); }} />;
      case "products": return <VendorProducts storeId={store.id} onUpdate={refreshStore} isAddProductOpen={isAddProductOpen} setIsAddProductOpen={setIsAddProductOpen} />;
      case "orders": return <VendorOrders storeId={store.id} onUpdate={refreshStore} />;
      case "reviews": return <VendorReviews />;
      case "settings": return <VendorSettings store={store} onUpdated={refreshStore} />;
      default: return <VendorHome store={store} stats={stats} unreadCount={unreadCount} onNavigate={setActiveTab} onAddProduct={() => { setActiveTab("products"); setIsAddProductOpen(true); }} />;
    }
  };

  return (
    <DashboardShell
      title={store.name}
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

const VendorHome = ({ store, stats, unreadCount, onNavigate, onAddProduct }: { store: StoreData, stats: DashboardStats, unreadCount: number, onNavigate: (id: string) => void, onAddProduct: () => void }) => {
  const { name } = useDisplayUser();
  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden h-72 shadow-lg border border-border/50 bg-muted">
        <img src={store.cover_url || heroVendor} alt="Loja" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 mb-2">
            <div className="w-20 h-20 rounded-2xl border-4 border-white/20 bg-background/10 backdrop-blur-md overflow-hidden shrink-0 shadow-xl group hover:scale-105 transition-transform duration-300">
              {store.logo_url ? (
                <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500">
                  <span className="text-2xl font-display font-bold text-white leading-none">{store.name[0]}</span>
                </div>
              )}
            </div>

            <div className="flex-1 text-right sm:text-left">
              <p className="text-white/80 font-body text-xs font-medium uppercase tracking-wider">Painel do Vendedor</p>
              <h1 className="font-display text-3xl font-bold mt-0.5 flex items-center justify-end sm:justify-start gap-2 drop-shadow-md">
                {store.name} <Store className="h-6 w-6 text-amber-400" />
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end sm:justify-start gap-2 mt-2">
            {store.address && (
              <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-body px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/10 shadow-sm"><MapPin className="h-3 w-3" /> {store.address}</span>
            )}
            <span className="bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-body px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/10 shadow-sm"><Star className="h-3 w-3 fill-white" /> {store.average_rating || 0}</span>
            <span className={`backdrop-blur-md text-white text-[10px] font-body px-2.5 py-1 rounded-full border border-white/10 shadow-sm ${store.is_active ? "bg-emerald-500/90" : "bg-red-500/90"}`}>{store.is_active ? "Aberta" : "Fechada"}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Produtos" value={String(stats.productsCount)} icon={Package} />
        <StatCard label="Encomendas" value={String(stats.ordersCount)} icon={ShoppingCart} badge={unreadCount > 0 ? `${unreadCount} novas` : undefined} />
        <StatCard label="Avaliação" value={String(store.average_rating || 0)} icon={Star} />
        <StatCard label="Receita" value={`${stats.revenue.toLocaleString("pt-AO")} Kz`} icon={TrendingUp} />
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button onClick={onAddProduct} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 rounded-xl h-12 gap-2 font-body shadow-sm">
            <Plus className="h-4 w-4" /> Adicionar Produto
          </Button>
          <Button variant="outline" onClick={() => onNavigate("orders")} className="rounded-xl h-12 gap-2 font-body">
            <ShoppingCart className="h-4 w-4" /> Ver Encomendas
          </Button>
          <Button variant="outline" onClick={() => toast.info("Funcionalidade em desenvolvimento")} className="rounded-xl h-12 gap-2 font-body">
            <BarChart3 className="h-4 w-4" /> Relatório
          </Button>
        </div>
      </div>
    </div>
  );
};

const VendorProducts = ({ storeId, onUpdate, isAddProductOpen, setIsAddProductOpen }: { storeId: string, onUpdate?: () => void, isAddProductOpen: boolean, setIsAddProductOpen: (open: boolean) => void }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [storeId]);

  useEffect(() => {
    if (isAddProductOpen) {
      setEditIndex(null);
      setDialogOpen(true);
      setIsAddProductOpen(false);
    }
  }, [isAddProductOpen]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", storeId)
      .order("created_at", { ascending: false });

    if (data) {
      setProducts(data.map(p => ({
        id: p.id,
        name: p.name,
        price: `${Number(p.price).toLocaleString("pt-AO")} Kz`,
        category: p.category || "Geral",
        stock: p.stock_quantity || 0,
        active: p.is_available,
        description: p.description || "",
        image_url: p.image_url || "",
      })));
    }
    setLoading(false);
  };

  const allCategories = ["Todos", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products.filter((p) => {
    const matchesFilter = activeFilter === "Todos" || p.category === activeFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAdd = async (product: Product) => {
    const priceNum = Number(product.price.replace(/[^\d]/g, ""));

    if (editIndex !== null) {
      if (product.id) {
        const { error } = await supabase
          .from("products")
          .update({
            name: product.name,
            price: priceNum,
            category: product.category,
            stock_quantity: product.stock,
            is_available: product.active,
            description: product.description || null,
            image_url: product.image_url || null,
          })
          .eq("id", product.id);

        if (error) {
          console.error("Erro Supabase:", error);
          toast.error(`Erro ao atualizar: ${error.message}`);
          return;
        }
        toast.success("Produto atualizado");
      }
      setEditIndex(null);
      fetchProducts();
    } else {
      const { error } = await supabase.from("products").insert({
        name: product.name,
        price: priceNum,
        category: product.category,
        store_id: storeId,
        stock_quantity: product.stock,
        is_available: product.active,
        description: product.description || null,
        image_url: product.image_url || null,
      });

      if (error) {
        console.error("Erro Supabase:", error);
        toast.error(`Erro ao adicionar: ${error.message}`);
        return;
      }
      toast.success("Produto adicionado");
      fetchProducts();
      if (onUpdate) onUpdate();
    }
  };

  const handleDelete = async (index: number) => {
    const realIndex = products.indexOf(filtered[index]);
    const productToDelete = products[realIndex];

    const { data: existingProducts } = await supabase
      .from("products")
      .select("id")
      .eq("store_id", storeId)
      .eq("name", productToDelete.name)
      .maybeSingle();

    if (existingProducts?.id) {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", existingProducts.id);

      if (error) {
        toast.error("Erro ao remover produto");
        return;
      }
      toast.success("Produto removido");
      fetchProducts();
      if (onUpdate) onUpdate();
    }
  };

  const handleToggleActive = async (index: number) => {
    const realIndex = products.indexOf(filtered[index]);
    const productToToggle = products[realIndex];

    const { data: existingProducts } = await supabase
      .from("products")
      .select("id")
      .eq("store_id", storeId)
      .eq("name", productToToggle.name)
      .maybeSingle();

    if (existingProducts?.id) {
      const { error } = await supabase
        .from("products")
        .update({ is_available: !productToToggle.active })
        .eq("id", existingProducts.id);

      if (error) {
        toast.error("Erro ao atualizar estado");
        return;
      }
      fetchProducts();
    }
  };

  const handleEdit = (index: number) => {
    const realIndex = products.indexOf(filtered[index]);
    setEditIndex(realIndex);
    setDialogOpen(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-40"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground">Produtos ({products.length})</h2>
        <Button onClick={() => { setEditIndex(null); setDialogOpen(true); }} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl gap-2 font-body shadow-sm" size="sm">
          <Plus className="h-4 w-4" /> Novo
        </Button>
      </div>

      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-amber-500 transition-colors" />
        <Input
          placeholder="Pesquisar produtos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11 rounded-xl font-body border-border/50 bg-card shadow-sm focus-visible:ring-amber-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {allCategories.map((cat) => (
          <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-3 py-1.5 rounded-full text-xs font-body font-medium whitespace-nowrap transition-all border ${activeFilter === cat ? "bg-amber-500 text-white border-amber-500 shadow-sm" : "bg-card text-muted-foreground border-border hover:border-amber-500/50"}`}>{cat}</button>
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
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
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
        storeId={storeId}
      />
    </div>
  );
};

const VendorOrders = ({ storeId, onUpdate }: { storeId: string, onUpdate: () => void }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    let query = supabase
      .from("orders")
      .select(`
        *,
        profiles:customer_id (full_name)
      `)
      .eq("store_id", storeId)
      .order("created_at", { ascending: false });

    if (activeFilter === "pending") query = query.eq("status", "pending");
    if (activeFilter === "preparing") query = query.eq("status", "preparing");
    if (activeFilter === "completed") query = query.in("status", ["delivered", "cancelled"]);

    const { data, error } = await query;
    if (data) setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [storeId, activeFilter]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast.error("Erro ao atualizar pedido");
    } else {
      toast.success("Pedido atualizado");
      fetchOrders();
      onUpdate();
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "pending": return { label: "Nova", color: "bg-amber-100 text-amber-700" };
      case "preparing": return { label: "Preparando", color: "bg-blue-100 text-blue-700" };
      case "delivered": return { label: "Entregue", color: "bg-emerald-100 text-emerald-700" };
      case "cancelled": return { label: "Cancelado", color: "bg-red-100 text-red-700" };
      default: return { label: status, color: "bg-gray-100 text-gray-700" };
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl font-bold text-foreground">Encomendas</h2>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[["all", "Todas"], ["pending", "Novas"], ["preparing", "Preparando"], ["completed", "Concluídas"]].map(([k, v]) => (
          <button key={k} onClick={() => setActiveFilter(k)} className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all whitespace-nowrap ${activeFilter === k ? "bg-accent text-accent-foreground shadow-sm" : "bg-card text-muted-foreground border border-border hover:border-accent/50"}`}>{v}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground font-body">
          <ShoppingCart className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Nenhuma encomenda encontrada.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const status = getStatusDisplay(o.status);
            return (
              <div key={o.id} className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-body font-bold text-foreground text-sm">#{o.id.slice(0, 4)}</span>
                    <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${status.color}`}>{status.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-body">{new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="font-display font-bold text-foreground text-sm">{(o.profiles as any)?.full_name || "Cliente"}</p>
                <p className="text-xs text-muted-foreground font-body mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {o.delivery_address || "Não especificado"}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className="font-body font-bold text-foreground">{Number(o.total).toLocaleString("pt-AO")} Kz</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-xl h-8 text-xs font-body">Detalhes</Button>
                    {o.status === "pending" && (
                      <Button onClick={() => handleUpdateStatus(o.id, "preparing")} size="sm" className="rounded-xl h-8 text-xs font-body bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">Aceitar</Button>
                    )}
                    {o.status === "preparing" && (
                      <Button onClick={() => handleUpdateStatus(o.id, "delivered")} size="sm" className="rounded-xl h-8 text-xs font-body bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm">Entregue</Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
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
        {[{ label: "Total", value: "47" }, { label: "Este mês", value: "12" }, { label: "Positivas", value: "92%" }].map((s) => (
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

const VendorSettings = ({ store, onUpdated }: { store: StoreData; onUpdated: () => void }) => {
  const { email, name: initialName } = useDisplayUser();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);

  // Extract city and country from address if possible
  const addressParts = store.address ? store.address.split(", ") : [];
  const initialStreet = addressParts[0] || "";
  const initialCity = addressParts[1] || "";
  const initialCountry = addressParts[2] || "Angola";

  const [formData, setFormData] = useState({
    name: store.name || "",
    description: store.description || "",
    category_id: store.category_id || "",
    phone: store.phone || "",
    logo_url: store.logo_url || "",
    cover_url: store.cover_url || "",
    street: initialStreet,
    city: initialCity,
    country: initialCountry,
    userName: "",
    userPhone: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch categories
      const { data: cats } = await supabase.from("categories").select("id, name").order("name");
      if (cats) setCategories(cats);

      // Fetch user profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, phone")
          .eq("id", user.id)
          .maybeSingle();

        if (profile) {
          setFormData(prev => ({
            ...prev,
            userName: profile.full_name || initialName,
            userPhone: profile.phone || ""
          }));
        }
      }
    };
    fetchData();
  }, [initialName]);

  const handleSave = async () => {
    setLoading(true);
    const fullAddress = `${formData.street}${formData.city ? `, ${formData.city}` : ""}${formData.country ? `, ${formData.country}` : ""}`;

    // Update store
    const { error: storeError } = await supabase
      .from("stores")
      .update({
        name: formData.name,
        description: formData.description,
        category_id: formData.category_id || null,
        address: fullAddress,
        phone: formData.phone,
        logo_url: formData.logo_url,
        cover_url: formData.cover_url,
        updated_at: new Date().toISOString()
      })
      .eq("id", store.id);

    // Update profile
    const { data: { user } } = await supabase.auth.getUser();
    let profileError = null;
    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.userName,
          phone: formData.userPhone,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);
      profileError = error;
    }

    if (storeError || profileError) {
      toast.error("Erro ao guardar alterações");
    } else {
      toast.success("Definições actualizadas");
      onUpdated();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 pb-20">
      <h2 className="font-display text-2xl font-bold text-foreground">Definições</h2>

      {/* User Profile Settings */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h3 className="font-display font-bold text-foreground flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-accent" /> Dados da Conta
        </h3>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-body font-semibold text-muted-foreground ml-1">Seu Nome</label>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border border-transparent focus-within:border-accent/30 transition-all">
              <UserPlus className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                value={formData.userName}
                onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                className="bg-transparent border-none focus:ring-0 text-sm font-body text-foreground w-full p-0"
                placeholder="Seu nome completo"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-body font-semibold text-muted-foreground ml-1">Seu Telefone</label>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border border-transparent focus-within:border-accent/30 transition-all">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                value={formData.userPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, userPhone: e.target.value }))}
                className="bg-transparent border-none focus:ring-0 text-sm font-body text-foreground w-full p-0"
                placeholder="9XX XXX XXX"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-body font-semibold text-muted-foreground ml-1">Email (não editável)</label>
            <div className="flex items-center gap-3 p-3 bg-muted/10 rounded-xl opacity-60">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-body text-foreground">
                {email || "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Store Identity Settings */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-foreground ml-1 flex items-center gap-2">
          <Store className="h-5 w-5 text-accent" /> Identidade da Loja
        </h3>

        <div className="space-y-2">
          <label className="text-xs font-body font-semibold text-muted-foreground ml-1">Foto de Capa (Banner)</label>
          <ImageUpload
            bucket="store-images"
            folder={store.id}
            currentUrl={formData.cover_url}
            onUploaded={(url) => setFormData(prev => ({ ...prev, cover_url: url }))}
            aspectRatio="wide"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-body font-semibold text-muted-foreground ml-1">Logótipo da Loja</label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 shrink-0">
              <ImageUpload
                bucket="store-images"
                folder={store.id}
                currentUrl={formData.logo_url}
                onUploaded={(url) => setFormData(prev => ({ ...prev, logo_url: url }))}
                aspectRatio="square"
              />
            </div>
            <p className="text-xs text-muted-foreground font-body">Use uma imagem quadrada para melhor visualização (Recomendado: 512x512px).</p>
          </div>
        </div>
      </div>

      {/* Store Information Settings */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h3 className="font-display font-bold text-foreground">Informações da Loja</h3>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-body font-semibold text-muted-foreground ml-1">Nome da Loja</label>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border border-transparent focus-within:border-accent/30 transition-all">
              <Store className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-transparent border-none focus:ring-0 text-sm font-body text-foreground w-full p-0"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-body font-semibold text-muted-foreground ml-1">Categoria</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category_id: cat.id }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all ${formData.category_id === cat.id
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 border-transparent"
                    } border`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-body font-semibold text-muted-foreground ml-1">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o que a sua loja oferece..."
              className="flex w-full rounded-xl border-none bg-muted/50 px-3 py-3 text-sm font-body ring-offset-background placeholder:text-muted-foreground focus:ring-1 focus:ring-accent/30 min-h-[80px] resize-none"
              maxLength={300}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-body font-semibold text-muted-foreground ml-1">Telefone de Contacto (Loja)</label>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border border-transparent focus-within:border-accent/30 transition-all">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-transparent border-none focus:ring-0 text-sm font-body text-foreground w-full p-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Localization Settings */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h3 className="font-display font-bold text-foreground flex items-center gap-2">
          <MapPin className="h-5 w-5 text-accent" /> Localização
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-body font-semibold text-muted-foreground ml-1">País</label>
            <Input value={formData.country} onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))} className="rounded-xl font-body bg-muted/50 border-none h-11" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-body font-semibold text-muted-foreground ml-1">Cidade</label>
            <Input value={formData.city} onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))} className="rounded-xl font-body bg-muted/50 border-none h-11" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-body font-semibold text-muted-foreground ml-1">Rua / Número</label>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border border-transparent focus-within:border-accent/30 transition-all">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              value={formData.street}
              onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
              placeholder="Ex: Rua Direita da Maianga, nº 45"
              className="bg-transparent border-none focus:ring-0 text-sm font-body text-foreground w-full p-0"
            />
          </div>
        </div>
      </div>

      {/* Operational Settings */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
        <div className="p-4 flex items-center justify-between">
          <div>
            <span className="font-body font-semibold text-foreground text-sm block">Receber notificações</span>
            <span className="text-xs text-muted-foreground font-body">Alertas de novas encomendas</span>
          </div>
          <div className="w-10 h-6 rounded-full relative cursor-pointer transition-colors bg-emerald-500">
            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white shadow-sm" />
          </div>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div>
            <span className="font-body font-semibold text-foreground text-sm block">Loja visível</span>
            <span className="text-xs text-muted-foreground font-body">Aparecer nos resultados de pesquisa</span>
          </div>
          <div
            onClick={async () => {
              const { error } = await supabase.from("stores").update({ is_active: !store.is_active }).eq("id", store.id);
              if (!error) onUpdated();
            }}
            className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${store.is_active ? "bg-emerald-500" : "bg-muted"}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${store.is_active ? "right-1" : "left-1"}`} />
          </div>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div>
            <span className="font-body font-semibold text-foreground text-sm block">Aceitar encomendas</span>
            <span className="text-xs text-muted-foreground font-body">Permitir novos pedidos</span>
          </div>
          <div className="w-10 h-6 rounded-full relative cursor-pointer transition-colors bg-emerald-500">
            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white shadow-sm" />
          </div>
        </div>
      </div>

      <div className="sticky bottom-6 pt-4 bg-background/80 backdrop-blur-sm">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full rounded-xl h-12 gap-2 font-body bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-orange-500/20 transition-all font-bold"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar Todas as Alterações
        </Button>
      </div>

      <div className="pt-2">
        <VendorLogoutButton />
      </div>
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
