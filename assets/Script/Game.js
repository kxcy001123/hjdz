// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var sdk = require('./sdk/sdk')
var zhuangbei = require('./allZhuangbei');
var utils = require('./utils/utils')

// require('utils/ald-game/ald-game.js')

// 炼器几率
window.lianqijilv = 1.0;
// 连续失败
window.lianxushibai = 0;
/**
 * 前缀等级对应附加条数
 * 7 3~5
 * 6 2~4
 * 5 1~3
 * 4 0~2
 * 3 0~1
 * 2 0 
 * 1 0
 */
// 附加属性池
window.allfujia = {
    // 物理攻击
    wuligongji1: {
        desc: '物理攻击力',
        value: 1,
        pingfenxishu: 1.15,
        qianghua: 0.11,
    },
    wuligongji2: {
        desc: '物理攻击力',
        value: 2,
        pingfenxishu: 1.20,
        qianghua: 0.13,
    },
    wuligongji3: {
        desc: '物理攻击力',
        value: 3,
        pingfenxishu: 1.25,
        qianghua: 0.15,
    },
    wuligongji4: {
        desc: '物理攻击力',
        value: 4,
        pingfenxishu: 1.30,
        qianghua: 0.15,
    },
    wuligongji5: {
        desc: '物理攻击力',
        value: 5,
        pingfenxishu: 1.35,
        qianghua: 0.2,
    },
    // 物理防御
    wulifangyu1: {
        desc: '物理防御力',
        value: 1,
        pingfenxishu: 1.15,
        qianghua: 0.1,
    },
    wulifangyu2: {
        desc: '物理防御力',
        value: 2,
        pingfenxishu: 1.20,
        qianghua: 0.1,
    },
    wulifangyu3: {
        desc: '物理防御力',
        value: 3,
        pingfenxishu: 1.25,
        qianghua: 0.1,
    },
    wulifangyu4: {
        desc: '物理防御力',
        value: 4,
        pingfenxishu: 1.30,
        qianghua: 0.15,
    },
    wulifangyu5: {
        desc: '物理防御力',
        value: 5,
        pingfenxishu: 1.35,
        qianghua: 0.15,
    },
    // 魔法攻击
    mofagongji1: {
        desc: '魔法攻击力',
        value: 1,
        pingfenxishu: 1.15,
        qianghua: 0.052,
    },
    mofagongji2: {
        desc: '魔法攻击力',
        value: 2,
        pingfenxishu: 1.20,
        qianghua: 0.12,
    },
    mofagongji3: {
        desc: '魔法攻击力',
        value: 3,
        pingfenxishu: 1.25,
        qianghua: 0.13,
    },
    mofagongji4: {
        desc: '魔法攻击力',
        value: 4,
        pingfenxishu: 1.30,
        qianghua: 0.21,
    },
    mofagongji5: {
        desc: '魔法攻击力',
        value: 5,
        pingfenxishu: 1.35,
        qianghua: 0.18,
    },
    // 魔法防御
    mofafangyu1: {
        desc: '魔法防御力',
        value: 1,
        pingfenxishu: 1.15,
        qianghua: 0.1,
    },
    mofafangyu2: {
        desc: '魔法防御力',
        value: 2,
        pingfenxishu: 1.20,
        qianghua: 0.12,

    },
    mofafangyu3: {
        desc: '魔法防御力',
        value: 3,
        pingfenxishu: 1.25,
        qianghua: 0.14,

    },
    mofafangyu4: {
        desc: '魔法防御力',
        value: 4,
        pingfenxishu: 1.30,
        qianghua: 0.18,

    },
    mofafangyu5: {
        desc: '魔法防御力',
        value: 5,
        pingfenxishu: 1.35,
        qianghua: 0.18,
    },
    // 体质
    tizhi1: {
        desc: '体质',
        value: 1,
        pingfenxishu: 1.15,
        qianghua: 0.1,

    },
    tizhi2: {
        desc: '体质',
        value: 2,
        pingfenxishu: 1.20,
        qianghua: 0.12,

    },
    tizhi3: {
        desc: '体质',
        value: 3,
        pingfenxishu: 1.25,
        qianghua: 0.14,

    },
    tizhi4: {
        desc: '体质',
        value: 4,
        pingfenxishu: 1.30,
        qianghua: 0.18,

    },
    tizhi5: {
        desc: '体质',
        value: 5,
        pingfenxishu: 1.35,
        qianghua: 0.2,

    },
    // 力量
    liliang1: {
        desc: '力量',
        value: 1,
        pingfenxishu: 1.15,
        qianghua: 0.1,
    },
    liliang2: {
        desc: '力量',
        value: 2,
        pingfenxishu: 1.20,
        qianghua: 0.12,

    },
    liliang3: {
        desc: '力量',
        value: 3,
        pingfenxishu: 1.25,
        qianghua: 0.14,

    },
    liliang4: {
        desc: '力量',
        value: 4,
        pingfenxishu: 1.30,
        qianghua: 0.16,

    },
    liliang5: {
        desc: '力量',
        value: 5,
        pingfenxishu: 1.35,
        qianghua: 0.17,

    },
    // 精神
    jingshen1: {
        desc: '精神',
        value: 1,
        pingfenxishu: 1.15,
        qianghua: 0.11,

    },
    jingshen2: {
        desc: '精神',
        value: 2,
        pingfenxishu: 1.20,
        qianghua: 0.13,

    },
    jingshen3: {
        desc: '精神',
        value: 3,
        pingfenxishu: 1.25,
        qianghua: 0.14,

    },
    jingshen4: {
        desc: '精神',
        value: 4,
        pingfenxishu: 1.30,
        qianghua: 0.18,

    },
    jingshen5: {
        desc: '精神',
        value: 5,
        pingfenxishu: 1.35,
        qianghua: 0.21,

    },
    // 敏捷
    minjie1: {
        desc: '敏捷',
        value: 1,
        pingfenxishu: 1.15,
        qianghua: 0.12,

    },
    minjie2: {
        desc: '敏捷',
        value: 2,
        pingfenxishu: 1.20,
        qianghua: 0.14,

    },
    minjie3: {
        desc: '敏捷',
        value: 3,
        pingfenxishu: 1.25,
        qianghua: 0.15,

    },
    minjie4: {
        desc: '敏捷',
        value: 4,
        pingfenxishu: 1.30,
        qianghua: 0.16,

    },
    minjie5: {
        desc: '敏捷',
        value: 5,
        pingfenxishu: 1.35,
        qianghua: 0.21,

    },
    // 暴击
    baoji1: {
        desc: '暴击',
        value: 1,
        pingfenxishu: 1.15,
        qianghua: 0.11,

    },
    baoji2: {
        desc: '暴击',
        value: 2,
        pingfenxishu: 1.20,
        qianghua: 0.12,

    },
    baoji3: {
        desc: '暴击',
        value: 3,
        pingfenxishu: 1.25,
        qianghua: 0.13,

    },
    baoji4: {
        desc: '暴击',
        value: 4,
        pingfenxishu: 1.30,
        qianghua: 0.17,

    },
    baoji5: {
        desc: '暴击',
        value: 5,
        pingfenxishu: 1.35,
        qianghua: 0.2,

    },
};

var all_cailiao = require('Cailiao')
var lianqifuzhu = require('lianqifuzhu')

var allZhuangbei = require('allZhuangbei')


// 所有物品
window.allGoods = {
    // 0*** 材料
    ...all_cailiao.yuanliaoLv1,
    ...all_cailiao.yuanliaoLv2,
    ...all_cailiao.chengpincailiaoLv1,
    ...all_cailiao.chengpincailiaoLv2,
    // 1*** 符
    ...lianqifuzhu.lianqiFuzhuLv1,
    // 2*** 装备
    ...allZhuangbei.zhuangbeiLv1,
    ...allZhuangbei.zhuangbeiLv2,
};

// 材料等级
window.cailiaolvl = {
    1: {
        desc: '一等',
        color: [1.0, 1.0, 1.0, 1.0],
    },
    2: {
        desc: '二等',
        color: [0.39, 0.58, 0.93, 1.0],
    },
    3: {
        desc: '三等',
        color: [0.0, 1.0, 1.0, 1.0],
    },
    4: {
        desc: '四等',
        color: [0.5, 1.0, 0.0, 1.0],
    },
};
// 装备等级
window.zhuangbeilvl = {
    1: {
        desc: '粗糙',
        color: '#808080',
        // 评分系数
        pingfenxishu: 0.8,
        maxfujia: 0,
        minfujia: 0,
    },
    2: {
        desc: '普通',
        color: '#ffffff',
        pingfenxishu: 1.0,
        maxfujia: 0,
        minfujia: 0,
    },
    3: {
        desc: '实用',
        color: '#F0E68C',
        pingfenxishu: 1.1,
        maxfujia: 1,
        minfujia: 0,
    },
    4: {
        desc: '强化',
        color: '#FF00FF',
        pingfenxishu: 1.18,
        minfujia: 1,
        maxfujia: 2,
    },
    5: {
        desc: '精致',
        color: '#0000FF',
        pingfenxishu: 1.26,
        minfujia: 1,
        maxfujia: 3,
    },
    6: {
        desc: '无瑕',
        color: '#00FF00',
        pingfenxishu: 1.34,
        minfujia: 2,
        maxfujia: 4,
    },
    7: {
        desc: '完美',
        color: '#FFD700',
        pingfenxishu: 1.42,
        minfujia: 3,
        maxfujia: 5,
    },
};

window.qianghuayanse = {
    1: {
        color: '#f2d3ff',
        fluxay2:{
            pow1: 20.0,
            pow2: 0.0,
            pow3: 0.0,
        },
        avv: 4.1,
        rate: 0.9
    },
    2: {
        color: '#bcffd2',
        fluxay2:{
            pow1: 10.0,
            pow2: 10.0,
            pow3: 1.0,
        },
        rate: 0.8
    },
    3: {
        color: '#fff38e',
        fluxay2:{
            pow1: 10.0,
            pow2: 0.0,
            pow3: 10.0,
        },
        rate: 0.8
    },
    4: {
        color: '#ffc0db',
        fluxay2:{
            pow1: 100.0,
            pow2: 0.0,
            pow3: 10.0,
        },
        rate: 0.7
    },
    5: {
        color: '#ff00ff',
        fluxay2:{
            pow1: 0.0,
            pow2: 50.0,
            pow3: 0.0,
        },
        rate: 0.7
    },
    6: {
        color: '#95aeff',
        fluxay2:{
            pow1: 0.0,
            pow2: 50.0,
            pow3: 10.0,
        },
        rate: 0.6
    },
    7: {
        color: '#426aff',
        fluxay2:{
            pow1: 10.0,
            pow2: 50.0,
            pow3: 10.0,
        },
        rate: 0.6
    },
    8: {
        color: '#6dffff',
        fluxay2:{
            pow1: 10.0,
            pow2: 50.0,
            pow3: 100.0,
        },
        rate: 0.5
    },
    9: {
        color: '#45ff45',
        fluxay2:{
            pow1: 0.0,
            pow2: 0.0,
            pow3: 20.0,
        },
        rate: 0.7
    },
    10: {
        color: '#c5ff54',
        fluxay2:{
            pow1: 0.0,
            pow2: 100.0,
            pow3: 100.0,
        },
        rate: 0.4,
    },
    11: {
        color: '#ffd272',
        fluxay2:{
            pow1: 10.0,
            pow2: 10.0,
            pow3: 10.0,
        },
        rate: 0.3,
    },
    12: {
        color: '#ff8b0f',
        fluxay2:{
            pow1: .1,
            pow2: 10.0,
            pow3: 10.0,
        },
        rate: 0.3,
    },
    13: {
        color: '#ff6a7c',
        fluxay2:{
            pow1: .1,
            pow2: 0.0,
            pow3: 10.0,
        },
        rate: 0.2,
    },
    14: {
        color: '#ff005a',
        fluxay2:{
            pow1: .1,
            pow2: 10.5,
            pow3: 0.0,
        },
        rate: 0.2,
    },
    15: {
        color: '#f6c3ff',
        fluxay2:{
            pow1: 0.0,
            pow2: 0.5,
            pow3: 10.0,
        },
        rate: 0.1,
    },
    16: {
        color: '#ff00ba',
        fluxay2:{
            pow1: 0.0,
            pow2: 10.5,
            pow3: 0.5,
        },
        rate: 0.1,
    },
    17: {
        color: '#d7dbff',
        fluxay2:{
            pow1: 10.0,
            pow2: 0.0,
            pow3: 0.5,
        },
        rate: 0.1,

    },
    18: {
        color: '#ffd0e7',
        fluxay2:{
            pow1: 10.0,
            pow2: 0.1,
            pow3: 0.5,
        },
        rate: 0.1,
    },
    19: {
        color: '#bfffdf',
        fluxay2:{
            pow1: 10.0,
            pow2: 10.1,
            pow3: 0.5,
        },
        rate: 0.1,
    },
    20: {
        color: '#595959',
        fluxay2:{
            pow1: 0.0,
            pow2: 10.1,
            pow3: 0.1,
        },
        rate: 0,
    },
    
}

var goods = require('bag')

window.global = {
    goods: goods,
    // 之前选中的物品
    prevSelectedGood: null,
    // 当前选中的物品
    currentSelectedGood: null,
    todayZeongsong: '',
    soundOn: true, // 开启音乐
    syncBagToStorage: function(){
        window.global.goods = window.global.goods.filter(item=>item.count>0)
        sdk.storage.set('mybag', window.global.goods)
    },

    // 打造
    dazaoMianbu: false,
    // 是否审核状态
    IS_CHECK: false,

    iconAd: null,
    bannerAd: null,

    showIconAd: ()=>{
        if(window.global.iconAd ){
            window.global.iconAd.load().then(() => {
                iconAd.show()
                
            }).catch((err) => {
                console.error(err)
            })
        }
    },

    hideIconAd: ()=>{
        if(window.global.iconAd ){
            iconAd.hide()
        }
    },
    showBannerAd: ()=>{
        if(window.global.bannerAd ){
            window.global.bannerAd.show().catch((err) => {
                console.error(err)
            })
        }
    },
    hideBannerAd: ()=>{
        if(window.global.bannerAd ){
            window.global.bannerAd.hide()
        }
    },
}


window.timerInfo = [

]

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        shareBtn: {
            type: cc.Button,
            default: null,
        },
        shareCountLable: {
            type: cc.Label,
            default: null,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        window.gameScence = this.node;

        this.createWxGameBanner();
        this.createWxGameIcon();


        this.showIconAd();
        this.showBannerAd();

        let date = utils.getDayDate();

        let shareCount = sdk.storage.get(`${date}-sharecount`)

        if(shareCount === null){
            sdk.storage.set(`${date}-sharecount`, 10)
            shareCount = sdk.storage.get(`${date}-sharecount`);
        };


        // 
        sdk.ad._initRewardedVideoAd();
        // 
        this.showShareCount();
    },
    onShare (){

        var self = this;

        let shareFlag = Math.random() > 0.5;

        let alertString = '';

        if(shareFlag){
            alertString = '分享好友，领取酷炫装备\n邀请朋友一起九九必成领红包'
        }else{
            alertString = '观看视频，领取酷炫装备\n邀请朋友一起九九必成领红包'
        }

        window.MyAlert.show({
            alertString: alertString,
            needCancel: true,
            cancelText: '取消',
            confirmCallback: function(){

                if(shareFlag){
                    let shareinfo = [
                        `刀刀暴击，强化增幅！`,
                        `九九必成，强化增幅！`,
                        `重拾强化增幅的感觉。`,
                        `当年没玩的，我要一并玩回来。`,
                        `装备强化19上20。`,
                        `每次强化，都有不同的装备特效`,
                    ];
            
                    let ran = Math.floor(Math.random() * shareinfo.length);
                    let extra = !window.global.IS_CHECK ? '强化装备，最高提现50元' : '';
            
                    
                    cc.resources.load('img/share1' ,  (err, spriteFrame) => {
                        sdk.shareAppMessage({
                            title: shareinfo[ran] + extra,
                            imageUrl: spriteFrame.url,
                            success: self.shareSuccess.bind(self)
                        })
                        cc.log('分享确定')
                    });
                }else{
                    sdk.ad.showRewardedVideoAd({
                        onClose: self.videoSuccess.bind(self)
                    })
                }

                
            }.bind(self)
        })
        

        

        
    },

    shareSuccess (){
        var self = this;
        
        let lvl2ZB = zhuangbei.zhuangbeiLv2;

        let arr = Object.keys(lvl2ZB);
        let random= Math.floor(Math.random() * arr.length);

        let _zb = lvl2ZB[arr[random]];
        if(_zb && _zb.atlasName){
            this.zbId = arr[random];
        }

        let _new = zhuangbei.initZhuangbeiLv2(this.zbId)

        let name = zhuangbei.zhuangbeiLv2[this.zbId].name;

        window.global.goods.unshift(_new);

        window.MyAlert.show({
            alertString: `【${name}】已放入您的背包\n请自行查看`,
        })
        window.global.syncBagToStorage();
        let date = utils.getDayDate();

        let shareCount = sdk.storage.get(`${date}-sharecount`)

        shareCount = Number(shareCount) - 1;
        sdk.storage.set(`${date}-sharecount`, shareCount)

        this.showShareCount();


    },

    videoSuccess(res){
        if(res){
            this.shareSuccess();
        }
    },

    showShareCount(){
        let date = utils.getDayDate();

        let shareCount = sdk.storage.get(`${date}-sharecount`)
        this.shareCountLable.string = `今日剩余${shareCount}次`;

        this.shareCount = Number(shareCount);
        if(this.shareCount === 0){
            this.shareBtn.interactable = false;
        }else{
            this.shareBtn.interactable = true;
        }

    },


    createGamePortal(){
        // 定义推荐位
        let portalAd = null

        // 创建推荐位实例，提前初始化
        if (window.wx && wx.createGamePortal) {
            portalAd = wx.createGamePortal({
                adUnitId: 'PBgAAIlQMRxCyWmA'
            })
        }

        // 在适合的场景显示推荐位
        // err.errCode返回1004时表示当前没有适合推荐的内容，建议游戏做兼容，在返回该错误码时展示其他内容
        if (portalAd) {
            portalAd.load().then(() => {
                portalAd.show()
            }).catch((err) => {
                console.error(err)
            })
        }
    },


    createWxGameIcon(){
        // 定义推荐位
        let iconAd = null

        window.global.iconAd = this.iconAd = iconAd;

        // 创建推荐位实例，提前初始化
        if (window.wx && wx.createGameIcon) {
            let {screenHeight, screenWidth} =  wx.getSystemInfoSync();
             window.global.iconAd = this.iconAd = iconAd = wx.createGameIcon({
                adUnitId: 'PBgAAIlQMRxJqv5I',
                count: 4,
                style:[
                    {
                        appNameHidden: true,
                        left: 0,
                        top:  screenHeight / 4 * 3 ,
                    },
                    {
                        appNameHidden: true,
                        left: 0,
                        top:  screenHeight / 4 * 3 - 50,
                    },
                    {
                        appNameHidden: true,
                        left: screenWidth - 70,
                        top:  screenHeight / 4 * 3,
                    },
                    {
                        appNameHidden: true,
                        left: screenWidth - 70,
                        top:  screenHeight / 4 * 3 - 50,
                    },

                ]
            })
        }

    },

    createWxGameBanner(){
        // 定义推荐位
        let bannerAd = null;

        window.global.bannerAd = this.bannerAd = bannerAd;


        // 创建推荐位实例，提前初始化
        if (window.wx && wx.createBannerAd) {
            let {screenHeight, screenWidth} =  wx.getSystemInfoSync();

            window.global.bannerAd = this.bannerAd = bannerAd = wx.createBannerAd({
                adUnitId: 'adunit-e4d64052a8bbe364',
                adIntervals: 30, // 自动刷新频率不能小于30秒
                style: {
                    left: 0,
                    top: 0,
                    width: 350
                }
              })
        }

        // 在适合的场景显示推荐位
        // err.errCode返回1004时表示当前没有适合推荐的内容，建议游戏做兼容，在返回该错误码时展示其他内容
       
    },


    showIconAd: ()=>{

        cc.log('iconad show')

        if(window.global.iconAd ){
            window.global.iconAd.load().then(() => {
                window.global.iconAd.show()
                
            }).catch((err) => {
                console.error(err)
            })
        }
    },

    hideIconAd: ()=>{
        cc.log('iconad hide')

        if(window.global.iconAd ){
            window.global.iconAd.hide()
        }
    },
    showBannerAd: ()=>{
        cc.log('bannerad hide')

        if(window.global.bannerAd ){
            window.global.bannerAd.show().catch((err) => {
                console.error(err)
            })
        }
    },
    hideBannerAd: ()=>{
        cc.log('bannerad show')

        if(window.global.bannerAd ){
            window.global.bannerAd.hide()
        }
    },

    // update (dt) {},
});
