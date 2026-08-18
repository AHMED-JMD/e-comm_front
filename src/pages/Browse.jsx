import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import ProductReviewsModal from "../components/ProductReviewsModal";
import Spinner from "../components/Spinner";
import { CategoryIconBadge } from "../utils/categoryIcons";
import { useCart } from "../context/CartContext";
import apiClient from "../utils/api";
import { formatPrice } from "../utils/validators";

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "rating", label: "الأعلى تقييماً" },
  { value: "price_asc", label: "السعر: من الأقل" },
  { value: "price_desc", label: "السعر: من الأعلى" },
];

const MAX_PRICE = 100000;

export default function Browse() {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewProduct, setReviewProduct] = useState(null);

  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [maxPrice, setMaxPrice] = useState(
    Number(searchParams.get("maxPrice")) || MAX_PRICE,
  );

  const categoryId = searchParams.get("categoryId") || "";
  const storeId = searchParams.get("storeId") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page")) || 1;
  const searchTerm = searchParams.get("search") || "";
  const priceCeiling = Number(searchParams.get("maxPrice")) || 0;

  const updateParams = useCallback(
    (changes, { resetPage = true } = {}) => {
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous);

        for (const [key, value] of Object.entries(changes)) {
          if (value === undefined || value === null || value === "") {
            next.delete(key);
          } else {
            next.set(key, String(value));
          }
        }

        if (resetPage) {
          next.delete("page");
        }

        return next;
      });
    },
    [setSearchParams],
  );

  useEffect(() => {
    apiClient
      .get("/shop/categories")
      .then(({ data }) => setCategories(data.categories || []))
      .catch(() => undefined);
  }, []);

  // Debounce the free-text field into the URL, which is the single source of truth.
  useEffect(() => {
    if (query === searchTerm) return undefined;

    const timeout = setTimeout(() => updateParams({ search: query }), 350);
    return () => clearTimeout(timeout);
  }, [query, searchTerm, updateParams]);

  useEffect(() => {
    if (maxPrice === (priceCeiling || MAX_PRICE)) return undefined;

    const timeout = setTimeout(
      () => updateParams({ maxPrice: maxPrice >= MAX_PRICE ? "" : maxPrice }),
      350,
    );
    return () => clearTimeout(timeout);
  }, [maxPrice, priceCeiling, updateParams]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError("");

    apiClient
      .get("/shop/products", {
        params: {
          search: searchTerm || undefined,
          categoryId: categoryId || undefined,
          storeId: storeId || undefined,
          maxPrice: priceCeiling || undefined,
          sort,
          page,
          limit: 12,
        },
      })
      .then(({ data }) => {
        if (!isMounted) return;
        setProducts(data.products || []);
        setPagination(data.pagination || { page: 1, totalPages: 1, totalItems: 0 });
      })
      .catch(() => {
        if (!isMounted) return;
        setError("تعذر تحميل المنتجات، تحقق من الاتصال وحاول مرة أخرى.");
        setProducts([]);
      })
      .finally(() => isMounted && setIsLoading(false));

    return () => {
      isMounted = false;
    };
  }, [searchTerm, categoryId, storeId, priceCeiling, sort, page]);

  const activeCategory = useMemo(
    () => categories.find((category) => String(category.id) === String(categoryId)),
    [categories, categoryId],
  );

  const hasFilters = Boolean(searchTerm || categoryId || storeId || priceCeiling);

  const resetFilters = () => {
    setQuery("");
    setMaxPrice(MAX_PRICE);
    setSearchParams(new URLSearchParams());
  };

  const handleRatingChange = (productId, summary) => {
    if (!summary) return;
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              ratingAvg: summary.ratingAvg,
              ratingCount: summary.ratingCount,
            }
          : product,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-mesh-soft py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="animate-fade-up">
          <h1 className="text-3xl md:text-4xl font-display font-black text-gradient mb-2">
            {activeCategory ? activeCategory.name : "تصفح المنتجات"}
          </h1>
          <p className="text-gray-600">ابحث، صفِّ، واختر المنتج المناسب لك.</p>
        </div>

        <section className="card space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
            <div className="lg:col-span-2">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                بحث سريع
              </label>
              <div className="relative">
                <FiSearch className="absolute top-1/2 -translate-y-1/2 right-4 text-blue-500" />
                <input
                  type="text"
                  className="input-field pr-11"
                  placeholder="ابحث بالاسم أو الوصف أو التصنيف"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                الترتيب
              </label>
              <select
                className="input-field"
                value={sort}
                onChange={(event) => updateParams({ sort: event.target.value })}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category chips */}
          <div>
            <p className="mb-2 text-sm font-bold text-gray-700">الأقسام</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => updateParams({ categoryId: "" })}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  !categoryId
                    ? "bg-blue-600 text-white shadow-glow"
                    : "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300"
                }`}
              >
                الكل
              </button>

              {categories.map((category) => {
                const isActive = String(category.id) === String(categoryId);
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => updateParams({ categoryId: category.id })}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-glow"
                        : "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300"
                    }`}
                  >
                    <CategoryIconBadge
                      icon={category.icon}
                      color={category.color}
                      size="sm"
                      iconSize={13}
                      className="!w-6 !h-6 !rounded-lg"
                    />
                    {category.name}
                    <span className="text-xs opacity-70">
                      {category.productsCount || 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 text-sm text-gray-700">
              <span className="inline-flex items-center gap-2 font-bold">
                <FiFilter className="text-blue-600" />
                الحد الأقصى للسعر
              </span>
              <span className="badge-pill bg-blue-50 text-blue-700">
                {maxPrice >= MAX_PRICE ? "بدون حد" : formatPrice(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max={MAX_PRICE}
              step="500"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-gray-700 font-medium">
            عدد النتائج:{" "}
            <span className="text-blue-700 font-bold">
              {pagination.totalItems || 0}
            </span>
          </p>
          {hasFilters && (
            <button
              className="btn-outline !py-2 inline-flex items-center gap-2"
              onClick={resetFilters}
            >
              <FiX />
              إعادة الضبط
            </button>
          )}
        </div>

        {error && (
          <div className="card !py-4 bg-red-50 border-red-200 text-red-700 text-center">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner className="w-10 h-10 border-4 border-blue-200 border-t-blue-600" />
          </div>
        ) : products.length > 0 ? (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onOpenReviews={setReviewProduct}
                />
              ))}
            </section>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  className="btn-outline !py-2"
                  disabled={pagination.page <= 1}
                  onClick={() =>
                    updateParams({ page: pagination.page - 1 }, { resetPage: false })
                  }
                >
                  السابق
                </button>
                <span className="text-sm text-gray-600 font-medium">
                  صفحة {pagination.page} من {pagination.totalPages}
                </span>
                <button
                  type="button"
                  className="btn-outline !py-2"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() =>
                    updateParams({ page: pagination.page + 1 }, { resetPage: false })
                  }
                >
                  التالي
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="card text-center py-12">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-lg text-gray-600">
              لا توجد منتجات مطابقة للفلاتر الحالية.
            </p>
          </div>
        )}
      </div>

      <ProductReviewsModal
        product={reviewProduct}
        isOpen={Boolean(reviewProduct)}
        onClose={() => setReviewProduct(null)}
        onRatingChange={handleRatingChange}
      />
    </div>
  );
}
