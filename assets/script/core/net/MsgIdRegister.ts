import { Type } from "protobufjs";
import { TYPE_PROTO_CARE } from "./ProtocolHelper";

export class MsgId {
    static RegisterMsg(msgid: number, protoClass: any) {
        // protoClass.msgId = msgid;
        MsgId.msgMap.set(msgid, protoClass);
        protoClass.MsgId = msgid;
    }

    static GetMsgClass(msgid: number) {
        return MsgId.msgMap.get(msgid)
    }

    static GetMsgCare(protoClass: any): TYPE_PROTO_CARE {
        return protoClass.CARE
    }

    static GetMsgId(protoClass: any): number {
        return protoClass.MsgId
    }

    static msgMap: Map<number, any> = new Map<number, any>()
}

