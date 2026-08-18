import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiPhone,
  FiUser,
  FiCheckCircle,
  FiAlertCircle,
  FiShoppingBag,
  FiTruck,
} from "react-icons/fi";
import Spinner from "../components/Spinner";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import apiClient, { extractApiError, getImageUrl } from "../utils/api";
import { formatPrice } from "../utils/validators";

const CITIES = [
  "الخرطوم",
  "أم درمان",
  "بحري",
  "مدني",
  "بورتسودان",
  "كسلا",
  "القضارف",
  "الأبيض",
  "نيالا",
  "عطبرة",
  "دنقلا",
  "سنار",
];

export default function Checkout() {
  const { items, totalItems, totalPrice, storeGroups, clearCart } = useCart();
  const { user, isLoggedIn, updateUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    shippingCity: "",
    shippingAddress: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [placedOrders, setPlacedOrders] = useState(null);

  // The account already knows the buyer's name/phone — prefill and let them edit.
  useEffect(() => {
    setForm((previous) => ({
      ...previous,
      customerName: previous.customerName || user?.name || "",
      phone: previous.phone || user?.phone || "",
    }));
  }, [user]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login?redirect=/checkout", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const missingProfilePhone = useMemo(() => !user?.phone, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const customerName = form.customerName.trim();
    const phone = form.phone.trim();
    const shippingAddress = form.shippingAddress.trim();

    if (!customerName) {
      setError("يرجى إدخال اسم المستلم.");
      return;
    }

    if (!/^[0-9]{9,15}$/.test(phone)) {
      setError("يرجى إدخال رقم هاتف صحيح (أرقام فقط، من 9 إلى 15 رقم).");
      return;
    }

    if (shippingAddress.length < 10) {
      setError("يرجى إدخال عنوان شحن تفصيلي (الحي، الشارع، أقرب علامة مميزة).");
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await apiClient.post("/orders/checkout", {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        customerName,
        phone,
        shippingAddress,
        shippingCity: form.shippingCity || null,
        notes: form.notes.trim() || null,
      });

      if (missingProfilePhone && user) {
        updateUser({ ...user, phone });
      }

      setPlacedOrders(data.orders || []);
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submitError) {
      setError(
        extractApiError(
          submitError,
          "تعذر إتمام الطلب، يرجى المحاولة مرة أخرى.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- Success screen ---------- */
  if (placedOrders) {
    const ordersTotal = placedOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0,
    );

    return (
      <div className="min-h-screen bg-mesh-soft py-12 px-4">
        <div className="max-w-2xl mx-auto card text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-glow-green">
            <FiCheckCircle size={40} className="text-white" />
          </div>

          <h1 className="text-3xl font-display font-black text-gray-900 mb-3">
            تم استلام طلبك بنجاح
          </h1>
          <p className="text-gray-600 mb-8">
            سيتواصل معك المتجر على الرقم {form.phone} لتأكيد التوصيل.
          </p>

          <div className="space-y-3 text-right mb-8">
            {placedOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-2xl border border-gray-100 bg-gray-50/60 flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <p className="font-bold text-gray-900">{order.orderNumber}</p>
                  <p className="text-sm text-gray-600">
                    {order.store?.name} — {order.itemsCount} منتج
                  </p>
                </div>
                <span className="font-display font-extrabold text-blue-700">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-mesh-soft mb-8">
            <span className="font-bold text-gray-900">الإجمالي المدفوع</span>
            <span className="text-2xl font-display font-black text-gradient">
              {formatPrice(ordersTotal)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/account" className="btn-primary inline-flex items-center gap-2">
              <FiTruck />
              تتبع طلباتي
            </Link>
            <Link to="/browse" className="btn-outline">
              متابعة التسوق
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Empty cart guard ---------- */
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-mesh-soft py-12 px-4 flex items-center">
        <div className="max-w-md mx-auto card text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-display font-extrabold text-gray-900 mb-3">
            لا توجد منتجات لإتمام طلبها
          </h1>
          <Link to="/browse" className="btn-primary inline-flex items-center gap-2">
            <FiShoppingBag />
            ابدأ التسوق
          </Link>
        </div>
      </div>
    );
  }

  /* ---------- Checkout form ---------- */
  return (
    <div className="min-h-screen bg-mesh-soft py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-gradient mb-2">
            إتمام الطلب
          </h1>
          <p className="text-gray-600">
            خطوة واحدة تفصلك عن استلام منتجاتك — أدخل بيانات الشحن.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <section className="card space-y-5">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-glow">
                  <FiMapPin size={20} />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    بيانات الشحن
                  </h2>
                  <p className="text-sm text-gray-500">
                    نستخدم هذه البيانات لتوصيل الطلب إليك
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="customerName"
                    className="block mb-2 text-sm font-bold text-gray-700"
                  >
                    اسم المستلم *
                  </label>
                  <div className="relative">
                    <FiUser className="absolute top-1/2 -translate-y-1/2 right-4 text-blue-500" />
                    <input
                      id="customerName"
                      name="customerName"
                      type="text"
                      value={form.customerName}
                      onChange={handleChange}
                      className="input-field pr-11"
                      placeholder="الاسم الكامل"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-bold text-gray-700"
                  >
                    رقم الهاتف *
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute top-1/2 -translate-y-1/2 right-4 text-blue-500" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      value={form.phone}
                      onChange={handleChange}
                      className="input-field pr-11"
                      placeholder="09xxxxxxxx"
                    />
                  </div>
                  {missingProfilePhone ? (
                    <p className="mt-2 text-xs text-amber-700 inline-flex items-center gap-1.5">
                      <FiAlertCircle />
                      لا يوجد رقم هاتف في حسابك، أدخل رقمك وسيتم حفظه في ملفك
                      الشخصي.
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-green-700 inline-flex items-center gap-1.5">
                      <FiCheckCircle />
                      تم جلب الرقم من حسابك، يمكنك تعديله لهذا الطلب.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="shippingCity"
                  className="block mb-2 text-sm font-bold text-gray-700"
                >
                  المدينة
                </label>
                <select
                  id="shippingCity"
                  name="shippingCity"
                  value={form.shippingCity}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">اختر المدينة</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="shippingAddress"
                  className="block mb-2 text-sm font-bold text-gray-700"
                >
                  العنوان التفصيلي *
                </label>
                <textarea
                  id="shippingAddress"
                  name="shippingAddress"
                  rows={3}
                  value={form.shippingAddress}
                  onChange={handleChange}
                  className="input-field !rounded-2xl"
                  placeholder="الحي، الشارع، رقم المنزل، أقرب علامة مميزة"
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block mb-2 text-sm font-bold text-gray-700"
                >
                  ملاحظات للمتجر (اختياري)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  value={form.notes}
                  onChange={handleChange}
                  className="input-field !rounded-2xl"
                  placeholder="مثال: التوصيل بعد الخامسة مساءً"
                />
              </div>
            </section>

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium inline-flex items-center gap-2 w-full">
                <FiAlertCircle className="shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-secondary w-full inline-flex items-center justify-center gap-2"
            >
              {isSubmitting && <Spinner />}
              {isSubmitting ? "جاري تأكيد الطلب..." : "تأكيد الطلب"}
            </button>
          </form>

          {/* Summary */}
          <aside className="card h-fit lg:sticky lg:top-24 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">ملخص السلة</h2>

            <div className="space-y-4 max-h-80 overflow-y-auto pl-1">
              {storeGroups.map((group) => (
                <div key={group.storeId}>
                  <p className="text-xs font-bold text-blue-700 mb-2">
                    {group.storeName}
                  </p>
                  <ul className="space-y-2">
                    {group.items.map((item) => {
                      const imageUrl = getImageUrl(item.image);
                      return (
                        <li key={item.id} className="flex items-center gap-3">
                          <span className="w-12 h-12 shrink-0 rounded-xl bg-mesh-soft overflow-hidden flex items-center justify-center">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FiShoppingBag className="text-blue-500" />
                            )}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.quantity} × {formatPrice(item.price)}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-gray-800">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-2 text-gray-700 text-sm">
              <div className="flex items-center justify-between">
                <span>عدد المنتجات</span>
                <span className="font-semibold">{totalItems}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>الشحن</span>
                <span className="badge-pill bg-green-50 text-green-700">
                  مجاني
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="font-bold text-gray-900">الإجمالي</span>
              <span className="text-2xl font-display font-black text-gradient">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <Link to="/cart" className="btn-outline w-full block text-center">
              تعديل السلة
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
