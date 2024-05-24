import { DownloadOutlined, RightOutlined } from '@ant-design/icons';
import { App, Button, Image, List, Tooltip } from 'antd';

import { BASE_URL } from '@/store/Global';

import './index.less';

import { useContext, useRef } from 'react';

import AppreciationDialog from '@/components/AppreciationDialog';
import { SettingContext } from '@/context/settingContext';
import useDebounce from '@/hooks/useDebounce';

const settingList = [
  {
    title: '下载设置',
    description: '设置下载位置,下载保存路径,下载完成后是否显示内容',
    icon: <DownloadOutlined />,
  },
];

const FooterBtnGroup = () => {
  const { modal } = App.useApp();
  const settingContext = useContext(SettingContext);
  const appreciationDialogRef = useRef();

  // 跳转下载设置页面
  const handleGoDownSetting = () => {
    // 使用 chrome 的tab方法跳转到  chrome://settings/downloads
    // chrome.tabs.create({
    //   url: "chrome://settings/downloads"
    // })
  };

  const handleAbout = useDebounce((type) => {
    let typeObj = {
      author: {
        title: '关于作者',
        content: (
          <div className="about_author_modal">
            {settingContext && (
              <>
                <div className="about_author_modal_item">
                  <h3 className="about_author_modal_label">微信 : </h3>
                  <div className="about_author_modal_value">
                    {settingContext?.author}
                  </div>
                </div>
                <div className="about_author_modal_item">
                  <h3 className="about_author_modal_label">邮箱 : </h3>
                  <div className="about_author_modal_value">
                    {settingContext?.email}
                  </div>
                </div>
                <div className="about_author_modal_item">
                  <h3 className="about_author_modal_label">Github : </h3>
                  <div className="about_author_modal_value">
                    <a href={settingContext?.github}>
                      {settingContext?.github}
                    </a>
                  </div>
                </div>
                {/* <div className="about_author_modal_item">
                  <h3 className="about_author_modal_label">网站 : </h3>
                  <div className="about_author_modal_value">
                    <a href={settingContext?.website}>
                      {settingContext?.website}
                    </a>
                  </div>
                </div> */}
              </>
            )}
          </div>
        ),
      },
      WeChat_public: {
        title: '关注公众号',
        content: (
          <div className="weixin_modal">
            <Image
              src={settingContext?.weChatPublic}
              className="modal_img"
            />
            <div className="modal_title">扫码关注公众号</div>
          </div>
        ),
      },
      setting: {
        title: '设置中心',
        content: (
          <div
            className="setting_wrapper"
            onClick={() => handleGoDownSetting()}>
            <List
              itemLayout="horizontal"
              dataSource={settingList}
              renderItem={(item, index) => (
                <Tooltip
                  placement="top"
                  title={item.description}>
                  <List.Item actions={[<RightOutlined key={index} />]}>
                    <List.Item.Meta
                      avatar={item.icon}
                      title={item.title}
                    />
                  </List.Item>
                </Tooltip>
              )}
            />
          </div>
        ),
      },
    };
    modal.warning({
      title: `${typeObj[type].title}`,
      content: typeObj[type].content,
      maskClosable: true,
      centered: true,
      icon: null,
      width: 350,
      okText: '关闭',
    });
  }, 250);

  // 获取更新日志
  const handleUpdateLog = useDebounce(async () => {
    const res = await fetch(`${BASE_URL}/updateLog/info`);
    const data = await res.json();
    if (data.code === 200) {
      modal.warning({
        title: '更新日志',
        content: (
          <div
            className="update_log_modal"
            dangerouslySetInnerHTML={{ __html: data.data.noteContent }}></div>
        ),
        maskClosable: true,
        centered: true,
        icon: null,
        width: '60%',
        okText: '知道啦 ~ ',
      });
    }
  }, 250);

  // 赞赏
  const handleAppreciation = () => {
    appreciationDialogRef.current.openAppreciationDialog();
  };

  // 视频去水印
  const handleGoRemoveWatermark = () => {
    window.utools.redirect(['视频去水印', '去水印']);
  };

  return (
    <div className="footer_btn_group">
      <Button
        type="text"
        onClick={() => handleAbout('author')}>
        🧭 关于
      </Button>
      <Button
        type="text"
        onClick={() => handleAbout('WeChat_public')}>
        🤔 公众号
      </Button>
      {/* <Button
        type="text"
        onClick={() => handleAbout('setting')}>
        ⚙️ 设置
      </Button> */}
      {/* <Button
        type="text"
        onClick={() => handleUpdateLog()}>
        📖 更新日志
      </Button> */}
      <Button
        type="text"
        onClick={() => handleAppreciation()}>
        💰 赞赏
      </Button>

      <Button
        type="text"
        onClick={() => handleGoRemoveWatermark()}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <img
            style={{
              width: '10px',
              height: '10px',
              marginRight: '8px',
              verticalAlign: 'bottom',
              transform: 'scale(1.5)',
            }}
            src="https://qny.weizulin.cn/images/202405112208572.png"
          />
          视频去水印
        </div>
      </Button>

      <AppreciationDialog ref={appreciationDialogRef} />
    </div>
  );
};
export default FooterBtnGroup;
