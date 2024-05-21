import { Divider } from 'antd';
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
        <RateCalculator />
      </div>
    </ThemeAntd>
  );
}

export default PopupDetails;
