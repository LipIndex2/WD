
import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { BaseView, ViewLayer, ViewMask, viewRegcfg } from 'modules/common/BaseView';
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { Timer } from "modules/time/Timer";
import { ResPath } from "utils/ResPath";

@BaseView.registView
export class TerritoryCartGetView extends BaseView {
    showItem: any[] = [];

    private sp_show1: UISpineShow = undefined;
    private sp_show2: UISpineShow = undefined;
    private sp_show3: UISpineShow = undefined;
    private sp_show4: UISpineShow = undefined;

    private timer_rt: any
    private sp_obj: any

    protected viewRegcfg: viewRegcfg = {
        UIPackName: "TerritoryCartGet",
        ViewName: "TerritoryCartGetView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        NotHideAnim: true,
        // OpenAudio: AudioTag.HuoDeDaoJu,
    };

    protected viewNode = {
        BtnContinue: <fgui.GButton>null,
    };

    InitData() {
        this.viewNode.BtnContinue.onClick(this.OnClickContinue, this);
    }

    DoOpenWaitHandle() {
        this.sp_show4 = ObjectPool.Get(UISpineShow, ResPath.UIEffect("1208108"), true, (obj1: any) => {
            obj1.setPosition(400, -800);
            this.view._container.insertChild(obj1, 0);

            this.timer_rt = Timer.Inst().AddRunTimer(() => {
                Timer.Inst().CancelTimer(this.timer_rt)
                this.timer_rt = Timer.Inst().AddRunTimer(() => {
                    // this.sp_show3 = ObjectPool.Get(UISpineShow, ResPath.UIEffect("1208105"), true, (obj: any) => {
                    //     obj.setPosition(400, -700);
                    //     this.view._container.insertChild(obj, 0);
                    // });
                    Timer.Inst().CancelTimer(this.timer_rt)
                    this.timer_rt = Timer.Inst().AddRunTimer(() => {
                        // obj.setPosition(400, -800);
                        this.view._container.insertChild(obj1, 1);
                    }, 0.4, 1, false)
                }, 0.2, 1, false)
            }, 0.1, 1, false)
        });
    }

    CloseCallBack() {
        if (this.sp_show1) {
            ObjectPool.Push(this.sp_show1);
        }
        if (this.sp_show2) {
            ObjectPool.Push(this.sp_show2);
        }
        if (this.sp_show3) {
            ObjectPool.Push(this.sp_show3);
        }
        if (this.sp_show4) {
            ObjectPool.Push(this.sp_show4);
        }

        Timer.Inst().CancelTimer(this.timer_rt)
    }

    OnClickContinue() {
        ViewManager.Inst().CloseView(TerritoryCartGetView)
    }
}