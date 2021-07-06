// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html



var sdk = require('./sdk/sdk')
var zhuangbei = require('./allZhuangbei');

var utils = require('./utils/utils')

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
            userInfoBtn: {
                type: cc.Node,
                default: null
            },
            progressBar: {
                type: cc.ProgressBar,
                default: null
            },
            particleSystem: {
                type: cc.ParticleSystem,
                default: null
            },
            circleLoading: {
                type:  cc.Sprite,
                default: null
            },
            zengsongid: {
                default: ''
            },
            todayZS: {
                default: null,
                type: cc.Label
            },
            btn: {
                default: null,
                type: cc.Sprite
            },
            desc: {
                default: null,
                type: cc.Label
            },
            hongbao: {
                default: null,
                type: cc.Sprite
            },
            hongbao2: {
                default: null,
                type: cc.Sprite
            }
    },

    // LIFE-CYCLE CALLBACKS:

    hongbaoAction(){
        var action = cc.tween().to(1, {scaleX: -1,}, {easing: 'sineOut'}).to(1, {scaleX: 0}, {easing: 'sineOut'});
        return action
    },

    onLoad () {
        // 推荐
        this.createWxGameIcon();


        var self = this;
        sdk.cloud._initCloud();
        sdk.cloud.callFunction('config', (error, res)=>{
            if(res){
                window.global.IS_CHECK = res.IS_CHECK;
            }else{
            }

            if(window.global.IS_CHECK){
                self.desc.string = '试试能够强化+31吗？？';
            }else{
                self.createWxGameBanner();
                self.desc.string = '增幅至+20,领取最多50元红包!!!';
            }
            self.desc.node.active = true;
            cc.tween(this.hongbao.node).repeatForever(self.hongbaoAction()).start()
            cc.tween(this.hongbao2.node).repeatForever(self.hongbaoAction()).start()

        })



        let date = utils.getDayDate();
        this.zeongsong();

        var self = this;
        sdk.init();

        cc.resources.load('music/pipa_bgm1', cc.AudioClip, null, function (err, clip) {
            if(window.global.soundOn){
                self.audioID = cc.audioEngine.playMusic(clip, true);
                cc.audioEngine.setMusicVolume(0.5);
            }
        });

        // let bgmFileID = 'cloud://dazao-1-2gwvp5dg514972c1.6461-dazao-1-2gwvp5dg514972c1-1305312903/bgm/pipa_bgm1.mp3'
        // sdk.cloud.downloadFile(bgmFileID, (filePath)=>{

        //     cc.assetManager.loadRemote(filePath,(err, audioClip) => {
        //         if(err){
        //             console.log('loadRemote bgm error', err)
        //         }else{
        //             self.audioID = cc.audioEngine.playMusic(audioClip, true);
        //             cc.audioEngine.setMusicVolume(0.5);
        //         }
        //     })
        // })

        if(sdk.storage.get(`${date}-zengsong`)){
            this.todayZS.string = '今日已领取';
            cc.resources.load('img/kaishiqianghua', cc.SpriteFrame,  (err, spriteFrame)=>{
                self.btn.spriteFrame = spriteFrame;
            })
        }else{
            cc.resources.load('img/mashanglingqu', cc.SpriteFrame,  (err, spriteFrame)=>{
                self.btn.spriteFrame = spriteFrame;
            })
        }
        cc.director.preloadScene("Scene/helloworld", function (completedCount, total ) {
            let progressTxt = self.progressBar.node.getChildByName("progressTxt").getComponent(cc.Label);
            progressTxt.string = `${completedCount}/${total}`;
            self.progressBar.progress = completedCount/ total;

        }, (error)=>{
            if(error){
                console.log('scene preloaded error', error)
            }
        });
        cc.resources.load('img/mashanglingqu',cc.SpriteFrame,res=>{
            // let _ = sdk.createUserInfoButton({
            //     style: this.userInfoBtn,
            //     image: cc.SpriteFrame
            // }, (res)=>{
            //     console.log('res', res)
            //     window.global.userInfo = res.userInfo || {};
            //     self.changeScene();
                
            // });

            // if(!_){
                self.userInfoBtn.on('touchend', ()=>{
                    // 切换场景
                    window.global.userInfo =  {};

                    console.log('scense entry disabled', self.iconAd, self.bannerAd)

                    if(self.iconAd){
                        self.iconAd.destroy()
                    }
            
                    if(self.bannerAd){
                        self.bannerAd.destroy()
                    }
            

                    self.changeScene();

                }, this);
            // }

        })

        
    },

    changeScene(){
        var self = this;
        let date = utils.getDayDate();

        if(!sdk.storage.get(`${date}-zengsong`)){
            let _new = zhuangbei.initZhuangbeiLv2(window.global.todayZeongsongId)

            window.global.goods.unshift(_new);
        }

        sdk.storage.set(`${date}-zengsong`, window.global.todayZeongsongId)
        window.global.syncBagToStorage();


        

        self.circleLoading.node.active = true;
        cc.tween(self.circleLoading.node).to(10,{
            angle: 3600
        }).repeatForever()
        .start()
         // 切换场景
         var scenceTransition = self.getComponent("ScenceTransition");
         if(scenceTransition){
             scenceTransition.transition();
         }


    },
    // handleUserInfoBtnTap: (res)=>{
    //     console.log('res', res)
    //     window.global.userInfo = res.userInfo || {};
    //     console.log(this);
    //     var scenceTransition = this.getComponent("ScenceTransition");
    //     if(scenceTransition){
    //         scenceTransition.transition();
    //     }
    // },

    zeongsong () {
        let date = utils.getDayDate();

        let zsid = sdk.storage.get(`${date}-zengsong`)
        if(zsid){
            this.zengsongid = zsid;
        }else{
            let lvl2ZB = zhuangbei.zhuangbeiLv2;

            let arr = Object.keys(lvl2ZB);
            let random= Math.floor(Math.random() * arr.length);
    
            let _zb = lvl2ZB[arr[random]];
            if(_zb && _zb.atlasName){
                this.zengsongid = arr[random];
            }
    
            
        }
        window.global.todayZeongsongId = this.zengsongid;

    },


    createWxGameIcon(){

        console.log('entry createWxGameIcon')

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
        if (this.iconAd) {
            this.iconAd.load().then(() => {
                this.iconAd.show()
                
            }).catch((err) => {
                console.error(err)
            })
        }
    
        

    },

    createWxGameBanner(){
        console.log('entry createWxGameBanner')

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
        if (bannerAd) {
            bannerAd.show().catch((err) => {
                console.error(err)
            })
        }
    },


    // update (dt) {},
});
