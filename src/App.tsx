import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import StorePage from "./pages/StorePage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import ResetPassword from "./pages/ResetPassword";
import VendorDashboard from "./pages/VendorDashboard";
import LogisticsDashboard from "./pages/LogisticsDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/loja/:storeSlug" element={<StorePage />} />
            <Route path="/categoria/:categorySlug" element={<CategoryPage />} />
            <Route path="/carrinho" element={<CartPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/vendedor" element={<VendorDashboard />} />
            <Route path="/logistica" element={<LogisticsDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
