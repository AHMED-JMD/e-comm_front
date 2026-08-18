import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiLock,
  FiSave,
  FiLogOut,
  FiCheckCircle,
  FiAlertCircle,
  FiCalendar,
  FiHome,
  FiBox,
  FiShoppingCart,
  FiLayers,
  FiStar,
} from "react-icons/fi";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/useAdmin";
import apiClient, { extractApiError } from "../utils/api";
import { formatDate, getInitials } from "../utils/validators";

function InfoRow({ Icon, label, value, dir }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/70">
      <span className="w-9 h-9 shrink-0 rounded-xl bg-white border border-gray-100 text-blue-600 flex items-center justify-center">
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-semibold text-gray-900 break-words" dir={dir}>
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function MiniStat({ Icon, label, value, gradient }) {
  return (
    <div className="p-4 rounded-2xl border border-gray-100 bg-white flex items-center gap-3">
      <span
        className={`w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center`}
      >
        <Icon size={17} />
      </span>
      <div>
        <p className="text-xl font-display font-black text-gray-900 leading-tight">
          {value}
        </p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}

/** The admin's own account: profile details, edit form and password change. */
export default function AdminAccount() {
  const { user, updateUser, logout } = useAuth();
  const {
    stores,
    categories,
    productPagination,
    orderPagination,
    reviewsPagination,
  } = useAdmin();

  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);

  useEffect(() => {
    setProfileForm({ name: user?.name || "", phone: user?.phone || "" });
  }, [user]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileMessage(null);

    const name = profileForm.name.trim();
    const phone = profileForm.phone.trim();

    if (!name) {
      setProfileMessage({ type: "error", text: "الاسم مطلوب." });
      return;
    }

    if (!/^[0-9]{10,15}$/.test(phone)) {
      setProfileMessage({
        type: "error",
        text: "رقم الهاتف يجب أن يكون من 10 إلى 15 رقماً.",
      });
      return;
    }

    try {
      setIsSavingProfile(true);
      const { data } = await apiClient.put("/auth/profile", { name, phone });

      if (data?.user) {
        updateUser(data.user);
      }

      setProfileMessage({ type: "success", text: "تم تحديث بياناتك بنجاح." });
    } catch (error) {
      setProfileMessage({
        type: "error",
        text: extractApiError(error, "تعذر تحديث البيانات."),
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordMessage(null);

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "كلمتا المرور غير متطابقتين.",
      });
      return;
    }

    try {
      setIsSavingPassword(true);
      await apiClient.put("/auth/password", {
        currentPassword: passwordForm.currentPassword || undefined,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordMessage({
        type: "success",
        text: "تم تغيير كلمة المرور بنجاح.",
      });
    } catch (error) {
      setPasswordMessage({
        type: "error",
        text: extractApiError(error, "تعذر تغيير كلمة المرور."),
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const renderMessage = (message) =>
    message ? (
      <p
        className={`p-3 rounded-2xl text-sm font-medium inline-flex items-center gap-2 w-full ${
          message.type === "success"
            ? "bg-green-50 text-green-700"
            : "bg-red-50 text-red-700"
        }`}
      >
        {message.type === "success" ? (
          <FiCheckCircle className="shrink-0" />
        ) : (
          <FiAlertCircle className="shrink-0" />
        )}
        {message.text}
      </p>
    ) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">حسابي</h1>
        <p className="text-sm text-gray-500 mt-1">
          بيانات حساب المدير وإعدادات الأمان.
        </p>
      </div>

      {/* Identity */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-blue-600 to-purple-600 text-white p-6">
        <span className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10" />

        <div className="relative flex flex-wrap items-center gap-5">
          <span className="w-20 h-20 rounded-3xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center text-3xl font-display font-black">
            {getInitials(user?.name || "؟")}
          </span>

          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-display font-black break-words">
              {user?.name}
            </h2>
            <p className="text-white/80 text-sm mb-2">{user?.email}</p>
            <div className="flex flex-wrap gap-2">
              <span className="badge-pill bg-white/15 border border-white/25">
                <FiShield size={13} />
                مدير المنصة
              </span>
              {user?.isVerified && (
                <span className="badge-pill bg-white/15 border border-white/25">
                  <FiCheckCircle size={13} />
                  حساب موثق
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/15 border border-white/30 font-bold text-sm hover:bg-white/25 transition-colors"
          >
            <FiLogOut />
            تسجيل الخروج
          </button>
        </div>
      </section>

      {/* Platform snapshot */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <MiniStat
          Icon={FiShoppingCart}
          label="طلب"
          value={orderPagination?.totalItems || 0}
          gradient="from-blue-600 to-purple-600"
        />
        <MiniStat
          Icon={FiBox}
          label="منتج"
          value={productPagination?.totalItems || 0}
          gradient="from-green-500 to-emerald-600"
        />
        <MiniStat
          Icon={FiHome}
          label="متجر"
          value={stores.length}
          gradient="from-amber-400 to-orange-500"
        />
        <MiniStat
          Icon={FiLayers}
          label="قسم"
          value={categories.length}
          gradient="from-pink-500 to-rose-500"
        />
        <MiniStat
          Icon={FiStar}
          label="تقييم"
          value={reviewsPagination?.totalItems || 0}
          gradient="from-teal-500 to-cyan-600"
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account details + edit */}
        <section className="rounded-3xl border border-gray-100 bg-white p-5 space-y-4">
          <h3 className="font-bold text-gray-900">بيانات الحساب</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoRow Icon={FiMail} label="البريد الإلكتروني" value={user?.email} />
            <InfoRow
              Icon={FiPhone}
              label="رقم الهاتف"
              value={user?.phone}
              dir="ltr"
            />
            <InfoRow
              Icon={FiShield}
              label="طريقة الدخول"
              value={user?.provider === "google" ? "حساب Google" : "بريد وكلمة مرور"}
            />
            <InfoRow
              Icon={FiCalendar}
              label="تاريخ الإنشاء"
              value={user?.createdAt ? formatDate(user.createdAt) : "—"}
            />
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-3 pt-2">
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                الاسم
              </label>
              <div className="relative">
                <FiUser className="absolute top-1/2 -translate-y-1/2 right-4 text-blue-500" />
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(event) =>
                    setProfileForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  className="input-field pr-11"
                  placeholder="اسم المدير"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                رقم الهاتف
              </label>
              <div className="relative">
                <FiPhone className="absolute top-1/2 -translate-y-1/2 right-4 text-blue-500" />
                <input
                  type="tel"
                  inputMode="numeric"
                  value={profileForm.phone}
                  onChange={(event) =>
                    setProfileForm((previous) => ({
                      ...previous,
                      phone: event.target.value,
                    }))
                  }
                  className="input-field pr-11"
                  placeholder="09xxxxxxxx"
                />
              </div>
            </div>

            {renderMessage(profileMessage)}

            <button
              type="submit"
              disabled={isSavingProfile}
              className="btn-primary w-full inline-flex items-center justify-center gap-2"
            >
              {isSavingProfile ? <Spinner /> : <FiSave />}
              {isSavingProfile ? "جاري الحفظ..." : "حفظ البيانات"}
            </button>
          </form>
        </section>

        {/* Password */}
        <section className="rounded-3xl border border-gray-100 bg-white p-5 space-y-4 h-fit">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 text-white flex items-center justify-center">
              <FiLock size={18} />
            </span>
            <div>
              <h3 className="font-bold text-gray-900">الأمان</h3>
              <p className="text-xs text-gray-500">
                غيّر كلمة مرور حسابك بشكل دوري.
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                كلمة المرور الحالية
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(event) =>
                  setPasswordForm((previous) => ({
                    ...previous,
                    currentPassword: event.target.value,
                  }))
                }
                className="input-field"
                placeholder="••••••"
                autoComplete="current-password"
              />
              {user?.provider === "google" && (
                <p className="mt-2 text-xs text-gray-500">
                  حسابك مسجل عبر Google — اتركها فارغة إذا لم تضع كلمة مرور من
                  قبل.
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                كلمة المرور الجديدة
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(event) =>
                  setPasswordForm((previous) => ({
                    ...previous,
                    newPassword: event.target.value,
                  }))
                }
                className="input-field"
                placeholder="6 أحرف على الأقل"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(event) =>
                  setPasswordForm((previous) => ({
                    ...previous,
                    confirmPassword: event.target.value,
                  }))
                }
                className="input-field"
                placeholder="أعد كتابة كلمة المرور"
                autoComplete="new-password"
              />
            </div>

            {renderMessage(passwordMessage)}

            <button
              type="submit"
              disabled={isSavingPassword}
              className="btn-secondary w-full inline-flex items-center justify-center gap-2"
            >
              {isSavingPassword ? <Spinner /> : <FiLock />}
              {isSavingPassword ? "جاري التغيير..." : "تغيير كلمة المرور"}
            </button>
          </form>

          <Link
            to="/account"
            className="btn-outline w-full block text-center !py-2.5 text-sm"
          >
            عرض طلباتي كمشترٍ
          </Link>
        </section>
      </div>
    </div>
  );
}
