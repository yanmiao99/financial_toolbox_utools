import { Alert, Divider } from 'antd';
import { useContext, useEffect } from 'react';
// import { SettingContext } from '@/context/settingContext';
import { BASE_URL } from '@/store/Global';
import { ThemeAntd } from '@/theme';
import RateCalculator from '@/components/RateCalculator';

import './index.less';

function PopupDetails() {
  useEffect(() => {}, []);

  return (
    <ThemeAntd>
      <div className="container_wrapper">
        <Alert
          message={'理财好帮手，费率计算器让每分钱都清晰。'}
          type="info"
          showIcon
          style={{ width: '100%' }}
        />

        <RateCalculator />
      </div>
    </ThemeAntd>
  );
}

export default PopupDetails;
