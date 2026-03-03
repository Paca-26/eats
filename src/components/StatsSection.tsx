import { motion } from "framer-motion";
import { Store, Truck, Users, Star } from "lucide-react";
import { type LucideIcon } from "lucide-react";

const stats: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "35+", label: "Lojas Parceiras", icon: Store },
  { value: "5K+", label: "Entregas Feitas", icon: Truck },
  { value: "12K+", label: "Clientes Satisfeitos", icon: Users },
  { value: "4.8", label: "Avaliação Média", icon: Star },
];

const StatsSection = () => {
  return (
    <section className="bg-primary py-14 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent rounded-full blur-[100px]" />
      </div>
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="text-center bg-primary-foreground/5 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="mx-auto w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center mb-2">
                <s.icon className="h-5 w-5 text-accent" />
              </div>
              <p className="font-display text-3xl md:text-4xl font-bold text-accent">
                {s.value}
              </p>
              <p className="text-primary-foreground/70 font-body text-sm mt-1">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
