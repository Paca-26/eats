import { Shield } from "lucide-react";
import { motion } from "framer-motion";

const sections = [
  { title: "1. Dados Recolhidos", content: "Recolhemos informações necessárias para o funcionamento do serviço: nome, email, telefone, morada de entrega e histórico de pedidos. Não recolhemos dados sensíveis desnecessários." },
  { title: "2. Utilização dos Dados", content: "Os seus dados são utilizados exclusivamente para: processar pedidos, melhorar a experiência na plataforma, comunicar actualizações de pedidos e enviar promoções (com o seu consentimento)." },
  { title: "3. Partilha de Dados", content: "Partilhamos dados limitados com parceiros logísticos (morada de entrega) e lojas (detalhes do pedido) estritamente necessários para a prestação do serviço. Nunca vendemos dados pessoais a terceiros." },
  { title: "4. Segurança", content: "Utilizamos encriptação SSL, armazenamento seguro e práticas de segurança actualizadas para proteger os seus dados contra acessos não autorizados." },
  { title: "5. Cookies", content: "Utilizamos cookies essenciais para o funcionamento da plataforma e cookies analíticos para melhorar o serviço. Pode gerir as suas preferências de cookies nas definições do navegador." },
  { title: "6. Direitos do Utilizador", content: "Tem o direito de aceder, rectificar ou eliminar os seus dados pessoais a qualquer momento. Para exercer estes direitos, contacte-nos através de privacidade@mmm.ao." },
  { title: "7. Retenção de Dados", content: "Mantemos os seus dados enquanto a sua conta estiver activa. Após eliminação da conta, os dados são removidos no prazo de 30 dias, excepto quando exigido por lei." },
  { title: "8. Alterações", content: "Esta política pode ser actualizada periodicamente. Notificaremos os utilizadores sobre alterações significativas por email ou notificação na plataforma." },
];

const PrivacidadePage = () => (
  <div className="min-h-screen bg-background">
    <section className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Shield className="h-12 w-12 mx-auto mb-4 text-accent" />
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Política de Privacidade</h1>
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

export default PrivacidadePage;
