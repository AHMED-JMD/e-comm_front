import { Navigate } from "react-router-dom";
import { FiLock, FiLogOut, FiExternalLink } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { storeUrl } from "../utils/host";

/**
 * Guards the dashboard. Signed-out visitors go to the dashboard's own login
 * screen; signed-in buyers get an explanation instead of a redirect loop,
 * since the storefront now lives on a different host.
 */
export default function AdminRoute({ children }) {
  const { isLoggedIn, user, logout } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center card !p-8">
          <span className="w-16 h-16 mx-auto mb-5 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center">
            <FiLock size={28} />
          </span>

          <h1 className="text-xl font-display font-black text-gray-900 mb-2">
            لا تملك صلاحية الدخول
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            حسابك ({user?.email}) ليس حساب إدارة. سجّل الدخول بحساب مدير أو عد
            إلى المتجر لمتابعة التسوق.
          </p>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={logout}
              className="btn-primary w-full !rounded-2xl"
            >
              <FiLogOut className="ml-2" size={16} />
              تسجيل الخروج والدخول بحساب آخر
            </button>

            <a
              href={storeUrl("/")}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-gray-700 border-2 border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <FiExternalLink size={16} />
              العودة إلى المتجر
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
