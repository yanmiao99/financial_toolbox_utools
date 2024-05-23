import { Form, Input, Button, Tooltip, App, Alert } from 'antd';
import {
  MoneyCollectOutlined,
  AccountBookOutlined,
  PayCircleOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import './index.less';
import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 18,
  },
};

const FeeCalculator = () => {
  const [form] = Form.useForm();

  const { message } = App.useApp();

  const inputRef = useRef(null);

  useEffect(() => {
    // 默认选中第一个输入框
    inputRef.current.focus();

    // 获取utools文本框的内容
    window.utools.onPluginEnter(async ({ code, type, payload, option }) => {
      if (type === 'regex') {
        form.setFieldsValue({
          amount: payload,
        });
      }
    });
  }, []);

  // 提交表单
  const handleSubmit = async (values) => {
    try {
      const amount = parseFloat(values.amount);
      const rate = parseFloat(values.rate);
      const handlingFee = (amount * rate * 0.01).toFixed(2);
      const actualAccount = (amount - handlingFee).toFixed(2);

      form.setFieldsValue({
        handlingFee,
        actualAccount,
      });

      confetti({
        particleCount: 200, // 发射的纸屑数量
        spread: 70, // 纸屑散布角度
        origin: { y: 1.2 }, // 纸屑发射的起始位置偏上
      });
    } catch (errors) {
      console.error('校验失败', errors);
    }
  };

  const handleCopy = (field) => {
    const value = form.getFieldValue(field);

    if (value) {
      navigator.clipboard.writeText(value);
      message.success('复制成功');
    } else {
      message.error('暂无内容可复制');
    }
  };

  return (
    <div className="wrapper">
      <div className="alert">
        <Alert
          message={'费率计算器，让复杂的金融计算变得简单易懂。'}
          type="info"
          showIcon
        />
      </div>

      <Form
        {...formItemLayout}
        form={form}
        onFinish={handleSubmit}>
        <Form.Item
          label="收款金额 (元)"
          name="amount"
          rules={[
            {
              required: true,
              message: '请填写收款金额',
            },
            {
              pattern: /^[1-9]\d{0,9}(\.\d{2})?$/,
              message: '请填写数字',
            },
          ]}>
          <Input
            ref={inputRef}
            allowClear
            prefix={<MoneyCollectOutlined />}
            placeholder="请输入收款金额"
          />
        </Form.Item>

        <Form.Item
          label="费率 (%)"
          name="rate"
          rules={[
            { required: true, message: '请填写费率' },
            {
              pattern: /^(0(\.\d*[1-9])?|[1-9]\d*(\.\d{1,2})?)$/,
              message: '请填写数字',
            },
          ]}>
          <Input
            allowClear
            prefix={<AccountBookOutlined />}
            placeholder="请输入费率"
          />
        </Form.Item>

        <Form.Item
          shouldUpdate
          label="手续费 (元)"
          name="handlingFee">
          <Input
            disabled
            prefix={<PayCircleOutlined />}
            suffix={
              <Tooltip
                title="点击复制"
                placement="top">
                <CopyOutlined onClick={() => handleCopy('handlingFee')} />
              </Tooltip>
            }
            placeholder="自动计算得出"
          />
        </Form.Item>

        <Form.Item
          shouldUpdate
          label="实际到账 (元)"
          name="actualAccount">
          <Input
            disabled
            prefix={<PayCircleOutlined />}
            suffix={
              <Tooltip
                title="点击复制"
                placement="top">
                <CopyOutlined onClick={() => handleCopy('actualAccount')} />
              </Tooltip>
            }
            placeholder="自动计算得出"
          />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 4,
            span: 18,
          }}>
          <Button
            type="primary"
            block
            htmlType="submit">
            计算
          </Button>
        </Form.Item>
      </Form>

      <div className="tips">
        <p>
          计算原理：假如收款10000元，手续费率为0.6%，那么实际到帐金额是： 10000
          - 10000 * 0.6% = 10000 - 10000 * 0.6 * 0.01 = 9940(元);
        </p>
        <p>
          根据现行的《中国银联入网机构银行卡跨行交易收益分配办法》，银行卡收单业务的结算手续费全部由商户承担，但不同行业所实行的费率不同，费率标准从0.5%到4%不等。一般来说，零售业的刷卡手续费率在0.8%-1%，超市是0.5%，餐饮业为2%;
        </p>
      </div>
    </div>
  );
};

export default FeeCalculator;
