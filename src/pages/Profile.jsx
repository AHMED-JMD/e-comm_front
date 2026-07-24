import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../utils/api";

export default function Profile() {
  const { user, isLoggedIn, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    setForm({
      name: user?.name || "",
      phone: user?.phone || "",
    });
  }, [user]);

  const startEditing = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setForm({
      name: user?.name || "",
      phone: user?.phone || "",
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setForm({
      name: user?.name || "",
      phone: user?.phone || "",
    });
    setIsEditing(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const name = form.name.trim();
    const phone = form.phone.trim();

    if (!name) {
      setErrorMessage("الاسم مطلوب");
      return;
    }

    if (!/^[0-9]{10,15}$/.test(phone)) {
      setErrorMessage("رقم الهاتف يجب أن يكون من 10 إلى 15 رقمًا");
      return;
    }

    try {
      setIsSaving(true);
      const response = await apiClient.put("/auth/profile", {
        name,
        phone,
      });

      if (response.data?.user) {
        updateUser(response.data.user);
      }

      setSuccessMessage("تم تحديث الملف الشخصي بنجاح");
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "حدث خطأ أثناء تحديث الملف الشخصي",
      );
    } finally {
      setIsSaving(false);
    }
  };

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center sm:text-right">
              الملف الشخصي
            </h1>

            {!isEditing ? (
              <button
                type="button"
                onClick={startEditing}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                تعديل الملف الشخصي
              </button>
            ) : null}
          </div>

          {errorMessage ? (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm">
              {successMessage}
            </div>
          ) : null}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="mb-8 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  الاسم
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل الاسم"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  رقم الهاتف
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل رقم الهاتف"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-60"
                >
                  {isSaving ? "جاري الحفظ..." : "حفظ التعديلات"}
                </button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 disabled:opacity-60"
                >
                  إلغاء
                </button>
              </div>
            </form>
          ) : null}

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
