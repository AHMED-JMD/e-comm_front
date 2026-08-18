import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiMapPin, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import apiClient, { extractApiError } from "../utils/api";
import { DELIVERY_CITIES } from "../utils/cities";

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

  /* Saved shipping details — checkout prefills itself from these. */
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [isSavingShipping, setIsSavingShipping] = useState(false);
  const [shippingMessage, setShippingMessage] = useState(null);
  const [shippingForm, setShippingForm] = useState({
    shippingCity: user?.shippingCity || "",
    shippingAddress: user?.shippingAddress || "",
  });

  useEffect(() => {
    setForm({
      name: user?.name || "",
      phone: user?.phone || "",
    });
    setShippingForm({
      shippingCity: user?.shippingCity || "",
      shippingAddress: user?.shippingAddress || "",
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

  const handleShippingChange = (event) => {
    const { name, value } = event.target;
    setShippingForm((previous) => ({ ...previous, [name]: value }));
    setShippingMessage(null);
  };

  const saveShipping = async (payload) => {
    try {
      setIsSavingShipping(true);
      const { data } = await apiClient.put("/auth/shipping-info", payload);

      if (data?.user) {
        updateUser(data.user);
      }

      setIsEditingShipping(false);
      return data;
    } catch (error) {
      setShippingMessage({
        type: "error",
        text: extractApiError(error, "تعذر حفظ بيانات الشحن"),
      });
      return null;
    } finally {
      setIsSavingShipping(false);
    }
  };

  const handleShippingSubmit = async (event) => {
    event.preventDefault();

    const shippingAddress = shippingForm.shippingAddress.trim();

    if (shippingAddress.length < 10) {
      setShippingMessage({
        type: "error",
        text: "يرجى إدخال عنوان تفصيلي (الحي، الشارع، أقرب علامة مميزة).",
      });
      return;
    }

    const saved = await saveShipping({
      shippingAddress,
      shippingCity: shippingForm.shippingCity,
    });

    if (saved) {
      setShippingMessage({ type: "success", text: "تم حفظ عنوان الشحن" });
    }
  };

  const handleShippingClear = async () => {
    const saved = await saveShipping({
      shippingAddress: "",
      shippingCity: "",
    });

    if (saved) {
      setShippingForm({ shippingCity: "", shippingAddress: "" });
      setShippingMessage({ type: "success", text: "تم حذف عنوان الشحن المحفوظ" });
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

        {/* Saved shipping details, reused to prefill checkout */}
        <div className="card shadow-2xl mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center">
                <FiMapPin size={20} />
              </span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">عنوان الشحن</h2>
                <p className="text-sm text-gray-500">
                  يُستخدم لتعبئة بيانات الشحن تلقائياً عند إتمام الطلب.
                </p>
              </div>
            </div>

            {!isEditingShipping && (
              <button
                type="button"
                onClick={() => {
                  setShippingMessage(null);
                  setIsEditingShipping(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-blue-600/30 text-blue-700 font-bold text-sm hover:bg-blue-50 transition-colors"
              >
                <FiEdit2 size={15} />
                {user?.shippingAddress ? "تعديل" : "إضافة عنوان"}
              </button>
            )}
          </div>

          {shippingMessage && (
            <div
              className={`mb-4 p-3 rounded-2xl text-sm font-bold ${
                shippingMessage.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {shippingMessage.text}
            </div>
          )}

          {isEditingShipping ? (
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="shippingCity"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  المدينة
                </label>
                <select
                  id="shippingCity"
                  name="shippingCity"
                  value={shippingForm.shippingCity}
                  onChange={handleShippingChange}
                  className="input-field"
                >
                  <option value="">اختر المدينة</option>
                  {DELIVERY_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="shippingAddress"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  العنوان التفصيلي
                </label>
                <textarea
                  id="shippingAddress"
                  name="shippingAddress"
                  rows={3}
                  value={shippingForm.shippingAddress}
                  onChange={handleShippingChange}
                  className="input-field !rounded-2xl"
                  placeholder="الحي، الشارع، رقم المنزل، أقرب علامة مميزة"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isSavingShipping}
                  className="btn-primary !py-2.5 !px-5 text-sm"
                >
                  {isSavingShipping ? "جاري الحفظ..." : "حفظ العنوان"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingShipping(false);
                    setShippingMessage(null);
                    setShippingForm({
                      shippingCity: user?.shippingCity || "",
                      shippingAddress: user?.shippingAddress || "",
                    });
                  }}
                  disabled={isSavingShipping}
                  className="px-5 py-2.5 rounded-full border-2 border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors disabled:opacity-60"
                >
                  إلغاء
                </button>
              </div>
            </form>
          ) : user?.shippingAddress ? (
            <div className="p-4 rounded-2xl bg-gray-50 space-y-2">
              <p className="text-sm text-gray-500">
                المدينة:{" "}
                <span className="font-bold text-gray-900">
                  {user.shippingCity || "غير محددة"}
                </span>
              </p>
              <p className="text-gray-900 font-semibold leading-relaxed">
                {user.shippingAddress}
              </p>
              <button
                type="button"
                onClick={handleShippingClear}
                disabled={isSavingShipping}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors disabled:opacity-60"
              >
                <FiTrash2 size={13} />
                حذف العنوان المحفوظ
              </button>
            </div>
          ) : (
            <p className="p-4 rounded-2xl bg-gray-50 text-gray-500 text-sm">
              لا يوجد عنوان محفوظ بعد. أضف عنوانك ليتم تعبئته تلقائياً في كل طلب.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
