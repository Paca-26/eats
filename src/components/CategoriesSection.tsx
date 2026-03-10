import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Beef, Fish, Store, UtensilsCrossed, ShoppingCart, Loader2 } from "lucide-react";
import categoryTalho from "@/assets/category-talho.jpg";
import categoryPeixaria from "@/assets/category-peixaria.jpg";
import categoryMercearia from "@/assets/category-mercearia.jpg";
import categoryRestaurante from "@/assets/category-restaurante.jpg";
import categorySupermercado from "@/assets/category-supermercado.jpg";

const ICON_MAP: Record<string, any> = {
  "Restaurantes": UtensilsCrossed,
  "Supermercados": ShoppingCart,
  "Talhos": Beef,
  "Peixarias": Fish,
  "Mercearias": Store,
};

const IMAGE_MAP: Record<string, string> = {
  "Restaurantes": categoryRestaurante,
  "Supermercados": categorySupermercado,
  "Talhos": categoryTalho,
  "Peixarias": categoryPeixaria,
  "Mercearias": categoryMercearia,
};

const CategoriesSection = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("sort_order", { ascending: true })
          .limit(5);

        if (error) throw error;

        // Fetch store counts for each category
        const { data: storesData } = await supabase
          .from("stores")
          .select("category_id");

        const formatted = (data || []).map(cat => ({
          ...cat,
          icon: ICON_MAP[cat.name] || Store,
          image: cat.image_url || IMAGE_MAP[cat.name] || categoryMercearia,
          count: storesData?.filter(s => s.category_id === cat.id).length || 0
        }));

        setCategories(formatted);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-accent font-body font-semibold text-sm uppercase tracking-wider">Explorar</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-2">
            Categorias
          </h2>
          <p className="text-muted-foreground mt-2 font-body max-w-md">
            Encontre tudo o que precisa na sua zona — de frescos a refeições prontas
          </p>
        </motion.div>
        <Link to="/categorias" className="text-accent hover:text-accent/80 font-body font-semibold text-sm flex items-center gap-1 transition-colors shrink-0">
          Ver todas <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 gap-4">
          <Loader2 className="h-10 w-10 text-accent animate-spin" />
          <p className="font-body text-muted-foreground animate-pulse">Carregando categorias...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/categoria/${cat.id}`}
                  className="group relative rounded-2xl overflow-hidden aspect-square shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer block"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent group-hover:from-primary/95 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-primary-foreground">
                    <div className="w-9 h-9 rounded-xl bg-accent/20 backdrop-blur-sm flex items-center justify-center mb-1">
                      <Icon className="h-4.5 w-4.5 text-primary-foreground" />
                    </div>
                    <h3 className="font-display text-lg font-bold">{cat.name}</h3>
                    <p className="text-sm text-primary-foreground/70 font-body">{cat.count} lojas</p>
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-accent text-accent-foreground p-1.5 rounded-full">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CategoriesSection;
