export const readConfig = () => {
  console.log('读取到我了');
};

// eslint-disable-next-line no-undef
const fs = require('fs');
// eslint-disable-next-line no-undef
const https = require('https');
// eslint-disable-next-line no-undef
const path = require('path');
// eslint-disable-next-line no-undef
const Buffer = require('buffer').Buffer;

/**
 * 保存文件到本地
 * @param {string} currentFile 文件地址
 * @param {string} fileName 文件名
 * @param {string} userSavePath 用户保存路径
 */
export const saveFile = (currentFile, fileName, userSavePath) => {
  // currentFile 转换为 https 协议
  if (currentFile.startsWith('http://')) {
    currentFile = currentFile.replace('http://', 'https://');
  }

  const downloadPath = path.join(userSavePath, fileName);
  const file = fs.createWriteStream(downloadPath);
  https.get(currentFile, function (response) {
    response.pipe(file);
    file.on('finish', function () {
      file.close();
      console.log('文件已经下载到本地');
    });
  });
};

// 保存 base64 图片到本地
export const saveBase64 = (base64, fileName, userSavePath) => {
  const downloadPath = path.join(userSavePath, fileName);
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
  const dataBuffer = Buffer.from(base64Data, 'base64');
  fs.writeFile(downloadPath, dataBuffer, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('文件已经下载到本地');
    }
  });
};

// 读取本地文件
export const readFileToBase64 = (path) => {
  const data = fs.readFileSync(path, {
    encoding: 'base64',
  });

  return data;
};
