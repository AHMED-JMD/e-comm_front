import { useEffect, useMemo, useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiHome,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import { useAdmin } from "../context/useAdmin";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import DataTable, {
  TableAction,
  TablePagination,
} from "../components/DataTable";
import { CategoryIconBadge, getCategoryColor } from "../utils/categoryIcons";

const EMPTY_FORM = {
  name: "",
  ownerName: "",
  address: "",
  description: "",
  phone: "",
  categoryIds: [],
};

const ROWS_PER_PAGE = 8;

/** Multi-select category chips — a store can sit in several categories. */
function CategoryMultiSelect({ categories, selectedIds, onChange }) {
  const toggle = (categoryId) => {
    onChange(
      selectedIds.includes(categoryId)
        ? selectedIds.filter((id) => id !== categoryId)
        : [...selectedIds, categoryId],
    );
  };

  if (categories.length === 0) {
    return (
      <p className="text-sm text-gray-500 p-3 rounded-2xl bg-amber-50 border border-amber-100">
        لا توجد أقسام معرّفة بعد، أضف قسماً أولاً من صفحة الأقسام.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-3 rounded-2xl border-2 border-gray-100 max-h-48 overflow-y-auto">
        {categories.map((category) => {
          const isSelected = selectedIds.includes(category.id);
          const palette = getCategoryColor(category.color);

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => toggle(category.id)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                isSelected
                  ? `bg-gradient-to-l ${palette.gradient} text-white border-transparent shadow-md`
                  : "bg-white border-gray-200 text-gray-700 hover:border-blue-300"
              }`}
            >
              <CategoryIconBadge
                icon={category.icon}
                color={category.color}
                size="sm"
                iconSize={13}
                className={`!w-6 !h-6 !rounded-lg ${isSelected ? "!bg-white/25 !bg-none !shadow-none" : ""}`}
              />
              {category.name}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-500">
        تم اختيار {selectedIds.length} قسم — يمكنك اختيار أكثر من قسم للمتجر
        الواحد.
      </p>
    </div>
  );
}

function StoreCategoryChips({ store }) {
  const categories = store.categories || [];

  if (categories.length === 0) {
    return <span className="text-gray-400">—</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {categories.map((category) => {
        const palette = getCategoryColor(category.color);
        return (
          <span
            key={category.id}
            className={`badge-pill ${palette.soft} ${palette.text}`}
          >
            <CategoryIconBadge
              icon={category.icon}
              color={category.color}
              size="sm"
              iconSize={11}
              className="!w-4 !h-4 !rounded !shadow-none"
            />
            {category.name}
          </span>
        );
      })}
    </div>
  );
}

export default function AdminStores() {
  const { stores, products, categories, addStore, updateStore, deleteStore } =
    useAdmin();

  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingStoreId, setDeletingStoreId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const productCountByStore = useMemo(() => {
    return products.reduce((acc, product) => {
      const key = String(product.storeId);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  const filteredStores = useMemo(() => {
    const query = search.trim().toLowerCase();

    return stores.filter((store) => {
      const count = productCountByStore[String(store.id)] || 0;
      const matchesSearch =
        query.length === 0 ||
        store.name.toLowerCase().includes(query) ||
        (store.ownerName || "").toLowerCase().includes(query) ||
        store.address.toLowerCase().includes(query) ||
        store.phone.toLowerCase().includes(query);

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "with-products" && count > 0) ||
        (availabilityFilter === "without-products" && count === 0);

      const matchesCategory =
        categoryFilter === "all" ||
        (store.categories || []).some(
          (category) => String(category.id) === categoryFilter,
        );

      return matchesSearch && matchesAvailability && matchesCategory;
    });
  }, [stores, productCountByStore, search, availabilityFilter, categoryFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, availabilityFilter, categoryFilter, stores.length]);

  const totalPages = Math.max(
    Math.ceil(filteredStores.length / ROWS_PER_PAGE),
    1,
  );
  const paginatedStores = filteredStores.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
  );

  const openCreateModal = () => {
    setEditingStore(null);
    setForm(EMPTY_FORM);
    setFeedback("");
    setIsModalOpen(true);
  };

  const openEditModal = (store) => {
    setEditingStore(store);
    setForm({
      name: store.name,
      ownerName: store.ownerName || "",
      address: store.address,
      description: store.description || "",
      phone: store.phone,
      categoryIds: (store.categories || []).map((category) => category.id),
    });
    setFeedback("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setEditingStore(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.ownerName.trim() ||
      !form.address.trim() ||
      !form.phone.trim()
    ) {
      setFeedback("يرجى إدخال كل بيانات المتجر.");
      return;
    }

    if (form.categoryIds.length === 0) {
      setFeedback("يرجى اختيار قسم واحد على الأقل للمتجر.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingStore) {
        await updateStore({ id: editingStore.id, ...form });
        setFeedback("تم تحديث بيانات المتجر بنجاح.");
      } else {
        await addStore(form);
        setFeedback("تمت إضافة المتجر بنجاح.");
      }

      closeModalAfterSave();
    } catch (error) {
      setFeedback(error.message || "تعذر حفظ بيانات المتجر.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModalAfterSave = () => {
    setIsModalOpen(false);
    setEditingStore(null);
    setForm(EMPTY_FORM);
  };

  const handleDeleteStore = async (store) => {
    if (!window.confirm(`هل أنت متأكد من حذف متجر ${store.name}؟`)) return;

    try {
      setDeletingStoreId(store.id);
      await deleteStore(store.id);
      setFeedback("تم حذف المتجر بنجاح.");
      if (currentPage > 1 && paginatedStores.length === 1) {
        setCurrentPage((previous) => Math.max(previous - 1, 1));
      }
    } catch (error) {
      setFeedback(error.message || "تعذر حذف المتجر.");
    } finally {
      setDeletingStoreId(null);
    }
  };

  const columns = [
    {
      key: "name",
      header: "المتجر",
      render: (store) => (
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-sm">
            <FiHome size={18} />
          </span>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 line-clamp-1">{store.name}</p>
            <p className="text-xs text-gray-500 line-clamp-1">
              {store.ownerName}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "categories",
      header: "الأقسام",
      render: (store) => <StoreCategoryChips store={store} />,
    },
    {
      key: "contact",
      header: "بيانات التواصل",
      render: (store) => (
        <div className="space-y-1">
          <p className="inline-flex items-center gap-1.5 text-gray-700" dir="ltr">
            <FiPhone size={13} className="text-blue-500" />
            {store.phone}
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-gray-500">
            <FiMapPin size={13} className="text-blue-500" />
            {store.address}
          </p>
        </div>
      ),
    },
    {
      key: "products",
      header: "المنتجات",
      render: (store) => {
        const count = productCountByStore[String(store.id)] || 0;
        return (
          <span
            className={`badge-pill ${count > 0 ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}
          >
            {count} منتج
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "الإجراءات",
      render: (store) => (
        <div className="flex items-center gap-2">
          <TableAction
            title="تعديل"
            onClick={() => openEditModal(store)}
            disabled={deletingStoreId === store.id}
          >
            <FiEdit2 size={15} />
          </TableAction>
          <TableAction
            title="حذف"
            tone="red"
            loading={deletingStoreId === store.id}
            onClick={() => handleDeleteStore(store)}
            disabled={deletingStoreId === store.id}
          >
            <FiTrash2 size={15} />
          </TableAction>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">إدارة المتاجر</h1>
          <p className="text-sm text-gray-500 mt-1">
            يمكن ربط المتجر الواحد بأكثر من قسم ليظهر في كل الأقسام المناسبة.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="btn-primary whitespace-nowrap inline-flex items-center gap-2"
        >
          <FiPlus />
          إضافة متجر جديد
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 relative">
          <FiSearch className="absolute top-1/2 -translate-y-1/2 right-4 text-blue-500" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input-field pr-11"
            placeholder="ابحث باسم المتجر أو العنوان أو الهاتف"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="input-field"
        >
          <option value="all">كل الأقسام</option>
          {categories.map((category) => (
            <option key={category.id} value={String(category.id)}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={availabilityFilter}
          onChange={(event) => setAvailabilityFilter(event.target.value)}
          className="input-field"
        >
          <option value="all">كل المتاجر</option>
          <option value="with-products">متاجر بها منتجات</option>
          <option value="without-products">متاجر بدون منتجات</option>
        </select>
      </div>

      {feedback && (
        <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 text-sm text-blue-800">
          {feedback}
        </div>
      )}

      <DataTable
        columns={columns}
        rows={paginatedStores}
        emptyTitle="لا توجد متاجر"
        emptyDescription="لم يتم العثور على متاجر مطابقة للبحث الحالي."
        emptyIcon={<FiHome size={28} />}
        footer={
          <TablePagination
            page={currentPage}
            totalPages={totalPages}
            onChange={setCurrentPage}
          />
        }
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        size="lg"
        title={editingStore ? "تعديل المتجر" : "إضافة متجر جديد"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                اسم المتجر *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
                placeholder="اسم المتجر"
                className="input-field"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                اسم صاحب المتجر *
              </label>
              <input
                type="text"
                value={form.ownerName}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    ownerName: event.target.value,
                  }))
                }
                placeholder="اسم المالك"
                className="input-field"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                رقم الهاتف *
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    phone: event.target.value,
                  }))
                }
                placeholder="09xxxxxxxx"
                className="input-field"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                العنوان *
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    address: event.target.value,
                  }))
                }
                placeholder="عنوان المتجر"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700">
              أقسام المتجر *
            </label>
            <CategoryMultiSelect
              categories={categories}
              selectedIds={form.categoryIds}
              onChange={(categoryIds) =>
                setForm((previous) => ({ ...previous, categoryIds }))
              }
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700">
              وصف المتجر (اختياري)
            </label>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  description: event.target.value,
                }))
              }
              placeholder="نبذة عن المتجر"
              rows={2}
              className="input-field !rounded-2xl"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting && <Spinner />}
            {isSubmitting
              ? "جاري الحفظ..."
              : editingStore
                ? "حفظ التعديلات"
                : "إضافة المتجر"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
