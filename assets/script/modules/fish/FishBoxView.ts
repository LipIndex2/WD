
import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { EGLoader } from "modules/extends/EGLoader";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { Timer } from "modules/time/Timer";
import { ResPath } from "utils/ResPath";
import { FishBoxInfoView } from "./FishBoxInfoView";
import { FishConfig } from "./FishConfig";
import { FishData } from "./FishData";

@BaseView.registView
export class FishBoxView extends BaseView {
    private sp_show: UISpineShow = undefined;

    protected viewRegcfg = {
        UIPackName: "FishBox",
        ViewName: "FishBoxView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: false,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode: { [key: string]: any } = {
        bg: <EGLoader>null,

        BtnReturn: <fgui.GButton>null,
        BtnTips: <fgui.GButton>null,

        FishItem1: <FishBoxViewFishItem>null,
        FishItem2: <FishBoxViewFishItem>null,
        FishItem3: <FishBoxViewFishItem>null,
        FishItem4: <FishBoxViewFishItem>null,
        FishItem5: <FishBoxViewFishItem>null,
        FishItem6: <FishBoxViewFishItem>null,
        FishItem7: <FishBoxViewFishItem>null,
        FishItem8: <FishBoxViewFishItem>null,
    };

    protected extendsCfg = [
        { ResName: "FishItem", ExtendsClass: FishBoxViewFishItem },
    ]

    DoOpenWaitHandle() {
        let waitHandle = this.createWaitHandle("loadBG")
        this.AddWaitHandle(waitHandle);
        this.viewNode.bg.SetIcon("loader/fish/BeiJingBox", () => {
            waitHandle.complete = true;
            // this.refreshBgSize(this.viewNode.bg)
        })

        this.sp_show = ObjectPool.Get(UISpineShow, ResPath.UIEffect("1208124"), true, (obj: any) => {
            obj.setPosition(0, 0);
            this.view._container.insertChild(obj, 1);
        });
    }

    CloseCallBack(): void {
        if (this.sp_show) {
            ObjectPool.Push(this.sp_show);
        }
    }

    InitData() {
        this.viewNode.BtnReturn.onClick(this.OnClickReturn, this);
        this.viewNode.BtnTips.onClick(this.OnClickTips, this);

        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushInfo.bind(this), "FlushFishListInfo");

        FishData.Inst().BoxRedNum = 0
    }

    InitUI() {
        this.FlushInfo()
    }

    FlushInfo() {
        FishData.Inst().BoxFish = []
        for (let i = 1; i <= 8; i++) {
            this.viewNode[`FishItem${i}`].FlushShow()
        }
    }

    OnClickReturn() {
        ViewManager.Inst().CloseView(FishBoxView)
    }

    OnClickTips() {
        ViewManager.Inst().OpenView(FishBoxInfoView)
    }
}

export class FishBoxViewFishItem extends BaseItem {
    private sp_show: UISpineShow = undefined;
    private timer_dt: any
    private fishObj: any
    private fishType: number
    private fishId: number
    private pos_c: { x: number, y: number } = { x: 0, y: 0 }

    FlushShow(point_from?: any) {
        this.fishObj = undefined
        if (this.sp_show) {
            ObjectPool.Push(this.sp_show);
            this.sp_show = undefined
        }

        let fish = FishData.Inst().GetBoxRandFish(this.fishId)
        if (fish) {
            this.fishType = fish.type
            this.fishId = fish.fish_id
            this.sp_show = ObjectPool.Get(UISpineShow, ResPath.Fish(fish.res_id), true, (obj: any) => {
                this.fishObj = obj
                obj.setScale(fish.scale, fish.scale);
                this._container.insertChild(obj, 0);
                let point = point_from ?? FishData.Inst().GetRandPoint(this.fishType)
                this.pos_c.x = point.pos_x
                this.pos_c.y = -point.pos_y
                obj.setPosition(this.pos_c.x, this.pos_c.y)
                this.RandShow(point, FishData.Inst().GetRandPoint(this.fishType), false)
            });
        }
    }

    RandShow(point_from: any, point_to: any, change = true) {
        Timer.Inst().CancelTimer(this.timer_dt)
        if (point_from.pos_x == point_to.pos_x && point_from.pos_y == point_to.pos_y) {
            this.RandShow(point_from, FishData.Inst().GetRandPoint(this.fishType))
            return
        }
        if (change && (point_from.pos_x < 0 || point_from.pos_x > 800 || point_from.pos_y < 0 || point_from.pos_y > 1600)) {
            this.FlushShow(point_from)
            return
        }

        let mark_x = point_to.pos_x > point_from.pos_x ? 1 : -1
        let mark_y = point_to.pos_y > point_from.pos_y ? 1 : -1
        this.fishObj.setScale(this.fishObj.scale.y * mark_x, this.fishObj.scale.y)

        this.timer_dt = Timer.Inst().AddRunTimer(() => {
            if (!this.fishObj) {
                Timer.Inst().CancelTimer(this.timer_dt)
                return
            }
            let speed_x = mark_x * FishConfig.BOX_FISH_SPEED
            let speed_y = mark_y * FishConfig.BOX_FISH_SPEED

            let is_dis = true
            if (Math.abs((point_to.pos_x - this.pos_c.x)) < FishConfig.BOX_FISH_SPEED) {
                this.pos_c.x = point_to.pos_x
            } else {
                is_dis = false
                this.pos_c.x = this.pos_c.x + speed_x
            }
            if (Math.abs((point_to.pos_y + this.pos_c.y)) < FishConfig.BOX_FISH_SPEED) {
                this.pos_c.y = -point_to.pos_y
            } else {
                is_dis = false
                this.pos_c.y = this.pos_c.y - speed_y
            }

            this.fishObj.setPosition(this.pos_c.x, this.pos_c.y)

            if (is_dis) {
                this.RandShow(point_to, FishData.Inst().GetRandPoint(this.fishType))
            }
        }, 0.05, -1, false)
    }

    protected onDisable(): void {
        super.onDisable()

        if (this.sp_show) {
            ObjectPool.Push(this.sp_show);
            this.sp_show = undefined
        }
        this.fishObj = undefined
    }
}

