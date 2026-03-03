import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UtensilsCrossed, ShoppingCart, Beef, Fish, Store, Search, ArrowRight, MapPin } from "lucide-react";
import categoryRestaurante from "@/assets/category-restaurante.jpg";
import categorySupermercado from "@/assets/category-supermercado.jpg";
import categoryTalho from "@/assets/category-talho.jpg";
import categoryPeixaria from "@/assets/category-peixaria.jpg";
import categoryMercearia from "@/assets/category-mercearia.jpg";

const categories = [
  { name: "Restaurantes", slug: "restaurantes", icon: UtensilsCrossed, image: categoryRestaurante, count: 6, description: "Refeições prontas e comida preparada" },
  { name: "Supermercados", slug: "supermercados", icon: ShoppingCart, image: categorySupermercado, count: 4, description: "Compras completas para o dia-a-dia" },
  { name: "Talhos", slug: "talhos", icon: Beef, image: categoryTalho, count: 8, description: "Carnes frescas e de qualidade" },
  { name: "Peixarias", slug: "peixarias", icon: Fish, image: categoryPeixaria, count: 5, description: "Peixe e marisco fresco" },
  { name: "Mercearias", slug: "mercearias", icon: Store, image: categoryMercearia, count: 12, description: "Produtos do quotidiano e especialidades" },
];

const CategoriesPage = () => {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? categories.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase())
      )
    : categories;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <span className="text-accent font-body font-semibold text-sm uppercase tracking-wider">Explorar</span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1">Categorias</h1>
        <p className="text-muted-foreground font-body mt-1">Encontre lojas por tipo na sua zona</p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-8"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar categorias..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent font-body text-sm"
        />
      </motion.div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Search className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground font-body">Nenhuma categoria encontrada para "{query}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  to={`/categoria/${cat.slug}`}
                  className="group relative h-52 rounded-2xl overflow-hidden block shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent group-hover:from-primary/95 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-accent/20 backdrop-blur-sm flex items-center justify-center mb-2">
                        <Icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-primary-foreground">{cat.name}</h3>
                      <p className="text-sm text-primary-foreground/70 font-body mt-0.5">{cat.description}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <MapPin className="h-3.5 w-3.5 text-accent" />
                        <span className="text-xs text-primary-foreground/60 font-body">{cat.count} lojas disponíveis</span>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-1">
                      <div className="bg-accent text-accent-foreground p-2 rounded-full">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
