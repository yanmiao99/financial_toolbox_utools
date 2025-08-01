import { Modal, Form, Input, message } from 'antd';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPropertyGroup, updatePropertyGroup } from '@/api/property';
import './index.less';

const PropertyGroupDialog = ({
  visible,
  onCancel,
  onSuccess,
  editData = null,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!editData;

  // 当弹窗打开时，如果是编辑模式，填充表单数据
  useEffect(() => {
    if (visible) {
      if (isEdit && editData) {
        form.setFieldsValue({
          title: editData.title,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, editData, isEdit, form]);

  // 处理确认提交
  const handleOk = async () => {
    let result;
    try {
      const values = await form.validateFields();
      if (isEdit) {
        // 修改分组
        result = await updatePropertyGroup({
          id: editData.id,
          title: values.title,
        });
      } else {
        // 创建分组
        result = await createPropertyGroup({
          title: values.title,
        });
      }
      message.success(isEdit ? '修改分组成功' : '创建分组成功');
      form.resetFields();
      onSuccess && onSuccess();
    } catch (error) {
      result.message || (isEdit ? '修改分组失败' : '创建分组失败');
    }
  };

  // 处理取消
  const handleCancel = () => {
    form.resetFields();
    onCancel && onCancel();
  };

  return (
    <Modal
      title={isEdit ? '修改分组' : '创建分组'}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
      destroyOnHidden
      className="property_group_dialog">
      <Form
        form={form}
        layout="vertical"
        preserve={false}>
        <Form.Item
          label="分组名称"
          name="title"
          rules={[
            { required: true, message: '请输入分组名称' },
            { max: 50, message: '分组名称不能超过50个字符' },
          ]}>
          <Input
            placeholder="请输入分组名称"
            maxLength={50}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

PropertyGroupDialog.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  onSuccess: PropTypes.func,
  editData: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  }),
};

export default PropertyGroupDialog;
