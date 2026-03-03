import { Tag, Clock, Percent } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const promos = [
  { title: "20% em Frescos", desc: "Frutas, legumes e verduras com desconto em supermercados seleccionados.", badge: "Supermercados", color: "bg-green-500/10 text-green-700", expires: "Válido até 15 Mar" },
  { title: "Entrega Grátis", desc: "Primeira encomenda sem custos de entrega. Use o código ASAP1.", badge: "Novos Clientes", color: "bg-blue-500/10 text-blue-700", expires: "Sem prazo" },
  { title: "Combo Familiar", desc: "Pacote de carne + peixe + acompanhamentos por 8.500 Kz.", badge: "Talhos & Peixarias", color: "bg-red-500/10 text-red-700", expires: "Válido até 20 Mar" },
  { title: "Almoço a 1.500 Kz", desc: "Pratos do dia em restaurantes parceiros com preço especial.", badge: "Restaurantes", color: "bg-amber-500/10 text-amber-700", expires: "Seg–Sex, 11h–14h" },
  { title: "Compre 3, Pague 2", desc: "Em produtos de mercearia seleccionados. Desconto aplicado automaticamente.", badge: "Mercearias", color: "bg-purple-500/10 text-purple-700", expires: "Válido até 31 Mar" },
  { title: "10% com Multicaixa Express", desc: "Pagamentos via Multicaixa Express têm desconto adicional de 10%.", badge: "Todos", color: "bg-accent/10 text-accent", expires: "Março inteiro" },
];

const PromocoesPage = () => (
  <div className="min-h-screen bg-background">
    <section className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Percent className="h-12 w-12 mx-auto mb-4 text-accent" />
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Promoções</h1>
          <p className="text-primary-foreground/70 font-body max-w-lg mx-auto">
            As melhores ofertas dos nossos parceiros, actualizadas semanalmente.
          </p>
        </motion.div>
      </div>
    </section>

    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {promos.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="group border border-border rounded-2xl p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-accent" />
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.color}`}>{p.badge}</span>
            </div>
            <h3 className="font-display text-lg font-bold text-foreground mb-1">{p.title}</h3>
            <p className="text-muted-foreground font-body text-sm mb-3">{p.desc}</p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {p.expires}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link to="/categorias" className="text-accent font-body text-sm hover:underline">
          ← Voltar às categorias
        </Link>
      </div>
    </div>
  </div>
);

export default PromocoesPage;
