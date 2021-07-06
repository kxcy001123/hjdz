// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var sdk = require('./sdk/sdk')

var hongyunfu = require("hongyunfu");
var qianghuashi = require("qianghuashi");
var wanbifu = require("wanbifu");

var qiangHua = require("qiangHua");
var coinFly = require("../Coin_fly_to_wallet/Coin_fly_to_wallet").default;

var BackPackUI = require("BackPackUI");

var zhuangbei = require('./allZhuangbei');


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
        // 炼器符
        qianghuashi: {
            default: null,
            type: qianghuashi
        },
        // 完璧符
        wanbifu: {
            default: null,
            type: wanbifu
        },
        // 鸿运符
        hongyunfu: {
            default: null,
            type: hongyunfu
        },

        // 查看
        viewBtn: {
            default: null,
            type: cc.Button,
        },
        // 强化页面组件， 用于更新图片
        qiangHua: {
            default: null,
            type: qiangHua
        },
        coinFly:{
            default: null,
            type: coinFly,
        },
        // 背包页面
        backPackUI: {
            default: null,
            type: BackPackUI
        },
        maskMaterial: {
            default: null,
            type: cc.Material,
        },
        maskGrayMaterial: {
            default: null,
            type: cc.Material,
        },
        mask: {
            default: null,
            type: cc.Sprite
        },
        

        leidian_bg: {
            default: null,
            type: cc.Node,
        },

        // 装备
        goodImg: {
            default: null,
            type: cc.Sprite,
        },
        // 进度条
        horizontalBar: {
            type: cc.ProgressBar,
            default: null
        },
        // 强化结果-失败
        qianghuajieguoShibai: {
            default: null,
            type: cc.Sprite,
        },
        // 强化结果-成功
        qianghuajieguoCG: {
            default: null,
            type: cc.Sprite,
        },
        // 关闭按钮
        closeBtn: {
            default: null,
            type: cc.Sprite,
        },

        // 属性提升
        propertyUpdate: {
            default: null,
            type: cc.Node,
        },

        failCount: {
            default: null,
            type: cc.Label,
        },

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.button = this.getComponent(cc.Button);

        this.button.node.on(cc.Node.EventType.TOUCH_END, ()=>{
            this.startLianqi()
        }, this)
    },
    // 开始炼器
    startLianqi(){

        cc.log('startLianqi: 开始炼器')

        this.horizontalBar.node.active = true;
        // this.guanghuanBg.node.active = true;

        if(this.leidian_bg){
            this.leidian_bg.active = true;   
        }

        // 按钮禁用
        this.disabledBtn();



        // this.mask.setMaterial(0, this.maskMaterial);

        // let goodImgX = this.goodImg.node.x;
        // let goodImgY = this.goodImg.node.y; 

        // cc.tween(this.goodImg.node).repeatForever(cc.tween(this.goodImg.node).to(0.05, {
        //     x: goodImgX-5,
        //     y: goodImgY-5,
        //     opacity: 120 
        // }).to(0.05, {
        //     x: goodImgX + 5,
        //     y: goodImgY + 5,
        //     opacity: 255 
        // })).start();

        

        
    },
    // 炼器结束
    completeLianqi(){
        cc.log('completeLianqi: 炼器结束')
        if(this.leidian_bg){
            this.leidian_bg.active = false;  
        }
        


        this.lianqijieguo();

        this.failCount.string = `连败次数: ${window.lianxushibai}`

        this.stopLianqiDonghua();

        this.updateImg();

        this.updateLianqicailiao();

        this.updateNodeStatus();
        this.enableBtn();
    },
    // 停止炼器动画
    stopLianqiDonghua: function(){
        cc.Tween.stopAllByTarget(this.goodImg.node);
    },
    // 更新炼器材料
    updateLianqicailiao: function(){



        if(this.qianghuashi.isUsed){
            cc.log('completeLianqi: 炼器结束: 减少一个炼器符')
            window.global.goods.find(item=>{
                return item.goodId === this.qianghuashi.goodId;
            }).count -= 1;
            this.qianghuashi.updateCount();
        };

        if(this.wanbifu.isUsed){
            cc.log('completeLianqi: 炼器结束: 减少一个完璧符')
            window.global.goods.find(item=>{
                return item.goodId === this.wanbifu.goodId;
            }).count -= 1;
            this.wanbifu.updateCount();

        };

        if(this.hongyunfu.isUsed){
            cc.log('completeLianqi: 炼器结束: 减少一个鸿运符')
            window.global.goods.find(item=>{
                return item.goodId === this.hongyunfu.goodId;
            }).count -= 1;
            this.hongyunfu.updateCount();
        };
    },

    // 炼器结果
    lianqijieguo: function (){
        let success = false;
        let _ = Math.random();

        let { qianghuaLvl } = window.global.currentSelectedGood;
        // 几率
        let rate = window.qianghuayanse[qianghuaLvl] ? window.qianghuayanse[qianghuaLvl].rate : 0.95;

        // 鸿运符
        if(this.hongyunfu.isUsed){
            rate*=1.2;
        }

        // 九九必成吗
        if(window.lianxushibai >= 9){
            rate *= 2
        }

        // 强化等级小于7 垫子不管用
        if(qianghuaLvl <= 7){
            if(_ < rate){
                success = true;
            }else{
                success = false;
            }
        }else{
            if(_ < rate * window.lianqijilv){
                success = true;
            }else{
                success = false;
            }
        }

        this.lianqires = success;
            
        if(success){
            this.lianqichenggong();
        }else{
            this.lianqishibai();
        }

        this.propertiesChange();

        window.global.syncBagToStorage();

    },

    // 炼器成功
    lianqichenggong: function(){
        cc.log('completeLianqi: 炼器结束: 炼器成功');

        // 执行金币动画
        if(window.global.currentSelectedGood.pingfen > 7000 && !window.global.IS_CHECK){
            this.coinFly.playAnim();
        }

        cc.resources.load('music/success', cc.AudioClip, null, function (err, clip) {
            if(window.global.soundOn){
                var audioID = cc.audioEngine.play(clip, false, 0.7);
            }

        });


        // this.guanghuanBg.node.active = true;
        let variant1 = cc.MaterialVariant.createWithBuiltin(cc.Material.BUILTIN_NAME.SPRITE);
        this.mask.setMaterial(0, variant1);
        window.global.currentSelectedGood.qianghuaLvl += 1;

        window.global.goods.find(item=>{
            return item.goodId === window.global.currentSelectedGood.goodId;
        }).qianghuaLvl += 1;

        let goodPerfab = this.qiangHua.allZb.find(item=>{
            return item.getComponent('HeroSlot').goodParams.goodId === window.global.currentSelectedGood.goodId
        }).getComponent('HeroSlot')
        goodPerfab.refresh({
            ...goodPerfab.goodParams,
            qianghuaLvl: window.global.currentSelectedGood.qianghuaLvl,
        })
        // 成功后垫子重置
        window.lianqijilv = 1.0;
        window.lianxushibai = 0;
    },
    // 炼器失败
    lianqishibai: function(){
        cc.log('completeLianqi: 炼器结束: 炼器失败');
        // this.guanghuanBg.node.active = false;

        cc.resources.load('music/fail', cc.AudioClip, null, function (err, clip) {
            if(window.global.soundOn){
                var audioID = cc.audioEngine.play(clip, false, 0.7);
            }

        });

        window.lianxushibai += 1;

        let { qianghuaLvl } = window.global.currentSelectedGood;
        
        if(qianghuaLvl >= 5){
            window.lianqijilv *= 1.05;
        }else if(qianghuaLvl >= 8){
            window.lianqijilv *= 1.1;
        }else if(qianghuaLvl >= 11){
            window.lianqijilv *= 1.15;
        }

        this.mask.setMaterial(0, this.maskGrayMaterial);

        if(this.wanbifu.isUsed){
            window.global.currentSelectedGood.qianghuaLvl -= 1;

            window.global.goods.find(item=>{
                return item.goodId === window.global.currentSelectedGood.goodId;
            }).qianghuaLvl -= 1;

            let goodPerfab = this.qiangHua.allZb.find(item=>{
                return item.getComponent('HeroSlot').goodParams.goodId === window.global.currentSelectedGood.goodId
            }).getComponent('HeroSlot')
            goodPerfab.refresh({
                ...goodPerfab.goodParams,
                qianghuaLvl: window.global.currentSelectedGood.qianghuaLvl,
            })

            // let timer = setTimeout(()=>{
                window.MyAlert.show({
                    alertString: `炼器失败，炼器等级减1`,
                })
                // clearTimeout(timer);
            // }, 2000)
            

        }else{
            

            // let timer = setTimeout(()=>{
                window.MyAlert.show({
                    alertString: `炼器失败，装备消失!`,
                    confirmCallback: this.lianqishibaiConfirm.bind(this),
                })
                // clearTimeout(timer);
            // }, 2000)

        }

    },

    // 炼器失败确定按钮
    lianqishibaiConfirm: function(){
        var self = this;
        let flag = Math.random() > 0.7;
        if(flag){
            console.log('分享/视频');

            setTimeout(()=>{
                self.onShare();
            }, 800)


        }else{
            console.log('碎了')
            self.zbBroke()
        }
        
    },
    // 装备真坏了
    zbBroke: function(){
        window.global.currentSelectedGood.qianghuaLvl = 0;

        window.global.goods.find(item=>{
            return item.goodId === window.global.currentSelectedGood.goodId;
        }).count = 0;
        // 找到失败的装备
        let goodPerfab = this.qiangHua.allZb.find(item=>{
            return item.getComponent('HeroSlot').goodParams.goodId === window.global.currentSelectedGood.goodId
        })
        // 清除失败的装备
        goodPerfab.removeFromParent();

        this.qiangHua.allZb = this.qiangHua.allZb.filter(item=>{
            return item.getComponent('HeroSlot').goodParams.goodId !== window.global.currentSelectedGood.goodId
        })

        let res = this.lvl2ZbFail();

        console.log("高级失败最后一个", res)

        if(res){
            return;
        }

        if(this.qiangHua.allZb.length === 0){
            this.qiangHua.hide();
            this.backPackUI.show();
        }else{
            let event = new cc.Event.EventCustom('goodSelect', true);
            let nextGoodParams = this.qiangHua.allZb[0].getComponent('HeroSlot').goodParams
            event.detail = nextGoodParams;
            window.global.currentSelectedGood = nextGoodParams;

            this.qiangHua.zhuangbeiContent.content.children[0].dispatchEvent( event );

            this.qiangHua.zhuangbeiContent.scrollToLeft(1);
        }
    },

    // 高级装备炼器失败
    lvl2ZbFail: function(){

        
        let gooid = window.global.currentSelectedGood.goodId.split('****')[0];

        if(zhuangbei.zhuangbeiLv2[gooid]){
            let lvl2Arr = window.global.goods.filter(item=>{
                let goodid = item.goodId.split('****')[0]
                return zhuangbei.zhuangbeiLv2[goodid] && zhuangbei.zhuangbeiLv2[goodid].count > 0;
            })
            if(lvl2Arr.length === 0){
                setTimeout(()=>{
                    window.MyAlert.show({
                        alertString: `高级装备全部破坏\n返回主页，点击【领取装备】随机获得顶级装备`,
                        confirmCallback: ()=>{
                            this.qiangHua.hide();
                        },
                    })
                }, 800)
                
                return true
            }
        }else{

        }

        return false;

    },


    // 更新强化页面图片
    updateImg: function(){
        this.qiangHua.updateImg();
    },

    // 更新一些节点状态
    updateNodeStatus: function(){
        this.horizontalBar.node.active = false;
        // this.guanghuanBg.node.scaleX = 2;
    },

    // 禁用按钮
    disabledBtn: function (){
        this.button.interactable = false;
        this.button.node.active = false;

        this.qianghuashi.lianqiBtn.interactable = false;
        this.wanbifu.wanbiBtn.interactable = false;
        this.hongyunfu.hongyunBtn.interactable = false;
        this.closeBtn.node.active = false;
        this.viewBtn.interactable = false;

    },
    enableBtn: function(){
        this.button.node.active = true;

        this.qianghuashi.lianqiBtn.interactable = true;
        this.wanbifu.wanbiBtn.interactable = true;
        this.hongyunfu.hongyunBtn.interactable = true;
        this.closeBtn.node.active = true;
        this.viewBtn.interactable = true;

    },

    propertiesChange: function(){
        
        var self = this;

        
        self.propertyUpdate.removeAllChildren();

        let {
            wuligongji,
            wulifangyu,
            mofagongji,
            mofafangyu,
            baoji,
            qianghuaLvl,
            fujia
           } =  window.global.currentSelectedGood;

        let color = '';
        let sign = '';

        if(this.lianqires){
            color = new cc.Color(0,255,0,255);
            sign = '+';
            
        }else{
            color = new cc.Color(255,0,0,255);
            sign = '-';
        }

        [wuligongji, wulifangyu, mofagongji, mofafangyu, baoji].forEach((item)=>{
            if(item){
                let labelTextNode = new cc.Node();
                let labelText = labelTextNode.addComponent(cc.Label);
                labelText.lineHeight = 28;
                labelText.fontSize = 24;
                labelText.string = `${item.desc} ${sign} ${item.qianghua}`
                labelText.node.color = color;
                self.propertyUpdate.addChild(labelTextNode)
            }
        });

        if(fujia){
            fujia.forEach(item=>{
                let labelTextNode = new cc.Node();
                let labelText = labelTextNode.addComponent(cc.Label);
                labelText.lineHeight = 28;
                labelText.fontSize = 24;
                labelText.string = `${item.desc} ${sign} ${item.qianghua}%`
                labelText.node.color = color;
                self.propertyUpdate.addChild(labelTextNode)
            })
        }

        self.propertyUpdate.active = true;
        self.propertyUpdate.opacity = 255;

        cc.tween(self.propertyUpdate).to(4, {
            opacity: 0
        }).start();
    },

    onShare (){

        var self = this;

        let shareFlag = Math.random() > 0.5;

        let alertString = '';

        if(shareFlag){
            alertString = '分享好友，获取神秘力量恢复损坏装备\n邀请朋友一起九九必成领红包'
        }else{
            alertString = '观看视频，获取神秘力量恢复损坏装备\n邀请朋友一起九九必成领红包'
        }

        window.MyAlert.show({
            alertString: alertString,
            needCancel: true,
            cancelText: '取消',
            cancelCallback: function(){
                self.zbBroke();
            }.bind(self),
            confirmCallback: function(){

                if(shareFlag){
                    let shareinfo = [
                        `@好兄弟,增幅失败，求帮忙啊`,
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

    shareSuccess(){

    },

    videoSuccess(res){
        if(res){
            this.shareSuccess();
        }else{
            this.zbBroke();
        }
    }
    // update (dt) {},
});
