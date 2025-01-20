import { HeroData } from 'modules/hero/HeroData';
import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { CfgDnaTask } from "config/CfgDnaTask";

export class GeneTaskResultData {
    Info: PB_SCGeneTaskInfo
}

export class GeneTaskFlushData {
    @smartdata
    FlushInfo: boolean = false;
}

export class GeneTaskData extends DataBase {

    public ResultData: GeneTaskResultData;
    public FlushData: GeneTaskFlushData;
    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(GeneTaskFlushData);
        this.ResultData = new GeneTaskResultData()
    }

    public OnGeneTaskInfo(data: PB_SCGeneTaskInfo) {
        this.ResultData.Info = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    public get Info() {
        return this.ResultData.Info
    }

    public get TaskProgress() {
        return this.Info ? this.Info.taskProgress : [];
    }

    public get TaskFetch() {
        return this.Info ? this.Info.isFetch : [];
    }

    GetTask() {
        let data = [];
        let cfg = CfgDnaTask.dna_mission;
        for (let i = 0; i < cfg.length; i++) {
            data.push({
                cfg: cfg[i],
                value: this.TaskProgress[cfg[i].type] ?? 0,
                isFetch: this.TaskFetch[cfg[i].seq] ?? false,
            });
        }
        data.sort((a, b) => {
            if (a.isFetch && !b.isFetch) {
                return 1;
            } else if (!a.isFetch && b.isFetch) {
                return -1;
            }
            let fetchAbleA = (a.value ?? 0) >= a.cfg.pram1
            let fetchAbleB = (b.value ?? 0) >= b.cfg.pram1
            if (fetchAbleA && !fetchAbleB) {
                return -1;
            } else if (!fetchAbleA && fetchAbleB) {
                return 1;
            }
            return a.cfg.seq - b.cfg.seq;
        });
        return data
    }

    GetTaskRed() {
        let list = this.GetTask();
        for (let i = 0; i < list.length; i++) {
            if (!list[i].isFetch && list[i].value >= list[i].cfg.pram1) {
                return 1
            }
        }
        return 0
    }

    IsAllFetch() {
        for (let i = 0; i < this.TaskFetch.length; i++) {
            if (!this.TaskFetch[i]) {
                return false
            }
        }
        return true
    }

    GetIsActiveOver() {
        if (!HeroData.Inst().IsHeroLevel(7)) {
            return false;
        }
        if (HeroData.Inst().GeneList.length == 0) {
            return false;
        }
        if(this.IsAllFetch()){
            return false;
        }
        return true
    }

}
