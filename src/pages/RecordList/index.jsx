import { Form, Row, Col, Table, Alert, Space, Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useRef, useState, useEffect } from 'react';
import './index.less';
import { userLogin } from '@/api/user';

function RecordList() {
  const handleLogin = async () => {
    const res = await userLogin({
      username: 'admin',
      password: 'yanmiao123',
    });
    console.log('res=======>', res);
  };

  return (
    <div className="rate_calculator">
      <Button onClick={handleLogin}>点击登录</Button>
    </div>
  );
}

export default RecordList;
