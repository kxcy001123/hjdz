const LoadRemotePlist = require("../utils/LoadRemotePlist");
var sdk = require('../sdk/sdk')
var zhuangbei = require('../allZhuangbei');


cc.Class({
    extends: cc.Component,

    // use this for initialization
    onLoad: function () {
        
        // sdk.cloud.downloadFile('cloud://dazao-1-2gwvp5dg514972c1.6461-dazao-1-2gwvp5dg514972c1-1305312903/tianya/tianya.xml', (plistUrl)=>{
        //     sdk.cloud.downloadFile('cloud://dazao-1-2gwvp5dg514972c1.6461-dazao-1-2gwvp5dg514972c1-1305312903/tianya/tianya.png', (altasUrl)=>{

        //         LoadRemotePlist(plistUrl, altasUrl, (err, atlas) => {
        //             if(!err){
        //                 var spriteFrames = atlas.getSpriteFrames();
        //                 var clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 10);
        //                 clip.name = 'run';
        //                 clip.speed = 0.5;
        //                 clip.wrapMode = cc.WrapMode.Loop;
        //                 animation.addClip(clip);
        //                 animation.play('run');
        //             }else{
        //                 cc.log('LoadRemotePlist', err)
        //             }
        //         })
        //     })
        // })
        this.createClip();

    },

    createClip: function(){

        let todayZeongsongId = window.global.todayZeongsongId;
        let todayZeongsong = zhuangbei.zhuangbeiLv2[todayZeongsongId]

        var animation = this.getComponent(cc.Animation);
        if(todayZeongsong.atlasName && animation){
            cc.resources.load(`atlas/${todayZeongsong.atlasName}/${todayZeongsong.atlasName}`, cc.SpriteAtlas, (err, atlas) => {
                var spriteFrames = atlas.getSpriteFrames();
                var clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, spriteFrames.length);
                clip.speed = 10 / spriteFrames.length;

                clip.name = 'run';
                clip.wrapMode = cc.WrapMode.Loop;
                animation.addClip(clip);
                animation.play('run');
            });
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});