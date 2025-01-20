
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask, viewRegcfg } from 'modules/common/BaseView';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { AvatarData } from "modules/extends/AvatarCell";
import { HeadItem } from "modules/extends/HeadItem";
import { RoleData } from "modules/role/RoleData";
import { DataHelper } from "../../helpers/DataHelper";
import { TimeHelper } from "../../helpers/TimeHelper";
import { UH } from "../../helpers/UIHelper";
import { TerritoryCtrl } from "./TerritoryCtrl";
import { TerritoryData } from "./TerritoryData";
import { stringify } from "querystring";

@BaseView.registView
export class TerritoryRecordView extends BaseView {
    showItem: any[] = [];

    protected viewRegcfg: viewRegcfg = {
        UIPackName: "TerritoryRecord",
        ViewName: "TerritoryRecordView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard2>null,

        ShowList: <fgui.GList>null,
        GpEmpty: <fgui.GGroup>null,
    };

    protected extendsCfg = [
        { ResName: "ItemShow", ExtendsClass: TerritoryRecordViewShowItem },
    ]
    listData: IPB_SCTerritoryReportNode[];

    InitData() {
        this.viewNode.Board.SetData(new BoardData(TerritoryRecordView));

        this.AddSmartDataCare(TerritoryData.Inst().FlushData, this.FlushReportInfo.bind(this), "FlushReportInfo");

        TerritoryCtrl.Inst().SendTerritoryReqReport()
    }

    InitUI() {
        // this.FlushReportInfo()
    }

    FlushReportInfo() {
        let show_list = TerritoryData.Inst().GetReportShowList()
        this.viewNode.GpEmpty.visible = 0 == show_list.length
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = show_list;
        this.viewNode.ShowList.numItems = show_list.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index])
    }
}

export class TerritoryRecordViewShowItem extends BaseItem {
    protected viewNode = {
        NameShow: <fgui.GTextField>null,
        DescShow: <fgui.GTextField>null,
        TimeShow: <fgui.GTextField>null,
        BtnGo: <fgui.GButton>null,
        HeadShow: <HeadItem>null,
    };

    protected onConstruct() {
        super.onConstruct();

        this.viewNode.BtnGo.onClick(this.OnClickGo, this);
    }

    SetData(data: IPB_SCTerritoryReportNode) {
        super.SetData(data)

        let desc = DataHelper.BytesToString(data.reportText);
        for (let reStr of [["领地", "仙域"], ["钻石", "元宝"], ["绿色植物", "普通碎片"], ["蓝色植物", "稀有碎片"], ["紫色植物", "史诗碎片"], ["拖车零件", "仙魄"]]) {
            if (desc.indexOf(reStr[0]) !== -1) {
                desc.replaceAll(reStr[0], reStr[1]);
            }
        }

        UH.SetText(this.viewNode.NameShow, DataHelper.BytesToString(data.reportSub))
        UH.SetText(this.viewNode.DescShow, desc)
        UH.SetText(this.viewNode.TimeShow, TimeHelper.Ago2(data.reportTime))
        this.viewNode.HeadShow.SetData(new AvatarData(data.roleInfo.headPicId, data.roleInfo.level, data.roleInfo.headChar, data.roleInfo.headFrame))
        this.viewNode.BtnGo.visible = RoleData.Inst().InfoRoleId != data.roleInfo.roleId
    }

    OnClickGo() {
        TerritoryCtrl.Inst().SendTerritoryReqInfo(this._data.roleInfo.roleId)
        ViewManager.Inst().CloseView(TerritoryRecordView)
    }
}