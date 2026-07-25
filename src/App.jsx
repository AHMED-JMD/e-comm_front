import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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
import Profile from "./pages/Profile";
import GoogleAuthCallback from "./pages/GoogleAuthCallback";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext";
import AdminPortal from "./pages/AdminPortal";
import AdminRoute from "./components/AdminRoute";
import AdminStores from "./pages/AdminStores";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminReports from "./pages/AdminReports";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
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
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route
                    path="/auth/google/callback"
                    element={<GoogleAuthCallback />}
                  />
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminPortal />
                      </AdminRoute>
                    }
                  >
                    <Route
                      index
                      element={<Navigate to="/admin/stores" replace />}
                    />
                    <Route path="stores" element={<AdminStores />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="reports" element={<AdminReports />} />
                  </Route>
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
