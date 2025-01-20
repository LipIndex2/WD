import { sys } from "cc";
import { RoleData } from "modules/role/RoleData";

export class Prefskey {
    static GetValue(key: string): string {
        let v = sys.localStorage.getItem(key);
        if (v == "" || v == null) {
            return null
        }
        return v
    }
    static SetValue(key: string, v: any) {
        sys.localStorage.setItem(key, v.toString());
    }

    static GetBattleSaveSkillKey() {
        return RoleData.Inst().InfoRoleId + "GetBattleSaveSkillKey1";
    }

    static GetBattkeGuideKey() {
        return RoleData.Inst().InfoRoleId + "GetBattkeGuideKey_4_";
    }

    //游戏存档版本
    static GetBattkeSaveVersionKey() {
        return "GetBattkeSaveVersionKey_14";
    }

    //游戏存档
    static GetBattkeSaveKey() {
        return RoleData.Inst().InfoRoleId + "GetBattkeSaveKey_2_";
    }

    //加速比例
    static GetBattleSpeedScaleKey() {
        return RoleData.Inst().InfoRoleId + "GetBattleSpeedScaleKey_1_";
    }

    //语言类型
    static GetLanguageKey() {
        return "GetLanguageKey";
    }

    //竞技场首次红点
    static GetArenaRemindKey() {
        return RoleData.Inst().InfoRoleId + "ArenaRemindKey_1";
    }

    //战斗免费3倍数
    static GetBattleFreeSpeedKey() {
        return RoleData.Inst().InfoRoleId + "BattleFreeSpeedKey_3";
    }

    //4格动画key
    static Get4MangaKey() {
        return RoleData.Inst().InfoRoleId + "4Manga";
    }
}