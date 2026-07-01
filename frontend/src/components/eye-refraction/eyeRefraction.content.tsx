"use client";

import "../../static/css/eye-refraction/eyeRefraction.content.css";
import Link from "next/link";

const eyeRefraction = `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/stores/eye_refraction.jpg`;

export default function EyeRefractionContent() {
  return (
    <section className="eye-refraction">
      <div className="eye-refraction__container">
        <div className="eye-refraction__left">
          <span className="eye-refraction__tag">
            EYE EXAMINATION & LENS FITTING
          </span>

          <h2>
            Trải nghiệm đo mắt
            <br />& cắt tròng tại Lyys Store
          </h2>

          <p>
            Không phải ai cũng biết chính xác mình cần loại tròng gì. Vì vậy,
            tại cửa hàng mắt kính của chúng tôi, bạn sẽ được hỗ trợ từ bước kiểm
            tra thị lực cho đến khi hoàn thiện chiếc kính phù hợp nhất với nhu
            cầu sử dụng hàng ngày.
          </p>

          <div className="eye-refraction__features">
            <div className="feature-item">
              <span>✔</span>
              <p>Kiểm tra thị lực</p>
            </div>

            <div className="feature-item">
              <span>✔</span>
              <p>Tư vấn loại tròng phù hợp</p>
            </div>

            <div className="feature-item">
              <span>✔</span>
              <p>Giải thích rõ ràng, dễ hiểu</p>
            </div>

            <div className="feature-item">
              <span>✔</span>
              <p>Cắt tròng lấy ngay tại cửa hàng</p>
            </div>
          </div>

          <blockquote>
            Chúng tôi tin rằng dịch vụ tốt không nằm ở việc nói nhiều thuật ngữ
            chuyên môn, mà nằm ở việc giúp khách hàng hiểu rõ mình đang sử dụng
            gì và vì sao nó phù hợp với đôi mắt của mình.
          </blockquote>

          <Link href="/stores" className="eye-refraction__btn">
            Tới cửa hàng ngay!
          </Link>
        </div>

        <div className="eye-refraction__right">
          <img src={eyeRefraction} alt="Đo mắt và cắt tròng kính" />
        </div>
      </div>
    </section>
  );
}
