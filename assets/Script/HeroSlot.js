const getRandomInt = function (min, max) {
    var ratio = Math.random();
    return min + Math.floor((max - min) * ratio);
};

cc.Class({
    extends: cc.Component,

    properties: {
        // sfAttributes: {
        //     default: [],
        //     type: cc.SpriteFrame
        // },
        // sfRanks: {
        //     default: [],
        //     type: cc.SpriteFrame
        // },
        // sfHeroes: {
        //     default: [],
        //     type: cc.SpriteFrame
        // },
        sfBorders: {
            default: [], // 0 材料 1 符  2 装备
            type: cc.SpriteFrame
        },
        // labelLevel: {
        //     default: null,
        //     type: cc.Label
        // },
        spHero: {
            default: null,
            type: cc.Sprite
        },
        // spRank: {
        //     default: null,
        //     type: cc.Sprite
        // },
        // spAttribute: {
        //     default: null,
        //     type: cc.Sprite
        // },
        spBorder: {
            default: null,
            type: cc.Sprite
        },
        // spStars: {
        //     default: [],
        //     type: cc.Sprite
        // },
        count: {
            default: null,
            type: cc.Label
        },
        growInnerMaterial: {
            default: null,
            type: cc.Material,
        },
        goodImgFluxay2Material: {
            default: null,
            type: cc.Material,
        },
        iconBg: {
            default: null,
            type: cc.Sprite
        },
        qianghualvlLable: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    // onLoad: function(){

    // },

    start: function () {
        // this.refresh();
        cc.tween(this.iconBg.node).repeatForever(cc.tween(this.iconBg.node).to(1.5, {
            scale: 0.8,
        }).to(1.5, {
            scale: 1.5
        })).start()
    },
    /**
     * name:  物品名称
     * type: 0, // 0 材料 1 符  2 装备
     * count: 20, // 数量
     * img: '', // 图片 
     * qianghuaLvl: 1, // 强化等级
     * guanzhuLvL: 1, // 灌注等级
     * desc: '材料物品描述', // 物品描述
     * selected: 0, // 是否选中
     * @param {*} goodParams 
     */
    refresh: function (goodParams) {
        if(goodParams === this.goodParams){
            return;
        }

        this.goodParams = goodParams;
        let {
            type,
            count,
            img,
            qianghuaLvl,
            guanzhuLvL,
            desc,
            selected,
            lvl,
            atlasName
        } = goodParams;
        // 
        this.spBorder.spriteFrame = this.sfBorders[selected || 0];
        // 非装备赋值数量
        if(type !== 2){
            this.count.string = count;
            if(count ===0 ){
                this.count.string = '';
            }
        }
        // 点击事件
        this.node.off(cc.Node.EventType.TOUCH_END, this.handleCLick, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.handleCLick, this)
        

        if(type === 0 || type === 1){
            cc.resources.load(img, cc.SpriteFrame, (err, spriteFrame) => {
                this.spHero.spriteFrame = spriteFrame;
    
                if(type === 0 && lvl){
    
                    cc.resources.load(`img/cailiao_bg_${lvl}`, cc.SpriteFrame, (err, spriteFrame) => {
                        this.iconBg.spriteFrame = spriteFrame;
                    });
    
                }
    
            });
        }

        if(type === 2){
            if(qianghuaLvl > 0){
                this.qianghualvlLable.string = `+${qianghuaLvl}`
            }
            if(atlasName){
                cc.resources.load(`atlas/${atlasName}/${atlasName}`, cc.SpriteAtlas, (err, atlas) => {
                    var spriteFrames = atlas.getSpriteFrames();
                    this.spHero.spriteFrame = spriteFrames[Math.floor(spriteFrames.length / 2)];
                    let qianghuayanse = '#fff';
                    try {
                        qianghuayanse = window.qianghuayanse[qianghuaLvl].color;
                        if(window.qianghuayanse[qianghuaLvl]){
                            this.spHero.setMaterial(0, this.goodImgFluxay2Material);
                
                            let fluxay2 = window.qianghuayanse[qianghuaLvl].fluxay2;
                
                            Object.keys(fluxay2).forEach(item=>{
                                this.spHero.getMaterial(0).setProperty(item, fluxay2[item])
                            })
                        }else{
                            
                        }
                    } catch (error) {
                        let variant1 = cc.MaterialVariant.createWithBuiltin(cc.Material.BUILTIN_NAME.SPRITE);
                        this.spHero.setMaterial(0, variant1);
                    }
                });
            }else if(img){
                cc.resources.load(img, cc.SpriteFrame, (err, spriteFrame) => {
                    this.spHero.spriteFrame = spriteFrame;        
                    // 强化颜色
                    let qianghuayanse = '#fff';
                    try {
                        qianghuayanse = window.qianghuayanse[qianghuaLvl].color;
                        if(window.qianghuayanse[qianghuaLvl]){
                            this.spHero.setMaterial(0, this.goodImgFluxay2Material);
                
                            let fluxay2 = window.qianghuayanse[qianghuaLvl].fluxay2;
                
                            Object.keys(fluxay2).forEach(item=>{
                                this.spHero.getMaterial(0).setProperty(item, fluxay2[item])
                            })
                        }else{
                            
                        }
                    } catch (error) {
                        let variant1 = cc.MaterialVariant.createWithBuiltin(cc.Material.BUILTIN_NAME.SPRITE);
                        this.spHero.setMaterial(0, variant1);
                    }
        
        
                });
            }
            
        }


    },

    handleCLick: function (){
        if(window.global.currentSelectedGood === this.goodParams){
            window.global.currentSelectedGood = null;
        }else{
            window.global.currentSelectedGood = this.goodParams;
        }
        var self = this;

        cc.resources.load('music/zhuangbei_click', cc.AudioClip, null, function (err, clip) {
            if(window.global.soundOn){
                self.audioID = cc.audioEngine.play(clip, false, 1);
            }
        });

        let event = new cc.Event.EventCustom('goodSelect', true);
        event.detail = this.goodParams;
        this.node.dispatchEvent( event );
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
