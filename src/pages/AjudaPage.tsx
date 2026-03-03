import { HelpCircle, MessageCircle, Phone, Mail, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const faqs = [
  { q: "Como faço um pedido?", a: "Navegue pelas categorias ou pesquise o produto desejado. Adicione ao carrinho e finalize o pedido com o método de pagamento preferido." },
  { q: "Qual o prazo de entrega?", a: "As entregas em Luanda são realizadas entre 30 minutos a 2 horas, dependendo da localização e disponibilidade do produto." },
  { q: "Posso cancelar um pedido?", a: "Sim, pode cancelar até 5 minutos após a confirmação. Depois disso, contacte o nosso suporte." },
  { q: "Quais métodos de pagamento aceitam?", a: "Aceitamos Multicaixa Express, transferência bancária, pagamento na entrega e cartões Visa/Mastercard." },
  { q: "Como me torno vendedor na plataforma?", a: "Aceda à secção 'Vender na Plataforma' e preencha o formulário de registo. A nossa equipa entrará em contacto em 24 horas." },
  { q: "Existe valor mínimo de pedido?", a: "O valor mínimo varia por loja, mas geralmente é de 2.000 Kz." },
];

const AjudaPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <HelpCircle className="h-12 w-12 mx-auto mb-4 text-accent" />
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Centro de Ajuda</h1>
            <p className="text-primary-foreground/70 font-body max-w-lg mx-auto">
              Encontre respostas rápidas às suas dúvidas ou entre em contacto connosco.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* FAQ */}
        <h2 className="font-display text-2xl font-bold mb-6 text-foreground">Perguntas Frequentes</h2>
        <div className="space-y-3 mb-12">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left font-body font-medium text-foreground hover:bg-muted/50 transition-colors"
              >
                {faq.q}
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4 text-sm text-muted-foreground font-body">{faq.a}</div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Contact cards */}
        <h2 className="font-display text-2xl font-bold mb-6 text-foreground">Ainda precisa de ajuda?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: MessageCircle, label: "Chat ao Vivo", desc: "Resposta em minutos" },
            { icon: Phone, label: "+244 923 000 000", desc: "Seg–Sex, 8h–18h" },
            { icon: Mail, label: "suporte@asap.ao", desc: "Resposta em 24h" },
          ].map((c, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-xl border border-border hover:shadow-md transition-shadow">
              <c.icon className="h-8 w-8 text-accent mb-3" />
              <span className="font-display font-semibold text-foreground">{c.label}</span>
              <span className="text-xs text-muted-foreground font-body mt-1">{c.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AjudaPage;
