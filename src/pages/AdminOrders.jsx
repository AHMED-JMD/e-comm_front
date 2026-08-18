import { useEffect, useMemo, useState } from "react";
import {
  FiMapPin,
  FiPhone,
  FiPackage,
  FiSearch,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";
import { useAdmin } from "../context/useAdmin";
import DataTable, { TablePagination } from "../components/DataTable";

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
    return "bg-pink-100 text-pink-700 border border-pink-200";
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

  const columns = [
    {
      key: "order",
      header: "الطلب",
      render: (order) => (
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-sm">
            <FiShoppingCart size={17} />
          </span>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 line-clamp-1">{order.id}</p>
            <p className="text-xs text-gray-500 line-clamp-1">
              {storeNameById[order.storeId] || "متجر غير محدد"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "customer",
      header: "العميل",
      render: (order) => (
        <div className="min-w-0">
          <p className="font-medium text-gray-900 line-clamp-1">
            {order.customerName}
          </p>
          {order.customerPhone && (
            <p className="text-xs text-gray-500" dir="ltr">
              {order.customerPhone}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "total",
      header: "القيمة",
      render: (order) => (
        <div>
          <p className="font-display font-black text-gray-900">
            {formatCurrency(order.total)}
          </p>
          <p className="text-xs text-gray-500">{order.itemsCount} منتج</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "الحالة",
      render: (order) => (
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${statusBadgeClasses(order.status)}`}
        >
          {order.status}
        </span>
      ),
    },
    {
      key: "update",
      header: "تحديث الحالة",
      render: (order) => (
        <select
          value={order.status}
          onChange={(event) => handleStatusChange(order, event.target.value)}
          className="px-3 py-2 rounded-xl border-2 border-gray-200 bg-white text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-600/10 transition-all"
        >
          {orderStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      ),
    },
  ];

  const renderOrderDetails = (order) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 rounded-2xl bg-white border border-gray-100">
          <p className="text-xs text-gray-500 mb-1 inline-flex items-center gap-1.5">
            <FiUser size={13} />
            المستلم
          </p>
          <p className="font-semibold text-gray-900">{order.customerName}</p>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-gray-100">
          <p className="text-xs text-gray-500 mb-1 inline-flex items-center gap-1.5">
            <FiPhone size={13} />
            هاتف التواصل
          </p>
          <p className="font-semibold text-gray-900" dir="ltr">
            {order.customerPhone || order.customer?.phone || "—"}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-gray-100">
          <p className="text-xs text-gray-500 mb-1 inline-flex items-center gap-1.5">
            <FiMapPin size={13} />
            عنوان الشحن
          </p>
          <p className="font-semibold text-gray-900">
            {[order.shippingCity, order.shippingAddress]
              .filter(Boolean)
              .join(" — ") || "لم يتم إدخال عنوان"}
          </p>
        </div>
      </div>

      {order.items?.length > 0 && (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-gray-100"
            >
              <span className="inline-flex items-center gap-2 text-gray-800 font-medium">
                <FiPackage className="text-pink-500" />
                {item.productName}
              </span>
              <span className="text-gray-600 text-xs">
                {item.quantity} × {formatCurrency(item.unitPrice)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {order.notes && (
        <p className="p-3 rounded-2xl bg-pink-50 text-pink-800 text-xs">
          <span className="font-bold">ملاحظات العميل: </span>
          {order.notes}
        </p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">إدارة الطلبات</h1>
        <p className="text-sm text-gray-500 mt-1">
          افتح تفاصيل أي طلب لرؤية عنوان الشحن ورقم التواصل والمنتجات.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <FiSearch className="absolute top-1/2 -translate-y-1/2 right-4 text-pink-500" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input-field pr-11"
            placeholder="ابحث برقم الطلب أو العميل أو الهاتف"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
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
          onChange={(event) => setStoreFilter(event.target.value)}
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

      {feedback && (
        <div className="p-3 rounded-2xl bg-pink-50 border border-pink-100 text-sm text-pink-800">
          {feedback}
        </div>
      )}

      <DataTable
        columns={columns}
        rows={orders}
        expandedContent={renderOrderDetails}
        emptyTitle="لا توجد طلبات"
        emptyDescription="لم يتم العثور على طلبات مطابقة للفلاتر الحالية."
        emptyIcon={<FiShoppingCart size={28} />}
        footer={
          <TablePagination
            page={orderPagination.page}
            totalPages={orderPagination.totalPages}
            onChange={goToPage}
          />
        }
      />
    </div>
  );
}
