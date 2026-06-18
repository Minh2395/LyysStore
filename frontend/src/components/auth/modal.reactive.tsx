"use client";

import { useHasMounted } from "@/utils/customHook";
import { Button, Form, Input, Modal, notification, Steps } from "antd";
import {
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";

// ======================
// TYPES
// ======================

interface IBackendRes<T> {
  data?: T;
  message?: string;
}

const ModalReactive = (props: any) => {
  const { isModalOpen, setIsModalOpen, userEmail } = props;

  const [current, setCurrent] = useState(0);
  const [userId, setUserId] = useState("");

  const [form] = Form.useForm();

  // reset state mỗi lần mở modal
  useEffect(() => {
    if (isModalOpen) {
      setCurrent(0);
      setUserId("");
      form.resetFields();
    }
  }, [isModalOpen]);

  return (
    <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)}>
      {current === 0 && <div>Step 1 content</div>}

      {current === 1 && <div>Step 2 content</div>}

      {current === 2 && <div>Step 3 content</div>}
    </Modal>
  );

  // ======================
  // STEP 1: RESEND CODE
  // ======================
  const onFinishStep0 = async (values: { email: string }) => {
    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-active`,
        method: "POST",
        body: {
          email: values.email,
        },
      });

      if (res?.data) {
        setUserId(res.data._id);
        setCurrent(1);

        notification.success({
          message: "Success",
          description: "Mã kích hoạt đã được gửi lại email",
        });
      } else {
        notification.error({
          message: "Error",
          description: res?.message || "Cannot resend code",
        });
      }
    } catch (err: any) {
      notification.error({
        message: "System error",
        description: err?.message,
      });
    }
  };

  // ======================
  // STEP 2: VERIFY CODE
  // ======================
  const onFinishStep1 = async (values: { code: string }) => {
    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
        method: "POST",
        body: {
          code: values.code,
          _id: userId,
        },
      });

      if (res?.data) {
        setCurrent(2);

        notification.success({
          message: "Success",
          description: "Tài khoản đã được kích hoạt",
        });
      } else {
        notification.error({
          message: "Error",
          description: res?.message || "Invalid code",
        });
      }
    } catch (err: any) {
      notification.error({
        message: "System error",
        description: err?.message,
      });
    }
  };

  return (
    <Modal
      title="Kích hoạt tài khoản"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      mask={{
        closable: false,
      }}
    >
      <Steps
        current={current}
        items={[
          { title: "Login", icon: <UserOutlined /> },
          { title: "Verification", icon: <SolutionOutlined /> },
          { title: "Done", icon: <SmileOutlined /> },
        ]}
      />

      {/* STEP 0 */}
      {current === 0 && (
        <>
          <div style={{ margin: "20px 0" }}>
            <p>Tài khoản của bạn chưa được kích hoạt</p>
          </div>

          <Form form={form} onFinish={onFinishStep0} layout="vertical">
            <Form.Item name="email" initialValue={userEmail}>
              <Input disabled />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Resend
              </Button>
            </Form.Item>
          </Form>
        </>
      )}

      {/* STEP 1 */}
      {current === 1 && (
        <>
          <div style={{ margin: "20px 0" }}>
            <p>Vui lòng nhập mã xác nhận</p>
          </div>

          <Form onFinish={onFinishStep1} layout="vertical">
            <Form.Item
              name="code"
              rules={[{ required: true, message: "Please input your code!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Active
              </Button>
            </Form.Item>
          </Form>
        </>
      )}

      {/* STEP 2 */}
      {current === 2 && (
        <div style={{ margin: "20px 0" }}>
          <p>
            Tài khoản của bạn đã được kích hoạt thành công. Vui lòng đăng nhập
            lại
          </p>

          <Button type="primary" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default ModalReactive;
