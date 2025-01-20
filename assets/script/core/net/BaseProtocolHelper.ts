import protobufjs, { Type } from 'protobufjs';
import { MsgId } from "./MsgIdRegister";
import { IProtocolHelper } from "./ProtocolHelper";
import { Uint8ArrayUtils } from "./Uint8ArrayUtils";


export class BaseProtocolHelper implements IProtocolHelper {
    /**获取协议头长度 */
    getHeadlen(reader: protobufjs.BufferReader, pos = 0): number {
        pos != undefined && (reader.pos = pos)
        let length = reader.fixed32();
        return length
    }
    getHearbeat(): any {
        let message = PB_CSHeartbeatReq.create();
        message.reserve = 0;
        return message;
    }
    checkPackage(reader: protobufjs.Reader): boolean {
        let length = this.getHeadlen(reader);
        if (length === reader.buf.length - 4) return true;
        return false;
    }

    getPackageId(reader: protobufjs.Reader, pos = 4): number {
        pos != undefined && (reader.pos = pos)
        let msgId = reader.fixed32();
        return msgId;
    }
    getPackReader(msg: ArrayBuffer): protobufjs.Reader {
        let read = protobufjs.Reader.create(new Uint8Array(msg));
        return read
    }
    getPackageData(reader: protobufjs.Reader, msgProto: Type, end: number = undefined, pos = 8): protobufjs.Message<{}> {
        pos != undefined && (reader.pos = pos)
        const protoData = msgProto.decode(reader, end);
        return protoData;
    }
    handlePackageData(data: Type, seeionId: number = undefined): Uint8Array {
        const msgId = MsgId.GetMsgId(data.constructor);
        if (msgId === 0 || msgId === undefined) {
            console.error(`未注册协议: ${data.constructor.name}`);
            return;
        }
        const netData = data.constructor.encode(data).finish();
        const length = 8 + netData.length;
        const uinya = new Uint8Array(length);
        let pos = 0;

        /**会话ID 2 */
        // if (seeionId != undefined) {
        //     let seeiondarray = Uint8ArrayUtils.convertToByteArray(seeionId, 2);
        //     for (let index = 0; index < seeiondarray.length; index++) {
        //         uinya[index] = seeiondarray[index];
        //     }
        //     pos += seeiondarray.length;
        // }

        /**协议长度 4 */
        let lengthArray = Uint8ArrayUtils.convertToByteArray(length - pos - 4);
        for (let index = 0; index < lengthArray.length; index++) {
            uinya[index + pos] = lengthArray[index];
        }
        pos += lengthArray.length;

        /**协议ID 4 */
        let msgArray = Uint8ArrayUtils.convertToByteArray(msgId);
        for (let index = 0; index < msgArray.length; index++) {
            uinya[index + pos] = msgArray[index];
        }
        pos += msgArray.length;

        /**协议内容 */
        for (let index = 0; index < netData.length; index++) {
            uinya[index + pos] = netData[index];
        }
        return uinya
    }
}
