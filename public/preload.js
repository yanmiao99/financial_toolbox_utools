'use strict';
window.preload = /* @__PURE__ */ Object.create(null);
window.preload['readConfig'] = () => {
  console.log('读取到我了');
};
const fs = require('fs');
const https = require('https');
const path = require('path');
const Buffer = require('buffer').Buffer;
window.preload['saveFile'] = (currentFile, fileName, userSavePath) => {
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
window.preload['saveBase64'] = (base64, fileName, userSavePath) => {
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
window.preload['readFileToBase64'] = (path2) => {
  const data = fs.readFileSync(path2, {
    encoding: 'base64',
  });
  return data;
};
