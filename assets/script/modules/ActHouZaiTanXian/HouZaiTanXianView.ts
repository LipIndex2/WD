import { CfgHouZai, CfgHouZaiReward } from "config/CfgHouZai";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { ActivityCtrl } from "modules/activity/ActivityCtrl";
import { ActivityData } from "modules/activity/ActivityData";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { Item } from "modules/bag/ItemData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { COLORS } from "modules/common/ColorEnum";
import { AdType } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { Mod } from "modules/common/ModuleDefine";
import { ItemCell } from "modules/extends/ItemCell";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { OrderCtrl, Order_Data } from "modules/recharge/OrderCtrl";
import { RoleData } from "modules/role/RoleData";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { UH } from "../../helpers/UIHelper";
import { ChannelAgent } from "../../proload/ChannelAgent";
import { ActHouZaiItemState, HouZaiTanXianData, IHouZaiShopItemData } from "./HouZaiTanXianCtrl";
import { EGLoader } from "modules/extends/EGLoader";
import { AudioTag } from "modules/audio/AudioManager";

@BaseView.registView
export class HouZaiTanXianView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "ActHouZaiTanXian",
        ViewName: "ActHouZaiTanXianView",
        LayerType: ViewLayer.Normal,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        BtnClose: <fgui.GButton>null,
        ActTitle: <fgui.GTextField>null,
        Timer: <TimeMeter>null,
        List: <fgui.GList>null,
        Spine: <UISpineShow>null,
        BG: <EGLoader>null,
    };

    protected extendsCfg = [
        { ResName: "ShopItem", ExtendsClass: HouZaiShopItem },
        { ResName: "BuyItem", ExtendsClass: HouZaiBuyItem }
    ];

    InitData() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.HouZai, 0);
        this.AddSmartDataCare(HouZaiTanXianData.Inst().actInfo, this.FlushPanel.bind(this), "data", "click_buy_change")

        this.viewNode.List.setVirtual();
    }

    DoOpenWaitHandle() {
        let waitHandle = this.createWaitHandle("loadHouZai");
        this.AddWaitHandle(waitHandle);
        this.viewNode.BG.SetIcon("loader/ui_bg/houzai_bg", () => {
            waitHandle.complete = true;
        })
    }

    OpenCallBack() {
        this.viewNode.BtnClose.onClick(this.OnCloseClick, this);
        let funcopenCfg = FunOpen.Inst().GetFunOpenModCfg(Mod.HouZai.View);
        UH.SetText(this.viewNode.ActTitle, funcopenCfg.name);
        this.FlushTime();
        this.viewNode.Spine.LoadSpine("spine/houzhaitanxian/houzhaitanxian", true);

        this.FlushPanel();
    }

    FlushTime() {
        this.viewNode.Timer.CloseCountDownTime();
        let end_time = ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.HouZai) - TimeCtrl.Inst().ServerTime;
        if (end_time > 0) {
            this.viewNode.Timer.SetOutline(true, COLORS.Brown, 3)
            this.viewNode.Timer.TotalTime(end_time, TimeFormatType.TYPE_TIME_4, Language.Common.ActTimeShow);
        }
    }

    FlushPanel() {
        let listData = HouZaiTanXianData.Inst().GetRewardList();
        this.viewNode.List.itemRenderer = this.rendererItem.bind(this);
        this.viewNode.List.numItems = listData.length;
        this.viewNode.List.scrollToView(this.GetToIndex(listData));
    }

    private rendererItem(index: number, item: HouZaiShopItem) {
        let listData = HouZaiTanXianData.Inst().GetRewardList()
        item.SetData(listData[index]);
    }


    GetToIndex(list: IHouZaiShopItemData[]): number {
        for (let i = 0; i < list.length; i++) {
            let state = HouZaiTanXianData.Inst().GetItemState(list[i].cfgs[0]);
            if (state != ActHouZaiItemState.Geted) {
                return i
            }
        }
        return list.length - 1;
    }

    CloseCallBack() {
    }

    OnCloseClick() {
        ViewManager.Inst().CloseView(HouZaiTanXianView);
    }
}



export class HouZaiShopItem extends BaseItem {

    protected viewNode = {
        BG: <fgui.GLoader>null,
        Count: <fgui.GTextField>null,
        Timer: <TimeMeter>null,
        List: <fgui.GList>null,
        ContextG: <fgui.GGroup>null,
        Tip: <fgui.GTextField>null,
        Way: <fgui.GObject>null,
        GetedFlag: <fgui.GTextField>null,
    };

    private listData: CfgHouZaiReward[] = [];

    public SetData(data: IHouZaiShopItemData): void {
        let sel_index = 2;
        if (data.index != 0) {
            sel_index = data.index % 2 == 0 ? 1 : 0;
        }
        this.getController("pos_ctrl").selectedIndex = sel_index;
        this.getController("showCount").selectedIndex = data.cfgs[0].level == 0 ? 0 : 1;
        let img = data.cfgs.length > 1 ? "CellBg1" : "CellBg2";
        UH.SpriteName(this.viewNode.BG, "ActHouZaiTanXian", img);

        if (data.cfgs[0].level != 0) {
            let curCount = HouZaiTanXianData.Inst().GetActData().passRound;
            UH.SetText(this.viewNode.Count, curCount + "/" + data.cfgs[0].level);
        }
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.listData = data.cfgs;
        this.viewNode.List.numItems = data.cfgs.length;

        let state = HouZaiTanXianData.Inst().GetItemState(data.cfgs[0]);
        this.grayed = state == ActHouZaiItemState.Geted;
        this.viewNode.GetedFlag.visible = state == ActHouZaiItemState.Geted;
        this.viewNode.Way.grayed = state == ActHouZaiItemState.Geted;
        this.viewNode.Tip.visible = data.cfgs.length >= 2;
    }

    private itemRenderer(index: number, item: HouZaiBuyItem) {
        item.SetData(this.listData[index]);
    }
}

export class HouZaiBuyItem extends BaseItem {
    protected viewNode = {
        ItemCell: <ItemCell>null,
        YBtn: <fgui.GButton>null,
        BBtn: <fgui.GButton>null,
    };

    private _key_check_buy: string;

    protected onConstruct() {
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
        this.viewNode.YBtn.onClick(this.OnYBtnClick, this);
        this.viewNode.BBtn.onClick(this.OnBBtnClick, this);
    }

    public SetData(data: CfgHouZaiReward): void {
        this._data = data;

        let state = HouZaiTanXianData.Inst().GetItemState(data);
        let is_gray = state == ActHouZaiItemState.Geted;
        if (state == ActHouZaiItemState.Can) {
            this.getController("item_type").selectedIndex = data.item_type;
        } else {
            this.getController("item_type").selectedIndex = 3;
        }

        let item = Item.Create({ item_id: data.item_id, num: data.item_num }, { is_num: true, is_click: true, is_gray: is_gray });
        this.viewNode.ItemCell.SetData(item);

        this._key_check_buy = Mod.HouZai.View + "_" + data.block_num;
        this.viewNode.BBtn.grayed = !OrderCtrl.Inst().CheckButtonState(this._key_check_buy)
        if (data.item_type != 1) {
            if (data.price > 0) {
                OrderCtrl.Inst().CheckMaiButton(this._key_check_buy, this.viewNode.YBtn, Language.Recharge.GoldType[0] + data.price / 10);
            } else {
                let btnText = Language.ActHouZai.BtnGetText;
                this.viewNode.YBtn.title = btnText;
            }
        }
    }

    //免费领取或者购买
    OnYBtnClick() {
        let state = HouZaiTanXianData.Inst().GetItemState(this._data);
        if (state == ActHouZaiItemState.Geted) {
            return;
        }
        if (state == ActHouZaiItemState.Not) {
            PublicPopupCtrl.Inst().Center(Language.ActHouZai.Tip1);
            return;
        }

        if (this._data.price == 0) {
            ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.HouZai, 1, this._data.seq);
        } else {
            this.OnBuy();
        }
    }

    OnBuy() {
        if (!OrderCtrl.Inst().CheckMaiButtonClick(this._key_check_buy)) {
            PublicPopupCtrl.Inst().Center(Language.Common.payWait)
            return
        }
        HouZaiTanXianData.Inst().OnBuyChange()

        let funcopenCfg = FunOpen.Inst().GetFunOpenModCfg(Mod.HouZai.View);
        let name = funcopenCfg ? funcopenCfg.name : Language.Recharge.Diamond;

        let order_data = Order_Data.initOrder(this._data.seq, ACTIVITY_TYPE.HouZai, this._data.price, this._data.price, name);
        OrderCtrl.generateOrder(order_data);
    }

    //广告按钮
    OnBBtnClick() {
        if (!OrderCtrl.Inst().CheckMaiButtonClick(this._key_check_buy)) {
            PublicPopupCtrl.Inst().Center(Language.Common.payWait)
            return
        }
        let state = HouZaiTanXianData.Inst().GetItemState(this._data);
        if (state == ActHouZaiItemState.Geted) {
            return;
        }
        if (state == ActHouZaiItemState.Not) {
            PublicPopupCtrl.Inst().Center(Language.ActHouZai.Tip1);
            return;
        }
        ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.act_hou_zai), "", 0, this._data.seq);
    }
}