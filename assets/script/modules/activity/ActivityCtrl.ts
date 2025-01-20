import { FirstChargeData } from 'modules/FirstCharge/FirstChargeData';
import { GrowPassData } from 'modules/GrowPass/GrowPassData';
import { OpenServiceSevenDayData } from 'modules/OpenServiceSevenDay/OpenServiceSevenDayData';
import { PlaceReturnsData } from 'modules/PlaceReturns/PlaceReturnsData';
import { RoundActivityData } from 'modules/RoundActivity/RoundActivityData';
import { SavingPotData } from 'modules/SavingPot/SavingPotData';
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { Mod } from 'modules/common/ModuleDefine';
import { TimeCtrl } from 'modules/time/TimeCtrl';
import { GrowUpGiftData } from './../GrowUpGift/GrowUpGiftData';
import { NewPackData } from './../NewPack/NewPackData';
import { ActivityData } from './ActivityData';
import { ACTIVITY_TYPE } from './ActivityEnum';
import { AdFreeData } from 'modules/AdFree/AdFreeData';
import { InviteFriendData } from 'modules/InviteFriend/InviteFriendData';
import { HouZaiTanXianData } from 'modules/ActHouZaiTanXian/HouZaiTanXianCtrl';
import { GeneTaskData } from 'modules/GeneTask/GeneTaskData';
import { GeneGiftData } from 'modules/GeneGift/GeneGiftData';
import { GeneOrientationData } from 'modules/GeneOrientation/GeneOrientationData';
import { HeroTrialData } from 'modules/HeroTrial/HeroTrialData';
import { SevenDaysPackData } from 'modules/SevenDaysPack/SevenDaysPackData';
import { ArenaData } from 'modules/Arena/ArenaData';

export class ActivityCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCActivityStatus, func: this.recvActivityStatus },
        ]
    }

    initCtrl() {
        this.OnInits();
    }

    private recvActivityStatus(data: PB_SCActivityStatus) {
        ActivityData.Inst().SetActivityStatus(data);
    }

    public SendAngelReq(activity_type: ACTIVITY_TYPE, operaType?: number, param1?: number, param2?: number, param3?: number,) {
        let protocol = this.GetProtocol(PB_CSRandActivityOperaReq);
        protocol.randActivityType = activity_type;
        protocol.operaType = operaType;
        protocol.param1 = param1 ?? 0;
        protocol.param2 = param2 ?? 0;
        protocol.param3 = param3 ?? 0;
        this.SendToServer(protocol);
    }

    private OnInits() {
        //七日开服
        ActivityData.Inst().RegisterCountDown(Mod.OpenServiceSevenDay.View, () => {
            return OpenServiceSevenDayData.Inst().getEndTime();
        })
        //成长礼包
        ActivityData.Inst().RegisterCountDown(Mod.GrowUpGift.View, () => {
            return GrowUpGiftData.Inst().getEndTime(0);
        })
        //存钱罐
        ActivityData.Inst().Register(Mod.SavingPot.View, () => {
            return SavingPotData.Inst().GetIsActiveOver();
        }, SavingPotData.Inst().ResultData)
        //首充
        ActivityData.Inst().Register(Mod.FirstCharge.View, () => {
            return FirstChargeData.Inst().GetIsActiveOver();
        }, FirstChargeData.Inst().FlushData)
        //新手礼包
        ActivityData.Inst().Register(Mod.NewPack.View, () => {
            return NewPackData.Inst().GetIsActiveOver();
        }, NewPackData.Inst().FlushData)
        //回合活动
        ActivityData.Inst().RegisterCountDown(Mod.RoundActivity.View, () => {
            return RoundActivityData.Inst().getEndTime() - TimeCtrl.Inst().ServerTime;
        })
        //深渊庆典
        ActivityData.Inst().RegisterCountDown(Mod.DeepCele.View, () => {
            return ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.DeepCele) - TimeCtrl.Inst().ServerTime;
        })
        //深渊礼包
        ActivityData.Inst().RegisterCountDown(Mod.DeepCeleGift.View, () => {
            return ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.DeepCeleGift) - TimeCtrl.Inst().ServerTime;
        })
        //广告特权
        ActivityData.Inst().Register(Mod.AdFree.View, () => {
            return !AdFreeData.Inst().GetIsBuyAdFree();
        }, AdFreeData.Inst().FlushData)
        //深渊礼包
        ActivityData.Inst().RegisterCountDown(Mod.InviteFriend.View, () => {
            return InviteFriendData.Inst().getEndTime() - TimeCtrl.Inst().ServerTime;
        })
        //后宅探险
        ActivityData.Inst().RegisterCountDown(Mod.HouZai.View, () => {
            return ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.HouZai) - TimeCtrl.Inst().ServerTime;
        })
        //连续七天礼包
        ActivityData.Inst().Register(Mod.GeneTask.View, () => {
            return GeneTaskData.Inst().GetIsActiveOver();
        }, GeneTaskData.Inst().FlushData)
        //基因新手礼包
        ActivityData.Inst().Register(Mod.GeneGift.View, () => {
            return GeneGiftData.Inst().GetIsActiveOver();
        }, GeneGiftData.Inst().FlushData)
        //限时累充
        ActivityData.Inst().RegisterCountDown(Mod.LimitedRecharge.View, () => {
            return ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.LimitedRecharge) - TimeCtrl.Inst().ServerTime;
        })
        //基因定向礼包
        ActivityData.Inst().RegisterCountDown(Mod.GeneOrientation.View, () => {
            return Number(GeneOrientationData.Inst().getEndTime(GeneOrientationData.Inst().getNewIndex())) - TimeCtrl.Inst().ServerTime;
        })
        //英雄试用
        ActivityData.Inst().Register(Mod.HeroTrial.View, () => {
            return HeroTrialData.Inst().GetIsActiveOver();
        }, HeroTrialData.Inst().FlushData)
        //英雄试用
        ActivityData.Inst().Register(Mod.SevenDaysPack.View, () => {
            return SevenDaysPackData.Inst().GetIsActiveOver();
        }, SevenDaysPackData.Inst().FlushData)
        //基因定向礼包
        ActivityData.Inst().RegisterCountDown(Mod.Cultivate.View, () => {
            return ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.Cultivate) - TimeCtrl.Inst().ServerTime;
        })
        //竞技场
        ActivityData.Inst().RegisterCountDown(Mod.Arena.View, () => {
            return ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.Arena) - TimeCtrl.Inst().ServerTime;
        })
        //抽奖
        ActivityData.Inst().RegisterCountDown(Mod.DrawCard.View, () => {
            return ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.DrawCard) - TimeCtrl.Inst().ServerTime;
        })
    }

}

