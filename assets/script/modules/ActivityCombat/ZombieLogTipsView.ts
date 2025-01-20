import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { SettingUsertServeData } from "modules/setting/SettingUsertServeData";
import { UH } from "../../helpers/UIHelper";
import { ActivityCombatData } from "./ActivityCombatData";
import { ViewManager } from "manager/ViewManager";
import { ActivityCombatView } from "./ActivityCombatView";
import { ActivityAdvertisingData } from "modules/ActivityAdvertising/ActivityAdvertisingData";
import { MainData } from "modules/main/MainData";

@BaseView.registView
export class ZombieLogTipsView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "ZombieLogTips",
        ViewName: "ZombieLogTipsView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Name: <fgui.GTextField>null,
        Describe: <fgui.GTextField>null,
        Board: <CommonBoard3>null,
        BtnClose: <fgui.GButton>null,
        BtnSkip: <fgui.GButton>null,
    };

    InitData() {
        this.viewNode.Board.SetBtnCloseVisible(false)
        this.viewNode.BtnClose.onClick(this.closeView, this);
        this.viewNode.BtnSkip.onClick(this.onClickSkip, this);

        let cfg = SettingUsertServeData.Inst().GetWordDes(19);
        UH.SetText(this.viewNode.Name, cfg.name);
        UH.SetText(this.viewNode.Describe, cfg.word);

        ActivityCombatData.Inst().ClearFirstZombieLogTips();
    }

    onClickSkip() {
        ViewManager.Inst().OpenView(ActivityCombatView);
        MainData.Inst().FlushSkip(4)
        ViewManager.Inst().CloseView(ZombieLogTipsView);
    }

    InitUI() {
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        ActivityAdvertisingData.Inst().TipOpenView();
    }
}