"use client";

import Link from "next/link";
import {
  FacebookFilled,
  InstagramFilled,
  GlobalOutlined,
  PhoneFilled,
  MailFilled,
} from "@ant-design/icons";
import "@/static/css/users/users.footer.css";

const UsersFooter = () => {
  return (
    <footer className="users-footer">
      {/* Top Footer */}
      <div className="footer-top">
        <div className="footer-company-info">
          <h3>Lyys Store</h3>

          <p>
            Chuyên cung cấp sản phẩm chất lượng với dịch vụ hỗ trợ khách hàng
            tận tâm.
          </p>
        </div>

        <div className="footer-contact">
          <div>
            <h3>Điện thoại</h3>
            <p>0898 703 088</p>
          </div>

          <div>
            <h3>Hotline</h3>
            <p>0898 702 088</p>
          </div>

          <div>
            <h3>Email</h3>
            <p>lyysstore@gmail.com</p>
          </div>
        </div>

        <div className="footer-social">
          <Link href="tel:0898703088">
            <PhoneFilled />
          </Link>

          <Link href="mailto:lyysstore@gmail.com">
            <MailFilled />
          </Link>

          <Link href="https://lyysstore.net" target="_blank">
            <GlobalOutlined />
          </Link>

          <Link href="https://www.facebook.com/lyys.store1/" target="_blank">
            <FacebookFilled />
          </Link>

          <Link href="https://www.instagram.com/lyys.store1" target="_blank">
            <InstagramFilled />
          </Link>
        </div>
      </div>

      <hr />

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <div className="footer-company">
          <h3>Thông tin doanh nghiệp</h3>

          <p>
            <strong>Thương hiệu:</strong> Lyys Store
          </p>

          <p>
            <strong>Điện thoại:</strong> 0898 703 088
          </p>

          <p>
            <strong>Hotline:</strong> 0898 702 088
          </p>

          <p>
            <strong>Email:</strong> lyysstore@gmail.com
          </p>

          <p>
            <strong>Website:</strong> lyysstore.net
          </p>
        </div>

        <div className="footer-policy">
          <h3>Chính sách</h3>

          <ul>
            <li>
              <Link href="/policies/payment">Chính sách thanh toán</Link>
            </li>

            <li>
              <Link href="/policies/warranty">
                Chính sách bảo hành, đổi trả
              </Link>
            </li>

            <li>
              <Link href="/policies/shipping">Chính sách vận chuyển</Link>
            </li>

            <li>
              <Link href="/policies/security">Chính sách bảo mật</Link>
            </li>

            <li>
              <Link href="/policies/customer">Chính sách khách hàng</Link>
            </li>
          </ul>
        </div>

        <div className="footer-category">
          <h3>Danh mục</h3>

          <ul>
            <li>
              <Link href="/products">Sản phẩm</Link>
            </li>

            <li>
              <Link href="/stores">Cửa hàng</Link>
            </li>

            <li>
              <Link href="/categories">Danh mục</Link>
            </li>
          </ul>
        </div>

        <div className="footer-ecommerce">
          <h3>Kết nối</h3>

          <div className="ecommerce-icons">
            <Link href="https://www.tiktok.com/@lyys.store" target="_blank">
              TikTok
            </Link>
            <Link href="https://shopee.vn/lyysstore" target="_blank">
              Shopee
            </Link>
            <Link href="https://www.facebook.com/lyys.store1/" target="_blank">
              Facebook
            </Link>
            <Link href="https://www.instagram.com/lyys.store1" target="_blank">
              Instagram
            </Link>
            <Link href="https://lyysstore.net" target="_blank">
              Website
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UsersFooter;
