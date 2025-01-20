import { CfgArena, CfgArenaShop } from "config/CfgArena";
import * as fgui from "fairygui-cc";
import { Item } from "modules/bag/ItemData";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { CommonId, ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { CurrencyShow } from "modules/extends/Currency";
import { ItemCell } from "modules/extends/ItemCell";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { UH } from "../../helpers/UIHelper";
import { ArenaData } from "./ArenaData";
import { ArenaCtrl, ArenaReq } from "./ArenaCtrl";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { Color } from "cc";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { EGLoader } from "modules/extends/EGLoader";

@BaseView.registView
export class ArenaShopView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "ArenaOther",
        ViewName: "ArenaShopView",
        LayerType: ViewLayer.Normal,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
        ViewMask: ViewMask.BgBlock,
    };


    protected viewNode = {
        BGEffect: <UIEffectShow>null,
        CloseBtn: <fgui.GButton>null,
        UISpineShow: <UISpineShow>null,
        timer: <TimeMeter>null,
        Curr1: <CurrencyShow>null,
        Curr2: <CurrencyShow>null,
        Curr3: <CurrencyShow>null,
        List: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "ShopItem", ExtendsClass: ArenaShopItem },
        { ResName: "BuyBtn", ExtendsClass: ArenaShopBuyBtn }
    ];
    listData: CfgArenaShop[];

    InitData() {
        ArenaCtrl.Inst().SendReq(ArenaReq.ShopInfo);
        this.AddSmartDataCare(ArenaData.Inst().smdData, this.FlushPanel.bind(this), "shopInfo");

        this.viewNode.CloseBtn.onClick(this.closeView, this);
        this.viewNode.BGEffect.PlayEff(1208110);
        this.viewNode.UISpineShow.LoadSpine("spine/PVP/PVP_shop", true);

        this.viewNode.Curr1.SetCurrency(CommonId.ArenaPassItemId, true, null, 1);
        this.viewNode.Curr2.SetCurrency(CommonId.Gold);
        this.viewNode.Curr3.SetCurrency(CommonId.Diamond);

        let lineColor = new Color(1, 127, 7);
        this.viewNode.timer.SetOutline(true, lineColor, 3)
        this.viewNode.timer.SetCallBack(() => {
            this.ShowTimer();
            this.FlushPanel();
        });
    }


    OpenCallBack() {
        this.ShowTimer();
        this.FlushPanel();
    }

    CloseCallBack() {
    }

    ShowTimer() {
        let timeCfg = ArenaData.Inst().GetCurTimeCfg();
        this.viewNode.timer.StampTime(timeCfg.time_stamp, TimeFormatType.TYPE_TIME_7);
    }

    FlushPanel() {
        let listData = CfgArena.shop;
        this.listData = CfgArena.shop;
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.List.numItems = listData.length;
    }

    private itemRenderer(index: number, item: ArenaShopItem) {
        item.SetData(this.listData[index]);
    }
}

export class ArenaShopItem extends BaseItem {
    protected _data: CfgArenaShop;

    protected viewNode = {
        ItemName: <fgui.GTextField>null,
        RemainCount: <fgui.GTextField>null,
        ItemCell: <ItemCell>null,
        BuyBtn: <ArenaShopBuyBtn>null,
    };

    protected onConstruct(): void {
        super.onConstruct();
        this.viewNode.BuyBtn.onClick(this.OnBuyClick, this);
    }

    public SetData(data: CfgArenaShop): void {
        super.SetData(data);
        let itemCfg = data.reward_item[0];
        let item = Item.Create(itemCfg, { is_num: true, is_click: true });
        this.viewNode.ItemCell.SetData(item);
        UH.SetText(this.viewNode.ItemName, item.Name());
        let remainCount = ArenaData.Inst().GetShopItemBuyTimes(data);
        UH.SetText(this.viewNode.RemainCount, Language.Arena.text5 + remainCount);
        this.viewNode.BuyBtn.grayed = remainCount < 1;

        let currItemCfg = data.money_item[0];
        this.viewNode.BuyBtn.title = currItemCfg.num.toString();
        this.viewNode.BuyBtn.SetData(data);
    }

    OnBuyClick() {
        let data = this.GetData();
        if (Item.IsGeneBagMax(data.reward_item)) return
        let state = ArenaData.Inst().GetShopItemState(this._data);
        if (state == 1) {
            ArenaCtrl.Inst().SendReq(ArenaReq.ShopBuy, [this._data.seq, 1]);
        } else if (state == 0) {
            let currItemCfg = this._data.money_item[0];
            PublicPopupCtrl.Inst().ItemNotEnoughNotice(currItemCfg.item_id);
        }
        AudioManager.Inst().PlayUIAudio(AudioTag.TongYongClick);
    }
}

export class ArenaShopBuyBtn extends BaseItemGB {

    protected viewNode = {
        icon: <EGLoader>null,
    };

    public SetData(data: CfgArenaShop): void {
        let cfg = data.money_item[0];
        let icon_id = Item.GetIconId(cfg.item_id);
        UH.SetIcon(this.viewNode.icon, icon_id, ICON_TYPE.ITEM);
    }
}