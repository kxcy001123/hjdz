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
        sun: {
            type: cc.Sprite,
            default: null,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onLoad () {
        var sun_tween = this.fangdasuoxiaoAction();
        cc.tween(this.node).then(sun_tween).start()
    },

    /**
     * 放大缩小
     */
    fangdasuoxiaoAction () {
        // 放大
        var fangda = cc.tween().to(1, {scale: 1.2,}, {easing: 'sineOut'});
        // 缩小
        var suoxiao = cc.tween().to(1, {scale: 0.8,}, {easing: 'sineIn'});

        // 创建一个缓动，按 缩小 放大 的顺序执行动作
        var tween = cc.tween().sequence(suoxiao, fangda)
        // 不断重复
        return cc.tween().repeatForever(tween);
    },

    // update (dt) {},
});
