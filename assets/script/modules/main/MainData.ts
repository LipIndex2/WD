import { RemindRegister } from "data/HandleCollectorCfg";
import { CreateSMD, smartdata } from "data/SmartData";
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { Mod } from "modules/common/ModuleDefine";
import { RemindCtrl } from "modules/remind/RemindCtrl";
import { DataBase } from "../../data/DataBase";

export class MainFlushData {
    @smartdata
    MainMenuShopFlush: boolean = false;
    @smartdata
    MainStart: boolean = true
    @smartdata
    flushRed: boolean;
    @smartdata
    flushSkipIndex: number = 2;
    @smartdata
    FightIndex: number = 0
}

export class MainData extends DataBase {
    public FlushData: MainFlushData;
    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(MainFlushData);
    }

    public set FightIndex(value: number) {
        this.FlushData.FightIndex = value
    }

    public get FightIndex() {
        return this.FlushData.FightIndex
    }

    public FlushMainMenu() {
        this.FlushData.MainMenuShopFlush = !this.FlushData.MainMenuShopFlush
    }

    public FlushMainStart() {
        this.FlushData.MainStart = !this.FlushData.MainStart
    }

    public FlushRedPoint() {
        this.FlushData.flushRed = !this.FlushData.flushRed
    }

    public FlushSkip(index: number) {
        this.FlushData.flushSkipIndex = index
    }

    public GetFlushSkipIndex(){
        return this.FlushData.flushSkipIndex;
    }

    public GetAllRed() {//MainOther
        let red1 = RemindCtrl.Inst().GetRemindNum(Mod.MainOther.Mail);
        // let red2 = RemindCtrl.Inst().GetRemindNum(Mod.MainOther.InviteFriend);
        // let red = red1 + red2;
        return red1
    }

}

export class MainCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
        ]
    }

    protected initCtrl() {
        RemindCtrl.Inst().RegisterGroup(Mod.MainOther, () => { MainData.Inst().FlushRedPoint() }, true)

        this.handleCollector.Add(RemindRegister.Create(Mod.MainOther.View, MainData.Inst().FlushData, MainData.Inst().GetAllRed.bind(MainData.Inst()), "flushRed"));
    }


}

