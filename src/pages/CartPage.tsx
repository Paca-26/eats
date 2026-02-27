import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useState } from "react";
import categoryRestaurante from "@/assets/category-restaurante.jpg";
import categoryTalho from "@/assets/category-talho.jpg";

// Mock cart data
const initialCartItems = [
  { id: "1", name: "Muamba de Galinha", store: "MMM' All4You", price: 3500, quantity: 2, image: categoryRestaurante },
  { id: "6", name: "Picanha 1kg", store: "Talho do Bairro", price: 5800, quantity: 1, image: categoryTalho },
];

const CartPage = () => {
  const [items, setItems] = useState(initialCartItems);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 1500 : 0;
  const total = subtotal + deliveryFee;

  // Group by store
  const storeGroups = items.reduce<Record<string, typeof items>>((acc, item) => {
    if (!acc[item.store]) acc[item.store] = [];
    acc[item.store].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

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
            <Link to="/">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full mt-4">
                Explorar Lojas
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-6">
              {Object.entries(storeGroups).map(([storeName, storeItems]) => (
                <div key={storeName} className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="bg-primary/5 px-4 py-3 border-b border-border">
                    <h3 className="font-display font-semibold text-foreground">{storeName}</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {storeItems.map((item) => (
                      <div key={item.id} className="p-4 flex gap-4 items-center">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-body font-medium text-card-foreground truncate">{item.name}</h4>
                          <p className="text-sm text-accent font-semibold font-body">{item.price.toLocaleString("pt-AO")} Kz</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-border transition-colors">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="font-semibold text-sm w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent/80 transition-colors">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h3 className="font-display text-xl font-semibold text-card-foreground">Resumo</h3>

                <div>
                  <label className="text-sm font-medium text-foreground font-body">Endereço de Entrega</label>
                  <Input
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Ex: Rua da Samba, Talatona"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground font-body">Notas (opcional)</label>
                  <Input
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Ex: Apartamento 3B, tocar campainha"
                    className="mt-1"
                  />
                </div>

                <div className="space-y-2 pt-4 border-t border-border font-body text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-card-foreground font-medium">{subtotal.toLocaleString("pt-AO")} Kz</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entrega (K)</span>
                    <span className="text-card-foreground font-medium">{deliveryFee.toLocaleString("pt-AO")} Kz</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border text-base font-bold">
                    <span>Total</span>
                    <span className="text-accent">{total.toLocaleString("pt-AO")} Kz</span>
                  </div>
                </div>

                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full py-6 font-semibold mt-4">
                  Finalizar Pedido
                </Button>

                <p className="text-xs text-muted-foreground font-body text-center">
                  Pagamento por referência Multicaixa ou transferência
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
