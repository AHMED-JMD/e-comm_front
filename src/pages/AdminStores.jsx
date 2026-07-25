import { useMemo, useState } from "react";
import { useAdmin } from "../context/AdminContext";

export default function AdminStores() {
  const { stores, products, addStore } = useAdmin();
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [storeForm, setStoreForm] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const productCountByStore = useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product.storeId] = (acc[product.storeId] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  const filteredStores = useMemo(() => {
    const q = search.trim().toLowerCase();

    return stores.filter((store) => {
      const count = productCountByStore[store.id] || 0;
      const matchesSearch =
        q.length === 0 ||
        store.name.toLowerCase().includes(q) ||
        store.address.toLowerCase().includes(q) ||
        store.phone.toLowerCase().includes(q);

      const matchesFilter =
        availabilityFilter === "all" ||
        (availabilityFilter === "with-products" && count > 0) ||
        (availabilityFilter === "without-products" && count === 0);

      return matchesSearch && matchesFilter;
    });
  }, [stores, productCountByStore, search, availabilityFilter]);

  const handleStoreSubmit = (e) => {
    e.preventDefault();

    if (
      !storeForm.name.trim() ||
      !storeForm.address.trim() ||
      !storeForm.phone.trim()
    ) {
      setFeedback("يرجى إدخال كل بيانات المتجر.");
      return;
    }

    addStore(storeForm);
    setStoreForm({ name: "", address: "", phone: "" });
    setFeedback("تمت إضافة المتجر بنجاح.");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            placeholder="ابحث باسم المتجر أو العنوان أو الهاتف"
          />
        </div>

        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className="input-field"
        >
          <option value="all">كل المتاجر</option>
          <option value="with-products">متاجر بها منتجات</option>
          <option value="without-products">متاجر بدون منتجات</option>
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 border border-gray-200 rounded-xl p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">كل المتاجر</h2>

          {filteredStores.length === 0 ? (
            <p className="text-sm text-gray-500">لا توجد نتائج مطابقة.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStores.map((store) => (
                <div
                  key={store.id}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                >
                  <h3 className="font-bold text-gray-900">{store.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{store.address}</p>
                  <p className="text-sm text-gray-600">{store.phone}</p>
                  <div className="mt-3 inline-flex px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-700">
                    عدد المنتجات: {productCountByStore[store.id] || 0}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="border border-gray-200 rounded-xl p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            إضافة متجر جديد
          </h2>

          <form onSubmit={handleStoreSubmit} className="space-y-3">
            <input
              type="text"
              value={storeForm.name}
              onChange={(e) =>
                setStoreForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="اسم المتجر"
              className="input-field"
            />
            <input
              type="text"
              value={storeForm.address}
              onChange={(e) =>
                setStoreForm((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="عنوان المتجر"
              className="input-field"
            />
            <input
              type="text"
              value={storeForm.phone}
              onChange={(e) =>
                setStoreForm((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="رقم الهاتف"
              className="input-field"
            />
            <button type="submit" className="btn-primary w-full">
              إضافة المتجر
            </button>
          </form>

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
