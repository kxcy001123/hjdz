const sdk = require('sdk');

cc.Class({
    extends: cc.Component,

    ctor() {
        this._btn = null;
    },

    onLoad() {
        if (this.getComponent(cc.Layout)) {
            this.getComponent(cc.Layout).updateLayout();
        }
        sdk.checkFollowState((err, res) => {
            if (!res) {
                if (this.node.isValid) {
                    this._btn = sdk.createFollowButton(this.node, (result) => {
                        if (result && result.errCode === 0) {
                            cc.app.manager.ui.show({ name: 'controlToast', data: { title: '关注成功' } });
                            this.onDestroy();
                        }
                    });
                    !this.node.activeInHierarchy && this._btn.hide();
                }
            }
        })
    },

    onEnable() {
        if (this._btn) {
            this._btn.show();
        }
    },

    onDisable() {
        if (this._btn) {
            this._btn.hide();
        }
    },

    onDestroy() {
        if (this._btn) {
            this._btn.destroy();
            this._btn = null;
        }
    }
});
