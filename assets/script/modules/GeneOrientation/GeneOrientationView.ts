import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { UH } from "../../helpers/UIHelper";
import { OrderCtrl, Order_Data } from "modules/recharge/OrderCtrl";
import { BaseItem } from "modules/common/BaseItem";
import { GeneOrientationData } from "./GeneOrientationData";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { SettingUsertServeData } from "modules/setting/SettingUsertServeData";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Mod } from "modules/common/ModuleDefine";
import { HeroData } from "modules/hero/HeroData";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { COLORS } from "modules/common/ColorEnum";
import { CfgEene } from "config/CfgEene";
import { ItemInfoView } from "modules/ItemInfo/ItemInfoView";
import { CfgGift } from "config/CfgGift";
import { Item } from "modules/bag/ItemData";

@BaseView.registView
export class GeneOrientationView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "GeneOrientation",
        ViewName: "GeneOrientationView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        BtnBuy: <fgui.GButton>null,
        BtnClose: <fgui.GButton>null,
        TimeShow: <TimeMeter>null,
        TextDiscount: <fgui.GTextField>null,
        List: <fgui.GList>null,
        Icon: <fgui.GLoader>null,
    };

    private paramIndex: number = 0;
    private isAct: boolean = false;
    private _key_check_buy: string;

    protected extendsCfg = [
        { ResName: "GeneItem", ExtendsClass: GeneOrientationViewGeneItem }
    ];
    listData: import("d:/ccs/wjszm-c/assets/script/config/CfgCommon").CfgItem[];

    InitData(param?: any) {
        this.AddSmartDataCare(GeneOrientationData.Inst().FlushData, this.FulshListData.bind(this), "FlushInfo");
        if (param) {
            this.isAct = true;
            this.paramIndex = param.index;
        }
        this.viewNode.BtnBuy.onClick(this.OnClickBuy, this);
        this.viewNode.BtnClose.onClick(this.closeView, this);
        this._key_check_buy = Mod.GeneOrientation.View + "-1";
        this.FulshListData();
        this.FlushTimeShow();
    }

    InitUI() {

    }

    private FulshListData() {
        let HeroId: number = 0;
        if (this.isAct) {
            HeroId = GeneOrientationData.Inst().getIndexGiftHeroId(this.paramIndex);
        } else {
            HeroId = GeneOrientationData.Inst().getNewGiftHeroId();
        }

        let config = GeneOrientationData.Inst().GetGiftCfg(HeroId);
        if (!config) {
            ViewManager.Inst().CloseView(GeneOrientationView)
            return
        }
        UH.SetText(this.viewNode.TextDiscount, config.discount + "%")
        let skill = HeroData.Inst().GetGeneSuitCfg(HeroId)
        if (!skill) return
        UH.SetIcon(this.viewNode.Icon, skill.res_id, ICON_TYPE.HERODRAWING)
        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy, this.viewNode.BtnBuy, Language.Recharge.GoldType[0] + (config.price / 10));
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.listData = config.item;
        this.viewNode.List.numItems = config.item.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    FlushTimeShow() {
        this.viewNode.TimeShow.CloseCountDownTime()
        let index: number = 0;
        if (this.isAct) {
            index = this.paramIndex;
        } else {
            index = GeneOrientationData.Inst().getNewIndex();
        }
        let time = GeneOrientationData.Inst().getEndTime(index)
        if (Number(time) > TimeCtrl.Inst().ServerTime) {
            this.viewNode.TimeShow.SetOutline(true, COLORS.Green3, 3)
            this.viewNode.TimeShow.StampTime(Number(time), TimeFormatType.TYPE_TIME_0, Language.Hero.TodayGain.TimeShow)
            this.viewNode.TimeShow.SetCallBack(this.FlushTimeShow.bind(this))
        }
        else {
            this.viewNode.TimeShow.SetTime("")
        }
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        this.viewNode.TimeShow.CloseCountDownTime()
    }

    OnClickBuy() {
        if (Item.IsGeneBagMax()) return
        if (!OrderCtrl.Inst().CheckMaiButtonClick(this._key_check_buy)) {
            PublicPopupCtrl.Inst().Center(Language.Common.payWait)
            return;
        }
        let HeroId: number = 0;
        if (this.isAct) {
            HeroId = GeneOrientationData.Inst().getIndexGiftHeroId(this.paramIndex);
        } else {
            HeroId = GeneOrientationData.Inst().getNewGiftHeroId();
        }
        if (HeroId == 0) {
            return;
        }
        let config = GeneOrientationData.Inst().GetGiftCfg(HeroId);
        let index = GeneOrientationData.Inst().getIndex(HeroId)
        let cfg_word = SettingUsertServeData.Inst().GetWordDes(21);//基因定向礼包
        let name = (cfg_word && cfg_word.name) ? cfg_word.name : Language.Recharge.Diamond;
        let order_data = Order_Data.initOrder(index, ACTIVITY_TYPE.GeneOrientation, config.price, config.price, name);
        OrderCtrl.generateOrder(order_data);
    }
}

class GeneOrientationViewGeneItem extends BaseItem {
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
        if (data.item_id >= 60000) {
            id = CfgGift[data.item_id].icon_id;
        }
        UH.SetIcon(this.viewNode.Icon, id, ICON_TYPE.ITEM)
        this.viewNode.Icon.setScale(0.8, 0.8);
        UH.SetText(this.viewNode.Num, data.num);
    }

    OnClickItem() {
        ViewManager.Inst().OpenView(ItemInfoView, this.data);
    }
}