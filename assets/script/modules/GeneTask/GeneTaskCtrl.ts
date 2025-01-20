import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { GeneTaskData } from './GeneTaskData';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { Mod } from 'modules/common/ModuleDefine';
import { HeroCtrl, HeroReqType } from 'modules/hero/HeroCtrl';

export class GeneTaskCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCGeneTaskInfo, func: this.OnGeneTaskInfo }
        ]
    }

    protected initCtrl() {
        this.handleCollector.Add(RemindRegister.Create(Mod.GeneTask.View, GeneTaskData.Inst().FlushData, GeneTaskData.Inst().GetTaskRed.bind(GeneTaskData.Inst()), "FlushInfo"));
    }

    private OnGeneTaskInfo(data: PB_SCGeneTaskInfo) {
        GeneTaskData.Inst().OnGeneTaskInfo(data)
    }

    SendGeneTask(seq: number) {
        HeroCtrl.Inst().SendHeroReq(HeroReqType.HERO_GENE_TASK, [seq])
    }
}

