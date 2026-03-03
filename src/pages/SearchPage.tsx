import { useState } from "react";
import { Link } from "react-router-dom";
import StoreCard from "@/components/StoreCard";
import { Search } from "lucide-react";
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

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const filtered = query.trim()
    ? allStores.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.category.toLowerCase().includes(query.toLowerCase()))
    : [];

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
      {query.trim() === "" ? (
        <div className="text-center py-16">
          <Search className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground font-body">Digite para pesquisar lojas e produtos.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground font-body">Nenhum resultado para "{query}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((store) => (
            <Link key={store.slug} to={`/loja/${store.slug}`}>
              <StoreCard {...store} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
