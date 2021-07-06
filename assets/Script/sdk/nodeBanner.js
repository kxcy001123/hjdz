const sdk = require('sdk');

cc.Class({
    extends: cc.Component,

    properties: {
        autoRefresh: false,
        refreshInterval: {
            default: 30,
            visible: function () {
                return this.autoRefresh;
            },
        },
        collision: false,
        collisionNode: {
            default: null,
            type: cc.Node,
            visible: function () {
                return this.collision;
            },
            tooltip: 'banner会与该节点进行碰撞测试，如果产生碰撞，则不显示banner'
        }
    },

    onLoad() {
        this.updateSize();
    },

    updateSize() {
        if (this.getComponent(cc.Layout)) {
            this.getComponent(cc.Layout).updateLayout();
        }
        let size = this.getSize();

        this.node.width = size.width;
        this.node.height = size.height;
    },

    getSize() {
        // 屏幕尺寸
        const frameSize = cc.view.getFrameSize();
        // 实际分辨率
        const winSize = cc.winSize;
        const bannerAd = sdk.ad._bannerAd;
        if (window.tt) {
            const realWidth = bannerAd ? (bannerAd.style.width || 400) : 400;
            const realHeight = (realWidth * 9 / 16);
            return cc.size(realWidth / frameSize.width * winSize.width, realHeight / frameSize.height * winSize.height);
        } else {
            const realWidth = bannerAd ? (bannerAd.style.realWeight || 400) : 400;
            const realHeight = bannerAd ? (bannerAd.style.realHeight || 150) : 150;
            return cc.size(realWidth / frameSize.width * winSize.width, realHeight / frameSize.height * winSize.height);
        }
    },

    _bindPos() {
        sdk.ad.setBannerAdPos(this.node);
    },

    _refreshBanner() {
        this._hideBanner();
        this._showBanner();
    },

    _showBanner() {
        // sdk.once('bannerShow', function () { }, this);

        // 定时刷新banner
        if (this.autoRefresh) {
            this.scheduleOnce(this._refreshBanner, this.refreshInterval);
        }

        // 监听banner【加载失败】或【显示失败】
        const time = Date.now();
        sdk.once('bannerError', function () {
            this._hideBanner();
            if (Date.now() - time < 2000) {
                this.scheduleOnce(function () {
                    this._showBanner();
                }, 2);
            } else {
                this._showBanner();
            }
        }, this);

        // banner与UI节点的碰撞检测
        if (this.collision && this.collisionNode) {
            sdk.ad.showBannerAd(this.node, (bannerRect) => {
                const box = this.collisionNode.getBoundingBoxToWorld();
                const result = bannerRect.intersects(box) || bannerRect.containsRect(box) || box.containsRect(bannerRect);
                result && this.autoRefresh && this.unschedule(this._refreshBanner);
                return result;
            });
        } else {
            sdk.ad.showBannerAd(this.node);
        }
    },

    _hideBanner() {
        sdk.targetOff(this);
        this.unscheduleAllCallbacks();
        sdk.ad.hideBannerAd();
    },

    _onFocus() {
        this.scheduleOnce(this._showBanner);
        this.node.on('position-changed', this._bindPos, this);
        this.node.on('anchor-changed', this._bindPos, this);
        this.node.on('size-changed', this._bindPos, this);
    },

    _onLostFocus() {
        this._hideBanner();
        this.node.off('position-changed', this._bindPos, this);
        this.node.off('anchor-changed', this._bindPos, this);
        this.node.off('size-changed', this._bindPos, this);
    },

    onEnable() {
        console.log('nodebanner onEnable')
        // const com = cc.app.lib.cocos.node.getComponentInParent(this.node, 'baseView');
        // if (com) {
        //     this.scheduleOnce(function () {
        //         com.node.on('onFocus', this._onFocus, this);
        //         com.node.on('onLostFocus', this._onLostFocus, this);
        //     })
        // }
        this._onFocus();
    },

    onDisable() {
        // const com = cc.app.lib.cocos.node.getComponentInParent(this.node, 'baseView');
        // if (com) {
        //     com.node.off('onFocus', this._onFocus, this);
        //     com.node.off('onLostFocus', this._onLostFocus, this);
        // }
        this._onLostFocus();
    }
});
