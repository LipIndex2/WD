
import * as fgui from "fairygui-cc";
import { BasePanel } from 'modules/common/BasePanel';
import { MailConfig } from "./MailConfig";
import { MailCtrl } from "./MailCtrl";
import { MailData } from "./MailData";

export class MailViewNormalPanel extends BasePanel {
    protected viewNode = {
        ShowList: <fgui.GList>null,
        GpEmpty: <fgui.GGroup>null,
    };

    InitPanelData() {
        this.viewNode.ShowList.setVirtual();

        this.AddSmartDataCare(MailData.Inst().FlushData, this.FlushMailList.bind(this), "FlushMailList");
        MailCtrl.Inst().SendMailReqBrief(MailConfig.MailType.normal)
    }

    InitPanel() {
        this.FlushMailList()
    }

    FlushMailList() {
        let show_list = MailData.Inst().GetMailNormalList()
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.ShowList.numItems = show_list.length;
        this.viewNode.GpEmpty.visible = 0 == show_list.length
    }

    private itemRenderer(index: number, item: any){
        item.SetData(MailData.Inst().GetMailNormalList()[index]);
    }
}
