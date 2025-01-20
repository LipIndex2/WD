import { Item } from './../bag/ItemData';
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { UH } from "../../helpers/UIHelper";
import { ShopData } from "modules/shop/ShopData";
import { ShopCtrl } from "modules/shop/ShopCtrl";
import { RedPoint } from "modules/extends/RedPoint";
import { BagData } from "modules/bag/BagData";
import { ItemCell } from 'modules/extends/ItemCell';

@BaseView.registView
export class GeneCompoundView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "GeneCompound",
        ViewName: "GeneCompoundView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard2>null,
        Icon1: <fgui.GLoader>null,
        Icon2: <fgui.GLoader>null,
        Name1: <fgui.GTextField>null,
        Name2: <fgui.GTextField>null,
        BtnCompound1: <fgui.GButton>null,
        BtnCompound2: <fgui.GButton>null,
        redPoint1: <RedPoint>null,
        redPoint2: <RedPoint>null,
        ItemCell1: <ItemCell>null,
        ItemCell2: <ItemCell>null,
    };

    InitData() {
        this.viewNode.Board.SetData(new BoardData(GeneCompoundView));

        this.AddSmartDataCare(BagData.Inst().BagItemData, this.FulshCompound.bind(this), "OtherChange")
        let cfg = ShopData.Inst().GetShopGoldShowList(1)

        this.viewNode.BtnCompound1.title = "x" + cfg[1].exchange_item_num
        this.viewNode.BtnCompound2.title = "x" + cfg[0].exchange_item_num

        this.viewNode.BtnCompound1.onClick(this.OnClickBuy.bind(this, cfg[1].index));
        this.viewNode.BtnCompound2.onClick(this.OnClickBuy.bind(this, cfg[0].index));

        UH.SetText(this.viewNode.Name1, Item.GetName(cfg[1].item_id))
        UH.SetText(this.viewNode.Name2, Item.GetName(cfg[0].item_id))
        // UH.SetIcon(this.viewNode.Icon1, cfg[1].item_id, ICON_TYPE.ITEM);
        // UH.SetIcon(this.viewNode.Icon2, cfg[0].item_id, ICON_TYPE.ITEM);

        this.viewNode.ItemCell1.SetData(Item.Create({ item_id: cfg[1].item_id }));
        this.viewNode.ItemCell2.SetData(Item.Create({ item_id: cfg[0].item_id }));

        this.FulshCompound();
    }

    OnClickBuy(index: number) {
        if (Item.IsGeneBagMax()) return
        ShopCtrl.Inst().SendShopReqBuy(index, 1)
    }

    FulshCompound() {
        let cfg = ShopData.Inst().GetShopGoldShowList(1)
        let num1 = BagData.Inst().GetItemNum(cfg[1].exchange_item_id);
        let num2 = BagData.Inst().GetItemNum(cfg[0].exchange_item_id);

        let red1 = cfg[1].exchange_item_num > num1 ? 0 : 1
        let red2 = cfg[0].exchange_item_num > num2 ? 0 : 1
        this.viewNode.redPoint1.SetNum(red1);
        this.viewNode.redPoint2.SetNum(red2);
    }
    InitUI() {
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }
}