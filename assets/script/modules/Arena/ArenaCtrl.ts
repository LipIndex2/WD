import { LogError } from 'core/Debugger';
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { ArenaData } from './ArenaData';
import { ViewManager } from 'manager/ViewManager';
import { ArenaMatching } from './ArenaMatching';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { Mod } from 'modules/common/ModuleDefine';
import { ArenaPassData } from 'modules/ArenaPass/ArenaPassCtrl';
import { ArenaRankChange } from './ArenaRankChange';
import { sys } from 'cc';
import { Prefskey } from 'modules/common/PrefsKey';

export enum ArenaReq{
    Info = 0,       //请求信息      *
    SetHero = 1,    //设置英雄  p1:英雄id列表，p2:英雄等级列表
    SetSkill = 2,   //设置词条 p1:词条列表
    Match = 3,      //匹配
    ShopInfo = 4,   //商店信息
    ShopBuy = 5,    //购买 p1:seq|数量
    ReportInfo = 6, //战报
    SetSkin = 7,    //设置皮肤 p1:seq
    BuyChallengeItem = 8,   //购买挑战卷， p1数量
    GetReward = 9,  //领取段位奖励
}

// GMArenaAddScore:300  加300积分

export class ArenaCtrl extends BaseCtrl {

    isOpenArenaChange = false;


    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCArenaInfo, func: this.OnSCArenaInfo },
            { msgType: PB_SCArenaTargetInfo, func: this.OnSCArenaTargetInfo },
            { msgType: PB_SCArenaShopInfo, func: this.OnSCArenaShoptInfo},
            { msgType: PB_SCArenaReportInfo, func: this.OnSCArenaReportInfo},
            { msgType: PB_SCArenaMapInfo, func: this.OnSCArenaMapInfo},
            { msgType: PB_SCArenaBuyInfo, func: this.OnSCArenaBuyInfo},
            { msgType: PB_SCRaArenaDailyGiftInfo, func: this.OnSCDailyGiftBuyInfo},
        ]
    }

    protected initCtrl(): void {
        this.handleCollector.Add(RemindRegister.Create(Mod.Arena.View, ArenaData.Inst().smdData, this.GetRemind.bind(this), "flushData"));
    }

    GetRemind():number{
        let num = ArenaData.Inst().AllRemind();
        return num;
    }

    //请求
    SendReq(req_type:ArenaReq, p1:number[] = [], p2:number[] = []){
        let protocol = this.GetProtocol(PB_CSArenaReq);
        protocol.type = req_type;
        protocol.param1 = p1
        protocol.param2 = p2
        this.SendToServer(protocol);
        LogError("竞技场请求", protocol.type, protocol.param1, protocol.param2);
    }

    
    //主界面信息
    private OnSCArenaInfo(data: PB_SCArenaInfo) {
        LogError("竞技场主界面下发", data)
        let changeParam = ArenaData.Inst().rankChange;
        if(ArenaData.Inst().mainInfo){
            changeParam.lastRank = ArenaData.Inst().rank;
            changeParam.lastRankOrder = ArenaData.Inst().rankOrder;
            changeParam.lastScore = ArenaData.Inst().score;
        }
        changeParam.rank = data.rank;
        changeParam.rankOrder = data.rankOrder;
        changeParam.score = data.score;
        ArenaData.Inst().mainInfo = data;

        if(this.isOpenArenaChange){
            ViewManager.Inst().OpenView(ArenaRankChange, ArenaData.Inst().rankChange);
        }
        this.isOpenArenaChange = false;
        ArenaData.Inst().FlushRemind();
    }

    //匹配到的对手信息
    private OnSCArenaTargetInfo(data: PB_SCArenaTargetInfo) {
        LogError("竞技场对手信息下发", data)
        ArenaData.Inst().matchInfo = data;
        // if(ViewManager.Inst().IsOpen(ArenaMatching)){
        //     ViewManager.Inst().CloseView(ArenaMatching);
        // }
    }

    //商店信息
    private OnSCArenaShoptInfo(data: PB_SCArenaShopInfo){
        LogError("竞技场商店信息", data)
        ArenaData.Inst().shopInfo = data;
    }

    //战报信息
    private OnSCArenaReportInfo(data: PB_SCArenaReportInfo){
        //战报信息
        LogError("竞技场战报信息", data)
        ArenaData.Inst().reportInfo = data;
    }

    //皮肤信息
    private OnSCArenaMapInfo(data: PB_SCArenaMapInfo){
        //战报信息
        LogError("竞技场皮肤信息", data)
        ArenaData.Inst().skinInfo = data;
    }

    private OnSCArenaBuyInfo(data: PB_SCArenaBuyInfo){
        ArenaData.Inst().smdData.buyInfo = data;
    }

    private OnSCDailyGiftBuyInfo(data: PB_SCRaArenaDailyGiftInfo){
        ArenaData.Inst().smdData.dailyGift = data;
    }

}

