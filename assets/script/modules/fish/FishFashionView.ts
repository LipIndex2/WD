
import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { BagData } from "modules/bag/BagData";
import { Item } from "modules/bag/ItemData";
import { BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { ItemCell } from "modules/extends/ItemCell";
import { CellClicks } from "modules/extends/ItemCellFuncs";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { UISpinePlayData, UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { FishConfig } from "./FishConfig";
import { FishCtrl } from "./FishCtrl";
import { FishData } from "./FishData";
import { FishFashionGetView } from "./FishFashionGetView";

@BaseView.registView
export class FishFashionView extends BaseView {
    private spShow: UISpineShow = undefined;
    private toolLoad: boolean

    protected viewRegcfg = {
        UIPackName: "FishFashion",
        ViewName: "FishFashionView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,

        BtnWear: <fgui.GButton>null,
        BtnActive: <fgui.GButton>null,

        DescShow: <fgui.GTextField>null,
        PriceShow: <fgui.GTextField>null,
        PriceSp: <fgui.GLoader>null,
        ShowList: <fgui.GList>null,
        GpActive: <fgui.GGroup>null,
    };

    protected extendsCfg = [
        { ResName: "ShowButton", ExtendsClass: FishFashionViewShowButton },
    ]

    InitData() {
        this.viewNode.Board.SetData(new BoardData(FishFashionView));
        this.viewNode.Board.DecoShow(true);

        this.viewNode.BtnWear.onClick(this.OnClickWear, this);
        this.viewNode.BtnActive.onClick(this.OnClickActive, this);

        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushInfo.bind(this), "FlushInfo", "FlushToolInfo", "SelImageId");
        this.AddSmartDataCare(FishData.Inst().FlushData, this.FishSkin.bind(this), "SelImageId");

        let tool_info = FishData.Inst().InfoToolInfo
        if (tool_info[FishData.Inst().SelToolType - 1] && tool_info[FishData.Inst().SelToolType - 1].huanHuaId > 0) {
            FishData.Inst().SelImageId = tool_info[FishData.Inst().SelToolType - 1].huanHuaId
        } else {
            let show_list = FishData.Inst().GetFashionShowList()
            FishData.Inst().SelImageId = show_list[0].image_id
        }

        this.spShow = ObjectPool.Get(UISpineShow, ResPath.UIEffect("1208125"), true, (obj: any) => {
            obj.setPosition(600, -400);
            obj.setScale(0.5, 0.5);
            obj.setRotationFromEuler(0, 0, -45);
            this.view._container.insertChild(obj, 2);
            this.toolLoad = true
            this.FishSkin()
        });
    }

    InitUI() {
        this.FlushInfo()
    }
    private itemRenderer(index: number, item: any) {
        item.SetData(FishData.Inst().GetFashionShowList()[index]);
    }

    FlushInfo() {
        let show_list = FishData.Inst().GetFashionShowList()
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.ShowList.numItems = show_list.length;

        let co = FishData.Inst().CfgToolImageByImageId()
        if (co) {
            UH.SetText(this.viewNode.DescShow, TextHelper.Format(Language.Fish.Fashion.AttrShow[co.image_type - 1], co.image_name, co.parm / 100))
        }
        let actived = FishData.Inst().GetFashionActived()
        this.viewNode.BtnWear.visible = actived
        // this.viewNode.GpActive.visible = !actived
        if (actived) {
            let tool_info = FishData.Inst().InfoToolInfo
            let wear_id = tool_info[FishData.Inst().SelToolType - 1] ? tool_info[FishData.Inst().SelToolType - 1].huanHuaId : 0
            this.viewNode.BtnWear.title = wear_id == FishData.Inst().SelImageId ? Language.Fish.Fashion.BtnTaskOff : Language.Fish.Fashion.BtnWear
        } else {
            UH.SetText(this.viewNode.PriceShow, 1)
            UH.SetIcon(this.viewNode.PriceSp, Item.GetIconId(co.jihuo_item), ICON_TYPE.ITEM)
            this.viewNode.BtnActive.grayed = 0 == BagData.Inst().GetItemNum(co.jihuo_item)
        }
    }


    FishSkin() {
        if (!this.toolLoad || !this.spShow) {
            return
        }
        FishData.Inst().FishSkin(this.spShow, true)

        let playData = ObjectPool.Get(UISpinePlayData);
        playData.name = FishConfig.FishAnimName[0]
        playData.loop = FishConfig.FishAnimLoop[0];
        this.spShow.play(playData, true)
    }

    OnClickWear() {
        let tool_info = FishData.Inst().InfoToolInfo
        let wear_id = tool_info[FishData.Inst().SelToolType - 1] ? tool_info[FishData.Inst().SelToolType - 1].huanHuaId : 0
        PublicPopupCtrl.Inst().Center(wear_id == FishData.Inst().SelImageId ? Language.Fish.Fashion.TaskOffTips : Language.Fish.Fashion.WearTips)
        FishCtrl.Inst().SendRoleFishReqFashion()
    }

    OnClickActive() {
        let co = FishData.Inst().CfgToolImageByImageId()
        if (co) {
            if (0 == BagData.Inst().GetItemNum(co.jihuo_item)) {
                PublicPopupCtrl.Inst().ItemNotEnoughNotice(co.jihuo_item)
                return
            }
            ViewManager.Inst().OpenView(FishFashionGetView, co.image_id)
            // FishCtrl.Inst().SendRoleFishReqFashionActive()
        }
    }
}

export class FishFashionViewShowButton extends BaseItemGB {
    protected viewNode = {
        CellShow: <ItemCell>null,
        SelShow: <fgui.GImage>null,
    };

    protected onConstruct() {
        super.onConstruct()

        this.onClick(this.OnClickBait, this);
    }

    SetData(data: any) {
        super.SetData(data)
        this.viewNode.CellShow.SetData(Item.Create({ itemId: data.show_item }, { is_num: false, is_click: false, is_gray: !FishData.Inst().GetFashionActived(data.image_id) }))
        this.viewNode.SelShow.visible = FishData.Inst().SelImageId == data.image_id
    }

    OnClickBait() {
        if (FishData.Inst().SelImageId != this._data.image_id) {
            FishData.Inst().SelImageId = this._data.image_id
        } else {
            CellClicks[-1](this._data.show_item);
        }
    }
}

