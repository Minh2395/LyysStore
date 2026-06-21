"use client";

import Link from "next/link";
import {
  ShoppingCartOutlined,
  BellOutlined,
  UserOutlined,
  SearchOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "@/static/css/users/users.header.css";
import { useCart } from "../content/users.content.cart";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import type { MenuProps } from "antd";

const UsersHeader = () => {
  const logoUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/logos/logo.png`;

  const [showSearch, setShowSearch] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [showFrameMenu, setShowFrameMenu] = useState(false);

  const [showLensMenu, setShowLensMenu] = useState(false);

  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const { total_quantity } = useCart();

  const { data: session, status } = useSession();

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "logout") {
      signOut({ callbackUrl: "/auth/login" });
    }
  };

  return (
    <header className="users-header">
      <div className="mobile-toggle" onClick={() => setMobileMenuOpen(true)}>
        <MenuOutlined />
      </div>

      {/* Logo */}
      <div className="header-left">
        <Link href="/home" className="logo">
          <img src={logoUrl} alt="Lyys Store" className="logo-image" />
        </Link>
      </div>

      {/* Menu */}
      <nav className="header-nav">
        <Link href="/home">Trang chủ</Link>

        {/* Gọng kính */}
        <div className="nav-dropdown">
          <span className="nav-link">Gọng kính</span>

          <div className="dropdown-menu">
            <div className="dropdown-column">
              <h4>Tất cả</h4>

              <Link href="/products">Tất cả gọng kính</Link>
            </div>

            <div className="dropdown-column">
              <h4>Chất liệu</h4>

              <Link href="/products/material/titanium">Gọng Titan</Link>

              <Link href="/products/material/acetate">Gọng Acetate</Link>

              <Link href="/products/material/tr90">Gọng dẻo</Link>

              <Link href="/products/material/kim-loai">Gọng kim loại</Link>
            </div>

            <div className="dropdown-column">
              <h4>Hình dáng</h4>

              <Link href="/products/shape/tron">Tròn</Link>

              <Link href="/products/shape/vuong">Vuông</Link>

              <Link href="/products/shape/chu-nhat">Chữ nhật</Link>

              <Link href="/products/shape/oval">Oval</Link>

              <Link href="/products/shape/mat-meo">Mắt mèo</Link>
            </div>

            <div className="dropdown-column">
              <h4>Bộ sưu tập</h4>

              <Link href="/products/collections/minimalist">Minimalist</Link>

              <Link href="/products/collections/street-style">
                Street Style
              </Link>

              <Link href="/products/collections/smart-casual">
                Smart Casual
              </Link>

              <Link href="/products/collections/office-chic">Office Chic</Link>
            </div>
          </div>
        </div>

        {/* Tròng kính */}
        <div className="nav-dropdown">
          <span className="nav-link">Tròng kính</span>

          <div className="dropdown-menu lens-dropdown">
            <div className="dropdown-column">
              <h4>Các loại tròng kính</h4>

              <Link href="/lenses">Tất cả tròng kính</Link>

              <Link href="/lenses/prescription">Kính cận, viễn, loạn</Link>

              <Link href="/lenses/progressive">Kính đa tròng</Link>

              <Link href="/lenses/thin">Tròng siêu mỏng</Link>

              <Link href="/lenses/sunglasses">Kính mát</Link>

              <Link href="/lenses/photochromic">Kính đổi màu</Link>

              <Link href="/lenses/blue-light">Kính chống ánh sáng xanh</Link>
            </div>
          </div>
        </div>

        <Link href="/eye-refraction">Đo mắt</Link>

        <Link href="/stores">Cửa hàng</Link>

        <div className="nav-dropdown">
          <span className="nav-link">Xem thêm</span>

          <div className="dropdown-menu more-dropdown">
            <div className="dropdown-column">
              <Link href="/about">Về Lyys Store</Link>

              <Link href="/news">Tin tức</Link>

              <Link href="/blog">Blog</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Actions */}
      <div className="header-right">
        <Link href="/notifications" className="header-icon">
          <BellOutlined />
        </Link>

        <Link href="/cart" className="header-icon cart-icon">
          <ShoppingCartOutlined />

          {total_quantity > 0 && (
            <span className="header-cart-badge">
              {total_quantity > 99 ? "99+" : total_quantity}
            </span>
          )}
        </Link>

        {/* Search */}
        <div className="header-center">
          <div className="search-wrapper">
            <button
              className="search-icon-btn"
              onClick={() => setShowSearch(!showSearch)}
            >
              <SearchOutlined />
            </button>

            {showSearch && (
              <form className="search-form">
                <input
                  type="text"
                  placeholder="Tìm gọng kính phù hợp với bạn..."
                  className="search-input"
                  autoFocus
                />
              </form>
            )}
          </div>
        </div>

        {status === "authenticated" ? (
          <div className="user-menu">
            <UserOutlined />

            <div className="user-dropdown">
              <Link href="/profile">Thông tin cá nhân</Link>
              <Link href="/orders">Đơn hàng của tôi</Link>
              <Link href="/wishlist">Yêu thích</Link>

              <button
                className="logout-btn"
                onClick={() => signOut({ callbackUrl: "/home" })}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        ) : (
          <div className="user-menu">
            <Link href="/auth/login" className="login-btn">
              <UserOutlined />
              <span>Đăng nhập</span>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-sidebar ${mobileMenuOpen ? "active" : ""}`}>
        <div className="mobile-close" onClick={() => setMobileMenuOpen(false)}>
          <CloseOutlined />
        </div>

        <Link href="/">Trang chủ</Link>
        <Link href="/products">Gọng kính</Link>
        <Link href="/lenses">Tròng kính</Link>
        <Link href="/eye-refraction">Đo mắt</Link>
        <Link href="/stores">Cửa hàng</Link>
        <Link href="/about">Về Lyys Store</Link>
        <Link href="/news">Tin tức</Link>
        <Link href="/blog">Blog</Link>
      </div>

      {mobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default UsersHeader;
