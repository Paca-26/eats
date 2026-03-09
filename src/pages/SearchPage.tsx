import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StoreCard from "@/components/StoreCard";
import { Search, Loader2, Store as StoreIcon, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import categoryRestaurante from "@/assets/category-restaurante.jpg";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchData = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        // Search stores by name or category name
        const { data: storesData, error: storesError } = await supabase
          .from("stores")
          .select("*, categories(name)")
          .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
          .eq("is_active", true);

        if (storesError) throw storesError;

        // Search products by name (to show the stores that have them)
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("store_id")
          .ilike("name", `%${query}%`)
          .eq("is_available", true);

        if (productsError) throw productsError;

        // Combine result: stores that match OR stores that have matching products
        const storeIdsFromProducts = (productsData || []).map(p => p.store_id);
        const combinedStoreIds = new Set([
          ...(storesData || []).map(s => s.id),
          ...storeIdsFromProducts
        ]);

        if (combinedStoreIds.size === 0) {
          setResults([]);
          return;
        }

        // Final fetch for all mapped stores with full details
        const { data: finalStores, error: finalError } = await supabase
          .from("stores")
          .select("*, categories(name), zones(name)")
          .in("id", Array.from(combinedStoreIds))
          .eq("is_active", true);

        if (finalError) throw finalError;

        const formatted = (finalStores || []).map(s => ({
          ...s,
          category: s.categories?.name || "Loja",
          zone: s.zones?.name || "Luanda",
          image: s.logo_url || categoryRestaurante,
          deliveryTime: "30-45 min"
        }));

        setResults(formatted);
      } catch (error) {
        console.error("Erro na pesquisa:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(searchData, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-foreground mb-6">Pesquisar</h1>
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar lojas, produtos, categorias..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent font-body"
          autoFocus
        />
      </div>

      {loading ? (
        <div className="text-center py-16">
          <Loader2 className="h-10 w-10 mx-auto text-accent animate-spin mb-3" />
          <p className="text-muted-foreground font-body">Pesquisando...</p>
        </div>
      ) : query.trim() === "" ? (
        <div className="text-center py-16">
          <Search className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground font-body">Digite para pesquisar lojas e produtos.</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground font-body">Nenhum resultado para "{query}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((store) => (
            <Link key={store.id} to={`/loja/${store.id}`}>
              <StoreCard {...store} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
