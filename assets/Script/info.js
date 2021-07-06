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
        content: {
            default: null,
            type: cc.Node,
        },
        scrollView: {
            default: null,
            type: cc.ScrollView
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.initInfo();
    },

    initInfo: function(){
        window.timerInfo.forEach(item=>{
            let richTextNode = new cc.Node();
            let richText = richTextNode.addComponent(cc.RichText);
            richText.lineHeight = 18;
            richText.string = `<size=18><color=#00ff00>获得了:</c><color=#0fffff>  ${item.name}</color></s>`;
            this.scrollView.content.addChild(richTextNode);

            this.scrollView.scrollToBottom(0.2);
        })
    },

    updateInfo: function(){

        if(this.scrollView.content.children.length > 7){
            this.scrollView.content.children[0].removeFromParent();
        }

        let latest =  window.timerInfo[window.timerInfo.length - 1];
        let richTextNode = new cc.Node();
        let richText = richTextNode.addComponent(cc.RichText);
        richText.lineHeight = 18;

        if(latest.goodId){
            let good = window.allGoods[latest.goodId];
            richText.string = `<size=18><color=#00ff00>获得了:</c><color=#0fffff>  ${good.name}</color><color=#00ff00> ${latest.count}个</c></s>`;
            
        }else{
            richText.string = `<size=18><color=#00ff00>一番辛苦，却一无所获</c></s>`;
        }

        this.scrollView.content.addChild(richTextNode);
        this.scrollView.scrollToBottom(0.2);
    }



    // update (dt) {},
});
