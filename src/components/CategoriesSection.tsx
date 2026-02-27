import categoryTalho from "@/assets/category-talho.jpg";
import categoryPeixaria from "@/assets/category-peixaria.jpg";
import categoryMercearia from "@/assets/category-mercearia.jpg";
import categoryRestaurante from "@/assets/category-restaurante.jpg";
import categorySupermercado from "@/assets/category-supermercado.jpg";

const categories = [
  { name: "Talhos", image: categoryTalho, count: 8 },
  { name: "Peixarias", image: categoryPeixaria, count: 5 },
  { name: "Mercearias", image: categoryMercearia, count: 12 },
  { name: "Restaurantes", image: categoryRestaurante, count: 6 },
  { name: "Supermercados", image: categorySupermercado, count: 4 },
];

const CategoriesSection = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Categorias
        </h2>
        <p className="text-muted-foreground mt-2 font-body">
          Encontre tudo o que precisa na sua zona
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {categories.map((cat, i) => (
          <button
            key={cat.name}
            className="group relative rounded-2xl overflow-hidden aspect-square shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in cursor-pointer"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-primary-foreground">
              <h3 className="font-display text-lg font-semibold">{cat.name}</h3>
              <p className="text-sm text-primary-foreground/70 font-body">{cat.count} lojas</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
