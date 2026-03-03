import { useParams, Link } from "react-router-dom";
import Footer from "@/components/Footer";
import StoreCard from "@/components/StoreCard";
import { ArrowLeft } from "lucide-react";
import categoryTalho from "@/assets/category-talho.jpg";
import categoryPeixaria from "@/assets/category-peixaria.jpg";
import categoryMercearia from "@/assets/category-mercearia.jpg";
import categoryRestaurante from "@/assets/category-restaurante.jpg";
import categorySupermercado from "@/assets/category-supermercado.jpg";

const allStores = [
  { name: "MMM' All4You", slug: "mmm-all4you", category: "Restaurantes", rating: 4.8, deliveryTime: "30-45 min", zone: "Talatona", featured: true, image: categoryRestaurante },
  { name: "Grelha de Ouro", slug: "grelha-de-ouro", category: "Restaurantes", rating: 4.4, deliveryTime: "25-35 min", zone: "Talatona", featured: false, image: categoryRestaurante },
  { name: "Talho do Bairro", slug: "talho-do-bairro", category: "Talhos", rating: 4.5, deliveryTime: "25-35 min", zone: "Talatona", featured: false, image: categoryTalho },
  { name: "Talho Premium", slug: "talho-premium", category: "Talhos", rating: 4.7, deliveryTime: "20-30 min", zone: "Talatona", featured: true, image: categoryTalho },
  { name: "Peixaria Atlântico", slug: "peixaria-atlantico", category: "Peixarias", rating: 4.6, deliveryTime: "30-40 min", zone: "Talatona", featured: true, image: categoryPeixaria },
  { name: "Mercearia da Avó", slug: "mercearia-da-avo", category: "Mercearias", rating: 4.3, deliveryTime: "20-30 min", zone: "Talatona", featured: false, image: categoryMercearia },
  { name: "Mercearia Central", slug: "mercearia-central", category: "Mercearias", rating: 4.1, deliveryTime: "15-25 min", zone: "Talatona", featured: false, image: categoryMercearia },
  { name: "Super Luanda", slug: "super-luanda", category: "Supermercados", rating: 4.7, deliveryTime: "35-50 min", zone: "Talatona", featured: true, image: categorySupermercado },
  { name: "Maxi Plus", slug: "maxi-plus", category: "Supermercados", rating: 4.2, deliveryTime: "40-55 min", zone: "Talatona", featured: false, image: categorySupermercado },
];

const categoryImages: Record<string, string> = {
  talhos: categoryTalho, peixarias: categoryPeixaria, mercearias: categoryMercearia,
  restaurantes: categoryRestaurante, supermercados: categorySupermercado,
};

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const categoryName = categorySlug ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1) : "";
  const stores = allStores.filter((s) => s.category.toLowerCase() === categorySlug?.toLowerCase());
  const heroImage = categorySlug ? categoryImages[categorySlug.toLowerCase()] : undefined;

  return (
    <>
      <div className="relative h-40 md:h-52 overflow-hidden">
        {heroImage && <img src={heroImage} alt={categoryName} className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-primary/30" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <Link to="/categorias" className="inline-flex items-center gap-1 text-primary-foreground/70 hover:text-primary-foreground text-sm font-body mb-2 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Categorias
            </Link>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">{categoryName}</h1>
            <p className="text-primary-foreground/70 font-body mt-1">{stores.length} lojas em Talatona</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-10">
        {stores.length === 0 ? (
          <div className="text-center py-16"><p className="text-muted-foreground font-body text-lg">Nenhuma loja encontrada nesta categoria.</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store, i) => (
              <Link key={store.slug} to={`/loja/${store.slug}`} className="animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
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
