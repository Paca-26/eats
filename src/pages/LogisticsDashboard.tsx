import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "@/components/DashboardShell";
import BottomNav, { BottomNavItem } from "@/components/BottomNav";
import StatCard from "@/components/StatCard";
import AnimatedTabContent from "@/components/AnimatedTabContent";
import { Truck, Package, MapPin, Clock, BarChart3, Navigation, CheckCircle2, Settings, Phone, Star, ChevronRight, AlertCircle, Fuel, Route, User, Calendar, Shield, Bell, Edit, Save, LogOut, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useDisplayUser } from "@/hooks/useDisplayUser";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  const { name } = useDisplayUser();
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('orders')
        .select('*, stores(name), profiles:customer_id(full_name)')
        .eq('logistics_id', user.id)
        .in('logistics_status', ['assigned', 'accepted', 'in_transit'])
        .order('updated_at', { ascending: false })
        .limit(3);

      if (!error) {
        setPendingOrders(data || []);
      }
      setLoading(false);
    };

    fetchPending();
  }, []);

  return (
  <div className="space-y-6">
    <div className="relative rounded-2xl overflow-hidden h-44">
      <img src={heroLogistics} alt="Entregas" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
      <div className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
        <p className="text-white/80 font-body text-sm">Motorista</p>
        <h1 className="font-display text-2xl font-bold mt-1 flex items-center gap-2">{name} <Truck className="h-6 w-6" /></h1>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="bg-emerald-500/80 backdrop-blur-sm text-white text-xs font-body px-2.5 py-0.5 rounded-full flex items-center gap-1">🟢 Online</span>
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-body px-2.5 py-0.5 rounded-full flex items-center gap-1"><MapPin className="h-3 w-3" /> Talatona</span>
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-body px-2.5 py-0.5 rounded-full flex items-center gap-1"><Star className="h-3 w-3 fill-white" /> 4.9</span>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard label="Entregas Hoje" value="8" icon={Truck} trend="+3" trendUp />
      <StatCard label="Pendentes" value={String(pendingOrders.length)} icon={Package} />
      <StatCard label="Zonas Activas" value="2" icon={MapPin} />
      <StatCard label="Tempo Médio" value="22 min" icon={Clock} />
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

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateLogisticsStatus = async (orderId: string, newStatus: string) => {
    try {
      const updates: any = { logistics_status: newStatus };
      if (newStatus === 'accepted') updates.status = 'preparing';
      if (newStatus === 'in_transit') updates.status = 'delivering';
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
        {[["pending","Novas Atribuídas"],["transit","Em curso"],["all","Todas"]].map(([k,v]) => (
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
                  <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${d.logistics_status === 'assigned' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                    {d.logistics_status === 'assigned' ? 'Pendente' : d.logistics_status === 'accepted' ? 'Aceite' : d.logistics_status}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-body text-muted-foreground">Loja: <span className="text-foreground font-semibold">{d.stores?.name || 'Loja'}</span></p>
                <p className="text-xs font-body text-muted-foreground">Cliente: <span className="text-foreground font-semibold">{d.profiles?.full_name || 'Cliente'}</span></p>
                <p className="text-xs font-body text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {d.delivery_address}</p>
                <p className="text-xs font-body text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" /> {d.profiles?.phone || 'Sem contacto'}</p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="font-body font-bold text-foreground">{Number(d.total).toLocaleString('pt-AO')} Kz</span>
                <div className="flex gap-2">
                  {d.logistics_status === 'assigned' ? (
                    <>
                      <Button onClick={() => handleUpdateLogisticsStatus(d.id, 'rejected')} size="sm" variant="outline" className="rounded-xl h-8 text-xs font-body border-red-200 text-red-600 hover:bg-red-50"><XCircle className="h-3 w-3" /> Recusar</Button>
                      <Button onClick={() => handleUpdateLogisticsStatus(d.id, 'accepted')} size="sm" className="rounded-xl h-8 text-xs font-body bg-emerald-500 hover:bg-emerald-600 text-white"><CheckCircle2 className="h-3 w-3" /> Aceitar</Button>
                    </>
                  ) : d.logistics_status === 'accepted' ? (
                    <Button onClick={() => handleUpdateLogisticsStatus(d.id, 'in_transit')} size="sm" className="rounded-xl h-8 text-xs font-body bg-blue-500 hover:bg-blue-600 text-white"><Navigation className="h-3 w-3" /> Iniciar Entrega</Button>
                  ) : d.logistics_status === 'in_transit' ? (
                    <Button onClick={() => handleUpdateLogisticsStatus(d.id, 'delivered')} size="sm" className="rounded-xl h-8 text-xs font-body bg-emerald-500 hover:bg-emerald-600 text-white"><CheckCircle2 className="h-3 w-3" /> Finalizar Entrega</Button>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
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
  const { name, email } = useDisplayUser();
  return (
  <div className="space-y-5">
    <h2 className="font-display text-2xl font-bold text-foreground">Definições</h2>
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white text-xl font-display font-bold">{name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}</div>
        <div>
          <h3 className="font-display font-bold text-foreground text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground font-body">{email || "pedro@demo.ao"}</p>
          <p className="text-xs text-muted-foreground font-body flex items-center gap-1"><Phone className="h-3 w-3" /> +244 926 555 666</p>
        </div>
      </div>
    </div>
    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="font-display font-bold text-foreground mb-3">Veículo</h3>
      <div className="space-y-2">
        {[
          { label: "Tipo", value: "Mota" },
          { label: "Matrícula", value: "LD-45-XX-99" },
          { label: "Capacidade", value: "Até 15 kg" },
        ].map((v) => (
          <div key={v.label} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
            <span className="text-sm font-body text-muted-foreground">{v.label}</span>
            <span className="text-sm font-body font-semibold text-foreground">{v.value}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
      {[
        { label: "Disponível para entregas", desc: "Receber novas entregas", active: true },
        { label: "Notificações sonoras", desc: "Som ao receber entregas", active: true },
        { label: "Modo nocturno", desc: "Entregas após as 21h", active: false },
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
    <Button className="w-full rounded-xl h-12 gap-2 font-body bg-gradient-to-r from-emerald-500 to-green-600 text-white">
      <Save className="h-4 w-4" /> Guardar Alterações
    </Button>
    <LogisticsLogoutButton />
  </div>
  );
};

const LogisticsLogoutButton = () => {
  const { demoLogout } = useDemoAuth();
  const navigate = useNavigate();
  const handleLogout = () => { demoLogout(); navigate("/auth"); };
  return (
    <Button variant="outline" onClick={handleLogout} className="w-full rounded-xl h-12 gap-2 font-body text-destructive border-destructive/20 hover:bg-destructive/10">
      <LogOut className="h-4 w-4" /> Terminar Sessão
    </Button>
  );
};

export default LogisticsDashboard;
