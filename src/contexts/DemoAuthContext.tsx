import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export type DemoRole = "client" | "store" | "logistics" | "admin" | null;

interface DemoUser {
  name: string;
  email: string;
  role: DemoRole;
}

interface DemoAuthContextType {
  demoUser: DemoUser | null;
  demoLogin: (role: DemoRole) => void;
  demoLogout: () => void;
  isDemoMode: boolean;
}

const DemoAuthContext = createContext<DemoAuthContextType>({
  demoUser: null,
  demoLogin: () => {},
  demoLogout: () => {},
  isDemoMode: false,
});

export const useDemoAuth = () => useContext(DemoAuthContext);

const DEMO_ACCOUNTS: Record<string, DemoUser> = {
  client: { name: "Maria Silva", email: "maria@demo.ao", role: "client" },
  store: { name: "João Loja", email: "joao@demo.ao", role: "store" },
  logistics: { name: "Pedro Entrega", email: "pedro@demo.ao", role: "logistics" },
  admin: { name: "Ana Admin", email: "ana@demo.ao", role: "admin" },
};

export const getDemoAccounts = () => DEMO_ACCOUNTS;

export const DemoAuthProvider = ({ children }: { children: ReactNode }) => {
  const [demoUser, setDemoUser] = useState<DemoUser | null>(() => {
    const saved = localStorage.getItem("demo_user");
    return saved ? JSON.parse(saved) : null;
  });

  const demoLogin = (role: DemoRole) => {
    if (!role) return;
    const user = DEMO_ACCOUNTS[role];
    setDemoUser(user);
    localStorage.setItem("demo_user", JSON.stringify(user));
  };

  const demoLogout = () => {
    setDemoUser(null);
    localStorage.removeItem("demo_user");
  };

  return (
    <DemoAuthContext.Provider value={{ demoUser, demoLogin, demoLogout, isDemoMode: !!demoUser }}>
      {children}
    </DemoAuthContext.Provider>
  );
};
