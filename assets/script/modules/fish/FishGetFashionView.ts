
import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { BagData } from "modules/bag/BagData";
import { Item } from "modules/bag/ItemData";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { ItemCell } from "modules/extends/ItemCell";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { FishConfig } from "./FishConfig";
import { FishCtrl } from "./FishCtrl";
import { FishData } from "./FishData";

@BaseView.registView
export class FishGetFashionView extends BaseView {
    private sp_show1: UISpineShow = undefined;
    private sp_show2: UISpineShow = undefined;
    private imageId: number
    private toolType: number
    private sellPrice: number

    protected viewRegcfg = {
        UIPackName: "FishGetFashion",
        ViewName: "FishGetFashionView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlock,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        BtnSell: <fgui.GButton>null,
        BtnWear: <fgui.GButton>null,
        GpSell: <fgui.GGroup>null,

        PriceSp: <fgui.GLoader>null,

        NameShow: <fgui.GTextField>null,
        TypeShow: <fgui.GTextField>null,
        AttrShow: <fgui.GTextField>null,
        PriceShow: <fgui.GTextField>null,
        CellShow: <ItemCell>null,
    };

    DoOpenWaitHandle() {
        this.sp_show1 = ObjectPool.Get(UISpineShow, ResPath.UIEffect("1208123"), true, (obj: any) => {
            obj.setPosition(400, -700);
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
        FishData.Inst().FishState = FishConfig.FishState.idle
    }

    InitData(param?: { reward_data: IPB_ItemData }) {
        this.viewNode.BtnSell.onClick(this.OnClickSell, this);
        this.viewNode.BtnWear.onClick(this.OnClickWear, this);

        if (param && param.reward_data) {
            this.FlushShow(param.reward_data)
        }
    }

    FlushShow(reward_data: IPB_ItemData) {
        let co_image = FishData.Inst().CfgToolImageByJihuoItem(reward_data.itemId)
        let num = BagData.Inst().GetItemNum(co_image.jihuo_item)
        this.imageId = co_image.image_id
        this.toolType = co_image.image_type
        this.sellPrice = co_image.fish_cion

        UH.SetText(this.viewNode.NameShow, co_image.image_name)
        UH.SetText(this.viewNode.TypeShow, Language.Fish.GetFashion.TypeShow[co_image.image_type - 1])
        UH.SetText(this.viewNode.AttrShow, TextHelper.Format(Language.Fish.GetFashion.AttrShow[co_image.image_type - 1], co_image.parm / 100))
        UH.SetText(this.viewNode.PriceShow, co_image.fish_cion)
        UH.SetIcon(this.viewNode.PriceSp, Item.GetIconId(FishData.Inst().CfgOtherFishCoin), ICON_TYPE.ITEM)
        this.viewNode.CellShow.SetData(Item.Create(reward_data, { is_num: false }))
        this.viewNode.BtnWear.visible = 0 == num
        this.viewNode.GpSell.visible = num > 0
    }

    OnClickSell() {
        ViewManager.Inst().CloseView(FishGetFashionView)
        FishCtrl.Inst().SendRoleFishReqFashionSell(this.imageId)

        FishData.Inst().SellPrice = FishData.Inst().GetSellPrice(this.sellPrice)
    }

    OnClickWear() {
        ViewManager.Inst().CloseView(FishGetFashionView)
        FishCtrl.Inst().SendRoleFishReqFashion(this.toolType, this.imageId)
    }

}
