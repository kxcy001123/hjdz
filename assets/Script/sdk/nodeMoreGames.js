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
        this._btn = sdk.createMoreGamesButton(this.node);
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
