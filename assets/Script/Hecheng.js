// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


var BackPackUI = require("BackPackUI");


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
        hechengGh: {
            type: cc.Sprite,
            default: null
        },
        hechengImg: {
            type: cc.Sprite,
            default: null
        },
        total: {
            type: cc.Label,
            default: null
        },
        cancel: {
            type: cc.Button,
            default: null
        },
        confirm: {
            type: cc.Button,
            default: null
        },
        // 背包页面
        backPackUI: {
            default: null,
            type: BackPackUI
        },
        particle: {
            type: cc.ParticleSystem,
            default: null
        },

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    show: function () {
        this.node.active = true;
        this.cancel.interactable = true;
        this.confirm.interactable = true;


        if(window.global.currentSelectedGood && window.global.currentSelectedGood.img){
            let {
                img,
                count,
            } = window.global.currentSelectedGood;
            // 展示图片
            cc.resources.load(img, cc.SpriteFrame, (err, spriteFrame) => {
                this.hechengImg.spriteFrame = spriteFrame;
            });
            
            if(count < 5){
                this.confirm.interactable = false;
            }

            this.total.string = `总数:${count}`;

            this.node.emit('fade-in');
        }
    },



    startHecheng: function(){

        if(this.hechengIng){
            return ;
        }
        var self = this;
        
        cc.resources.load('music/hecheng', cc.AudioClip, null, function (err, clip) {
            if(window.global.soundOn){
                self.audioID = cc.audioEngine.play(clip, false, 1);
            }
        });

        this.particle.resetSystem();


        this.cancel.interactable = false;

        this.hechengIng = true;

        cc.tween(this.hechengGh.node).to(5, {
            angle: 3600, 
        },{
            easing: 'quadInOut'
        })
        .call(()=>{
            this.particle.stopSystem();

            this.cancel.interactable = true;
            this.hechengGh.node.angle = 0;
            // 合成剩余数量
            let shengyuShuliang = window.global.currentSelectedGood.count % 5
            // 合成得到物品数量
            let upgradedCount =  Math.floor(window.global.currentSelectedGood.count / 5);

            let good = window.global.goods.find(item=>item.goodId === window.global.currentSelectedGood.goodId);

            good.count = shengyuShuliang;


            let upgrateId = window.global.currentSelectedGood.upgrateId;
            // 是否有这个物品了
            let _ = window.global.goods.find(item=>item.goodId === upgrateId);
            if(_){
                _.count += upgradedCount;
                this.backPackUI.refreshGood(_);

            }else{
                let new_ = {
                    goodId: upgrateId,
                    count: upgradedCount, // 数量
                };
                window.global.goods.push(new_);
                this.backPackUI.refreshGood(new_);

            }
            this.hechengIng = false;


            this.backPackUI.refreshGood(good);
            this.backPackUI.hideBtns();
            this.backPackUI.selectedInfo.active = false;

            this.hide();

            cc.log(`合成成功`);
            window.MyAlert.show({
                type: 'get',
                alertString: `${upgradedCount}份${window.allGoods[upgrateId].name}\n可用来打造装备`,
                confirmCallback: this.onShare,
                extra: window.allGoods[upgrateId]
            })

            window.global.syncBagToStorage();


        })
        .start();
    },

    hide: function () {
        cc.Tween.stopAllByTarget(this.hechengGh.node);
        cc.audioEngine.stop(this.audioID)

        var self = this;
        self.hechengImg.spriteFrame = null;
        this.node.emit('fade-out');
    },
    // update (dt) {},
});
