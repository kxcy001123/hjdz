// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


let Transitions = require('transitions');

cc.Class({
    extends: cc.Component,

    properties: {
        transitions: Transitions,
        
        fromRoot: cc.Node,
        fromCamera: cc.Camera,

        toRoot: cc.Node,
        toCamera: cc.Camera,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // this.transition(() => {
        //     this.scheduleOnce(() => {
        //         let toRoot = this.fromRoot;
        //         let toCamera = this.toCamera;
        //         this.fromRoot = this.toRoot;
        //         this.fromCamera = this.toCamera;
        //         this.toRoot = toRoot;
        //         this.toCamera = toCamera;
        //     }, 1)
        // })


    },

    transition () {
        var self = this;
        cc.resources.load('music/transition', cc.AudioClip, null, function (err, clip) {
            if(window.global.soundOn){
                self.audioID = cc.audioEngine.play(clip, false, 1);
            }

        });
        this.transitions.loadNode(this.fromCamera, this.fromRoot, this.toCamera, this.toRoot, () => {
            this.scheduleOnce(() => {
                // let toRoot = this.fromRoot;
                // let toCamera = this.toCamera;
                // this.fromRoot = this.toRoot;
                // this.fromCamera = this.toCamera;
                // this.toRoot = toRoot;
                // this.toCamera = toCamera;
                


                this.fromCamera.node.active = true;
                // this.toCamera.active = true;

                // let tmp = this.transitions._texture1;
                // this.transitions._texture1 = this.transitions._texture2;
                // this.transitions._texture2 = tmp;

                // this.transition();
            }, 0.1)
        });
    },


    backTransition () {
        var self = this;

        cc.resources.load('music/transition', cc.AudioClip, null, function (err, clip) {
            if(window.global.soundOn){
                self.audioID = cc.audioEngine.play(clip, false, 1);
            }
        });
        this.transitions.loadNode(this.toCamera, this.toRoot, this.fromCamera, this.fromRoot,  () => {
            this.toCamera.node.active = true;
            // this.toCamera.active = true;
        });
    }

    // update (dt) {},
});
