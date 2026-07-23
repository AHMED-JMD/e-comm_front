import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiPhone, FiLock } from "react-icons/fi";
import apiClient, { API_BASE_URL } from "../utils/api";
import { useAuth } from "../context/AuthContext";

function extractBackendErrors(error) {
  const responseData = error.response?.data;

  if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
    return responseData.errors.reduce(
      (accumulator, currentError) => {
        if (currentError.path && !accumulator[currentError.path]) {
          accumulator[currentError.path] = currentError.msg;
        }
        return accumulator;
      },
      { submit: responseData.message || "Validation failed" },
    );
  }

  return {
    submit:
      responseData?.message || "حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.",
  };
}

export default function Login() {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleAuth = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = "البريد الإلكتروني أو رقم الهاتف مطلوب";
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      const { data } = await apiClient.post("/auth/login", {
        identifier: formData.identifier.trim(),
        password: formData.password,
      });

      // Store login info if remember me is checked
      if (rememberMe) {
        localStorage.setItem("userIdentifier", formData.identifier.trim());
      } else {
        localStorage.removeItem("userIdentifier");
      }

      login({ user: data.user, token: data.token });

      setRedirectMessage(
        "تم تسجيل الدخول بنجاح. سيتم تحويلك إلى الصفحة الرئيسية...",
      );
      setIsRedirecting(true);
      await new Promise((resolve) => window.setTimeout(resolve, 1500));
      navigate("/");
    } catch (error) {
      setErrors(extractBackendErrors(error));
    } finally {
      setIsLoading(false);
      setIsRedirecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">م</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="card shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
            أهلاً بعودتك
          </h1>
          <p className="text-center text-gray-600 mb-8">سجل دخولك للمتابعة</p>

          {/* Error Message */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm text-center">
                {errors.submit}
              </p>
            </div>
          )}

          {redirectMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm text-center">
                {redirectMessage}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email / Phone Field */}
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                البريد الإلكتروني أو رقم الهاتف
              </label>
              <div className="relative">
                <FiPhone
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  id="identifier"
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  placeholder="name@example.com / 01012345678"
                  className={`input-field pr-10 ${errors.identifier ? "border-red-500 focus:ring-red-500" : ""}`}
                />
              </div>
              {errors.identifier && (
                <p className="text-red-500 text-xs mt-2">{errors.identifier}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                كلمة المرور
              </label>
              <div className="relative">
                <FiLock
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`input-field pr-10 ${errors.password ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-2">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">تذكرني</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                هل نسيت كلمة المرور؟
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isRedirecting}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading || isRedirecting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>
                    {isRedirecting ? "جاري تحويلك..." : "جاري التحميل..."}
                  </span>
                </>
              ) : (
                <span>دخول</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">أو</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="btn-outline flex items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-600"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="hidden sm:inline text-sm">جوجل</span>
            </button>
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-600">
            ليس لديك حساب؟{" "}
            <Link
              to="/register"
              className="text-blue-600 font-bold hover:text-blue-700"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </div>

        {/* Security Message */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-sm text-blue-700">
            🔒 بياناتك آمنة معنا. نستخدم أعلى مستويات التشفير
          </p>
        </div>
      </div>
    </div>
  );
}
