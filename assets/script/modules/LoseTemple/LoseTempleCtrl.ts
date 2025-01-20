import { LogError } from 'core/Debugger';
import { ViewManager } from 'manager/ViewManager';
import { BattleEventType, SceneType } from 'modules/Battle/BattleConfig';
import { ActivityCtrl } from 'modules/activity/ActivityCtrl';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { EventCtrl } from 'modules/common/EventCtrl';
import { LoseTempleData } from './LoseTempleData';
import { LoseTempleView } from './LoseTempleView';
import { RemindRegister, SMDHandle } from 'data/HandleCollectorCfg';
import { SMDTriggerNotify } from 'data/SmartData';
import { BagData } from 'modules/bag/BagData';
import { Mod } from 'modules/common/ModuleDefine';

export enum LostReqType {
    INFO,				    //神殿信息
    TEMPLE_SHOP_INFO,	    //商店商店信息
    TEMPLE_SHOP_BUY,		//神殿商店购买		p1:seq	p2:数量
    START,				    //开始				p1:diff
    MOVE,				    //移动				p1:block
    MYSTERIOUS_SHOP,		//神秘商店购买		p1:商人index[0,2] p2:商品index[0,11]
    SELECT_REMAINS,		    //选择遗物			p1:遗物index[0,2] 
    SELECT_BONFIRE,		    //选择篝火			p1:篝火index[0,2] 
    SELECT_PUB_HERO,		//选择酒馆英雄		p1:英雄index[0,2] 
    OPEN_END_BOX,		    //开启层底宝箱		
    SET_FIGHT,			    //设置出战			p1:index[0,3] p2:英雄id
    NEXT_STOREY,			//下一层			
    MISSION,				//领取任务奖励		p1:seq
    MISSION_REWARD,	    	//领取任务积分奖励	p1:seq
    ENERGY_CONSUME,         //恢复英雄体力      p1:英雄id
}

export class LoseTempleCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCLostTempleInfo, func: this.setLoseTempleInfo },
            { msgType: PB_SCLostTempleShopInfo, func: this.setLoseTempleShopInfo },
            { msgType: PB_SCLostTempleMissionInfo, func: this.setLoseTempleTaskInfo },
        ]
    }

    protected initCtrl() {
        EventCtrl.Inst().on(BattleEventType.BattleExit, this.BattleExit, this);
        this.handleCollector.Add(RemindRegister.Create(Mod.LoseTemple.Achievement, LoseTempleData.Inst().FlushData, LoseTempleData.Inst().AchievementAllRed.bind(LoseTempleData.Inst()), "FlushTaskInfo"));
        this.handleCollector.Add(SMDHandle.Create(BagData.Inst().BagItemData, this.BagNumChange.bind(this), "OtherChange"));
    }

    BagNumChange() {
        SMDTriggerNotify(LoseTempleData.Inst().FlushData, "FlushTaskInfo")
    }

    BattleExit(type: SceneType) {
        if (type == SceneType.ShenDian) {
            //ViewManager.Inst().OpenView(LoseTempleView)
        }
    }

    private setLoseTempleInfo(data: PB_SCLostTempleInfo) {
        LogError("setLoseTempleInfo", data)
        LoseTempleData.Inst().setLoseTempleInfo(data);
    }

    private setLoseTempleShopInfo(data: PB_SCLostTempleShopInfo) {
        LoseTempleData.Inst().setLoseTempleShopInfo(data);
    }

    private setLoseTempleTaskInfo(data: PB_SCLostTempleMissionInfo) {
        LoseTempleData.Inst().setLoseTempleTaskInfo(data);
    }

    SendLoseInfo() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.LoseTemple, LostReqType.INFO)
    }

    SendLoseTempleShopInfo() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.LoseTemple, LostReqType.TEMPLE_SHOP_INFO)
    }

    SendLoseTempleShopBuy(seq: number, num: number) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.LoseTemple, LostReqType.TEMPLE_SHOP_BUY, seq, num)
    }

    SendLoseStart(diff: number) {
        LoseTempleData.difficulty = diff;
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.LoseTemple, LostReqType.START, diff)
    }

    SendLoseMove(block: number) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.LoseTemple, LostReqType.MOVE, block)
    }

    SendLoseMysteriousShop(index: number, seq: number) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.LoseTemple, LostReqType.MYSTERIOUS_SHOP, index, seq)
    }

    SendLoseSelectRemains(index: number) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.LoseTemple, LostReqType.SELECT_REMAINS, index)
    }

    SendLoseSelectBonfire(index: number) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.LoseTemple, LostReqType.SELECT_BONFIRE, index)
    }

    SendLoseSelectPubHero(index: number) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.LoseTemple, LostReqType.SELECT_PUB_HERO, index)
    }

    SendLoseOpenEndBox() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.LoseTemple, LostReqType.OPEN_END_BOX)
    }

    SendLoseSetFight(index: number, id: number) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.LoseTemple, LostReqType.SET_FIGHT, index, id)
    }

    SendLoseNextStorey() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.LoseTemple, LostReqType.NEXT_STOREY)
    }

    SendLoseMission(seq: number) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.LoseTemple, LostReqType.MISSION, seq)
    }

    SendLoseMissionReward(seq: number) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.LoseTemple, LostReqType.MISSION_REWARD, seq)
    }

    SendLoseEnergyConsume(id: number) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.LoseTemple, LostReqType.ENERGY_CONSUME, id)
    }

}

