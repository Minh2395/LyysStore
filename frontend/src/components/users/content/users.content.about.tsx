"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import "@/static/css/users/users.content.about.css";

const customers = [
  {
    name: "Trâm Anh",
    image: "/images/customers/customer1.jpg",
  },
  {
    name: "Nguyễn Minh",
    image: "/images/customers/customer2.jpg",
  },
  {
    name: "Hoàng Nam",
    image: "/images/customers/customer3.jpg",
  },
  {
    name: "Khánh Linh",
    image: "/images/customers/customer4.jpg",
  },
];

export default function UsersContentAbout() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === customers.length - 1 ? 0 : prev + 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const prev = current === 0 ? customers.length - 1 : current - 1;

  const next = current === customers.length - 1 ? 0 : current + 1;

  return (
    <div className="about-container">
      {/* THANK YOU */}
      <section className="about-row">
        <div className="about-images">
          <Image
            src="/images/about/about-1.jpg"
            alt=""
            width={280}
            height={380}
          />

          <Image
            src="/images/about/about-2.jpg"
            alt=""
            width={280}
            height={380}
          />
        </div>

        <div className="about-content">
          <h2>CẢM ƠN VÌ BẠN ĐÃ LỰA CHỌN CHÚNG TÔI</h2>

          <p>
            Trên hành trình phát triển của chúng tôi, mỗi khách hàng không chỉ
            là người mua sắm mà còn là người bạn đồng hành đáng quý. Chính sự
            tin tưởng và ủng hộ của quý khách trong suốt thời gian qua đã trở
            thành nguồn động lực to lớn giúp chúng tôi không ngừng hoàn thiện
            chất lượng sản phẩm và dịch vụ.
          </p>

          <p>
            Chúng tôi luôn mong muốn mang đến cho khách hàng những sản phẩm kính
            mắt chất lượng cao, thiết kế hiện đại và phù hợp với mọi phong cách.
            Mỗi sản phẩm được lựa chọn đều trải qua quá trình kiểm tra kỹ lưỡng
            nhằm đảm bảo mang lại sự hài lòng cao nhất khi đến tay khách hàng.
          </p>

          <p>
            Sự yêu mến, những lời góp ý chân thành và những lần quay trở lại mua
            sắm của quý khách chính là minh chứng rõ ràng nhất cho những giá trị
            mà chúng tôi đang theo đuổi. Xin chân thành cảm ơn vì đã lựa chọn và
            đồng hành cùng chúng tôi trên chặng đường phát triển này.
          </p>
        </div>
      </section>

      {/* STORE */}
      <section className="about-row reverse">
        <div className="about-content">
          <h2>HỆ THỐNG CỬA HÀNG KÍNH MẮT</h2>

          <p>
            Hệ thống cửa hàng của chúng tôi được xây dựng với mục tiêu mang đến
            không gian mua sắm hiện đại, chuyên nghiệp và thân thiện cho mọi
            khách hàng. Từng khu vực trưng bày đều được bố trí khoa học nhằm
            giúp khách hàng dễ dàng trải nghiệm và lựa chọn sản phẩm phù hợp
            nhất.
          </p>

          <p>
            Chúng tôi cung cấp đa dạng các dòng kính từ kính cận, kính thời
            trang, kính chống ánh sáng xanh, kính râm cho đến các phụ kiện đi
            kèm. Tất cả sản phẩm đều được tuyển chọn từ những thương hiệu uy tín
            nhằm đảm bảo chất lượng, độ bền và tính thẩm mỹ cao.
          </p>

          <p>
            Với đội ngũ nhân viên tận tâm, giàu kinh nghiệm cùng quy trình phục
            vụ chuyên nghiệp, chúng tôi cam kết mang đến trải nghiệm mua sắm
            thoải mái và đáng nhớ cho mỗi khách hàng khi ghé thăm hệ thống cửa
            hàng của mình.
          </p>
        </div>

        <div className="store-image">
          <Image
            src="/images/about/store.jpg"
            alt=""
            width={700}
            height={450}
          />
        </div>
      </section>

      {/* MEDIA */}
      <section className="about-row">
        <div className="about-content">
          <h2>VŨ TRỤ TRUYỀN THÔNG</h2>

          <p>
            Bên cạnh hoạt động kinh doanh, chúng tôi còn xây dựng hệ sinh thái
            truyền thông nhằm kết nối gần hơn với cộng đồng yêu thích thời trang
            và kính mắt. Đây là nơi khách hàng có thể cập nhật những xu hướng
            mới nhất, kiến thức hữu ích về chăm sóc mắt cũng như các chương
            trình ưu đãi hấp dẫn.
          </p>

          <p>
            Thông qua Facebook, Instagram, TikTok và các nền tảng truyền thông
            khác, chúng tôi thường xuyên chia sẻ những nội dung sáng tạo, hình
            ảnh thực tế từ khách hàng và các bộ sưu tập nổi bật đang được yêu
            thích. Điều này giúp khách hàng có thêm nhiều nguồn tham khảo trước
            khi lựa chọn sản phẩm phù hợp với phong cách của mình.
          </p>

          <p>
            Chúng tôi mong muốn xây dựng một cộng đồng năng động, nơi mọi người
            có thể cùng nhau chia sẻ kinh nghiệm, xu hướng thời trang và những
            giá trị tích cực trong cuộc sống thông qua các hoạt động truyền
            thông đa dạng.
          </p>
        </div>

        <div className="social-group">
          <Link
            href="https://www.instagram.com/lyys.store1"
            target="_blank"
            rel="noopener noreferrer"
            className="social-card instagram"
          >
            <h3>Instagram</h3>
            <span>@lyysstore</span>
          </Link>

          <Link
            href="https://www.facebook.com/lyys.store1/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-card facebook"
          >
            <h3>Facebook</h3>
            <span>@lyysstore</span>
          </Link>

          <Link
            href="https://www.tiktok.com/@lyys.store"
            target="_blank"
            rel="noopener noreferrer"
            className="social-card tiktok"
          >
            <h3>TikTok</h3>
            <span>@lyysstore</span>
          </Link>
        </div>
      </section>

      {/* CUSTOMER */}
      <section className="customer-section">
        <h2>KHÁCH HÀNG THÂN YÊU</h2>

        <p className="customer-desc">
          Sự tin tưởng và đồng hành của khách hàng chính là niềm tự hào lớn nhất
          của chúng tôi. Mỗi nụ cười hài lòng, mỗi khoảnh khắc tự tin khi đeo
          những chiếc kính phù hợp là động lực để chúng tôi tiếp tục cố gắng
          hoàn thiện từng ngày. Xin gửi lời cảm ơn chân thành đến tất cả những
          khách hàng đã, đang và sẽ lựa chọn chúng tôi trong hành trình chăm sóc
          đôi mắt và khẳng định phong cách cá nhân của mình.
        </p>

        <div className="customer-slider">
          <div className="side-image">
            <Image
              src={customers[prev].image}
              alt=""
              width={200}
              height={300}
            />
          </div>

          <div className="main-image">
            <Image
              src={customers[current].image}
              alt=""
              width={500}
              height={500}
            />
          </div>

          <div className="side-image">
            <Image
              src={customers[next].image}
              alt=""
              width={200}
              height={300}
            />
          </div>
        </div>

        <h3>{customers[current].name}</h3>

        <div className="slider-dots">
          {customers.map((_, index) => (
            <button
              key={index}
              className={current === index ? "dot active" : "dot"}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
