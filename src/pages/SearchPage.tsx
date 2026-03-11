import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StoreCard from "@/components/StoreCard";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import categoryRestaurante from "@/assets/category-restaurante.jpg";

const PAGE_SIZE = 6;

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [allStores, setAllStores] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Load all stores on mount
  useEffect(() => {
    const fetchAllStores = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("stores")
          .select("*, categories(name), zones(name)")
          .eq("is_active", true)
          .order("name");

        if (error) throw error;

        const formatted = (data || []).map((s) => ({
          ...s,
          category: s.categories?.name || "Loja",
          zone: s.zones?.name || "Luanda",
          image: s.logo_url || categoryRestaurante,
          deliveryTime: "30-45 min",
        }));

        setAllStores(formatted);
        setResults(formatted);
      } catch (error) {
        console.error("Erro ao carregar lojas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStores();
  }, []);

  // Filter stores when query changes
  useEffect(() => {
    setCurrentPage(1);

    if (query.trim().length < 2) {
      setResults(allStores);
      return;
    }

    const lower = query.toLowerCase();
    const filtered = allStores.filter(
      (s) =>
        s.name?.toLowerCase().includes(lower) ||
        s.description?.toLowerCase().includes(lower) ||
        s.category?.toLowerCase().includes(lower)
    );
    setResults(filtered);
  }, [query, allStores]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const paginated = results.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-foreground mb-6">
        Pesquisar
      </h1>

      {/* Search input */}
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

      {/* States */}
      {loading ? (
        <div className="text-center py-16">
          <Loader2 className="h-10 w-10 mx-auto text-accent animate-spin mb-3" />
          <p className="text-muted-foreground font-body">A carregar lojas...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground font-body">
            {query.trim().length >= 2
              ? `Nenhum resultado para "${query}".`
              : "Nenhuma loja disponível de momento."}
          </p>
        </div>
      ) : (
        <>
          {/* Result count & page info */}
          <p className="text-sm text-muted-foreground font-body mb-4">
            {results.length} {results.length === 1 ? "loja encontrada" : "lojas encontradas"}
            {totalPages > 1 && ` · Página ${currentPage} de ${totalPages}`}
          </p>

          {/* Store grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginated.map((store) => (
              <Link key={store.id} to={`/loja/${store.id}`}>
                <StoreCard {...store} />
              </Link>
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-card border border-border text-foreground disabled:opacity-40 hover:bg-accent/10 transition-colors"
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-10 h-10 rounded-xl border font-body text-sm font-medium transition-colors ${page === currentPage
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-card border-border text-foreground hover:bg-accent/10"
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-card border border-border text-foreground disabled:opacity-40 hover:bg-accent/10 transition-colors"
                aria-label="Próxima página"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
