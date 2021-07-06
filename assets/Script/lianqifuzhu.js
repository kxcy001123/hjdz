const lianqi_fuzhu = {
    // 炼器辅助用品
    lianqiFuzhuLv1: {
        // 1*** 符
        "1001": {
            name: '炼器符', // 物品名称
            type: 1, // 0 材料 1 符  2 装备
            img: 'img/lqf', // 图片 
            desc: '蕴涵着天地灵气的神秘符咒，可以用来提升武器品级。', // 物品描述
        },
        "1002": {
            name: '完璧符', 
            type: 1, 
            img: 'img/bhf',
            desc: '神奇的玉符，可以在炼器失败时保证装备不会消失，但是会降低强化等级1',
        },
        "1003": {
            name: '鸿运符', 
            type: 1, 
            img: 'img/hyf',
            desc: '能够提高运势的神符，可以提高20%的炼器成功率',
        },
    },
}

module.exports = lianqi_fuzhu;