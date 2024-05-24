import {
  Form,
  Input,
  Button,
  App,
  Row,
  Col,
  Radio,
  Table,
  Alert,
  Tooltip,
  Space,
} from 'antd';
import {
  MoneyCollectOutlined,
  AccountBookOutlined,
  PayCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import './index.less';
import { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const columns = [
  {
    title: '期数',
    dataIndex: 'number',
    key: 'number',
    width: 100,
    align: 'center',
  },
  {
    title: '月供金额',
    dataIndex: 'monthAmount',
    key: 'monthAmount',
    width: 100,
    align: 'center',
  },
  {
    title: '月供拆解',
    key: 'monthSplit',
    align: 'center',
    children: [
      {
        title: '本金',
        dataIndex: 'monthPrincipal',
        key: 'monthPrincipal',
        align: 'center',
      },
      {
        title: '利息',
        dataIndex: 'monthInterest',
        key: 'monthInterest',
        align: 'center',
      },
    ],
  },
  {
    title: '累计还款',
    key: 'total',
    align: 'center',
    children: [
      {
        title: '本金',
        dataIndex: 'totalPrincipal',
        key: 'totalPrincipal',
        align: 'center',
      },
      {
        title: '利息',
        dataIndex: 'totalInterest',
        key: 'totalInterest',
        align: 'center',
      },
    ],
  },
];

const initValues = {
  amount: 10000,
  term: 12,
  annualRate: 24,
  repaymentMethod: 1,
};

const initTotalAmount = {
  number: '合计',
  monthAmount: '/',
  monthPrincipal: '/',
  monthInterest: '/',
  totalPrincipal: '/',
  totalInterest: '/',
};

function RateCalculator() {
  const [columnsData, setColumnsData] = useState([]); // 表格数据
  const [totalAmount, setTotalAmount] = useState(initTotalAmount); // 统计数据

  const [form] = Form.useForm();

  const { message } = App.useApp();

  const inputRef = useRef(null);

  useEffect(() => {
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

  // 跳转到浏览器
  const handleToBrowser = () => {
    window.utools.shellOpenExternal(
      'http://www.conghua.gov.cn/zmhdzskgjj/content/post_9361196.html'
    );
  };

  // 提交表单
  const handleSubmit = (values) => {
    const tempValues = {
      amount: parseFloat(values.amount),
      term: parseInt(values.term),
      annualRate: parseFloat(values.annualRate),
      repaymentMethod: Number(values.repaymentMethod),
    };

    const { amount, term, annualRate, repaymentMethod } = tempValues;

    if (repaymentMethod === 1) {
      // 等额本息：月供=本金x月利率x(1+月利率)^还款月数÷((1+月利率)^还款月数-1)
      const data = [];
      const monthlyInterestRate = annualRate / 12 / 100;
      const pow = Math.pow(1 + monthlyInterestRate, term);
      const monthAmount = (amount * monthlyInterestRate * pow) / (pow - 1);
      let remainingPrincipal = amount;
      let totalPrincipal = 0;
      let totalInterest = 0;

      for (let i = 1; i <= term; i++) {
        const monthInterest = remainingPrincipal * monthlyInterestRate;
        const monthPrincipal = monthAmount - monthInterest;
        totalPrincipal += monthPrincipal;
        totalInterest += monthInterest;
        remainingPrincipal -= monthPrincipal;

        const rowData = {
          key: i,
          number: `第${i}期`,
          monthAmount: monthAmount.toFixed(2),
          monthPrincipal: monthPrincipal.toFixed(2),
          monthInterest: monthInterest.toFixed(2),
          totalPrincipal: totalPrincipal.toFixed(2),
          totalInterest: totalInterest.toFixed(2),
          remainingPrincipal: remainingPrincipal.toFixed(2),
        };

        data.push(rowData);
      }

      // 合计
      const totalRowData = {
        number: '合计',
        monthAmount: (monthAmount * term).toFixed(2),
        monthPrincipal: amount.toFixed(2),
        monthInterest: (monthAmount * term - amount).toFixed(2),
        totalPrincipal: amount.toFixed(2),
        totalInterest: (monthAmount * term - amount).toFixed(2),
      };

      setTotalAmount(totalRowData);
      setColumnsData(data);
    }

    if (repaymentMethod === 2) {
      // 等额本金：月供=本金÷月数x(1+年化利率÷12x剩余还款期数)
      const data = [];
      const monthlyInterestRate = annualRate / 12 / 100;
      const monthPrincipal = amount / term;
      let remainingPrincipal = amount;
      let totalPrincipal = 0;
      let totalInterest = 0;

      for (let i = 1; i <= term; i++) {
        const monthInterest = remainingPrincipal * monthlyInterestRate;
        totalPrincipal += monthPrincipal;
        totalInterest += monthInterest;
        remainingPrincipal -= monthPrincipal;

        const rowData = {
          key: i,
          number: `第${i}期`,
          monthAmount: (monthPrincipal + monthInterest).toFixed(2),
          monthPrincipal: monthPrincipal.toFixed(2),
          monthInterest: monthInterest.toFixed(2),
          totalPrincipal: totalPrincipal.toFixed(2),
          totalInterest: totalInterest.toFixed(2),
        };

        data.push(rowData);
      }

      // 合计
      const totalRowData = {
        number: '合计',
        monthAmount: (amount + totalInterest).toFixed(2),
        monthPrincipal: amount.toFixed(2),
        monthInterest: totalInterest.toFixed(2),
        totalPrincipal: amount.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
      };

      setTotalAmount(totalRowData);
      setColumnsData(data);
    }

    // message.success('计算成功');

    // confetti({
    //   particleCount: 200, // 发射的纸屑数量
    //   spread: 70, // 纸屑散布角度
    //   origin: { y: 1.2 }, // 纸屑发射的起始位置偏上
    // });
  };

  // 表单值变化
  const handleValuesChange = (changedValues, allValues) => {
    // 重置表格数据
    setColumnsData([]);
    setTotalAmount(initTotalAmount);

    handleSubmit(allValues);
  };

  // 表单配置
  const formConfig = [
    {
      label: '金额 (元)',
      name: 'amount',
      type: 'input',
      rules: [
        { required: true, message: '请填写金额' },
        {
          pattern: /^(0(\.\d*[1-9])?|[1-9]\d*(\.\d{1,2})?)$/,
          message: '请填写数字',
        },
      ],
      icon: <MoneyCollectOutlined />,
      inputRef: inputRef,
    },
    {
      label: '期限 (月)',
      name: 'term',
      type: 'input',
      rules: [
        { required: true, message: '请填写期限' },
        {
          pattern: /^[1-9]\d*$/,
          message: '请填写整数',
        },
      ],
      icon: <AccountBookOutlined />,
    },
    {
      label: '年化利率 (%)',
      name: 'annualRate',
      type: 'input',
      rules: [
        { required: true, message: '请填写年化利率' },
        {
          pattern: /^(0(\.\d*[1-9])?|[1-9]\d*(\.\d{1,2})?)$/,
          message: '请填写数字',
        },
      ],
      icon: <PayCircleOutlined />,
    },
    {
      label: '还款方式',
      name: 'repaymentMethod',
      type: 'radio',
      options: [
        {
          label: '等额本息',
          value: 1,
          tooltipText: '每月还款金额相同，但每月还款本金和利息比例不同',
        },
        {
          label: '等额本金',
          value: 2,
          tooltipText: '每月还款本金相同，但每月还款利息递减',
        },
      ],
    },
  ];

  // 渲染表单
  const renderFormItem = (item) => {
    let formItem = null;

    if (item.type === 'input') {
      formItem = (
        <Form.Item
          label={item.label}
          name={item.name}
          rules={item.rules}>
          <Input
            ref={item.inputRef}
            allowClear
            prefix={item.icon}
            placeholder={item.placeholder || '请输入'}
          />
        </Form.Item>
      );
    } else if (item.type === 'radio') {
      formItem = (
        <Form.Item
          label={item.label}
          name={item.name}
          rules={item.rules}>
          <Radio.Group style={{ width: '100%' }}>
            {item.options.map((option) => (
              <Radio.Button
                style={{ width: '50%', textAlign: 'center' }}
                key={option.value}
                value={option.value}>
                <Tooltip
                  placement="top"
                  title={option.tooltipText}>
                  <Space>
                    {option.label}
                    <QuestionCircleOutlined />
                  </Space>
                </Tooltip>
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
      );
    }

    return formItem;
  };

  return (
    <div className="rate_calculator">
      <div className="alert">
        <Alert
          message={'用于计算等额本息和等额本金的还款计划'}
          type="info"
          showIcon
        />
      </div>

      <Form
        onValuesChange={handleValuesChange}
        form={form}
        layout={'vertical'}
        initialValues={initValues}
        onFinish={handleSubmit}>
        <Row gutter={24}>
          {formConfig.map((item, index) => (
            <Col
              span={12}
              key={index}>
              {renderFormItem(item)}
            </Col>
          ))}
          {/* <Col
            span={24}
            key={'submit'}>
            <Form.Item>
              <Button
                type="primary"
                block
                htmlType="submit">
                计算
              </Button>
            </Form.Item>
          </Col> */}
        </Row>
      </Form>

      <div className="tips">
        <Space onClick={handleToBrowser}>
          什么是等额本金和等额本息
          <QuestionCircleOutlined />
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={columnsData}
        bordered
        size={'small'}
        pagination={false}
        sticky={{
          offsetHeader: 64,
        }}
        summary={() => {
          return (
            <Table.Summary fixed="top">
              <Table.Summary.Row>
                {[1, 2, 3, 4, 5, 6].map((item, index) => {
                  return (
                    <Table.Summary.Cell
                      index={index}
                      key={index}>
                      <div className="summary_cell">
                        {index === 0 && (
                          <div className="summary_cell_item">
                            {totalAmount.number}
                          </div>
                        )}
                        {index === 1 && (
                          <div className="summary_cell_item">
                            {totalAmount.monthAmount}
                          </div>
                        )}

                        {index === 2 && (
                          <div className="summary_cell_item">
                            {totalAmount.monthPrincipal}
                          </div>
                        )}

                        {index === 3 && (
                          <div className="summary_cell_item">
                            {totalAmount.monthInterest}
                          </div>
                        )}

                        {index === 4 && (
                          <div className="summary_cell_item">
                            {totalAmount.totalPrincipal}
                          </div>
                        )}

                        {index === 5 && (
                          <div className="summary_cell_item">
                            {totalAmount.totalInterest}
                          </div>
                        )}
                      </div>
                    </Table.Summary.Cell>
                  );
                })}
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
        // scroll={{
        //   y: 240,
        // }}
      />
    </div>
  );
}

export default RateCalculator;
