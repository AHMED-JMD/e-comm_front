import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiUser,
  FiShield,
  FiAlertCircle,
  FiExternalLink,
} from "react-icons/fi";
import apiClient, { extractApiError } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { storeUrl } from "../utils/host";
import Spinner from "../components/Spinner";
import Logo, { LogoMark } from "../components/Logo";

const HIGHLIGHTS = [
  "متابعة الطلبات وتحديث حالتها لحظياً",
  "إدارة المتاجر والمنتجات والأقسام",
  "إدارة حسابات المستخدمين وصلاحياتهم",
];

/**
 * The dashboard lives on its own subdomain, so it needs its own sign-in screen
 * instead of bouncing admins to the storefront's login page.
 */
export default function AdminLogin() {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.identifier.trim() || !formData.password) {
      setError("أدخل البريد الإلكتروني أو رقم الهاتف وكلمة المرور");
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await apiClient.post("/auth/login", {
        identifier: formData.identifier.trim(),
        password: formData.password,
      });

      // Buyers have valid credentials but no business being in the dashboard.
      if (data.user?.role !== "admin") {
        logout();
        setError("هذا الحساب لا يملك صلاحية الدخول إلى لوحة التحكم.");
        return;
      }

      login({ user: data.user, token: data.token });
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(
        extractApiError(
          requestError,
          "تعذر تسجيل الدخول. تأكد من البيانات وحاول مرة أخرى.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas bg-mesh-soft flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 rounded-4xl overflow-hidden shadow-glow-lg border border-black/[0.04] bg-white">
        {/* Brand panel */}
        <div className="relative hidden lg:flex flex-col justify-between p-10 bg-mesh-hero bg-[length:200%_200%] animate-gradient-x text-white">
          <div className="blob w-72 h-72 bg-white/20 -top-16 -left-10" />

          <div className="relative flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center">
              <LogoMark height={20} tone="onDark" />
            </span>
            <div>
              <Logo height={19} tone="onDark" showArabic={false} showTagline={false} />
              <p className="text-white/60 text-xs font-bold mt-0.5">
                لوحة التحكم
              </p>
            </div>
          </div>

          <div className="relative">
            <h2 className="text-3xl font-display font-black mb-4 leading-snug">
              كل ما تحتاجه لإدارة المنصة
              <br />
              في مكان واحد
            </h2>

            <ul className="space-y-3">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-white/85">
                  <span className="w-6 h-6 shrink-0 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center text-xs">
                    ✓
                  </span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <a
            href={storeUrl("/")}
            className="relative inline-flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white transition-colors"
          >
            <FiExternalLink size={15} />
            الذهاب إلى المتجر
          </a>
        </div>

        {/* Form panel */}
        <div className="bg-white p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-8">
            <span className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4">
              <FiShield size={26} />
            </span>
            <h1 className="text-2xl font-display font-black text-gray-900 mb-1">
              تسجيل دخول الإدارة
            </h1>
            <p className="text-sm text-gray-500">
              هذه المنطقة مخصصة لمدراء المنصة فقط.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-2xl bg-red-50 border border-red-100 text-sm text-red-700 animate-fade-up">
              <FiAlertCircle className="shrink-0 mt-0.5" />
              <span className="font-bold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                البريد الإلكتروني أو رقم الهاتف
              </label>
              <div className="relative">
                <FiUser className="absolute top-1/2 -translate-y-1/2 right-4 text-pink-500" />
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  value={formData.identifier}
                  onChange={handleChange}
                  className="input-field pr-11"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                كلمة المرور
              </label>
              <div className="relative">
                <FiLock className="absolute top-1/2 -translate-y-1/2 right-4 text-pink-500" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pr-11 pl-11"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 hover:text-pink-600 transition-colors"
                  aria-label={
                    showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                  }
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full !rounded-2xl"
            >
              {isLoading ? (
                <>
                  <Spinner className="w-4 h-4 border-2 border-white/40 border-t-white ml-2" />
                  جاري الدخول…
                </>
              ) : (
                "دخول لوحة التحكم"
              )}
            </button>
          </form>

          <a
            href={storeUrl("/forgot-password")}
            className="mt-5 text-center text-sm font-bold text-pink-600 hover:text-pink-700"
          >
            نسيت كلمة المرور؟
          </a>

          <a
            href={storeUrl("/")}
            className="lg:hidden mt-3 text-center text-sm font-bold text-gray-500 hover:text-gray-700"
          >
            الذهاب إلى المتجر
          </a>
        </div>
      </div>
    </div>
  );
}
