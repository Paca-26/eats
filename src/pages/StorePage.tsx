import { useParams, Link } from "react-router-dom";
import { Star, Clock, MapPin, Phone, ArrowLeft, Plus, Minus, Heart, Share2, ShoppingBag, Truck, Award, ChefHat, Loader2, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import categoryTalho from "@/assets/category-talho.jpg";
import categoryPeixaria from "@/assets/category-peixaria.jpg";
import categoryMercearia from "@/assets/category-mercearia.jpg";
import categoryRestaurante from "@/assets/category-restaurante.jpg";
import categorySupermercado from "@/assets/category-supermercado.jpg";

const StorePage = () => {
  const { storeSlug } = useParams<{ storeSlug: string }>();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { items, addToCart, updateQuantity, totalItems, subtotal } = useCart();
  const [liked, setLiked] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeSlug) return;

      setLoading(true);

      try {
        // Fetch store info
        const { data: storeData, error: storeError } = await supabase
          .from("stores")
          .select("*, categories(name), zones(name)")
          .eq("id", storeSlug)
          .maybeSingle();

        if (storeError) throw storeError;

        if (!storeData) {
          setStore(null);
          return;
        }

        // Fetch store products
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("store_id", storeSlug)
          .eq("is_available", true);

        if (productsError) throw productsError;

        // Map database store to UI format
        const formattedStore = {
          ...storeData,
          category: storeData.categories?.name || "Loja",
          zone: storeData.zones?.name || "Luanda",
          image: storeData.cover_url || storeData.logo_url || categoryRestaurante,
          totalReviews: storeData.total_reviews || 0,
          rating: storeData.average_rating || 0,
          deliveryTime: "30-45 min", // Default for now
          deliveryFee: 500, // Default for now
          minOrder: 2000, // Default for now
          tags: ["Popular"],
          products: productsData || []
        };

        setStore(formattedStore);
      } catch (error) {
        console.error("Erro ao carregar dados da loja:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeSlug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="h-10 w-10 text-accent animate-spin" />
        <p className="font-body text-muted-foreground animate-pulse">Carregando loja...</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-foreground">Loja não encontrada</h1>
        <p className="text-muted-foreground font-body mt-3">A loja que procura não existe ou foi removida.</p>
        <Link to="/">
          <Button className="mt-6 rounded-full">Voltar à página inicial</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = (product: any) => {
    addToCart({
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || product.image || categoryRestaurante,
      storeId: store.id,
      storeName: store.name
    });
  };

  const getItemQuantity = (productId: string) => {
    return items.find((i) => i.productId === productId)?.quantity || 0;
  };

  const productCategories = [...new Set(store.products.map((p: any) => p.category))];
  const visibleCategories = activeCategory ? [activeCategory] : productCategories;
  const totalPrice = subtotal;


  return (
    <>
      {/* Hero */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img src={store.image} alt={store.name} className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />

        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          <Link to="/" className="inline-flex items-center gap-1.5 bg-background/20 backdrop-blur-md text-primary-foreground text-sm font-body px-3 py-1.5 rounded-full hover:bg-background/30 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
          <div className="flex gap-2">
            <button onClick={() => setLiked(!liked)} className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${liked ? 'bg-destructive text-destructive-foreground' : 'bg-background/20 text-primary-foreground hover:bg-background/30'}`}>
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            </button>
            <button className="w-9 h-9 rounded-full bg-background/20 backdrop-blur-md text-primary-foreground flex items-center justify-center hover:bg-background/30 transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 mb-2">
              {store.tags?.map((tag: string) => (
                <Badge key={tag} className="bg-accent/90 text-accent-foreground border-0 text-xs font-body backdrop-blur-sm">{tag}</Badge>
              ))}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{store.name}</h1>
            <p className="text-white/70 font-body mt-1">{store.category} · {store.zone}</p>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm font-body">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 bg-accent/10 text-accent px-2.5 py-1 rounded-full">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="font-bold">{store.rating}</span>
              </div>
              <span className="text-muted-foreground">({store.totalReviews})</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground"><Clock className="h-4 w-4" /><span>{store.deliveryTime}</span></div>
            <div className="flex items-center gap-1.5 text-muted-foreground"><Truck className="h-4 w-4" /><span>{store.deliveryFee?.toLocaleString("pt-AO")} Kz</span></div>
            <div className="flex items-center gap-1.5 text-muted-foreground"><ShoppingBag className="h-4 w-4" /><span>Mín. {store.minOrder?.toLocaleString("pt-AO")} Kz</span></div>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-body text-muted-foreground">
            <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /><span>{store.openingTime} - {store.closingTime}</span></div>
            <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /><span>{store.address}</span></div>
            <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /><span>{store.phone}</span></div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="container mx-auto px-4 pt-6 pb-2">
        <p className="text-muted-foreground font-body leading-relaxed">{store.description}</p>
      </div>

      {/* Category Tabs */}
      <div className="container mx-auto px-4 pt-4 pb-2 sticky top-0 bg-background/95 backdrop-blur-sm z-20">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-body font-medium transition-all ${!activeCategory ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground hover:bg-border'}`}
          >
            Todos
          </button>
          {productCategories.map((cat) => (
            <button
              key={cat as string}
              onClick={() => setActiveCategory(cat as string)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-body font-medium transition-all ${activeCategory === cat ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground hover:bg-border'}`}
            >
              {cat as string}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 py-4 pb-8">
        {visibleCategories.map((catName) => (
          <div key={catName as string} className="mb-8 animate-fade-in">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-accent" />
              {catName as string}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {store.products.filter((p: any) => p.category === catName).map((product: any, idx: number) => (
                <div
                  key={product.id}
                  className="group bg-card rounded-xl border border-border p-4 flex gap-4 hover:shadow-lg hover:border-accent/30 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                    {product.image_url || product.image ? (
                      <img src={product.image_url || product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-card-foreground truncate text-sm">{product.name}</h3>
                    <p className="text-xs text-muted-foreground font-body mt-0.5 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mt-2.5">
                      <span className="font-bold text-accent font-body text-sm">{product.price.toLocaleString("pt-AO")} Kz</span>
                      {getItemQuantity(product.id) > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => updateQuantity(product.id, -1)} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition-colors">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="font-bold text-sm w-5 text-center font-body">{getItemQuantity(product.id)}</span>
                          <button onClick={() => updateQuantity(product.id, 1)} className="w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent/80 transition-colors">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <Button size="sm" onClick={() => handleAddToCart(product)} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs h-7 px-3 font-body shadow-sm">
                          <Plus className="h-3 w-3 mr-0.5" /> Adicionar
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

      {/* Floating Cart */}
      {totalItems > 0 && (
        <div className="fixed bottom-20 md:bottom-0 left-0 right-0 z-40 px-4 pb-4 md:px-0 md:pb-0">
          <div className="container mx-auto">
            <div className="bg-primary text-primary-foreground p-4 rounded-2xl md:rounded-none shadow-2xl flex items-center justify-between animate-fade-in">
              <div className="font-body flex items-center gap-3">
                <div className="bg-accent text-accent-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                  {totalItems}
                </div>
                <div>
                  <p className="text-xs text-primary-foreground/60">Total</p>
                  <span className="font-bold text-accent">{totalPrice.toLocaleString("pt-AO")} Kz</span>
                </div>
              </div>
              <Link to="/carrinho">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-6 font-body shadow-lg">
                  Ver Carrinho
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default StorePage;
