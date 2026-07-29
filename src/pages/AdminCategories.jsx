import { useMemo, useState } from "react";
import { useAdmin } from "../context/useAdmin";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";

export default function AdminCategories() {
  const {
    categories,
    stores,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useAdmin();
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [savingCategoryId, setSavingCategoryId] = useState(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });
  const [editForm, setEditForm] = useState({ name: "", description: "" });

  const usageCountByCategory = useMemo(() => {
    return categories.reduce((acc, category) => {
      const storesCount = stores.filter(
        (store) => store.categoryId === category.id,
      ).length;
      const productsCount = products.filter(
        (product) => product.categoryId === category.id,
      ).length;
      acc[category.id] = storesCount + productsCount;
      return acc;
    }, {});
  }, [categories, stores, products]);

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(q) ||
        (category.description || "").toLowerCase().includes(q),
    );
  }, [categories, search]);

  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    if (!categoryForm.name.trim()) {
      setFeedback("يرجى إدخال اسم القسم.");
      return;
    }

    try {
      setIsSubmittingCategory(true);
      await addCategory(categoryForm);
      setCategoryForm({ name: "", description: "" });
      setFeedback("تمت إضافة القسم بنجاح.");
      setIsAddModalOpen(false);
    } catch (error) {
      setFeedback(error.message || "تعذر إضافة القسم.");
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  const startEdit = (category) => {
    setEditingCategoryId(category.id);
    setEditForm({
      name: category.name,
      description: category.description || "",
    });
    setFeedback("");
  };

  const cancelEdit = () => {
    setEditingCategoryId(null);
    setEditForm({ name: "", description: "" });
  };

  const saveEdit = async (categoryId) => {
    if (!editForm.name.trim()) {
      setFeedback("يرجى إدخال اسم القسم قبل الحفظ.");
      return;
    }

    try {
      setSavingCategoryId(categoryId);
      await updateCategory({ id: categoryId, ...editForm });
      setFeedback("تم تحديث القسم بنجاح.");
      cancelEdit();
    } catch (error) {
      setFeedback(error.message || "تعذر تحديث القسم.");
    } finally {
      setSavingCategoryId(null);
    }
  };

  const handleDeleteCategory = async (category) => {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف قسم ${category.name}؟`,
    );
    if (!confirmed) return;

    try {
      setDeletingCategoryId(category.id);
      await deleteCategory(category.id);
      setFeedback("تم حذف القسم بنجاح.");
    } catch (error) {
      setFeedback(error.message || "تعذر حذف القسم.");
    } finally {
      setDeletingCategoryId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-gray-900">إدارة الأقسام</h1>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary whitespace-nowrap"
        >
          + إضافة قسم جديد
        </button>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field"
        placeholder="ابحث باسم القسم أو الوصف"
      />

      {feedback && (
        <div className="p-3 rounded-lg bg-gray-100 border border-gray-200 text-sm text-gray-700">
          {feedback}
        </div>
      )}

      <section className="border border-gray-200 rounded-xl p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">كل الأقسام</h2>

        {filteredCategories.length === 0 ? (
          <p className="text-sm text-gray-500">لا توجد أقسام مطابقة.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-600 border-b border-gray-200">
                  <th className="text-right py-2">اسم القسم</th>
                  <th className="text-right py-2">الوصف</th>
                  <th className="text-right py-2">قيد الاستخدام</th>
                  <th className="text-right py-2">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => {
                  const isEditing = editingCategoryId === category.id;
                  return (
                    <tr key={category.id} className="border-b border-gray-100">
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
                          category.name
                        )}
                      </td>
                      <td className="py-3 text-gray-700">
                        {isEditing ? (
                          <input
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            className="input-field py-2"
                          />
                        ) : (
                          category.description || "—"
                        )}
                      </td>
                      <td className="py-3 text-gray-700">
                        {usageCountByCategory[category.id] || 0}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => saveEdit(category.id)}
                                disabled={savingCategoryId === category.id}
                                className="px-3 py-2 text-xs rounded-md bg-emerald-600 text-white disabled:opacity-60 flex items-center gap-1.5"
                              >
                                {savingCategoryId === category.id && (
                                  <Spinner />
                                )}
                                {savingCategoryId === category.id
                                  ? "جاري الحفظ..."
                                  : "حفظ"}
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                disabled={savingCategoryId === category.id}
                                className="px-3 py-2 text-xs rounded-md border border-gray-300 text-gray-700 disabled:opacity-60"
                              >
                                إلغاء
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => startEdit(category)}
                                disabled={deletingCategoryId === category.id}
                                className="px-3 py-2 text-xs rounded-md border border-blue-300 text-blue-700 bg-blue-50 disabled:opacity-60"
                              >
                                تعديل
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(category)}
                                disabled={deletingCategoryId === category.id}
                                className="px-3 py-2 text-xs rounded-md border border-red-300 text-red-700 bg-red-50 disabled:opacity-60 flex items-center gap-1.5"
                              >
                                {deletingCategoryId === category.id && (
                                  <Spinner className="w-3.5 h-3.5 border-2 border-red-300/40 border-t-red-700" />
                                )}
                                {deletingCategoryId === category.id
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
        )}
      </section>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => !isSubmittingCategory && setIsAddModalOpen(false)}
        title="إضافة قسم جديد"
      >
        <form onSubmit={handleCategorySubmit} className="space-y-3">
          <input
            type="text"
            value={categoryForm.name}
            onChange={(e) =>
              setCategoryForm((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="اسم القسم"
            className="input-field"
          />
          <textarea
            value={categoryForm.description}
            onChange={(e) =>
              setCategoryForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="الوصف (اختياري)"
            className="input-field"
            rows={3}
          />

          <button
            type="submit"
            disabled={isSubmittingCategory}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmittingCategory && <Spinner />}
            {isSubmittingCategory ? "جاري الإضافة..." : "إضافة القسم"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
