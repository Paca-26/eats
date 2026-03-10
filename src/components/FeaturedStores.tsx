import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import StoreCard from "./StoreCard";
import categoryRestaurante from "@/assets/category-restaurante.jpg";
import { ArrowRight, Loader2 } from "lucide-react";

const FeaturedStores = () => {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedStores = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("stores")
          .select("*, categories(name), zones(name)")
          .eq("is_active", true)
          .eq("is_featured", true)
          .limit(6);

        if (error) throw error;

        const formatted = (data || []).map(store => ({
          id: store.id,
          name: store.name,
          category: store.categories?.name || "Loja",
          rating: store.average_rating || 0,
          deliveryTime: "30-45 min", // Default for now
          zone: store.zones?.name || "Luanda",
          featured: store.is_featured,
          image: store.logo_url || store.cover_url || categoryRestaurante
        }));

        setStores(formatted);
      } catch (error) {
        console.error("Erro ao carregar lojas em destaque:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedStores();
  }, []);

  return (
    <section className="bg-muted py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent font-body font-semibold text-sm uppercase tracking-wider">Destaque</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-2">
              Lojas em Destaque
            </h2>
            <p className="text-muted-foreground mt-2 font-body">
              As melhores lojas na sua zona, seleccionadas para si
            </p>
          </motion.div>
          <Link to="/categorias" className="text-accent hover:text-accent/80 font-semibold text-sm font-body transition-colors flex items-center gap-1 shrink-0">
            Ver Todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 text-accent animate-spin" />
            <p className="font-body text-muted-foreground animate-pulse">Carregando lojas...</p>
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-body">Nenhuma loja em destaque no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store, i) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link to={`/loja/${store.id}`}>
                  <StoreCard {...store} />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedStores;
