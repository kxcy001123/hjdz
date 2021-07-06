const sdk = require('sdk');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        sdk.extend.bindNode(this.node);
    },
});
