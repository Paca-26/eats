import { Truck, ShoppingBag, CreditCard, Shield } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: ShoppingBag,
    title: "Multi-Loja",
    description: "Compre de várias lojas no mesmo pedido.",
    step: "01",
  },
  {
    icon: CreditCard,
    title: "Pagamento Único",
    description: "Pague tudo de uma vez, sem complicações.",
    step: "02",
  },
  {
    icon: Truck,
    title: "Entrega por K",
    description: "Logística centralizada e eficiente.",
    step: "03",
  },
  {
    icon: Shield,
    title: "Seguro & Confiável",
    description: "Plataforma segura para lojas e clientes.",
    step: "04",
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="container mx-auto px-4 py-20">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="text-accent font-body font-semibold text-sm uppercase tracking-wider">Processo</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-2">
          Como Funciona
        </h2>
        <p className="text-muted-foreground mt-3 font-body max-w-md mx-auto">
          Simples, rápido e conveniente — em apenas 4 passos
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feat, i) => (
          <motion.div
            key={feat.title}
            className="relative text-center space-y-4 bg-card border border-border rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="absolute top-4 right-4 text-4xl font-display font-bold text-accent/10 group-hover:text-accent/20 transition-colors">
              {feat.step}
            </span>
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/15 to-accent/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <feat.icon className="h-8 w-8 text-accent" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground">{feat.title}</h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">{feat.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
