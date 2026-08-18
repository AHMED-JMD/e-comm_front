import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CART_STORAGE_KEY = "ecomm_cart_items_v2";

const CartContext = createContext(null);

/** Keeps only the fields checkout needs, straight from the shop API product. */
function normalizeProduct(product) {
  return {
    id: product.id,
    name: product.name,
    price: Number(product.price) || 0,
    image: product.image || null,
    stock: Number(product.stock) || 0,
    storeId: product.storeId ?? product.store?.id ?? null,
    storeName: product.store?.name || product.storeName || "",
    categoryName: product.categoryInfo?.name || product.category || "",
    categoryIcon: product.categoryInfo?.icon || null,
    categoryColor: product.categoryInfo?.color || null,
  };
}

function readStoredItems() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    // Drop anything that predates the real product API — those rows have no
    // storeId and would fail at checkout.
    return Array.isArray(parsed)
      ? parsed.filter((item) => item?.id && item?.storeId)
      : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredItems);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    const normalized = normalizeProduct(product);

    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === normalized.id);

      if (existingItem) {
        const maxQuantity = normalized.stock || existingItem.stock || Infinity;
        return prevItems.map((item) =>
          item.id === normalized.id
            ? {
                ...item,
                ...normalized,
                quantity: Math.min(item.quantity + quantity, maxQuantity),
              }
            : item,
        );
      }

      return [...prevItems, { ...normalized, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const increaseQuantity = (productId) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== productId) return item;
        const maxQuantity = item.stock || Infinity;
        return { ...item, quantity: Math.min(item.quantity + 1, maxQuantity) };
      }),
    );
  };

  const decreaseQuantity = (productId) => {
    setItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  /** Cart split per store — checkout creates one order per store. */
  const storeGroups = useMemo(() => {
    const groups = new Map();

    for (const item of items) {
      const group = groups.get(item.storeId) || {
        storeId: item.storeId,
        storeName: item.storeName,
        items: [],
        total: 0,
      };
      group.items.push(item);
      group.total += item.price * item.quantity;
      groups.set(item.storeId, group);
    }

    return [...groups.values()];
  }, [items]);

  const value = {
    items,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalItems,
    totalPrice,
    storeGroups,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
