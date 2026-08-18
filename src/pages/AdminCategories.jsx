import { useMemo, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import { useAdmin } from "../context/useAdmin";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CategoryIconBadge,
  DEFAULT_CATEGORY_COLOR,
  DEFAULT_CATEGORY_ICON,
  getCategoryColor,
} from "../utils/categoryIcons";

const EMPTY_FORM = {
  name: "",
  description: "",
  icon: DEFAULT_CATEGORY_ICON,
  color: DEFAULT_CATEGORY_COLOR,
};

/** Icon + colour picker shown inside the add/edit category modal. */
function CategoryAppearancePicker({ value, onChange }) {
  const palette = getCategoryColor(value.color);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-mesh-soft border border-black/[0.04]">
        <CategoryIconBadge icon={value.icon} color={value.color} size="lg" />
        <div className="min-w-0">
          <p className="text-xs text-gray-500 mb-1">معاينة القسم في الواجهة</p>
          <p className="font-bold text-gray-900 break-words">
            {value.name || "اسم القسم"}
          </p>
          <p className={`text-xs font-bold ${palette.text}`}>
            {palette.label}
          </p>
        </div>
      </div>

      <div>
        <p className="text-sm font-bold text-gray-700 mb-2">لون القسم</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_COLORS.map((color) => (
            <button
              key={color.key}
              type="button"
              onClick={() => onChange({ ...value, color: color.key })}
              title={color.label}
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color.gradient} transition-transform hover:scale-110 ${
                value.color === color.key
                  ? "ring-4 ring-offset-2 ring-blue-200 scale-110"
                  : ""
              }`}
              aria-label={color.label}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-bold text-gray-700 mb-2">
          أيقونة القسم
          <span className="font-medium text-gray-400 mr-2 text-xs">
            (تظهر للمستخدم في الصفحة الرئيسية)
          </span>
        </p>
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-56 overflow-y-auto p-2 rounded-2xl border-2 border-gray-100">
          {CATEGORY_ICONS.map((item) => {
            const ItemIcon = item.Icon;
            const isSelected = value.icon === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onChange({ ...value, icon: item.key })}
                title={item.label}
                className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                  isSelected
                    ? `bg-gradient-to-br ${palette.gradient} text-white shadow-md scale-105`
                    : "bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                }`}
                aria-label={item.label}
              >
                <ItemIcon size={20} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const usageCountByCategory = useMemo(() => {
    return categories.reduce((acc, category) => {
      const storesCount = stores.filter((store) =>
        (store.categories || []).some(
          (storeCategory) => storeCategory.id === category.id,
        ),
      ).length;
      const productsCount = products.filter(
        (product) => product.categoryId === category.id,
      ).length;
      acc[category.id] = storesCount + productsCount;
      return acc;
    }, {});
  }, [categories, stores, products]);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        (category.description || "").toLowerCase().includes(query),
    );
  }, [categories, search]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm(EMPTY_FORM);
    setFeedback("");
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      description: category.description || "",
      icon: category.icon || DEFAULT_CATEGORY_ICON,
      color: category.color || DEFAULT_CATEGORY_COLOR,
    });
    setFeedback("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setEditingCategory(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setFeedback("يرجى إدخال اسم القسم.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingCategory) {
        await updateCategory({ id: editingCategory.id, ...form });
        setFeedback("تم تحديث القسم بنجاح.");
      } else {
        await addCategory(form);
        setFeedback("تمت إضافة القسم بنجاح.");
      }

      setIsModalOpen(false);
      setEditingCategory(null);
      setForm(EMPTY_FORM);
    } catch (error) {
      setFeedback(error.message || "تعذر حفظ القسم.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`هل أنت متأكد من حذف قسم ${category.name}؟`)) return;

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">إدارة الأقسام</h1>
          <p className="text-sm text-gray-500 mt-1">
            الأيقونة واللون اللذان تختارهما هنا يظهران مباشرة في الصفحة الرئيسية.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="btn-primary whitespace-nowrap inline-flex items-center gap-2"
        >
          <FiPlus />
          إضافة قسم جديد
        </button>
      </div>

      <div className="relative">
        <FiSearch className="absolute top-1/2 -translate-y-1/2 right-4 text-blue-500" />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="input-field pr-11"
          placeholder="ابحث باسم القسم أو الوصف"
        />
      </div>

      {feedback && (
        <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 text-sm text-blue-800">
          {feedback}
        </div>
      )}

      {filteredCategories.length === 0 ? (
        <div className="text-center py-14 border-2 border-dashed border-gray-200 rounded-3xl">
          <div className="text-5xl mb-3">🗂️</div>
          <p className="text-gray-500">لا توجد أقسام مطابقة.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCategories.map((category) => {
            const palette = getCategoryColor(category.color);
            const usage = usageCountByCategory[category.id] || 0;

            return (
              <article
                key={category.id}
                className="relative overflow-hidden rounded-3xl border border-black/[0.04] bg-white shadow-card hover:shadow-card-hover transition-all p-5 group"
              >
                <span
                  className={`absolute -top-10 -left-10 w-28 h-28 rounded-full bg-gradient-to-br ${palette.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}
                />

                <div className="relative flex items-start gap-4">
                  <CategoryIconBadge
                    icon={category.icon}
                    color={category.color}
                    size="md"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 break-words">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                      {category.description || "بدون وصف"}
                    </p>
                    <span
                      className={`badge-pill ${palette.soft} ${palette.text} mt-3`}
                    >
                      {usage} عنصر مرتبط
                    </span>
                  </div>
                </div>

                <div className="relative flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => openEditModal(category)}
                    disabled={deletingCategoryId === category.id}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors disabled:opacity-60"
                  >
                    <FiEdit2 size={14} />
                    تعديل
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(category)}
                    disabled={deletingCategoryId === category.id}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-60"
                  >
                    {deletingCategoryId === category.id ? (
                      <Spinner className="w-3.5 h-3.5 border-2 border-red-300/40 border-t-red-700" />
                    ) : (
                      <FiTrash2 size={14} />
                    )}
                    حذف
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        size="lg"
        title={editingCategory ? "تعديل القسم" : "إضافة قسم جديد"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700">
              اسم القسم *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, name: event.target.value }))
              }
              placeholder="مثال: إلكترونيات"
              className="input-field"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700">
              الوصف (اختياري)
            </label>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  description: event.target.value,
                }))
              }
              placeholder="وصف مختصر يظهر في لوحة الإدارة"
              className="input-field !rounded-2xl"
              rows={2}
            />
          </div>

          <CategoryAppearancePicker value={form} onChange={setForm} />

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting && <Spinner />}
            {isSubmitting
              ? "جاري الحفظ..."
              : editingCategory
                ? "حفظ التعديلات"
                : "إضافة القسم"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
