import { Modal, Form, Input, DatePicker, InputNumber, message } from 'antd';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { createCardDetail, updateCardDetail } from '@/api/property';
import './index.less';

const PropertyCardDetailDialog = ({
  visible,
  onClose,
  onSuccess,
  editData,
  cardId,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEdit = !!editData;

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const params = {
        ...values,
        date: values.date,
        cardId: cardId,
      };

      if (isEdit) {
        params.id = editData.id;
        await updateCardDetail(params);
        message.success('修改成功');
      } else {
        await createCardDetail(params);
        message.success('添加成功');
      }

      onSuccess && onSuccess();
      handleClose();
    } catch (error) {
      console.error('操作失败:', error);
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  // 关闭对话框
  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  // 监听编辑数据变化
  useEffect(() => {
    if (visible && editData) {
      form.setFieldsValue({
        amount: editData.amount,
        date: dayjs(editData.date),
        remark: editData.remark || '',
      });
    } else if (visible && !editData) {
      form.setFieldsValue({
        date: dayjs(),
      });
    }
  }, [visible, editData, form]);

  return (
    <Modal
      title={isEdit ? '编辑记录' : '添加记录'}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleClose}
      confirmLoading={loading}
      okText={isEdit ? '保存' : '添加'}
      cancelText="取消"
      className="property_card_detail_dialog"
      destroyOnClose>
      <Form
        form={form}
        layout="vertical"
        className="detail_form">
        <Form.Item
          label="金额"
          name="amount"
          rules={[
            { required: true, message: '请输入金额' },
            { type: 'number', message: '请输入有效的数字' },
          ]}>
          <InputNumber
            style={{ width: '100%' }}
            placeholder="请输入金额（正数为收入，负数为支出）"
            precision={2}
            step={0.01}
            formatter={(value) =>
              `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value.replace(/¥\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item
          label="日期"
          name="date"
          rules={[{ required: true, message: '请选择日期' }]}>
          <DatePicker
            style={{ width: '100%' }}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择日期时间"
          />
        </Form.Item>

        <Form.Item
          label="备注"
          name="remark">
          <Input.TextArea
            rows={3}
            placeholder="请输入备注信息（可选）"
            maxLength={200}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

PropertyCardDetailDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  editData: PropTypes.shape({
    id: PropTypes.number,
    amount: PropTypes.number,
    date: PropTypes.string,
    remark: PropTypes.string,
  }),
  cardId: PropTypes.number,
};

export default PropertyCardDetailDialog;
