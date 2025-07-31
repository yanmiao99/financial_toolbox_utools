import { message } from './AntdGlobal';

// 复制
export const handleCopyText = (text) => {
  if (!text || text === '') {
    message.error('复制内容不能为空');
    return;
  }

  document.addEventListener('copy', function (e) {
    e.clipboardData.setData('text/plain', text);
    e.preventDefault();
  });
  document.execCommand('copy');
  message.success('复制成功');
};

// file 转 base64
export const fileToBase64 = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
  });
};

// 根据 base64 获取图片信息
export const getImageInfo = (base64) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
  });
};
