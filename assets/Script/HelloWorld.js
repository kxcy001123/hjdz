cc.Class({
    extends: cc.Component,

    properties: {
    
    },

    // use this for initialization
    onLoad: function () {
        this._button = this.getComponent(cc.Button);

        this._button.node.on(cc.Node.EventType.TOUCH_END, this.handleCLick, this)
    },

    // called every frame
    update: function (dt) {

    },

    handleCLick(){

        if(this.flag){
            this.hide();
            this.flag = false;
        }else{
            this.show();
            this.flag = true;
        }
    },

    show(){
        window.global.PopUpInst.show('太对了哥！哥太对!')
    },
    hide(){
        window.global.PopUpInst.hide();
    }
});
