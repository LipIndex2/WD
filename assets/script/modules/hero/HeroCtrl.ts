import { RemindRegister } from 'data/HandleCollectorCfg';
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { Mod } from 'modules/common/ModuleDefine';
import { HeroData } from './HeroData';

export enum HeroReqType {
    HERO_INFO,          //请求全部英雄
    HERO_UP,            //升阶
    HERO_BATTLE,        //出站

    HERO_GENE_WEAR,     //基因穿戴
    HERO_GENE_REMOVE,   //基因脱下
    HERO_GENE_UP,       //基因升级
    HERO_GENE_DEC,      //基因分解

    HERO_GENE_TASK,     //基因任务
    HERO_GENE_OPEN_UI,  //打开基因传承
    HERO_GENE_OPEN_UI_INFO,  //打开基因详情
}

export class HeroCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCHeroInfo, func: this.HeroInfoResult },
            { msgType: PB_SCGeneInfo, func: this.setHeroGeneInfoResult },
            { msgType: PB_SCTodayGainInfo, func: this.OnTodayGainInfo }
        ]
    }

    protected initCtrl() {
        this.handleCollector.Add(RemindRegister.Create(Mod.Hero.View, HeroData.Inst().ResultData, HeroData.Inst().GetAllRed.bind(HeroData.Inst()), "heroInfoFlush"));
        // this.handleCollector.Add(RemindRegister.Create(Mod.HeroInfo.Gene, HeroData.Inst().ResultData, HeroData.Inst().GetAllRed.bind(HeroData.Inst()), "heroInfoFlush", "geneInfoFlush"));
    }

    private HeroInfoResult(data: PB_SCHeroInfo) {
        // console.log("英雄信息>>>>>>>>>>>>>>>>", data.heroList);
        HeroData.Inst().setHeroInfo(data);
    }

    private setHeroGeneInfoResult(data: PB_SCGeneInfo) {
        HeroData.Inst().setHeroGeneInfoResult(data);
    }

    private OnTodayGainInfo(protocol: PB_SCTodayGainInfo) {
        HeroData.Inst().SetTodayGainInfo(protocol);
    }

    public SendHeroReq(rep_type: HeroReqType, param?: number[]) {
        let protocol = this.GetProtocol(PB_CSHeroReq);
        protocol.reqType = rep_type; rep_type
        protocol.paramList = param ?? [];
        this.SendToServer(protocol);
    }

    SendHeroGeneWear(id: number, index: number, geneIndex: number) {
        this.SendHeroReq(HeroReqType.HERO_GENE_WEAR, [id, index, geneIndex])
    }

    SendHeroGeneRemove(id: number, index: number) {
        this.SendHeroReq(HeroReqType.HERO_GENE_REMOVE, [id, index])
    }

    SendHeroGeneUp(index: number) {
        this.SendHeroReq(HeroReqType.HERO_GENE_UP, [index])
    }

    SendHeroGeneDEC(id: number) {
        this.SendHeroReq(HeroReqType.HERO_GENE_DEC, [id])
    }

    SendOpenGeneSuit() {
        this.SendHeroReq(HeroReqType.HERO_GENE_OPEN_UI)
    }

    SendOpenGeneInfoUi() {
        this.SendHeroReq(HeroReqType.HERO_GENE_OPEN_UI_INFO)
    }

}

