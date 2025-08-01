import { Button } from 'antd';
import { useState, useEffect } from 'react';
import './index.less';
import LoginDialog from '@/components/LoginDialog';
import PropertyWrapper from '@/components/PropertyWrapper';
import PropertyGroupDialog from '@/components/PropertyGroupDialog';

function PropertyRecord() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [editGroupData, setEditGroupData] = useState(null);
  // const { modal } = App.useApp();

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

  // 处理编辑分组 - 预留接口，供其他组件调用
  // const handleEditGroup = (groupData) => {
  //   setEditGroupData(groupData);
  //   setShowGroupDialog(true);
  // };

  // 处理分组操作成功
  const handleGroupSuccess = () => {
    setShowGroupDialog(false);
    setEditGroupData(null);
    // 这里可以刷新分组列表
  };

  useEffect(() => {
    // 页面加载时检查登录状态
    const isLogged = checkLoginStatus();
    if (!isLogged) {
      setShowLoginDialog(true);
    }
  }, []);

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
          {/* 这里放置RecordList的主要内容 */}
          <div className="record_content">
            <PropertyWrapper />
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
    </div>
  );
}

export default PropertyRecord;
