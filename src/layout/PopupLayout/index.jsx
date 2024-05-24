import { Tabs } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { ThemeAntd } from '@/theme';
import FeeCalculator from '@/components/FeeCalculator';
import RateCalculator from '@/components/RateCalculator';
import FooterBtnGroup from '@/components/FooterBtnGroup';

import './index.less';

const initTabList = [
  {
    key: 'fee',
    label: '费率计算',
    children: <FeeCalculator />,
  },
  {
    key: 'rate',
    label: '利率计算',
    children: <RateCalculator />,
  },
];

function PopupDetails() {
  const [currentTab, setCurrentTab] = useState([]);
  const [tabList, setTabList] = useState(initTabList);

  useEffect(() => {
    // 获取utools文本框的内容
    window.utools.onPluginEnter(async ({ code, type, payload, option }) => {
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
