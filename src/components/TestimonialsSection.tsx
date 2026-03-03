import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Luísa Fernandes",
    location: "Talatona",
    text: "Incrível! Fiz compras de 3 lojas diferentes e recebi tudo numa só entrega. Nunca foi tão fácil.",
    rating: 5,
    avatar: "LF",
  },
  {
    name: "Carlos Mendes",
    location: "Kilamba",
    text: "A qualidade dos produtos do talho é excelente. Carne sempre fresca e entrega super rápida!",
    rating: 5,
    avatar: "CM",
  },
  {
    name: "Ana Baptista",
    location: "Viana",
    text: "Uso toda semana para encomendar do restaurante e do supermercado. O pagamento único é muito prático.",
    rating: 4,
    avatar: "AB",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="bg-muted py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-accent font-body font-semibold text-sm uppercase tracking-wider">Testemunhos</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-2">
            O Que Dizem os Nossos Clientes
          </h2>
          <p className="text-muted-foreground mt-3 font-body max-w-md mx-auto">
            Milhares de famílias angolanas já confiam em nós
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="bg-card rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 relative border border-border group hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Quote className="absolute top-6 right-6 h-10 w-10 text-accent/10 group-hover:text-accent/20 transition-colors" />
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent/80 to-accent flex items-center justify-center font-display font-bold text-accent-foreground text-lg shadow-lg shadow-accent/20">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-display font-bold text-foreground text-lg">{t.name}</p>
                  <p className="text-sm text-muted-foreground font-body">{t.location}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">"{t.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
