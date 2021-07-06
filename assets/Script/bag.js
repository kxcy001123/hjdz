var sdk = require('./sdk/sdk')



const goods = [
    
    {
        goodId: '2001****1', // 物品id
        count: 1, 
        qianghuaLvl: 10, 
        guanzhuLvL: 10, 
        selected: 0,
        lvl: 4,
        creatorName: '陈三', 
        // 附加
        fujia: [window.allfujia.wuligongji3, window.allfujia.baoji5, window.allfujia.minjie3, window.allfujia.liliang5]
    },
    {
        goodId: '1001',
        count: 3, 
        selected: 0,
        lvl: 2,
    },
    {
        goodId: '2002****1', // 物品id
        count: 1, 
        qianghuaLvl: 6, 
        guanzhuLvL: 10, 
        selected: 0,
        lvl: 7,
        creatorName: '陈三', 
        // 附加
        fujia: [window.allfujia.wuligongji3,]
    },
    {
        goodId: '2002****2', // 物品id
        count: 1, 
        qianghuaLvl: 2, 
        guanzhuLvL: 10, 
        selected: 0,
        lvl: 3,
        creatorName: '陈三', 
        // 附加
        fujia: [window.allfujia.wuligongji3,]
    },
    {
        goodId: '1002',
        count: 1, 
        selected: 0,
        lvl: 2,
    },
    {
        goodId: '1003',
        count: 1, 
        selected: 0,
        lvl: 2,
    },
    // {
    //     goodId: '0001',
    //     count: 20, // 数量
    //     qianghuaLvl: 1, // 强化等级
    //     guanzhuLvL: 1, // 灌注等级
    //     selected: 0, // 0未选中 1选中
    //     lvl: 1, // 前缀等级 
    //     creatorName: '', // 打造者
    // },
    {
        goodId: '0003',
        count: 9999, // 数量
    },
    // {
    //     goodId: '0003',
    //     count: 20, // 数量
    // },
    // {
    //     goodId: '0004',
    //     count: 20, // 数量
    // },
    // {
    //     goodId: '0005',
    //     count: 20, // 数量
    // },
    // {
    //     goodId: '0006',
    //     count: 20, // 数量
    // },
    // {
    //     goodId: '0007',
    //     count: 20, // 数量
    // },
    // {
    //     goodId: '0008',
    //     count: 20, // 数量
    // },
    // {
    //     goodId: '0009',
    //     count: 20, // 数量
    // },
    // {
    //     goodId: '0010',
    //     count: 20, // 数量
    // },

    // {
    //     goodId: '0101',
    //     count: 20, // 数量
    //     qianghuaLvl: 1, // 强化等级
    // },
    // {
    //     goodId: '0102',
    //     count: 20, // 数量
    //     qianghuaLvl: 1, // 强化等级
    // },
    // {
    //     goodId: '0103',
    //     count: 20, // 数量
    //     qianghuaLvl: 1, // 强化等级
    // },
    // {
    //     goodId: '0104',
    //     count: 20, // 数量
    //     qianghuaLvl: 1, // 强化等级
    // },
    // {
    //     goodId: '0105',
    //     count: 20, // 数量
    //     qianghuaLvl: 1, // 强化等级
    // },
    // {
    //     goodId: '0106',
    //     count: 20, // 数量
    //     qianghuaLvl: 1, // 强化等级
    // },
    // {
    //     goodId: '0107',
    //     count: 20, // 数量
    //     qianghuaLvl: 1, // 强化等级
    // },
    // {
    //     goodId: '0108',
    //     count: 20, // 数量
    //     qianghuaLvl: 1, // 强化等级
    // },
    // {
    //     goodId: '0109',
    //     count: 20, // 数量
    //     qianghuaLvl: 1, // 强化等级
    // },
    // {
    //     goodId: '0110',
    //     count: 20, // 数量
    //     qianghuaLvl: 1, // 强化等级
    // },



   
    
]

let bagInStorage = sdk.storage.get('mybag');
let initBag = [{
    goodId: '1001', // 炼器
    count: 20, 
    selected: 0,
    lvl: 2,
},{
    goodId: '1002', // 完毕
    count: 20, 
    selected: 0,
    lvl: 2,
},
{
    goodId: '1003', // 鸿运
    count: 20, 
    selected: 0,
    lvl: 2,
},
{
    goodId: '0101', // 鸿运
    count: 3, 
},
{
    goodId: '0102', // 鸿运
    count: 3, 
},{
    goodId: '0103', // 鸿运
    count: 3, 
},{
    goodId: '0104', // 鸿运
    count: 3, 
},{
    goodId: '0105', // 鸿运
    count: 3, 
}]




function initBagMudao(goodid, _lvl){
    let arr = Object.keys(window.zhuangbeilvl);
    let lvl = _lvl || arr[Math.floor(Math.random() * arr.length)];

    let lvlInfo = window.zhuangbeilvl[lvl];
    let fujia = [];
    let allFujia = Object.keys(window.allfujia);
    let fujiaCount = Math.round(Math.random() * (lvlInfo.maxfujia - lvlInfo.minfujia) + lvlInfo.minfujia)

    fujia = getRandomArrayElements(allFujia, fujiaCount)


    let _new = {
        goodId: '', // 物品id
        count: 1, 
        qianghuaLvl: 10, 
        guanzhuLvL: 1, 
        selected: 0,
        lvl,
        creatorName: '神秘人', 
        // 附加
        fujia: fujia.map(item=>{
            return window.allfujia[item]
        })
    };

    // 寻找相同的id的
    let _ = initBag.filter(item=>{
        return item.goodId.startsWith(goodid)
    });

    if(_.length === 0){
        _new.goodId = `${goodid}****1`
    }else{
        let idIdxArr = _.map((item=>{
            return item.goodId.split('****')[1]
        }))


        let max = Math.max(...idIdxArr);
        _new.goodId = `${goodid}****${Number(max) + 1}`
    }

    return _new;
}

if(!bagInStorage){
    for(var i = 0; i<=4; i++){
        let _new = initBagMudao('2002')
        initBag.unshift(_new);
    }
}

const storageGoods = bagInStorage || initBag;

module.exports = storageGoods;




function getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}