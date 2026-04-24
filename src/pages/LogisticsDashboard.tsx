import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "@/components/DashboardShell";
import BottomNav, { BottomNavItem } from "@/components/BottomNav";
import StatCard from "@/components/StatCard";
import AnimatedTabContent from "@/components/AnimatedTabContent";
import { Truck, Package, MapPin, Clock, BarChart3, Navigation, CheckCircle2, Settings, Phone, Star, ChevronRight, AlertCircle, Fuel, Route, User, Calendar, Shield, Bell, Edit, Save, LogOut, XCircle, Loader2, Timer, StickyNote, ShieldCheck, Users, X, Store, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { useDisplayUser } from "@/hooks/useDisplayUser";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import LogisticsChat from "@/components/LogisticsChat";
import heroLogistics from "@/assets/hero-logistics.jpg";

const navItems: BottomNavItem[] = [
  { label: "Início", icon: BarChart3, id: "home" },
  { label: "Entregas", icon: Truck, id: "deliveries" },
  { label: "Rotas", icon: Navigation, id: "routes" },
  { label: "Histórico", icon: CheckCircle2, id: "history" },
  { label: "Definições", icon: Settings, id: "settings" },
];

const LogisticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [assignedOrdersCount, setAssignedOrdersCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAssignedCount = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('logistics_id', user.id)
        .eq('logistics_status', 'assigned');
      
      if (!error && count !== null) {
        setAssignedOrdersCount(count);
      }
    };

    fetchAssignedCount();

    const subscribeToAssignments = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const subscription = supabase
        .channel('courier-assignments')
        .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'orders',
          filter: `logistics_id=eq.${user.id}`
        }, (payload) => {
          if (payload.new.logistics_status === 'assigned') {
            toast({
              title: "Nova Entrega Atribuída!",
              description: "Verifique o menu Entregas para aceitar.",
            });
            setAssignedOrdersCount(prev => prev + 1);
          } else if (payload.old.logistics_status === 'assigned' && payload.new.logistics_status !== 'assigned') {
            setAssignedOrdersCount(prev => Math.max(0, prev - 1));
          }
        })
        .subscribe();

      return subscription;
    };

    let sub: any;
    subscribeToAssignments().then(s => sub = s);

    return () => {
      if (sub) supabase.removeChannel(sub);
    };
  }, [toast]);

  const navItemsWithBadges = navItems.map(item => {
    if (item.id === "deliveries") {
      return { ...item, badgeCount: assignedOrdersCount };
    }
    return item;
  });

  const renderContent = () => {
    switch (activeTab) {
      case "home": return <LogisticsHome />;
      case "deliveries": return <LogisticsDeliveries onUpdate={() => {}} />;
      case "routes": return <LogisticsRoutes />;
      case "history": return <LogisticsHistory />;
      case "settings": return <LogisticsSettings />;
      default: return <LogisticsHome />;
    }
  };

  return (
    <DashboardShell
      title="Painel Logística"
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

const LogisticsHome = () => {
  const { name, avatarUrl } = useDisplayUser();
  const [profile, setProfile] = useState<any>(null);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile for vehicle info and zone
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*, zones(name)')
        .eq('id', user.id)
        .single();
      
      if (profileData) setProfile(profileData);

      // Fetch pending orders
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('*, stores(name), profiles:customer_id(full_name)')
        .eq('logistics_id', user.id)
        .in('logistics_status', ['assigned', 'accepted', 'in_transit'])
        .order('updated_at', { ascending: false });

      if (!error) {
        setPendingOrders(ordersData || []);
      }

      // Fetch today's delivered orders count
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: deliveredToday } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('logistics_id', user.id)
        .eq('status', 'delivered')
        .gte('updated_at', today.toISOString());

      // Fetch exact pending count (status 'assigned')
      const { count: pendingCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('logistics_id', user.id)
        .eq('logistics_status', 'assigned');

      setStats({
        deliveredToday: deliveredToday || 0,
        pendingCount: pendingCount || 0,
      });

      setLoading(false);
    };

    fetchData();
  }, []);

  const [stats, setStats] = useState({ deliveredToday: 0, pendingCount: 0 });

  return (
  <div className="space-y-6">
    <div className="relative rounded-2xl overflow-hidden h-44">
      {avatarUrl ? (
        <img src={avatarUrl} alt="Perfil" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <img src={heroLogistics} alt="Entregas" className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
      <div className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
        <p className="text-white/80 font-body text-sm">Motorista</p>
        <h1 className="font-display text-2xl font-bold mt-1 flex items-center gap-2">{name} <Truck className="h-6 w-6" /></h1>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="bg-emerald-500/80 backdrop-blur-sm text-white text-xs font-body px-2.5 py-0.5 rounded-full flex items-center gap-1">🟢 Online</span>
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-body px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {profile?.zones?.name || 'Localização'}
          </span>
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-body px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Truck className="h-3 w-3" /> {profile?.vehicle_type || 'Mota'}
          </span>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard label="Entregas Hoje" value={String(stats.deliveredToday)} icon={Truck} trend="+3" trendUp />
      <StatCard label="Pendentes" value={String(stats.pendingCount)} icon={Package} />
      <StatCard label="Zonas Activas" value="1" icon={MapPin} />
      <StatCard label="Tempo Médio" value="--" icon={Clock} />
    </div>
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-foreground">Entregas Pendentes</h2>
        <span className="bg-amber-100 text-amber-700 text-[10px] font-body font-bold px-2 py-0.5 rounded-full">{pendingOrders.length} pendentes</span>
      </div>
      <div className="divide-y divide-border">
        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-muted-foreground" /></div>
        ) : pendingOrders.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground font-body">Nenhuma entrega pendente.</div>
        ) : pendingOrders.map((d, i) => (
          <div key={i} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-body font-bold text-foreground text-sm">#{d.id.substring(0, 6).toUpperCase()}</span>
                <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${d.logistics_status === 'assigned' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                  {d.logistics_status === 'assigned' ? 'Atribuída' : d.logistics_status === 'accepted' ? 'Aceite' : 'Em trânsito'}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-body">De: <span className="text-foreground font-semibold">{d.stores?.name || 'Loja'}</span></p>
            <p className="text-xs text-muted-foreground font-body">Para: <span className="text-foreground font-semibold">{d.profiles?.full_name || 'Cliente'}</span></p>
            <p className="text-xs text-muted-foreground font-body flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> {d.delivery_address}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

const LogisticsDeliveries = ({ onUpdate }: { onUpdate?: () => void }) => {
  const [filter, setFilter] = useState("pending");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const { toast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let query = supabase
      .from("orders")
      .select("*, stores(name, logo_url), profiles:customer_id(full_name, phone)")
      .eq("logistics_id", user.id);

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching deliveries:", error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const fetchOrderItems = async (orderId: string) => {
    setLoadingItems(true);
    try {
      const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);
      if (error) throw error;
      setOrderItems(data || []);
    } catch (err: any) {
      console.error("Erro ao buscar itens da encomenda:", err);
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateLogisticsStatus = async (orderId: string, newStatus: string) => {
    try {
      const updates: any = { logistics_status: newStatus };
      if (newStatus === 'accepted') updates.status = 'preparing';
      if (newStatus === 'in_transit') updates.status = 'in_transit';
      if (newStatus === 'delivered') updates.status = 'delivered';

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);

      if (error) throw error;

      toast({ title: "Sucesso", description: `Pedido ${newStatus === 'rejected' ? 'rejeitado' : 'atualizado'}.` });
      fetchOrders();
      if (onUpdate) onUpdate();
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  const filteredOrders = orders.filter(o => {
    if (filter === "all") return true;
    if (filter === "pending") return o.logistics_status === "assigned";
    if (filter === "transit") return o.logistics_status === "accepted" || o.logistics_status === "in_transit";
    return true;
  });

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl font-bold text-foreground">Entregas</h2>
      <div className="flex gap-2">
        {Object.entries({"pending":"Novas Atribuídas","transit":"Em curso","all":"Todas"}).map(([k,v]) => (
          <button key={k} onClick={() => setFilter(k)} className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all ${filter === k ? "bg-accent text-accent-foreground shadow-sm" : "bg-card text-muted-foreground border border-border hover:border-accent/50"}`}>{v}</button>
        ))}
      </div>
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-accent h-8 w-8" /></div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground font-body bg-card border border-dashed border-border rounded-2xl">
            <Truck className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Nenhuma entrega encontrada.</p>
          </div>
        ) : (
          filteredOrders.map((d) => (
            <div key={d.id} className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-body font-bold text-foreground text-sm">#{d.id.substring(0,6).toUpperCase()}</span>
                  <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${d.status === 'ready_for_delivery' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                    {d.status === 'ready_for_delivery' ? 'Pronto p/ Entrega' : d.status === 'in_transit' ? 'Em Transporte' : d.status === 'delivered' ? 'Entregue' : d.logistics_status}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-body text-muted-foreground">Loja: <span className="text-foreground font-semibold">{d.stores?.name || 'Loja'}</span></p>
                <p className="text-xs font-body text-muted-foreground">Cliente: <span className="text-foreground font-semibold">{d.profiles?.full_name || 'Cliente'}</span></p>
                <p className="text-xs font-body text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {d.delivery_address}</p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="font-body font-bold text-foreground">{Number(d.total).toLocaleString('pt-AO')} Kz</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="rounded-xl h-8 text-xs font-body" onClick={() => {
                    setSelectedOrder(d);
                    fetchOrderItems(d.id);
                  }}>Detalhes</Button>
                  {d.logistics_status === 'assigned' && (
                    <Button onClick={(e) => { e.stopPropagation(); handleUpdateLogisticsStatus(d.id, 'accepted'); }} size="sm" className="rounded-xl h-8 text-xs font-body bg-emerald-500 hover:bg-emerald-600 text-white">Aceitar</Button>
                  )}
                  {d.logistics_status === 'accepted' && (
                    <Button onClick={(e) => { e.stopPropagation(); handleUpdateLogisticsStatus(d.id, 'in_transit'); }} size="sm" className="rounded-xl h-8 text-xs font-body bg-blue-500 hover:bg-blue-600 text-white">Iniciar</Button>
                  )}
                  {d.logistics_status === 'in_transit' && (
                    <Button onClick={(e) => { e.stopPropagation(); handleUpdateLogisticsStatus(d.id, 'delivered'); }} size="sm" className="rounded-xl h-8 text-xs font-body bg-emerald-500 hover:bg-emerald-600 text-white">Finalizar</Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">Detalhes da Entrega</h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)} className="rounded-full h-8 w-8">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4 overflow-y-auto space-y-5 custom-scrollbar">
              {/* Trip Info */}
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-1 before:bottom-1 before:w-0.5 before:bg-muted before:content-['']">
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm" />
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Recolha (Loja)</p>
                  <p className="text-sm font-bold text-foreground">{selectedOrder.stores?.name || 'Loja'}</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Entrega (Cliente)</p>
                  <p className="text-sm font-bold text-foreground">{selectedOrder.profiles?.full_name || 'Cliente'}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-3 w-3 text-red-500" /> {selectedOrder.delivery_address}
                  </p>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-10 rounded-xl gap-2 font-body text-xs" onClick={() => window.location.href = `tel:${selectedOrder.profiles?.phone}`}>
                  <Phone className="h-3.5 w-3.5 text-emerald-600" /> Ligar Cliente
                </Button>
                <Button variant="outline" className="h-10 rounded-xl gap-2 font-body text-xs" disabled={!selectedOrder.stores?.phone}>
                  <Store className="h-3.5 w-3.5 text-blue-600" /> Ligar Loja
                </Button>
              </div>

              {/* Order Items */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Package className="h-4 w-4 text-emerald-600" /> Itens a Transportar
                </p>
                {loadingItems ? (
                  <div className="flex justify-center py-4"><Loader2 className="animate-spin text-emerald-600 h-6 w-6" /></div>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 bg-muted/30 border border-border/50 rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border/30">
                          {item.product_image ? (
                            <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-foreground truncate">{item.product_name}</p>
                          <p className="text-[10px] text-muted-foreground">{item.quantity}x unidades</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Delivery Details */}
              <div className="p-3 bg-muted/20 border border-border rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-body">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Urgência:</span>
                  </div>
                  <span className={`font-bold uppercase ${selectedOrder.delivery_type === 'immediate' ? 'text-red-500' : 'text-blue-500'}`}>
                    {selectedOrder.delivery_type === 'immediate' ? 'Imediata' : 'Agendada'}
                  </span>
                </div>
                {selectedOrder.delivery_type === 'scheduled' && (
                  <div className="bg-blue-50 p-2 rounded-lg text-[10px] font-bold text-blue-700 flex items-center justify-center gap-2">
                    <Timer className="h-3.5 w-3.5" /> {selectedOrder.scheduled_date} às {selectedOrder.scheduled_time}
                  </div>
                )}
                {selectedOrder.delivery_notes && (
                  <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                    <p className="text-[10px] text-amber-800 italic flex gap-1.5 items-start leading-relaxed">
                      <StickyNote className="h-3 w-3 shrink-0 mt-0.5" /> "{selectedOrder.delivery_notes}"
                    </p>
                  </div>
                )}
              </div>

              {/* Status Actions */}
              <div className="pt-2 flex flex-col gap-2">
                {selectedOrder.logistics_status === 'assigned' ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl h-11 text-xs font-body border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        handleUpdateLogisticsStatus(selectedOrder.id, 'rejected');
                        setSelectedOrder(null);
                      }}
                    >
                      Recusar
                    </Button>
                    <Button
                      className="flex-1 rounded-xl h-11 text-xs font-body bg-emerald-500 hover:bg-emerald-600 text-white shadow-md"
                      onClick={() => {
                        handleUpdateLogisticsStatus(selectedOrder.id, 'accepted');
                        setSelectedOrder(null);
                      }}
                    >
                      Aceitar Entrega
                    </Button>
                  </div>
                ) : selectedOrder.logistics_status === 'accepted' ? (
                  <Button
                    className="w-full rounded-xl h-11 text-xs font-body bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                    onClick={() => {
                      handleUpdateLogisticsStatus(selectedOrder.id, 'in_transit');
                      setSelectedOrder(null);
                    }}
                  >
                    Iniciar Percurso
                  </Button>
                ) : selectedOrder.logistics_status === 'in_transit' ? (
                  <Button
                    className="w-full rounded-xl h-11 text-xs font-body bg-emerald-500 hover:bg-emerald-600 text-white shadow-md"
                    onClick={() => {
                      handleUpdateLogisticsStatus(selectedOrder.id, 'delivered');
                      setSelectedOrder(null);
                    }}
                  >
                    Marcar como Entregue
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LogisticsRoutes = () => (
  <div className="space-y-5">
    <h2 className="font-display text-2xl font-bold text-foreground">Rotas & Zonas</h2>
    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2"><Route className="h-5 w-5 text-accent" /> Rota Actual</h3>
      <div className="space-y-3">
        {[
          { step: 1, label: "MMM' All4You", type: "Recolha", time: "14:30", done: true },
          { step: 2, label: "Maria Silva — Talatona", type: "Entrega", time: "14:55", done: false },
          { step: 3, label: "Super Luanda", type: "Recolha", time: "15:10", done: false },
          { step: 4, label: "João Costa — Maianga", type: "Entrega", time: "15:35", done: false },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${s.done ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}>
              {s.done ? <CheckCircle2 className="h-4 w-4" /> : s.step}
            </div>
            <div className="flex-1">
              <span className={`text-sm font-body block ${s.done ? "text-muted-foreground line-through" : "text-foreground font-semibold"}`}>{s.label}</span>
              <span className="text-[10px] text-muted-foreground font-body">{s.type} · {s.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2"><MapPin className="h-5 w-5 text-accent" /> Zonas de Cobertura</h3>
      <div className="space-y-2">
        {[
          { zone: "Talatona", radius: "15 km", active: true },
          { zone: "Maianga", radius: "10 km", active: true },
          { zone: "Viana", radius: "20 km", active: false },
        ].map((z) => (
          <div key={z.zone} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
            <div>
              <span className="text-sm font-body font-semibold text-foreground">{z.zone}</span>
              <span className="text-xs text-muted-foreground font-body block">Raio: {z.radius}</span>
            </div>
            <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${z.active ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
              {z.active ? "Activa" : "Inactiva"}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const LogisticsHistory = () => {
  const history = [
    { id: "#E-298", store: "Grelha de Ouro", client: "Carlos M.", total: "6.500 Kz", date: "Hoje, 12:30", rating: 5, duration: "18 min" },
    { id: "#E-295", store: "Mercearia Central", client: "Sofia R.", total: "3.200 Kz", date: "Hoje, 11:00", rating: 5, duration: "22 min" },
    { id: "#E-290", store: "Super Luanda", client: "Pedro A.", total: "9.800 Kz", date: "Ontem", rating: 4, duration: "28 min" },
    { id: "#E-285", store: "Talho Premium", client: "Ana J.", total: "7.100 Kz", date: "Ontem", rating: 5, duration: "15 min" },
    { id: "#E-280", store: "MMM' All4You", client: "Maria S.", total: "4.500 Kz", date: "25 Fev", rating: 5, duration: "20 min" },
  ];

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl font-bold text-foreground">Histórico</h2>
      <div className="grid grid-cols-3 gap-3">
        {[{label: "Total", value: "156"}, {label: "Este mês", value: "38"}, {label: "Ganhos", value: "42K Kz"}].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-3 text-center">
            <span className="font-display font-bold text-foreground text-xl block">{s.value}</span>
            <span className="text-[10px] text-muted-foreground font-body">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {history.map((h) => (
          <div key={h.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 shrink-0"><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-body font-bold text-foreground text-sm">{h.id}</span>
                <span className="text-[10px] text-muted-foreground font-body">{h.duration}</span>
              </div>
              <p className="text-xs text-muted-foreground font-body">{h.store} → {h.client}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="font-body font-bold text-foreground text-sm block">{h.total}</span>
              <div className="flex items-center gap-0.5 justify-end">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className={`h-2.5 w-2.5 ${s < h.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LogisticsSettings = () => {
  const { name, email, avatarUrl } = useDisplayUser();
  const [profile, setProfile] = useState<any>({
    full_name: "",
    phone: "",
    vehicle_type: "Mota",
    license_plate: "",
    vehicle_capacity: "",
    avatar_url: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setProfile({
          full_name: data.full_name || "",
          phone: data.phone || "",
          vehicle_type: data.vehicle_type || "Mota",
          license_plate: data.license_plate || "",
          vehicle_capacity: data.vehicle_capacity || "",
          avatar_url: data.avatar_url || ""
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          vehicle_type: profile.vehicle_type,
          license_plate: profile.license_plate,
          vehicle_capacity: profile.vehicle_capacity,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      toast({ title: "Sucesso", description: "Perfil atualizado com sucesso." });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      toast({ title: "Sucesso", description: "Avatar carregado. Salve para aplicar." });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-emerald-500" /></div>;

  return (
  <div className="space-y-5">
    <h2 className="font-display text-2xl font-bold text-foreground">Definições</h2>
    
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex flex-col items-center mb-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white text-3xl font-display font-bold overflow-hidden shadow-lg">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)
            )}
          </div>
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Edit className="h-6 w-6" />
            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
          </label>
        </div>
        <div className="text-center mt-3">
          <h3 className="font-display font-bold text-foreground text-lg">{profile.full_name || name}</h3>
          <p className="text-sm text-muted-foreground font-body">{email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-body font-semibold text-foreground">Nome Completo</label>
          <input 
            type="text" 
            value={profile.full_name} 
            onChange={e => setProfile({...profile, full_name: e.target.value})}
            className="w-full h-11 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 outline-none font-body text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-body font-semibold text-foreground">Telefone</label>
          <input 
            type="text" 
            value={profile.phone} 
            onChange={e => setProfile({...profile, phone: e.target.value})}
            className="w-full h-11 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 outline-none font-body text-sm"
          />
        </div>
      </div>
    </div>

    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
        <Truck className="h-5 w-5 text-emerald-500" /> Dados do Veículo
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-body font-semibold text-muted-foreground">Tipo de Veículo</label>
          <select 
            value={profile.vehicle_type} 
            onChange={e => setProfile({...profile, vehicle_type: e.target.value})}
            className="w-full h-11 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 outline-none font-body text-sm"
          >
            <option value="Mota">Mota</option>
            <option value="Carro">Carro</option>
            <option value="Bicicleta">Bicicleta</option>
            <option value="Carrinha">Carrinha</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-body font-semibold text-muted-foreground">Matrícula</label>
          <input 
            type="text" 
            placeholder="Ex: LD-00-00-XX"
            value={profile.license_plate} 
            onChange={e => setProfile({...profile, license_plate: e.target.value})}
            className="w-full h-11 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 outline-none font-body text-sm"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className="text-xs font-body font-semibold text-muted-foreground">Capacidade de Carga</label>
          <input 
            type="text" 
            placeholder="Ex: Até 20kg"
            value={profile.vehicle_capacity} 
            onChange={e => setProfile({...profile, vehicle_capacity: e.target.value})}
            className="w-full h-11 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 outline-none font-body text-sm"
          />
        </div>
      </div>
    </div>

    <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
      {[
        { label: "Disponível para entregas", desc: "Receber novas entregas", active: true },
        { label: "Notificações sonoras", desc: "Som ao receber entregas", active: true },
      ].map((toggle) => (
        <div key={toggle.label} className="flex items-center justify-between p-4 px-5">
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

    <Button 
      onClick={handleSave} 
      disabled={saving}
      className="w-full rounded-2xl h-12 gap-2 font-body font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 shadow-md hover:shadow-lg transition-all"
    >
      {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
      Guardar Alterações
    </Button>
    
    <LogisticsLogoutButton />
  </div>
  );
};

const LogisticsLogoutButton = () => {
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

export default LogisticsDashboard;
