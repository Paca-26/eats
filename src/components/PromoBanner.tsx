import { Percent, Clock, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const PromoBanner = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/3 to-background" />
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent via-accent/90 to-accent/70 p-8 md:p-10 text-accent-foreground shadow-xl group hover:shadow-2xl transition-shadow duration-500"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute -right-10 -top-10 opacity-10">
              <Percent className="h-40 w-40" />
            </div>
            <motion.div
              className="absolute bottom-0 right-0 w-40 h-40 bg-accent-foreground/5 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-foreground/20 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold font-body">
                <Zap className="h-3.5 w-3.5" /> OFERTA LIMITADA
              </span>
              <h3 className="font-display text-3xl md:text-4xl font-bold leading-tight">
                Primeira Entrega
                <br />Grátis
              </h3>
              <p className="font-body text-accent-foreground/80 text-sm max-w-sm leading-relaxed">
                Registe-se hoje e receba a sua primeira encomenda sem custos de entrega.
              </p>
              <Link to="/auth">
                <Button className="mt-2 rounded-full bg-accent-foreground text-accent hover:bg-accent-foreground/90 font-semibold px-8 py-6 text-base gap-2 shadow-lg group-hover:scale-[1.02] transition-transform">
                  Registar Agora <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-forest-light p-8 md:p-10 text-primary-foreground shadow-xl group hover:shadow-2xl transition-shadow duration-500"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="absolute -right-10 -top-10 opacity-10">
              <Clock className="h-40 w-40" />
            </div>
            <motion.div
              className="absolute top-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            />
            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold font-body">
                <Clock className="h-3.5 w-3.5" /> TODOS OS DIAS
              </span>
              <h3 className="font-display text-3xl md:text-4xl font-bold leading-tight">
                Entrega em
                <br />45 Minutos
              </h3>
              <p className="font-body text-primary-foreground/70 text-sm max-w-sm leading-relaxed">
                A nossa rede de entregadores garante que recebe tudo fresquinho e rápido na sua zona.
              </p>
              <Link to="/categoria/restaurantes">
                <Button className="mt-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8 py-6 text-base gap-2 shadow-lg group-hover:scale-[1.02] transition-transform">
                  Explorar Lojas <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
