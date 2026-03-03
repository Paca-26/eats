import { FileText } from "lucide-react";
import { motion } from "framer-motion";

const sections = [
  { title: "1. Aceitação dos Termos", content: "Ao aceder e utilizar a plataforma asap, o utilizador aceita e concorda em cumprir estes Termos e Condições de Utilização. Caso não concorde com alguma disposição, deve cessar imediatamente a utilização da plataforma." },
  { title: "2. Descrição do Serviço", content: "A asap é uma plataforma digital de marketplace alimentar que conecta consumidores a supermercados, talhos, peixarias, mercearias e restaurantes em Angola. Actuamos como intermediários, facilitando a compra e entrega de produtos alimentares." },
  { title: "3. Registo e Conta", content: "Para utilizar determinados serviços, é necessário criar uma conta com informações verídicas e actualizadas. O utilizador é responsável pela confidencialidade das suas credenciais de acesso." },
  { title: "4. Pedidos e Pagamentos", content: "Os preços apresentados incluem impostos aplicáveis. O custo de entrega é calculado com base na distância e apresentado antes da confirmação do pedido. Aceitamos Multicaixa Express, transferência bancária e pagamento na entrega." },
  { title: "5. Entregas", content: "Os prazos de entrega são estimativas e podem variar conforme a localização, trânsito e disponibilidade. A asap não se responsabiliza por atrasos causados por factores externos." },
  { title: "6. Cancelamentos e Devoluções", content: "Pedidos podem ser cancelados até 5 minutos após a confirmação. Produtos perecíveis não são elegíveis para devolução, excepto em caso de defeito comprovado." },
  { title: "7. Propriedade Intelectual", content: "Todo o conteúdo da plataforma, incluindo logótipos, textos e imagens, é propriedade da asap ou dos seus parceiros e está protegido por direitos de autor." },
  { title: "8. Alterações aos Termos", content: "A asap reserva-se o direito de alterar estes termos a qualquer momento. As alterações entram em vigor após publicação na plataforma." },
];

const TermosPage = () => (
  <div className="min-h-screen bg-background">
    <section className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <FileText className="h-12 w-12 mx-auto mb-4 text-accent" />
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Termos e Condições</h1>
          <p className="text-primary-foreground/70 font-body text-sm">Última actualização: Março 2026</p>
        </motion.div>
      </div>
    </section>

    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="space-y-8">
        {sections.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <h2 className="font-display text-lg font-bold text-foreground mb-2">{s.title}</h2>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">{s.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default TermosPage;
