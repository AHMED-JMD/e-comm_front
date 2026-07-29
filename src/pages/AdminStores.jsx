import { useEffect, useMemo, useState } from "react";
import { useAdmin } from "../context/useAdmin";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";

export default function AdminStores() {
  const { stores, products, categories, addStore, updateStore, deleteStore } =
    useAdmin();
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(6);
  const [editingStoreId, setEditingStoreId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmittingStore, setIsSubmittingStore] = useState(false);
  const [savingStoreId, setSavingStoreId] = useState(null);
  const [deletingStoreId, setDeletingStoreId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    ownerName: "",
    address: "",
    description: "",
    phone: "",
    categoryId: "",
  });
  const [storeForm, setStoreForm] = useState({
    name: "",
    ownerName: "",
    address: "",
    description: "",
    phone: "",
    categoryId: "",
  });

  const productCountByStore = useMemo(() => {
    return products.reduce((acc, product) => {
      const key = String(product.storeId);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  const filteredStores = useMemo(() => {
    const q = search.trim().toLowerCase();

    return stores.filter((store) => {
      const count = productCountByStore[String(store.id)] || 0;
      const matchesSearch =
        q.length === 0 ||
        store.name.toLowerCase().includes(q) ||
        (store.ownerName || "").toLowerCase().includes(q) ||
        store.address.toLowerCase().includes(q) ||
        store.phone.toLowerCase().includes(q);

      const matchesFilter =
        availabilityFilter === "all" ||
        (availabilityFilter === "with-products" && count > 0) ||
        (availabilityFilter === "without-products" && count === 0);

      return matchesSearch && matchesFilter;
    });
  }, [stores, productCountByStore, search, availabilityFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, availabilityFilter, stores.length]);

  const totalPages = Math.max(
    Math.ceil(filteredStores.length / rowsPerPage),
    1,
  );
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedStores = filteredStores.slice(
    startIndex,
    startIndex + rowsPerPage,
  );

  const handleStoreSubmit = async (e) => {
    e.preventDefault();

    if (
      !storeForm.name.trim() ||
      !storeForm.ownerName.trim() ||
      !storeForm.address.trim() ||
      !storeForm.phone.trim() ||
      !storeForm.categoryId
    ) {
      setFeedback("يرجى إدخال كل بيانات المتجر واختيار القسم.");
      return;
    }

    try {
      setIsSubmittingStore(true);
      await addStore(storeForm);
      setStoreForm({
        name: "",
        ownerName: "",
        address: "",
        description: "",
        phone: "",
        categoryId: "",
      });
      setFeedback("تمت إضافة المتجر بنجاح.");
      setIsAddModalOpen(false);
    } catch (error) {
      setFeedback(error.message || "تعذر إضافة المتجر.");
    } finally {
      setIsSubmittingStore(false);
    }
  };

  const startEdit = (store) => {
    setEditingStoreId(store.id);
    setEditForm({
      name: store.name,
      ownerName: store.ownerName || "",
      address: store.address,
      description: store.description || "",
      phone: store.phone,
      categoryId: store.categoryId ? String(store.categoryId) : "",
    });
    setFeedback("");
  };

  const cancelEdit = () => {
    setEditingStoreId(null);
    setEditForm({
      name: "",
      ownerName: "",
      address: "",
      description: "",
      phone: "",
      categoryId: "",
    });
  };

  const saveEdit = async (storeId) => {
    if (
      !editForm.name.trim() ||
      !editForm.ownerName.trim() ||
      !editForm.address.trim() ||
      !editForm.phone.trim() ||
      !editForm.categoryId
    ) {
      setFeedback("يرجى إدخال كل بيانات المتجر واختيار القسم قبل الحفظ.");
      return;
    }

    try {
      setSavingStoreId(storeId);
      await updateStore({ id: storeId, ...editForm });
      setFeedback("تم تحديث بيانات المتجر بنجاح.");
      cancelEdit();
    } catch (error) {
      setFeedback(error.message || "تعذر تحديث بيانات المتجر.");
    } finally {
      setSavingStoreId(null);
    }
  };

  const handleDeleteStore = async (store) => {
    const confirmed = window.confirm(`هل أنت متأكد من حذف متجر ${store.name}؟`);
    if (!confirmed) {
      return;
    }

    try {
      setDeletingStoreId(store.id);
      await deleteStore(store.id);
      setFeedback("تم حذف المتجر بنجاح.");
      if (currentPage > 1 && paginatedStores.length === 1) {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      }
    } catch (error) {
      setFeedback(error.message || "تعذر حذف المتجر.");
    } finally {
      setDeletingStoreId(null);
    }
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-gray-900">إدارة المتاجر</h1>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary whitespace-nowrap"
        >
          + إضافة متجر جديد
        </button>
      </div>

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

      {feedback && (
        <div className="p-3 rounded-lg bg-gray-100 border border-gray-200 text-sm text-gray-700">
          {feedback}
        </div>
      )}

      <section className="border border-gray-200 rounded-xl p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">كل المتاجر</h2>

        {filteredStores.length === 0 ? (
          <p className="text-sm text-gray-500">لا توجد نتائج مطابقة.</p>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-gray-600 border-b border-gray-200">
                    <th className="text-right py-2">اسم المتجر</th>
                    <th className="text-right py-2">صاحب المتجر</th>
                    <th className="text-right py-2">العنوان</th>
                    <th className="text-right py-2">الهاتف</th>
                    <th className="text-right py-2">القسم</th>
                    <th className="text-right py-2">عدد المنتجات</th>
                    <th className="text-right py-2">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStores.map((store) => {
                    const isEditing = editingStoreId === store.id;
                    return (
                      <tr key={store.id} className="border-b border-gray-100">
                        <td className="py-3 text-gray-900 font-medium">
                          {isEditing ? (
                            <input
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              className="input-field py-2"
                            />
                          ) : (
                            store.name
                          )}
                        </td>
                        <td className="py-3 text-gray-700">
                          {isEditing ? (
                            <input
                              value={editForm.ownerName}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  ownerName: e.target.value,
                                }))
                              }
                              className="input-field py-2"
                            />
                          ) : (
                            store.ownerName
                          )}
                        </td>
                        <td className="py-3 text-gray-700">
                          {isEditing ? (
                            <input
                              value={editForm.address}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  address: e.target.value,
                                }))
                              }
                              className="input-field py-2"
                            />
                          ) : (
                            store.address
                          )}
                        </td>
                        <td className="py-3 text-gray-700">
                          {isEditing ? (
                            <input
                              value={editForm.phone}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  phone: e.target.value,
                                }))
                              }
                              className="input-field py-2"
                            />
                          ) : (
                            store.phone
                          )}
                        </td>
                        <td className="py-3 text-gray-700">
                          {isEditing ? (
                            <select
                              value={editForm.categoryId}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  categoryId: e.target.value,
                                }))
                              }
                              className="input-field py-2"
                            >
                              <option value="">اختر القسم</option>
                              {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            store.category?.name || "—"
                          )}
                        </td>
                        <td className="py-3 text-gray-700">
                          {productCountByStore[String(store.id)] || 0}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => saveEdit(store.id)}
                                  disabled={savingStoreId === store.id}
                                  className="px-3 py-2 text-xs rounded-md bg-emerald-600 text-white disabled:opacity-60 flex items-center gap-1.5"
                                >
                                  {savingStoreId === store.id && <Spinner />}
                                  {savingStoreId === store.id
                                    ? "جاري الحفظ..."
                                    : "حفظ"}
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  disabled={savingStoreId === store.id}
                                  className="px-3 py-2 text-xs rounded-md border border-gray-300 text-gray-700 disabled:opacity-60"
                                >
                                  إلغاء
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => startEdit(store)}
                                  disabled={deletingStoreId === store.id}
                                  className="px-3 py-2 text-xs rounded-md border border-blue-300 text-blue-700 bg-blue-50 disabled:opacity-60"
                                >
                                  تعديل
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteStore(store)}
                                  disabled={deletingStoreId === store.id}
                                  className="px-3 py-2 text-xs rounded-md border border-red-300 text-red-700 bg-red-50 disabled:opacity-60 flex items-center gap-1.5"
                                >
                                  {deletingStoreId === store.id && (
                                    <Spinner className="w-3.5 h-3.5 border-2 border-red-300/40 border-t-red-700" />
                                  )}
                                  {deletingStoreId === store.id
                                    ? "جاري الحذف..."
                                    : "حذف"}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                صفحة {currentPage} من {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-3 py-2 text-sm rounded-md border border-gray-300 disabled:opacity-50"
                >
                  السابق
                </button>
                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-2 text-sm rounded-md border border-gray-300 disabled:opacity-50"
                >
                  التالي
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => !isSubmittingStore && setIsAddModalOpen(false)}
        title="إضافة متجر جديد"
      >
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
            value={storeForm.ownerName}
            onChange={(e) =>
              setStoreForm((prev) => ({ ...prev, ownerName: e.target.value }))
            }
            placeholder="اسم صاحب المتجر"
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
          <select
            value={storeForm.categoryId}
            onChange={(e) =>
              setStoreForm((prev) => ({
                ...prev,
                categoryId: e.target.value,
              }))
            }
            className="input-field"
          >
            <option value="">اختر القسم</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <textarea
            value={storeForm.description}
            onChange={(e) =>
              setStoreForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="وصف المتجر (اختياري)"
            rows={3}
            className="input-field"
          />
          <button
            type="submit"
            disabled={isSubmittingStore}
            className="btn-primary w-full disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmittingStore && <Spinner />}
            {isSubmittingStore ? "جاري الإضافة..." : "إضافة المتجر"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
