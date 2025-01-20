import { LogError } from 'core/Debugger';
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { SevenDayHeroData } from './SevenDayHeroData';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { Mod } from 'modules/common/ModuleDefine';

export class SevenDayHeroCtrl extends BaseCtrl {
    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCSevenDayHeroInfo, func: this.OnSevenDayHeroInfo },
        ]
    }

    protected initCtrl() {
        this.handleCollector.Add(RemindRegister.Create(Mod.SevenDayHero.View, SevenDayHeroData.Inst().FlushData, SevenDayHeroData.Inst().GetAllRed.bind(SevenDayHeroData.Inst()), "FlushInfo"));
    }

    public OnSevenDayHeroInfo(protocol: PB_SCSevenDayHeroInfo) {
        LogError("OnSevenDayHeroInfo", protocol)
        SevenDayHeroData.Inst().SetSevenDayHeroInfo(protocol);
    }

    public SendSevenDayHeroReq(type: number, param: number[] = []) {
        let protocol = this.GetProtocol(PB_CSSevenDayHeroReq);
        protocol.reqType = type;
        protocol.p1 = param[0] ?? 0;
        this.SendToServer(protocol);
    }

    public SendSevenDayHeroReqFetch(seq: number) {
        this.SendSevenDayHeroReq(0, [seq]);
    }
}