import { Modal, Form, Input, Select, message } from 'antd';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPropertyCard, updatePropertyCard, getPropertyGroupList } from '@/api/property';
import './index.less';

const PropertyCardDialog = ({
  visible,
  onCancel,
  onSuccess,
  editData = null,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [groupOptions, setGroupOptions] = useState([]);
  const isEdit = !!editData;

  // 获取分组选项
  const fetchGroupOptions = async () => {
    try {
      const groupList = await getPropertyGroupList({ show: 'menu' });
      const options = groupList.map(group => ({
        label: group.title,
        value: group.id,
      }));
      setGroupOptions(options);
    } catch (error) {
      console.error('获取分组列表失败:', error);
      message.error('获取分组列表失败');
    }
  };

  // 当弹窗打开时，获取分组选项并填充表单数据
  useEffect(() => {
    if (visible) {
      fetchGroupOptions();
      if (isEdit && editData) {
        form.setFieldsValue({
          title: editData.title,
          groupId: editData.propertyGroupId,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, editData, isEdit, form]);

  // 处理确认提交
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      if (isEdit) {
        // 修改卡片
        await updatePropertyCard({
          id: editData.id,
          title: values.title,
          groupId: values.groupId,
        });
        message.success('修改卡片成功');
      } else {
        // 创建卡片
        await createPropertyCard({
          title: values.title,
          groupId: values.groupId,
        });
        message.success('创建卡片成功');
      }
      
      form.resetFields();
      onSuccess && onSuccess();
    } catch (error) {
      console.error('操作失败:', error);
      message.error(isEdit ? '修改卡片失败' : '创建卡片失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理取消
  const handleCancel = () => {
    form.resetFields();
    onCancel && onCancel();
  };

  return (
    <Modal
      title={isEdit ? '编辑卡片' : '创建卡片'}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText={isEdit ? '保存' : '创建'}
      cancelText="取消"
      className="property-card-dialog"
    >
      <Form
        form={form}
        layout="vertical"
        className="card-form"
      >
        <Form.Item
          label="卡片标题"
          name="title"
          rules={[
            { required: true, message: '请输入卡片标题' },
            { max: 50, message: '卡片标题不能超过50个字符' },
          ]}
        >
          <Input
            placeholder="请输入卡片标题"
            maxLength={50}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="所属分组"
          name="groupId"
          rules={[
            { required: true, message: '请选择所属分组' },
          ]}
        >
          <Select
            placeholder="请选择所属分组"
            options={groupOptions}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

PropertyCardDialog.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  onSuccess: PropTypes.func,
  editData: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    propertyGroupId: PropTypes.number,
  }),
};

export default PropertyCardDialog;