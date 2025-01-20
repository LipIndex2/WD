
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseItem } from 'modules/common/BaseItem';
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { COLORS } from "modules/common/ColorEnum";
import { AdType } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { Mod } from "modules/common/ModuleDefine";
import { ItemCell } from "modules/extends/ItemCell";
import { RedPoint } from "modules/extends/RedPoint";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { RoleData } from "modules/role/RoleData";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { DataHelper } from "../../helpers/DataHelper";
import { UH } from "../../helpers/UIHelper";
import { ChannelAgent } from "../../proload/ChannelAgent";
import { MailCtrl } from "./MailCtrl";
import { MailData } from "./MailData";
import { MailDetailView } from "./MailDetailView";
import { MailViewNormalPanel } from './MailViewNormalPanel';
import { MailViewSystemPanel } from "./MailViewSystemPanel";

@BaseView.registView
export class MailView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "Mail",
        ViewName: "MailView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected boardCfg = {
        TabberCfg: [
            { panel: MailViewSystemPanel, viewName: "MailViewSystemPanel", titleName: Language.Mail.Tab1, modKey: Mod.Mail.View },
            // { panel: MailViewNormalPanel, viewName: "MailViewNormalPanel", titleName: Language.Mail.Tab2, modKey: Mod.Mail.Normal },
        ]
    };

    protected extendsCfg = [
        { ResName: "ItemShow", ExtendsClass: MailViewShowItem },
    ];

}

export class MailViewShowItem extends BaseItem {
    private rewardCtrler: fgui.Controller

    protected viewNode = {
        bg: <fgui.GLoader>null,
        NewObj: <fgui.GImage>null,
        TitleShow: <fgui.GTextField>null,
        TimeShow: <TimeMeter>null,
        redPoint: <RedPoint>null,
        CellShow: <ItemCell>null,
        BtnAd: <fgui.GButton>null,
    };

    protected onConstruct() {
        super.onConstruct()
        this.rewardCtrler = this.getController("RewardState");
        this.viewNode.bg.onClick(this.OnClickDetail, this);
        this.viewNode.BtnAd.onClick(this.OnClickAd, this);
    }

    protected onDestroy() {
        super.onDestroy()
        this.viewNode.TimeShow.CloseCountDownTime();
    }

    SetData(data: any) {
        super.SetData(data)
        this.viewNode.NewObj.visible = 0 == data.isRead
        this.viewNode.redPoint.SetNum(0 == data.isRead ? 1 : 0)
        UH.SetText(this.viewNode.TitleShow, DataHelper.BytesToString(data.subject))
        this.rewardCtrler.selectedIndex = data.itemData.length > 0 ? 1 : 0
        this.viewNode.BtnAd.visible = data.isAdMail
        if (data.itemData && data.itemData.length > 0) {
            let itemData = data.itemData[0]
            this.viewNode.CellShow.SetData(Item.Create(itemData, { is_num: true }))
            this.viewNode.CellShow.visible = true
        } else {
            this.viewNode.CellShow.visible = false
        }
        this.viewNode.TimeShow.visible = 0 != this._data.expirationTime
        this.FlushTimeShow()
    }

    FlushTimeShow() {
        let expirationTime = this._data.expirationTime
        this.viewNode.TimeShow.CloseCountDownTime()
        this.viewNode.TimeShow.SetOutline(true, COLORS.MailTime, 3)
        if (expirationTime > TimeCtrl.Inst().ServerTime) {
            this.viewNode.TimeShow.StampTime(expirationTime, TimeFormatType.TYPE_TIME_8, Language.UiTimeMeter.TimeLimitAgo1)
            this.viewNode.TimeShow.SetCallBack(MailData.Inst().FlushMailList.bind(MailData.Inst()))
        }
    }

    OnClickDetail() {
        MailDetailView.IsAdMail = this._data.isAdMail
        MailDetailView.ExpirationTime = this._data.expirationTime
        MailCtrl.Inst().SendMailReqDetail(this._data.mailType, this._data.mailIndex)
        ViewManager.Inst().OpenView(MailDetailView)
    }

    OnClickAd() {
        ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.mail), "", 0, this._data.mailIndex);
    }
}
