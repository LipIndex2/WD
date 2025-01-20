import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { GameCircleData } from './GameCircleData';

enum GameCircleType {
    Info,//请求信息系
    Link,//点赞发送
    NewReward,//领取奖励
    SignIn,//签到
}

export class GameCircleCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCGameCircleInfo, func: this.onGameCircleInfo }
        ]
    }

    private onGameCircleInfo(data: PB_SCGameCircleInfo) {
        GameCircleData.Inst().onGameCircleInfo(data)
    }

    public SendGameCircleReq(reqType?: number, param1?: number[]) {
        let protocol = this.GetProtocol(PB_CSGameCircleReq);
        protocol.reqType = reqType;
        protocol.reqParam = param1 ?? [0];
        this.SendToServer(protocol);
    }

    public SendGameCircleReqInfo() {//0点请求一下
        this.SendGameCircleReq(GameCircleType.Info)
    }

    public SendLike() {//点赞一次，发一次
        this.SendGameCircleReq(GameCircleType.Link)
    }

    public SendNewReward() {
        this.SendGameCircleReq(GameCircleType.NewReward)
    }

    public SendSignIn() {//签到
        this.SendGameCircleReq(GameCircleType.SignIn)
    }
}

