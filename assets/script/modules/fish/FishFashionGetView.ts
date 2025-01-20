
import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { Language } from "modules/common/Language";
import { EGLoader } from "modules/extends/EGLoader";
import { ItemCell } from "modules/extends/ItemCell";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { FishData } from "./FishData";

@BaseView.registView
export class FishFashionGetView extends BaseView {
    private sp_show1: UISpineShow = undefined;
    private sp_show2: UISpineShow = undefined;

    protected viewRegcfg = {
        UIPackName: "FishFashionGet",
        ViewName: "FishFashionGetView",
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
        AttrShow: <fgui.GRichTextField>null,
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

    InitData(image_id: any): void {
        this.viewNode.BtnConfirm.onClick(this.OnClickConfirm, this);

        let co = FishData.Inst().CfgToolImageByImageId(image_id)
        if (co) {
            this.viewNode.CellShow.SetData(Item.Create({ itemId: co.show_item }, { is_num: false, is_click: false }))
            UH.SetText(this.viewNode.AttrShow, TextHelper.Format(Language.Fish.Fashion.AttrShow, co.image_name, co.parm / 100))
        }
    }

    OnClickConfirm() {
        ViewManager.Inst().CloseView(FishFashionGetView)
    }
}
