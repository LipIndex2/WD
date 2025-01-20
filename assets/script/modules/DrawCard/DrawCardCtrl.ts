import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { DrawCardData } from './DrawCardData';
import { ActivityCtrl } from 'modules/activity/ActivityCtrl';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { Mod } from 'modules/common/ModuleDefine';

export class DrawCardCtrl extends BaseCtrl {
    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCRaPickUpInfo, func: this.onDrawCardInfo }
        ]
    }

    protected initCtrl() {
        this.handleCollector.Add(RemindRegister.Create(Mod.DrawCard.View, DrawCardData.Inst().FlushData, DrawCardData.Inst().GetAllRed.bind(DrawCardData.Inst()), "FlushInfo"));
        this.handleCollector.Add(RemindRegister.Create(Mod.DrawCard.Draw, DrawCardData.Inst().FlushData, DrawCardData.Inst().GetDrawRed.bind(DrawCardData.Inst()), "FlushInfo"));
        this.handleCollector.Add(RemindRegister.Create(Mod.DrawCard.Task, DrawCardData.Inst().FlushData, DrawCardData.Inst().GetTaskRed.bind(DrawCardData.Inst()), "FlushInfo"));
    }

    private onDrawCardInfo(data: PB_SCRaPickUpInfo) {
        DrawCardData.Inst().onDrawCardInfo(data)
    }

    SendTaskFetch(seq: number) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.DrawCard, 1, seq)
    }

    SendDrawCard(num: number) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.DrawCard, 2, num)
    }

}

