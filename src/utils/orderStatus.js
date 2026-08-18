import {
  FiClock,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

/** Single source of truth for how an order status is worded and coloured. */
export const ORDER_STATUS_META = {
  pending: {
    key: "pending",
    label: "قيد الانتظار",
    step: "تم استلام الطلب",
    description: "بانتظار تأكيد المتجر",
    Icon: FiClock,
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    gradient: "from-slate-500 to-slate-700",
    dot: "bg-slate-500",
  },
  processing: {
    key: "processing",
    label: "جاري التجهيز",
    step: "جاري التجهيز",
    description: "المتجر يجهّز منتجاتك",
    Icon: FiPackage,
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    gradient: "from-amber-400 to-orange-500",
    dot: "bg-amber-500",
  },
  shipped: {
    key: "shipped",
    label: "تم الشحن",
    step: "في الطريق إليك",
    description: "الطلب مع مندوب التوصيل",
    Icon: FiTruck,
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    gradient: "from-blue-600 to-purple-600",
    dot: "bg-blue-600",
  },
  delivered: {
    key: "delivered",
    label: "تم الاستلام",
    step: "تم التسليم",
    description: "اكتمل الطلب بنجاح",
    Icon: FiCheckCircle,
    badge: "bg-green-100 text-green-700 border-green-200",
    gradient: "from-green-500 to-emerald-600",
    dot: "bg-green-600",
  },
  cancelled: {
    key: "cancelled",
    label: "ملغي",
    step: "تم الإلغاء",
    description: "تم إلغاء هذا الطلب",
    Icon: FiXCircle,
    badge: "bg-red-100 text-red-700 border-red-200",
    gradient: "from-red-500 to-pink-600",
    dot: "bg-red-500",
  },
};

/** The happy path a normal order walks through. */
export const ORDER_FLOW = ["pending", "processing", "shipped", "delivered"];

export const ACTIVE_ORDER_STATUSES = ["pending", "processing", "shipped"];

export function getStatusMeta(status) {
  return ORDER_STATUS_META[status] || ORDER_STATUS_META.pending;
}

export function getStatusProgress(status) {
  const index = ORDER_FLOW.indexOf(status);
  if (index < 0) return 0;
  return ((index + 1) / ORDER_FLOW.length) * 100;
}
