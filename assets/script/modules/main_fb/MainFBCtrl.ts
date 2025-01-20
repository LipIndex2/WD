import { LogError } from 'core/Debugger';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { Mod } from 'modules/common/ModuleDefine';
import { MainFBConfig } from './MainFBConfig';
import { MainFBData } from './MainFBData';

export class MainFBCtrl extends BaseCtrl {
    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_MainFBInfo, func: this.OnMainFBInfo },
            { msgType: PB_DailyChallengeInfo, func: this.OnDailyChallengeInfo },
        ]
    }

    protected initCtrl() {
        this.handleCollector.Add(RemindRegister.Create(Mod.ActivityCombat.EverydayFB, MainFBData.Inst().FlushData, MainFBData.Inst().GetAllRed.bind(MainFBData.Inst())));
    }

    public OnMainFBInfo(protocol: PB_MainFBInfo) {
        LogError("OnMainFBInfo", protocol)
        MainFBData.Inst().SetMainFBInfo(protocol);
    }

    public OnDailyChallengeInfo(protocol: PB_DailyChallengeInfo) {
        LogError("OnDailyChallengeInfo", protocol)
        MainFBData.Inst().SetDailyChallengeInfo(protocol);
    }

    public SendMainFBOper(type: number, param: number[] = []) {
        let protocol = this.GetProtocol(PB_MainFBOper);
        protocol.operType = type;
        protocol.operParam = param;
        this.SendToServer(protocol);
    }

    public SendMainFBOperInfo(id: number) {
        this.SendMainFBOper(MainFBConfig.ReqType.info, [id]);
    }

    public SendMainFBOperFetchBox(seq: number) {
        this.SendMainFBOper(MainFBConfig.ReqType.fetch_box, [seq]);
    }

    public SendMainFBOperFetchTimeInfo() {
        this.SendMainFBOper(MainFBConfig.ReqType.fetch_time_info);
    }

    public SendMainFBOperFetchTime() {
        this.SendMainFBOper(MainFBConfig.ReqType.fetch_time);
    }

    public SendMainFBOperFetchQuickInfo() {
        this.SendMainFBOper(MainFBConfig.ReqType.fetch_quick_info);
    }

    public SendMainFBOperFetchQuick() {
        this.SendMainFBOper(MainFBConfig.ReqType.fetch_quick);
    }

    public SendMainFBOperEnergyBuy() {
        this.SendMainFBOper(MainFBConfig.ReqType.energy_buy);
    }

    public SendMainFBOperRelive() {
        this.SendMainFBOper(MainFBConfig.ReqType.relive);
    }

    public SendMainFBOperPassInfo(level: number) {
        this.SendMainFBOper(MainFBConfig.ReqType.pass_info, [level]);
    }

    public SendMainFBOperRankInfo(begin_rank: number) {
        this.SendMainFBOper(MainFBConfig.ReqType.rank_info, [begin_rank]);
    }

    public SendDailyChallengeFetch(index: number) {
        let protocol = this.GetProtocol(PB_DailyChallengeFetch);
        protocol.missionIndex = index;
        this.SendToServer(protocol);
    }

}