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

        soundSprites: {
            default: [], // 0 开  1 关
            type: cc.SpriteFrame
        },
        soundOn: true,

    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchUp, this);
        // this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchUp, this.node);

    },
    onTouchUp(){
        if(this.soundOn){
            this.node.getChildByName("sound_prite").getComponent(cc.Sprite).spriteFrame = this.soundSprites[1];
            this.soundOn = false;

            window.global.soundOn = false;
            cc.audioEngine.pauseMusic();

        }else{
            this.node.getChildByName("sound_prite").getComponent(cc.Sprite).spriteFrame = this.soundSprites[0];
            this.soundOn = true;
            cc.audioEngine.resumeMusic();

            window.global.soundOn = true;

        }
    },
    start () {

    },

    // update (dt) {},
});
