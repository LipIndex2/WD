import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { AvatarData } from "modules/extends/AvatarCell";
import { HeadItem } from "modules/extends/HeadItem";
import { RoleData } from "modules/role/RoleData";
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { UH } from "../../helpers/UIHelper";
import { DataHelper } from "../../helpers/DataHelper";
import { BaseItem } from "modules/common/BaseItem";
import { ArenaData } from "./ArenaData";
import { ArenaCtrl, ArenaReq } from "./ArenaCtrl";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { AudioTag } from "modules/audio/AudioManager";

@BaseView.registView
export class ArenaReportView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "ArenaOther",
        ViewName: "ArenaReportView",
        LayerType: ViewLayer.Normal,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
        ViewMask: ViewMask.BgBlock,
    };


    protected viewNode = {
        BGEffect: <UIEffectShow>null,
        CloseBtn: <fgui.GButton>null,
        List: <fgui.GList>null,
        HeadItem: <HeadItem>null,
        Name: <fgui.GTextField>null,
    };

    protected extendsCfg = [
        { ResName: "ReportItem", ExtendsClass: ArenaReportItem }
    ];
    listData: IPB_SCArenaReportNode[];

    InitData() {
        this.viewNode.BGEffect.PlayEff(1208110);
        this.viewNode.CloseBtn.onClick(this.closeView, this);

        ArenaCtrl.Inst().SendReq(ArenaReq.ReportInfo)
        this.AddSmartDataCare(ArenaData.Inst().smdData, this.FlushPanel.bind(this), "reportInfo");
    }

    OpenCallBack() {
        let roleInfo = RoleData.Inst().ResultData.RoleInfo.roleinfo;
        let awatar = new AvatarData(roleInfo.headPicId, roleInfo.level, roleInfo.headChar, roleInfo.headFrame);
        this.viewNode.HeadItem.SetData(awatar);
        let roleName = DataHelper.BytesToString(roleInfo.name);
        UH.SetText(this.viewNode.Name, roleName);
    }

    FlushPanel() {
        let info = ArenaData.Inst().reportInfo;
        if (info && info.reportInfo) {
            this.listData = info.reportInfo;
            this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
            this.viewNode.List.numItems = info.reportInfo.length;
        }
    }

    private itemRenderer(index: number, item: ArenaReportItem) {
        item.SetData(this.listData[index]);
    }

    CloseCallBack() {
    }
}

export class ArenaReportItem extends BaseItem {

    protected viewNode = {
        TimeDesc: <fgui.GTextField>null,
        State: <fgui.GTextField>null,
        Name: <fgui.GTextField>null,
        RankText: <fgui.GTextField>null,
        HeadItem: <HeadItem>null,
        StateIcon: <fgui.GLoader>null,
        Result: <fgui.GLoader>null,
        RankIcon: <fgui.GLoader>null,
    };

    protected _data: IPB_SCArenaReportNode;

    public SetData(data: IPB_SCArenaReportNode): void {
        let roleInfo = data.roleInfo;
        let awatar = new AvatarData(roleInfo.headPicId, roleInfo.level, roleInfo.headChar, roleInfo.headFrame);
        this.viewNode.HeadItem.SetData(awatar);
        let roleName = DataHelper.BytesToString(roleInfo.name);
        UH.SetText(this.viewNode.Name, roleName);

        let curTime = TimeCtrl.Inst().ServerTime;
        let timeValue = curTime - <number>data.time;
        let h = Math.floor(timeValue / 3600);
        let m = Math.floor(timeValue / 60);
        let day = Math.floor(timeValue / 86400);
        let timeStr: string;
        if (day >= 1) {
            timeStr = day + Language.Arena.text1;
        } else if (h >= 1) {
            timeStr = h + Language.Arena.text2;
        } else if (m >= 1) {
            timeStr = m + Language.Arena.text6;
        } else {
            timeStr = Language.Arena.text7;
        }
        UH.SetText(this.viewNode.TimeDesc, timeStr);

        let stateStr = data.isAttack == true ? Language.Arena.text3 : Language.Arena.text4;
        UH.SetText(this.viewNode.State, stateStr);
        let stateIcon = data.isAttack == true ? "GongJi" : "FangShou";
        UH.SpriteName(this.viewNode.StateIcon, "ArenaOther", stateIcon);
        UH.SpriteName(this.viewNode.Result, "ArenaOther", data.isWin == true ? "Ying" : "Shu");

        let rankCfg = ArenaData.Inst().GetRankCfg(data.rank, data.rankOrder);
        UH.SetText(this.viewNode.RankText, rankCfg.rank_describe);
        UH.SetIcon(this.viewNode.RankIcon, rankCfg.rank_icon, ICON_TYPE.ARENA_RANK_SAMLL, null, true);
    }
}