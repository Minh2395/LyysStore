"use client";

import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Typography,
} from "antd";
import "../../../static/css/users/users.content.orders.css";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function UsersContentOrders() {
  const [form] = Form.useForm();

  return (
    <div id="orders-page" className="orders-page">
      <div className="orders-container">
        <Row className="orders-layout">
          {/* LEFT */}
          <Col className="orders-main">
            <div id="orders-left" className="orders-left">
              <Form
                id="orders-form"
                className="orders-form"
                form={form}
                layout="vertical"
                size="large"
              >
                <section id="shipping-section" className="shipping-section">
                  <Title level={2} className="section-title">
                    THÔNG TIN GIAO HÀNG
                  </Title>

                  <Row className="form-row">
                    <Col className="form-col">
                      <Form.Item
                        name="full_name"
                        rules={[{ required: true, message: "Nhập họ tên" }]}
                      >
                        <Input placeholder="Họ và tên" />
                      </Form.Item>
                    </Col>

                    <Col className="form-col">
                      <Form.Item
                        name="phone"
                        rules={[
                          {
                            required: true,
                            message: "Nhập số điện thoại",
                          },
                        ]}
                      >
                        <Input placeholder="Số điện thoại" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item name="email">
                    <Input placeholder="Email" />
                  </Form.Item>

                  <Form.Item
                    name="address"
                    rules={[
                      {
                        required: true,
                        message: "Nhập địa chỉ",
                      },
                    ]}
                  >
                    <Input placeholder="Địa chỉ chi tiết" />
                  </Form.Item>

                  <Form.Item name="province">
                    <Select placeholder="Tỉnh / Thành phố" options={[]} />
                  </Form.Item>

                  <Row className="form-row">
                    <Col className="form-col">
                      <Form.Item name="district">
                        <Select placeholder="Quận / Huyện" options={[]} />
                      </Form.Item>
                    </Col>

                    <Col className="form-col">
                      <Form.Item name="ward">
                        <Select placeholder="Phường / Xã" options={[]} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item name="note">
                    <TextArea rows={4} placeholder="Ghi chú" />
                  </Form.Item>
                </section>

                <section id="payment-section" className="payment-section">
                  <Title level={2} className="section-title">
                    HÌNH THỨC THANH TOÁN
                  </Title>

                  <Text type="secondary">
                    Toàn bộ giao dịch được bảo mật và mã hóa
                  </Text>

                  <Form.Item name="payment" initialValue="cod">
                    <Radio.Group className="payment-group">
                      <Card>
                        <Radio value="bank">Chuyển khoản</Radio>
                      </Card>

                      <Card>
                        <Radio value="cod">
                          Thanh toán khi nhận hàng (COD)
                        </Radio>
                      </Card>
                    </Radio.Group>
                  </Form.Item>

                  <Button type="primary" size="large" block>
                    THANH TOÁN NGAY
                  </Button>
                </section>
              </Form>
            </div>
          </Col>

          {/* RIGHT */}
          <Col className="orders-sidebar">
            <aside id="orders-summary">
              <Card bordered={false}>
                <Title level={2}>GIỎ HÀNG (2)</Title>

                <div className="coupon-box">
                  <Row className="coupon-row">
                    <Col className="coupon-input">
                      <Input placeholder="Mã giảm giá" />
                    </Col>

                    <Col>
                      <Button type="primary">CHỌN MÃ</Button>
                    </Col>
                  </Row>
                </div>

                <Divider />

                <div className="summary-content">
                  <div className="summary-row">
                    <Text>Tạm tính</Text>
                    <Text>0đ</Text>
                  </div>

                  <div className="summary-row">
                    <Text>Giảm giá</Text>
                    <Text>0đ</Text>
                  </div>

                  <div className="summary-row">
                    <Text>Phí giao hàng</Text>
                    <Text>30.000đ</Text>
                  </div>
                </div>

                <Divider />

                <div className="summary-total">
                  <Title level={2}>TỔNG</Title>
                  <Title level={2}>30.000đ</Title>
                </div>
              </Card>
            </aside>
          </Col>
        </Row>
      </div>
    </div>
  );
}
