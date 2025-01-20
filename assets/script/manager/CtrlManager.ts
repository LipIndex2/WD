import { Singleton } from "core/Singleton";
import { HouZaiTanXianCtrl } from "modules/ActHouZaiTanXian/HouZaiTanXianCtrl";
import { ActivityCombatCtrl } from 'modules/ActivityCombat/ActivityCombatCtrl';
import { AdFreeCtrl } from "modules/AdFree/AdFreeCtrl";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { CavePassCtrl } from "modules/CavePass/CavePassCtrl";
import { FirstChargeCtrl } from 'modules/FirstCharge/FirstChargeCtrl';
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { GeneGiftCtrl } from "modules/GeneGift/GeneGiftCtrl";
import { GeneTaskCtrl } from "modules/GeneTask/GeneTaskCtrl";
import { GrowPassCtrl } from "modules/GrowPass/GrowPassCtrl";
import { GrowUpGiftCtrl } from 'modules/GrowUpGift/GrowUpGiftCtrl';
import { InviteFriendCtrl } from 'modules/InviteFriend/InviteFriendCtrl';
import { LimitedRechargeCtrl } from "modules/LimitedRecharge/LimitedRechargeCtrl";
import { LoseTempleCtrl } from "modules/LoseTemple/LoseTempleCtrl";
import { MainLevelInfoCtrl } from "modules/MainLevelInfo/MainLevelInfoCtrl";
import { MiningCtrl } from "modules/Mining/MiningCtrl";
import { NewPackCtrl } from 'modules/NewPack/NewPackCtrl';
import { PlaceReturnsCtrl } from "modules/PlaceReturns/PlaceReturnsCtrl";
import { RoundActivityCtrl } from "modules/RoundActivity/RoundActivityCtrl";
import { SavingPotCtrl } from "modules/SavingPot/SavingPotCtrl";
import { SevenDaysPackCtrl } from "modules/SevenDaysPack/SevenDaysPackCtrl";
import { TrafficPermitCtrl } from 'modules/TrafficPermit/TrafficPermitCtrl';
import { ZombieRushPassCtrl } from "modules/ZombieRushPass/ZombieRushPassCtrl";
import { BagCtrl } from "modules/bag/BagCtrl";
import { BaseCtrl } from "modules/common/BaseCtrl";
import { ModRegister } from "modules/common/ModRegister";
import { DeepCeleCtrl } from "modules/deep_cele/DeepCeleCtrl";
import { DevilWarorderCtrl } from "modules/devil_warorder/DevilWarorderCtrl";
import { GMCmdCtrl } from "modules/gm_command/GMCmdCtrl";
import { GuideCtrl } from "modules/guide/GuideCtrl";
import { HeroCtrl } from "modules/hero/HeroCtrl";
import { LoginCtrl } from "modules/login/LoginCtrl";
import { MailCtrl } from "modules/mail/MailCtrl";
import { MainCtrl } from "modules/main/MainData";
import { MainFBCtrl } from "modules/main_fb/MainFBCtrl";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { RankCtrl } from "modules/rank/RankCtrl";
import { RechargeCtrl } from "modules/recharge/RechargeCtrl";
import { RoleCtrl } from "modules/role/RoleCtrl";
import { SevenDayHeroCtrl } from 'modules/seven_day_hero/SevenDayHeroCtrl';
import { ShopCtrl } from "modules/shop/ShopCtrl";
import { TaskCtrl } from "modules/task/TaskCtrl";
import { TerritoryCtrl } from "modules/territory/TerritoryCtrl";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { OpenServiceSevenDayCtrl } from './../modules/OpenServiceSevenDay/OpenServiceSevenDayCtrl';
import { ActivityCtrl } from './../modules/activity/ActivityCtrl';
import { HeroTrialCtrl } from "modules/HeroTrial/HeroTrialCtrl";
import { InstituteCtrl } from "modules/Institute/InstituteCtrl";
import { GeneOrientationCtrl } from "modules/GeneOrientation/GeneOrientationCtrl";
import { DefenseHomeCtrl } from "modules/defense_home/DefenseHomeCtrl";
import { DefensePassCheckCtrl } from "modules/DefensePassCheck/DefensePassCheckCtrl";
import { CultivateCtrl } from "modules/Cultivate/CultivateCtrl";
import { FarmCtrl } from "modules/Farm/FarmCtrl";
import { ArenaCtrl } from "modules/Arena/ArenaCtrl";
import { GameCircleCtrl } from "modules/GameCircle/GameCircleCtrl";
import { FishCtrl } from "modules/fish/FishCtrl";
import { ArenaPassCtrl } from "modules/ArenaPass/ArenaPassCtrl";
import { FishPassCtrl } from "modules/FishPass/FishPassCtrl";
import { DrawCardCtrl } from "modules/DrawCard/DrawCardCtrl";
import { ChatCtrl } from "modules/chat/ctrl/ChatCtrl";

export class CtrlManager extends Singleton {
    private ctrl_list: Array<BaseCtrl>;
    public Init() {
        this.ctrl_list = new Array();
        this.createCtrls()
        this.onInitCtrls()
    }

    private createCtrls() {
        this.ctrl_list.push(ModRegister.Inst());
        this.ctrl_list.push(FunOpen.Inst());
        this.ctrl_list.push(LoginCtrl.Inst());
        this.ctrl_list.push(GMCmdCtrl.Inst());
        this.ctrl_list.push(TimeCtrl.Inst());
        this.ctrl_list.push(RoleCtrl.Inst());
        this.ctrl_list.push(MainCtrl.Inst());
        this.ctrl_list.push(BagCtrl.Inst());
        this.ctrl_list.push(GrowPassCtrl.Inst());
        this.ctrl_list.push(TaskCtrl.Inst());
        this.ctrl_list.push(GuideCtrl.Inst());
        this.ctrl_list.push(ShopCtrl.Inst());
        this.ctrl_list.push(MailCtrl.Inst());
        this.ctrl_list.push(MainFBCtrl.Inst());
        this.ctrl_list.push(RankCtrl.Inst());
        this.ctrl_list.push(TerritoryCtrl.Inst());
        this.ctrl_list.push(FishCtrl.Inst());
        this.ctrl_list.push(PublicPopupCtrl.Inst());
        this.ctrl_list.push(BattleCtrl.Inst());
        this.ctrl_list.push(HeroCtrl.Inst());
        this.ctrl_list.push(RechargeCtrl.Inst());
        this.ctrl_list.push(SavingPotCtrl.Inst());
        this.ctrl_list.push(ActivityCtrl.Inst());
        this.ctrl_list.push(SevenDayHeroCtrl.Inst());
        this.ctrl_list.push(DeepCeleCtrl.Inst());
        this.ctrl_list.push(PlaceReturnsCtrl.Inst());
        this.ctrl_list.push(OpenServiceSevenDayCtrl.Inst());
        this.ctrl_list.push(InviteFriendCtrl.Inst());
        this.ctrl_list.push(TrafficPermitCtrl.Inst());
        this.ctrl_list.push(GrowUpGiftCtrl.Inst());
        this.ctrl_list.push(ActivityCombatCtrl.Inst());
        this.ctrl_list.push(NewPackCtrl.Inst());
        this.ctrl_list.push(FirstChargeCtrl.Inst());
        this.ctrl_list.push(RoundActivityCtrl.Inst());
        this.ctrl_list.push(LoseTempleCtrl.Inst());
        this.ctrl_list.push(AdFreeCtrl.Inst());
        this.ctrl_list.push(MainLevelInfoCtrl.Inst());
        this.ctrl_list.push(DevilWarorderCtrl.Inst());
        this.ctrl_list.push(HouZaiTanXianCtrl.Inst());
        this.ctrl_list.push(GeneTaskCtrl.Inst());
        this.ctrl_list.push(LimitedRechargeCtrl.Inst());
        this.ctrl_list.push(SevenDaysPackCtrl.Inst());
        this.ctrl_list.push(GeneGiftCtrl.Inst());
        this.ctrl_list.push(ZombieRushPassCtrl.Inst());
        this.ctrl_list.push(MiningCtrl.Inst());
        this.ctrl_list.push(CavePassCtrl.Inst());
        this.ctrl_list.push(GeneOrientationCtrl.Inst());
        this.ctrl_list.push(InstituteCtrl.Inst());
        this.ctrl_list.push(HeroTrialCtrl.Inst());
        this.ctrl_list.push(DefenseHomeCtrl.Inst());
        this.ctrl_list.push(DefensePassCheckCtrl.Inst());
        this.ctrl_list.push(CultivateCtrl.Inst());
        this.ctrl_list.push(FarmCtrl.Inst());
        this.ctrl_list.push(ArenaCtrl.Inst());
        this.ctrl_list.push(GameCircleCtrl.Inst());
        this.ctrl_list.push(ArenaPassCtrl.Inst());
        this.ctrl_list.push(FishPassCtrl.Inst());
        this.ctrl_list.push(DrawCardCtrl.Inst());
        this.ctrl_list.push(ChatCtrl.Inst());

        // this.ctrl_list.push(BattleCtrl.Inst());
        // // this.ctrl_list.push(SceneCtrl.Inst());
    }

    private onInitCtrls() {
        for (let index = 0; index < this.ctrl_list.length; index++) {
            const _ctrl = this.ctrl_list[index];
            _ctrl.OnInit()
        }
    }
}    
