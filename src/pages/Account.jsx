import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiShoppingBag,
  FiTruck,
  FiCheckCircle,
  FiCreditCard,
  FiStar,
  FiPackage,
  FiClock,
  FiXCircle,
  FiChevronDown,
  FiMapPin,
  FiPhone,
  FiUser,
  FiEdit3,
} from "react-icons/fi";
import OrderStatusTimeline from "../components/OrderStatusTimeline";
import ProductReviewsModal from "../components/ProductReviewsModal";
import { StarRatingDisplay } from "../components/StarRating";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import apiClient, { getImageUrl } from "../utils/api";
import { getStatusMeta } from "../utils/orderStatus";
import { formatPrice, formatDate, getInitials } from "../utils/validators";

const TABS = [
  { key: "overview", label: "نظرة عامة", Icon: FiShoppingBag },
  { key: "active", label: "الطلبات النشطة", Icon: FiTruck },
  { key: "history", label: "سجل الطلبات", Icon: FiClock },
  { key: "reviews", label: "تقييماتي", Icon: FiStar },
];

function StatCard({ title, value, hint, Icon, gradient }) {
  return (
    <div className="card !p-5 flex items-start gap-4">
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
  );
}

function StatusBadge({ status }) {
  const meta = getStatusMeta(status);
  const Icon = meta.Icon;

  return (
    <span className={`badge-pill border ${meta.badge}`}>
      <Icon size={13} />
      {meta.label}
    </span>
  );
}

function OrderItemsList({ items, onRate }) {
  return (
    <ul className="space-y-3">
      {items?.map((item) => {
        const imageUrl = getImageUrl(item.product?.image);

        return (
          <li
            key={item.id}
            className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/70"
          >
            <span className="w-14 h-14 shrink-0 rounded-xl bg-white overflow-hidden flex items-center justify-center border border-gray-100">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiPackage className="text-blue-500" size={22} />
              )}
            </span>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 line-clamp-1">
                {item.productName}
              </p>
              <p className="text-xs text-gray-500">
                {item.quantity} × {formatPrice(item.unitPrice)}
              </p>
            </div>

            <div className="text-left shrink-0 space-y-1">
              <p className="font-semibold text-gray-800 text-sm">
                {formatPrice(item.lineTotal)}
              </p>
              {onRate && item.product && (
                <button
                  type="button"
                  onClick={() => onRate(item.product)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700"
                >
                  <FiStar size={13} />
                  قيّم المنتج
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function ShippingSummary({ order }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
      <div className="p-3 rounded-2xl bg-gray-50/70">
        <p className="text-xs text-gray-500 mb-1 inline-flex items-center gap-1.5">
          <FiUser size={13} />
          المستلم
        </p>
        <p className="font-semibold text-gray-900">{order.customerName}</p>
      </div>
      <div className="p-3 rounded-2xl bg-gray-50/70">
        <p className="text-xs text-gray-500 mb-1 inline-flex items-center gap-1.5">
          <FiPhone size={13} />
          الهاتف
        </p>
        <p className="font-semibold text-gray-900" dir="ltr">
          {order.customerPhone || "—"}
        </p>
      </div>
      <div className="p-3 rounded-2xl bg-gray-50/70">
        <p className="text-xs text-gray-500 mb-1 inline-flex items-center gap-1.5">
          <FiMapPin size={13} />
          العنوان
        </p>
        <p className="font-semibold text-gray-900 line-clamp-2">
          {[order.shippingCity, order.shippingAddress]
            .filter(Boolean)
            .join(" — ") || "—"}
        </p>
      </div>
    </div>
  );
}

export default function Account() {
  const { user, isLoggedIn } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [activeOrders, setActiveOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [reviewProduct, setReviewProduct] = useState(null);

  const loadAll = useCallback(async () => {
    setIsLoading(true);

    try {
      const [statsRes, activeRes, pastRes, reviewsRes] = await Promise.all([
        apiClient.get("/orders/my/stats"),
        apiClient.get("/orders/my", { params: { scope: "active", limit: 20 } }),
        apiClient.get("/orders/my", { params: { scope: "past", limit: 20 } }),
        apiClient.get("/shop/reviews/mine", { params: { limit: 20 } }),
      ]);

      setStats(statsRes.data.stats || null);
      setActiveOrders(activeRes.data.orders || []);
      setPastOrders(pastRes.data.orders || []);
      setMyReviews(reviewsRes.data.reviews || []);
    } catch {
      setFeedback("تعذر تحميل بيانات حسابك، حاول تحديث الصفحة.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadAll();
    }
  }, [isLoggedIn, loadAll]);

  const handleCancel = async (order) => {
    if (!window.confirm(`هل تريد إلغاء الطلب ${order.orderNumber}؟`)) return;

    try {
      setCancellingId(order.id);
      await apiClient.patch(`/orders/my/${order.id}/cancel`);
      setFeedback("تم إلغاء الطلب بنجاح.");
      await loadAll();
    } catch (error) {
      setFeedback(error.response?.data?.message || "تعذر إلغاء الطلب.");
    } finally {
      setCancellingId(null);
    }
  };

  const nextDelivery = useMemo(
    () => activeOrders.find((order) => order.status === "shipped") || activeOrders[0],
    [activeOrders],
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-mesh-soft flex items-center justify-center px-4 py-12">
        <div className="card w-full max-w-xl text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-2xl font-display font-black text-gray-900 mb-3">
            حسابي
          </h1>
          <p className="text-gray-600 mb-6">
            سجّل الدخول لعرض طلباتك وإحصائيات مشترياتك.
          </p>
          <Link to="/login?redirect=/account" className="btn-primary">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh-soft py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Identity header */}
        <section className="relative overflow-hidden rounded-4xl bg-mesh-hero bg-[length:200%_200%] animate-gradient-x text-white p-6 sm:p-8 shadow-glow-lg">
          <div className="blob w-64 h-64 bg-white/20 -top-16 -left-10" />

          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
            <span className="w-20 h-20 rounded-3xl bg-white/15 border border-white/30 backdrop-blur-sm flex items-center justify-center text-3xl font-display font-black">
              {getInitials(user?.name || "؟")}
            </span>

            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-sm mb-1">أهلاً بك مجدداً</p>
              <h1 className="text-3xl font-display font-black mb-2 break-words">
                {user?.name}
              </h1>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="badge-pill bg-white/15 border border-white/25">
                  {user?.email}
                </span>
                {user?.phone && (
                  <span className="badge-pill bg-white/15 border border-white/25" dir="ltr">
                    {user.phone}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 border border-white/30 backdrop-blur-sm font-bold hover:bg-white/25 transition-all"
              >
                <FiEdit3 />
                تعديل بياناتي
              </Link>
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-blue-700 font-bold hover:-translate-y-0.5 transition-all"
              >
                <FiShoppingBag />
                تسوّق الآن
              </Link>
            </div>
          </div>
        </section>

        {feedback && (
          <div className="card !py-3 text-sm text-gray-700">{feedback}</div>
        )}

        {/* Tabs */}
        <nav className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map((tab) => {
            const TabIcon = tab.Icon;
            const isActive = activeTab === tab.key;
            const badge =
              tab.key === "active"
                ? activeOrders.length
                : tab.key === "history"
                  ? pastOrders.length
                  : tab.key === "reviews"
                    ? myReviews.length
                    : null;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-glow"
                    : "bg-white border border-black/[0.04] text-gray-700 hover:bg-blue-50"
                }`}
              >
                <TabIcon size={16} />
                {tab.label}
                {badge > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isActive ? "bg-white/25" : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner className="w-10 h-10 border-4 border-blue-200 border-t-blue-600" />
          </div>
        ) : (
          <>
            {/* ---------- Overview ---------- */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    title="إجمالي الطلبات"
                    value={stats?.totalOrders || 0}
                    hint={`${stats?.purchasedItems || 0} منتج تم شراؤه`}
                    Icon={FiShoppingBag}
                    gradient="from-blue-600 to-purple-600"
                  />
                  <StatCard
                    title="طلبات نشطة"
                    value={stats?.activeOrders || 0}
                    hint="قيد التجهيز أو الشحن"
                    Icon={FiTruck}
                    gradient="from-amber-400 to-orange-500"
                  />
                  <StatCard
                    title="طلبات مكتملة"
                    value={stats?.deliveredOrders || 0}
                    hint={`${stats?.cancelledOrders || 0} ملغي`}
                    Icon={FiCheckCircle}
                    gradient="from-green-500 to-emerald-600"
                  />
                  <StatCard
                    title="إجمالي المشتريات"
                    value={formatPrice(stats?.totalSpent || 0)}
                    hint={`متوسط الطلب ${formatPrice(stats?.averageOrderValue || 0)}`}
                    Icon={FiCreditCard}
                    gradient="from-pink-500 to-rose-500"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Latest active order tracking */}
                  <div className="lg:col-span-2 card space-y-5">
                    <h2 className="text-xl font-bold text-gray-900">
                      تتبع آخر طلب
                    </h2>

                    {nextDelivery ? (
                      <>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-display font-black text-lg text-gray-900">
                              {nextDelivery.orderNumber}
                            </p>
                            <p className="text-sm text-gray-500">
                              {nextDelivery.store?.name} •{" "}
                              {formatDate(nextDelivery.createdAt)}
                            </p>
                          </div>
                          <StatusBadge status={nextDelivery.status} />
                        </div>

                        <OrderStatusTimeline status={nextDelivery.status} />

                        <ShippingSummary order={nextDelivery} />

                        <OrderItemsList items={nextDelivery.items} />
                      </>
                    ) : (
                      <div className="text-center py-10">
                        <div className="text-5xl mb-3">📦</div>
                        <p className="text-gray-600 mb-4">
                          لا توجد طلبات نشطة حالياً.
                        </p>
                        <Link to="/browse" className="btn-primary">
                          تصفح المنتجات
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Status breakdown */}
                  <div className="card space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      توزيع حالات الطلبات
                    </h2>

                    {Object.entries(stats?.byStatus || {}).map(
                      ([status, count]) => {
                        const meta = getStatusMeta(status);
                        const total = stats?.totalOrders || 0;
                        const percent = total ? (count / total) * 100 : 0;

                        return (
                          <div key={status}>
                            <div className="flex items-center justify-between mb-1.5 text-sm">
                              <span className="inline-flex items-center gap-2 font-medium text-gray-700">
                                <span
                                  className={`w-2.5 h-2.5 rounded-full ${meta.dot}`}
                                />
                                {meta.label}
                              </span>
                              <span className="font-bold text-gray-900">
                                {count}
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-gradient-to-l ${meta.gradient} transition-all duration-700`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      },
                    )}

                    <div className="pt-3 border-t border-gray-100 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">تقييماتي</span>
                        <span className="font-bold text-gray-900">
                          {stats?.reviewsCount || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">آخر طلب</span>
                        <span className="font-bold text-gray-900">
                          {stats?.lastOrder
                            ? formatDate(stats.lastOrder.createdAt)
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ---------- Active orders ---------- */}
            {activeTab === "active" && (
              <div className="space-y-5">
                {activeOrders.length === 0 ? (
                  <div className="card text-center py-14">
                    <div className="text-5xl mb-3">🚚</div>
                    <p className="text-gray-600 mb-4">لا توجد طلبات نشطة.</p>
                    <Link to="/browse" className="btn-primary">
                      تصفح المنتجات
                    </Link>
                  </div>
                ) : (
                  activeOrders.map((order) => (
                    <article key={order.id} className="card space-y-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-display font-black text-lg text-gray-900">
                            {order.orderNumber}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.store?.name} • {formatDate(order.createdAt)}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <StatusBadge status={order.status} />
                          <span className="text-xl font-display font-black text-gradient">
                            {formatPrice(order.totalAmount)}
                          </span>
                        </div>
                      </div>

                      <OrderStatusTimeline status={order.status} />

                      <ShippingSummary order={order} />

                      <OrderItemsList items={order.items} />

                      {order.notes && (
                        <p className="text-sm text-gray-600 p-3 rounded-2xl bg-blue-50/60">
                          <span className="font-bold">ملاحظاتك: </span>
                          {order.notes}
                        </p>
                      )}

                      {["pending", "processing"].includes(order.status) && (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleCancel(order)}
                            disabled={cancellingId === order.id}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm text-red-600 border-2 border-red-200 hover:bg-red-50 transition-colors disabled:opacity-60"
                          >
                            {cancellingId === order.id ? (
                              <Spinner className="w-4 h-4 border-2 border-red-200 border-t-red-600" />
                            ) : (
                              <FiXCircle />
                            )}
                            إلغاء الطلب
                          </button>
                        </div>
                      )}
                    </article>
                  ))
                )}
              </div>
            )}

            {/* ---------- History ---------- */}
            {activeTab === "history" && (
              <div className="space-y-4">
                {pastOrders.length === 0 ? (
                  <div className="card text-center py-14">
                    <div className="text-5xl mb-3">🗂️</div>
                    <p className="text-gray-600">لا يوجد سجل طلبات بعد.</p>
                  </div>
                ) : (
                  pastOrders.map((order) => {
                    const isExpanded = expandedOrderId === order.id;

                    return (
                      <article key={order.id} className="card !p-0 overflow-hidden">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedOrderId(isExpanded ? null : order.id)
                          }
                          className="w-full p-5 flex flex-wrap items-center justify-between gap-3 text-right hover:bg-gray-50/60 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${getStatusMeta(order.status).gradient} text-white flex items-center justify-center`}
                            >
                              {order.status === "delivered" ? (
                                <FiCheckCircle size={20} />
                              ) : (
                                <FiXCircle size={20} />
                              )}
                            </span>
                            <div>
                              <p className="font-bold text-gray-900">
                                {order.orderNumber}
                              </p>
                              <p className="text-sm text-gray-500">
                                {order.store?.name} •{" "}
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <StatusBadge status={order.status} />
                            <span className="font-display font-black text-gray-900">
                              {formatPrice(order.totalAmount)}
                            </span>
                            <FiChevronDown
                              className={`text-gray-400 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
                            <ShippingSummary order={order} />
                            <OrderItemsList
                              items={order.items}
                              onRate={
                                order.status === "delivered"
                                  ? setReviewProduct
                                  : undefined
                              }
                            />
                          </div>
                        )}
                      </article>
                    );
                  })
                )}
              </div>
            )}

            {/* ---------- My reviews ---------- */}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                {myReviews.length === 0 ? (
                  <div className="card text-center py-14">
                    <div className="text-5xl mb-3">⭐</div>
                    <p className="text-gray-600 mb-4">
                      لم تقم بتقييم أي منتج بعد.
                    </p>
                    <Link to="/browse" className="btn-primary">
                      تصفح المنتجات
                    </Link>
                  </div>
                ) : (
                  myReviews.map((review) => {
                    const imageUrl = getImageUrl(review.product?.image);

                    return (
                      <article
                        key={review.id}
                        className="card flex flex-wrap items-start gap-4"
                      >
                        <span className="w-16 h-16 shrink-0 rounded-2xl bg-mesh-soft overflow-hidden flex items-center justify-center">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={review.product?.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FiPackage className="text-blue-500" size={24} />
                          )}
                        </span>

                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900">
                            {review.product?.name}
                          </p>
                          <StarRatingDisplay
                            value={review.rating}
                            size="sm"
                            showValue={false}
                            className="my-1"
                          />
                          {review.comment && (
                            <p className="text-sm text-gray-600 break-words">
                              {review.comment}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setReviewProduct(review.product)}
                          className="btn-outline !py-2 !px-4 text-sm"
                        >
                          تعديل التقييم
                        </button>
                      </article>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}
      </div>

      <ProductReviewsModal
        product={reviewProduct}
        isOpen={Boolean(reviewProduct)}
        onClose={() => setReviewProduct(null)}
        onRatingChange={() => loadAll()}
      />
    </div>
  );
}
