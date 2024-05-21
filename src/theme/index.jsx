import { App, ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useEffect } from 'react';

import { useGetSystemTheme } from '@/hooks/useGetSystemTheme';
import AntdGlobal from '@/utils/AntdGlobal';

import './index.less';

const themeMap = {
  dark: {
    // bgColor: '#2E3037',
    bgColor: '#282B2F',
    bgFn: [theme.darkAlgorithm],
  },
  light: {
    bgColor: '#FFFFFF',
    bgFn: [theme.defaultAlgorithm],
  },
};

// eslint-disable-next-line react/prop-types
export const ThemeAntd = ({ children = null }) => {
  const [systemTheme] = useGetSystemTheme();

  useEffect(() => {
    document.documentElement.style.background = themeMap[systemTheme].bgColor;
  }, [systemTheme]);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: themeMap[systemTheme].bgFn,
        cssVar: true,
        token: {
          borderRadius: 0,
          // colorPrimary: "#ff2e4d"
          // colorPrimary: '#73d13d',
          // colorPrimary: "#61d275",
          colorBgBase: themeMap[systemTheme].bgColor,
        },
        components: {
          // Input: {
          //   colorBgBase: themeMap[systemTheme].bgColor,
          //   algorithm: true, // 启用算法
          // },
        },
      }}>
      <App>
        <AntdGlobal />
        {children}
      </App>
    </ConfigProvider>
  );
};
