import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { ActivityData } from "modules/activity/ActivityData";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { UH } from "../../helpers/UIHelper";
import { GetCfgValue } from "config/CfgCommon";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { BattleObjTag, SceneType } from 'modules/Battle/BattleConfig';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { RankView } from 'modules/rank/RankView';
import { ActivityCombatData } from "./ActivityCombatData";
import { ActivityCombatCtrl } from "./ActivityCombatCtrl";
import { ZombieRushPassView } from "modules/ZombieRushPass/ZombieRushPassView";
import { MainTaskRewardView } from "modules/main/MainTaskRewardView";
import { COLORS } from "modules/common/ColorEnum";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";
import { RemindGroupMonitor } from "data/HandleCollectorCfg";
import { Mod } from "modules/common/ModuleDefine";
import { RemindCtrl } from "modules/remind/RemindCtrl";
import { RedPoint } from "modules/extends/RedPoint";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { GMCmdCtrl } from "modules/gm_command/GMCmdCtrl";
import { RewardGetView } from "modules/reward_get/RewardGetView";
import { DBD_QUERY_PARAMS, DBDNet } from "../../DBDataManager/DBDNet";
import { RoleData } from "modules/role/RoleData";
import { BattleData } from "modules/Battle/BattleData";
import { EventCtrl } from "modules/common/EventCtrl";
import { CommonEvent } from "modules/common/CommonEvent";
import { TimeHelper } from "../../helpers/TimeHelper";
import { ShopData } from "modules/shop/ShopData";

@BaseView.registView
export class ZombieView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "Zombie",
        ViewName: "ZombieView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode: { [key: string]: any } = {
        Board: <CommonBoard3>null,
        ProgressBar1: <fgui.GProgressBar>null,
        ProgressBar2: <fgui.GProgressBar>null,
        ProgressBar3: <fgui.GProgressBar>null,
        AttrIcon: <fgui.GLoader>null,
        AttrName: <fgui.GTextField>null,
        Time: <fgui.GTextField>null,
        Num: <fgui.GTextField>null,
        timer: <TimeMeter>null,
        BtnStart: <fgui.GButton>null,
        ButtonRank: <fgui.GButton>null,
        ButtonMod: <fgui.GButton>null,
        ButtonBox1: <ZombieBox>null,
        ButtonBox2: <ZombieBox>null,
        ButtonBox3: <ZombieBox>null,
        UISpineShow: <UISpineShow>null,
        redPoint: <RedPoint>null,
    };

    protected extendsCfg = [
        { ResName: "ButtonBox", ExtendsClass: ZombieBox }
    ];

    InitData() {
        this.viewNode.Board.SetData(new BoardData(ZombieView));
        this.AddSmartDataCare(ActivityCombatData.Inst().FlushData, this.FlushData.bind(this), "FlushZombieInfo");
        EventCtrl.Inst().on(CommonEvent.REFRESH_REWARD_GET, this.FlushData.bind(this));
        this.handleCollector.Add(RemindGroupMonitor.Create(Mod.ZombieRushPass, this.freshMailRedRedPoint.bind(this), true));

        this.viewNode.UISpineShow.LoadSpine(ResPath.Spine("jiangshichongchongchong/jiangshichongchongchong"), true);

        this.viewNode.ButtonRank.onClick(this.OnClickRank, this);
        this.viewNode.ButtonMod.visible = false//FunOpen.Inst().checkAudit(1)
        this.viewNode.ButtonMod.onClick(this.OnClickMod, this);
        this.viewNode.BtnStart.onClick(this.OnClickStart, this);

        this.FlushData();
        this.FlushTime();
    }

    freshMailRedRedPoint() {
        let num = RemindCtrl.Inst().GetRemindNum(Mod.ZombieRushPass.View)
        this.viewNode.redPoint.SetNum(num);
    }

    FlushData() {
        let fightNum = ActivityCombatData.Inst().getZombieFightNum();
        let BoxCfg = ActivityCombatData.Inst().GetZombieBoxCfg();
        let killNum = ActivityCombatData.Inst().ZombieInfo.killNum;
        for (let i = 0; i < 3; i++) {
            this.viewNode["ButtonBox" + (i + 1)].FlushShow(BoxCfg[i], killNum, i);
            this.viewNode["ProgressBar" + (i + 1)].min = BoxCfg[i - 1] ? BoxCfg[i].kill_num : 0;
            this.viewNode["ProgressBar" + (i + 1)].max = BoxCfg[i].kill_num;
            this.viewNode["ProgressBar" + (i + 1)].value = killNum;
        }

        UH.SetText(this.viewNode.Num, killNum);
        UH.SetText(this.viewNode.Time, Language.ActivityCombat.surplusNum1 + fightNum);
    }

    private FlushTime() {
        let time = ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.ZombieGoGoGo) - TimeCtrl.Inst().ServerTime;
        this.viewNode.timer.visible = time > 0
        this.viewNode.timer.CloseCountDownTime()
        if (time > 0) {
            this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_7);
        }
    }

    InitUI() {
        let race = ActivityCombatData.Inst().ZombieInfo.dailyWeakness;
        UH.SpriteName(this.viewNode.AttrIcon, "CommonAtlas", "HeroAttr" + race);
        UH.SetText(this.viewNode.AttrName, GetCfgValue(Language.Hero.Race, race));
        this.viewNode.AttrName.color = GetCfgValue(COLORS, `HeroRace${race}`)
    }

    OnClickStart() {
        let num = ActivityCombatData.Inst().getZombieFightNum();
        if (num <= 0) {
            PublicPopupCtrl.Inst().Center(Language.ActivityCombat.countNotHasTip);
            return
        }
        BattleCtrl.Inst().EnterBattle(1, SceneType.RunRunRun)
    }

    OnClickRank() {
        ViewManager.Inst().OpenView(RankView, { type: 1 })
        // ViewManager.Inst().CloseView(ZombieView)
    }

    OnClickMod() {
        ViewManager.Inst().OpenView(ZombieRushPassView)
        // ViewManager.Inst().CloseView(ZombieView)
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }
}


class ZombieBox extends BaseItemGB {
    protected viewNode = {
        icon: <fgui.GLoader>null,
        redPoint: <RedPoint>null,
        UISpineShow: <UISpineShow>null,
    };
    protected onConstruct() {
        this.onClick(this.getPrize, this);
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }
    type: number
    public FlushShow(data: any, num: number, type: number) {
        this.type = type;
        this.data = data
        this.title = data.kill_num
        let killNum = ActivityCombatData.Inst().ZombieInfo.killNum;
        let isFetch = ActivityCombatData.Inst().InfoZombieIsFetch[type];
        if (killNum >= data.kill_num && !isFetch) {
            this.viewNode.UISpineShow.LoadSpine(ResPath.Spine("lihe/lihe"), true);
            this.viewNode.redPoint.SetNum(1);
            this.viewNode.icon.visible = false;
        } else {
            this.viewNode.UISpineShow.onDestroy();
            this.viewNode.icon.visible = true;
            this.icon = fgui.UIPackage.getItemURL("Zombie", isFetch ? "BaoXiangKai" : "BaoXiang");
            this.viewNode.redPoint.SetNum(0);
        }

    }
    public getPrize() {
        let isFetch = ActivityCombatData.Inst().InfoZombieIsFetch[this.type]
        let killNum = ActivityCombatData.Inst().ZombieInfo.killNum;
        if (killNum >= this.data.kill_num && !isFetch) {
            // ActivityCombatCtrl.Inst().SendMission(this.data.seq)
            let send = this.data.win[0].item_id + " " + this.data.win[0].num;
            GMCmdCtrl.Inst().SendGMCommand("additem", send);
            ViewManager.Inst().OpenView(RewardGetView, { reward_data: [{ itemId: this.data.win[0].item_id, num: this.data.win[0].num }], call_back: null });
            DBDNet.Inst().getSignature({ uid: RoleData.Inst().InfoRoleInfo.roleId }, (data: DBD_QUERY_PARAMS) => {
                if (data && data["zombie_info"]) {
                    data["zombie_info"].killRewardIsFetch[this.type] = 1;
                    const curTime = Date.now();
                    let shop_box_info = { time: curTime, openBoxTimes: ShopData.Inst().boxOpenTimes };

                    // 是否需要刷新挑战次数
                    if (!TimeHelper.isSameDay(data.zombie_info.time, curTime)) {
                        data.zombie_info.time = curTime;
                        data.zombie_info.killRewardIsFetch = [0, 0, 0];
                    }
                    data["zombie_info"].time = curTime;
                    DBDNet.Inst().setSignature({ uid: RoleData.Inst().InfoRoleInfo.roleId, zombie_info: data["zombie_info"], shop_box_info: shop_box_info, payMoneyInfo: ShopData.Inst().payMoneyInfo }, () => {
                        ActivityCombatData.Inst().onZombieInfoDBD(data["zombie_info"]);
                    });
                    ActivityCombatData.Inst().onZombieInfoDBD(data["zombie_info"]);

                    // 发送事件更新界面 
                    EventCtrl.Inst().emit(CommonEvent.REFRESH_REWARD_GET);
                }
            });

        } else {
            ViewManager.Inst().OpenView(MainTaskRewardView, { x: this.node.worldPosition.x - 40, y: 1600 - this.node.worldPosition.y - 150, rewards: this.data.win });
        }
    }


}