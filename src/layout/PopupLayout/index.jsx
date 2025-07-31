import { Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { ThemeAntd } from '@/theme';
import FeeCalculator from '@/pages/FeeCalculator';
import RecordList from '@/pages/RecordList';
import FooterBtnGroup from '@/components/FooterBtnGroup';

import './index.less';

const initTabList = [
  {
    key: 'fee',
    label: '费率计算',
    children: <FeeCalculator />,
  },
  {
    key: 'record',
    label: '理财记录',
    children: <RecordList />,
  },
];

function PopupDetails() {
  const [currentTab, setCurrentTab] = useState([]);
  const [tabList] = useState(initTabList);

  useEffect(() => {
    // 获取utools文本框的内容
    if (window.utools && window.utools.onPluginEnter) {
      window.utools.onPluginEnter(async ({ code }) => {
        if (code && code !== 'default') {
          // 根据关键词进入不同的 tab
          initTabList.forEach((item) => {
            if (item.key === code) {
              setCurrentTab(code);
            }
          });
        } else {
          setCurrentTab(initTabList[0].key);
        }
      });
    } else {
       // 开发环境下默认设置第一个tab
       setCurrentTab(initTabList[0].key);
     }
   }, []);

  const handleTabChange = (key) => {
    setCurrentTab(key);
  };

  return (
    <ThemeAntd>
      <div className="container_wrapper">
        <Tabs
          defaultActiveKey={currentTab}
          activeKey={currentTab}
          onChange={handleTabChange}
          items={tabList}
        />
      </div>
      <FooterBtnGroup />
    </ThemeAntd>
  );
}

export default PopupDetails;
