import { Link } from "react-router-dom";
import heroFood from "@/assets/hero-food.jpg";
import logoCircle from "@/assets/logo-mo-circle.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroFood} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
      </div>

      <div className="relative container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 text-primary-foreground space-y-6 animate-fade-in">
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            O Shopping Digital
            <br />
            <span className="text-accent">Alimentar</span> de Angola
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-lg font-body">
            Supermercados, talhos, peixarias e restaurantes — tudo num só lugar.
            Compre de várias lojas e receba numa única entrega.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/categoria/restaurantes">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 py-6 text-base font-semibold gap-2">
                Explorar Lojas <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#como-funciona">
              <Button variant="outline" className="rounded-full px-8 py-6 text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Como Funciona
              </Button>
            </a>
          </div>
        </div>

        <div className="hidden md:block">
          <img
            src={logoCircle}
            alt="Mo Alimenta"
            className="w-48 h-48 lg:w-64 lg:h-64 rounded-full shadow-2xl border-4 border-accent/30 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
