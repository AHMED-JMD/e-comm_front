import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext";
import { ToastProvider } from "./components/Toast";
import AdminLayout from "./components/AdminLayout";
import AdminRoute from "./components/AdminRoute";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminStores from "./pages/AdminStores";
import AdminCategories from "./pages/AdminCategories";
import AdminUsers from "./pages/AdminUsers";
import AdminReviews from "./pages/AdminReviews";
import AdminReports from "./pages/AdminReports";
import AdminAccount from "./pages/AdminAccount";
import "./index.css";

/**
 * Dashboard application, served from the admin subdomain. It shares the auth
 * context and the design system with the storefront but keeps its own router,
 * chrome and sign-in screen.
 */
export default function AdminApp() {
  return (
    <AuthProvider>
      <AdminProvider>
        <ToastProvider>
          <Router>
            <div dir="rtl" style={{ direction: "rtl" }}>
              <Routes>
                <Route path="/login" element={<AdminLogin />} />

                <Route
                  path="/"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="stores" element={<AdminStores />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="reports" element={<AdminReports />} />
                  <Route path="account" element={<AdminAccount />} />
                </Route>

                {/* Legacy /admin/* links from the single-app era. */}
                <Route path="/admin/*" element={<LegacyAdminRedirect />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </ToastProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

function LegacyAdminRedirect() {
  const suffix = window.location.pathname.replace(/^\/admin\/?/, "");
  return <Navigate to={`/${suffix}`} replace />;
}
