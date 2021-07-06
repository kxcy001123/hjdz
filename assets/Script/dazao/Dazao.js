// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var zhuangbei = require('../allZhuangbei');

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
        cucao: {
            type: cc.Label,
            default: null,
        },
        putong: {
            type: cc.Label,
            default: null,
        },
        shiyong: {
            type: cc.Label,
            default: null,
        },
        qianghua: {
            type: cc.Label,
            default: null,
        },
        jinggzhi: {
            type: cc.Label,
            default: null,
        },
        wuxia: {
            type: cc.Label,
            default: null,
        },
        wanmei: {
            type: cc.Label,
            default: null,
        },


        cailiao: {
            type: cc.Node,
            default: null,
        },
        jilvNode: {
            type: cc.Node,
            default: null,
        },
        good: {
            type: cc.Node,
            default: null,
        },
        particle: {
            type: cc.ParticleSystem,
            default: null,
        },
        duanzaoBtn: {
            type: cc.Button,
            default: null,
        },
        // 进度条
        horizontalBar: {
            type: cc.ProgressBar,
            default: null
        },
        btnView: {
            type: cc.Node,
            default: null,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // cc.resources.load('music/huoyan', cc.AudioClip, null, function (err, clip) {
        //     this.audioID = cc.audioEngine.play(clip, true, 0.5);
        // });
    },

    // 4 20
    // 3 12 - 20
    // 2 10 - 18
    // 1 4 - 12

    // 完美100  无瑕75  精致 55  强化 45  实用 25  普通 15  粗糙 0
    onEnable() {
        this.cailiao.active = true;
        this.jilvNode.active = true;
        this.duanzaoBtn.node.active = true;
        this.good.active = false;
        this.btnView.active = false;
        let rate = {
            4: [20, 100, 60],
            3: [12, 20, 16],
            2: [10, 18, 14],
            1: [4, 12, 8],
        }

        let dazao = true;

        let jilv = 0;
        let lvlJilv = 0;
        this.cailiaoUsed = [];
        ['0101', '0102', '0103', '0104', '0105'].map(goodid=>{
            let _ = window.global.goods.filter(item=>{
                return item.goodId.startsWith(goodid) && item.count >=3
            }).map((_item)=>{
                return window.allGoods[_item.goodId].lvl;
            });
            if(_.length > 0){
                let maxLvl = Math.max(..._);
                let usedId = goodid
                if(maxLvl>1){
                    usedId+= `${maxLvl}`
                }
                this.cailiaoUsed.push(usedId)
                jilv += rate[maxLvl][0] + Math.floor(Math.random() * (rate[maxLvl][1]) - rate[maxLvl][0])
                lvlJilv += rate[maxLvl][2];
            }else{
                dazao = false;
            }
        })

        this.jilv = jilv;

        this.getFenleijilv(lvlJilv, dazao);
        this.btnStatus(dazao);


    },


    getLvl(jilv){
        let zblvl = 1;
        if(jilv > 100){
            zblvl =  7
        }else if(jilv >=82){
            zblvl = 6
        }else if(jilv >=72){
            zblvl = 6
        }else if(jilv >=60){
            zblvl = 5
        }else if(jilv >=50){
            zblvl = 4
        }else if(jilv >=39){
            zblvl = 3
        }else if(jilv >=25){
            zblvl = 2
        }else{
            zblvl = 1
        };

        let lvl2ZB = zhuangbei.zhuangbeiLv2;

        let arr = Object.keys(lvl2ZB);
        let random= Math.floor(Math.random() * arr.length);

        let _zb = lvl2ZB[arr[random]];
        if(_zb && _zb.atlasName){
            this.duanzaoid = arr[random];
        }

        let dazaojieguo = window.allGoods[this.duanzaoid]

        let _new = zhuangbei.initZhuangbeiLv2(this.duanzaoid, zblvl)
        cc.log('打造：', _new)
        window.global.goods.push(_new);
        window.global.syncBagToStorage();

        var animation = this.good.getComponent(cc.Animation);
        if(dazaojieguo.atlasName && animation){
            cc.resources.load(`atlas/${dazaojieguo.atlasName}/${dazaojieguo.atlasName}`, cc.SpriteAtlas, (err, atlas) => {
                var spriteFrames = atlas.getSpriteFrames();
                var clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, spriteFrames.length);
                clip.speed = 10 / spriteFrames.length;

                clip.name = 'run';
                clip.wrapMode = cc.WrapMode.Loop;
                animation.addClip(clip);
                animation.play('run');
                this.good.active = true;

            });
        }


    },


    getFenleijilv(lvlJilv, dazao){
        let wanmei = '完美:';
        let wuxia = '无暇:';
        let jinggzhi = '精致:';
        let qianghua = '强化:';
        let shiyong = '实用:';
        let putong = '普通:';
        let cucao = '粗糙:';
        if(dazao){
            if(lvlJilv > 100){
                wanmei+= '100%';
                wuxia+='0%';
                jinggzhi+='0%';
                qianghua+='0%';
                shiyong+='0%';
                putong+='0%';
                cucao+='0%';
            }else if(lvlJilv > 82){
                wanmei+= '80%';
                wuxia+='10%';
                jinggzhi+='10%';
                qianghua+='0%';
                shiyong+='0%';
                putong+='0%';
                cucao+='0%';
            }else if(lvlJilv > 72){
                wanmei+= '40%';
                wuxia+='30%';
                jinggzhi+='20%';
                qianghua+='5%';
                shiyong+='5%';
                putong+='0%';
                cucao+='0%';
            }else if(lvlJilv > 60){
                wanmei+= '00%';
                wuxia+='30%';
                jinggzhi+='30%';
                qianghua+='15%';
                shiyong+='3%';
                putong+='2%';
                cucao+='0%';
            }else if(lvlJilv > 50){
                wanmei+= '0%';
                wuxia+='0%';
                jinggzhi+='10%';
                qianghua+='30%';
                shiyong+='25%';
                putong+='25%';
                cucao+='10%';
            }else if(lvlJilv > 39){
                wanmei+= '0%';
                wuxia+='0%';
                jinggzhi+='0%';
                qianghua+='5%';
                shiyong+='10%';
                putong+='35%';
                cucao+='50%';
            }else{
                wanmei+= '0%';
                wuxia+='0%';
                jinggzhi+='0%';
                qianghua+='10%';
                shiyong+='10%';
                putong+='20%';
                cucao+='60%';
            }
        }else{
            wanmei+= '0%';
                wuxia+='0%';
                jinggzhi+='0%';
                qianghua+='0%';
                shiyong+='0%';
                putong+='0%';
                cucao+='0%';
        }
        


        this.wanmei.string = wanmei;
        this.wuxia.string = wuxia;
        this.jinggzhi.string = jinggzhi;
        this.qianghua.string = qianghua;
        this.shiyong.string = shiyong;
        this.putong.string = putong;
        this.cucao.string = cucao;

    },

    btnStatus(dazao){
        if(!dazao){
            this.duanzaoBtn.interactable = false;
            this.duanzaoBtn.node.off('touchend', this._confirmDuanzao, this);
        }else{
            this.duanzaoBtn.interactable = true;
            this.duanzaoBtn.node.on('touchend', this._confirmDuanzao, this);
        };


    },

    _confirmDuanzao(){
        this.cailiao.active = false;
        this.jilvNode.active = false;
        this.duanzaoBtn.node.active = false;
        this.horizontalBar.node.active = true;

        this.particle.node.active = true;
        this.particle.resetSystem();
        

    },
    // 打造成功
    dazaoSuc(){
        this.cailiaoUsed.forEach(item=>{
            window.global.goods.find(_item=>_item.goodId===item).count-=3;
        })
        window.global.syncBagToStorage();

        cc.resources.load('music/getZB', cc.AudioClip, null, function (err, clip) {
            if(window.global.soundOn){
                self.audioID = cc.audioEngine.play(clip, false, 1);
            }
        });
        this.getLvl(this.jilv);
        this.good.active = true;
        this.btnView.active = true;

    },

    start () {

    },

    onDisable(){
        this.horizontalBar.node.active = false;

        this.duanzaoBtn.node.off('touchend', this._confirmDuanzao, this);
        this.particle.stopSystem();
        this.particle.node.active = false;
        this.good.active = false;
        this.btnView.active = false;

        // cc.audioEngine.stop(this.audioID)
    }
    // update (dt) {},
});
