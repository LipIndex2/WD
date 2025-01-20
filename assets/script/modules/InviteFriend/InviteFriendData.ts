import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { CfgInviteFriend } from "config/CfgInviteFriend";
import { bit } from "core/net/bit";
import { InviteFriendCtrl } from "./InviteFriendCtrl";

export class FriendResultData {
    Info: PB_SCRaFriendInfo
}

export class FriendFlushData {
    @smartdata
    FlushInfo: boolean = false;
}

export class InviteFriendData extends DataBase {
    public ResultData: FriendResultData;
    public FlushData: FriendFlushData;
    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(FriendFlushData);
        this.ResultData = new FriendResultData()
    }

    public get Info() {
        // if (!this.ResultData.Info) {
        //     InviteFriendCtrl.Inst().SendInviteAllInfo()
        // }
        return this.ResultData.Info;
    }

    public OnInviteFriendInfo(data: PB_SCRaFriendInfo) {
        this.ResultData.Info = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    public GetInviteList() {
        let cfg = CfgInviteFriend.reward;
        cfg.sort((a, b) => {
            let fetchA = this.GetInviteIsGet(a.type) ? 1 : 0;
            let fetchB = this.GetInviteIsGet(b.type) ? 1 : 0;
            if (fetchA != fetchB) {
                return fetchA - fetchB;
            }
        })
        return cfg;
    }

    public getEndTime() {
        let date = new Date()
        let time = new Date(date.getFullYear(), date.getMonth() + 1, 1)
        return time.getTime() / 1000;
    }

    public GetInviteJindu() {
        return this.Info ? this.Info.friendCount : 0;
    }

    public GetInviteIsGet(type: number) {
        if (this.Info && this.Info.rewardFlag != undefined) {
            return bit.d2b(this.Info.rewardFlag)[32 - type] == 1
        }
        return false
    }

    public GetAllRed() {
        let cfg = this.GetInviteList()
        let invite_num = this.GetInviteJindu()
        for (const info of cfg) {
            if (info.invitation_friend_num <= invite_num && !this.GetInviteIsGet(info.type)) {
                return 1
            }
        }
        return 0
    }
}
