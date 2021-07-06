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

const zhuangbei = {
    // 炼器辅助用品
    zhuangbeiLv1: {
        "2002": {
            name: '木刀片', 
            img: 'img/mujian2', 
            desc: '普通的木剑，却是每一个勇士的起点...', 
            type: 2, 
            // 基础评分
            pingfen: 250,
            qianghuaxishu: 1.08, // 每次强化评分系数
            // 基础物理攻击
            wuligongji: {
                min: 50, // 最小
                max: 132, // 最大
                qianghua: 10, // 每次强化增加值
                desc: '物理攻击力',
            },
            // 基础物理防御
            wulifangyu: null,
            // 基础魔法攻击
            mofagongji: null,
            // 基础魔法防御
            mofafangyu: null,
            // 暴击率
            baoji: null,
            detailStory: `我会拿起我的木片刀，去一点点的锻炼我自己。\n我会找到我最爱的姑娘，用最深切的爱意对她好，哪怕她都烦我了。\n看到美丽的公主，我会希望她幸福，而不是成为我的又一个老婆。\n当英雄的骑士驰过，我不恨嫉恨他，因为他拥有的未必有我多。\n更不要成为没有自己，只会毁灭一切的神。\n--《若星汉天空》`
        }
    },
    zhuangbeiLv2:{
        "2001": {
            name: '山河永寂', // 物品名称
            img: 'img/shanheyongji', // 图片
            atlasName: 'shanheyongji', 
            desc: '七千年前，人殁情殇，只剩下极夜未央，山河永寂，空桑败亡', // 物品描述
            type: 2, // 0 材料 1 符  2 装备
            // 基础评分
            pingfen: 7650,
            qianghuaxishu: 1.08, // 每次强化评分系数
            // 基础物理攻击
            wuligongji: {
                min: 1000, // 最小
                max: 1450, // 最大
                qianghua: 101, // 每次强化增加值
                desc: '物理攻击力',

            },
            // 基础物理防御
            wulifangyu: {
                min: 80,
                max: 170,
                qianghua: 20, // 每次强化增加值
                desc: '物理防御力',
            },
            // 基础魔法攻击
            mofagongji: {
                min: 800,
                max: 1070,
                qianghua: 20, // 每次强化增加值
                desc: '魔法攻击力',
            },
            // 基础魔法防御
            mofafangyu: {
                min: 210,
                max: 295,
                qianghua: 30, 
                desc: '魔法防御力',
            },
            // 暴击率
            baoji: {
                min: 4,
                max: 6,
                qianghua: 0.4,
                desc: '暴击',
            },
            detailStory: '七千年前，人殁情殇，只剩下极夜未央，山河永寂，空桑败亡。\n七千年后，灵魂交与，却是永生将尽，再携手伽蓝白塔的时候，手已不能相携\n终于等来那人一睹云荒，身在云中，却已山河永寂，不在复苏了。\n只是，这山河，这命运，无法抗拒的推着你往前走。归墟之后，这山河，只愿再无法束缚你。\n《镜》'
        },

        "2003": {
            name: '赤焰', // 物品名称
            img: 'img/chiyan', // 图片
            atlasName: 'chiyan', 
            desc: '开始，仅仅是开始！虽然迟到了三千年……上面的，准备好了么？', // 物品描述
            type: 2, // 0 材料 1 符  2 装备
            // 基础评分
            pingfen: 7650,
            qianghuaxishu: 1.08, // 每次强化评分系数
            // 基础物理攻击
            wuligongji: {
                min: 900, // 最小
                max: 1550, // 最大
                qianghua: 91, // 每次强化增加值
                desc: '物理攻击力',
            },
            // 基础物理防御
            wulifangyu: {
                min: 90,
                max: 175,
                qianghua: 20, // 每次强化增加值
                desc: '物理防御力',
            },
            // 基础魔法攻击
            mofagongji: {
                min: 1000,
                max: 1200,
                qianghua: 20, // 每次强化增加值
                desc: '魔法攻击力',
            },
            
            // 基础魔法防御
            mofafangyu: {
                min: 210,
                max: 295,
                qianghua: 30, 
                desc: '魔法防御力',
            },
            // 暴击率
            baoji: {
                min: 4,
                max: 6,
                qianghua: 0.4,
                desc: '暴击',
            },
            detailStory: '这便是纵横天下三千年，九渡天劫身不损，号称驻世天魔的那位大宗师吗？受这第十次雷劫波及的修士都在地底下咬牙切齿：这魔头，该杀的杀了、该灭的灭了、该玩的玩了，干嘛还恋栈不去，难道非要把这通玄界弄个底朝天才罢休么？\n雷雨过后的东南林海，水蝶兰所化的幼蝶终于从那丑陋的茧蛹中挣脱出来。李珣在手指上凝聚了一滴红玉般的血液。\n幼蝶将李珣手指上的血液吮吸干净，又轻巧地飞起来，绕着举起的手臂，舞蹈飞翔。草丛中的李珣眯起眼睛，看着蝶舞虹桥的美景，微微而笑：“我说过，只是开始，仅仅是开始！虽然迟到了三千年……上面的，准备好了么？”\n《幽冥仙途》'
        },

        "2004": {
            name: '冥火阎罗', // 物品名称
            img: 'img/minghuoyanluo', // 图片
            atlasName: 'minghuoyanluo', 
            desc: '“宗门乱离，阴眼开！”\n“后继乏人，幽栅开！”\n“上下失序，阎锁开！”\n“大势崩摧……冥链开！”\n“生死殊途，鬼门开！”', // 物品描述
            type: 2, // 0 材料 1 符  2 装备
            // 基础评分
            pingfen: 7750,
            qianghuaxishu: 1.09, // 每次强化评分系数
            // 基础物理攻击
            wuligongji: {
                min: 900, // 最小
                max: 1550, // 最大
                qianghua: 91, // 每次强化增加值
                desc: '物理攻击力',
            },
            // 基础物理防御
            wulifangyu: {
                min: 90,
                max: 175,
                qianghua: 20, // 每次强化增加值
                desc: '物理防御力',
            },
            // 基础魔法攻击
            mofagongji: {
                min: 1080,
                max: 1700,
                qianghua: 20, // 每次强化增加值
                desc: '魔法攻击力',
            },
            
            // 基础魔法防御
            mofafangyu: {
                min: 210,
                max: 295,
                qianghua: 30, 
                desc: '魔法防御力',
            },
            // 暴击率
            baoji: {
                min: 2,
                max: 6,
                qianghua: 0.4,
                desc: '暴击',
            },
            detailStory: '冥火阎罗低笑起来∶“五极解封，九幽噬界，阎鸳哪，弥看这满目疮痰，可是妹愿意得到的？”\n阎夫人伏首不语，只是用额头厮脐地面，丝丝有声。\n冥火阎罗的声音依然虚弱缥缈∶“是了，这不是妹要得到的，当然，也不是我想要的。可是。灾劫因弥而来。宗门圣地，是我亲手毁去……如今，我只残留这点影子，风一吹，大概就要散了。神形俱灭是我向列祖列宗的交代，阎鸳，妹呢？”\n所以，阎夫人重重叩头下去，绝然道∶“阎鸳甘受此报。”语音稍停，她深吸口气，又道∶“列祖列宗在上，在此封界之中，宗门弟子有一人不出此囚，阎鸳亦不生出。如有违誓，当永沦幽狱，元神着万劫之咒，生死无由。”\n《幽冥仙途》'
        },

        "2005": {
            name: '海皇苏摩', // 物品名称
            img: 'img/haihuangsumo', // 图片
            atlasName: 'haihuangsumo', 
            desc: '苏摩的灵魂并不曾消散，鲛人的灵魂永远在海天之间徘徊……', // 物品描述
            type: 2, // 0 材料 1 符  2 装备
            // 基础评分
            pingfen: 8750,
            qianghuaxishu: 1.19, // 每次强化评分系数
            // 基础物理攻击
            wuligongji: {
                min: 900, // 最小
                max: 1550, // 最大
                qianghua: 91, // 每次强化增加值
                desc: '物理攻击力',
            },
            // 基础物理防御
            wulifangyu: {
                min: 90,
                max: 175,
                qianghua: 20, // 每次强化增加值
                desc: '物理防御力',
            },
            // 基础魔法攻击
            mofagongji: {
                min: 1080,
                max: 1700,
                qianghua: 20, // 每次强化增加值
                desc: '魔法攻击力',
            },
            
            // 基础魔法防御
            mofafangyu: {
                min: 210,
                max: 295,
                qianghua: 30, 
                desc: '魔法防御力',
            },
            // 暴击率
            baoji: {
                min: 2,
                max: 6,
                qianghua: 0.4,
                desc: '暴击',
            },
            detailStory: '得知白璎前去对抗破坏神，苏摩立即去追白璎，并用星魂血誓，这个逆转星辰的可怕的法术，将一半的血给了白璎，让白璎拥有了“人”的实体。这个法术完成后，他们享有共同的命运，苏摩以一半的生命只为换来与白璎共死的权利，以弥补当年在白塔之上犯下的过错。在去塔顶前苏摩又给白璎施下“逆风”枯荣转轮的法术，这样一来，白璎受到的一切伤害都会转换到苏摩身上。在白塔上，苏摩体内的“恶”被破坏神召唤出来，攻击并伤害了白璎，却也让苏摩恢复神志，让他自己看到后果。由于先前的法术，白璎没有受到任何伤害苏摩却出现衰竭……他的法术在衰退，他惊动天地的容貌也在凋谢，而他却命令不能让白璎知道。又叫来溟火女祭，在谁也不知道的情况下远赴怒海外的哀塔，斩血。四十九天的斩血流尽了他体内所有的血，那是作为一个人无法承受的痛苦。但因此，白璎就拥有了新的生命，并且不会被他拖向死亡。苏摩把自己所有祭献给了上天，解开了和白璎的生死之盟，使阿诺死亡，获得了最初纯净的灵魂，也获得了巨大的力量，可以将一切水的力量发挥到极至。而这力量无法维持太长久，他，便会安眠于大海。在肉体死亡的那刻，苏摩操纵四海和他们一起战斗，实现了他的诺言。\n一切都结束了。\n鲛人回归碧落海，苏摩改变了星辰使得六王都得以复生，白璎随着鲛人去了碧落海，远赴哀塔找到了苏摩的遗体，并一个人在哀塔守候了十七年，在月圆之夜对着海祈祷。云荒每年十月十五的潮汐准时造访，壮丽无比，而这天，也被定为“海皇祭”。'
        },

        "2006": {
            name: '慈航普渡', // 物品名称
            img: 'img/cihangpudu', // 图片
            atlasName: 'cihangpudu', 
            desc: '楚秦掌门齐休佩剑，品阶不高但胜在卖相十足，用于装点门面', // 物品描述
            type: 2, // 0 材料 1 符  2 装备
            // 基础评分
            pingfen: 8750,
            qianghuaxishu: 1.19, // 每次强化评分系数
            // 基础物理攻击
            wuligongji: {
                min: 900, // 最小
                max: 1550, // 最大
                qianghua: 91, // 每次强化增加值
                desc: '物理攻击力',
            },
            // 基础物理防御
            wulifangyu: {
                min: 90,
                max: 175,
                qianghua: 20, // 每次强化增加值
                desc: '物理防御力',
            },
            // 基础魔法攻击
            mofagongji: {
                min: 1080,
                max: 1700,
                qianghua: 20, // 每次强化增加值
                desc: '魔法攻击力',
            },
            
            // 基础魔法防御
            mofafangyu: {
                min: 210,
                max: 295,
                qianghua: 30, 
                desc: '魔法防御力',
            },
            // 暴击率
            baoji: {
                min: 2,
                max: 6,
                qianghua: 0.4,
                desc: '暴击',
            },
            detailStory: '本命由天授，同参伴我行\n逍遥两相对，一道诵黄庭\n在一个由灵根、本命、同参三者合一修行的无垠世界里，\n主角齐休偶然得到掌门之位，带领弱小的门派奋斗挣扎\n从一位练气底层的而立中年，到如神般俯瞰众生的睿智老者\n门派在他手中发展、壮大，写下如梦如电，波澜壮阔的一生\n《修真门派掌门路》'
        },

        "2007": {
            name: '紫焱魔刀', // 物品名称
            img: 'img/ziyanmodao', // 图片
            atlasName: 'ziyanmodao', 
            desc: '齐云楚震意外得到的魔到，斩落高广盛元婴的魔器', // 物品描述
            type: 2, // 0 材料 1 符  2 装备
            // 基础评分
            pingfen: 7650,
            qianghuaxishu: 1.08, // 每次强化评分系数
            // 基础物理攻击
            wuligongji: {
                min: 900, // 最小
                max: 1550, // 最大
                qianghua: 91, // 每次强化增加值
                desc: '物理攻击力',
            },
            // 基础物理防御
            wulifangyu: {
                min: 90,
                max: 175,
                qianghua: 20, // 每次强化增加值
                desc: '物理防御力',
            },
            // 基础魔法攻击
            mofagongji: {
                min: 1000,
                max: 1200,
                qianghua: 20, // 每次强化增加值
                desc: '魔法攻击力',
            },
            
            // 基础魔法防御
            mofafangyu: {
                min: 210,
                max: 295,
                qianghua: 30, 
                desc: '魔法防御力',
            },
            // 暴击率
            baoji: {
                min: 4,
                max: 6,
                qianghua: 0.4,
                desc: '暴击',
            },
            detailStory: '两千年如烟往事，回首尽是无妄笑谈\n善恶福祸，绵延子子孙孙\n一朝间道德俱丧，挥刀了却仇雠性命\n恩怨利禄，同归魑魅魍魉\n大道苦海，浮游不得超脱\n人世悲凉，唯有许多眷恋...'
        },

        "2008": {
            name: '重返阳光之上', // 物品名称
            img: 'img/chongfanyangguangzhishang', // 图片
            atlasName: 'chongfanyangguangzhishang', 
            desc: '从一代魔王格顿到魔王卡奇云德，魔族无日不梦想着重回地面，整场千年战争中，魔族共建立过一万九千一百一十二个军团，而战死者有有数千万人之巨，在他们的守护者神殿里刻满了名字。无数阵亡者的名字簇拥着神殿中心那块由卡奇云德亲手刻出深槽，溶岩流淌其上而形成的血红大字：重返阳光之土！', // 物品描述
            type: 2, // 0 材料 1 符  2 装备
            // 基础评分
            pingfen: 7650,
            qianghuaxishu: 1.08, // 每次强化评分系数
            // 基础物理攻击
            wuligongji: {
                min: 900, // 最小
                max: 1550, // 最大
                qianghua: 91, // 每次强化增加值
                desc: '物理攻击力',
            },
            // 基础物理防御
            wulifangyu: {
                min: 90,
                max: 175,
                qianghua: 20, // 每次强化增加值
                desc: '物理防御力',
            },
            // 基础魔法攻击
            mofagongji: {
                min: 1000,
                max: 1200,
                qianghua: 20, // 每次强化增加值
                desc: '魔法攻击力',
            },
            
            // 基础魔法防御
            mofafangyu: {
                min: 210,
                max: 295,
                qianghua: 30, 
                desc: '魔法防御力',
            },
            // 暴击率
            baoji: {
                min: 4,
                max: 6,
                qianghua: 0.4,
                desc: '暴击',
            },
            detailStory: '“今天在这里的人，将承担起光荣的使命。你们要听好我说的每一个字，我们魔族的祖先，曾生活于阳光之下，那里有广阔的草原与雄壮的山脉、无尽的森林，那是我伊德尔族曾生息之地。是战争将我族驱入黑暗，我族也必要以铁血重返若星汉天空之下。地下已不再是我魔族容身之所，我们要冲出亡灵之地，重返阳光之土。亡灵，人族，矮人，精灵，所有阻挡我等者，便是我们的敌人！今日这里跪倒的每一个人，将来都会是这场艰难远征中的核心之人，你们现在在魔王圣座前发誓，不论未来之远征有何等艰险困苦，必绝不退后一步，直到重回我祖先发源之地，世世代代繁衍，再不离弃家园。”魔神殿的这番热血沸腾的宣誓，便是之后艰苦的战争的开端，三百万的伊德尔族人，到了最后又有多少能够看到阳光。不过与其在这黑暗的地下发霉腐朽，不如让战刀磨出烈火！'
        },

        "2009": {
            name: '天琊神剑', // 物品名称
            img: 'img/tianyashenjian', // 图片
            atlasName: 'tianyashenjian', 
            desc: '天琊最早出现是在千年前一个散仙枯心上人手中，传说这法宝乃九天异铁落入凡间，枯心上人在北极冰原偶得，修炼而成。', // 物品描述
            type: 2, // 0 材料 1 符  2 装备
            // 基础评分
            pingfen: 7650,
            qianghuaxishu: 1.08, // 每次强化评分系数
            // 基础物理攻击
            wuligongji: {
                min: 900, // 最小
                max: 1550, // 最大
                qianghua: 91, // 每次强化增加值
                desc: '物理攻击力',
            },
            // 基础物理防御
            wulifangyu: {
                min: 90,
                max: 175,
                qianghua: 20, // 每次强化增加值
                desc: '物理防御力',
            },
            // 基础魔法攻击
            mofagongji: {
                min: 1000,
                max: 1200,
                qianghua: 20, // 每次强化增加值
                desc: '魔法攻击力',
            },
            
            // 基础魔法防御
            mofafangyu: {
                min: 210,
                max: 295,
                qianghua: 30, 
                desc: '魔法防御力',
            },
            // 暴击率
            baoji: {
                min: 4,
                max: 6,
                qianghua: 0.4,
                desc: '暴击',
            },
            detailStory: '你救我护我，不惜自己的性命，我便一般对你了。你心中苦楚，天知我知，我不能分担你的痛楚，便与你一道承担。总希望有一日，你能与心中爱人，欢欢喜喜在一起...',
        },

        "2010": {
            name: '至圣流炎刃', // 物品名称
            img: 'img/zhishengliuyanren', // 图片
            atlasName: 'zhishengliuyanren', 
            desc: '引九天之上，至圣之炎...', // 物品描述
            type: 2, // 0 材料 1 符  2 装备
            // 基础评分
            pingfen: 8750,
            qianghuaxishu: 1.19, // 每次强化评分系数
            // 基础物理攻击
            wuligongji: {
                min: 900, // 最小
                max: 1550, // 最大
                qianghua: 91, // 每次强化增加值
                desc: '物理攻击力',
            },
            // 基础物理防御
            wulifangyu: {
                min: 90,
                max: 175,
                qianghua: 20, // 每次强化增加值
                desc: '物理防御力',
            },
            // 基础魔法攻击
            mofagongji: {
                min: 1080,
                max: 1700,
                qianghua: 20, // 每次强化增加值
                desc: '魔法攻击力',
            },
            
            // 基础魔法防御
            mofafangyu: {
                min: 210,
                max: 295,
                qianghua: 30, 
                desc: '魔法防御力',
            },
            // 暴击率
            baoji: {
                min: 2,
                max: 6,
                qianghua: 0.4,
                desc: '暴击',
            },
            detailStory: ''
        },
    },


    initZhuangbeiLv2: function(goodid, _lvl){
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
            qianghuaLvl: 0, 
            guanzhuLvL: 1, 
            selected: 0,
            lvl,
            creatorName: window.global.userInfo ? window.global.userInfo.nickName : '神秘人', 
            // 附加
            fujia: fujia.map(item=>{
                return window.allfujia[item]
            })
        };

        // 寻找相同的id的
        let _ = window.global.goods.filter(item=>{
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
}

module.exports = zhuangbei;