"use client";

import {
  CheckCircleFilled,
  CustomerServiceOutlined,
  DatabaseOutlined,
  EyeOutlined,
  FileProtectOutlined,
  GlobalOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  ShareAltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Alert, Card, Divider, List, Space, Typography } from "antd";

import "../../static/css/policies/policies.content.security.css";

const { Title, Paragraph, Text } = Typography;

const benefits = [
  "Bảo hành trọn đời",
  "Đo mắt miễn phí",
  "Thu cũ đổi mới",
  "Vệ sinh và bảo quản kính",
];

const informationUsage = [
  "Cung cấp dịch vụ, xử lý đơn hàng và hỗ trợ khách hàng theo nhu cầu mua sắm.",
  "Gửi thông báo liên quan đến đơn hàng, bảo hành, đổi trả hoặc các chương trình ưu đãi khi được sự đồng ý của khách hàng.",
  "Phát hiện, ngăn chặn hành vi giả mạo, truy cập trái phép hoặc các hoạt động có nguy cơ gây mất an toàn tài khoản.",
  "Liên hệ, hỗ trợ và giải quyết các vấn đề phát sinh trong quá trình sử dụng dịch vụ.",
];

export default function PoliciesContentSecurity() {
  return (
    <section className="policies-content policies-security">
      <div className="policies-content__container">
        <div className="policies-content__heading">
          <Text className="policies-content__eyebrow">LYYS STORE</Text>

          <Title level={1}>QUY ĐỊNH BẢO MẬT THÔNG TIN</Title>

          <Paragraph>
            Lyys Store cam kết tôn trọng và bảo vệ thông tin cá nhân của khách
            hàng trong quá trình truy cập, mua sắm và sử dụng dịch vụ.
          </Paragraph>
        </div>

        <Space
          direction="vertical"
          size={24}
          className="policies-security__list"
        >
          <Card
            className="policies-security__card"
            title={
              <Space>
                <FileProtectOutlined />
                <span>1. Mục đích thu thập thông tin</span>
              </Space>
            }
          >
            <Paragraph>
              Chính sách bảo mật này mô tả cách Lyys Store tiếp nhận, lưu giữ,
              sử dụng và bảo vệ thông tin của khách hàng khi truy cập hoặc giao
              dịch trên website.
            </Paragraph>

            <Paragraph>
              Việc khách hàng tiếp tục sử dụng website được hiểu là đã đọc, hiểu
              và đồng ý với các nội dung trong chính sách này. Các thay đổi hoặc
              bổ sung, nếu có, sẽ được thông báo trên website trước khi áp dụng.
            </Paragraph>
          </Card>

          <Card
            className="policies-security__card"
            title={
              <Space>
                <UserOutlined />
                <span>2. Thu thập thông tin khách hàng</span>
              </Space>
            }
          >
            <Paragraph>
              Lyys Store có thể thu thập các thông tin cần thiết như họ tên, số
              điện thoại, địa chỉ nhận hàng, email và thông tin liên quan đến
              đơn hàng để phục vụ việc mua sắm, giao nhận, bảo hành và đổi trả.
            </Paragraph>

            <Alert
              className="policies-security__notice"
              type="info"
              showIcon
              message="Trách nhiệm của khách hàng"
              description="Khách hàng cần cung cấp thông tin đầy đủ, chính xác và chủ động cập nhật khi có thay đổi để đảm bảo quyền lợi trong quá trình mua sắm."
            />
          </Card>

          <Card
            className="policies-security__card"
            title={
              <Space>
                <LockOutlined />
                <span>3. Lưu giữ và bảo mật thông tin</span>
              </Space>
            }
          >
            <Paragraph>
              Thông tin khách hàng và các trao đổi liên quan được lưu giữ trên
              hệ thống của Lyys Store và áp dụng các biện pháp kỹ thuật phù hợp
              để hạn chế truy cập, sử dụng hoặc tiết lộ trái phép.
            </Paragraph>

            <List
              className="policies-security__steps"
              dataSource={[
                "Áp dụng cơ chế kiểm soát quyền truy cập đối với dữ liệu khách hàng.",
                "Sử dụng các biện pháp bảo vệ hệ thống như tường lửa, mã hóa và sao lưu dữ liệu khi cần thiết.",
                "Thường xuyên rà soát, cập nhật biện pháp bảo mật nhằm giảm thiểu nguy cơ mất an toàn thông tin.",
                "Lưu giữ thông tin trong thời gian cần thiết để phục vụ giao dịch, bảo hành, hỗ trợ khách hàng và các nghĩa vụ theo quy định pháp luật.",
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Space align="start">
                    <SafetyCertificateOutlined className="policies-security__step-icon" />
                    <Text>{item}</Text>
                  </Space>
                </List.Item>
              )}
            />

            <Alert
              className="policies-security__notice"
              type="warning"
              showIcon
              message="Lưu ý an toàn tài khoản"
              description="Khách hàng không chia sẻ mật khẩu, mã xác thực hoặc thông tin tài khoản cho người khác. Không sử dụng công cụ, chương trình hay hành vi nhằm can thiệp trái phép vào hệ thống website."
            />
          </Card>

          <Card
            className="policies-security__card"
            title={
              <Space>
                <DatabaseOutlined />
                <span>4. Phạm vi sử dụng thông tin</span>
              </Space>
            }
          >
            <Paragraph>
              Thông tin khách hàng chỉ được sử dụng cho các mục đích cần thiết
              nhằm cung cấp dịch vụ và nâng cao trải nghiệm mua sắm.
            </Paragraph>

            <List
              className="policies-security__steps"
              dataSource={informationUsage}
              renderItem={(item) => (
                <List.Item>
                  <Space align="start">
                    <CheckCircleFilled className="policies-security__step-icon" />
                    <Text>{item}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>

          <Card
            className="policies-security__card"
            title={
              <Space>
                <ShareAltOutlined />
                <span>5. Chia sẻ thông tin khách hàng</span>
              </Space>
            }
          >
            <Paragraph>
              Lyys Store không bán, trao đổi hoặc cung cấp thông tin cá nhân của
              khách hàng cho bên thứ ba, trừ các trường hợp cần thiết để thực
              hiện dịch vụ như giao hàng, thanh toán, bảo hành hoặc theo yêu cầu
              hợp pháp của cơ quan có thẩm quyền.
            </Paragraph>

            <Paragraph>
              Trong trường hợp cần chia sẻ thông tin ngoài các mục đích cần
              thiết nêu trên, Lyys Store sẽ thông báo rõ ràng và chỉ thực hiện
              khi có sự đồng ý của khách hàng.
            </Paragraph>
          </Card>

          <Card
            className="policies-security__card"
            title={
              <Space>
                <EyeOutlined />
                <span>6. Quyền tiếp cận và chỉnh sửa thông tin</span>
              </Space>
            }
          >
            <Paragraph>
              Khách hàng có thể yêu cầu kiểm tra, cập nhật hoặc chỉnh sửa thông
              tin cá nhân đã cung cấp bằng cách liên hệ với Lyys Store qua các
              kênh hỗ trợ chính thức.
            </Paragraph>

            <Paragraph>
              Lyys Store sẽ tiếp nhận và xử lý yêu cầu trong thời gian phù hợp,
              nhằm đảm bảo quyền lợi và tính chính xác của thông tin khách hàng.
            </Paragraph>
          </Card>

          <Card
            className="policies-security__card"
            title={
              <Space>
                <GlobalOutlined />
                <span>7. Sử dụng Cookies</span>
              </Space>
            }
          >
            <Paragraph>
              Website có thể sử dụng cookies hoặc công nghệ tương tự để ghi nhớ
              lựa chọn, lịch sử truy cập và cải thiện trải nghiệm sử dụng của
              khách hàng.
            </Paragraph>

            <Paragraph>
              Cookies không được sử dụng để thu thập thông tin nhạy cảm trái
              phép. Khách hàng có thể quản lý hoặc tắt cookies trong cài đặt
              trình duyệt nếu cần.
            </Paragraph>
          </Card>

          <Card
            className="policies-security__card"
            title={
              <Space>
                <CustomerServiceOutlined />
                <span>8. Liên hệ và giải đáp thắc mắc</span>
              </Space>
            }
          >
            <Paragraph>
              Khi cần hỗ trợ, giải đáp thắc mắc hoặc gửi khiếu nại liên quan đến
              thông tin cá nhân, khách hàng vui lòng liên hệ với Lyys Store qua
              các kênh hỗ trợ chính thức được công bố trên website.
            </Paragraph>
          </Card>
        </Space>

        <Divider className="policies-security__divider" />

        <div className="policies-content__benefits">
          {benefits.map((benefit) => (
            <div className="policies-content__benefit" key={benefit}>
              <CheckCircleFilled />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        <div className="policies-security__secure">
          <SafetyCertificateOutlined />
          <span>
            Lyys Store luôn nỗ lực bảo vệ dữ liệu và quyền riêng tư của khách
            hàng.
          </span>
        </div>
      </div>
    </section>
  );
}
