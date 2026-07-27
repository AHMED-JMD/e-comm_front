import { useEffect, useMemo, useState } from "react";
import { useAdmin } from "../context/useAdmin";

function formatCurrency(value) {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "SDG",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function AdminProducts() {
  const { stores, products, addProduct, loadProducts, productPagination } =
    useAdmin();
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");
  const [storeFilter, setStoreFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [productForm, setProductForm] = useState({
    storeId: "",
    name: "",
    price: "",
    stock: "",
    category: "",
  });

  const storeNameById = useMemo(() => {
    return stores.reduce((acc, store) => {
      acc[store.id] = store.name;
      return acc;
    }, {});
  }, [stores]);

  const categories = useMemo(() => {
    const uniq = new Set(products.map((item) => item.category));
    return Array.from(uniq).filter(Boolean);
  }, [products]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadProducts({
        page: 1,
        limit: productPagination.limit || 10,
        search: search || undefined,
        storeId: storeFilter === "all" ? undefined : Number(storeFilter),
        category: categoryFilter === "all" ? undefined : categoryFilter,
      }).catch(() => undefined);
    }, 300);

    return () => clearTimeout(timeout);
  }, [
    search,
    storeFilter,
    categoryFilter,
    productPagination.limit,
    loadProducts,
  ]);

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    if (
      !productForm.storeId ||
      !productForm.name.trim() ||
      !productForm.category.trim() ||
      Number(productForm.price) <= 0 ||
      Number(productForm.stock) < 0
    ) {
      setFeedback("يرجى إدخال بيانات منتج صحيحة.");
      return;
    }

    try {
      await addProduct(productForm);
      setProductForm({
        storeId: productForm.storeId,
        name: "",
        price: "",
        stock: "",
        category: "",
      });
      setFeedback("تمت إضافة المنتج بنجاح.");
    } catch (error) {
      setFeedback(error.message || "تعذر إضافة المنتج.");
    }
  };

  const goToPage = (nextPage) => {
    loadProducts({
      page: nextPage,
      limit: productPagination.limit || 10,
      search: search || undefined,
      storeId: storeFilter === "all" ? undefined : Number(storeFilter),
      category: categoryFilter === "all" ? undefined : categoryFilter,
    }).catch(() => undefined);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field"
          placeholder="ابحث باسم المنتج أو التصنيف"
        />
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
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="input-field"
        >
          <option value="all">كل التصنيفات</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 border border-gray-200 rounded-xl p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">كل المنتجات</h2>

          {products.length === 0 ? (
            <p className="text-sm text-gray-500">لا توجد منتجات مطابقة.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-gray-600 border-b border-gray-200">
                    <th className="text-right py-2">المنتج</th>
                    <th className="text-right py-2">المتجر</th>
                    <th className="text-right py-2">التصنيف</th>
                    <th className="text-right py-2">السعر</th>
                    <th className="text-right py-2">المخزون</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100">
                      <td className="py-2 text-gray-900">{product.name}</td>
                      <td className="py-2 text-gray-700">
                        {storeNameById[product.storeId] || "غير محدد"}
                      </td>
                      <td className="py-2 text-gray-700">{product.category}</td>
                      <td className="py-2 text-gray-700">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="py-2 text-gray-700">{product.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  صفحة {productPagination.page} من{" "}
                  {productPagination.totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToPage(productPagination.page - 1)}
                    disabled={productPagination.page <= 1}
                    className="px-3 py-2 text-sm rounded-md border border-gray-300 disabled:opacity-50"
                  >
                    السابق
                  </button>
                  <button
                    type="button"
                    onClick={() => goToPage(productPagination.page + 1)}
                    disabled={
                      productPagination.page >= productPagination.totalPages
                    }
                    className="px-3 py-2 text-sm rounded-md border border-gray-300 disabled:opacity-50"
                  >
                    التالي
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="border border-gray-200 rounded-xl p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            إضافة منتج جديد
          </h2>

          <form onSubmit={handleProductSubmit} className="space-y-3">
            <select
              value={productForm.storeId}
              onChange={(e) =>
                setProductForm((prev) => ({ ...prev, storeId: e.target.value }))
              }
              className="input-field"
            >
              <option value="">اختر المتجر</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={productForm.name}
              onChange={(e) =>
                setProductForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="اسم المنتج"
              className="input-field"
            />
            <input
              type="text"
              value={productForm.category}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              placeholder="التصنيف"
              className="input-field"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min="1"
                value={productForm.price}
                onChange={(e) =>
                  setProductForm((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="السعر"
                className="input-field"
              />
              <input
                type="number"
                min="0"
                value={productForm.stock}
                onChange={(e) =>
                  setProductForm((prev) => ({ ...prev, stock: e.target.value }))
                }
                placeholder="المخزون"
                className="input-field"
              />
            </div>
            <button
              type="submit"
              disabled={stores.length === 0}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              إضافة المنتج
            </button>
          </form>

          {stores.length === 0 && (
            <p className="mt-3 text-xs text-amber-700">
              يجب إضافة متجر أولاً قبل إضافة المنتجات.
            </p>
          )}

          {feedback && (
            <div className="mt-3 p-3 rounded-lg bg-gray-100 border border-gray-200 text-sm text-gray-700">
              {feedback}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
