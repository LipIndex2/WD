import { DataBase } from "data/DataBase";
import { CreateSMD, smartdata } from "data/SmartData";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { ActivityData } from "modules/activity/ActivityData";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { Language } from "modules/common/Language";
import { Mod } from "modules/common/ModuleDefine";
import { RoleData } from "modules/role/RoleData";


export class RankResultData {
    MainFBRank: PB_MainFBRankInfo;
    RankInfo: { [type: number]: PB_SCRankList } = {};
}

export class RankFlushData {
    @smartdata
    FlushMainFBRank: boolean = false;

    @smartdata
    FlushRankListInfo: boolean = false;
}

export enum RANK_TYPE {
    Main = 0,   // 主线
    Zombie = 1, //僵尸冲冲冲
    Hero = 2,   //英雄
    DefenseHome = 3,    //守护后院
    Arena = 4,  //竞技场

    Fish = 6,  //钓鱼
}

export let RankNoBtnListShow: { [key: number]: boolean } = {
    [RANK_TYPE.Zombie]: true,
    [RANK_TYPE.DefenseHome]: true,
    [RANK_TYPE.Arena]: true,
    [RANK_TYPE.Fish]: true,
}

export class RankData extends DataBase {

    public ResultData: RankResultData;
    public FlushData: RankFlushData;
    private cur_rank_type: RANK_TYPE = RANK_TYPE.Main;//当前展示的排行榜类型

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(RankFlushData);
        this.ResultData = new RankResultData()
    }

    public SetMainFBRankInfo(protocol: PB_MainFBRankInfo) {
        if (protocol.beginRank == 0) {
            this.ResultData.MainFBRank = protocol
        }
        else if (this.MainFBRank) {
            let rank_list = this.MainFBRankRankList
            for (let i = 0; i < protocol.rankList.length; i++) {
                rank_list[i + protocol.beginRank] = protocol.rankList[i];
            }
            this.ResultData.MainFBRank = protocol;
            this.MainFBRankRankList = rank_list;
        }
        this.FlushData.FlushMainFBRank = !this.FlushData.FlushMainFBRank
    }

    public SetRankListInfo(protocol: PB_SCRankList) {
        if (protocol.listBegin == 0 || !this.ResultData.RankInfo[protocol.type])
            this.ResultData.RankInfo[protocol.type] = protocol;
        else if (this.ResultData.RankInfo[protocol.type]) {
            let rank_list = this.ResultData.RankInfo[protocol.type].ranklist;
            for (let i = 0; i < protocol.ranklist.length; i++) {
                rank_list[i + protocol.listBegin] = protocol.ranklist[i];
            }
            this.ResultData.RankInfo[protocol.type] = protocol;
            this.ResultData.RankInfo[protocol.type].ranklist = rank_list;
        }
        this.FlushData.FlushRankListInfo = !this.FlushData.FlushRankListInfo;
    }

    public set CurRankType(type: RANK_TYPE) {
        this.cur_rank_type = type;
    }

    public get CurRankType() {
        return this.cur_rank_type;
    }

    public get RankListInfo() {
        return this.ResultData.RankInfo
    }

    public get MainFBRank() {
        return this.ResultData.MainFBRank
    }

    public set MainFBRankRankList(value: any) {
        if (this.MainFBRank) {
            this.MainFBRank.rankList = value
        }
    }

    public get MainFBRankRankList() {
        return this.MainFBRank ? this.MainFBRank.rankList : []
    }

    public get MainFBRankRankMe() {
        return {
            roleInfo: RoleData.Inst().InfoRoleInfo,
            rankLevel: this.MainFBRank ? this.MainFBRank.myPassLevel : 0
        }
    }

    public get MainFBRankRankMeRank() {
        return this.MainFBRank ? this.MainFBRank.myRank : 0
    }

    public GetMyRank(type: RANK_TYPE) {
        if (RANK_TYPE.Main == type) {
            return this.MainFBRankRankMeRank
        } else {
            return this.RankListInfo[type] ? this.RankListInfo[type].myRank : 0
        }
    }

    public GetMyRankInfo(type: RANK_TYPE) {
        if (RANK_TYPE.Main == type) {
            return this.MainFBRankRankMe
        } else {
            return {
                roleInfo: RoleData.Inst().InfoRoleInfo,
                rankLevel: this.RankListInfo[type] ? this.RankListInfo[type].myRankValue : 0
            }
        }
    }

    public GetRankList(type: RANK_TYPE) {
        if (RANK_TYPE.Main == type) {
            return this.MainFBRankRankList
        } else {
            return this.RankListInfo[type] ? this.RankListInfo[type].ranklist : []
        }
    }

    public getRankInfo(type: RANK_TYPE) {
        if (RANK_TYPE.Main == type) {
            return this.ResultData.MainFBRank
        } else {
            return this.RankListInfo[type]
        }
    }

    public IsMax(type: RANK_TYPE) {
        let list = this.GetRankList(type);
        return list.length % 10 != 0;
    }

    public GetReqParam(type: number): number {
        let list = this.GetRankList(type);
        return list.length % 10 == 0 ? list.length : 0;
    }

    public ClearRankData() {
        if (this.MainFBRankRankList) {
            this.MainFBRankRankList = []
        }
        if (this.ResultData.RankInfo) {
            this.ResultData.RankInfo = {}
        }
    }

    public GetTitle(type: RANK_TYPE) {
        switch (type) {
            case RANK_TYPE.Main:
                return Language.Rank.title;
            case RANK_TYPE.Zombie:
                return Language.Rank.Zombie;
            case RANK_TYPE.Hero:
                return Language.Rank.Herotitle;
            case RANK_TYPE.Arena:
                return Language.Rank.ArenaTitle;
            default:
                return Language.Rank.rankTitle;
        }
    }

    public GetBgIcon(type: RANK_TYPE) {
        let bg = "BeiJing";
        let titleBg = "BiaoTiDi";
        switch (type) {
            case RANK_TYPE.Hero:
                bg = "bg";
                titleBg = "BiaoTi";
                break;
            case RANK_TYPE.Arena:
                bg = "ArenaBG";
                break;
            case RANK_TYPE.Fish:
                bg = "DiaoYuJingJiChangBeiJing";
                break;
        }
        return { bg: bg, titleBg: titleBg }
    }

    public GetBtnListIndex(RankAct: any, type: number) {
        for (let i = 0; i < RankAct.length; i++) {
            if (RankAct[i].type == type) {
                return i
            }
        }
        return 0;
    }

    public GetBtnList(RankAct: any) {
        // let data = [];
        // for (let i = 0; i < RankAct.length; i++) {
        //     if (RankAct[i].type == RANK_TYPE.Zombie) {
        //         let isOpen = ActivityData.Inst().IsOpen(ACTIVITY_TYPE.ZombieGoGoGo);
        //         let funOpen = FunOpen.Inst().GetFunIsOpen(Mod.ZombieGoGoGo.View);
        //         if (isOpen && funOpen.is_open) {
        //             data.push(RankAct[i])
        //         }
        //     } else {
        //         data.push(RankAct[i])
        //     }
        // }
        return RankAct
    }

}

