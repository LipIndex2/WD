import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { EGLoader } from "modules/extends/EGLoader";
import { ItemCell } from "modules/extends/ItemCell";
import { UH } from "../../helpers/UIHelper";
import { BagData } from "modules/bag/BagData";
import { CfgItem } from "config/CfgCommon";
import { CommonId, ICON_TYPE } from "modules/common/CommonEnum";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { ArenaData } from "./ArenaData";
import { CfgArena } from "config/CfgArena";

export class ArenaItemBuyViewParam{
    item: CfgItem;
    price: number;
    money_item_id: number;
    buyFunc:(num:number)=>any;
    maxNum:number = 99;

    constructor(item_id:number, num:number, price:number, money_item_id:number, buyFunc:(num:number)=>any){
        this.item = new CfgItem(item_id, num);
        this.price = price;
        this.money_item_id = money_item_id;
        this.buyFunc = buyFunc;
    }
}

@BaseView.registView
export class ArenaItemBuyView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "FarmShopBuy",
        ViewName: "ArenaItemBuyView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,
        ItemCell: <ItemCell>null,
        BtnSubtract: <fgui.GButton>null,
        BtnAdd: <fgui.GButton>null,
        BtnMax: <fgui.GButton>null,
        BtnMin: <fgui.GButton>null,
        BtnClose: <fgui.GButton>null,
        BtnConfirm: <fgui.GButton>null,
        Name: <fgui.GTextField>null,
        BuyNum: <fgui.GTextField>null,
        ItemNum: <fgui.GTextField>null,
        TotalPrice: <fgui.GTextField>null,
        Price: <fgui.GTextField>null,
        Icon1: <EGLoader>null,
        Icon2: <EGLoader>null,
        RemainNum: <fgui.GTextField>null,
    };

    private _maxNum:number;
    private get maxNum():number{
        if(this._maxNum == null){
            this._maxNum = this.data.maxNum;
        }
        return this._maxNum;
    }

    private num: number = 1;
    private data: ArenaItemBuyViewParam;
    InitData(param: ArenaItemBuyViewParam) {
        this.data = param;
        this.viewNode.Board.SetData(new BoardData(this));

        this.viewNode.BtnClose.onClick(this.closeView, this);
        this.viewNode.BtnAdd.onClick(this.OnClickAdd, this);
        this.viewNode.BtnSubtract.onClick(this.OnClickSubtract, this);
        this.viewNode.BtnMax.onClick(this.OnClickMax, this);
        this.viewNode.BtnMin.onClick(this.OnClickMin, this);
        this.viewNode.BtnConfirm.onClick(this.OnClickConfirm, this);

        let icon_id = Item.GetIconId(param.money_item_id);
        UH.SetIcon(this.viewNode.Icon1, icon_id, ICON_TYPE.ITEM);
        UH.SetIcon(this.viewNode.Icon2, icon_id, ICON_TYPE.ITEM);

        this.FlushView();
    }

    InitUI() {

        let item = Item.Create(this.data.item, { is_num: true });
        this.viewNode.ItemCell.SetData(item);

        UH.SetText(this.viewNode.Price, this.data.price);
        UH.SetText(this.viewNode.Name, Item.GetName(this.data.item.item_id));
        UH.SetText(this.viewNode.ItemNum, Language.Farm.bagNum + BagData.Inst().GetItemNum(this.data.item.item_id));
        UH.SetText(this.viewNode.RemainNum, Language.Farm.RemainNum + this.data.maxNum);
    }

    FlushView() {
        UH.SetText(this.viewNode.BuyNum, this.num)
        UH.SetText(this.viewNode.TotalPrice, this.num * this.data.price);
    }

    OnClickConfirm() {
        let hasNum = Item.GetNum(this.data.money_item_id);
        let needNum = this.num * this.data.price
        if(hasNum >= needNum){
            this._maxNum = null;
            this.data.buyFunc(this.num);
            this.closeView();
        }else{
            PublicPopupCtrl.Inst().ItemNotEnoughNotice(this.data.money_item_id);
        }
    }

    OnClickAdd() {
        let maxNum = this.maxNum;
        if (this.num >= maxNum) {
            this.num = maxNum
        } else {
            this.num++;
        }
        this.FlushView();
    }

    OnClickSubtract() {
        if (this.num <= 1) {
            this.num = 1
        } else {
            this.num--;
        }
        this.FlushView();
    }

    OnClickMax() {
        let maxNum = this.maxNum;
        this.num = maxNum;
        this.FlushView();
    }

    OnClickMin() {
        this.num = 1;
        this.FlushView();
    }


    OpenCallBack() {
    }

    CloseCallBack() {
    }
}