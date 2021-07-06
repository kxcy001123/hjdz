// 云函数入口文件
const cloud = require('wx-server-sdk')

// 与小程序端一致，均需调用 init 方法初始化
cloud.init()


// 可在入口函数外缓存 db 对象
const db = cloud.database()

// 数据库查询更新指令对象
const _ = db.command

const configDocId = '17453ede607fff5d031e11af3d377f2d';

// 云函数入口函数
exports.main = async (event, context) => {

  let config = {};
  
  try {
    const querResult = await db.collection('config').doc(configDocId).get()
    config = querResult.data;

    console.log('querResult', querResult, config)

  } catch(err) {

  }

  return {
    // openid
    openid: event.userInfo.openId,
    // 审核版本
    checkVersion: 'v1.6.0',
    // ban掉(禁用违规操作)的城市
    banList: ['北京', '广州', '深圳', '上海'], //'北京', '广州'

    ads: [],

    banAds: [],

    // 新用户分享次数
    NEW_SHARE_TIMES: 1,
    // 新用户分享权重
    NEW_SHARE_WEIGHT: 0,
    // 老用户分享权重
    OLD_SHARE_WEIGHT: 0,
    // 新用户关闭按钮状态
    NEW_CLOSE_STATUS: 1,
    // 老用户关闭按钮状态
    OLD_CLOSE_STATUS: 0,
    // 每个用户登陆游戏之后必须分享的次数
    MUST_SHARE_TIMES: 1,

    // 分享模拟回掉的超时时间(单位秒)
    SHARE_CALLBACK_TIME: 2.5,
    // 分享模拟回掉的成功概率
    SHARE_CALLBACK_RATE: 1,
    // 前多少次成功的分享算作失败
    SHARE_FAIL_NUM: 1,
    // 分享模拟回掉失败的话
    SHARE_FAIL_TEXT: '请尝试分享到新的群中',
    // 分享几次提一次提示
    MAX_SHARE: 3,
    // 提示语
    MAX_SHARE_TEXT: '请尝试分享到新的群中',

    // 是否审核状态
    IS_CHECK: config.is_check,

    // 分享配置
    shares: {
      default: [{
        // title: '快哭了，谁来帮帮孩子们，让这个进吧',
        // title: '我投了998分，谁敢来挑战我？',
        // imageUrl: 'https://7873-xs-29a3cb-1259447590.tcb.qcloud.la/share.jpg?sign=876f58f4d2fd15931591bf34190f6270&t=1563434295',
        title: '第6个领取的人红包最大！',
        imageUrl: 'https://7873-xs-29a3cb-1259447590.tcb.qcloud.la/lanqiu.jpg?sign=cc82fd8171863ee1276850486ba703c0&t=1564655351',
      }]
    },

    // 是否

    maxreviveCount: 3
  }
}