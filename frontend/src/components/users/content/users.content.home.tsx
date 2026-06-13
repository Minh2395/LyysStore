"use client";

import { useEffect, useState } from "react";
import "../../../static/css/users/users.content.home.css";

interface Product {
  _id: string;
  id: string;
  name: string;
  slug: string;
  base_price: number;
  description: string;
  image?: string;

  category_id?: {
    _id: string;
    name: string;
    slug: string;
  };
}

interface Feedback {
  name: string;
  text: string;
  productName: string;
  price: number;
}

export default function UsersContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [bannerIndex, setBannerIndex] = useState(0);
  const [feedbackIndex, setFeedbackIndex] = useState(0);

  const banners = ["/images/banner/banner1.jpg", "/images/banner/banner2.jpg"];

  const feedbacks: Feedback[] = [
    {
      name: "Nguyễn Văn A",
      text: "Sản phẩm đẹp, giao hàng nhanh",
      productName: "ClubMaster",
      price: 200000,
    },
    {
      name: "Trần Thị B",
      text: "Kính nhẹ, đeo rất thoải mái",
      productName: "Titan",
      price: 350000,
    },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  // banner auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const fetchProducts = async (category = "") => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
      );

      const result = await res.json();

      setProducts(result.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nextFeedback = () => {
    setFeedbackIndex((prev) => (prev + 1) % feedbacks.length);
  };

  const prevFeedback = () => {
    setFeedbackIndex((prev) => (prev === 0 ? feedbacks.length - 1 : prev - 1));
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <main className="home-container">
      {/* ================= BANNER ================= */}
      <section className="home-banner">
        <img src={banners[bannerIndex]} alt="banner" />
      </section>

      {/* ================= BEST SELLER ================= */}
      <section className="home-section">
        <div className="section-top">
          <h2>BEST SELLER</h2>

          <div className="section-menu">
            <span onClick={() => fetchProducts("")}>Tất cả</span>
            <span onClick={() => fetchProducts("frame")}>Gọng kính</span>
            <span onClick={() => fetchProducts("lens")}>Tròng kính</span>
          </div>
        </div>

        <div className="product-carousel">
          {products.slice(0, 8).map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={
                  product.image
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${product.image}`
                    : "/images/no-image.jpg"
                }
                alt={product.name}
              />

              <h3>{product.name}</h3>

              <strong>{product.base_price.toLocaleString("vi-VN")}₫</strong>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BANNER GIỮA ================= */}
      <section className="middle-banner">
        <img src="/images/banner/banner-middle.jpg" />
      </section>

      {/* ================= SẢN PHẨM MỚI ================= */}
      <section className="home-section">
        <div className="section-top">
          <h2>SẢN PHẨM MỚI</h2>
        </div>

        <div className="product-carousel">
          {products.slice(0, 10).map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={
                  product.image
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${product.image}`
                    : "/images/no-image.jpg"
                }
                alt={product.name}
              />

              <h3>{product.name}</h3>

              <strong>{product.base_price.toLocaleString("vi-VN")}₫</strong>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEEDBACK ================= */}
      <section className="feedback-section">
        <div className="feedback-header">
          <h2>KHÁCH HÀNG ĐÁNH GIÁ</h2>

          <div>
            <button onClick={prevFeedback}>{"<"}</button>
            <button onClick={nextFeedback}>{">"}</button>
          </div>
        </div>

        <div className="feedback-card">
          <h4>{feedbacks[feedbackIndex].name}</h4>
          <p>{feedbacks[feedbackIndex].text}</p>

          <strong>
            {feedbacks[feedbackIndex].productName} -{" "}
            {feedbacks[feedbackIndex].price.toLocaleString("vi-VN")}₫
          </strong>
        </div>
      </section>

      {/* ================= STORE ================= */}
      <section className="store-section">
        <div className="store-image">
          <img src="/images/store/store.jpg" />
        </div>

        <div className="store-content">
          <h2>GHÉ THĂM HỆ THỐNG</h2>
          <p>Trải nghiệm tại cửa hàng Lyys Store</p>
          <button>Xem hệ thống</button>
        </div>
      </section>

      {/* ================= COLLECTION ================= */}
      <section className="collection-section">
        <h2>COLLECTION</h2>

        <div className="collection-grid">
          <img src="/images/collection/c1.jpg" />
          <img src="/images/collection/c2.jpg" />
          <img src="/images/collection/c3.jpg" />
        </div>
      </section>
    </main>
  );
}
