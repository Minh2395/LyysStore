"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "../../../static/css/products/products.content.material.css";

interface Props {
  slug: string;
}

export default function UsersContentMaterial({ slug }: Props) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [sort, setSort] = useState<"asc" | "desc">("asc");

  const [view, setView] = useState<"grid" | "list">("grid");

  const bannerTitanium = `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/banners/materials/titanium.png`;
  const bannerAcetate = `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/banners/materials/acetate.png`;
  const bannerTr90 = `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/banners/materials/tr90.png`;
  const bannerMental = `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/banners/materials/mental.png`;

  const bannerMap: Record<string, string> = {
    titanium: bannerTitanium,
    acetate: bannerAcetate,
    tr90: bannerTr90,
    metal: bannerMental,
  };

  const currentBanner =
    bannerMap[slug.toLowerCase()] ||
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/default-banner.png`;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/material/${slug}`,
        );

        const result = await res.json();

        setProducts(result.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  if (loading) {
    return <p>Đang tải...</p>;
  }

  const sortedProducts = [...products].sort((a, b) => {
    return sort === "asc"
      ? a.base_price - b.base_price
      : b.base_price - a.base_price;
  });

  return (
    <div className="material-page">
      {/* Banner */}
      <section className="material-banner">
        <img
          src={
            slug === "titanium"
              ? bannerTitanium
              : slug === "acetate"
                ? bannerAcetate
                : slug === "tr90"
                  ? bannerTr90
                  : slug === "metal"
                    ? bannerMental
                    : "/images/default-banner.jpg"
          }
          alt={slug}
        />
      </section>

      {/* Toolbar */}
      <section className="material-toolbar">
        <h2>Danh sách sản phẩm ({products.length})</h2>

        <div className="toolbar-actions">
          <button
            className={sort === "asc" ? "active" : ""}
            onClick={() => setSort("asc")}
          >
            Giá tăng dần
          </button>

          <button
            className={sort === "desc" ? "active" : ""}
            onClick={() => setSort("desc")}
          >
            Giá giảm dần
          </button>

          <button
            className={view === "grid" ? "active" : ""}
            onClick={() => setView("grid")}
          >
            ▦ Grid
          </button>

          <button
            className={view === "list" ? "active" : ""}
            onClick={() => setView("list")}
          >
            ☰ List
          </button>
        </div>
      </section>

      {/* Products */}
      <section className={view === "grid" ? "products-grid" : "products-list"}>
        {sortedProducts.map((product) => (
          <Link
            key={product._id}
            href={`/products/${product._id}`}
            className="product-card"
          >
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
          </Link>
        ))}
      </section>
    </div>
  );
}
