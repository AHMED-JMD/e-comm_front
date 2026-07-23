import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4 py-12">
        <div className="card shadow-2xl w-full max-w-xl text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            الملف الشخصي
          </h1>
          <p className="text-gray-600 mb-6">يجب تسجيل الدخول أولاً.</p>
          <Link
            to="/login"
            className="inline-block px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="card shadow-2xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            الملف الشخصي
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">الاسم</p>
              <p className="text-lg font-semibold text-gray-900">
                {user?.name || "-"}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">البريد الإلكتروني</p>
              <p className="text-lg font-semibold text-gray-900">
                {user?.email || "-"}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">رقم الهاتف</p>
              <p className="text-lg font-semibold text-gray-900">
                {user?.phone || "-"}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">نوع الحساب</p>
              <p className="text-lg font-semibold text-gray-900">
                {user?.role || "buyer"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
