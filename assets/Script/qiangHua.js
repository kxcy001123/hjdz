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
        // 炼器符
        slotPrefab: {
            default: null,
            type: cc.Prefab
        },
        goodImg: {
            type: cc.Sprite,
            default: null
        },
        mask: {
            default: null,
            type: cc.Sprite
        },
        goodImgFluxay2Material: {
            default: null,
            type: cc.Material,
        },
        lianqidengji: {
            default: null,
            type: cc.RichText
        },
        // 装备强化的背景
        particalSystem: {
            default: null,
            type: cc.ParticleSystem,
        },
        hongbaoSprite:{
            default: null,
            type: cc.Node,
        },
        hongbaoNode:{
            default: null,
            type: cc.Node,
        },
        hongbaoCount: {
            default: null,
            type: cc.Label,
        },
        zhuangbeiContent: {
            default: null,
            type: cc.ScrollView
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var self = this;
        this.hongbaoSprite.on('touchend', ()=>{
            window.MyAlert.show({
                alertString: `还差${50 - self.count}元即可提现`,
            })
        }, this);
    },

    show: function () {
        this.node.off('goodSelect', this.handleGoodSelect, this);
        this.node.on('goodSelect', this.handleGoodSelect,this);

        this.zhuangbeiContent.content.removeAllChildren();


        this.node.active = true;

        this.allZb = [];
        this.addZBInScroll();


        this.hongbao();

        this.showImg();

        this.node.emit('fade-in');

    },

    addZBInScroll: function(){

        var self = this;

        let curIdx = 0;

        let zbList = window.global.goods.filter(item=>{
            let goodId = item.goodId;
            goodId = goodId.split('****')[0];
            if(window.allGoods[goodId].type === 2){
                return true;
            }else{
                return false;
            }
        })

        let total = zbList.length;

        zbList.forEach((item, idx)=>{
            // 区分类型， 装备会有多个
            let goodId = item.goodId;

            goodId = goodId.split('****')[0];

            // 融合物品的基础属性与私有属性
            let _goodParams = {
                ...window.allGoods[goodId],
                ...item,
                selected: window.global.currentSelectedGood.goodId === item.goodId ? 1 : 0,
            }

            if(_goodParams.selected === 1){
                curIdx = idx;
            }



            // let timer = setInterval(function(){
                if(_goodParams.count > 0){
                    let heroSlot = self.addHeroSlot(_goodParams);

                     // 选中
                    if(_goodParams.selected === 1){
                        this.currentSelectedGood = heroSlot.getComponent('HeroSlot');
                    }

                    self.allZb.push(heroSlot);
                }   
               


                // clearInterval(timer)
            // }, idx* 40)
        })

        let maxScrollOffset = this.zhuangbeiContent.getMaxScrollOffset();

        this.zhuangbeiContent.scrollToOffset(cc.v2(maxScrollOffset.x * curIdx / total, 0), 0.5);
    },

    addHeroSlot: function (goodParams) {
        let good = cc.instantiate(this.slotPrefab);
        good.active = true;
        // 生成不同的物品
        good.getComponent('HeroSlot').refresh(goodParams);
        this.zhuangbeiContent.content.addChild(good);
        return good;
    },

    showImg: function(){
        if(window.global.currentSelectedGood && window.global.currentSelectedGood.img){
            let {
                img,
                atlasName
            } = window.global.currentSelectedGood;
            // 展示图片


            if(window.global.currentSelectedGood.goodId.startsWith( '2002')){
                this.goodImg.node.width = 300;
            }else{
                this.goodImg.node.width = 440;
            }

            var animation = cc.find('goodImg',this.node).getComponent(cc.Animation);
            if(atlasName && animation){
                cc.resources.load(`atlas/${atlasName}/${atlasName}`, cc.SpriteAtlas, (err, atlas) => {
                    var spriteFrames = atlas.getSpriteFrames();
                    var clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, spriteFrames.length);
                    clip.speed = 10 / spriteFrames.length;

                    clip.name = 'run';
                    clip.wrapMode = cc.WrapMode.Loop;
                    animation.addClip(clip);
                    animation.play('run');
                });
            }else if(img){
                cc.resources.load(img, cc.SpriteFrame, (err, spriteFrame) => {
                    this.goodImg.spriteFrame = spriteFrame;
                    animation.stop()

                });
            }

            let variant1 = cc.MaterialVariant.createWithBuiltin(cc.Material.BUILTIN_NAME.SPRITE);
            this.mask.setMaterial(0, variant1);

            this.updateImg();
            
        }
    },

    updateImg: function (){
        this.particalSystem.stopSystem();

        if(window.global.currentSelectedGood){
            let {
                qianghuaLvl
            } = window.global.currentSelectedGood;
    
            this.createHongbaoCount();
    
            if(qianghuaLvl < 1){
                let variant1 = cc.MaterialVariant.createWithBuiltin(cc.Material.BUILTIN_NAME.SPRITE);
                this.goodImg.setMaterial(0, variant1);
                this.lianqidengji.string = '';
                return;
            }
    
            let qianghuayanse = window.qianghuayanse[qianghuaLvl].color;
    
            this.lianqidengji.string = `<size=30><color=${qianghuayanse}>  炼器 + ${qianghuaLvl}</c></s>`
    
    
            this.goodImg.setMaterial(0, this.goodImgFluxay2Material);
    
            let fluxay2 = window.qianghuayanse[qianghuaLvl].fluxay2;
        
            Object.keys(fluxay2).forEach(item=>{
                this.goodImg.getMaterial(0).setProperty(item, fluxay2[item])
            });
    
    
            // 设置粒子系统颜色
            if(this.particalSystem && qianghuayanse){
                var color = cc.Color.WHITE;
    
    
                this.particalSystem.startColor = color.fromHEX(qianghuayanse);
                this.particalSystem.startColorVar = cc.Color.BLACK;
                this.particalSystem.endColor = color.fromHEX(qianghuayanse);
                this.particalSystem.endColorVar = cc.Color.BLACK;
                this.particalSystem.resetSystem();
    
            }
        }else{
            this.goodImg.spriteFrame = null;
            var animation = cc.find('goodImg',this.node).getComponent(cc.Animation);
            animation.stop()
        }
    },

    hongbao: function(){
        if(window.global.currentSelectedGood){
            let {
                goodId,
                pingfen
            } = window.global.currentSelectedGood;
            let id = goodId.split('****')[0];

            if(pingfen > 7000 && !window.global.IS_CHECK){
                this.hongbaoNode.active = true;
                cc.tween(this.hongbaoSprite).repeatForever(cc.tween().to(1, {
                    scale: 0.8
                }).to(1, {
                    scale: 1
                })).start()
            }else{
                this.hongbaoNode.active = false;
            }
        }
    },


    createHongbaoCount: function(){
        let {
            qianghuaLvl
        } = window.global.currentSelectedGood;
        let count = 0;
        if(qianghuaLvl <= 10){
            count = (Math.sin(qianghuaLvl / 10 * Math.PI / 4) * 50)
        }else{
            count = (Math.cos((20 - qianghuaLvl) / 10 * Math.PI / 4) * 50)
        }
        this.count = Number(count.toFixed(2));
        this.hongbaoCount.string = `${this.count}元`;
    },

    hide: function () {
        this.node.active = false;

        this.node.emit('fade-out');
    },


    handleGoodSelect: function (event){




        // 取消之前的选中
        let prevSelectedGood = this.currentSelectedGood;
        prevSelectedGood && prevSelectedGood.refresh({
            ...prevSelectedGood.goodParams,
            selected: 0,
        });
        // 选中当前的
        let _goodParams = {
            ...event.detail,
            selected: 1,
        }

        cc.log('强化page ：window.global.currentSelectedGood', window.global.currentSelectedGood)

        
        this.hongbao();

        this.showImg();

        this.currentSelectedGood = event.target.getComponent('HeroSlot');
        this.currentSelectedGood.refresh(_goodParams);
        event.stopPropagation();
    },

    // update (dt) {},
});
