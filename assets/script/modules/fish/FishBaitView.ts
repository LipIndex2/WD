
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { BagData } from "modules/bag/BagData";
import { Item } from "modules/bag/ItemData";
import { BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { Language } from "modules/common/Language";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { ItemCell } from "modules/extends/ItemCell";
import { UH } from "../../helpers/UIHelper";
import { FishBaitInfoView } from "./FishBaitInfoView";
import { FishData } from "./FishData";

@BaseView.registView
export class FishBaitView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "FishBait",
        ViewName: "FishBaitView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,

        ShowList: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "ShowButton", ExtendsClass: FishBaitViewShowButton },
    ]

    InitData() {
        this.viewNode.Board.SetData(new BoardData(FishBaitView));
        this.viewNode.Board.DecoShow(true);

        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushInfo.bind(this), "FlushCommonInfo");
        this.AddSmartDataCare(BagData.Inst().BagItemData, this.FlushInfo.bind(this), "OtherChange")
    }

    InitUI() {
        this.FlushInfo()
    }

    FlushInfo() {
        let show_list = FishData.Inst().GetBaitShowList()
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.ShowList.numItems = show_list.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(FishData.Inst().GetBaitShowList()[index]);
    }
}

export class FishBaitViewShowButton extends BaseItemGB {
    protected viewNode = {
        CellShow: <ItemCell>null,
        RbTxt: <fgui.GTextField>null,
        SelShow: <fgui.GImage>null,
    };

    protected onConstruct() {
        super.onConstruct()

        this.onClick(this.OnClickBait, this);
    }

    SetData(data: any) {
        super.SetData(data)
        this.viewNode.CellShow.SetData(Item.Create({ itemId: data.item_id }, { is_num: false, is_click: false }))
        this.viewNode.SelShow.visible = FishData.Inst().InfoBaitId == data.bait_id
        UH.SetText(this.viewNode.RbTxt, 0 == data.bait_id ? Language.Fish.Tool.Infinite : BagData.Inst().GetItemNum(data.item_id))
    }

    OnClickBait() {
        // if (FishData.Inst().InfoBaitId != this._data.bait_id && (0 == this._data.bait_id || BagData.Inst().GetItemNum(this._data.item_id) > 0)) {
        //     FishCtrl.Inst().SendRoleFishReqSetBait(this._data.bait_id)
        // } else {
        //     CellClicks[-1](this._data.item_id);
        // }
        ViewManager.Inst().OpenView(FishBaitInfoView, this._data.bait_id)
    }
}
