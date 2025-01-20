import { HeroCell } from 'modules/extends/HeroCell';
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { ItemCell } from "modules/extends/ItemCell";
import { UH } from "../../helpers/UIHelper";
import { ShopData } from "./ShopData";
import { TimeMeter, TimeFormatType } from "modules/extends/TimeMeter";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { Mod } from "modules/common/ModuleDefine";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { OrderCtrl, Order_Data } from "modules/recharge/OrderCtrl";
import { HeroData, HeroDataModel } from 'modules/hero/HeroData';
import { COLORS } from 'modules/common/ColorEnum';
import { ActivityCtrl } from 'modules/activity/ActivityCtrl';
import { SettingUsertServeData } from 'modules/setting/SettingUsertServeData';

@BaseView.registView
export class ShopSpecialOfferView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "ShopSpecialOffer",
        ViewName: "ShopSpecialOfferView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,
        timer: <TimeMeter>null,
        Name: <fgui.GTextField>null,
        GeneWord: <fgui.GTextField>null,
        ItemList: <fgui.GList>null,
        HeroList: <fgui.GList>null,
        BtnBuy: <fgui.GButton>null,
        BtnClose: <fgui.GButton>null,
    };

    protected extendsCfg = [
        { ResName: "GiftCell", ExtendsClass: GiftCell }
    ];

    info: any;
    private type: number;
    private _key_check_buy: string;
    private stateCtrler: fgui.Controller
    private showList: any[];
    listData: import("d:/ccs/wjszm-c/assets/script/config/CfgCommon").CfgItem[];
    InitData(param: number) {
        this.type = param;
        this.stateCtrler = this.view.getController("GiftState");
        if (param == 0 || param == 3) {
            this.stateCtrler.selectedIndex = 1
        } else {
            this.stateCtrler.selectedIndex = 0
        }
        this.AddSmartDataCare(ShopData.Inst().FlushData, this.FlushShow.bind(this), "FlushGiftInfo");

        this.viewNode.Board.SetBtnCloseVisible(false)
        this.viewNode.ItemList.setVirtual();
        this.viewNode.HeroList.setVirtual();
        this.viewNode.HeroList.itemRenderer = this.renderListItem.bind(this);
        this._key_check_buy = Mod.ShopGift.View + "-" + ACTIVITY_TYPE.ShopGift + "-" + param;

        this.viewNode.BtnClose.onClick(this.closeView, this);
        this.viewNode.BtnBuy.onClick(this.OnClickBuy, this);

        this.viewNode.timer.SetCallBack(this.FlushCompleteTime.bind(this));
        this.viewNode.GeneWord.visible = param == 3;

        this.FlushShow();
        this.FlushTime();
    }

    FlushShow() {
        this.info = ShopData.Inst().GiftInfoList[this.type];
        let cfg = ShopData.Inst().CfgShopGiftData(this.type, this.info.seq);
        this.listData = cfg.reward_item;
        this.viewNode.ItemList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.ItemList.numItems = this.listData.length;

        UH.SetText(this.viewNode.Name, cfg.name);
        if (this.stateCtrler.selectedIndex == 0) {
            let reward = cfg.reward_item[1];
            let item = Item.GetConfig(reward.item_id);
            if (item.item_type == 11) {
                this.showList = item.gift;
                this.viewNode.HeroList.numItems = item.gift.length
            }
        }
        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy, this.viewNode.BtnBuy, Language.Recharge.GoldType[0] + (cfg.price / 10));

    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index])
    }

    private renderListItem(index: number, item: HeroCell) {
        let heroid = HeroData.Inst().GetDebrisHeroId(this.showList[index].item_id)
        item.SetData(new HeroDataModel(heroid, 1, false, true));
    }

    private FlushTime() {
        let time = this.info.endTime - TimeCtrl.Inst().ServerTime;
        this.viewNode.timer.visible = time > 0
        this.viewNode.timer.CloseCountDownTime();
        if (time > 0) {
            this.viewNode.timer.SetOutline(true, COLORS.Brown, 3)
            this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_0, Language.UiTimeMeter.TimeLimit2);
        }
    }

    OnClickBuy() {
        if (!OrderCtrl.Inst().CheckMaiButtonClick(this._key_check_buy)) {
            PublicPopupCtrl.Inst().Center(Language.Common.payWait)
            return
        }
        let cfg = ShopData.Inst().CfgShopGiftData(this.type, this.info.seq);
        if (Item.IsGeneBagMax(cfg.reward_item)) return
        let cfg_word = SettingUsertServeData.Inst().GetWordDes(18);//商城特惠
        let name = (cfg_word && cfg_word.name) ? cfg_word.name : Language.Recharge.Diamond;
        let order_data = Order_Data.initOrder(this.type, ACTIVITY_TYPE.ShopGift, cfg.price, cfg.price, name);
        OrderCtrl.generateOrder(order_data);
    }

    FlushCompleteTime() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.ShopGift, 0)
    }

    InitUI() {
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        this.viewNode.timer.CloseCountDownTime();
    }
}

export class GiftCell extends BaseItem {
    protected viewNode = {
        ItemCell: <ItemCell>null,
        Num: <fgui.GTextField>null,
        HeroNum: <fgui.GTextField>null,
    };
    public SetData(data: any) {
        let item_call = Item.Create(data, { is_click: true });
        this.viewNode.ItemCell.SetData(item_call);
        this.viewNode.Num.fontSize = 40;

        let cfg = Item.GetConfig(data.item_id);
        UH.SetText(this.viewNode.HeroNum, "");

        if (cfg.item_type == 3) {
            UH.SetText(this.viewNode.Num, cfg.name);
            this.viewNode.Num.fontSize = 37;
            UH.SetText(this.viewNode.HeroNum, "x" + data.num);
        } else if (cfg.item_type == 11) {
            UH.SetText(this.viewNode.Num, cfg.rand_num * data.num);
        } else {
            UH.SetText(this.viewNode.Num, data.num);
        }
    }
}