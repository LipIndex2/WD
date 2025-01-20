import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { CfgDailyMissionData } from "./CfgTask";

const resPath = "config/ctrl_auto";

export function _CreateCfgMonsterCtrl(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgMonsterCtrl = <_CfgMonsterCtrl>jsonAss.json;
        changeSpwan(CfgMonsterCtrl)
        // Debugger.ExportGlobalForDebug("CfgDailyMissionData", CfgDailyMissionData);
        func(err == null);
    })
}


function changeSpwan(CfgMonsterCtrl: _CfgMonsterCtrl) {
    CfgMonsterCtrl.ctrl_list.forEach(ctrlList => {
        let spwan: string = ctrlList.spwan as any;
        let ar_spwan = spwan.split("|");
        ctrlList.spwan = [];
        ar_spwan.forEach(element => {
            let aar = element.split(",")
            ctrlList.spwan.push([+aar[0], +aar[1]]);
        });
    });

}

export class CfgCtrlList {
    ctrl_type: number
    move_type: number
    spwan: number[][];
    param: number | string;
    speed: number;
}
class _CfgMonsterCtrl {
    ctrl_list: CfgCtrlList[];
}

export let CfgMonsterCtrl: _CfgMonsterCtrl = null;