import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { CfgGeneOrientation } from "config/CfgGeneOrientation";


/*
class LoginResultData{
    @smartdata
    result:number;
}
*/

export class GeneGiftResultData {
    Info: PB_SCRaGeneGiftInfo
}

export class GeneGiftFlushData {
    @smartdata
    FlushInfo: boolean = false;
}

export class GeneOrientationData extends DataBase {
    public ResultData: GeneGiftResultData;
    public FlushData: GeneGiftFlushData;

    private showViewHeroId: number = 0;

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(GeneGiftFlushData);
        this.ResultData = new GeneGiftResultData()

    }

    public OnGeneOrientationInfo(data: PB_SCRaGeneGiftInfo) {
        this.ResultData.Info = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo;
    }

    public get Info() {
        return this.ResultData.Info
    }


    getGiftHeroId() {
        return this.Info ? this.Info.giftHeroId[0] : 0
    }

    getIndexGiftHeroId(index: number) {
        return this.Info ? this.Info.giftHeroId[index] : 0
    }

    getEndTime(index: number) {
        return this.Info ? this.Info.giftEndTime[index] : 0;
    }
    getGiftNum() {
        let num = 0;
        if (!this.Info) return num
        for (let index = this.Info.giftEndTime.length - 1; index >= 0; index--) {
            let eTime = this.Info.giftEndTime[index];
            if (Number(eTime) > TimeCtrl.Inst().ServerTime) {
                num++;
            }
        }
        return num;
    }

    setShowView(HeroId: number) {
        this.showViewHeroId = HeroId;
    }

    getNewGiftHeroId() {
        if (!this.Info) return 0
        for (let index = this.Info.giftEndTime.length - 1; index >= 0; index--) {
            let eTime = this.Info.giftEndTime[index];
            if (Number(eTime) > TimeCtrl.Inst().ServerTime) {
                return this.Info.giftHeroId[index];
            }
        }
        return 0;
    }
    getNewIndex() {
        if (this.Info == null) {
            return 0;
        }

        let NewIndex = 0;
        let newTime = 0;
        for (let index = this.Info.giftEndTime.length - 1; index >= 0; index--) {
            let eTime = this.Info.giftEndTime[index];
            if (Number(eTime) > newTime) {
                NewIndex = index
            }
            newTime = Number(eTime);
        }
        return NewIndex;
    }

    getIndex(HeroId: number) {
        if (!this.Info) return 0
        for (let index = this.Info.giftHeroId.length - 1; index >= 0; index--) {
            if (this.Info.giftHeroId[index] == HeroId) {
                return index;
            }
        }
        return 0;
    }

    GetInfo() {
        return this.ResultData.Info;
    }

    GetIsShowView() {
        let eTime = this.Info.giftEndTime[this.getNewIndex()];
        if (Number(eTime) > TimeCtrl.Inst().ServerTime && Number(eTime) - TimeCtrl.Inst().ServerTime > 90 * 60 && this.showViewHeroId != this.Info.giftHeroId[this.getNewIndex()]) {
            return true;
        }
        return false;
    }

    GetShopGiftHeroId(index: number) {
        let giftHeroId = JSON.parse(JSON.stringify(this.Info.giftHeroId));
        giftHeroId.sort(function (A: number, B: number) {
            return B - A;
        });
        return this.Info ? giftHeroId[index] : 0
    }

    GetIsGeneOrientationOpen() {
        if (!this.Info) return false
        for (let index = 0; index < this.Info.giftEndTime.length; index++) {
            let eTime = this.Info.giftEndTime[index];
            if (Number(eTime) > TimeCtrl.Inst().ServerTime) {
                return true;
            }
        }
        return false;
    }

    public GetGiftCfg(giftHeroId: number) {
        return CfgGeneOrientation.gift.find(cfg => cfg.hero_id == giftHeroId)
    }

    public GetIsActiveOver() {
        let index = this.getNewIndex()
        if (this.getEndTime(index) == 0) {
            return false;
        } else {
            return true;
        }
    }

}

