import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { CfgGetWayData } from "config/CfgGetWay";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { Language } from "modules/common/Language";
import { Mod } from "modules/common/ModuleDefine";
import { IsEmpty } from "../../helpers/UtilHelper";
import { ActivityData } from "modules/activity/ActivityData";

export class GetWayData extends DataBase {  
    //public ResultData : LoginResultData;
    constructor(){
        super();
        // this.createSmartData();
    }

    public GetWayList(fix_str: string) {
        let strs = fix_str.toString().split("|")
        let fix_list = []
        let cfg = CfgGetWayData.get_way
        let has_act = false
        for (var index in strs) {
            for (var [key, value] of cfg.entries()) {
                if (cfg[key].id == Number(strs[index])) {
                    has_act = has_act || value.act_type > 0
                    if (IsEmpty(value.open_panel)) continue;
                    let groupList = this.getModGroup(value.open_panel);
                    if (!FunOpen.Inst().GetFunIsOpen(groupList["View"]).is_open) continue;
                    if (0 == value.act_type || ActivityData.Inst().IsOpen(value.act_type)) {
                        fix_list.push(value)
                    }
                }
            }
        }
        if (has_act && 0 == fix_list.length) {
            fix_list.push({
                desc: Language.Common.ActShow,
                open_panel: 0
            })
        }
        return fix_list
    }

    public getModGroup(modkey: number) {
        let allGroupKeys = Object.getOwnPropertyNames(Mod);
        for (let index = 0; index < allGroupKeys.length; index++) {
            let groupList = Mod[allGroupKeys[index]];
            let allKeys = Object.getOwnPropertyNames(groupList);
            //modkey可能存在多个组里。不Break
            for (let index2 = 0; index2 < allKeys.length; index2++) {
                if (groupList[allKeys[index2]] == modkey) {
                    return groupList;
                }
            }
        }

    }
}
