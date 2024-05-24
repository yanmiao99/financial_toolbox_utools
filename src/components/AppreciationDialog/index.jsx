import { DollarOutlined } from '@ant-design/icons';
import { App, Image, Card } from 'antd';
import dayjs from 'dayjs';
import { forwardRef, useContext, useEffect, useImperativeHandle } from 'react';

import { SettingContext } from '@/context/settingContext';

import './index.less';

const AppreciationDialog = ({}, ref) => {
  const { modal } = App.useApp();
  const settingContext = useContext(SettingContext);

  // useEffect(() => {
  //   if (settingContext.paymentCodeOpen === 1) {
  //     // 获取当前的时间
  //     const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
  //     // 获取上次的时间
  //     const lastTime = localStorage.getItem('appreciation_time');
  //     // 获取赞赏状态
  //     const status = localStorage.getItem('appreciation_status');

  //     // 如果没有赞赏过
  //     if (!status || status === 'false') {
  //       // 如果没有上次的时间
  //       if (!lastTime) {
  //         // 弹窗感谢赞赏
  //         showAppreciationDialog();
  //       } else {
  //         // 如果上次的时间超过了一天 , 则再次弹窗
  //         if (dayjs(now).diff(dayjs(lastTime), 'day') >= 1) {
  //           showAppreciationDialog();
  //         }
  //       }
  //     }

  //     // 如果赞赏过, 但是时间超过7天了,则再次弹窗
  //     if (status === 'true') {
  //       if (
  //         // now 如果大于 lastTime 及以上, 则弹出赞赏框
  //         dayjs(now).diff(dayjs(lastTime), 'day') >= 7
  //       ) {
  //         showAppreciationDialog();
  //       }
  //     }
  //   }
  // }, [settingContext]);

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    showAppreciationDialog,
    openAppreciationDialog,
  }));

  const AppreciationCom = () => {
    return (
      <div className="appreciation_modal">
        <Card className="modal_card">
          <Image src={settingContext.paymentCode} />
        </Card>
        <div className="modal_title">
          🚀
          感谢您使用本插件！为了维持服务器费用，我需要支付不少成本。如果插件对您有帮助，希望可以赞赏以支持我免费开放给更多人使用！
        </div>
      </div>
    );
  };

  const showAppreciationDialog = () => {
    modal.confirm({
      title: (
        <div>
          <DollarOutlined style={{ marginRight: '5px' }} />
          赞赏
        </div>
      ),
      content: <AppreciationCom />,
      centered: true,
      icon: null,
      maskClosable: false,
      width: '60%',
      okText: '😔 1天内不再提示',
      cancelText: '😆 我已赞赏',
      onOk: () => {
        // 存当前的时间
        const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
        localStorage.setItem('appreciation_time', now);
        localStorage.setItem('appreciation_status', 'false');
      },
      onCancel: () => {
        // 弹窗感谢赞赏
        modal.success({
          title: '感谢您的赞赏！',
          content: (
            <div className="appreciation_success">
              <div>
                🥳
                您的支持是我最大的动力！如果有任何问题或建议，欢迎添加我的个人微信进行反馈
                ~
              </div>
              <img
                src={settingContext.weChat}
                alt="微信二维码"
              />
            </div>
          ),
          centered: true,
          icon: null,
          maskClosable: false,
          okText: '👌我知道了',
          onOk: () => {
            // 存当前的时间
            const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
            localStorage.setItem('appreciation_time', now);
            localStorage.setItem('appreciation_status', 'true');
          },
        });
      },
    });
  };

  // 外部用于打开赞赏弹窗
  const openAppreciationDialog = () => {
    modal.info({
      title: (
        <div>
          <DollarOutlined style={{ marginRight: '5px' }} />
          赞赏
        </div>
      ),
      content: <AppreciationCom />,
      centered: true,
      icon: null,
      maskClosable: false,
      width: '60%',
      okText: '知道啦~',
    });
  };

  return <div></div>;
};

export default forwardRef(AppreciationDialog);
