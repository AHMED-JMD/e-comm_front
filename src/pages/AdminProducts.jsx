import { useEffect, useMemo, useState } from "react";
import { FiBox, FiEdit2, FiImage, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import { useAdmin } from "../context/useAdmin";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import { StarRatingDisplay } from "../components/StarRating";
import DataTable, {
  TableAction,
  TablePagination,
} from "../components/DataTable";
import { getImageUrl } from "../utils/api";

function formatCurrency(value) {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "SDG",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function AdminProducts() {
  const {
    stores,
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductImage,
    removeProductImage,
    loadProducts,
    productPagination,
  } = useAdmin();
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");
  const [storeFilter, setStoreFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  const [isRemovingImage, setIsRemovingImage] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [editForm, setEditForm] = useState({
    storeId: "",
    name: "",
    price: "",
    stock: "",
    categoryId: "",
  });
  const [productForm, setProductForm] = useState({
    storeId: "",
    name: "",
    price: "",
    stock: "",
    categoryId: "",
  });

  const storeNameById = useMemo(() => {
    return stores.reduce((acc, store) => {
      acc[store.id] = store.name;
      return acc;
    }, {});
  }, [stores]);

  /** A store can now belong to several categories — a product picks one of them. */
  const storeCategoriesById = useMemo(() => {
    return stores.reduce((acc, store) => {
      acc[String(store.id)] = store.categories || [];
      return acc;
    }, {});
  }, [stores]);

  /**
   * Categories offered for a product: the ones its store belongs to, plus the
   * product's current category so an older assignment never silently vanishes.
   */
  const categoryOptionsFor = (storeId, ensureCategoryId) => {
    const storeCategories = storeCategoriesById[String(storeId)] || [];
    const options = storeCategories.length > 0 ? storeCategories : categories;

    if (
      ensureCategoryId &&
      !options.some((category) => String(category.id) === String(ensureCategoryId))
    ) {
      const current = categories.find(
        (category) => String(category.id) === String(ensureCategoryId),
      );
      if (current) return [...options, current];
    }

    return options;
  };

  const defaultCategoryFor = (storeId, currentCategoryId) => {
    const options = categoryOptionsFor(storeId);
    const stillValid = options.some(
      (category) => String(category.id) === String(currentCategoryId),
    );

    if (stillValid) return String(currentCategoryId);
    return options.length === 1 ? String(options[0].id) : "";
  };

  const categoryNameById = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  }, [categories]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview((prevUrl) => {
      if (prevUrl) {
        URL.revokeObjectURL(prevUrl);
      }
      return file ? URL.createObjectURL(file) : null;
    });
  };

  const resetImage = () => {
    setImageFile(null);
    setImagePreview((prevUrl) => {
      if (prevUrl) {
        URL.revokeObjectURL(prevUrl);
      }
      return null;
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadProducts({
        page: 1,
        limit: productPagination.limit || 10,
        search: search || undefined,
        storeId: storeFilter === "all" ? undefined : Number(storeFilter),
        categoryId:
          categoryFilter === "all" ? undefined : Number(categoryFilter),
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
      !productForm.categoryId ||
      Number(productForm.price) <= 0 ||
      Number(productForm.stock) < 0
    ) {
      setFeedback("يرجى إدخال بيانات منتج صحيحة.");
      return;
    }

    try {
      setIsSubmittingProduct(true);
      await addProduct({ ...productForm, image: imageFile });
      setProductForm({
        storeId: productForm.storeId,
        name: "",
        price: "",
        stock: "",
        categoryId: storeCategoryById[productForm.storeId] || "",
      });
      resetImage();
      setFeedback("تمت إضافة المنتج بنجاح.");
      setIsAddModalOpen(false);
    } catch (error) {
      setFeedback(error.message || "تعذر إضافة المنتج.");
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handlePreviewImageChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !previewProduct) return;

    try {
      setIsUpdatingImage(true);
      const updated = await updateProductImage(previewProduct.id, file);
      setPreviewProduct((prev) =>
        prev ? { ...prev, image: updated.image } : prev,
      );
      setFeedback("تم تحديث صورة المنتج بنجاح.");
    } catch (error) {
      setFeedback(error.message || "تعذر تحديث صورة المنتج.");
    } finally {
      setIsUpdatingImage(false);
    }
  };

  const handleRemoveProductImage = async () => {
    if (!previewProduct) return;

    try {
      setIsRemovingImage(true);
      const updated = await removeProductImage(previewProduct.id);
      setPreviewProduct((prev) =>
        prev ? { ...prev, image: updated.image } : prev,
      );
      setFeedback("تم حذف صورة المنتج بنجاح.");
    } catch (error) {
      setFeedback(error.message || "تعذر حذف صورة المنتج.");
    } finally {
      setIsRemovingImage(false);
    }
  };

  const startEditProduct = (product) => {
    setEditingProduct(product);
    setEditForm({
      storeId: String(product.storeId),
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
      categoryId: product.categoryId ? String(product.categoryId) : "",
    });
    setFeedback("");
  };

  const handleNewProductStoreChange = (e) => {
    const nextStoreId = e.target.value;
    setProductForm((prev) => ({
      ...prev,
      storeId: nextStoreId,
      categoryId: defaultCategoryFor(nextStoreId, prev.categoryId),
    }));
  };

  const handleEditProductStoreChange = (e) => {
    const nextStoreId = e.target.value;
    setEditForm((prev) => ({
      ...prev,
      storeId: nextStoreId,
      categoryId: defaultCategoryFor(nextStoreId, prev.categoryId),
    }));
  };

  const cancelEditProduct = () => {
    setEditingProduct(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (
      !editForm.storeId ||
      !editForm.name.trim() ||
      !editForm.categoryId ||
      Number(editForm.price) <= 0 ||
      Number(editForm.stock) < 0
    ) {
      setFeedback("يرجى إدخال بيانات منتج صحيحة.");
      return;
    }

    try {
      setIsSavingProduct(true);
      await updateProduct({ id: editingProduct.id, ...editForm });
      setFeedback("تم تحديث المنتج بنجاح.");
      setEditingProduct(null);
    } catch (error) {
      setFeedback(error.message || "تعذر تحديث المنتج.");
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف منتج ${product.name}؟`,
    );
    if (!confirmed) {
      return;
    }

    try {
      setDeletingProductId(product.id);
      await deleteProduct(product.id);
      setFeedback("تم حذف المنتج بنجاح.");
    } catch (error) {
      setFeedback(error.message || "تعذر حذف المنتج.");
    } finally {
      setDeletingProductId(null);
    }
  };

  const productColumns = [
    {
      key: "product",
      header: "المنتج",
      render: (product) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPreviewProduct(product)}
            className="w-12 h-12 shrink-0 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center hover:opacity-80 transition-opacity"
            title="عرض / تغيير الصورة"
          >
            {product.image ? (
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <FiImage className="text-gray-400" size={18} />
            )}
          </button>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 line-clamp-1">
              {product.name}
            </p>
            <p className="text-xs text-gray-500 line-clamp-1">
              {storeNameById[product.storeId] || "متجر غير محدد"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "القسم",
      render: (product) => (
        <span className="badge-pill bg-pink-50 text-pink-700">
          {categoryNameById[product.categoryId] || product.category}
        </span>
      ),
    },
    {
      key: "price",
      header: "السعر",
      render: (product) => (
        <span className="font-display font-black text-gray-900">
          {formatCurrency(product.price)}
        </span>
      ),
    },
    {
      key: "stock",
      header: "المخزون",
      render: (product) => {
        const stock = Number(product.stock);
        const tone =
          stock <= 0
            ? "bg-red-50 text-red-700"
            : stock <= 5
              ? "bg-amber-50 text-amber-700"
              : "bg-green-50 text-green-700";

        return (
          <span className={`badge-pill ${tone}`}>
            {stock <= 0 ? "نفدت الكمية" : `${stock} قطعة`}
          </span>
        );
      },
    },
    {
      key: "rating",
      header: "التقييم",
      render: (product) =>
        product.ratingCount > 0 ? (
          <StarRatingDisplay
            value={product.ratingAvg}
            count={product.ratingCount}
            size="xs"
          />
        ) : (
          <span className="text-xs text-gray-400">لا يوجد تقييم</span>
        ),
    },
    {
      key: "actions",
      header: "الإجراءات",
      render: (product) => (
        <div className="flex items-center gap-2">
          <TableAction
            title="الصورة"
            tone="gray"
            onClick={() => setPreviewProduct(product)}
          >
            <FiImage size={15} />
          </TableAction>
          <TableAction
            title="تعديل"
            onClick={() => startEditProduct(product)}
            disabled={deletingProductId === product.id}
          >
            <FiEdit2 size={15} />
          </TableAction>
          <TableAction
            title="حذف"
            tone="red"
            loading={deletingProductId === product.id}
            onClick={() => handleDeleteProduct(product)}
            disabled={deletingProductId === product.id}
          >
            <FiTrash2 size={15} />
          </TableAction>
        </div>
      ),
    },
  ];

  const goToPage = (nextPage) => {
    loadProducts({
      page: nextPage,
      limit: productPagination.limit || 10,
      search: search || undefined,
      storeId: storeFilter === "all" ? undefined : Number(storeFilter),
      categoryId: categoryFilter === "all" ? undefined : Number(categoryFilter),
    }).catch(() => undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">إدارة المنتجات</h1>
          <p className="text-sm text-gray-500 mt-1">
            أقسام المنتج تُشتق من أقسام المتجر الذي ينتمي إليه.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          disabled={stores.length === 0}
          className="btn-primary whitespace-nowrap inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiPlus />
          إضافة منتج جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <FiSearch className="absolute top-1/2 -translate-y-1/2 right-4 text-pink-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pr-11"
            placeholder="ابحث باسم المنتج أو التصنيف"
          />
        </div>
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
          <option value="all">كل الأقسام</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {stores.length === 0 && (
        <p className="text-xs text-amber-700">
          يجب إضافة متجر أولاً قبل إضافة المنتجات.
        </p>
      )}

      {feedback && (
        <div className="p-3 rounded-2xl bg-pink-50 border border-pink-100 text-sm text-pink-800">
          {feedback}
        </div>
      )}

      <DataTable
        columns={productColumns}
        rows={products}
        emptyTitle="لا توجد منتجات"
        emptyDescription="لم يتم العثور على منتجات مطابقة للفلاتر الحالية."
        emptyIcon={<FiBox size={28} />}
        footer={
          <TablePagination
            page={productPagination.page}
            totalPages={productPagination.totalPages}
            onChange={goToPage}
          />
        }
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          if (isSubmittingProduct) return;
          setIsAddModalOpen(false);
        }}
        title="إضافة منتج جديد"
      >
        <form onSubmit={handleProductSubmit} className="space-y-3">
          <select
            value={productForm.storeId}
            onChange={handleNewProductStoreChange}
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
          <select
            value={productForm.categoryId}
            onChange={(e) =>
              setProductForm((prev) => ({
                ...prev,
                categoryId: e.target.value,
              }))
            }
            className="input-field"
          >
            <option value="">اختر القسم</option>
            {categoryOptionsFor(productForm.storeId).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              صورة المنتج (اختياري)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="input-field"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="معاينة"
                className="w-20 h-20 rounded-md object-cover border border-gray-200"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={stores.length === 0 || isSubmittingProduct}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmittingProduct && <Spinner />}
            {isSubmittingProduct ? "جاري الإضافة..." : "إضافة المنتج"}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={!!previewProduct}
        onClose={() => {
          if (isUpdatingImage || isRemovingImage) return;
          setPreviewProduct(null);
        }}
        title={previewProduct ? previewProduct.name : "صورة المنتج"}
      >
        {previewProduct && (
          <div className="space-y-4">
            <div className="flex justify-center">
              {previewProduct.image ? (
                <img
                  src={getImageUrl(previewProduct.image)}
                  alt={previewProduct.name}
                  className="max-h-72 rounded-lg object-contain border border-gray-200"
                />
              ) : (
                <div className="w-full h-48 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
                  لا توجد صورة لهذا المنتج
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <label
                className={`btn-primary flex-1 text-center flex items-center justify-center gap-2 cursor-pointer ${
                  isUpdatingImage || isRemovingImage
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isUpdatingImage && <Spinner />}
                {isUpdatingImage
                  ? "جاري الرفع..."
                  : previewProduct.image
                    ? "تغيير الصورة"
                    : "إضافة صورة"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handlePreviewImageChange}
                  disabled={isUpdatingImage || isRemovingImage}
                  className="hidden"
                />
              </label>

              {previewProduct.image && (
                <button
                  type="button"
                  onClick={handleRemoveProductImage}
                  disabled={isUpdatingImage || isRemovingImage}
                  className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isRemovingImage && <Spinner />}
                  {isRemovingImage ? "جاري الحذف..." : "حذف الصورة"}
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!editingProduct}
        onClose={() => {
          if (isSavingProduct) return;
          cancelEditProduct();
        }}
        title="تعديل المنتج"
      >
        <form onSubmit={handleEditSubmit} className="space-y-3">
          <select
            value={editForm.storeId}
            onChange={handleEditProductStoreChange}
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
            value={editForm.name}
            onChange={(e) =>
              setEditForm((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="اسم المنتج"
            className="input-field"
          />
          <select
            value={editForm.categoryId}
            onChange={(e) =>
              setEditForm((prev) => ({ ...prev, categoryId: e.target.value }))
            }
            className="input-field"
          >
            <option value="">اختر القسم</option>
            {categoryOptionsFor(editForm.storeId, editForm.categoryId).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              min="1"
              value={editForm.price}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, price: e.target.value }))
              }
              placeholder="السعر"
              className="input-field"
            />
            <input
              type="number"
              min="0"
              value={editForm.stock}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, stock: e.target.value }))
              }
              placeholder="المخزون"
              className="input-field"
            />
          </div>

          <button
            type="submit"
            disabled={isSavingProduct}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSavingProduct && <Spinner />}
            {isSavingProduct ? "جاري الحفظ..." : "حفظ التعديلات"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
