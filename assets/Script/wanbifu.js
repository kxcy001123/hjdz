// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var sdk = require('./sdk/sdk');


var capture = require('./common/07_capture_texture/capture_to_wechat')

cc.Class({
    extends:  cc.Component,

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
        capture: {
            type: capture,
            default: null,
        },
        count: {
            default: null,
            type: cc.Label,
        },
        wanbiBtn: {
            default: null,
            type: cc.Button,
        },
        wanbiImg: {
            default: null,
            type: cc.Sprite,
        },
        btnText: {
            default: null,
            type: cc.Label,
        },
        mask: {
            default: null,
            type: cc.Sprite
        },
        goodId: '1002',
        isUsed: false,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    
    start () {
        
    },

    onEnable(){
        this.updateCount();
    },

    updateCount(){
        this.btnText.string = '添加';
        this.isUsed = false;

        let lianqifuItem = window.global.goods.find(item=>{
            return item.goodId === this.goodId;
        });
        
        this.wanbiImg.spriteFrame = null;

        if(!lianqifuItem){
            this.lianqifuCount = 0;
        }else{
            this.lianqifuCount = lianqifuItem.count;
        }

        let good = window.allGoods[this.goodId];

        this.count.string = `${good.name}(${this.lianqifuCount})`
    },

    onAdd () {
        let good = window.allGoods[this.goodId];

        var self = this;

        if(this.btnText.string === '删除'){
            this.wanbiImg.spriteFrame = null;
            this.btnText.string = '添加';
            this.isUsed = false;

            return;
        }

        if(this.lianqifuCount > 0){

            let variant1 = cc.MaterialVariant.createWithBuiltin(cc.Material.BUILTIN_NAME.SPRITE);
            this.mask.setMaterial(0, variant1);

            // 展示图片
            cc.resources.load(good.img, cc.SpriteFrame, (err, spriteFrame) => {
                this.wanbiImg.spriteFrame = spriteFrame;
            });
            this.btnText.string = '删除';
            this.isUsed = true;

        }else{
            this.isUsed = false;

            var self = this;

            let shareFlag = Math.random() > 0.5;

            this.shareFlag = shareFlag;

            window.MyAlert.show({
                alertString: `${good.name}不足，与好友分享快乐，更可以获取奖励`,
                confirmCallback: self.onShare.bind(this),
                needCancel: true,
            })
            cc.log(`${good.name}不足`)
        }
    },

    onShare (){

        var self = this;

        if(this.shareFlag){
            let {
                img,
                qianghuaLvl
            } = window.global.currentSelectedGood;
    
    
            let shareinfo = [
                `九九必成增幅大法!`,
                `十万火急,急需一个完璧符强化装备,求助`,
                `你忍心看我的装备碎掉吗?求帮忙上${Number(qianghuaLvl) + 1}`,
                `+31的路上，需要你鼎力相助，谢谢！！！`,
                `已经强化+${qianghuaLvl},我想看看装备+31的特效，求帮忙`,
                `我已经强化+${qianghuaLvl},来试试你的水平吧~`,
            ];
    
            let ran = Math.floor(Math.random() * shareinfo.length);
            let extra = !window.global.IS_CHECK ? '强化装备，最高提现50元' : '';
            
            
            cc.resources.load(img,  (err, spriteFrame) => {
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

        

        
    },
    videoSuccess(res){
        if(res){
            this.shareSuccess();
        }
    },
    shareSuccess (){
        var self = this;
        let tmpCount = 5;
        // 是否已经有这个物品了，
        let _ = window.global.goods.find(item=>item.goodId === self.goodId);
        if(_){
            _.count += tmpCount
        }else{
            let new_ = {
                goodId: self.goodId,
                count: tmpCount, // 数量
            };
            window.global.goods.push(new_);
        }
        self.updateCount();
        window.global.syncBagToStorage();

    }

    // update (dt) {},
});
