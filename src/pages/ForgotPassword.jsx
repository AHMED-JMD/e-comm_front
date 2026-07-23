import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import apiClient from "../utils/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "البريد الإلكتروني غير صالح";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const { data } = await apiClient.post("/auth/forgot-password", {
        email: email.trim(),
      });

      setSuccessMessage(
        data.message ||
          "إذا كان البريد الإلكتروني مسجلاً، فسيصلك رابط إعادة التعيين.",
      );
      setEmail("");
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.message ||
          "تعذر إرسال رابط إعادة التعيين. حاول مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
            نسيت كلمة المرور
          </h1>
          <p className="text-center text-gray-600 mb-8">
            أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
          </p>

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm text-center">
                {errors.submit}
              </p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm text-center">
                {successMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                البريد الإلكتروني
              </label>
              <div className="relative">
                <FiMail
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (errors.email || errors.submit) {
                      setErrors((prev) => ({
                        ...prev,
                        email: "",
                        submit: "",
                      }));
                    }
                  }}
                  placeholder="name@example.com"
                  className={`input-field pr-10 ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-2">{errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>جاري الإرسال...</span>
                </>
              ) : (
                <span>إرسال رابط إعادة التعيين</span>
              )}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            تذكرت كلمة المرور؟{" "}
            <Link
              to="/login"
              className="text-blue-600 font-bold hover:text-blue-700"
            >
              العودة إلى تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
