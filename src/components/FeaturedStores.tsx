import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import StoreCard from "./StoreCard";
import categoryTalho from "@/assets/category-talho.jpg";
import categoryPeixaria from "@/assets/category-peixaria.jpg";
import categoryMercearia from "@/assets/category-mercearia.jpg";
import categoryRestaurante from "@/assets/category-restaurante.jpg";
import categorySupermercado from "@/assets/category-supermercado.jpg";
import { ArrowRight } from "lucide-react";

const stores = [
  { name: "MMM' All4You", slug: "mmm-all4you", category: "Restaurante", rating: 4.8, deliveryTime: "30-45 min", zone: "Talatona", featured: true, image: categoryRestaurante },
  { name: "Talho do Bairro", slug: "talho-do-bairro", category: "Talho", rating: 4.5, deliveryTime: "25-35 min", zone: "Talatona", featured: false, image: categoryTalho },
  { name: "Peixaria Atlântico", slug: "peixaria-atlantico", category: "Peixaria", rating: 4.6, deliveryTime: "30-40 min", zone: "Talatona", featured: true, image: categoryPeixaria },
  { name: "Mercearia da Avó", slug: "mercearia-da-avo", category: "Mercearia", rating: 4.3, deliveryTime: "20-30 min", zone: "Talatona", featured: false, image: categoryMercearia },
  { name: "Super Luanda", slug: "super-luanda", category: "Supermercado", rating: 4.7, deliveryTime: "35-50 min", zone: "Talatona", featured: true, image: categorySupermercado },
  { name: "Grelha de Ouro", slug: "grelha-de-ouro", category: "Restaurante", rating: 4.4, deliveryTime: "25-35 min", zone: "Talatona", featured: false, image: categoryRestaurante },
];

const FeaturedStores = () => {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store, i) => (
            <motion.div
              key={store.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to={`/loja/${store.slug}`}>
                <StoreCard {...store} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedStores;
