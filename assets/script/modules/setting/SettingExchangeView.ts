
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask, viewRegcfg } from "modules/common/BaseView";
import { Language } from "modules/common/Language";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { LoginData } from "modules/login/LoginData";
import { MailConfig } from "modules/mail/MailConfig";
import { MailCtrl } from "modules/mail/MailCtrl";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { RoleData } from "modules/role/RoleData";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { PackageData } from "preload/PkgData";
import { HTTP } from "../../helpers/HttpHelper";
import { MD5 } from "../../helpers/MD5";
import { TYPE_TIMER, Timer } from "modules/time/Timer";

@BaseView.registView
export class SettingExchangeView extends BaseView {
    protected viewRegcfg: viewRegcfg = {
        UIPackName: "SettingExchange",
        ViewName: "SettingExchangeView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,

        BtnExchange: <fgui.GButton>null,
        InputField: <fgui.GTextInput>null,
        InputTips: <fgui.GTextField>null,
        Title: <fgui.GTextField>null,
    }

    InitData() {
        this.viewNode.Board.SetData(new BoardData(SettingExchangeView));

        this.viewNode.BtnExchange.onClick(this.OnClickExchange.bind(this));

        this.viewNode.InputField.on(fgui.Event.TEXT_CHANGE, () => {
            this.viewNode.InputTips.visible = "" == this.viewNode.InputField.text
            this.viewNode.Title.text = this.viewNode.InputField.text
        })
    }

    InitUI() {
        // this.FlushShow()
        // this.FlushSetingInfo()
    }



    OnClickExchange() {
        let ex_card = LoginData.GetUrlParm().param_list.gift_fetch_url
        // LogError("?sfed" , this.viewNode.InputField.text)

        if (this.viewNode.InputField.text == "") {
            PublicPopupCtrl.Inst().Center(Language.CDKeyExchange.EmptyHint)
            return
        }

        let orgin_sign = PackageData.Inst().getSpid() + LoginData.Inst().ResultData.currentId + LoginData.Inst().GetLoginData().uid +
            RoleData.Inst().InfoRoleId + RoleData.Inst().InfoRoleLevel + this.viewNode.InputField.text + Math.floor(TimeCtrl.Inst().ServerTime) +
            "33cc62b07ae98fffddd923b178aa0a14"

        // let orgin_sign = "{$this->input["+"dev"+"]}"+
        // "{$this->input["+LoginData.Inst().ResultData.currentId+"]}"+
        // "{$this->input["+LoginData.Inst().GetLoginData().uid+"]}"+
        // "{$this->input["+RoleData.Inst().GetRoleId()+"]}"+
        // "{$this->input["+RoleData.Inst().GetRoleLevel()+"]}"+
        // "{$this->input["+this.viewNode.InputField.text+"]}"+
        // "{$this->input["+Math.floor(TimeCtrl.Inst().ServerTime)+"]}"+
        // "33cc62b07ae98fffddd923b178aa0a14"
        // let sign = FairyGUI.BuilderUtil.Encrypt_MD5(orgin_sign)

        // LogError("sign:",orgin_sign)
        let url = ex_card +
            "?spid=" + PackageData.Inst().getSpid() +
            "&server=" + LoginData.Inst().ResultData.currentId +
            "&user=" + LoginData.Inst().GetLoginData().uid +
            "&role=" + RoleData.Inst().InfoRoleId +
            "&level=" + RoleData.Inst().InfoRoleLevel +
            "&vip=" + "0" +
            "&card=" + this.viewNode.InputField.text +
            "&time=" + Math.floor(TimeCtrl.Inst().ServerTime) +
            "&sign=" + MD5.encode(orgin_sign)
        HTTP.GetJson(url, this.ExchangeRet.bind(this));
    }


    private ExchangeRet(statusCode: number, resp: any) {
        if (resp.ret > -1) {
            if (0 == resp.ret) {
                this.CheckExchangeRet();
            }
            PublicPopupCtrl.Inst().Center(Language.CDKeyExchange.RetCode[resp.ret])
        }
    }

    private _ht: TYPE_TIMER;
    public CheckExchangeRet() {
        if (this._ht) {
            Timer.Inst().CancelTimer(this._ht);
        }
        this._ht = Timer.Inst().AddRunTimer(() => {
            MailCtrl.Inst().SendMailReqBrief(MailConfig.MailType.system)
        }, 2, 3, true);
    }

}