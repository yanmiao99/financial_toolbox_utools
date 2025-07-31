/* eslint-disable react/prop-types */
import { Modal, Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { userLogin } from '@/api/user';
import './index.less';

function LoginDialog({ visible, onCancel, onLoginSuccess }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const res = await userLogin(values);
      if (res && res.token) {
        // 存储登录信息到localStorage
        const loginInfo = {
          token: res.token,
          userId: res.userId,
          username: res.username,
          loginTime: Date.now(),
        };
        localStorage.setItem('userLoginInfo', JSON.stringify(loginInfo));

        message.success('登录成功');
        form.resetFields();
        onLoginSuccess && onLoginSuccess(loginInfo);
      } else {
        message.error('登录失败，请检查用户名和密码');
      }
    } catch (error) {
      console.error('登录错误:', error);
      message.error('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel && onCancel();
  };

  return (
    <Modal
      title="用户登录"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={400}
      className="login-dialog">
      <Form
        form={form}
        name="login"
        onFinish={handleLogin}
        autoComplete="off"
        layout="vertical">
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}>
          <Input
            prefix={<UserOutlined />}
            placeholder="请输入用户名"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码!',
            },
          ]}>
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入密码"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block>
            登录
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default LoginDialog;
