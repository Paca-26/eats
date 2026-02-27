import { Link } from "react-router-dom";
import StoreCard from "./StoreCard";
import categoryTalho from "@/assets/category-talho.jpg";
import categoryPeixaria from "@/assets/category-peixaria.jpg";
import categoryMercearia from "@/assets/category-mercearia.jpg";
import categoryRestaurante from "@/assets/category-restaurante.jpg";
import categorySupermercado from "@/assets/category-supermercado.jpg";

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
    <section className="bg-muted py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Lojas em Destaque
            </h2>
            <p className="text-muted-foreground mt-2 font-body">
              As melhores lojas na sua zona
            </p>
          </div>
          <button className="text-accent hover:text-accent/80 font-semibold text-sm font-body transition-colors">
            Ver Todas →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store, i) => (
            <Link key={store.slug} to={`/loja/${store.slug}`} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <StoreCard {...store} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedStores;
