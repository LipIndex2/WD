import { ImageAsset, SpriteFrame, __private, assetManager, game, sys } from "cc";
import { CfgAdData } from "config/CfgAd";
import { CfgPlayerLevelData } from "config/CfgPlayerLevel";
import { Debugger } from "core/Debugger";
import { DataBase } from "data/DataBase";
import { CreateSMD, smartdata } from "data/SmartData";
import { ViewManager } from "manager/ViewManager";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { BattleDebugData } from "modules/Battle/BattleDebugCfg";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { ActivityData } from "modules/activity/ActivityData";
import { AudioManager } from "modules/audio/AudioManager";
import { BagData } from "modules/bag/BagData";
import { AdType, ROLE_SETTING_TYPE } from "modules/common/CommonEnum";
import { CommonEvent } from "modules/common/CommonEvent";
import { ConstValue } from "modules/common/ConstValue";
import { EventCtrl } from "modules/common/EventCtrl";
import { HeroData } from "modules/hero/HeroData";
import { LoginData } from "modules/login/LoginData";
import { MainFBData } from "modules/main_fb/MainFBData";
import { Timer } from "modules/time/Timer";
import { GAME_PLANT, PackageData, headImgExt } from "preload/PkgData";
import { ResPath } from "utils/ResPath";
import { Base64 } from "../../helpers/Base64";
import { DataHelper } from "../../helpers/DataHelper";
import { ChannelAgent, wx_User } from "../../proload/ChannelAgent";
import { ReportManager, ReportType } from "../../proload/ReportManager";
import { RoleCtrl } from "./RoleCtrl";
import { RoleLevelUpView } from "./RoleLevelUpView";


class RoleResultData {
    RoleInfo: PB_SCRoleInfoAck
    RoleSystemSetInfo: PB_SCRoleSystemSetInfo;
    AdInfo: Map<number, IPB_SCAdvertisement> = new Map();
    headChar: string = "";
    name: string = "";
    ZhuoMianReward: PB_SCRoleZhuoMianReward;
}

class RoleFlushData {
    @smartdata
    FlushRoleInfo: boolean = false;

    @smartdata
    FlushRoleAvater: boolean = false;

    @smartdata
    FlushAdInfo: boolean = false;

    @smartdata
    FlushZhuoMianReward: boolean = false;

    ShowLevelUp = false

    ShowFunOpen = false

    ShowRewardGet = false
}

export class RoleData extends DataBase {
    public ResultData: RoleResultData;
    public FlushData: RoleFlushData;
    public avatar_out_texture: SpriteFrame | 0 | undefined = undefined;
    private wx_User: wx_User;

    public inGame = false;
    /**是否创角 需在 main.sendLoginReq 后获取
     * @tip 当收到角色信息 上报创角信息 后该值为false
     * @return true 创角
     */
    public isCreateRole = false;

    /**是否新角色 需在 main.sendLoginReq 后获取
     * @tip 该账号是否为新角色 直到下次登录
     * @return true 新角色 false 老用户
     */
    public isNewRole = false;

    constructor() {
        super();
        this.createSmartData();
    }

    protected onSwitch() {
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(RoleFlushData);
        this.ResultData = new RoleResultData();
        EventCtrl.Inst().on(CommonEvent.PACK_WX_BE_AVATAR, this.onAvatar, this)
        EventCtrl.Inst().on(CommonEvent.PACK_WX_BE_RECOCARD, this.onRecoCard, this)
    }


    public SetRoleInfoAck(protocol: PB_SCRoleInfoAck) {
        let isInit = this.ResultData.RoleInfo == undefined;
        if (protocol.sendReason == 0) {
            this.ResultData.RoleInfo = protocol;
            this.ResultData.headChar = DataHelper.BytesToString(this.ResultData.RoleInfo.roleinfo.headChar)
            this.ResultData.name = DataHelper.BytesToString(this.ResultData.RoleInfo.roleinfo.name)
            Debugger.wx_log_defaut_key = this.InfoRoleId + "";
            if (isInit) {
                if (this.isCreateRole) {
                    this.isCreateRole = false
                    let currentInfo = LoginData.Inst().GetServerItemInfoById(LoginData.Inst().ResultData.currentId);
                    let account = LoginData.Inst().GetLoginRespUserData().account;
                    ReportManager.Inst().sendPoint(ReportType.endCreateRole, [account, currentInfo.id, LoginData.Inst().GetLoginRespUserData().account]);
                    ChannelAgent.Inst().Behaveious(ConstValue.BehaveType.CreatRole)
                }
                ChannelAgent.Inst().Behaveious(ConstValue.BehaveType.RoleLogin);
                let report_data = [
                    LoginData.Inst().GetLoginRespUserData().account,
                    LoginData.Inst().GetServerItemInfoById(LoginData.Inst().ResultData.currentId).id,
                    Base64.encode(RoleData.Inst().InfoRoleName),
                    RoleData.Inst().InfoRoleId,
                    RoleData.Inst().InfoRoleLevel,
                ]
                ChannelAgent.Inst().Behaveious(ConstValue.BehaveType.EnterServer);
                ReportManager.Inst().sendPoint(ReportType.roleLogin, report_data);
                ReportManager.Inst().sendPoint(ReportType.beginGame, report_data);
            }
            this.checkWxUser();
            RoleCtrl.Inst().checkWxGameData();
        } else {
            for (const key in protocol) {
                if (Object.prototype.hasOwnProperty.call(protocol, key)) {
                    const element = (protocol as any)[key];
                    (this.ResultData.RoleInfo as any)[key] = element;
                    if (key == "roleinfo") {
                        this.ResultData.headChar = DataHelper.BytesToString(this.ResultData.RoleInfo.roleinfo.headChar)
                        this.ResultData.name = DataHelper.BytesToString(this.ResultData.RoleInfo.roleinfo.name)
                    }
                }
            }
        }
        this.CheckMainFbLevel()
        this.FlushData.FlushRoleInfo = !this.FlushData.FlushRoleInfo
    }

    private checkWxUser() {
        let t = this;
        let load = false;
        if (t.ResultData && t.ResultData.RoleInfo) {
            if (t.wx_User) {
                if ((t.ResultData.headChar == "" && t.wx_User.avatarUrl != "")
                    || (t.ResultData.name != t.wx_User.nickName)
                    || t.ResultData.headChar != t.wx_User.avatarUrl
                ) {
                    let roleName
                    if (this.InfoRoleNameNum != 0) {
                        roleName = t.ResultData.name;
                        if (t.ResultData.headChar != t.wx_User.avatarUrl && t.wx_User.avatarUrl != "") {
                            RoleCtrl.Inst().SendOutUserInfo(roleName, t.wx_User.avatarUrl, true)
                        }
                    } else {
                        roleName = t.wx_User.nickName;
                        RoleCtrl.Inst().SendOutUserInfo(roleName, t.wx_User.avatarUrl, true)
                        t.ResultData.name = roleName
                        t.ResultData.headChar = t.wx_User.avatarUrl
                        load = true;
                    }
                }
            }
            if (t.ResultData.headChar != "" && (load || t.avatar_out_texture == undefined)) {
                t.avatar_out_texture = 0
                if (sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
                    assetManager.loadRemote(ResPath.WxAvatar(t.ResultData.headChar), { ext: headImgExt }, (error: any, texture: __private._cocos_asset_assets_image_asset__ImageSource) => {
                        if (texture) {
                            // let spf = new SpriteFrame();
                            // texture.image.crossOrigin = 'anonymous';
                            // spf.texture = texture;
                            // t.avatar_out_texture = spf
                            // this.FlushData.FlushRoleAvater = !this.FlushData.FlushRoleAvater

                            t.avatar_out_texture = SpriteFrame.createWithImage(texture)
                            this.FlushData.FlushRoleAvater = !this.FlushData.FlushRoleAvater
                        }
                    })
                } else {
                    assetManager.loadRemote(ResPath.WxAvatar(t.ResultData.headChar), (error, texture: ImageAsset) => {
                        if (texture) {
                            t.avatar_out_texture = SpriteFrame.createWithImage(texture)
                            this.FlushData.FlushRoleAvater = !this.FlushData.FlushRoleAvater
                        }
                    })
                }
            }
        }
    }



    private onAvatar(wx_User: wx_User) {
        this.wx_User = wx_User;
        this.checkWxUser();
    }

    //抖音游戏卡
    onRecoCard(query: any) {
        if (query && query.card_id) {
            let q_data = PackageData.Inst().getQueryData();
            let card_info = q_data.param_list.card_id;
            if (card_info) {
                let card_data = card_info[query.card_id] || card_info[+query.card_id];
                if (card_data) {
                    let mod_key = card_data.mod;
                    let act_type = card_data.act_type;
                    if (mod_key) {
                        if (act_type) {
                            if (ActivityData.Inst().ActfunOpen(mod_key, act_type)) {
                                ViewManager.Inst().OpenViewByKey(mod_key)
                            } else {
                                let time = game.totalTime
                                ActivityData.Inst().Register(mod_key, () => {
                                    let now_time = game.totalTime;
                                    if (now_time - time > 10000) {
                                        return
                                    }
                                    if (ActivityData.Inst().ActfunOpen(mod_key, act_type)) {
                                        ViewManager.Inst().OpenViewByKey(mod_key)
                                    }
                                })
                            }
                        } else {
                            let open_t = FunOpen.Inst().GetFunIsOpen(mod_key);
                            if (open_t.is_open) {
                                ViewManager.Inst().OpenViewByKey(mod_key)
                            }
                        }
                    }
                }
                // switch (query.card_id) {
                //     case 346:
                //         ViewManager.Inst().OpenView(SevenDaysPackView)
                //         break;
                //     case 345:
                //         ViewManager.Inst().OpenView(SevenDayHeroView)
                //         break;
                // }
            }
        }
    }

    public SetRoleExpChange(protocol: PB_SCRoleExpChange) {
        this.ResultData.RoleInfo.curExp = protocol.curExp
        this.FlushData.FlushRoleInfo = !this.FlushData.FlushRoleInfo
    }

    public SetRoleLevelChange(protocol: PB_SCRoleLevelChange) {

        this.ResultData.RoleInfo.roleinfo.level = protocol.level
        this.ResultData.RoleInfo.curExp = protocol.exp

        this.FlushData.FlushRoleInfo = !this.FlushData.FlushRoleInfo

        this.ShowLevelUp = true
    }

    public CheckMainFbLevel() {
        if (this.ResultData.RoleInfo && this.ResultData.RoleInfo.mainFbLevel > MainFBData.Inst().CfgBarrierInfoMainInfoCount()) {
            let level = MainFBData.Inst().CfgBarrierInfoMainInfoCount()
            this.ResultData.RoleInfo.mainFbLevel = level;
            let co = MainFBData.Inst().CfgBarrierInfoMainInfo(level)
            if (co) {
                this.ResultData.RoleInfo.mainFbRound = co.round_max
            }
            this.FlushData.FlushRoleInfo = !this.FlushData.FlushRoleInfo
        }
    }

    public SetAdvertisementInfo(protocol: PB_SCAdvertisementInfo) {
        if (1 == protocol.isInit) {
            this.ResultData.AdInfo.clear();
        }
        for (let i = 0; i < protocol.adList.length; i++) {
            let ad = protocol.adList[i];
            this.ResultData.AdInfo.set(ad.seq, ad);
        }
        this.FlushData.FlushAdInfo = !this.FlushData.FlushAdInfo
    }

    //角色设置
    public SetRoleSystemSetInfo(protocol: PB_SCRoleSystemSetInfo) {
        this.ResultData.RoleSystemSetInfo = protocol;
        this.CheckRoleSystemSetInit()
    }


    public SetRoleZhuoMianReward(protocol: PB_SCRoleZhuoMianReward) {
        this.ResultData.ZhuoMianReward = protocol;
        this.FlushData.FlushZhuoMianReward = !this.FlushData.FlushZhuoMianReward
    }

    public get InfoRoleInfo() {
        return this.ResultData.RoleInfo ? this.ResultData.RoleInfo.roleinfo : {}
    }

    public get InfoRoleId() {
        return this.ResultData.RoleInfo ? this.ResultData.RoleInfo.roleinfo.roleId : 0
    }

    public get InfoRoleName() {
        return this.ResultData.RoleInfo ? this.ResultData.name : ""
    }

    public get InfoRoleLevel() {
        return this.ResultData.RoleInfo ? +this.ResultData.RoleInfo.roleinfo.level : 0
    }

    public get InfoCurExp() {
        return this.ResultData.RoleInfo ? +this.ResultData.RoleInfo.curExp : 0
    }

    public get InfoMainSceneLevel() {
        return this.ResultData.RoleInfo ? this.ResultData.RoleInfo.mainFbLevel : 0
    }

    public get InfoMainSceneRound() {
        return this.ResultData.RoleInfo ? this.ResultData.RoleInfo.mainFbRound : 0
    }

    public get InfoRoleFightList() {
        return this.ResultData.RoleInfo ? this.ResultData.RoleInfo.fightList : [1, 2, 3, 4]
    }

    public get InfoRoleEnergyUpTime() {
        return +(this.ResultData.RoleInfo ? this.ResultData.RoleInfo.energyUpTime : 0)
    }

    public get InfoRoleHeadFrame() {
        return this.ResultData.RoleInfo ? this.ResultData.RoleInfo.roleinfo.headFrame : 1
    }

    public get InfoRoleHeadPicId() {
        return this.ResultData.RoleInfo ? this.ResultData.RoleInfo.roleinfo.headPicId : 0
    }

    public get InfoRoleHeadChar() {
        return this.ResultData.headChar
    }

    public get InfoRoleNameNum() {
        return this.ResultData.RoleInfo ? this.ResultData.RoleInfo.setNameCount : 0;
    }

    public get ZhuoMianRewardIsFetch() {
        return this.ResultData.ZhuoMianReward ? this.ResultData.ZhuoMianReward.isFetch : false;
    }

    public get InfoRoleInfoCreateTime() {
        return this.ResultData.RoleInfo ? +this.ResultData.RoleInfo.createTime : 0
    }

    public set ShowLevelUp(value: boolean) {
        if (value) {
            Timer.Inst().AddRunFrameTimer(() => {
                if (BattleCtrl.Inst().IsBattle() || this.ShowRewardGet) {
                    this.FlushData.ShowLevelUp = true
                } else {
                    this.FlushData.ShowLevelUp = true
                    ViewManager.Inst().OpenView(RoleLevelUpView, { level: RoleData.Inst().InfoRoleLevel - 1 })
                }
            }, 1, 1, false)
        } else {
            this.FlushData.ShowLevelUp = false
        }
    }

    public get ShowLevelUp() {
        return this.FlushData.ShowLevelUp
    }

    public set ShowRewardGet(value: boolean) {
        this.FlushData.ShowRewardGet = value
    }

    public get ShowRewardGet() {
        return this.FlushData.ShowRewardGet
    }

    public set ShowFunOpen(value: boolean) {
        this.FlushData.ShowFunOpen = value
    }

    public get ShowFunOpen() {
        return this.FlushData.ShowFunOpen
    }

    public CfgPlayerLevelOtherExpItem() {
        return CfgPlayerLevelData.other[0].exp_item ?? 0;
    }

    public CfgPlayerLevelOtherPowerMax() {
        return CfgPlayerLevelData.other[0].power_max ?? 0;
    }

    public CfgPlayerLevelOtherNameItem() {
        return CfgPlayerLevelData.other[0].name ?? [];
    }

    public CfgPlayerLevelLevelLevelUp(role_level: number = this.InfoRoleLevel) {
        let co = CfgPlayerLevelData.level.find(cfg => cfg.level == role_level);
        return co ? co.level_up : 0
    }

    public CfgAdTypeSeq(seq: number) {
        return CfgAdData.ad_type.find(cfg => cfg.seq == seq);
    }

    public GetAdvertisementInfoBySeq(seq: number) {
        return this.ResultData.AdInfo.get(seq);
    }

    public GetRoleHeadIconCfg() {
        return CfgPlayerLevelData.head_icon
    }

    public GetRoleHeadFrameCfg() {
        return CfgPlayerLevelData.head
    }

    public GetHeadFrameIndex(head_id: number) {
        let cfg = this.GetRoleHeadFrameCfg();
        for (let i = 0; i < cfg.length; i++) {
            if (head_id == cfg[i].head_id) {
                return i;
            }
        }
        return 0;
    }

    public GetHeadIconIndex(head_id: number) {
        let cfg = this.GetRoleHeadIconCfg();
        for (let i = 0; i < cfg.length; i++) {
            if (head_id == cfg[i].head_id) {
                return i;
            }
        }
        return 0;
    }

    public CfgRoleHeadFrame(seq: number) {
        return CfgPlayerLevelData.head.find(cfg => cfg.head_id == seq);
    }

    public CfgRoleHeadIcon(seq: number) {
        return CfgPlayerLevelData.head_icon.find(cfg => cfg.head_id == seq);
    }

    public CfgPlayerLevelOtherZhuo() {
        return CfgPlayerLevelData.other[0].zhuo ?? []
    }

    public GetRoleHeadFrameIsLock(seq: number) {
        let cfg = this.CfgRoleHeadFrame(seq)
        if (cfg.unlock_type == 1) {
            return FunOpen.Inst().IsBarrierPass(cfg.pram1)
        } else if (cfg.unlock_type == 2) {
            return BagData.Inst().GetItemNum(cfg.pram1) > 0;
        }
        return true
    }

    public GetRoleHeadIconIsLock(seq: number) {
        let cfg = this.CfgRoleHeadIcon(seq)
        if (!cfg) return true
        if (cfg.unlock_type == 0) {
            return HeroData.Inst().GetHeroLevel(cfg.param1) > 0
        }
        return true
    }

    //获取角色设置
    public GetRoleSystemSetInfo(type: ROLE_SETTING_TYPE) {
        let setting = this.ResultData.RoleSystemSetInfo ? this.ResultData.RoleSystemSetInfo.systemSetList[type] : undefined
        return setting ? setting.systemSetParam : 0
    }

    //改变角色设置
    public ChangeRoleSystemSetInfo(type: ROLE_SETTING_TYPE, param: number) {
        if (this.ResultData.RoleSystemSetInfo) {
            let setting = this.ResultData.RoleSystemSetInfo.systemSetList[type]
            setting.systemSetParam = param
            RoleCtrl.Inst().SendRoleSystemSetReq([setting])
            this.CheckRoleSystemSet(setting)
        }
    }

    IsGuide(): boolean {
        if (BattleDebugData.BATTLE_DEBUG_MODE) {
            return false;
        }
        let setting = this.ResultData.RoleSystemSetInfo.systemSetList[ROLE_SETTING_TYPE.SettingGuide]
        if (setting == null || setting.systemSetParam == 0) {
            return true;
        } else {
            return false;
        }
    }

    IsBattleDefGuide() {
        let setting = this.ResultData.RoleSystemSetInfo.systemSetList[ROLE_SETTING_TYPE.SettingBattleDefGuide]
        if (setting == null || setting.systemSetParam == 0) {
            return true;
        } else {
            return false;
        }
    }

    IsGuideNum(guide: number, call = true): boolean {
        if (BattleDebugData.BATTLE_DEBUG_MODE) {
            return false;
        }
        if (this.ResultData.RoleSystemSetInfo) {
            let value = 0 == this.GetRoleSystemSetInfo(ROLE_SETTING_TYPE.SettingGuideStart + guide)
            if (call) {
                this.ChangeRoleSystemSetInfo(ROLE_SETTING_TYPE.SettingGuideStart + guide, 1)
            }
            return value
        }
        return false
    }

    public CheckRoleSystemSetInit() {
        this.CheckRoleSystemSet(this.ResultData.RoleSystemSetInfo.systemSetList[ROLE_SETTING_TYPE.SettingMusic])
        this.CheckRoleSystemSet(this.ResultData.RoleSystemSetInfo.systemSetList[ROLE_SETTING_TYPE.SettingAudio])
    }

    public CheckRoleSystemSet(setting: IPB_system_set) {
        switch (setting.systemSetType) {
            case ROLE_SETTING_TYPE.SettingMusic:
                if (0 == setting.systemSetParam) {
                    AudioManager.Inst().RePlayBg()
                } else {
                    AudioManager.Inst().StopBg()
                }
                break;
            case ROLE_SETTING_TYPE.SettingAudio:
                if (0 == setting.systemSetParam) {
                    AudioManager.Inst().ReEffect()
                } else {
                    AudioManager.Inst().StopEffect()
                }
                break;
        }
    }

    public GetLevelUpRewards(level_from: number) {
        let level_to = this.InfoRoleLevel
        let list = CfgPlayerLevelData.level.filter(cfg => cfg.level >= level_from && cfg.level < level_to)
        let rewards = []
        for (var element of list) {
            for (let reward of element.up) {
                rewards.push(reward)
            }
        }
        return rewards
    }


    //今日看此类型广告的次数
    public GetTodayAdCount(adType: AdType) {
        let info = this.GetAdvertisementInfoBySeq(adType);
        if (info == null) {
            return 0;
        }
        return info.todayCount ?? 0;
    }

    //广告刷新时间
    public GetAdNextFetchTime(adType: AdType) {
        let info = this.GetAdvertisementInfoBySeq(adType);
        if (info == null) {
            return 0;
        }
        return info.nextFetchTime ?? 0;
    }

    //是否能拉取视频广告  isCheckCount:如果没有观看次数还需要显示，就传flase
    public IsCanAD(adType: AdType, isCheckCount: boolean = true): boolean {
        let level = this.InfoRoleLevel;
        let adCfg = this.CfgAdTypeSeq(adType);
        if (level == 0 || adCfg == null) {
            return false;
        }

        let sp_id = PackageData.Inst().getSpid();
        if(sp_id == "dy1"){
            if (adCfg.dy1_view == 0) {
                return false;
            }
        }else if(GAME_PLANT.DOUYIN){
            if (adCfg.lw3_view == 0) {
                return false;
            }
        }else{
            if (adCfg.view == 0) {
                return false;
            }
        }
        if (level < adCfg.level) {
            return false;
        }

        if (adCfg.ad_param == 0) {
            return true;
        }

        if(isCheckCount){
            let count = this.GetTodayAdCount(adType);
            if (count >= adCfg.ad_param) {
                return false;
            }
        }
        return true;
    }
}