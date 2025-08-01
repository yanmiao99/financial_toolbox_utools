import { Drawer, Table, Button, message, Modal } from 'antd';
import { useState, useEffect } from 'react';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { getCardDetailList, deleteCardDetail } from '@/api/property';
import PropertyCardDetailDialog from '@/components/PropertyCardDetailDialog';
import './index.less';
import dayjs from 'dayjs';

const PropertyCardDetail = ({ visible, onClose, cardData }) => {
  const [detailList, setDetailList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [editDetailData, setEditDetailData] = useState(null);

  // 获取卡片详情列表
  const fetchDetailList = async (page = 1, pageSize = 8) => {
    if (!cardData?.id) return;

    setLoading(true);
    try {
      const response = await getCardDetailList({
        cardId: cardData.id,
        page,
        limit: pageSize,
      });

      if (response.list && Array.isArray(response.list)) {
        setDetailList(response.list);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize,
          total: response.pagination.totalCount, // 如果后端返回总数，这里需要调整
        }));
      }
    } catch (error) {
      console.error('获取卡片详情失败:', error);
      message.error('获取卡片详情失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除详情记录
  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除这条记录吗？金额：¥${record.amount}`,
      okText: '确定删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        await deleteCardDetail({ id: record.id });
        message.success('删除成功');
        fetchDetailList(pagination.current, pagination.pageSize);
      },
    });
  };

  // 格式化金额显示
  const formatAmount = (amount) => {
    const value = parseFloat(amount);
    return {
      value: Math.abs(value),
      isPositive: value >= 0,
    };
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount) => {
        const { value, isPositive } = formatAmount(amount);
        return (
          <span
            style={{
              color: isPositive ? '#52c41a' : '#ff4d4f',
              fontWeight: 'bold',
            }}>
            {isPositive ? '+' : '-'}¥{value.toFixed(2)}
          </span>
        );
      },
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 180,
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <div className="action_buttons">
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  // 编辑记录
  const handleEdit = (record) => {
    setEditDetailData(record);
    setShowDetailDialog(true);
  };

  // 添加新记录
  const handleAdd = () => {
    setEditDetailData(null);
    setShowDetailDialog(true);
  };

  // 关闭详情对话框
  const handleCloseDetailDialog = () => {
    setShowDetailDialog(false);
    setEditDetailData(null);
  };

  // 详情操作成功回调
  const handleDetailSuccess = () => {
    fetchDetailList(pagination.current, pagination.pageSize);
  };

  // 监听抽屉打开状态
  useEffect(() => {
    if (visible && cardData?.id) {
      fetchDetailList();
    }
  }, [visible, cardData?.id]);

  return (
    <Drawer
      title={
        <div className="drawer_header">
          <div className="card_info">
            <div className="card_avatar">
              {cardData?.bgText || cardData?.title?.charAt(0)}
            </div>
            <div className="card_title">{cardData?.title}</div>
          </div>
        </div>
      }
      placement="right"
      width={800}
      open={visible}
      onClose={onClose}
      className="property_card_detail_drawer"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}>
          添加记录
        </Button>
      }>
      <div className="detail_content">
        {/* 详情表格 */}
        <div className="table_section">
          <Table
            columns={columns}
            dataSource={detailList}
            rowKey="id"
            loading={loading}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
              onChange: (page, pageSize) => {
                fetchDetailList(page, pageSize);
              },
            }}
            scroll={{ y: 400 }}
            size="small"
          />
        </div>
      </div>
      
      <PropertyCardDetailDialog
        visible={showDetailDialog}
        onClose={handleCloseDetailDialog}
        onSuccess={handleDetailSuccess}
        editData={editDetailData}
        cardId={cardData?.id}
      />
    </Drawer>
  );
};

PropertyCardDetail.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cardData: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    bgText: PropTypes.string,
  }),
};

export default PropertyCardDetail;
