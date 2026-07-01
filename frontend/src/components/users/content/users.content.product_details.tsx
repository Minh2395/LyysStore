"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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

type ProductCardItem = {
  _id?: string;
  id?: string;
  slug?: string;
  name?: string;
  image?: string;
  base_price?: number | string;
};

const getProductId = (item?: ProductCardItem | any) =>
  item?._id || item?.id || item?.slug || "";

const getProductIdentity = (item?: ProductCardItem | any) => {
  const id = getProductId(item);
  return id || item?.name || "";
};

const normalizeProducts = (value: unknown) =>
  Array.isArray(value) ? value.filter(Boolean) : [];

const getCategoryId = (item?: ProductCardItem | any) => {
  const category = item?.category_id;

  if (typeof category === "string") {
    return category;
  }

  if (category && typeof category === "object") {
    return category?._id || category?.id || "";
  }

  return item?.category?.id || item?.category?.slug || "";
};

const getProductHref = (item?: ProductCardItem | any) => {
  const id = getProductId(item);
  return id ? `/products/${id}` : "#";
};

const getProductImageSrc = (item?: ProductCardItem | any) =>
  item?.image
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}`
    : "/images/no-image.jpg";

function ProductCard({ item, href }: { item: ProductCardItem; href: string }) {
  const imageSrc = getProductImageSrc(item);
  const price = Number(item?.base_price ?? 0) || 0;

  return (
    <Link href={href} className="related-card">
      <Image
        src={imageSrc}
        alt={item?.name || "Sản phẩm"}
        width={180}
        height={180}
        unoptimized
        sizes="(max-width: 768px) 100vw, 180px"
      />

      <div className="related-info">
        <p
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item?.name || "Sản phẩm"}
        </p>

        <span>{price.toLocaleString("vi-VN")} ₫</span>
      </div>
    </Link>
  );
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
  const [relatedProducts, setRelatedProducts] = useState<ProductCardItem[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [openSections, setOpenSections] = useState({
    info: true,
    shipping: false,
    warranty: false,
    store: false,
  });

  useEffect(() => {
    let isActive = true;

    const loadRelatedProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
          { cache: "no-store" },
        );

        if (!res.ok) {
          return;
        }

        const data = await res.json();
        const products = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];

        if (!isActive) {
          return;
        }

        const currentId = getProductIdentity(product);
        const currentCategoryId = getCategoryId(product);

        const filtered = (products as ProductCardItem[])
          .filter((item) => {
            const key = getProductIdentity(item);
            const itemCategoryId = getCategoryId(item);

            if (!key || key === currentId) {
              return false;
            }

            if (
              currentCategoryId &&
              itemCategoryId &&
              itemCategoryId !== currentCategoryId
            ) {
              return false;
            }

            return true;
          })
          .slice(0, 7);

        setRelatedProducts(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    if (product?._id || product?.id || product?.slug) {
      loadRelatedProducts();
    }

    return () => {
      isActive = false;
    };
  }, [product?._id, product?.id, product?.slug, product?.category_id]);

  const lensProducts = useMemo(() => {
    const rawLenses = normalizeProducts(product?.lenses);
    const currentId = getProductIdentity(product);

    return (rawLenses as ProductCardItem[])
      .filter((item) => {
        const key = getProductIdentity(item);
        return Boolean(key) && key !== currentId;
      })
      .slice(0, 4);
  }, [product]);

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
                <p>
                  👓 <strong>Lyys Store</strong> nhận lắp các loại tròng kính:
                  <br />
                  Kính cận • Kính viễn • Kính loạn • Kính đa tròng • Tròng siêu
                  mỏng • Kính mát • Kính đổi màu • Tròng chống ánh sáng xanh...
                </p>

                <p>
                  💕 Có <strong>ưu đãi đặc biệt</strong> khi mua gọng kính tại
                  shop.
                </p>

                <p>
                  🎯 Hỗ trợ <strong>đo mắt miễn phí</strong> và{" "}
                  <strong>cắt tròng lấy ngay</strong> tại các chi nhánh.
                  <br />
                  <em>
                    * Riêng Mini Store tại The New Playground Quận 1 chỉ bán
                    gọng kính.
                  </em>
                </p>

                <div className="store-list">
                  <h4>📍 Hệ thống cửa hàng</h4>

                  <ul>
                    <li>203 Nguyễn Thiện Thuật, P. Bàn Cờ (Quận 3)</li>
                    <li>78 Võ Oanh, P. Thạnh Mỹ Tây (Bình Thạnh)</li>
                    <li>317 Nguyễn Thái Bình, P. Bảy Hiền (Tân Bình)</li>
                    <li>101 Thống Nhất, P. Thủ Đức</li>
                    <li>
                      The New Playground, 26 Lý Tự Trọng, P. Sài Gòn (Quận 1)
                      <br />
                      <small>⏰ 10:00 - 21:30 (Chỉ bán gọng kính)</small>
                    </li>
                  </ul>
                </div>

                <p>
                  🕰 <strong>Giờ mở cửa:</strong> 09:30 - 21:30
                </p>

                <p>
                  ☎️ <strong>Hotline:</strong> 0898 703 088 - 0898 702 088
                </p>
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
      {lensProducts.length > 0 && (
        <div className="lens-section">
          <h2>Tròng kính bổ trợ</h2>

          <div className="related-list">
            {lensProducts.map((item, idx) => (
              <ProductCard
                key={getProductId(item) || `lens-${idx}`}
                item={item}
                href={getProductHref(item)}
              />
            ))}
          </div>
        </div>
      )}
      {/* ================= RELATED ================= */}
      {relatedProducts.length > 0 && (
        <div className="related-section">
          <h2>Sản phẩm tương tự</h2>

          <div className="related-list">
            {relatedProducts.map((item, idx) => (
              <ProductCard
                key={getProductId(item) || `related-${idx}`}
                item={item}
                href={getProductHref(item)}
              />
            ))}
          </div>
        </div>
      )}
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
