import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { CfgGameCircle } from "config/CfgGameCircle";

export class GameCircleResultData {
    Info: PB_SCGameCircleInfo
}

export class GameCircleFlushData {
    @smartdata
    FlushInfo: boolean = false;
}

export class GameCircleData extends DataBase {
    public ResultData: GameCircleResultData;
    public FlushData: GameCircleFlushData;

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(GameCircleFlushData);
        this.ResultData = new GameCircleResultData()
    }

    public onGameCircleInfo(data: PB_SCGameCircleInfo) {
        this.ResultData.Info = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    public get Info() {
        return this.ResultData.Info
    }

    public get InfoNewReward() {
        return this.Info ? this.Info.newReward : false
    }

    public get InfoLikeCount() {
        return this.Info ? this.Info.likeCount : 0
    }

    public get InfoSignCount() {
        return this.Info ? this.Info.signCount : 0
    }

    public get InfoTodaySignIn() {
        return this.Info ? this.Info.todaySignIn : false
    }

    CfgNewItemCfg() {
        return CfgGameCircle.new[0].item
    }

    CfgSignInCfg() {
        return CfgGameCircle.sign_in
    }

}
