import { LogError } from 'core/Debugger';
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { MiningData } from './MiningData';
import { CfgInstituteLevel } from 'config/CfgInstitute';
import { InstituteTalentType } from 'modules/Institute/InstituteCtrl';

export enum MiningReqType{
    Info = 0,       //请求信息
    Excvate = 1,    //挖            p1:高度[now_hight, now_hight - 6] ,p2宽度[0,5]
    Drill = 2,      //钻头          p1:高度[now_hight, now_hight - 6] ,p2宽度[0,5]
    Domb = 3,       //炸弹          p1:高度[now_hight, now_hight - 6] ,p2宽度[0,5]
    GetReward = 4,  //领取米数奖励

    InstituteInfo = 5,      //研究所信息
    InstituteUpLevel = 6,   //研究生升级    p1: id
    InstituteJump = 7,      //跳过研究
    InstituteEnd = 8,       //研究结束
}

export class MiningCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCMiningCaveInfo, func: this.OnScMiningInfo }
        ]
    }

    
    private OnScMiningInfo(data: PB_SCMiningCaveInfo) {
        LogError("矿洞信息下发", data);
        MiningData.Inst().SetSceneInfo(data);
    }

    SendReq(reqType: MiningReqType, p1?:number, p2?:number){
        let protocol = this.GetProtocol(PB_CSMiningCaveReq);
        protocol.opType = reqType;
        protocol.p1 = p1 ?? 0;
        protocol.p2 = p2 ?? 0;
        this.SendToServer(protocol);
        LogError("矿洞信息请求", protocol.opType, protocol.p1, protocol.p2);
    }

    ReqInfo(){
        this.SendReq(MiningReqType.Info);
    }

}

//研究所处理
type InstituteTalentFunc = (cfg:CfgInstituteLevel) => void;
export var MiningInstituteTalentHandle: { [key: number]: InstituteTalentFunc } = {
    [InstituteTalentType.ExcavateNum]: (cfg:CfgInstituteLevel) => {
        
    },
    [InstituteTalentType.ExcavateResetTime]: (cfg:CfgInstituteLevel) => {
        
    },
}

