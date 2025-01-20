import { TextHelper } from './../../helpers/TextHelper';
import { Language } from 'modules/common/Language';
import * as fgui from "fairygui-cc";
import { BaseItem } from "modules/common/BaseItem";
import { BasePanel } from "modules/common/BasePanel";
import { ItemCell } from "modules/extends/ItemCell";
import { CultivateData } from "./CultivateData";
import { UH } from "../../helpers/UIHelper";
import { Item } from 'modules/bag/ItemData';
import { CultivateCtrl } from './CultivateCtrl';
import { BagData } from 'modules/bag/BagData';

export class CultivateViewExchangePanel extends BasePanel {
    protected viewNode = {
        ShowList: <fgui.GList>null,
        ItemNum: <fgui.GTextField>null,
        Desc: <fgui.GTextField>null,
    };

    protected extendsCfg = [
        { ResName: "ExchangeCell", ExtendsClass: ExchangeCell }
    ];


    InitPanelData() {
        this.AddSmartDataCare(CultivateData.Inst().FlushData, this.FlushView.bind(this), "FlushInfo");


        this.FlushView();
    }

    FlushView() {
        const list = CultivateData.Inst().GetShopList();
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.ShowList.numItems = list.length;

        const other = CultivateData.Inst().GetOther();
        UH.SetText(this.viewNode.ItemNum, BagData.Inst().GetItemNum(other.shop_item_id));
        UH.SetText(this.viewNode.Desc, other.reward_des);
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(CultivateData.Inst().GetShopList()[index]);
    }
}

class ExchangeCell extends BaseItem {
    protected viewNode = {
        BuyNum: <fgui.GTextField>null,
        ItemNum: <fgui.GTextField>null,
        ItemList: <fgui.GList>null,
        BtnBuy: <fgui.GButton>null,
        ItemCell: <ItemCell>null,
    };
    onConstruct() {
        super.onConstruct();
        this.viewNode.BtnBuy.onClick(this.OnClickBuy, this);
    }
    public SetData(data: any) {
        super.SetData(data);
        const count = CultivateData.Inst().shopBuyCount[data.seq]
        const buynum = data.buy_num - count;
        UH.SetText(this.viewNode.ItemNum, data.money_item[0].num);
        UH.SetText(this.viewNode.BuyNum, TextHelper.Format(Language.Cultivate.TimesShow, buynum));

        this.viewNode.BtnBuy.grayed = buynum == 0
        this.viewNode.ItemCell.SetData(Item.Create(data.reward_item[0], { is_num: true }))
    }

    OnClickBuy() {
        CultivateCtrl.Inst().SendShopItem(this._data.seq, 1)
    }
}