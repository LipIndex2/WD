import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer } from "modules/common/BaseView";
import * as fgui from "fairygui-cc";
import { EGLoader } from "modules/extends/EGLoader";
import { CurrencyShow, ExpShow } from "modules/extends/Currency";
import { DevilWarOrderData } from "./DevilWarorderData";
import { OrderCtrl, Order_Data } from "modules/recharge/OrderCtrl";
import { Mod } from "modules/common/ModuleDefine";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { Language } from "modules/common/Language";
import { SettingUsertServeData } from "modules/setting/SettingUsertServeData";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ViewManager } from "manager/ViewManager";
import { UH } from "../../helpers/UIHelper";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { CommonId, ICON_TYPE, ITEM_SHOW_TYPE } from "modules/common/CommonEnum";
import { ObjectPool } from "core/ObjectPool";
import { ResPath } from "utils/ResPath";
import { CocHighPerfList } from "../../ccomponent/CocHighPerfList";
import { DevilWarorderCtrl } from "./DevilWarorderCtrl";
import { CfgTemplePassRoundPassSet } from "config/CfgTemplePass";
import { Item } from "modules/bag/ItemData";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { ActivityData } from "modules/activity/ActivityData";
import { COLORS } from "modules/common/ColorEnum";

@BaseView.registView
export class DevilWarorderView extends BaseView {
    private _key_check_buy: string[];
    private spShow: UISpineShow = undefined;

    protected viewRegcfg = {
        UIPackName: "GrowPass",
        ViewName: "DevilWarorderView",
        LayerType: ViewLayer.Normal,
        OpenAudio: AudioTag.TanChuJieMian,
    };

    protected extendsCfg = [
        { ResName: "DevilWarorderItem", ExtendsClass: DevilWarorderItem },
        { ResName: "DevilWarorderCell", ExtendsClass: DevilWarorderCell },
    ];

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,
        liuhaiscreen: <fgui.GComponent>null,
        bg: <EGLoader>null,
        BtnClose: <fgui.GButton>null,
        BtnBuy1: <fgui.GButton>null,
        BtnBuy2: <fgui.GButton>null,
        BtnOneKeyGet: <fgui.GButton>null,
        list: <fgui.GList>null,
        timer: <TimeMeter>null,
        parent: <fgui.GComponent>null,
        ExpShow: <ExpShow>null,
        Currency1: <CurrencyShow>null,
        Currency2: <CurrencyShow>null,
        Currency3: <CurrencyShow>null,
    };
    WindowSizeChange() {
        this.refreshBgSize(this.viewNode.bg)
    }

    InitData() {
        this._key_check_buy = [];
        this._key_check_buy[1] = Mod.DevilWarorder.View + "-1";
        this._key_check_buy[2] = Mod.DevilWarorder.View + "-2";

        this.viewNode.Currency1.SetCurrency(CommonId.TempleIntegral);
        this.viewNode.Currency3.SetCurrency(CommonId.Diamond);

        this.AddSmartDataCare(DevilWarOrderData.Inst().FlushData, this.FulshListData.bind(this), "FlushInfo");

        this.viewNode.BtnOneKeyGet.onClick(this.OnClickOneKeyGet, this);
        this.viewNode.BtnClose.onClick(this.closeView, this);
        this.viewNode.BtnBuy1.onClick(this.OnClickBuy.bind(this, 1));
        this.viewNode.BtnBuy2.onClick(this.OnClickBuy.bind(this, 2));
        this.viewNode.list.setVirtual();


        if (this.spShow) {
            this.spShow.onDestroy();
            this.spShow = null;
        }
        this.spShow = ObjectPool.Get(UISpineShow, ResPath.Spine("mowangzhanling/mowangzhanling"), true, (obj: any) => {
            this.viewNode.parent._container.insertChild(obj, 2);
        });

        this.FulshListData();
    }

    CloseCallBack() {
        if (this.spShow) {
            this.spShow.onDestroy();
            this.spShow = null;
        }
    }

    InitUI() {
        let otherCfg = DevilWarOrderData.Inst().GetOtherCfg();
        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy[1], this.viewNode.BtnBuy1, Language.Recharge.GoldType[0] + (otherCfg.price1 / 10));
        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy[2], this.viewNode.BtnBuy2, Language.Recharge.GoldType[0] + (otherCfg.price2 / 10));
        this.FlushFlushTime()
    }

    private FlushFlushTime() {
        this.viewNode.timer.SetOutline(true, COLORS.Brown, 3);
        let endTime = ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.DevilWarorder);
        let time = endTime - TimeCtrl.Inst().ServerTime;
        this.viewNode.timer.visible = time > 0
        if (time > 0) {
            this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_4, Language.UiTimeMeter.TimeLimit2);
        }
    }

    private FulshListData() {
        let listInfoData = DevilWarOrderData.Inst().GetListData();
        DevilWarOrderData.Inst().SetCurArriveSeq(listInfoData);
        this.viewNode.list.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.list.numItems = listInfoData.length;
        this.viewNode.BtnBuy1.visible = !DevilWarOrderData.Inst().IsActive(1);
        this.viewNode.BtnBuy2.visible = !DevilWarOrderData.Inst().IsActive(2);

        // this.viewNode.BtnOneKeyGet.visible = DevilWarOrderData.Inst().GetAllRed() > 0
        this.viewNode.BtnOneKeyGet.visible = false

        let item_num = DevilWarOrderData.Inst().GetItemnum();

        this.viewNode.Currency2.setNum(item_num);

    }

    private itemRenderer(index: number, item: any) {
        item.SetData(DevilWarOrderData.Inst().GetListData()[index]);
    }

    OnClickOneKeyGet() {
        DevilWarorderCtrl.Inst().SendOnKeyGet();
    }

    OnClickBuy(buyType: number) {
        if (DevilWarOrderData.Inst().IsActive(buyType)) {
            return;
        }
        if (!OrderCtrl.Inst().CheckMaiButtonClick(this._key_check_buy[buyType])) {
            PublicPopupCtrl.Inst().Center(Language.Common.payWait)
            return
        }
        let data = DevilWarOrderData.Inst().GetOtherCfg();
        let payPrice = buyType == 1 ? data.price1 : data.price2;

        let cfg_word = SettingUsertServeData.Inst().GetWordDes(20);
        let name = (cfg_word && cfg_word.name) ? cfg_word.name : Language.Recharge.Diamond;
        let order_data = Order_Data.initOrder(buyType, ACTIVITY_TYPE.DevilWarorder, payPrice, payPrice, name);
        OrderCtrl.generateOrder(order_data);
    }
}

class DevilWarorderCell extends BaseItem {
    protected viewNode = {
        PrizeItem1: <DevilWarorderItem>null,
        PrizeItem2: <DevilWarorderItem>null,
        PrizeItem3: <DevilWarorderItem>null,
        Level: <fgui.GTextField>null,
        LevelScheduleImg: <fgui.GImage>null,
        NumBg: <fgui.GImage>null,
        ItemShow: <fgui.GGroup>null,
        BgMask: <fgui.GGroup>null,
        BtnBuy: <fgui.GButton>null,
    };
    public SetData(data: CfgTemplePassRoundPassSet) {
        let item_num = DevilWarOrderData.Inst().GetItemnum();
        let isGrayed = data.item_num > item_num;
        UH.SetText(this.viewNode.Level, data.item_num);
        this.viewNode.PrizeItem1.SetData({ type: 0, isGrayed: isGrayed, itemId: data.reward1, itemNum: data.reward_num1, info: data });
        this.viewNode.PrizeItem2.SetData({ type: 1, isGrayed: isGrayed, itemId: data.reward2, itemNum: data.reward_num2, info: data });
        this.viewNode.PrizeItem3.SetData({ type: 2, isGrayed: isGrayed, itemId: data.reward3, itemNum: data.reward_num3, info: data });

        this.viewNode.PrizeItem1.grayed = isGrayed;
        this.viewNode.PrizeItem2.grayed = isGrayed;
        this.viewNode.PrizeItem3.grayed = isGrayed;

        this.viewNode.NumBg.grayed = isGrayed;
        this.viewNode.BgMask.visible = isGrayed;

        let arrive_seq = DevilWarOrderData.Inst().GetCurArriveSeq();
        this.viewNode.LevelScheduleImg.visible = arrive_seq == data.seq;
        this.height = arrive_seq == data.seq ? 210 : 190;

        let other = DevilWarOrderData.Inst().GetOtherCfg();

        this.viewNode.BtnBuy.visible = DevilWarOrderData.Inst().GetBuyBtnShow(data.seq)
        // this.viewNode.BtnBuy.visible = false
        this.viewNode.BtnBuy.title = other.unlock_item.num + "";
    }
    protected onConstruct() {
        super.onConstruct();
        this.viewNode.BtnBuy.onClick(this.OnClickBtnBuy, this);
    }
    private OnClickBtnBuy() {
        DevilWarorderCtrl.Inst().SendBuyLevel();
    }
}

class DevilWarorderItem extends BaseItemGB {
    private spShow: UISpineShow = undefined;
    protected viewNode = {
        GetPrize: <fgui.GGroup>null,
        bg: <fgui.GLoader>null,
        Lock: <fgui.GImage>null,
        Num: <fgui.GTextField>null,
        Icon: <fgui.GLoader>null,
    };
    protected onConstruct() {
        this.onClick(this.OnClickGetPrize, this);
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }
    public SetData(data: any) {
        this.data = data;

        let isGetPrize = DevilWarOrderData.Inst().IsFetchReward(data.type, data.info.seq);
        let isActive = DevilWarOrderData.Inst().IsActive(data.type);

        UH.SpriteName(this.viewNode.bg, "GrowPass", "ItemCellBg" + data.type);
        if (ITEM_SHOW_TYPE.HERO_PIECE == Item.GetShowType(data.itemId)) {
            UH.SetIcon(this.viewNode.Icon, Item.GetIconId(data.itemId), ICON_TYPE.ROLE);
        } else {
            UH.SetIcon(this.viewNode.Icon, Item.GetIconId(data.itemId), ICON_TYPE.ITEM);
        }
        UH.SetText(this.viewNode.Num, data.itemNum);

        this.viewNode.Lock.visible = !isActive;
        this.viewNode.GetPrize.visible = isGetPrize;

        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null
        }
        if (!data.isGrayed && !isGetPrize && isActive) {
            this.EffShow();
        }
    }

    EffShow() {
        this.spShow = ObjectPool.Get(UISpineShow, ResPath.UIEffect(`1208039`), true, (obj: any) => {
            obj.setPosition(59, -59);
            this._container.insertChild(obj, 0);
            CocHighPerfList.emit(this.node);
        });
    }

    protected onDestroy() {
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null
        }
    }
    private OnClickGetPrize() {
        // if (this.data.isGrayed) {
        //     PublicPopupCtrl.Inst().Center(Language.Common.ItemNotHasTip);
        //     return
        // }
        let isActive = DevilWarOrderData.Inst().IsActive(this.data.type);
        // if (!isActive) {
        //     PublicPopupCtrl.Inst().Center(Language.RoundActivity.tip1);
        //     return
        // }
        let isGetPrize = DevilWarOrderData.Inst().IsFetchReward(this.data.type, this.data.info.seq);
        // if (isGetPrize) {
        //     PublicPopupCtrl.Inst().Center(Language.ActCommon.JiangLiYiLingQu);
        //     return
        // }
        if (!this.data.isGrayed && !isGetPrize && isActive) {
            DevilWarorderCtrl.Inst().SendFetchReward(this.data.type, this.data.info.seq);
        } else {
            Item.OnItemInfo(this.data.itemId);
        }
        // DevilWarorderCtrl.Inst().SendFetchReward(this.data.type, this.data.info.seq);
    }
}

