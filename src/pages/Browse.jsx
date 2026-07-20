import { useMemo, useState } from "react";
import { FiSearch, FiFilter, FiShoppingCart } from "react-icons/fi";
import { PRODUCTS, PRODUCT_CATEGORIES } from "../data/products";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/validators";

export default function Browse() {
  const { addToCart } = useCart();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("الكل");
  const [status, setStatus] = useState("الكل");
  const [maxPrice, setMaxPrice] = useState(10000);

  //filter products based on search query, category, status, and max price
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const text = `${product.name} ${product.description} ${product.storeName}`;
      const matchQuery = text
        .toLowerCase()
        .includes(query.toLowerCase().trim());
      const matchCategory =
        category === "الكل" || product.category === category;
      const matchStatus = status === "الكل" || product.status === status;
      const matchPrice = product.price <= maxPrice;

      return matchQuery && matchCategory && matchStatus && matchPrice;
    });
  }, [query, category, status, maxPrice]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            تصفح المنتجات
          </h1>
          <p className="text-gray-600">ابحث، صفِّ، واختر المنتج المناسب لك.</p>
        </div>

        <section className="card space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
            <div className="lg:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                بحث سريع
              </label>
              <div className="relative">
                <FiSearch className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
                <input
                  type="text"
                  className="input-field pr-10"
                  placeholder="ابحث بالاسم أو الوصف أو المتجر"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                التصنيف
              </label>
              <select
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="الكل">الكل</option>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                حالة المنتج
              </label>
              <select
                className="input-field"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="الكل">الكل</option>
                <option value="جديد">جديد</option>
                <option value="مستعمل">مستعمل</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 text-sm text-gray-700">
              <span className="inline-flex items-center gap-2">
                <FiFilter />
                الحد الأقصى للسعر
              </span>
              <span className="font-semibold">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </section>

        <div className="flex items-center justify-between">
          <p className="text-gray-700 font-medium">
            عدد النتائج:{" "}
            <span className="text-blue-600">{filteredProducts.length}</span>
          </p>
          <button
            className="btn-outline"
            onClick={() => {
              setQuery("");
              setCategory("الكل");
              setStatus("الكل");
              setMaxPrice(10000);
            }}
          >
            إعادة الضبط
          </button>
        </div>

        {filteredProducts.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="card hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="text-6xl text-center mb-4">{product.image}</div>

                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-gray-900">
                    {product.name}
                  </h2>
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      product.status === "جديد"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">المتجر:</span>{" "}
                  {product.storeName}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">المنطقة:</span>{" "}
                  {product.storeCity}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  <span className="font-semibold">التصنيف:</span>{" "}
                  {product.category}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm bg-yellow-50 text-yellow-700 px-2 py-1 rounded font-medium">
                    ★ {product.rating}
                  </span>
                </div>

                <button
                  className="btn-primary w-full inline-flex items-center justify-center gap-2"
                  onClick={() => addToCart(product)}
                >
                  <FiShoppingCart />
                  إضافة إلى السلة
                </button>
              </article>
            ))}
          </section>
        ) : (
          <div className="card text-center py-12">
            <p className="text-lg text-gray-600">
              لا توجد منتجات مطابقة للفلاتر الحالية.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
