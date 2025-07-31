import { Button } from 'antd';
import { useState, useEffect } from 'react';
import './index.less';
import LoginDialog from '@/components/LoginDialog';

function RecordList() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

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

  useEffect(() => {
    // 页面加载时检查登录状态
    const isLogged = checkLoginStatus();
    if (!isLogged) {
      setShowLoginDialog(true);
    }
  }, []);

  return (
    <div className="rate_calculator">
      {isLoggedIn ? (
        <div>
          <div
            style={{
              marginBottom: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <span>欢迎，{userInfo?.username}！</span>
            <Button onClick={handleLogout}>退出登录</Button>
          </div>
          {/* 这里放置RecordList的主要内容 */}
          <div>
            <h3>记录列表</h3>
            <p>这里是记录列表的内容...</p>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <p>请先登录以查看记录列表</p>
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
    </div>
  );
}

export default RecordList;
