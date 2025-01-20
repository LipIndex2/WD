import { LoseTempleData } from './../LoseTemple/LoseTempleData';
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { SceneType } from "modules/Battle/BattleConfig";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { ActivityData } from "modules/activity/ActivityData";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { Item } from 'modules/bag/ItemData';
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { COLORS } from 'modules/common/ColorEnum';
import { CommonId, ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { CommonBoard4 } from 'modules/common_board/CommonBoard4';
import { CurrencyShow, ExpShow } from "modules/extends/Currency";
import { ItemCell } from 'modules/extends/ItemCell';
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { UH } from "../../helpers/UIHelper";
import { ActivityCombatData } from "./ActivityCombatData";
import { ActivityCombatDifficultyView } from "./ActivityCombatDifficultyView";
import { Format, TextHelper } from "../../helpers/TextHelper";
import { TimeHelper } from "../../helpers/TimeHelper";
import { FunOpen } from 'modules/FunUnlock/FunOpen';
import { Mod } from 'modules/common/ModuleDefine';
import { RoleData } from 'modules/role/RoleData';
import { EverydayChallengeView } from 'modules/main_fb/EverydayChallengeView';
import { ZombieView } from './ZombieView';
import { RemindGroupMonitor } from 'data/HandleCollectorCfg';
import { ModManger } from 'manager/ModManger';
import { RedPoint } from 'modules/extends/RedPoint';
import { RemindCtrl } from 'modules/remind/RemindCtrl';
import { HandleCollector } from 'core/HandleCollector';
import { MainFBData } from 'modules/main_fb/MainFBData';
import { CommonEvent } from 'modules/common/CommonEvent';
import { EventCtrl } from 'modules/common/EventCtrl';
import { ActivityCtrl } from 'modules/activity/ActivityCtrl';
import { DefenseHomeView } from 'modules/defense_home/DefenseHomeView';
import { DefenseHomeData } from 'modules/defense_home/DefenseHomeCtrl';
import { ArenaData } from 'modules/Arena/ArenaData';
import { ArenaMainView } from 'modules/Arena/ArenaMainView';

interface IListTabData {
    type: number,
    tabTitle: string,
    Icon: string,
    bg: string,
    mod_key?: number,
    act_type?: number;
}

@BaseView.registView
export class ActivityCombatView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "ActivityCombat",
        ViewName: "ActivityCombatView",
        LayerType: ViewLayer.ButtomMain,
    };

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,
        liuhaiscreen: <fgui.GComponent>null,

        // Board: <CommonBoard4>null,
        BtnMainChapter: <fgui.GButton>null,
        ExpShow: <ExpShow>null,
        Currency1: <CurrencyShow>null,
        Currency2: <CurrencyShow>null,
        Currency3: <CurrencyShow>null,
        List: <fgui.GList>null,
        ArenaItem: <ActCombatArenaItem>null,
        // bg: <EGLoader>null,
    };

    protected extendsCfg = [
        { ResName: "PosterCell", ExtendsClass: PosterCell },
        { ResName: "ArenaItem", ExtendsClass: ActCombatArenaItem }
    ];

    private tabList: IListTabData[] = [
        { type: 0, tabTitle: Language.ActivityCombat.Title1, Icon: "Big40000", bg: "JinBiGuan", mod_key: Mod.ActivityCombat.Gold },//金币
        // { type: 1, tabTitle: Language.ActivityCombat.Title2, Icon: "GengDuoYingXiongKa", bg: "SuiPianGuan", mod_key: Mod.ActivityCombat.Debris },//碎片
        //{ type: 5, tabTitle: Language.ActivityCombat.Title6, Icon: "MeiRiTaoZhan", bg: "ShouWeiHouYuan", mod_key: Mod.ActivityCombat.Defense, act_type: ACTIVITY_TYPE.DefenseHome},//守卫后院
        { type: 3, tabTitle: Language.ActivityCombat.Title4, Icon: "JiangShiTuBiao", bg: "JiangShiChongChongChong", mod_key: Mod.ActivityCombat.Zombie, act_type: ACTIVITY_TYPE.ZombieGoGoGo },// 僵尸冲冲冲
        // { type: 2, tabTitle: Language.ActivityCombat.Title3, Icon: "ZhouChangJiFen", bg: "ShiLuoShenDian", mod_key: Mod.LoseTemple.View, act_type: ACTIVITY_TYPE.LoseTemple },//失落神殿
        // { type: 4, tabTitle: Language.ActivityCombat.Title5, Icon: "MeiRiTaoZhan", bg: "MeiRiTaoZhan", mod_key: Mod.ActivityCombat.EverydayFB, act_type: ACTIVITY_TYPE.EverydayChallenge },//每日挑战
    ]

    InitData() {

        this.AddSmartDataCare(ActivityCombatData.Inst().FlushData, this.FlushData.bind(this), "FlushInfo", "FlushZombieInfo");
        this.AddSmartDataCare(MainFBData.Inst().FlushData, this.FlushData.bind(this), "FlushDailyChallengeInfo");
        this.AddSmartDataCare(RoleData.Inst().FlushData, this.FlushData.bind(this), "FlushRoleInfo");
        this.AddSmartDataCare(ActivityData.Inst().ResuleData, this.FlushData.bind(this), "is_activity_status_change");
        EventCtrl.Inst().on(CommonEvent.TIME_ZERO, this.FlushData, this);

        this.viewNode.Currency1.SetCurrency(CommonId.Gold);
        this.viewNode.Currency2.SetCurrency(CommonId.Energy);
        this.viewNode.Currency3.SetCurrency(CommonId.Diamond);
        this.viewNode.Currency2.BtnAddShow(true);

        this.viewNode.BtnMainChapter.onClick(this.closeView, this);

        this.viewNode.List.setVirtual();

        this.FlushData();
        ActivityCombatData.Inst().ClearFirstRemind();
    }

    FlushData() {
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.List.numItems = this.tabList.length;
        // this.viewNode.ArenaItem.FlushInfo();
        // FIX:lip 屏蔽
        this.viewNode.ArenaItem.visible = false;
    }

    private itemRenderer(index: number, item: PosterCell) {
        item.SetData(this.tabList[index]);
    }

    InitUI() {
    }

    DoOpenWaitHandle() {
        this.ReSetWindowSize();
        this.view.setSize(this["screenShowSize"].x, this["screenShowSize"].y);
        this.view.center();
        // let waitHandle = this.createWaitHandle("loadBG")
        // this.AddWaitHandle(waitHandle);
        // this.viewNode.Board.FlushShow(() => {
        //     waitHandle.complete = true;
        // }, false)
    }

    Close() {
        super.Close();
        for (let i = 0; i < this.viewNode.List.numChildren; i++) {
            const cell = this.viewNode.List.getChildAt(i) as PosterCell;
            cell.onClose();
        }
    }

}

export class PosterCell extends BaseItem {
    protected viewNode = {
        BtnOpen: <fgui.GButton>null,
        BgIcon: <fgui.GLoader>null,
        Icon: <fgui.GLoader>null,
        Name: <fgui.GTextField>null,
        Desc: <fgui.GTextField>null,
        OpenTime: <fgui.GTextField>null,
        List: <fgui.GList>null,
        NotOpen: <fgui.GGroup>null,
        TimeShow: <fgui.GTextField>null,
        // timer: <TimeMeter>null,
        timer: <TimeMeter>null,
        redPoint: <RedPoint>null,
    };
    cache_timer: number
    private stateCtrler: fgui.Controller

    protected onDestroy(): void {
        super.onDestroy();
        if (this.handleCollector) {
            HandleCollector.Destory(this.handleCollector);
            this.handleCollector = null;
        }
        this.viewNode.timer.CloseCountDownTime()
        this.viewNode.timer.SetCallBack(null, null);
    }

    onClose() {
        this.viewNode.timer.CloseCountDownTime()
        this.viewNode.timer.SetCallBack(null, null);
    }

    private renderListItem(index: number, item: ItemCell) {
        item.SetData(Item.Create(this.reward[index].item, { is_num: true }));
    }
    private handleCollector: HandleCollector;
    private reward: any[];
    public SetData(data: IListTabData) {
        this.data = data as IListTabData;
        if (this.handleCollector) {
            this.handleCollector.RemoveAll()
        } else {
            this.handleCollector = HandleCollector.Create();
        }

        this.stateCtrler = this.getController("LockState");

        this.viewNode.BtnOpen.onClick(this.onClickOpenView, this);
        UH.SetText(this.viewNode.Name, data.tabTitle);
        UH.SetIcon(this.viewNode.BgIcon, data.bg, ICON_TYPE.ACTIVITYCOMBAT);
        UH.SpriteName(this.viewNode.Icon, "ActivityCombat", data.Icon);
        this.viewNode.List.setVirtual();
        this.viewNode.timer.visible = false;
        this.viewNode.timer.CloseCountDownTime()
        this.viewNode.timer.SetCallBack(this.FlushData.bind(this), this.FlushUpdateTime.bind(this));

        if (data.mod_key) {
            this.addRemindCare(data.mod_key, this.viewNode.redPoint)
        }
        this.FlushData();
        this.initUi();
    }

    initUi() {
        this.viewNode.OpenTime.visible = true
        if (this.data.type == 2) {
            UH.SetText(this.viewNode.OpenTime, Language.ActivityCombat.templeDescribe);
        } else if (this.data.type == 1 || this.data.type == 0) {
            UH.SetText(this.viewNode.OpenTime, ActivityCombatData.Inst().GetOpenTimeStr(this.data.type));
        } else if (this.data.type == 3) {
            let num = ActivityCombatData.Inst().getZombieFightNum();
            UH.SetText(this.viewNode.OpenTime, Language.ActivityCombat.surplusNum1 + num);
        } else if (this.data.type == 5) {
            let num = DefenseHomeData.Inst().remainCount;
            UH.SetText(this.viewNode.OpenTime, Language.ActivityCombat.surplusNum1 + num);
        }
        else {
            this.viewNode.OpenTime.visible = false
        }
    }

    private FlushData() {
        if (this.data.type == 1 || this.data.type == 0) {
            this.DailyFBShow();
        } else {
            this.ActivityFBShow()
        }
    }

    ActivityFBShow() {

        let isLock = true //ActivityData.Inst().IsOpen(this.data.act_type);
        let time = ActivityData.Inst().GetEndStampTime(this.data.act_type)
        let isOpen = FunOpen.Inst().GetFunIsOpen(this.data.mod_key);
        let ModCfg = FunOpen.Inst().GetFunOpenModCfg(this.data.mod_key);
        if (!isOpen.is_open) {
            UH.SetText(this.viewNode.Desc, TextHelper.Format(Language.FunOpen.FbLevelTip, ModCfg.open_barrier));
            this.stateCtrler.selectedIndex = 0;
        } else if (!isLock) {
            let StartCfg = ActivityData.Inst().GetStartTimeCfg(this.data.act_type);
            UH.SetText(this.viewNode.Desc, StartCfg ? StartCfg.begin_day : "");
            this.stateCtrler.selectedIndex = 2;
        }
        let isShow = !isLock || !isOpen.is_open
        this.viewNode.NotOpen.visible = isShow;
        this.viewNode.BtnOpen.touchable = !isShow;
        this.viewNode.timer.visible = !isShow;
        this.viewNode.TimeShow.visible = !isShow
        this.viewNode.List.visible = false
        if (isLock && isOpen.is_open) {
            this.cache_timer = time - TimeCtrl.Inst().ServerTime;
            this.FlushTime();
        }
    }

    DailyFBShow() {
        let isLock = ActivityCombatData.Inst().GetOpenShow(this.data.type);
        let info = ActivityCombatData.Inst().GetActivityLevelInfo(this.data.type)
        let isOpen = FunOpen.Inst().GetFunIsOpen(this.data.mod_key);
        let ModCfg = FunOpen.Inst().GetFunOpenModCfg(this.data.mod_key);
        if (!isOpen.is_open) {
            UH.SetText(this.viewNode.Desc, TextHelper.Format(Language.FunOpen.FbLevelTip, ModCfg.open_barrier));
            this.stateCtrler.selectedIndex = 0;
        } else {
            this.stateCtrler.selectedIndex = 1;
        }
        let isShow = isLock || !isOpen.is_open
        this.reward = ActivityCombatData.Inst().GetlevelReward(this.data.type, info.fbLevel, this.data.type == 0)
        this.viewNode.List.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.List.numItems = this.reward.length;
        this.viewNode.List.visible = true
        this.viewNode.NotOpen.visible = isShow;
        this.viewNode.BtnOpen.touchable = !isShow;
        this.viewNode.timer.visible = !isShow;
        this.cache_timer = TimeCtrl.Inst().tomorrowStarTime - TimeCtrl.Inst().ServerTime;
        this.viewNode.TimeShow.visible = !isShow
        this.FlushTime();

    }

    private FlushUpdateTime(realtime: number, total_time: number) {
        let time = Math.max(total_time - realtime, 0);
        let time_t = TimeHelper.FormatDHMS(time);
        let t_str
        if (time_t.day >= 1) {
            let hour = time_t.hour ? time_t.hour : 1;
            t_str = TextHelper.Format(Language.UiTimeMeter.TimeStr5, time_t.day, hour);
        } else {
            t_str = TextHelper.Format(Language.UiTimeMeter.TimeStr1, time_t.hour, time_t.minute, time_t.second)
        }
        UH.SetText(this.viewNode.TimeShow, Language.UiTimeMeter.TimeLimit2 + t_str)
    }

    private FlushTime() {
        let time = this.cache_timer;
        this.viewNode.timer.CloseCountDownTime()
        this.viewNode.timer.visible = time > 0;
        if (time > 0) {
            this.viewNode.timer.SetOutline(true, COLORS.Brown, 3)
            this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_7);
        }
    }

    private addRemindCare(mod_key: number, obj: RedPoint) {
        let self = this;
        let group = ModManger.TabMod(mod_key);
        this.handleCollector.Add(RemindGroupMonitor.Create(group, self.freshRedPoint.bind(self, group, obj)));
    }

    private freshRedPoint(group: any, obj: RedPoint) {
        obj.SetNum(RemindCtrl.Inst().GetGroupNum(group));
    }

    public onClickOpenView() {
        if (this.data.type == 2) {
            LoseTempleData.Inst().openView()
        } else if (this.data.type == 3) {
            ViewManager.Inst().OpenView(ZombieView)
        } else if (this.data.type == 4) {
            ViewManager.Inst().OpenView(EverydayChallengeView)
        } else if (this.data.type == 5) {
            ViewManager.Inst().OpenView(DefenseHomeView)
        }
        else {
            ViewManager.Inst().OpenView(ActivityCombatDifficultyView, this.data)
        }
    }
}

export class ActCombatArenaItem extends fgui.GComponent {
    protected viewNode = {
        RankIcon: <fgui.GLoader>null,
        LockDesc: <fgui.GTextField>null,
        RankName: <fgui.GTextField>null,
        timer: <TimeMeter>null,
        UnlockTimer: <TimeMeter>null,
    };

    protected onConstruct(): void {
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
        this.onClick(() => {
            let stateIndex = this.getController("open_state").selectedIndex;
            if (stateIndex == 0) {
                ViewManager.Inst().OpenView(ArenaMainView);
            } else if (stateIndex == 1) {
                PublicPopupCtrl.Inst().Center(this.viewNode.LockDesc.text);
            } else {
                PublicPopupCtrl.Inst().Center(Language.FunOpen.ActivityTip);
            }
        })
        this.viewNode.timer.SetOutline(true, COLORS.Brown, 3)
        this.viewNode.UnlockTimer.SetOutline(true, COLORS.Brown, 3)

        this.viewNode.timer.SetCallBack(() => {
            this.FlushInfo();
        });
        this.FlushInfo();
    }

    FlushInfo() {
        this.viewNode.timer.CloseCountDownTime();
        this.viewNode.UnlockTimer.CloseCountDownTime();
        let isOpen = ActivityData.Inst().IsOpen(ACTIVITY_TYPE.Arena)
        let isUnlock = FunOpen.Inst().GetFunIsOpen(Mod.Arena.View).is_open;

        if (isOpen) {
            let timeCfg = ArenaData.Inst().GetCurTimeCfg();
            this.viewNode.timer.StampTime(timeCfg.time_stamp, TimeFormatType.TYPE_TIME_7);
        } else {
            let actOpenCfg = ActivityData.Inst().GetStartTimeCfg(ACTIVITY_TYPE.Arena);
            if (actOpenCfg) {
                let timestrs = actOpenCfg.begin_day.split("_");
                let timestamp = TimeCtrl.Inst().ConvertTimestamp(Number(timestrs[0]), Number(timestrs[1]), Number(timestrs[2]));
                this.viewNode.UnlockTimer.StampTime(timestamp, TimeFormatType.TYPE_TIME_7);
            } else {
                UH.SetText(this.viewNode.UnlockTimer, "");
            }
        }

        if (isUnlock) {
            let rankCfg = ArenaData.Inst().GetCurRankCfg();
            UH.SetIcon(this.viewNode.RankIcon, rankCfg.rank_icon, ICON_TYPE.ARENA_RANK_SAMLL);
            UH.SetText(this.viewNode.RankName, rankCfg.rank_describe);
        } else {
            let cfg = FunOpen.Inst().GetFunOpenModCfg(Mod.Arena.View);
            UH.SetText(this.viewNode.LockDesc, Format(Language.ActivityCombat.ArenaLock, cfg.open_barrier));
        }

        if (isOpen) {
            if (isUnlock) {
                this.getController("open_state").setSelectedIndex(0);
            } else {
                this.getController("open_state").setSelectedIndex(1);
            }
        } else {
            if (isUnlock) {
                this.getController("open_state").setSelectedIndex(2);
            } else {
                this.getController("open_state").setSelectedIndex(3);
            }
        }
    }
}