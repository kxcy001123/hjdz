// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  @property(cc.Node)
  bg: cc.Node = null; //背景图

  @property(cc.Node)
  cam: cc.Node = null; //相机

  @property(cc.Float)
  autoMoveSpeed = 0.1;

  @property(cc.Boolean)
  manualMoving = false;

  @property(cc.Boolean)
  isManual = false;

  @property(cc.String)
  position = "";

  onLoad() {
    if (this.isManual) {
      this.bg.on(cc.Node.EventType.TOUCH_MOVE, this.move, this); //给背景绑定事件
      this.bg.on(cc.Node.EventType.TOUCH_END, this.moveEnd, this); //给背景绑定事件
    }

    this.cam.width = this.node.width; //相机的宽为canvas的宽
    this.cam.height = this.node.height; //相机的高为canvas的高

    this.manualMoving = false;
    this.position = "";
  }

  move(event: cc.Event.EventTouch) {
    let last_pos = event.getPreviousLocation(); //获取触点在上一次事件时的位置对象，对象包含 x 和 y 属性
    let pos = event.getLocation(); //获取触点位置
    var dir = last_pos.sub(pos); //做向量减法
    this.cam.x += dir.x; //移动相机的X坐标
    this.cam.y += dir.y; //移动相机的Y坐标
    this.manualMoving = true;
  }

  moveEnd(event: cc.Event.EventTouch) {
    this.manualMoving = false;
  }

  update(dt) {
    if (!this.manualMoving) {
      this.autoMove(dt);
    }

    if (this.cam.x - this.cam.width / 2 < this.bg.x - this.bg.width / 2) {
      this.cam.x = this.bg.x - this.bg.width / 2 + this.cam.width / 2;
      console.log("到左边的边缘了"); //如果相机的最左边小于了背景的最左边那么相机的X坐标就等于背景的最左边加上相机的宽的一半
      this.position = "left";
    }
    if (this.cam.x + this.cam.width / 2 > this.bg.x + this.bg.width / 2) {
      this.cam.x = this.bg.x + this.bg.width / 2 - this.cam.width / 2;
      console.log("到右边的边缘了"); //如果相机的最右边大于了背景的最右边那么相机的X坐标就等于背景的最右边减去相机的宽的一半
      this.position = "right";
    }
    if (this.cam.y + this.cam.height / 2 > this.bg.y + this.bg.height / 2) {
      this.cam.y = this.bg.y + this.bg.height / 2 - this.cam.height / 2;
      console.log("到上边的边缘了"); //如果相机的最上边大于了背景的最上边那么相机的Y坐标就等于背景的最上边减去相机的高的一半
      this.position = "top";
    }
    if (this.cam.y - this.cam.height / 2 < this.bg.y - this.bg.height / 2) {
      this.cam.y = this.bg.y - this.bg.height / 2 + this.cam.height / 2;
      console.log("到下边的边缘了"); //如果相机的最下边小于了背景的最下边那么相机的Y坐标就等于背景的最下边加上相机的高的一半
      this.position = "bottom";
    }
  }

  autoMove(dt) {
    switch (this.position) {
      case "left":
        this.autoMoveToTop(dt);
        break;
      case "top":
        this.autoMoveToRight(dt);
        break;
      case "right":
        this.autoMoveToBottom(dt);
        break;
      case "bottom":
        this.autoMoveToLeft(dt);
        break;
      default:
        this.autoMoveToLeft(dt);
    }
  }

  autoMoveToLeft(dt) {
    if (!this.manualMoving) {
      this.cam.x -= dt * this.autoMoveSpeed;
      return;
    }
  }

  autoMoveToRight(dt) {
    if (!this.manualMoving) {
      this.cam.x += dt * this.autoMoveSpeed;
      return;
    }
  }

  autoMoveToTop(dt) {
    if (!this.manualMoving) {
      this.cam.y += dt * this.autoMoveSpeed;
      return;
    }
  }

  autoMoveToBottom(dt) {
    if (!this.manualMoving) {
      this.cam.y -= dt * this.autoMoveSpeed;
      return;
    }
  }
}
