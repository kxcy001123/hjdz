let GodCommand = require('GodCommand');
module.exports = {
    name: '进入商店',
    debug: false,
    autorun: false,
    steps: [
        {
            desc: '初始',
            command: { cmd: 'text', args: '初次进入游戏\n相关赠送物品已放入背包\n快去查看吧！'},
            delayTime: 0.5,
        },
        {
            desc: '点击主界面背包按钮',
            command: { cmd: 'finger', args: 'btns > btn_backpack'},
            onEnd(callback) {
                setTimeout(() => {
                    cc.log('模拟异步提交数据');
                    callback();
                }, 1000);
            },
            delayTime: 0.5,
        },
        {
            desc: '文本提示',
            command: { cmd: 'text', args: '点击装备'},
            delayTime: 0.5,
        },
        {
            desc: '文本提示',
            command: { cmd: 'finger', args:  'backPack > scrollView > content > heroslot2' }
        },

        
        // {
        //     desc: '点击主界面设置按钮',
        //     command: { cmd: 'finger', args: 'Home > main_btns > btn_setting'},
        // },

        // {
        //     desc: '文本提示',
        //     command: { cmd: 'text', args: '点击主界面商店按钮' }
        // },

        // {
        //     desc: '点击主界面商店按钮',
        //     command: { cmd: 'finger', args: 'Home > main_btns > btn_shop'},
        // },

        // {
        //     desc: '文本提示',
        //     command: { cmd: 'text', args: '点击商店充值按钮' }
        // },

        // {
        //     desc: '点击商店充值按钮',
        //     command: { cmd: 'finger', args: 'Home > Shop > btnCharge'},
        //     onStart(callback) {
        //         setTimeout(() => {
        //             cc.log('模拟异步获取数据');
        //             callback();
        //         }, 1000);
        //     },

        //     onEnd(callback) {
        //         setTimeout(() => {
        //             cc.log('模拟异步提交数据');
        //             callback();
        //         }, 1000);
        //     },
        // },

        // {
        //     desc: '文本提示',
        //     command: { cmd: 'text', args: '点击充值界面关闭钮' }
        // },

        // {
        //     desc: '点击充值界面关闭钮',
        //     command: { cmd: GodCommand.FINGER, args: 'chargePanel > btn_close'},
        //     delayTime: 0.5
        // },

        // {
        //     desc: '回到主页',
        //     command: { cmd: GodCommand.FINGER, args: 'Home > main_btns > btn_home'},
        // },
    ]
};