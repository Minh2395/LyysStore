"use client";

import {
  CheckCircleFilled,
  ClockCircleOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  SendOutlined,
  ShoppingOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { Alert, Card, Divider, List, Space, Table, Typography } from "antd";

import "../../static/css/policies/policies.content.shipping.css";

const { Title, Paragraph, Text } = Typography;

const benefits = [
  "Bảo hành trọn đời",
  "Đo mắt miễn phí",
  "Thu cũ đổi mới",
  "Vệ sinh và bảo quản kính",
];

const shippingFeeData = [
  {
    key: "hanoi",
    area: "Khu vực nội thành",
    fee0to2: "Từ 16.500đ",
    fee2to5: "Từ 24.000đ",
    fee5to8: "Từ 32.000đ",
    fee8to10: "Từ 45.000đ",
    fee10to12: "Từ 60.000đ",
    fee12to15: "Từ 100.000đ",
    fee15plus: "Từ 150.000đ",
  },
  {
    key: "hcm",
    area: "Khu vực ngoại thành",
    fee0to2: "Từ 40.000đ",
    fee2to5: "Từ 60.000đ",
    fee5to8: "Từ 80.000đ",
    fee8to10: "Từ 100.000đ",
    fee10to12: "Từ 120.000đ",
    fee12to15: "Từ 150.000đ",
    fee15plus: "Từ 200.000đ",
  },
  {
    key: "other",
    area: "Các tỉnh/thành khác",
    fee0to2: "Từ 35.000đ",
    fee2to5: "Từ 45.000đ",
    fee5to8: "Từ 75.000đ",
    fee8to10: "Từ 90.000đ",
    fee10to12: "Từ 110.000đ",
    fee12to15: "Từ 140.000đ",
    fee15plus: "Từ 180.000đ",
  },
];

const shippingFeeColumns = [
  {
    title: "Khu vực",
    dataIndex: "area",
    key: "area",
    fixed: "left" as const,
    width: 190,
  },
  {
    title: "0 - 2kg",
    dataIndex: "fee0to2",
    key: "fee0to2",
    width: 125,
  },
  {
    title: "2 - 5kg",
    dataIndex: "fee2to5",
    key: "fee2to5",
    width: 125,
  },
  {
    title: "5 - 8kg",
    dataIndex: "fee5to8",
    key: "fee5to8",
    width: 125,
  },
  {
    title: "8 - 10kg",
    dataIndex: "fee8to10",
    key: "fee8to10",
    width: 125,
  },
  {
    title: "10 - 12kg",
    dataIndex: "fee10to12",
    key: "fee10to12",
    width: 125,
  },
  {
    title: "12 - 15kg",
    dataIndex: "fee12to15",
    key: "fee12to15",
    width: 125,
  },
  {
    title: "Từ 15kg",
    dataIndex: "fee15plus",
    key: "fee15plus",
    width: 125,
  },
];

const deliveryTimes = [
  "Đơn gọng kính: thời gian giao hàng dự kiến từ 2 đến 4 ngày làm việc.",
  "Đơn kính cắt theo độ: thời gian giao hàng dự kiến từ 3 đến 5 ngày làm việc.",
  "Thời gian giao hàng không bao gồm thứ Bảy, Chủ Nhật và các ngày lễ.",
  "Thời gian thực tế có thể thay đổi do tiến độ sản xuất, thời tiết, thiên tai hoặc các sự kiện bất khả kháng.",
];

const inspectionRules = [
  "Kiểm tra tình trạng gói hàng, mẫu mã, số lượng và sản phẩm trước khi thanh toán.",
  "Chỉ thanh toán và nhận hàng khi sản phẩm đúng với đơn hàng đã đặt.",
  "Có thể từ chối nhận hàng nếu sản phẩm không đúng hoặc không đáp ứng yêu cầu kiểm tra.",
  "Không sử dụng vật sắc nhọn để mở gói hàng nhằm tránh làm hư hỏng sản phẩm.",
];

export default function PoliciesContentShipping() {
  return (
    <section className="policies-content policies-shipping">
      <div className="policies-content__container">
        <div className="policies-content__heading">
          <Text className="policies-content__eyebrow">LYYS STORE</Text>

          <Title level={1}>CHÍNH SÁCH VẬN CHUYỂN</Title>

          <Paragraph>
            Lyys Store cung cấp thông tin về cước phí, thời gian giao hàng, kiểm
            tra đơn hàng và trách nhiệm của các bên trong quá trình vận chuyển.
          </Paragraph>
        </div>

        <Space
          direction="vertical"
          size={24}
          className="policies-shipping__list"
        >
          <Card
            className="policies-shipping__card"
            title={
              <Space>
                <TruckOutlined />
                <span>I. Cước phí vận chuyển</span>
              </Space>
            }
          >
            <Paragraph>
              Phí vận chuyển được tính dựa trên khu vực nhận hàng, trọng lượng
              đơn hàng sau đóng gói và hình thức giao hàng được lựa chọn.
            </Paragraph>

            <div className="policies-shipping__table">
              <Table
                columns={shippingFeeColumns}
                dataSource={shippingFeeData}
                pagination={false}
                scroll={{ x: 1065 }}
                size="middle"
              />
            </div>

            <Alert
              className="policies-shipping__notice"
              type="info"
              showIcon
              icon={<InfoCircleOutlined />}
              message="Giao hàng hỏa tốc"
              description="Với các đơn hàng cần giao gấp trong khu vực nội thành, khách hàng vui lòng liên hệ trực tiếp với Lyys Store để được báo phí và xác nhận khả năng giao hàng. Đơn hỏa tốc có thể yêu cầu thanh toán trước giá trị đơn hàng."
            />
          </Card>

          <Card
            className="policies-shipping__card"
            title={
              <Space>
                <ClockCircleOutlined />
                <span>II. Thời gian và đơn vị vận chuyển</span>
              </Space>
            }
          >
            <Title level={4} className="policies-shipping__sub-title">
              a) Thời gian giao hàng
            </Title>

            <List
              className="policies-shipping__steps"
              dataSource={deliveryTimes}
              renderItem={(item) => (
                <List.Item>
                  <Space align="start">
                    <ClockCircleOutlined className="policies-shipping__step-icon" />
                    <Text>{item}</Text>
                  </Space>
                </List.Item>
              )}
            />

            <Alert
              className="policies-shipping__notice"
              type="warning"
              showIcon
              icon={<ExclamationCircleOutlined />}
              message="Lưu ý về số lần giao hàng"
              description="Đơn hàng có thể được giao lại tối đa 3 lần. Nếu giao không thành công sau các lần liên hệ và giao lại, đơn hàng có thể được hủy theo quy trình của Lyys Store."
            />

            <Divider />

            <Title level={4} className="policies-shipping__sub-title">
              b) Đơn vị vận chuyển
            </Title>

            <List
              className="policies-shipping__steps"
              dataSource={[
                "Lyys Store sẽ lựa chọn đơn vị vận chuyển phù hợp với khu vực, thời gian và đặc điểm của đơn hàng.",
                "Khách hàng có nhu cầu nhận hàng gấp vui lòng ghi chú khi đặt hàng hoặc liên hệ qua kênh hỗ trợ chính thức.",
                "Cước phí có thể thay đổi đối với đơn hàng cồng kềnh hoặc có yêu cầu giao nhận đặc biệt. Lyys Store sẽ thông báo trước khi xác nhận đơn hàng.",
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Space align="start">
                    <SendOutlined className="policies-shipping__step-icon" />
                    <Text>{item}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>

          <Card
            className="policies-shipping__card"
            title={
              <Space>
                <SearchOutlined />
                <span>III. Kiểm tra trạng thái đơn hàng</span>
              </Space>
            }
          >
            <Paragraph>
              Khách hàng có thể liên hệ với Lyys Store qua các kênh hỗ trợ chính
              thức để kiểm tra tình trạng xử lý, mã vận đơn và thời gian giao
              hàng dự kiến.
            </Paragraph>
          </Card>

          <Card
            className="policies-shipping__card"
            title={
              <Space>
                <InboxOutlined />
                <span>IV. Đồng kiểm trước khi thanh toán</span>
              </Space>
            }
          >
            <Paragraph>
              Trước khi nhận hàng và thanh toán, khách hàng có quyền kiểm tra
              sản phẩm để đảm bảo đơn hàng được giao đúng thông tin đã đặt.
            </Paragraph>

            <List
              className="policies-shipping__steps"
              dataSource={inspectionRules}
              renderItem={(item) => (
                <List.Item>
                  <Space align="start">
                    <CheckCircleFilled className="policies-shipping__step-icon" />
                    <Text>{item}</Text>
                  </Space>
                </List.Item>
              )}
            />

            <Alert
              className="policies-shipping__notice"
              type="warning"
              showIcon
              icon={<ExclamationCircleOutlined />}
              message="Lưu ý khi mở gói hàng"
              description="Nhân viên giao nhận cần chờ khách hàng kiểm tra hàng hóa theo quy định. Nếu gặp khó khăn trong quá trình kiểm tra, khách hàng vui lòng liên hệ Lyys Store để được hỗ trợ."
            />
          </Card>

          <Card
            className="policies-shipping__card"
            title={
              <Space>
                <SafetyCertificateOutlined />
                <span>V. Phân định trách nhiệm vận chuyển</span>
              </Space>
            }
          >
            <div className="policies-shipping__responsibility">
              <div className="policies-shipping__responsibility-item">
                <EnvironmentOutlined />

                <div>
                  <Title level={4}>Trách nhiệm bên vận chuyển</Title>
                  <Paragraph>
                    Đảm bảo giao hàng an toàn, đúng địa điểm và thời gian đã
                    thỏa thuận; chịu trách nhiệm theo quy định nếu hàng hóa bị
                    mất hoặc hư hỏng do lỗi trong quá trình vận chuyển.
                  </Paragraph>
                </div>
              </div>

              <div className="policies-shipping__responsibility-item">
                <ShoppingOutlined />

                <div>
                  <Title level={4}>Trách nhiệm khách hàng</Title>
                  <Paragraph>
                    Cung cấp chính xác thông tin nhận hàng, thanh toán phí vận
                    chuyển theo thỏa thuận và phối hợp nhận hàng đúng thời gian
                    dự kiến.
                  </Paragraph>
                </div>
              </div>

              <div className="policies-shipping__responsibility-item">
                <SafetyCertificateOutlined />

                <div>
                  <Title level={4}>Trường hợp bất khả kháng</Title>
                  <Paragraph>
                    Với các sự kiện ngoài khả năng kiểm soát như thiên tai, thời
                    tiết xấu hoặc gián đoạn vận tải, thời gian giao hàng có thể
                    thay đổi. Lyys Store sẽ chủ động cập nhật thông tin khi có
                    phát sinh.
                  </Paragraph>
                </div>
              </div>
            </div>
          </Card>
        </Space>

        <Divider className="policies-shipping__divider" />

        <div className="policies-content__benefits">
          {benefits.map((benefit) => (
            <div className="policies-content__benefit" key={benefit}>
              <CheckCircleFilled />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        <div className="policies-shipping__secure">
          <TruckOutlined />
          <span>
            Lyys Store luôn nỗ lực giao hàng an toàn, đúng hẹn và hỗ trợ khách
            hàng trong suốt quá trình nhận hàng.
          </span>
        </div>
      </div>
    </section>
  );
}
