import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { TrafficPermitData } from "modules/TrafficPermit/TrafficPermitData";
import { TrafficPermitGoldView } from "modules/TrafficPermit/TrafficPermitGoldView";
import { TrafficPermitView } from "modules/TrafficPermit/TrafficPermitView";
import { BaseItemCare, BaseItemGB } from "modules/common/BaseItem";
import { Language } from "modules/common/Language";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";

export class ShopViewMainPanelCard extends BaseItemCare {
    protected viewNode = {
        BtnCard: <ShopViewMainPanelCardButton>null,
    };

    InitData() {
        this.viewNode.BtnCard.onClick(this.OnClickCard, this)
    }

    InitUI() {
        this.viewNode.BtnCard.FlushShow()
    }

    OnClickCard() {
        let isactive = TrafficPermitData.Inst().GetIsActive();
        if (isactive) {
            ViewManager.Inst().OpenView(TrafficPermitView)
        } else {
            ViewManager.Inst().OpenView(TrafficPermitGoldView)
        }
    }
}

export class ShopViewMainPanelCardButton extends BaseItemGB {
    protected viewNode = {
        PricePre: <fgui.GTextField>null,
        PriceNow: <fgui.GTextField>null,
    };

    FlushShow() {
        let co = TrafficPermitData.Inst().GetPassBuy()
        UH.SetText(this.viewNode.PricePre, TextHelper.Format(Language.Shop.ShopMainCard.PricePre, co.high_price))
        UH.SetText(this.viewNode.PriceNow, TextHelper.Format(Language.Shop.ShopMainCard.PriceNow, co.pay_price1 / 10))
    }
}