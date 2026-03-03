import { Mail, Phone, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const ContactoPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Mensagem enviada", description: "Entraremos em contacto brevemente." });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Mail className="h-12 w-12 mx-auto mb-4 text-accent" />
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Contacte-nos</h1>
            <p className="text-primary-foreground/70 font-body max-w-lg mx-auto">
              Estamos aqui para ajudar. Envie-nos uma mensagem ou utilize os nossos canais directos.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h2 className="font-display text-xl font-bold text-foreground mb-2">Enviar Mensagem</h2>
            <Input placeholder="Nome completo" required className="font-body" />
            <Input placeholder="Email" type="email" required className="font-body" />
            <Input placeholder="Assunto" required className="font-body" />
            <textarea
              placeholder="A sua mensagem..."
              required
              rows={5}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
            <Button type="submit" disabled={loading} className="w-full gap-2">
              <Send className="h-4 w-4" />
              {loading ? "A enviar..." : "Enviar Mensagem"}
            </Button>
          </motion.form>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-2">Informações</h2>
            {[
              { icon: MapPin, label: "Morada", value: "Talatona, Luanda Sul, Angola" },
              { icon: Phone, label: "Telefone", value: "+244 923 000 000" },
              { icon: Mail, label: "Email", value: "geral@asap.ao" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-border">
                <item.icon className="h-6 w-6 text-accent mt-0.5" />
                <div>
                  <span className="font-display font-semibold text-foreground text-sm">{item.label}</span>
                  <p className="text-muted-foreground font-body text-sm">{item.value}</p>
                </div>
              </div>
            ))}

            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <p className="text-sm font-body text-muted-foreground">
                <strong className="text-foreground">Horário de atendimento:</strong><br />
                Segunda a Sexta: 08h00 – 18h00<br />
                Sábado: 08h00 – 13h00
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactoPage;
