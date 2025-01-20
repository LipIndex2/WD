import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { CommonId, ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { ExpShow, CurrencyShow } from "modules/extends/Currency";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";
import { UH } from "../../helpers/UIHelper";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { DefensePassCheckData } from "./DefensePassCheckData";
import { Mod } from "modules/common/ModuleDefine";
import { OrderCtrl, Order_Data } from "modules/recharge/OrderCtrl";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { GetCfgValue } from "config/CfgCommon";
import { HeroData } from "modules/hero/HeroData";
import { Item } from "modules/bag/ItemData";
import { DefensePassCheckCtrl } from "./DefensePassCheckCtrl";
import { SettingUsertServeData } from "modules/setting/SettingUsertServeData";
import { AudioTag } from "modules/audio/AudioManager";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { RoundActivityBoxView } from "modules/RoundActivity/RoundActivityBoxView";
import { BagData } from "modules/bag/BagData";

@BaseView.registView
export class DefensePassCheckView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "DefensePassCheck",
        ViewName: "DefensePassCheckView",
        LayerType: ViewLayer.Normal,
        OpenAudio: AudioTag.TanChuJieMian,
    };

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,
        liuhaiscreen: <fgui.GComponent>null,
        ExpShow: <ExpShow>null,
        Currency1: <CurrencyShow>null,
        Currency2: <CurrencyShow>null,
        Currency3: <CurrencyShow>null,
        // ItemCell: <ItemCell>null,
        timer: <TimeMeter>null,
        BtnClose: <fgui.GButton>null,
        BtnBuy1: <fgui.GButton>null,
        BtnBuy2: <fgui.GButton>null,
        list: <fgui.GList>null,
        // parent: <fgui.GComponent>null,
        BtnOneKeyGet: <fgui.GButton>null,
        UISpineShow: <UISpineShow>null,
    };

    protected extendsCfg = [
        { ResName: "RewardItem", ExtendsClass: RewardItem },
        { ResName: "ListItem", ExtendsClass: ListItem }
    ];

    private _key_check_buy1: string;
    private _key_check_buy2: string;

    InitData() {

        this.viewNode.UISpineShow.LoadSpine(ResPath.Spine("shouweihouyuan/shouweihouyuan_top"), true);

        this.AddSmartDataCare(DefensePassCheckData.Inst().FlushData, this.FulshListData.bind(this), "FlushInfo");

        this.viewNode.BtnClose.onClick(this.closeView.bind(this));
        this.viewNode.BtnBuy1.onClick(this.OnClickBuy.bind(this, 1));
        this.viewNode.BtnBuy2.onClick(this.OnClickBuy.bind(this, 2));
        this.viewNode.BtnOneKeyGet.onClick(this.OnClickOneKeyGet, this);

        this.viewNode.Currency1.SetCurrency(CommonId.Gold);
        this.viewNode.Currency2.SetCurrency(CommonId.Energy);
        this.viewNode.Currency3.SetCurrency(CommonId.Diamond);
        this.viewNode.Currency2.BtnAddShow(true);

        this.viewNode.list.setVirtual();

        this._key_check_buy1 = Mod.DefensePassCheck.View + "-1";
        this._key_check_buy2 = Mod.DefensePassCheck.View + "-2";

        this.FulshListData();

        let scroll = DefensePassCheckData.Inst().scrollListNum();
        this.viewNode.list.scrollToView(scroll);

    }

    FulshListData() {
        let listdata = DefensePassCheckData.Inst().GetListData()
        this.viewNode.list.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.list.numItems = listdata.length;

        this.viewNode.BtnBuy1.visible = !DefensePassCheckData.Inst().GetIsActiveInfo(1);
        this.viewNode.BtnBuy2.visible = !DefensePassCheckData.Inst().GetIsActiveInfo(2);

        // this.viewNode.BtnOneKeyGet.visible = DefensePassCheckData.Inst().GetAllRed() > 0
        this.viewNode.BtnOneKeyGet.visible = false
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(DefensePassCheckData.Inst().GetListData()[index]);
    }

    InitUI() {
        let otherCfg = DefensePassCheckData.Inst().GetOtherCfg();
        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy1, this.viewNode.BtnBuy1, Language.Recharge.GoldType[0] + (otherCfg.price1 / 10));
        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy2, this.viewNode.BtnBuy2, Language.Recharge.GoldType[0] + (otherCfg.price2 / 10));
        this.FlushFlushTime()
    }

    private FlushFlushTime() {
        let endTime = DefensePassCheckData.Inst().getEndTime();
        let time = endTime - TimeCtrl.Inst().ServerTime;
        this.viewNode.timer.visible = time > 0
        if (time > 0) {
            this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_7);
        }
    }

    OnClickBuy(type: number) {
        if (DefensePassCheckData.Inst().GetIsActiveInfo(type)) {
            return;
        }
        if ((type == 1 && !OrderCtrl.Inst().CheckMaiButtonClick(this._key_check_buy1)) || (type == 2 && !OrderCtrl.Inst().CheckMaiButtonClick(this._key_check_buy2))) {
            PublicPopupCtrl.Inst().Center(Language.Common.payWait)
            return
        }
        let data = DefensePassCheckData.Inst().GetOtherCfg();
        let payPrice = type == 1 ? data.price1 : data.price2;
        let cfg_word = SettingUsertServeData.Inst().GetWordDes(11);//英雄活动
        let name = (cfg_word && cfg_word.name) ? cfg_word.name : Language.Recharge.Diamond;
        let order_data = Order_Data.initOrder(type, ACTIVITY_TYPE.DefensePassCheck, payPrice, payPrice, name);
        OrderCtrl.generateOrder(order_data);
    }

    OnClickOneKeyGet() {
        DefensePassCheckCtrl.Inst().SendOnKeyGet();
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        this.viewNode.timer.CloseCountDownTime()
        // if (this.sp_show) {
        //     ObjectPool.Push(this.sp_show);
        // }
    }
}

class ListItem extends BaseItem {
    protected viewNode = {
        Wire: <fgui.GImage>null,
        Num: <fgui.GTextField>null,
        RoundItem0: <RewardItem>null,
        RoundItem1: <RewardItem>null,
        RoundItem2: <RewardItem>null,
    };
    private stateCtrler: fgui.Controller
    public SetData(data: any) {
        this.stateCtrler = this.getController("ItemState");
        UH.SetText(this.viewNode.Num, data.cfg.level);
        if (data.cfg.level > data.level) {
            this.stateCtrler.selectedIndex = 1
        } else {
            this.stateCtrler.selectedIndex = 0
        }
        this.viewNode.Wire.visible = data.isShowWire
        this.height = data.isShowWire ? 214 : 190;
        this.viewNode.RoundItem0.SetData({ type: 0, info: data });
        this.viewNode.RoundItem1.SetData({ type: 1, info: data });
        this.viewNode.RoundItem2.SetData({ type: 2, info: data });
    }
}
class RewardItem extends BaseItemGB {
    private spShow: UISpineShow = undefined;
    protected viewNode = {
        GetPrize: <fgui.GGroup>null,
        Lock: <fgui.GImage>null,
        Num: <fgui.GTextField>null,
        Bg: <fgui.GLoader>null,
        Icon: <fgui.GLoader>null,
    };
    protected onConstruct() {
        this.onClick(this.OnClickGetPrize, this);
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }
    public SetData(data: any) {
        this.data = data;
        let num = GetCfgValue(data.info.cfg, "reward_num" + (data.type + 1))
        let itemId = GetCfgValue(data.info.cfg, "reward" + (data.type + 1))
        let item = Item.GetConfig(itemId);
        if (item && item.item_type == 3) {
            let img = HeroData.Inst().GetDebrisHeroIcon(itemId, 1)
            UH.SetIcon(this.viewNode.Icon, img, ICON_TYPE.ROLE);
        } else {
            UH.SetIcon(this.viewNode.Icon, itemId, ICON_TYPE.ITEM);
        }
        UH.SpriteName(this.viewNode.Bg, "DefensePassCheck", "ItemCellBg" + data.type);
        UH.SetText(this.viewNode.Num, num);
        this.viewNode.Lock.visible = !data.info.isActive[data.type];
        this.viewNode.GetPrize.visible = data.info.isFetch[data.type];

        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null
        }
        if (data.info.level >= data.info.cfg.level && !data.info.isFetch[data.type] && data.info.isActive[data.type]) {
            this.EffShow();
        }
    }

    EffShow() {
        this.spShow = ObjectPool.Get(UISpineShow, ResPath.UIEffect(`1208039`), true, (obj: any) => {
            obj.setPosition(59, -59);
            this._container.insertChild(obj, 0);
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
        let isReceive = this.data.info.level >= this.data.info.cfg.level && !isGetPrize && isActive;

        let itemId = GetCfgValue(this.data.info.cfg, "reward" + (this.data.type + 1))
        let item = Item.GetConfig(itemId);
        if (item.item_type == 11) {
            ViewManager.Inst().OpenView(RoundActivityBoxView, {
                item: item,
                type: this.data.type,
                seq: this.data.info.cfg.seq,
                isReceive: isReceive,
                callback: () => {
                    BagData.Inst().ShowRewardBox = true;
                    DefensePassCheckCtrl.Inst().SendFetchReward(this.data.type, this.data.info.cfg.seq);
                }
            });
            return;
        }
        if (isReceive) {
            BagData.Inst().ShowRewardBox = false;
            DefensePassCheckCtrl.Inst().SendFetchReward(this.data.type, this.data.info.cfg.seq);
        } else {
            Item.OnItemInfo(itemId);
        }
    }
}

