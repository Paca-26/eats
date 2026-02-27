import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import logoMo from "@/assets/logo-mo-alimenta.jpg";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
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
        toast({ title: "Bem-vindo de volta!" });
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
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
