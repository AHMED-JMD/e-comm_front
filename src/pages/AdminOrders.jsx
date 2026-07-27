import { useEffect, useMemo, useState } from "react";
import { useAdmin } from "../context/useAdmin";

function formatCurrency(value) {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "SDG",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function statusBadgeClasses(status) {
  if (status === "ملغي") {
    return "bg-red-100 text-red-700 border border-red-200";
  }

  if (status === "قيد الانتظار") {
    return "bg-slate-100 text-slate-700 border border-slate-200";
  }

  if (status === "تم الاستلام") {
    return "bg-green-100 text-green-700 border border-green-200";
  }

  if (status === "تم الشحن") {
    return "bg-blue-100 text-blue-700 border border-blue-200";
  }

  return "bg-amber-100 text-amber-700 border border-amber-200";
}

export default function AdminOrders() {
  const {
    orders,
    stores,
    orderStatuses,
    updateOrderStatus,
    loadOrders,
    orderPagination,
  } = useAdmin();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");
  const [feedback, setFeedback] = useState("");

  const storeNameById = useMemo(() => {
    return stores.reduce((acc, store) => {
      acc[store.id] = store.name;
      return acc;
    }, {});
  }, [stores]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadOrders({
        page: 1,
        limit: orderPagination.limit || 10,
        search: search || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        storeId: storeFilter === "all" ? undefined : Number(storeFilter),
      }).catch(() => undefined);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, statusFilter, storeFilter, orderPagination.limit, loadOrders]);

  const goToPage = (nextPage) => {
    loadOrders({
      page: nextPage,
      limit: orderPagination.limit || 10,
      search: search || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      storeId: storeFilter === "all" ? undefined : Number(storeFilter),
    }).catch(() => undefined);
  };

  const handleStatusChange = async (order, nextStatus) => {
    setFeedback("");
    try {
      await updateOrderStatus(order.rawId, nextStatus);
      setFeedback("تم تحديث حالة الطلب بنجاح.");
    } catch (error) {
      setFeedback(error.message || "تعذر تحديث حالة الطلب.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field"
          placeholder="ابحث برقم الطلب أو اسم العميل"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field"
        >
          <option value="all">كل الحالات</option>
          {orderStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={storeFilter}
          onChange={(e) => setStoreFilter(e.target.value)}
          className="input-field"
        >
          <option value="all">كل المتاجر</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      </div>

      <section className="border border-gray-200 rounded-xl p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">كل الطلبات</h2>

        {orders.length === 0 ? (
          <p className="text-sm text-gray-500">لا توجد طلبات مطابقة.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-600 border-b border-gray-200">
                  <th className="text-right py-2">رقم الطلب</th>
                  <th className="text-right py-2">المتجر</th>
                  <th className="text-right py-2">العميل</th>
                  <th className="text-right py-2">القيمة</th>
                  <th className="text-right py-2">عدد المنتجات</th>
                  <th className="text-right py-2">الحالة الحالية</th>
                  <th className="text-right py-2">تحديث الحالة</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100">
                    <td className="py-3 text-gray-900 font-medium">
                      {order.id}
                    </td>
                    <td className="py-3 text-gray-700">
                      {storeNameById[order.storeId] || "غير محدد"}
                    </td>
                    <td className="py-3 text-gray-700">{order.customerName}</td>
                    <td className="py-3 text-gray-700">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-3 text-gray-700">{order.itemsCount}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClasses(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order, e.target.value)
                        }
                        className="input-field py-2"
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                صفحة {orderPagination.page} من {orderPagination.totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(orderPagination.page - 1)}
                  disabled={orderPagination.page <= 1}
                  className="px-3 py-2 text-sm rounded-md border border-gray-300 disabled:opacity-50"
                >
                  السابق
                </button>
                <button
                  type="button"
                  onClick={() => goToPage(orderPagination.page + 1)}
                  disabled={orderPagination.page >= orderPagination.totalPages}
                  className="px-3 py-2 text-sm rounded-md border border-gray-300 disabled:opacity-50"
                >
                  التالي
                </button>
              </div>
            </div>
          </div>
        )}

        {feedback && (
          <div className="mt-3 p-3 rounded-lg bg-gray-100 border border-gray-200 text-sm text-gray-700">
            {feedback}
          </div>
        )}
      </section>
    </div>
  );
}
