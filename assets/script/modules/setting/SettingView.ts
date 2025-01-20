
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask, viewRegcfg } from "modules/common/BaseView";
import { ROLE_SETTING_TYPE } from "modules/common/CommonEnum";
import { LH, Language, LanguageShow } from "modules/common/Language";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { CommonComboBox } from "modules/common_combo_box/CommonComboBox";
import { RoleData } from "modules/role/RoleData";
import { PackageData } from "preload/PkgData";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { ChannelAgent, GameToChannel } from "../../proload/ChannelAgent";
import { SettingExchangeView } from "./SettingExchangeView";
import { ENUM_UserServe, SettingUsertServeView } from "./SettingUsertServeView";
import { SettingUsertServeData } from "./SettingUsertServeData";
import { DEBUG, WECHAT } from "cc/env";
import { TopLayerView } from "modules/main/TopLayerView";
import { wexin } from "preload/PreloadToolFuncs";
import { Scene, screen } from "cc";
import { Timer } from "modules/time/Timer";
import { CommonEvent } from "modules/common/CommonEvent";
import { EventCtrl } from "modules/common/EventCtrl";
import { GameCircleView } from "modules/GameCircle/GameCircleView";

@BaseView.registView
export class SettingView extends BaseView {
    protected viewRegcfg: viewRegcfg = {
        UIPackName: "Setting",
        ViewName: "SettingView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,

        TogMusic: <fgui.GButton>null,
        TogAudio: <fgui.GButton>null,

        BtnCopy: <fgui.GButton>null,
        BtnExit: <fgui.GButton>null,
        BtnExchange: <fgui.GButton>null,
        BtnSupport: <fgui.GButton>null,
        BtnProto1: <fgui.GButton>null,
        BtnProto2: <fgui.GButton>null,
        BtnGame: <fgui.GButton>null,

        VersionShow: <fgui.GTextField>null,

        CbLang: <CommonComboBox>null,
    }

    InitData() {
        this.viewNode.Board.SetData(new BoardData(SettingView));

        this.viewNode.BtnCopy.onClick(this.OnClickCopy, this);
        // this.viewNode.BtnGame.visible = false;
        // this.viewNode.BtnExchange.visible = false;
        // this.viewNode.BtnGame.onClick(this.OnClickGame, this);
        // this.viewNode.BtnExchange.onClick(this.OnClickExchange, this);
        this.viewNode.BtnSupport.onClick(this.OnClickSupport.bind(this));
        this.viewNode.BtnProto1.onClick(this.OnClickProto.bind(this, 2));
        this.viewNode.BtnProto2.onClick(this.OnClickProto.bind(this, 3));
        this.viewNode.TogMusic.on(fgui.Event.STATUS_CHANGED, this.onChangedEnd, this);
        this.viewNode.TogAudio.on(fgui.Event.STATUS_CHANGED, this.onChangedEnd, this);

        this.viewNode.CbLang.items = LanguageShow;
        this.viewNode.CbLang.values = LH.LangCbTypes
        this.viewNode.CbLang.on(fgui.Event.STATUS_CHANGED, this.onChangedEnd, this)
        this.viewNode.CbLang.value = LH.LangTypeStr
    }

    // /**微信游戏圈按钮 */
    // private wx_gameGroup: { show: Function, destroy: Function, hide: Function }
    OpenCallBack(): void {
        // if (WECHAT && this.viewNode.BtnGame.visible && ChannelAgent.wx) {

        // } else if (!DEBUG) {
        //     //游戏圈只在微信端显示
        //     this.viewNode.BtnGame.visible = false;
        // }
    }

    // protected onShowEnd(): void {
    //     if (WECHAT && this.viewNode.BtnGame.visible && ChannelAgent.wx) {
    //         let btn = this.wx_gameGroup = ChannelAgent.Inst().getWeChatGameHubBtn(this.viewNode.BtnGame);
    //         EventCtrl.Inst().on(CommonEvent.VIEW_OPEN, this.onCheckViewOpen, this, false);
    //         EventCtrl.Inst().on(CommonEvent.VIEW_CLOSE, this.onCheckViewClose, this, false);
    //         if (btn)
    //             btn.show();
    //     }
    // }


    // private onCheckViewOpen() {
    //     let btn = this.wx_gameGroup;
    //     if (!ViewManager.Inst().IsTopView(SettingView) && btn)
    //         btn.hide();
    // }

    // private onCheckViewClose() {
    //     let btn = this.wx_gameGroup;
    //     if (btn && ViewManager.Inst().IsTopView(SettingView))
    //         btn.show();
    // }

    InitUI() {
        this.FlushShow()
        this.FlushSetingInfo()
    }


    FlushShow() {
        this.viewNode.BtnCopy.title = `ID:${RoleData.Inst().InfoRoleId}`
        UH.SetText(this.viewNode.VersionShow, TextHelper.Format(Language.Setting.VersionShow, PackageData.Inst().getVersion()))

        let p_list = PackageData.Inst().getQueryData().param_list;

        // if (p_list.publish_info && p_list.publish_info.customer_gm && p_list.publish_info.customer_gm.wx_id) {
        //     this.viewNode.BtnSupport.visible = true;
        // } else {
        //     this.viewNode.BtnSupport.visible = false;
        // }
    }

    FlushSetingInfo() {
        this.viewNode.TogMusic.selected = 0 == RoleData.Inst().GetRoleSystemSetInfo(ROLE_SETTING_TYPE.SettingMusic)
        this.viewNode.TogAudio.selected = 0 == RoleData.Inst().GetRoleSystemSetInfo(ROLE_SETTING_TYPE.SettingAudio)
    }

    OnClickProto(index: number) {
        ViewManager.Inst().OpenView(SettingUsertServeView, { type: ENUM_UserServe.SETTING, param: index })
    }

    OnClickCopy() {
        if (DEBUG && PackageData.Inst().getIsDebug()) {
            ViewManager.Inst().OpenView(TopLayerView)
        }
        ChannelAgent.Inst().CopyText(RoleData.Inst().InfoRoleId + "");
    }

    CloseCallBack(): void {
        // EventCtrl.Inst().off(CommonEvent.VIEW_OPEN, this.onCheckViewOpen, this);
        // EventCtrl.Inst().off(CommonEvent.VIEW_CLOSE, this.onCheckViewClose, this);
        // if (this.wx_gameGroup) {
        //     this.wx_gameGroup.destroy();
        //     this.wx_gameGroup = undefined;
        // }
    }

    OnClickGame() {
        ViewManager.Inst().OpenView(GameCircleView)
    }

    OnClickSupport() {
        let str = ""
        let p_list = PackageData.Inst().getQueryData().param_list;
        if (p_list.publish_info && p_list.publish_info.customer_gm && p_list.publish_info.customer_gm.wx_id) {
            str = p_list.publish_info.customer_gm.wx_id
        }
        ViewManager.Inst().OpenView(SettingUsertServeView, { type: ENUM_UserServe.DIALOG, param: { title: Language.Common.GM, content: "客服联系邮箱:wjszm2024@163.com" } })
    }

    OnClickExchange() {
        ViewManager.Inst().OpenView(SettingExchangeView)
    }

    onChangedEnd(target: fgui.GComponent) {
        switch (target._name) {
            case "TogMusic":
                RoleData.Inst().ChangeRoleSystemSetInfo(ROLE_SETTING_TYPE.SettingMusic, this.viewNode.TogMusic.selected ? 0 : 1)
                if (this.viewNode.TogMusic.selected) {
                    AudioManager.Inst().RePlayBg()
                } else {
                    AudioManager.Inst().StopBg()
                }
                break;
            case "TogAudio":
                RoleData.Inst().ChangeRoleSystemSetInfo(ROLE_SETTING_TYPE.SettingAudio, this.viewNode.TogAudio.selected ? 0 : 1)
                break;
            case "CbLang":
                let langType = LH.LangType
                LH.LangType = + this.viewNode.CbLang.value;
                this.viewNode.CbLang.value = `${langType}`
                break;
        }
    }

}