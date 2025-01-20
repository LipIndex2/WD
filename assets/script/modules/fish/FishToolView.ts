
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { BagData } from "modules/bag/BagData";
import { Item } from "modules/bag/ItemData";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { ItemCell } from "modules/extends/ItemCell";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { FishCtrl } from "./FishCtrl";
import { FishData } from "./FishData";
import { FishFashionView } from "./FishFashionView";

@BaseView.registView
export class FishToolView extends BaseView {
    private toolLevel = -1

    private isMax: boolean

    protected viewRegcfg = {
        UIPackName: "FishTool",
        ViewName: "FishToolView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,

        BtnUp: <fgui.GButton>null,
        BtnFashion: <fgui.GButton>null,

        NameShow: <fgui.GTextField>null,
        DescShow: <fgui.GTextField>null,
        // AttrShow: <fgui.GTextField>null,
        CurVal: <fgui.GTextField>null,
        NextVal: <fgui.GTextField>null,
        MaxVal: <fgui.GTextField>null,
        PriceShow: <fgui.GTextField>null,
        PriceSp: <fgui.GLoader>null,
        CellShow: <ItemCell>null,
        UIEffectShow: <UIEffectShow>null,

        GpMax: <fgui.GGroup>null,
        GpUp: <fgui.GGroup>null,
    };

    InitData() {
        this.viewNode.Board.SetData(new BoardData(FishToolView));
        this.viewNode.Board.DecoShow(true);

        this.viewNode.BtnUp.onClick(this.OnClickUp, this);
        this.viewNode.BtnFashion.onClick(this.OnClickFashion, this);

        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushInfo.bind(this), "FlushInfo", "FlushToolInfo");
        this.AddSmartDataCare(BagData.Inst().ItemData, this.FlushButtonShow.bind(this), "OtherChange");
    }

    InitUI() {
        this.FlushInfo()

        this.viewNode.BtnFashion.visible = undefined != FishData.Inst().CfgToolImageByImageType()
    }

    FlushInfo() {
        let stt = FishData.Inst().SelToolType
        let info = FishData.Inst().InfoToolInfo[stt - 1]
        let co_tool = FishData.Inst().CfgToolInfoByIdLevel(stt, info.level)
        let co_next = FishData.Inst().CfgToolInfoByIdLevel(stt, info.level + 1)
        this.isMax = !co_next
        this.viewNode.GpUp.visible = !this.isMax
        this.viewNode.GpMax.visible = this.isMax
        this.viewNode.BtnUp.grayed = this.isMax
        this.viewNode.BtnUp.touchable = !this.isMax
        this.viewNode.BtnUp.title = this.isMax ? Language.Fish.Tool.BtnMax : Language.Fish.Tool.BtnUp
        if (info && co_tool) {
            let num_cur = 0
            let num_next = 0
            if (info.huanHuaId > 0) {
                let co_image = FishData.Inst().CfgToolImageByImageId(info.huanHuaId)
                if (co_image) {
                    UH.SetText(this.viewNode.NameShow, TextHelper.Format(Language.Fish.Tool.NameShow, Item.GetName(co_image.show_item), info.level))
                    num_cur = co_tool.pram + co_image.parm
                    num_next = (co_next ? co_next.pram : 0) + co_image.parm
                    this.viewNode.CellShow.SetData(Item.Create({ item_id: co_image.show_item }, { is_num: false }))
                }
            } else {
                UH.SetText(this.viewNode.NameShow, TextHelper.Format(Language.Fish.Tool.NameShow, Item.GetName(co_tool.show_item), info.level))
                num_cur = co_tool.pram
                num_next = co_next ? co_next.pram : 0
                this.viewNode.CellShow.SetData(Item.Create({ item_id: co_tool.show_item }, { is_num: false }))
            }
            UH.SetText(this.viewNode.DescShow, TextHelper.Format(Language.Fish.AttrShow[stt - 1], num_cur / 100))
            UH.SetText(this.viewNode.CurVal, TextHelper.Format(Language.Fish.Tool.ValShow, num_cur / 100))
            UH.SetText(this.viewNode.NextVal, TextHelper.Format(Language.Fish.Tool.ValShow, num_next / 100))
            UH.SetText(this.viewNode.MaxVal, TextHelper.Format(Language.Fish.Tool.ValShow, num_cur / 100))
            UH.SetText(this.viewNode.PriceShow, co_tool.num)
            UH.SetIcon(this.viewNode.PriceSp, co_tool.item_id, ICON_TYPE.ITEM)

            this.FlushButtonShow()
            if (1 == (info.level - this.toolLevel)) {
                this.viewNode.UIEffectShow.StopEff(1009010)
                this.viewNode.UIEffectShow.PlayEff(1009010)
            }
            this.toolLevel = info.level
        }
    }

    FlushButtonShow() {
        if (!this.isMax) {
            let stt = FishData.Inst().SelToolType
            let info = FishData.Inst().InfoToolInfo[stt - 1]
            let co_tool = FishData.Inst().CfgToolInfoByIdLevel(stt, info.level)
            this.viewNode.BtnUp.grayed = BagData.Inst().GetItemNum(co_tool.item_id) < co_tool.num
        }
    }

    OnClickUp() {
        let stt = FishData.Inst().SelToolType
        let info = FishData.Inst().InfoToolInfo[stt - 1]
        let co_tool = FishData.Inst().CfgToolInfoByIdLevel(stt, info.level)
        if (BagData.Inst().GetItemNum(co_tool.item_id) < co_tool.num) {
            PublicPopupCtrl.Inst().ItemNotEnoughNotice(co_tool.item_id)
            return
        }
        FishCtrl.Inst().SendRoleFishReqUpTool(FishData.Inst().SelToolType)
    }

    OnClickFashion() {
        ViewManager.Inst().OpenView(FishFashionView)
    }
}
