
var Info =require('info');

var all_cailiao = require('Cailiao')
var lianqifuzhu = require('lianqifuzhu')

var BackPackUI = require("BackPackUI");

cc.Class({
    extends: cc.Component,

    properties: {
        info: {
            default: null,
            type: Info
        },
        type: 0,
        timeToRecover: 0,
        totalCount: 0,
        currentCount: 0,
        labelTimer: {
            default: null,
            type: cc.Label
        },
        labelCount: {
            default: null,
            type: cc.Label
        },
        progressBar: {
            default: null,
            type: cc.ProgressBar
        },
        icon: {
            default: null,
            type: cc.Sprite
        },
        text: {
            default: null,
            type: cc.Label
        },
        show: true,

        // 背包页面
        backPackUI: {
            default: null,
            type: BackPackUI
        },
    },

    // use this for initialization
    onLoad: function () {
        this.timer = 0;
        this.caikuangDonghua();
        this.originX = this.node.x;
        this.originY = this.node.y;

        this.scheduleOnce(function() {
            // 这里的 this 指向 component
            this.hideTimerBar();
            this.show = false;
        }, 5);

        
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        let ratio = this.timer/this.timeToRecover;
        this.progressBar.progress = ratio;
        if (this.currentCount > this.totalCount) this.currentCount = this.totalCount;
        let timeLeft = Math.floor(this.timeToRecover - this.timer);
        this.labelCount.string = this.currentCount + '/' + this.totalCount;
        this.labelTimer.string = Math.floor(timeLeft/60).toString() + ':' + (timeLeft%60 < 10 ? '0' : '') + timeLeft%60;
        this.timer += dt;
        if (this.timer >= this.timeToRecover) {
            this.timer = 0;
            this.currentCount++;

            this.getgood();

        }
    },


    // 获取物品
    getgood: function(){
        // 低等材料
        if(this.type  === 0){
            if(Math.random() > 0.2){
                let entries = Object.entries(all_cailiao.yuanliaoLv1);

                let tmpgood = Math.floor(Math.random() * entries.length)
                let tmpCount = Math.ceil(Math.random() * 5);

                // 是否已经有这个物品了，
                let _ = window.global.goods.find(item=>item.goodId === entries[tmpgood][0]);
                if(_){
                    _.count += tmpCount
                    this.backPackUI.refreshGood(_);
                }else{

                    let new_ = {
                        goodId: entries[tmpgood][0],
                        count: tmpCount, // 数量
                    };
                    this.backPackUI.refreshGood(new_);

                    window.global.goods.push(new_)
                }
                window.global.syncBagToStorage();

                window.timerInfo.push({
                    goodId: entries[tmpgood][0],
                    count: tmpCount, // 数量
                });

            }else{
                window.timerInfo.push({
                    goodId: undefined
                });
            }
            
            if(window.timerInfo.length > 7){
                window.timerInfo.shift()
            }
            

            // 更新公告
            this.info.updateInfo();
        }

        if(this.type ===1){

            if(Math.random() > 0.7){
                let entries = Object.entries(lianqifuzhu.lianqiFuzhuLv1);

                let tmpgood = Math.floor(Math.random() * entries.length)
                let tmpCount = 1;

                // 炼器符几率更高
                if(Math.random() < 0.7){
                    tmpgood = 0;
                }

                // 是否已经有这个物品了，
                let _ = window.global.goods.find(item=>item.goodId === entries[tmpgood][0]);
                if(_){
                    _.count += tmpCount
                    this.backPackUI.refreshGood(_);
                }else{
                    let new_ = {
                        goodId: entries[tmpgood][0],
                        count: tmpCount, // 数量
                    };
                    this.backPackUI.refreshGood(new_);

                    window.global.goods.push(new_)
                }
                window.global.syncBagToStorage();

                window.timerInfo.push({
                    goodId: entries[tmpgood][0],
                    count: tmpCount, // 数量
                });
            }else{
                window.timerInfo.push({
                    goodId: undefined
                });
            }

            
            if(window.timerInfo.length > 7){
                window.timerInfo.shift()
            }
            
            // 更新公告
            this.info.updateInfo();
        }

    },

    caikuangDonghua: function(){
        
        cc.tween(this.icon.node).repeatForever(cc.tween(this.icon.node).to(0.5, {
            angle: 20,
        }).to(0.5, {
            angle: -10
        })).start()
    },

    iconClick: function(){
        var self = this;
        // cc.Tween.stopAllByTarget(this.icon.node);
        cc.resources.load('music/popup', cc.AudioClip, null, function (err, clip) {
            if(window.global.soundOn){
                self.audioID = cc.audioEngine.play(clip, false, 1);
            }
        });
        if(this.show){
            this.hideTimerBar();
            this.show = false;
        }else{
            this.showTimerBar();
            this.show = true;
        }

        // this.caikuangDonghua();
    },

    hideTimerBar: function(){
        cc.tween(this.node).to(0.3, {
            opacity: 0,
            position: cc.v2(-this.originX, this.originY),
        }).start();
        // this.text.string = '开始采矿';
    },
    showTimerBar: function(){
        cc.tween(this.node).to(0.3, {
            opacity: 255,
            position: cc.v2(this.originX, this.originY),
        }).start();
        // this.text.string = '采矿中...';
    }
});
