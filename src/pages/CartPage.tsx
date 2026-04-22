import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import categoryRestaurante from "@/assets/category-restaurante.jpg";
import categoryTalho from "@/assets/category-talho.jpg";

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const { user, role } = useAuth();
  const { demoUser, isDemoMode } = useDemoAuth();
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [acceptSubstitution, setAcceptSubstitution] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"immediate" | "scheduled">("immediate");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const currentRole = isDemoMode ? demoUser?.role : role;
  const isClient = currentRole === "client";

  const deliveryFee = items.length > 0 ? 1500 : 0;
  const total = subtotal + deliveryFee;

  const storeGroups = items.reduce<Record<string, typeof items>>((acc, item) => {
    if (!acc[item.storeName]) acc[item.storeName] = [];
    acc[item.storeName].push(item);
    return acc;
  }, {});

  const handlePlaceOrder = async () => {
    if (!user && !isDemoMode) {
      toast.error("Por favor, faça login para finalizar o pedido");
      navigate("/auth");
      return;
    }

    if (!isClient) {
      toast.error("Apenas clientes podem realizar pedidos. Por favor, crie uma conta de cliente.");
      return;
    }

    if (!deliveryAddress.trim()) {
      toast.error("Por favor, insira um endereço de entrega");
      return;
    }

    if (deliveryType === "scheduled" && (!scheduledDate || !scheduledTime)) {
      toast.error("Por favor, defina a data e hora para a entrega agendada");
      return;
    }

    setIsPlacingOrder(true);
    try {
      // Group items by store to create separate orders if needed, or one order per store
      // For now, let's create one order per store present in the cart
      const storeIds = [...new Set(items.map(i => i.storeId))];

      for (const storeId of storeIds) {
        const storeItems = items.filter(i => i.storeId === storeId);
        const storeSubtotal = storeItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

        // 1. Create the order
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            customer_id: user?.id || demoUser?.email || "demo-customer",
            store_id: storeId,
            status: "pending",
            delivery_address: deliveryAddress,
            delivery_notes: deliveryNotes,
            accept_substitution: acceptSubstitution,
            delivery_type: deliveryType,
            scheduled_date: deliveryType === "scheduled" ? scheduledDate : null,
            scheduled_time: deliveryType === "scheduled" ? scheduledTime : null,
            subtotal: storeSubtotal,
            delivery_fee: 1500, // Fixed for simplicity
            total: storeSubtotal + 1500
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // 2. Create order items
        const orderItemsToInsert = storeItems.map(item => ({
          order_id: order.id,
          product_id: item.productId,
          product_name: item.name,
          product_image: item.image, // Save the image at time of purchase
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity
        }));

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItemsToInsert);

        if (itemsError) throw itemsError;
      }

      toast.success("Pedido realizado com sucesso!");
      clearCart();
      // Redirect to Client Dashboard - Orders tab explicitly using state
      navigate("/cliente", { state: { activeTab: "orders" } });
    } catch (error) {
      console.error("Erro ao realizar pedido:", error);
      toast.error("Erro ao processar o seu pedido. Tente novamente.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm font-body mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Continuar a comprar
        </Link>
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Carrinho</h1>
        {items.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/40 mx-auto" />
            <h2 className="font-display text-2xl font-semibold text-foreground">Carrinho vazio</h2>
            <p className="text-muted-foreground font-body">Adicione produtos das nossas lojas para começar.</p>
            <Link to="/"><Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full mt-4">Explorar Lojas</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {Object.entries(storeGroups).map(([storeName, storeItems]) => (
                <div key={storeName} className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="bg-primary/5 px-4 py-3 border-b border-border">
                    <h3 className="font-display font-semibold text-foreground">{storeName}</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {storeItems.map((item) => (
                      <div key={item.productId} className="p-4 flex gap-4 items-center">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-body font-medium text-card-foreground truncate">{item.name}</h4>
                          <p className="text-sm text-accent font-semibold font-body">{item.price.toLocaleString("pt-AO")} Kz</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.productId, -1)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-border transition-colors"><Minus className="h-3.5 w-3.5" /></button>
                          <span className="font-semibold text-sm w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, 1)} className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent/80 transition-colors"><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.productId)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 space-y-4 shadow-sm">
                <h3 className="font-display text-xl font-semibold text-card-foreground">Resumo</h3>

                {isClient ? (
                  <>
                    <div>
                      <label className="text-sm font-medium text-foreground font-body">Endereço de Entrega</label>
                      <Input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Ex: Rua da Samba, Talatona" className="mt-1 rounded-xl" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground font-body">Notas (opcional)</label>
                      <Input value={deliveryNotes} onChange={(e) => setDeliveryNotes(e.target.value)} placeholder="Ex: Apartamento 3B, tocar campainha" className="mt-1 rounded-xl" />
                    </div>

                    <div className="pt-4 border-t border-border space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground font-body cursor-pointer flex-1" htmlFor="substitution">
                          Aceita substituição caso falte produto?
                          <p className="text-[10px] text-muted-foreground font-normal">A loja sugerirá uma alternativa se algo estiver indisponível.</p>
                        </label>
                        <input
                          id="substitution"
                          type="checkbox"
                          checked={acceptSubstitution}
                          onChange={(e) => setAcceptSubstitution(e.target.checked)}
                          className="h-5 w-5 rounded border-border text-accent focus:ring-accent"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground font-body">Tipo de Entrega</label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            variant={deliveryType === "immediate" ? "default" : "outline"}
                            onClick={() => setDeliveryType("immediate")}
                            className={`rounded-xl h-10 text-xs font-body ${deliveryType === "immediate" ? "bg-accent text-accent-foreground" : ""}`}
                          >
                            Imediata
                          </Button>
                          <Button
                            type="button"
                            variant={deliveryType === "scheduled" ? "default" : "outline"}
                            onClick={() => setDeliveryType("scheduled")}
                            className={`rounded-xl h-10 text-xs font-body ${deliveryType === "scheduled" ? "bg-accent text-accent-foreground" : ""}`}
                          >
                            Agendada
                          </Button>
                        </div>
                      </div>

                      {deliveryType === "scheduled" && (
                        <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="space-y-1">
                            <label className="text-[10px] font-medium text-muted-foreground ml-1">Data</label>
                            <Input
                              type="date"
                              value={scheduledDate}
                              onChange={(e) => setScheduledDate(e.target.value)}
                              className="rounded-xl h-10 text-xs"
                              min={new Date().toISOString().split("T")[0]}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-medium text-muted-foreground ml-1">Hora</label>
                            <Input
                              type="time"
                              value={scheduledTime}
                              onChange={(e) => setScheduledTime(e.target.value)}
                              className="rounded-xl h-10 text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 pt-4 border-t border-border font-body text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-card-foreground font-medium">{subtotal.toLocaleString("pt-AO")} Kz</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Entrega (K)</span><span className="text-card-foreground font-medium">{deliveryFee.toLocaleString("pt-AO")} Kz</span></div>
                      <div className="flex justify-between pt-2 border-t border-border text-base font-bold"><span>Total</span><span className="text-accent">{total.toLocaleString("pt-AO")} Kz</span></div>
                    </div>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder}
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full py-6 font-semibold mt-4 shadow-md transition-all active:scale-95"
                    >
                      {isPlacingOrder ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        "Finalizar Pedido"
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
                    <p className="text-sm text-amber-800 font-body leading-relaxed text-center">
                      {!user && !isDemoMode
                        ? "Para continuar com o seu pedido, por favor crie uma conta ou faça login como cliente."
                        : "Detectamos que a sua conta não é de cliente. Para fazer pedidos, precisa de uma conta de cliente."}
                    </p>
                    <Link to="/auth" className="block">
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-full font-body font-bold py-5">
                        Fazer Login / Criar Conta
                      </Button>
                    </Link>
                  </div>
                )}

                <p className="text-xs text-muted-foreground font-body text-center">Pagamento por referência Multicaixa ou transferência</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  );
};

export default CartPage;
