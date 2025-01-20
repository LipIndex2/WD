import { CfgArena, CfgArenaRank } from "config/CfgArena";
import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { EGLoader } from "modules/extends/EGLoader";
import { DataHelper } from "../../helpers/DataHelper";
import { UH } from "../../helpers/UIHelper";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { BaseItem } from "modules/common/BaseItem";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { AudioTag } from "modules/audio/AudioManager";
import { BoardData } from "modules/common_board/BoardData";
import { ArenaData } from "./ArenaData";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { COLORS } from "modules/common/ColorEnum";
import { ArenaCtrl, ArenaReq } from "./ArenaCtrl";
import { RedPoint } from "modules/extends/RedPoint";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { ItemCell } from "modules/extends/ItemCell";

@BaseView.registView
export class ArenaRankReward2 extends BaseView {

    protected viewRegcfg = {
        UIPackName: "ArenaOther",
        ViewName: "ArenaRankReward2",
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
        { ResName: "RankRewardItem2", ExtendsClass: ArenaRankRewardItem2 }
    ];

    private _listData: CfgArenaRank[];
    private get listData(): CfgArenaRank[] {
        if (this._listData == null) {
            this._listData = [];
            CfgArena.rank.forEach(v => {
                this.listData.push(v);
            })
            this._listData.sort((a: CfgArenaRank, b: CfgArenaRank) => {
                let a_state = ArenaData.Inst().GetRankRewardState(a);
                let b_state = ArenaData.Inst().GetRankRewardState(b);
                if (a_state == b_state) {
                    return a.seq - b.seq;
                } else {
                    return b_state - a_state;
                }
            })
        }
        return this._listData;
    }

    InitData() {
        this.AddSmartDataCare(ArenaData.Inst().smdData, this.FlushList.bind(this), "mainInfo");
        this.viewNode.Board.SetData(new BoardData(ArenaRankReward2, Language.Arena.title4));
        this.viewNode.List.setVirtual();

        let timeCfg = ArenaData.Inst().GetCurTimeCfg();
        this.viewNode.timer.SetOutline(true, COLORS.Brown, 2)
        this.viewNode.timer.SetCallBack(() => {
            this.closeView();
        })
        this.viewNode.timer.StampTime(timeCfg.time_stamp, TimeFormatType.TYPE_TIME_7, Language.Arena.Time1);
    }


    OpenCallBack() {
        this.FlushList();
    }

    CloseCallBack() {
    }

    FlushList() {
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.List.numItems = this.listData.length;
    }

    private itemRenderer(index: number, item: ArenaRankRewardItem2) {
        item.SetData(this.listData[index]);
    }
}


export class ArenaRankRewardItem2 extends BaseItem {
    protected _data: CfgArenaRank;

    protected viewNode = {
        Icon: <EGLoader>null,
        ItemList: <fgui.GList>null,
        GetBtn: <fgui.GButton>null,
        redPoint: <RedPoint>null,
        Mask: <fgui.GObject>null,
    };

    private listData: any[];

    protected onConstruct(): void {
        super.onConstruct();
        this.viewNode.GetBtn.onClick(this.OnGetClick, this);
    }

    public SetData(data: CfgArenaRank): void {
        super.SetData(data);
        UH.SetIcon(this.viewNode.Icon, data.rank_icon, ICON_TYPE.ARENA_RANK_SAMLL, null, true);
        let itemList = DataHelper.FormatItemList(data.rank_reward);
        this.viewNode.ItemList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = itemList;
        this.viewNode.ItemList.numItems = itemList.length;
        let state = ArenaData.Inst().GetRankRewardState(data);
        this.viewNode.redPoint.SetNum(state);
        this.viewNode.GetBtn.grayed = state < 1;
        this.viewNode.Mask.visible = state == -1;
    }

    private itemRenderer(index: number, item: ItemCell) {
        item.SetData(this.listData[index]);
    }

    public OnGetClick() {
        let state = ArenaData.Inst().GetRankRewardState(this._data);
        if (state < 1) {

            if (state == 0) {
                PublicPopupCtrl.Inst().Center(Language.Arena.tips13);
            }

            return;
        }
        ArenaCtrl.Inst().SendReq(ArenaReq.GetReward, [this._data.rank, this._data.rank_order]);
    }
}