import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from "modules/common/Language";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { UH } from "../../helpers/UIHelper";
import { TaskData } from "./TaskData";

@BaseView.registView
export class TaskTreasureBoxView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "ShopTreasureBox",
        ViewName: "ShopTreasureBoxView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard2>null,
        Icon: <fgui.GLoader>null,
        List: <fgui.GList>null,
        BtnBuy: <fgui.GButton>null,
        TipsShow: <fgui.GTextField>null,
    };

    private index: number;
    listData: Item[];

    InitData(index: number) {
        this.index = index;

        this.viewNode.Board.SetData(new BoardData(TaskTreasureBoxView));
        this.viewNode.Board.SetTitle(Language.Task.TreasureBox.NameShow)
    }

    InitUI() {
        let list = []
        for (let element of (0 == this.index ? TaskData.Inst().CfgDailyMissionOtherAd() : TaskData.Inst().CfgDailyMissionOtherMissionFin())) {
            list.push(Item.Create(element, { is_num: true }))
        }
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this)
        this.listData = list;
        this.viewNode.List.numItems = list.length;

        this.viewNode.BtnBuy.visible = false
        UH.SpriteName(this.viewNode.Icon, "ShopTreasureBox", `LiBao${this.index}`);
        UH.SetText(this.viewNode.TipsShow, Language.Task.TreasureBox.TipsShow[this.index])

    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }
}
