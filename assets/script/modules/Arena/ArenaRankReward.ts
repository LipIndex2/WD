import { CfgArena, CfgArenaRank, CfgArenaRankReward } from "config/CfgArena";
import * as fgui from "fairygui-cc";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { EGLoader } from "modules/extends/EGLoader";
import { UH } from "../../helpers/UIHelper";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { DataHelper } from "../../helpers/DataHelper";
import { AudioTag } from "modules/audio/AudioManager";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { ArenaData } from "./ArenaData";
import { COLORS } from "modules/common/ColorEnum";
import { ItemCell } from "modules/extends/ItemCell";

@BaseView.registView
export class ArenaRankReward extends BaseView {

    protected viewRegcfg = {
        UIPackName: "ArenaOther",
        ViewName: "ArenaRankReward",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };


    protected viewNode = {
        Board: <CommonBoard2>null,
        List: <fgui.GList>null,
        timer: <TimeMeter>null,
    };

    protected extendsCfg = [
        { ResName: "RankRewardItem", ExtendsClass: ArenaRankRewardItem }
    ];

    private listData: CfgArenaRankReward[];

    InitData() {
        this.viewNode.Board.SetData(new BoardData(ArenaRankReward, Language.Arena.title3));
        this.viewNode.List.setVirtual();

        let timeCfg = ArenaData.Inst().GetCurTimeCfg();
        this.viewNode.timer.SetOutline(true, COLORS.Brown, 2)
        this.viewNode.timer.SetCallBack(() => {
            this.closeView();
        })
        this.viewNode.timer.StampTime(timeCfg.time_stamp, TimeFormatType.TYPE_TIME_7, Language.Arena.Time1);
    }


    OpenCallBack() {
        let cfg = CfgArena.rank_reward;
        this.listData = cfg;
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.List.numItems = cfg.length;
    }

    private itemRenderer(index: number, item: ArenaRankRewardItem) {
        item.SetData(this.listData[index]);
    }

    CloseCallBack() {
    }
}


export class ArenaRankRewardItem extends BaseItem {
    protected _data: CfgArenaRankReward;

    protected viewNode = {
        RankIcon: <fgui.GLoader>null,
        RankText: <fgui.GTextField>null,
        ItemList: <fgui.GList>null,
    };

    private listData: any[];

    public SetData(data: CfgArenaRankReward): void {
        super.SetData(data);

        this.viewNode.RankIcon.visible = data.rank_max <= 3;
        this.viewNode.RankText.visible = data.rank_max > 3;

        if (data.rank_max <= 3) {
            UH.SpriteName(this.viewNode.RankIcon, "ArenaOther", data.rank_max.toString())
        } else {
            let rankTxt = data.rank_max == data.rank_min ? data.rank_max.toString() : data.rank_max + "-" + data.rank_min;
            UH.SetText(this.viewNode.RankText, rankTxt)
            this.viewNode.RankText.fontSize = rankTxt.length >= 7 ? 26 : 32;
        }
        let itemList = DataHelper.FormatItemList(data.item_list);
        this.viewNode.ItemList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = itemList;
        this.viewNode.ItemList.numItems = itemList.length;
    }

    private itemRenderer(index: number, item: ItemCell) {
        item.SetData(this.listData[index]);
    }
}