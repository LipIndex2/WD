
import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { EGLoader } from "modules/extends/EGLoader";
import { ItemCell } from "modules/extends/ItemCell";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";

@BaseView.registView
export class FishRewardView extends BaseView {
    private sp_show1: UISpineShow = undefined;
    private sp_show2: UISpineShow = undefined;

    protected viewRegcfg = {
        UIPackName: "FishReward",
        ViewName: "FishRewardView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: false,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        bg: <EGLoader>null,

        BtnConfirm: <fgui.GButton>null,

        CellShow: <ItemCell>null,
    };

    // protected extendsCfg = [
    //     { ResName: "HeroItem", ExtendsClass: TodayGainViewHeroItem },
    // ]

    DoOpenWaitHandle() {
        this.sp_show1 = ObjectPool.Get(UISpineShow, ResPath.UIEffect("1208123"), true, (obj: any) => {
            obj.setPosition(400, -800);
            this.view._container.insertChild(obj, 0);
        });
        this.sp_show2 = ObjectPool.Get(UISpineShow, ResPath.UIEffect("1208018"), true, (obj: any) => {
            obj.setPosition(400, -800);
            this.view._container.insertChild(obj, 0);
        });

    }

    CloseCallBack(): void {
        if (this.sp_show1) {
            ObjectPool.Push(this.sp_show1);
        }
        if (this.sp_show2) {
            ObjectPool.Push(this.sp_show2);
        }
    }

    InitData(reward: any): void {
        this.viewNode.BtnConfirm.onClick(this.OnClickConfirm, this);

        this.viewNode.CellShow.SetData(Item.Create(reward, { is_num: true, is_click: false }))
    }

    OnClickConfirm() {
        ViewManager.Inst().CloseView(FishRewardView)
    }
}
