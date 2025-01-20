import { Tween, Vec3, math, tween } from "cc";
import * as fgui from "fairygui-cc";
import { BaseItem } from "modules/common/BaseItem";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Timer } from "modules/time/Timer";
import { UH } from "../../helpers/UIHelper";


export class FlyIcon extends BaseItem {
    private timer_rt: any

    protected viewNode = {
        IconShow: <fgui.GLoader>null,
        ValueShow: <fgui.GTextField>null,
    };

    //起始坐标 x(小浮动) 变化dis (左右，dis越短 时间越短),
    //总时间 = 
    PlayTween(value: number, x: number = 395, y: number = 170, sp_name: string | number) {
        UH.SetIcon(this.viewNode.IconShow, sp_name, ICON_TYPE.ITEM);
        // let x = 395//中心坐标X
        // let y = 170//中心坐标Y 480
        let xStart = x + math.randomRange(-10, 11)//随机起始点X
        let dirs = [-1, 1]//抛出方向
        let dir = dirs[math.randomRangeInt(0, 2)]//随机方向
        let dis = math.randomRangeInt(100, 400)//随机抛出距离

        let xEnd = x + dir * dis//最终X坐标
        let yStart = y//Y起始
        let yEnd = y - 300 - math.randomRangeInt(0, 45)//Y 抛出高度
        let yEnd2 = y - math.randomRangeInt(0, 45)//掉落高度
        let time = dis / 300//过程总时间 抛出距离越大时间越长 150是最远距离
        this.viewNode.ValueShow.text = "";
        this.visible = true;
        this.viewNode.IconShow.visible = true;

        this.x = xStart
        this.y = yStart

        Tween.stopAllByTarget(this.node)
        Timer.Inst().CancelTimer(this.timer_rt)

        tween(this.node).to(time * 0.3, { position: new Vec3((xStart + (xEnd - xStart) * 0.3), -yEnd) }, { easing: "sineOut" }).to(time * 0.7, { position: new Vec3(xEnd, -yEnd2) }, { easing: "bounceOut" }).delay(0.2).to(time * 0.5, { position: new Vec3(xEnd, -yEnd2) }, { easing: "linear" }).start()

        this.timer_rt = Timer.Inst().AddRunTimer(() => {
            Timer.Inst().CancelTimer(this.timer_rt)
            this.viewNode.IconShow.visible = false
            this.viewNode.ValueShow.text = "+" + value
            this.timer_rt = Timer.Inst().AddRunTimer(() => {
                this.visible = false;
            }, 0.2, 1, false)
        }, time, 1, false)
        // this.twShow1 = fgui.GTween.to(xStart, xEnd, time)
        //     .setEase(fgui.EaseType.SineOut)
        //     .onUpdate((tweener: fgui.GTweener) => {
        //         this.x = tweener.value.x
        //     })
        //     .onComplete(() => {
        //         this.twShow1 = null
        //         this.twShow2 = fgui.GTween.to(this.y, this.y, 0.2)
        //             .onComplete(() => {
        //                 this.twShow2 = null
        //                 this.viewNode.IconShow.visible = false
        //                 this.viewNode.ValueShow.text = "+" + value
        //                 this.twShow3 = fgui.GTween.to(this.y, this.y - 120, 0.5)
        //                     .setEase(fgui.EaseType.Linear)
        //                     .onUpdate((tweener: fgui.GTweener) => {
        //                         this.y = tweener.value.x
        //                     })
        //                     .onComplete(() => {
        //                         this.twShow3 = null
        //                         this.visible = false;
        //                     })
        //             })
        //     });

        // this.twShow4 = fgui.GTween.to(yStart, yEnd, time * 0.3)
        //     .setEase(fgui.EaseType.SineOut)
        //     .onUpdate((tweener: fgui.GTweener) => {
        //         this.y = tweener.value.x

        //     }).onComplete(() => {
        //         this.twShow4 = null
        //         this.twShow5 = fgui.GTween.to(yEnd, yEnd2, time * 0.7)
        //             .setEase(fgui.EaseType.BounceOut)
        //             .onUpdate((tweener: fgui.GTweener) => {
        //                 this.y = tweener.value.x
        //             }).onComplete(() => {
        //                 this.twShow5 = null
        //             });
        //     })
    }

    protected onDisable() {
        super.onDisable();

        Tween.stopAllByTarget(this.node)
        Timer.Inst().CancelTimer(this.timer_rt)
    }
}