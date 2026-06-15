"use client";

import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import "../../../static/css/users/users.content.cart.css";

interface CartItem {
  product_id: {
    _id: string;
    name: string;
    base_price: number;
    slug: string;
  };

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
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  useEffect(() => {
    const fetchCart = async () => {
      const token = session?.access_token;

      if (!token) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/carts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (res.ok) {
        setItems(data?.data?.items || data?.items || []);
      }
    };

    fetchCart();
  }, [session]);

  const [items, setItems] = useState<CartItem[]>([]);

  const total_quantity = items.reduce((s, i) => s + i.quantity, 0);
  const total_price = items.reduce((s, i) => s + i.quantity * i.price, 0);

  // =========================
  // ADD TO CART (SYNC VERSION)
  // =========================
  const addToCart = async (item: CartItem) => {
    try {
      const token =
        localStorage.getItem("access_token") || localStorage.getItem("token");

      if (!token) {
        console.error("❌ No token found");
        return;
      }

      const cleanToken = token.replace("Bearer ", "");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/carts/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cleanToken}`,
          },
          body: JSON.stringify(item),
        },
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("CART API ERROR:", data);
        return;
      }

      // =========================
      // SYNC STATE FROM BACKEND
      // =========================
      if (data?.data?.items) {
        setItems(data.data.items);
      } else {
        // fallback local update
        setItems((prev) => {
          const existing = prev.find(
            (i) => i.product_id._id === item.product_id._id,
          );

          if (existing) {
            return prev.map((i) =>
              i.product_id._id === item.product_id._id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i,
            );
          }

          return [...prev, item];
        });
      }
    } catch (err) {
      console.error("ADD TO CART ERROR:", err);
    }
  };

  const setCart = (newItems: CartItem[]) => {
    setItems(newItems);
  };

  const clearCart = () => {
    setItems([]);
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// =========================
// SAFE HOOK (NO CRASH)
// =========================
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
    };
  }

  return ctx;
};

export default function CartPage() {
  const { items, total_price, total_quantity } = useCart();

  return (
    <div className="cart-page">
      <h1 className="cart-title">Giỏ hàng của bạn</h1>

      {items.length === 0 ? (
        <div className="empty-cart">
          <p>🛒 Chưa có sản phẩm nào trong giỏ hàng</p>
        </div>
      ) : (
        <div className="cart-container">
          {/* LEFT */}
          <div className="cart-left">
            <div className="cart-header">
              <input type="checkbox" />

              <span>Sản phẩm</span>

              <span>Đơn giá</span>

              <span>Số lượng</span>

              <span>Còn lại</span>

              <span>Thành tiền</span>
            </div>

            {items.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="cart-product">
                  <input type="checkbox" />

                  <img
                    src="/images/no-image.png"
                    alt={item.product_id.name}
                    className="cart-image"
                  />

                  <div className="cart-info">
                    <h4>{item.product_id.name}</h4>

                    <p>Mã SP: {item.product_id._id}</p>
                  </div>
                </div>

                <div className="cart-price">
                  {item.price.toLocaleString("vi-VN")}đ
                </div>

                <div className="cart-quantity">
                  <button>-</button>

                  <span>{item.quantity}</span>

                  <button>+</button>
                </div>

                <div className="cart-stock">Còn hàng</div>

                <div className="cart-total">
                  {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                </div>
              </div>
            ))}

            <div className="cart-actions">
              <button className="delete-selected">Xóa sản phẩm đã chọn</button>

              <button className="continue-shopping">Tiếp tục mua hàng</button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="cart-right">
            <div className="order-summary">
              <h2>Tóm tắt đơn hàng</h2>

              <hr />

              <div className="summary-row">
                <span>Tổng số lượng</span>
                <span>{total_quantity}</span>
              </div>

              <div className="summary-row">
                <span>Tạm tính</span>

                <span>{total_price.toLocaleString("vi-VN")}đ</span>
              </div>

              <div className="summary-row total">
                <span>Tổng cộng</span>

                <span>{total_price.toLocaleString("vi-VN")}đ</span>
              </div>

              <button className="checkout-btn">Thanh toán</button>

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
