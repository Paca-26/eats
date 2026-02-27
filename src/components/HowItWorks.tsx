import { Truck, ShoppingBag, CreditCard, Shield } from "lucide-react";

const features = [
  {
    icon: ShoppingBag,
    title: "Multi-Loja",
    description: "Compre de várias lojas no mesmo pedido.",
  },
  {
    icon: CreditCard,
    title: "Pagamento Único",
    description: "Pague tudo de uma vez, sem complicações.",
  },
  {
    icon: Truck,
    title: "Entrega por K",
    description: "Logística centralizada e eficiente.",
  },
  {
    icon: Shield,
    title: "Seguro & Confiável",
    description: "Plataforma segura para lojas e clientes.",
  },
];

const HowItWorks = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Como Funciona
        </h2>
        <p className="text-muted-foreground mt-2 font-body">
          Simples, rápido e conveniente
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feat, i) => (
          <div
            key={feat.title}
            className="text-center space-y-4 animate-fade-in"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <div className="mx-auto w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
              <feat.icon className="h-8 w-8 text-accent" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">{feat.title}</h3>
            <p className="text-muted-foreground font-body text-sm">{feat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
