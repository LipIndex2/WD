import { _decorator, Component, MotionStreak, Node } from 'cc';
const { ccclass, property } = _decorator;

//针对技能缩放导致拖尾有问题的组件
@ccclass('SkillScaleChange')
export class SkillScaleChange extends Component {
    @property(MotionStreak)
    motionStreak:MotionStreak;

    private initstroke:number;
    protected onLoad(): void {
        this.initstroke = this.motionStreak.stroke;
    }
    // start() {
    //     this.node.on(Node.EventType.SIZE_CHANGED, ()=>{
    //     })
    // }

    protected onEnable(): void {
        this.motionStreak.stroke = this.initstroke * this.node.scale.x;
    }
}

