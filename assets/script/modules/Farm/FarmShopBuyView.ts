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

@BaseView.registView
export class FarmShopBuyView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "FarmShopBuy",
        ViewName: "FarmShopBuyView",
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
    };

    private num: number = 1;
    private data: any;
    InitData(param: any) {
        this.data = param;
        this.viewNode.Board.SetData(new BoardData(this));

        this.viewNode.BtnClose.onClick(this.closeView, this);
        this.viewNode.BtnAdd.onClick(this.OnClickAdd, this);
        this.viewNode.BtnSubtract.onClick(this.OnClickSubtract, this);
        this.viewNode.BtnMax.onClick(this.OnClickMax, this);
        this.viewNode.BtnMin.onClick(this.OnClickMin, this);
        this.viewNode.BtnConfirm.onClick(this.OnClickConfirm, this);

        this.FlushView();
    }

    InitUI() {

        let item = Item.Create({ item_id: this.data.reward_item, num: this.data.reward_param }, { is_num: true });
        this.viewNode.ItemCell.SetData(item);

        UH.SetText(this.viewNode.Price, this.data.price1);
        UH.SetText(this.viewNode.Name, Item.GetName(this.data.reward_item));
        UH.SetText(this.viewNode.ItemNum, Language.Farm.bagNum + BagData.Inst().GetItemNum(this.data.reward_item));
    }

    FlushView() {
        UH.SetText(this.viewNode.BuyNum, this.num)
        UH.SetText(this.viewNode.TotalPrice, this.num * this.data.price1);
    }

    OnClickConfirm() {

    }

    OnClickAdd() {
        let maxNum = 999;
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
        let maxNum = 999;
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