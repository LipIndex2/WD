import { ObjectPool } from 'core/ObjectPool';
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from 'modules/audio/AudioManager';
import { Item } from "modules/bag/ItemData";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { COLORS } from 'modules/common/ColorEnum';
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { TimeFormatType, TimeMeter } from 'modules/extends/TimeMeter';
import { HeroData } from 'modules/hero/HeroData';
import { PublicPopupCtrl } from 'modules/public_popup/PublicPopupCtrl';
import { UISpineShow } from 'modules/scene_obj_spine/UISpineShow';
import { TimeCtrl } from 'modules/time/TimeCtrl';
import { ResPath } from 'utils/ResPath';
import { UH } from "../../helpers/UIHelper";
import { BagData } from 'modules/bag/BagData';
import { ArenaPassCtrl, ArenaPassData } from './ArenaPassCtrl';
import { OrderCtrl, Order_Data } from 'modules/recharge/OrderCtrl';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { Mod } from 'modules/common/ModuleDefine';
import { TrafficPermitBoxView } from 'modules/TrafficPermit/TrafficPermitBoxView';
import { UIEffectShow } from 'modules/scene_obj_spine/UIEffectShow';
import { RoundActivityBoxView } from 'modules/RoundActivity/RoundActivityBoxView';
import { ArenaData } from 'modules/Arena/ArenaData';
import { TrafficPermitUnlockView } from 'modules/TrafficPermit/TrafficPermitUnlockView';

@BaseView.registView
export class ArenaPassView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "TrafficPermit",
        ViewName: "ArenaPassView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlock,
        OpenAudio: AudioTag.TanChuJieMian,
    };

    protected viewNode = {
        ExpProgressBar: <fgui.GProgressBar>null,
        List: <fgui.GList>null,
        BtnClose: <fgui.GButton>null,
        BtnActivate: <fgui.GButton>null,
        BtnOneKeyGet: <fgui.GButton>null,
        IconShow: <fgui.GLoader>null,
        ItenNum: <fgui.GTextField>null,
        NowadayLevel: <fgui.GTextField>null,
        NextLevel: <fgui.GTextField>null,
        ProgressShow: <fgui.GGroup>null,
        // Time: <fgui.GTextField>null,
        BtnSkin: <BtnSkin>null,
        timer: <TimeMeter>null,
        parent: <fgui.GComponent>null,
        UISpineShow: <UISpineShow>null,
    };

    protected extendsCfg = [
        { ResName: "ListAaward", ExtendsClass: ListAaward },
        { ResName: "PrizeItem", ExtendsClass: PrizeItem },
        { ResName: "BtnSkin", ExtendsClass: BtnSkin },
        { ResName: "BtnAwardBox", ExtendsClass: BtnAwardBox },
    ];

    private data: ArenaPassData = ArenaPassData.Inst();
    private passData: any[];
    private index: number = 1;
    private cache_timer: number = 1;
    private isScrollTo: boolean = false;
    private spShow: UISpineShow = undefined;

    private _key_check_buy: string;

    InitData() {
        this.ResetExtension();
        this.AddSmartDataCare(ArenaPassData.Inst().FlushData, this.FulshListData.bind(this), "FlushInfo");

        this.viewNode.BtnClose.onClick(this.closeView.bind(this));
        this.viewNode.BtnOneKeyGet.onClick(this.OnClickOneKeyGet, this);
        this.viewNode.BtnActivate.onClick(this.OnClickActivate, this);
        this.viewNode.BtnSkin.onClick(this.OnClickscrollDown, this);
        this.viewNode.BtnSkin.SetData(this.index * 5);

        this.viewNode.timer.SetCallBack(this.FlushFlushTime.bind(this));

        this.viewNode.List.itemProvider = this.GetListItemResource.bind(this);
        this.viewNode.List.setVirtual();
        this.viewNode.List.on(fgui.Event.SCROLL, this.slideShow, this);

        let effectPath = "PVP/PVP-pass";
        this.viewNode.UISpineShow.LoadSpine(ResPath.Spine(effectPath), true);


        this._key_check_buy = Mod.ArenaPass.View + "-1";

        this.FulshListData();
        this.FlushFlushTime();
    }

    InitUI() {
        let otherCfg = ArenaPassData.Inst().GetOtherCfg();
        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy, this.viewNode.BtnActivate, Language.Recharge.GoldType[0] + (otherCfg.pay_price / 10));
    }

    private FulshListData() {
        let level = this.data.GetLevel();
        let levelCfg = this.data.GetPasscheckLevelCfg(level);
        let exp = this.data.getPasscheckExp();
        let isActive = ArenaPassData.Inst().GetIsActive()
        UH.SetText(this.viewNode.NowadayLevel, level);
        this.viewNode.ExpProgressBar.value = exp;
        this.viewNode.ExpProgressBar.max = levelCfg.up_exp;

        this.passData = this.data.GetPassNowPrize();

        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.List.numItems = this.passData.length;

        this.viewNode.ProgressShow.x = isActive ? 231 : 31;
        this.viewNode.BtnActivate.visible = !isActive;

        if (!this.isScrollTo) {
            let scrollTo = ArenaPassData.Inst().scrollListNum();
            let num = scrollTo >= this.passData.length ? this.passData.length - 1 : scrollTo
            this.viewNode.List.scrollToView(num);
            this.isScrollTo = true;
        }

        // this.viewNode.BtnOneKeyGet.visible = TrafficPermitData.Inst().IsRewardCanGet() > 0
        this.viewNode.BtnOneKeyGet.visible = false
    }

    private itemRenderer(index: number, item: ListAaward) {
        item.SetData(this.passData[index]);
    }

    private GetListItemResource(index: number) {
        let data = this.passData[index];
        if (typeof (data) === "number") {
            return fgui.UIPackage.getItemURL("TrafficPermit", "BtnAwardBox");
        } else {
            return fgui.UIPackage.getItemURL("TrafficPermit", "ListAaward");
        }
    }

    private FlushFlushTime() {
        let endTime = ArenaPassData.Inst().getEndTime()
        let time = endTime - TimeCtrl.Inst().ServerTime;
        this.viewNode.timer.visible = time > 0
        this.viewNode.timer.CloseCountDownTime()
        if (time > 0) {
            this.viewNode.timer.SetOutline(true, COLORS.Brown, 3)
            this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_4);
        }
    }

    OnClickActivate() {
        if (!OrderCtrl.Inst().CheckMaiButtonClick(this._key_check_buy)) {
            PublicPopupCtrl.Inst().Center(Language.Common.payWait)
            return
        }
        let data = ArenaPassData.Inst().GetOtherCfg();
        let order_data = Order_Data.initOrder(1, ACTIVITY_TYPE.ArenaPass, data.pay_price, data.pay_price, Language.CavePass.name);
        OrderCtrl.generateOrder(order_data);
    }

    OnClickOneKeyGet() {
        ArenaPassCtrl.Inst().SendOnKeyGet();
    }

    slideShow() {
        let posy = this.viewNode.List.scrollPane.posY + 4 * 208;
        let downIndex = Math.floor(posy / 208);
        let btnshow = Math.ceil(downIndex / 5);
        if (btnshow != this.index) {
            this.index = btnshow;
            this.viewNode.BtnSkin.SetData(btnshow * 5);
        }
        this.viewNode.BtnSkin.visible = downIndex < 79;
    }

    OnClickscrollDown() {
        let posy = this.viewNode.List.scrollPane.posY + 2 * 208;
        let downIndex = Math.floor(posy / 208);
        let num = 5 - (downIndex % 5)
        this.viewNode.List.scrollPane.scrollDown(num);
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        if (this.spShow) {
            this.spShow.onDestroy();
            this.spShow = null;
        }
        this.viewNode.timer.CloseCountDownTime();
    }
}

class ListAaward extends BaseItem {
    protected viewNode = {
        ScheduleImg: <fgui.GImage>null,
        LevelBg: <fgui.GImage>null,
        Mask: <fgui.GImage>null,
        Level: <fgui.GTextField>null,
        BtnBuy: <fgui.GButton>null,
        PrizeItem1: <PrizeItem>null,
        PrizeItem2: <PrizeItem>null,
        NodeShow: <fgui.GGroup>null,
    };
    protected onConstruct() {
        super.onConstruct();
        this.viewNode.BtnBuy.onClick(this.OnClickBtnBuy, this);
    }
    public SetData(data: any) {
        if (!data) return this.viewNode.NodeShow.visible = false;
        this.data = data;
        this.viewNode.NodeShow.visible = true;
        let level = ArenaPassData.Inst().GetLevel();
        let IsLock = data.level > level;
        let other = ArenaPassData.Inst().GetOtherCfg();

        UH.SetText(this.viewNode.Level, data.level);
        this.viewNode.Mask.visible = IsLock;
        this.viewNode.LevelBg.grayed = IsLock;
        this.viewNode.BtnBuy.visible = data.level == level + 1;
        // this.viewNode.BtnBuy.visible = false
        this.viewNode.BtnBuy.title = other.unlock_item.num + "";

        this.viewNode.PrizeItem1.SetData({ item: data.free_item, type: 0, level: data.level, currentLevel: level })
        this.viewNode.PrizeItem2.SetData({ item: data.paid_item, type: 1, level: data.level, currentLevel: level })
    }

    private OnClickBtnBuy() {
        ArenaPassCtrl.Inst().SendBuyLevel();

        // const other = ArenaPassData.Inst().GetOtherCfg();
        // ViewManager.Inst().OpenView(TrafficPermitUnlockView, {
        //     item: other.unlock_item,
        //     callback: () => {
        //     }
        // });
    }
}

class PrizeItem extends BaseItemGB {
    private spShow: UISpineShow = undefined;
    protected viewNode = {
        fullscreen: <fgui.GComponent>null,
        Bg1: <fgui.GImage>null,
        Bg2: <fgui.GImage>null,
        Gain: <fgui.GImage>null,
        Lock: <fgui.GImage>null,
        HeroDebris: <fgui.GImage>null,
        Num: <fgui.GTextField>null,
        Icon: <fgui.GLoader>null,
        UIEffectShow: <UIEffectShow>null,
    };
    protected onConstruct() {
        this.onClick(this.OnClickFetchReward.bind(this));
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }
    private isShowed = false;
    public SetData(data: any) {
        this.data = data;
        let item = Item.GetConfig(data.item.item_id);
        let isLock = !ArenaPassData.Inst().GetIsActive(data.type);
        let IsReward = ArenaPassData.Inst().IsGetReward(data.type, data.level);
        this.viewNode.Lock.visible = isLock;
        this.viewNode.Bg1.visible = data.type == 0;
        this.viewNode.Bg2.visible = data.type == 1;
        this.viewNode.Gain.visible = IsReward;
        this.viewNode.Num.visible = !IsReward;

        this.viewNode.HeroDebris.visible = (item && item.item_type == 3);

        if (item && item.item_type == 3) {
            let img = HeroData.Inst().GetDebrisHeroIcon(data.item.item_id, 1)
            UH.SetIcon(this.viewNode.Icon, img, ICON_TYPE.ROLE);
        } else {
            UH.SetIcon(this.viewNode.Icon, item.icon_id, ICON_TYPE.ITEM);
        }
        UH.SetText(this.viewNode.Num, data.item.num);

        if (!IsReward && data.currentLevel >= data.level && !isLock) {
            this.viewNode.UIEffectShow.visible = true;
            if (!this.isShowed) {
                this.viewNode.UIEffectShow.PlayEff("1208039");
                this.isShowed = true;
            }
        } else {
            this.viewNode.UIEffectShow.visible = false;
        }
    }


    protected onDestroy() {
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null
        }
    }

    private OnClickFetchReward() {
        let isGetPrize = ArenaPassData.Inst().IsGetReward(this.data.type, this.data.seq);
        let isActive = ArenaPassData.Inst().GetIsActive(this.data.type);
        let isReceive = this.data.level <= ArenaPassData.Inst().GetLevel() && !isGetPrize && isActive;

        let item = Item.GetConfig(this.data.item.item_id);
        if (item.item_type == 11) {
            ViewManager.Inst().OpenView(RoundActivityBoxView, {
                item: item,
                isReceive: isReceive,
                callback: () => {
                    BagData.Inst().ShowRewardBox = true;
                    ArenaPassCtrl.Inst().SendFetchReward(this.data.type, this.data.level);
                }
            });
            return;
        }
        if (isReceive) {
            BagData.Inst().ShowRewardBox = false;
            ArenaPassCtrl.Inst().SendFetchReward(this.data.type, this.data.level);
        } else {
            Item.OnItemInfo(this.data.item.item_id);
        }
    }
}

class BtnAwardBox extends BaseItemGB {
    protected viewNode = {

    };
    protected onConstruct() {
        this.onClick(this.OnClickBoxOpen, this);
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }
    public SetData(data: any) {
        this.title = ArenaPassData.Inst().fetchEx + ""
    }
    private OnClickBoxOpen() {
        // let item = Item.GetConfig(60004);
        // let is_max = ArenaPassData.Inst().IsLevelMax();
        // ViewManager.Inst().OpenView(TrafficPermitBoxView, { item: item, type: 0, isReceive: is_max, isMax: is_max });

        let otherCfg = ArenaPassData.Inst().GetOtherCfg();
        let item = Item.GetConfig(otherCfg.max_item.item_id);
        let isReceive = ArenaPassData.Inst().fetchEx > 0;
        ViewManager.Inst().OpenView(RoundActivityBoxView, {
            item: item,
            isReceive: isReceive,
            callback: () => {
                BagData.Inst().ShowRewardBox = true;
                ArenaPassCtrl.Inst().SendFetchEx();
            }
        });
    }
}

class BtnSkin extends BaseItemGB {
    protected viewNode = {
        NextLevel: <fgui.GTextField>null,
        ItenNum: <fgui.GTextField>null,
        IconShow: <fgui.GLoader>null,
    };
    public SetData(data: number) {
        let levelCfg = ArenaPassData.Inst().GetPasscheckLevelCfg(data);
        let item = Item.GetConfig(levelCfg.paid_item.item_id);
        if (item && item.item_type == 3) {
            let img = HeroData.Inst().GetDebrisHeroIcon(levelCfg.paid_item.item_id, 1)
            UH.SetIcon(this.viewNode.IconShow, img, ICON_TYPE.ROLE);
        } else {
            UH.SetIcon(this.viewNode.IconShow, item.icon_id, ICON_TYPE.ITEM);
        }
        UH.SetText(this.viewNode.ItenNum, levelCfg.paid_item.num);
        UH.SetText(this.viewNode.NextLevel, Language.Common.level + data);
    }
}