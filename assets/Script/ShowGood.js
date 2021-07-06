// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var sdk = require('./sdk/sdk');

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
        goodImg: {
            type: cc.Sprite,
            default: null
        },
        goodInfo: {
            type: cc.RichText,
            default: null,
        },
        sunCount: {
            type: cc.Node,
            default: null,
        },
        sunPrefab: {
            default: null,
            type: cc.Prefab
        },
        goodImgFluxay2Material: {
            default: null,
            type: cc.Material,
        },
        longtou: {
            type: cc.Sprite,
            default: null
        },
        // 装备强化的背景
        particalSystem: {
            default: null,
            type: cc.ParticleSystem,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    show: function () {
        this.node.active = true;


        

        if(window.global.currentSelectedGood && window.global.currentSelectedGood.img){
            let {
                img,
                atlasName
            } = window.global.currentSelectedGood;
            // 展示图片
            if(window.global.currentSelectedGood.goodId.startsWith( '2002')){
                this.longtou.node.active = false;
                this.goodImg.node.width = 300;
            }else{
                this.longtou.node.active = true;
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

            
            
            this.createSun();

            let infoStr = '';
            infoStr += this.createGoodName();
            // 评分
            infoStr += this.createpingfen();
            // 打造者
            infoStr += this.creatorName();
            // 基础属性
            let jichushuxing = this.createjichushuxing();
            infoStr += jichushuxing
            // 附加
            infoStr += this.createfujia();
            this.goodInfo.string = infoStr;

            // 装备故事

            
            let timer = setTimeout(()=>{
                infoStr += this.createStory();
                this.goodInfo.string = infoStr;
                clearTimeout(timer);
            }, 2500);



            this.node.emit('fade-in');
        }
        var self = this;

        cc.resources.load('music/long', cc.AudioClip, null, function (err, clip) {
            if(window.global.currentSelectedGood.goodId.startsWith( '2002')){
                return;
            }
            if(window.global.soundOn){
                self.audioID = cc.audioEngine.play(clip, false, 1);
            }
        });

        cc.tween(this.longtou.node).to(1.5, {
            y: 800
        },{ easing: 'sineOutIn'}).start();
    },
    /**
     * 生成代表炼器等级的太阳
     */
    createSun: function(){
        let {
            qianghuaLvl
        } = window.global.currentSelectedGood;
        
        if(qianghuaLvl < 1){
            return
        }

        var self = this;

        // 强化颜色
        let qianghuayanse = window.qianghuayanse[qianghuaLvl].color;

        let _ = new cc.Color(255,255,255,60)

        for (let i = 0; i < qianghuaLvl; ++i) {
            let sun = cc.instantiate(this.sunPrefab);
            
            let timer = setInterval(function(){
                self.sunCount.addChild(sun);
                sun.color = cc.Color.fromHEX(_, qianghuayanse);

                clearInterval(timer)
            }, i* 100)
        }

        
    },
    /**
     * 装备名称 + 炼器等级 + 装备图片的shader值
     */
    createGoodName: function(){
        let {
            name,
            lvl,
            qianghuaLvl
        } = window.global.currentSelectedGood;
        // 名字
        let {
            color,
            desc,
        } = window.zhuangbeilvl[lvl];
        // 强化颜色
        let qianghuayanse = '#fff';
        try {
            qianghuayanse = window.qianghuayanse[qianghuaLvl].color;


                 // 设置粒子系统颜色
            if(this.particalSystem && qianghuayanse){
                var _color = cc.Color.WHITE;


                this.particalSystem.startColor = _color.fromHEX(qianghuayanse);
                this.particalSystem.startColorVar = cc.Color.BLACK;
                this.particalSystem.endColor = _color.fromHEX(qianghuayanse);
                this.particalSystem.endColorVar = cc.Color.BLACK;
                this.particalSystem.resetSystem();

            }

            if(window.qianghuayanse[qianghuaLvl]){
                this.goodImg.setMaterial(0, this.goodImgFluxay2Material);
    
                let fluxay2 = window.qianghuayanse[qianghuaLvl].fluxay2;
    
                Object.keys(fluxay2).forEach(item=>{
                    this.goodImg.getMaterial(0).setProperty(item, fluxay2[item])
                })
            }else{
                
            }
        } catch (error) {
            let variant1 = cc.MaterialVariant.createWithBuiltin(cc.Material.BUILTIN_NAME.SPRITE);
            this.goodImg.setMaterial(0, variant1);
        }

        

        

        let str = `<size=26><color=${color}>${desc}的${name}</c><color=${qianghuayanse || '#fff'}>  ${qianghuaLvl > 0 ? '炼器+' + qianghuaLvl : ''}</c></s>\n`
        return str
    },
    /**
     * 打造者名称
     */
    creatorName: function(){
        let {
            creatorName
        } = window.global.currentSelectedGood;

        let str = `<size=22><color=#C36303>${creatorName || '无名氏'}打造</c></s><br/><br/>`;
        return str;
    },
    /**
     * 装备评分
     */
    createpingfen: function(){
        let {
            pingfen,
            qianghuaLvl,
            lvl,
            qianghuaxishu,
            fujia
        } = window.global.currentSelectedGood;
        // 装备前缀系数
        if(window.zhuangbeilvl[lvl]){
            pingfen*= window.zhuangbeilvl[lvl].pingfenxishu;
        }
        // 强化系数
        if(qianghuaLvl){
            pingfen*=Math.pow(qianghuaxishu, qianghuaLvl)
        }
        // 附加属性系数
        if(fujia){
            fujia.forEach(item=>{
                pingfen*=window.allfujia.wuligongji3.pingfenxishu;
            })
        }

        this.pinfenstr = Math.floor(pingfen);

        return `<size=22><color=#C36303>装备评分: ${Math.floor(pingfen)}</c></s>\n`
    },
    /**
     * 生成基础属性
     */
    createjichushuxing: function() {
        let {
            wuligongji,
            wulifangyu,
            mofagongji,
            mofafangyu,
            baoji,
            qianghuaLvl,
        } = window.global.currentSelectedGood;
        let str = '';

        let fujiacolor = '#FFFF00'

        if(wuligongji){
            str += `物理攻击力: ${wuligongji.min} - ${wuligongji.max}`;
            if(qianghuaLvl){
                str += `<color=${fujiacolor}>  +  ${wuligongji.qianghua * qianghuaLvl}</c>`
            }
            str += `\n`;
        }
        
        if(wulifangyu){
            str += `物理防御力: ${wulifangyu.min} - ${wulifangyu.max}`;
            if(qianghuaLvl){
                str += `<color=${fujiacolor}>  +  ${wulifangyu.qianghua * qianghuaLvl}</c>`
            }
            str += `\n`;
        }

        if(mofagongji){
            str += `魔法攻击力: ${mofagongji.min} - ${mofagongji.max}`;
            if(qianghuaLvl){
                str += `<color=${fujiacolor}>  +  ${mofagongji.qianghua * qianghuaLvl}</c>`
            }
            str += `\n`;
        }

        if(mofafangyu){
            str += `魔法防御力: ${mofafangyu.min} - ${mofafangyu.max}`;
            if(qianghuaLvl){
                str += `<color=${fujiacolor}>  +  ${mofafangyu.qianghua * qianghuaLvl}</c>`
            }
            str += `\n`;
        }

        if(baoji){
            str += `暴击: ${baoji.min}% - ${baoji.max}%`;
            if(qianghuaLvl){
                str += `<color=${fujiacolor}>  +  ${Math.floor(baoji.qianghua * qianghuaLvl)}%</c>`
            }
            str += `\n`;
        }

        return `${str}\n`;
    },
    /**
     * 附加属性
     */
    createfujia: function(){
        let {
            fujia,
            qianghuaLvl
        } = window.global.currentSelectedGood;

        let fujiacolor = '#FFFF00'


        let str = '';
        if(fujia){
            fujia.forEach(item=>{
                console.log('qianghua', item)
                str += `<color=	#00FF00>${item.desc}  + ${item.value}%</c>`;
                if(qianghuaLvl && item.qianghua){
                    str += `<color=${fujiacolor}>  +  ${(item.qianghua * qianghuaLvl).toFixed(3)}%</c>`
                }
                str += `\n`;
            })
        }

        return str;
    },


    createStory: function(){

        let str = '\n——————————————\n\n';
        let {
            detailStory
        } = window.global.currentSelectedGood;

        if(detailStory){
            str += `<size=20><color=	#FFFFFF>${detailStory}</c></s>\n`
        }

        return str;

    },

    hide: function () {
        var self = this;
        this.node.active = false;

        self.goodImg.spriteFrame = null;
        self.sunCount.removeAllChildren();

        this.longtou.node.y = -500;
        cc.audioEngine.stop(this.audioID)
        this.node.emit('fade-out');
    },


    onShare (){

        var self = this;

        let shareFlag = Math.random() > 0.5;

        let alertString = '';

        if(shareFlag){
            alertString = '分享好友，领取强化垫子\n邀请朋友增幅九九必成领红包'
        }else{
            alertString = '观看视频，领取强化垫子\n邀请朋友增幅九九必成领红包'
        }


        window.MyAlert.show({
            alertString: alertString,
            needCancel: true,
            cancelText: '取消',
            confirmCallback: function(){

                if(shareFlag){
                    if(window.global.currentSelectedGood){
                        let {
                            img,
                            qianghuaLvl,
                            name,
                            lvl,
                        } = window.global.currentSelectedGood;
                        // 名字
                        let {
                            color,
                            desc,
                        } = window.zhuangbeilvl[lvl];
                        let shareinfo = [
                            `${desc}的【${name}】 + ${qianghuaLvl},装备评分:${this.pinfenstr}`,
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
                        let shareinfo = [
                            `刀刀暴击，强化增幅！`,
                            `九九必成，强化增幅！`,
                            `重拾强化增幅的感觉。`,
                            `当年没玩的，我要一并玩回来。`,
                            `装备强化19上20。`,
                            `每次强化，都有不同的装备特效`,
                        ];
                        let ran = Math.floor(Math.random() * shareinfo.length);
                        let extra = !window.global.IS_CHECK ? '强化装备，最高提现50元' : '';
            
                        
                        cc.resources.load('img/share1',  (err, spriteFrame) => {
                            sdk.shareAppMessage({
                                title: shareinfo[ran] + extra,
                                imageUrl: spriteFrame.url,
                                success: self.shareSuccess.bind(self)
                            })
                            cc.log('分享确定')
                        });
                    }
                }else{
                    sdk.ad.showRewardedVideoAd({
                        onClose: self.videoSuccess.bind(self)
                    })
                }

                
            }.bind(self)
        })        
    },

    videoSuccess(res){
        if(res){
            this.shareSuccess();
        }
    },

    shareSuccess (){
        var self = this;
        let tmpCount = 4;
        for(var i = 0; i<=tmpCount; i++){
            let _new = initBagMudao('2002')
            window.global.goods.push(_new);
        }
        window.MyAlert.show({
            alertString: `垫子已放入您的背包\n请自行查看`,
        })
        window.global.syncBagToStorage();

    }
    // update (dt) {},
});


function initBagMudao(goodid, _lvl){
    let arr = Object.keys(window.zhuangbeilvl);
    let lvl = _lvl || arr[Math.floor(Math.random() * arr.length)];

    let lvlInfo = window.zhuangbeilvl[lvl];
    let fujia = [];
    let allFujia = Object.keys(window.allfujia);
    let fujiaCount = Math.round(Math.random() * (lvlInfo.maxfujia - lvlInfo.minfujia) + lvlInfo.minfujia)

    fujia = getRandomArrayElements(allFujia, fujiaCount)


    let _new = {
        goodId: '', // 物品id
        count: 1, 
        qianghuaLvl: 10, 
        guanzhuLvL: 1, 
        selected: 0,
        lvl,
        creatorName: '神秘人', 
        // 附加
        fujia: fujia.map(item=>{
            return window.allfujia[item]
        })
    };

    // 寻找相同的id的
    let _ = window.global.goods.filter(item=>{
        return item.goodId.startsWith(goodid)
    });

    if(_.length === 0){
        _new.goodId = `${goodid}****1`
    }else{
        let idIdxArr = _.map((item=>{
            return item.goodId.split('****')[1]
        }))


        let max = Math.max(...idIdxArr);
        _new.goodId = `${goodid}****${Number(max) + 1}`
    }

    return _new;
}

function getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}