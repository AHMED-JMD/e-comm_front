import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AdminContext = createContext(null);

const STORAGE_KEY = "adminPortalData";

const ORDER_STATUSES = ["جاري العمل", "تم الشحن", "تم الاستلام"];

const defaultData = {
  stores: [],
  products: [],
  orders: [
    {
      id: "ord-1001",
      storeId: "",
      customerName: "أحمد محمود",
      total: 1450,
      itemsCount: 3,
      status: "جاري العمل",
      createdAt: new Date().toISOString(),
    },
    {
      id: "ord-1002",
      storeId: "",
      customerName: "سارة علي",
      total: 799,
      itemsCount: 1,
      status: "تم الشحن",
      createdAt: new Date().toISOString(),
    },
  ],
};

function readStoredData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultData;
    }

    const parsed = JSON.parse(raw);
    return {
      stores: Array.isArray(parsed.stores) ? parsed.stores : [],
      products: Array.isArray(parsed.products) ? parsed.products : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : defaultData.orders,
    };
  } catch {
    return defaultData;
  }
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AdminProvider({ children }) {
  const [data, setData] = useState(readStoredData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addStore = ({ name, address, phone }) => {
    const nextStore = {
      id: createId("store"),
      name: name.trim(),
      address: address.trim(),
      phone: phone.trim(),
      createdAt: new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      stores: [nextStore, ...prev.stores],
    }));
  };

  const addProduct = ({ storeId, name, price, stock, category }) => {
    const nextProduct = {
      id: createId("prod"),
      storeId,
      name: name.trim(),
      price: Number(price),
      stock: Number(stock),
      category: category.trim(),
      createdAt: new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      products: [nextProduct, ...prev.products],
    }));
  };

  const updateOrderStatus = (orderId, status) => {
    if (!ORDER_STATUSES.includes(status)) {
      return;
    }

    setData((prev) => ({
      ...prev,
      orders: prev.orders.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    }));
  };

  const value = useMemo(
    () => ({
      stores: data.stores,
      products: data.products,
      orders: data.orders,
      orderStatuses: ORDER_STATUSES,
      addStore,
      addProduct,
      updateOrderStatus,
    }),
    [data],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }

  return context;
}
