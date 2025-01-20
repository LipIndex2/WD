
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { Mod } from "modules/common/ModuleDefine";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { OrderCtrl, Order_Data, RechargeType } from "modules/recharge/OrderCtrl";
import { SettingUsertServeData } from "modules/setting/SettingUsertServeData";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { FishCtrl } from "./FishCtrl";
import { FishData } from "./FishData";

@BaseView.registView
export class FishCardView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "FishCard",
        ViewName: "FishCardView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,

        BtnBuy: <fgui.GButton>null,

        ShowList: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "ItemShow", ExtendsClass: FishCardViewShowItem },
    ]

    InitData() {
        this.viewNode.Board.SetData(new BoardData(FishCardView));

        this.viewNode.BtnBuy.onClick(this.OnClickBuy, this);

        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushInfo.bind(this), "FlushInfo", "FlushCommonInfo");

    }

    InitUI() {
        this.FlushShow()
        this.FlushInfo()
    }

    FlushShow() {
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.ShowList.numItems = FishData.Inst().GetCardShowList().length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(FishData.Inst().GetCardShowList()[index])
    }

    FlushInfo() {
        if (TimeCtrl.Inst().ServerTime > FishData.Inst().InfoFishCardTime) {
            this.viewNode.BtnBuy.title = TextHelper.Format(Language.Fish.Card.BtnBuy, FishData.Inst().CfgOtherPrice / 10)
        } else {
            this.viewNode.BtnBuy.title = Language.Fish.Card.BtnGet
            this.viewNode.BtnBuy.grayed = 1 == FishData.Inst().InfoIsFetchCardReward
        }
    }

    OnClickBuy() {
        if (TimeCtrl.Inst().ServerTime > FishData.Inst().InfoFishCardTime) {
            if (!OrderCtrl.Inst().CheckMaiButtonClick(`${Mod.Fish.Card}`)) {
                PublicPopupCtrl.Inst().Center(Language.Common.payWait)
                return
            }
            let cfg_word = SettingUsertServeData.Inst().GetWordDes(28);
            let name = (cfg_word && cfg_word.name) ? cfg_word.name : Language.Recharge.Diamond;
            let order_data = Order_Data.initOrder(0, RechargeType.BUY_TYPE_FISH_CARD, FishData.Inst().CfgOtherPrice, FishData.Inst().CfgOtherPrice, name);
            OrderCtrl.generateOrder(order_data);
        } else {
            FishCtrl.Inst().SendRoleFishReqCardReward()
        }
    }
}

export class FishCardViewShowItem extends BaseItem {
    protected viewNode = {
        DescShow: <fgui.GTextField>null,
        IconSp: <fgui.GLoader>null,
        NumShow: <fgui.GTextField>null,
        GpReward: <fgui.GGroup>null,
    };

    SetData(data: any) {
        if (data.num > 0) {
            UH.SetText(this.viewNode.DescShow, TextHelper.Format(Language.Fish.Card.RewadTips[data.seq], Item.GetName(data.item_id)))
            UH.SetIcon(this.viewNode.IconSp, Item.GetIconId(data.item_id), ICON_TYPE.ITEM)
            UH.SetText(this.viewNode.NumShow, TextHelper.Format(Language.Fish.Card.NumShow, data.num))
        } else {
            UH.SetText(this.viewNode.DescShow, Language.Fish.Card.RewadTips[data.seq])
        }
        this.viewNode.GpReward.visible = data.num > 0
    }
}
