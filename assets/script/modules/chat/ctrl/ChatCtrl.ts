import { NetChatMsgOptions } from "core/net/NetNode";
import { BaseCtrl } from "modules/common/BaseCtrl";
import { CommonEvent } from "modules/common/CommonEvent";
import { EventCtrl } from "modules/common/EventCtrl";

export type MsgData = {
    name: string,
    head: number,
    headFrame: number,
    msg: string,
    time:number,
    isMe: boolean
}

export class ChatCtrl extends BaseCtrl {
    listData: MsgData[] = [];

    protected initCtrl(): void {
        EventCtrl.Inst().on(CommonEvent.CHAT_MSG, (data: NetChatMsgOptions)=>{
            if(this.listData.length >= 50){
                this.listData.pop();
            }
            this.listData.push({ name: data.name, head: data.head, headFrame: data.headFrame, msg: data.msg, time: Date.now(), isMe: data.isMe });
        }, this);
    }
}