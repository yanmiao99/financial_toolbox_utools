import { Button, Tabs, Modal, message } from 'antd';
import { useState, useEffect } from 'react';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import './index.less';
import LoginDialog from '@/components/LoginDialog';
import PropertyGroupDialog from '@/components/PropertyGroupDialog';
import PropertyCard from '@/components/PropertyCard';
import PropertyCardDetail from '@/components/PropertyCardDetail';
import {
  getPropertyGroupList,
  deletePropertyGroup,
  getPropertyCardList,
} from '@/api/property';

function PropertyRecord() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [editGroupData, setEditGroupData] = useState(null);
  const [groupList, setGroupList] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [showCardDetail, setShowCardDetail] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  // 检查登录状态
  const checkLoginStatus = () => {
    try {
      const loginInfo = localStorage.getItem('userLoginInfo');
      if (loginInfo) {
        const parsedInfo = JSON.parse(loginInfo);
        // 检查token是否存在且未过期（这里可以根据需要添加过期时间检查）
        if (parsedInfo.token) {
          setIsLoggedIn(true);
          setUserInfo(parsedInfo);
          return true;
        }
      }
    } catch (error) {
      console.error('检查登录状态失败:', error);
    }
    return false;
  };

  // 处理登录成功
  const handleLoginSuccess = (loginInfo) => {
    setIsLoggedIn(true);
    setUserInfo(loginInfo);
    setShowLoginDialog(false);
  };

  // 处理退出登录
  const handleLogout = () => {
    localStorage.removeItem('userLoginInfo');
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  // 处理创建分组
  const handleCreateGroup = () => {
    setEditGroupData(null);
    setShowGroupDialog(true);
  };

  // 获取分组列表
  const fetchGroupList = async () => {
    const [groupRes, cardRes] = await Promise.all([
      getPropertyGroupList({ show: 'list' }),
      getPropertyCardList(),
    ]);

    // 根据 groupRes 中的 propertyGroupId 获取 cardRes 中对应的卡片数据 , 进行分组
    groupRes.forEach((item) => {
      item.cardList = cardRes.filter(
        (cardItem) => cardItem.propertyGroupId === item.id
      );
    });

    setGroupList(groupRes);

    // 如果没有选中的分组且有分组数据，默认选中第一个
    if (!activeGroupId && groupRes && groupRes.length > 0) {
      setActiveGroupId(groupRes[0].id);
    }
  };

  // 编辑分组
  const handleEditGroup = (group) => {
    setEditGroupData(group);
    setShowGroupDialog(true);
  };

  // 处理卡片点击
  const handleCardClick = (cardData) => {
    setSelectedCard(cardData);
    setShowCardDetail(true);
  };

  // 关闭卡片详情
  const handleCloseCardDetail = () => {
    setShowCardDetail(false);
    setSelectedCard(null);
    // 刷新数据
    fetchGroupList();
  };

  // 处理删除分组
  const handleDeleteGroup = (groupData) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除分组"${groupData.title}"吗？删除后无法恢复。`,
      okText: '确定删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        await deletePropertyGroup({ id: groupData.id });
        message.success('删除分组成功');
        // 如果删除的是当前选中的分组，重置选中状态
        if (activeGroupId === groupData.id) {
          setActiveGroupId(null);
        }
        // 重新获取分组列表
        fetchGroupList();
      },
    });
  };

  // 处理分组操作成功
  const handleGroupSuccess = () => {
    setShowGroupDialog(false);
    setEditGroupData(null);
    // 刷新分组列表
    fetchGroupList();
  };

  // 处理Tab切换
  const handleTabChange = (key) => {
    setActiveGroupId(key);
  };

  // 处理Tab编辑操作（删除）
  const handleTabEdit = (targetKey, action) => {
    if (action === 'add') {
      handleCreateGroup();
    } else if (action === 'remove') {
      const group = groupList.find((g) => g.id === targetKey);
      if (group) {
        handleDeleteGroup(group);
      }
    }
  };

  // 生成Tab项
  const tabItems = groupList.map((group) => ({
    key: group.id,
    label: group.title,
    children: (
      <div className="tab_content">
        <div className="tab_content_header">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditGroup(group)}
            className="edit_group_btn">
            编辑分组
          </Button>
        </div>
        <div className="card_list_container">
          {group.cardList && group.cardList.length > 0 ? (
            <div className="card_grid">
              {group.cardList.map((card) => (
                <PropertyCard
                  key={card.id}
                  cardData={card}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          ) : (
            <div className="empty_cards">
              <div className="empty_icon">💳</div>
              <div className="empty_title">暂无卡片数据</div>
              <div className="empty_description">
                该分组下还没有任何卡片记录
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    closable: true, // 允许关闭（删除）
  }));

  useEffect(() => {
    // 页面加载时检查登录状态
    const isLogged = checkLoginStatus();
    if (!isLogged) {
      setShowLoginDialog(true);
    } else {
      // 如果已登录，获取分组列表
      fetchGroupList();
    }
  }, []);

  // 监听登录状态变化
  useEffect(() => {
    if (isLoggedIn) {
      fetchGroupList();
    } else {
      setGroupList([]);
      setActiveGroupId(null);
    }
  }, [isLoggedIn]);

  return (
    <div className="record_wrapper">
      {isLoggedIn ? (
        <div className="record_main_content">
          <div className="record_header">
            <span className="welcome_text">欢迎，{userInfo?.username}！</span>
            <div className="header_actions">
              <Button
                className="create_btn"
                type="primary"
                onClick={handleCreateGroup}>
                创建分组
              </Button>
              <Button
                className="logout_btn"
                onClick={handleLogout}>
                退出登录
              </Button>
            </div>
          </div>
          {/* 分组Tab内容 */}
          <div className="record_content">
            {groupList.length > 0 ? (
              <Tabs
                type="editable-card"
                activeKey={activeGroupId}
                onChange={handleTabChange}
                addIcon={<PlusOutlined />}
                onEdit={handleTabEdit}
                items={tabItems}
                className="group_tabs"
              />
            ) : (
              <div className="empty_state">
                <div className="empty_icon">📁</div>
                <div className="empty_title">暂无分组</div>
                <div className="empty_description">
                  创建您的第一个分组来开始管理理财记录
                </div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreateGroup}
                  className="create_first_group_btn">
                  创建分组
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="login_prompt">
          <span className="login_icon">🔐</span>
          <div className="login_title">欢迎使用理财工具箱</div>
          <div className="login_description">
            请先登录您的账户以查看和管理您的理财记录
          </div>
          <Button
            type="primary"
            onClick={() => setShowLoginDialog(true)}>
            立即登录
          </Button>
        </div>
      )}

      <LoginDialog
        visible={showLoginDialog}
        onCancel={() => setShowLoginDialog(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <PropertyGroupDialog
        visible={showGroupDialog}
        onCancel={() => setShowGroupDialog(false)}
        onSuccess={handleGroupSuccess}
        editData={editGroupData}
      />

      <PropertyCardDetail
        visible={showCardDetail}
        onClose={handleCloseCardDetail}
        cardData={selectedCard}
      />
    </div>
  );
}

export default PropertyRecord;
