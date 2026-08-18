import { useMemo } from "react";
import { useAdmin } from "../context/useAdmin";

function formatCurrency(value) {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "SDG",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function getStatusColor(status) {
  if (status === "تم الاستلام") {
    return "#16a34a";
  }

  if (status === "تم الشحن") {
    return "#2563eb";
  }

  return "#d97706";
}

export default function AdminReports() {
  const { stores, products, orders, orderStatuses } = useAdmin();

  const summary = useMemo(() => {
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.total || 0),
      0,
    );
    const avgOrderValue = orders.length
      ? Math.round(totalRevenue / orders.length)
      : 0;
    const lowStockCount = products.filter(
      (product) => product.stock <= 5,
    ).length;

    return {
      totalRevenue,
      avgOrderValue,
      lowStockCount,
    };
  }, [orders, products]);

  const ordersByStatus = useMemo(() => {
    return orderStatuses.map((status) => {
      const count = orders.filter((order) => order.status === status).length;
      return {
        status,
        count,
        color: getStatusColor(status),
      };
    });
  }, [orders, orderStatuses]);

  const maxStatusCount = useMemo(() => {
    return Math.max(...ordersByStatus.map((item) => item.count), 1);
  }, [ordersByStatus]);

  const productsByStore = useMemo(() => {
    const countByStoreId = products.reduce((acc, product) => {
      acc[product.storeId] = (acc[product.storeId] || 0) + 1;
      return acc;
    }, {});

    return stores.map((store) => ({
      storeName: store.name,
      count: countByStoreId[store.id] || 0,
    }));
  }, [stores, products]);

  const maxProductsPerStore = useMemo(() => {
    if (productsByStore.length === 0) {
      return 1;
    }
    return Math.max(...productsByStore.map((item) => item.count), 1);
  }, [productsByStore]);

  const ordersLast7Days = useMemo(() => {
    const dayNames = [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];
    const today = new Date();
    const buckets = [];

    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(today);
      d.setHours(0, 0, 0, 0);
      d.setDate(today.getDate() - i);

      buckets.push({
        key: d.toISOString().slice(0, 10),
        label: dayNames[d.getDay()],
        count: 0,
      });
    }

    const indexByKey = buckets.reduce((acc, bucket, index) => {
      acc[bucket.key] = index;
      return acc;
    }, {});

    orders.forEach((order) => {
      if (!order.createdAt) {
        return;
      }

      const key = new Date(order.createdAt).toISOString().slice(0, 10);
      if (indexByKey[key] !== undefined) {
        buckets[indexByKey[key]].count += 1;
      }
    });

    return buckets;
  }, [orders]);

  const maxDailyOrders = useMemo(() => {
    return Math.max(...ordersLast7Days.map((item) => item.count), 1);
  }, [ordersLast7Days]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">التقارير</h2>
        <p className="text-sm text-gray-600 mt-1">
          إحصائيات مباشرة لمتابعة أداء المنصة بسرعة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-200 p-4 bg-pink-50">
          <p className="text-xs text-pink-700">إجمالي الإيرادات</p>
          <p className="text-2xl font-bold text-pink-900 mt-2">
            {formatCurrency(summary.totalRevenue)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 p-4 bg-emerald-50">
          <p className="text-xs text-emerald-700">متوسط قيمة الطلبات</p>
          <p className="text-2xl font-bold text-emerald-900 mt-2">
            {formatCurrency(summary.avgOrderValue)}
          </p>
        </div>
        {/* <div className="rounded-xl border border-gray-200 p-4 bg-amber-50">
          <p className="text-xs text-amber-700">منتجات منخفضة المخزون</p>
          <p className="text-2xl font-bold text-amber-900 mt-2">
            {summary.lowStockCount}
          </p>
        </div> */}
        <div className="rounded-xl border border-gray-200 p-4 bg-violet-50">
          <p className="text-xs text-violet-700">نسبة إتمام الطلبات</p>
          <p className="text-2xl font-bold text-violet-900 mt-2">
            {orders.length
              ? `${Math.round(
                  (orders.filter((order) => order.status === "تم الاستلام")
                    .length /
                    orders.length) *
                    100,
                )}%`
              : "0%"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="border border-gray-200 rounded-xl p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            حالات الطلبات
          </h3>
          <div className="space-y-3">
            {ordersByStatus.map((item) => (
              <div key={item.status}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700">{item.status}</span>
                  <span className="font-semibold text-gray-900">
                    {item.count}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(item.count / maxStatusCount) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-gray-200 rounded-xl p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            عدد المنتجات لكل متجر
          </h3>
          {productsByStore.length === 0 ? (
            <p className="text-sm text-gray-500">
              لا توجد متاجر لعرض الرسم البياني.
            </p>
          ) : (
            <div className="space-y-3">
              {productsByStore.map((item) => (
                <div key={item.storeName}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700">{item.storeName}</span>
                    <span className="font-semibold text-gray-900">
                      {item.count}
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      style={{
                        width: `${(item.count / maxProductsPerStore) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="border border-gray-200 rounded-xl p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          الطلبات خلال آخر 7 أيام
        </h3>
        <div className="h-52 flex items-end gap-3">
          {ordersLast7Days.map((point) => (
            <div
              key={point.key}
              className="flex-1 flex flex-col items-center justify-end gap-2"
            >
              <div className="text-xs text-gray-600">{point.count}</div>
              <div className="w-full bg-gray-100 rounded-t-md h-40 flex items-end overflow-hidden">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-blue-500"
                  style={{
                    height: `${Math.max((point.count / maxDailyOrders) * 100, point.count > 0 ? 12 : 0)}%`,
                  }}
                />
              </div>
              <div className="text-xs text-gray-500">{point.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
