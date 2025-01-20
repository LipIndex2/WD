import { Asset, assetManager, AssetManager, instantiate, Prefab, sp, SpriteFrame, Vec2 } from "cc";
import { ObjectPool } from "core/ObjectPool";
import { RemindGroupMonitor } from "data/HandleCollectorCfg";
import * as fgui from "fairygui-cc";
import { ModManger } from "manager/ModManger";
import { ViewManager } from "manager/ViewManager";
import { ActivityCombatView } from "modules/ActivityCombat/ActivityCombatView";
import { SceneType } from 'modules/Battle/BattleConfig';
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { FunOpen } from 'modules/FunUnlock/FunOpen';
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { BagData } from 'modules/bag/BagData';
import { BaseItemGB, BaseItemGP } from "modules/common/BaseItem";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { AdType, CommonId, ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { Mod } from "modules/common/ModuleDefine";
import { CurrencyShow, ExpShow } from "modules/extends/Currency";
import { EGLoader } from "modules/extends/EGLoader";
import { HeadItem } from "modules/extends/HeadItem";
import { RedPoint } from "modules/extends/RedPoint";
import { GuideCtrl } from "modules/guide/GuideCtrl";
import { HeroData, HeroDataModel } from "modules/hero/HeroData";
import { HeroInfoView } from "modules/hero/HeroInfoView";
import { MainFBData } from 'modules/main_fb/MainFBData';
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { RemindCtrl } from "modules/remind/RemindCtrl";
import { RoleData } from "modules/role/RoleData";
import { RoleInfoView } from "modules/role/RoleInfoView";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { TaskView } from 'modules/task/TaskView';
import { PackageData } from "preload/PkgData";
import { ResPath } from "utils/ResPath";
import { CocSpriteGradient } from "../../ccomponent/CocSpriteGradient";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { ChannelAgent } from "../../proload/ChannelAgent";
import { ActivityData } from './../activity/ActivityData';
import { MainData } from "./MainData";
import { MainOtherView } from "./MainOtherView";
import { MainViewActItem } from "./MainViewAct";
import { MainViewChallenge, MainViewChallengeAttrItem, MainViewChallengeRewardButton } from "./MainViewChallenge";
import { MainViewTask, MainViewTaskRewardButton1, MainViewTaskRewardButton2 } from "./MainViewTask";
import { ChatView } from "modules/chat/ChatView";
import { DataHelper } from "../../helpers/DataHelper";
import { AvatarData } from "modules/extends/AvatarCell";
import { ResManager } from "manager/ResManager";
import { LogError } from "core/Debugger";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { SpSkeletonBase } from "core/SpSkeletonBase";
import { LoginCtrl, RELANAME_CODE } from "modules/login/LoginCtrl";
import { ENUM_UserServe, SettingUsertServeView } from "modules/setting/SettingUsertServeView";

@BaseView.registView
export class MainView extends BaseView {
    private fightCtrler: fgui.Controller
    private actLeftCtrler: fgui.Controller
    private actRightCtrler: fgui.Controller
    private heroListData: any[];

    private sp_show_y1: UISpineShow = undefined;
    private sp_show_y2: UISpineShow = undefined;
    private sp_show_c11: UISpineShow = undefined;
    private sp_show_c12: UISpineShow = undefined;
    private sp_show_c21: UISpineShow = undefined;
    private sp_show_c22: UISpineShow = undefined;


    protected viewRegcfg = {
        UIPackName: "Main",
        ViewName: "MainView",
        LayerType: ViewLayer.ButtomMain,
        ViewCache: true
    };

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,
        liuhaiscreen: <fgui.GComponent>null,
        bg: <fgui.GImage>null,
        backgrand: <fgui.GImage>null,
        BgHero: <EGLoader>null,

        BtnTask: <fgui.GButton>null,
        BtnOther: <fgui.GButton>null,
        BtnStart: <fgui.GButton>null,
        BtnAd: <fgui.GButton>null,
        BtnChat: <fgui.GButton>null,
        ItemAd: <fgui.GComponent>null,
        Damage: <fgui.GTextField>null,
        GpDamage: <fgui.GGroup>null,
        // BtnBlueL: <MainViewStartButton>null,
        // BtnBlueR: <MainViewStartButton>null,
        BtnActLeft: <MainViewListGButton>null,
        BtnActRight: <MainViewListGButton>null,
        // ButtonRoleInfo: <MainViewRoleInfoButton>null,
        HeadShow: <HeadItem>null,
        NameShow: <fgui.GTextField>null,

        TaskRed: <RedPoint>null,
        OtherRed: <RedPoint>null,
        ActivityCombatRed: <RedPoint>null,
        DailyRed: <RedPoint>null,

        // ExpShow: <ExpShow>null,
        Currency1: <CurrencyShow>null,
        Currency2: <CurrencyShow>null,
        Currency3: <CurrencyShow>null,

        ActListLeft: <fgui.GList>null,
        ActListRight1: <fgui.GList>null,
        ActListRight2: <fgui.GList>null,
        ActList: <fgui.GList>null,
        // HeroList: <fgui.GList>null,
        HeroList2: <fgui.GList>null,

        MainActivityCombat: <MainViewChallenge>null,

        paren_y1: <fgui.GComponent>null,
        paren_y2: <fgui.GComponent>null,
        paren_c11: <fgui.GComponent>null,
        paren_c12: <fgui.GComponent>null,
        paren_c21: <fgui.GComponent>null,
        paren_c22: <fgui.GComponent>null,
        loader3d: <fgui.GLoader3D>null,
        loader3d2: <fgui.GLoader3D>null,
    };

    protected extendsCfg = [
        { ResName: "MainViewTask", ExtendsClass: MainViewTask },
        { ResName: "MainViewChallenge", ExtendsClass: MainViewChallenge },

        { ResName: "ItemActL", ExtendsClass: MainViewActItem },
        { ResName: "ItemActR", ExtendsClass: MainViewActItem },
        { ResName: "ButtonActL", ExtendsClass: MainViewListGButton },
        { ResName: "ButtonActR", ExtendsClass: MainViewListGButton },
        // { ResName: "ButtonRoleInfo", ExtendsClass: MainViewRoleInfoButton },

        { ResName: "ButtonTaskReward1", ExtendsClass: MainViewTaskRewardButton1 },
        { ResName: "ButtonTaskReward2", ExtendsClass: MainViewTaskRewardButton2 },
        { ResName: "ButtonChallengeReward", ExtendsClass: MainViewChallengeRewardButton },

        { ResName: "ItemChallengeAttr", ExtendsClass: MainViewChallengeAttrItem },

        { ResName: "ButtonStartBlueL", ExtendsClass: MainViewStartButton },
        { ResName: "ButtonStartBlueR", ExtendsClass: MainViewStartButton },

        { ResName: "ItemHero", ExtendsClass: MainViewHeroItem },
        { ResName: "BtnHero", ExtendsClass: MainViewHeroItem2 },
        { ResName: "ProgressHero", ExtendsClass: MainViewHeroProgress },
    ];
    listData: any;

    WindowSizeChange() {
    }

    DoOpenWaitHandle() {
        // this.refreshBgSize(this.viewNode.bg)
        let waitHandle = this.createWaitHandle("loadBG")
        this.AddWaitHandle(waitHandle);
        let gradient = this.viewNode.bg._content.addComponent(CocSpriteGradient);
        gradient.setMaterialName("mat_mainview");

        // this.viewNode.BgHero.SetIcon("loader/main/YingXiongTian", () => {
        //     waitHandle.complete = true;
        //     this.refreshBgSize(this.viewNode.bg)
        // })

        this.sp_show_c11 = ObjectPool.Get(UISpineShow, ResPath.Spine("zhubeijing/zhubeijing_cao01"), true, (obj: any) => {
            this.viewNode.paren_c11._container.insertChild(obj, 0);
        });
        this.sp_show_c12 = ObjectPool.Get(UISpineShow, ResPath.Spine("zhubeijing/zhubeijing_cao01"), true, (obj: any) => {
            this.viewNode.paren_c12._container.insertChild(obj, 0);
        });
        this.sp_show_c21 = ObjectPool.Get(UISpineShow, ResPath.Spine("zhubeijing/zhubeijing_cao02"), true, (obj: any) => {
            this.viewNode.paren_c21._container.insertChild(obj, 0);
        });
        this.sp_show_c22 = ObjectPool.Get(UISpineShow, ResPath.Spine("zhubeijing/zhubeijing_cao02"), true, (obj: any) => {
            this.viewNode.paren_c22._container.insertChild(obj, 0);
        });

        this.sp_show_y1 = ObjectPool.Get(UISpineShow, ResPath.Spine("zhubeijing/zhubeijing_piaoye01"), true, (obj: any) => {
            this.viewNode.paren_y1._container.insertChild(obj, 0);
        });
        this.sp_show_y2 = ObjectPool.Get(UISpineShow, ResPath.Spine("zhubeijing/zhubeijing_piaoye02"), true, (obj: any) => {
            this.viewNode.paren_y2._container.insertChild(obj, 0);
        });
        waitHandle.complete = true

        if (!ViewManager.Inst().mainViewLoaded) {
            MainData.Inst().FlushMainStart();
        }
    }

    InitData() {
        this.fightCtrler = this.view.getController("FightState");
        this.actLeftCtrler = this.view.getController("ActStateLeft");
        this.actRightCtrler = this.view.getController("ActStateRight");

        this.viewNode.BtnTask.onClick(this.OnClickTask, this);
        this.viewNode.BtnOther.onClick(this.OnClickOther, this);
        this.viewNode.BtnStart.onClick(this.OnClickStart, this);
        this.viewNode.BtnAd.onClick(this.OnClickAd, this);
        // this.viewNode.BtnBlueL.onClick(this.OnClickBlueL, this);
        // this.viewNode.BtnBlueR.onClick(this.OnClickBlueR, this);
        this.viewNode.BtnActLeft.onClick(this.OnClickActLeft, this);
        this.viewNode.BtnActRight.onClick(this.OnClickActRight, this);
        this.viewNode.HeadShow.onClick(this.OnClickRoleInfo, this);
        this.viewNode.BtnChat.onClick(this.OnClickChat, this);

        this.viewNode.Currency1.SetCurrency(CommonId.Gold);
        this.viewNode.Currency2.SetCurrency(CommonId.Energy);
        this.viewNode.Currency3.SetCurrency(CommonId.Diamond);
        this.viewNode.Currency2.BtnAddShow(true);

        // this.viewNode.HeroList.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.HeroList2.itemRenderer = this.renderListItem2.bind(this);

        // this.viewNode.ActListLeft.on(fgui.Event.CLICK_ITEM, this.OnClickActItem, this);
        // this.viewNode.ActListRight1.on(fgui.Event.CLICK_ITEM, this.OnClickActItem, this);
        // this.viewNode.ActListRight2.on(fgui.Event.CLICK_ITEM, this.OnClickActItem, this);
        this.viewNode.ActList.on(fgui.Event.CLICK_ITEM, this.OnClickActItem, this);
        // this.viewNode.HeroList.on(fgui.Event.CLICK_ITEM, this.OnClickHeroItem, this);

        this.AddSmartDataCare(RoleData.Inst().FlushData, this.FlushRoleInfo.bind(this), "FlushRoleInfo");
        this.AddSmartDataCare(RoleData.Inst().FlushData, this.FlushRoleAvater.bind(this), "FlushRoleAvater");

        this.AddSmartDataCare(ActivityData.Inst().ResuleData, this.FlushActShow.bind(this), "is_activity_status_change");
        this.AddSmartDataCare(HeroData.Inst().ResultData, this.FlushHeroListInfo.bind(this), "heroInfoFlush");
        // this.AddSmartDataCare(MainFBData.Inst().FlushData, this.FlushHeroListInfo.bind(this), "FlushDailyChallengeInfo");
        this.AddSmartDataCare(BagData.Inst().BagItemData, this.FlushHeroListInfo.bind(this), "OtherChange")
        this.AddSmartDataCare(RoleData.Inst().FlushData, this.FlushAdInfo.bind(this), "FlushAdInfo");
        this.AddSmartDataCare(MainFBData.Inst().FlushData, this.FlushAdInfo.bind(this), "FlushInfo");
        this.AddSmartDataCare(MainData.Inst().FlushData, this.FlushFightIndex.bind(this), "FightIndex");

        // this.AddSmartDataCare(InviteFriendData.Inst().FlushData, this.FlushOtherRedPoint.bind(this), "FlushInfo");
        // this.AddSmartDataCare(MailData.Inst().FlushData, this.FlushOtherRedPoint.bind(this), "FlushMailList", "FlushMailDetail");

        this.addRemindCare(Mod.Task.View, this.viewNode.TaskRed)
        this.addRemindCare(Mod.MainOther.View, this.viewNode.OtherRed)
        this.addRemindCare(Mod.ActivityCombat.View, this.viewNode.ActivityCombatRed)
        this.addRemindCare(Mod.Main.EverydayFB, this.viewNode.DailyRed)

        // //TODO 遍历所有特效及预制体，测试崩溃用的
        // let arr = "[\"actors/monster/11000\",\"actors/monster/11001\",\"actors/monster/11002\",\"actors/monster/11003\",\"actors/monster/11004\",\"actors/monster/11005\",\"actors/monster/11006\",\"actors/monster/11007\",\"actors/monster/11008\",\"actors/monster/11009\",\"actors/monster/11010\",\"actors/monster/11011\",\"actors/monster/11012\",\"actors/monster/11013\",\"actors/monster/11014\",\"actors/monster/11015\",\"actors/monster/11016\",\"actors/monster/11017\",\"actors/monster/11018\",\"actors/monster/11019\",\"actors/monster/11020\",\"actors/monster/11021\",\"actors/monster/11022\",\"actors/monster/11023\",\"actors/monster/11024\",\"actors/monster/11025\",\"actors/monster/11026\",\"actors/monster/11027\",\"actors/monster/11028\",\"actors/monster/11029\",\"actors/monster/11030\",\"actors/monster/11031\",\"actors/monster/11032\",\"actors/monster/11033\",\"actors/monster/11034\",\"actors/monster/11035\",\"actors/monster/11036\",\"actors/monster/11037\",\"actors/monster/11038\",\"actors/monster/11039\",\"actors/monster/11040\",\"actors/monster/11041\",\"actors/monster/11042\",\"actors/monster/11043\",\"actors/monster/11044\",\"actors/monster/11045\",\"actors/monster/11046\",\"actors/monster/11047\",\"actors/monster/11048\",\"actors/monster/11049\",\"actors/monster/11050\",\"actors/monster/11051\",\"actors/monster/11052\",\"actors/monster/11053\",\"actors/monster/11054\",\"actors/monster/11055\",\"actors/monster/11056\",\"actors/monster/11057\",\"actors/monster/11058\",\"actors/monster/11100\",\"actors/monster/15000\",\"actors/monster/15001\",\"actors/monster/15002\",\"actors/monster/15003\",\"actors/monster/15004\",\"actors/monster/15005\",\"actors/monster/15006\",\"actors/monster/15007\",\"actors/monster/15008\",\"actors/monster/15009\",\"actors/monster/15010\",\"actors/monster/15011\",\"actors/monster/15012\",\"actors/monster/15013\",\"actors/monster/15014\",\"actors/monster/15015\",\"actors/monster/15016\",\"actors/monster/15017\",\"actors/monster/15018\",\"actors/monster/15019\",\"effect/boss/15020\",\"effect/boss/15021\",\"actors/monster/150211\",\"effect/boss/15022\",\"effect/boss/15023\",\"effect/boss/15024\",\"effect/boss/15025\",\"effect/boss/15026\",\"effect/boss/15027\",\"battle/ArenaBattleScene\",\"battle/ArenaSceneBG\",\"battle/BattlePlatform\",\"battle/BattleScene\",\"battle/BossTip\",\"battle/DefBattleScene\",\"battle/DefSceneBattleBG\",\"battle/MainSceneBG\",\"battle/MonsterCollider\",\"battle/MonsterColliderBoss\",\"battle/ProgressBar\",\"effect/blueheros/10330011\",\"effect/blueheros/10380011\",\"effect/blueheros/10380012\",\"effect/blueheros/10380013\",\"effect/blueheros/1038002\",\"effect/blueheros/10380031\",\"effect/blueheros/10380032\",\"effect/blueheros/10380033\",\"effect/blueheros/1038004\",\"effect/blueheros/1038005\",\"effect/blueheros/1038006\",\"effect/blueheros/10380071\",\"effect/blueheros/10380081\",\"effect/blueheros/10380082\",\"effect/blueheros/10380083\",\"effect/blueheros/10380091\",\"effect/blueheros/10380092\",\"effect/blueheros/10380101\",\"effect/blueheros/10380102\",\"effect/blueheros/10380111\",\"effect/blueheros/10380121\",\"effect/blueheros/10380122\",\"effect/blueheros/10380123\",\"effect/blueheros/10380131\",\"effect/blueheros/10380132\",\"effect/blueheros/10380133\",\"effect/blueheros/10380141\",\"effect/blueheros/10380142\",\"effect/blueheros/10380143\",\"effect/blueheros/10380151\",\"effect/blueheros/10380161\",\"effect/blueheros/10380162\",\"effect/blueheros/1038017\",\"effect/blueheros/10380171\",\"effect/blueheros/10380181\",\"effect/blueheros/10380182\",\"effect/blueheros/10380183\",\"effect/blueheros/10380191\",\"effect/blueheros/10380201\",\"effect/blueheros/10380202\",\"effect/blueheros/10380203\",\"effect/blueheros/10380204\",\"effect/blueheros/10380211\",\"effect/blueheros/10380212\",\"effect/blueheros/10380221\",\"effect/blueheros/10380231\",\"effect/blueheros/10380232\",\"effect/blueheros/10380233\",\"effect/buff/10380241\",\"effect/blueheros/10380242\",\"effect/blueheros/10380251\",\"effect/blueheros/10380252\",\"effect/blueheros/10380261\",\"effect/blueheros/10380262\",\"effect/blueheros/10380271\",\"effect/blueheros/10380272\",\"effect/blueheros/10380273\",\"effect/blueheros/10390011\",\"effect/blueheros/10390021\",\"effect/boss/15028\",\"effect/boss/15029\",\"effect/buff/1018001\",\"effect/buff/1019000\",\"effect/buff/1019001\",\"effect/buff/1019002\",\"effect/buff/10390001\",\"effect/buff/1043007\",\"effect/buff/10480051\",\"effect/buff/10480195\",\"effect/buff/1058002\",\"effect/buff/1058003\",\"effect/buff/1058004\",\"effect/buff/1058005\",\"effect/buff/1058006\",\"effect/buff/1058007\",\"effect/buff/1058008\",\"effect/buff/1058009\",\"effect/buff/1058010\",\"effect/buff/1058011\",\"effect/buff/1058012\",\"effect/buff/1058013\",\"effect/buff/1058014\",\"effect/buff/1058015\",\"effect/buff/1058016\",\"effect/buff/1058017\",\"effect/buff/1058018\",\"effect/greenheros/1028001\",\"effect/greenheros/1028002\",\"effect/greenheros/1028003\",\"effect/greenheros/10280041\",\"effect/greenheros/10280042\",\"effect/greenheros/10280043\",\"effect/greenheros/1028005\",\"effect/greenheros/10290001\",\"effect/greenheros/10290002\",\"effect/greenheros/10290003\",\"effect/greenheros/10290011\",\"effect/greenheros/10290012\",\"effect/greenheros/10290013\",\"effect/greenheros/10290021\",\"effect/greenheros/10290022\",\"effect/greenheros/10290023\",\"effect/greenheros/10290031\",\"effect/greenheros/10290041\",\"effect/greenheros/10290051\",\"effect/greenheros/10290052\",\"effect/greenheros/10290053\",\"effect/greenheros/10290054\",\"effect/greenheros/10290061\",\"effect/greenheros/10290062\",\"effect/greenheros/10290071\",\"effect/greenheros/10290072\",\"effect/greenheros/10290073\",\"effect/greenheros/10290101\",\"effect/greenheros/10290111\",\"effect/greenheros/10290112\",\"effect/greenheros/10290113\",\"effect/greenheros/10290121\",\"effect/greenheros/10290131\",\"effect/greenheros/10290141\",\"effect/greenheros/10290142\",\"effect/purpleheros/10430011\",\"effect/purpleheros/10430012\",\"effect/purpleheros/10430021\",\"effect/purpleheros/10430022\",\"effect/purpleheros/10430031\",\"effect/purpleheros/10430032\",\"effect/purpleheros/10430041\",\"effect/purpleheros/10430042\",\"effect/purpleheros/1043006\",\"effect/purpleheros/1043008\",\"effect/purpleheros/10480011\",\"effect/purpleheros/10480012\",\"effect/purpleheros/10480013\",\"effect/purpleheros/10480021\",\"effect/purpleheros/10480031\",\"effect/purpleheros/10480041\",\"effect/purpleheros/10480042\",\"effect/purpleheros/10480052\",\"effect/purpleheros/10480053\",\"effect/purpleheros/10480054\",\"effect/purpleheros/10480061\",\"effect/purpleheros/10480071\",\"effect/purpleheros/10480081\",\"effect/purpleheros/10480091\",\"effect/purpleheros/10480101\",\"effect/purpleheros/10480111\",\"effect/purpleheros/10480112\",\"effect/purpleheros/10480113\",\"effect/purpleheros/10480114\",\"effect/purpleheros/10480115\",\"effect/purpleheros/10480121\",\"effect/purpleheros/10480122\",\"effect/purpleheros/10480123\",\"effect/purpleheros/10480124\",\"effect/purpleheros/10480125\",\"effect/purpleheros/10480131\",\"effect/purpleheros/10480141\",\"effect/purpleheros/10480142\",\"effect/purpleheros/10480151\",\"effect/purpleheros/10480152\",\"effect/purpleheros/10480153\",\"effect/purpleheros/10480154\",\"effect/purpleheros/10480155\",\"effect/purpleheros/10480161\",\"effect/purpleheros/10480162\",\"effect/purpleheros/10480163\",\"effect/purpleheros/10480164\",\"effect/purpleheros/10480165\",\"effect/purpleheros/10480171\",\"effect/purpleheros/10480172\",\"effect/purpleheros/10480173\",\"effect/purpleheros/10480181\",\"effect/purpleheros/10480182\",\"effect/purpleheros/10480183\",\"effect/purpleheros/10480185\",\"effect/purpleheros/10480186\",\"effect/purpleheros/10480187\",\"effect/purpleheros/10480188\",\"effect/purpleheros/10480191\",\"effect/purpleheros/10480192\",\"effect/purpleheros/10480193\",\"effect/purpleheros/10480194\",\"effect/purpleheros/10480201\",\"effect/purpleheros/10480202\",\"effect/purpleheros/10480203\",\"effect/purpleheros/10480204\",\"effect/purpleheros/10480205\",\"effect/purpleheros/10480206\",\"effect/purpleheros/10480211\",\"effect/purpleheros/10480212\",\"effect/purpleheros/10480213\",\"effect/purpleheros/10480214\",\"effect/purpleheros/10480215\",\"effect/purpleheros/10480216\",\"effect/purpleheros/10480221\",\"effect/purpleheros/10480222\",\"effect/purpleheros/10480223\",\"effect/purpleheros/10480224\",\"effect/purpleheros/10490001\",\"effect/purpleheros/10490002\",\"effect/purpleheros/10490003\",\"effect/purpleheros/10490004\",\"effect/purpleheros/10490005\",\"effect/purpleheros/10490011\",\"effect/purpleheros/10490012\",\"effect/purpleheros/10490021\",\"effect/purpleheros/10490031\",\"effect/purpleheros/10490051\",\"effect/purpleheros/10490052\",\"effect/purpleheros/10490061\",\"effect/purpleheros/10490071\",\"effect/purpleheros/10490081\",\"effect/purpleheros/10490101\",\"effect/purpleheros/10490111\",\"effect/purpleheros/10490112\",\"effect/purpleheros/10490113\",\"effect/purpleheros/10490121\",\"effect/purpleheros/10490131\",\"effect/purpleheros/10490141\",\"effect/purpleheros/10490151\",\"effect/purpleheros/10490152\",\"effect/purpleheros/10490161\",\"effect/purpleheros/10490171\",\"effect/purpleheros/10490172\",\"effect/purpleheros/10490181\",\"effect/purpleheros/10490191\",\"effect/purpleheros/10490192\",\"effect/ui/1009000\",\"effect/ui/1009001\",\"effect/ui/1009002\",\"effect/ui/1009003\",\"effect/ui/1009004\",\"effect/ui/1009005\",\"effect/ui/1009006\",\"effect/ui/1009007\",\"effect/ui/1009008\",\"effect/ui/1009009\",\"effect/ui/1009010\",\"effect/ui/1009011\",\"effect/ui/1203001\",\"effect/ui/1203002\",\"effect/ui/1203003\",\"effect/ui/1208001\",\"effect/ui/1208002\",\"effect/ui/1208003\",\"effect/ui/1208004\",\"effect/ui/1208005\",\"effect/ui/1208006\",\"effect/ui/1208007\",\"effect/ui/1208008\",\"effect/ui/1208009\",\"effect/ui/1208010\",\"effect/ui/1208011\",\"effect/ui/1208012\",\"effect/ui/1208013\",\"effect/ui/1208014\",\"effect/ui/1208015\",\"effect/ui/1208016\",\"effect/ui/1208017\",\"effect/ui/1208018\",\"effect/ui/1208019\",\"effect/ui/1208020\",\"effect/ui/1208021\",\"effect/ui/12080210\",\"effect/ui/1208022\",\"effect/ui/1208023\",\"effect/ui/1208024\",\"effect/ui/1208025\",\"effect/ui/1208026\",\"effect/ui/1208027\",\"effect/ui/1208028\",\"effect/ui/1208029\",\"effect/ui/1208030\",\"effect/ui/1208031\",\"effect/ui/1208032\",\"effect/ui/1208033\",\"effect/ui/1208034\",\"effect/ui/1208035\",\"effect/ui/1208036\",\"effect/ui/1208037\",\"effect/ui/1208038\",\"effect/ui/1208039\",\"effect/ui/1208040\",\"effect/ui/1208041\",\"effect/ui/1208042\",\"effect/ui/1208043\",\"effect/ui/1208044\",\"effect/ui/1208045\",\"effect/ui/1208046\",\"effect/ui/1208047\",\"effect/ui/1208048\",\"effect/ui/1208049\",\"effect/ui/1208050\",\"effect/ui/1208051\",\"effect/ui/1208052\",\"effect/ui/1208053\",\"effect/ui/1208054\",\"effect/ui/1208055\",\"effect/ui/1208056\",\"effect/ui/1208057\",\"effect/ui/1208058\",\"effect/ui/1208059\",\"effect/ui/1208060\",\"effect/ui/1208061\",\"effect/ui/1208062\",\"effect/ui/1208063\",\"effect/ui/1208064\",\"effect/ui/1208065\",\"effect/ui/1208066\",\"effect/ui/1208067\",\"effect/ui/1208068\",\"effect/ui/1208069\",\"effect/ui/1208070\",\"effect/ui/1208071\",\"effect/ui/1208072\",\"effect/ui/1208073\",\"effect/ui/1208074\",\"effect/ui/1208075\",\"effect/ui/1208076\",\"effect/ui/1208077\",\"effect/ui/1208078\",\"effect/ui/1208079\",\"effect/ui/1208080\",\"effect/ui/1208081\",\"effect/ui/1208082\",\"effect/ui/1208083\",\"effect/ui/1208083_1\",\"effect/ui/1208084\",\"effect/ui/1208085\",\"effect/ui/1208086\",\"effect/ui/1208087\",\"effect/ui/1208088\",\"effect/ui/1208089\",\"effect/ui/1208090\",\"effect/ui/1208091\",\"effect/ui/1208092\",\"effect/ui/1208093\",\"effect/ui/1208094\",\"effect/ui/1208095\",\"effect/ui/1208096\",\"effect/ui/1208097\",\"effect/ui/1208098\",\"effect/ui/1208099\",\"effect/ui/1208100\",\"effect/ui/1208101\",\"effect/ui/1208102\",\"effect/ui/1208103\",\"effect/ui/1208104\",\"effect/ui/1208105\",\"effect/ui/1208106\",\"effect/ui/1208107\",\"effect/ui/1208108\",\"effect/ui/1208109\",\"effect/ui/1208110\",\"effect/ui/1208111\",\"effect/ui/1208112\",\"effect/ui/1208113\",\"effect/ui/1208114\",\"effect/ui/1208115\",\"effect/ui/1208116\",\"effect/ui/1208117\",\"effect/ui/1208118\",\"effect/ui/1208119\",\"effect/ui/1208120\",\"effect/ui/1208121\",\"effect/ui/1208122\",\"effect/ui/1208123\",\"effect/ui/1208124\",\"effect/ui/1208125\",\"effect/ui/1208126\",\"effect/ui/1208127\",\"effect/ui/1208128\",\"effect/ui/1208129\",\"effect/ui/1208130\",\"effect/ui/1208131\",\"effect/ui/1208132\",\"effect/ui/1208133\",\"effect/ui/1208134\",\"effect/ui/1208135\",\"effect/ui/1208136\",\"effect/ui/1208137\",\"effect/ui/1208138\",\"effect/ui/cell_race_1\",\"effect/ui/cell_race_2\",\"effect/ui/cell_race_3\",\"effect/ui/cell_race_4\",\"effect/ui/cell_race_5\",\"effect/ui/cell_race_6\",\"resources2/login/denglu\",\"skill_asset/BianFuBaoZa\",\"skill_asset/bingdonggu_1\",\"skill_asset/bingdonggu_2\",\"skill_asset/bingdonggu_3\",\"skill_asset/bingdonggu_4\",\"skill_asset/bingdonggu_5\",\"skill_asset/bingshuang_1\",\"skill_asset/bingshuang_2\",\"skill_asset/bingshuang_3\",\"skill_asset/bingshuang_jianse\",\"skill_asset/caisen_normal_fr1\",\"skill_asset/caisen_normal_fr2\",\"skill_asset/caisen_normal_fr3\",\"skill_asset/caisen_qigong\",\"skill_asset/cdxiaochou_bombfeidao\",\"skill_asset/cdxiaochou_bombpoke\",\"skill_asset/cdxiaochou_kongjubomb\",\"skill_asset/cdxiaochou_normal1\",\"skill_asset/cdxiaochou_normal2\",\"skill_asset/cdxiaochou_normal3\",\"skill_asset/ChongJiBo\",\"skill_asset/dalihua_1\",\"skill_asset/dalihua_2\",\"skill_asset/dalihua_3\",\"skill_asset/dalihua_bomb\",\"skill_asset/dalihua_fenlie_1\",\"skill_asset/dalihua_fenlie_2\",\"skill_asset/dalihua_fenlie_3\",\"skill_asset/dalihua_shenying\",\"skill_asset/daodan_1\",\"skill_asset/daodan_bomb_1\",\"skill_asset/DaShanDian\",\"skill_asset/DaZuiHuaHuoQiu\",\"skill_asset/DianRang\",\"skill_asset/dishuibinglian_1\",\"skill_asset/dishuibinglian_bingjian\",\"skill_asset/eli_1\",\"skill_asset/eli_jianci\",\"skill_asset/eli_nianye\",\"skill_asset/ermo_1\",\"skill_asset/ermo_hit_1\",\"skill_asset/FuChouHuoYan\",\"skill_asset/FuChouHuoYanFengBao\",\"skill_asset/GangFeng\",\"skill_asset/gongchengshi_1\",\"skill_asset/gongchengshi_2\",\"skill_asset/gongchengshi_3\",\"skill_asset/gongchengshi_daodan\",\"skill_asset/gongchengshi_hedan\",\"skill_asset/gongchengshi_hedan_bomb\",\"skill_asset/gongchengshi_hit_1\",\"skill_asset/gongchengshi_hit_ranshao\",\"skill_asset/gongchengshi_huoyan\",\"skill_asset/gongchengshi_ranshao\",\"skill_asset/haidaiemo_1\",\"skill_asset/haidaiemo_2\",\"skill_asset/haidaiemo_chanrao\",\"skill_asset/haidaiemo_kangfen\",\"skill_asset/haidaiemo_ray\",\"skill_asset/HaiLang\",\"skill_asset/huanyingzhu\",\"skill_asset/huimiegu_1\",\"skill_asset/huimiegu_2\",\"skill_asset/huixuanhua_1\",\"skill_asset/huixuanhua_3\",\"skill_asset/HuoJuFeng\",\"skill_asset/huoju_damadd_1\",\"skill_asset/huoju_damadd_2\",\"skill_asset/huoju_damadd_3\",\"skill_asset/huoju_yishang\",\"skill_asset/HuoLongGuo_1\",\"skill_asset/HuoYan\",\"skill_asset/HuoYanFengBao\",\"skill_asset/HuoYu\",\"skill_asset/jianguoqiang_1\",\"skill_asset/jianguoqiang_2\",\"skill_asset/JianRenXuanFeng\",\"skill_asset/jingjicao_1\",\"skill_asset/jingjicao_2\",\"skill_asset/jingjicao_chang_1\",\"skill_asset/jingjicao_chang_2\",\"skill_asset/jingjicao_hit_1\",\"skill_asset/jingjicao_hit_2\",\"skill_asset/jingjicao_xuebao\",\"skill_asset/JuFeng\",\"skill_asset/kfdou_jian\",\"skill_asset/kfdou_jian_track\",\"skill_asset/kfdou_normal1\",\"skill_asset/kfdou_normal2\",\"skill_asset/labi_1\",\"skill_asset/labi_2\",\"skill_asset/labi_hit_1\",\"skill_asset/labi_penhuo\",\"skill_asset/lianoumaikefeng_1\",\"skill_asset/lianoumaikefeng_2\",\"skill_asset/lianoumaikefeng_yinfu\",\"skill_asset/LianXiaoPengBaoPo\",\"skill_asset/LianXiaoPeng_1\",\"skill_asset/LianXiaoPeng_QuanTou\",\"skill_asset/lingjing_1\",\"skill_asset/lingjing_fdbomb\",\"skill_asset/lingjing_feidan\",\"skill_asset/lingjing_guangjian\",\"skill_asset/lingjing_ray\",\"skill_asset/LiuLianCi\",\"skill_asset/LiuLianFengBao\",\"skill_asset/LiuLian_1\",\"skill_asset/LuWeiHit\",\"skill_asset/LuWei_1\",\"skill_asset/meiguihuaban\",\"skill_asset/meigui_1\",\"skill_asset/meigui_hit_1\",\"skill_asset/meigui_shouhu\",\"skill_asset/meihuogu_1\",\"skill_asset/meihuogu_meihuo_1\",\"skill_asset/mubei_normal1\",\"skill_asset/mubei_normal2\",\"skill_asset/mubei_normal3\",\"skill_asset/munaili_1\",\"skill_asset/munaili_2\",\"skill_asset/munaili_3\",\"skill_asset/munaili_zuzou\",\"skill_asset/nangua_1\",\"skill_asset/putaoqiu_1\",\"skill_asset/putaoqiu_2\",\"skill_asset/putaoqiu_3\",\"skill_asset/PuTaoZhi\",\"skill_asset/QiGongBo\",\"skill_asset/ShanDianQiu\",\"skill_asset/ShanXIngZuoZi\",\"skill_asset/ShengGuangZhiLi\",\"skill_asset/shilaimu_1\",\"skill_asset/shilaimu_2\",\"skill_asset/shilaimu_3\",\"skill_asset/shuilian_1\",\"skill_asset/sibadazhu_1\",\"skill_asset/TieChuiLan_1\",\"skill_asset/toudanshou_1\",\"skill_asset/toudanshou_2\",\"skill_asset/toudanshou_3\",\"skill_asset/wogua_1\",\"skill_asset/wogua_2\",\"skill_asset/xiangmugongshou_guntong1\",\"skill_asset/xiangmugongshou_guntong2\",\"skill_asset/xiangmugongshou_normal1\",\"skill_asset/xiangmugongshou_normal2\",\"skill_asset/xiangpumao_1\",\"skill_asset/xiangpumao_julang\",\"skill_asset/xianrenzhang_1\",\"skill_asset/xianrenzhang_2\",\"skill_asset/xianrenzhang_3\",\"skill_asset/xitiehua_1\",\"skill_asset/xitiehua_2\",\"skill_asset/xitiehua_3\",\"skill_asset/xitiehua_bomb_1\",\"skill_asset/xjchanzhang_1\",\"skill_asset/xjchuanzhang_bomb\",\"skill_asset/xjchuanzhang_chuanmao\",\"skill_asset/yezibaolei_1\",\"skill_asset/yezibaolei_2\",\"skill_asset/yezibaolei_3\",\"skill_asset/yingtaodilei\",\"skill_asset/yingtaozhadan_1\",\"skill_asset/yingtaozhadan_2\",\"skill_asset/yingtaozhadan_3\",\"skill_asset/yingtaozhadan_hit_1\",\"skill_asset/yingtaozhadan_hit_2\",\"skill_asset/YiQunBianFu\",\"skill_asset/youlinglajiao_1\",\"skill_asset/youlinglajiao_bomb\",\"skill_asset/youlinglajiao_mishapebomb\",\"skill_asset/youlinglajiao_tenshapebomb\",\"skill_asset/youyumogu_1\",\"skill_asset/youyumogu_2\",\"skill_asset/yumizi\",\"skill_asset/yumi_1\",\"skill_asset/yumi_2\",\"skill_asset/yumi_hit\",\"spine/baicai/baicai\",\"spine/baoxianxiang/baoxianxiang\",\"spine/card/card\",\"spine/choujiang_TB/choujiang_TB\",\"spine/clock/clocks\",\"spine/coin/coin\",\"spine/core_crisis_box0\",\"spine/core_crisis_box1\",\"spine/core_crisis_box2\",\"spine/cunqianguan/cunqianguan\",\"spine/diaoyuzhanling/diaoyuzhanling\",\"spine/dongxue/dongxue\",\"spine/duanxian/duanxian\",\"spine/fish/55001\",\"spine/fish/55002\",\"spine/fish/55003\",\"spine/fish/55004\",\"spine/fish/55005\",\"spine/fish/55006\",\"spine/fish/55007\",\"spine/fish/55008\",\"spine/fish/55009\",\"spine/fish/55010\",\"spine/fish/55011\",\"spine/fish/55012\",\"spine/fish/55013\",\"spine/fish/55014\",\"spine/fish/55015\",\"spine/fish/55016\",\"spine/fish/55017\",\"spine/fish/55018\",\"spine/fish/55019\",\"spine/fish/55020\",\"spine/fish/55021\",\"spine/fish/55022\",\"spine/fish/55023\",\"spine/fish/55024\",\"spine/fish/55025\",\"spine/fish/55026\",\"spine/fish/55027\",\"spine/fish/55028\",\"spine/fish/55029\",\"spine/fish/55030\",\"spine/fish/55031\",\"spine/fish/55032\",\"spine/fish/55033\",\"spine/fish/55034\",\"spine/fish/55035\",\"spine/fish/55036\",\"spine/fish/55037\",\"spine/fish/55038\",\"spine/fish/55039\",\"spine/fish/55040\",\"spine/fish/55041\",\"spine/fish/55042\",\"spine/fish/55043\",\"spine/fish/55044\",\"spine/fish/55045\",\"spine/fish/55046\",\"spine/fish/55047\",\"spine/fish/55048\",\"spine/fish/55049\",\"spine/fish/55050\",\"spine/fish/55051\",\"spine/fish/55052\",\"spine/fish/55053\",\"spine/fish/55054\",\"spine/fish/55055\",\"spine/fish/55056\",\"spine/fish/55057\",\"spine/fish/55058\",\"spine/fish/55059\",\"spine/fish/55060\",\"spine/fish/55061\",\"spine/fish/55062\",\"spine/fish/55063\",\"spine/fish/55064\",\"spine/fish/55065\",\"spine/fish/55066\",\"spine/fish/55067\",\"spine/fish/55068\",\"spine/fish/55069\",\"spine/fish/55070\",\"spine/fish/55071\",\"spine/fish/55072\",\"spine/fish/55073\",\"spine/fish/55074\",\"spine/fish/55075\",\"spine/fish/55076\",\"spine/fish/55077\",\"spine/fish/55078\",\"spine/fish/55079\",\"spine/fish/55080\",\"spine/fish/55081\",\"spine/fish/55082\",\"spine/fish/55083\",\"spine/fish/55084\",\"spine/fish/55085\",\"spine/fish/55086\",\"spine/fish/55087\",\"spine/fish/55088\",\"spine/fish/55089\",\"spine/fish/55090\",\"spine/fish/55091\",\"spine/fish/55092\",\"spine/fish/55093\",\"spine/fish/55094\",\"spine/fish/55095\",\"spine/fish/55096\",\"spine/fish/55097\",\"spine/fish/55098\",\"spine/fish/55099\",\"spine/fish/55100\",\"spine/fuhuo/fuhuo\",\"spine/gengzhongri/gengzhongri_TB\",\"spine/gengzhongri/gengzhongri_top\",\"spine/houzhaitanxian/houzhaitanxian\",\"spine/huangjinTXZ/huangjinTXZ\",\"spine/huayuan/diaoyu_out\",\"spine/huayuan/kuangdong_out\",\"spine/huayuan/lijinglibao_TB\",\"spine/huayuan/lingjianlibao\",\"spine/huayuan/nongchang_out\",\"spine/huayuan/taren_shang\",\"spine/huayuan/taren_youxia\",\"spine/huayuan/yanjiusuo_in\",\"spine/huayuan/yanjiusuo_out\",\"spine/jiangshichongchongchong/jiangshichongchongchong\",\"spine/jiangshichongchongchong/jiangshichongchongchong_top\",\"spine/jianianhua/jianianhua\",\"spine/jiantou_TB/jiantou_TB\",\"spine/xianshihuodong/jingjicao/jingjicao\",\"spine/jiyindingxianglibao_TB/jiyindingxianglibao_TB\",\"spine/jiyinxinshoulibao/jiyinxinshoulibao\",\"spine/jiyinxinshoulibao_TB/jiyinxinshoulibao_TB\",\"spine/jiyinyindao_TB/jiyinyindao_TB\",\"spine/xianshihuodong_TB/kafeidou_TB/kafeidou_TB\",\"spine/kuangdongzhanling/kuangdongzhanling\",\"spine/libao/chengzhanglibao_01\",\"spine/libao/chengzhanglibao_02\",\"spine/libao/chengzhanglibao_03\",\"spine/libao/chengzhanglibao_04\",\"spine/libao/chengzhanglibao_05\",\"spine/libao/chengzhanglibao_06\",\"spine/libao/chengzhanglibao_07\",\"spine/xinshoulibao/xinshoulibao\",\"spine/libaohuizong/libaohuizong\",\"spine/lihe/lihe\",\"spine/xianshihuodong/meiguifashi/meiguifashi\",\"spine/mianguanggao/mianguanggao\",\"spine/mianguanggao_1/mianguanggao_1\",\"spine/mowangzhanling/mowangzhanling\",\"spine/pig/pig\",\"spine/PVP/PVP-pass\",\"spine/PVP/PVP-pipeidao\",\"spine/PVP/PVP-zd\",\"spine/PVP/PVP_libao\",\"spine/PVP/PVP_pipei\",\"spine/PVP/PVP_shop\",\"spine/PVP/PVP_TB\",\"spine/qiri/qiri\",\"spine/qirishishi/qirishishi_tc\",\"spine/qirishishi/qirishishi_top\",\"spine/qirishishi_TB/qirishishi_TB\",\"spine/qizi/qizi\",\"spine/shenyuanhuiyi/shenyuanhuiyi\",\"spine/xianshihuodong_TB/shenyuanhuiyi_TB/shenyuanhuiyi_TB\",\"spine/shenyuanshengdian/shenyuanshengdian\",\"spine/shouchong/shouchong\",\"spine/shoujijiangli/shoujijiangli\",\"spine/shouweihouyuan/shouweihouyuan_BOX\",\"spine/shouweihouyuan/shouweihouyuan_tc\",\"spine/shouweihouyuan/shouweihouyuan_top\",\"spine/tiaozhanjuanzhou/tiaozhanjuanzhou\",\"spine/tongxingzheng/tongxingzheng\",\"spine/xianshihuodong/lianxiaopeng_top/dalihua\",\"spine/xianshihuodong/dalihua_top/dalihua_top\",\"spine/xianshihuodong/dazuihua/dazuihua\",\"spine/xianshihuodong/dazuihua_TOP/dazuihua_TOP\",\"spine/xianshihuodong/diyuhuolongguo/diyuhuolongguo\",\"spine/xianshihuodong/diyuhuolongguo_top/diyuhuolongguo_top\",\"spine/xianshihuodong/eli/eli\",\"spine/xianshihuodong/eli_top/eli_top\",\"spine/xianshihuodong/kuangdongqiyuji/kuangdongqiyuji\",\"spine/xianshihuodong/kuangdongqiyuji_top/kuangdongqiyuji_top\",\"spine/xianshihuodong/lengjingcao/lengjingcao\",\"spine/xianshihuodong/lengjingcao_top/lengjingcao_top\",\"spine/xianshihuodong/lianxiaopeng/lianxiaopeng\",\"spine/xianshihuodong/lianxiaopeng_top/lianxiaopeng_top\",\"spine/xianshihuodong/meiguifashi_top/meiguifashi_top\",\"spine/xianshihuodong/ningmengsanzhan/ningmengsanzhan\",\"spine/xianshihuodong/ningmengsanzhan_top/ningmengsanzhan_top\",\"spine/xianshihuodong/putaodan/putaodan\",\"spine/xianshihuodong/putaodan_top/putaodan_top\",\"spine/xianshihuodong/tiechuilan/tiechuilan\",\"spine/xianshihuodong/tiechuilan_top/tiechuilan_top\",\"spine/xianshihuodong/xiangjiaochuanzhang/xiangjiaochuanzhang\",\"spine/xianshihuodong/xiangjiaochuanzhang_top/xiangjiaochuanzhang_top\",\"spine/xianshihuodong/xiangmugongshou/xiangmugongshou\",\"spine/xianshihuodong/xiangmugongshou_top/xiangmugongshou_top\",\"spine/xianshihuodong/xiangpumao/xiangpumao\",\"spine/xianshihuodong/xiangpumao_top/xiangpumao_top\",\"spine/xianshihuodong/xiariputao/xiariputao\",\"spine/xianshihuodong/xiawucha/xiawucha\",\"spine/xianshihuodong/xiujiqi_top/xiujiqi\",\"spine/xianshihuodong/xiujiqi_top/xiujiqi_top\",\"spine/xianshihuodong_TB/bawangliulian_TB/bawangliulian_TB\",\"spine/xianshihuodong_TB/bingdonggu_TB/bingdonggu_TB\",\"spine/xianshihuodong_TB/candouxiaochou_TB/candouxiaochou_TB\",\"spine/xianshihuodong_TB/dalihua_TB/dalihua_TB\",\"spine/xianshihuodong_TB/dazuihua_TB/dazuihua_TB\",\"spine/xianshihuodong_TB/dishuibinglian_TB/dishuibinglian_TB\",\"spine/xianshihuodong_TB/diyuhuolongguo_TB/diyuhuolongguo_TB\",\"spine/xianshihuodong_TB/eli_TB/eli_TB\",\"spine/xianshihuodong_TB/haidaiemo_TB/haidaiemo_TB\",\"spine/xianshihuodong_TB/houzhaitanxian_TB/houzhaitanxian_TB\",\"spine/xianshihuodong_TB/huojumu_TB/huojumu_TB\",\"spine/xianshihuodong_TB/jingjicao_TB/jingjicao_TB\",\"spine/xianshihuodong_TB/lengjingcao_TB/lengjingcao_TB\",\"spine/xianshihuodong_TB/lianou_TB/lianou_TB\",\"spine/xianshihuodong_TB/maopucao_TB/maopucao_TB\",\"spine/xianshihuodong_TB/meiguifashi_TB/meiguifashi_TB\",\"spine/xianshihuodong_TB/mogu_TB/mogu_TB\",\"spine/xianshihuodong_TB/nangua_TB/nangua_TB\",\"spine/xianshihuodong_TB/putao_TB/putao_TB\",\"spine/xianshihuodong_TB/sibadazhu_TB/sibadazhu_TB\",\"spine/xianshihuodong_TB/tiechuilan_TB/tiechuilan_TB\",\"spine/xianshihuodong_TB/xiangjiaochuanzhang_TB/xiangjiaochuanzhang_TB\",\"spine/xianshihuodong_TB/xiangpumao_TB/xiangpumao_TB\",\"spine/xianshihuodong_TB/youlinglajiao_TB/youlinglajiao_TB\",\"spine/xianshihuodong_TB/yumijiqiren_TB/yumijiqiren_TB\",\"spine/xianshileichong_TB/xianshileichong_TB\",\"spine/yaoqing/yaoqing\",\"spine/yaoqinghaoyou/yaoqinghaoyou\",\"spine/yaoqinghaoyou_TB/yaoqinghaoyou_TB\",\"spine/yingxiongshiyong_TB/yingxiongshiyong_TB\",\"spine/zhubeijing/zhubeijing\",\"spine/zhubeijing/zhubeijing_cao01\",\"spine/zhubeijing/zhubeijing_cao02\",\"spine/zhubeijing/zhubeijing_piaoye01\",\"spine/zhubeijing/zhubeijing_piaoye02\",\"spine/zhujiemianshu/zhujiemianshu\"]"
        // let arr2 = "[\"actors/monster/11000\",\"actors/monster/11001\",\"actors/monster/11002\",\"actors/monster/11003\",\"actors/monster/11004\",\"actors/monster/11005\",\"actors/monster/11006\",\"actors/monster/11007\",\"actors/monster/11008\",\"actors/monster/11009\",\"actors/monster/11010\",\"actors/monster/11011\",\"actors/monster/11012\",\"actors/monster/11013\",\"actors/monster/11014\",\"actors/monster/11015\",\"actors/monster/11016\",\"actors/monster/11017\",\"actors/monster/11018\",\"actors/monster/11019\",\"actors/monster/11020\",\"actors/monster/11021\",\"actors/monster/11022\",\"actors/monster/11023\",\"actors/monster/11024\",\"actors/monster/11025\",\"actors/monster/11026\",\"actors/monster/11027\",\"actors/monster/11028\",\"actors/monster/11029\",\"actors/monster/11030\",\"actors/monster/11031\",\"actors/monster/11032\",\"actors/monster/11033\",\"actors/monster/11034\",\"actors/monster/11035\",\"actors/monster/11036\",\"actors/monster/11037\",\"actors/monster/11038\",\"actors/monster/11039\",\"actors/monster/11040\",\"actors/monster/11041\",\"actors/monster/11042\",\"actors/monster/11043\",\"actors/monster/11044\",\"actors/monster/11045\",\"actors/monster/11046\",\"actors/monster/11047\",\"actors/monster/11048\",\"actors/monster/11049\",\"actors/monster/11050\",\"actors/monster/11051\",\"actors/monster/11052\",\"actors/monster/11053\",\"actors/monster/11054\",\"actors/monster/11055\",\"actors/monster/11056\",\"actors/monster/11057\",\"actors/monster/11058\",\"actors/monster/11100\",\"actors/monster/15000\",\"actors/monster/15001\",\"actors/monster/15002\",\"actors/monster/15003\",\"actors/monster/15004\",\"actors/monster/15005\",\"actors/monster/15006\",\"actors/monster/15007\",\"actors/monster/15008\",\"actors/monster/15009\",\"actors/monster/15010\",\"actors/monster/15011\",\"actors/monster/15012\",\"actors/monster/15013\",\"actors/monster/15014\",\"actors/monster/15015\",\"actors/monster/15016\",\"actors/monster/15017\",\"actors/monster/15018\",\"actors/monster/15019\",\"effect/boss/15020\",\"effect/boss/15021\",\"actors/monster/150211\",\"effect/boss/15022\",\"effect/boss/15023\",\"effect/boss/15024\",\"effect/boss/15025\",\"effect/boss/15026\",\"effect/boss/15027\",\"battle/ArenaBattleScene\",\"battle/ArenaSceneBG\",\"battle/BattlePlatform\",\"battle/BattleScene\",\"battle/BossTip\",\"battle/DefBattleScene\",\"battle/DefSceneBattleBG\",\"battle/MainSceneBG\",\"battle/MonsterCollider\",\"battle/MonsterColliderBoss\",\"battle/ProgressBar\",\"effect/blueheros/10330011\",\"effect/blueheros/10380011\",\"effect/blueheros/10380012\",\"effect/blueheros/10380013\",\"effect/blueheros/1038002\",\"effect/blueheros/10380031\",\"effect/blueheros/10380032\",\"effect/blueheros/10380033\",\"effect/blueheros/1038004\",\"effect/blueheros/1038005\",\"effect/blueheros/1038006\",\"effect/blueheros/10380071\",\"effect/blueheros/10380081\",\"effect/blueheros/10380082\",\"effect/blueheros/10380083\",\"effect/blueheros/10380091\",\"effect/blueheros/10380092\",\"effect/blueheros/10380101\",\"effect/blueheros/10380102\",\"effect/blueheros/10380111\",\"effect/blueheros/10380121\",\"effect/blueheros/10380122\",\"effect/blueheros/10380123\",\"effect/blueheros/10380131\",\"effect/blueheros/10380132\",\"effect/blueheros/10380133\",\"effect/blueheros/10380141\",\"effect/blueheros/10380142\",\"effect/blueheros/10380143\",\"effect/blueheros/10380151\",\"effect/blueheros/10380161\",\"effect/blueheros/10380162\",\"effect/blueheros/1038017\",\"effect/blueheros/10380171\",\"effect/blueheros/10380181\",\"effect/blueheros/10380182\",\"effect/blueheros/10380183\",\"effect/blueheros/10380191\",\"effect/blueheros/10380201\",\"effect/blueheros/10380202\",\"effect/blueheros/10380203\",\"effect/blueheros/10380204\",\"effect/blueheros/10380211\",\"effect/blueheros/10380212\",\"effect/blueheros/10380221\",\"effect/blueheros/10380231\",\"effect/blueheros/10380232\",\"effect/blueheros/10380233\",\"effect/buff/10380241\",\"effect/blueheros/10380242\",\"effect/blueheros/10380251\",\"effect/blueheros/10380252\",\"effect/blueheros/10380261\",\"effect/blueheros/10380262\",\"effect/blueheros/10380271\",\"effect/blueheros/10380272\",\"effect/blueheros/10380273\",\"effect/blueheros/10390011\",\"effect/blueheros/10390021\",\"effect/boss/15028\",\"effect/boss/15029\",\"effect/buff/1018001\",\"effect/buff/1019000\",\"effect/buff/1019001\",\"effect/buff/1019002\",\"effect/buff/10390001\",\"effect/buff/1043007\",\"effect/buff/10480051\",\"effect/buff/10480195\",\"effect/buff/1058002\",\"effect/buff/1058003\",\"effect/buff/1058004\",\"effect/buff/1058005\",\"effect/buff/1058006\",\"effect/buff/1058007\",\"effect/buff/1058008\",\"effect/buff/1058009\",\"effect/buff/1058010\",\"effect/buff/1058011\",\"effect/buff/1058012\",\"effect/buff/1058013\",\"effect/buff/1058014\",\"effect/buff/1058015\",\"effect/buff/1058016\",\"effect/buff/1058017\",\"effect/buff/1058018\",\"effect/greenheros/1028001\",\"effect/greenheros/1028002\",\"effect/greenheros/1028003\",\"effect/greenheros/10280041\",\"effect/greenheros/10280042\",\"effect/greenheros/10280043\",\"effect/greenheros/1028005\",\"effect/greenheros/10290001\",\"effect/greenheros/10290002\",\"effect/greenheros/10290003\",\"effect/greenheros/10290011\",\"effect/greenheros/10290012\",\"effect/greenheros/10290013\",\"effect/greenheros/10290021\",\"effect/greenheros/10290022\",\"effect/greenheros/10290023\",\"effect/greenheros/10290031\",\"effect/greenheros/10290041\",\"effect/greenheros/10290051\",\"effect/greenheros/10290052\",\"effect/greenheros/10290053\",\"effect/greenheros/10290054\",\"effect/greenheros/10290061\",\"effect/greenheros/10290062\",\"effect/greenheros/10290071\",\"effect/greenheros/10290072\",\"effect/greenheros/10290073\",\"effect/greenheros/10290101\",\"effect/greenheros/10290111\",\"effect/greenheros/10290112\",\"effect/greenheros/10290113\",\"effect/greenheros/10290121\",\"effect/greenheros/10290131\",\"effect/greenheros/10290141\",\"effect/greenheros/10290142\",\"effect/purpleheros/10430011\",\"effect/purpleheros/10430012\",\"effect/purpleheros/10430021\",\"effect/purpleheros/10430022\",\"effect/purpleheros/10430031\",\"effect/purpleheros/10430032\",\"effect/purpleheros/10430041\",\"effect/purpleheros/10430042\",\"effect/purpleheros/1043006\",\"effect/purpleheros/1043008\",\"effect/purpleheros/10480011\",\"effect/purpleheros/10480012\",\"effect/purpleheros/10480013\",\"effect/purpleheros/10480021\",\"effect/purpleheros/10480031\",\"effect/purpleheros/10480041\",\"effect/purpleheros/10480042\",\"effect/purpleheros/10480052\",\"effect/purpleheros/10480053\",\"effect/purpleheros/10480054\",\"effect/purpleheros/10480061\",\"effect/purpleheros/10480071\",\"effect/purpleheros/10480081\",\"effect/purpleheros/10480091\",\"effect/purpleheros/10480101\",\"effect/purpleheros/10480111\",\"effect/purpleheros/10480112\",\"effect/purpleheros/10480113\",\"effect/purpleheros/10480114\",\"effect/purpleheros/10480115\",\"effect/purpleheros/10480121\",\"effect/purpleheros/10480122\",\"effect/purpleheros/10480123\",\"effect/purpleheros/10480124\",\"effect/purpleheros/10480125\",\"effect/purpleheros/10480131\",\"effect/purpleheros/10480141\",\"effect/purpleheros/10480142\",\"effect/purpleheros/10480151\",\"effect/purpleheros/10480152\",\"effect/purpleheros/10480153\",\"effect/purpleheros/10480154\",\"effect/purpleheros/10480155\",\"effect/purpleheros/10480161\",\"effect/purpleheros/10480162\",\"effect/purpleheros/10480163\",\"effect/purpleheros/10480164\",\"effect/purpleheros/10480165\",\"effect/purpleheros/10480171\",\"effect/purpleheros/10480172\",\"effect/purpleheros/10480173\",\"effect/purpleheros/10480181\",\"effect/purpleheros/10480182\",\"effect/purpleheros/10480183\",\"effect/purpleheros/10480185\",\"effect/purpleheros/10480186\",\"effect/purpleheros/10480187\",\"effect/purpleheros/10480188\",\"effect/purpleheros/10480191\",\"effect/purpleheros/10480192\",\"effect/purpleheros/10480193\",\"effect/purpleheros/10480194\",\"effect/purpleheros/10480201\",\"effect/purpleheros/10480202\",\"effect/purpleheros/10480203\",\"effect/purpleheros/10480204\",\"effect/purpleheros/10480205\",\"effect/purpleheros/10480206\",\"effect/purpleheros/10480211\",\"effect/purpleheros/10480212\",\"effect/purpleheros/10480213\",\"effect/purpleheros/10480214\",\"effect/purpleheros/10480215\",\"effect/purpleheros/10480216\",\"effect/purpleheros/10480221\",\"effect/purpleheros/10480222\",\"effect/purpleheros/10480223\",\"effect/purpleheros/10480224\",\"effect/purpleheros/10490001\",\"effect/purpleheros/10490002\",\"effect/purpleheros/10490003\",\"effect/purpleheros/10490004\",\"effect/purpleheros/10490005\",\"effect/purpleheros/10490011\",\"effect/purpleheros/10490012\",\"effect/purpleheros/10490021\",\"effect/purpleheros/10490031\",\"effect/purpleheros/10490051\",\"effect/purpleheros/10490052\",\"effect/purpleheros/10490061\",\"effect/purpleheros/10490071\",\"effect/purpleheros/10490081\",\"effect/purpleheros/10490101\",\"effect/purpleheros/10490111\",\"effect/purpleheros/10490112\",\"effect/purpleheros/10490113\",\"effect/purpleheros/10490121\",\"effect/purpleheros/10490131\",\"effect/purpleheros/10490141\",\"effect/purpleheros/10490151\",\"effect/purpleheros/10490152\",\"effect/purpleheros/10490161\",\"effect/purpleheros/10490171\",\"effect/purpleheros/10490172\",\"effect/purpleheros/10490181\",\"effect/purpleheros/10490191\",\"effect/purpleheros/10490192\",\"effect/ui/1009000\",\"effect/ui/1009001\",\"effect/ui/1009002\",\"effect/ui/1009003\",\"effect/ui/1009004\",\"effect/ui/1009005\",\"effect/ui/1009006\",\"effect/ui/1009007\",\"effect/ui/1009008\",\"effect/ui/1009009\",\"effect/ui/1009010\",\"effect/ui/1009011\",\"effect/ui/1203001\",\"effect/ui/1203002\",\"effect/ui/1203003\",\"effect/ui/1208001\",\"effect/ui/1208002\",\"effect/ui/1208003\",\"effect/ui/1208004\",\"effect/ui/1208005\",\"effect/ui/1208006\",\"effect/ui/1208007\",\"effect/ui/1208008\",\"effect/ui/1208009\",\"effect/ui/1208010\",\"effect/ui/1208011\",\"effect/ui/1208012\",\"effect/ui/1208013\",\"effect/ui/1208014\",\"effect/ui/1208015\",\"effect/ui/1208016\",\"effect/ui/1208017\",\"effect/ui/1208018\",\"effect/ui/1208019\",\"effect/ui/1208020\",\"effect/ui/1208021\",\"effect/ui/12080210\",\"effect/ui/1208022\",\"effect/ui/1208023\",\"effect/ui/1208024\",\"effect/ui/1208025\",\"effect/ui/1208026\",\"effect/ui/1208027\",\"effect/ui/1208028\",\"effect/ui/1208029\",\"effect/ui/1208030\",\"effect/ui/1208031\",\"effect/ui/1208032\",\"effect/ui/1208033\",\"effect/ui/1208034\",\"effect/ui/1208035\",\"effect/ui/1208036\",\"effect/ui/1208037\",\"effect/ui/1208038\",\"effect/ui/1208039\",\"effect/ui/1208040\",\"effect/ui/1208041\",\"effect/ui/1208042\",\"effect/ui/1208043\",\"effect/ui/1208044\",\"effect/ui/1208045\",\"effect/ui/1208046\",\"effect/ui/1208047\",\"effect/ui/1208048\",\"effect/ui/1208049\",\"effect/ui/1208050\",\"effect/ui/1208051\",\"effect/ui/1208052\",\"effect/ui/1208053\",\"effect/ui/1208054\",\"effect/ui/1208055\",\"effect/ui/1208056\",\"effect/ui/1208057\",\"effect/ui/1208058\",\"effect/ui/1208059\",\"effect/ui/1208060\",\"effect/ui/1208061\",\"effect/ui/1208062\",\"effect/ui/1208063\",\"effect/ui/1208064\",\"effect/ui/1208065\",\"effect/ui/1208066\",\"effect/ui/1208067\",\"effect/ui/1208068\",\"effect/ui/1208069\",\"effect/ui/1208070\",\"effect/ui/1208071\",\"effect/ui/1208072\",\"effect/ui/1208073\",\"effect/ui/1208074\",\"effect/ui/1208075\",\"effect/ui/1208076\",\"effect/ui/1208077\",\"effect/ui/1208078\",\"effect/ui/1208079\",\"effect/ui/1208080\",\"effect/ui/1208081\",\"effect/ui/1208082\",\"effect/ui/1208083\",\"effect/ui/1208083_1\",\"effect/ui/1208084\",\"effect/ui/1208085\",\"effect/ui/1208086\",\"effect/ui/1208087\",\"effect/ui/1208088\",\"effect/ui/1208089\",\"effect/ui/1208090\",\"effect/ui/1208091\",\"effect/ui/1208092\",\"effect/ui/1208093\",\"effect/ui/1208094\",\"effect/ui/1208095\",\"effect/ui/1208096\",\"effect/ui/1208097\",\"effect/ui/1208098\",\"effect/ui/1208099\",\"effect/ui/1208100\",\"effect/ui/1208101\",\"effect/ui/1208102\",\"effect/ui/1208103\",\"effect/ui/1208104\",\"effect/ui/1208105\",\"effect/ui/1208106\",\"effect/ui/1208107\",\"effect/ui/1208108\",\"effect/ui/1208109\",\"effect/ui/1208110\",\"effect/ui/1208111\",\"effect/ui/1208112\",\"effect/ui/1208113\",\"effect/ui/1208114\",\"effect/ui/1208115\",\"effect/ui/1208116\",\"effect/ui/1208117\",\"effect/ui/1208118\",\"effect/ui/1208119\",\"effect/ui/1208120\",\"effect/ui/1208121\",\"effect/ui/1208122\",\"effect/ui/1208123\",\"effect/ui/1208124\",\"effect/ui/1208125\",\"effect/ui/1208126\",\"effect/ui/1208127\",\"effect/ui/1208128\",\"effect/ui/1208129\",\"effect/ui/1208130\",\"effect/ui/1208131\",\"effect/ui/1208132\",\"effect/ui/1208133\",\"effect/ui/1208134\",\"effect/ui/1208135\",\"effect/ui/1208136\",\"effect/ui/1208137\",\"effect/ui/1208138\",\"effect/ui/cell_race_1\",\"effect/ui/cell_race_2\",\"effect/ui/cell_race_3\",\"effect/ui/cell_race_4\",\"effect/ui/cell_race_5\",\"effect/ui/cell_race_6\",\"resources2/login/denglu\",\"skill_asset/BianFuBaoZa\",\"skill_asset/bingdonggu_1\",\"skill_asset/bingdonggu_2\",\"skill_asset/bingdonggu_3\",\"skill_asset/bingdonggu_4\",\"skill_asset/bingdonggu_5\",\"skill_asset/bingshuang_1\",\"skill_asset/bingshuang_2\",\"skill_asset/bingshuang_3\",\"skill_asset/bingshuang_jianse\",\"skill_asset/caisen_normal_fr1\",\"skill_asset/caisen_normal_fr2\",\"skill_asset/caisen_normal_fr3\",\"skill_asset/caisen_qigong\",\"skill_asset/cdxiaochou_bombfeidao\",\"skill_asset/cdxiaochou_bombpoke\",\"skill_asset/cdxiaochou_kongjubomb\",\"skill_asset/cdxiaochou_normal1\",\"skill_asset/cdxiaochou_normal2\",\"skill_asset/cdxiaochou_normal3\",\"skill_asset/ChongJiBo\",\"skill_asset/dalihua_1\",\"skill_asset/dalihua_2\",\"skill_asset/dalihua_3\",\"skill_asset/dalihua_bomb\",\"skill_asset/dalihua_fenlie_1\",\"skill_asset/dalihua_fenlie_2\",\"skill_asset/dalihua_fenlie_3\",\"skill_asset/dalihua_shenying\",\"skill_asset/daodan_1\",\"skill_asset/daodan_bomb_1\",\"skill_asset/DaShanDian\",\"skill_asset/DaZuiHuaHuoQiu\",\"skill_asset/DianRang\",\"skill_asset/dishuibinglian_1\",\"skill_asset/dishuibinglian_bingjian\",\"skill_asset/eli_1\",\"skill_asset/eli_jianci\",\"skill_asset/eli_nianye\",\"skill_asset/ermo_1\",\"skill_asset/ermo_hit_1\",\"skill_asset/FuChouHuoYan\",\"skill_asset/FuChouHuoYanFengBao\",\"skill_asset/GangFeng\",\"skill_asset/gongchengshi_1\",\"skill_asset/gongchengshi_2\",\"skill_asset/gongchengshi_3\",\"skill_asset/gongchengshi_daodan\",\"skill_asset/gongchengshi_hedan\",\"skill_asset/gongchengshi_hedan_bomb\",\"skill_asset/gongchengshi_hit_1\",\"skill_asset/gongchengshi_hit_ranshao\",\"skill_asset/gongchengshi_huoyan\",\"skill_asset/gongchengshi_ranshao\",\"skill_asset/haidaiemo_1\",\"skill_asset/haidaiemo_2\",\"skill_asset/haidaiemo_chanrao\",\"skill_asset/haidaiemo_kangfen\",\"skill_asset/haidaiemo_ray\",\"skill_asset/HaiLang\",\"skill_asset/huanyingzhu\",\"skill_asset/huimiegu_1\",\"skill_asset/huimiegu_2\",\"skill_asset/huixuanhua_1\",\"skill_asset/huixuanhua_3\",\"skill_asset/HuoJuFeng\",\"skill_asset/huoju_damadd_1\",\"skill_asset/huoju_damadd_2\",\"skill_asset/huoju_damadd_3\",\"skill_asset/huoju_yishang\",\"skill_asset/HuoLongGuo_1\",\"skill_asset/HuoYan\",\"skill_asset/HuoYanFengBao\",\"skill_asset/HuoYu\",\"skill_asset/jianguoqiang_1\",\"skill_asset/jianguoqiang_2\",\"skill_asset/JianRenXuanFeng\",\"skill_asset/jingjicao_1\",\"skill_asset/jingjicao_2\",\"skill_asset/jingjicao_chang_1\",\"skill_asset/jingjicao_chang_2\",\"skill_asset/jingjicao_hit_1\",\"skill_asset/jingjicao_hit_2\",\"skill_asset/jingjicao_xuebao\",\"skill_asset/JuFeng\",\"skill_asset/kfdou_jian\",\"skill_asset/kfdou_jian_track\",\"skill_asset/kfdou_normal1\",\"skill_asset/kfdou_normal2\",\"skill_asset/labi_1\",\"skill_asset/labi_2\",\"skill_asset/labi_hit_1\",\"skill_asset/labi_penhuo\",\"skill_asset/lianoumaikefeng_1\",\"skill_asset/lianoumaikefeng_2\",\"skill_asset/lianoumaikefeng_yinfu\",\"skill_asset/LianXiaoPengBaoPo\",\"skill_asset/LianXiaoPeng_1\",\"skill_asset/LianXiaoPeng_QuanTou\",\"skill_asset/lingjing_1\",\"skill_asset/lingjing_fdbomb\",\"skill_asset/lingjing_feidan\",\"skill_asset/lingjing_guangjian\",\"skill_asset/lingjing_ray\",\"skill_asset/LiuLianCi\",\"skill_asset/LiuLianFengBao\",\"skill_asset/LiuLian_1\",\"skill_asset/LuWeiHit\",\"skill_asset/LuWei_1\",\"skill_asset/meiguihuaban\",\"skill_asset/meigui_1\",\"skill_asset/meigui_hit_1\",\"skill_asset/meigui_shouhu\",\"skill_asset/meihuogu_1\",\"skill_asset/meihuogu_meihuo_1\",\"skill_asset/mubei_normal1\",\"skill_asset/mubei_normal2\",\"skill_asset/mubei_normal3\",\"skill_asset/munaili_1\",\"skill_asset/munaili_2\",\"skill_asset/munaili_3\",\"skill_asset/munaili_zuzou\",\"skill_asset/nangua_1\",\"skill_asset/putaoqiu_1\",\"skill_asset/putaoqiu_2\",\"skill_asset/putaoqiu_3\",\"skill_asset/PuTaoZhi\",\"skill_asset/QiGongBo\",\"skill_asset/ShanDianQiu\",\"skill_asset/ShanXIngZuoZi\",\"skill_asset/ShengGuangZhiLi\",\"skill_asset/shilaimu_1\",\"skill_asset/shilaimu_2\",\"skill_asset/shilaimu_3\",\"skill_asset/shuilian_1\",\"skill_asset/sibadazhu_1\",\"skill_asset/TieChuiLan_1\",\"skill_asset/toudanshou_1\",\"skill_asset/toudanshou_2\",\"skill_asset/toudanshou_3\",\"skill_asset/wogua_1\",\"skill_asset/wogua_2\",\"skill_asset/xiangmugongshou_guntong1\",\"skill_asset/xiangmugongshou_guntong2\",\"skill_asset/xiangmugongshou_normal1\",\"skill_asset/xiangmugongshou_normal2\",\"skill_asset/xiangpumao_1\",\"skill_asset/xiangpumao_julang\",\"skill_asset/xianrenzhang_1\",\"skill_asset/xianrenzhang_2\",\"skill_asset/xianrenzhang_3\",\"skill_asset/xitiehua_1\",\"skill_asset/xitiehua_2\",\"skill_asset/xitiehua_3\",\"skill_asset/xitiehua_bomb_1\",\"skill_asset/xjchanzhang_1\",\"skill_asset/xjchuanzhang_bomb\",\"skill_asset/xjchuanzhang_chuanmao\",\"skill_asset/yezibaolei_1\",\"skill_asset/yezibaolei_2\",\"skill_asset/yezibaolei_3\",\"skill_asset/yingtaodilei\",\"skill_asset/yingtaozhadan_1\",\"skill_asset/yingtaozhadan_2\",\"skill_asset/yingtaozhadan_3\",\"skill_asset/yingtaozhadan_hit_1\",\"skill_asset/yingtaozhadan_hit_2\",\"skill_asset/YiQunBianFu\",\"skill_asset/youlinglajiao_1\",\"skill_asset/youlinglajiao_bomb\",\"skill_asset/youlinglajiao_mishapebomb\",\"skill_asset/youlinglajiao_tenshapebomb\",\"skill_asset/youyumogu_1\",\"skill_asset/youyumogu_2\",\"skill_asset/yumizi\",\"skill_asset/yumi_1\",\"skill_asset/yumi_2\",\"skill_asset/yumi_hit\",\"spine/baicai/baicai\",\"spine/baoxianxiang/baoxianxiang\",\"spine/card/card\",\"spine/choujiang_TB/choujiang_TB\",\"spine/clock/clocks\",\"spine/coin/coin\",\"spine/core_crisis_box0\",\"spine/core_crisis_box1\",\"spine/core_crisis_box2\",\"spine/cunqianguan/cunqianguan\",\"spine/diaoyuzhanling/diaoyuzhanling\",\"spine/dongxue/dongxue\",\"spine/duanxian/duanxian\",\"spine/fish/55001\",\"spine/fish/55002\",\"spine/fish/55003\",\"spine/fish/55004\",\"spine/fish/55005\",\"spine/fish/55006\",\"spine/fish/55007\",\"spine/fish/55008\",\"spine/fish/55009\",\"spine/fish/55010\",\"spine/fish/55011\",\"spine/fish/55012\",\"spine/fish/55013\",\"spine/fish/55014\",\"spine/fish/55015\",\"spine/fish/55016\",\"spine/fish/55017\",\"spine/fish/55018\",\"spine/fish/55019\",\"spine/fish/55020\",\"spine/fish/55021\",\"spine/fish/55022\",\"spine/fish/55023\",\"spine/fish/55024\",\"spine/fish/55025\",\"spine/fish/55026\",\"spine/fish/55027\",\"spine/fish/55028\",\"spine/fish/55029\",\"spine/fish/55030\",\"spine/fish/55031\",\"spine/fish/55032\",\"spine/fish/55033\",\"spine/fish/55034\",\"spine/fish/55035\",\"spine/fish/55036\",\"spine/fish/55037\",\"spine/fish/55038\",\"spine/fish/55039\",\"spine/fish/55040\",\"spine/fish/55041\",\"spine/fish/55042\",\"spine/fish/55043\",\"spine/fish/55044\",\"spine/fish/55045\",\"spine/fish/55046\",\"spine/fish/55047\",\"spine/fish/55048\",\"spine/fish/55049\",\"spine/fish/55050\",\"spine/fish/55051\",\"spine/fish/55052\",\"spine/fish/55053\",\"spine/fish/55054\",\"spine/fish/55055\",\"spine/fish/55056\",\"spine/fish/55057\",\"spine/fish/55058\",\"spine/fish/55059\",\"spine/fish/55060\",\"spine/fish/55061\",\"spine/fish/55062\",\"spine/fish/55063\",\"spine/fish/55064\",\"spine/fish/55065\",\"spine/fish/55066\",\"spine/fish/55067\",\"spine/fish/55068\",\"spine/fish/55069\",\"spine/fish/55070\",\"spine/fish/55071\",\"spine/fish/55072\",\"spine/fish/55073\",\"spine/fish/55074\",\"spine/fish/55075\",\"spine/fish/55076\",\"spine/fish/55077\",\"spine/fish/55078\",\"spine/fish/55079\",\"spine/fish/55080\",\"spine/fish/55081\",\"spine/fish/55082\",\"spine/fish/55083\",\"spine/fish/55084\",\"spine/fish/55085\",\"spine/fish/55086\",\"spine/fish/55087\",\"spine/fish/55088\",\"spine/fish/55089\",\"spine/fish/55090\",\"spine/fish/55091\",\"spine/fish/55092\",\"spine/fish/55093\",\"spine/fish/55094\",\"spine/fish/55095\",\"spine/fish/55096\",\"spine/fish/55097\",\"spine/fish/55098\",\"spine/fish/55099\",\"spine/fish/55100\",\"spine/fuhuo/fuhuo\",\"spine/gengzhongri/gengzhongri_TB\",\"spine/gengzhongri/gengzhongri_top\",\"spine/houzhaitanxian/houzhaitanxian\",\"spine/huangjinTXZ/huangjinTXZ\",\"spine/huayuan/diaoyu_out\",\"spine/huayuan/kuangdong_out\",\"spine/huayuan/lijinglibao_TB\",\"spine/huayuan/lingjianlibao\",\"spine/huayuan/nongchang_out\",\"spine/huayuan/taren_shang\",\"spine/huayuan/taren_youxia\",\"spine/huayuan/yanjiusuo_in\",\"spine/huayuan/yanjiusuo_out\",\"spine/jiangshichongchongchong/jiangshichongchongchong\",\"spine/jiangshichongchongchong/jiangshichongchongchong_top\",\"spine/jianianhua/jianianhua\",\"spine/jiantou_TB/jiantou_TB\",\"spine/xianshihuodong/jingjicao/jingjicao\",\"spine/jiyindingxianglibao_TB/jiyindingxianglibao_TB\",\"spine/jiyinxinshoulibao/jiyinxinshoulibao\",\"spine/jiyinxinshoulibao_TB/jiyinxinshoulibao_TB\",\"spine/jiyinyindao_TB/jiyinyindao_TB\",\"spine/xianshihuodong_TB/kafeidou_TB/kafeidou_TB\",\"spine/kuangdongzhanling/kuangdongzhanling\",\"spine/libao/chengzhanglibao_01\",\"spine/libao/chengzhanglibao_02\",\"spine/libao/chengzhanglibao_03\",\"spine/libao/chengzhanglibao_04\",\"spine/libao/chengzhanglibao_05\",\"spine/libao/chengzhanglibao_06\",\"spine/libao/chengzhanglibao_07\",\"spine/xinshoulibao/xinshoulibao\",\"spine/libaohuizong/libaohuizong\",\"spine/lihe/lihe\",\"spine/xianshihuodong/meiguifashi/meiguifashi\",\"spine/mianguanggao/mianguanggao\",\"spine/mianguanggao_1/mianguanggao_1\",\"spine/mowangzhanling/mowangzhanling\",\"spine/pig/pig\",\"spine/PVP/PVP-pass\",\"spine/PVP/PVP-pipeidao\",\"spine/PVP/PVP-zd\",\"spine/PVP/PVP_libao\",\"spine/PVP/PVP_pipei\",\"spine/PVP/PVP_shop\",\"spine/PVP/PVP_TB\",\"spine/qiri/qiri\",\"spine/qirishishi/qirishishi_tc\",\"spine/qirishishi/qirishishi_top\",\"spine/qirishishi_TB/qirishishi_TB\",\"spine/qizi/qizi\",\"spine/shenyuanhuiyi/shenyuanhuiyi\",\"spine/xianshihuodong_TB/shenyuanhuiyi_TB/shenyuanhuiyi_TB\",\"spine/shenyuanshengdian/shenyuanshengdian\",\"spine/shouchong/shouchong\",\"spine/shoujijiangli/shoujijiangli\",\"spine/shouweihouyuan/shouweihouyuan_BOX\",\"spine/shouweihouyuan/shouweihouyuan_tc\",\"spine/shouweihouyuan/shouweihouyuan_top\",\"spine/tiaozhanjuanzhou/tiaozhanjuanzhou\",\"spine/tongxingzheng/tongxingzheng\",\"spine/xianshihuodong/lianxiaopeng_top/dalihua\",\"spine/xianshihuodong/dalihua_top/dalihua_top\",\"spine/xianshihuodong/dazuihua/dazuihua\",\"spine/xianshihuodong/dazuihua_TOP/dazuihua_TOP\",\"spine/xianshihuodong/diyuhuolongguo/diyuhuolongguo\",\"spine/xianshihuodong/diyuhuolongguo_top/diyuhuolongguo_top\",\"spine/xianshihuodong/eli/eli\",\"spine/xianshihuodong/eli_top/eli_top\",\"spine/xianshihuodong/kuangdongqiyuji/kuangdongqiyuji\",\"spine/xianshihuodong/kuangdongqiyuji_top/kuangdongqiyuji_top\",\"spine/xianshihuodong/lengjingcao/lengjingcao\",\"spine/xianshihuodong/lengjingcao_top/lengjingcao_top\",\"spine/xianshihuodong/lianxiaopeng/lianxiaopeng\",\"spine/xianshihuodong/lianxiaopeng_top/lianxiaopeng_top\",\"spine/xianshihuodong/meiguifashi_top/meiguifashi_top\",\"spine/xianshihuodong/ningmengsanzhan/ningmengsanzhan\",\"spine/xianshihuodong/ningmengsanzhan_top/ningmengsanzhan_top\",\"spine/xianshihuodong/putaodan/putaodan\",\"spine/xianshihuodong/putaodan_top/putaodan_top\",\"spine/xianshihuodong/tiechuilan/tiechuilan\",\"spine/xianshihuodong/tiechuilan_top/tiechuilan_top\",\"spine/xianshihuodong/xiangjiaochuanzhang/xiangjiaochuanzhang\",\"spine/xianshihuodong/xiangjiaochuanzhang_top/xiangjiaochuanzhang_top\",\"spine/xianshihuodong/xiangmugongshou/xiangmugongshou\",\"spine/xianshihuodong/xiangmugongshou_top/xiangmugongshou_top\",\"spine/xianshihuodong/xiangpumao/xiangpumao\",\"spine/xianshihuodong/xiangpumao_top/xiangpumao_top\",\"spine/xianshihuodong/xiariputao/xiariputao\",\"spine/xianshihuodong/xiawucha/xiawucha\",\"spine/xianshihuodong/xiujiqi_top/xiujiqi\",\"spine/xianshihuodong/xiujiqi_top/xiujiqi_top\",\"spine/xianshihuodong_TB/bawangliulian_TB/bawangliulian_TB\",\"spine/xianshihuodong_TB/bingdonggu_TB/bingdonggu_TB\",\"spine/xianshihuodong_TB/candouxiaochou_TB/candouxiaochou_TB\",\"spine/xianshihuodong_TB/dalihua_TB/dalihua_TB\",\"spine/xianshihuodong_TB/dazuihua_TB/dazuihua_TB\",\"spine/xianshihuodong_TB/dishuibinglian_TB/dishuibinglian_TB\",\"spine/xianshihuodong_TB/diyuhuolongguo_TB/diyuhuolongguo_TB\",\"spine/xianshihuodong_TB/eli_TB/eli_TB\",\"spine/xianshihuodong_TB/haidaiemo_TB/haidaiemo_TB\",\"spine/xianshihuodong_TB/houzhaitanxian_TB/houzhaitanxian_TB\",\"spine/xianshihuodong_TB/huojumu_TB/huojumu_TB\",\"spine/xianshihuodong_TB/jingjicao_TB/jingjicao_TB\",\"spine/xianshihuodong_TB/lengjingcao_TB/lengjingcao_TB\",\"spine/xianshihuodong_TB/lianou_TB/lianou_TB\",\"spine/xianshihuodong_TB/maopucao_TB/maopucao_TB\",\"spine/xianshihuodong_TB/meiguifashi_TB/meiguifashi_TB\",\"spine/xianshihuodong_TB/mogu_TB/mogu_TB\",\"spine/xianshihuodong_TB/nangua_TB/nangua_TB\",\"spine/xianshihuodong_TB/putao_TB/putao_TB\",\"spine/xianshihuodong_TB/sibadazhu_TB/sibadazhu_TB\",\"spine/xianshihuodong_TB/tiechuilan_TB/tiechuilan_TB\",\"spine/xianshihuodong_TB/xiangjiaochuanzhang_TB/xiangjiaochuanzhang_TB\",\"spine/xianshihuodong_TB/xiangpumao_TB/xiangpumao_TB\",\"spine/xianshihuodong_TB/youlinglajiao_TB/youlinglajiao_TB\",\"spine/xianshihuodong_TB/yumijiqiren_TB/yumijiqiren_TB\",\"spine/xianshileichong_TB/xianshileichong_TB\",\"spine/yaoqing/yaoqing\",\"spine/yaoqinghaoyou/yaoqinghaoyou\",\"spine/yaoqinghaoyou_TB/yaoqinghaoyou_TB\",\"spine/yingxiongshiyong_TB/yingxiongshiyong_TB\",\"spine/zhubeijing/zhubeijing\",\"spine/zhubeijing/zhubeijing_cao01\",\"spine/zhubeijing/zhubeijing_cao02\",\"spine/zhubeijing/zhubeijing_piaoye01\",\"spine/zhubeijing/zhubeijing_piaoye02\",\"spine/zhujiemianshu/zhujiemianshu\"]"
        // let pathArr = JSON.parse(arr2);
        // let pathArr2 = JSON.parse(arr);
        // // try {

        // assetManager.loadBundle('resources', (err, bundle) => {
        //     if (err) {
        //         console.error('Failed to load bundle:', err);
        //         return;
        //     }

        //     let cb = (path: string) => {
        //         if (pathArr.length <= 0) {
        //             return;
        //         }
        //         this.viewNode.loader3d.node.removeAllChildren();
        //         // return new Promise((resolve, reject) => {
        //         //     bundle.load(path, sp.SkeletonData, (err, skeletonData) => {
        //         //         if (err) {
        //         //             console.error('Failed to load SkeletonData from bundle:', err);
        //         //             return;
        //         //         }

        //         //         let animationName = Object.keys(skeletonData.getAnimsEnum())[1];
        //         //         animationName && (this.viewNode.loader3d.animationName = animationName);
        //         //         this.viewNode.loader3d.setSpine(skeletonData, new Vec2(0.5, 0.5));
        //         //         setTimeout(async () => {
        //         //             await cb(pathArr.shift());
        //         //         }, 200);
        //         //         resolve(true);
        //         //     });
        //         // });

        //         return new Promise((resolve, reject) => {
        //             console.log("路径", path);
        //             bundle.load(path, Prefab, (err, obj: Prefab) => {
        //                 if (err) {
        //                     console.error('Failed to load SkeletonData from bundle:', err);
        //                     return;
        //                 }

        //                 let node = instantiate(obj);

        //                 const SB = node.getComponent(SpSkeletonBase);
        //                 if (SB) {
        //                     SB.enabled = true;
        //                     let skeletonData = node.getComponent(SpSkeletonBase).skeletonData;
        //                     let animationName = Object.keys(skeletonData.getAnimsEnum())[1];
        //                     animationName && (this.viewNode.loader3d.animationName = animationName);
        //                 }

        //                 this.viewNode.loader3d.node.addChild(node);
        //                 setTimeout(async () => {
        //                     await cb(pathArr.shift());
        //                 }, 200);
        //                 resolve(true);
        //             });
        //         });
        //     }
        //     cb(pathArr.shift());
        // });


        // // } catch (err) {
        // //     console.log(err);
        // // }

        // // try {

        // assetManager.loadBundle('res', (err, bundle) => {
        //     if (err) {
        //         console.error('Failed to load bundle:', err);
        //         return;
        //     }

        //     let cb2 = (path: string) => {
        //         if (pathArr2.length <= 0) {
        //             return;
        //         }
        //         this.viewNode.loader3d2.freeSpine();
        //         return new Promise((resolve, reject) => {
        //             bundle.load(path, sp.SkeletonData, (err, skeletonData) => {
        //                 if (err) {
        //                     console.error('Failed to load SkeletonData from bundle:', err);
        //                     return;
        //                 }

        //                 let animationName = Object.keys(skeletonData.getAnimsEnum())[1];
        //                 animationName && (this.viewNode.loader3d2.animationName = animationName);
        //                 this.viewNode.loader3d2.setSpine(skeletonData, new Vec2(0.5, 0.5));
        //                 setTimeout(async () => {
        //                     await cb2(pathArr2.shift());
        //                 }, 200);
        //                 resolve(true);
        //             });
        //         });
        //     }
        //     cb2(pathArr2.shift());

        // });


        // } catch (err) {
        //     console.log(err);
        // }

    }

    private addRemindCare(mod_key: number, obj: RedPoint) {
        let self = this;
        let group = ModManger.TabMod(mod_key);
        this.handleCollector.Add(RemindGroupMonitor.Create(group, self.freshRedPoint.bind(self, group, obj)));
    }

    private freshRedPoint(group: any, obj: RedPoint) {
        let num = RemindCtrl.Inst().GetGroupNum(group);
        obj.SetNum(num);
    }

    // private FlushOtherRedPoint() {
    //     let red1 = RemindCtrl.Inst().GetRemindNum(Mod.Mail.View);
    //     let red2 = RemindCtrl.Inst().GetRemindNum(Mod.InviteFriend.View);
    //     let num = red1 + red2;
    //     this.viewNode.OtherRed.SetNum(num);
    // }

    InitUI() {
        this.FlushRoleInfo()
        ChannelAgent.FPS = PackageData.Inst().g_UserInfo.gameFPS.main;
    }

    FlushRoleInfo() {

        this.ActBtnShow();
        this.ActBtnBlue(true);
        this.FlushHeroListInfo()
        this.FlushActShow();
        this.FlushAdInfo();
        // this.viewNode.ButtonRoleInfo.FlushShow();
        this.FlushHead();
    }

    FlushRoleAvater() {
        // this.viewNode.ButtonRoleInfo.FlushShow();
        this.FlushHead();
    }

    FlushHead() {
        const role_info = RoleData.Inst().InfoRoleInfo;
        UH.SetText(this.viewNode.NameShow, RoleData.Inst().InfoRoleName);
        this.viewNode.HeadShow.SetData(new AvatarData(role_info.headPicId, role_info.level, role_info.headChar, role_info.headFrame))
    }

    ActBtnShow() {
        let is_taskOpen = FunOpen.Inst().GetFunIsOpen(Mod.Task.View);
        this.viewNode.BtnTask.visible = is_taskOpen.is_open;
    }

    ActBtnBlue(init: boolean = false) {
        if (!init)
            AudioManager.Inst().PlayUIAudio(AudioTag.TongYongClick);
        if (this.fightCtrler.selectedIndex == 0) {
            // let is_MainFBOpen = FunOpen.Inst().GetFunIsOpen(Mod.Main.EverydayFB);
            // let is_ActivityCombatOpen = FunOpen.Inst().GetFunIsOpen(Mod.ActivityCombat.View);
            // let co1 = FunOpen.Inst().GetFunOpenModCfg(Mod.Main.EverydayFB);
            // let co2 = FunOpen.Inst().GetFunOpenModCfg(Mod.ActivityCombat.View);
            // let barrier = RoleData.Inst().InfoMainSceneLevel;
            // if (barrier <= 3) {
            //     this.viewNode.BtnBlueL.visible = is_MainFBOpen.is_open;
            //     this.viewNode.BtnBlueR.visible = is_ActivityCombatOpen.is_open
            // } else {
            //     this.viewNode.BtnBlueL.visible = true
            //     this.viewNode.BtnBlueR.visible = true
            // }
            // this.viewNode.BtnBlueL.FlushShow(!is_MainFBOpen.is_open && barrier > 3, co1 ? co1.open_barrier : 0)
            // this.viewNode.BtnBlueR.FlushShow(!is_ActivityCombatOpen.is_open && barrier > 3, co2 ? co2.open_barrier : 0)
        } else {
            // this.viewNode.BtnBlueR.visible = true;
        }
    }

    FlushHeroListInfo() {
        if (!ViewManager.Inst().IsOpen(MainView)) {
            return;
        }
        let isShow = HeroData.Inst().GetDamageOpen()
        this.viewNode.GpDamage.visible = isShow
        const damage = HeroData.Inst().GetAllHeroDamage();
        UH.SetText(this.viewNode.Damage, `+${damage / 100}%`)
        this.heroListData = RoleData.Inst().InfoRoleFightList;
        // this.viewNode.HeroList.numItems = this.heroListData.length
        this.viewNode.HeroList2.numItems = this.heroListData.length
    }

    private renderListItem(index: number, item: MainViewHeroItem) {
        item.ItemIndex(index, true);
        item.SetData(this.heroListData[index]);
    }

    private renderListItem2(index: number, item: MainViewHeroItem2) {
        item.ItemIndex(index, false);
        item.SetData(this.heroListData[index]);
    }

    FlushActShow() {
        let actLeft = ActivityData.Inst().GetMainActList(0, 1);
        let actRight = ActivityData.Inst().GetMainActList(0, 2);
        this.viewNode.BtnActLeft.visible = false// actLeft.length > 4
        this.viewNode.BtnActRight.visible = false// actRight.length > 4

        // // FIX:lip 屏蔽
        // this.viewNode.ActListLeft.visible =false;
        // this.viewNode.ActListRight1.visible =false;
        // this.viewNode.ActListRight2.visible =false;
        // this.viewNode.ActListLeft.SetData(0 == this.actLeftCtrler.selectedIndex ? actLeft : actLeft.slice(0, 4))
        // this.viewNode.ActListRight1.SetData(actRight.slice(0, 4))
        // this.viewNode.ActListRight2.SetData(actRight.slice(4, actRight.length))
        this.listData = actLeft.concat(actRight);
        this.viewNode.ActList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.ActList.numItems = this.listData.length;
        this.viewNode.ActList.resizeToFit(3);

        if (1 == this.actLeftCtrler.selectedIndex) {
            let actItem = actLeft.slice(4, actLeft.length);
            let num = 0;
            for (let i = 0; i < actItem.length; i++) {
                let group = ModManger.TabMod(actItem[i].mod_key);
                num += RemindCtrl.Inst().GetGroupNum(group);
            }
            this.viewNode.BtnActLeft.freshRedRedPoint(num);
        } else {
            this.viewNode.BtnActLeft.freshRedRedPoint(0);
        }
        if (1 == this.actRightCtrler.selectedIndex) {
            let actItem = actRight.slice(4, actRight.length);
            let num = 0;
            for (let i = 0; i < actItem.length; i++) {
                let group = ModManger.TabMod(actItem[i].mod_key);
                num += RemindCtrl.Inst().GetGroupNum(group);
            }
            this.viewNode.BtnActRight.freshRedRedPoint(num);
        } else {
            this.viewNode.BtnActRight.freshRedRedPoint(0);
        }
    }
    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    FlushAdInfo() {
        let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.main_ad)
        let co = RoleData.Inst().CfgAdTypeSeq(AdType.main_ad)
        let ad_reward = MainFBData.Inst().InfoAdReward
        this.viewNode.BtnAd.visible = false// RoleData.Inst().IsCanAD(AdType.main_ad, false) && (!info || info.todayCount < co.ad_param) && !ad_reward
        this.viewNode.ItemAd.visible = ad_reward
    }

    FlushFightIndex() {
        this.fightCtrler.selectedIndex = MainData.Inst().FightIndex

        let gradient = this.viewNode.bg._content.addComponent(CocSpriteGradient);
        gradient.setMaterialName(0 == this.fightCtrler.selectedIndex ? "mat_mainview" : "mat_challenge");
    }

    OnClickTask() {
        ViewManager.Inst().OpenView(TaskView)
    }

    OnClickOther() {
        ViewManager.Inst().OpenView(MainOtherView)
    }

    OnClickStart() {
        //PublicPopupCtrl.Inst().Center(this.fightCtrler.selectedIndex ? "每日挑战" : "主线关卡")
        if (0 == this.fightCtrler.selectedIndex) {
            BattleCtrl.Inst().EnterBattle(MainFBData.Inst().SelId, SceneType.Main)
        } else {
            let co = MainFBData.Inst().CfgDailyChallengeDataChallengeBossInfo();
            BattleCtrl.Inst().EnterBattle(co.barrier_id, SceneType.DayChallenge)
        }
    }

    OnClickAd() {
        // PublicPopupCtrl.Inst().Center("播放广告")
        ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.main_ad), "");
    }

    OnClickBlueL() {
        let is_MainFBOpen = FunOpen.Inst().GetFunIsOpen(Mod.Main.EverydayFB);
        if (!is_MainFBOpen.is_open) {
            let co = FunOpen.Inst().GetFunOpenModCfg(Mod.Main.EverydayFB);
            PublicPopupCtrl.Inst().Center(TextHelper.Format(Language.MainFB.LockShow, co.open_barrier))
            return
        }
        let gradient = this.viewNode.bg._content.addComponent(CocSpriteGradient);
        gradient.setMaterialName("mat_challenge");
        MainFBData.Inst().ClearFirstRemind();
        this.fightCtrler.selectedIndex = 1
        this.FlushHeroListInfo();
        this.ActBtnBlue();
    }

    OnClickBlueR() {
        AudioManager.Inst().PlayUIAudio(AudioTag.TongYongClick);
        let gradient = this.viewNode.bg._content.addComponent(CocSpriteGradient);
        gradient.setMaterialName("mat_mainview");
        if (0 == this.fightCtrler.selectedIndex) {
            let is_ActivityCombatOpen = FunOpen.Inst().GetFunIsOpen(Mod.ActivityCombat.View);
            if (!is_ActivityCombatOpen.is_open) {
                let co = FunOpen.Inst().GetFunOpenModCfg(Mod.ActivityCombat.View);
                PublicPopupCtrl.Inst().Center(TextHelper.Format(Language.MainFB.LockShow, co.open_barrier))
                return
            }
            // PublicPopupCtrl.Inst().Center("打开活动关卡界面")
            ViewManager.Inst().OpenView(ActivityCombatView)
        } else {
            this.fightCtrler.selectedIndex = 0
            this.FlushHeroListInfo();
            this.ActBtnBlue();
        }
    }

    OnClickActLeft() {
        this.FlushActShow()
    }

    OnClickActRight() {
        this.FlushActShow()
    }

    OnClickActItem(item: MainViewActItem) {
        ViewManager.Inst().OpenViewByKey(item.ModKey(), { pos: item.node.worldPosition, data: item.data.param })
    }

    OnClickRoleInfo() {
        ViewManager.Inst().OpenView(RoleInfoView)
    }

    CloseCallBack(): void {
        ChannelAgent.Inst().hideDouYinKfBtn(false);
    }

    OpenCallBack(): void {
        this.viewNode.backgrand.setSize(this["screenShowSize"].x, this["screenShowSize"].y);
        ChannelAgent.Inst().showDouYinKfBtn();
    }

    OnClickChat() {
        ViewManager.Inst().OpenView(ChatView);
    }
}

// class MainActData {
//     index: number;
//     icon: string;
//     type: number;
//     mod_key: number;
//     act_type?: number;
//     effect?: string;
//     effectScale?: number;
//     FunViewShow?: boolean;//弹出功能解锁
// }

// let mainActLeft: MainActData[] = [
//     { index: 0, type: 2, icon: "TuBiaoKaPai", mod_key: Mod.SevenDayHero.View, effect: "card/card", FunViewShow: true },
//     { index: 1, type: 2, icon: "TuBiaoMiaoBiao", mod_key: Mod.PlaceReturns.View, effect: "clock/clocks", FunViewShow: true },
//     { index: 2, type: 2, icon: "TuBiaoJiJin", mod_key: Mod.GrowPass.View, effect: "coin/coin", FunViewShow: true },
//     { index: 3, type: 2, icon: "TuBiao7RiQian", mod_key: Mod.OpenServiceSevenDay.View, FunViewShow: true },
//     { index: 4, type: 2, act_type: 2054, icon: "TuBiaoHuiHeHuoDong", mod_key: Mod.RoundActivity.View },
//     { index: 5, type: 2, icon: "TuBiaoGuangGao", mod_key: Mod.AdFree.View, effect: "mianguanggao_1/mianguanggao_1" },

// ]

// let mainActRight: MainActData[] = [
//     { index: 0, type: 1, icon: "TuBiaoXiaoZhu", mod_key: Mod.SavingPot.View, effect: "pig/pig", FunViewShow: true },
//     { index: 1, type: 1, act_type: 2052, icon: "TuBiaoNenYa", mod_key: Mod.GrowUpGift.View },
//     { index: 2, type: 1, act_type: 2056, icon: "TuBiaoDeepCeleGift", mod_key: Mod.DeepCele.View },
//     { index: 3, type: 1, act_type: 2049, icon: "TuBiaoLiBao", mod_key: Mod.InviteFriend.View, effect: "yaoqing/yaoqing" },
//     { index: 4, type: 1, icon: "TuBiaoShouChong", mod_key: Mod.FirstCharge.View, effect: "shouchong/shouchong" },
//     { index: 5, type: 1, act_type: 2051, icon: "TuBiaoLiBao", mod_key: Mod.NewPack.View, effect: "xinshoulibao/xinshoulibao", effectScale: 0.6 },
//     { index: 6, type: 1, act_type: 2055, icon: "TuBiaoDeepCele", mod_key: Mod.DeepCeleGift.View },
//     { index: 7, type: 1, icon: "TuBiaoZhangJiePaiHang", mod_key: Mod.Rank.View },
//     { index: 8, type: 1, act_type: 2061, icon: "TuBiaoLiBao", mod_key: Mod.HouZai.View, effect: "xianshihuodong_TB/houzhaitanxian_TB/houzhaitanxian_TB" },
//     { index: 9, type: 1, icon: "JiYinYinDaoTuBiao", mod_key: Mod.GeneTask.View },
//     { index: 10, type: 1, act_type: 2065, icon: "XianShiLeiChong", mod_key: Mod.LimitedRecharge.View },
//     { index: 11, type: 1, act_type: 2063, icon: "7RiHuoShiShiZhengKa", mod_key: Mod.SevenDaysPack.View },
//     { index: 12, type: 1, act_type: 2064, icon: "TuBiaoLiBao", mod_key: Mod.GeneGift.View },

// ]

class MainViewStartButton extends BaseItemGB {
    protected viewNode = {
        GpMask: <fgui.GGroup>null,
        MaskShow: <fgui.GTextField>null
    };

    FlushShow(show_mask: boolean, open_barrier: number) {
        this.viewNode.GpMask.visible = show_mask
        UH.SetText(this.viewNode.MaskShow, TextHelper.Format(Language.MainFB.LockShowLine, open_barrier))
    }
}

export class MainViewHeroItem extends BaseItemGB {
    itemIndex: number
    guideShow: boolean
    private indexCtrler: fgui.Controller
    private heroMode: HeroDataModel;


    protected viewNode = {
        BgSp: <fgui.GLoader>null,
        IconSp: <EGLoader>null,
        LevelShow: <fgui.GTextField>null,
        ProgressShow: <MainViewHeroProgress>null,
        MaxShow: <fgui.GImage>null,
        GpNum: <fgui.GGroup>null,
    };

    protected onConstruct(): void {
        super.onConstruct();

        this.indexCtrler = this.getController("IndexCtrl");
        this.onClick(this.OnClickItem, this);
    }

    public SetData(data: number | HeroDataModel) {
        super.SetData(data)
        if (data instanceof (HeroDataModel)) {
            if (data.hero_id == 0) return this.visible = false;
            this.heroMode = data;
        } else {
            if (data == 0) return this.visible = false;
            this.heroMode = new HeroDataModel(data);
        }
        this.visible = true;
        UH.SetText(this.viewNode.LevelShow, TextHelper.Format(Language.Hero.MainItem.LevelShow, this.heroMode.level))
        UH.SpriteName(this.viewNode.BgSp, "Main", `MainHero${this.heroMode.data.hero_color}${this.itemIndex > 1 ? 2 : 1}`);
        UH.SetIcon(this.viewNode.IconSp, this.heroMode.hero_id, ICON_TYPE.HEROSMAIN)
        this.viewNode.GpNum.visible = false// this.guideShow

        if (this.guideShow) {
            GuideCtrl.Inst().AddGuideUi("MainViewHero" + this.itemIndex, this);

            let is_max = HeroData.Inst().IsHeroLevelMax(this.heroMode.hero_id);
            this.viewNode.MaxShow.visible = is_max;
            this.viewNode.ProgressShow.visible = !is_max;

            if (!is_max) {
                let levelCfg = this.heroMode.GetLevelCfg();
                let debris = HeroData.Inst().GetHeroDebris(levelCfg.upgrade2[0].item_id);
                let consume = HeroData.Inst().GetDebrisConsume(this.heroMode.hero_id);
                this.viewNode.ProgressShow.value = debris
                this.viewNode.ProgressShow.max = consume[0].num
                this.viewNode.ProgressShow.FlushShow(this.heroMode.data.hero_color)
            }
        }
    }

    ItemIndex(itemIndex: number, guide: boolean) {
        this.itemIndex = itemIndex
        this.guideShow = guide
        if (this.indexCtrler == null) {
            this.indexCtrler = this.getController("IndexCtrl");
        }
        if (this.indexCtrler) {
            this.indexCtrler.selectedIndex = itemIndex
        }
    }

    OnClickItem() {
        ViewManager.Inst().OpenView(HeroInfoView, this._data)
    }

    protected onDestroy(): void {
        super.onDestroy()

        if (this.guideShow) {
            GuideCtrl.Inst().ClearGuideUi("MainViewHero" + this.itemIndex);
        }
    }
}

export class MainViewHeroItem2 extends BaseItemGB {
    itemIndex: number
    guideShow: boolean
    private heroMode: HeroDataModel;


    protected viewNode = {
        icon: <fgui.GLoader>null,
    };

    protected onConstruct(): void {
        super.onConstruct();
        this.onClick(this.OnClickItem, this);
    }

    public SetData(data: number | HeroDataModel) {
        super.SetData(data)
        if (data instanceof (HeroDataModel)) {
            if (data.hero_id == 0) return this.visible = false;
            this.heroMode = data;
        } else {
            if (data == 0) return this.visible = false;
            this.heroMode = new HeroDataModel(data);
        }
        this.visible = true;
        UH.SetIcon(this.viewNode.icon, this.heroMode.hero_id, ICON_TYPE.HEADICON);

        if (this.guideShow) {
            GuideCtrl.Inst().AddGuideUi("MainViewHero" + this.itemIndex, this);
        }
    }

    ItemIndex(itemIndex: number, guide: boolean) {
        this.itemIndex = itemIndex
        this.guideShow = guide
    }

    OnClickItem() {
        ViewManager.Inst().OpenView(HeroInfoView, this._data)
    }

    protected onDestroy(): void {
        super.onDestroy()

        if (this.guideShow) {
            GuideCtrl.Inst().ClearGuideUi("MainViewHero" + this.itemIndex);
        }
    }
}

class MainViewHeroProgress extends BaseItemGP {
    private spShow: UISpineShow = undefined;

    protected viewNode = {
        BgSp: <fgui.GTextField>null,
        ProgressShow: <fgui.GTextField>null,
        BarMax: <fgui.GImage>null,
        PieceShow: <fgui.GImage>null,
        EffParent: <fgui.GComponent>null,
    };

    protected onConstruct(): void {
        super.onConstruct()

        this.spShow = ObjectPool.Get(UISpineShow, ResPath.UIEffect(`1208038`), true, (obj: any) => {
            this.viewNode.EffParent._container.insertChild(obj, 0);
        });
    }

    FlushShow(hero_color: number) {
        let is_enough = this.value >= this.max
        UH.SetText(this.viewNode.ProgressShow, `${this.value}/${this.max}`)
        this.viewNode.BarMax.visible = is_enough
        this.viewNode.PieceShow.visible = !is_enough
        this.viewNode.EffParent.visible = is_enough
        UH.SpriteName(this.viewNode.BgSp, "Main", `JinDuDi${hero_color}`);
    }

    protected onDestroy(): void {
        super.onDestroy();
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null;
        }
    }
}

class MainViewListGButton extends BaseItemGB {
    protected viewNode = {
        Red: <fgui.GComponent>null,
    };

    freshRedRedPoint(num: number) {
        this.viewNode.Red.visible = num > 0
    }

}

export class MainViewRoleInfoButton extends BaseItemGB {
    protected viewNode = {
        headItem: <HeadItem>null,
        lb_name: <fgui.GTextField>null
    };
    FlushShow() {
        UH.SetText(this.viewNode.lb_name, RoleData.Inst().InfoRoleName)
        this.viewNode.headItem.SetHeadFrame(RoleData.Inst().InfoRoleHeadFrame)
        this.flushAvater();
    }
    flushAvater() {
        if (RoleData.Inst().InfoRoleHeadPicId == 0 && RoleData.Inst().avatar_out_texture) {
            this.viewNode.headItem.SeSpriteFrame(RoleData.Inst().avatar_out_texture as SpriteFrame)
        } else {
            this.viewNode.headItem.setDefaut(RoleData.Inst().InfoRoleHeadPicId);
        }
    }
}