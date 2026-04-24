import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import Index from "./pages/Index";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CheckoutPage from "./pages/CheckoutPage";
import AccountPage from "./pages/AccountPage";
import TailorMadePage from "./pages/TailorMadePage";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminTailoring from "./pages/admin/AdminTailoring";

const queryClient = new QueryClient();

const StorefrontLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    <CartDrawer />
    <main className="min-h-screen">{children}</main>
    <Footer />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Admin routes — protected, only accessible by URL */}
              <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="tailoring" element={<AdminTailoring />} />
                <Route path="coupons" element={<AdminCoupons />} />
              </Route>

              {/* Auth routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Storefront routes */}
              <Route path="/" element={<StorefrontLayout><Index /></StorefrontLayout>} />
              <Route path="/shop" element={<StorefrontLayout><ShopPage /></StorefrontLayout>} />
              <Route path="/product/:id" element={<StorefrontLayout><ProductPage /></StorefrontLayout>} />
              <Route path="/tailor-made" element={<StorefrontLayout><TailorMadePage /></StorefrontLayout>} />
              <Route path="/checkout" element={<StorefrontLayout><CheckoutPage /></StorefrontLayout>} />
              <Route path="/account" element={<StorefrontLayout><AccountPage /></StorefrontLayout>} />
              <Route path="*" element={<StorefrontLayout><NotFound /></StorefrontLayout>} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
