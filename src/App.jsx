import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Browse from "./pages/Browse";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import GoogleAuthCallback from "./pages/GoogleAuthCallback";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { legacyAdminPathToDashboard } from "./utils/host";
import Spinner from "./components/Spinner";
import "./index.css";

/**
 * The dashboard moved to its own subdomain, so bookmarks and old links to
 * `/admin/...` bounce across instead of 404-ing.
 */
function AdminRedirect() {
  const location = useLocation();

  useEffect(() => {
    window.location.replace(legacyAdminPathToDashboard(location.pathname));
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <Spinner className="w-9 h-9 border-4 border-blue-200 border-t-blue-600" />
      <p className="text-sm text-gray-500 font-bold">
        جاري تحويلك إلى لوحة التحكم…
      </p>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div
            dir="rtl"
            className="flex flex-col min-h-screen bg-white"
            style={{ direction: "rtl" }}
          >
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/account" element={<Account />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/contact" element={<Contact />} />
                <Route
                  path="/auth/google/callback"
                  element={<GoogleAuthCallback />}
                />
                <Route path="/admin/*" element={<AdminRedirect />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
