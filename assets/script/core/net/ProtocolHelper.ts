import { AnyNestedObject, Type } from "protobufjs";

export type TYPE_PROTO_CARE = { care: AnyNestedObject, func: Function };
// 协议辅助接口
export interface IProtocolHelper {
    getPackReader(msg: ArrayBuffer, pos?: number): protobuf.Reader;                                     //获取reader
    getHeadlen(msg: protobuf.Reader, pos?: number): number;                                             // 返回包头长度
    getHearbeat(): Type;                                                              // 返回一个心跳包
    checkPackage(msg: protobuf.Reader): boolean;                                          // 检查包数据是否合法
    getPackageId(msg: protobuf.Reader, pos?: number): number;                                           // 返回包的id或协议类型
    getPackageData(reader: protobuf.Reader, msgProto: Type, end?: number, pos?: number): protobuf.Message<{}>       // 解析数据获得protobuf数据 
    handlePackageData(data: Type, seeionId?: number): Uint8Array                                               // 处理数据获得protobuf数据 
}
