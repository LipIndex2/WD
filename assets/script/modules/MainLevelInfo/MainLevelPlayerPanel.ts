import { MainLevelInfoData } from './MainLevelInfoData';
import * as fgui from "fairygui-cc";
import { BasePanel } from "modules/common/BasePanel";

export class MainLevelPlayerPanel extends BasePanel {
    protected viewNode = {
        list: <fgui.GList>null,
        NoData: <fgui.GTextField>null,
    };
    listData: IPB_MainFBPassNode[];


    InitPanelData() {
        this.viewNode.list.setVirtual();
    }

    InitPanel() {
        this.FlushShowList()
    }

    FlushShowList() {
        let listData = MainLevelInfoData.Inst().InfoList;
        this.viewNode.list.itemRenderer = this.itemRenderer.bind(this);
        this.listData = listData;
        this.viewNode.list.numItems = listData.length;


        this.viewNode.NoData.visible = listData.length == 0
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index])
    }

    OpenPanel() {
    }

    ClosePanel() {
    }
}