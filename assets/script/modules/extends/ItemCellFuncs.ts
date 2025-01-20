import { Item } from "modules/bag/ItemData";
// import { BagCtrl, BagReqType } from "modules/bag/BagCtrl";
// import { Equip, Item, ItemData } from "modules/bag/ItemData";
import { ICON_TYPE, ITEM_BIG_TYPE, ITEM_SHOW_TYPE, ItemColor } from "modules/common/CommonEnum";
import { KeyFunction } from "modules/common/CommonType";
// import { ItemInfoView } from "modules/item_info/ItemInfoView";
import { Color } from "cc";
import { ViewManager } from "manager/ViewManager";
import { CardDebrisView } from "modules/CardDebris/CardDebrisView";
import { DataHelper } from "../../helpers/DataHelper";
import { UH } from "../../helpers/UIHelper";
import { ItemCell } from "./ItemCell";
import { ItemInfoView } from "modules/ItemInfo/ItemInfoView";

export let CellFlushs: KeyFunction = {};

CellFlushs.ReadyItem = function (cell: ItemCell): void {
    let data = cell.GetData();
    if (data == null) {
        return;
    }
    CellFlushs.SetIconQua(cell, data);
    CellFlushs.SetIcon(cell, data);
    CellFlushs.SetNum(cell, data);
    CellFlushs.MakeGrey(cell, data);
    CellFlushs.SetPiece(cell, data);
    // CellFlushs.SetSShow(cell, data);
}

CellFlushs.SetIconQua = function (cell: ItemCell, data: any): void {
    UH.SpriteName(cell.view.QuaIcon, "CommonAtlas", `PinZhi${Item.GetColor(data.item_id)}`);
}

CellFlushs.SetIcon = function (cell: ItemCell, data: any): void {
    let icon_id = data.IconId() ?? 0;
    let scale = ITEM_SHOW_TYPE.HERO_PIECE == Item.GetShowType(data.item_id) ? 0.8 : 1
    UH.SetIcon(cell.view.Icon, icon_id, ITEM_SHOW_TYPE.HERO_PIECE == Item.GetShowType(data.item_id) ? ICON_TYPE.ROLE : ICON_TYPE.ITEM);
    cell.view.Icon.setScale(scale, scale)
}

CellFlushs.SetNum = function (cell: ItemCell, data: any): void {
    if (cell == null || cell == undefined) {
        return;
    }
    if (cell.Config("is_num") == false) {
        return;
    }
    if (data.IsNum()) {
        let num = data.num;
        // cell.view.RbImg.visible = num != 0
        cell.view.RbTxt.text = (num != 0) ? DataHelper.ConverMoney(num) : "";
    }
}

CellFlushs.MakeGrey = function (cell: ItemCell, data: any): void {
    //cell.view.grayed = data.is_gray;
    cell.view.QuaIcon.grayed = data.is_gray;
    cell.view.Icon.grayed = data.is_gray;
    cell.view.RbTxt.grayed = data.is_gray;
    cell.view.PieceShow.grayed = data.is_gray;
    cell.view.SShow.grayed = data.is_gray;
    cell.view.Icon.color = data.black_icon ? Color.BLACK : Color.WHITE;
    // cell.view.MaskShow.visible = data.mask_icon
}

CellFlushs.SetPiece = function (cell: ItemCell, data: any): void {
    cell.view.PieceShow.visible = ITEM_SHOW_TYPE.HERO_PIECE == Item.GetShowType(data.item_id)
}

CellFlushs.SetSShow = function (cell: ItemCell, data: any): void {
    cell.view.SShow.visible = ITEM_SHOW_TYPE.HERO_PIECE == Item.GetShowType(data.item_id) && ItemColor.Purple == Item.GetColor(data.item_id)
}


export let CellClicks: { [key: number]: Function } = {};

CellClicks[-1] = function (data: Item | number): void {
    let itemid;
    if (data instanceof (Item)) {
        itemid = data.ItemId()
    } else {
        itemid = data
    }
    ViewManager.Inst().OpenView(ItemInfoView, itemid);
}

CellClicks[ITEM_BIG_TYPE.DEBRIS] = function (data: Item | number): void {
    let itemid;
    if (data instanceof (Item)) {
        itemid = data.ItemId()
    } else {
        itemid = data
    }
    ViewManager.Inst().OpenView(CardDebrisView, itemid);
}