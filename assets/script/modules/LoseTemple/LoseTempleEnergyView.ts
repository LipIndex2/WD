import { LoseTempleData } from './LoseTempleData';
import { LoseTempleCtrl } from 'modules/LoseTemple/LoseTempleCtrl';
import { HeroData } from 'modules/hero/HeroData';
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { AdType } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { RoleData } from "modules/role/RoleData";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { ChannelAgent, GameToChannel } from "../../proload/ChannelAgent";
import { UH } from '../../helpers/UIHelper';
import { ViewManager } from 'manager/ViewManager';
import { TextHelper } from '../../helpers/TextHelper';
import { TimeHelper } from '../../helpers/TimeHelper';
import { Timer } from 'modules/time/Timer';
//体力恢复
@BaseView.registView
export class LoseTempleEnergyView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "LoseTempleEnergy",
        ViewName: "LoseTempleEnergyView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        list: <fgui.GList>null,
        Board: <CommonBoard2>null,
        Title: <fgui.GTextField>null,
        BtnAd: <fgui.GButton>null,
        BtnEnergy: <fgui.GButton>null,
    };

    heroid: number;
    private timer_handle_ad: any = null;
    private confirmFunc: Function;
    InitData(param: { heroid: number, confirmFunc?: Function }) {
        this.viewNode.Board.SetData(new BoardData(LoseTempleEnergyView));
        this.heroid = param.heroid;
        this.confirmFunc = param ? param.confirmFunc : undefined;
        this.viewNode.BtnAd.onClick(this.OnClickAd, this);
        this.viewNode.BtnEnergy.onClick(this.OnClickBtnEnergy, this);

        let cfg = HeroData.Inst().GetHeroBaseCfg(this.heroid);
        UH.SetText(this.viewNode.Title, TextHelper.Format(Language.LoseTemple.Energy, cfg.hero_name))

        let energy = LoseTempleData.Inst().GetEnergyNum()
        this.viewNode.BtnEnergy.grayed = energy == 0;

        this.FlushAdShow();
    }

    InitUI() {

    }
    FlushAdShow() {
        Timer.Inst().CancelTimer(this.timer_handle_ad)
        let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.Energ_recover)
        let co = RoleData.Inst().CfgAdTypeSeq(AdType.Energ_recover)
        this.viewNode.BtnAd.title = co.ad_param - ((info && info.todayCount) || 0) + "";
        if (info && (info.nextFetchTime > TimeCtrl.Inst().ServerTime) && (info.todayCount < co.ad_param)) {
            this.viewNode.BtnAd.grayed = true
            this.timer_handle_ad = Timer.Inst().AddCountDownCT(() => {
                let ft = TimeHelper.FormatDHMS(info.nextFetchTime - TimeCtrl.Inst().ServerTime);
                this.viewNode.BtnAd.title = TextHelper.Format(Language.UiTimeMeter.TimeStr1, ft.hour, ft.minute, ft.second)
            }, this.FlushAdShow.bind(this), info.nextFetchTime, 1)
        } else {
            this.viewNode.BtnAd.title = TextHelper.Format(Language.LoseTemple.EnergyConsume, co.ad_param - ((info && info.todayCount) || 0));
            this.viewNode.BtnAd.grayed = !(RoleData.Inst().InfoRoleLevel >= +co.level && (!info || (co.ad_param > info.todayCount)));
        }
        this.viewNode.BtnAd.visible = RoleData.Inst().IsCanAD(AdType.Energ_recover, false)
        if(!RoleData.Inst().IsCanAD(AdType.Energ_recover)){
            this.viewNode.BtnAd.visible = false
            this.viewNode.BtnEnergy.x = 252
        }
    }

    private OnClickAd() {
        let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.Energ_recover)
        let co = RoleData.Inst().CfgAdTypeSeq(AdType.Energ_recover)
        if (info) {
            if (info.todayCount >= co.ad_param) {
                PublicPopupCtrl.Inst().Center(Language.Common.AdFreeTime);
                return
            } else if (info.nextFetchTime > TimeCtrl.Inst().ServerTime) {
                PublicPopupCtrl.Inst().Center(Language.Common.AdColdTime);
                return
            }
        }
        // LoseTempleData.energyConsume = this.heroid;
        ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.Energ_recover), "", 0, this.heroid);
        this.confirmFunc && this.confirmFunc();
        ViewManager.Inst().CloseView(LoseTempleEnergyView)
    }

    OnClickBtnEnergy() {
        let energy = LoseTempleData.Inst().GetEnergyNum()
        if (energy == 0) {
            PublicPopupCtrl.Inst().Center(Language.LoseTemple.EnergyBonfire);
            return;
        }
        // LoseTempleData.energyConsume = this.heroid;
        LoseTempleCtrl.Inst().SendLoseEnergyConsume(this.heroid);
        this.confirmFunc && this.confirmFunc();
        ViewManager.Inst().CloseView(LoseTempleEnergyView)
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        Timer.Inst().CancelTimer(this.timer_handle_ad)
    }
}