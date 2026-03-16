import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "@/components/DashboardShell";
import BottomNav, { BottomNavItem } from "@/components/BottomNav";
import StatCard from "@/components/StatCard";
import AnimatedTabContent from "@/components/AnimatedTabContent";
import { Users, Store, Package, MapPin, ShieldCheck, TrendingUp, Settings, BarChart3, Bell, Search, ChevronRight, Star, Eye, CheckCircle2, XCircle, Clock, AlertCircle, Edit, Shield, Mail, Phone, Save, Trash2, LogOut, Loader2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useDisplayUser } from "@/hooks/useDisplayUser";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Initial fetch for pending orders to set the badge
    const fetchPendingCount = async () => {
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      if (!error && count !== null) {
        setNewOrdersCount(count);
      }
    };

    fetchPendingCount();

    // Subscribe to new orders
    const subscription = supabase
      .channel('admin-orders')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'orders' 
      }, (payload) => {
        toast({
          title: "Nova Encomenda!",
          description: `Uma nova encomenda foi realizada (#${payload.new.id.substring(0, 6).toUpperCase()})`,
        });
        setNewOrdersCount(prev => prev + 1);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders'
      }, (payload) => {
        // If status changed from pending to something else, decrement count
        if (payload.old.status === 'pending' && payload.new.status !== 'pending') {
          setNewOrdersCount(prev => Math.max(0, prev - 1));
        } else if (payload.old.status !== 'pending' && payload.new.status === 'pending') {
          setNewOrdersCount(prev => prev + 1);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [toast]);

  const navItemsWithBadges: BottomNavItem[] = navItems.map(item => {
    if (item.id === "orders") {
      return { ...item, badgeCount: newOrdersCount };
    }
    return item;
  });

  const renderContent = () => {
    switch (activeTab) {
      case "home": return <AdminHome />;
      case "stores": return <AdminStores />;
      case "orders": return <AdminOrders onOrderTotalUpdate={(count: number) => setNewOrdersCount(count)} />;
      case "users": return <AdminUsers />;
      case "settings": return <AdminSettings />;
      default: return <AdminHome />;
    }
  };

  return (
    <DashboardShell
      title="Admin Mmm"
      bottomNav={<BottomNav items={navItemsWithBadges} activeId={activeTab} onNavigate={setActiveTab} />}
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
  const [stats, setStats] = useState<any>({
    total_users: 0,
    active_stores: 0,
    pending_stores: 0,
    orders_today: 0,
    monthly_revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase.rpc("get_admin_stats");
        if (error) throw error;
        if (data) setStats(data);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden h-44">
        <img src={heroAdmin} alt="Admin" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
          <p className="text-white/80 font-body text-sm">Administração</p>
          <h1 className="font-display text-2xl font-bold mt-1 flex items-center gap-2">{name} <ShieldCheck className="h-6 w-6" /></h1>
          <div className="flex items-center gap-3 mt-1.5 overflow-x-auto pb-1">
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-body px-2.5 py-0.5 rounded-full whitespace-nowrap">Gestão central</span>
            <span className="bg-purple-500/80 backdrop-blur-sm text-white text-xs font-body px-2.5 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap"><Users className="h-3 w-3" /> {stats.total_users || 0} users</span>
            <span className="bg-emerald-500/80 backdrop-blur-sm text-white text-xs font-body px-2.5 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap"><Store className="h-3 w-3" /> {stats.active_stores || 0} lojas</span>
          </div>
        </div>
      </div>

      {stats.pending_stores > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          <p className="text-sm font-body text-amber-800"><span className="font-semibold">{stats.pending_stores} loja(s)</span> {stats.pending_stores === 1 ? 'aguarda aprovação.' : 'aguardam aprovação.'}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-purple-600 h-8 w-8" /></div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Utilizadores" value={stats.total_users?.toString() || "0"} icon={Users} trend="+Nova" trendUp />
          <StatCard label="Lojas Activas" value={stats.active_stores?.toString() || "0"} icon={Store} trend={`${stats.pending_stores} pnd`} />
          <StatCard label="Encomendas Hoje" value={stats.orders_today?.toString() || "0"} icon={Package} trend="+Hoje" trendUp />
          <StatCard label="Receita Mensal" value={`${Number(stats.monthly_revenue || 0).toLocaleString('pt-AO')} Kz`} icon={TrendingUp} trend="+0%" trendUp />
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border"><h2 className="font-display text-lg font-bold text-foreground">Acesso Rápido</h2></div>
        <div className="divide-y divide-border">
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer">
            <div className={`h-2.5 w-2.5 rounded-full bg-blue-500 shrink-0`} />
            <span className="text-sm font-body text-foreground flex-1">Verifique o menu Lojas para aprovar novas adesões.</span>
            <span className="text-xs text-muted-foreground font-body">Dica</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer">
            <div className={`h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0`} />
            <span className="text-sm font-body text-foreground flex-1">Configure as taxas de entrega em Definições.</span>
            <span className="text-xs text-muted-foreground font-body">Dica</span>
          </div>
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
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStoreForProducts, setSelectedStoreForProducts] = useState<{ id: string, name: string } | null>(null);
  const { toast } = useToast();

  const fetchStores = async () => {
    setLoading(true);
    try {
      // Step 1: fetch stores with categories
      const { data: storesData, error: storesError } = await supabase
        .from('stores')
        .select('*, categories(name)')
        .order('created_at', { ascending: false });

      if (storesError) throw storesError;

      // Step 2: fetch profiles for each owner (stores.owner_id -> profiles.id)
      const ownerIds = [...new Set((storesData || []).map((s: any) => s.owner_id))];
      let profilesMap: Record<string, any> = {};

      if (ownerIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, phone')
          .in('id', ownerIds);

        (profilesData || []).forEach((p: any) => {
          profilesMap[p.id] = p;
        });
      }

      // Merge profiles into stores
      const merged = (storesData || []).map((s: any) => ({
        ...s,
        owner_profile: profilesMap[s.owner_id] || null,
      }));

      setStores(merged);
    } catch (err: any) {
      console.error("Erro ao carregar lojas:", err);
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleUpdateStatus = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase.from('stores').update({ is_active: active }).eq('id', id);
      if (error) throw error;
      toast({ title: "Sucesso", description: `Loja ${active ? 'aprovada/ativada' : 'suspensa'} com sucesso.` });
      fetchStores();
    } catch (err: any) {
      console.error("Erro ao atualizar loja:", err);
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  const handleDeleteStore = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja apagar a loja ${name}? Isso apagará todos os produtos associados.`)) return;
    try {
      const { error } = await supabase.from('stores').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Sucesso", description: "Loja apagada com sucesso." });
      fetchStores();
    } catch (err: any) {
      console.error("Erro ao apagar loja:", err);
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  const filteredStores = stores.filter(s => {
    if (filter === "all") return true;
    if (filter === "active") return s.is_active === true;
    if (filter === "pending" || filter === "suspended") return s.is_active === false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground">Gestão de Lojas</h2>
        <span className="text-sm text-muted-foreground font-body">{stores.length} lojas</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[["all", "Todas"], ["active", "Activas"], ["suspended", "Inativas / Pendentes"]].map(([k, v]) => (
          <button key={k} onClick={() => setFilter(k)} className={`px-4 py-1.5 rounded-full text-xs font-body font-medium whitespace-nowrap transition-all ${filter === k ? "bg-purple-600 text-white shadow-sm" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`}>{v}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-purple-600 h-8 w-8" /></div>
      ) : filteredStores.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">Nenhuma loja encontrada.</div>
      ) : (
        <div className="space-y-3">
          {filteredStores.map((s) => (
            <div key={s.id} className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {s.logo_url ? <img src={s.logo_url} alt={s.name} className="w-full h-full object-cover rounded-xl" /> : s.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-display font-bold text-foreground text-sm block">{s.name}</span>
                    <span className="text-[10px] text-muted-foreground font-body">{s.categories?.name || "Sem categoria"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${s.is_active ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {s.is_active ? "Activa" : "Inativa/Pendente"}
                  </span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteStore(s.id, s.name)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground font-body mt-3 pt-3 border-t border-border">
                <p>Criado por: <span className="text-foreground font-medium">{s.owner_profile?.full_name || 'Desconhecido'}</span></p>
                <p>Contacto: <span className="text-foreground font-medium">{s.phone || s.owner_profile?.phone || 'N/D'}</span></p>
                <p>Comissão: <span className="text-foreground font-medium">{s.commission_pct || 10}%</span></p>
                {s.average_rating > 0 && <p className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {s.average_rating}</p>}
              </div>

              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <Button size="sm" variant="outline" className="rounded-xl h-8 text-xs font-body text-purple-600 border-purple-200 hover:bg-purple-50 flex-1 gap-1" onClick={() => setSelectedStoreForProducts({ id: s.id, name: s.name })}>
                  <Package className="h-3 w-3" /> Ver Produtos
                </Button>
                {s.is_active ? (
                  <Button size="sm" variant="outline" className="rounded-xl h-8 text-xs font-body text-amber-600 border-amber-200 hover:bg-amber-50 flex-1 gap-1" onClick={() => handleUpdateStatus(s.id, false)}>
                    <XCircle className="h-3 w-3" /> Suspender Loja
                  </Button>
                ) : (
                  <Button size="sm" className="rounded-xl h-8 text-xs font-body bg-emerald-500 hover:bg-emerald-600 text-white flex-1 gap-1" onClick={() => handleUpdateStatus(s.id, true)}>
                    <CheckCircle2 className="h-3 w-3" /> Aprovar / Ativar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedStoreForProducts && (
        <AdminStoreProducts
          store={selectedStoreForProducts}
          onClose={() => setSelectedStoreForProducts(null)}
        />
      )}
    </div>
  );
};

const AdminStoreProducts = ({ store, onClose }: { store: { id: string, name: string }, onClose: () => void }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', store.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      console.error("Erro ao carregar produtos da loja:", err);
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [store.id]);

  const handleUpdateFee = async (productId: string, fee: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ admin_fee: fee })
        .eq('id', productId);

      if (error) throw error;
      toast({ title: "Sucesso", description: "Taxa atualizada com sucesso." });
      setProducts(products.map(p => p.id === productId ? { ...p, admin_fee: fee } : p));
    } catch (err: any) {
      console.error("Erro ao atualizar taxa:", err);
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-lg overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">Produtos da Loja</h3>
            <p className="text-sm text-muted-foreground font-body">{store.name}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 hover:bg-muted">
            <XCircle className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-purple-600 h-8 w-8" /></div>
          ) : products.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">Esta loja ainda não tem produtos.</div>
          ) : (
            <div className="space-y-3">
              {products.map(p => (
                <div key={p.id} className="bg-card border border-border rounded-xl p-3 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-body font-bold text-sm text-foreground truncate">{p.name}</h4>
                    <p className="text-xs text-muted-foreground font-body">{Number(p.price).toLocaleString('pt-AO')} Kz</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex flex-col items-end">
                      <label className="text-[10px] text-muted-foreground font-body mb-1">Taxa Admin (Kz)</label>
                      <input
                        type="number"
                        defaultValue={p.admin_fee || 0}
                        onBlur={(e) => {
                          const val = Number(e.target.value);
                          if (val !== (p.admin_fee || 0)) handleUpdateFee(p.id, val);
                        }}
                        className="w-24 px-2 py-1 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-purple-500 font-body text-right"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminOrders = ({ onOrderTotalUpdate }: { onOrderTotalUpdate?: (count: number) => void }) => {
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [couriers, setCouriers] = useState<any[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const ITEMS_PER_PAGE = 5;
  const { toast } = useToast();

  const fetchCouriers = async () => {
    try {
      // Get users with role 'logistics'
      const { data, error } = await supabase.rpc("get_admin_users");
      if (error) throw error;
      setCouriers(data?.filter((u: any) => u.role === "logistics") || []);
    } catch (err) {
      console.error("Erro ao buscar transportadores:", err);
    }
  };

  useEffect(() => {
    fetchCouriers();
  }, []);

  const fetchOrders = async (currentPage: number, currentFilter: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          stores(name),
          profiles:customer_id(full_name, phone)
        `, { count: 'exact' });

      if (currentFilter !== "all") {
        if (currentFilter === "active") {
          query = query.in('status', ['pending', 'confirmed', 'preparing', 'ready', 'delivering']);
        } else if (currentFilter === "delivered") {
          query = query.eq('status', 'delivered');
        } else if (currentFilter === "issues") {
          query = query.eq('status', 'cancelled');
        }
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      setOrders(data || []);
      setTotalOrders(count || 0);
    } catch (err: any) {
      console.error("Erro ao carregar encomendas:", err);
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignCourier = async (orderId: string, courierId: string) => {
    setIsAssigning(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          logistics_id: courierId, 
          logistics_status: 'assigned',
          status: 'confirmed'
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({ title: "Sucesso", description: "Transportador atribuído com sucesso." });
      fetchOrders(page, filter);
      setSelectedOrder(null);
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setIsAssigning(false);
    }
  };

  useEffect(() => {
    fetchOrders(page, filter);
  }, [page, filter]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setPage(1); // Reset page on filter change
  };

  const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE);

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    preparing: "bg-purple-100 text-purple-700",
    ready: "bg-emerald-100 text-emerald-700",
    delivering: "bg-blue-100 text-blue-700",
    delivered: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const statusLabels: Record<string, string> = {
    pending: "Pendente",
    confirmed: "Confirmada",
    preparing: "A preparar",
    ready: "Pronto a recolher",
    delivering: "A caminho",
    delivered: "Entregue",
    cancelled: "Cancelada",
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground">Todas Encomendas</h2>
        <span className="text-sm text-muted-foreground font-body">{totalOrders} no total</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[["all", "Todas"], ["active", "Ativas"], ["delivered", "Entregues"], ["issues", "Canceladas"]].map(([k, v]) => (
          <button key={k} onClick={() => handleFilterChange(k)} className={`px-4 py-1.5 rounded-full text-xs font-body font-medium whitespace-nowrap transition-all ${filter === k ? "bg-purple-600 text-white shadow-sm" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`}>{v}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-purple-600 h-8 w-8" /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">Nenhuma encomenda encontrada.</div>
      ) : (
        <>
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-body font-bold text-foreground text-sm">#{o.id.substring(0, 6).toUpperCase()}</span>
                    <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${statusColors[o.status] || "bg-gray-100"}`}>{statusLabels[o.status] || o.status}</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-body">
                    {new Date(o.created_at).toLocaleDateString('pt-AO')} {new Date(o.created_at).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs font-body">
                  <p className="text-muted-foreground">Loja: <span className="text-foreground font-medium">{o.stores?.name || 'Desconhecida'}</span></p>
                  <p className="text-muted-foreground">Cliente: <span className="text-foreground font-medium">{o.profiles?.full_name || 'Desconhecido'}</span></p>
                  <p className="text-muted-foreground">Tel Cliente: <span className="text-foreground font-medium">{o.profiles?.phone || 'N/D'}</span></p>
                  <p className="text-muted-foreground">Total: <span className="text-purple-600 font-bold">{Number(o.total).toLocaleString('pt-AO')} Kz</span></p>
                  {o.logistics_id && (
                    <p className="text-muted-foreground sm:col-span-2 mt-1 flex items-center gap-1">
                      <Truck className="h-3 w-3 text-emerald-500" />
                      Transportador: <span className="text-emerald-600 font-medium">Atribuído</span>
                    </p>
                  )}
                </div>
                <div className="flex justify-end mt-2">
                  <Button variant="outline" size="sm" className="h-7 text-[10px] rounded-lg" onClick={(e) => { e.stopPropagation(); setSelectedOrder(o); }}>
                    Ver Detalhes / Atribuir
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {selectedOrder && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-card border border-border rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg">Detalhes da Encomenda</h3>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)} className="rounded-full h-8 w-8">
                    <XCircle className="h-5 w-5" />
                  </Button>
                </div>
                <div className="p-4 overflow-y-auto space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">Informação Geral</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <p className="text-muted-foreground">Encomenda</p>
                        <p className="font-bold">#{selectedOrder.id.substring(0, 8).toUpperCase()}</p>
                      </div>
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <p className="text-muted-foreground">Estado</p>
                        <p className="font-bold">{statusLabels[selectedOrder.status] || selectedOrder.status}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">Entrega</p>
                    <div className="p-3 bg-muted/50 rounded-lg space-y-1 text-xs">
                      <p className="flex items-center gap-2"><MapPin className="h-3 w-3 text-red-500" /> {selectedOrder.delivery_address || 'Endereço não fornecido'}</p>
                      {selectedOrder.delivery_notes && <p className="text-muted-foreground mt-1 italic">"{selectedOrder.delivery_notes}"</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">Atribuir Transportador</p>
                    <div className="space-y-2">
                      {couriers.length === 0 ? (
                        <p className="text-xs text-muted-foreground bg-amber-50 p-3 rounded-lg border border-amber-100 italic">Nenhum transportador disponível no momento.</p>
                      ) : (
                        <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-1">
                          {couriers.map((courier) => (
                            <div 
                              key={courier.id} 
                              className={`flex items-center justify-between p-2 rounded-xl border transition-all ${selectedOrder.logistics_id === courier.id ? 'border-emerald-500 bg-emerald-50/50' : 'border-border hover:bg-muted/50'}`}
                            >
                              <div className="flex items-center gap-2 overflow-hidden">
                                <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700 shrink-0">
                                  {courier.full_name?.substring(0, 2).toUpperCase() || "TR"}
                                </div>
                                <div className="truncate">
                                  <p className="text-xs font-bold truncate">{courier.full_name || 'Sem nome'}</p>
                                  <p className="text-[10px] text-muted-foreground truncate">{courier.phone || 'Sem telefone'}</p>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant={selectedOrder.logistics_id === courier.id ? "ghost" : "default"} 
                                className={`h-7 text-[10px] px-2 rounded-lg ${selectedOrder.logistics_id === courier.id ? 'text-emerald-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                                onClick={() => handleAssignCourier(selectedOrder.id, courier.id)}
                                disabled={isAssigning || selectedOrder.logistics_id === courier.id}
                              >
                                {selectedOrder.logistics_id === courier.id ? 'Atribuído' : 'Atribuir'}
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground font-body">
                Pág {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const AdminUsers = () => {
  const [filter, setFilter] = useState("all");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("get_admin_users");
      if (error) throw error;
      setUsers(data || []);
    } catch (err: any) {
      console.error("Erro ao carregar utilizadores:", err);
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string, name: string) => {
    if (!confirm(`Tem certeza que deseja apagar o utilizador ${name}? Esta ação não pode ser desfeita.`)) return;

    try {
      const { error } = await supabase.rpc("delete_user_admin", { target_user_id: userId });
      if (error) throw error;
      toast({ title: "Sucesso", description: "Utilizador apagado com sucesso." });
      fetchUsers();
    } catch (err: any) {
      console.error("Erro ao apagar:", err);
      toast({ title: "Erro na exclusão", description: err.message, variant: "destructive" });
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesFilter =
      filter === "all" ? true :
        filter === "clients" ? u.role === "client" :
          filter === "stores" ? u.role === "store" :
            filter === "logistics" ? u.role === "logistics" :
              u.role === filter; // fallback para roles exatos como "admin"

    const matchesSearch = search === "" ||
      (u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const roleLabels: Record<string, string> = { client: "Cliente", store: "Gestor Loja", logistics: "Logística", admin: "Administrador" };
  const roleColors: Record<string, string> = { client: "bg-blue-100 text-blue-700", store: "bg-amber-100 text-amber-700", logistics: "bg-emerald-100 text-emerald-700", admin: "bg-purple-100 text-purple-700" };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground">Utilizadores</h2>
        <span className="text-sm text-muted-foreground font-body">{users.length} registados</span>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar por nome ou email..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 font-body"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[["all", "Todos"], ["clients", "Clientes"], ["stores", "Lojas"], ["logistics", "Logística"], ["admin", "Admins"]].map(([k, v]) => (
          <button key={k} onClick={() => setFilter(k)} className={`px-4 py-1.5 rounded-full text-xs font-body font-medium whitespace-nowrap transition-all ${filter === k ? "bg-purple-600 text-white shadow-sm" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`}>{v}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-purple-600 h-8 w-8" /></div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">Nenhum utilizador encontrado.</div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((u) => (
            <div key={u.id} className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center text-white text-lg font-bold shrink-0">
                  {u.full_name ? u.full_name.substring(0, 2).toUpperCase() : u.email.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-display font-bold text-foreground text-sm block truncate">{u.full_name || 'Sem Nome'}</span>
                  <span className="text-xs text-muted-foreground font-body block truncate">{u.email}</span>
                  {u.phone && <span className="text-xs text-muted-foreground font-body block truncate mt-0.5">{u.phone}</span>}
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                <div className="flex flex-col items-start sm:items-end gap-1">
                  <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${roleColors[u.role] || "bg-gray-100"}`}>{roleLabels[u.role] || u.role}</span>
                  <span className="text-[10px] text-muted-foreground font-body">{u.total_orders || 0} compras</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(u.id, u.full_name || u.email)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => { 
    await signOut();
    demoLogout(); 
    navigate("/auth"); 
  };
  return (
    <Button variant="outline" onClick={handleLogout} className="w-full rounded-xl h-12 gap-2 font-body text-destructive border-destructive/20 hover:bg-destructive/10">
      <LogOut className="h-4 w-4" /> Terminar Sessão
    </Button>
  );
};

export default AdminDashboard;
