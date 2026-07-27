import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import apiClient from "../utils/api";
import { useAuth } from "./AuthContext";

export const AdminContext = createContext(null);

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
  return (
    error?.response?.data?.message || error?.message || "حدث خطأ غير متوقع"
  );
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
  const [productPagination, setProductPagination] =
    useState(DEFAULT_PAGINATION);
  const [orderPagination, setOrderPagination] = useState(DEFAULT_PAGINATION);
  const [productQuery, setProductQuery] = useState({ page: 1, limit: 10 });
  const [orderQuery, setOrderQuery] = useState({ page: 1, limit: 10 });
  const productQueryRef = useRef(productQuery);
  const orderQueryRef = useRef(orderQuery);

  const loadStores = useCallback(async () => {
    const { data } = await apiClient.get("/admin/stores");
    setStores(Array.isArray(data.stores) ? data.stores : []);
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
      return;
    }

    Promise.all([
      loadStores(),
      loadProducts({ page: 1 }),
      loadOrders({ page: 1 }),
    ]).catch(() => {
      setStores([]);
      setProducts([]);
      setOrders([]);
    });
  }, [isLoggedIn, user?.role, loadStores, loadProducts, loadOrders]);

  const addStore = async ({ name, address, phone }) => {
    try {
      await apiClient.post("/admin/stores", {
        name: name.trim(),
        address: address.trim(),
        phone: phone.trim(),
      });
      await loadStores();
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

  const updateStore = async ({ id, name, address, phone }) => {
    try {
      await apiClient.put(`/admin/stores/${id}`, {
        name: name.trim(),
        address: address.trim(),
        phone: phone.trim(),
      });
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

  const addProduct = async ({ storeId, name, price, stock, category }) => {
    try {
      await apiClient.post("/admin/products", {
        storeId: Number(storeId),
        name: name.trim(),
        category: category.trim(),
        price: Number(price),
        stock: Number(stock),
      });
      await loadProducts({ page: 1 });
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

  const value = useMemo(
    () => ({
      stores,
      products,
      orders,
      productPagination,
      orderPagination,
      orderStatuses: Object.values(ORDER_STATUS_LABELS),
      loadStores,
      loadProducts,
      loadOrders,
      addStore,
      updateStore,
      deleteStore,
      addProduct,
      updateOrderStatus,
    }),
    [
      stores,
      products,
      orders,
      productPagination,
      orderPagination,
      loadStores,
      loadProducts,
      loadOrders,
      addStore,
      updateStore,
      deleteStore,
      addProduct,
      updateOrderStatus,
    ],
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
