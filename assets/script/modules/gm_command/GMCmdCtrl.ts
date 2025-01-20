import { bit } from "core/net/bit";
import { NetManager } from "manager/NetManager";
import { BaseCtrl, regMsg } from "modules/common/BaseCtrl";
import { FishCtrl } from "modules/fish/FishCtrl";


export class GMCmdCtrl extends BaseCtrl {
    now_time: number = 0;
    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCGMCommand, func: this.OnGmCommandReturn },
        ]
    }
    //发送GM命令
    public SendGMCommand(cmd_type: string, cmd_params?: string, value?: string) {
        // if ("addattrall" == cmd_type){
        //     for(let i = BATTLE_ATTR.BATTLE_ATTR_MIN + 1; i < BATTLE_ATTR.BATTLE_ATTR_MAX; i++){
        //         let protocol = PB_CSGMCommand.create();
        //         protocol.type = bit.StringToUint8Array("addattr");
        //         protocol.command = bit.StringToUint8Array(cmd_params);
        //         this.SendToServer(protocol);
        //     }
        // }
        // if (this.checkProto(value)) {
        //     return
        // }
        let protocol = PB_CSGMCommand.create();
        protocol.type = bit.StringToUint8Array(cmd_type);
        protocol.command = bit.StringToUint8Array(cmd_params);
        this.SendToServer(protocol);
        console.log(`Send GM Cmd Type=${cmd_type},params=${cmd_params}`);
    }

    public checkProto(value: string) {
        if (value && value.indexOf(": ") != -1) {
            let ars = value.replace(new RegExp(/(:)/g), "")
            let ar = ars.split(" ")
            let ar_bf = new Uint8Array(ar.length / 2);
            let len = 0;
            ar.forEach((v, index, array) => {
                if (index % 2 != 0) {
                    ar_bf[len] = +v;
                    len += 1;
                }
            });
            NetManager.Inst().test(ar_bf);
            return true;
        }
    }

    //GM命令返回
    private OnGmCommandReturn(protocol: PB_SCGMCommand) {
        let type = bit.Uint8ArrayToString(protocol.type);
        let result = bit.Uint8ArrayToString(protocol.result);
        console.log(`Recv GM Cmd Resut=${result},Type=${type}`);
    }
    //添加道具物品
    public OnAddItem(item_id: number, num: number) {
        this.SendGMCommand("additem", `${item_id} ${num} 0`);
    }
    //测试代码
    is_test = false
    public TestFunction(param: string) {
        // ViewManager.Inst().OpenView(RoleLevelUpView, { level: 1 })
        FishCtrl.Inst().SendRoleFishReqFish()
    }
}