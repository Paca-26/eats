import { useParams, Link } from "react-router-dom";
import Footer from "@/components/Footer";
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

const mockStores: Record<string, any> = {
  "mmm-all4you": {
    name: "MMM' All4You", category: "Restaurante", rating: 4.8, totalReviews: 124,
    deliveryTime: "30-45 min", deliveryFee: 500, minOrder: 2000, zone: "Talatona",
    address: "Rua da Samba, Talatona", phone: "+244 923 456 789",
    openingTime: "08:00", closingTime: "22:00",
    description: "O melhor restaurante de Talatona com pratos tradicionais e internacionais. Ingredientes frescos todos os dias, preparados por chefs experientes.",
    image: categoryRestaurante, tags: ["Popular", "Entrega Rápida"],
    products: [
      { id: "1", name: "Muamba de Galinha", price: 3500, description: "Prato tradicional angolano com amendoim, quiabo e óleo de palma", category: "Pratos Principais", image: categoryRestaurante },
      { id: "2", name: "Calulu de Peixe", price: 4200, description: "Com peixe fresco do dia e legumes da época", category: "Pratos Principais", image: categoryPeixaria },
      { id: "3", name: "Funge com Carne Seca", price: 2800, description: "Funge de milho acompanhado de molho de carne seca", category: "Pratos Principais", image: categoryTalho },
      { id: "4", name: "Arroz de Marisco", price: 5500, description: "Arroz cremoso com camarão, mexilhão e lulas", category: "Pratos Especiais", image: categoryPeixaria },
      { id: "5", name: "Mufete de Peixe", price: 4800, description: "Peixe grelhado com banana, batata-doce e feijão de óleo de palma", category: "Pratos Especiais", image: categoryPeixaria },
      { id: "6", name: "Sumo de Múcua", price: 800, description: "Natural e refrescante, feito na hora", category: "Bebidas", image: categoryMercearia },
      { id: "7", name: "Coca-Cola 33cl", price: 500, description: "Bem gelada", category: "Bebidas", image: categorySupermercado },
      { id: "8", name: "Água Pura 50cl", price: 300, description: "Água mineral natural", category: "Bebidas", image: categorySupermercado },
    ],
  },
  "grelha-de-ouro": {
    name: "Grelha de Ouro", category: "Restaurante", rating: 4.4, totalReviews: 89,
    deliveryTime: "25-35 min", deliveryFee: 400, minOrder: 1500, zone: "Talatona",
    address: "Av. 21 de Janeiro, Talatona", phone: "+244 924 567 890",
    openingTime: "11:00", closingTime: "23:00",
    description: "Especialistas em grelhados e carnes premium. O sabor autêntico da brasa com um toque moderno.",
    image: categoryRestaurante, tags: ["Grelhados", "Novo"],
    products: [
      { id: "g1", name: "Picanha na Brasa 400g", price: 6500, description: "Corte premium grelhado no ponto perfeito", category: "Grelhados", image: categoryTalho },
      { id: "g2", name: "Espetada Mista", price: 4200, description: "Carne de vaca, frango e linguiça", category: "Grelhados", image: categoryTalho },
      { id: "g3", name: "Frango à Zambeziana", price: 3800, description: "Frango grelhado com molho de coco e amendoim", category: "Grelhados", image: categoryRestaurante },
      { id: "g4", name: "Costeleta de Porco", price: 3500, description: "Marinada em ervas e grelhada lentamente", category: "Grelhados", image: categoryTalho },
      { id: "g5", name: "Salada Caesar", price: 1800, description: "Com croutons caseiros e parmesão", category: "Entradas", image: categoryMercearia },
      { id: "g6", name: "Cerveja Cuca 33cl", price: 600, description: "A cerveja de Angola", category: "Bebidas", image: categorySupermercado },
    ],
  },
  "talho-do-bairro": {
    name: "Talho do Bairro", category: "Talho", rating: 4.5, totalReviews: 67,
    deliveryTime: "25-35 min", deliveryFee: 350, minOrder: 3000, zone: "Talatona",
    address: "Av. Pedro de Castro Van-Dúnem Loy", phone: "+244 912 345 678",
    openingTime: "07:00", closingTime: "19:00",
    description: "Carnes frescas e de qualidade, directamente dos melhores produtores. Cortes tradicionais e premium.",
    image: categoryTalho, tags: ["Fresco", "Qualidade"],
    products: [
      { id: "t1", name: "Picanha 1kg", price: 5800, description: "Corte premium, macia e suculenta", category: "Bovino", image: categoryTalho },
      { id: "t2", name: "Alcatra 1kg", price: 4500, description: "Ideal para churrasco ou assado", category: "Bovino", image: categoryTalho },
      { id: "t3", name: "Costela 1kg", price: 3200, description: "Perfeita para caldos e guisados", category: "Bovino", image: categoryTalho },
      { id: "t4", name: "Frango Inteiro", price: 2200, description: "Fresco do dia, criado ao ar livre", category: "Aves", image: categoryTalho },
      { id: "t5", name: "Coxa de Frango 1kg", price: 1800, description: "Embalagem familiar", category: "Aves", image: categoryTalho },
      { id: "t6", name: "Costela de Porco 1kg", price: 3200, description: "Ideal para grelhar com marinada", category: "Suíno", image: categoryTalho },
      { id: "t7", name: "Lombo de Porco 1kg", price: 3800, description: "Corte magro e versátil", category: "Suíno", image: categoryTalho },
      { id: "t8", name: "Carne Seca 500g", price: 2800, description: "Tradicional, curada artesanalmente", category: "Processados", image: categoryTalho },
      { id: "t9", name: "Linguiça Caseira 500g", price: 2200, description: "Receita tradicional angolana", category: "Processados", image: categoryTalho },
    ],
  },
  "talho-premium": {
    name: "Talho Premium", category: "Talho", rating: 4.7, totalReviews: 98,
    deliveryTime: "20-30 min", deliveryFee: 500, minOrder: 5000, zone: "Talatona",
    address: "Centro Comercial Talatona, Loja 12", phone: "+244 925 678 901",
    openingTime: "08:00", closingTime: "20:00",
    description: "Carnes seleccionadas de primeira qualidade. Especializados em cortes nobres e importados.",
    image: categoryTalho, tags: ["Premium", "Importados"],
    products: [
      { id: "tp1", name: "T-Bone Steak 500g", price: 8500, description: "Corte importado, maturado 21 dias", category: "Cortes Nobres", image: categoryTalho },
      { id: "tp2", name: "Entrecôte 500g", price: 7200, description: "Marmoreado perfeito para grelhar", category: "Cortes Nobres", image: categoryTalho },
      { id: "tp3", name: "Filé Mignon 500g", price: 9000, description: "O mais nobre dos cortes bovinos", category: "Cortes Nobres", image: categoryTalho },
      { id: "tp4", name: "Rack de Cordeiro", price: 12000, description: "Importado da Namíbia, 8 costelas", category: "Especialidades", image: categoryTalho },
      { id: "tp5", name: "Wagyu A5 200g", price: 25000, description: "Carne japonesa de altíssima qualidade", category: "Especialidades", image: categoryTalho },
      { id: "tp6", name: "Kit Churrasco Família", price: 15000, description: "Picanha, linguiça, frango e acompanhamentos para 6 pessoas", category: "Kits", image: categoryTalho },
    ],
  },
  "peixaria-atlantico": {
    name: "Peixaria Atlântico", category: "Peixaria", rating: 4.6, totalReviews: 112,
    deliveryTime: "30-40 min", deliveryFee: 600, minOrder: 2500, zone: "Talatona",
    address: "Mercado do Peixe, Talatona", phone: "+244 913 456 789",
    openingTime: "06:00", closingTime: "18:00",
    description: "Peixe e marisco fresco todos os dias, directamente do Atlântico. Qualidade garantida desde 2010.",
    image: categoryPeixaria, tags: ["Fresco do Dia", "Marisco"],
    products: [
      { id: "p1", name: "Camarão Tigre 1kg", price: 8500, description: "Gigante, fresco e limpo", category: "Mariscos", image: categoryPeixaria },
      { id: "p2", name: "Lagosta 1kg", price: 15000, description: "Atlântica, viva e fresca", category: "Mariscos", image: categoryPeixaria },
      { id: "p3", name: "Mexilhão 1kg", price: 3200, description: "Limpo e pronto a cozinhar", category: "Mariscos", image: categoryPeixaria },
      { id: "p4", name: "Garoupa Inteira 1kg", price: 5500, description: "Peixe nobre, ideal para grelhar", category: "Peixes", image: categoryPeixaria },
      { id: "p5", name: "Corvina 1kg", price: 4200, description: "Fresca do dia, carne firme", category: "Peixes", image: categoryPeixaria },
      { id: "p6", name: "Cacusso 1kg", price: 3800, description: "Peixe de água doce, tradicional", category: "Peixes", image: categoryPeixaria },
      { id: "p7", name: "Filé de Salmão 500g", price: 6500, description: "Importado, sem espinhas", category: "Filés", image: categoryPeixaria },
      { id: "p8", name: "Bacalhau Seco 1kg", price: 7000, description: "Norueguês, demolhado", category: "Filés", image: categoryPeixaria },
    ],
  },
  "mercearia-da-avo": {
    name: "Mercearia da Avó", category: "Mercearia", rating: 4.3, totalReviews: 54,
    deliveryTime: "20-30 min", deliveryFee: 300, minOrder: 1500, zone: "Talatona",
    address: "Rua do Comércio, 45, Talatona", phone: "+244 916 789 012",
    openingTime: "07:30", closingTime: "20:00",
    description: "Produtos tradicionais angolanos e mercearia geral. O sabor de casa, como a avó fazia.",
    image: categoryMercearia, tags: ["Tradicional", "Artesanal"],
    products: [
      { id: "m1", name: "Fuba de Milho 1kg", price: 800, description: "Para o funge perfeito", category: "Cereais e Farinhas", image: categoryMercearia },
      { id: "m2", name: "Óleo de Palma 1L", price: 1200, description: "Puro e natural, extracção artesanal", category: "Óleos e Temperos", image: categoryMercearia },
      { id: "m3", name: "Jindungo 250g", price: 600, description: "Picante e aromático", category: "Óleos e Temperos", image: categoryMercearia },
      { id: "m4", name: "Feijão Manteiga 1kg", price: 1500, description: "Grão graúdo, cozinha rápido", category: "Leguminosas", image: categoryMercearia },
      { id: "m5", name: "Ginguba Torrada 500g", price: 1000, description: "Amendoim angolano torrado", category: "Snacks", image: categoryMercearia },
      { id: "m6", name: "Múcua em Pó 250g", price: 900, description: "Fruto do embondeiro, rico em vitaminas", category: "Snacks", image: categoryMercearia },
      { id: "m7", name: "Café Angolano 250g", price: 1800, description: "Robusta de Uíge, torrado artesanalmente", category: "Bebidas", image: categoryMercearia },
    ],
  },
  "mercearia-central": {
    name: "Mercearia Central", category: "Mercearia", rating: 4.1, totalReviews: 38,
    deliveryTime: "15-25 min", deliveryFee: 250, minOrder: 1000, zone: "Talatona",
    address: "Av. Central, 102, Talatona", phone: "+244 917 890 123",
    openingTime: "07:00", closingTime: "21:00",
    description: "Mercearia completa com produtos nacionais e importados. Tudo o que precisa num só lugar.",
    image: categoryMercearia, tags: ["Variedade", "Bons Preços"],
    products: [
      { id: "mc1", name: "Arroz Agulha 5kg", price: 3500, description: "Grão longo, importado", category: "Básicos", image: categoryMercearia },
      { id: "mc2", name: "Açúcar 1kg", price: 600, description: "Refinado", category: "Básicos", image: categoryMercearia },
      { id: "mc3", name: "Massa Esparguete 500g", price: 450, description: "Italiana, cozedura al dente", category: "Básicos", image: categoryMercearia },
      { id: "mc4", name: "Leite Nido 400g", price: 2200, description: "Leite em pó instantâneo", category: "Lacticínios", image: categoryMercearia },
      { id: "mc5", name: "Manteiga 250g", price: 1200, description: "Importada, sem sal", category: "Lacticínios", image: categoryMercearia },
      { id: "mc6", name: "Atum em Lata", price: 800, description: "Em azeite, 160g", category: "Conservas", image: categoryMercearia },
      { id: "mc7", name: "Tomate Pelado 400g", price: 650, description: "Italiano, para molhos", category: "Conservas", image: categoryMercearia },
    ],
  },
  "super-luanda": {
    name: "Super Luanda", category: "Supermercado", rating: 4.7, totalReviews: 203,
    deliveryTime: "35-50 min", deliveryFee: 800, minOrder: 5000, zone: "Talatona",
    address: "Shopping Talatona, Piso 0", phone: "+244 922 345 678",
    openingTime: "08:00", closingTime: "22:00",
    description: "O supermercado mais completo de Talatona. Milhares de produtos nacionais e importados com os melhores preços.",
    image: categorySupermercado, tags: ["Completo", "Promoções"],
    products: [
      { id: "s1", name: "Cabaz Família", price: 25000, description: "Arroz, óleo, açúcar, massa, leite e mais 10 produtos essenciais", category: "Cabazes", image: categorySupermercado },
      { id: "s2", name: "Cabaz Básico", price: 12000, description: "6 produtos essenciais para a semana", category: "Cabazes", image: categorySupermercado },
      { id: "s3", name: "Fraldas Pampers T4 (40un)", price: 8500, description: "Conforto e proteção", category: "Higiene e Bebé", image: categorySupermercado },
      { id: "s4", name: "Detergente OMO 3kg", price: 3500, description: "Limpeza profunda", category: "Limpeza", image: categorySupermercado },
      { id: "s5", name: "Azeite Extra Virgem 750ml", price: 4200, description: "Português, primeira prensagem", category: "Mercearia", image: categoryMercearia },
      { id: "s6", name: "Coca-Cola Pack 6x33cl", price: 2400, description: "Pack económico", category: "Bebidas", image: categorySupermercado },
      { id: "s7", name: "Água Pura Pack 6x1.5L", price: 1800, description: "Mineral natural", category: "Bebidas", image: categorySupermercado },
      { id: "s8", name: "Cerveja Cuca Pack 12", price: 4800, description: "A cerveja dos angolanos", category: "Bebidas", image: categorySupermercado },
    ],
  },
  "maxi-plus": {
    name: "Maxi Plus", category: "Supermercado", rating: 4.2, totalReviews: 76,
    deliveryTime: "40-55 min", deliveryFee: 600, minOrder: 3000, zone: "Talatona",
    address: "Rua dos Coqueiros, 88, Talatona", phone: "+244 923 012 345",
    openingTime: "07:30", closingTime: "21:30",
    description: "Supermercado de proximidade com foco em produtos frescos e preços competitivos.",
    image: categorySupermercado, tags: ["Preços Baixos", "Frescos"],
    products: [
      { id: "mx1", name: "Banana 1kg", price: 600, description: "Madura e doce", category: "Frutas e Legumes", image: categoryMercearia },
      { id: "mx2", name: "Tomate 1kg", price: 800, description: "Frescos, da horta local", category: "Frutas e Legumes", image: categoryMercearia },
      { id: "mx3", name: "Cebola 1kg", price: 500, description: "Essencial na cozinha", category: "Frutas e Legumes", image: categoryMercearia },
      { id: "mx4", name: "Pão de Forma", price: 900, description: "Fresco do dia, 500g", category: "Padaria", image: categoryMercearia },
      { id: "mx5", name: "Iogurte Natural 4x125g", price: 1200, description: "Cremoso e fresco", category: "Lacticínios", image: categorySupermercado },
      { id: "mx6", name: "Queijo Fatiado 200g", price: 1500, description: "Importado, tipo flamengo", category: "Lacticínios", image: categorySupermercado },
      { id: "mx7", name: "Sumo Compal 1L", price: 900, description: "100% fruta, vários sabores", category: "Bebidas", image: categorySupermercado },
    ],
  },
};

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

      // Check if it's a mock store first for backward compatibility
      if (mockStores[storeSlug]) {
        setStore(mockStores[storeSlug]);
        setLoading(false);
        return;
      }

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

      <Footer />
    </>
  );
};

export default StorePage;
