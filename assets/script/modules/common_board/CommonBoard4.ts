
import { ObjectPool } from 'core/ObjectPool';
import * as fgui from "fairygui-cc";
import { ViewManager } from 'manager/ViewManager';
import { UISpineShow } from 'modules/scene_obj_spine/UISpineShow';
import { Timer } from 'modules/time/Timer';
import { ResPath } from 'utils/ResPath';
import { CocSpriteGradient } from '../../ccomponent/CocSpriteGradient';

export class CommonBoard4 extends fgui.GLabel {
    private sp_show1: UISpineShow = undefined;
    private sp_show2: UISpineShow = undefined;
    private timer_rt: any = undefined;

    protected viewNode = {
        bg: <fgui.GImage>null,
        parent: <fgui.GComponent>null,
    }

    protected onConstruct() {
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }

    FlushShow(callback: Function, effshow = true, mat_name = "mat_battle_save_view"): void {
        let gradient = this.viewNode.bg._content.addComponent(CocSpriteGradient);
        gradient.setMaterialName(mat_name);

        this.sp_show1 = ObjectPool.Get(UISpineShow, ResPath.UIEffect("1208042"), true, (obj: any) => {
            this.viewNode.parent._container.insertChild(obj, 1);
            if (effshow) {
                this.EffShow()
            }
            this.timer_rt = Timer.Inst().AddRunTimer(callback, 0.04, 1, false)
            // callback && callback();
        });
    }

    EffShow() {
        this.sp_show2 = ObjectPool.Get(UISpineShow, ResPath.UIEffect("1208040"), true, (obj: any) => {
            this.viewNode.parent._container.insertChild(obj, 2);
        });
    }

    protected onDestroy(): void {
        if (this.sp_show1) {
            ObjectPool.Push(this.sp_show1);
        }
        if (this.sp_show2) {
            ObjectPool.Push(this.sp_show2);
        }
        Timer.Inst().CancelTimer(this.timer_rt)
    }
}