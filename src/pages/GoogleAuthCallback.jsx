import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function GoogleAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setErrorMessage("تعذر تسجيل الدخول عبر Google. حاول مرة أخرى.");
      return;
    }

    const completeGoogleLogin = async () => {
      try {
        const { data } = await apiClient.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        login({ user: data.user, token });
        navigate("/");
      } catch {
        setErrorMessage("فشل إتمام تسجيل الدخول عبر Google. حاول مرة أخرى.");
      }
    };

    void completeGoogleLogin();
  }, [login, navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4 py-12">
      <div className="card shadow-2xl w-full max-w-md text-center">
        {errorMessage ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              تعذر تسجيل الدخول
            </h1>
            <p className="text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              {errorMessage}
            </p>
            <Link
              to="/login"
              className="inline-block px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              العودة إلى تسجيل الدخول
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              جاري تسجيل الدخول
            </h1>
            <p className="text-gray-600 mb-5">
              يتم الآن إتمام تسجيل الدخول عبر Google...
            </p>
            <div className="mx-auto animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </>
        )}
      </div>
    </div>
  );
}
