import { KeyFunction } from "modules/common/CommonType";
import { RoleData } from "modules/role/RoleData";

export class LocalStorageHelper {
    static PrefsInt(key: string, value?: number) {
        if (value)
            localStorage.setItem(key, value + "");
        else
            return +localStorage.getItem(key);
    }

    static PrefsString(key: string, value?: string) {
        if (value)
            localStorage.setItem(key, value);
        else
            return localStorage.getItem(key);
    }

    static ActivityIsRemind(act_type: number) {
        return RoleData.Inst().InfoRoleId + "_ActivityInfo_IsRemind_" + act_type;
    }

    static IsRemindShow(type: string) {
        return RoleData.Inst().InfoRoleId + "_IsRemindShow_" + type;
    }

    static EscortGhostIsRemind() {
        return RoleData.Inst().InfoRoleId + "_EscortGhost_IsRemind_";
    }

    static AutoBoxOpenTip() {
        return RoleData.Inst().InfoRoleId + "_AutoBoxOpen_IsRemind_";
    }

    /**竞技场刷新时间 */
    static ArenaCd() {
        return RoleData.Inst().InfoRoleId + "_ArenaCd_IsRemind_";
    }

    /**自动弹出公告时间 */
    static AnnounceCd() {
        return RoleData.Inst().InfoRoleId + "_Cd_Announce_";
    }

    static TaskTopShow() {
        return RoleData.Inst().InfoRoleId + "_TaskTopShowData_"
    }

    static ReportOnce() {
        return RoleData.Inst().InfoRoleId + "_ReportOnce_"
    }
}