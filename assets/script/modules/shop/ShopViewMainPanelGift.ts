
import * as fgui from "fairygui-cc";
import { BaseItemCare, BaseItemGB } from "modules/common/BaseItem";
import { Language } from "modules/common/Language";
import { UH } from "../../helpers/UIHelper";
import { ShopData } from "./ShopData";
import { ViewManager } from "manager/ViewManager";
import { ShopSpecialOfferView } from "./ShopSpecialOfferView";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { Item } from "modules/bag/ItemData";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { HeroData } from "modules/hero/HeroData";
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { ActivityCtrl } from "modules/activity/ActivityCtrl";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";

export class ShopViewMainPanelGift extends BaseItemCare {
    protected viewNode = {
        ShowList: <fgui.GList>null,
    };

    showList: any[];
    InitData() {
        this.AddSmartDataCare(ShopData.Inst().FlushData, this.FlushShopInfo.bind(this), "FlushGiftInfo");

        this.viewNode.ShowList.on(fgui.Event.CLICK_ITEM, this.OnClickShopGift, this)
        this.viewNode.ShowList.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.ShowList.setVirtual();
    }

    InitUI() {
        this.FlushShopInfo()
    }

    FlushShopInfo() {
        this.showList = ShopData.Inst().GetShopGift();
        let num = this.showList.length;
        this.viewNode.ShowList.numItems = num
        this.viewNode.ShowList.height = Math.ceil(num / 2) * 415;
        this.height = Math.ceil(num / 2) * 415 + 120
    }

    private renderListItem(index: number, item: ShopViewMainPanelGiftItem) {
        // item.ItemIndex(index);
        item.SetData(this.showList[index]);
    }

    OnClickShopGift(item: ShopViewMainPanelGiftItem) {
        ViewManager.Inst().OpenView(ShopSpecialOfferView, item.data.type)
    }
}

export class ShopViewMainPanelGiftItem extends BaseItemGB {
    protected viewNode = {
        bg: <fgui.GLoader>null,
        Icon: <fgui.GLoader>null,
        Name: <fgui.GTextField>null,
        Price: <fgui.GTextField>null,
        Num: <fgui.GTextField>null,
        DiscountShow: <fgui.GTextField>null,
        timer: <TimeMeter>null,
        UIEffectShow: <UIEffectShow>null,
    };
    SetData(data: any) {
        super.SetData(data);
        this.data = data;
        let cfg = this.data.cfg;
        let reward
        if (data.type == 0) {
            reward = cfg.reward_item[cfg.reward_item.length - 1];
        } else {
            reward = cfg.reward_item[1];
        }
        let item = Item.GetConfig(reward.item_id);
        UH.SetText(this.viewNode.Num, "x" + reward.num)
        UH.SetText(this.viewNode.DiscountShow, cfg.discount + "%")
        UH.SetIcon(this.viewNode.Icon, item.icon_id, ICON_TYPE.ITEM);
        if (item && item.item_type == 3) {
            let img = HeroData.Inst().GetDebrisHeroIcon(reward.item_id, 1)
            UH.SetIcon(this.viewNode.Icon, img, ICON_TYPE.ROLE);
        } else if (item && item.item_type == 11) {
            UH.SetText(this.viewNode.Num, "x" + item.rand_num * reward.num)
        }
        UH.SetText(this.viewNode.Name, cfg.name)
        UH.SetText(this.viewNode.Price, Language.Recharge.GoldType[0] + (cfg.price / 10))
        let img = this.data.type > 1 ? "LiBaoDiKuang1" : "LiBaoDiKuang2"
        UH.SpriteName(this.viewNode.bg, "Shop", img)
        this.FlushFlushTime();

        this.viewNode.UIEffectShow.StopEff(1203002)
        this.viewNode.UIEffectShow.PlayEff(1203002)
    }

    private FlushFlushTime() {
        let time = this.data.endTime - TimeCtrl.Inst().ServerTime;
        this.viewNode.timer.visible = time > 0
        this.viewNode.timer.CloseCountDownTime();
        if (time > 0) {
            this.viewNode.timer.SetCallBack(this.FlushTimeComplete.bind(this));
            this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_0);
        }else{
            this.FlushTimeComplete();
        }
    }

    FlushTimeComplete() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.ShopGift, 0);
    }

    onDestroy() {
        super.onDestroy();
        this.viewNode.timer.CloseCountDownTime();
    }
}