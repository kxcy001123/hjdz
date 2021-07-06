/**
 * 新版基于cocos creator2.0
 * 
 * 调用分享时，会默认加入openId(用户ID)和shareId(分享唯一ID)两个分享参数，在onShow中可以获取到
 * 调用接口时，会默认加入name(游戏名)、ver(游戏版本号)、sdkVersion(sdk版本号)
 */
const sdk = {};
module.exports = sdk;

// 系统信息
sdk.systemInfo = (window.wx && wx.getSystemInfoSync) ? wx.getSystemInfoSync() : {};
// sdk版本
sdk.version = 'v2.1.4'

// sdk配置
let config = {
    // 交叉推广游戏名
    gameid: 'test',
    // 交叉推广游戏名[弃用]
    name: 'test',
    // 游戏当前版本
    version: 'v1.0.0',

    // 激励视频广告ID
    adUnitId: 'adunit-f2fa71969ba52d7c',
    // Banner视频ID
    adUnitIdBanner: 'adunit-e4d64052a8bbe364',
    // 插屏ID
    adUnitIdInterstitial: '',

    // 配置服务器地址
    constHost: '',
    // 云开发环境id
    cloudEnv: 'dazao-1-2gwvp5dg514972c1',

    // 支付ID
    payOfferId: '',
    // 支付环境 [0:正式环境 1:测试环境]
    payEnv: 1,
    zoneId: 1,
};

// sdk数据
let data = {
    openid: '',
    checkVersion: 'v1.0.0',

    // 是否ban
    isBan: false,
    // 由banList计算的是否ban
    _isBan: false,
    // ban的城市列表
    banList: ['北京', '上海', '广州', '深圳'],
    // 关闭投诉
    closeComplain: false,
    // 交叉推广数据列表
    ads: [],
    // 交叉推广图标
    adIcon: '',
    // 盒子appid
    boxAppid: '',
    // 要ban推广的游戏列表
    banAds: [],

    // 分享模拟回掉的超时时间(单位秒)
    SHARE_CALLBACK_TIME: 2,
    // 分享模拟回掉的成功概率
    SHARE_CALLBACK_RATE: 1,
    // 前多少次成功的分享算作失败
    SHARE_FAIL_NUM: 2,
    // 分享模拟回掉失败的话
    SHARE_FAIL_TEXT: '',

    // 分享几次提一次提示
    MAX_SHARE: 3,
    // 提示语
    MAX_SHARE_TEXT: '',

    // 新用户分享次数
    NEW_SHARE_TIMES: 5,
    // 新用户分享权重
    NEW_SHARE_WEIGHT: 1,
    // 老用户分享权重
    OLD_SHARE_WEIGHT: 0.5,
    // 新用户关闭按钮状态
    NEW_CLOSE_STATUS: 1,
    // 老用户关闭按钮状态
    OLD_CLOSE_STATUS: 0,
    // 每个用户登陆游戏之后必须分享的次数
    MUST_SHARE_TIMES: 3
};

/******************************************************** 事件监听 ********************************************************/
const event = new cc.EventTarget();

let onShowData = null;
if (window.wx && wx.onShow && wx.onHide) {
    wx.onShow((data) => {
        sdk.log('onShow', data);
        onShowData = data;
        event.emit('onShow', data);
    });
    wx.onHide((data) => {
        event.emit('onHide', data);
    });
}

sdk.on = function (key, cb, target, fast) {
    if (fast !== false && key === 'onShow' && onShowData) {
        cb.call(target, onShowData);
    }
    return event.on(key, cb, target);
};

sdk.once = function (key, cb, target) {
    return event.once(key, cb, target);
};

sdk.off = function (key, cb, target) {
    return event.off(key, cb, target);
};

sdk.targetOff = function (target) {
    return event.targetOff(target);
};

sdk.log = function (str, ...ags) {
    console.log(`[sdk] [log] ${str}`, ...ags);
}

sdk.error = function (str, ...ags) {
    console.log(`[sdk] [error] ${str}`, ...ags);
}

/*********************************************** 标记onHide之前的动作是什么 ***********************************************/
// 0 - 什么都没做，点击banner，其它
// 1 - 主动分享
// 2 - 激励视频
// 3 - 更多游戏
sdk._beforeOnHideAction = 0;

sdk.on('onHide', function () {
    if (!sdk.isCheckVersion() && data.closeComplain == true && sdk._beforeOnHideAction == 0) {
        // 连续调用两次试试看，因为有时调用无效
        try { sdk.exitMiniProgram(); } catch (err) { }
        try { sdk.exitMiniProgram(); } catch (err) { }
    }
    sdk._beforeOnHideAction = 0;
});

/******************************************************** 初始化 ********************************************************/
/**
 * cps打点
 */
sdk._channelCps = function () {
    // if (window.wx && wx.getLaunchOptionsSync) {
    //     // 获取游戏打开参数
    //     let launch = wx.getLaunchOptionsSync() || {};
    //     // 渠道字段
    //     let channel = (launch.query && launch.query.channel) || (launch.referrerInfo && launch.referrerInfo.extraData && launch.referrerInfo.channel);
    //     // 获得真实的用户ID
    //     sdk.user.getRealOpenId((err, openid) => {
    //         sdk.log('cps', err, openid);
    //         if (!err && openid) {
    //             sdk.http.get({ host: 'todo', cmd: 'dataTrace' }, { openid: openid, channel });
    //         }
    //     });
    // }
};
/**
 * 初始化sdk
 * 
 * @param {*} _config   config
 * @param {*} _data     data
 * @param {(retry:function)=>{}} cb        回调
 * 
 * sdk.init(config)
 * sdk.init(config, data)
 * sdk.init(config, cb)
 * sdk.init(config, data, cb)
 */
sdk.init = function (_config, _data, cb) {
    if (_config) {
        for (let key in config) {
            if (typeof _config[key] === 'undefined') {
                _config[key] = config[key];
            }
        }
        config = _config;
    }
    if (_data && typeof _data !== 'function') {
        for (let key in data) {
            if (typeof _data[key] === 'undefined') {
                _data[key] = data[key];
            }
        }
        data = _data;
    } else {
        cb = _data;
    }
    this.cloud._initCloud();
    // 渠道打点
    // this._channelCps();

    // 拉取服务器数据
    // const getConst = function () {
    //     sdk.data._getConst(function () {
    //         cb && cb(getConst);
    //     });
    // };
    // getConst();

    // 数据变化时初始化视频
    // this.data.onChange(() => {
    //     // 初始化激励视频组件
    //     this.ad._initRewardedVideoAd();
    //     // 初始化banner视频组件
    //     this.ad._initBannerAd();
    // });
};

/******************************************************** 基础 ********************************************************/

/**
 * 检测当前系统SDKVersion是否>=传入的版本号
 */
sdk.checkSDKVersion = function (SDKVersion) {
    if (window.wx && this.systemInfo.SDKVersion && SDKVersion) {
        let v1 = this.systemInfo.SDKVersion.split('.');
        let v2 = SDKVersion.split('.');
        if (v1.length !== v2.length) {
            return false;
        }
        for (let i = 0; i < v1.length; i++) {
            if (parseInt(v1[i]) < parseInt(v2[i])) {
                return false;
            } else if (parseInt(v1[i]) > parseInt(v2[i])) {
                return true;
            }
        }
        return true;
    } else {
        return false;
    }
};

sdk.isIOS = function () {
    var u = navigator.userAgent;
    return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
};

sdk.isAndroid = function () {
    var u = navigator.userAgent;
    return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
};

/**
 * 自动更新游戏
 */
sdk.autoUpdateGame = function () {
    if (window.wx && typeof wx.getUpdateManager === 'function') {
        const updateManager = wx.getUpdateManager();

        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            sdk.log('onCheckForUpdate', res.hasUpdate);
        });

        updateManager.onUpdateReady(function () {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            sdk.log('onUpdateReady');
            updateManager.applyUpdate();
        });

        updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            sdk.log('onUpdateFailed');
        });
    }
};

/**
 * 获得游戏内节点对应屏幕坐标系下的位置的大小
 */
sdk.getScreenStyle = function (node) {
    let btnRect = node.getBoundingBoxToWorld();

    // 屏幕尺寸
    let frameSize = cc.view.getFrameSize();
    // 实际分辨率
    let winSize = cc.winSize;

    let left = btnRect.xMin / winSize.width * frameSize.width;
    let top = (winSize.height - btnRect.yMax) / winSize.height * frameSize.height;
    let width = btnRect.width / winSize.width * frameSize.width;
    let height = btnRect.height / winSize.height * frameSize.height;

    return { left, top, width, height };
}

/**
 * 创建用户信息按钮
 */
sdk.createUserInfoButton = function (obj, cb) {
    if (!window.wx || !wx.createUserInfoButton) {
        sdk.log('createUserInfoButton');
        return null;
    }

    let style = null;
    let image = null;

    if (obj.style) {
        style = obj.style;
        image = obj.image;
    } else {
        style = obj;
    }

    if (cc.Node.isNode(style)) {
        if (!image) {
            image = style.getComponent(cc.Sprite).spriteFrame.getTexture().url;
            if (cc.loader.md5Pipe && cc.loader.md5Pipe.transformURL) image = cc.loader.md5Pipe.transformURL(image);
        }
        let { left, top, width, height } = this.getScreenStyle(style);
        style = {
            left: left,
            top: top,
            width: width,
            height: height,
            lineHeight: height,
            backgroundColor: '',
            color: '#ffffff',
            textAlign: 'center',
            fontSize: 16,
            borderRadius: 4
        }
    }

    const btn = wx.createUserInfoButton({
        type: 'image',
        image: image,
        style: style
    });

    function handleTap (uinfo){
        cb && cb(uinfo, btn);
        btn.offTap(handleTap);
        btn.destroy();
    }

    btn && btn.onTap(handleTap);
    return true;
};

/**
 * 检测是否已经关注 [仅头条有效]
 */
sdk.checkFollowState = function (cb) {
    if (!window.tt || !tt.checkFollowState) {
        sdk.log('checkFollowState');
        return cb && cb('checkFollowState');
    }

    if (sdk.systemInfo.appName !== 'Toutiao') {
        sdk.log('checkFollowState: not Toutiao');
        return cb && cb('checkFollowState: not Toutiao');
    }

    if (tt.checkFollowState) {
        tt.checkFollowState({
            success(res) {
                cb && cb(null, res.result);
            },
            fail(e) {
                cb && cb(e);
            }
        })
    }
}

/**
 * 创建关注按钮 [仅头条有效]
 */
sdk.createFollowButton = function (obj, cb) {
    if (!window.tt || !tt.createFollowButton) {
        sdk.log('createFollowButton');
        return null;
    }

    if (sdk.systemInfo.appName !== 'Toutiao') {
        sdk.log('createFollowButton: not Toutiao');
        return null;
    }

    let style = null;
    let image = null;
    if (obj.style) {
        style = obj.style;
        image = obj.image;
    } else {
        style = obj;
    }

    if (cc.Node.isNode(style)) {
        image = style.getComponent(cc.Sprite).spriteFrame.getTexture().url;
        if (cc.loader.md5Pipe && cc.loader.md5Pipe.transformURL) image = cc.loader.md5Pipe.transformURL(image);
        let { left, top, width, height } = this.getScreenStyle(style);

        style = {
            left: left,
            top: top,
            width: width,
            height: height,
            lineHeight: height,
            backgroundColor: "#ffffff",
            textColor: "#ffffff",
            textAlign: "center",
            fontSize: 16,
            borderRadius: 4,
            borderWidth: 0,
            borderColor: '#ffffff'
        }
    }

    const btn = tt.createFollowButton({
        type: 'image',
        image: image,
        style: style,
        data: {}
    });

    btn.onTap(function (res) {
        if (cb) cb(res, btn);
    });

    return btn;
}

/**
 * 设置更多游戏配置 [仅字节跳动有效]
 */
sdk.setMoreGamesInfo = function (appLaunchOptions) {
    if (!window.tt || !tt.setMoreGamesInfo) {
        sdk.log('setMoreGamesInfo');
        return null;
    }
    tt.setMoreGamesInfo({
        appLaunchOptions,
    })
}

/**
 * 创建更多游戏 banner [仅字节跳动有效]
 */
sdk.createMoreGamesBanner = function (appLaunchOptions, style) {
    if (!window.tt || !tt.createMoreGamesBanner) {
        sdk.log('createMoreGamesBanner');
        return null;
    }

    if (typeof style === 'undefined') {
        const frameSize = cc.view.getFrameSize();
        style = {
            left: 0,
            top: frameSize.height - 120,
            width: frameSize.width
        };
    }

    const banner = tt.createMoreGamesBanner({
        style,
        appLaunchOptions,
    })

    return banner;
}

/**
 * 创建更多游戏按钮 [仅字节跳动有效]
 */
sdk.createMoreGamesButton = function (obj, navigatecb, tapcb) {
    if (!window.tt || !tt.createMoreGamesButton) {
        sdk.log('createMoreGamesButton');
        return null;
    }

    let style = null;
    let appLaunchOptions = null;
    let image = null;

    if (obj.style) {
        style = obj.style;
        image = obj.image;
        appLaunchOptions = obj.appLaunchOptions;
    } else {
        style = obj;
    }

    if (cc.Node.isNode(style)) {
        image = style.getComponent(cc.Sprite).spriteFrame.getTexture().url;
        if (cc.loader.md5Pipe && cc.loader.md5Pipe.transformURL) image = cc.loader.md5Pipe.transformURL(image);
        let { left, top, width, height } = this.getScreenStyle(style);
        style = {
            left: left,
            top: top,
            width: width,
            height: height,
            lineHeight: height,
            backgroundColor: "#ffffff",
            textColor: "#ffffff",
            textAlign: "center",
            fontSize: 16,
            borderRadius: 4,
            borderWidth: 0,
            borderColor: '#ffffff'
        }
    }

    const btn = tt.createMoreGamesButton({
        type: 'image',
        image: image,
        style: style,
        appLaunchOptions: appLaunchOptions || data.ads,
        onNavigateToMiniGame(res) {
            // 标记onHide之前的操作，此处为跳转操作
            sdk._beforeOnHideAction = 3;
            navigatecb && navigatecb(res);
        }
    });

    btn.onTap(function (res) {
        tapcb && tapcb(res, btn);
    });

    return btn;
}

/**
 * 获得启动参数
 */
sdk.getLaunchOptionsSync = function () {
    if (window.wx && wx.getLaunchOptionsSync) {
        return wx.getLaunchOptionsSync();
    } else {
        sdk.log('getLaunchOptionsSync');
        return {};
    }
};

/**
 * 获得系统信息
 */
sdk.getSystemInfoSync = function () {
    if (window.wx && wx.getSystemInfoSync) {
        return wx.getSystemInfoSync();
    } else {
        sdk.log('getSystemInfoSync');
        return {};
    }
};

/**
 * 退出
 */
sdk.exitMiniProgram = function () {
    if (window.wx && wx.exitMiniProgram) {
        wx.exitMiniProgram();
    } else {
        sdk.log('exitMiniProgram');
    }
};

/**
 * 上报数据
 */
sdk.reportMonitor = function (name, value) {
    if (window.wx && wx.reportMonitor) {
        wx.reportMonitor(name, value);
    } else {
        sdk.log('reportMonitor', name, value);
    }
};

/**
 * 跳转到其它小程序
 */
sdk.navigateToMiniProgram = function (data) {
    if (window.wx && wx.navigateToMiniProgram) {
        wx.navigateToMiniProgram(data);
    } else {
        sdk.log('navigateToMiniProgram', data);
    }
};

/**
 * 打开底部多选框
 */
sdk.showActionSheet = function (data) {
    if (window.wx && wx.showActionSheet) {
        wx.showActionSheet(data);
    } else if (cc.app) {
        cc.app.system.uiSystem.show({ name: 'controlActionSheet', data });
    } else {
        sdk.log('showActionSheet', data);
    }
};

/**
 * 预览图片
 * @param {*} data 
 */
sdk.previewImage = function (data) {
    if (window.wx && wx.previewImage) {
        wx.previewImage(data);
    } else {
        sdk.log('previewImage', data);
    }
};

/**
 * 轻微震动
 * @param {*} data 
 */
sdk.vibrateShort = function (data) {
    if (window.wx && wx.vibrateShort) {
        wx.vibrateShort(data);
    } else {
        sdk.log('vibrateShort', data);
    }
};

sdk.vibrateLong = function (data) {
    if (window.wx && wx.vibrateLong) {
        wx.vibrateLong(data);
    } else {
        sdk.log('vibrateLong', data);
    }
};

sdk.postMessage = function (data) {
    if (window.wx && wx.postMessage) {
        wx.postMessage(data);
    } else {
        sdk.log('postMessage', data);
    }
};

sdk.showModal = function (data) {
    if (window.wx && wx.showModal) {
        wx.showModal(data);
    } else if (cc.app) {
        cc.app.system.uiSystem.show({ name: 'controlModal', data: data });
    } else {
        let result = { confirm: false, cancel: false };
        if (data.showCancel !== false) {
            if (confirm(data.content, data.title)) {
                result.confirm = true;
            } else {
                result.cancel = true;
            }
        } else {
            alert(data.content, data.title);
            result.confirm = true;
        }
        data.success && data.success(result);
        data.complete && data.complete(result);
    }
};

sdk.showToast = function (data) {
    if (window.wx && wx.showToast) {
        wx.showToast(data);
    } else if (cc.app) {
        cc.app.system.uiSystem.show({ name: 'controlToast', data: data });
    } else {
        sdk.log('showToast', data);
    }
};

sdk.showLoading = function (data) {
    if (window.wx && wx.showLoading) {
        wx.showLoading(data);
    } else if (cc.app) {
        cc.app.system.uiSystem.show({ name: 'controlLoading', data: data });
    } else {
        sdk.log('showLoading', data);
    }
};

sdk.hideLoading = function (data) {
    if (window.wx && wx.hideLoading) {
        wx.hideLoading(data);
    } else if (cc.app) {
        cc.app.system.uiSystem.hide({ name: 'controlLoading', data: data });
    } else {
        sdk.log('hideLoading', data);
    }
};

/**
 * 保存图片到相册
 * @param {*} data 
 */
sdk.saveImageToPhotosAlbum = function (data) {
    if (window.wx && wx.saveImageToPhotosAlbum) {
        wx.saveImageToPhotosAlbum(data);
    } else {
        sdk.log('saveImageToPhotosAlbum', data);
    }
};

/**
 * 设置剪切板
 */
sdk.setClipboardData = function (data) {
    if (window.wx && wx.setClipboardData) {
        wx.setClipboardData(data);
    } else {
        sdk.log('setClipboardData', data);
    }
};

/**
 * 获取剪切板
 */
sdk.getClipboardData = function (data) {
    if (window.wx && wx.getClipboardData) {
        wx.getClipboardData(data);
    } else {
        sdk.log('getClipboardData', data);
    }
};

/**
 * 将子域纹理传给参数texture
 * @param {cc.Texture2D} texture 
 * @return {cc.Texture2D} 
 */
sdk.getSharedTexture = function (texture) {
    if (window.sharedCanvas && texture) {
        texture.initWithElement(window.sharedCanvas);
        texture.handleLoadedTexture();
    }
    return texture;
};

/******************************************************** 分享 ********************************************************/

/**
 * 获得分享id
 */
sdk._getShareId = function () {
    return this.user.getOpenId() + '-' + Date.now();
};

/**
 * 分享消息
 * @param {*} params 
 * @param {*} validate false的情况下只要分享就会success, true的情况下会对分享做严格判断success和fail都会返回
 */
sdk._shareNum = 0;
sdk._shareCount = 0;
sdk._shareNum2 = 0;
sdk.shareAppMessage = function (params, validate = false) {
    if (window.wx && wx.shareAppMessage) {
        // 标记onHide之前的操作，此处为分享操作
        sdk._beforeOnHideAction = 1;

        let isValid = false;
        let isCall1 = false;
        let isCall2 = false;
        let isCall3 = false;

        let success = (res) => {
            if (isCall1) {
                return;
            }

            sdk.log('shareAppMessage local success', res);

            // 增加分享次数
            sdk.user._addShareCount();

            // 增加成功分享数
            this._shareNum++;

            params.success && params.success(res);

            isCall1 = true;
        };

        let fail = (res) => {
            if (isCall2) {
                return;
            }
            sdk.log('shareAppMessage local fail', res);

            params.fail && params.fail(res);

            isCall2 = true;
        };

        let complete = (res) => {
            if (isCall3) {
                return;
            }
            sdk.log('shareAppMessage local complete', res);

            params.complete && params.complete(res);

            isCall3 = true;
        };

        // 模拟分享回掉，从点击分享到返回游戏，超过2秒算成功
        let nowTime = Date.now();
        sdk.once('onHide', () => {
            if (Date.now() - nowTime < 2000) {
                isValid = true;
            }
        });
        // 等待分享返回游戏之后再开启定时器
        sdk.once('onShow', () => {
            if (!isValid || isCall1 || isCall2) {
                return false;
            }

            // 验证分享
            if (validate) {
                // 验证是否可以强制分享
                if (sdk.canViolation()) {
                    // 验证是否分享成功
                    if (Date.now() - nowTime >= data.SHARE_CALLBACK_TIME * 1000) {
                        // 验证是否分享成功
                        this._shareNum2++;
                        if (Math.random() <= data.SHARE_CALLBACK_RATE && this._shareNum2 > data.SHARE_FAIL_NUM) {
                            // 分享成功计数+1
                            sdk._shareCount++;
                            if (data.MAX_SHARE > 0) {
                                if (sdk._shareCount >= data.MAX_SHARE) {
                                    sdk._shareCount = 0;
                                    // 提示重新分享
                                    data.MAX_SHARE_TEXT ? sdk.showModal({
                                        title: '提示',
                                        content: data.MAX_SHARE_TEXT,
                                        confirmText: '确定',
                                        showCancel: false,
                                        complete: () => {
                                            sdk.shareAppMessage(params, true);
                                        }
                                    }) : sdk.shareAppMessage(params);
                                } else {
                                    success();
                                    complete();
                                }
                            } else {
                                success();
                                complete();
                            }
                        } else {
                            data.SHARE_FAIL_TEXT ? sdk.showModal({
                                title: '提示',
                                content: data.SHARE_FAIL_TEXT,
                                confirmText: '重试',
                                showCancel: false,
                                complete: () => {
                                    sdk.shareAppMessage(params, true);
                                }
                            }) : sdk.shareAppMessage(params);
                        }
                    } else {
                        fail();
                        complete();

                    }
                } else {
                    success();
                    complete();
                }
            } else {
                success();
                complete();
            }
        });

        let query;
        if (params.query) {
            query = params.query + '&openId=' + this.user.getOpenId() + '&shareId=' + this._getShareId();
        } else {
            query = 'openId=' + this.user.getOpenId() + '&shareId=' + this._getShareId();
        }

        wx.shareAppMessage({
            channel: params.channel,
            title: params.title,
            imageUrl: params.imageUrl,
            imageUrlId: params.imageUrlId,
            query: query,
            extra: params.extra,
            success: function (res) {
                sdk.log('shareAppMessage success');
                success(res);
            },
            fail: function (res) {
                sdk.log('shareAppMessage fail');
                if (window.tt) {
                    fail(res);
                } else if (res && res.errMsg && res.errMsg.indexOf('fail cancel') == -1) {
                    fail(res);
                }
            },
            complete: function (res) {
                sdk.log('shareAppMessage complete');
                complete(res);
            }
        });
    } else {
        params.success && params.success('local');
        params.complete && params.complete('local');
    }
};

/**
 * 展示默认分享按钮
 * @param {*} params 
 */
sdk._onShareAppMessageData = null;
sdk.showShareMenu = function (params) {
    if (window.wx && wx.updateShareMenu && wx.showShareMenu && wx.onShareAppMessage && !this._onShareAppMessageData) {
        this._onShareAppMessageData = params;
        this._updateShareMenu();
        this._showShareMenu();
        this._onShareAppMessage();
    } else {
        this._onShareAppMessageData = params;
    }
};

//更新菜单
sdk._updateShareMenu = function () {
    wx.updateShareMenu({
        withShareTicket: true,
        menus:["shareAppMessage","shareTimeline"],
        success: function () { },
        fail: function () {
            sdk._updateShareMenu();
        },
    });
};

//开启分享菜单
sdk._showShareMenu = function () {
    wx.showShareMenu({
        withShareTicket: true,
        success: function () { },
        fail: function () {
            sdk._showShareMenu();
        },
    });
};

// 监听系统分享
sdk._onShareAppMessage = function () {
    cc.log("初始化分享")
    wx.onShareAppMessage(() => {
        // 标记onHide之前的操作，此处为分享操作
        sdk._beforeOnHideAction = 1;

        let shareData = null;
        if (typeof this._onShareAppMessageData === 'function') {
            shareData = this._onShareAppMessageData();
        } else {
            shareData = this._onShareAppMessageData;
        }

        if (shareData) {
            let query = shareData.query || 'type=default';
            return {
                title: shareData.title,
                imageUrl: shareData.imageUrl,
                query: query + '&openId=' + this.user.getOpenId() + '&shareId=' + this._getShareId(),
                success: shareData.success,
                fail: shareData.fail
            };
        }
    });
};

/******************************************************** 群id ********************************************************/
/**
 * 设置微信群id
 */
sdk._shareTicket = '';
sdk.setGroupTicket = function (launch) {
    if (window.wx) {
        if (launch && launch.shareTicket) {
            this._shareTicket = launch.shareTicket || '';
        } else {
            this._shareTicket = wx.getLaunchOptionsSync().shareTicket || this._shareTicket;
        }
    }
};

/**
 * 获取微信群id
 */
sdk.getGroupTicket = function () {
    if (window.wx) {
        return this._shareTicket || wx.getLaunchOptionsSync().shareTicket;
    }
};

sdk.on('onShow', (launch) => {
    sdk.setGroupTicket(launch);
});

/******************************************************** 分享判断 ********************************************************/
/**
 * 检查是否是审核版本
 */
sdk.isCheckVersion = function () {
    // return !window.tt && (window.wx ? config.version === data.checkVersion : false);
    if (!data.constHost) {
        return false;
    }
    return config.version === data.checkVersion;
};

/**
 * 是否被ban
 */
sdk.isBan = function () {
    return false;
    // return data.isBan || data._isBan;
};

/**
 * 检查能违规操作
 */
sdk.canViolation = function () {
    return true
    // return window.tt ? true : (!this.isBan() && !sdk.isCheckVersion());
    // return !this.isBan() && !sdk.isCheckVersion();
};

/**
 * 获得关闭按钮状态
 * show - 是否显示关闭按钮
 * nothing - 点击按钮什么都不干
 * share - 点击按钮执行分享逻辑
 */
sdk.getCloseBtnState = function () {
    if (this.canViolation()) {
        let status = sdk.user.isNewUser() ? data.NEW_CLOSE_STATUS : data.OLD_CLOSE_STATUS;
        // 正常显示
        if (status == 0) {
            return { show: true, share: false, nothing: false };
            // 不显示
        } else if (status == 1) {
            return { show: false, share: false, nothing: false };
            // 显示，点击不响应
        } else if (status == 2) {
            return { show: true, share: false, nothing: true };
            // 显示，点击分享
        } else {
            return { show: true, share: true, nothing: false };
        }
    } else {
        // 正常显示
        return { show: true, share: false, nothing: false };
    }
};

/**
 * 获取复活相关状态信息
 * @returns {{ share, video, show, doShare, doNothing }} share分享 video看视频 show显示关闭按钮 share点击关闭按钮分享 nothing点击关闭按钮什么都不干
 */
sdk.getReviveState = function () {
    let { share, video } = this.getShareOrVideo();
    if (share) {
        let state = this.getCloseBtnState();
        return { share, video, state };
    } else {
        return {
            share, video,
            state: {
                show: true,
                share: false,
                nothing: false
            }
        };
    }
};

/**
 * 获取是（违规）分享还是看视频
 */
sdk.getShareOrVideo = function () {
    if (!sdk.canViolation()) {
        if (sdk.ad.canShowRewardedVideoAd()) {
            return { share: false, video: true };
        } else {
            return { share: false, video: false };
        }
    }

    if (this._shareNum < data.MUST_SHARE_TIMES) {
        return { share: true, video: false };
    } else {
        let shareWeight = sdk.user.isNewUser() ? data.NEW_SHARE_WEIGHT : data.OLD_SHARE_WEIGHT;

        if (Math.random() >= shareWeight && sdk.ad.canShowRewardedVideoAd()) {
            return { share: false, video: true };
        } else {
            return { share: true, video: false };
        }
    }
};

/**
 * 自动执行分享或视频逻辑
 * @param {{ shareTitle:String, shareImage:String, shareQuery:String, success:function, cancel:function, fail:function }} param0 
 */
sdk.doShareOrVideo = function ({ shareTitle = '[有人@你] 快来和我一起玩', shareImage, shareQuery = 'type=default', success, cancel, fail } = {}) {
    // 由系统判断到底干什么
    let { share, video } = sdk.getShareOrVideo();

    if (share) {
        // 强制分享
        sdk.shareAppMessage({
            title: shareTitle,
            imageUrl: shareImage,
            query: shareQuery,
            success: (res) => {
                success && success('share');
            },
            fail: (res) => {
                if (res && res.errMsg && res.errMsg.indexOf('fail cancel') == -1) {
                    success && success('share');
                } else {
                    cancel && cancel('share');
                }
            }
        }, true);
    } else if (video) {
        // 看视频
        sdk.ad.showRewardedVideoAd({
            onClose: (res) => {
                if (res) {
                    success && success('video');
                } else {
                    cancel && cancel('video');
                }
            },
            onError: (res) => {
                fail && fail('video');
            }
        });
    } else {
        fail && fail('video');
    }
};

/******************************************************** 用户登陆 ********************************************************/

const randomStr = function (len, type) {
    let r = '';
    let s = 'abcdefghijklmnopqrstuvwxyz1234567890';
    if (type == 1) {
        s = '1234567890';
    } else if (type == 2) {
        s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    }
    for (let i = 0; i < len; i++) {
        r += s.charAt(Math.floor(Math.random() * s.length));
    }
    return r;
};

sdk.user = {};
sdk.user._openid = '';
sdk.user._sessionKey = '';
sdk.user._newUser = null;

/**
 * 用户登陆
 * 
 * @returns {{openid, session_key}}
 */
sdk.user._logining = false;
sdk.user._loginCbs = [];
sdk.user.login = function (cb) {
    if (window.wx && wx.login && wx.checkSession) {
        this._loginCbs.push(cb);

        if (this._logining) {
            return;
        }

        this._logining = true;

        const login = () => {
            wx.login({
                success: ({ errMsg, code }) => {
                    if (code) {
                        // 调用登陆接口
                        sdk.http.get('register', { code }, (err, res) => {
                            if (!err && res && res.openid && res.session_key) {
                                sdk.storage.setDay('sdkUserlogin', res);
                                this._openid = res.openid;
                                this._sessionKey = res.session_key;
                            } else {
                                err = 'error';
                                res = {};
                            }

                            this._loginCbs.forEach((cb) => {
                                cb && cb(err, res);
                            });
                            this._loginCbs.length = 0;
                            this._logining = false;
                        });
                    } else {
                        this._loginCbs.forEach((cb) => {
                            cb && cb(errMsg, {});
                        });
                        this._loginCbs.length = 0;
                        this._logining = false;
                    }
                },
                fail: () => {
                    this._loginCbs.forEach((cb) => {
                        cb && cb('fail', {});
                    });
                    this._loginCbs.length = 0;
                    this._logining = false;
                }
            });
        };

        wx.checkSession({
            success: () => {
                let userInfo = sdk.storage.getDay('sdkUserlogin');
                if (userInfo && userInfo.openid) {
                    this._openid = userInfo.openid;
                    this._sessionKey = userInfo.session_key;
                    this._loginCbs.forEach((cb) => {
                        cb && cb(null, userInfo);
                    });
                    this._loginCbs.length = 0;
                    this._logining = false;
                } else {
                    login();
                }
            },
            fail: () => {
                login();
            }
        });
    } else {
        cb && cb(null, { openid: this.getOpenId(), session_key: this.getSessionKey() });
    }
};

/**
 * 增加分享次数
 */
sdk.user._addShareCount = function () {
    if (this._newUser !== false) {
        let count = sdk.storage.add('userShareCount') || 0;
        if (count > data.NEW_SHARE_TIMES) {
            sdk.storage.set('sdkOldUser', true);
            this._newUser = false;
        }
    }
};

/**
 * 判断是不是新用户
 * @returns {boolean} 
 */
sdk.user.isNewUser = function () {
    if (this._newUser === null) {
        this._newUser = !sdk.storage.get('sdkOldUser');
    }
    return this._newUser;
};

/**
 * 获取用户openid [登录之后使用真实的，没登录前使用假的]
 * @returns {string} 
 */
sdk.user.getOpenId = function () {
    // openid不为真时尝试读取缓存
    if (!this._openid) {
        let userInfo = sdk.storage.get('sdkUserlogin');
        if (userInfo && userInfo.data) {
            this._openid = userInfo.data.openid;
        }
    }

    // openid不为真时尝试读取缓存
    if (!this._openid) {
        this._openid = sdk.storage.get('sdkOpenid');
    }

    // 没有缓存时，创建一个缓存
    if (!this._openid) {
        this._openid = data.openid || randomStr(15);
        sdk.storage.set('sdkOpenid', this._openid);
    }

    return this._openid;
};

/**
 * 获取用户sessionKey [登录之后才会有值]
 * @returns {string} 
 */
sdk.user.getSessionKey = function () {
    // sessionKey不为真时尝试读取缓存
    if (!this._sessionKey) {
        let userInfo = sdk.storage.get('sdkUserlogin');
        if (userInfo && userInfo.data) {
            this._sessionKey = userInfo.data.session_key;
        }
    }

    return this._sessionKey;
};


/**
 * 获取真实的用户openid [如果没有则调用登录进行登录操作]
 * @returns {string} 
 */
sdk.user.getRealOpenId = function (cb) {
    let userInfo = sdk.storage.getDay('sdkUserlogin');
    if (userInfo && userInfo.openid) {
        this._openid = userInfo.openid;
        cb && cb(null, this._openid);
    } else {
        if (data.openid) {
            this._openid = data.openid;
            cb && cb(null, this._openid);
        } else {
            sdk.user.login((err, res) => {
                if (!err && res && res.openid) {
                    cb && cb(null, res.openid);
                } else {
                    cb && cb(true, null);
                }
            });
        }
    }
};

/**
 * 获取真实的用户sessionKey [如果没有则调用登录进行登录操作]
 * @returns {string} 
 */
sdk.user.getRealSessionKey = function (cb) {
    let userInfo = sdk.storage.getDay('sdkUserlogin');
    if (userInfo && userInfo.session_key) {
        this._sessionKey = userInfo.session_key;
        cb && cb(null, this._sessionKey);
    } else {
        sdk.user.login((err, res) => {
            if (!err && res && res.session_key) {
                cb && cb(null, res.session_key);
            } else {
                cb && cb(true, null);
            }
        });
    }
};

/**
 * 获取真实的用户openid和sessionKey [如果没有则调用登录进行登录操作]
 * @returns {string} 
 */
sdk.user.getRealOpenIdAndSessionKey = function (cb) {
    let userInfo = sdk.storage.getDay('sdkUserlogin');
    if (userInfo && userInfo.session_key && userInfo.openid) {
        this._openid = userInfo.openid;
        this._sessionKey = userInfo.session_key;
        cb && cb(null, {
            sessionKey: this._sessionKey,
            openid: this._openid
        });
    } else {
        sdk.user.login((err, res) => {
            if (!err && res && res.session_key && res.openid) {
                cb && cb(null, {
                    sessionKey: res.session_key,
                    openid: res.openid
                });
            } else {
                cb && cb(true, null);
            }
        });
    }
};

/******************************************************** 广告 ********************************************************/
sdk.ad = {};
sdk.ad._bannerAd = null;        //banner广告
sdk.ad._rewardedVideoAd = null; //激励视频广告
sdk.ad._interstitialAd = null;  //插屏广告
/******************************************************** 激励视频 ********************************************************/
/*
* 用法
* //判断当前能否播放视频广告
* if(sdk.ad.canShowRewardedVideoAd()){
*    // 做一些能播放广告的事情
*    sdk.ad.showRewardedVideoAd({
*        onClose: (res) => {
*            sdk.log(res ? "可以得到奖励" : "不能");
*        },
*        onError: () => {
*
*        }
*     });
* }
*
* 或者直接调用showRewardedVideoAd
* sdk.ad.showRewardedVideoAd({
*     onClose: (res) => {
*         sdk.log(res ? "可以得到奖励" : "不能");
*     },
*     onError: (res) => {
*         sdk.log(res === 1 ? "不支持" : "播放广告失败");
*     }
* });
*/

/**
 * 判断激励视频广告组件在当前客户端版本中是否有效
 */
sdk.ad.checkRewardedVideoAd = function () {
    return window.wx && wx.createRewardedVideoAd;
};

/**
 * 从微信拉取信息，更新是否可看视频状态
 */
sdk.ad._canShowRewardedVideoAd = false;
sdk.ad._changeCanShowRewardedVideoAd = function (timeout) {
    this._canShowRewardedVideoAd = false;
    if (typeof timeout === 'number' && timeout >= 0) {
        setTimeout(() => {
            this._changeCanShowRewardedVideoAd();
        }, timeout);
    } else {
        sdk.log('changeCanShowRewardedVideoAd');
        if (this.checkRewardedVideoAd() && this._rewardedVideoAd) {
            this._rewardedVideoAd.load()
                .then(() => {
                    this._canShowRewardedVideoAd = true;
                    sdk.log('canShowRewardedVideoAd');
                })
                .catch(() => {
                    this._canShowRewardedVideoAd = false;
                    sdk.log('canNotShowRewardedVideoAd1');
                });
        } else {
            this._canShowRewardedVideoAd = false;
            sdk.log('canNotShowRewardedVideoAd2');
        }
    }
};
/**
 * 检查能否播放视频广告，如果不能播放，则500毫秒后更新一次可播放状态，如果能播放，则关闭视频后的500毫秒后更新一次状态
 */
sdk.ad.canShowRewardedVideoAd = function () {
    if (this._canShowRewardedVideoAd) {
        return true;
    } else {
        this._changeCanShowRewardedVideoAd(500);
        return false;
    }
};

// 视频关闭回调
sdk.ad._rewardedVideoAdOnClose = null;
/**
 * 激励视频广告组件，组建默认是关闭的
 */
sdk.ad._initRewardedVideoAd = function () {
    if (this.checkRewardedVideoAd() && config.adUnitId && !this._rewardedVideoAd) {
        this._rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: config.adUnitId });

        // 监听激励视频广告加载事件
        this._rewardedVideoAd.onLoad((res) => {
            sdk.log('rewardedVideoAd onLoad', res);
        });

        // 监听激励视频广告关闭事件
        this._rewardedVideoAd.onClose(res => {
            sdk.log('rewardedVideoAd onClose', res);
            // 小于 2.1.0 的基础库版本，res 是一个 undefined
            if (res && res.isEnded || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                this._rewardedVideoAdOnClose && this._rewardedVideoAdOnClose(true);
            }
            else {
                // 播放中途退出，不下发游戏奖励
                this._rewardedVideoAdOnClose && this._rewardedVideoAdOnClose(false);
            }
            // 置空关闭回调
            this._rewardedVideoAdOnClose = null;
            // 500毫秒后刷新视频的可播放状态
            this._changeCanShowRewardedVideoAd(500);
            // 重新显示Banner广告
            this._showBannerAd();
        });

        // 监听激励视频错误事件
        this._rewardedVideoAd.onError((res) => {
            sdk.log('rewardedVideoAd onError', res);
        });

        // 更新可播放状态
        this._changeCanShowRewardedVideoAd();
    }
};

/**
 * 展示激励视频
 */
sdk.ad.showRewardedVideoAd = function ({ onShow, onError, onClose }) {
    if (this._rewardedVideoAd) {
        this._rewardedVideoAdOnClose = onClose;
        this._rewardedVideoAd.load()
            .then(() => {
                // // 标记onHide之前的操作，此处为播放视频操作
                sdk._beforeOnHideAction = 2;
                // 隐藏Banner广告
                // this._hideBannerAd();
                this._rewardedVideoAd.show();
                onShow && onShow();
            })
            .catch(err => {
                // 本次视频播放失败，更新可播放状态
                this._changeCanShowRewardedVideoAd(500);
                onError && onError(2);
            });
    } else {
        onError && onError(1);
    }
};

/**
 * 展示激励视频简易API
 */
sdk.ad.showRewardedVideoAdEasy = function (cb) {
    this.showRewardedVideoAd({
        onClose(res) {
            cb && cb(null, !!res);
        },
        onError(err) {
            cb && cb(err || 'error');
        }
    })
}

/******************************************************** banner视频 ********************************************************/

/**
 * 初始化banner
 */
sdk.ad._initBannerAd = function () {
    if (this._bannerAdShow && !this._bannerAd) {
        this.showBannerAd(this._bannerAdNodeRect, this._bannerAdNodeAnchor, this._bannerCollision);
    }
};

/**
 * 判断banner视频广告组件在当前客户端版本中是否有效
 */
sdk.ad.checkBannerAd = function () {
    return window.wx && wx.createBannerAd;
};
/**
 * 检查能否播放banner视频
 */
sdk.ad.canShowBannerAd = function () {
    return this.checkBannerAd();
};

// banner是否加载完成
sdk.ad._bannerAdLoad = false;
sdk.ad._bannerAdError = false;
// banner的实际宽高
sdk.ad._bannerAdSize = { width: 0, height: 0 };
// banner是否应该显示
sdk.ad._bannerAdShow = false;
// banner是否实际在在显示中
sdk.ad._bannerAdShowing = false;
// banner的定位信息
sdk.ad._bannerAdNodeRect = { x: 0, y: 0, width: 0, height: 0 };
// banner的锚点信息
sdk.ad._bannerAdNodeAnchor = { x: 0.5, y: 0.5 };
// 碰撞回调
sdk.ad._bannerCollision = null;

/**
 * baner派发的事件名称
 * 
 * bannerCreate     [私有] [创建banner资源阶段的事件，拉取资源成功或失败都会触发，参数为true代表加载成功，false代表加载失败]
 * bannerResize     [私有] [banner的大小改变时触发]
 * bannerLoad       [拉取banner资源成功时触发]
 * bannerShow       [播放banner成功时会触发]
 * bannerError      [拉取banner资源失败、播放banner资源失败时都会触发]
 * bannerDestroy    [销毁banner时触发]
 */

/**
 * 创建banner视频
 */
sdk.ad._createBannerAd = function ({ onLoad, onError, onResize } = {}) {
    if (this.checkBannerAd() && config.adUnitIdBanner) {

        if (this._bannerAd) {
            sdk.log('bannerCache');
            const banner = this._bannerAd;
            // 监听banner创建完成
            if (this._bannerAdLoad) {
                onLoad && onLoad();
            } else if (this._bannerAdError) {
                onError && onError();
            } else {
                sdk.once('bannerCreate', function (res) {
                    if (banner !== this._bannerAd) return;
                    res ? onLoad && onLoad() : onError && onError();
                }, this);
            }
            // 监听banner大小改变
            if (!this._bannerAdError) {
                if (this._bannerAdSize.width || this._bannerAdSize.height) {
                    onResize && onResize(this._bannerAdSize);
                } else {
                    sdk.once('bannerResize', function (res) {
                        if (banner !== this._bannerAd) return;
                        onResize && onResize(res);
                    }, this);
                }
            }
            return;
        }

        sdk.log('bannerCreate');

        // 创建banner视频组件
        const banner = this._bannerAd = wx.createBannerAd({
            adUnitId: config.adUnitIdBanner,
            style: {
                left: 0,
                top: 2000,
                width: 300,
            }
        });

        // 加载完成
        this._bannerAdLoad = false;
        this._bannerAd.onLoad((res) => {
            sdk.log('bannerLoad', res);
            if (this._bannerAd === banner) {
                this._bannerAdLoad = true;
                event.emit('bannerCreate', true);
                onLoad && onLoad();
            }
        });
        // 加载失败
        this._bannerAdError = false;
        this._bannerAd.onError && this._bannerAd.onError((res) => {
            sdk.log('bannerError', res);
            if (this._bannerAd === banner) {
                this._bannerAdError = true;
                event.emit('bannerCreate', false);
                onError && onError();
            }
        });
        // 大小变化
        this._bannerAd.onResize((res) => {
            sdk.log('bannerResize', res);
            if (this._bannerAd === banner) {
                const width = res.width;
                const height = res.height || (width * 9 / 16);

                // 记录banner大小
                this._bannerAdSize.width = width;
                this._bannerAdSize.height = height;

                event.emit('bannerResize', this._bannerAdSize);
                onResize && onResize(this._bannerAdSize);
            }
        });
    } else {
        sdk.error('无法创建banner');
        onError && onError();
    }
};

/**
 * 销毁banner视频
 */
sdk.ad._destroyBannerAd = function () {
    sdk.log('bannerDestroy');
    const bannerAd = this._bannerAd;

    this._bannerAd = null;
    this._bannerAdShow = false;
    this._bannerAdShowing = false;
    this._bannerAdLoad = false;
    this._bannerAdError = false;
    this._bannerAdSize = { width: 0, height: 0 };
    this._bannerCollision = null;
    event.emit('bannerDestroy');
    sdk.targetOff(this);

    if (bannerAd) {
        bannerAd.hide();
        bannerAd.destroy();
    }
};

/**
 * 根据节点设置banner的位置
 * @param {*} node 
 */
sdk.ad.setBannerAdPos = function (node) {
    sdk.log('bannerSetPos');
    if (this._bannerAd && this._bannerAdSize.width && this._bannerAdSize.height) {
        let btnRect = null;
        let anchorX = 0.5;
        let anchorY = 0.5;
        if (cc.Node.isNode(node)) {
            btnRect = node.getBoundingBoxToWorld();
            anchorX = node.anchorX;
            anchorY = node.anchorY;
        } else {
            btnRect = this._bannerAdNodeRect;
            anchorX = this._bannerAdNodeAnchor.x;
            anchorY = this._bannerAdNodeAnchor.y;
        }

        // 屏幕分辨率
        let frameSize = cc.view.getFrameSize();
        // 游戏实际分辨率
        let winSize = cc.winSize;

        // node位置，游戏分辨率下
        let nodeX = btnRect.xMin + anchorX * btnRect.width;
        let nodeY = btnRect.yMin + anchorY * btnRect.height;

        // 将node位置由游戏分辨率转成屏幕分辨率下
        let x = nodeX / winSize.width * frameSize.width;
        let y = (winSize.height - nodeY) / winSize.height * frameSize.height;

        // banner大小，屏幕分辨率下
        let bannerWidth = this._bannerAdSize.width || this._bannerAd.style.realWidth || this._bannerAd.style.width;
        let bannerHeight = this._bannerAdSize.height || this._bannerAd.style.realHeight || this._bannerAd.style.height || (bannerWidth * 9 / 16);

        // 计算最终结果前，进行碰撞测试，如果返回true(banner会和游戏UI产生碰撞)，则不改变banner位置(banner仍处于屏幕外，达到不显示的效果)
        if (this._bannerCollision) {
            // 将banner大小由屏幕分辨率转成游戏分辨率下
            let width = bannerWidth / frameSize.width * winSize.width;
            let height = bannerHeight / frameSize.height * winSize.height;

            if (this._bannerCollision(cc.rect(nodeX, nodeY, width, height))) {
                this._bannerAd.style.left = 0;
                this._bannerAd.style.top = 2000;
                return;
            }
        }

        let left = x - bannerWidth * anchorX;
        let top = y - bannerHeight * (1 - anchorY);

        this._bannerAd.style.left = left;
        this._bannerAd.style.top = top;
    }
};

/**
 * 展示banner视频
 * @param {cc.Node | cc.Rect} node          位置节点 [或者是包围盒]
 * @param {{x: number, y: number}} anchor   当node为包位置或围盒时有效，设置锚点
 * @param {Function} collision              碰撞测试，返回true不展示banner
 */
sdk.ad.showBannerAd = function (node, anchor, collision) {
    sdk.log('bannerShow');

    if (typeof anchor === 'function') {
        collision = anchor;
        anchor = null;
    }

    this._bannerCollision = collision || null;

    // 记录banner位置信息和锚点信息
    if (cc.Node.isNode(node)) {
        this._bannerAdNodeRect = node.getBoundingBoxToWorld();
        this._bannerAdNodeAnchor.x = node.anchorX;
        this._bannerAdNodeAnchor.y = node.anchorY;
    } else if (node) {
        this._bannerAdNodeRect = node;
        this._bannerAdNodeAnchor.x = anchor ? anchor.x : 0.5;
        this._bannerAdNodeAnchor.y = anchor ? anchor.y : 0.5;
    }

    if (this._bannerAdShow && !this._bannerAdShowing) {
        return;
    }
    // 标记banner显示
    this._bannerAdShow = true;

    // 创建banner
    this._createBannerAd({
        onLoad: () => {
            // 发射bannerLoad事件
            event.emit('bannerLoad');
            sdk.log('bannerOnLoad');
            if (this._bannerAdShow) {
                if (this._bannerAdShowing) {
                    setTimeout(() => {
                        sdk.log('banner缓存显示成功');
                        event.emit('bannerShow');
                    }, 1);
                } else {
                    this._bannerAd.show().then(() => {
                        this._bannerAdShowing = true;
                        sdk.log('banner广告显示成功');
                        event.emit('bannerShow');
                    }).catch(err => {
                        sdk.log('banner广告显示失败', err);
                        event.emit('bannerError', 'show');
                    })
                }
            }
        },
        onError: () => {
            event.emit('bannerError', 'load');
            sdk.log('bannerOnError');
        },
        onResize: () => {
            sdk.log('bannerOnResize');
            this.setBannerAdPos();
        }
    });
};

/**
 * 隐藏banner视频
 */
sdk.ad.hideBannerAd = function () {
    sdk.log('bannerHide');
    if (this._bannerAd && this._bannerAdShow) {
        this._destroyBannerAd();
        // 销毁banner时都预先创建一个备用，以便加快下次的显示速度
        this._createBannerAd({
            onLoad: () => {
                if (!this._bannerAdShow) this._bannerAd.show().then(() => {
                    this._bannerAdShowing = true;
                });
            },
            onError: () => {
                if (!this._bannerAdShow) this._destroyBannerAd();
            }
        });
    }
    this._bannerAdShow = false;
};

/**
 * 隐藏Banner广告
 */
sdk.ad._hideBannerAd = function () {
    if (this._bannerAd && this._bannerAdShow) {
        this._bannerAd.hide();
    }
    this._bannerAdShowing = false;
};

/**
 * 重新显示Banner广告
 */
sdk.ad._showBannerAd = function () {
    if (this._bannerAd && this._bannerAdShow && !this._bannerAdShowing) {
        this._bannerAd.show();
    }
    this._bannerAdShowing = true;
};

/******************************************************** 插屏广告 ********************************************************/

/**
 * 初始化banner
 */
sdk.ad._initInterstitialAd = function () {
    return true;
};

/**
 * 判断放插屏广告组件在当前客户端版本中是否有效
 */
sdk.ad.checkInterstitialAd = function () {
    return window.wx && wx.createInterstitialAd;
};
/**
 * 检查能否播放插屏广告
 */
sdk.ad.canShowInterstitialAd = function () {
    return this.checkInterstitialAd();
};

/**
 * 展示插屏广告
 */
sdk.ad.showInterstitialAd = function () {
    if (this.checkInterstitialAd()) {
        if (window.tt) {
            this._interstitialAd && this._interstitialAd.destroy();
            const interstitialAd = this._interstitialAd = tt.createInterstitialAd({
                adUnitId: config.adUnitIdInterstitial
            })

            interstitialAd && interstitialAd.load()
                .then(function () {
                    interstitialAd.show()
                        .then(function () {
                            event.emit('interstitialShow');
                            sdk.log('插屏广告显示成功');
                        })
                        .catch((err) => {
                            event.emit('interstitialError');
                            sdk.log('插屏广告显示失败', err);
                        })
                })
                .catch((err) => {
                    event.emit('interstitialError');
                    sdk.log('插屏广告显示失败', err);
                })
        } else {
            if (!this._interstitialAd) {
                this._interstitialAd = wx.createInterstitialAd({
                    adUnitId: config.adUnitIdInterstitial
                })
            }

            this._interstitialAd && this._interstitialAd.show()
                .then(function () {
                    event.emit('interstitialShow');
                    sdk.log('插屏广告显示成功');
                })
                .catch((err) => {
                    event.emit('interstitialError');
                    sdk.log('插屏广告显示失败', err);
                })
        }
    }
}

/******************************************************** 本地数据存储 ********************************************************/
const weekOfYear = function (curDate) {
    /*
     date1是当前日期
     date2是当年第一天
     d是当前日期是今年第多少天
     用d + 当前年的第一天的周差距的和在除以7就是本年第几周
     */
    curDate = curDate || new Date();
    var a = curDate.getFullYear();
    var b = curDate.getMonth() + 1;
    var c = curDate.getDate();

    var date1 = new Date(a, parseInt(b) - 1, c), date2 = new Date(a, 0, 1),
        d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
    return Math.ceil(
        (d + ((date2.getDay() + 1) - 1)) / 7
    );
};

const getUpdateTime = function () {
    const date = new Date();
    const year = date.getFullYear();
    const week = weekOfYear(date);
    return year + '' + week;
};

const getDayDate = function (curDate) {
    curDate = curDate || new Date();
    return curDate.toLocaleDateString();
};

sdk.storage = {};
sdk.storage._cache = {}
// 返回值为false代表调用失败
sdk.storage.set = function (key, value) {
    if (typeof key === 'string' && typeof value !== 'undefined') {
        try {
            let data = JSON.stringify(value);
            cc.sys.localStorage.setItem(key, data);
            // 设置缓存
            this._cache[key] = data;
            return true;
        } catch (err) {

        }
    } else {
        cc.error('error');
    }
    return false;
};

// 返回值为undefined代表调用失败
sdk.storage.get = function (key) {
    // 先读取缓存
    if (typeof this._cache[key] !== 'undefined') {
        return JSON.parse(this._cache[key]);
    }

    let result = null;
    try {
        let data = cc.sys.localStorage.getItem(key);
        if (data && typeof data === 'string') {
            // 设置缓存
            this._cache[key] = data;
            result = JSON.parse(data);
        } else if (data !== '' && data !== null) {
            result = undefined;
        }
    } catch (e) {
        result = undefined;
    }
    return result;
};

// 返回值为false代表调用失败
sdk.storage.add = function (key, value = 1) {
    let result = this.get(key);
    if (result !== undefined) {
        result = result || 0;
        result += value;
        if (this.set(key, result)) {
            return result;
        }
    }
    return false;
};


// 返回值为false代表调用失败
sdk.storage.del = function (key) {
    try {
        cc.sys.localStorage.removeItem(key);
        delete this._cache[key];
        return true;
    } catch (err) {
        return false;
    }
};

// 返回值为false代表调用失败
sdk.storage.clear = function () {
    try {
        cc.sys.localStorage.clear();
        cc.js.clear(this._cache);
        return true;
    } catch (err) {
        return false;
    }
};

/**
 * 设置本周数据 [返回值为false代表调用失败]
 * @param {*} key 
 * @param {*} value 
 * @param {Function} cb 当已存在本周的数据时，会根据cb的返回觉得是否存储，true代表存储
 */
sdk.storage.setWeek = function (key, value, cb) {
    let updateTime = getUpdateTime();

    if (cb) {
        let data = this.getWeek(key);
        if (data !== undefined) {
            if (data === null || cb(data, value)) {
                return this.set(key, {
                    data: value,
                    updateTime: updateTime
                });
            }
        }
    } else {
        return this.set(key, {
            data: value,
            updateTime: updateTime
        });
    }

    return false;
};

/**
 * 获取本周数据 [返回值为undefined代表调用失败]
 * @param {*} key 
 */
sdk.storage.getWeek = function (key) {
    let data = this.get(key);
    if (data && data.updateTime == getUpdateTime()) {
        return data.data;
    }
    return data && null;
};

/**
 * 设置本天数据 [返回值为false代表调用失败]
 * @param {*} key 
 * @param {*} value 
 * @param {Function} cb 当已存在本周的数据时，会根据cb的返回觉得是否存储，true代表存储
 */
sdk.storage.setDay = function (key, value, cb) {
    let updateTime = getDayDate();

    if (cb) {
        let data = this.getDay(key);
        if (data !== undefined) {
            if (data === null || cb(data, value)) {
                return this.set(key, {
                    data: value,
                    updateTime: updateTime
                });
            }
        }
    } else {
        return this.set(key, {
            data: value,
            updateTime: updateTime
        });
    }

    return false;
};

/**
 * 获取本天数据 [返回值为undefined代表调用失败]
 * @param {*} key 
 */
sdk.storage.getDay = function (key) {
    let data = this.get(key);
    if (data && data.updateTime == getDayDate()) {
        return data.data;
    }
    return data && null;
};
/******************************************************** http通信 ********************************************************/
var stringifyQueryString = function (params) {
    var qs = '';
    for (var i in params) {
        if (params[i] !== undefined) {
            qs += '&' + i + '=' + encodeURIComponent(params[i]);
        }
    }
    return qs.slice(1);
};

var http = {};

http.quest = function (option, callback) {
    var method = option.method;
    var url = '';
    var data = null;
    if (method === 'post') {
        url = option.url;
        data = option.data;
    } else if (option.data) {
        url = option.url + '?' + stringifyQueryString(option.data);
    } else {
        url = option.url;
    }

    var timeout = option.timeout || 0;

    var xhr = new XMLHttpRequest();
    (timeout > 0) && (xhr.timeout = timeout);
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 400) {
                var result = xhr.responseText;
                try { result = JSON.parse(xhr.responseText); } catch (e) { }
                callback && callback(null, result);
            } else {
                callback && callback('status: ' + xhr.status);
            }
            callback = null;
        }
    };
    xhr.open(method, url, true);
    if (method === 'post') {
        try {
            data = JSON.stringify(data);
        } catch (e) { }
    }
    xhr.send(data);

    xhr.ontimeout = function () {
        callback && callback('timeout');
        callback = null;
        sdk.log('%c连%c接%c超%c时 %s', 'color:red', 'color:orange', 'color:purple', 'color:green', url);
    };
    xhr.onerror = function () {
        callback && callback('error');
        callback = null;
        sdk.log('%c连%c接%c失%c败 %s', 'color:red', 'color:orange', 'color:purple', 'color:green', url);
    };
    xhr.onabort = function () {
        if (callback) {
            callback('abort');
            callback = null;
            sdk.log('%c连%c接%c终%c止 %s', 'color:red', 'color:orange', 'color:purple', 'color:green', url);
        }
    };

    if (timeout) {
        setTimeout(() => {
            xhr.onabort();
            xhr.abort();
        }, timeout);
    }
};
/**
 * http.get('login',function(){})
 * http.get({url:'login',data:{code:'asdi1239028sadadhjk213h'}},function(){})
 * 
 */
http.get = function (url, callback, verification) {
    var option = url.url ? url : { url: url };
    option.method = 'get';
    option.timeout = 5000;
    this.quest(option, function (err, res) {
        if (!err && verification) {
            err = verification(res) ? null : '检验错误';
        }
        callback && callback(err, res);
    });
};
/**
 * http.post('login',function(){})
 * http.post({url:'login',data:{code:'asdi1239028sadadhjk213h'}},function(){})
 */
http.post = function (url, callback, verification) {
    var option = url.url ? url : { url: url };
    option.method = 'post';
    option.timeout = 5000;
    this.quest(option, function (err, res) {
        if (!err && verification) {
            err = verification(res) ? null : '检验错误';
        }
        callback && callback(err, res);
    });
};

sdk.http = {};
sdk.http.get = function (cmd, data, cb, verification) {
    // 省略参数data的情况
    if (typeof data === 'function') {
        verification = cb;
        cb = data;
        data = null;
    }

    data = data || {};
    data.gameid = config.gameid || config.name;
    data.ver = config.version;
    data.ver = sdk.version;

    if (typeof cmd === 'string') {
        http.get({ url: config.constHost + cmd, data }, function (err, res) {
            cb && cb(err, res);
        }, verification);
    } else {
        http.get({ url: cmd.host + cmd.cmd, data }, function (err, res) {
            cb && cb(err, res);
        }, verification);
    }
};
sdk.http.post = function (cmd, data, cb, verification) {
    // 省略参数data的情况
    if (typeof data === 'function') {
        verification = cb;
        cb = data;
        data = null;
    }

    data = data || {};
    data.gameid = config.name;
    data.ver = config.version;
    data.ver = sdk.version;

    if (typeof cmd === 'string') {
        http.post({ url: config.constHost + cmd, data }, function (err, res) {
            cb && cb(err, res);
        }, verification);
    } else {
        http.post({ url: cmd.host + cmd.cmd, data }, function (err, res) {
            cb && cb(err, res);
        }, verification);
    }
};

/******************************************************** 加载配置 ********************************************************/
sdk.data = {};
const copyValue = function (obj, data) {
    for (const key in data) {
        if (data[key] && typeof data[key] === 'object' && !(data[key] instanceof Array)) {
            if (!obj[key] || typeof obj[key] !== 'object') {
                obj[key] = {};
            }
            copyValue(obj[key], data[key]);
        } else {
            obj[key] = data[key];
        }
    }
};

/**
 * 加载配置
 */
sdk.data._getConstTime = 0;
sdk.data._getConst = function (callback) {
    if (Date.now() - this._getConstTime < 300000) {
        return;
    }
    this._getConstTime = Date.now();

    const fun = (err, res) => {
        if (!err) {
            if (res) {
                err = res.errMsg;
                res = res.data;
            } else {
                err = 'error';
                res = null;
            }
        }

        sdk.log('cloud:config', err, res);

        // 获取到服务器配置数据
        if (err) {
            res = sdk.storage.getWeek('sdk_config');
            err = !res;
        } else {
            sdk.storage.setWeek('sdk_config', res);
        }

        if (!err) {
            copyValue(data, res);
        }

        let ipcheck = sdk.storage.getWeek('sdk_ipcheck');

        if (ipcheck) {
            data._isBan = data.banList ? !!data.banList.some(function (value) {
                return ipcheck.indexOf(value) >= 0;
            }) : false;

            callback && callback(data);
            this._onChangeCb.forEach((cb) => {
                cb(data);
            });
        } else {
            // 判断ip所在城市是否ban
            // https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?query=120.7.243.56&ie=utf8&oe=gbk&format=json&resource_id=6006
            http.get('https://pv.sohu.com/cityjson?ie=utf-8', (err, res) => {
                sdk.log('cityjson:ipcheck', err, res, (typeof res === 'string') && res.indexOf('廊坊'));

                if (err || typeof res !== 'string') {
                    data._isBan = true;
                } else {
                    sdk.storage.setWeek('sdk_ipcheck', res);

                    data._isBan = data.banList ? !!data.banList.some(function (value) {
                        return res.indexOf(value) >= 0;
                    }) : false;
                }

                callback && callback(data);
                this._onChangeCb.forEach((cb) => {
                    cb(data);
                });
            })
        }
    }

    (config.constHost ? sdk.http.get('config', fun) : sdk.cloud.callFunction('config', fun));
};

/**
 * 获取数据
 * @param {*} key 
 */
sdk.data.get = function (key) {
    if (key) {
        return data[key];
    }
    return data;
};

/**
 * 监听数据变化
 */
sdk.data._onChangeCb = [];
sdk.data.onChange = function (cb) {
    this._onChangeCb.push(cb);
    cb(data);
};

/******************************************************** 云开发 ********************************************************/

sdk.cloud = {};

sdk.cloud._initCloud = function () {
    if (this.checkCloud()) {
        wx.cloud.init({
            traceUser: true,
            env: config.cloudEnv
        })
    }
}

sdk.cloud.checkCloud = function () {
    return window.wx && wx.cloud && wx.cloud.init && wx.cloud.callFunction;
}

sdk.cloud.callFunction = function (name, data, cb) {
    //调用云函数
    if (!cb) {
        cb = data;
        data = undefined;
    }
    if (this.checkCloud()) {
        wx.cloud.callFunction({
            name: name,
            data: data,
            complete: res => {
                if (res && res.result) {
                    cb(null, res.result);
                } else {
                    cb(res ? res.errMsg : '调用cloud失败');
                }
            }
        })
    } else {
        cb('调用cloud失败');
    }
}

sdk.cloud.downloadFile = function(fileID, cb, config){
    if (this.checkCloud()) {
        wx.cloud.downloadFile({
            fileID,
            config,
          }).then(res => {
            // get temp file path
            console.log(res.tempFilePath)
            cb && cb(res.tempFilePath)
          }).catch(error => {
            // handle error
          })
    }
    
}

/******************************************************** 交叉推广 ********************************************************/
const rnd = function (floor, ceil) {
    if (ceil == null) {
        var ceil = floor;
        floor = 0;
    }
    return floor + Math.floor(Math.random() * (ceil - floor + 1));
};

const getRateI = function (arr) {
    var rArr = [arr[0]];
    for (var i = 1; i < arr.length; i++) {
        rArr[i] = rArr[i - 1] + arr[i];
    }
    var r = rnd(1, rArr[rArr.length - 1]);
    for (var i = 0; i < rArr.length; i++) {
        if (r <= rArr[i]) {
            return i;
        }
    }
};

sdk.extend = {};

/**
 * 能否显示推广
 */
sdk.extend.canShow = function () {
    return !window.tt && !sdk.isCheckVersion() && !!(data.ads && data.ads.length && (!data.banAds || !data.banAds.length || (data.banAds.indexOf(config.name) >= 0)));
    // return !sdk.isIOS() && !sdk.isCheckVersion() && !!(data.ads && data.ads.length && (!data.banAds || !data.banAds.length || (data.banAds.indexOf(config.name) >= 0)));
};

/**
 * 修改推广节点的图片
 * @param {*} node 
 * @param {*} url 
 */
sdk.extend._changeIcon = function (node, url) {
    if (url) {
        cc.loader.load(url, (err, tex) => {
            if (!err) {
                let sprite = node.getComponent(cc.Sprite);
                if (!sprite) {
                    sprite = node.addComponent(cc.Sprite);
                }
                if (sprite) {
                    sprite.spriteFrame = new cc.SpriteFrame(tex);
                } else {
                    sdk.error('交叉推广节点上没找到Sprite组件');
                }
            }
        });
    }
};
/**
 * 绑定推广节点的移动点击事件
 * @param {*} node 
 */
sdk.extend._setTouch = function (node) {
    // 监听交叉推广变化事件
    let canShowAd = false;
    // 监听推广节点点击事件
    node.on('touchend', function () {
        if (canShowAd) {
            sdk.extend.show();
            this.emit('showExtend');
        }
    }, node);
    node.on('touchstart', function () {
        canShowAd = true;
    }, node);
    // node.on('touchmove', function (event) {
    //     let y = event.getLocationY();
    //     if (canShowAd && Math.abs(y - event.getStartLocation().y) > 50) {
    //         canShowAd = false;
    //     }
    //     if (y > 50 && y < cc.winSize.height - 50) {
    //         node.y += event.getDeltaY();
    //     }
    // }, node);
};

/**
 * 监听推广图标变化(当返回值是null时，隐藏交叉推广图标)
 */
sdk.extend.bindNode = function (node) {
    node.active = false;
    this._setTouch(node);
    sdk.data.onChange(() => {
        if (this.canShow()) {
            for (let i = 0, len = data.ads.length; i < len; i++) {
                if (data.ads[i].name !== config.name) {
                    node.active = true;
                    this._changeIcon(node, data.adIcon || null);
                    return;
                }
            }
        }
        node.active = false;
    });
};

/**
 * 展示推广
 */
sdk.extend.show = function (onBack) {
    let ads = data.ads;

    let rateArr = [];
    for (let i = 0, len = ads.length; i < len; i++) {
        if (ads[i].name === config.name) {
            rateArr.push(0);
        } else {
            rateArr.push(ads[i].rate || 0);
        }
    }

    let index = getRateI(rateArr) || 0;
    let ad = ads[index];
    if (ad.type == 0) {
        // 标记onHide之前的操作，此处为跳转操作
        sdk._beforeOnHideAction = 3;
        // 显示二维码
        sdk.previewImage({
            current: ad.ad_url,
            urls: [ad.ad_url]
        });
        let date = 0;
        sdk.once('onHide', function (event) {
            date = Date.now();
        });
        if (onBack) {
            sdk.once('onShow', function (event) {
                if (event.scene === 1089) {
                    onBack(Date.now() - date);
                }
            });
        }
    } else {
        // 跳小程序
        sdk.navigateToMiniProgram({
            appId: ad.appid,
            path: ad.path,
            envVersion: ad.envVersion,
            success: function () {
                // 标记onHide之前的操作，此处为跳转操作
                sdk._beforeOnHideAction = 3;
                if (onBack) {
                    let date = Date.now();
                    sdk.once('onShow', function () {
                        onBack(Date.now() - date);
                    });
                }
            }
        });
    }
};

/**
 * 录屏
 */
sdk.recorder = {};
sdk.recorder._recorder = null;

sdk.recorder._onStart = null;
sdk.recorder._onPause = null;
sdk.recorder._onResume = null;
sdk.recorder._onStop = null;
sdk.recorder._onError = null;

sdk.recorder.checkRecorder = function () {
    return window.tt && tt.getGameRecorderManager;
}

sdk.recorder._init = function () {
    if (!this._recorder && this.checkRecorder()) {
        const recorder = this._recorder = tt.getGameRecorderManager();

        recorder.onStart(res => {
            this._onStart && this._onStart(res);
        });

        recorder.onPause(res => {
            this._onPause && this._onPause(res);
        });

        recorder.onResume(res => {
            this._onResume && this._onResume(res);
        });

        recorder.onStop(res => {
            this._onStop && this._onStop(res.videoPath);
        })

        recorder.onError(res => {
            if (this._onError) {
                this._onError(res);
            } else if (this._onStop) {
                this._onStop();
            }
        })
    }
    return this._recorder;
}

sdk.recorder.start = function ({ onStart, onPause, onResume, onStop, onError } = {}, duration = 120) {
    this._onStart = onStart;
    this._onPause = onPause;
    this._onResume = onResume;
    this._onStop = onStop;
    this._onError = onError;

    if (this.checkRecorder()) {
        this._init().start({ duration });
    }
}

sdk.recorder.pause = function () {
    if (this.checkRecorder()) {
        tt.getGameRecorderManager().pause();
    }
}

sdk.recorder.resume = function () {
    if (this.checkRecorder()) {
        tt.getGameRecorderManager().resume();
    }
}

sdk.recorder.stop = function () {
    if (this.checkRecorder()) {
        tt.getGameRecorderManager().stop();
    }
}

sdk.trace = {};

/**
 * 打点统计
 * @param {string} traceid      统计ID
 * @param {string} clientid     排重ID(一般为openid,调用sdk.user.getRealOpenId获取真正的openid)
 * @param {number} num          统计加多少数值
 */
sdk.trace.dot = function (traceid, clientid, num = 1) {
    sdk.http.get({ host: 'todo', cmd: 'dot' }, { traceid, clientid, num });
};

// 支付
sdk.pay = {};

/**
 * 检测支付接口的有效性
 */
sdk.pay.checkPay = function () {
    if (window.wx && wx.requestMidasPayment && !window.tt) {
        return true;
    }
    return false;
};

/**
 * 判断是否能进行支付操作
 */
sdk.pay.isCanPay = function () {
    if (!this.checkPay() || !config.payOfferId || (sdk.systemInfo.system && sdk.systemInfo.system.toUpperCase().indexOf('IOS') >= 0)) {
        return false;
    }
    return true;
};

/**
 * 购买操作
 * https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/payment.html
 * https://developers.weixin.qq.com/minigame/dev/api/midas-payment/wx.requestMidasPayment.html
 * @param {number} num 购买数量
 */
sdk.pay.buy = function (num, cb) {
    if (this.isCanPay()) {
        wx.requestMidasPayment({
            mode: 'game',
            offerId: config.payOfferId,     // 支付应用ID
            buyQuantity: num,               // 购买数量 10个1元
            currencyType: 'CNY',            // 人民币
            platform: 'android',            // 平台
            env: config.payEnv,             // 0是正式环境 1是测试环境
            zoneId: config.zoneId,
            success(res) {
                // 支付成功
                sdk.log('支付成功', num, res);
                cb && cb(null, '支付成功');
            },
            fail({ errMsg, errCode }) {
                // 支付失败
                sdk.log('支付失败', num, errMsg, errCode);
                cb && cb(errMsg || '支付失败', '支付失败');
            }
        });
    } else {
        sdk.error('[sdk] can not pay');
        cb && cb('不支持支付', '不支持支付');
    }
};

/**
 * 获取操作
 * https://developers.weixin.qq.com/minigame/dev/api/midasGetBalance.html
 */
sdk.pay.get = function (cb) {
    if (this.checkPay()) {
        sdk.user.getRealOpenIdAndSessionKey((err, res) => {
            if (err) {
                cb && cb('获取用户信息失败', '获取用户信息失败');
            } else {
                let url = {
                    host: 'todo',
                    cmd: 'midasGetBalance'
                };

                sdk.http.get(url, { openid: res.openid, session_key: res.sessionKey, isSandbox: config.payEnv }, function (err, res) {
                    cb && cb(err, res);
                }, function (res) {
                    return res && res.errcode == 0;
                });
            }
        });
    } else {
        sdk.error('can not get');
        cb && cb();
    }
};

/**
 * 赠送操作
 */
sdk.pay.give = function (num, cb) {
    if (this.checkPay()) {
        sdk.user.getRealOpenIdAndSessionKey((err, res) => {
            if (err) {
                cb && cb('获取用户信息失败', '获取用户信息失败');
            } else {
                let url = {
                    host: 'todo',
                    cmd: 'midasPresent'
                };

                sdk.http.get(url, { openid: res.openid, session_key: res.sessionKey, present_counts: num, isSandbox: config.payEnv }, function (err, res) {
                    cb && cb(err, res);
                }, function (res) {
                    return res && res.errcode == 0;
                });
            }
        });
    } else {
        sdk.error('can not give');
        cb && cb();
    }
};

/**
 * 减少操作
 */
sdk.pay.sub = function (num, cb) {
    if (this.checkPay()) {
        sdk.user.getRealOpenIdAndSessionKey((err, res) => {
            if (err) {
                cb && cb('获取用户信息失败', '获取用户信息失败');
            } else {
                let url = {
                    host: 'todo',
                    cmd: 'midasPay'
                };

                sdk.http.get(url, { openid: res.openid, session_key: res.sessionKey, amt: num, isSandbox: config.payEnv }, function (err, res) {
                    cb && cb(err, res);
                }, function (res) {
                    return res && res.errcode == 0;
                });
            }
        });
    } else {
        sdk.error('can not sub');
        cb && cb();
    }
};

/**
 * uuid
 */
function s4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function uuid() {
    return (s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4()) + '-' + Date.now();
}

/**
 * 借助第三方实现支付
 */
sdk.pay2 = {};

/**
 * 检测支付接口的有效性
 */
sdk.pay2.checkPay = function () {
    if (window.wx && wx.navigateToMiniProgram && !window.tt) {
        return true;
    }
    return false;
};

/**
 * 判断是否能进行支付操作
 */
sdk.pay2.isCanPay = function () {
    if (!this.checkPay() || sdk.isCheckVersion() || !sdk.canViolation() || (sdk.systemInfo.system && sdk.systemInfo.system.toUpperCase().indexOf('IOS') >= 0)) {
        return false;
    }
    return true;
};

/**
 * 支付
 */
sdk.pay2.pay = function (rmb, title, cb) {
    let order_id = uuid();
    let price = parseFloat(rmb).toFixed(2);
    wx.navigateToMiniProgram({
        appId: 'wx6c2423928b92ca14',
        path: 'pages/index/index',
        extraData: {
            'aid': '4173',
            'name': title || '用户充值',
            'pay_type': 'jsapi',
            'price': price,
            'order_id': order_id,
            'notify_url': 'https://abc.com/notify',
            'sign': cc.app.tool.hash.md5((title || '用户充值') + 'jsapi' + price + order_id + 'https://abc.com/notify' + 'c497f12b4a69428f8a92c8e991e0943d'),
        },
        //envVersion: 'develop',
        fail(res) {
            cb('取消支付');
        },
        success(res) {
            sdk.once('onShow', function (event) {
                event && event.referrerInfo && event.referrerInfo.extraData && (event.referrerInfo.extraData.status === 'success') ? cb(null, '支付成功') : cb('支付失败')
            })
        }
    });
}