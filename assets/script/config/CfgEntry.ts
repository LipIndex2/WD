import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";

const resPath = "config/entry_auto";

export function _CreateCfgEntry(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgEntry = <_CfgEntryData>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgEntry", CfgEntry);
        func(err == null);
    })
}

export class CfgSkillData {
    color: number;
    skill_id: number;
    word: string;
    appear:number|string;
    pram1:number;
    pram2:number;
    pram3:number;
    pram4:number;
    fake_param_1:number;
    fake_param_2:number;
    fake_param_3:number;
    fake_param_4:number;
    hero_id:number;
    skill_type:number;
    icon_num:string;
    icon_res_id:number|string;
    hero_link:string;
    superposition:number;
    entry_source: number;
}

export class CfgSkillGroup{
    entry_group_type: number;
    skill_id: number;
    rate:number;
}

export class CfgSkillOther{
    barrier_type:number;
    rate:number;                //公用词条概率
    hero_color1_rate:number;    //英雄词条绿色概率
    hero_color2_rate:number;    //蓝色概率
    hero_color3_rate:number;    //紫色概率
}

export class CfgSkillIconOther{
    skill_id:number;
    hero_id:number;
    icon_res_id:number;
}



class _CfgEntryData {
    public_entry: CfgSkillData[];
    entry_group: CfgSkillGroup[];
    other: CfgSkillOther[];
    other_entry: CfgSkillIconOther[];
}

export let CfgEntry: _CfgEntryData = null;
/* (检查以下，然后删除注释)
    1.改resPath路径
    2.CfgManager注册
    3.可选 从表把字段名那行复制下来，粘贴后每个一行，Alt+鼠标左键，选中多个批量加类型，格式化文档。
*/