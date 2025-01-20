import { Node } from "cc";
import { GetCfgValue } from 'config/CfgCommon';
import { LogError } from "core/Debugger";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { FirstChargeData } from "modules/FirstCharge/FirstChargeData";
import { FunOpen } from 'modules/FunUnlock/FunOpen';
import { GeneOrientationData } from 'modules/GeneOrientation/GeneOrientationData';
import { GeneOrientationView } from 'modules/GeneOrientation/GeneOrientationView';
import { MainPlayerInfoView } from 'modules/MainLevelInfo/MainPlayerInfoView';
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { Item, ItemData } from "modules/bag/ItemData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { AdType, ICON_TYPE, ROLE_SETTING_TYPE } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { ItemCell } from "modules/extends/ItemCell";
import { HeroData } from "modules/hero/HeroData";
import { RewardGetViewShowItem } from "modules/reward_get/RewardGetView";
import { RoleData } from "modules/role/RoleData";
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { UISpineShow } from 'modules/scene_obj_spine/UISpineShow';
import { TimeCtrl } from "modules/time/TimeCtrl";
import { Timer } from "modules/time/Timer";
import { GAME_PLANT, PackageData } from "preload/PkgData";
import { ResPath } from 'utils/ResPath';
import { DataHelper } from "../../helpers/DataHelper";
import { UH } from "../../helpers/UIHelper";
import { ChannelAgent } from "../../proload/ChannelAgent";
import { BattleModel, SceneType } from './BattleConfig';
import { BattleCtrl } from "./BattleCtrl";
import { BattleData } from "./BattleData";
import { BattleSaveSkillView } from "./View/BattleSaveSkillView";
import { AddDesktopView } from "modules/role/AddDesktopView";
import { ConstValue } from "modules/common/ConstValue";

@BaseView.registView
export class BattleFinishView extends BaseView {

    private result: fgui.Controller;

    protected viewRegcfg = {
        UIPackName: "BattleFinish",
        ViewName: "BattleFinishView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlock,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
        NotHideAnim: true,
    };

    protected viewNode = {
        RoundNum: <fgui.GTextField>null,
        MaxScoreFlag: <fgui.GGroup>null,
        ContinueBtn: <fgui.GButton>null,
        SumScore: <fgui.GTextField>null,
        List: <fgui.GList>null,
        RewardList: <fgui.GList>null,
        WinTopEffect: <UIEffectShow>null,
        WinEffect: <UIEffectShow>null,
        WinBox: <fgui.GGroup>null,
        WinBoxGet: <fgui.GButton>null,
        HintIcon: <fgui.GLoader>null,
        HintTitle: <fgui.GTextField>null,
        GongLueBtn: <fgui.GButton>null,
        ContinueBtnDouYin: <fgui.GButton>null,

        PassTime: <fgui.GTextField>null,
        KillCount: <fgui.GTextField>null,
        Flag: <fgui.GLoader>null,
        MvpInfo: <BattleAttackInfoItem>null,

        gp_tip: <fgui.GGroup>null,
    };

    protected extendsCfg = [
        { ResName: "AttackInfo", ExtendsClass: BattleAttackInfoItem },
        { ResName: "ItemShow", ExtendsClass: FinishGetShowItem },
    ];
    rewardList: IPB_SCBattleReward[];

    InitData() {
        let info = BattleData.Inst().GetFinishInfo();
        this.result = this.view.getController("result");
        this.result.selectedIndex = info.battleResult == 1 ? 0 : 1;
        this.view.getController("model").selectedIndex = BattleCtrl.Inst().battleModel == BattleModel.Arena ? 1 : 0;
        this.view.getController("pingtai").selectedIndex = GAME_PLANT.DOUYIN ? 1 : 0;
        this.viewNode.ContinueBtn.onClick(this.OnContinueClick.bind(this));
        this.viewNode.ContinueBtnDouYin.onClick(this.OnContinueClick.bind(this));
        if (info.battleResult == 1) {
            this.view.getTransition("win").play();
            this.viewNode.WinTopEffect.PlayEff("1208019");
            this.viewNode.WinEffect.PlayEff("1208018");
        } else {
            this.view.getTransition("fail").play();
        }

        if (info.battleResult == 1) {
            AudioManager.Inst().PlayUIAudio(AudioTag.ZhanDouShengLi);
        } else {
            AudioManager.Inst().PlayUIAudio(AudioTag.ZhanDouShiBai);
        }
        this.AddSmartDataCare(RoleData.Inst().FlushData, this.FlushWinBoxShow.bind(this), "FlushAdInfo");
        this.FlushWinBoxShow();
        this.viewNode.WinBoxGet.onClick(this.onClickGetWinBox.bind(this));
        this.viewNode.GongLueBtn.onClick(this.OnGongLueClick, this);
        this.viewNode.GongLueBtn.visible = false;// SceneType.Main == info.battleMode
        let spineShow = <UISpineShow>this.viewNode.GongLueBtn.getChild("SpineShow").asCom;
        spineShow.LoadSpine(ResPath.Spine("zhujiemianshu/zhujiemianshu"), true, (obj: Node) => {
            obj.setScale(0.85, 0.85);
        });
    }

    OpenCallBack() {
        this.FlushPanel();
        this.EffectShow();
        ChannelAgent.FPS = PackageData.Inst().g_UserInfo.gameFPS.main;
    }

    CloseCallBack() {
        if (GAME_PLANT.DOUYIN) {
            if (1 == RoleData.Inst().GetRoleSystemSetInfo(ROLE_SETTING_TYPE.SettingGuideStart + 1) && !RoleData.Inst().ZhuoMianRewardIsFetch) {
                ViewManager.Inst().OpenView(AddDesktopView)
            }
        }
    }

    FlushWinBoxShow() {
        if (!RoleData.Inst().IsCanAD(AdType.win_box)) {
            this.viewNode.WinBox.visible = false;
            return;
        }

        let showBox = false;
        if (BattleData.Inst().GetFinishInfo().battleResult == 1) {
            let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.win_box)
            if (info && info.nextFetchTime <= TimeCtrl.Inst().ServerTime) {
                showBox = true;
            }
        }
        this.viewNode.WinBox.visible = false;//showBox;
    }

    onClickGetWinBox() {
        ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.win_box), "");
    }

    FlushPanel() {
        let finishInfo = BattleData.Inst().GetFinishInfo();
        let sumScore = BattleData.Inst().GetRecordAttackValueSum();
        UH.SetText(this.viewNode.SumScore, DataHelper.ConverNum(sumScore))

        if (BattleCtrl.Inst().battleModel == BattleModel.Arena) {
            UH.SetText(this.viewNode.PassTime, Math.floor(BattleCtrl.Inst().battleSceneArena_A.passTime));
            UH.SetText(this.viewNode.KillCount, BattleData.Inst().battleInfo.killCount);
            let mvpInfo = this.GetMvpInfo();
            this.viewNode.MvpInfo.visible = mvpInfo != null;
            if (mvpInfo) {
                this.viewNode.MvpInfo.SetData(mvpInfo);
            }

            let flag = finishInfo.battleResult == 1 ? "MVP" : "SVP";
            UH.SpriteName(this.viewNode.Flag, "BattleFinish", flag);
        } else {
            let listData = this.GetInfoList();
            this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
            this.viewNode.List.numItems = listData.length;
            UH.SetText(this.viewNode.RoundNum, finishInfo.battleRound);
            let scene_id = finishInfo.battleParam[0]
            let is_new_record = BattleData.Inst().IsNewRecord(finishInfo.battleMode, scene_id, finishInfo.battleRound);
            this.viewNode.MaxScoreFlag.visible = is_new_record;
        }


        let rewardList = finishInfo.rewardList.filter(v => {
            let item_data = Item.GetConfig(v.itemId);
            if (item_data.item_type == 3) {
                return ConstValue.LegalHeroArr.includes(item_data.id);
            }

            if (item_data.id === 40003) {
                return false;
            }

            return true;
        });
        if (rewardList != null && rewardList.length > 0) {
            this.viewNode.RewardList.visible = true;
            this.rewardList = rewardList;
            this.viewNode.RewardList.itemRenderer = this.itemRenderer2.bind(this)
            this.viewNode.RewardList.numItems = rewardList.length;
            this.showList = rewardList;
        } else {
            this.viewNode.RewardList.visible = false;
        }
        this.viewNode.gp_tip.visible = false;
        if (!FunOpen.Inst().checkAudit(2)) {
            // this.viewNode.gp_tip.visible = false;
        } else {
            let type = 1;
            let isActive = FirstChargeData.Inst().GetInfoActive();
            if (isActive) {
                type = Math.floor(Math.random() * (4 - 2)) + 2;
            }
            UH.SetText(this.viewNode.HintTitle, GetCfgValue(Language.Battle, "HintTitle" + type));
            UH.SpriteName(this.viewNode.HintIcon, "BattleFinish", "HintIcon" + type);
        }
    }

    private itemRenderer(index: number, item: BattleAttackInfoItem) {
        item.SetData(this.GetInfoList()[index]);
    }

    private itemRenderer2(index: number, item: FinishGetShowItem) {
        item.SetData(this.rewardList[index]);
    }

    GetInfoList(): IBattleAttackInfoItemData[] {
        let sumScore = BattleData.Inst().GetRecordAttackValueSum();
        let list: IBattleAttackInfoItemData[] = [];
        if (BattleData.Inst().in_battle_heros == null || BattleData.Inst().in_battle_heros.length == 0) {
            LogError("战斗结算界面异常 in_battle_heros == null")
            return [];
        }
        BattleData.Inst().in_battle_heros.forEach((id) => {
            if (id != 0) {
                let value = BattleData.Inst().GetRecordAttackValue(id);
                list.push(<IBattleAttackInfoItemData>{
                    heroId: id,
                    value: value,
                    sumValue: sumScore,
                })
            }
        })

        list.sort((a, b) => {
            return b.value - a.value;
        })

        let newList = [];
        for (let i = 0; i < 4 && i < list.length; i++) {
            newList.push(list[i]);
        }
        return newList;
    }

    GetMvpInfo(): IBattleAttackInfoItemData {
        let battleInfo = BattleData.Inst().battleInfo;
        if (battleInfo.attackValueRecord.size == 0) {
            return null;
        }
        let sumScore = BattleData.Inst().GetRecordAttackValueSum();
        let maxValue: number = 0;
        let heroId = 0;
        battleInfo.attackValueRecord.forEach((value, id) => {
            if (value > maxValue) {
                maxValue = value;
                heroId = id;
            }
        })

        if (heroId == 0) {
            return;
        }

        let info = <IBattleAttackInfoItemData>{
            heroId: heroId,
            value: maxValue,
            sumValue: sumScore,
        }

        return info;
    }

    private TwShow: fgui.GTweener = null;
    private timer_show: any = null;
    private showList: any[];
    EffectShow() {
        if (this.showList == null || this.showList.length == 0) {
            return;
        }
        this.viewNode.ContinueBtn.visible = true
        let show: Function = () => {
            this.TwShow = fgui.GTween.delayedCall(0.15).onComplete((tweener: fgui.GTweener) => {
                let item = <RewardGetViewShowItem>this.viewNode.RewardList.getChildAt(cur_index)
                if (item) {
                    item.EffShow()
                }
                // if (cur_index % 5 == 4 && cur_index > 0) {
                //     if (cur_index > 4) {
                //         this.viewNode.RewardList.scrollPane.scrollDown(130 / 25)
                //     } else {
                //         this.viewNode.RewardList.scrollPane.scrollDown(2)
                //     }
                // }
                cur_index++;
                if (cur_index < this.showList.length) {
                    show();
                } else {
                    //等动效播完在显示
                    Timer.Inst().CancelTimer(this.timer_show)
                    this.timer_show = Timer.Inst().AddRunTimer(() => {
                        this.viewNode.ContinueBtn.visible = true
                    }, 0.4, 1, false)

                }
            })
        }
        let cur_index: number = 0
        show()
    }

    OnContinueClick() {

        if (BattleData.Inst().battleInfo.isSaveSkill) {
            let listData = BattleData.Inst().GetShowSkillListData(true);
            if (listData.length >= 5) {
                ViewManager.Inst().OpenView(BattleSaveSkillView, listData);
                return
            }
        }
        BattleCtrl.Inst().ExitBattle();
        ViewManager.Inst().CloseView(BattleFinishView);
        // if (GeneOrientationData.Inst().getNewGiftHeroId() > 0 && GeneOrientationData.Inst().GetIsShowView()) {
        //     ViewManager.Inst().OpenView(GeneOrientationView);
        //     GeneOrientationData.Inst().setShowView(GeneOrientationData.Inst().getNewGiftHeroId());
        // }
    }

    OnGongLueClick() {
        ViewManager.Inst().OpenView(MainPlayerInfoView);
    }
}

export interface IBattleAttackInfoItemData {
    heroId: number;
    value: number;
    sumValue: number;
}

export class BattleAttackInfoItem extends BaseItem {
    protected viewNode = {
        Progress: <fgui.GProgressBar>null,
        RoleIcon: <fgui.GLoader>null,
        ValueText: <fgui.GTextField>null,
    };

    SetData(data: IBattleAttackInfoItemData) {
        this._data = data;
        let heroLevel = BattleData.Inst().GetHeroLevel(data.heroId);
        let heroCfg = HeroData.Inst().GetHeroLevelCfg(data.heroId, heroLevel);
        UH.SetText(this.viewNode.ValueText, DataHelper.ConverNum(data.value));
        UH.SetIcon(this.viewNode.RoleIcon, heroCfg.res_id, ICON_TYPE.ROLE);
        this.viewNode.Progress.min = 0;
        this.viewNode.Progress.max = data.sumValue;
        this.viewNode.Progress.value = data.value;
    }
}



export class FinishGetShowItem extends BaseItem {
    TwShow: fgui.GTweener = null;

    protected viewNode = {
        GpShow: <fgui.GGroup>null,
        CellShow: <ItemCell>null,
    };

    SetData(data: any) {
        let item = Item.Create(data, { is_num: true, is_click: false })
        this.viewNode.CellShow.SetData(item)
    }

    EffShow() {
        let show: Function = () => {
            this.TwShow = fgui.GTween.to(0.8, 1.1, 0.12)
                .setEase(fgui.EaseType.QuartOut)
                .onUpdate((tweener: fgui.GTweener) => {
                    if (this.node) {
                        this.scaleX = tweener.value.x
                        this.scaleY = tweener.value.x
                    }
                }).onComplete(() => {
                    this.TwShow = fgui.GTween.to(1.1, 1, 0.12)
                        .setEase(fgui.EaseType.QuartOut)
                        .onUpdate((tweener: fgui.GTweener) => {
                            if (this.node) {
                                this.scaleX = tweener.value.x
                                this.scaleY = tweener.value.x
                            }
                        })
                        .onComplete(() => {
                            this.TwShow = null;
                        })
                })
        }
        this.viewNode.GpShow.visible = true
        show();
    }

    protected onDestroy() {
        super.onDestroy()
        if (this.TwShow) {
            this.TwShow.kill();
            this.TwShow = null
        }
    }
}