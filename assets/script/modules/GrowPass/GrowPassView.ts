import { ObjectPool } from 'core/ObjectPool';
import * as fgui from "fairygui-cc";
import { ViewManager } from 'manager/ViewManager';
import { GrowPassCtrl } from 'modules/GrowPass/GrowPassCtrl';
import { AudioTag } from 'modules/audio/AudioManager';
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { CommonId, ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { Mod } from 'modules/common/ModuleDefine';
import { CurrencyShow, ExpShow } from "modules/extends/Currency";
import { EGLoader } from 'modules/extends/EGLoader';
import { PublicPopupCtrl } from 'modules/public_popup/PublicPopupCtrl';
import { OrderCtrl, Order_Data, RechargeType } from 'modules/recharge/OrderCtrl';
import { UISpineShow } from 'modules/scene_obj_spine/UISpineShow';
import { SettingUsertServeData } from 'modules/setting/SettingUsertServeData';
import { ResPath } from 'utils/ResPath';
import { CocHighPerfList } from '../../ccomponent/CocHighPerfList';
import { UH } from "../../helpers/UIHelper";
import { GrowPassData } from "./GrowPassData";

@BaseView.registView
export class GrowPassView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "GrowPass",
        ViewName: "GrowPassView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlock,
        OpenAudio: AudioTag.TanChuJieMian,
    };

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,
        liuhaiscreen: <fgui.GComponent>null,
        bg: <EGLoader>null,
        parent: <fgui.GComponent>null,
        BtnClose: <fgui.GButton>null,
        BtnBuy1: <fgui.GButton>null,
        BtnBuy2: <fgui.GButton>null,
        BtnFront: <fgui.GButton>null,
        BtnQueen: <fgui.GButton>null,
        list: <fgui.GList>null,
        Num: <fgui.GTextField>null,
        BtnOneKeyGet: <fgui.GButton>null,

        ExpShow: <ExpShow>null,
        Currency1: <CurrencyShow>null,
        Currency2: <CurrencyShow>null,
        Currency3: <CurrencyShow>null,
    };

    protected extendsCfg = [
        { ResName: "GrowItem", ExtendsClass: GrowItem },
        { ResName: "GrowPrizeCell", ExtendsClass: GrowPrizeCell },
    ];

    private spShow1: UISpineShow = undefined;
    private spShow2: UISpineShow = undefined;
    private _key_check_buy1: string;
    private _key_check_buy2: string;
    private isScrollTo: boolean = false;
    private type: number = 0;
    listData: { cfg: import("d:/ccs/wjszm-c/assets/script/config/CfgGrowPass").CfgGrowPassSet; isActive: any[]; isFetch: any[]; level: number; itemType: boolean; }[];
    InitData() {

        this.AddSmartDataCare(GrowPassData.Inst().FlushData, this.FulshListData.bind(this), "FlushInfo");

        this.viewNode.BtnClose.onClick(this.closeView, this);
        this.viewNode.BtnFront.onClick(this.OnClickStage.bind(this, 0));
        this.viewNode.BtnQueen.onClick(this.OnClickStage.bind(this, 1));
        this.viewNode.BtnBuy1.onClick(this.OnClickBuy.bind(this, 1));
        this.viewNode.BtnBuy2.onClick(this.OnClickBuy.bind(this, 2));
        this.viewNode.BtnOneKeyGet.onClick(this.OnClickOneKeyGet, this);

        this.viewNode.Currency1.SetCurrency(CommonId.Gold);
        this.viewNode.Currency2.SetCurrency(CommonId.Energy);
        this.viewNode.Currency3.SetCurrency(CommonId.Diamond);
        this.viewNode.Currency2.BtnAddShow(true);

        this.viewNode.list._container.addComponent(CocHighPerfList);
        this.viewNode.list.setVirtual();

        this._key_check_buy1 = Mod.GrowPass.View + "-1";
        this._key_check_buy2 = Mod.GrowPass.View + "-2";

        this.FulshListData();

    }

    private itemRenderer(index: number, item: any){
        item.SetData(this.listData[index]);
    }

    private FulshListData() {
        let listInfoData = GrowPassData.Inst().GetListData(this.type);
        this.listData = listInfoData;
        this.viewNode.list.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.list.numItems = listInfoData.length;
        this.viewNode.BtnBuy1.visible = !GrowPassData.Inst().IsActive(this.type * 3 + 1);
        this.viewNode.BtnBuy2.visible = !GrowPassData.Inst().IsActive(this.type * 3 + 2);

        let otherCfg = GrowPassData.Inst().GetOtherCfg();
        if (this.type == 1) {
            UH.SetText(this.viewNode.Num, otherCfg.item_num_all2);
        } else {
            UH.SetText(this.viewNode.Num, otherCfg.item_num_all);
        }

        let isTwo = GrowPassData.Inst().IsTwoStage();
        this.viewNode.BtnFront.visible = isTwo;
        this.viewNode.BtnQueen.visible = isTwo;
        if (!this.isScrollTo) {
            let scroll = GrowPassData.Inst().scrollListNum(listInfoData);
            let num = scroll >= listInfoData.length ? listInfoData.length - 1 : scroll
            this.viewNode.list.scrollToView(num);
            this.isScrollTo = true;
        }
        // this.viewNode.BtnOneKeyGet.x = isTwo ? 160 : 490
        // this.viewNode.BtnOneKeyGet.visible = GrowPassData.Inst().GetAllRed() > 0
        this.viewNode.BtnOneKeyGet.visible = false
    }

    InitUI() {
        let otherCfg = GrowPassData.Inst().GetOtherCfg();
        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy1, this.viewNode.BtnBuy1, Language.Recharge.GoldType[0] + (otherCfg.price1 / 10));
        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy2, this.viewNode.BtnBuy2, Language.Recharge.GoldType[0] + (otherCfg.price2 / 10));

        this.spShow2 = ObjectPool.Get(UISpineShow, ResPath.Spine(`baoxianxiang/baoxianxiang`), true, (obj: any) => {
            obj.setPosition(-165, 0);
            this.viewNode.parent._container.insertChild(obj, 0);
        });
        this.spShow1 = ObjectPool.Get(UISpineShow, ResPath.Spine(`baicai/baicai`), true, (obj: any) => {
            obj.setPosition(-30, -5);
            obj.setScale(0.5, 0.5)
            this.viewNode.parent._container.insertChild(obj, 1);
        });
    }

    OnClickBuy(buyType: number) {
        if (GrowPassData.Inst().IsActive(this.type * 3 + buyType)) {
            return;
        }
        if ((buyType == 1 && !OrderCtrl.Inst().CheckMaiButtonClick(this._key_check_buy1)) || (buyType == 2 && !OrderCtrl.Inst().CheckMaiButtonClick(this._key_check_buy2))) {
            PublicPopupCtrl.Inst().Center(Language.Common.payWait)
            return
        }
        let data = GrowPassData.Inst().GetOtherCfg();
        let payPrice = buyType == 1 ? data.price1 : data.price2;

        let cfg_word = SettingUsertServeData.Inst().GetWordDes(8);//成长基金
        let name = (cfg_word && cfg_word.name) ? cfg_word.name : Language.Recharge.Diamond;
        let order_data = Order_Data.initOrder(buyType, RechargeType.BUY_TYPE_GROWTH_FUND, payPrice, payPrice, name);
        OrderCtrl.generateOrder(order_data);
    }

    OnClickStage(type: number) {
        this.type = type;
        this.isScrollTo = false;
        this.viewNode.BtnFront.selected = type == 0;
        this.viewNode.BtnQueen.selected = type == 1;
        this.FulshListData();
    }

    OnClickOneKeyGet() {
        GrowPassCtrl.Inst().SendOnKeyGet();
    }

    WindowSizeChange() {
        this.refreshBgSize(this.viewNode.bg)
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        if (this.spShow1) {
            ObjectPool.Push(this.spShow1);
            this.spShow1 = null
        }
        if (this.spShow2) {
            ObjectPool.Push(this.spShow2);
            this.spShow2 = null
        }
    }
}

export class GrowPrizeCell extends BaseItem {
    protected viewNode = {
        PrizeItem1: <GrowItem>null,
        PrizeItem2: <GrowItem>null,
        PrizeItem3: <GrowItem>null,
        Level: <fgui.GTextField>null,
        LevelScheduleImg: <fgui.GImage>null,
        NumBg: <fgui.GImage>null,
        ItemShow: <fgui.GGroup>null,
        BgMask: <fgui.GGroup>null,
    };
    public SetData(data: any) {
        this.viewNode.ItemShow.visible = true;
        this.viewNode.BgMask.visible = false;
        if (!data) {
            this.viewNode.ItemShow.visible = false;
            return;
        }
        let isGrayed = data.cfg.level > data.level;
        UH.SetText(this.viewNode.Level, data.cfg.level);
        this.viewNode.PrizeItem1.SetData({ type: 0, isGrayed: isGrayed, itemId: data.cfg.reward1, itemNum: data.cfg.reward_num1, info: data });
        this.viewNode.PrizeItem2.SetData({ type: 1, isGrayed: isGrayed, itemId: data.cfg.reward2, itemNum: data.cfg.reward_num2, info: data });
        this.viewNode.PrizeItem3.SetData({ type: 2, isGrayed: isGrayed, itemId: data.cfg.reward3, itemNum: data.cfg.reward_num3, info: data });

        this.viewNode.PrizeItem1.grayed = isGrayed;
        this.viewNode.PrizeItem2.grayed = isGrayed;
        this.viewNode.PrizeItem3.grayed = isGrayed;

        this.viewNode.NumBg.grayed = isGrayed;
        this.viewNode.BgMask.visible = isGrayed;

        this.viewNode.LevelScheduleImg.visible = data.itemType
        this.height = data.itemType ? 210 : 190;
    }
}

export class GrowItem extends BaseItemGB {
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
        let isActive = data.info.isActive[data.type];
        let level = data.info.level;
        let isGetPrize = data.info.isFetch[data.type];

        UH.SpriteName(this.viewNode.bg, "GrowPass", "ItemCellBg" + data.type);
        UH.SetIcon(this.viewNode.Icon, data.itemId, ICON_TYPE.ITEM);
        UH.SetText(this.viewNode.Num, data.itemNum);

        this.viewNode.Lock.visible = !isActive;
        this.viewNode.GetPrize.visible = isGetPrize;

        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null
        }
        if (level >= data.info.cfg.level && !isGetPrize && isActive) {
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
        let isGetPrize = this.data.info.isFetch[this.data.type];
        let isActive = this.data.info.isActive[this.data.type];
        if (!isActive) {
            PublicPopupCtrl.Inst().Center(Language.RoundActivity.tip1);
            return
        }
        if (this.data.isGrayed) {
            PublicPopupCtrl.Inst().Center(Language.Common.levelNotHasTip);
            return
        }
        if (isGetPrize) {
            PublicPopupCtrl.Inst().Center(Language.ActCommon.JiangLiYiLingQu);
            return
        }
        GrowPassCtrl.Inst().SendGrowPassReward(this.data.type, this.data.info.cfg.seq);
    }
}

