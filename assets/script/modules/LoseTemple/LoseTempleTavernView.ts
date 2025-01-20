import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { LoseTempleData } from "./LoseTempleData";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { AdType, ICON_TYPE } from "modules/common/CommonEnum";
import { HeroData, HeroDataModel } from "modules/hero/HeroData";
import { ViewManager } from "manager/ViewManager";
import { HeroInfoView } from "modules/hero/HeroInfoView";
import { LoseTempleCtrl } from "./LoseTempleCtrl";
import { RoleData } from "modules/role/RoleData";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { ChannelAgent, GameToChannel } from "../../proload/ChannelAgent";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";
import { Timer } from "modules/time/Timer";
import { TimeHelper } from "../../helpers/TimeHelper";

//酒馆
@BaseView.registView
export class LoseTempleTavernView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "LoseTempleTavern",
        ViewName: "LoseTempleTavernView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard2>null,
        BtnRefresh: <fgui.GButton>null,
        BtnSelect: <fgui.GButton>null,
        BtnClose: <fgui.GButton>null,
        list: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "ButtonLoseHeroItem", ExtendsClass: LoseHeroItem }
    ];
    eventId: number;
    private selectId: number = 0;
    private isAdShow: boolean = false;
    remainsPub: boolean = false
    private timer_handle_ad: any = null;
    listData: { heroid: any; heroLevel: any; }[];
    InitData(param: number) {
        this.eventId = param;
        // this.viewNode.Board.SetData(new BoardData(LoseTempleTavernView));
        this.viewNode.Board.SetBtnCloseVisible(false);

        this.AddSmartDataCare(LoseTempleData.Inst().FlushData, this.FlushData.bind(this), "FlushInfo");
        this.AddSmartDataCare(RoleData.Inst().FlushData, this.FlushAdShow.bind(this), "FlushAdInfo");

        this.viewNode.BtnClose.onClick(this.OnClickClose, this);
        this.viewNode.BtnRefresh.onClick(this.OnClickAd, this);
        this.viewNode.BtnSelect.onClick(this.OnCliclSelect, this)
        this.viewNode.list.setVirtual();
        this.viewNode.list.on(fgui.Event.CLICK_ITEM, this.OnClickItem, this)

        this.FlushData();
        this.FlushAdShow();
        this.viewNode.list.selectedIndex = this.selectId;
    }

    FlushData() {
        let pubEvent = LoseTempleData.Inst().pubEvent;
        let eventId = pubEvent ? pubEvent : this.eventId
        let data = LoseTempleData.Inst().GEtPubList(eventId);
        this.viewNode.list.itemRenderer = this.itemRenderer.bind(this);
        this.listData = data;
        this.viewNode.list.numItems = data.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    FlushAdShow() {
        Timer.Inst().CancelTimer(this.timer_handle_ad)
        let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.pub_flush)
        let co = RoleData.Inst().CfgAdTypeSeq(AdType.pub_flush)
        if (info && (info.nextFetchTime > TimeCtrl.Inst().ServerTime)) {
            this.viewNode.BtnRefresh.grayed = true
            this.timer_handle_ad = Timer.Inst().AddCountDownCT(() => {
                let ft = TimeHelper.FormatDHMS(info.nextFetchTime - TimeCtrl.Inst().ServerTime);
                this.viewNode.BtnRefresh.title = TextHelper.Format(Language.UiTimeMeter.TimeStr1, ft.hour, ft.minute, ft.second)
            }, this.FlushAdShow.bind(this), info.nextFetchTime, 1)
        } else {
            this.viewNode.BtnRefresh.title = Language.Common.Refresh1;
            this.viewNode.BtnRefresh.grayed = !(RoleData.Inst().InfoRoleLevel >= +co.level) || this.isAdShow;
        }
        this.viewNode.BtnRefresh.visible = RoleData.Inst().IsCanAD(AdType.pub_flush, false)
    }

    OnClickItem(item: LoseHeroItem) {
        this.selectId = this.viewNode.list.selectedIndex;
    }

    private OnClickAd() {
        let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.pub_flush)
        let co = RoleData.Inst().CfgAdTypeSeq(AdType.pub_flush)
        if (info) {
            if (info.nextFetchTime > TimeCtrl.Inst().ServerTime) {
                PublicPopupCtrl.Inst().Center(Language.Common.AdColdTime);
                return
            }
        }
        if (this.isAdShow) {
            return;
        }
        this.isAdShow = true;
        ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.pub_flush), "");
    }

    OnCliclSelect() {
        LoseTempleCtrl.Inst().SendLoseSelectPubHero(this.selectId);
        let list = LoseTempleData.Inst().GetRemainsListData();

        if (list.indexOf(4) != -1) {
            if (this.remainsPub) {
                ViewManager.Inst().CloseView(LoseTempleTavernView)
            }
        } else {
            ViewManager.Inst().CloseView(LoseTempleTavernView)
        }
        this.remainsPub = true;
    }

    OnClickClose() {
        PublicPopupCtrl.Inst().DialogTips(Language.LoseTemple.pubTip, () => {
            ViewManager.Inst().CloseView(LoseTempleTavernView)
        }, null, null, null);
    }
    InitUI() {
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        Timer.Inst().CancelTimer(this.timer_handle_ad)
    }
}

export class LoseHeroItem extends BaseItemGB {
    protected viewNode = {
        bg1: <fgui.GLoader>null,
        HeroIcon: <fgui.GLoader>null,
        RaceIcon: <fgui.GLoader>null,
        LevelShow: <fgui.GTextField>null,
        BtnHeroInfo: <fgui.GButton>null,
        UISpineShow: <UISpineShow>null,
    };
    private heroMode: HeroDataModel;
    public SetData(data: any) {
        this.heroMode = new HeroDataModel(data.heroid, data.heroLevel, true)
        let cfg = this.heroMode.data;
        let levelCfg = this.heroMode.GetLevelCfg();
        UH.SetIcon(this.viewNode.HeroIcon, levelCfg.res_id, ICON_TYPE.ROLE);
        UH.SpriteName(this.viewNode.RaceIcon, "CommonAtlas", "HeroAttr" + cfg.hero_race);
        UH.SpriteName(this.viewNode.bg1, "CommonAtlas", "HeroBgPinZhi" + cfg.hero_color);
        UH.SetText(this.viewNode.LevelShow, TextHelper.Format(Language.Hero.lv, data.heroLevel));

        this.viewNode.UISpineShow.LoadSpine(ResPath.UIEffect(1208077), true);

        this.viewNode.BtnHeroInfo.onClick(this.onClickHeroInfo, this);
    }

    onClickHeroInfo() {
        ViewManager.Inst().OpenView(HeroInfoView, this.heroMode);
    }

}