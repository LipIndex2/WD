import { RemindGroupMonitor } from "data/HandleCollectorCfg";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { InviteFriendView } from "modules/InviteFriend/InviteFriendView";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Mod } from "modules/common/ModuleDefine";
import { RedPoint } from "modules/extends/RedPoint";
import { MailData } from "modules/mail/MailData";
import { RemindCtrl } from "modules/remind/RemindCtrl";
import { SettingView } from "modules/setting/SettingView";

@BaseView.registView
export class MainOtherView extends BaseView {
    private fightCtrler: fgui.Controller


    protected viewRegcfg = {
        UIPackName: "MainOther",
        ViewName: "MainOtherView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,

        BtnMail: <fgui.GButton>null,
        BtnSetting: <fgui.GButton>null,
        BtnInvite: <fgui.GButton>null,
        MailRedPoint: <RedPoint>null,
        InviteFriendRed: <RedPoint>null,
    };

    /* protected extendsCfg = [
        { ResName: "组件名", ExtendsClass: 拓展类 }
    ]; */


    InitData() {
        this.fightCtrler = this.view.getController("FightState");

        this.viewNode.BtnMail.onClick(this.OnClickMail, this);
        this.viewNode.BtnSetting.onClick(this.OnClickSetting, this);
        this.viewNode.BtnInvite.onClick(this.OnClickInvite, this);

        this.handleCollector.Add(RemindGroupMonitor.Create(Mod.MainOther, this.freshMailRedRedPoint.bind(this), true));
        // this.handleCollector.Add(RemindGroupMonitor.Create(Mod.MainOther, this.freshInviteFriendRedRedPoint.bind(this), true));
    }

    freshMailRedRedPoint() {
        let num = RemindCtrl.Inst().GetRemindNum(Mod.Mail.View)
        this.viewNode.MailRedPoint.SetNum(num);
    }

    // freshInviteFriendRedRedPoint() {
    //     let num = RemindCtrl.Inst().GetRemindNum(Mod.InviteFriend.View)
    //     this.viewNode.InviteFriendRed.SetNum(num);
    // }

    InitUI() {
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }

    OnEnterClick() {

    }

    OnClickInvite() {
        ViewManager.Inst().CloseView(MainOtherView);
        ViewManager.Inst().OpenView(InviteFriendView)
    }

    OnClickMail() {
        ViewManager.Inst().CloseView(MainOtherView);
        // ViewManager.Inst().OpenView(MailView)
        ViewManager.Inst().OpenViewByKey(MailData.Inst().AutoMail())
    }

    OnClickSetting() {
        ViewManager.Inst().CloseView(MainOtherView);
        ViewManager.Inst().OpenView(SettingView)
    }
}