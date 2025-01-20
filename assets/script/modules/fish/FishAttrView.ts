
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { UH } from "../../helpers/UIHelper";
import { FishData } from "./FishData";

@BaseView.registView
export class FishAttrView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "FishAttr",
        ViewName: "FishAttrView",
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
        { ResName: "ShowItem", ExtendsClass: FishAttrViewShowItem },
    ]

    InitData() {
        this.viewNode.Board.SetData(new BoardData(FishAttrView));
        this.viewNode.Board.DecoShow(true);

        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushInfo.bind(this), "FlushInfo");

    }

    InitUI() {
        this.FlushInfo()
    }

    FlushInfo() {
        let show_list = FishData.Inst().GetAttrShowList()
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.ShowList.numItems = show_list.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(FishData.Inst().GetAttrShowList()[index]);
    }
}

export class FishAttrViewShowItem extends BaseItem {
    protected viewNode = {
        title: <fgui.GRichTextField>null,
    };

    SetData(data: any) {
        super.SetData(data)

        UH.SetText(this.viewNode.title, data)
    }
}

