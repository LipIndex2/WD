import * as fgui from "fairygui-cc";
import { Item } from "modules/bag/ItemData";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { HeroData } from "modules/hero/HeroData";
import { UH } from "../../helpers/UIHelper";
import { FishPassData } from "./FishPassData";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { FishPassCtrl } from "./FishPassCtrl";
import { ActivityData } from "modules/activity/ActivityData";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { COLORS } from "modules/common/ColorEnum";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { OrderCtrl, Order_Data } from "modules/recharge/OrderCtrl";
import { TextHelper } from "../../helpers/TextHelper";
import { Mod } from "modules/common/ModuleDefine";
import { ViewManager } from "manager/ViewManager";
import { ObjectPool } from "core/ObjectPool";
import { ResPath } from "utils/ResPath";
import { RoundActivityBoxView } from "modules/RoundActivity/RoundActivityBoxView";
import { BagData } from "modules/bag/BagData";
import { TrafficPermitUnlockView } from "modules/TrafficPermit/TrafficPermitUnlockView";

@BaseView.registView
export class FishPassView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "FishPass",
        ViewName: "FishPassView",
        LayerType: ViewLayer.Normal,
    };

    protected viewNode = {
        List: <fgui.GList>null,
        BtnClose: <fgui.GButton>null,
        BtnBuy: <fgui.GButton>null,
        BtnOneKeyGet: <fgui.GButton>null,
        NowadayLevel: <fgui.GTextField>null,
        LevelShow: <fgui.GGroup>null,
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

    private passData: any[];
    private index: number = 1;
    private _key_check_buy: string;

    InitData() {
        this.AddSmartDataCare(FishPassData.Inst().FlushData, this.FulshListData.bind(this), "FlushInfo");
        this.viewNode.UISpineShow.LoadSpine(ResPath.Spine("diaoyuzhanling/diaoyuzhanling"), true);

        this.viewNode.BtnClose.onClick(this.closeView, this);
        this.viewNode.BtnOneKeyGet.onClick(this.OnClickOneKeyGet, this);
        this.viewNode.BtnBuy.onClick(this.OnClickBuy, this);
        this.viewNode.BtnSkin.onClick(this.OnClickscrollDown, this);
        this.viewNode.BtnSkin.SetData(this.index * 5);

        this.viewNode.List.itemProvider = this.GetListItemResource.bind(this);
        this.viewNode.List.setVirtual();
        this.viewNode.List.on(fgui.Event.SCROLL, this.slideShow, this);

        this.FulshListData();
        this.FlushTime();

        this._key_check_buy = Mod.FishPass.View + "-1";

        let scrollTo = FishPassData.Inst().scrollListNum();
        this.viewNode.List.scrollToView(scrollTo);
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.passData[index]);
    }

    FulshListData() {
        let isActive = FishPassData.Inst().GetIsActive(1)

        this.passData = FishPassData.Inst().GetFishPassList();
        this.passData.push(0)
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.List.numItems = this.passData.length;

        UH.SetText(this.viewNode.NowadayLevel, TextHelper.Format(Language.FishPass.mine, FishPassData.Inst().Meters));

        this.viewNode.LevelShow.x = isActive ? (800 - this.viewNode.LevelShow.width) / 2 : 45;
        this.viewNode.BtnBuy.visible = !isActive;
        // this.viewNode.BtnOneKeyGet.visible = FishPassData.Inst().GetAllRed() > 0
        this.viewNode.BtnOneKeyGet.visible = false
    }

    InitUI() {
        let otherCfg = FishPassData.Inst().GetOtherCfg();
        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy, this.viewNode.BtnBuy, Language.Recharge.GoldType[0] + (otherCfg.pay_price / 10));
    }

    OnClickOneKeyGet() {
        FishPassCtrl.Inst().SendOnKeyGet();
    }

    OnClickBuy() {
        if (!OrderCtrl.Inst().CheckMaiButtonClick(this._key_check_buy)) {
            PublicPopupCtrl.Inst().Center(Language.Common.payWait)
            return
        }
        let data = FishPassData.Inst().GetOtherCfg();
        let order_data = Order_Data.initOrder(1, ACTIVITY_TYPE.FishPass, data.pay_price, data.pay_price, Language.FishPass.name);
        OrderCtrl.generateOrder(order_data);
    }

    private FlushTime() {
        let time = ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.FishPass) - TimeCtrl.Inst().ServerTime;
        this.viewNode.timer.visible = time > 0
        this.viewNode.timer.CloseCountDownTime()
        if (time > 0) {
            this.viewNode.timer.SetOutline(true, COLORS.Brown, 3)
            this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_7);
        }
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

    private GetListItemResource(index: number) {
        let data = this.passData[index];
        if (data === 0) {
            return fgui.UIPackage.getItemURL("FishPass", "BtnAwardBox");
        } else {
            return fgui.UIPackage.getItemURL("FishPass", "ListAaward");
        }
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
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
    private OnClickBtnBuy() {
        FishPassCtrl.Inst().SendBuyLevel();

        // const other = FishPassData.Inst().GetOtherCfg();
        // ViewManager.Inst().OpenView(TrafficPermitUnlockView, {
        //     item: other.unlock_item,
        //     callback: () => {
        //     }
        // });
    }
    public SetData(data: any) {
        if (!data) return this.viewNode.NodeShow.visible = false;
        this.data = data;
        this.viewNode.NodeShow.visible = true;
        let Meters = FishPassData.Inst().Meters;
        let IsLock = data.meters > Meters;

        UH.SetText(this.viewNode.Level, data.meters);
        this.viewNode.Mask.visible = IsLock;
        this.viewNode.LevelBg.grayed = IsLock;

        this.viewNode.PrizeItem1.SetData({ item: data.free_item, type: 0, level: data.meters, seq: data.seq })
        this.viewNode.PrizeItem2.SetData({ item: data.paid_item, type: 1, level: data.meters, seq: data.seq })

        let other = FishPassData.Inst().GetOtherCfg();
        this.viewNode.BtnBuy.visible = FishPassData.Inst().GetBuyBtnShow(data.seq);
        // this.viewNode.BtnBuy.visible = false
        this.viewNode.BtnBuy.title = other.unlock_item.num + "";
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
    };
    protected onConstruct() {
        this.onClick(this.OnClickFetchReward.bind(this));
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }
    public SetData(data: any) {
        this.data = data;
        let Meters = FishPassData.Inst().Meters;
        let item = Item.GetConfig(data.item.item_id);
        let IsReward = FishPassData.Inst().IsGetReward(data.type, data.seq);
        let isLock = FishPassData.Inst().GetIsActive(data.type);
        this.viewNode.Lock.visible = !isLock;
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

        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null
        }
        if (!IsReward && Meters >= data.level && isLock) {
            this.EffShow();
        }
    }

    EffShow() {
        this.spShow = ObjectPool.Get(UISpineShow, ResPath.UIEffect(`1208039`), true, (obj: any) => {
            obj.setPosition(78, -78);
            obj.setScale(1.3, 1.3)
            this._container.insertChild(obj, 0);
        });
    }

    protected onDestroy() {
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null
        }
    }

    private OnClickFetchReward() {
        let isGetPrize = FishPassData.Inst().IsGetReward(this.data.type, this.data.seq);
        // if (isGetPrize) {
        //     PublicPopupCtrl.Inst().Center(Language.ActCommon.JiangLiYiLingQu);
        //     return
        // }
        // if (!isReceive) {
        //     PublicPopupCtrl.Inst().Center(Language.FishPass.tip);
        //     return
        // }
        let isActive = FishPassData.Inst().GetIsActive(this.data.type);
        // if (!isActive) {
        //     PublicPopupCtrl.Inst().Center(Language.TrafficPermit.extraAward);
        //     return
        // }
        let isReceive = this.data.level <= FishPassData.Inst().Meters && !isGetPrize && isActive;

        let item = Item.GetConfig(this.data.item.item_id);
        if (item.item_type == 11) {
            ViewManager.Inst().OpenView(RoundActivityBoxView, {
                item: item,
                isReceive: isReceive,
                callback: () => {
                    BagData.Inst().ShowRewardBox = true;
                    FishPassCtrl.Inst().SendFetchReward(this.data.type, this.data.seq);
                }
            });
            return;
        }
        if (isReceive) {
            BagData.Inst().ShowRewardBox = false;
            FishPassCtrl.Inst().SendFetchReward(this.data.type, this.data.seq);
        } else {
            Item.OnItemInfo(this.data.item.item_id);
        }
    }
}

class BtnAwardBox extends BaseItemGB {
    protected onConstruct() {
        super.onConstruct()
        this.onClick(this.OnClickBoxOpen, this);
    }
    public SetData() {
        this.title = FishPassData.Inst().fetchEx + ""
    }
    private OnClickBoxOpen() {
        let otherCfg = FishPassData.Inst().GetOtherCfg();
        let item = Item.GetConfig(otherCfg.max_item.item_id);
        let isReceive = FishPassData.Inst().fetchEx > 0;
        ViewManager.Inst().OpenView(RoundActivityBoxView, {
            item: item,
            isReceive: isReceive,
            callback: () => {
                BagData.Inst().ShowRewardBox = true;
                FishPassCtrl.Inst().SendFetchEx();
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
        let levelCfg = FishPassData.Inst().GetPasscheckLevelCfg(data);
        let item = Item.GetConfig(levelCfg.paid_item.item_id);
        if (item && item.item_type == 3) {
            let img = HeroData.Inst().GetDebrisHeroIcon(levelCfg.paid_item.item_id, 1)
            UH.SetIcon(this.viewNode.IconShow, img, ICON_TYPE.ROLE);
        } else {
            UH.SetIcon(this.viewNode.IconShow, item.icon_id, ICON_TYPE.ITEM);
        }
        UH.SetText(this.viewNode.ItenNum, levelCfg.paid_item.num);
        UH.SetText(this.viewNode.NextLevel, Language.FishPass.depth + levelCfg.meters);
    }
}