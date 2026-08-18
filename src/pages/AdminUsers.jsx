import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiUsers,
  FiUserPlus,
  FiUserCheck,
  FiShield,
  FiSlash,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiMail,
  FiPhone,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiShoppingBag,
  FiStar,
  FiCalendar,
  FiFilter,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import DataTable, {
  TablePagination,
  TableAction,
} from "../components/DataTable";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import Spinner from "../components/Spinner";
import { useToast } from "../components/Toast";
import { useAdmin } from "../context/useAdmin";
import { useAuth } from "../context/AuthContext";
import { ORDER_STATUS_META } from "../utils/orderStatus";
import { formatPrice, formatDate, getInitials } from "../utils/validators";

const ROLE_FILTERS = [
  { value: "all", label: "الكل" },
  { value: "buyer", label: "المشترون" },
  { value: "admin", label: "المدراء" },
];

const STATUS_FILTERS = [
  { value: "all", label: "كل الحالات" },
  { value: "active", label: "نشط" },
  { value: "blocked", label: "موقوف" },
];

const PROVIDER_FILTERS = [
  { value: "all", label: "كل طرق التسجيل" },
  { value: "local", label: "تسجيل مباشر" },
  { value: "google", label: "حساب جوجل" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث انضماماً" },
  { value: "oldest", label: "الأقدم انضماماً" },
  { value: "name", label: "الاسم (أ - ي)" },
  { value: "orders", label: "الأكثر طلباً" },
  { value: "spent", label: "الأعلى إنفاقاً" },
  { value: "recent_activity", label: "آخر نشاط شرائي" },
];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "buyer",
  isVerified: true,
};

function StatTile({ label, value, Icon, gradient, isLoading }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-black/[0.04] shadow-card p-4 flex items-center gap-3.5">
      <span
        className={`absolute -top-6 -left-6 w-20 h-20 rounded-full bg-gradient-to-br ${gradient} opacity-10`}
      />
      <span
        className={`relative w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-md`}
      >
        <Icon size={19} />
      </span>
      <div className="relative min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-xl font-display font-black text-gray-900 leading-none">
          {isLoading ? "—" : value}
        </p>
      </div>
    </div>
  );
}

function RoleBadge({ role }) {
  return role === "admin" ? (
    <span className="badge-pill bg-purple-50 text-purple-700">
      <FiShield size={12} />
      مدير
    </span>
  ) : (
    <span className="badge-pill bg-gray-100 text-gray-600">مشترٍ</span>
  );
}

function StatusBadge({ isActive }) {
  return isActive ? (
    <span className="badge-pill bg-green-50 text-green-700">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
      نشط
    </span>
  ) : (
    <span className="badge-pill bg-red-50 text-red-700">
      <FiSlash size={11} />
      موقوف
    </span>
  );
}

/** Lazily pulls a user's recent orders and reviews when their row is expanded. */
function UserDetailsPanel({ userId }) {
  const { fetchUserDetails } = useAdmin();
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;
    setDetails(null);
    setError("");

    fetchUserDetails(userId)
      .then((data) => {
        if (isCurrent) setDetails(data);
      })
      .catch((requestError) => {
        if (isCurrent) setError(requestError.message);
      });

    return () => {
      isCurrent = false;
    };
  }, [userId, fetchUserDetails]);

  if (error) {
    return <p className="text-sm text-red-600 font-bold">{error}</p>;
  }

  if (!details) {
    return (
      <div className="flex justify-center py-8">
        <Spinner className="w-7 h-7 border-4 border-pink-200 border-t-pink-600" />
      </div>
    );
  }

  const { recentOrders, recentReviews, ordersByStatus } = details;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div>
        <h4 className="text-sm font-black text-gray-700 mb-3 flex items-center gap-2">
          <FiShoppingBag className="text-pink-600" size={15} />
          آخر الطلبات
        </h4>

        {Object.keys(ordersByStatus || {}).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {Object.entries(ordersByStatus).map(([status, count]) => (
              <span
                key={status}
                className={`badge-pill border ${
                  ORDER_STATUS_META[status]?.badge ||
                  "bg-gray-100 text-gray-600 border-gray-200"
                }`}
              >
                {ORDER_STATUS_META[status]?.label || status}: {count}
              </span>
            ))}
          </div>
        )}

        {recentOrders.length === 0 ? (
          <p className="text-sm text-gray-400 py-3">لا توجد طلبات لهذا المستخدم.</p>
        ) : (
          <ul className="space-y-2">
            {recentOrders.map((order) => (
              <li
                key={order.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {order.store?.name} · {formatDate(order.createdAt)}
                  </p>
                </div>
                <span
                  className={`badge-pill border shrink-0 ${
                    ORDER_STATUS_META[order.status]?.badge ||
                    "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  {ORDER_STATUS_META[order.status]?.label || order.status}
                </span>
                <span className="text-sm font-black text-gray-900 shrink-0">
                  {formatPrice(Number(order.totalAmount || 0))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h4 className="text-sm font-black text-gray-700 mb-3 flex items-center gap-2">
          <FiStar className="text-amber-500" size={15} />
          آخر التقييمات
        </h4>

        {recentReviews.length === 0 ? (
          <p className="text-sm text-gray-400 py-3">لم يكتب أي تقييم بعد.</p>
        ) : (
          <ul className="space-y-2">
            {recentReviews.map((review) => (
              <li
                key={review.id}
                className="p-3 rounded-2xl bg-white border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-gray-900 truncate flex-1">
                    {review.product?.name}
                  </span>
                  <span className="badge-pill bg-amber-50 text-amber-700 shrink-0">
                    <FiStar size={11} />
                    {review.rating}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {review.comment}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function UserFormModal({ isOpen, mode, initialValues, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const isEdit = mode === "edit";

  useEffect(() => {
    if (isOpen) {
      setForm({ ...EMPTY_FORM, ...initialValues, password: "" });
      setError("");
      setShowPassword(false);
    }
  }, [isOpen, initialValues]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.name.trim().length < 3) {
      setError("الاسم يجب أن يكون 3 أحرف على الأقل");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError("البريد الإلكتروني غير صالح");
      return;
    }

    if (!/^[0-9]{9,15}$/.test(form.phone.trim())) {
      setError("رقم الهاتف يجب أن يتكون من أرقام فقط (9 إلى 15 رقم)");
      return;
    }

    if ((!isEdit || form.password) && form.password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    try {
      setIsSaving(true);
      await onSubmit(form);
      onClose();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSaving ? () => {} : onClose}
      title={isEdit ? "تعديل بيانات المستخدم" : "إضافة مستخدم جديد"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-2xl bg-red-50 border border-red-100 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              الاسم الكامل
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input-field"
              placeholder="مثال: أحمد محمد"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="input-field ltr text-left"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              رقم الهاتف
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="input-field ltr text-left"
              placeholder="0912345678"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              الصلاحية
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="input-field"
            >
              <option value="buyer">مشترٍ</option>
              <option value="admin">مدير المنصة</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            {isEdit ? "كلمة مرور جديدة (اختياري)" : "كلمة المرور"}
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              className="input-field pl-11"
              placeholder={isEdit ? "اتركها فارغة لعدم التغيير" : "8 أحرف على الأقل"}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 hover:text-pink-600 transition-colors"
              aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 cursor-pointer">
          <input
            type="checkbox"
            name="isVerified"
            checked={Boolean(form.isVerified)}
            onChange={handleChange}
            className="w-5 h-5 rounded-md accent-pink-600"
          />
          <span className="text-sm font-bold text-gray-700">
            حساب موثّق
            <span className="block text-xs font-medium text-gray-500">
              يظهر شارة التوثيق بجانب اسم المستخدم.
            </span>
          </span>
        </label>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary flex-1 !rounded-2xl"
          >
            {isSaving && (
              <Spinner className="w-4 h-4 border-2 border-white/40 border-t-white ml-2" />
            )}
            {isEdit ? "حفظ التعديلات" : "إضافة المستخدم"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-3 rounded-2xl font-bold text-gray-700 border-2 border-gray-200 hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function AdminUsers() {
  const {
    users,
    usersPagination,
    userStats,
    loadUsers,
    loadUserStats,
    addUser,
    updateUser,
    setUserStatus,
    deleteUser,
  } = useAdmin();
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState(searchParams.get("role") || "all");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [provider, setProvider] = useState("all");
  const [sort, setSort] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [pendingId, setPendingId] = useState(null);

  const [formModal, setFormModal] = useState({ isOpen: false, mode: "create" });
  const [confirm, setConfirm] = useState(null);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const query = useMemo(
    () => ({
      search: search.trim() || undefined,
      role,
      status,
      provider,
      sort,
      limit: usersPagination.limit || 10,
    }),
    [search, role, status, provider, sort, usersPagination.limit],
  );

  const fetchPage = useCallback(
    (page) => {
      setIsLoading(true);
      return loadUsers({ ...query, page })
        .catch((error) => toast.error(error?.message || "تعذر تحميل المستخدمين"))
        .finally(() => setIsLoading(false));
    },
    [loadUsers, query, toast],
  );

  // Filters restart the list at page 1; the debounce keeps typing cheap.
  useEffect(() => {
    const timeout = setTimeout(() => fetchPage(1), 300);
    return () => clearTimeout(timeout);
  }, [fetchPage]);

  // Keep shareable/bookmarkable filters in the URL.
  useEffect(() => {
    const next = new URLSearchParams();
    if (role !== "all") next.set("role", role);
    if (status !== "all") next.set("status", status);
    setSearchParams(next, { replace: true });
  }, [role, status, setSearchParams]);

  const activeFilterCount =
    (role !== "all" ? 1 : 0) +
    (status !== "all" ? 1 : 0) +
    (provider !== "all" ? 1 : 0) +
    (search.trim() ? 1 : 0);

  const resetFilters = () => {
    setSearch("");
    setRole("all");
    setStatus("all");
    setProvider("all");
    setSort("newest");
  };

  const handleCreate = async (form) => {
    await addUser(form);
    toast.success(`تمت إضافة ${form.name.trim()} بنجاح.`);
  };

  const handleUpdate = async (form) => {
    await updateUser({ id: formModal.user.id, ...form });
    toast.success("تم حفظ بيانات المستخدم.");
  };

  const askToggleStatus = (targetUser) => {
    const willBlock = targetUser.isActive;

    setConfirm({
      title: willBlock ? "إيقاف الحساب؟" : "إعادة تفعيل الحساب؟",
      message: willBlock
        ? `لن يتمكن ${targetUser.name} من تسجيل الدخول أو الشراء حتى يتم تفعيل الحساب مرة أخرى.`
        : `سيستعيد ${targetUser.name} إمكانية الدخول والشراء فوراً.`,
      confirmLabel: willBlock ? "إيقاف الحساب" : "تفعيل الحساب",
      tone: willBlock ? "warning" : "primary",
      action: async () => {
        await setUserStatus(targetUser.id, !targetUser.isActive);
        toast.success(willBlock ? "تم إيقاف الحساب." : "تم تفعيل الحساب.");
      },
    });
  };

  const askDelete = (targetUser) => {
    setConfirm({
      title: "حذف المستخدم نهائياً؟",
      message: `سيتم حذف حساب ${targetUser.name} وتقييماته. لا يمكن التراجع عن هذا الإجراء.`,
      confirmLabel: "حذف نهائياً",
      tone: "danger",
      action: async () => {
        await deleteUser(targetUser.id);
        toast.success("تم حذف المستخدم.");
      },
    });
  };

  const runConfirmedAction = async () => {
    if (!confirm) return;

    try {
      setIsConfirmLoading(true);
      await confirm.action();
      setConfirm(null);
    } catch (error) {
      toast.error(error?.message || "تعذر تنفيذ العملية");
      setConfirm(null);
    } finally {
      setIsConfirmLoading(false);
    }
  };

  const refresh = async () => {
    setPendingId("refresh");
    await Promise.all([
      fetchPage(usersPagination.page || 1),
      loadUserStats().catch(() => undefined),
    ]);
    setPendingId(null);
  };

  const columns = [
    {
      key: "user",
      header: "المستخدم",
      render: (row) => (
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`w-10 h-10 shrink-0 rounded-2xl text-white text-xs font-black flex items-center justify-center bg-gradient-to-br ${
              row.role === "admin"
                ? "from-purple-600 to-pink-500"
                : "from-blue-600 to-purple-600"
            } ${row.isActive ? "" : "opacity-40 grayscale"}`}
          >
            {getInitials(row.name || "؟")}
          </span>

          <div className="min-w-0">
            <p className="font-bold text-gray-900 truncate flex items-center gap-1.5">
              {row.name}
              {row.isVerified && (
                <FiCheckCircle
                  className="text-pink-500 shrink-0"
                  size={13}
                  title="حساب موثّق"
                />
              )}
              {currentUser?.id === row.id && (
                <span className="badge-pill bg-pink-50 text-pink-700 !px-2 !py-0 text-[10px]">
                  أنت
                </span>
              )}
            </p>
            <p className="text-xs text-gray-400 truncate ltr text-right">
              {row.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "التواصل",
      render: (row) => (
        <div className="space-y-1">
          <p className="text-xs text-gray-600 flex items-center gap-1.5">
            <FiPhone size={12} className="text-gray-400 shrink-0" />
            <span className="ltr">{row.phone || "—"}</span>
          </p>
          <span
            className={`badge-pill !px-2 !py-0.5 text-[10px] ${
              row.provider === "google"
                ? "bg-amber-50 text-amber-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <FiMail size={10} />
            {row.provider === "google" ? "جوجل" : "تسجيل مباشر"}
          </span>
        </div>
      ),
      hideOnMobile: true,
    },
    {
      key: "role",
      header: "الصلاحية",
      render: (row) => <RoleBadge role={row.role} />,
    },
    {
      key: "status",
      header: "الحالة",
      render: (row) => <StatusBadge isActive={row.isActive} />,
    },
    {
      key: "orders",
      header: "الطلبات",
      render: (row) => (
        <span className="font-bold text-gray-800">{row.ordersCount}</span>
      ),
    },
    {
      key: "spent",
      header: "إجمالي الإنفاق",
      render: (row) => (
        <span className="font-bold text-gray-900 whitespace-nowrap">
          {formatPrice(row.totalSpent)}
        </span>
      ),
    },
    {
      key: "joined",
      header: "انضم في",
      render: (row) => (
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {formatDate(row.createdAt)}
        </span>
      ),
      hideOnMobile: true,
    },
    {
      key: "actions",
      header: "إجراءات",
      render: (row) => {
        const isSelf = currentUser?.id === row.id;

        return (
          <div className="flex items-center gap-1.5">
            <TableAction
              title="تعديل البيانات"
              tone="blue"
              onClick={() =>
                setFormModal({
                  isOpen: true,
                  mode: "edit",
                  user: row,
                  initialValues: {
                    name: row.name,
                    email: row.email,
                    phone: row.phone || "",
                    role: row.role,
                    isVerified: row.isVerified,
                  },
                })
              }
            >
              <FiEdit2 size={15} />
            </TableAction>

            <TableAction
              title={isSelf ? "لا يمكنك إيقاف حسابك" : row.isActive ? "إيقاف الحساب" : "تفعيل الحساب"}
              tone={row.isActive ? "gray" : "green"}
              disabled={isSelf || pendingId === row.id}
              onClick={() => askToggleStatus(row)}
            >
              {row.isActive ? <FiSlash size={15} /> : <FiUserCheck size={15} />}
            </TableAction>

            <TableAction
              title={isSelf ? "لا يمكنك حذف حسابك" : "حذف المستخدم"}
              tone="red"
              disabled={isSelf}
              onClick={() => askDelete(row)}
            >
              <FiTrash2 size={15} />
            </TableAction>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-black text-gray-900">
            مستخدمو المنصة
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            استعرض حسابات المشترين والمدراء، عدّل بياناتهم، وأوقف أي حساب مخالف.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refresh}
            disabled={pendingId === "refresh"}
            className="w-11 h-11 rounded-2xl border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="تحديث"
          >
            <FiRefreshCw
              size={17}
              className={pendingId === "refresh" ? "animate-spin" : ""}
            />
          </button>

          <button
            type="button"
            onClick={() =>
              setFormModal({ isOpen: true, mode: "create", initialValues: EMPTY_FORM })
            }
            className="btn-primary !rounded-2xl !px-5 !py-3 text-sm"
          >
            <FiUserPlus className="ml-2" size={17} />
            إضافة مستخدم
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile
          label="إجمالي المستخدمين"
          value={userStats?.total ?? 0}
          Icon={FiUsers}
          gradient="from-blue-600 to-purple-600"
          isLoading={!userStats}
        />
        <StatTile
          label="مشترون"
          value={userStats?.buyers ?? 0}
          Icon={FiShoppingBag}
          gradient="from-green-500 to-emerald-600"
          isLoading={!userStats}
        />
        <StatTile
          label="مدراء"
          value={userStats?.admins ?? 0}
          Icon={FiShield}
          gradient="from-purple-600 to-pink-500"
          isLoading={!userStats}
        />
        <StatTile
          label="جدد هذا الشهر"
          value={userStats?.newThisMonth ?? 0}
          Icon={FiCalendar}
          gradient="from-amber-400 to-orange-500"
          isLoading={!userStats}
        />
      </div>

      {/* Toolbar */}
      <div className="rounded-3xl border border-black/[0.04] bg-white shadow-card p-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-6 relative">
            <FiSearch className="absolute top-1/2 -translate-y-1/2 right-4 text-pink-500" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="input-field pr-11"
              placeholder="ابحث بالاسم أو البريد أو رقم الهاتف"
            />
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="input-field lg:col-span-2"
          >
            {STATUS_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={provider}
            onChange={(event) => setProvider(event.target.value)}
            className="input-field lg:col-span-2"
          >
            {PROVIDER_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="input-field lg:col-span-2"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
            <FiFilter size={12} />
            الصلاحية
          </span>

          {ROLE_FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRole(option.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                role === option.value
                  ? "bg-pink-600 text-white shadow-glow-pink"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {option.label}
            </button>
          ))}

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="mr-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            >
              <FiXCircle size={13} />
              مسح الفلاتر ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        rows={users}
        isLoading={isLoading}
        emptyTitle="لا يوجد مستخدمون مطابقون"
        emptyDescription="جرّب تعديل كلمات البحث أو مسح الفلاتر."
        emptyIcon={<FiUsers size={28} />}
        expandedContent={(row) => <UserDetailsPanel userId={row.id} />}
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              يعرض{" "}
              <span className="font-bold text-gray-700">{users.length}</span> من{" "}
              <span className="font-bold text-gray-700">
                {usersPagination.totalItems}
              </span>{" "}
              مستخدم
            </p>
            <TablePagination
              page={usersPagination.page}
              totalPages={usersPagination.totalPages}
              onChange={fetchPage}
            />
          </div>
        }
      />

      <UserFormModal
        isOpen={formModal.isOpen}
        mode={formModal.mode}
        initialValues={formModal.initialValues || EMPTY_FORM}
        onClose={() => setFormModal({ isOpen: false, mode: "create" })}
        onSubmit={formModal.mode === "edit" ? handleUpdate : handleCreate}
      />

      <ConfirmDialog
        isOpen={Boolean(confirm)}
        title={confirm?.title}
        message={confirm?.message}
        confirmLabel={confirm?.confirmLabel}
        tone={confirm?.tone}
        isLoading={isConfirmLoading}
        onConfirm={runConfirmedAction}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
