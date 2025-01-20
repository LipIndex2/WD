import { RoleData } from 'modules/role/RoleData';
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { RoleCtrl } from "./RoleCtrl";
import { ViewManager } from 'manager/ViewManager';
import { BagData } from 'modules/bag/BagData';
import { Item } from 'modules/bag/ItemData';
import { ChatFilter, WordFilterType } from './chat_filter';
import { ChannelAgent } from '../../proload/ChannelAgent';
import { BannedWordFilter } from 'modules/sensitiveWords/BannedWordFilter';

@BaseView.registView
export class SettingNameView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "SettingName",
        ViewName: "SettingNameView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,

        InputField: <fgui.GTextInput>null,
        Title: <fgui.GTextField>null,
        BtnConfirm1: <fgui.GButton>null,
        BtnConfirm2: <fgui.GButton>null,
    }

    InitData() {
        this.viewNode.Board.SetData(new BoardData(SettingNameView));

        this.AddSmartDataCare(RoleData.Inst().FlushData, this.FulshNameChange.bind(this), "FlushRoleInfo");

        this.viewNode.BtnConfirm1.onClick(this.OnClickConfirm, this);
        this.viewNode.BtnConfirm2.onClick(this.OnClickConfirm, this);

        this.viewNode.InputField.on(fgui.Event.TEXT_CHANGE, () => {
            this.viewNode.Title.text = this.viewNode.InputField.text
        })

        this.viewNode.BtnConfirm1.visible = RoleData.Inst().InfoRoleNameNum != 0
        this.viewNode.BtnConfirm2.visible = RoleData.Inst().InfoRoleNameNum == 0

        let cfg = RoleData.Inst().CfgPlayerLevelOtherNameItem()
        this.viewNode.BtnConfirm1.title = "x" + cfg[0].num
    }

    FulshNameChange() {
        PublicPopupCtrl.Inst().Center(Language.SettingName.tip)
        ViewManager.Inst().CloseView(SettingNameView)
    }

    InitUI() {
    }

    OnClickConfirm() {
        let text = this.viewNode.InputField.text
        if (text == "") {
            PublicPopupCtrl.Inst().Center(Language.SettingName.Name)
            return
        }
        let filterData = BannedWordFilter.ins.filterWord(text)
        if (filterData.has || ChatFilter.Inst().IsIllegal(text)) {
            PublicPopupCtrl.Inst().Center(Language.RoleInfo.IllegalContent)
            return;
        }
        let cfg = RoleData.Inst().CfgPlayerLevelOtherNameItem()
        let num = BagData.Inst().GetItemNum(cfg[0].item_id)
        if (RoleData.Inst().InfoRoleNameNum > 0 && num < cfg[0].num) {
            let name = Item.GetName(cfg[0].item_id);
            PublicPopupCtrl.Inst().Center(name + Language.Common.NotHasTip);
            return;
        }
        if (ChannelAgent.Inst().CheckContent(WordFilterType.ROLE_NAME + "", this.viewNode.InputField.text, (result: boolean, msg: string) => {
            if (result) {
                RoleCtrl.Inst().SendOutUserInfo(msg, RoleData.Inst().InfoRoleHeadChar, false)
            } else {
                PublicPopupCtrl.Inst().Center(Language.RoleInfo.IllegalContent)
            }
        })) {
            return;
        }
        RoleCtrl.Inst().SendOutUserInfo(this.viewNode.InputField.text, RoleData.Inst().InfoRoleHeadChar, false)
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }
}