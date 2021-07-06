var sdk = require('../sdk/sdk')


cc.Class({
  extends: cc.Component,

  properties: {

  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
      
    cc.resources.load('img/share1' , (err, data) => {
      sdk.showShareMenu({
        title: 'xxbb强化增幅大法，快来试试你能强化+31吗?',
        imageUrl: data.url,
      })
    });

  },
});
