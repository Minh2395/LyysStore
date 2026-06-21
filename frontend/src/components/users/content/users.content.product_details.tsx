"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ShoppingCartOutlined,
  MinusOutlined,
  PlusOutlined,
  ZoomInOutlined,
  StarFilled,
} from "@ant-design/icons";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import "@/static/css/users/users.content.product_details.css";

interface ProductDetailsProps {
  product: any;
}

export default function UsersProductDetails({ product }: ProductDetailsProps) {
  const images =
    product?.images?.length > 0
      ? product.images.map(
          (img: string) => `${process.env.NEXT_PUBLIC_BACKEND_URL}${img}`,
        )
      : product?.image
        ? [`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.image}`]
        : ["/images/no-image.jpg"];

  const [mainImage, setMainImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [openSections, setOpenSections] = useState({
    info: true,
    shipping: false,
    warranty: false,
    store: false,
  });

  const handleAddToCart = async () => {
    // 1. chưa login -> đá sang login
    if (status !== "authenticated") {
      router.push(
        `/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }

    try {
      const token =
        session?.access_token || (session as any)?.user?.access_token;

      if (!token) {
        router.push(`/auth/login`);
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
          body: JSON.stringify({
            product_id: product._id,
            quantity,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Add to cart failed");
    } catch (err) {
      console.error(err);
    }
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!product) {
    return <div>Loading product...</div>;
  }

  return (
    <div className="product-detail-container">
      {/* ================= LEFT ================= */}
      <div className="product-gallery">
        <div className="main-image" onClick={() => setZoom(true)}>
          <Image
            src={mainImage || "/images/no-image.jpg"}
            alt={product?.name}
            fill
            unoptimized
          />

          <div className="zoom-icon">
            <ZoomInOutlined />
          </div>
        </div>

        <div className="thumbnail-list">
          {images.map((img: string, idx: number) => (
            <div
              key={idx}
              className={`thumb ${mainImage === img ? "active" : ""}`}
              onClick={() => setMainImage(img)}
            >
              <Image
                src={img}
                alt={`thumb-${idx}`}
                width={90}
                height={90}
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
      {/* ================= RIGHT ================= */}
      <div className="product-info">
        <h1 className="product-title">{product?.name}</h1>

        <div className="product-meta">
          <div className="rating">
            <StarFilled />
            <StarFilled />
            <StarFilled />
            <StarFilled />
            <StarFilled />
          </div>

          <span className="review-count">(124 đánh giá)</span>

          <span className="divider">|</span>

          <span className="product-code">
            Mã SP: {product?.id || product?._id}
          </span>
        </div>

        <div className="price-box">
          <div className="price">
            {(product?.base_price ?? 0).toLocaleString("vi-VN")} ₫
          </div>
        </div>

        {/* ================= STOCK ================= */}
        <div className="stock-card">
          <div className="stock-row">
            <span>Tình trạng:</span>

            <strong className="in-stock">
              Còn {product?.stock ?? 0} sản phẩm
            </strong>
          </div>

          <div className="stock-row">
            <span>Chi nhánh còn hàng:</span>

            <strong>
              {product?.branches?.length
                ? product.branches.join(", ")
                : "Toàn hệ thống"}
            </strong>
          </div>
        </div>

        {/* ================= QUANTITY ================= */}
        <div className="cart-box">
          <div className="quantity-box">
            <button onClick={handleDecrease}>
              <MinusOutlined />
            </button>

            <span>{quantity}</span>

            <button onClick={handleIncrease}>
              <PlusOutlined />
            </button>
          </div>

          <button className="add-cart" onClick={handleAddToCart}>
            <ShoppingCartOutlined />
            <span>
              {status !== "authenticated"
                ? "Đăng nhập để mua hàng"
                : "Thêm vào giỏ hàng"}
            </span>
          </button>
        </div>

        {/* ================= BENEFITS ================= */}
        <div className="benefits">
          <div className="benefit-item">🚚 Miễn phí giao hàng toàn quốc</div>

          <div className="benefit-item">🔄 Thu cũ đổi mới lên đến 80%</div>

          <div className="benefit-item">🛡️ Bảo hành chính hãng 12 tháng</div>

          <div className="benefit-item">👁️ Đo mắt miễn phí tại cửa hàng</div>
        </div>

        {/* ================= ACCORDION ================= */}
        <div className="accordion">
          <div className="acc-item">
            <div className="acc-title" onClick={() => toggleSection("info")}>
              <span>Thông tin chi tiết & mô tả</span>
              <span>{openSections.info ? "−" : "+"}</span>
            </div>

            {openSections.info && (
              <div className="acc-content">
                {product?.description || "Đang cập nhật"}
              </div>
            )}
          </div>

          <div className="acc-item">
            <div
              className="acc-title"
              onClick={() => toggleSection("shipping")}
            >
              <span>Chính sách vận chuyển</span>
              <span>{openSections.shipping ? "−" : "+"}</span>
            </div>

            {openSections.shipping && (
              <div className="acc-content">
                Giao hàng toàn quốc từ 2 - 5 ngày làm việc.
              </div>
            )}
          </div>

          <div className="acc-item">
            <div
              className="acc-title"
              onClick={() => toggleSection("warranty")}
            >
              <span>Chế độ bảo hành</span>
              <span>{openSections.warranty ? "−" : "+"}</span>
            </div>

            {openSections.warranty && (
              <div className="acc-content">
                Bảo hành chính hãng 12 tháng trên toàn hệ thống.
              </div>
            )}
          </div>

          <div className="acc-item">
            <div className="acc-title" onClick={() => toggleSection("store")}>
              <span>Tìm cửa hàng</span>
              <span>{openSections.store ? "−" : "+"}</span>
            </div>

            {openSections.store && (
              <div className="acc-content">
                Có mặt tại TP.HCM, Hà Nội, Đà Nẵng và nhiều tỉnh thành khác.
              </div>
            )}
          </div>
        </div>

        {/* ================= TAGS ================= */}
        <div className="tags">
          <span className="tag">Thu cũ đổi mới</span>
          <span className="tag">Bảo hành 12 tháng</span>
          <span className="tag">Đo mắt miễn phí</span>
          <span className="tag">Vệ sinh miễn phí</span>

          {product?.tags?.map((tag: string, idx: number) => (
            <span key={idx} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ================= LENS ================= */}
      <div className="lens-section">
        <h2>Tròng kính bổ trợ</h2>

        <div className="related-list">
          {(product?.lenses || product?.related || [])
            .slice(0, 4)
            .map((item: any, idx: number) => (
              <div key={idx} className="related-card">
                <Image
                  src={
                    item?.image
                      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}`
                      : "/images/no-image.jpg"
                  }
                  alt={item?.name}
                  width={180}
                  height={180}
                  unoptimized
                />

                <div className="related-info">
                  <p>{item?.name}</p>

                  <span>
                    {(item?.base_price ?? 0).toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* ================= RELATED ================= */}
      <div className="related-section">
        <h2>Sản phẩm tương tự</h2>

        <div className="related-list">
          {(product?.related || []).map((item: any, idx: number) => (
            <div key={idx} className="related-card">
              <Image
                src={
                  item?.image
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}`
                    : "/images/no-image.jpg"
                }
                alt={item?.name}
                width={180}
                height={180}
                unoptimized
              />

              <div className="related-info">
                <p>{item?.name}</p>

                <span>{(item?.base_price ?? 0).toLocaleString("vi-VN")} ₫</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* ================= ZOOM ================= */}
      {zoom && (
        <div className="zoom-modal" onClick={() => setZoom(false)}>
          <div className="zoom-content">
            <Image
              src={mainImage || "/images/no-image.jpg"}
              alt="zoom"
              fill
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
}
