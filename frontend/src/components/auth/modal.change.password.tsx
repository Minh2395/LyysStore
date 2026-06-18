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

const ModalChangePassword = (props: any) => {
  const { isModalOpen, setIsModalOpen } = props;

  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const hasMounted = useHasMounted();

  // reset state khi mở modal
  useEffect(() => {
    if (isModalOpen) {
      setCurrent(0);
      setUserEmail("");
      form.resetFields();
    }
  }, [isModalOpen]);

  if (!hasMounted) return null;

  // ======================
  // STEP 1: REQUEST RESET EMAIL
  // ======================
  const onFinishStep0 = async (values: { email: string }) => {
    setLoading(true);

    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-password`,
        method: "POST",
        body: {
          email: values.email,
        },
      });

      if (res?.data) {
        setUserEmail(res.data.email);
        setCurrent(1);

        notification.success({
          message: "Success",
          description: "OTP đã được gửi tới email",
        });
      } else {
        notification.error({
          message: "Error",
          description: res?.message || "Cannot send reset code",
        });
      }
    } catch (err: any) {
      notification.error({
        message: "System error",
        description: err?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // STEP 2: RESET PASSWORD
  // ======================
  const onFinishStep1 = async (values: {
    code: string;
    password: string;
    confirmPassword: string;
  }) => {
    setLoading(true);

    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/change-password`,
        method: "POST",
        body: {
          code: values.code,
          password: values.password,
          confirmPassword: values.confirmPassword,
          email: userEmail,
        },
      });

      if (res?.data) {
        setCurrent(2);

        notification.success({
          message: "Success",
          description: "Đổi mật khẩu thành công",
        });
      } else {
        notification.error({
          message: "Error",
          description: res?.message || "Invalid request",
        });
      }
    } catch (err: any) {
      notification.error({
        message: "System error",
        description: err?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // reset modal
  const resetModal = () => {
    setIsModalOpen(false);
    setCurrent(0);
    setUserEmail("");
    form.resetFields();
  };

  return (
    <Modal
      title="Quên mật khẩu"
      open={isModalOpen}
      onCancel={resetModal}
      footer={null}
      maskClosable={false}
    >
      <Steps
        current={current}
        items={[
          { title: "Email", icon: <UserOutlined /> },
          { title: "Verification", icon: <SolutionOutlined /> },
          { title: "Done", icon: <SmileOutlined /> },
        ]}
      />

      {/* STEP 0 */}
      {current === 0 && (
        <>
          <div style={{ margin: "20px 0" }}>
            <p>Nhập email để khôi phục mật khẩu</p>
          </div>

          <Form form={form} onFinish={onFinishStep0} layout="vertical">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Invalid email format" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </>
      )}

      {/* STEP 1 */}
      {current === 1 && (
        <>
          <div style={{ margin: "20px 0" }}>
            <p>Nhập mã OTP và mật khẩu mới</p>
          </div>

          <Form onFinish={onFinishStep1} layout="vertical">
            <Form.Item
              name="code"
              rules={[{ required: true, message: "Code is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Password is required" },
                { min: 6, message: "Min 6 characters" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Confirm password is required" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Confirm
              </Button>
            </Form.Item>
          </Form>
        </>
      )}

      {/* STEP 2 */}
      {current === 2 && (
        <div style={{ margin: "20px 0" }}>
          <p>Đổi mật khẩu thành công. Vui lòng đăng nhập lại.</p>

          <Button type="primary" onClick={resetModal}>
            Close
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default ModalChangePassword;
