"use client";

import {
  CheckCircleFilled,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CopyrightOutlined,
  FileProtectOutlined,
  InfoCircleOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  ShoppingCartOutlined,
  SwapOutlined,
  TeamOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Alert, Card, Divider, List, Space, Typography } from "antd";

import "../../static/css/policies/policies.content.customer.css";

const { Title, Paragraph, Text } = Typography;

const benefits = [
  "Bảo hành trọn đời",
  "Đo mắt miễn phí",
  "Thu cũ đổi mới",
  "Vệ sinh và bảo quản kính",
];

const generalRules = [
  "Khi truy cập và sử dụng website Lyys Store, khách hàng được hiểu là đã đọc, hiểu và đồng ý với các chính sách, điều khoản được công bố trên website.",
  "Lyys Store có thể điều chỉnh, bổ sung hoặc cập nhật nội dung điều kiện giao dịch khi cần thiết. Nội dung cập nhật có hiệu lực kể từ thời điểm được đăng tải.",
  "Khách hàng cần đủ điều kiện pháp lý để thực hiện giao dịch hoặc sử dụng website dưới sự giám sát của cha mẹ, người giám hộ hợp pháp khi cần thiết.",
  "Khách hàng có trách nhiệm tuân thủ các quy định pháp luật hiện hành khi thực hiện giao dịch trên website.",
];

const accountRules = [
  "Cung cấp thông tin đầy đủ, chính xác và cập nhật khi đăng ký hoặc đặt hàng.",
  "Tự bảo mật mật khẩu, thông tin đăng nhập và chịu trách nhiệm với hoạt động phát sinh từ tài khoản của mình.",
  "Thông báo ngay cho Lyys Store khi phát hiện dấu hiệu truy cập trái phép hoặc nghi ngờ tài khoản bị xâm phạm.",
  "Không sử dụng tài khoản để cung cấp thông tin giả mạo, thực hiện hành vi gian lận hoặc vi phạm quy định pháp luật.",
];

const orderRules = [
  "Lyys Store luôn cố gắng đảm bảo thông tin sản phẩm, giá bán và nội dung hiển thị trên website là chính xác.",
  "Trong trường hợp phát sinh sai sót về giá, tồn kho hoặc thông tin sản phẩm, Lyys Store có quyền liên hệ để xác nhận, điều chỉnh hoặc hủy đơn hàng.",
  "Nếu khách hàng đã thanh toán nhưng đơn hàng không thể thực hiện, Lyys Store sẽ hỗ trợ xử lý hoàn tiền theo quy trình phù hợp.",
  "Tiến độ mua hàng, giao hàng có thể bị ảnh hưởng bởi thiên tai, hỏa hoạn, dịch bệnh, sự cố kỹ thuật, gián đoạn Internet hoặc các tình huống bất khả kháng khác.",
];

const customerResponsibilities = [
  "Nhận hàng theo đơn đã đặt hoặc thông báo sớm cho Lyys Store nếu cần thay đổi thông tin nhận hàng.",
  "Cung cấp mã đơn hàng, hóa đơn hoặc thông tin xác nhận liên quan khi cần hỗ trợ khiếu nại.",
  "Quay video mở hàng hoặc lưu lại bằng chứng phù hợp nếu phát sinh vấn đề về sản phẩm, số lượng hoặc tình trạng giao nhận.",
  "Phối hợp với Lyys Store trong quá trình xác minh và xử lý yêu cầu hỗ trợ.",
];

const storeResponsibilities = [
  "Xác nhận đơn hàng qua thông tin liên hệ khách hàng đã cung cấp.",
  "Giao đúng sản phẩm, số lượng và chất lượng theo thông tin đơn hàng đã được xác nhận.",
  "Hỗ trợ đổi trả, bổ sung hoặc xử lý phù hợp nếu lỗi phát sinh từ Lyys Store, nhà sản xuất hoặc đơn vị vận chuyển.",
  "Áp dụng biện pháp bảo mật thông tin khách hàng và sử dụng dữ liệu đúng mục đích theo chính sách hiện hành.",
];

const copyrightRules = [
  "Thiết kế, hình ảnh, nội dung, mã nguồn, văn bản và các tài nguyên trên website thuộc quyền sở hữu hoặc quyền sử dụng hợp pháp của Lyys Store.",
  "Không sao chép, chỉnh sửa, phát hành hoặc sử dụng lại nội dung cho mục đích thương mại nếu chưa có sự chấp thuận bằng văn bản.",
  "Các hành vi xâm phạm quyền sở hữu trí tuệ có thể bị xử lý theo quy định pháp luật.",
];

export default function PoliciesContentCustomer() {
  return (
    <section className="policies-content policies-customer">
      <div className="policies-content__container">
        <div className="policies-content__heading">
          <Text className="policies-content__eyebrow">LYYS STORE</Text>

          <Title level={1}>CHÍNH SÁCH KHÁCH HÀNG</Title>

          <Paragraph>
            Thông tin về điều kiện giao dịch chung, quyền lợi và trách nhiệm của
            khách hàng khi sử dụng website Lyys Store.
          </Paragraph>
        </div>

        <Space
          direction="vertical"
          size={24}
          className="policies-customer__list"
        >
          <Card
            className="policies-customer__card"
            title={
              <Space>
                <FileProtectOutlined />
                <span>1. Quy định chung</span>
              </Space>
            }
          >
            <List
              className="policies-customer__steps"
              dataSource={generalRules}
              renderItem={(item) => (
                <List.Item>
                  <Space align="start">
                    <CheckCircleFilled className="policies-customer__step-icon" />
                    <Text>{item}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>

          <Card
            className="policies-customer__card"
            title={
              <Space>
                <LockOutlined />
                <span>2. Trách nhiệm và bảo mật tài khoản</span>
              </Space>
            }
          >
            <List
              className="policies-customer__steps"
              dataSource={accountRules}
              renderItem={(item) => (
                <List.Item>
                  <Space align="start">
                    <SafetyCertificateOutlined className="policies-customer__step-icon" />
                    <Text>{item}</Text>
                  </Space>
                </List.Item>
              )}
            />

            <Alert
              className="policies-customer__notice"
              type="warning"
              showIcon
              icon={<WarningOutlined />}
              message="Bảo mật tài khoản"
              description="Khách hàng không nên chia sẻ mật khẩu, mã xác thực hoặc thông tin đăng nhập cho bất kỳ cá nhân, tổ chức nào không thuộc kênh hỗ trợ chính thức của Lyys Store."
            />
          </Card>

          <Card
            className="policies-customer__card"
            title={
              <Space>
                <ShoppingCartOutlined />
                <span>3. Chấp nhận đơn hàng, giá cả và bất khả kháng</span>
              </Space>
            }
          >
            <List
              className="policies-customer__steps"
              dataSource={orderRules}
              renderItem={(item) => (
                <List.Item>
                  <Space align="start">
                    <InfoCircleOutlined className="policies-customer__step-icon" />
                    <Text>{item}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>

          <Card
            className="policies-customer__card"
            title={
              <Space>
                <TeamOutlined />
                <span>4. Trách nhiệm của các bên khi giao dịch</span>
              </Space>
            }
          >
            <div className="policies-customer__responsibility">
              <div className="policies-customer__responsibility-item">
                <UserOutlined />

                <div>
                  <Title level={4}>Trách nhiệm của khách hàng</Title>

                  <List
                    className="policies-customer__compact-list"
                    dataSource={customerResponsibilities}
                    renderItem={(item) => (
                      <List.Item>
                        <CheckCircleFilled />
                        <Text>{item}</Text>
                      </List.Item>
                    )}
                  />
                </div>
              </div>

              <div className="policies-customer__responsibility-item">
                <SafetyCertificateOutlined />

                <div>
                  <Title level={4}>Trách nhiệm của Lyys Store</Title>

                  <List
                    className="policies-customer__compact-list"
                    dataSource={storeResponsibilities}
                    renderItem={(item) => (
                      <List.Item>
                        <CheckCircleFilled />
                        <Text>{item}</Text>
                      </List.Item>
                    )}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card
            className="policies-customer__card"
            title={
              <Space>
                <SwapOutlined />
                <span>5. Thay đổi hoặc hủy bỏ giao dịch</span>
              </Space>
            }
          >
            <Paragraph>
              Khách hàng có thể yêu cầu thay đổi, hủy đơn hoặc đổi trả sản phẩm
              khi đáp ứng điều kiện của chính sách đổi trả hiện hành.
            </Paragraph>

            <Paragraph>
              Sản phẩm cần còn nguyên trạng, chưa qua sử dụng và không phát sinh
              quyền lợi hoặc hậu quả từ quá trình sử dụng trước khi yêu cầu được
              xem xét xử lý.
            </Paragraph>

            <Alert
              className="policies-customer__notice"
              type="info"
              showIcon
              icon={<InfoCircleOutlined />}
              message="Lưu ý về đổi trả"
              description="Việc thay đổi hoặc hủy giao dịch sẽ được đánh giá dựa trên trạng thái đơn hàng, tình trạng sản phẩm và chính sách đổi trả của Lyys Store tại thời điểm yêu cầu."
            />
          </Card>

          <Card
            className="policies-customer__card"
            title={
              <Space>
                <CopyrightOutlined />
                <span>6. Thương hiệu và bản quyền</span>
              </Space>
            }
          >
            <List
              className="policies-customer__steps"
              dataSource={copyrightRules}
              renderItem={(item) => (
                <List.Item>
                  <Space align="start">
                    <CopyrightOutlined className="policies-customer__step-icon" />
                    <Text>{item}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>

          <Card
            className="policies-customer__card"
            title={
              <Space>
                <SafetyCertificateOutlined />
                <span>7. Giải quyết tranh chấp và luật áp dụng</span>
              </Space>
            }
          >
            <Paragraph>
              Các khiếu nại hoặc tranh chấp phát sinh từ giao dịch sẽ được ưu
              tiên giải quyết bằng thương lượng và hòa giải trên tinh thần hợp
              tác.
            </Paragraph>

            <Paragraph>
              Nếu không thể giải quyết bằng thỏa thuận, vụ việc sẽ được xử lý
              theo quy định pháp luật Việt Nam tại cơ quan có thẩm quyền.
            </Paragraph>

            <Alert
              className="policies-customer__notice"
              type="info"
              showIcon
              icon={<ClockCircleOutlined />}
              message="Hiệu lực điều khoản"
              description="Nếu một điều khoản bị xác định là không hợp pháp hoặc không còn hiệu lực, các điều khoản còn lại vẫn được duy trì hiệu lực trong phạm vi pháp luật cho phép."
            />
          </Card>
        </Space>

        <Divider className="policies-customer__divider" />

        <div className="policies-content__benefits">
          {benefits.map((benefit) => (
            <div className="policies-content__benefit" key={benefit}>
              <CheckCircleFilled />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        <div className="policies-customer__secure">
          <SafetyCertificateOutlined />
          <span>
            Lyys Store cam kết hỗ trợ khách hàng minh bạch, an toàn và đúng
            chính sách trong mọi giao dịch.
          </span>
        </div>
      </div>
    </section>
  );
}
