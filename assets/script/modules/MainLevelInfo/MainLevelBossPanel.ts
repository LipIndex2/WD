import * as fgui from "fairygui-cc";
import { BasePanel } from "modules/common/BasePanel";
import { MainLevelInfoData } from "./MainLevelInfoData";
import { MainLevelInfoView } from "./MainLevelInfoView";
import { MainFBData } from "modules/main_fb/MainFBData";

export class MainLevelBossPanel extends BasePanel {
    protected viewNode = {
        list: <fgui.GList>null,
    };

    InitPanelData() {
        MainLevelInfoData.Inst().SceneCfgPathCfg(MainFBData.Inst().SelId);
        this.AddSmartDataCare(MainLevelInfoData.Inst().FlushData, this.FlushShowList.bind(this), "FlushBarrierCfg");

        this.viewNode.list.setVirtual();
    }

    InitPanel() {
        this.FlushShowList()
    }

    FlushShowList() {
        let listData = MainLevelInfoData.Inst().CfgBarrierBoss();
        this.viewNode.list.itemRenderer = this.itemRenderer.bind(this)
        this.viewNode.list.numItems = listData.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(MainLevelInfoData.Inst().CfgBarrierBoss()[index]);
    }

    OpenPanel() {
    }

    ClosePanel() {
    }
}