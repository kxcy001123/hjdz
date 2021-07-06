// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
        cancelBtn: {
            default: null,
            type: cc.Button,
        },
        cancelText: {
            default: null,
            type: cc.Label,
        },
        confirmBtn: {
            default: null,
            type: cc.Button,
        },
        conformText: {
            default: null,
            type: cc.Label,
        },
        alertContentLabel: {
            default: null,
            type: cc.Label,
        },
        titleImg: {
            default: null,
            type: cc.Sprite,
        },
        extraNode:{
            default: null,
            type: cc.Node,
        },
        slotPrefab: {
            default: null,
            type: cc.Prefab
        },
        closeBtn: {
            default: null,
            type: cc.Sprite,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.createWxGameBanner();
        this.createWxGameIcon();
    },

    start () {
        window.MyAlert = this;
    },
    _cancelCallback: function(){
        this.cancelCallback && this.cancelCallback();
        this.hide();
    },
    _confirmCallback: function(){
        this.hide();
        this.confirmCallback && this.confirmCallback();
    },
    show: function (options) {
        this.cancelBtn.node.active = false;
        this.confirmBtn.node.active = false;
        this.alertContentLabel.node.active = false;
        this.titleImg.node.active = false;
        this.extraNode.active = false;

        this.closeBtn.node.active = false;

        this.extraNode.removeAllChildren();
        var self = this;
        
        cc.resources.load('music/popup', cc.AudioClip, null, function (err, clip) {
            if(window.global.soundOn){
                self.audioID = cc.audioEngine.play(clip, false, 1);
            }  
        });

        this.node.active = true;
        let {
            needCancel,
            needConfirm = true,
            cancelCallback,
            confirmCallback,
            alertString,
            cancelText,
            conformText,
            type = 'alert',
            extra,
            showCloseBtn = false,
        } = options;

        if(showCloseBtn){
            this.closeBtn.node.active = true;
            this.closeBtn.node.on('touchend', this.hide, this);
        }

        if(needCancel){
            this.cancelBtn.node.active = true;
            this.cancelCallback = cancelCallback;
            this.cancelBtn.node.on('touchend', this._cancelCallback, this);
        }

        if(cancelText){
            this.cancelText.string = cancelText;
        }

        if(needConfirm){
            this.confirmBtn.node.active = true;
            this.confirmCallback = confirmCallback;
            this.confirmBtn.node.on('touchend', this._confirmCallback, this);
        }

        if(conformText){
            this.conformText.string = conformText;
        }

        if(alertString){
            this.alertContentLabel.node.active = true;
            this.alertContentLabel.string = alertString;
        }

        if(type === 'get'){
            this.titleImg.node.active = true;
            if(extra){
                this.extraNode.active = true;
                let good = cc.instantiate(this.slotPrefab);
                good.active = true;
                
                // 生成不同的物品
                good.getComponent('HeroSlot').refresh({
                    count: 0,
                    ...extra,
                });


                this.extraNode.addChild(good);
            }
           

        }

        this.showAd();

        this.node.emit('fade-in');
    },
    hide: function () {
        this.node.emit('fade-out');
        if(this.bannerAd){
            this.bannerAd.hide()
        }
        if(this.iconAd){
            this.iconAd.hide()
        }
    },


    showAd(){
        if(this.bannerAd){
            this.bannerAd.show().catch((err) => {
                console.error(err)
            })
        }
        if(this.iconAd){
            this.iconAd.load().then(() => {
                this.iconAd.show()
            }).catch((err) => {
                console.error(err)
            })
        }
    },

    createWxGameIcon(){

        if(this.iconAd){
            return;
        }

        // 定义推荐位
        let iconAd = null

        this.iconAd = iconAd;

        // 创建推荐位实例，提前初始化
        if (window.wx && wx.createGameIcon) {
            let {screenHeight, screenWidth} =  wx.getSystemInfoSync();
            this.iconAd = iconAd = wx.createGameIcon({
                adUnitId: 'PBgAAIlQMRxJqv5I',
                count: 6,
                style:[
                    {
                        appNameHidden: true,
                        left: 0,
                        top:  screenHeight / 2 ,
                    },
                    {
                        appNameHidden: true,
                        left: 0,
                        top:  screenHeight / 2 - 50,
                    },
                    {
                        appNameHidden: true,
                        left: 0,
                        top:  screenHeight / 2 - 100,
                    },
                    {
                        appNameHidden: true,
                        left: screenWidth - 70,
                        top:  screenHeight / 2,
                    },
                    {
                        appNameHidden: true,
                        left: screenWidth - 70,
                        top:  screenHeight / 2 - 50,
                    },
                    {
                        appNameHidden: true,
                        left: screenWidth - 70,
                        top:  screenHeight / 2 - 100,
                    }

                ]
            })
        }

        // 在合适的场景显示推荐位
        // err.errCode返回1004时表示当前没有适合推荐的内容，建议游戏做兼容，在返回该错误码时展示其他内容
        // if (iconAd) {
        //     iconAd.load().then(() => {
        //         iconAd.show()
        //     }).catch((err) => {
        //         console.error(err)
        //     })
        // }
    
        

    },
    createWxGameBanner(){

        if(this.bannerAd){
            return;
        }

        // 定义推荐位
        let bannerAd = null;

        this.bannerAd = bannerAd;


        // 创建推荐位实例，提前初始化
        if (window.wx && wx.createGameBanner) {
            let {screenHeight, screenWidth} =  wx.getSystemInfoSync();

            this.bannerAd = bannerAd = wx.createGameBanner({
            adUnitId: 'PBgAAIlQMRxGNfWw',
            style:{
                left: screenWidth / 2 ,
                top: 5,
                with: 300
            }
        })
        }

        // 在适合的场景显示推荐位
        // err.errCode返回1004时表示当前没有适合推荐的内容，建议游戏做兼容，在返回该错误码时展示其他内容
        // if (bannerAd) {
        //     bannerAd.show().catch((err) => {
        //         console.error(err)
        //     })
        // }
    },

    // update (dt) {},
});
