import { BaseItem } from 'modules/common/BaseItem';
import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { CommonId } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { ExpShow, CurrencyShow } from "modules/extends/Currency";
import { EGLoader } from "modules/extends/EGLoader";
import { FarmData } from './FarmData';
import { ItemCell } from 'modules/extends/ItemCell';
import { FarmShopBuyView } from './FarmShopBuyView';
import { ViewManager } from 'manager/ViewManager';
import { Item } from 'modules/bag/ItemData';
import { UH } from '../../helpers/UIHelper';

@BaseView.registView
export class FarmShopView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "FarmShop",
        ViewName: "FarmShopView",
        LayerType: ViewLayer.Normal,
    };

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,
        liuhaiscreen: <fgui.GComponent>null,

        bg: <EGLoader>null,
        BtnClose: <fgui.GButton>null,
        TabList: <fgui.GList>null,
        ShowList: <fgui.GList>null,

        ExpShow: <ExpShow>null,
        Currency1: <CurrencyShow>null,
        Currency2: <CurrencyShow>null,
        Currency3: <CurrencyShow>null,
    };

    protected extendsCfg = [
        { ResName: "ListCell", ExtendsClass: ListCell }
    ];

    private page: number = 0;
    listData: any[];

    InitData() {
        this.AddSmartDataCare(FarmData.Inst().FlushData, this.FlushView.bind(this), "FlushInfo");

        this.viewNode.BtnClose.onClick(this.closeView, this);

        this.viewNode.Currency1.SetCurrency(CommonId.Gold);
        this.viewNode.Currency2.SetCurrency(CommonId.Energy);
        this.viewNode.Currency3.SetCurrency(CommonId.Diamond);
        this.viewNode.Currency2.BtnAddShow(true);

        this.viewNode.ShowList.setVirtual();
        this.viewNode.TabList.on(fgui.Event.CLICK_ITEM, this.onClickListItem, this);
        this.viewNode.TabList.selectedIndex = this.page;

        this.FlushView();
    }

    FlushView() {
        const list = FarmData.Inst().GetShopListCfg(this.page)
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = list;
        this.viewNode.ShowList.numItems = list.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    private onClickListItem() {
        this.page = this.viewNode.TabList.selectedIndex;
        this.FlushView();
    }

    WindowSizeChange() {
        this.refreshBgSize(this.viewNode.bg)
    }

    DoOpenWaitHandle() {
        let waitHandle = this.createWaitHandle("loadBG")
        this.AddWaitHandle(waitHandle);
        this.viewNode.bg.SetIcon("loader/shop/DaDiShangCheng", () => {
            waitHandle.complete = true;
            this.refreshBgSize(this.viewNode.bg)
        })
    }
}

class ListCell extends BaseItem {
    protected viewNode = {
        Desc: <fgui.GTextField>null,
        Name: <fgui.GTextField>null,
        ItemCell: <ItemCell>null,
        BtnBuy: <fgui.GButton>null,
    };
    protected onConstruct() {
        super.onConstruct();
        this.viewNode.BtnBuy.onClick(this.onClickBuy, this)
    }
    public SetData(data: any) {
        super.SetData(data);
        let item = Item.Create({ item_id: data.reward_item, num: data.reward_param }, { is_num: true });
        this.viewNode.ItemCell.SetData(item);

        UH.SetText(this.viewNode.Name, Item.GetName(data.reward_item));
        UH.SetText(this.viewNode.Desc, Item.GetDesc(data.reward_item));
        this.viewNode.BtnBuy.title = data.price1
    }
    onClickBuy() {
        ViewManager.Inst().OpenView(FarmShopBuyView, this._data)
    }
}