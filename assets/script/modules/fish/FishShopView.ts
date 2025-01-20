
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { ICON_TYPE, ITEM_BIG_TYPE } from "modules/common/CommonEnum";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { CurrencyShow } from "modules/extends/Currency";
import { ItemCell } from "modules/extends/ItemCell";
import { UH } from "../../helpers/UIHelper";
import { FishData } from "./FishData";
import { FishShopInfoView } from "./FishShopInfoView";

@BaseView.registView
export class FishShopView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "FishShop",
        ViewName: "FishShopView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,

        CurrencyShow: <CurrencyShow>null,
        ShowList: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "ShowItem", ExtendsClass: FishShopViewShowItem },
        { ResName: "ButtonBuy", ExtendsClass: FishShopViewBuyButton },
    ]

    InitData() {
        this.viewNode.Board.SetData(new BoardData(FishShopView));
        this.viewNode.Board.DecoShow(true);

        this.viewNode.CurrencyShow.SetCurrency(FishData.Inst().CfgOtherFishCoin);
        // this.viewNode.CurrencyShow.BtnAddShow(true, undefined, () => {
        //     ViewManager.Inst().CloseView(FishShopView)
        //     ViewManager.Inst().CloseView(FishView)
        //     ViewManager.Inst().CloseView(TerritoryView)
        // });

        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushInfo.bind(this), "FlushInfo", "FlushShopInfo");
    }

    InitUI() {
        this.FlushInfo()
    }

    FlushInfo() {
        let show_list = FishData.Inst().GetShopShowList()
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.ShowList.numItems = show_list.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(FishData.Inst().GetShopShowList()[index]);
    }
}


export class FishShopViewShowItem extends BaseItem {
    protected viewNode = {
        NameShow: <fgui.GTextField>null,
        BtnBuy: <FishShopViewBuyButton>null,
        CellShow: <ItemCell>null,
    };

    protected onConstruct() {
        super.onConstruct();

        this.viewNode.BtnBuy.onClick(this.OnClickBuy, this);
    }

    SetData(data: any) {
        super.SetData(data)
        UH.SetText(this.viewNode.NameShow, Item.GetName(data.item_id))
        this.viewNode.CellShow.SetData(Item.Create({ itemId: data.item_id, num: data.num1 }, { is_num: true }))
        this.viewNode.BtnBuy.SetData(data)
    }

    OnClickBuy() {
        let data = this.GetData();
        if (Item.IsGeneBagMax([data])) return
        // FishCtrl.Inst().SendRoleFishReqBuy(this._data.seq)
        ViewManager.Inst().OpenView(FishShopInfoView, this._data.seq)
    }
}


export class FishShopViewBuyButton extends BaseItemGB {
    protected viewNode = {
        title: <fgui.GTextField>null,
        icon: <fgui.GLoader>null,
    };

    SetData(data: any) {
        UH.SetText(this.viewNode.title, data.num2)
        UH.SetIcon(this.viewNode.icon, data.coin_id, ICON_TYPE.ITEM)
    }
}
