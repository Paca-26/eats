import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DemoAuthProvider } from "@/contexts/DemoAuthContext";
import { CartProvider } from "@/contexts/CartContext";
import MainLayout from "@/components/MainLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";
import StorePage from "./pages/StorePage";
import CategoriesPage from "./pages/CategoriesPage";
import SearchPage from "./pages/SearchPage";
import ClientDashboard from "./pages/ClientDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import LogisticsDashboard from "./pages/LogisticsDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AjudaPage from "./pages/AjudaPage";
import ContactoPage from "./pages/ContactoPage";
import TermosPage from "./pages/TermosPage";
import PrivacidadePage from "./pages/PrivacidadePage";
import PromocoesPage from "./pages/PromocoesPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <DemoAuthProvider>
            <CartProvider>
              <Routes>
                {/* Pages with shared Navbar + MobileBottomNav */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/carrinho" element={<CartPage />} />
                  <Route path="/categorias" element={<CategoriesPage />} />
                  <Route path="/pesquisar" element={<SearchPage />} />
                  <Route path="/categoria/:categorySlug" element={<CategoryPage />} />
                  <Route path="/loja/:storeSlug" element={<StorePage />} />
                  <Route path="/ajuda" element={<AjudaPage />} />
                  <Route path="/contacto" element={<ContactoPage />} />
                  <Route path="/termos" element={<TermosPage />} />
                  <Route path="/privacidade" element={<PrivacidadePage />} />
                  <Route path="/promocoes" element={<PromocoesPage />} />
                  <Route path="/esqueci-senha" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                </Route>

                {/* Dashboard pages (own navigation) */}
                <Route path="/cliente" element={<ClientDashboard />} />
                <Route path="/vendedor" element={<VendorDashboard />} />
                <Route path="/logistica" element={<LogisticsDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </CartProvider>
          </DemoAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
