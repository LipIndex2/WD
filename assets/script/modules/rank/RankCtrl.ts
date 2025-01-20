import { LogError } from 'core/Debugger';
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { MainFBCtrl } from 'modules/main_fb/MainFBCtrl';
import { RankData, RANK_TYPE } from './RankData';

export class RankCtrl extends BaseCtrl {
    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_MainFBRankInfo, func: this.OnMainFBRankInfo },
            { msgType: PB_SCRankList, func: this.SetRankListInfo },
        ]
    }

    protected initCtrl() {
        // this.handleCollector.Add(RemindRegister.Create(Mod.DeepCele.View, DeepCeleData.Inst().FlushData, DeepCeleData.Inst().GetAllTaskRed.bind(DeepCeleData.Inst()), "FlushTaskInfo"));
    }

    public OnMainFBRankInfo(protocol: PB_MainFBRankInfo) {
        LogError("OnMainFBRankInfo", protocol)
        RankData.Inst().SetMainFBRankInfo(protocol);
    }

    public SetRankListInfo(protocol: PB_SCRankList) {
        RankData.Inst().SetRankListInfo(protocol);
    }

    public SendRankReq(type: RANK_TYPE, list_begin?: number, check = true) {
        if (!RankData.Inst().IsMax(type) || !check) {
            if (type == RANK_TYPE.Main) {
                MainFBCtrl.Inst().SendMainFBOperRankInfo(list_begin ?? RankData.Inst().GetReqParam(type))
            } else {
                list_begin = list_begin ?? RankData.Inst().GetReqParam(type);
                let protocol = this.GetProtocol(PB_CSRankReq);
                protocol.type = type;
                protocol.listBegin = list_begin ?? 0;
                this.SendToServer(protocol);
            }
        }
    }

}