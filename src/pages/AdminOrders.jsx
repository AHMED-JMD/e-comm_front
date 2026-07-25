import { useMemo, useState } from "react";
import { useAdmin } from "../context/AdminContext";

function formatCurrency(value) {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function statusBadgeClasses(status) {
  if (status === "تم الاستلام") {
    return "bg-green-100 text-green-700 border border-green-200";
  }

  if (status === "تم الشحن") {
    return "bg-blue-100 text-blue-700 border border-blue-200";
  }

  return "bg-amber-100 text-amber-700 border border-amber-200";
}

export default function AdminOrders() {
  const { orders, stores, orderStatuses, updateOrderStatus } = useAdmin();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");

  const storeNameById = useMemo(() => {
    return stores.reduce((acc, store) => {
      acc[store.id] = store.name;
      return acc;
    }, {});
  }, [stores]);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();

    return orders.filter((order) => {
      const orderStoreName = storeNameById[order.storeId] || "";
      const matchesSearch =
        q.length === 0 ||
        order.id.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        orderStoreName.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesStore =
        storeFilter === "all" || order.storeId === storeFilter;

      return matchesSearch && matchesStatus && matchesStore;
    });
  }, [orders, search, statusFilter, storeFilter, storeNameById]);

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

        {filteredOrders.length === 0 ? (
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
                {filteredOrders.map((order) => (
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
                          updateOrderStatus(order.id, e.target.value)
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
          </div>
        )}
      </section>
    </div>
  );
}
