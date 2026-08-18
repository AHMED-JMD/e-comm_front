import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import apiClient, { extractApiError } from "../utils/api";
import { useAuth } from "./AuthContext";
import { AdminContext } from "./useAdmin";

const ORDER_STATUS_LABELS = {
  pending: "قيد الانتظار",
  processing: "جاري العمل",
  shipped: "تم الشحن",
  delivered: "تم الاستلام",
  cancelled: "ملغي",
};

const ORDER_STATUS_API = Object.fromEntries(
  Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => [label, key]),
);

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 1,
};

function extractErrorMessage(error) {
  return extractApiError(error);
}

function normalizeOrder(rawOrder) {
  return {
    ...rawOrder,
    id: rawOrder.orderNumber || String(rawOrder.id),
    rawId: rawOrder.id,
    storeId: String(rawOrder.storeId),
    total: Number(rawOrder.totalAmount || 0),
    status: ORDER_STATUS_LABELS[rawOrder.status] || rawOrder.status,
    backendStatus: rawOrder.status,
  };
}

export function AdminProvider({ children }) {
  const { isLoggedIn, user } = useAuth();
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [productPagination, setProductPagination] =
    useState(DEFAULT_PAGINATION);
  const [orderPagination, setOrderPagination] = useState(DEFAULT_PAGINATION);
  const [reviewsPagination, setReviewsPagination] =
    useState(DEFAULT_PAGINATION);
  const [productQuery, setProductQuery] = useState({ page: 1, limit: 10 });
  const [orderQuery, setOrderQuery] = useState({ page: 1, limit: 10 });
  const productQueryRef = useRef(productQuery);
  const orderQueryRef = useRef(orderQuery);
  const reviewQueryRef = useRef({ page: 1, limit: 10 });

  const loadStores = useCallback(async () => {
    const { data } = await apiClient.get("/admin/stores");
    setStores(Array.isArray(data.stores) ? data.stores : []);
  }, []);

  const loadCategories = useCallback(async () => {
    const { data } = await apiClient.get("/admin/categories");
    setCategories(Array.isArray(data.categories) ? data.categories : []);
  }, []);

  const loadReviews = useCallback(async (nextQuery = {}) => {
    const mergedQuery = { ...reviewQueryRef.current, ...nextQuery };
    const { data } = await apiClient.get("/admin/reviews", {
      params: mergedQuery,
    });

    setReviews(Array.isArray(data.reviews) ? data.reviews : []);
    setReviewsPagination(data.pagination || DEFAULT_PAGINATION);
    reviewQueryRef.current = mergedQuery;
  }, []);

  const loadProducts = useCallback(async (nextQuery = {}) => {
    const mergedQuery = { ...productQueryRef.current, ...nextQuery };
    const { data } = await apiClient.get("/admin/products", {
      params: mergedQuery,
    });

    setProducts(Array.isArray(data.products) ? data.products : []);
    setProductPagination(data.pagination || DEFAULT_PAGINATION);
    productQueryRef.current = mergedQuery;
    setProductQuery(mergedQuery);
  }, []);

  const loadOrders = useCallback(async (nextQuery = {}) => {
    const mergedQuery = { ...orderQueryRef.current, ...nextQuery };
    const apiQuery = {
      ...mergedQuery,
      status: mergedQuery.status
        ? ORDER_STATUS_API[mergedQuery.status] || mergedQuery.status
        : undefined,
    };

    const { data } = await apiClient.get("/admin/orders", {
      params: apiQuery,
    });

    const normalizedOrders = Array.isArray(data.orders)
      ? data.orders.map(normalizeOrder)
      : [];

    setOrders(normalizedOrders);
    setOrderPagination(data.pagination || DEFAULT_PAGINATION);
    orderQueryRef.current = mergedQuery;
    setOrderQuery(mergedQuery);
  }, []);

  useEffect(() => {
    if (!isLoggedIn || user?.role !== "admin") {
      setStores([]);
      setProducts([]);
      setOrders([]);
      setCategories([]);
      setReviews([]);
      return;
    }

    Promise.all([
      loadStores(),
      loadProducts({ page: 1 }),
      loadOrders({ page: 1 }),
      loadCategories(),
      loadReviews({ page: 1 }),
    ]).catch(() => {
      setStores([]);
      setProducts([]);
      setOrders([]);
      setCategories([]);
      setReviews([]);
    });
  }, [
    isLoggedIn,
    user?.role,
    loadStores,
    loadProducts,
    loadOrders,
    loadCategories,
    loadReviews,
  ]);

  const addCategory = async ({ name, description, icon, color }) => {
    try {
      await apiClient.post("/admin/categories", {
        name: name.trim(),
        description: description ? description.trim() : undefined,
        icon: icon || undefined,
        color: color || undefined,
      });
      await loadCategories();
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

  const updateCategory = async ({ id, name, description, icon, color }) => {
    try {
      await apiClient.put(`/admin/categories/${id}`, {
        name: name.trim(),
        description: description ? description.trim() : undefined,
        icon: icon || undefined,
        color: color || undefined,
      });
      await loadCategories();
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

  const deleteCategory = async (id) => {
    try {
      await apiClient.delete(`/admin/categories/${id}`);
      setCategories((prev) => prev.filter((category) => category.id !== id));
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

  const buildStorePayload = ({
    name,
    ownerName,
    address,
    description,
    phone,
    categoryIds,
  }) => ({
    name: name.trim(),
    ownerName: ownerName.trim(),
    address: address.trim(),
    description: description ? description.trim() : undefined,
    phone: phone.trim(),
    categoryIds: (categoryIds || []).map(Number),
  });

  const addStore = async (store) => {
    try {
      await apiClient.post("/admin/stores", buildStorePayload(store));
      await loadStores();
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

  const updateStore = async ({ id, ...store }) => {
    try {
      await apiClient.put(`/admin/stores/${id}`, buildStorePayload(store));
      await loadStores();
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

  const deleteStore = async (id) => {
    try {
      await apiClient.delete(`/admin/stores/${id}`);
      setStores((prev) => prev.filter((store) => store.id !== id));
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

  const addProduct = async ({
    storeId,
    name,
    price,
    stock,
    categoryId,
    image,
  }) => {
    try {
      const formData = new FormData();
      formData.append("storeId", Number(storeId));
      formData.append("name", name.trim());
      formData.append("categoryId", Number(categoryId));
      formData.append("price", Number(price));
      formData.append("stock", Number(stock));
      if (image) {
        formData.append("image", image);
      }

      await apiClient.post("/admin/products", formData, {
        headers: { "Content-Type": undefined },
      });
      await loadProducts({ page: 1 });
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

  const updateProduct = async ({
    id,
    storeId,
    name,
    price,
    stock,
    categoryId,
  }) => {
    try {
      await apiClient.put(`/admin/products/${id}`, {
        storeId: Number(storeId),
        name: name.trim(),
        categoryId: Number(categoryId),
        price: Number(price),
        stock: Number(stock),
      });
      await loadProducts({ page: productQueryRef.current.page || 1 });
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

  const deleteProduct = async (id) => {
    try {
      await apiClient.delete(`/admin/products/${id}`);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

  const updateProductImage = async (id, file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await apiClient.patch(
        `/admin/products/${id}/image`,
        formData,
        { headers: { "Content-Type": undefined } },
      );

      setProducts((prev) =>
        prev.map((product) =>
          product.id === id
            ? { ...product, image: data.product.image }
            : product,
        ),
      );

      return data.product;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

  const removeProductImage = async (id) => {
    try {
      const { data } = await apiClient.delete(`/admin/products/${id}/image`);

      setProducts((prev) =>
        prev.map((product) =>
          product.id === id
            ? { ...product, image: data.product.image }
            : product,
        ),
      );

      return data.product;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

  const updateOrderStatus = async (orderId, statusLabel) => {
    const status = ORDER_STATUS_API[statusLabel] || statusLabel;

    try {
      await apiClient.patch(`/admin/orders/${orderId}/status`, { status });

      setOrders((prev) =>
        prev.map((order) =>
          order.rawId === orderId
            ? {
                ...order,
                status: ORDER_STATUS_LABELS[status] || status,
                backendStatus: status,
              }
            : order,
        ),
      );
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

  const deleteReview = async (id) => {
    try {
      await apiClient.delete(`/admin/reviews/${id}`);
      await loadReviews();
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

  const value = useMemo(
    () => ({
      stores,
      products,
      orders,
      categories,
      reviews,
      productPagination,
      orderPagination,
      reviewsPagination,
      orderStatuses: Object.values(ORDER_STATUS_LABELS),
      loadStores,
      loadProducts,
      loadOrders,
      loadCategories,
      loadReviews,
      deleteReview,
      addStore,
      updateStore,
      deleteStore,
      addProduct,
      updateProduct,
      deleteProduct,
      updateProductImage,
      removeProductImage,
      addCategory,
      updateCategory,
      deleteCategory,
      updateOrderStatus,
    }),
    [
      stores,
      products,
      orders,
      categories,
      reviews,
      productPagination,
      orderPagination,
      reviewsPagination,
      loadStores,
      loadProducts,
      loadOrders,
      loadCategories,
      loadReviews,
      deleteReview,
      addStore,
      updateStore,
      deleteStore,
      addProduct,
      updateProduct,
      deleteProduct,
      updateProductImage,
      removeProductImage,
      addCategory,
      updateCategory,
      deleteCategory,
      updateOrderStatus,
    ],
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
