import { NavLink, Outlet } from "react-router-dom";
import { useAdmin } from "../context/useAdmin";

export default function AdminPortal() {
  const {
    stores,
    products,
    orders,
    categories,
    productPagination,
    orderPagination,
  } = useAdmin();
  const productsCount = productPagination.totalItems || products.length;
  const ordersCount = orderPagination.totalItems || orders.length;

  const tabClassName = ({ isActive }) =>
    `w-full px-4 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
      isActive
        ? "bg-emerald-600 text-white shadow"
        : "bg-white text-gray-700 border border-gray-300 hover:bg-emerald-50"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="bg-white border border-gray-200 rounded-2xl shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900">بوابة الإدارة</h1>
          <p className="text-gray-600 mt-2">
            إدارة المتاجر والمنتجات ومتابعة الطلبات وتحديث حالتها بسهولة.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-700">عدد المتاجر</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {stores.length}
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-sm text-emerald-700">عدد المنتجات</p>
              <p className="text-2xl font-bold text-emerald-900 mt-1">
                {productsCount}
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-700">عدد الطلبات</p>
              <p className="text-2xl font-bold text-amber-900 mt-1">
                {ordersCount}
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-2xl shadow p-4 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                أقسام الإدارة
              </h2>
              <nav className="space-y-3">
                <NavLink to="/admin/orders" className={tabClassName}>
                  <span>الطلبات</span>
                  <span className="text-xs opacity-80">{ordersCount}</span>
                </NavLink>
                <NavLink to="/admin/stores" className={tabClassName}>
                  <span>المتاجر</span>
                  <span className="text-xs opacity-80">{stores.length}</span>
                </NavLink>
                <NavLink to="/admin/products" className={tabClassName}>
                  <span>المنتجات</span>
                  <span className="text-xs opacity-80">{productsCount}</span>
                </NavLink>
                <NavLink to="/admin/categories" className={tabClassName}>
                  <span>الأقسام</span>
                  <span className="text-xs opacity-80">
                    {categories.length}
                  </span>
                </NavLink>

                <NavLink to="/admin/reports" className={tabClassName}>
                  <span>التقارير</span>
                  <span className="text-xs opacity-80">Live</span>
                </NavLink>
              </nav>
            </div>
          </aside>

          <div className="lg:col-span-9">
            <div className="bg-white border border-gray-200 rounded-2xl shadow p-4 sm:p-6">
              <Outlet />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
