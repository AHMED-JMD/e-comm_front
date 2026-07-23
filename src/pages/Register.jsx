import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock, FiUser, FiPhone } from "react-icons/fi";
import apiClient, { API_BASE_URL } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState("");
  const [registrationType, setRegistrationType] = useState("buyer"); // buyer or seller
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleAuth = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "الاسم الكامل مطلوب";
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "الاسم يجب أن يكون 3 أحرف على الأقل";
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (!/^[0-9]{10,}$/.test(formData.phone.replace(/[\s\-]/g, ""))) {
      newErrors.phone = "رقم الهاتف يجب أن يكون 10 أرقام على الأقل";
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 8) {
      newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "كلمة المرور يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "تأكيد كلمة المرور مطلوب";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمات المرور غير متطابقة";
    }

    if (!agreeTerms) {
      newErrors.terms = "يجب الموافقة على الشروط والأحكام";
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      const { data } = await apiClient.post("/auth/register", {
        role: "buyer",
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
      });

      login({ user: data.user, token: data.token });

      setRedirectMessage(
        "تم إنشاء الحساب بنجاح. سيتم تحويلك إلى الصفحة الرئيسية...",
      );
      setIsRedirecting(true);
      await new Promise((resolve) => window.setTimeout(resolve, 1500));
      navigate("/");
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.message ||
          "حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
      setIsRedirecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">م</span>
          </div>
        </div>

        {/* Registration Card */}
        <div className="card shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
            إنشاء حساب جديد
          </h1>
          <p className="text-center text-gray-600 mb-8">
            انضم إلى منصتنا وابدأ التجارة الآن
          </p>

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

          {/* Registration Type Selection */}
          <div className="mb-8 grid grid-cols-1 gap-4">
            <button
              type="button"
              onClick={() => setRegistrationType("buyer")}
              className={`p-4 rounded-lg border-2 transition-all font-medium text-center ${
                registrationType === "buyer"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-300 bg-white text-gray-700 hover:border-blue-300"
              }`}
            >
              👤 مشتري
            </button>
            {/* <button
              type="button"
              onClick={() => setRegistrationType("seller")}
              className={`p-4 rounded-lg border-2 transition-all font-medium text-center ${
                registrationType === "seller"
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-gray-300 bg-white text-gray-700 hover:border-green-300"
              }`}
            >
              🏪 بائع
            </button> */}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                الاسم الكامل
              </label>
              <div className="relative">
                <FiUser
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="محمد أحمد"
                  className={`input-field pr-10 ${errors.fullName ? "border-red-500 focus:ring-red-500" : ""}`}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-2">{errors.fullName}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@example.com"
                className={`input-field ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-2">{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                رقم الهاتف
              </label>
              <div className="relative">
                <FiPhone
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="01012345678"
                  className={`input-field pr-10 ${errors.phone ? "border-red-500 focus:ring-red-500" : ""}`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-2">{errors.phone}</p>
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
                  placeholder="••••••••••"
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
              <p className="text-xs text-gray-500 mt-2">
                يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام (8 أحرف على الأقل)
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <FiLock
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••••"
                  className={`input-field pr-10 ${errors.confirmPassword ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="pt-4 border-t border-gray-200">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (e.target.checked && errors.terms) {
                      setErrors((prev) => ({
                        ...prev,
                        terms: "",
                      }));
                    }
                  }}
                  className="w-5 h-5 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    أوافق على{" "}
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      الشروط والأحكام
                    </a>{" "}
                    و{" "}
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      سياسة الخصوصية
                    </a>
                  </p>
                </div>
              </label>
              {errors.terms && (
                <p className="text-red-500 text-xs mt-2">{errors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isRedirecting}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading || isRedirecting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>
                    {isRedirecting ? "جاري تحويلك..." : "جاري الإنشاء..."}
                  </span>
                </>
              ) : (
                <span>إنشاء الحساب</span>
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

          {/* Social Registration */}
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

          {/* Login Link */}
          <p className="text-center text-gray-600">
            هل لديك حساب بالفعل؟{" "}
            <Link
              to="/login"
              className="text-blue-600 font-bold hover:text-blue-700"
            >
              سجل الدخول
            </Link>
          </p>
        </div>

        {/* Info Box */}
        {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg shadow text-center">
            <div className="text-3xl mb-2">✨</div>
            <p className="text-sm text-gray-600">إنشاء حساب مجاني وآمن</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow text-center">
            <div className="text-3xl mb-2">🚀</div>
            <p className="text-sm text-gray-600">ابدأ البيع والشراء فوراً</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow text-center">
            <div className="text-3xl mb-2">🛡️</div>
            <p className="text-sm text-gray-600">حماية كاملة للبيانات</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
