import { Link } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/validators";

export default function Cart() {
  const {
    items,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto card text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">السلة فارغة</h1>
          <p className="text-gray-600 mb-6">
            لم تقم بإضافة أي منتجات حتى الآن.
          </p>
          <Link
            to="/browse"
            className="btn-primary inline-flex items-center gap-2"
          >
            <FiShoppingBag />
            ابدأ التسوق
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">سلة التسوق</h1>
            <button className="btn-outline" onClick={clearCart}>
              إفراغ السلة
            </button>
          </div>

          {items.map((item) => (
            <article key={item.id} className="card">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{item.image}</div>

                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">{item.storeName}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.status}</p>
                </div>

                <div className="text-left">
                  <p className="text-blue-600 font-bold text-lg">
                    {formatPrice(item.price)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit">
                  <button
                    className="px-3 py-2 hover:bg-gray-100"
                    onClick={() => decreaseQuantity(item.id)}
                    aria-label="تقليل الكمية"
                  >
                    <FiMinus />
                  </button>
                  <span className="px-4 py-2 font-bold min-w-12 text-center">
                    {item.quantity}
                  </span>
                  <button
                    className="px-3 py-2 hover:bg-gray-100"
                    onClick={() => increaseQuantity(item.id)}
                    aria-label="زيادة الكمية"
                  >
                    <FiPlus />
                  </button>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <p className="font-semibold text-gray-800">
                    الإجمالي: {formatPrice(item.price * item.quantity)}
                  </p>
                  <button
                    className="text-red-600 hover:text-red-700 inline-flex items-center gap-1"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <FiTrash2 />
                    حذف
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <aside className="card h-fit sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 mb-4">ملخص الطلب</h2>

          <div className="space-y-3 text-gray-700">
            <div className="flex items-center justify-between">
              <span>عدد المنتجات</span>
              <span className="font-semibold">{totalItems}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>المجموع الفرعي</span>
              <span className="font-semibold">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>الشحن</span>
              <span className="font-semibold">{formatPrice(0)}</span>
            </div>
          </div>

          <hr className="my-4" />

          <div className="flex items-center justify-between mb-5">
            <span className="text-lg font-bold text-gray-900">
              الإجمالي النهائي
            </span>
            <span className="text-xl font-bold text-blue-600">
              {formatPrice(totalPrice)}
            </span>
          </div>

          <button className="btn-secondary w-full mb-3">تأكيد الطلب</button>
          <Link to="/browse" className="btn-outline w-full block text-center">
            متابعة التسوق
          </Link>
        </aside>
      </div>
    </div>
  );
}
