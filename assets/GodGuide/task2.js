module.exports = {
    name: '开始炼器',
    debug: false,
    autorun: false,
    steps: [
        {
            desc: "点击炼器",
            command: {
                cmd: "text",
                args: "开始炼器"
            },
        },
        {
            desc: "点击炼器",
            command: {
                cmd: "finger",
                args: "backPack/btn_lianqi"
            },
        },
        {
            desc: "添加炼器腹",
            command: {
                cmd: "text",
                args: "添加炼器符"
            },
        },
        {
            desc: "点击添加炼器按钮",
            command: {
                cmd: "finger",
                args: "qiang_hua/qianghuashi/btn_add_qhs"
            },
            delayTime: 0.5
        },
        {
            desc: "添加完璧符,炼器失败时,装备不会消失",
            command: {
                cmd: "text",
                args: "添加完璧符\n炼器失败时,装备不会消失"
            },
            delayTime: 0.5
        },
        {
            desc: "点击添加完璧符按钮",
            command: {
                cmd: "finger",
                args: "qiang_hua/wanbifu/btn_add_wbf"
            },
            delayTime: 0.5
        },
        {
            desc: "添加鸿运符\n提高炼器时15%成功几率",
            command: {
                cmd: "text",
                args: "添加鸿运符\n提高炼器时15%成功几率"
            },
            delayTime: 0.5
        },
        {
            desc: "点击添加鸿运符按钮",
            command: {
                cmd: "finger",
                args: "qiang_hua/hongyunfu/btn_add_hy"
            },
            delayTime: 0.5
        },
        {
            desc: "开始炼器",
            command: {
                cmd: "text",
                args: "准备齐全,开始第一次炼器吧！"
            },
            delayTime: 0.5
        },
        {
            desc: "点击开始炼器",
            command: {
                cmd: "finger",
                args: "qiang_hua/btn_confirm"
            },
            delayTime: 0.5
        },
    ]
}