"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useSession } from "next-auth/react";
import "../../../static/css/users/users.content.cart.css";

interface CartProduct {
  _id?: string;
  name?: string;
  base_price?: number;
  slug?: string;
  image?: string;
}

interface CartItem {
  product_id: CartProduct | null;
  quantity: number;
  price: number;
}

interface CartContextType {
  items: CartItem[];
  total_quantity: number;
  total_price: number;
  addToCart: (item: CartItem) => Promise<void>;
  setCart: (items: CartItem[]) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  removeMany: (productIds: string[]) => Promise<void>;
  selectedIds: string[];
  toggleSelectItem: (productId: string) => void;
  toggleSelectAll: () => void;
  isAllSelected: boolean;
  selectedTotalQuantity: number;
  selectedSubtotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

const normalizeCartPayload = (payload: any) => {
  const cart = payload?.data ?? payload;

  return {
    items: Array.isArray(cart?.items) ? cart.items : [],
    total_quantity: Number(cart?.total_quantity ?? 0),
    total_price: Number(cart?.total_price ?? 0),
  };
};

const getImageUrl = (image?: string) => {
  if (!image) return "/images/no-image.jpg";

  if (/^https?:\/\//i.test(image)) return image;

  return `${process.env.NEXT_PUBLIC_BACKEND_URL}${image}`;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const authToken =
    session?.access_token ||
    (session as any)?.user?.access_token ||
    (typeof window !== "undefined"
      ? localStorage.getItem("access_token") || localStorage.getItem("token")
      : "");

  const total_quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const total_price = items.reduce(
    (sum, item) => sum + item.quantity * Number(item.price ?? 0),
    0,
  );

  const selectedItems = useMemo(
    () =>
      items.filter((item) => {
        const productId = item.product_id?._id ?? "";
        return selectedIds.includes(productId);
      }),
    [items, selectedIds],
  );

  const selectedTotalQuantity = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const selectedSubtotal = selectedItems.reduce(
    (sum, item) => sum + item.quantity * Number(item.price ?? 0),
    0,
  );

  const isAllSelected =
    items.length > 0 &&
    items.every((item) => {
      const productId = item.product_id?._id ?? "";
      return !!productId && selectedIds.includes(productId);
    });

  useEffect(() => {
    if (status !== "authenticated") {
      setItems([]);
      setSelectedIds([]);
      return;
    }

    const fetchCart = async () => {
      if (!authToken) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/carts`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        const payload = await res.json().catch(() => null);

        if (res.ok) {
          const nextCart = normalizeCartPayload(payload);
          setItems(nextCart.items);
        }
      } catch (error) {
        console.error("FETCH CART ERROR:", error);
      }
    };

    fetchCart();
  }, [authToken, status]);

  useEffect(() => {
    setSelectedIds((prev) =>
      prev.filter((id) =>
        items.some((item: CartItem) => (item.product_id?._id ?? "") === id),
      ),
    );
  }, [items]);

  const syncCartFromResponse = (payload: any) => {
    const nextCart = normalizeCartPayload(payload);
    setItems(nextCart.items);
    setSelectedIds((prev) =>
      prev.filter((id) =>
        nextCart.items.some(
          (item: CartItem) => (item.product_id?._id ?? "") === id,
        ),
      ),
    );
  };

  const addToCart = async (item: CartItem) => {
    if (!authToken) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/carts/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            product_id: item.product_id?._id,
            quantity: item.quantity,
          }),
        },
      );

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("ADD TO CART ERROR:", payload);
        return;
      }

      syncCartFromResponse(payload);
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!authToken || !productId || quantity < 1) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/carts/items/${productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ quantity }),
        },
      );

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("UPDATE CART ERROR:", payload);
        return;
      }

      syncCartFromResponse(payload);
    } catch (error) {
      console.error("UPDATE CART ERROR:", error);
    }
  };

  const removeItem = async (productId: string) => {
    if (!authToken || !productId) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/carts/items/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("REMOVE CART ITEM ERROR:", payload);
        return;
      }

      syncCartFromResponse(payload);
    } catch (error) {
      console.error("REMOVE CART ITEM ERROR:", error);
    }
  };

  const removeMany = async (productIds: string[]) => {
    if (!authToken || productIds.length === 0) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/carts/items`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ productIds }),
        },
      );

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("REMOVE CART ITEMS ERROR:", payload);
        return;
      }

      syncCartFromResponse(payload);
    } catch (error) {
      console.error("REMOVE CART ITEMS ERROR:", error);
    }
  };

  const setCart = (newItems: CartItem[]) => {
    setItems(newItems);
    setSelectedIds([]);
  };

  const clearCart = () => {
    setItems([]);
    setSelectedIds([]);
  };

  const toggleSelectItem = (productId: string) => {
    setSelectedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
      return;
    }

    const nextIds = items
      .map((item) => item.product_id?._id)
      .filter((id): id is string => Boolean(id));

    setSelectedIds(nextIds);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        total_quantity,
        total_price,
        addToCart,
        setCart,
        clearCart,
        updateQuantity,
        removeItem,
        removeMany,
        selectedIds,
        toggleSelectItem,
        toggleSelectAll,
        isAllSelected,
        selectedTotalQuantity,
        selectedSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);

  if (!ctx) {
    return {
      items: [],
      total_quantity: 0,
      total_price: 0,
      addToCart: async () => {},
      setCart: () => {},
      clearCart: () => {},
      updateQuantity: async () => {},
      removeItem: async () => {},
      removeMany: async () => {},
      selectedIds: [],
      toggleSelectItem: () => {},
      toggleSelectAll: () => {},
      isAllSelected: false,
      selectedTotalQuantity: 0,
      selectedSubtotal: 0,
    };
  }

  return ctx;
};

export default function CartPage() {
  const {
    items,
    total_price,
    total_quantity,
    updateQuantity,
    removeItem,
    removeMany,
    selectedIds,
    toggleSelectItem,
    toggleSelectAll,
    isAllSelected,
    selectedTotalQuantity,
    selectedSubtotal,
  } = useCart();

  const handleIncrease = (item: CartItem) => {
    const productId = item.product_id?._id;

    if (!productId) return;

    updateQuantity(productId, item.quantity + 1);
  };

  const handleDecrease = (item: CartItem) => {
    const productId = item.product_id?._id;

    if (!productId || item.quantity <= 1) return;

    updateQuantity(productId, item.quantity - 1);
  };

  return (
    <div className="cart-page">
      <h1 className="cart-title">Giỏ hàng của bạn</h1>

      {items.length === 0 ? (
        <div className="empty-cart">
          <p>🛒 Chưa có sản phẩm nào trong giỏ hàng</p>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-left">
            <div className="cart-header">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
              />

              <span>Sản phẩm</span>

              <span>Đơn giá</span>

              <span>Số lượng</span>

              <span>Còn lại</span>

              <span>Thành tiền</span>
            </div>

            {items.map((item, index) => {
              const productId = item.product_id?._id ?? "";
              const isSelected = !!productId && selectedIds.includes(productId);
              const unitPrice = Number(item.price ?? 0);

              return (
                <div key={productId || index} className="cart-item">
                  <div className="cart-product">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectItem(productId)}
                    />

                    <img
                      src={getImageUrl(item.product_id?.image)}
                      alt={item.product_id?.name || "Product image"}
                      className="cart-image"
                    />

                    <div className="cart-info">
                      <h4>{item.product_id?.name || "Sản phẩm"}</h4>

                      <p>Mã SP: {productId}</p>
                    </div>
                  </div>

                  <div className="cart-price">
                    {unitPrice.toLocaleString("vi-VN")}đ
                  </div>

                  <div className="cart-quantity">
                    <button
                      type="button"
                      onClick={() => handleDecrease(item)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button type="button" onClick={() => handleIncrease(item)}>
                      +
                    </button>
                  </div>

                  <div className="cart-stock">Còn hàng</div>

                  <div className="cart-total">
                    {(unitPrice * item.quantity).toLocaleString("vi-VN")}đ
                  </div>
                </div>
              );
            })}

            <div className="cart-actions">
              <button
                type="button"
                className="delete-selected"
                onClick={() => removeMany(selectedIds)}
                disabled={selectedIds.length === 0}
              >
                Xóa sản phẩm đã chọn
              </button>

              <button type="button" className="continue-shopping">
                Tiếp tục mua hàng
              </button>
            </div>
          </div>

          <div className="cart-right">
            <div className="order-summary">
              <h2>Tóm tắt đơn hàng</h2>

              <hr />

              <div className="summary-row">
                <span>Tổng số lượng</span>
                <span>{selectedTotalQuantity}</span>
              </div>

              <div className="summary-row">
                <span>Tạm tính</span>

                <span>{selectedSubtotal.toLocaleString("vi-VN")}đ</span>
              </div>

              <div className="summary-row total">
                <span>Tổng cộng</span>

                <span>{selectedSubtotal.toLocaleString("vi-VN")}đ</span>
              </div>

              <button type="button" className="checkout-btn">
                Thanh toán
              </button>

              <div className="payment-methods">
                <h4>Chấp nhận thanh toán</h4>

                <div className="payment-icons">
                  <span>🏦 Ngân hàng</span>
                  <span>📱 MoMo</span>
                  <span>💳 Visa</span>
                  <span>💳 MasterCard</span>
                  <span>💰 ZaloPay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
