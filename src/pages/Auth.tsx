import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logoMo from "@/assets/logo-mo-alimenta.jpg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Mail, Lock, Eye, EyeOff, LogIn, UserPlus, ShoppingBag, Store, Truck
} from "lucide-react";



const roleOptions = [
  { value: "client", label: "Cliente", icon: ShoppingBag, desc: "Comprar produtos e fazer encomendas" },
  { value: "store", label: "Vendedor", icon: Store, desc: "Vender produtos na plataforma" },
  { value: "logistics", label: "Transportador", icon: Truck, desc: "Gerir entregas e rotas" },
];

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [role, setRole] = useState("client");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Fetch user role from user_roles
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", authData.user.id)
          .single();

        toast({ title: "Login efetuado com sucesso!" });

        const roleRoute: Record<string, string> = {
          client: "/cliente",
          store: "/vendedor",
          logistics: "/logistica",
          admin: "/admin",
        };
        navigate(roleRoute[roleData?.role ?? "client"] ?? "/cliente");
      } else {
        if (password !== confirmPassword) {
          throw new Error("As senhas não coincidem");
        }
        if (!acceptTerms) {
          throw new Error("Você deve aceitar os termos e condições");
        }

        const { data: signUpData, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              phone: phone,
              role: role
            },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;

        toast({
          title: "Conta criada!",
          description: "Bem-vindo ao Mmm! Pode agora configurar a sua conta.",
        });

        // Auto-login logic: if signUp was successful, navigate to the dashboard
        if (signUpData.user) {
          const roleRoute: Record<string, string> = {
            client: "/cliente",
            store: "/vendedor",
            logistics: "/logistica",
            admin: "/admin",
          };
          navigate(roleRoute[role] ?? "/cliente");
        }
      }
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
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md space-y-6"
      >
        {/* Logo & Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4, type: "spring", stiffness: 200 }}
            className="relative inline-block mb-5"
          >
            <div className="absolute -inset-3 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-xl animate-pulse" />
            <img src={logoMo} alt="Mmm" className="relative h-18 w-18 rounded-2xl object-cover shadow-lg ring-4 ring-background" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-3xl font-bold text-foreground leading-tight"
          >
            {isLogin ? "Bem-vindo de volta" : "Criar conta"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground mt-2 font-body text-sm"
          >
            {isLogin ? "Entre na sua conta para continuar" : "Registe-se para começar a usar o Mmm"}
          </motion.p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          onSubmit={handleSubmit}
          className="space-y-4 bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                key="name"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <label className="text-sm font-body font-medium text-foreground mb-1.5 block">Nome completo</label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="O seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 rounded-xl h-11 bg-background"
                    required={!isLogin}
                  />
                </div>
              </motion.div>
            )}
            {!isLogin && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3"
              >
                <label className="text-sm font-body font-medium text-foreground mb-1.5 block">Número de telefone</label>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rotate-0" />
                  <Input
                    type="tel"
                    placeholder="9XX XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 rounded-xl h-11 bg-background"
                    required={!isLogin}
                  />
                </div>
              </motion.div>
            )}
            {!isLogin && (
              <motion.div
                key="role"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3"
              >
                <label className="text-sm font-body font-medium text-foreground mb-2 block">Tipo de conta</label>
                <div className="grid grid-cols-3 gap-2">
                  {roleOptions.map((opt) => {
                    const Icon = opt.icon;
                    const selected = role === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setRole(opt.value)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${selected
                          ? "border-accent bg-accent/10 shadow-sm"
                          : "border-border bg-background hover:border-accent/30"
                          }`}
                      >
                        <Icon className={`h-5 w-5 ${selected ? "text-accent" : "text-muted-foreground"}`} />
                        <span className={`text-xs font-body font-semibold ${selected ? "text-accent" : "text-foreground"}`}>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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

          <div>
            <label className="text-sm font-body font-medium text-foreground mb-1.5 block">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 rounded-xl h-11 bg-background"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-body font-medium text-foreground mb-1.5 block">Confirmar Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 rounded-xl h-11 bg-background"
                    required={!isLogin}
                    minLength={6}
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                  required={!isLogin}
                />
                <label htmlFor="terms" className="text-xs font-body text-muted-foreground leading-normal">
                  Ao criar conta, aceito os <button type="button" className="text-accent hover:underline">termos e condições</button> e a <button type="button" className="text-accent hover:underline">política de privacidade</button>.
                </label>
              </div>
            </motion.div>
          )}

          {isLogin && (
            <div className="text-right">
              <button type="button" onClick={() => navigate("/esqueci-senha")} className="text-xs font-body text-accent hover:underline">
                Esqueceu a senha?
              </button>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold text-sm gap-2"
          >
            {isLogin ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            {loading ? "A processar..." : isLogin ? "Entrar" : "Criar Conta"}
          </Button>

          <div className="text-center pt-1">
            <span className="text-sm text-muted-foreground font-body">
              {isLogin ? "Não tem conta? " : "Já tem conta? "}
            </span>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-body font-semibold text-accent hover:underline"
            >
              {isLogin ? "Registe-se" : "Entrar"}
            </button>
          </div>
        </motion.form>


      </motion.div>
    </div>
  );
};

export default Auth;
