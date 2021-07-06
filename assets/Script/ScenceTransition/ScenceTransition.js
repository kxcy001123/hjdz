// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


let Transitions = require('../transitions');

cc.Class({
    extends: cc.Component,

    properties: {
        transitions: Transitions,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {

    },

    transition (cb) {
        var self = this;
        cc.resources.load('music/transition', cc.AudioClip, null, function (err, clip) {
            if(window.global.soundOn){
                self.audioID = cc.audioEngine.play(clip, false, 1);
            }

        });
        let result = this.transitions.loadScene('Scene/helloworld', 'Canvas/Main Camera', 'Canvas/Main Camera', ()=>{
            cb && cb();
            self.onLoadSceneFinish();
        });
        if (!result) {
            return;
        }
    },

    onLoadSceneFinish(){
        console.log('load scence end')
    }

    // update (dt) {},
});
