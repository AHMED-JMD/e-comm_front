import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FiShoppingCart,
  FiBox,
  FiUsers,
  FiTrendingUp,
  FiAlertTriangle,
  FiArrowLeft,
  FiHome,
  FiLayers,
  FiStar,
  FiUserCheck,
  FiSlash,
} from "react-icons/fi";
import { useAdmin } from "../context/useAdmin";
import { useAuth } from "../context/AuthContext";
import { formatPrice, formatDate, getInitials } from "../utils/validators";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700",
  processing: "bg-pink-50 text-pink-700",
  shipped: "bg-purple-50 text-purple-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

function KpiCard({ title, value, hint, Icon, gradient, to }) {
  const content = (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-black/[0.04] shadow-card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all group h-full">
      <span
        className={`absolute -top-8 -left-8 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`}
      />

      <div className="relative flex items-start gap-4">
        <span
          className={`w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-md`}
        >
          <Icon size={22} />
        </span>
        <div className="min-w-0">
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-display font-black text-gray-900 leading-tight break-words">
            {value}
          </p>
          {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        </div>
      </div>
    </div>
  );

  return to ? (
    <Link to={to} className="block h-full">
      {content}
    </Link>
  ) : (
    content
  );
}

function QuickLink({ to, label, description, Icon, gradient }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-4 rounded-2xl border border-black/[0.04] bg-white hover:shadow-card hover:-translate-y-0.5 transition-all group"
    >
      <span
        className={`w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center`}
      >
        <Icon size={19} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold text-gray-900 text-sm">{label}</span>
        <span className="block text-xs text-gray-500 truncate">
          {description}
        </span>
      </span>
      <FiArrowLeft className="text-gray-300 group-hover:text-pink-600 group-hover:-translate-x-1 transition-all shrink-0" />
    </Link>
  );
}

export default function AdminDashboard() {
  const {
    stores,
    products,
    orders,
    categories,
    userStats,
    reviewsPagination,
    productPagination,
    orderPagination,
  } = useAdmin();
  const { user } = useAuth();

  const productsCount = productPagination.totalItems || products.length;
  const ordersCount = orderPagination.totalItems || orders.length;

  const revenue = useMemo(
    () =>
      orders
        .filter((order) => order.backendStatus !== "cancelled")
        .reduce((sum, order) => sum + Number(order.total || 0), 0),
    [orders],
  );

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.backendStatus === "pending").length,
    [orders],
  );

  const outOfStock = useMemo(
    () => products.filter((product) => Number(product.stock) <= 0).length,
    [products],
  );

  const recentOrders = useMemo(() => orders.slice(0, 6), [orders]);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <section className="relative overflow-hidden rounded-4xl bg-mesh-hero bg-[length:200%_200%] animate-gradient-x text-white p-6 sm:p-8 shadow-glow-lg">
        <div className="blob w-72 h-72 bg-white/20 -top-24 -left-10" />

        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div className="min-w-0">
            <p className="text-white/70 text-sm mb-1">أهلاً بعودتك</p>
            <h2 className="text-2xl sm:text-3xl font-display font-black mb-2">
              {user?.name}
            </h2>
            <p className="text-white/80 text-sm max-w-xl leading-relaxed">
              هذه لمحة سريعة عن أداء المنصة اليوم. تابع الطلبات الجديدة، راقب
              المخزون، وأدر حسابات المستخدمين من مكان واحد.
            </p>
          </div>

          <span className="w-16 h-16 rounded-3xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center text-2xl font-display font-black">
            {getInitials(user?.name || "؟")}
          </span>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          title="الطلبات"
          value={ordersCount}
          hint={`${pendingOrders} بانتظار المراجعة`}
          Icon={FiShoppingCart}
          gradient="from-blue-600 to-purple-600"
          to="/orders"
        />
        <KpiCard
          title="المنتجات"
          value={productsCount}
          hint={outOfStock > 0 ? `${outOfStock} نفد مخزونها` : "كل المخزون متاح"}
          Icon={FiBox}
          gradient="from-green-500 to-emerald-600"
          to="/products"
        />
        <KpiCard
          title="المستخدمون"
          value={userStats?.total ?? "—"}
          hint={
            userStats
              ? `${userStats.newThisMonth} جديد هذا الشهر · ${userStats.admins} مدير`
              : "جاري التحميل"
          }
          Icon={FiUsers}
          gradient="from-indigo-500 to-blue-600"
          to="/users"
        />
        <KpiCard
          title="مبيعات الصفحة الحالية"
          value={formatPrice(revenue)}
          hint="باستثناء الطلبات الملغاة"
          Icon={FiTrendingUp}
          gradient="from-pink-500 to-rose-500"
          to="/reports"
        />
      </section>

      {/* Alerts */}
      {(pendingOrders > 0 || outOfStock > 0 || (userStats?.blocked ?? 0) > 0) && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pendingOrders > 0 && (
            <Link
              to="/orders"
              className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100 hover:bg-amber-100 transition-colors"
            >
              <FiAlertTriangle className="text-amber-600 shrink-0" size={20} />
              <span className="text-sm font-bold text-amber-800">
                {pendingOrders} طلب بانتظار المراجعة
              </span>
            </Link>
          )}

          {outOfStock > 0 && (
            <Link
              to="/products"
              className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 hover:bg-red-100 transition-colors"
            >
              <FiAlertTriangle className="text-red-600 shrink-0" size={20} />
              <span className="text-sm font-bold text-red-800">
                {outOfStock} منتج نفد مخزونه
              </span>
            </Link>
          )}

          {(userStats?.blocked ?? 0) > 0 && (
            <Link
              to="/users?status=blocked"
              className="flex items-center gap-3 p-4 rounded-2xl bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-colors"
            >
              <FiSlash className="text-gray-600 shrink-0" size={20} />
              <span className="text-sm font-bold text-gray-800">
                {userStats.blocked} حساب موقوف
              </span>
            </Link>
          )}
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <section className="lg:col-span-2 card !p-0 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-display font-black text-gray-900">
              أحدث الطلبات
            </h3>
            <Link
              to="/orders"
              className="text-sm font-bold text-pink-600 hover:text-pink-700 inline-flex items-center gap-1"
            >
              عرض الكل
              <FiArrowLeft size={14} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-12">
              لا توجد طلبات بعد
            </p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <li
                  key={order.rawId}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-pink-50/40 transition-colors"
                >
                  <span className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xs font-black flex items-center justify-center">
                    {getInitials(order.customerName || "؟")}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {order.id} · {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <span
                    className={`badge-pill shrink-0 ${
                      STATUS_STYLES[order.backendStatus] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {order.status}
                  </span>

                  <span className="text-sm font-black text-gray-900 shrink-0 hidden sm:block">
                    {formatPrice(order.total)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Quick links + community snapshot */}
        <section className="space-y-4">
          <div className="card !p-4 space-y-2">
            <h3 className="font-display font-black text-gray-900 px-1 mb-2">
              إجراءات سريعة
            </h3>
            <QuickLink
              to="/users"
              label="إدارة المستخدمين"
              description="الحسابات والصلاحيات والإيقاف"
              Icon={FiUsers}
              gradient="from-indigo-500 to-blue-600"
            />
            <QuickLink
              to="/stores"
              label="المتاجر"
              description={`${stores.length} متجر مسجل`}
              Icon={FiHome}
              gradient="from-amber-400 to-orange-500"
            />
            <QuickLink
              to="/categories"
              label="الأقسام"
              description={`${categories.length} قسم`}
              Icon={FiLayers}
              gradient="from-pink-500 to-rose-500"
            />
            <QuickLink
              to="/reviews"
              label="التقييمات"
              description={`${reviewsPagination?.totalItems || 0} تقييم`}
              Icon={FiStar}
              gradient="from-teal-500 to-cyan-600"
            />
          </div>

          {userStats && (
            <div className="card !p-5">
              <h3 className="font-display font-black text-gray-900 mb-4">
                لمحة عن المستخدمين
              </h3>

              <div className="space-y-3">
                {[
                  {
                    label: "حسابات نشطة",
                    value: userStats.active,
                    Icon: FiUserCheck,
                    tone: "text-green-600 bg-green-50",
                  },
                  {
                    label: "حسابات موقوفة",
                    value: userStats.blocked,
                    Icon: FiSlash,
                    tone: "text-red-600 bg-red-50",
                  },
                  {
                    label: "اشتروا من قبل",
                    value: userStats.buyersWithOrders,
                    Icon: FiShoppingCart,
                    tone: "text-pink-600 bg-pink-50",
                  },
                ].map(({ label, value, Icon, tone }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${tone}`}
                    >
                      <Icon size={16} />
                    </span>
                    <span className="text-sm text-gray-600 flex-1">{label}</span>
                    <span className="text-sm font-black text-gray-900">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                to="/users"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-pink-50 text-pink-700 font-bold text-sm hover:bg-pink-100 transition-colors"
              >
                فتح إدارة المستخدمين
                <FiArrowLeft size={14} />
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
