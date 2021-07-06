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
            goodid: {
                default: '',
            },
            iconBg: {
                default: null,
                type: cc.Sprite
            },
            cailiaoname: {
                type: cc.Label,
                default: null,
            },
            sprite: {
                default: null,
                type: cc.Sprite
            }
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable () {
        var self = this;

        let spriteImg = window.allGoods[self.goodid].img
        cc.resources.load(spriteImg, cc.SpriteFrame, (err, spriteFrame) => {
            self.sprite.spriteFrame = spriteFrame;
        });

        let name = '';
        let usedId = self.goodid;

        let _ = window.global.goods.filter(item=>{
            return item.goodId.startsWith(self.goodid) && item.count >=3
        }).map((_item)=>{
            name = window.allGoods[_item.goodId].name;
            return window.allGoods[_item.goodId].lvl;
        });

        let _color = new cc.Color(255,255,255,255)

        if(_.length > 0){
            let maxLvl = Math.max(..._);
            if(maxLvl>1){
                usedId+= `${maxLvl}`
            }
            let count = window.global.goods.find(_item=>_item.goodId===usedId).count;

            self.cailiaoname.string = `${name}\n(${count})`;
            self.cailiaoname.node.color = cc.Color.fromHEX(_color, '#F7FB28');
            
            let variant1 = cc.MaterialVariant.createWithBuiltin(cc.Material.BUILTIN_NAME.SPRITE);
            self.sprite.setMaterial(0, variant1);
            cc.resources.load(`img/cailiao_bg_${maxLvl}`, cc.SpriteFrame, (err, spriteFrame) => {
                self.iconBg.spriteFrame = spriteFrame;
            });
        }else{
            let variant1 = cc.MaterialVariant.createWithBuiltin(cc.Material.BUILTIN_NAME.GRAY_SPRITE);
            self.sprite.setMaterial(0, variant1);

            let _ = window.global.goods.find(_item=>_item.goodId===usedId);

            let count = _ ? _.count: 0;

            self.cailiaoname.string = `数量不足\n(${count})`;
            self.cailiaoname.node.color = cc.Color.fromHEX(_color, '#808080');;
            self.iconBg.spriteFrame = '';

        }
    },

    start () {
        cc.tween(this.iconBg.node).repeatForever(cc.tween(this.iconBg.node).to(1.5, {
            scale: 0.5,
        }).to(1.5, {
            scale: 1.2
        })).start()
    },

    // update (dt) {},
});
