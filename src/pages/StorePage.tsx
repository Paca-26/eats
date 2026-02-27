import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, Clock, MapPin, Phone, ArrowLeft, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import categoryTalho from "@/assets/category-talho.jpg";
import categoryPeixaria from "@/assets/category-peixaria.jpg";
import categoryMercearia from "@/assets/category-mercearia.jpg";
import categoryRestaurante from "@/assets/category-restaurante.jpg";
import categorySupermercado from "@/assets/category-supermercado.jpg";

// Mock data - will be replaced with DB queries
const mockStores: Record<string, any> = {
  "mmm-all4you": {
    name: "MMM' All4You",
    category: "Restaurante",
    rating: 4.8,
    totalReviews: 124,
    deliveryTime: "30-45 min",
    zone: "Talatona",
    address: "Rua da Samba, Talatona",
    phone: "+244 923 456 789",
    openingTime: "08:00",
    closingTime: "22:00",
    description: "O melhor restaurante de Talatona com pratos tradicionais e internacionais.",
    image: categoryRestaurante,
    products: [
      { id: "1", name: "Muamba de Galinha", price: 3500, description: "Prato tradicional angolano", category: "Pratos Principais", image: categoryRestaurante },
      { id: "2", name: "Calulu de Peixe", price: 4200, description: "Com peixe fresco do dia", category: "Pratos Principais", image: categoryPeixaria },
      { id: "3", name: "Funge com Carne Seca", price: 2800, description: "Acompanhado de molho", category: "Pratos Principais", image: categoryTalho },
      { id: "4", name: "Sumo de Múcua", price: 800, description: "Natural e refrescante", category: "Bebidas", image: categoryMercearia },
      { id: "5", name: "Coca-Cola 33cl", price: 500, description: "Bem gelada", category: "Bebidas", image: categorySupermercado },
    ],
  },
  "talho-do-bairro": {
    name: "Talho do Bairro",
    category: "Talho",
    rating: 4.5,
    totalReviews: 67,
    deliveryTime: "25-35 min",
    zone: "Talatona",
    address: "Av. Pedro de Castro Van-Dúnem Loy",
    phone: "+244 912 345 678",
    openingTime: "07:00",
    closingTime: "19:00",
    description: "Carnes frescas e de qualidade, directamente dos melhores produtores.",
    image: categoryTalho,
    products: [
      { id: "6", name: "Picanha 1kg", price: 5800, description: "Corte premium", category: "Bovino", image: categoryTalho },
      { id: "7", name: "Frango Inteiro", price: 2200, description: "Fresco do dia", category: "Aves", image: categoryTalho },
      { id: "8", name: "Costela de Porco 1kg", price: 3200, description: "Ideal para grelhar", category: "Suíno", image: categoryTalho },
      { id: "9", name: "Carne Seca 500g", price: 2800, description: "Tradicional", category: "Processados", image: categoryTalho },
    ],
  },
};

const StorePage = () => {
  const { storeSlug } = useParams<{ storeSlug: string }>();
  const store = storeSlug ? mockStores[storeSlug] : null;
  const [cart, setCart] = useState<Record<string, number>>({});

  if (!store) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">Loja não encontrada</h1>
          <Link to="/" className="text-accent hover:underline font-body mt-4 inline-block">
            Voltar à página inicial
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const addToCart = (productId: string) => {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const productCategories = [...new Set(store.products.map((p: any) => p.category))];
  const totalItems = Object.values(cart).reduce((a: number, b: number) => a + b, 0);
  const totalPrice = store.products.reduce((sum: number, p: any) => sum + (cart[p.id] || 0) * p.price, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Store header */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <Link to="/" className="inline-flex items-center gap-1 text-primary-foreground/70 hover:text-primary-foreground text-sm font-body mb-3 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Link>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">{store.name}</h1>
            <p className="text-primary-foreground/70 font-body mt-1">{store.category} · {store.zone}</p>
          </div>
        </div>
      </div>

      {/* Store info bar */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center gap-6 text-sm font-body">
          <div className="flex items-center gap-1 text-accent">
            <Star className="h-4 w-4 fill-current" />
            <span className="font-semibold">{store.rating}</span>
            <span className="text-muted-foreground">({store.totalReviews} avaliações)</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{store.openingTime} - {store.closingTime}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{store.address}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{store.phone}</span>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground font-body mb-8">{store.description}</p>

        {productCategories.map((catName) => (
          <div key={catName as string} className="mb-10">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">{catName as string}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {store.products
                .filter((p: any) => p.category === catName)
                .map((product: any) => (
                  <div
                    key={product.id}
                    className="bg-card rounded-xl border border-border p-4 flex gap-4 hover:shadow-md transition-shadow"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-card-foreground truncate">{product.name}</h3>
                      <p className="text-xs text-muted-foreground font-body mt-0.5">{product.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-semibold text-accent font-body">
                          {product.price.toLocaleString("pt-AO")} Kz
                        </span>
                        {cart[product.id] ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => removeFromCart(product.id)} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-border transition-colors">
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="font-semibold text-sm w-5 text-center">{cart[product.id]}</span>
                            <button onClick={() => addToCart(product.id)} className="w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent/80 transition-colors">
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <Button size="sm" onClick={() => addToCart(product.id)} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs h-8 px-4">
                            Adicionar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating cart bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground p-4 shadow-2xl z-50 animate-slide-up">
          <div className="container mx-auto flex items-center justify-between">
            <div className="font-body">
              <span className="font-semibold">{totalItems} {totalItems === 1 ? "item" : "itens"}</span>
              <span className="text-primary-foreground/70 mx-2">·</span>
              <span className="font-bold text-accent">{totalPrice.toLocaleString("pt-AO")} Kz</span>
            </div>
            <Link to="/carrinho">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-6">
                Ver Carrinho
              </Button>
            </Link>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default StorePage;
