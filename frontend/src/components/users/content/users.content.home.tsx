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
  category_id?: {
    _id: string;
    name: string;
    slug: string;
  };
}

export default function UsersContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
      );

      const result = await res.json();

      setProducts(result.data || []);
    } catch (error) {
      console.error("Fetch products error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Đang tải sản phẩm...</div>;
  }

  return (
    <section className="home-products">
      <div className="section-header">
        <h2>Sản phẩm nổi bật</h2>
        <p>Khám phá các mẫu kính mới nhất tại Lyys Store</p>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-image">
              <img src="/images/no-image.jpg" alt={product.name} />
            </div>

            <div className="product-info">
              <span className="product-category">
                {product.category_id?.name}
              </span>

              <h3>{product.name}</h3>

              <p className="product-description">{product.description}</p>

              <div className="product-price">
                {product.base_price.toLocaleString("vi-VN")}₫
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="empty-products">Chưa có sản phẩm nào.</div>
      )}
    </section>
  );
}
