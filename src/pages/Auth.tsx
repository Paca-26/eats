import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import logoMo from "@/assets/logo-mo-alimenta.jpg";
import { Eye, EyeOff, ArrowLeft, ShoppingBag, Store, Truck } from "lucide-react";
import { Link } from "react-router-dom";

const roleOptions = [
  { value: "client", label: "Cliente", description: "Comprar produtos e fazer encomendas", icon: ShoppingBag },
  { value: "store", label: "Vendedor", description: "Gerir a minha loja e vender produtos", icon: Store },
  { value: "logistics", label: "Logística", description: "Fazer entregas e gerir rotas", icon: Truck },
] as const;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("client");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // Get user role and redirect accordingly
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: roles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)
            .single();
          
          const role = roles?.role || "client";
          toast({ title: "Bem-vindo de volta!" });
          
          if (role === "admin") navigate("/admin");
          else if (role === "store") navigate("/vendedor");
          else if (role === "logistics") navigate("/logistica");
          else navigate("/");
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, role: selectedRole },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({
          title: "Conta criada!",
          description: "Verifique o seu email para confirmar a conta.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative items-center justify-center">
        <div className="text-center space-y-6 p-12">
          <img src={logoMo} alt="Mo Alimenta" className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-accent/30" />
          <h2 className="font-display text-4xl font-bold text-primary-foreground">
            Mo Alimenta
          </h2>
          <p className="text-primary-foreground/70 font-body text-lg max-w-md">
            O Shopping Digital Alimentar de Angola. Compre de várias lojas e receba tudo numa única entrega.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm">
            <ArrowLeft className="h-4 w-4" />
            Voltar à página inicial
          </Link>

          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              {isLogin ? "Entrar" : "Criar Conta"}
            </h1>
            <p className="text-muted-foreground mt-2 font-body">
              {isLogin
                ? "Aceda à sua conta Mo Alimenta"
                : "Junte-se ao maior marketplace alimentar de Angola"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground font-body">Nome Completo</label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="O seu nome"
                    required={!isLogin}
                    className="mt-1"
                  />
                </div>

                {/* Role Selection */}
                <div>
                  <label className="text-sm font-medium text-foreground font-body">Tipo de Conta</label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {roleOptions.map((role) => {
                      const Icon = role.icon;
                      const isSelected = selectedRole === role.value;
                      return (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setSelectedRole(role.value)}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            isSelected
                              ? "border-accent bg-accent/10 text-foreground"
                              : "border-border bg-card text-muted-foreground hover:border-accent/40"
                          }`}
                        >
                          <Icon className={`h-6 w-6 mx-auto mb-1 ${isSelected ? "text-accent" : ""}`} />
                          <span className="text-xs font-semibold block">{role.label}</span>
                          <span className="text-[10px] leading-tight block mt-0.5 opacity-70">{role.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-sm font-medium text-foreground font-body">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
                required
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground font-body">Palavra-passe</label>
              <div className="relative mt-1">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full py-6 font-semibold"
            >
              {loading ? "A processar..." : isLogin ? "Entrar" : "Criar Conta"}
            </Button>
          </form>

          <div className="text-center font-body text-sm">
            <span className="text-muted-foreground">
              {isLogin ? "Não tem conta? " : "Já tem conta? "}
            </span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-accent hover:underline font-medium"
            >
              {isLogin ? "Criar conta" : "Entrar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
