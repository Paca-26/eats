import { useParams, Link } from "react-router-dom";
import StoreCard from "@/components/StoreCard";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import categoryTalho from "@/assets/category-talho.jpg";
import categoryPeixaria from "@/assets/category-peixaria.jpg";
import categoryMercearia from "@/assets/category-mercearia.jpg";
import categoryRestaurante from "@/assets/category-restaurante.jpg";
import categorySupermercado from "@/assets/category-supermercado.jpg";

const categoryImages: Record<string, string> = {
  "Talhos": categoryTalho, "Peixarias": categoryPeixaria, "Mercearias": categoryMercearia,
  "Restaurantes": categoryRestaurante, "Supermercados": categorySupermercado,
};

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>(); // This will be the category ID
  const [category, setCategory] = useState<any>(null);
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!categorySlug) return;
      setLoading(true);
      try {
        // Fetch category name
        const { data: catData } = await supabase
          .from("categories")
          .select("*")
          .eq("id", categorySlug)
          .maybeSingle();

        setCategory(catData);

        // Fetch stores in this category
        const { data: storesData, error } = await supabase
          .from("stores")
          .select("*")
          .eq("category_id", categorySlug)
          .eq("is_active", true);

        if (error) throw error;

        const formatted = (storesData || []).map(s => ({
          ...s,
          category: catData?.name || "Loja",
          image: s.logo_url || categoryImages[catData?.name || ""] || categoryMercearia,
          deliveryTime: "30-45 min" // Default
        }));

        setStores(formatted);
      } catch (error) {
        console.error("Erro ao carregar dados da categoria:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-accent animate-spin" />
        <p className="font-body text-muted-foreground animate-pulse">Carregando lojas...</p>
      </div>
    );
  }

  const categoryName = category?.name || "Categoria";
  const heroImage = categoryImages[categoryName] || categoryMercearia;

  return (
    <>
      <div className="relative h-40 md:h-52 overflow-hidden">
        <img src={heroImage} alt={categoryName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-primary/30" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <Link to="/categorias" className="inline-flex items-center gap-1 text-primary-foreground/70 hover:text-primary-foreground text-sm font-body mb-2 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Categorias
            </Link>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">{categoryName}</h1>
            <p className="text-primary-foreground/70 font-body mt-1">{stores.length} lojas disponíveis</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-10">
        {stores.length === 0 ? (
          <div className="text-center py-16"><p className="text-muted-foreground font-body text-lg">Nenhuma loja encontrada nesta categoria.</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store, i) => (
              <Link key={store.id} to={`/loja/${store.id}`} className="animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                <StoreCard {...store} />
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;
