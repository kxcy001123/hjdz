var all_cailiao = require('Cailiao')

cc.Class({
    extends: cc.Component,

    properties: {
        slotPrefab: {
            default: null,
            type: cc.Prefab
        },
        scrollView: {
            default: null,
            type: cc.ScrollView
        },
        selectedInfo:{
            default: null,
            type: cc.Node
        },
        selectedGoodName: {
            default: null,
            type: cc.Label
        },
        selectedGoodDesc: {
            default: null,
            type: cc.Label
        },
        totalCount: 0,
        // 整理按钮
        btnSort: {
            default: null,
            type: cc.Node,
        },
        // 查看按钮
        btnView: {
            default: null,
            type: cc.Node,
        },
        // 合成按钮
        btnComp: {
            default: null,
            type: cc.Node,
        },
        // 炼器按钮
        btnLianqi: {
            default: null,
            type: cc.Node,
        }

    },

    init: function (home) {
        var self = this;
        this.node.off('goodSelect', this.handleGoodSelect, this);
        this.node.on('goodSelect', this.handleGoodSelect,this);

        this.heroSlots = [];
        this.scrollView.content.removeAllChildren();

        let goods = window.global.goods;

        this.home = home;
        for (let i = 0; i < goods.length; ++i) {
            let goodParams = goods[i];
            // 区分类型， 装备会有多个
            let goodId = goodParams.goodId;

            goodId = goodId.split('****')[0];

            // 融合物品的基础属性与私有属性
            let _goodParams = {
                ...window.allGoods[goodId],
                ...goodParams,
                selected: 0,
            }
            let timer = setInterval(function(){
                if(_goodParams.count > 0){
                    let heroSlot = self.addHeroSlot(_goodParams);
                    self.heroSlots.push(heroSlot);
                }   
                clearInterval(timer)
            }, i* 40)
            
        }
    },

    refreshAll: function(){
        this.selectedInfo.active = false;
        this.init();
        this.node.active = true;
        this.hideBtns();
        this.scrollView.content.removeAllChildren();
    },

    refreshGood: function (good){
        var self = this;

        if(!this.heroSlots){
            return;
        }
        let selected = 0;
        if(window.global.currentSelectedGood && window.global.currentSelectedGood.goodId === good.goodId){
            selected = 1;
        }

        // 融合物品的基础属性与私有属性
        let _goodParams = {
            ...window.allGoods[good.goodId],
            ...good,
            selected,
        }

        let goodPerfab = this.heroSlots.find(item=>{
            return item.getComponent('HeroSlot').goodParams.goodId === _goodParams.goodId
        });
        if(goodPerfab){
            goodPerfab.getComponent('HeroSlot').refresh(_goodParams);
        }else{
            let heroSlot = self.addHeroSlot(_goodParams);
            self.heroSlots.push(heroSlot);
        }

        if(_goodParams.count === 0){
            goodPerfab.removeFromParent();
        }
    },

    handleGoodSelect: function (event){

        // 取消之前的选中
        let prevSelectedGood = this.currentSelectedGood;
        prevSelectedGood && prevSelectedGood.refresh({
            ...prevSelectedGood.goodParams,
            selected: 0,
        });
        // 选中当前的
        let _goodParams = {
            ...event.detail,
            // selected: (event.detail.selected === 0 || event.detail.selected === undefined) ? 1 : 0,
            selected: 1,

        }
        if(_goodParams.selected === 1){
            // 显示选中的物品名称与描述
            let name = `${event.detail.name}`;
            if(_goodParams.type === 2){
                name = `${window.zhuangbeilvl[_goodParams.lvl].desc}的${name}`
                name += ` + ${_goodParams.qianghuaLvl}`
            }
            this.selectedGoodName.string = name;
            this.selectedGoodDesc.string = event.detail.desc;
            this.selectedInfo.active = true;
        }else{
            this.selectedInfo.active = false;
        }

        cc.log('window.global.currentSelectedGood', window.global.currentSelectedGood)

        // 显示物品对应的按钮
        if(window.global.currentSelectedGood){
            this.showBtns();
        }else{
            this.hideBtns();
        }


        this.currentSelectedGood = event.target.getComponent('HeroSlot');
        this.currentSelectedGood.refresh(_goodParams);
        event.stopPropagation();
    },

    /**
     * 显示物品对应的按钮
     */
    showBtns: function(){
        this.hideBtns();

        // 装备
        if(window.global.currentSelectedGood.type === 2){
            this.btnSort.active = true;
            this.btnView.active = true;
            this.btnLianqi.active = true;
        }

        // 符
        if(window.global.currentSelectedGood.type === 1){
            this.btnSort.active = true;
        }

        // 材料
        if(window.global.currentSelectedGood.type === 0){
            this.btnSort.active = true;
            // 存在升级
            if(window.global.currentSelectedGood.upgrateId){
                this.btnComp.active = true;
            }
        }

        
    },
    /**
     * 显示物品对应的按钮
     */
    hideBtns: function(){
        this.btnView.active = false;
        this.btnComp.active = false;
        this.btnLianqi.active = false;

    },
    addHeroSlot: function (goodParams) {
        let good = cc.instantiate(this.slotPrefab);
        good.active = true;
        // 生成不同的物品
        good.getComponent('HeroSlot').refresh(goodParams);
        this.scrollView.content.addChild(good);
        return good;
    },

    show: function () {
        this.init();
        this.node.active = true;
        this.node.emit('fade-in');
    },

    hide: function () {
        this.selectedInfo.active = false;
        this.node.active = false;

        // window.global.currentSelectedGood = null;
        this.node.emit('fade-out');
        this.hideBtns();
        this.scrollView.content.removeAllChildren();
    },

    // 整理背包
    sortBackPack: function(){
        let type2 = window.global.goods.filter(item=>{
            return window.allGoods[item.goodId.split('****')[0]].type === 2;
        });

        let type1 = window.global.goods.filter(item=>{
            return window.allGoods[item.goodId.split('****')[0]].type === 1;
        });

        let type0 = window.global.goods.filter(item=>{
            return window.allGoods[item.goodId.split('****')[0]].type === 0;
        });

        window.global.goods = type2.concat(type1, type0);
        this.scrollView.content.removeAllChildren();
        this.init();
    },
});
