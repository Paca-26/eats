import { useAuth } from "@/contexts/AuthContext";
import { useDemoAuth } from "@/contexts/DemoAuthContext";

export const useDisplayUser = () => {
  const { user } = useAuth();
  const { demoUser } = useDemoAuth();

  const name = user?.user_metadata?.full_name || demoUser?.name || "Utilizador";
  const email = user?.email || demoUser?.email || "";
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return { name, email, initials };
};
