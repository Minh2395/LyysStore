"use client";

import {
  CheckCircleFilled,
  ClockCircleOutlined,
  EyeOutlined,
  HeartOutlined,
  InfoCircleOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  SwapOutlined,
  CustomerServiceOutlined,
  ToolOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Alert, Card, Divider, List, Space, Typography } from "antd";

import "../../static/css/policies/policies.content.warranty.css";

const { Title, Paragraph, Text } = Typography;

const benefits = [
  "Bảo hành trọn đời",
  "Đo mắt miễn phí",
  "Thu cũ đổi mới",
  "Vệ sinh và bảo quản kính",
];

const adaptationReasons = [
  "Gọng kính mới có kiểu dáng, độ rộng hoặc vị trí đeo khác với gọng kính cũ.",
  "Độ kính mới thay đổi nhiều so với độ kính đang sử dụng.",
  "Khách hàng lần đầu sử dụng kính có độ hoặc thay đổi loại tròng kính.",
  "Tròng kính mới có độ trong suốt, lớp phủ hoặc khả năng lọc ánh sáng tốt hơn.",
  "Khoảng cách từ mắt đến tròng kính thay đổi theo thiết kế của gọng kính mới.",
  "Khách hàng đang làm quen với môi trường ánh sáng hoặc thiết bị điện tử.",
];

const specialWarranty = [
  "Hỗ trợ đổi sang sản phẩm khác khi kính gặp sự cố ngoài ý muốn, theo điều kiện áp dụng của Lyys Store.",
  "Hỗ trợ đổi mẫu gọng cùng mã khi sản phẩm còn nguyên tem mác và đáp ứng điều kiện đổi trả.",
  "Hỗ trợ kiểm tra, điều chỉnh độ kính trong thời gian đầu sử dụng theo kết luận của kỹ thuật viên.",
  "Đo mắt và kiểm tra thị lực miễn phí tại cửa hàng.",
  "Hỗ trợ giao hàng theo chính sách vận chuyển hiện hành của Lyys Store.",
];

const frameWarranty = [
  "Gọng kính có lỗi kỹ thuật hoặc lỗi từ nhà sản xuất.",
  "Gọng bị bung do tròng kính cắt quá căng, trong thời hạn bảo hành được áp dụng.",
  "Hỗ trợ sửa chữa, nắn chỉnh hoặc thay thế phụ kiện khi có linh kiện phù hợp.",
];

const frameNotWarranty = [
  "Gọng bị gãy, méo do va đập, ngồi lên kính, dẫm lên kính hoặc tác động ngoại lực.",
  "Mất phụ kiện, logo hoặc các chi tiết đặc biệt không còn linh kiện thay thế.",
  "Gọng bị biến dạng do nhiệt độ cao, hóa chất, dầu mỡ hoặc bảo quản không đúng cách.",
  "Tróc sơn, xước gọng do để chung với vật sắc nhọn hoặc sử dụng không đúng cách.",
  "Hao mòn, bay màu tự nhiên tại các vị trí tiếp xúc thường xuyên với da.",
];

const lensWarranty = [
  "Tròng kính bị lỗi lớp phủ theo điều kiện và thời hạn bảo hành của từng loại tròng.",
  "Lyys Store sẽ kiểm tra thực tế sản phẩm trước khi xác nhận phương án hỗ trợ phù hợp.",
];

const lensNotWarranty = [
  "Tròng kính bị xước do va chạm, lau kính khi còn bụi hoặc vệ sinh không đúng cách.",
  "Lớp phủ tròng bị ảnh hưởng do nhiệt độ cao, hóa chất hoặc môi trường có dầu mỡ nóng.",
  "Tròng kính bị mờ, xuống cấp sau thời gian sử dụng vượt quá khuyến nghị của nhà sản xuất.",
  "Hư hỏng phát sinh do bảo quản không đúng cách hoặc tác động từ bên ngoài.",
];

export default function PoliciesContentWarranty() {
  return (
    <section className="policies-content policies-warranty">
      <div className="policies-content__container">
        <div className="policies-content__heading">
          <Text className="policies-content__eyebrow">LYYS STORE</Text>

          <Title level={1}>CHÍNH SÁCH BẢO HÀNH, ĐỔI TRẢ</Title>

          <Paragraph>
            Lyys Store hỗ trợ kiểm tra, tư vấn và bảo hành sản phẩm nhằm giúp
            khách hàng an tâm trong suốt quá trình sử dụng kính.
          </Paragraph>
        </div>

        <Space
          direction="vertical"
          size={24}
          className="policies-warranty__list"
        >
          <Card
            className="policies-warranty__card"
            title={
              <Space>
                <EyeOutlined />
                <span>Một số lưu ý với kính mới</span>
              </Space>
            }
          >
            <Paragraph>
              Khi mới thay kính, khách hàng có thể cảm thấy choáng, lóa, nhức
              hoặc mỏi mắt. Đây là hiện tượng thường gặp và thường giảm dần sau
              khoảng 4 đến 7 ngày khi mắt thích nghi với kính mới.
            </Paragraph>

            <Title level={4} className="policies-warranty__sub-title">
              Một số nguyên nhân có thể gặp
            </Title>

            <List
              className="policies-warranty__steps"
              dataSource={adaptationReasons}
              renderItem={(item) => (
                <List.Item>
                  <Space align="start">
                    <InfoCircleOutlined className="policies-warranty__step-icon" />
                    <Text>{item}</Text>
                  </Space>
                </List.Item>
              )}
            />

            <Alert
              className="policies-warranty__notice"
              type="info"
              showIcon
              message="Khuyến nghị"
              description="Trong thời gian làm quen với kính mới, khách hàng nên sử dụng kính đều đặn và liên hệ Lyys Store nếu tình trạng khó chịu kéo dài."
            />
          </Card>

          <Card
            className="policies-warranty__card"
            title={
              <Space>
                <HeartOutlined />
                <span>Chế độ hỗ trợ đặc biệt</span>
              </Space>
            }
          >
            <List
              className="policies-warranty__steps"
              dataSource={specialWarranty}
              renderItem={(item) => (
                <List.Item>
                  <Space align="start">
                    <CheckCircleFilled className="policies-warranty__step-icon" />
                    <Text>{item}</Text>
                  </Space>
                </List.Item>
              )}
            />

            <Alert
              className="policies-warranty__notice"
              type="warning"
              showIcon
              message="Lưu ý"
              description="Chính sách bảo hành và đổi trả có thể không áp dụng đồng thời với một số chương trình ưu đãi. Điều kiện cụ thể sẽ được Lyys Store thông báo tại thời điểm mua hàng."
            />
          </Card>

          <Card
            className="policies-warranty__card"
            title={
              <Space>
                <SettingOutlined />
                <span>I. Bảo hành gọng kính</span>
              </Space>
            }
          >
            <Title level={4} className="policies-warranty__sub-title">
              A. Trường hợp được hỗ trợ bảo hành
            </Title>

            <List
              className="policies-warranty__steps"
              dataSource={frameWarranty}
              renderItem={(item) => (
                <List.Item>
                  <Space align="start">
                    <SafetyCertificateOutlined className="policies-warranty__step-icon" />
                    <Text>{item}</Text>
                  </Space>
                </List.Item>
              )}
            />

            <Divider />

            <Title level={4} className="policies-warranty__sub-title">
              B. Trường hợp không hỗ trợ bảo hành
            </Title>

            <List
              className="policies-warranty__steps"
              dataSource={frameNotWarranty}
              renderItem={(item) => (
                <List.Item>
                  <Space align="start">
                    <WarningOutlined className="policies-warranty__step-icon policies-warranty__step-icon--warning" />
                    <Text>{item}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>

          <Card
            className="policies-warranty__card"
            title={
              <Space>
                <ToolOutlined />
                <span>II. Bảo hành tròng kính</span>
              </Space>
            }
          >
            <Title level={4} className="policies-warranty__sub-title">
              A. Trường hợp được hỗ trợ bảo hành
            </Title>

            <List
              className="policies-warranty__steps"
              dataSource={lensWarranty}
              renderItem={(item) => (
                <List.Item>
                  <Space align="start">
                    <SafetyCertificateOutlined className="policies-warranty__step-icon" />
                    <Text>{item}</Text>
                  </Space>
                </List.Item>
              )}
            />

            <Divider />

            <Title level={4} className="policies-warranty__sub-title">
              B. Trường hợp không hỗ trợ bảo hành
            </Title>

            <List
              className="policies-warranty__steps"
              dataSource={lensNotWarranty}
              renderItem={(item) => (
                <List.Item>
                  <Space align="start">
                    <WarningOutlined className="policies-warranty__step-icon policies-warranty__step-icon--warning" />
                    <Text>{item}</Text>
                  </Space>
                </List.Item>
              )}
            />

            <Alert
              className="policies-warranty__notice"
              type="info"
              showIcon
              message="Hướng dẫn bảo quản tròng kính"
              description="Nên rửa kính bằng nước sạch trước khi lau, sử dụng khăn microfiber mềm và tránh để kính tại nơi có nhiệt độ cao để hạn chế xước hoặc ảnh hưởng đến lớp phủ."
            />
          </Card>

          <Card
            className="policies-warranty__card"
            title={
              <Space>
                <CustomerServiceOutlined />
                <span>Liên hệ hỗ trợ bảo hành</span>
              </Space>
            }
          >
            <Paragraph>
              Khi kính có dấu hiệu bất thường như nhức mắt, mỏi mắt, lóa mắt,
              gọng lỏng hoặc tròng có vấn đề, khách hàng vui lòng mang sản phẩm
              đến Lyys Store hoặc liên hệ qua kênh hỗ trợ chính thức để được
              kiểm tra.
            </Paragraph>

            <Paragraph>
              Lyys Store sẽ đánh giá tình trạng thực tế của sản phẩm và tư vấn
              phương án hỗ trợ phù hợp theo chính sách hiện hành.
            </Paragraph>
          </Card>
        </Space>

        <Divider className="policies-warranty__divider" />

        <div className="policies-content__benefits">
          {benefits.map((benefit) => (
            <div className="policies-content__benefit" key={benefit}>
              <CheckCircleFilled />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        <div className="policies-warranty__secure">
          <ClockCircleOutlined />
          <span>
            Lyys Store đồng hành cùng khách hàng trong quá trình sử dụng và bảo
            quản kính.
          </span>
        </div>
      </div>
    </section>
  );
}
