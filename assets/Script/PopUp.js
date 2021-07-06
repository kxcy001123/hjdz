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
        label: {
            default: null,
            type: cc.Label
        },
        popUp: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        window.global.PopUpInst = this;
    },

    show (str) {
        this.node.active = true;

        this.label.string = str;
        this.label._forceUpdateRenderData();

        cc.tween(this.popUp).to(0.1, { height: this.label.node.height + 30 }).start();
        this.node.emit('fade-in');
    },
    hide (){
        this.node.emit('fade-out');
    },



    // update (dt) {},
});
