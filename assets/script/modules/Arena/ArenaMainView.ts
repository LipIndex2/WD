import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { CommonId, ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { CurrencyShow } from "modules/extends/Currency";
import { EGLoader } from "modules/extends/EGLoader";
import { MainViewRoleInfoButton } from "modules/main/MainView";
import { RoleData } from "modules/role/RoleData";
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { ArenaReadyView } from "./ArenaReadyView";
import { ArenaCtrl, ArenaReq } from "./ArenaCtrl";
import { ArenaData } from "./ArenaData";
import { ArenaReportView } from "./ArenaReportView";
import { ArenaShopView } from "./ArenaShopView";
import { ArenaMatching } from "./ArenaMatching";
import { ArenaRankReward2 } from "./ArenaRankReward2";
import { RankView } from "modules/rank/RankView";
import { RANK_TYPE } from "modules/rank/RankData";
import { ArenaRankReward } from "./ArenaRankReward";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { Format } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { AvatarData } from "modules/extends/AvatarCell";
import { AudioTag } from "modules/audio/AudioManager";
import { ArenaPassView } from "modules/ArenaPass/ArenaPassView";
import { RedPoint } from "modules/extends/RedPoint";
import { ArenaPassData } from "modules/ArenaPass/ArenaPassCtrl";
import { ActivityData } from "modules/activity/ActivityData";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { ArenaSkinView } from "./ArenaSkinView";
import { GuideCtrl } from "modules/guide/GuideCtrl";
import { sys } from "cc";
import { Prefskey } from "modules/common/PrefsKey";
import { ArenaGiftView } from "./ArenaGiftView";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";
import { ObjectPool } from "core/ObjectPool";

const ArenaMainViewGuideId = 13;

@BaseView.registView
export class ArenaMainView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "ArenaMain",
        ViewName: "ArenaMainView",
        LayerType: ViewLayer.Normal,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Curr2: <CurrencyShow>null,
        Curr3: <CurrencyShow>null,
        RoleInfo: <MainViewRoleInfoButton>null,
        ProgressBar: <fgui.GProgressBar>null,
        ShopBtn: <fgui.GButton>null,
        RankBtn: <fgui.GButton>null,
        TipBtn: <fgui.GButton>null,
        ReportBtn: <fgui.GButton>null,
        ArrayBtn: <fgui.GButton>null,
        RewardBtn: <fgui.GButton>null,
        MatchBtn: <fgui.GButton>null,
        CloseBtn: <fgui.GButton>null,
        ZhanLingBtn: <fgui.GButton>null,
        RankIcon: <EGLoader>null,
        BGEffect: <UIEffectShow>null,
        MapBtn: <fgui.GButton>null,
        GiftBtn: <fgui.GButton>null,

        timer: <TimeMeter>null,
        Name: <fgui.GTextField>null,
        RankText: <fgui.GTextField>null,
        Title: <fgui.GTextField>null,

        ArenaPassRed: <RedPoint>null,
        redPoint: <RedPoint>null,
    };

    protected extendsCfg = [
        { ResName: "RoleInfo", ExtendsClass: MainViewRoleInfoButton }
    ];

    private sp_show: UISpineShow = undefined;

    InitData() {
        ArenaCtrl.Inst().SendReq(ArenaReq.Info)

        this.AddSmartDataCare(RoleData.Inst().FlushData, this.FlushRoleAvater.bind(this), "FlushRoleAvater");
        this.AddSmartDataCare(ArenaData.Inst().smdData, this.FlushInfo.bind(this), "mainInfo");
        this.AddSmartDataCare(ArenaPassData.Inst().FlushData, this.FlushRemind.bind(this), "FlushInfo");

        this.viewNode.CloseBtn.onClick(this.closeView, this);
        this.viewNode.ArrayBtn.onClick(this.OnBattleArrayClick, this);
        this.viewNode.MatchBtn.onClick(this.OnMatchClick, this);

        this.viewNode.ReportBtn.onClick(()=>{if(GuideCtrl.Inst().IsGuiding())return;ViewManager.Inst().OpenView(ArenaReportView)});
        this.viewNode.RewardBtn.onClick(()=>{ViewManager.Inst().OpenView(ArenaRankReward2)});
        this.viewNode.ShopBtn.onClick(()=>{if(GuideCtrl.Inst().IsGuiding())return;ViewManager.Inst().OpenView(ArenaShopView)});
        this.viewNode.RankBtn.onClick(()=>{if(GuideCtrl.Inst().IsGuiding())return;ViewManager.Inst().OpenView(RankView, {type : RANK_TYPE.Arena, rewardFunc : ()=>{ViewManager.Inst().OpenView(ArenaRankReward)}})});
        this.viewNode.ZhanLingBtn.onClick(()=>{ViewManager.Inst().OpenView(ArenaPassView)});
        this.viewNode.GiftBtn.onClick(()=>{ViewManager.Inst().OpenView(ArenaGiftView)});
        this.viewNode.TipBtn.onClick(()=>{
            PublicPopupCtrl.Inst().HelpTip(30, Language.Arena.title1);
        })
        this.viewNode.MapBtn.onClick(()=>{if(GuideCtrl.Inst().IsGuiding())return;ViewManager.Inst().OpenView(ArenaSkinView)});

        this.viewNode.Curr2.BtnAddShow(true);
        this.viewNode.Curr2.SetCurrency(CommonId.ArenaItemId, true, null, 1);
        this.viewNode.Curr3.SetCurrency(CommonId.ArenaPassItemId, true, null, 1);


        this.viewNode.BGEffect.PlayEff(1208110);

        this.viewNode.timer.SetCallBack(()=>{
            ArenaCtrl.Inst().SendReq(ArenaReq.Info);
        });
        this.viewNode.ProgressBar.min = 0;

        let isOpen = ActivityData.Inst().IsOpen(ACTIVITY_TYPE.ArenaPass);
        this.viewNode.ZhanLingBtn.visible = FunOpen.Inst().checkAudit(1) && isOpen;

        this.viewNode.GiftBtn.visible = FunOpen.Inst().checkAudit(1) && ActivityData.Inst().IsOpen(ACTIVITY_TYPE.ArenaGift);

        this.sp_show = ObjectPool.Get(UISpineShow, ResPath.Spine("PVP/PVP_libao"), true, (obj: any) => {
            obj.setPosition(55, -50);
            this.viewNode.GiftBtn._container.insertChild(obj, 1);
        });

        //阵容按钮指引
        GuideCtrl.Inst().AddGuideUi("ArenaMainViewArrayBtn", this.viewNode.ArrayBtn);
        GuideCtrl.Inst().AddGuideUi("ArenaMainReportBtn", this.viewNode.ReportBtn);
        GuideCtrl.Inst().AddGuideUi("ArenaMainSkinBtn", this.viewNode.MapBtn);
        GuideCtrl.Inst().AddGuideUi("ArenaMainShopBtn", this.viewNode.ShopBtn);
        GuideCtrl.Inst().AddGuideUi("ArenaMainRankBtn", this.viewNode.RankBtn);
        GuideCtrl.Inst().AddGuideUi("ArenaMainTimeInfo", this.viewNode.Title);
        GuideCtrl.Inst().AddGuideUi("ArenaMainMatchBtn", this.viewNode.MatchBtn);
    }

    OpenCallBack() {
        this.FlushPanel();
    }

    CloseCallBack() {
        GuideCtrl.Inst().ClearGuideUi("ArenaMainViewArrayBtn");
        GuideCtrl.Inst().ClearGuideUi("ArenaMainReportBtn");
        GuideCtrl.Inst().ClearGuideUi("ArenaMainSkinBtn");
        GuideCtrl.Inst().ClearGuideUi("ArenaMainShopBtn");
        GuideCtrl.Inst().ClearGuideUi("ArenaMainRankBtn");
        GuideCtrl.Inst().ClearGuideUi("ArenaMainTimeInfo");
        GuideCtrl.Inst().ClearGuideUi("ArenaMainMatchBtn");

        let flag = sys.localStorage.getItem(Prefskey.GetArenaRemindKey());
        if(flag == null || flag == ""){
            sys.localStorage.setItem(Prefskey.GetArenaRemindKey(), "1");
            ArenaData.Inst().FlushRemind();
        }
        
        if (this.sp_show) {
            ObjectPool.Push(this.sp_show);
            this.sp_show = null
        }

        this.SetGuide();
    }

    SetGuide(){
        if(RoleData.Inst().IsGuideNum(ArenaMainViewGuideId, false)){
            RoleData.Inst().IsGuideNum(13)
            RoleData.Inst().IsGuideNum(14)
            RoleData.Inst().IsGuideNum(15)
            RoleData.Inst().IsGuideNum(16)
        }
    }

    FlushPanel(){
        this.FlushRoleAvater();
        this.FlushInfo();
        this.FlushRemind();
    }

    private isTriggedGuide = false;
    FlushInfo(){
        this.viewNode.MatchBtn.grayed = ArenaData.Inst().IsCanMatch() < 1;

        this.viewNode.timer.CloseCountDownTime();
        let timeCfg = ArenaData.Inst().GetCurTimeCfg();
        this.viewNode.timer.StampTime(timeCfg.time_stamp, TimeFormatType.TYPE_TIME_7);
        UH.SetText(this.viewNode.Title, Format(Language.Arena.title2, timeCfg.time_seq));
        let rankCfg = ArenaData.Inst().GetCurRankCfg();
        UH.SetText(this.viewNode.RankText, rankCfg.rank_describe);
        if(ArenaData.Inst().mainInfo != null){
            UH.SetIcon(this.viewNode.RankIcon, rankCfg.rank_icon, ICON_TYPE.ARENA_RANK, null, true);
        }
        this.viewNode.ProgressBar.max = rankCfg.rank_points;
        this.viewNode.ProgressBar.value = ArenaData.Inst().score;

        this.viewNode.Curr2.FlushNumShow();

        if(!this.isTriggedGuide && ArenaData.Inst().GetIsNeedGuide()){
            this.isTriggedGuide = true;
            GuideCtrl.Inst().Start(ArenaMainViewGuideId);
        }
        
        let rewardNum = ArenaData.Inst().RankRewardRemind();
        this.viewNode.redPoint.SetNum(rewardNum);
    }

    FlushRoleAvater() {
        this.viewNode.RoleInfo.FlushShow();
    }

    FlushRemind(){
        let redNum = ArenaPassData.Inst().IsRewardCanGet();
        this.viewNode.ArenaPassRed.SetNum(redNum);
        this.FlushZhanLingInfo();
    }

    FlushZhanLingInfo(){
        let isOpen = ActivityData.Inst().IsOpen(ACTIVITY_TYPE.ArenaPass);
        if(!isOpen){
            return;
        }
        let level = ArenaPassData.Inst().GetLevel();
        let levelCfg = ArenaPassData.Inst().GetPasscheckLevelCfg(level);
        let exp = ArenaPassData.Inst().getPasscheckExp();
        let progressBar = <fgui.GProgressBar>this.viewNode.ZhanLingBtn.getChild("ProgressBar").asCom;
        progressBar.max = levelCfg.up_exp
        progressBar.value = exp
    }

    OnBattleArrayClick(){
        ViewManager.Inst().OpenView(ArenaReadyView);
    }

    OnMatchClick(){
        if(GuideCtrl.Inst().IsGuiding())return;
        let isOpen = ActivityData.Inst().IsOpen(ACTIVITY_TYPE.Arena)
        if(!isOpen){
            PublicPopupCtrl.Inst().Center(Language.FunOpen.ActivityTip);
            return;
        }
        let state = ArenaData.Inst().IsCanMatch();
        if(state < 1){
            if(state == -1){
                PublicPopupCtrl.Inst().Center(Language.Arena.tips2);
            }else if(state == -2){
                PublicPopupCtrl.Inst().ItemNotEnoughNotice(CommonId.ArenaItemId);
            }
            return;
        }
        ViewManager.Inst().OpenView(ArenaMatching);
    }
}