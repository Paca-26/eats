import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroFood from "@/assets/hero-food.jpg";
import logoCircle from "@/assets/logo-mo-circle.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Rocket, Star } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center">
      <div className="absolute inset-0">
        <img src={heroFood} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/75 to-primary/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 right-[15%] w-20 h-20 rounded-full bg-accent/10 blur-2xl"
        animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />

      <motion.div
        className="absolute bottom-32 right-[25%] w-32 h-32 rounded-full bg-accent/8 blur-3xl"
        animate={{ y: [0, 15, 0], scale: [1, 0.9, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }} />


      <div className="relative container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 text-primary-foreground space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>





          </motion.div>

          <motion.h1
            className="font-display text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}>

            O Shopping Digital
            <br />
            <span className="text-accent relative">
              Alimentar
              <motion.span
                className="absolute -bottom-2 left-0 h-1 bg-accent/40 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 1 }} />

            </span>{" "}
            de Angola
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-primary-foreground/80 max-w-lg font-body leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}>

            Supermercados, talhos, peixarias e restaurantes — tudo num só lugar.
            Compre de várias lojas e receba numa única entrega.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}>

            <Link to="/categorias">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10 py-7 text-base font-semibold gap-2 shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 hover:scale-[1.02]">
                Explorar Lojas <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="#como-funciona">
              <Button variant="outline" className="rounded-full px-10 py-7 text-base border-primary-foreground/20 text-primary-foreground bg-primary-foreground/5 backdrop-blur-sm hover:bg-primary-foreground/15 transition-all duration-300">
                Como Funciona
              </Button>
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="flex items-center gap-6 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}>

            <div className="flex -space-x-2">
              {["MS", "JC", "AP", "LF"].map((initials, i) =>
                <div key={i} className="w-9 h-9 rounded-full bg-accent/80 border-2 border-primary flex items-center justify-center text-[10px] font-bold text-accent-foreground">
                  {initials}
                </div>
              )}
            </div>
            <div>
              <p className="text-primary-foreground/90 text-sm font-body font-semibold">12K+ clientes satisfeitos</p>
              <div className="flex items-center gap-1 text-accent text-xs">
                {Array.from({ length: 5 }).map((_, i) =>
                  <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                )}
                <span className="text-primary-foreground/60 font-body ml-1">4.8/5</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="hidden md:flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.4, type: "spring" }}>

          <div className="relative">
            <div className="absolute -inset-4 bg-accent/20 rounded-full blur-2xl" />
            <img
              src={logoCircle}
              alt="Mmm"
              className="relative w-52 h-52 lg:w-72 lg:h-72 rounded-full shadow-2xl border-4 border-accent/30 object-cover" />

          </div>









        </motion.div>
      </div>
    </section>);

};

export default HeroSection;