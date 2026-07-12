"use client";

import {
  BankOutlined,
  CheckCircleFilled,
  CreditCardOutlined,
  ExclamationCircleOutlined,
  SafetyCertificateOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Alert, Card, Divider, List, Space, Typography } from "antd";

import "../../static/css/policies/policies.content.payment.css";

const { Title, Paragraph, Text } = Typography;

const benefits = [
  "Bảo hành trọn đời",
  "Đo mắt miễn phí",
  "Thu cũ đổi mới",
  "Vệ sinh và bảo quản kính",
];

export default function PoliciesContentPayment() {
  return (
    <section className="policies-content policies-payment">
      <div className="policies-content__container">
        <div className="policies-content__heading">
          <Text className="policies-content__eyebrow">LYYS STORE</Text>

          <Title level={1}>CHÍNH SÁCH THANH TOÁN</Title>

          <Paragraph>
            Lyys Store hỗ trợ các phương thức thanh toán thuận tiện, an toàn và
            phù hợp với nhu cầu mua sắm của Quý khách.
          </Paragraph>
        </div>

        <Space
          direction="vertical"
          size={24}
          className="policies-payment__list"
        >
          <Card
            className="policies-payment__card"
            title={
              <Space>
                <WalletOutlined />
                <span>I. Thanh toán khi nhận hàng (COD)</span>
              </Space>
            }
          >
            <Paragraph>
              Khi mua hàng từ xa, Quý khách có thể lựa chọn hình thức thanh toán
              khi nhận hàng (COD) tại địa điểm giao hàng đã thỏa thuận.
            </Paragraph>

            <Paragraph>
              Chi phí vận chuyển được áp dụng theo chính sách vận chuyển của
              Lyys Store hoặc theo thỏa thuận cụ thể giữa các bên.
            </Paragraph>

            <Alert
              className="policies-payment__notice"
              type="warning"
              showIcon
              icon={<ExclamationCircleOutlined />}
              message="Lưu ý đối với đơn hàng cắt kính theo độ"
              description={
                <ul>
                  <li>
                    Với đơn kính cận, viễn, loạn hoặc đa tròng, Quý khách vui
                    lòng đặt cọc từ 50% đến 100% tổng giá trị đơn hàng trước khi
                    cửa hàng tiến hành cắt tròng.
                  </li>

                  <li>
                    Quý khách thanh toán phần giá trị còn lại cho nhân viên giao
                    hàng hoặc đơn vị vận chuyển sau khi kiểm tra hàng hóa và
                    nhận hóa đơn.
                  </li>
                </ul>
              }
            />
          </Card>

          <Card
            className="policies-payment__card"
            title={
              <Space>
                <BankOutlined />
                <span>II. Thanh toán chuyển khoản ngân hàng</span>
              </Space>
            }
          >
            <Paragraph>
              Quý khách có thể thanh toán bằng hình thức chuyển khoản theo thông
              tin tài khoản được Lyys Store cung cấp trong quá trình xác nhận
              đơn hàng.
            </Paragraph>

            <List
              className="policies-payment__steps"
              dataSource={[
                "Ghi rõ mã đơn hàng hoặc số điện thoại đặt hàng trong nội dung chuyển khoản.",
                "Gửi ảnh hoặc chứng từ chuyển khoản cho Lyys Store sau khi hoàn tất thanh toán.",
                "Lyys Store kiểm tra, đối soát và xác nhận thanh toán.",
                "Đơn hàng sẽ được đóng gói và giao đến Quý khách trong thời gian cam kết.",
              ]}
              renderItem={(item, index) => (
                <List.Item>
                  <Space align="start">
                    <CreditCardOutlined className="policies-payment__step-icon" />

                    <div>
                      <Text strong>Bước {index + 1}: </Text>
                      <Text>{item}</Text>
                    </div>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Space>

        <Divider className="policies-payment__divider" />

        <div className="policies-content__benefits">
          {benefits.map((benefit) => (
            <div className="policies-content__benefit" key={benefit}>
              <CheckCircleFilled />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        <div className="policies-payment__secure">
          <SafetyCertificateOutlined />

          <span>
            Lyys Store cam kết bảo mật thông tin thanh toán của Quý khách.
          </span>
        </div>
      </div>
    </section>
  );
}
