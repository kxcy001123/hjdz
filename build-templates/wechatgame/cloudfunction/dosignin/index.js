// 云函数入口文件
const http = require('http');

const dosignin = async(openid) => {
  return new Promise(function(right, error) {
    const options = {
      hostname: 'www.eryadaan.com',
      port: 80,
      path: `/web?MsgType=dosignin&FromUserName=${openid}`,
      method: 'GET',
      timeout: 3000
    };

    const req = http.request(options, (res) => {
      var data = '';
      res.on('data', function(chunk) {
        data += chunk;
      });
      res.on('end', () => {
        right(data);
      });
    });
    // 出错
    req.on('error', (e) => {
      error();
    });
    // 写入数据到请求主体
    req.end();
  })
}

// 云函数入口函数
exports.main = async(event, context) => {
  let data = null;
  try {
    data = await dosignin(event.userInfo.openId)
    data = JSON.parse(data)
  } catch (e) {
    data = {
      message: 'error',
      data: 0
    }
  }

  return data
}