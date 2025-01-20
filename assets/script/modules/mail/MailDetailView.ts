
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { AdType } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { BoardData } from 'modules/common_board/BoardData';
import { CommonBoard3 } from 'modules/common_board/CommonBoard3';
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { RoleData } from "modules/role/RoleData";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { UH } from "../../helpers/UIHelper";
import { ChannelAgent } from "../../proload/ChannelAgent";
import { MailCtrl } from "./MailCtrl";
import { MailData } from './MailData';

@BaseView.registView
export class MailDetailView extends BaseView {
    private rewardCtrler: fgui.Controller
    static IsAdMail: boolean
    static ExpirationTime: number

    protected viewRegcfg = {
        UIPackName: "MailDetail",
        ViewName: "MailDetailView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,

        ContentShow: <fgui.GTextField>null,
        BtnGet: <fgui.GButton>null,
        BtnAd: <fgui.GButton>null,
        RewardList: <fgui.GList>null,
    };
    listData: Item[];

    InitData() {
        this.viewNode.Board.SetData(new BoardData(MailDetailView));
        this.rewardCtrler = this.view.getController("RewardState");

        this.viewNode.BtnGet.onClick(this.OnClickGet, this);
        this.viewNode.BtnAd.onClick(this.OnClickAd, this);

        this.AddSmartDataCare(MailData.Inst().FlushData, this.FlushMailDetail.bind(this), "FlushMailDetail");
        this.AddSmartDataCare(MailData.Inst().FlushData, this.FlushMailDetail.bind(this), "FlushMailList");
    }

    InitUI() {
        this.FlushMailDetail()
    }

    CloseCallBack() {
        if (0 == MailData.Inst().MailDetailItemData.length || MailData.Inst().MailDetailIsFetch) {
            let info = MailData.Inst().MailDetail
            if (info) {
                MailCtrl.Inst().SendMailReqDelete(info.mailType, info.mailIndex);
            }
        }
    }

    FlushMailDetail() {
        this.viewNode.Board.SetTitle(MailData.Inst().MailDetailSubject)
        UH.SetText(this.viewNode.ContentShow, MailData.Inst().MailDetailContentTxt);

        let is_fetch = MailData.Inst().MailDetailIsFetch;
        this.viewNode.BtnGet.grayed = is_fetch
        this.viewNode.BtnAd.grayed = is_fetch

        let rewards = []
        let count = MailData.Inst().MailDetailItemData.length
        for (let element of MailData.Inst().MailDetailItemData) {
            rewards.push(Item.Create(element, { is_num: true }))
        }
        this.rewardCtrler.selectedIndex = count > 0 ? 1 : 0
        if (count > 0) {
            // this.viewNode.RewardList.width = 110 * Math.min(count, 3) + Math.min(count - 1, 2) * 20
            this.viewNode.RewardList.itemRenderer = this.itemRenderer.bind(this);
            this.listData = rewards;
            this.viewNode.RewardList.numItems = rewards.length;
        }
        this.viewNode.BtnAd.visible = MailDetailView.IsAdMail
        this.viewNode.BtnGet.visible = !MailDetailView.IsAdMail
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    OnClickGet() {
        if (Item.IsGeneBagMax(MailData.Inst().MailDetailItemData)) return
        if (MailDetailView.ExpirationTime > 0 && MailDetailView.ExpirationTime < TimeCtrl.Inst().ServerTime) {
            PublicPopupCtrl.Inst().Center(Language.Mail.OutTimeTips)
            ViewManager.Inst().CloseView(MailDetailView)
            return
        }
        let is_fetch = MailData.Inst().MailDetailIsFetch;
        if (is_fetch) {
            PublicPopupCtrl.Inst().Center(Language.Mail.FetchTips)
            return
        }
        let info = MailData.Inst().MailDetail
        if (info) {
            MailCtrl.Inst().SendMailReqFetch(info.mailType, info.mailIndex);
        }
    }

    OnClickAd() {
        if (MailDetailView.ExpirationTime > 0 && MailDetailView.ExpirationTime < TimeCtrl.Inst().ServerTime) {
            PublicPopupCtrl.Inst().Center(Language.Mail.OutTimeTips)
            ViewManager.Inst().CloseView(MailDetailView)
            return
        }
        let is_fetch = MailData.Inst().MailDetailIsFetch;
        if (is_fetch) {
            PublicPopupCtrl.Inst().Center(Language.Mail.FetchTips)
            return
        }
        let info = MailData.Inst().MailDetail
        if (info) {
            ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.mail), "", 0, info.mailIndex);
        }
    }
}