// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
   extends: cc.Component,   
   properties: {
       target: cc.Node,
   },
   
   

   onLoad() {
       //缓存原始父节点
       this._oldPosition = this.node.position;

        console.log('onLoad', this._copy)
        if(!this._copy){
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
        }else{

        }
       
   },   
   _onTouchMove(touchEvent) {

        if(!this.moveCopy){
            this.moveCopy = cc.instantiate(this.node);
            this._copy = true;
            this.moveCopy.scale = 0.8;
            this.moveCopy.opacity = 178;
            this.moveCopy.parent = window.gameScence;
            this.moveCopy.pauseSystemEvents();
        }else{}

       let location = touchEvent.getLocation();
    //    this.node.position = this.node.parent.convertToNodeSpaceAR(location);
       this.moveCopy.position = window.gameScence.convertToNodeSpaceAR(location);
   },  
   
    _onTouchEnd(touchEvent) {

        if(!this.moveCopy){
            return;
        }

       if (!this.target) {
           this.moveCopy.destroy();
           this.moveCopy = null;
           return;
       }
       //获取target节点在父容器的包围盒，返回一个矩形对象
       let rect = this.target.getBoundingBox();
       //使用target容器转换触摸坐标
        let location = touchEvent.getLocation();
       let point = this.target.parent.convertToNodeSpaceAR(location);
       //if (cc.rectContainsPoint(rect, targetPoint)) {
       //Creator2.0使用rect的成员contains方法
        if (rect.contains(point)) {
            //在目标矩形内，修改节点坐标  
           point = this.target.convertToNodeSpaceAR(location);
           this.node.position = point;
            //修改父节点
           this.node.parent = this.target;
           return;
       }
       this.moveCopy.destroy();
       this.moveCopy = null;
        //不在矩形中，还原节点位置    
       this.node.position = this._oldPosition;
   }
});
