import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { ItemInfoView } from "modules/ItemInfo/ItemInfoView";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { Mod } from "modules/common/ModuleDefine";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { OrderCtrl, Order_Data } from "modules/recharge/OrderCtrl";
import { TerritoryData } from "./TerritoryData";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { COLORS } from "modules/common/ColorEnum";
import { CfgPartsGift } from "config/CfgPartsGift";
import { UH } from "../../helpers/UIHelper";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { SettingUsertServeData } from "modules/setting/SettingUsertServeData";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";

@BaseView.registView
export class TerritoryModGiftView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "TerritoryModGift",
        ViewName: "TerritoryModGiftView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    /* protected boardCfg = {
        BoardTitle: Language.Temp.Title,
        TabberCfg: [
            { panel: TempPanel, viewName: "TempPanel", titleName: Language.Temp.TabberTemp },
        ]
    }; */

    private _key_check_buy: string;

    protected viewNode = {
        BtnBuy: <fgui.GButton>null,
        BtnClose: <fgui.GButton>null,
        TimeShow: <TimeMeter>null,
        TextDiscount: <fgui.GTextField>null,
        TxtGiftName: <fgui.GTextField>null,
        List: <fgui.GList>null,
        UISpineShow: <UISpineShow>null,
    };

    protected extendsCfg = [
        { ResName: "PartItem", ExtendsClass: TerritoryModGiftItem }
    ];
    listData: import("d:/ccs/wjszm-c/assets/script/config/CfgCommon").CfgItem[];

    InitData() {
        this.AddSmartDataCare(TerritoryData.Inst().FlushData, this.FlushGiftInfo.bind(this), "FlushGiftInfo");
        let seq = TerritoryData.Inst().GiftInfo.giftSeq;
        let config = TerritoryData.Inst().GetGiftCfg(seq);
        if (!config) {
            ViewManager.Inst().CloseView(TerritoryModGiftView)
            return
        }
        this.viewNode.BtnBuy.onClick(this.OnClickBuy, this);
        this.viewNode.BtnClose.onClick(this.closeView, this);
        this._key_check_buy = Mod.GeneOrientation.View + "-1";
        UH.SetText(this.viewNode.TextDiscount, config.discount + "%")
        UH.SetText(this.viewNode.TxtGiftName, config.gift_name)
        this.viewNode.UISpineShow.LoadSpine(ResPath.Spine("huayuan/lingjianlibao"), true);
        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy, this.viewNode.BtnBuy, Language.Recharge.GoldType[0] + (config.price / 10));
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.listData = config.item;
        this.viewNode.List.numItems = config.item.length;

        this.FlushTimeShow();
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index])
    }

    InitUI() {
    }

    FlushGiftInfo() {
        let beginTime = TerritoryData.Inst().GiftInfo.beginTime
        if (Number(beginTime) > TimeCtrl.Inst().ServerTime) {
            ViewManager.Inst().CloseView(TerritoryModGiftView)
            return
        }
    }

    FlushTimeShow() {
        this.viewNode.TimeShow.CloseCountDownTime()
        let endtime = TerritoryData.Inst().GiftInfo.endTime
        let beginTime = TerritoryData.Inst().GiftInfo.beginTime
        if (Number(beginTime) < TimeCtrl.Inst().ServerTime && Number(endtime) > TimeCtrl.Inst().ServerTime) {
            this.viewNode.TimeShow.SetOutline(true, COLORS.Green2, 3)
            this.viewNode.TimeShow.StampTime(Number(endtime), TimeFormatType.TYPE_TIME_0)
            this.viewNode.TimeShow.SetCallBack(this.FlushTimeShow.bind(this))
        }
        else {
            this.viewNode.TimeShow.SetTime("")
            ViewManager.Inst().CloseView(TerritoryModGiftView)
        }
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        this.viewNode.UISpineShow.onDestroy();
        this.viewNode.TimeShow.CloseCountDownTime()
    }

    OnClickBuy() {
        if (!OrderCtrl.Inst().CheckMaiButtonClick(this._key_check_buy)) {
            PublicPopupCtrl.Inst().Center(Language.Common.payWait)
            return;
        }
        let seq = TerritoryData.Inst().GiftInfo.giftSeq;
        let config = TerritoryData.Inst().GetGiftCfg(seq);
        let cfg_word = SettingUsertServeData.Inst().GetWordDes(26);//领地零件礼包
        let name = (cfg_word && cfg_word.name) ? cfg_word.name : Language.Recharge.Diamond;
        let order_data = Order_Data.initOrder(seq, ACTIVITY_TYPE.TerritoryModGift, config.price, config.price, name);
        OrderCtrl.generateOrder(order_data);
    }
}


class TerritoryModGiftItem extends BaseItem {
    protected viewNode = {
        Num: <fgui.GTextField>null,
        Icon: <fgui.GLoader>null,
    };

    protected onConstruct() {
        super.onConstruct();
        this.onClick(this.OnClickItem, this)
    };

    public SetData(data: any) {
        this.data = data;
        let id = data.item_id;
        UH.SetIcon(this.viewNode.Icon, id, ICON_TYPE.ITEM)
        UH.SetText(this.viewNode.Num, data.num);
    }

    OnClickItem() {
        ViewManager.Inst().OpenView(ItemInfoView, this.data.item_id);
    }
}