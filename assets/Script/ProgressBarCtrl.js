
var LianqiConfirm = require("lianqiConfirm");

cc.Class({
    extends: cc.Component,

    properties: {
        speed: 0.4,
        horizontalBarReverse: {
            type: cc.ProgressBar,
            default: null
        },
        particle: {
            type: cc.ParticleSystem,
            default: null
        },
        lianqiConfirm: {
            default: null,
            type: LianqiConfirm
        }
    },

    onLoad: function () {
        this._pingpong = true;
        this.horizontalBarReverse.progress = 0;


        this.particleX = this.particle.node.x;
        // var self = this;
        // setInterval(()=>{
        //     self._updateProgressBar(self.horizontalBar);
        // }, 100)
    },

    update: function (dt) {
        this._updateProgressBar(this.horizontalBarReverse, dt);
    },
    
    _updateProgressBar: function(progressBar, dt){
        var progress = progressBar.progress;
        if(progress < 1.0 && this._pingpong){
            progress += dt * this.speed;
            this.particleX = -200 + progress / 1 * 400;
            this.particle.node.x = this.particleX;
        }else{
            this.particle.stopSystem();
            this.lianqiConfirm.completeLianqi();
            this.node.active = false;
            progress = 0;
        }
        progressBar.progress = progress;
    },

    onDisable: function(){
        this.particle.stopSystem();
        cc.audioEngine.stop(this.audioID)
        // this._pingpong = false;
    },

    onEnable: function (){
        this.particle.resetSystem();
        var self = this;

        cc.resources.load('music/jindu', cc.AudioClip, null, function (err, clip) {
            if(window.global.soundOn){
                self.audioID = cc.audioEngine.play(clip, false, 0.6);
            }
        });
    }
});
