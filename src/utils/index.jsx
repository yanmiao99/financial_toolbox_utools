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

// 计算水印生成位置
export const getWatermarkGeneratePosition = (
  logoPosition,
  width,
  height,
  logoWidth,
  logoHeight
) => {
  let x = 0;
  let y = 0;

  const initX = logoWidth / 2 + 10;
  const initY = logoHeight / 2 + 10;

  switch (logoPosition) {
    case 'topLeft':
      x = initX;
      y = initY;
      break;
    case 'topCenter':
      x = width / 2;
      y = initY;
      break;
    case 'topRight':
      x = width - initX;
      y = initY;
      break;
    case 'centerLeft':
      x = initX;
      y = height / 2;
      break;
    case 'center':
      x = width / 2;
      y = height / 2;
      break;
    case 'centerRight':
      x = width - initX;
      y = height / 2;
      break;
    case 'bottomLeft':
      x = initX;
      y = height - initY;
      break;
    case 'bottomCenter':
      x = width / 2;
      y = height - initY;
      break;
    case 'bottomRight':
      x = width - initX;
      y = height - initY;
      break;
    default:
      x = initX;
      y = initY;
      break;
  }

  return { x, y };
};

// 传入文字内容获取文字的宽高
export const getTextWidthHeight = (text, fontSize) => {
  const textDom = document.createElement('span');
  let result = {};
  result.width = textDom.offsetWidth;
  result.height = textDom.offsetHeight;
  textDom.style.fontSize = fontSize + 'px';
  textDom.style.display = 'inline-block';
  textDom.style.visibility = 'hidden';
  textDom.style.whiteSpace = 'nowrap';
  document.body.appendChild(textDom);

  if (typeof textDom !== 'undefined') {
    textDom.textContent = text;
  } else {
    textDom.innerText = text;
  }

  result.width =
    parseFloat(window.getComputedStyle(textDom).width) - result.width;
  result.height =
    parseFloat(window.getComputedStyle(textDom).height) - result.height;
  document.body.removeChild(textDom);

  return result;
};
