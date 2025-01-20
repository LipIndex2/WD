
import { DataBase } from "data/DataBase";
import { Language } from "modules/common/Language";
import { RoleData } from "modules/role/RoleData";

export enum DialogTipsToggleKey{
    BattleJumpStep = "BattleJumpStep",
    DrawCard = "DrawCard",
}

export enum DialogTipsToggleType{
    DayTime = 1,        //今日不提醒
}

export class DialogTipsToggle{
    key:DialogTipsToggleKey | string;
    type:DialogTipsToggleType;
    toggleText:string;
    constructor(key:DialogTipsToggleKey, type:DialogTipsToggleType, toggleText:string){
        this.key = key + RoleData.Inst().InfoRoleId.toString();
        this.type = type;
        this.toggleText = toggleText;
    }

    static CreateDay(key:DialogTipsToggleKey): DialogTipsToggle{
        return new DialogTipsToggle(key, DialogTipsToggleType.DayTime, Language.Common.DialogDayTip);
    }
}

export class PublicPopupData extends DataBase {
    constructor() {
        super();
        this.createSmartData();
    }


    private createSmartData() {
    }
}