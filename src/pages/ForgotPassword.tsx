import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, Send, CheckCircle } from "lucide-react";
import logoMo from "@/assets/logo-mo-alimenta.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-6"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="relative inline-block mb-5"
          >
            <div className="absolute -inset-3 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-xl animate-pulse" />
            <img src={logoMo} alt="asap" className="relative h-18 w-18 rounded-2xl object-cover shadow-lg ring-4 ring-background" />
          </motion.div>
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-8 text-center space-y-4 shadow-sm"
          >
            <div className="mx-auto w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
              <CheckCircle className="h-7 w-7 text-accent" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">Email enviado!</h1>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              Enviámos um link de recuperação para <strong className="text-foreground">{email}</strong>. Verifique a sua caixa de entrada e siga as instruções.
            </p>
            <Link to="/auth">
              <Button variant="outline" className="rounded-xl gap-2 mt-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Login
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h1 className="font-display text-3xl font-bold text-foreground">Recuperar Senha</h1>
              <p className="text-muted-foreground mt-2 font-body text-sm">
                Introduza o seu email e enviaremos um link para redefinir a sua senha
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              onSubmit={handleSubmit}
              className="space-y-4 bg-card border border-border rounded-2xl p-6 shadow-sm"
            >
              <div>
                <label className="text-sm font-body font-medium text-foreground mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 rounded-xl h-11 bg-background"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold text-sm gap-2"
              >
                <Send className="h-4 w-4" />
                {loading ? "A enviar..." : "Enviar Link de Recuperação"}
              </Button>

              <div className="text-center pt-1">
                <Link to="/auth" className="text-sm font-body text-accent hover:underline inline-flex items-center gap-1">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Voltar ao Login
                </Link>
              </div>
            </motion.form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
