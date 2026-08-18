import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import {
  FiGrid,
  FiShoppingCart,
  FiLayers,
  FiHome,
  FiBox,
  FiBarChart2,
  FiStar,
  FiUser,
  FiMenu,
  FiX,
  FiArrowLeft,
  FiTrendingUp,
  FiAlertTriangle,
} from "react-icons/fi";
import { useAdmin } from "../context/useAdmin";
import { useAuth } from "../context/AuthContext";
import { formatPrice, getInitials } from "../utils/validators";

const SECTIONS = [
  {
    to: "/admin/orders",
    label: "الطلبات",
    description: "متابعة الطلبات وتحديث حالتها حتى التسليم",
    Icon: FiShoppingCart,
    gradient: "from-blue-600 to-purple-600",
    countKey: "orders",
  },
  {
    to: "/admin/products",
    label: "المنتجات",
    description: "إضافة وتعديل منتجات المتاجر وصورها ومخزونها",
    Icon: FiBox,
    gradient: "from-green-500 to-emerald-600",
    countKey: "products",
  },
  {
    to: "/admin/stores",
    label: "المتاجر",
    description: "إدارة المتاجر المسجلة داخل المنصة وبياناتها",
    Icon: FiHome,
    gradient: "from-amber-400 to-orange-500",
    countKey: "stores",
  },
  {
    to: "/admin/categories",
    label: "الأقسام",
    description: "تعريف الأقسام واختيار الأيقونة الظاهرة في الواجهة",
    Icon: FiLayers,
    gradient: "from-pink-500 to-rose-500",
    countKey: "categories",
  },
  {
    to: "/admin/reviews",
    label: "التقييمات",
    description: "مراجعة تقييمات المنتجات وتعليقات المشترين",
    Icon: FiStar,
    gradient: "from-teal-500 to-cyan-600",
    countKey: "reviews",
  },
  {
    to: "/admin/reports",
    label: "التقارير",
    description: "مؤشرات الأداء ومبيعات المنصة",
    Icon: FiBarChart2,
    gradient: "from-slate-600 to-slate-800",
    countKey: null,
  },
  {
    to: "/admin/account",
    label: "حسابي",
    description: "بيانات حساب المدير وإعدادات الأمان",
    Icon: FiUser,
    gradient: "from-teal-500 to-blue-600",
    countKey: null,
  },
];

function KpiCard({ title, value, hint, Icon, gradient }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-black/[0.04] shadow-card p-5 hover:shadow-card-hover transition-all group">
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
}

export default function AdminPortal() {
  const {
    stores,
    products,
    orders,
    categories,
    reviewsPagination,
    productPagination,
    orderPagination,
  } = useAdmin();
  const { user } = useAuth();
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const productsCount = productPagination.totalItems || products.length;
  const ordersCount = orderPagination.totalItems || orders.length;
  const reviewsCount = reviewsPagination?.totalItems || 0;

  const counts = {
    orders: ordersCount,
    products: productsCount,
    stores: stores.length,
    categories: categories.length,
    reviews: reviewsCount,
  };

  const activeSection = useMemo(
    () =>
      SECTIONS.find((section) => location.pathname.startsWith(section.to)) ||
      SECTIONS[0],
    [location.pathname],
  );

  /* Live figures computed from the currently loaded page of orders/products. */
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

  const navItem = ({ isActive }) =>
    `w-full px-4 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-3 group ${
      isActive
        ? "bg-gradient-to-l from-blue-600 to-purple-600 text-white shadow-glow"
        : "text-gray-700 hover:bg-blue-50"
    }`;

  const renderNav = (onNavigate) => (
    <nav className="space-y-1.5">
      {SECTIONS.map((section) => {
        const SectionIcon = section.Icon;
        const count = section.countKey ? counts[section.countKey] : null;

        return (
          <NavLink
            key={section.to}
            to={section.to}
            className={navItem}
            onClick={onNavigate}
          >
            {({ isActive }) => (
              <>
                <span
                  className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-white/20 text-white"
                      : `bg-gradient-to-br ${section.gradient} text-white`
                  }`}
                >
                  <SectionIcon size={17} />
                </span>
                <span className="flex-1 text-right">{section.label}</span>
                {count !== null && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-white/20" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-mesh-soft">
      <div className="max-w-[1600px] mx-auto px-4 py-6 lg:py-8">
        {/* Top bar */}
        <header className="relative overflow-hidden rounded-4xl bg-mesh-hero bg-[length:200%_200%] animate-gradient-x text-white p-6 sm:p-8 shadow-glow-lg mb-6">
          <div className="blob w-72 h-72 bg-white/20 -top-20 -left-10" />

          <div className="relative flex flex-col lg:flex-row lg:items-center gap-5">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <span className="w-14 h-14 shrink-0 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center">
                <FiGrid size={26} />
              </span>
              <div className="min-w-0">
                <p className="text-white/70 text-sm mb-1">بوابة الإدارة</p>
                <h1 className="text-2xl sm:text-3xl font-display font-black break-words">
                  {activeSection.label}
                </h1>
                <p className="text-white/80 text-sm mt-1">
                  {activeSection.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/admin/account"
                className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/10 border border-white/25 backdrop-blur-sm hover:bg-white/20 transition-colors"
                title="حسابي"
              >
                <span className="w-9 h-9 rounded-xl bg-white text-blue-700 font-black flex items-center justify-center">
                  {getInitials(user?.name || "؟")}
                </span>
                <div className="text-sm">
                  <p className="font-bold leading-tight">{user?.name}</p>
                  <p className="text-white/70 text-xs">مدير المنصة</p>
                </div>
              </Link>

              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-blue-700 font-bold text-sm hover:-translate-y-0.5 transition-all"
              >
                <FiArrowLeft />
                المتجر
              </Link>

              <button
                type="button"
                onClick={() => setIsNavOpen((previous) => !previous)}
                className="lg:hidden p-3 rounded-2xl bg-white/15 border border-white/25"
                aria-label="قائمة الأقسام"
              >
                {isNavOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>
        </header>

        {/* KPI row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <KpiCard
            title="الطلبات"
            value={ordersCount}
            hint={`${pendingOrders} بانتظار المراجعة`}
            Icon={FiShoppingCart}
            gradient="from-blue-600 to-purple-600"
          />
          <KpiCard
            title="المنتجات"
            value={productsCount}
            hint={
              outOfStock > 0 ? `${outOfStock} نفد مخزونها` : "كل المخزون متاح"
            }
            Icon={FiBox}
            gradient="from-green-500 to-emerald-600"
          />
          <KpiCard
            title="المتاجر والأقسام"
            value={`${stores.length} / ${categories.length}`}
            hint="متجر / قسم"
            Icon={FiHome}
            gradient="from-amber-400 to-orange-500"
          />
          <KpiCard
            title="مبيعات الصفحة الحالية"
            value={formatPrice(revenue)}
            hint="باستثناء الطلبات الملغاة"
            Icon={FiTrendingUp}
            gradient="from-pink-500 to-rose-500"
          />
        </section>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-3 xl:col-span-2">
            <div className="hidden lg:block sticky top-24 space-y-4">
              <div className="card !p-4">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3 px-2">
                  أقسام الإدارة
                </h2>
                {renderNav()}
              </div>

              {(pendingOrders > 0 || outOfStock > 0) && (
                <div className="card !p-4 space-y-3">
                  <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider px-1">
                    تحتاج انتباهك
                  </h2>

                  {pendingOrders > 0 && (
                    <Link
                      to="/admin/orders"
                      className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 transition-colors"
                    >
                      <FiAlertTriangle className="text-amber-600 shrink-0" />
                      <span className="text-sm font-bold text-amber-800">
                        {pendingOrders} طلب بانتظار المراجعة
                      </span>
                    </Link>
                  )}

                  {outOfStock > 0 && (
                    <Link
                      to="/admin/products"
                      className="flex items-center gap-3 p-3 rounded-2xl bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <FiAlertTriangle className="text-red-600 shrink-0" />
                      <span className="text-sm font-bold text-red-800">
                        {outOfStock} منتج نفد مخزونه
                      </span>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Mobile nav */}
            {isNavOpen && (
              <div className="lg:hidden card !p-4 animate-fade-up">
                {renderNav(() => setIsNavOpen(false))}
              </div>
            )}

            {!isNavOpen && (
              <div className="lg:hidden flex gap-2 overflow-x-auto pb-2">
                {SECTIONS.map((section) => {
                  const SectionIcon = section.Icon;
                  const isActive = location.pathname.startsWith(section.to);

                  return (
                    <NavLink
                      key={section.to}
                      to={section.to}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                        isActive
                          ? "bg-blue-600 text-white shadow-glow"
                          : "bg-white border border-black/[0.04] text-gray-700"
                      }`}
                    >
                      <SectionIcon size={15} />
                      {section.label}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </aside>

          {/* Content */}
          <main className="lg:col-span-9 xl:col-span-10">
            <div className="card !p-4 sm:!p-6 min-h-[60vh]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
