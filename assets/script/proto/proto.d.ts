
import { Long } from 'protobufjs/minimal.js';
import * as $protobuf from 'protobufjs/minimal.js';
declare global {
 // DO NOT EDIT! This is a generated file. Edit the JSDoc in src/*.js instead and run 'npm run types'.

/** Properties of a PB_CSArenaReq. */
export interface IPB_CSArenaReq {

    /** PB_CSArenaReq type */
    type?: (number|null);

    /** PB_CSArenaReq param1 */
    param1?: (number[]|null);

    /** PB_CSArenaReq param2 */
    param2?: (number[]|null);
}

/** Represents a PB_CSArenaReq. */
export class PB_CSArenaReq implements IPB_CSArenaReq {

    /**
     * Constructs a new PB_CSArenaReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSArenaReq);

    /** PB_CSArenaReq type. */
    public type: number;

    /** PB_CSArenaReq param1. */
    public param1: number[];

    /** PB_CSArenaReq param2. */
    public param2: number[];

    /**
     * Creates a new PB_CSArenaReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSArenaReq instance
     */
    public static create(properties?: IPB_CSArenaReq): PB_CSArenaReq;

    /**
     * Encodes the specified PB_CSArenaReq message. Does not implicitly {@link PB_CSArenaReq.verify|verify} messages.
     * @param message PB_CSArenaReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSArenaReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSArenaReq message, length delimited. Does not implicitly {@link PB_CSArenaReq.verify|verify} messages.
     * @param message PB_CSArenaReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSArenaReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSArenaReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSArenaReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSArenaReq;

    /**
     * Decodes a PB_CSArenaReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSArenaReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSArenaReq;

    /**
     * Verifies a PB_CSArenaReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSArenaReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSArenaReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSArenaReq;

    /**
     * Creates a plain object from a PB_CSArenaReq message. Also converts values to other types if specified.
     * @param message PB_CSArenaReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSArenaReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSArenaReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCArenaInfo. */
export interface IPB_SCArenaInfo {

    /** PB_SCArenaInfo heroId */
    heroId?: (number[]|null);

    /** PB_SCArenaInfo heroLevel */
    heroLevel?: (number[]|null);

    /** PB_SCArenaInfo buffList */
    buffList?: (number[]|null);

    /** PB_SCArenaInfo rank */
    rank?: (number|null);

    /** PB_SCArenaInfo rankOrder */
    rankOrder?: (number|null);

    /** PB_SCArenaInfo score */
    score?: (number|null);

    /** PB_SCArenaInfo skinSeq */
    skinSeq?: (number|null);

    /** PB_SCArenaInfo fightItemNum */
    fightItemNum?: (number|null);

    /** PB_SCArenaInfo heroDamage */
    heroDamage?: (number|null);

    /** PB_SCArenaInfo rankRewardFetch */
    rankRewardFetch?: (boolean[]|null);
}

/** Represents a PB_SCArenaInfo. */
export class PB_SCArenaInfo implements IPB_SCArenaInfo {

    /**
     * Constructs a new PB_SCArenaInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCArenaInfo);

    /** PB_SCArenaInfo heroId. */
    public heroId: number[];

    /** PB_SCArenaInfo heroLevel. */
    public heroLevel: number[];

    /** PB_SCArenaInfo buffList. */
    public buffList: number[];

    /** PB_SCArenaInfo rank. */
    public rank: number;

    /** PB_SCArenaInfo rankOrder. */
    public rankOrder: number;

    /** PB_SCArenaInfo score. */
    public score: number;

    /** PB_SCArenaInfo skinSeq. */
    public skinSeq: number;

    /** PB_SCArenaInfo fightItemNum. */
    public fightItemNum: number;

    /** PB_SCArenaInfo heroDamage. */
    public heroDamage: number;

    /** PB_SCArenaInfo rankRewardFetch. */
    public rankRewardFetch: boolean[];

    /**
     * Creates a new PB_SCArenaInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCArenaInfo instance
     */
    public static create(properties?: IPB_SCArenaInfo): PB_SCArenaInfo;

    /**
     * Encodes the specified PB_SCArenaInfo message. Does not implicitly {@link PB_SCArenaInfo.verify|verify} messages.
     * @param message PB_SCArenaInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCArenaInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCArenaInfo message, length delimited. Does not implicitly {@link PB_SCArenaInfo.verify|verify} messages.
     * @param message PB_SCArenaInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCArenaInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCArenaInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCArenaInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCArenaInfo;

    /**
     * Decodes a PB_SCArenaInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCArenaInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCArenaInfo;

    /**
     * Verifies a PB_SCArenaInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCArenaInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCArenaInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCArenaInfo;

    /**
     * Creates a plain object from a PB_SCArenaInfo message. Also converts values to other types if specified.
     * @param message PB_SCArenaInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCArenaInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCArenaInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCArenaHeroInfo. */
export interface IPB_SCArenaHeroInfo {

    /** PB_SCArenaHeroInfo heroId */
    heroId?: (number|null);

    /** PB_SCArenaHeroInfo heroLevel */
    heroLevel?: (number|null);

    /** PB_SCArenaHeroInfo geneId */
    geneId?: (number[]|null);
}

/** Represents a PB_SCArenaHeroInfo. */
export class PB_SCArenaHeroInfo implements IPB_SCArenaHeroInfo {

    /**
     * Constructs a new PB_SCArenaHeroInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCArenaHeroInfo);

    /** PB_SCArenaHeroInfo heroId. */
    public heroId: number;

    /** PB_SCArenaHeroInfo heroLevel. */
    public heroLevel: number;

    /** PB_SCArenaHeroInfo geneId. */
    public geneId: number[];

    /**
     * Creates a new PB_SCArenaHeroInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCArenaHeroInfo instance
     */
    public static create(properties?: IPB_SCArenaHeroInfo): PB_SCArenaHeroInfo;

    /**
     * Encodes the specified PB_SCArenaHeroInfo message. Does not implicitly {@link PB_SCArenaHeroInfo.verify|verify} messages.
     * @param message PB_SCArenaHeroInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCArenaHeroInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCArenaHeroInfo message, length delimited. Does not implicitly {@link PB_SCArenaHeroInfo.verify|verify} messages.
     * @param message PB_SCArenaHeroInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCArenaHeroInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCArenaHeroInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCArenaHeroInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCArenaHeroInfo;

    /**
     * Decodes a PB_SCArenaHeroInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCArenaHeroInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCArenaHeroInfo;

    /**
     * Verifies a PB_SCArenaHeroInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCArenaHeroInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCArenaHeroInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCArenaHeroInfo;

    /**
     * Creates a plain object from a PB_SCArenaHeroInfo message. Also converts values to other types if specified.
     * @param message PB_SCArenaHeroInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCArenaHeroInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCArenaHeroInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCArenaTalentLevelInfo. */
export interface IPB_SCArenaTalentLevelInfo {

    /** PB_SCArenaTalentLevelInfo talentId */
    talentId?: (number|null);

    /** PB_SCArenaTalentLevelInfo talentLevel */
    talentLevel?: (number|null);
}

/** Represents a PB_SCArenaTalentLevelInfo. */
export class PB_SCArenaTalentLevelInfo implements IPB_SCArenaTalentLevelInfo {

    /**
     * Constructs a new PB_SCArenaTalentLevelInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCArenaTalentLevelInfo);

    /** PB_SCArenaTalentLevelInfo talentId. */
    public talentId: number;

    /** PB_SCArenaTalentLevelInfo talentLevel. */
    public talentLevel: number;

    /**
     * Creates a new PB_SCArenaTalentLevelInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCArenaTalentLevelInfo instance
     */
    public static create(properties?: IPB_SCArenaTalentLevelInfo): PB_SCArenaTalentLevelInfo;

    /**
     * Encodes the specified PB_SCArenaTalentLevelInfo message. Does not implicitly {@link PB_SCArenaTalentLevelInfo.verify|verify} messages.
     * @param message PB_SCArenaTalentLevelInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCArenaTalentLevelInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCArenaTalentLevelInfo message, length delimited. Does not implicitly {@link PB_SCArenaTalentLevelInfo.verify|verify} messages.
     * @param message PB_SCArenaTalentLevelInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCArenaTalentLevelInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCArenaTalentLevelInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCArenaTalentLevelInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCArenaTalentLevelInfo;

    /**
     * Decodes a PB_SCArenaTalentLevelInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCArenaTalentLevelInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCArenaTalentLevelInfo;

    /**
     * Verifies a PB_SCArenaTalentLevelInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCArenaTalentLevelInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCArenaTalentLevelInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCArenaTalentLevelInfo;

    /**
     * Creates a plain object from a PB_SCArenaTalentLevelInfo message. Also converts values to other types if specified.
     * @param message PB_SCArenaTalentLevelInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCArenaTalentLevelInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCArenaTalentLevelInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCArenaTargetInfo. */
export interface IPB_SCArenaTargetInfo {

    /** PB_SCArenaTargetInfo heroDamage */
    heroDamage?: (number|null);

    /** PB_SCArenaTargetInfo skinSeq */
    skinSeq?: (number|null);

    /** PB_SCArenaTargetInfo buffList */
    buffList?: (number[]|null);

    /** PB_SCArenaTargetInfo rank */
    rank?: (number|null);

    /** PB_SCArenaTargetInfo rankOrder */
    rankOrder?: (number|null);

    /** PB_SCArenaTargetInfo roleInfo */
    roleInfo?: (IPB_RoleInfo|null);

    /** PB_SCArenaTargetInfo heroList */
    heroList?: (IPB_SCArenaHeroInfo[]|null);

    /** PB_SCArenaTargetInfo talentList */
    talentList?: (IPB_SCArenaTalentLevelInfo[]|null);
}

/** Represents a PB_SCArenaTargetInfo. */
export class PB_SCArenaTargetInfo implements IPB_SCArenaTargetInfo {

    /**
     * Constructs a new PB_SCArenaTargetInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCArenaTargetInfo);

    /** PB_SCArenaTargetInfo heroDamage. */
    public heroDamage: number;

    /** PB_SCArenaTargetInfo skinSeq. */
    public skinSeq: number;

    /** PB_SCArenaTargetInfo buffList. */
    public buffList: number[];

    /** PB_SCArenaTargetInfo rank. */
    public rank: number;

    /** PB_SCArenaTargetInfo rankOrder. */
    public rankOrder: number;

    /** PB_SCArenaTargetInfo roleInfo. */
    public roleInfo?: (IPB_RoleInfo|null);

    /** PB_SCArenaTargetInfo heroList. */
    public heroList: IPB_SCArenaHeroInfo[];

    /** PB_SCArenaTargetInfo talentList. */
    public talentList: IPB_SCArenaTalentLevelInfo[];

    /**
     * Creates a new PB_SCArenaTargetInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCArenaTargetInfo instance
     */
    public static create(properties?: IPB_SCArenaTargetInfo): PB_SCArenaTargetInfo;

    /**
     * Encodes the specified PB_SCArenaTargetInfo message. Does not implicitly {@link PB_SCArenaTargetInfo.verify|verify} messages.
     * @param message PB_SCArenaTargetInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCArenaTargetInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCArenaTargetInfo message, length delimited. Does not implicitly {@link PB_SCArenaTargetInfo.verify|verify} messages.
     * @param message PB_SCArenaTargetInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCArenaTargetInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCArenaTargetInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCArenaTargetInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCArenaTargetInfo;

    /**
     * Decodes a PB_SCArenaTargetInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCArenaTargetInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCArenaTargetInfo;

    /**
     * Verifies a PB_SCArenaTargetInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCArenaTargetInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCArenaTargetInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCArenaTargetInfo;

    /**
     * Creates a plain object from a PB_SCArenaTargetInfo message. Also converts values to other types if specified.
     * @param message PB_SCArenaTargetInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCArenaTargetInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCArenaTargetInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCArenaShopInfo. */
export interface IPB_SCArenaShopInfo {

    /** PB_SCArenaShopInfo buyCount */
    buyCount?: (number[]|null);
}

/** Represents a PB_SCArenaShopInfo. */
export class PB_SCArenaShopInfo implements IPB_SCArenaShopInfo {

    /**
     * Constructs a new PB_SCArenaShopInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCArenaShopInfo);

    /** PB_SCArenaShopInfo buyCount. */
    public buyCount: number[];

    /**
     * Creates a new PB_SCArenaShopInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCArenaShopInfo instance
     */
    public static create(properties?: IPB_SCArenaShopInfo): PB_SCArenaShopInfo;

    /**
     * Encodes the specified PB_SCArenaShopInfo message. Does not implicitly {@link PB_SCArenaShopInfo.verify|verify} messages.
     * @param message PB_SCArenaShopInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCArenaShopInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCArenaShopInfo message, length delimited. Does not implicitly {@link PB_SCArenaShopInfo.verify|verify} messages.
     * @param message PB_SCArenaShopInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCArenaShopInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCArenaShopInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCArenaShopInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCArenaShopInfo;

    /**
     * Decodes a PB_SCArenaShopInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCArenaShopInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCArenaShopInfo;

    /**
     * Verifies a PB_SCArenaShopInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCArenaShopInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCArenaShopInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCArenaShopInfo;

    /**
     * Creates a plain object from a PB_SCArenaShopInfo message. Also converts values to other types if specified.
     * @param message PB_SCArenaShopInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCArenaShopInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCArenaShopInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCArenaReportNode. */
export interface IPB_SCArenaReportNode {

    /** PB_SCArenaReportNode roleInfo */
    roleInfo?: (IPB_RoleInfo|null);

    /** PB_SCArenaReportNode isAttack */
    isAttack?: (boolean|null);

    /** PB_SCArenaReportNode isWin */
    isWin?: (boolean|null);

    /** PB_SCArenaReportNode time */
    time?: (number|Long|null);

    /** PB_SCArenaReportNode rank */
    rank?: (number|null);

    /** PB_SCArenaReportNode rankOrder */
    rankOrder?: (number|null);
}

/** Represents a PB_SCArenaReportNode. */
export class PB_SCArenaReportNode implements IPB_SCArenaReportNode {

    /**
     * Constructs a new PB_SCArenaReportNode.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCArenaReportNode);

    /** PB_SCArenaReportNode roleInfo. */
    public roleInfo?: (IPB_RoleInfo|null);

    /** PB_SCArenaReportNode isAttack. */
    public isAttack: boolean;

    /** PB_SCArenaReportNode isWin. */
    public isWin: boolean;

    /** PB_SCArenaReportNode time. */
    public time: (number|Long);

    /** PB_SCArenaReportNode rank. */
    public rank: number;

    /** PB_SCArenaReportNode rankOrder. */
    public rankOrder: number;

    /**
     * Creates a new PB_SCArenaReportNode instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCArenaReportNode instance
     */
    public static create(properties?: IPB_SCArenaReportNode): PB_SCArenaReportNode;

    /**
     * Encodes the specified PB_SCArenaReportNode message. Does not implicitly {@link PB_SCArenaReportNode.verify|verify} messages.
     * @param message PB_SCArenaReportNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCArenaReportNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCArenaReportNode message, length delimited. Does not implicitly {@link PB_SCArenaReportNode.verify|verify} messages.
     * @param message PB_SCArenaReportNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCArenaReportNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCArenaReportNode message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCArenaReportNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCArenaReportNode;

    /**
     * Decodes a PB_SCArenaReportNode message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCArenaReportNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCArenaReportNode;

    /**
     * Verifies a PB_SCArenaReportNode message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCArenaReportNode message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCArenaReportNode
     */
    public static fromObject(object: { [k: string]: any }): PB_SCArenaReportNode;

    /**
     * Creates a plain object from a PB_SCArenaReportNode message. Also converts values to other types if specified.
     * @param message PB_SCArenaReportNode
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCArenaReportNode, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCArenaReportNode to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCArenaReportInfo. */
export interface IPB_SCArenaReportInfo {

    /** PB_SCArenaReportInfo reportInfo */
    reportInfo?: (IPB_SCArenaReportNode[]|null);
}

/** Represents a PB_SCArenaReportInfo. */
export class PB_SCArenaReportInfo implements IPB_SCArenaReportInfo {

    /**
     * Constructs a new PB_SCArenaReportInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCArenaReportInfo);

    /** PB_SCArenaReportInfo reportInfo. */
    public reportInfo: IPB_SCArenaReportNode[];

    /**
     * Creates a new PB_SCArenaReportInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCArenaReportInfo instance
     */
    public static create(properties?: IPB_SCArenaReportInfo): PB_SCArenaReportInfo;

    /**
     * Encodes the specified PB_SCArenaReportInfo message. Does not implicitly {@link PB_SCArenaReportInfo.verify|verify} messages.
     * @param message PB_SCArenaReportInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCArenaReportInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCArenaReportInfo message, length delimited. Does not implicitly {@link PB_SCArenaReportInfo.verify|verify} messages.
     * @param message PB_SCArenaReportInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCArenaReportInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCArenaReportInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCArenaReportInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCArenaReportInfo;

    /**
     * Decodes a PB_SCArenaReportInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCArenaReportInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCArenaReportInfo;

    /**
     * Verifies a PB_SCArenaReportInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCArenaReportInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCArenaReportInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCArenaReportInfo;

    /**
     * Creates a plain object from a PB_SCArenaReportInfo message. Also converts values to other types if specified.
     * @param message PB_SCArenaReportInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCArenaReportInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCArenaReportInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCArenaMapData. */
export interface IPB_SCArenaMapData {

    /** PB_SCArenaMapData seq */
    seq?: (number|null);

    /** PB_SCArenaMapData endTime */
    endTime?: (number|Long|null);
}

/** Represents a PB_SCArenaMapData. */
export class PB_SCArenaMapData implements IPB_SCArenaMapData {

    /**
     * Constructs a new PB_SCArenaMapData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCArenaMapData);

    /** PB_SCArenaMapData seq. */
    public seq: number;

    /** PB_SCArenaMapData endTime. */
    public endTime: (number|Long);

    /**
     * Creates a new PB_SCArenaMapData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCArenaMapData instance
     */
    public static create(properties?: IPB_SCArenaMapData): PB_SCArenaMapData;

    /**
     * Encodes the specified PB_SCArenaMapData message. Does not implicitly {@link PB_SCArenaMapData.verify|verify} messages.
     * @param message PB_SCArenaMapData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCArenaMapData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCArenaMapData message, length delimited. Does not implicitly {@link PB_SCArenaMapData.verify|verify} messages.
     * @param message PB_SCArenaMapData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCArenaMapData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCArenaMapData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCArenaMapData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCArenaMapData;

    /**
     * Decodes a PB_SCArenaMapData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCArenaMapData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCArenaMapData;

    /**
     * Verifies a PB_SCArenaMapData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCArenaMapData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCArenaMapData
     */
    public static fromObject(object: { [k: string]: any }): PB_SCArenaMapData;

    /**
     * Creates a plain object from a PB_SCArenaMapData message. Also converts values to other types if specified.
     * @param message PB_SCArenaMapData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCArenaMapData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCArenaMapData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCArenaMapInfo. */
export interface IPB_SCArenaMapInfo {

    /** PB_SCArenaMapInfo mapList */
    mapList?: (IPB_SCArenaMapData[]|null);
}

/** Represents a PB_SCArenaMapInfo. */
export class PB_SCArenaMapInfo implements IPB_SCArenaMapInfo {

    /**
     * Constructs a new PB_SCArenaMapInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCArenaMapInfo);

    /** PB_SCArenaMapInfo mapList. */
    public mapList: IPB_SCArenaMapData[];

    /**
     * Creates a new PB_SCArenaMapInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCArenaMapInfo instance
     */
    public static create(properties?: IPB_SCArenaMapInfo): PB_SCArenaMapInfo;

    /**
     * Encodes the specified PB_SCArenaMapInfo message. Does not implicitly {@link PB_SCArenaMapInfo.verify|verify} messages.
     * @param message PB_SCArenaMapInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCArenaMapInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCArenaMapInfo message, length delimited. Does not implicitly {@link PB_SCArenaMapInfo.verify|verify} messages.
     * @param message PB_SCArenaMapInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCArenaMapInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCArenaMapInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCArenaMapInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCArenaMapInfo;

    /**
     * Decodes a PB_SCArenaMapInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCArenaMapInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCArenaMapInfo;

    /**
     * Verifies a PB_SCArenaMapInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCArenaMapInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCArenaMapInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCArenaMapInfo;

    /**
     * Creates a plain object from a PB_SCArenaMapInfo message. Also converts values to other types if specified.
     * @param message PB_SCArenaMapInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCArenaMapInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCArenaMapInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCArenaBuyInfo. */
export interface IPB_SCArenaBuyInfo {

    /** PB_SCArenaBuyInfo buyItemCount */
    buyItemCount?: (number|null);
}

/** Represents a PB_SCArenaBuyInfo. */
export class PB_SCArenaBuyInfo implements IPB_SCArenaBuyInfo {

    /**
     * Constructs a new PB_SCArenaBuyInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCArenaBuyInfo);

    /** PB_SCArenaBuyInfo buyItemCount. */
    public buyItemCount: number;

    /**
     * Creates a new PB_SCArenaBuyInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCArenaBuyInfo instance
     */
    public static create(properties?: IPB_SCArenaBuyInfo): PB_SCArenaBuyInfo;

    /**
     * Encodes the specified PB_SCArenaBuyInfo message. Does not implicitly {@link PB_SCArenaBuyInfo.verify|verify} messages.
     * @param message PB_SCArenaBuyInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCArenaBuyInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCArenaBuyInfo message, length delimited. Does not implicitly {@link PB_SCArenaBuyInfo.verify|verify} messages.
     * @param message PB_SCArenaBuyInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCArenaBuyInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCArenaBuyInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCArenaBuyInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCArenaBuyInfo;

    /**
     * Decodes a PB_SCArenaBuyInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCArenaBuyInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCArenaBuyInfo;

    /**
     * Verifies a PB_SCArenaBuyInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCArenaBuyInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCArenaBuyInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCArenaBuyInfo;

    /**
     * Creates a plain object from a PB_SCArenaBuyInfo message. Also converts values to other types if specified.
     * @param message PB_SCArenaBuyInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCArenaBuyInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCArenaBuyInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_Appearance. */
export interface IPB_Appearance {

    /** PB_Appearance surfaceWeapon */
    surfaceWeapon?: (number|null);

    /** PB_Appearance surfaceShield */
    surfaceShield?: (number|null);

    /** PB_Appearance surfaceBody */
    surfaceBody?: (number|null);

    /** PB_Appearance surfaceMount */
    surfaceMount?: (number|null);

    /** PB_Appearance surfaceHead */
    surfaceHead?: (number|null);

    /** PB_Appearance surfaceAngel */
    surfaceAngel?: (number|null);
}

/** Represents a PB_Appearance. */
export class PB_Appearance implements IPB_Appearance {

    /**
     * Constructs a new PB_Appearance.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_Appearance);

    /** PB_Appearance surfaceWeapon. */
    public surfaceWeapon: number;

    /** PB_Appearance surfaceShield. */
    public surfaceShield: number;

    /** PB_Appearance surfaceBody. */
    public surfaceBody: number;

    /** PB_Appearance surfaceMount. */
    public surfaceMount: number;

    /** PB_Appearance surfaceHead. */
    public surfaceHead: number;

    /** PB_Appearance surfaceAngel. */
    public surfaceAngel: number;

    /**
     * Creates a new PB_Appearance instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_Appearance instance
     */
    public static create(properties?: IPB_Appearance): PB_Appearance;

    /**
     * Encodes the specified PB_Appearance message. Does not implicitly {@link PB_Appearance.verify|verify} messages.
     * @param message PB_Appearance message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_Appearance, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_Appearance message, length delimited. Does not implicitly {@link PB_Appearance.verify|verify} messages.
     * @param message PB_Appearance message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_Appearance, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_Appearance message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_Appearance
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_Appearance;

    /**
     * Decodes a PB_Appearance message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_Appearance
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_Appearance;

    /**
     * Verifies a PB_Appearance message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_Appearance message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_Appearance
     */
    public static fromObject(object: { [k: string]: any }): PB_Appearance;

    /**
     * Creates a plain object from a PB_Appearance message. Also converts values to other types if specified.
     * @param message PB_Appearance
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_Appearance, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_Appearance to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_RoleInfo. */
export interface IPB_RoleInfo {

    /** PB_RoleInfo roleId */
    roleId?: (number|null);

    /** PB_RoleInfo name */
    name?: (Uint8Array|null);

    /** PB_RoleInfo level */
    level?: (number|null);

    /** PB_RoleInfo headPicId */
    headPicId?: (number|null);

    /** PB_RoleInfo headChar */
    headChar?: (Uint8Array|null);

    /** PB_RoleInfo headFrame */
    headFrame?: (number|null);

    /** PB_RoleInfo heroId */
    heroId?: (number[]|null);

    /** PB_RoleInfo heroLevel */
    heroLevel?: (number[]|null);
}

/** Represents a PB_RoleInfo. */
export class PB_RoleInfo implements IPB_RoleInfo {

    /**
     * Constructs a new PB_RoleInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_RoleInfo);

    /** PB_RoleInfo roleId. */
    public roleId: number;

    /** PB_RoleInfo name. */
    public name: Uint8Array;

    /** PB_RoleInfo level. */
    public level: number;

    /** PB_RoleInfo headPicId. */
    public headPicId: number;

    /** PB_RoleInfo headChar. */
    public headChar: Uint8Array;

    /** PB_RoleInfo headFrame. */
    public headFrame: number;

    /** PB_RoleInfo heroId. */
    public heroId: number[];

    /** PB_RoleInfo heroLevel. */
    public heroLevel: number[];

    /**
     * Creates a new PB_RoleInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_RoleInfo instance
     */
    public static create(properties?: IPB_RoleInfo): PB_RoleInfo;

    /**
     * Encodes the specified PB_RoleInfo message. Does not implicitly {@link PB_RoleInfo.verify|verify} messages.
     * @param message PB_RoleInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_RoleInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_RoleInfo message, length delimited. Does not implicitly {@link PB_RoleInfo.verify|verify} messages.
     * @param message PB_RoleInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_RoleInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_RoleInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_RoleInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_RoleInfo;

    /**
     * Decodes a PB_RoleInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_RoleInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_RoleInfo;

    /**
     * Verifies a PB_RoleInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_RoleInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_RoleInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_RoleInfo;

    /**
     * Creates a plain object from a PB_RoleInfo message. Also converts values to other types if specified.
     * @param message PB_RoleInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_RoleInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_RoleInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRoleInfoAck. */
export interface IPB_SCRoleInfoAck {

    /** PB_SCRoleInfoAck curExp */
    curExp?: (number|Long|null);

    /** PB_SCRoleInfoAck createTime */
    createTime?: (number|Long|null);

    /** PB_SCRoleInfoAck roleinfo */
    roleinfo?: (IPB_RoleInfo|null);

    /** PB_SCRoleInfoAck appearance */
    appearance?: (IPB_Appearance|null);

    /** PB_SCRoleInfoAck sendReason */
    sendReason?: (number|null);

    /** PB_SCRoleInfoAck energy */
    energy?: (number|Long|null);

    /** PB_SCRoleInfoAck energyUpTime */
    energyUpTime?: (number|Long|null);

    /** PB_SCRoleInfoAck fightList */
    fightList?: (number[]|null);

    /** PB_SCRoleInfoAck mainFbLevel */
    mainFbLevel?: (number|null);

    /** PB_SCRoleInfoAck mainFbRound */
    mainFbRound?: (number|null);

    /** PB_SCRoleInfoAck mainFbReward */
    mainFbReward?: (boolean[]|null);

    /** PB_SCRoleInfoAck token */
    token?: (Uint8Array|null);

    /** PB_SCRoleInfoAck setNameCount */
    setNameCount?: (number|null);
}

/** Represents a PB_SCRoleInfoAck. */
export class PB_SCRoleInfoAck implements IPB_SCRoleInfoAck {

    /**
     * Constructs a new PB_SCRoleInfoAck.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRoleInfoAck);

    /** PB_SCRoleInfoAck curExp. */
    public curExp: (number|Long);

    /** PB_SCRoleInfoAck createTime. */
    public createTime: (number|Long);

    /** PB_SCRoleInfoAck roleinfo. */
    public roleinfo?: (IPB_RoleInfo|null);

    /** PB_SCRoleInfoAck appearance. */
    public appearance?: (IPB_Appearance|null);

    /** PB_SCRoleInfoAck sendReason. */
    public sendReason: number;

    /** PB_SCRoleInfoAck energy. */
    public energy: (number|Long);

    /** PB_SCRoleInfoAck energyUpTime. */
    public energyUpTime: (number|Long);

    /** PB_SCRoleInfoAck fightList. */
    public fightList: number[];

    /** PB_SCRoleInfoAck mainFbLevel. */
    public mainFbLevel: number;

    /** PB_SCRoleInfoAck mainFbRound. */
    public mainFbRound: number;

    /** PB_SCRoleInfoAck mainFbReward. */
    public mainFbReward: boolean[];

    /** PB_SCRoleInfoAck token. */
    public token: Uint8Array;

    /** PB_SCRoleInfoAck setNameCount. */
    public setNameCount: number;

    /**
     * Creates a new PB_SCRoleInfoAck instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRoleInfoAck instance
     */
    public static create(properties?: IPB_SCRoleInfoAck): PB_SCRoleInfoAck;

    /**
     * Encodes the specified PB_SCRoleInfoAck message. Does not implicitly {@link PB_SCRoleInfoAck.verify|verify} messages.
     * @param message PB_SCRoleInfoAck message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRoleInfoAck, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRoleInfoAck message, length delimited. Does not implicitly {@link PB_SCRoleInfoAck.verify|verify} messages.
     * @param message PB_SCRoleInfoAck message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRoleInfoAck, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRoleInfoAck message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRoleInfoAck
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRoleInfoAck;

    /**
     * Decodes a PB_SCRoleInfoAck message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRoleInfoAck
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRoleInfoAck;

    /**
     * Verifies a PB_SCRoleInfoAck message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRoleInfoAck message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRoleInfoAck
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRoleInfoAck;

    /**
     * Creates a plain object from a PB_SCRoleInfoAck message. Also converts values to other types if specified.
     * @param message PB_SCRoleInfoAck
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRoleInfoAck, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRoleInfoAck to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_AttrPair. */
export interface IPB_AttrPair {

    /** PB_AttrPair attrType */
    attrType?: (number|null);

    /** PB_AttrPair attrValue */
    attrValue?: (number|Long|null);
}

/** Represents a PB_AttrPair. */
export class PB_AttrPair implements IPB_AttrPair {

    /**
     * Constructs a new PB_AttrPair.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_AttrPair);

    /** PB_AttrPair attrType. */
    public attrType: number;

    /** PB_AttrPair attrValue. */
    public attrValue: (number|Long);

    /**
     * Creates a new PB_AttrPair instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_AttrPair instance
     */
    public static create(properties?: IPB_AttrPair): PB_AttrPair;

    /**
     * Encodes the specified PB_AttrPair message. Does not implicitly {@link PB_AttrPair.verify|verify} messages.
     * @param message PB_AttrPair message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_AttrPair, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_AttrPair message, length delimited. Does not implicitly {@link PB_AttrPair.verify|verify} messages.
     * @param message PB_AttrPair message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_AttrPair, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_AttrPair message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_AttrPair
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_AttrPair;

    /**
     * Decodes a PB_AttrPair message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_AttrPair
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_AttrPair;

    /**
     * Verifies a PB_AttrPair message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_AttrPair message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_AttrPair
     */
    public static fromObject(object: { [k: string]: any }): PB_AttrPair;

    /**
     * Creates a plain object from a PB_AttrPair message. Also converts values to other types if specified.
     * @param message PB_AttrPair
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_AttrPair, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_AttrPair to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRoleExpChange. */
export interface IPB_SCRoleExpChange {

    /** PB_SCRoleExpChange changeExp */
    changeExp?: (number|Long|null);

    /** PB_SCRoleExpChange curExp */
    curExp?: (number|Long|null);
}

/** Represents a PB_SCRoleExpChange. */
export class PB_SCRoleExpChange implements IPB_SCRoleExpChange {

    /**
     * Constructs a new PB_SCRoleExpChange.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRoleExpChange);

    /** PB_SCRoleExpChange changeExp. */
    public changeExp: (number|Long);

    /** PB_SCRoleExpChange curExp. */
    public curExp: (number|Long);

    /**
     * Creates a new PB_SCRoleExpChange instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRoleExpChange instance
     */
    public static create(properties?: IPB_SCRoleExpChange): PB_SCRoleExpChange;

    /**
     * Encodes the specified PB_SCRoleExpChange message. Does not implicitly {@link PB_SCRoleExpChange.verify|verify} messages.
     * @param message PB_SCRoleExpChange message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRoleExpChange, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRoleExpChange message, length delimited. Does not implicitly {@link PB_SCRoleExpChange.verify|verify} messages.
     * @param message PB_SCRoleExpChange message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRoleExpChange, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRoleExpChange message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRoleExpChange
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRoleExpChange;

    /**
     * Decodes a PB_SCRoleExpChange message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRoleExpChange
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRoleExpChange;

    /**
     * Verifies a PB_SCRoleExpChange message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRoleExpChange message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRoleExpChange
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRoleExpChange;

    /**
     * Creates a plain object from a PB_SCRoleExpChange message. Also converts values to other types if specified.
     * @param message PB_SCRoleExpChange
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRoleExpChange, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRoleExpChange to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRoleLevelChange. */
export interface IPB_SCRoleLevelChange {

    /** PB_SCRoleLevelChange level */
    level?: (number|null);

    /** PB_SCRoleLevelChange exp */
    exp?: (number|Long|null);
}

/** Represents a PB_SCRoleLevelChange. */
export class PB_SCRoleLevelChange implements IPB_SCRoleLevelChange {

    /**
     * Constructs a new PB_SCRoleLevelChange.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRoleLevelChange);

    /** PB_SCRoleLevelChange level. */
    public level: number;

    /** PB_SCRoleLevelChange exp. */
    public exp: (number|Long);

    /**
     * Creates a new PB_SCRoleLevelChange instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRoleLevelChange instance
     */
    public static create(properties?: IPB_SCRoleLevelChange): PB_SCRoleLevelChange;

    /**
     * Encodes the specified PB_SCRoleLevelChange message. Does not implicitly {@link PB_SCRoleLevelChange.verify|verify} messages.
     * @param message PB_SCRoleLevelChange message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRoleLevelChange, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRoleLevelChange message, length delimited. Does not implicitly {@link PB_SCRoleLevelChange.verify|verify} messages.
     * @param message PB_SCRoleLevelChange message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRoleLevelChange, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRoleLevelChange message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRoleLevelChange
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRoleLevelChange;

    /**
     * Decodes a PB_SCRoleLevelChange message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRoleLevelChange
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRoleLevelChange;

    /**
     * Verifies a PB_SCRoleLevelChange message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRoleLevelChange message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRoleLevelChange
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRoleLevelChange;

    /**
     * Creates a plain object from a PB_SCRoleLevelChange message. Also converts values to other types if specified.
     * @param message PB_SCRoleLevelChange
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRoleLevelChange, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRoleLevelChange to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSAllInfoReq. */
export interface IPB_CSAllInfoReq {

    /** PB_CSAllInfoReq reserve */
    reserve?: (number|null);
}

/** Represents a PB_CSAllInfoReq. */
export class PB_CSAllInfoReq implements IPB_CSAllInfoReq {

    /**
     * Constructs a new PB_CSAllInfoReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSAllInfoReq);

    /** PB_CSAllInfoReq reserve. */
    public reserve: number;

    /**
     * Creates a new PB_CSAllInfoReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSAllInfoReq instance
     */
    public static create(properties?: IPB_CSAllInfoReq): PB_CSAllInfoReq;

    /**
     * Encodes the specified PB_CSAllInfoReq message. Does not implicitly {@link PB_CSAllInfoReq.verify|verify} messages.
     * @param message PB_CSAllInfoReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSAllInfoReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSAllInfoReq message, length delimited. Does not implicitly {@link PB_CSAllInfoReq.verify|verify} messages.
     * @param message PB_CSAllInfoReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSAllInfoReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSAllInfoReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSAllInfoReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSAllInfoReq;

    /**
     * Decodes a PB_CSAllInfoReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSAllInfoReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSAllInfoReq;

    /**
     * Verifies a PB_CSAllInfoReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSAllInfoReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSAllInfoReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSAllInfoReq;

    /**
     * Creates a plain object from a PB_CSAllInfoReq message. Also converts values to other types if specified.
     * @param message PB_CSAllInfoReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSAllInfoReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSAllInfoReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSRoleOtherOperReq. */
export interface IPB_CSRoleOtherOperReq {

    /** PB_CSRoleOtherOperReq type */
    type?: (number|null);

    /** PB_CSRoleOtherOperReq param */
    param?: (number[]|null);
}

/** Represents a PB_CSRoleOtherOperReq. */
export class PB_CSRoleOtherOperReq implements IPB_CSRoleOtherOperReq {

    /**
     * Constructs a new PB_CSRoleOtherOperReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSRoleOtherOperReq);

    /** PB_CSRoleOtherOperReq type. */
    public type: number;

    /** PB_CSRoleOtherOperReq param. */
    public param: number[];

    /**
     * Creates a new PB_CSRoleOtherOperReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSRoleOtherOperReq instance
     */
    public static create(properties?: IPB_CSRoleOtherOperReq): PB_CSRoleOtherOperReq;

    /**
     * Encodes the specified PB_CSRoleOtherOperReq message. Does not implicitly {@link PB_CSRoleOtherOperReq.verify|verify} messages.
     * @param message PB_CSRoleOtherOperReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSRoleOtherOperReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSRoleOtherOperReq message, length delimited. Does not implicitly {@link PB_CSRoleOtherOperReq.verify|verify} messages.
     * @param message PB_CSRoleOtherOperReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSRoleOtherOperReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSRoleOtherOperReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSRoleOtherOperReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSRoleOtherOperReq;

    /**
     * Decodes a PB_CSRoleOtherOperReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSRoleOtherOperReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSRoleOtherOperReq;

    /**
     * Verifies a PB_CSRoleOtherOperReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSRoleOtherOperReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSRoleOtherOperReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSRoleOtherOperReq;

    /**
     * Creates a plain object from a PB_CSRoleOtherOperReq message. Also converts values to other types if specified.
     * @param message PB_CSRoleOtherOperReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSRoleOtherOperReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSRoleOtherOperReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRoleZhuoMianReward. */
export interface IPB_SCRoleZhuoMianReward {

    /** PB_SCRoleZhuoMianReward isFetch */
    isFetch?: (boolean|null);
}

/** Represents a PB_SCRoleZhuoMianReward. */
export class PB_SCRoleZhuoMianReward implements IPB_SCRoleZhuoMianReward {

    /**
     * Constructs a new PB_SCRoleZhuoMianReward.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRoleZhuoMianReward);

    /** PB_SCRoleZhuoMianReward isFetch. */
    public isFetch: boolean;

    /**
     * Creates a new PB_SCRoleZhuoMianReward instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRoleZhuoMianReward instance
     */
    public static create(properties?: IPB_SCRoleZhuoMianReward): PB_SCRoleZhuoMianReward;

    /**
     * Encodes the specified PB_SCRoleZhuoMianReward message. Does not implicitly {@link PB_SCRoleZhuoMianReward.verify|verify} messages.
     * @param message PB_SCRoleZhuoMianReward message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRoleZhuoMianReward, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRoleZhuoMianReward message, length delimited. Does not implicitly {@link PB_SCRoleZhuoMianReward.verify|verify} messages.
     * @param message PB_SCRoleZhuoMianReward message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRoleZhuoMianReward, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRoleZhuoMianReward message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRoleZhuoMianReward
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRoleZhuoMianReward;

    /**
     * Decodes a PB_SCRoleZhuoMianReward message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRoleZhuoMianReward
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRoleZhuoMianReward;

    /**
     * Verifies a PB_SCRoleZhuoMianReward message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRoleZhuoMianReward message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRoleZhuoMianReward
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRoleZhuoMianReward;

    /**
     * Creates a plain object from a PB_SCRoleZhuoMianReward message. Also converts values to other types if specified.
     * @param message PB_SCRoleZhuoMianReward
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRoleZhuoMianReward, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRoleZhuoMianReward to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_system_set. */
export interface IPB_system_set {

    /** PB_system_set systemSetType */
    systemSetType?: (number|null);

    /** PB_system_set systemSetParam */
    systemSetParam?: (number|null);
}

/** Represents a PB_system_set. */
export class PB_system_set implements IPB_system_set {

    /**
     * Constructs a new PB_system_set.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_system_set);

    /** PB_system_set systemSetType. */
    public systemSetType: number;

    /** PB_system_set systemSetParam. */
    public systemSetParam: number;

    /**
     * Creates a new PB_system_set instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_system_set instance
     */
    public static create(properties?: IPB_system_set): PB_system_set;

    /**
     * Encodes the specified PB_system_set message. Does not implicitly {@link PB_system_set.verify|verify} messages.
     * @param message PB_system_set message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_system_set, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_system_set message, length delimited. Does not implicitly {@link PB_system_set.verify|verify} messages.
     * @param message PB_system_set message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_system_set, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_system_set message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_system_set
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_system_set;

    /**
     * Decodes a PB_system_set message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_system_set
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_system_set;

    /**
     * Verifies a PB_system_set message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_system_set message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_system_set
     */
    public static fromObject(object: { [k: string]: any }): PB_system_set;

    /**
     * Creates a plain object from a PB_system_set message. Also converts values to other types if specified.
     * @param message PB_system_set
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_system_set, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_system_set to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSRoleSystemSetReq. */
export interface IPB_CSRoleSystemSetReq {

    /** PB_CSRoleSystemSetReq systemSetList */
    systemSetList?: (IPB_system_set[]|null);
}

/** Represents a PB_CSRoleSystemSetReq. */
export class PB_CSRoleSystemSetReq implements IPB_CSRoleSystemSetReq {

    /**
     * Constructs a new PB_CSRoleSystemSetReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSRoleSystemSetReq);

    /** PB_CSRoleSystemSetReq systemSetList. */
    public systemSetList: IPB_system_set[];

    /**
     * Creates a new PB_CSRoleSystemSetReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSRoleSystemSetReq instance
     */
    public static create(properties?: IPB_CSRoleSystemSetReq): PB_CSRoleSystemSetReq;

    /**
     * Encodes the specified PB_CSRoleSystemSetReq message. Does not implicitly {@link PB_CSRoleSystemSetReq.verify|verify} messages.
     * @param message PB_CSRoleSystemSetReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSRoleSystemSetReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSRoleSystemSetReq message, length delimited. Does not implicitly {@link PB_CSRoleSystemSetReq.verify|verify} messages.
     * @param message PB_CSRoleSystemSetReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSRoleSystemSetReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSRoleSystemSetReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSRoleSystemSetReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSRoleSystemSetReq;

    /**
     * Decodes a PB_CSRoleSystemSetReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSRoleSystemSetReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSRoleSystemSetReq;

    /**
     * Verifies a PB_CSRoleSystemSetReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSRoleSystemSetReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSRoleSystemSetReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSRoleSystemSetReq;

    /**
     * Creates a plain object from a PB_CSRoleSystemSetReq message. Also converts values to other types if specified.
     * @param message PB_CSRoleSystemSetReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSRoleSystemSetReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSRoleSystemSetReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRoleSystemSetInfo. */
export interface IPB_SCRoleSystemSetInfo {

    /** PB_SCRoleSystemSetInfo systemSetList */
    systemSetList?: (IPB_system_set[]|null);
}

/** Represents a PB_SCRoleSystemSetInfo. */
export class PB_SCRoleSystemSetInfo implements IPB_SCRoleSystemSetInfo {

    /**
     * Constructs a new PB_SCRoleSystemSetInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRoleSystemSetInfo);

    /** PB_SCRoleSystemSetInfo systemSetList. */
    public systemSetList: IPB_system_set[];

    /**
     * Creates a new PB_SCRoleSystemSetInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRoleSystemSetInfo instance
     */
    public static create(properties?: IPB_SCRoleSystemSetInfo): PB_SCRoleSystemSetInfo;

    /**
     * Encodes the specified PB_SCRoleSystemSetInfo message. Does not implicitly {@link PB_SCRoleSystemSetInfo.verify|verify} messages.
     * @param message PB_SCRoleSystemSetInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRoleSystemSetInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRoleSystemSetInfo message, length delimited. Does not implicitly {@link PB_SCRoleSystemSetInfo.verify|verify} messages.
     * @param message PB_SCRoleSystemSetInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRoleSystemSetInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRoleSystemSetInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRoleSystemSetInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRoleSystemSetInfo;

    /**
     * Decodes a PB_SCRoleSystemSetInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRoleSystemSetInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRoleSystemSetInfo;

    /**
     * Verifies a PB_SCRoleSystemSetInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRoleSystemSetInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRoleSystemSetInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRoleSystemSetInfo;

    /**
     * Creates a plain object from a PB_SCRoleSystemSetInfo message. Also converts values to other types if specified.
     * @param message PB_SCRoleSystemSetInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRoleSystemSetInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRoleSystemSetInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSRoleWXInfoSetReq. */
export interface IPB_CSRoleWXInfoSetReq {

    /** PB_CSRoleWXInfoSetReq name */
    name?: (Uint8Array|null);

    /** PB_CSRoleWXInfoSetReq headChar */
    headChar?: (Uint8Array|null);

    /** PB_CSRoleWXInfoSetReq isWx */
    isWx?: (boolean|null);
}

/** Represents a PB_CSRoleWXInfoSetReq. */
export class PB_CSRoleWXInfoSetReq implements IPB_CSRoleWXInfoSetReq {

    /**
     * Constructs a new PB_CSRoleWXInfoSetReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSRoleWXInfoSetReq);

    /** PB_CSRoleWXInfoSetReq name. */
    public name: Uint8Array;

    /** PB_CSRoleWXInfoSetReq headChar. */
    public headChar: Uint8Array;

    /** PB_CSRoleWXInfoSetReq isWx. */
    public isWx: boolean;

    /**
     * Creates a new PB_CSRoleWXInfoSetReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSRoleWXInfoSetReq instance
     */
    public static create(properties?: IPB_CSRoleWXInfoSetReq): PB_CSRoleWXInfoSetReq;

    /**
     * Encodes the specified PB_CSRoleWXInfoSetReq message. Does not implicitly {@link PB_CSRoleWXInfoSetReq.verify|verify} messages.
     * @param message PB_CSRoleWXInfoSetReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSRoleWXInfoSetReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSRoleWXInfoSetReq message, length delimited. Does not implicitly {@link PB_CSRoleWXInfoSetReq.verify|verify} messages.
     * @param message PB_CSRoleWXInfoSetReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSRoleWXInfoSetReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSRoleWXInfoSetReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSRoleWXInfoSetReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSRoleWXInfoSetReq;

    /**
     * Decodes a PB_CSRoleWXInfoSetReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSRoleWXInfoSetReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSRoleWXInfoSetReq;

    /**
     * Verifies a PB_CSRoleWXInfoSetReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSRoleWXInfoSetReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSRoleWXInfoSetReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSRoleWXInfoSetReq;

    /**
     * Creates a plain object from a PB_CSRoleWXInfoSetReq message. Also converts values to other types if specified.
     * @param message PB_CSRoleWXInfoSetReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSRoleWXInfoSetReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSRoleWXInfoSetReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSRoleResetReq. */
export interface IPB_CSRoleResetReq {
}

/** Represents a PB_CSRoleResetReq. */
export class PB_CSRoleResetReq implements IPB_CSRoleResetReq {

    /**
     * Constructs a new PB_CSRoleResetReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSRoleResetReq);

    /**
     * Creates a new PB_CSRoleResetReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSRoleResetReq instance
     */
    public static create(properties?: IPB_CSRoleResetReq): PB_CSRoleResetReq;

    /**
     * Encodes the specified PB_CSRoleResetReq message. Does not implicitly {@link PB_CSRoleResetReq.verify|verify} messages.
     * @param message PB_CSRoleResetReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSRoleResetReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSRoleResetReq message, length delimited. Does not implicitly {@link PB_CSRoleResetReq.verify|verify} messages.
     * @param message PB_CSRoleResetReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSRoleResetReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSRoleResetReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSRoleResetReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSRoleResetReq;

    /**
     * Decodes a PB_CSRoleResetReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSRoleResetReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSRoleResetReq;

    /**
     * Verifies a PB_CSRoleResetReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSRoleResetReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSRoleResetReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSRoleResetReq;

    /**
     * Creates a plain object from a PB_CSRoleResetReq message. Also converts values to other types if specified.
     * @param message PB_CSRoleResetReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSRoleResetReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSRoleResetReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSRoleSetHeadFrame. */
export interface IPB_CSRoleSetHeadFrame {

    /** PB_CSRoleSetHeadFrame id */
    id?: (number|null);

    /** PB_CSRoleSetHeadFrame headId */
    headId?: (number|null);
}

/** Represents a PB_CSRoleSetHeadFrame. */
export class PB_CSRoleSetHeadFrame implements IPB_CSRoleSetHeadFrame {

    /**
     * Constructs a new PB_CSRoleSetHeadFrame.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSRoleSetHeadFrame);

    /** PB_CSRoleSetHeadFrame id. */
    public id: number;

    /** PB_CSRoleSetHeadFrame headId. */
    public headId: number;

    /**
     * Creates a new PB_CSRoleSetHeadFrame instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSRoleSetHeadFrame instance
     */
    public static create(properties?: IPB_CSRoleSetHeadFrame): PB_CSRoleSetHeadFrame;

    /**
     * Encodes the specified PB_CSRoleSetHeadFrame message. Does not implicitly {@link PB_CSRoleSetHeadFrame.verify|verify} messages.
     * @param message PB_CSRoleSetHeadFrame message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSRoleSetHeadFrame, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSRoleSetHeadFrame message, length delimited. Does not implicitly {@link PB_CSRoleSetHeadFrame.verify|verify} messages.
     * @param message PB_CSRoleSetHeadFrame message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSRoleSetHeadFrame, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSRoleSetHeadFrame message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSRoleSetHeadFrame
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSRoleSetHeadFrame;

    /**
     * Decodes a PB_CSRoleSetHeadFrame message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSRoleSetHeadFrame
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSRoleSetHeadFrame;

    /**
     * Verifies a PB_CSRoleSetHeadFrame message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSRoleSetHeadFrame message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSRoleSetHeadFrame
     */
    public static fromObject(object: { [k: string]: any }): PB_CSRoleSetHeadFrame;

    /**
     * Creates a plain object from a PB_CSRoleSetHeadFrame message. Also converts values to other types if specified.
     * @param message PB_CSRoleSetHeadFrame
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSRoleSetHeadFrame, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSRoleSetHeadFrame to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_RoleBaseInfo. */
export interface IPB_RoleBaseInfo {

    /** PB_RoleBaseInfo newName */
    newName?: (Uint8Array|null);

    /** PB_RoleBaseInfo newSex */
    newSex?: (number|null);

    /** PB_RoleBaseInfo newNameStrId */
    newNameStrId?: (number|Long|null);
}

/** Represents a PB_RoleBaseInfo. */
export class PB_RoleBaseInfo implements IPB_RoleBaseInfo {

    /**
     * Constructs a new PB_RoleBaseInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_RoleBaseInfo);

    /** PB_RoleBaseInfo newName. */
    public newName: Uint8Array;

    /** PB_RoleBaseInfo newSex. */
    public newSex: number;

    /** PB_RoleBaseInfo newNameStrId. */
    public newNameStrId: (number|Long);

    /**
     * Creates a new PB_RoleBaseInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_RoleBaseInfo instance
     */
    public static create(properties?: IPB_RoleBaseInfo): PB_RoleBaseInfo;

    /**
     * Encodes the specified PB_RoleBaseInfo message. Does not implicitly {@link PB_RoleBaseInfo.verify|verify} messages.
     * @param message PB_RoleBaseInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_RoleBaseInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_RoleBaseInfo message, length delimited. Does not implicitly {@link PB_RoleBaseInfo.verify|verify} messages.
     * @param message PB_RoleBaseInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_RoleBaseInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_RoleBaseInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_RoleBaseInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_RoleBaseInfo;

    /**
     * Decodes a PB_RoleBaseInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_RoleBaseInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_RoleBaseInfo;

    /**
     * Verifies a PB_RoleBaseInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_RoleBaseInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_RoleBaseInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_RoleBaseInfo;

    /**
     * Creates a plain object from a PB_RoleBaseInfo message. Also converts values to other types if specified.
     * @param message PB_RoleBaseInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_RoleBaseInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_RoleBaseInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSRoleResetBaseReq. */
export interface IPB_CSRoleResetBaseReq {

    /** PB_CSRoleResetBaseReq reqType */
    reqType?: (PB_CSRoleResetBaseReq.ReqType|null);

    /** PB_CSRoleResetBaseReq newBaseInfo */
    newBaseInfo?: (IPB_RoleBaseInfo|null);
}

/** Represents a PB_CSRoleResetBaseReq. */
export class PB_CSRoleResetBaseReq implements IPB_CSRoleResetBaseReq {

    /**
     * Constructs a new PB_CSRoleResetBaseReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSRoleResetBaseReq);

    /** PB_CSRoleResetBaseReq reqType. */
    public reqType: PB_CSRoleResetBaseReq.ReqType;

    /** PB_CSRoleResetBaseReq newBaseInfo. */
    public newBaseInfo?: (IPB_RoleBaseInfo|null);

    /**
     * Creates a new PB_CSRoleResetBaseReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSRoleResetBaseReq instance
     */
    public static create(properties?: IPB_CSRoleResetBaseReq): PB_CSRoleResetBaseReq;

    /**
     * Encodes the specified PB_CSRoleResetBaseReq message. Does not implicitly {@link PB_CSRoleResetBaseReq.verify|verify} messages.
     * @param message PB_CSRoleResetBaseReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSRoleResetBaseReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSRoleResetBaseReq message, length delimited. Does not implicitly {@link PB_CSRoleResetBaseReq.verify|verify} messages.
     * @param message PB_CSRoleResetBaseReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSRoleResetBaseReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSRoleResetBaseReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSRoleResetBaseReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSRoleResetBaseReq;

    /**
     * Decodes a PB_CSRoleResetBaseReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSRoleResetBaseReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSRoleResetBaseReq;

    /**
     * Verifies a PB_CSRoleResetBaseReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSRoleResetBaseReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSRoleResetBaseReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSRoleResetBaseReq;

    /**
     * Creates a plain object from a PB_CSRoleResetBaseReq message. Also converts values to other types if specified.
     * @param message PB_CSRoleResetBaseReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSRoleResetBaseReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSRoleResetBaseReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace PB_CSRoleResetBaseReq {

    /** ReqType enum. */
    enum ReqType {
        CREAT_ROLE = 0,
        COST_ITEM = 1
    }
}

/** Properties of a PB_SCRoleCreatResetInfo. */
export interface IPB_SCRoleCreatResetInfo {

    /** PB_SCRoleCreatResetInfo finishCreatRoleReset */
    finishCreatRoleReset?: (number|null);
}

/** Represents a PB_SCRoleCreatResetInfo. */
export class PB_SCRoleCreatResetInfo implements IPB_SCRoleCreatResetInfo {

    /**
     * Constructs a new PB_SCRoleCreatResetInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRoleCreatResetInfo);

    /** PB_SCRoleCreatResetInfo finishCreatRoleReset. */
    public finishCreatRoleReset: number;

    /**
     * Creates a new PB_SCRoleCreatResetInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRoleCreatResetInfo instance
     */
    public static create(properties?: IPB_SCRoleCreatResetInfo): PB_SCRoleCreatResetInfo;

    /**
     * Encodes the specified PB_SCRoleCreatResetInfo message. Does not implicitly {@link PB_SCRoleCreatResetInfo.verify|verify} messages.
     * @param message PB_SCRoleCreatResetInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRoleCreatResetInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRoleCreatResetInfo message, length delimited. Does not implicitly {@link PB_SCRoleCreatResetInfo.verify|verify} messages.
     * @param message PB_SCRoleCreatResetInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRoleCreatResetInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRoleCreatResetInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRoleCreatResetInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRoleCreatResetInfo;

    /**
     * Decodes a PB_SCRoleCreatResetInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRoleCreatResetInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRoleCreatResetInfo;

    /**
     * Verifies a PB_SCRoleCreatResetInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRoleCreatResetInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRoleCreatResetInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRoleCreatResetInfo;

    /**
     * Creates a plain object from a PB_SCRoleCreatResetInfo message. Also converts values to other types if specified.
     * @param message PB_SCRoleCreatResetInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRoleCreatResetInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRoleCreatResetInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSGetRandNameStrIDReq. */
export interface IPB_CSGetRandNameStrIDReq {

    /** PB_CSGetRandNameStrIDReq sex */
    sex?: (number|null);
}

/** Represents a PB_CSGetRandNameStrIDReq. */
export class PB_CSGetRandNameStrIDReq implements IPB_CSGetRandNameStrIDReq {

    /**
     * Constructs a new PB_CSGetRandNameStrIDReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSGetRandNameStrIDReq);

    /** PB_CSGetRandNameStrIDReq sex. */
    public sex: number;

    /**
     * Creates a new PB_CSGetRandNameStrIDReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSGetRandNameStrIDReq instance
     */
    public static create(properties?: IPB_CSGetRandNameStrIDReq): PB_CSGetRandNameStrIDReq;

    /**
     * Encodes the specified PB_CSGetRandNameStrIDReq message. Does not implicitly {@link PB_CSGetRandNameStrIDReq.verify|verify} messages.
     * @param message PB_CSGetRandNameStrIDReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSGetRandNameStrIDReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSGetRandNameStrIDReq message, length delimited. Does not implicitly {@link PB_CSGetRandNameStrIDReq.verify|verify} messages.
     * @param message PB_CSGetRandNameStrIDReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSGetRandNameStrIDReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSGetRandNameStrIDReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSGetRandNameStrIDReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSGetRandNameStrIDReq;

    /**
     * Decodes a PB_CSGetRandNameStrIDReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSGetRandNameStrIDReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSGetRandNameStrIDReq;

    /**
     * Verifies a PB_CSGetRandNameStrIDReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSGetRandNameStrIDReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSGetRandNameStrIDReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSGetRandNameStrIDReq;

    /**
     * Creates a plain object from a PB_CSGetRandNameStrIDReq message. Also converts values to other types if specified.
     * @param message PB_CSGetRandNameStrIDReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSGetRandNameStrIDReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSGetRandNameStrIDReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCGetRandNameStrIDRet. */
export interface IPB_SCGetRandNameStrIDRet {

    /** PB_SCGetRandNameStrIDRet frontSex */
    frontSex?: (number|null);

    /** PB_SCGetRandNameStrIDRet frontId */
    frontId?: (number|null);

    /** PB_SCGetRandNameStrIDRet middleSex */
    middleSex?: (number|null);

    /** PB_SCGetRandNameStrIDRet middleId */
    middleId?: (number|null);

    /** PB_SCGetRandNameStrIDRet lastSex */
    lastSex?: (number|null);

    /** PB_SCGetRandNameStrIDRet lastId */
    lastId?: (number|null);

    /** PB_SCGetRandNameStrIDRet randNameStrId */
    randNameStrId?: (number|Long|null);
}

/** Represents a PB_SCGetRandNameStrIDRet. */
export class PB_SCGetRandNameStrIDRet implements IPB_SCGetRandNameStrIDRet {

    /**
     * Constructs a new PB_SCGetRandNameStrIDRet.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCGetRandNameStrIDRet);

    /** PB_SCGetRandNameStrIDRet frontSex. */
    public frontSex: number;

    /** PB_SCGetRandNameStrIDRet frontId. */
    public frontId: number;

    /** PB_SCGetRandNameStrIDRet middleSex. */
    public middleSex: number;

    /** PB_SCGetRandNameStrIDRet middleId. */
    public middleId: number;

    /** PB_SCGetRandNameStrIDRet lastSex. */
    public lastSex: number;

    /** PB_SCGetRandNameStrIDRet lastId. */
    public lastId: number;

    /** PB_SCGetRandNameStrIDRet randNameStrId. */
    public randNameStrId: (number|Long);

    /**
     * Creates a new PB_SCGetRandNameStrIDRet instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCGetRandNameStrIDRet instance
     */
    public static create(properties?: IPB_SCGetRandNameStrIDRet): PB_SCGetRandNameStrIDRet;

    /**
     * Encodes the specified PB_SCGetRandNameStrIDRet message. Does not implicitly {@link PB_SCGetRandNameStrIDRet.verify|verify} messages.
     * @param message PB_SCGetRandNameStrIDRet message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCGetRandNameStrIDRet, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCGetRandNameStrIDRet message, length delimited. Does not implicitly {@link PB_SCGetRandNameStrIDRet.verify|verify} messages.
     * @param message PB_SCGetRandNameStrIDRet message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCGetRandNameStrIDRet, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCGetRandNameStrIDRet message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCGetRandNameStrIDRet
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCGetRandNameStrIDRet;

    /**
     * Decodes a PB_SCGetRandNameStrIDRet message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCGetRandNameStrIDRet
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCGetRandNameStrIDRet;

    /**
     * Verifies a PB_SCGetRandNameStrIDRet message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCGetRandNameStrIDRet message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCGetRandNameStrIDRet
     */
    public static fromObject(object: { [k: string]: any }): PB_SCGetRandNameStrIDRet;

    /**
     * Creates a plain object from a PB_SCGetRandNameStrIDRet message. Also converts values to other types if specified.
     * @param message PB_SCGetRandNameStrIDRet
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCGetRandNameStrIDRet, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCGetRandNameStrIDRet to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSGetOtherRoleInfo. */
export interface IPB_CSGetOtherRoleInfo {

    /** PB_CSGetOtherRoleInfo uid */
    uid?: (number|null);
}

/** Represents a PB_CSGetOtherRoleInfo. */
export class PB_CSGetOtherRoleInfo implements IPB_CSGetOtherRoleInfo {

    /**
     * Constructs a new PB_CSGetOtherRoleInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSGetOtherRoleInfo);

    /** PB_CSGetOtherRoleInfo uid. */
    public uid: number;

    /**
     * Creates a new PB_CSGetOtherRoleInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSGetOtherRoleInfo instance
     */
    public static create(properties?: IPB_CSGetOtherRoleInfo): PB_CSGetOtherRoleInfo;

    /**
     * Encodes the specified PB_CSGetOtherRoleInfo message. Does not implicitly {@link PB_CSGetOtherRoleInfo.verify|verify} messages.
     * @param message PB_CSGetOtherRoleInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSGetOtherRoleInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSGetOtherRoleInfo message, length delimited. Does not implicitly {@link PB_CSGetOtherRoleInfo.verify|verify} messages.
     * @param message PB_CSGetOtherRoleInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSGetOtherRoleInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSGetOtherRoleInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSGetOtherRoleInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSGetOtherRoleInfo;

    /**
     * Decodes a PB_CSGetOtherRoleInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSGetOtherRoleInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSGetOtherRoleInfo;

    /**
     * Verifies a PB_CSGetOtherRoleInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSGetOtherRoleInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSGetOtherRoleInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_CSGetOtherRoleInfo;

    /**
     * Creates a plain object from a PB_CSGetOtherRoleInfo message. Also converts values to other types if specified.
     * @param message PB_CSGetOtherRoleInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSGetOtherRoleInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSGetOtherRoleInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCGetOtherRoleRet. */
export interface IPB_SCGetOtherRoleRet {

    /** PB_SCGetOtherRoleRet uid */
    uid?: (number|null);

    /** PB_SCGetOtherRoleRet roleinfo */
    roleinfo?: (IPB_RoleInfo|null);
}

/** Represents a PB_SCGetOtherRoleRet. */
export class PB_SCGetOtherRoleRet implements IPB_SCGetOtherRoleRet {

    /**
     * Constructs a new PB_SCGetOtherRoleRet.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCGetOtherRoleRet);

    /** PB_SCGetOtherRoleRet uid. */
    public uid: number;

    /** PB_SCGetOtherRoleRet roleinfo. */
    public roleinfo?: (IPB_RoleInfo|null);

    /**
     * Creates a new PB_SCGetOtherRoleRet instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCGetOtherRoleRet instance
     */
    public static create(properties?: IPB_SCGetOtherRoleRet): PB_SCGetOtherRoleRet;

    /**
     * Encodes the specified PB_SCGetOtherRoleRet message. Does not implicitly {@link PB_SCGetOtherRoleRet.verify|verify} messages.
     * @param message PB_SCGetOtherRoleRet message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCGetOtherRoleRet, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCGetOtherRoleRet message, length delimited. Does not implicitly {@link PB_SCGetOtherRoleRet.verify|verify} messages.
     * @param message PB_SCGetOtherRoleRet message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCGetOtherRoleRet, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCGetOtherRoleRet message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCGetOtherRoleRet
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCGetOtherRoleRet;

    /**
     * Decodes a PB_SCGetOtherRoleRet message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCGetOtherRoleRet
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCGetOtherRoleRet;

    /**
     * Verifies a PB_SCGetOtherRoleRet message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCGetOtherRoleRet message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCGetOtherRoleRet
     */
    public static fromObject(object: { [k: string]: any }): PB_SCGetOtherRoleRet;

    /**
     * Creates a plain object from a PB_SCGetOtherRoleRet message. Also converts values to other types if specified.
     * @param message PB_SCGetOtherRoleRet
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCGetOtherRoleRet, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCGetOtherRoleRet to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_BattleHeroInfo. */
export interface IPB_BattleHeroInfo {

    /** PB_BattleHeroInfo heroId */
    heroId?: (number|null);

    /** PB_BattleHeroInfo heroDamage */
    heroDamage?: (number|Long|null);

    /** PB_BattleHeroInfo heroLevel */
    heroLevel?: (number|null);
}

/** Represents a PB_BattleHeroInfo. */
export class PB_BattleHeroInfo implements IPB_BattleHeroInfo {

    /**
     * Constructs a new PB_BattleHeroInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_BattleHeroInfo);

    /** PB_BattleHeroInfo heroId. */
    public heroId: number;

    /** PB_BattleHeroInfo heroDamage. */
    public heroDamage: (number|Long);

    /** PB_BattleHeroInfo heroLevel. */
    public heroLevel: number;

    /**
     * Creates a new PB_BattleHeroInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_BattleHeroInfo instance
     */
    public static create(properties?: IPB_BattleHeroInfo): PB_BattleHeroInfo;

    /**
     * Encodes the specified PB_BattleHeroInfo message. Does not implicitly {@link PB_BattleHeroInfo.verify|verify} messages.
     * @param message PB_BattleHeroInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_BattleHeroInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_BattleHeroInfo message, length delimited. Does not implicitly {@link PB_BattleHeroInfo.verify|verify} messages.
     * @param message PB_BattleHeroInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_BattleHeroInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_BattleHeroInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_BattleHeroInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_BattleHeroInfo;

    /**
     * Decodes a PB_BattleHeroInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_BattleHeroInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_BattleHeroInfo;

    /**
     * Verifies a PB_BattleHeroInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_BattleHeroInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_BattleHeroInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_BattleHeroInfo;

    /**
     * Creates a plain object from a PB_BattleHeroInfo message. Also converts values to other types if specified.
     * @param message PB_BattleHeroInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_BattleHeroInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_BattleHeroInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSBattleRet. */
export interface IPB_CSBattleRet {

    /** PB_CSBattleRet battleResult */
    battleResult?: (number|null);

    /** PB_CSBattleRet battleMode */
    battleMode?: (number|null);

    /** PB_CSBattleRet battleRound */
    battleRound?: (number|null);

    /** PB_CSBattleRet battleParam */
    battleParam?: (number[]|null);

    /** PB_CSBattleRet roundList */
    roundList?: (IPB_SCBattleRoundInfo[]|null);

    /** PB_CSBattleRet killElite */
    killElite?: (number|null);

    /** PB_CSBattleRet comboNum */
    comboNum?: (number|null);

    /** PB_CSBattleRet boxNum */
    boxNum?: (number|null);

    /** PB_CSBattleRet compNum */
    compNum?: (number|null);

    /** PB_CSBattleRet heroList */
    heroList?: (IPB_BattleHeroInfo[]|null);

    /** PB_CSBattleRet killBoss */
    killBoss?: (number|null);

    /** PB_CSBattleRet killMonster */
    killMonster?: (number|null);
}

/** Represents a PB_CSBattleRet. */
export class PB_CSBattleRet implements IPB_CSBattleRet {

    /**
     * Constructs a new PB_CSBattleRet.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSBattleRet);

    /** PB_CSBattleRet battleResult. */
    public battleResult: number;

    /** PB_CSBattleRet battleMode. */
    public battleMode: number;

    /** PB_CSBattleRet battleRound. */
    public battleRound: number;

    /** PB_CSBattleRet battleParam. */
    public battleParam: number[];

    /** PB_CSBattleRet roundList. */
    public roundList: IPB_SCBattleRoundInfo[];

    /** PB_CSBattleRet killElite. */
    public killElite: number;

    /** PB_CSBattleRet comboNum. */
    public comboNum: number;

    /** PB_CSBattleRet boxNum. */
    public boxNum: number;

    /** PB_CSBattleRet compNum. */
    public compNum: number;

    /** PB_CSBattleRet heroList. */
    public heroList: IPB_BattleHeroInfo[];

    /** PB_CSBattleRet killBoss. */
    public killBoss: number;

    /** PB_CSBattleRet killMonster. */
    public killMonster: number;

    /**
     * Creates a new PB_CSBattleRet instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSBattleRet instance
     */
    public static create(properties?: IPB_CSBattleRet): PB_CSBattleRet;

    /**
     * Encodes the specified PB_CSBattleRet message. Does not implicitly {@link PB_CSBattleRet.verify|verify} messages.
     * @param message PB_CSBattleRet message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSBattleRet, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSBattleRet message, length delimited. Does not implicitly {@link PB_CSBattleRet.verify|verify} messages.
     * @param message PB_CSBattleRet message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSBattleRet, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSBattleRet message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSBattleRet
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSBattleRet;

    /**
     * Decodes a PB_CSBattleRet message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSBattleRet
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSBattleRet;

    /**
     * Verifies a PB_CSBattleRet message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSBattleRet message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSBattleRet
     */
    public static fromObject(object: { [k: string]: any }): PB_CSBattleRet;

    /**
     * Creates a plain object from a PB_CSBattleRet message. Also converts values to other types if specified.
     * @param message PB_CSBattleRet
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSBattleRet, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSBattleRet to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCBattleReward. */
export interface IPB_SCBattleReward {

    /** PB_SCBattleReward itemId */
    itemId?: (number|null);

    /** PB_SCBattleReward itemNum */
    itemNum?: (number|Long|null);
}

/** Represents a PB_SCBattleReward. */
export class PB_SCBattleReward implements IPB_SCBattleReward {

    /**
     * Constructs a new PB_SCBattleReward.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCBattleReward);

    /** PB_SCBattleReward itemId. */
    public itemId: number;

    /** PB_SCBattleReward itemNum. */
    public itemNum: (number|Long);

    /**
     * Creates a new PB_SCBattleReward instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCBattleReward instance
     */
    public static create(properties?: IPB_SCBattleReward): PB_SCBattleReward;

    /**
     * Encodes the specified PB_SCBattleReward message. Does not implicitly {@link PB_SCBattleReward.verify|verify} messages.
     * @param message PB_SCBattleReward message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCBattleReward, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCBattleReward message, length delimited. Does not implicitly {@link PB_SCBattleReward.verify|verify} messages.
     * @param message PB_SCBattleReward message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCBattleReward, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCBattleReward message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCBattleReward
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCBattleReward;

    /**
     * Decodes a PB_SCBattleReward message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCBattleReward
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCBattleReward;

    /**
     * Verifies a PB_SCBattleReward message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCBattleReward message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCBattleReward
     */
    public static fromObject(object: { [k: string]: any }): PB_SCBattleReward;

    /**
     * Creates a plain object from a PB_SCBattleReward message. Also converts values to other types if specified.
     * @param message PB_SCBattleReward
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCBattleReward, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCBattleReward to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCBattleReport. */
export interface IPB_SCBattleReport {

    /** PB_SCBattleReport battleResult */
    battleResult?: (number|null);

    /** PB_SCBattleReport battleMode */
    battleMode?: (number|null);

    /** PB_SCBattleReport battleRound */
    battleRound?: (number|null);

    /** PB_SCBattleReport rewardList */
    rewardList?: (IPB_SCBattleReward[]|null);

    /** PB_SCBattleReport battleParam */
    battleParam?: (number[]|null);

    /** PB_SCBattleReport arenaScoreChange */
    arenaScoreChange?: (number|null);
}

/** Represents a PB_SCBattleReport. */
export class PB_SCBattleReport implements IPB_SCBattleReport {

    /**
     * Constructs a new PB_SCBattleReport.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCBattleReport);

    /** PB_SCBattleReport battleResult. */
    public battleResult: number;

    /** PB_SCBattleReport battleMode. */
    public battleMode: number;

    /** PB_SCBattleReport battleRound. */
    public battleRound: number;

    /** PB_SCBattleReport rewardList. */
    public rewardList: IPB_SCBattleReward[];

    /** PB_SCBattleReport battleParam. */
    public battleParam: number[];

    /** PB_SCBattleReport arenaScoreChange. */
    public arenaScoreChange: number;

    /**
     * Creates a new PB_SCBattleReport instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCBattleReport instance
     */
    public static create(properties?: IPB_SCBattleReport): PB_SCBattleReport;

    /**
     * Encodes the specified PB_SCBattleReport message. Does not implicitly {@link PB_SCBattleReport.verify|verify} messages.
     * @param message PB_SCBattleReport message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCBattleReport, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCBattleReport message, length delimited. Does not implicitly {@link PB_SCBattleReport.verify|verify} messages.
     * @param message PB_SCBattleReport message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCBattleReport, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCBattleReport message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCBattleReport
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCBattleReport;

    /**
     * Decodes a PB_SCBattleReport message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCBattleReport
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCBattleReport;

    /**
     * Verifies a PB_SCBattleReport message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCBattleReport message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCBattleReport
     */
    public static fromObject(object: { [k: string]: any }): PB_SCBattleReport;

    /**
     * Creates a plain object from a PB_SCBattleReport message. Also converts values to other types if specified.
     * @param message PB_SCBattleReport
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCBattleReport, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCBattleReport to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCBattleAttackInfo. */
export interface IPB_SCBattleAttackInfo {

    /** PB_SCBattleAttackInfo heroIndex */
    heroIndex?: (number|null);

    /** PB_SCBattleAttackInfo attackerTime */
    attackerTime?: (number|null);

    /** PB_SCBattleAttackInfo damage */
    damage?: (number|null);
}

/** Represents a PB_SCBattleAttackInfo. */
export class PB_SCBattleAttackInfo implements IPB_SCBattleAttackInfo {

    /**
     * Constructs a new PB_SCBattleAttackInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCBattleAttackInfo);

    /** PB_SCBattleAttackInfo heroIndex. */
    public heroIndex: number;

    /** PB_SCBattleAttackInfo attackerTime. */
    public attackerTime: number;

    /** PB_SCBattleAttackInfo damage. */
    public damage: number;

    /**
     * Creates a new PB_SCBattleAttackInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCBattleAttackInfo instance
     */
    public static create(properties?: IPB_SCBattleAttackInfo): PB_SCBattleAttackInfo;

    /**
     * Encodes the specified PB_SCBattleAttackInfo message. Does not implicitly {@link PB_SCBattleAttackInfo.verify|verify} messages.
     * @param message PB_SCBattleAttackInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCBattleAttackInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCBattleAttackInfo message, length delimited. Does not implicitly {@link PB_SCBattleAttackInfo.verify|verify} messages.
     * @param message PB_SCBattleAttackInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCBattleAttackInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCBattleAttackInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCBattleAttackInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCBattleAttackInfo;

    /**
     * Decodes a PB_SCBattleAttackInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCBattleAttackInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCBattleAttackInfo;

    /**
     * Verifies a PB_SCBattleAttackInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCBattleAttackInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCBattleAttackInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCBattleAttackInfo;

    /**
     * Creates a plain object from a PB_SCBattleAttackInfo message. Also converts values to other types if specified.
     * @param message PB_SCBattleAttackInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCBattleAttackInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCBattleAttackInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCBattleMonsterInfo. */
export interface IPB_SCBattleMonsterInfo {

    /** PB_SCBattleMonsterInfo id */
    id?: (number|null);

    /** PB_SCBattleMonsterInfo hp */
    hp?: (number|null);

    /** PB_SCBattleMonsterInfo attackList */
    attackList?: (IPB_SCBattleAttackInfo[]|null);
}

/** Represents a PB_SCBattleMonsterInfo. */
export class PB_SCBattleMonsterInfo implements IPB_SCBattleMonsterInfo {

    /**
     * Constructs a new PB_SCBattleMonsterInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCBattleMonsterInfo);

    /** PB_SCBattleMonsterInfo id. */
    public id: number;

    /** PB_SCBattleMonsterInfo hp. */
    public hp: number;

    /** PB_SCBattleMonsterInfo attackList. */
    public attackList: IPB_SCBattleAttackInfo[];

    /**
     * Creates a new PB_SCBattleMonsterInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCBattleMonsterInfo instance
     */
    public static create(properties?: IPB_SCBattleMonsterInfo): PB_SCBattleMonsterInfo;

    /**
     * Encodes the specified PB_SCBattleMonsterInfo message. Does not implicitly {@link PB_SCBattleMonsterInfo.verify|verify} messages.
     * @param message PB_SCBattleMonsterInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCBattleMonsterInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCBattleMonsterInfo message, length delimited. Does not implicitly {@link PB_SCBattleMonsterInfo.verify|verify} messages.
     * @param message PB_SCBattleMonsterInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCBattleMonsterInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCBattleMonsterInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCBattleMonsterInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCBattleMonsterInfo;

    /**
     * Decodes a PB_SCBattleMonsterInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCBattleMonsterInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCBattleMonsterInfo;

    /**
     * Verifies a PB_SCBattleMonsterInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCBattleMonsterInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCBattleMonsterInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCBattleMonsterInfo;

    /**
     * Creates a plain object from a PB_SCBattleMonsterInfo message. Also converts values to other types if specified.
     * @param message PB_SCBattleMonsterInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCBattleMonsterInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCBattleMonsterInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCBattleMoveNode. */
export interface IPB_SCBattleMoveNode {

    /** PB_SCBattleMoveNode heroIndex */
    heroIndex?: (number|null);

    /** PB_SCBattleMoveNode moveDir */
    moveDir?: (number|null);
}

/** Represents a PB_SCBattleMoveNode. */
export class PB_SCBattleMoveNode implements IPB_SCBattleMoveNode {

    /**
     * Constructs a new PB_SCBattleMoveNode.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCBattleMoveNode);

    /** PB_SCBattleMoveNode heroIndex. */
    public heroIndex: number;

    /** PB_SCBattleMoveNode moveDir. */
    public moveDir: number;

    /**
     * Creates a new PB_SCBattleMoveNode instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCBattleMoveNode instance
     */
    public static create(properties?: IPB_SCBattleMoveNode): PB_SCBattleMoveNode;

    /**
     * Encodes the specified PB_SCBattleMoveNode message. Does not implicitly {@link PB_SCBattleMoveNode.verify|verify} messages.
     * @param message PB_SCBattleMoveNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCBattleMoveNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCBattleMoveNode message, length delimited. Does not implicitly {@link PB_SCBattleMoveNode.verify|verify} messages.
     * @param message PB_SCBattleMoveNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCBattleMoveNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCBattleMoveNode message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCBattleMoveNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCBattleMoveNode;

    /**
     * Decodes a PB_SCBattleMoveNode message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCBattleMoveNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCBattleMoveNode;

    /**
     * Verifies a PB_SCBattleMoveNode message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCBattleMoveNode message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCBattleMoveNode
     */
    public static fromObject(object: { [k: string]: any }): PB_SCBattleMoveNode;

    /**
     * Creates a plain object from a PB_SCBattleMoveNode message. Also converts values to other types if specified.
     * @param message PB_SCBattleMoveNode
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCBattleMoveNode, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCBattleMoveNode to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCBattleHero. */
export interface IPB_SCBattleHero {

    /** PB_SCBattleHero heroId */
    heroId?: (number|null);

    /** PB_SCBattleHero heroLevel */
    heroLevel?: (number|null);

    /** PB_SCBattleHero heroStage */
    heroStage?: (number|null);
}

/** Represents a PB_SCBattleHero. */
export class PB_SCBattleHero implements IPB_SCBattleHero {

    /**
     * Constructs a new PB_SCBattleHero.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCBattleHero);

    /** PB_SCBattleHero heroId. */
    public heroId: number;

    /** PB_SCBattleHero heroLevel. */
    public heroLevel: number;

    /** PB_SCBattleHero heroStage. */
    public heroStage: number;

    /**
     * Creates a new PB_SCBattleHero instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCBattleHero instance
     */
    public static create(properties?: IPB_SCBattleHero): PB_SCBattleHero;

    /**
     * Encodes the specified PB_SCBattleHero message. Does not implicitly {@link PB_SCBattleHero.verify|verify} messages.
     * @param message PB_SCBattleHero message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCBattleHero, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCBattleHero message, length delimited. Does not implicitly {@link PB_SCBattleHero.verify|verify} messages.
     * @param message PB_SCBattleHero message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCBattleHero, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCBattleHero message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCBattleHero
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCBattleHero;

    /**
     * Decodes a PB_SCBattleHero message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCBattleHero
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCBattleHero;

    /**
     * Verifies a PB_SCBattleHero message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCBattleHero message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCBattleHero
     */
    public static fromObject(object: { [k: string]: any }): PB_SCBattleHero;

    /**
     * Creates a plain object from a PB_SCBattleHero message. Also converts values to other types if specified.
     * @param message PB_SCBattleHero
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCBattleHero, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCBattleHero to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCBattleRoundInfo. */
export interface IPB_SCBattleRoundInfo {

    /** PB_SCBattleRoundInfo totalTime */
    totalTime?: (number|null);

    /** PB_SCBattleRoundInfo heroList */
    heroList?: (IPB_SCBattleHero[]|null);

    /** PB_SCBattleRoundInfo monsterList */
    monsterList?: (IPB_SCBattleMonsterInfo[]|null);

    /** PB_SCBattleRoundInfo buffId */
    buffId?: (number[]|null);

    /** PB_SCBattleRoundInfo moveList */
    moveList?: (IPB_SCBattleMoveNode[]|null);

    /** PB_SCBattleRoundInfo comboAddStep */
    comboAddStep?: (number|null);
}

/** Represents a PB_SCBattleRoundInfo. */
export class PB_SCBattleRoundInfo implements IPB_SCBattleRoundInfo {

    /**
     * Constructs a new PB_SCBattleRoundInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCBattleRoundInfo);

    /** PB_SCBattleRoundInfo totalTime. */
    public totalTime: number;

    /** PB_SCBattleRoundInfo heroList. */
    public heroList: IPB_SCBattleHero[];

    /** PB_SCBattleRoundInfo monsterList. */
    public monsterList: IPB_SCBattleMonsterInfo[];

    /** PB_SCBattleRoundInfo buffId. */
    public buffId: number[];

    /** PB_SCBattleRoundInfo moveList. */
    public moveList: IPB_SCBattleMoveNode[];

    /** PB_SCBattleRoundInfo comboAddStep. */
    public comboAddStep: number;

    /**
     * Creates a new PB_SCBattleRoundInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCBattleRoundInfo instance
     */
    public static create(properties?: IPB_SCBattleRoundInfo): PB_SCBattleRoundInfo;

    /**
     * Encodes the specified PB_SCBattleRoundInfo message. Does not implicitly {@link PB_SCBattleRoundInfo.verify|verify} messages.
     * @param message PB_SCBattleRoundInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCBattleRoundInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCBattleRoundInfo message, length delimited. Does not implicitly {@link PB_SCBattleRoundInfo.verify|verify} messages.
     * @param message PB_SCBattleRoundInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCBattleRoundInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCBattleRoundInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCBattleRoundInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCBattleRoundInfo;

    /**
     * Decodes a PB_SCBattleRoundInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCBattleRoundInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCBattleRoundInfo;

    /**
     * Verifies a PB_SCBattleRoundInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCBattleRoundInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCBattleRoundInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCBattleRoundInfo;

    /**
     * Creates a plain object from a PB_SCBattleRoundInfo message. Also converts values to other types if specified.
     * @param message PB_SCBattleRoundInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCBattleRoundInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCBattleRoundInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSDailyTaskReq. */
export interface IPB_CSDailyTaskReq {

    /** PB_CSDailyTaskReq reqType */
    reqType?: (number|null);

    /** PB_CSDailyTaskReq p1 */
    p1?: (number|null);
}

/** Represents a PB_CSDailyTaskReq. */
export class PB_CSDailyTaskReq implements IPB_CSDailyTaskReq {

    /**
     * Constructs a new PB_CSDailyTaskReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSDailyTaskReq);

    /** PB_CSDailyTaskReq reqType. */
    public reqType: number;

    /** PB_CSDailyTaskReq p1. */
    public p1: number;

    /**
     * Creates a new PB_CSDailyTaskReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSDailyTaskReq instance
     */
    public static create(properties?: IPB_CSDailyTaskReq): PB_CSDailyTaskReq;

    /**
     * Encodes the specified PB_CSDailyTaskReq message. Does not implicitly {@link PB_CSDailyTaskReq.verify|verify} messages.
     * @param message PB_CSDailyTaskReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSDailyTaskReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSDailyTaskReq message, length delimited. Does not implicitly {@link PB_CSDailyTaskReq.verify|verify} messages.
     * @param message PB_CSDailyTaskReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSDailyTaskReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSDailyTaskReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSDailyTaskReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSDailyTaskReq;

    /**
     * Decodes a PB_CSDailyTaskReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSDailyTaskReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSDailyTaskReq;

    /**
     * Verifies a PB_CSDailyTaskReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSDailyTaskReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSDailyTaskReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSDailyTaskReq;

    /**
     * Creates a plain object from a PB_CSDailyTaskReq message. Also converts values to other types if specified.
     * @param message PB_CSDailyTaskReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSDailyTaskReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSDailyTaskReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_DailyTaskInfo. */
export interface IPB_DailyTaskInfo {

    /** PB_DailyTaskInfo taskId */
    taskId?: (number|null);

    /** PB_DailyTaskInfo num */
    num?: (number|null);

    /** PB_DailyTaskInfo isFetch */
    isFetch?: (number|null);
}

/** Represents a PB_DailyTaskInfo. */
export class PB_DailyTaskInfo implements IPB_DailyTaskInfo {

    /**
     * Constructs a new PB_DailyTaskInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_DailyTaskInfo);

    /** PB_DailyTaskInfo taskId. */
    public taskId: number;

    /** PB_DailyTaskInfo num. */
    public num: number;

    /** PB_DailyTaskInfo isFetch. */
    public isFetch: number;

    /**
     * Creates a new PB_DailyTaskInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_DailyTaskInfo instance
     */
    public static create(properties?: IPB_DailyTaskInfo): PB_DailyTaskInfo;

    /**
     * Encodes the specified PB_DailyTaskInfo message. Does not implicitly {@link PB_DailyTaskInfo.verify|verify} messages.
     * @param message PB_DailyTaskInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_DailyTaskInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_DailyTaskInfo message, length delimited. Does not implicitly {@link PB_DailyTaskInfo.verify|verify} messages.
     * @param message PB_DailyTaskInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_DailyTaskInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_DailyTaskInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_DailyTaskInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_DailyTaskInfo;

    /**
     * Decodes a PB_DailyTaskInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_DailyTaskInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_DailyTaskInfo;

    /**
     * Verifies a PB_DailyTaskInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_DailyTaskInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_DailyTaskInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_DailyTaskInfo;

    /**
     * Creates a plain object from a PB_DailyTaskInfo message. Also converts values to other types if specified.
     * @param message PB_DailyTaskInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_DailyTaskInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_DailyTaskInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCDailyTaskInfo. */
export interface IPB_SCDailyTaskInfo {

    /** PB_SCDailyTaskInfo taskList */
    taskList?: (IPB_DailyTaskInfo[]|null);

    /** PB_SCDailyTaskInfo adNum */
    adNum?: (number|null);

    /** PB_SCDailyTaskInfo taskNum */
    taskNum?: (number|null);
}

/** Represents a PB_SCDailyTaskInfo. */
export class PB_SCDailyTaskInfo implements IPB_SCDailyTaskInfo {

    /**
     * Constructs a new PB_SCDailyTaskInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCDailyTaskInfo);

    /** PB_SCDailyTaskInfo taskList. */
    public taskList: IPB_DailyTaskInfo[];

    /** PB_SCDailyTaskInfo adNum. */
    public adNum: number;

    /** PB_SCDailyTaskInfo taskNum. */
    public taskNum: number;

    /**
     * Creates a new PB_SCDailyTaskInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCDailyTaskInfo instance
     */
    public static create(properties?: IPB_SCDailyTaskInfo): PB_SCDailyTaskInfo;

    /**
     * Encodes the specified PB_SCDailyTaskInfo message. Does not implicitly {@link PB_SCDailyTaskInfo.verify|verify} messages.
     * @param message PB_SCDailyTaskInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCDailyTaskInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCDailyTaskInfo message, length delimited. Does not implicitly {@link PB_SCDailyTaskInfo.verify|verify} messages.
     * @param message PB_SCDailyTaskInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCDailyTaskInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCDailyTaskInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCDailyTaskInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCDailyTaskInfo;

    /**
     * Decodes a PB_SCDailyTaskInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCDailyTaskInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCDailyTaskInfo;

    /**
     * Verifies a PB_SCDailyTaskInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCDailyTaskInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCDailyTaskInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCDailyTaskInfo;

    /**
     * Creates a plain object from a PB_SCDailyTaskInfo message. Also converts values to other types if specified.
     * @param message PB_SCDailyTaskInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCDailyTaskInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCDailyTaskInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCServerBusy. */
export interface IPB_SCServerBusy {

    /** PB_SCServerBusy reserve */
    reserve?: (number|null);
}

/** Represents a PB_SCServerBusy. */
export class PB_SCServerBusy implements IPB_SCServerBusy {

    /**
     * Constructs a new PB_SCServerBusy.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCServerBusy);

    /** PB_SCServerBusy reserve. */
    public reserve: number;

    /**
     * Creates a new PB_SCServerBusy instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCServerBusy instance
     */
    public static create(properties?: IPB_SCServerBusy): PB_SCServerBusy;

    /**
     * Encodes the specified PB_SCServerBusy message. Does not implicitly {@link PB_SCServerBusy.verify|verify} messages.
     * @param message PB_SCServerBusy message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCServerBusy, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCServerBusy message, length delimited. Does not implicitly {@link PB_SCServerBusy.verify|verify} messages.
     * @param message PB_SCServerBusy message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCServerBusy, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCServerBusy message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCServerBusy
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCServerBusy;

    /**
     * Decodes a PB_SCServerBusy message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCServerBusy
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCServerBusy;

    /**
     * Verifies a PB_SCServerBusy message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCServerBusy message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCServerBusy
     */
    public static fromObject(object: { [k: string]: any }): PB_SCServerBusy;

    /**
     * Creates a plain object from a PB_SCServerBusy message. Also converts values to other types if specified.
     * @param message PB_SCServerBusy
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCServerBusy, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCServerBusy to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCUserEnterGSAck. */
export interface IPB_SCUserEnterGSAck {

    /** PB_SCUserEnterGSAck result */
    result?: (number|null);

    /** PB_SCUserEnterGSAck isInCross */
    isInCross?: (number|null);
}

/** Represents a PB_SCUserEnterGSAck. */
export class PB_SCUserEnterGSAck implements IPB_SCUserEnterGSAck {

    /**
     * Constructs a new PB_SCUserEnterGSAck.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCUserEnterGSAck);

    /** PB_SCUserEnterGSAck result. */
    public result: number;

    /** PB_SCUserEnterGSAck isInCross. */
    public isInCross: number;

    /**
     * Creates a new PB_SCUserEnterGSAck instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCUserEnterGSAck instance
     */
    public static create(properties?: IPB_SCUserEnterGSAck): PB_SCUserEnterGSAck;

    /**
     * Encodes the specified PB_SCUserEnterGSAck message. Does not implicitly {@link PB_SCUserEnterGSAck.verify|verify} messages.
     * @param message PB_SCUserEnterGSAck message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCUserEnterGSAck, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCUserEnterGSAck message, length delimited. Does not implicitly {@link PB_SCUserEnterGSAck.verify|verify} messages.
     * @param message PB_SCUserEnterGSAck message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCUserEnterGSAck, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCUserEnterGSAck message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCUserEnterGSAck
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCUserEnterGSAck;

    /**
     * Decodes a PB_SCUserEnterGSAck message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCUserEnterGSAck
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCUserEnterGSAck;

    /**
     * Verifies a PB_SCUserEnterGSAck message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCUserEnterGSAck message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCUserEnterGSAck
     */
    public static fromObject(object: { [k: string]: any }): PB_SCUserEnterGSAck;

    /**
     * Creates a plain object from a PB_SCUserEnterGSAck message. Also converts values to other types if specified.
     * @param message PB_SCUserEnterGSAck
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCUserEnterGSAck, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCUserEnterGSAck to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSUserLogout. */
export interface IPB_CSUserLogout {

    /** PB_CSUserLogout reserve */
    reserve?: (number|null);
}

/** Represents a PB_CSUserLogout. */
export class PB_CSUserLogout implements IPB_CSUserLogout {

    /**
     * Constructs a new PB_CSUserLogout.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSUserLogout);

    /** PB_CSUserLogout reserve. */
    public reserve: number;

    /**
     * Creates a new PB_CSUserLogout instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSUserLogout instance
     */
    public static create(properties?: IPB_CSUserLogout): PB_CSUserLogout;

    /**
     * Encodes the specified PB_CSUserLogout message. Does not implicitly {@link PB_CSUserLogout.verify|verify} messages.
     * @param message PB_CSUserLogout message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSUserLogout, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSUserLogout message, length delimited. Does not implicitly {@link PB_CSUserLogout.verify|verify} messages.
     * @param message PB_CSUserLogout message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSUserLogout, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSUserLogout message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSUserLogout
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSUserLogout;

    /**
     * Decodes a PB_CSUserLogout message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSUserLogout
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSUserLogout;

    /**
     * Verifies a PB_CSUserLogout message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSUserLogout message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSUserLogout
     */
    public static fromObject(object: { [k: string]: any }): PB_CSUserLogout;

    /**
     * Creates a plain object from a PB_CSUserLogout message. Also converts values to other types if specified.
     * @param message PB_CSUserLogout
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSUserLogout, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSUserLogout to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSGMCommand. */
export interface IPB_CSGMCommand {

    /** PB_CSGMCommand type */
    type?: (Uint8Array|null);

    /** PB_CSGMCommand command */
    command?: (Uint8Array|null);
}

/** Represents a PB_CSGMCommand. */
export class PB_CSGMCommand implements IPB_CSGMCommand {

    /**
     * Constructs a new PB_CSGMCommand.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSGMCommand);

    /** PB_CSGMCommand type. */
    public type: Uint8Array;

    /** PB_CSGMCommand command. */
    public command: Uint8Array;

    /**
     * Creates a new PB_CSGMCommand instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSGMCommand instance
     */
    public static create(properties?: IPB_CSGMCommand): PB_CSGMCommand;

    /**
     * Encodes the specified PB_CSGMCommand message. Does not implicitly {@link PB_CSGMCommand.verify|verify} messages.
     * @param message PB_CSGMCommand message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSGMCommand, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSGMCommand message, length delimited. Does not implicitly {@link PB_CSGMCommand.verify|verify} messages.
     * @param message PB_CSGMCommand message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSGMCommand, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSGMCommand message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSGMCommand
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSGMCommand;

    /**
     * Decodes a PB_CSGMCommand message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSGMCommand
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSGMCommand;

    /**
     * Verifies a PB_CSGMCommand message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSGMCommand message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSGMCommand
     */
    public static fromObject(object: { [k: string]: any }): PB_CSGMCommand;

    /**
     * Creates a plain object from a PB_CSGMCommand message. Also converts values to other types if specified.
     * @param message PB_CSGMCommand
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSGMCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSGMCommand to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCGMCommand. */
export interface IPB_SCGMCommand {

    /** PB_SCGMCommand type */
    type?: (Uint8Array|null);

    /** PB_SCGMCommand result */
    result?: (Uint8Array|null);
}

/** Represents a PB_SCGMCommand. */
export class PB_SCGMCommand implements IPB_SCGMCommand {

    /**
     * Constructs a new PB_SCGMCommand.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCGMCommand);

    /** PB_SCGMCommand type. */
    public type: Uint8Array;

    /** PB_SCGMCommand result. */
    public result: Uint8Array;

    /**
     * Creates a new PB_SCGMCommand instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCGMCommand instance
     */
    public static create(properties?: IPB_SCGMCommand): PB_SCGMCommand;

    /**
     * Encodes the specified PB_SCGMCommand message. Does not implicitly {@link PB_SCGMCommand.verify|verify} messages.
     * @param message PB_SCGMCommand message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCGMCommand, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCGMCommand message, length delimited. Does not implicitly {@link PB_SCGMCommand.verify|verify} messages.
     * @param message PB_SCGMCommand message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCGMCommand, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCGMCommand message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCGMCommand
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCGMCommand;

    /**
     * Decodes a PB_SCGMCommand message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCGMCommand
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCGMCommand;

    /**
     * Verifies a PB_SCGMCommand message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCGMCommand message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCGMCommand
     */
    public static fromObject(object: { [k: string]: any }): PB_SCGMCommand;

    /**
     * Creates a plain object from a PB_SCGMCommand message. Also converts values to other types if specified.
     * @param message PB_SCGMCommand
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCGMCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCGMCommand to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSGrowthFundReq. */
export interface IPB_CSGrowthFundReq {

    /** PB_CSGrowthFundReq reqType */
    reqType?: (number|null);

    /** PB_CSGrowthFundReq p1 */
    p1?: (number|null);

    /** PB_CSGrowthFundReq p2 */
    p2?: (number|null);
}

/** Represents a PB_CSGrowthFundReq. */
export class PB_CSGrowthFundReq implements IPB_CSGrowthFundReq {

    /**
     * Constructs a new PB_CSGrowthFundReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSGrowthFundReq);

    /** PB_CSGrowthFundReq reqType. */
    public reqType: number;

    /** PB_CSGrowthFundReq p1. */
    public p1: number;

    /** PB_CSGrowthFundReq p2. */
    public p2: number;

    /**
     * Creates a new PB_CSGrowthFundReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSGrowthFundReq instance
     */
    public static create(properties?: IPB_CSGrowthFundReq): PB_CSGrowthFundReq;

    /**
     * Encodes the specified PB_CSGrowthFundReq message. Does not implicitly {@link PB_CSGrowthFundReq.verify|verify} messages.
     * @param message PB_CSGrowthFundReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSGrowthFundReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSGrowthFundReq message, length delimited. Does not implicitly {@link PB_CSGrowthFundReq.verify|verify} messages.
     * @param message PB_CSGrowthFundReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSGrowthFundReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSGrowthFundReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSGrowthFundReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSGrowthFundReq;

    /**
     * Decodes a PB_CSGrowthFundReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSGrowthFundReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSGrowthFundReq;

    /**
     * Verifies a PB_CSGrowthFundReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSGrowthFundReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSGrowthFundReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSGrowthFundReq;

    /**
     * Creates a plain object from a PB_CSGrowthFundReq message. Also converts values to other types if specified.
     * @param message PB_CSGrowthFundReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSGrowthFundReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSGrowthFundReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCGrowthFundInfo. */
export interface IPB_SCGrowthFundInfo {

    /** PB_SCGrowthFundInfo activeFlag */
    activeFlag?: (number|null);

    /** PB_SCGrowthFundInfo fetchFlag */
    fetchFlag?: (number[]|null);
}

/** Represents a PB_SCGrowthFundInfo. */
export class PB_SCGrowthFundInfo implements IPB_SCGrowthFundInfo {

    /**
     * Constructs a new PB_SCGrowthFundInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCGrowthFundInfo);

    /** PB_SCGrowthFundInfo activeFlag. */
    public activeFlag: number;

    /** PB_SCGrowthFundInfo fetchFlag. */
    public fetchFlag: number[];

    /**
     * Creates a new PB_SCGrowthFundInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCGrowthFundInfo instance
     */
    public static create(properties?: IPB_SCGrowthFundInfo): PB_SCGrowthFundInfo;

    /**
     * Encodes the specified PB_SCGrowthFundInfo message. Does not implicitly {@link PB_SCGrowthFundInfo.verify|verify} messages.
     * @param message PB_SCGrowthFundInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCGrowthFundInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCGrowthFundInfo message, length delimited. Does not implicitly {@link PB_SCGrowthFundInfo.verify|verify} messages.
     * @param message PB_SCGrowthFundInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCGrowthFundInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCGrowthFundInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCGrowthFundInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCGrowthFundInfo;

    /**
     * Decodes a PB_SCGrowthFundInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCGrowthFundInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCGrowthFundInfo;

    /**
     * Verifies a PB_SCGrowthFundInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCGrowthFundInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCGrowthFundInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCGrowthFundInfo;

    /**
     * Creates a plain object from a PB_SCGrowthFundInfo message. Also converts values to other types if specified.
     * @param message PB_SCGrowthFundInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCGrowthFundInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCGrowthFundInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSHeroReq. */
export interface IPB_CSHeroReq {

    /** PB_CSHeroReq reqType */
    reqType?: (number|null);

    /** PB_CSHeroReq paramList */
    paramList?: (number[]|null);
}

/** Represents a PB_CSHeroReq. */
export class PB_CSHeroReq implements IPB_CSHeroReq {

    /**
     * Constructs a new PB_CSHeroReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSHeroReq);

    /** PB_CSHeroReq reqType. */
    public reqType: number;

    /** PB_CSHeroReq paramList. */
    public paramList: number[];

    /**
     * Creates a new PB_CSHeroReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSHeroReq instance
     */
    public static create(properties?: IPB_CSHeroReq): PB_CSHeroReq;

    /**
     * Encodes the specified PB_CSHeroReq message. Does not implicitly {@link PB_CSHeroReq.verify|verify} messages.
     * @param message PB_CSHeroReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSHeroReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSHeroReq message, length delimited. Does not implicitly {@link PB_CSHeroReq.verify|verify} messages.
     * @param message PB_CSHeroReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSHeroReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSHeroReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSHeroReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSHeroReq;

    /**
     * Decodes a PB_CSHeroReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSHeroReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSHeroReq;

    /**
     * Verifies a PB_CSHeroReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSHeroReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSHeroReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSHeroReq;

    /**
     * Creates a plain object from a PB_CSHeroReq message. Also converts values to other types if specified.
     * @param message PB_CSHeroReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSHeroReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSHeroReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_HeroNode. */
export interface IPB_HeroNode {

    /** PB_HeroNode heroId */
    heroId?: (number|null);

    /** PB_HeroNode heroLevel */
    heroLevel?: (number|null);

    /** PB_HeroNode geneId */
    geneId?: (number[]|null);

    /** PB_HeroNode raLtEnergy */
    raLtEnergy?: (number|null);

    /** PB_HeroNode horcruxesLevel */
    horcruxesLevel?: (number|null);

    /** PB_HeroNode horcruxesSteps */
    horcruxesSteps?: (number|null);
}

/** Represents a PB_HeroNode. */
export class PB_HeroNode implements IPB_HeroNode {

    /**
     * Constructs a new PB_HeroNode.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_HeroNode);

    /** PB_HeroNode heroId. */
    public heroId: number;

    /** PB_HeroNode heroLevel. */
    public heroLevel: number;

    /** PB_HeroNode geneId. */
    public geneId: number[];

    /** PB_HeroNode raLtEnergy. */
    public raLtEnergy: number;

    /** PB_HeroNode horcruxesLevel. */
    public horcruxesLevel: number;

    /** PB_HeroNode horcruxesSteps. */
    public horcruxesSteps: number;

    /**
     * Creates a new PB_HeroNode instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_HeroNode instance
     */
    public static create(properties?: IPB_HeroNode): PB_HeroNode;

    /**
     * Encodes the specified PB_HeroNode message. Does not implicitly {@link PB_HeroNode.verify|verify} messages.
     * @param message PB_HeroNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_HeroNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_HeroNode message, length delimited. Does not implicitly {@link PB_HeroNode.verify|verify} messages.
     * @param message PB_HeroNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_HeroNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_HeroNode message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_HeroNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_HeroNode;

    /**
     * Decodes a PB_HeroNode message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_HeroNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_HeroNode;

    /**
     * Verifies a PB_HeroNode message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_HeroNode message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_HeroNode
     */
    public static fromObject(object: { [k: string]: any }): PB_HeroNode;

    /**
     * Creates a plain object from a PB_HeroNode message. Also converts values to other types if specified.
     * @param message PB_HeroNode
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_HeroNode, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_HeroNode to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCHeroInfo. */
export interface IPB_SCHeroInfo {

    /** PB_SCHeroInfo sendType */
    sendType?: (number|null);

    /** PB_SCHeroInfo heroList */
    heroList?: (IPB_HeroNode[]|null);
}

/** Represents a PB_SCHeroInfo. */
export class PB_SCHeroInfo implements IPB_SCHeroInfo {

    /**
     * Constructs a new PB_SCHeroInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCHeroInfo);

    /** PB_SCHeroInfo sendType. */
    public sendType: number;

    /** PB_SCHeroInfo heroList. */
    public heroList: IPB_HeroNode[];

    /**
     * Creates a new PB_SCHeroInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCHeroInfo instance
     */
    public static create(properties?: IPB_SCHeroInfo): PB_SCHeroInfo;

    /**
     * Encodes the specified PB_SCHeroInfo message. Does not implicitly {@link PB_SCHeroInfo.verify|verify} messages.
     * @param message PB_SCHeroInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCHeroInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCHeroInfo message, length delimited. Does not implicitly {@link PB_SCHeroInfo.verify|verify} messages.
     * @param message PB_SCHeroInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCHeroInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCHeroInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCHeroInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCHeroInfo;

    /**
     * Decodes a PB_SCHeroInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCHeroInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCHeroInfo;

    /**
     * Verifies a PB_SCHeroInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCHeroInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCHeroInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCHeroInfo;

    /**
     * Creates a plain object from a PB_SCHeroInfo message. Also converts values to other types if specified.
     * @param message PB_SCHeroInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCHeroInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCHeroInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_GeneNode. */
export interface IPB_GeneNode {

    /** PB_GeneNode geneIndex */
    geneIndex?: (number|null);

    /** PB_GeneNode geneId */
    geneId?: (number|null);

    /** PB_GeneNode randAttr */
    randAttr?: (number|null);
}

/** Represents a PB_GeneNode. */
export class PB_GeneNode implements IPB_GeneNode {

    /**
     * Constructs a new PB_GeneNode.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_GeneNode);

    /** PB_GeneNode geneIndex. */
    public geneIndex: number;

    /** PB_GeneNode geneId. */
    public geneId: number;

    /** PB_GeneNode randAttr. */
    public randAttr: number;

    /**
     * Creates a new PB_GeneNode instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_GeneNode instance
     */
    public static create(properties?: IPB_GeneNode): PB_GeneNode;

    /**
     * Encodes the specified PB_GeneNode message. Does not implicitly {@link PB_GeneNode.verify|verify} messages.
     * @param message PB_GeneNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_GeneNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_GeneNode message, length delimited. Does not implicitly {@link PB_GeneNode.verify|verify} messages.
     * @param message PB_GeneNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_GeneNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_GeneNode message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_GeneNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_GeneNode;

    /**
     * Decodes a PB_GeneNode message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_GeneNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_GeneNode;

    /**
     * Verifies a PB_GeneNode message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_GeneNode message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_GeneNode
     */
    public static fromObject(object: { [k: string]: any }): PB_GeneNode;

    /**
     * Creates a plain object from a PB_GeneNode message. Also converts values to other types if specified.
     * @param message PB_GeneNode
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_GeneNode, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_GeneNode to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCGeneInfo. */
export interface IPB_SCGeneInfo {

    /** PB_SCGeneInfo sendType */
    sendType?: (number|null);

    /** PB_SCGeneInfo geneList */
    geneList?: (IPB_GeneNode[]|null);
}

/** Represents a PB_SCGeneInfo. */
export class PB_SCGeneInfo implements IPB_SCGeneInfo {

    /**
     * Constructs a new PB_SCGeneInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCGeneInfo);

    /** PB_SCGeneInfo sendType. */
    public sendType: number;

    /** PB_SCGeneInfo geneList. */
    public geneList: IPB_GeneNode[];

    /**
     * Creates a new PB_SCGeneInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCGeneInfo instance
     */
    public static create(properties?: IPB_SCGeneInfo): PB_SCGeneInfo;

    /**
     * Encodes the specified PB_SCGeneInfo message. Does not implicitly {@link PB_SCGeneInfo.verify|verify} messages.
     * @param message PB_SCGeneInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCGeneInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCGeneInfo message, length delimited. Does not implicitly {@link PB_SCGeneInfo.verify|verify} messages.
     * @param message PB_SCGeneInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCGeneInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCGeneInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCGeneInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCGeneInfo;

    /**
     * Decodes a PB_SCGeneInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCGeneInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCGeneInfo;

    /**
     * Verifies a PB_SCGeneInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCGeneInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCGeneInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCGeneInfo;

    /**
     * Creates a plain object from a PB_SCGeneInfo message. Also converts values to other types if specified.
     * @param message PB_SCGeneInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCGeneInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCGeneInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCTodayGainInfo. */
export interface IPB_SCTodayGainInfo {

    /** PB_SCTodayGainInfo seq */
    seq?: (number|null);

    /** PB_SCTodayGainInfo param */
    param?: (number[]|null);
}

/** Represents a PB_SCTodayGainInfo. */
export class PB_SCTodayGainInfo implements IPB_SCTodayGainInfo {

    /**
     * Constructs a new PB_SCTodayGainInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCTodayGainInfo);

    /** PB_SCTodayGainInfo seq. */
    public seq: number;

    /** PB_SCTodayGainInfo param. */
    public param: number[];

    /**
     * Creates a new PB_SCTodayGainInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCTodayGainInfo instance
     */
    public static create(properties?: IPB_SCTodayGainInfo): PB_SCTodayGainInfo;

    /**
     * Encodes the specified PB_SCTodayGainInfo message. Does not implicitly {@link PB_SCTodayGainInfo.verify|verify} messages.
     * @param message PB_SCTodayGainInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCTodayGainInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCTodayGainInfo message, length delimited. Does not implicitly {@link PB_SCTodayGainInfo.verify|verify} messages.
     * @param message PB_SCTodayGainInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCTodayGainInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCTodayGainInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCTodayGainInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCTodayGainInfo;

    /**
     * Decodes a PB_SCTodayGainInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCTodayGainInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCTodayGainInfo;

    /**
     * Verifies a PB_SCTodayGainInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCTodayGainInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCTodayGainInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCTodayGainInfo;

    /**
     * Creates a plain object from a PB_SCTodayGainInfo message. Also converts values to other types if specified.
     * @param message PB_SCTodayGainInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCTodayGainInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCTodayGainInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCGeneTaskInfo. */
export interface IPB_SCGeneTaskInfo {

    /** PB_SCGeneTaskInfo taskProgress */
    taskProgress?: (number[]|null);

    /** PB_SCGeneTaskInfo isFetch */
    isFetch?: (boolean[]|null);
}

/** Represents a PB_SCGeneTaskInfo. */
export class PB_SCGeneTaskInfo implements IPB_SCGeneTaskInfo {

    /**
     * Constructs a new PB_SCGeneTaskInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCGeneTaskInfo);

    /** PB_SCGeneTaskInfo taskProgress. */
    public taskProgress: number[];

    /** PB_SCGeneTaskInfo isFetch. */
    public isFetch: boolean[];

    /**
     * Creates a new PB_SCGeneTaskInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCGeneTaskInfo instance
     */
    public static create(properties?: IPB_SCGeneTaskInfo): PB_SCGeneTaskInfo;

    /**
     * Encodes the specified PB_SCGeneTaskInfo message. Does not implicitly {@link PB_SCGeneTaskInfo.verify|verify} messages.
     * @param message PB_SCGeneTaskInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCGeneTaskInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCGeneTaskInfo message, length delimited. Does not implicitly {@link PB_SCGeneTaskInfo.verify|verify} messages.
     * @param message PB_SCGeneTaskInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCGeneTaskInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCGeneTaskInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCGeneTaskInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCGeneTaskInfo;

    /**
     * Decodes a PB_SCGeneTaskInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCGeneTaskInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCGeneTaskInfo;

    /**
     * Verifies a PB_SCGeneTaskInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCGeneTaskInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCGeneTaskInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCGeneTaskInfo;

    /**
     * Creates a plain object from a PB_SCGeneTaskInfo message. Also converts values to other types if specified.
     * @param message PB_SCGeneTaskInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCGeneTaskInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCGeneTaskInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSKnapsackReq. */
export interface IPB_CSKnapsackReq {

    /** PB_CSKnapsackReq reqType */
    reqType?: (number|null);

    /** PB_CSKnapsackReq param */
    param?: (number[]|null);
}

/** Represents a PB_CSKnapsackReq. */
export class PB_CSKnapsackReq implements IPB_CSKnapsackReq {

    /**
     * Constructs a new PB_CSKnapsackReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSKnapsackReq);

    /** PB_CSKnapsackReq reqType. */
    public reqType: number;

    /** PB_CSKnapsackReq param. */
    public param: number[];

    /**
     * Creates a new PB_CSKnapsackReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSKnapsackReq instance
     */
    public static create(properties?: IPB_CSKnapsackReq): PB_CSKnapsackReq;

    /**
     * Encodes the specified PB_CSKnapsackReq message. Does not implicitly {@link PB_CSKnapsackReq.verify|verify} messages.
     * @param message PB_CSKnapsackReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSKnapsackReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSKnapsackReq message, length delimited. Does not implicitly {@link PB_CSKnapsackReq.verify|verify} messages.
     * @param message PB_CSKnapsackReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSKnapsackReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSKnapsackReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSKnapsackReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSKnapsackReq;

    /**
     * Decodes a PB_CSKnapsackReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSKnapsackReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSKnapsackReq;

    /**
     * Verifies a PB_CSKnapsackReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSKnapsackReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSKnapsackReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSKnapsackReq;

    /**
     * Creates a plain object from a PB_CSKnapsackReq message. Also converts values to other types if specified.
     * @param message PB_CSKnapsackReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSKnapsackReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSKnapsackReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_ItemData. */
export interface IPB_ItemData {

    /** PB_ItemData itemId */
    itemId?: (number|null);

    /** PB_ItemData num */
    num?: (number|Long|null);
}

/** Represents a PB_ItemData. */
export class PB_ItemData implements IPB_ItemData {

    /**
     * Constructs a new PB_ItemData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_ItemData);

    /** PB_ItemData itemId. */
    public itemId: number;

    /** PB_ItemData num. */
    public num: (number|Long);

    /**
     * Creates a new PB_ItemData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_ItemData instance
     */
    public static create(properties?: IPB_ItemData): PB_ItemData;

    /**
     * Encodes the specified PB_ItemData message. Does not implicitly {@link PB_ItemData.verify|verify} messages.
     * @param message PB_ItemData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_ItemData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_ItemData message, length delimited. Does not implicitly {@link PB_ItemData.verify|verify} messages.
     * @param message PB_ItemData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_ItemData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_ItemData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_ItemData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_ItemData;

    /**
     * Decodes a PB_ItemData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_ItemData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_ItemData;

    /**
     * Verifies a PB_ItemData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_ItemData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_ItemData
     */
    public static fromObject(object: { [k: string]: any }): PB_ItemData;

    /**
     * Creates a plain object from a PB_ItemData message. Also converts values to other types if specified.
     * @param message PB_ItemData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_ItemData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_ItemData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSBuyCmdReq. */
export interface IPB_CSBuyCmdReq {

    /** PB_CSBuyCmdReq num */
    num?: (number|null);

    /** PB_CSBuyCmdReq buyMoney */
    buyMoney?: (number|null);

    /** PB_CSBuyCmdReq addPayGold */
    addPayGold?: (number|null);

    /** PB_CSBuyCmdReq buyType */
    buyType?: (number|null);

    /** PB_CSBuyCmdReq buyParam_1 */
    buyParam_1?: (number|null);

    /** PB_CSBuyCmdReq buyParam_2 */
    buyParam_2?: (number|null);
}

/** Represents a PB_CSBuyCmdReq. */
export class PB_CSBuyCmdReq implements IPB_CSBuyCmdReq {

    /**
     * Constructs a new PB_CSBuyCmdReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSBuyCmdReq);

    /** PB_CSBuyCmdReq num. */
    public num: number;

    /** PB_CSBuyCmdReq buyMoney. */
    public buyMoney: number;

    /** PB_CSBuyCmdReq addPayGold. */
    public addPayGold: number;

    /** PB_CSBuyCmdReq buyType. */
    public buyType: number;

    /** PB_CSBuyCmdReq buyParam_1. */
    public buyParam_1: number;

    /** PB_CSBuyCmdReq buyParam_2. */
    public buyParam_2: number;

    /**
     * Creates a new PB_CSBuyCmdReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSBuyCmdReq instance
     */
    public static create(properties?: IPB_CSBuyCmdReq): PB_CSBuyCmdReq;

    /**
     * Encodes the specified PB_CSBuyCmdReq message. Does not implicitly {@link PB_CSBuyCmdReq.verify|verify} messages.
     * @param message PB_CSBuyCmdReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSBuyCmdReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSBuyCmdReq message, length delimited. Does not implicitly {@link PB_CSBuyCmdReq.verify|verify} messages.
     * @param message PB_CSBuyCmdReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSBuyCmdReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSBuyCmdReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSBuyCmdReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSBuyCmdReq;

    /**
     * Decodes a PB_CSBuyCmdReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSBuyCmdReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSBuyCmdReq;

    /**
     * Verifies a PB_CSBuyCmdReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSBuyCmdReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSBuyCmdReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSBuyCmdReq;

    /**
     * Creates a plain object from a PB_CSBuyCmdReq message. Also converts values to other types if specified.
     * @param message PB_CSBuyCmdReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSBuyCmdReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSBuyCmdReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCItemNotEnoughNotice. */
export interface IPB_SCItemNotEnoughNotice {

    /** PB_SCItemNotEnoughNotice itemId */
    itemId?: (number|null);
}

/** Represents a PB_SCItemNotEnoughNotice. */
export class PB_SCItemNotEnoughNotice implements IPB_SCItemNotEnoughNotice {

    /**
     * Constructs a new PB_SCItemNotEnoughNotice.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCItemNotEnoughNotice);

    /** PB_SCItemNotEnoughNotice itemId. */
    public itemId: number;

    /**
     * Creates a new PB_SCItemNotEnoughNotice instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCItemNotEnoughNotice instance
     */
    public static create(properties?: IPB_SCItemNotEnoughNotice): PB_SCItemNotEnoughNotice;

    /**
     * Encodes the specified PB_SCItemNotEnoughNotice message. Does not implicitly {@link PB_SCItemNotEnoughNotice.verify|verify} messages.
     * @param message PB_SCItemNotEnoughNotice message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCItemNotEnoughNotice, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCItemNotEnoughNotice message, length delimited. Does not implicitly {@link PB_SCItemNotEnoughNotice.verify|verify} messages.
     * @param message PB_SCItemNotEnoughNotice message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCItemNotEnoughNotice, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCItemNotEnoughNotice message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCItemNotEnoughNotice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCItemNotEnoughNotice;

    /**
     * Decodes a PB_SCItemNotEnoughNotice message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCItemNotEnoughNotice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCItemNotEnoughNotice;

    /**
     * Verifies a PB_SCItemNotEnoughNotice message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCItemNotEnoughNotice message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCItemNotEnoughNotice
     */
    public static fromObject(object: { [k: string]: any }): PB_SCItemNotEnoughNotice;

    /**
     * Creates a plain object from a PB_SCItemNotEnoughNotice message. Also converts values to other types if specified.
     * @param message PB_SCItemNotEnoughNotice
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCItemNotEnoughNotice, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCItemNotEnoughNotice to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCKnapsackAllInfo. */
export interface IPB_SCKnapsackAllInfo {

    /** PB_SCKnapsackAllInfo itemList */
    itemList?: (IPB_ItemData[]|null);
}

/** Represents a PB_SCKnapsackAllInfo. */
export class PB_SCKnapsackAllInfo implements IPB_SCKnapsackAllInfo {

    /**
     * Constructs a new PB_SCKnapsackAllInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCKnapsackAllInfo);

    /** PB_SCKnapsackAllInfo itemList. */
    public itemList: IPB_ItemData[];

    /**
     * Creates a new PB_SCKnapsackAllInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCKnapsackAllInfo instance
     */
    public static create(properties?: IPB_SCKnapsackAllInfo): PB_SCKnapsackAllInfo;

    /**
     * Encodes the specified PB_SCKnapsackAllInfo message. Does not implicitly {@link PB_SCKnapsackAllInfo.verify|verify} messages.
     * @param message PB_SCKnapsackAllInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCKnapsackAllInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCKnapsackAllInfo message, length delimited. Does not implicitly {@link PB_SCKnapsackAllInfo.verify|verify} messages.
     * @param message PB_SCKnapsackAllInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCKnapsackAllInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCKnapsackAllInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCKnapsackAllInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCKnapsackAllInfo;

    /**
     * Decodes a PB_SCKnapsackAllInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCKnapsackAllInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCKnapsackAllInfo;

    /**
     * Verifies a PB_SCKnapsackAllInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCKnapsackAllInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCKnapsackAllInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCKnapsackAllInfo;

    /**
     * Creates a plain object from a PB_SCKnapsackAllInfo message. Also converts values to other types if specified.
     * @param message PB_SCKnapsackAllInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCKnapsackAllInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCKnapsackAllInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCKnapsackSingleInfo. */
export interface IPB_SCKnapsackSingleInfo {

    /** PB_SCKnapsackSingleInfo item */
    item?: (IPB_ItemData|null);
}

/** Represents a PB_SCKnapsackSingleInfo. */
export class PB_SCKnapsackSingleInfo implements IPB_SCKnapsackSingleInfo {

    /**
     * Constructs a new PB_SCKnapsackSingleInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCKnapsackSingleInfo);

    /** PB_SCKnapsackSingleInfo item. */
    public item?: (IPB_ItemData|null);

    /**
     * Creates a new PB_SCKnapsackSingleInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCKnapsackSingleInfo instance
     */
    public static create(properties?: IPB_SCKnapsackSingleInfo): PB_SCKnapsackSingleInfo;

    /**
     * Encodes the specified PB_SCKnapsackSingleInfo message. Does not implicitly {@link PB_SCKnapsackSingleInfo.verify|verify} messages.
     * @param message PB_SCKnapsackSingleInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCKnapsackSingleInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCKnapsackSingleInfo message, length delimited. Does not implicitly {@link PB_SCKnapsackSingleInfo.verify|verify} messages.
     * @param message PB_SCKnapsackSingleInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCKnapsackSingleInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCKnapsackSingleInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCKnapsackSingleInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCKnapsackSingleInfo;

    /**
     * Decodes a PB_SCKnapsackSingleInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCKnapsackSingleInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCKnapsackSingleInfo;

    /**
     * Verifies a PB_SCKnapsackSingleInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCKnapsackSingleInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCKnapsackSingleInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCKnapsackSingleInfo;

    /**
     * Creates a plain object from a PB_SCKnapsackSingleInfo message. Also converts values to other types if specified.
     * @param message PB_SCKnapsackSingleInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCKnapsackSingleInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCKnapsackSingleInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCGetItemNotice. */
export interface IPB_SCGetItemNotice {

    /** PB_SCGetItemNotice getType */
    getType?: (number|null);

    /** PB_SCGetItemNotice itemList */
    itemList?: (IPB_ItemData[]|null);
}

/** Represents a PB_SCGetItemNotice. */
export class PB_SCGetItemNotice implements IPB_SCGetItemNotice {

    /**
     * Constructs a new PB_SCGetItemNotice.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCGetItemNotice);

    /** PB_SCGetItemNotice getType. */
    public getType: number;

    /** PB_SCGetItemNotice itemList. */
    public itemList: IPB_ItemData[];

    /**
     * Creates a new PB_SCGetItemNotice instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCGetItemNotice instance
     */
    public static create(properties?: IPB_SCGetItemNotice): PB_SCGetItemNotice;

    /**
     * Encodes the specified PB_SCGetItemNotice message. Does not implicitly {@link PB_SCGetItemNotice.verify|verify} messages.
     * @param message PB_SCGetItemNotice message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCGetItemNotice, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCGetItemNotice message, length delimited. Does not implicitly {@link PB_SCGetItemNotice.verify|verify} messages.
     * @param message PB_SCGetItemNotice message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCGetItemNotice, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCGetItemNotice message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCGetItemNotice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCGetItemNotice;

    /**
     * Decodes a PB_SCGetItemNotice message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCGetItemNotice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCGetItemNotice;

    /**
     * Verifies a PB_SCGetItemNotice message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCGetItemNotice message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCGetItemNotice
     */
    public static fromObject(object: { [k: string]: any }): PB_SCGetItemNotice;

    /**
     * Creates a plain object from a PB_SCGetItemNotice message. Also converts values to other types if specified.
     * @param message PB_SCGetItemNotice
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCGetItemNotice, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCGetItemNotice to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCGetOneItemNotice. */
export interface IPB_SCGetOneItemNotice {

    /** PB_SCGetOneItemNotice item */
    item?: (IPB_ItemData|null);
}

/** Represents a PB_SCGetOneItemNotice. */
export class PB_SCGetOneItemNotice implements IPB_SCGetOneItemNotice {

    /**
     * Constructs a new PB_SCGetOneItemNotice.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCGetOneItemNotice);

    /** PB_SCGetOneItemNotice item. */
    public item?: (IPB_ItemData|null);

    /**
     * Creates a new PB_SCGetOneItemNotice instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCGetOneItemNotice instance
     */
    public static create(properties?: IPB_SCGetOneItemNotice): PB_SCGetOneItemNotice;

    /**
     * Encodes the specified PB_SCGetOneItemNotice message. Does not implicitly {@link PB_SCGetOneItemNotice.verify|verify} messages.
     * @param message PB_SCGetOneItemNotice message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCGetOneItemNotice, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCGetOneItemNotice message, length delimited. Does not implicitly {@link PB_SCGetOneItemNotice.verify|verify} messages.
     * @param message PB_SCGetOneItemNotice message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCGetOneItemNotice, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCGetOneItemNotice message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCGetOneItemNotice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCGetOneItemNotice;

    /**
     * Decodes a PB_SCGetOneItemNotice message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCGetOneItemNotice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCGetOneItemNotice;

    /**
     * Verifies a PB_SCGetOneItemNotice message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCGetOneItemNotice message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCGetOneItemNotice
     */
    public static fromObject(object: { [k: string]: any }): PB_SCGetOneItemNotice;

    /**
     * Creates a plain object from a PB_SCGetOneItemNotice message. Also converts values to other types if specified.
     * @param message PB_SCGetOneItemNotice
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCGetOneItemNotice, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCGetOneItemNotice to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_ShiZhuangData. */
export interface IPB_ShiZhuangData {

    /** PB_ShiZhuangData id */
    id?: (number|null);

    /** PB_ShiZhuangData level */
    level?: (number|null);
}

/** Represents a PB_ShiZhuangData. */
export class PB_ShiZhuangData implements IPB_ShiZhuangData {

    /**
     * Constructs a new PB_ShiZhuangData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_ShiZhuangData);

    /** PB_ShiZhuangData id. */
    public id: number;

    /** PB_ShiZhuangData level. */
    public level: number;

    /**
     * Creates a new PB_ShiZhuangData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_ShiZhuangData instance
     */
    public static create(properties?: IPB_ShiZhuangData): PB_ShiZhuangData;

    /**
     * Encodes the specified PB_ShiZhuangData message. Does not implicitly {@link PB_ShiZhuangData.verify|verify} messages.
     * @param message PB_ShiZhuangData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_ShiZhuangData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_ShiZhuangData message, length delimited. Does not implicitly {@link PB_ShiZhuangData.verify|verify} messages.
     * @param message PB_ShiZhuangData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_ShiZhuangData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_ShiZhuangData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_ShiZhuangData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_ShiZhuangData;

    /**
     * Decodes a PB_ShiZhuangData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_ShiZhuangData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_ShiZhuangData;

    /**
     * Verifies a PB_ShiZhuangData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_ShiZhuangData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_ShiZhuangData
     */
    public static fromObject(object: { [k: string]: any }): PB_ShiZhuangData;

    /**
     * Creates a plain object from a PB_ShiZhuangData message. Also converts values to other types if specified.
     * @param message PB_ShiZhuangData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_ShiZhuangData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_ShiZhuangData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCAllShiZhuangInfo. */
export interface IPB_SCAllShiZhuangInfo {

    /** PB_SCAllShiZhuangInfo shizhuangList */
    shizhuangList?: (IPB_ShiZhuangData[]|null);
}

/** Represents a PB_SCAllShiZhuangInfo. */
export class PB_SCAllShiZhuangInfo implements IPB_SCAllShiZhuangInfo {

    /**
     * Constructs a new PB_SCAllShiZhuangInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCAllShiZhuangInfo);

    /** PB_SCAllShiZhuangInfo shizhuangList. */
    public shizhuangList: IPB_ShiZhuangData[];

    /**
     * Creates a new PB_SCAllShiZhuangInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCAllShiZhuangInfo instance
     */
    public static create(properties?: IPB_SCAllShiZhuangInfo): PB_SCAllShiZhuangInfo;

    /**
     * Encodes the specified PB_SCAllShiZhuangInfo message. Does not implicitly {@link PB_SCAllShiZhuangInfo.verify|verify} messages.
     * @param message PB_SCAllShiZhuangInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCAllShiZhuangInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCAllShiZhuangInfo message, length delimited. Does not implicitly {@link PB_SCAllShiZhuangInfo.verify|verify} messages.
     * @param message PB_SCAllShiZhuangInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCAllShiZhuangInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCAllShiZhuangInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCAllShiZhuangInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCAllShiZhuangInfo;

    /**
     * Decodes a PB_SCAllShiZhuangInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCAllShiZhuangInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCAllShiZhuangInfo;

    /**
     * Verifies a PB_SCAllShiZhuangInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCAllShiZhuangInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCAllShiZhuangInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCAllShiZhuangInfo;

    /**
     * Creates a plain object from a PB_SCAllShiZhuangInfo message. Also converts values to other types if specified.
     * @param message PB_SCAllShiZhuangInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCAllShiZhuangInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCAllShiZhuangInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCShiZhuangInfo. */
export interface IPB_SCShiZhuangInfo {

    /** PB_SCShiZhuangInfo shizhuang */
    shizhuang?: (IPB_ShiZhuangData|null);
}

/** Represents a PB_SCShiZhuangInfo. */
export class PB_SCShiZhuangInfo implements IPB_SCShiZhuangInfo {

    /**
     * Constructs a new PB_SCShiZhuangInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCShiZhuangInfo);

    /** PB_SCShiZhuangInfo shizhuang. */
    public shizhuang?: (IPB_ShiZhuangData|null);

    /**
     * Creates a new PB_SCShiZhuangInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCShiZhuangInfo instance
     */
    public static create(properties?: IPB_SCShiZhuangInfo): PB_SCShiZhuangInfo;

    /**
     * Encodes the specified PB_SCShiZhuangInfo message. Does not implicitly {@link PB_SCShiZhuangInfo.verify|verify} messages.
     * @param message PB_SCShiZhuangInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCShiZhuangInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCShiZhuangInfo message, length delimited. Does not implicitly {@link PB_SCShiZhuangInfo.verify|verify} messages.
     * @param message PB_SCShiZhuangInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCShiZhuangInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCShiZhuangInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCShiZhuangInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCShiZhuangInfo;

    /**
     * Decodes a PB_SCShiZhuangInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCShiZhuangInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCShiZhuangInfo;

    /**
     * Verifies a PB_SCShiZhuangInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCShiZhuangInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCShiZhuangInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCShiZhuangInfo;

    /**
     * Creates a plain object from a PB_SCShiZhuangInfo message. Also converts values to other types if specified.
     * @param message PB_SCShiZhuangInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCShiZhuangInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCShiZhuangInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSLoginToAccount. */
export interface IPB_CSLoginToAccount {

    /** PB_CSLoginToAccount loginTime */
    loginTime?: (number|null);

    /** PB_CSLoginToAccount loginStr */
    loginStr?: (string|null);

    /** PB_CSLoginToAccount pname */
    pname?: (string|null);

    /** PB_CSLoginToAccount server */
    server?: (number|null);

    /** PB_CSLoginToAccount platSpid */
    platSpid?: (number|null);
}

/** Represents a PB_CSLoginToAccount. */
export class PB_CSLoginToAccount implements IPB_CSLoginToAccount {

    /**
     * Constructs a new PB_CSLoginToAccount.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSLoginToAccount);

    /** PB_CSLoginToAccount loginTime. */
    public loginTime: number;

    /** PB_CSLoginToAccount loginStr. */
    public loginStr: string;

    /** PB_CSLoginToAccount pname. */
    public pname: string;

    /** PB_CSLoginToAccount server. */
    public server: number;

    /** PB_CSLoginToAccount platSpid. */
    public platSpid: number;

    /**
     * Creates a new PB_CSLoginToAccount instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSLoginToAccount instance
     */
    public static create(properties?: IPB_CSLoginToAccount): PB_CSLoginToAccount;

    /**
     * Encodes the specified PB_CSLoginToAccount message. Does not implicitly {@link PB_CSLoginToAccount.verify|verify} messages.
     * @param message PB_CSLoginToAccount message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSLoginToAccount, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSLoginToAccount message, length delimited. Does not implicitly {@link PB_CSLoginToAccount.verify|verify} messages.
     * @param message PB_CSLoginToAccount message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSLoginToAccount, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSLoginToAccount message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSLoginToAccount
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSLoginToAccount;

    /**
     * Decodes a PB_CSLoginToAccount message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSLoginToAccount
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSLoginToAccount;

    /**
     * Verifies a PB_CSLoginToAccount message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSLoginToAccount message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSLoginToAccount
     */
    public static fromObject(object: { [k: string]: any }): PB_CSLoginToAccount;

    /**
     * Creates a plain object from a PB_CSLoginToAccount message. Also converts values to other types if specified.
     * @param message PB_CSLoginToAccount
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSLoginToAccount, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSLoginToAccount to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCLoginToAccount. */
export interface IPB_SCLoginToAccount {

    /** PB_SCLoginToAccount result */
    result?: (number|null);

    /** PB_SCLoginToAccount forbidTime */
    forbidTime?: (number|null);
}

/** Represents a PB_SCLoginToAccount. */
export class PB_SCLoginToAccount implements IPB_SCLoginToAccount {

    /**
     * Constructs a new PB_SCLoginToAccount.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCLoginToAccount);

    /** PB_SCLoginToAccount result. */
    public result: number;

    /** PB_SCLoginToAccount forbidTime. */
    public forbidTime: number;

    /**
     * Creates a new PB_SCLoginToAccount instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCLoginToAccount instance
     */
    public static create(properties?: IPB_SCLoginToAccount): PB_SCLoginToAccount;

    /**
     * Encodes the specified PB_SCLoginToAccount message. Does not implicitly {@link PB_SCLoginToAccount.verify|verify} messages.
     * @param message PB_SCLoginToAccount message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCLoginToAccount, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCLoginToAccount message, length delimited. Does not implicitly {@link PB_SCLoginToAccount.verify|verify} messages.
     * @param message PB_SCLoginToAccount message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCLoginToAccount, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCLoginToAccount message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCLoginToAccount
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCLoginToAccount;

    /**
     * Decodes a PB_SCLoginToAccount message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCLoginToAccount
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCLoginToAccount;

    /**
     * Verifies a PB_SCLoginToAccount message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCLoginToAccount message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCLoginToAccount
     */
    public static fromObject(object: { [k: string]: any }): PB_SCLoginToAccount;

    /**
     * Creates a plain object from a PB_SCLoginToAccount message. Also converts values to other types if specified.
     * @param message PB_SCLoginToAccount
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCLoginToAccount, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCLoginToAccount to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCAccountKeyError. */
export interface IPB_SCAccountKeyError {
}

/** Represents a PB_SCAccountKeyError. */
export class PB_SCAccountKeyError implements IPB_SCAccountKeyError {

    /**
     * Constructs a new PB_SCAccountKeyError.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCAccountKeyError);

    /**
     * Creates a new PB_SCAccountKeyError instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCAccountKeyError instance
     */
    public static create(properties?: IPB_SCAccountKeyError): PB_SCAccountKeyError;

    /**
     * Encodes the specified PB_SCAccountKeyError message. Does not implicitly {@link PB_SCAccountKeyError.verify|verify} messages.
     * @param message PB_SCAccountKeyError message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCAccountKeyError, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCAccountKeyError message, length delimited. Does not implicitly {@link PB_SCAccountKeyError.verify|verify} messages.
     * @param message PB_SCAccountKeyError message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCAccountKeyError, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCAccountKeyError message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCAccountKeyError
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCAccountKeyError;

    /**
     * Decodes a PB_SCAccountKeyError message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCAccountKeyError
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCAccountKeyError;

    /**
     * Verifies a PB_SCAccountKeyError message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCAccountKeyError message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCAccountKeyError
     */
    public static fromObject(object: { [k: string]: any }): PB_SCAccountKeyError;

    /**
     * Creates a plain object from a PB_SCAccountKeyError message. Also converts values to other types if specified.
     * @param message PB_SCAccountKeyError
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCAccountKeyError, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCAccountKeyError to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_MailAckInfo. */
export interface IPB_MailAckInfo {

    /** PB_MailAckInfo mailType */
    mailType?: (number|null);

    /** PB_MailAckInfo mailIndex */
    mailIndex?: (number|null);

    /** PB_MailAckInfo ret */
    ret?: (number|null);
}

/** Represents a PB_MailAckInfo. */
export class PB_MailAckInfo implements IPB_MailAckInfo {

    /**
     * Constructs a new PB_MailAckInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_MailAckInfo);

    /** PB_MailAckInfo mailType. */
    public mailType: number;

    /** PB_MailAckInfo mailIndex. */
    public mailIndex: number;

    /** PB_MailAckInfo ret. */
    public ret: number;

    /**
     * Creates a new PB_MailAckInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_MailAckInfo instance
     */
    public static create(properties?: IPB_MailAckInfo): PB_MailAckInfo;

    /**
     * Encodes the specified PB_MailAckInfo message. Does not implicitly {@link PB_MailAckInfo.verify|verify} messages.
     * @param message PB_MailAckInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_MailAckInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_MailAckInfo message, length delimited. Does not implicitly {@link PB_MailAckInfo.verify|verify} messages.
     * @param message PB_MailAckInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_MailAckInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_MailAckInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_MailAckInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_MailAckInfo;

    /**
     * Decodes a PB_MailAckInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_MailAckInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_MailAckInfo;

    /**
     * Verifies a PB_MailAckInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_MailAckInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_MailAckInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_MailAckInfo;

    /**
     * Creates a plain object from a PB_MailAckInfo message. Also converts values to other types if specified.
     * @param message PB_MailAckInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_MailAckInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_MailAckInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCMailDeleteAck. */
export interface IPB_SCMailDeleteAck {

    /** PB_SCMailDeleteAck askInfo */
    askInfo?: (IPB_MailAckInfo[]|null);
}

/** Represents a PB_SCMailDeleteAck. */
export class PB_SCMailDeleteAck implements IPB_SCMailDeleteAck {

    /**
     * Constructs a new PB_SCMailDeleteAck.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCMailDeleteAck);

    /** PB_SCMailDeleteAck askInfo. */
    public askInfo: IPB_MailAckInfo[];

    /**
     * Creates a new PB_SCMailDeleteAck instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCMailDeleteAck instance
     */
    public static create(properties?: IPB_SCMailDeleteAck): PB_SCMailDeleteAck;

    /**
     * Encodes the specified PB_SCMailDeleteAck message. Does not implicitly {@link PB_SCMailDeleteAck.verify|verify} messages.
     * @param message PB_SCMailDeleteAck message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCMailDeleteAck, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCMailDeleteAck message, length delimited. Does not implicitly {@link PB_SCMailDeleteAck.verify|verify} messages.
     * @param message PB_SCMailDeleteAck message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCMailDeleteAck, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCMailDeleteAck message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCMailDeleteAck
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCMailDeleteAck;

    /**
     * Decodes a PB_SCMailDeleteAck message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCMailDeleteAck
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCMailDeleteAck;

    /**
     * Verifies a PB_SCMailDeleteAck message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCMailDeleteAck message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCMailDeleteAck
     */
    public static fromObject(object: { [k: string]: any }): PB_SCMailDeleteAck;

    /**
     * Creates a plain object from a PB_SCMailDeleteAck message. Also converts values to other types if specified.
     * @param message PB_SCMailDeleteAck
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCMailDeleteAck, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCMailDeleteAck to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_MailBriefData. */
export interface IPB_MailBriefData {

    /** PB_MailBriefData mailType */
    mailType?: (number|null);

    /** PB_MailBriefData mailIndex */
    mailIndex?: (number|null);

    /** PB_MailBriefData recvTime */
    recvTime?: (number|null);

    /** PB_MailBriefData isRead */
    isRead?: (number|null);

    /** PB_MailBriefData isFetch */
    isFetch?: (number|null);

    /** PB_MailBriefData subject */
    subject?: (Uint8Array|null);

    /** PB_MailBriefData itemData */
    itemData?: (IPB_ItemData[]|null);

    /** PB_MailBriefData expirationTime */
    expirationTime?: (number|null);

    /** PB_MailBriefData isAdMail */
    isAdMail?: (boolean|null);
}

/** Represents a PB_MailBriefData. */
export class PB_MailBriefData implements IPB_MailBriefData {

    /**
     * Constructs a new PB_MailBriefData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_MailBriefData);

    /** PB_MailBriefData mailType. */
    public mailType: number;

    /** PB_MailBriefData mailIndex. */
    public mailIndex: number;

    /** PB_MailBriefData recvTime. */
    public recvTime: number;

    /** PB_MailBriefData isRead. */
    public isRead: number;

    /** PB_MailBriefData isFetch. */
    public isFetch: number;

    /** PB_MailBriefData subject. */
    public subject: Uint8Array;

    /** PB_MailBriefData itemData. */
    public itemData: IPB_ItemData[];

    /** PB_MailBriefData expirationTime. */
    public expirationTime: number;

    /** PB_MailBriefData isAdMail. */
    public isAdMail: boolean;

    /**
     * Creates a new PB_MailBriefData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_MailBriefData instance
     */
    public static create(properties?: IPB_MailBriefData): PB_MailBriefData;

    /**
     * Encodes the specified PB_MailBriefData message. Does not implicitly {@link PB_MailBriefData.verify|verify} messages.
     * @param message PB_MailBriefData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_MailBriefData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_MailBriefData message, length delimited. Does not implicitly {@link PB_MailBriefData.verify|verify} messages.
     * @param message PB_MailBriefData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_MailBriefData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_MailBriefData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_MailBriefData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_MailBriefData;

    /**
     * Decodes a PB_MailBriefData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_MailBriefData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_MailBriefData;

    /**
     * Verifies a PB_MailBriefData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_MailBriefData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_MailBriefData
     */
    public static fromObject(object: { [k: string]: any }): PB_MailBriefData;

    /**
     * Creates a plain object from a PB_MailBriefData message. Also converts values to other types if specified.
     * @param message PB_MailBriefData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_MailBriefData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_MailBriefData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCMailListAck. */
export interface IPB_SCMailListAck {

    /** PB_SCMailListAck mailBriefData */
    mailBriefData?: (IPB_MailBriefData[]|null);

    /** PB_SCMailListAck sendType */
    sendType?: (number|null);
}

/** Represents a PB_SCMailListAck. */
export class PB_SCMailListAck implements IPB_SCMailListAck {

    /**
     * Constructs a new PB_SCMailListAck.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCMailListAck);

    /** PB_SCMailListAck mailBriefData. */
    public mailBriefData: IPB_MailBriefData[];

    /** PB_SCMailListAck sendType. */
    public sendType: number;

    /**
     * Creates a new PB_SCMailListAck instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCMailListAck instance
     */
    public static create(properties?: IPB_SCMailListAck): PB_SCMailListAck;

    /**
     * Encodes the specified PB_SCMailListAck message. Does not implicitly {@link PB_SCMailListAck.verify|verify} messages.
     * @param message PB_SCMailListAck message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCMailListAck, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCMailListAck message, length delimited. Does not implicitly {@link PB_SCMailListAck.verify|verify} messages.
     * @param message PB_SCMailListAck message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCMailListAck, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCMailListAck message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCMailListAck
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCMailListAck;

    /**
     * Decodes a PB_SCMailListAck message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCMailListAck
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCMailListAck;

    /**
     * Verifies a PB_SCMailListAck message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCMailListAck message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCMailListAck
     */
    public static fromObject(object: { [k: string]: any }): PB_SCMailListAck;

    /**
     * Creates a plain object from a PB_SCMailListAck message. Also converts values to other types if specified.
     * @param message PB_SCMailListAck
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCMailListAck, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCMailListAck to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCMailDetail. */
export interface IPB_SCMailDetail {

    /** PB_SCMailDetail mailType */
    mailType?: (number|null);

    /** PB_SCMailDetail mailIndex */
    mailIndex?: (number|null);

    /** PB_SCMailDetail subject */
    subject?: (Uint8Array|null);

    /** PB_SCMailDetail contenttxt */
    contenttxt?: (Uint8Array|null);

    /** PB_SCMailDetail itemData */
    itemData?: (IPB_ItemData[]|null);
}

/** Represents a PB_SCMailDetail. */
export class PB_SCMailDetail implements IPB_SCMailDetail {

    /**
     * Constructs a new PB_SCMailDetail.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCMailDetail);

    /** PB_SCMailDetail mailType. */
    public mailType: number;

    /** PB_SCMailDetail mailIndex. */
    public mailIndex: number;

    /** PB_SCMailDetail subject. */
    public subject: Uint8Array;

    /** PB_SCMailDetail contenttxt. */
    public contenttxt: Uint8Array;

    /** PB_SCMailDetail itemData. */
    public itemData: IPB_ItemData[];

    /**
     * Creates a new PB_SCMailDetail instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCMailDetail instance
     */
    public static create(properties?: IPB_SCMailDetail): PB_SCMailDetail;

    /**
     * Encodes the specified PB_SCMailDetail message. Does not implicitly {@link PB_SCMailDetail.verify|verify} messages.
     * @param message PB_SCMailDetail message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCMailDetail, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCMailDetail message, length delimited. Does not implicitly {@link PB_SCMailDetail.verify|verify} messages.
     * @param message PB_SCMailDetail message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCMailDetail, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCMailDetail message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCMailDetail
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCMailDetail;

    /**
     * Decodes a PB_SCMailDetail message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCMailDetail
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCMailDetail;

    /**
     * Verifies a PB_SCMailDetail message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCMailDetail message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCMailDetail
     */
    public static fromObject(object: { [k: string]: any }): PB_SCMailDetail;

    /**
     * Creates a plain object from a PB_SCMailDetail message. Also converts values to other types if specified.
     * @param message PB_SCMailDetail
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCMailDetail, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCMailDetail to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCFetchMailAck. */
export interface IPB_SCFetchMailAck {

    /** PB_SCFetchMailAck askInfo */
    askInfo?: (IPB_MailAckInfo[]|null);
}

/** Represents a PB_SCFetchMailAck. */
export class PB_SCFetchMailAck implements IPB_SCFetchMailAck {

    /**
     * Constructs a new PB_SCFetchMailAck.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCFetchMailAck);

    /** PB_SCFetchMailAck askInfo. */
    public askInfo: IPB_MailAckInfo[];

    /**
     * Creates a new PB_SCFetchMailAck instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCFetchMailAck instance
     */
    public static create(properties?: IPB_SCFetchMailAck): PB_SCFetchMailAck;

    /**
     * Encodes the specified PB_SCFetchMailAck message. Does not implicitly {@link PB_SCFetchMailAck.verify|verify} messages.
     * @param message PB_SCFetchMailAck message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCFetchMailAck, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCFetchMailAck message, length delimited. Does not implicitly {@link PB_SCFetchMailAck.verify|verify} messages.
     * @param message PB_SCFetchMailAck message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCFetchMailAck, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCFetchMailAck message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCFetchMailAck
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCFetchMailAck;

    /**
     * Decodes a PB_SCFetchMailAck message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCFetchMailAck
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCFetchMailAck;

    /**
     * Verifies a PB_SCFetchMailAck message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCFetchMailAck message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCFetchMailAck
     */
    public static fromObject(object: { [k: string]: any }): PB_SCFetchMailAck;

    /**
     * Creates a plain object from a PB_SCFetchMailAck message. Also converts values to other types if specified.
     * @param message PB_SCFetchMailAck
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCFetchMailAck, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCFetchMailAck to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSMailReq. */
export interface IPB_CSMailReq {

    /** PB_CSMailReq type */
    type?: (number|null);

    /** PB_CSMailReq p_1 */
    p_1?: (number|null);

    /** PB_CSMailReq p_2 */
    p_2?: (number|null);
}

/** Represents a PB_CSMailReq. */
export class PB_CSMailReq implements IPB_CSMailReq {

    /**
     * Constructs a new PB_CSMailReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSMailReq);

    /** PB_CSMailReq type. */
    public type: number;

    /** PB_CSMailReq p_1. */
    public p_1: number;

    /** PB_CSMailReq p_2. */
    public p_2: number;

    /**
     * Creates a new PB_CSMailReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSMailReq instance
     */
    public static create(properties?: IPB_CSMailReq): PB_CSMailReq;

    /**
     * Encodes the specified PB_CSMailReq message. Does not implicitly {@link PB_CSMailReq.verify|verify} messages.
     * @param message PB_CSMailReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSMailReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSMailReq message, length delimited. Does not implicitly {@link PB_CSMailReq.verify|verify} messages.
     * @param message PB_CSMailReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSMailReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSMailReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSMailReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSMailReq;

    /**
     * Decodes a PB_CSMailReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSMailReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSMailReq;

    /**
     * Verifies a PB_CSMailReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSMailReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSMailReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSMailReq;

    /**
     * Creates a plain object from a PB_CSMailReq message. Also converts values to other types if specified.
     * @param message PB_CSMailReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSMailReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSMailReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCMoneyBoxInfo. */
export interface IPB_SCMoneyBoxInfo {

    /** PB_SCMoneyBoxInfo seq */
    seq?: (number|null);

    /** PB_SCMoneyBoxInfo value */
    value?: (number|null);
}

/** Represents a PB_SCMoneyBoxInfo. */
export class PB_SCMoneyBoxInfo implements IPB_SCMoneyBoxInfo {

    /**
     * Constructs a new PB_SCMoneyBoxInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCMoneyBoxInfo);

    /** PB_SCMoneyBoxInfo seq. */
    public seq: number;

    /** PB_SCMoneyBoxInfo value. */
    public value: number;

    /**
     * Creates a new PB_SCMoneyBoxInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCMoneyBoxInfo instance
     */
    public static create(properties?: IPB_SCMoneyBoxInfo): PB_SCMoneyBoxInfo;

    /**
     * Encodes the specified PB_SCMoneyBoxInfo message. Does not implicitly {@link PB_SCMoneyBoxInfo.verify|verify} messages.
     * @param message PB_SCMoneyBoxInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCMoneyBoxInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCMoneyBoxInfo message, length delimited. Does not implicitly {@link PB_SCMoneyBoxInfo.verify|verify} messages.
     * @param message PB_SCMoneyBoxInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCMoneyBoxInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCMoneyBoxInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCMoneyBoxInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCMoneyBoxInfo;

    /**
     * Decodes a PB_SCMoneyBoxInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCMoneyBoxInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCMoneyBoxInfo;

    /**
     * Verifies a PB_SCMoneyBoxInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCMoneyBoxInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCMoneyBoxInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCMoneyBoxInfo;

    /**
     * Creates a plain object from a PB_SCMoneyBoxInfo message. Also converts values to other types if specified.
     * @param message PB_SCMoneyBoxInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCMoneyBoxInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCMoneyBoxInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSNoticeTimeReq. */
export interface IPB_CSNoticeTimeReq {

    /** PB_CSNoticeTimeReq type */
    type?: (number|null);

    /** PB_CSNoticeTimeReq param */
    param?: (number|Long|null);
}

/** Represents a PB_CSNoticeTimeReq. */
export class PB_CSNoticeTimeReq implements IPB_CSNoticeTimeReq {

    /**
     * Constructs a new PB_CSNoticeTimeReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSNoticeTimeReq);

    /** PB_CSNoticeTimeReq type. */
    public type: number;

    /** PB_CSNoticeTimeReq param. */
    public param: (number|Long);

    /**
     * Creates a new PB_CSNoticeTimeReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSNoticeTimeReq instance
     */
    public static create(properties?: IPB_CSNoticeTimeReq): PB_CSNoticeTimeReq;

    /**
     * Encodes the specified PB_CSNoticeTimeReq message. Does not implicitly {@link PB_CSNoticeTimeReq.verify|verify} messages.
     * @param message PB_CSNoticeTimeReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSNoticeTimeReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSNoticeTimeReq message, length delimited. Does not implicitly {@link PB_CSNoticeTimeReq.verify|verify} messages.
     * @param message PB_CSNoticeTimeReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSNoticeTimeReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSNoticeTimeReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSNoticeTimeReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSNoticeTimeReq;

    /**
     * Decodes a PB_CSNoticeTimeReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSNoticeTimeReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSNoticeTimeReq;

    /**
     * Verifies a PB_CSNoticeTimeReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSNoticeTimeReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSNoticeTimeReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSNoticeTimeReq;

    /**
     * Creates a plain object from a PB_CSNoticeTimeReq message. Also converts values to other types if specified.
     * @param message PB_CSNoticeTimeReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSNoticeTimeReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSNoticeTimeReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCNoticeTimeRet. */
export interface IPB_SCNoticeTimeRet {

    /** PB_SCNoticeTimeRet noticeTime */
    noticeTime?: (number|Long|null);
}

/** Represents a PB_SCNoticeTimeRet. */
export class PB_SCNoticeTimeRet implements IPB_SCNoticeTimeRet {

    /**
     * Constructs a new PB_SCNoticeTimeRet.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCNoticeTimeRet);

    /** PB_SCNoticeTimeRet noticeTime. */
    public noticeTime: (number|Long);

    /**
     * Creates a new PB_SCNoticeTimeRet instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCNoticeTimeRet instance
     */
    public static create(properties?: IPB_SCNoticeTimeRet): PB_SCNoticeTimeRet;

    /**
     * Encodes the specified PB_SCNoticeTimeRet message. Does not implicitly {@link PB_SCNoticeTimeRet.verify|verify} messages.
     * @param message PB_SCNoticeTimeRet message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCNoticeTimeRet, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCNoticeTimeRet message, length delimited. Does not implicitly {@link PB_SCNoticeTimeRet.verify|verify} messages.
     * @param message PB_SCNoticeTimeRet message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCNoticeTimeRet, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCNoticeTimeRet message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCNoticeTimeRet
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCNoticeTimeRet;

    /**
     * Decodes a PB_SCNoticeTimeRet message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCNoticeTimeRet
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCNoticeTimeRet;

    /**
     * Verifies a PB_SCNoticeTimeRet message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCNoticeTimeRet message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCNoticeTimeRet
     */
    public static fromObject(object: { [k: string]: any }): PB_SCNoticeTimeRet;

    /**
     * Creates a plain object from a PB_SCNoticeTimeRet message. Also converts values to other types if specified.
     * @param message PB_SCNoticeTimeRet
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCNoticeTimeRet, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCNoticeTimeRet to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCCmdToClientCmd. */
export interface IPB_SCCmdToClientCmd {

    /** PB_SCCmdToClientCmd id */
    id?: (number|null);

    /** PB_SCCmdToClientCmd str */
    str?: (Uint8Array|null);
}

/** Represents a PB_SCCmdToClientCmd. */
export class PB_SCCmdToClientCmd implements IPB_SCCmdToClientCmd {

    /**
     * Constructs a new PB_SCCmdToClientCmd.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCCmdToClientCmd);

    /** PB_SCCmdToClientCmd id. */
    public id: number;

    /** PB_SCCmdToClientCmd str. */
    public str: Uint8Array;

    /**
     * Creates a new PB_SCCmdToClientCmd instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCCmdToClientCmd instance
     */
    public static create(properties?: IPB_SCCmdToClientCmd): PB_SCCmdToClientCmd;

    /**
     * Encodes the specified PB_SCCmdToClientCmd message. Does not implicitly {@link PB_SCCmdToClientCmd.verify|verify} messages.
     * @param message PB_SCCmdToClientCmd message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCCmdToClientCmd, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCCmdToClientCmd message, length delimited. Does not implicitly {@link PB_SCCmdToClientCmd.verify|verify} messages.
     * @param message PB_SCCmdToClientCmd message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCCmdToClientCmd, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCCmdToClientCmd message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCCmdToClientCmd
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCCmdToClientCmd;

    /**
     * Decodes a PB_SCCmdToClientCmd message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCCmdToClientCmd
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCCmdToClientCmd;

    /**
     * Verifies a PB_SCCmdToClientCmd message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCCmdToClientCmd message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCCmdToClientCmd
     */
    public static fromObject(object: { [k: string]: any }): PB_SCCmdToClientCmd;

    /**
     * Creates a plain object from a PB_SCCmdToClientCmd message. Also converts values to other types if specified.
     * @param message PB_SCCmdToClientCmd
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCCmdToClientCmd, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCCmdToClientCmd to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_DailyChallengeFetch. */
export interface IPB_DailyChallengeFetch {

    /** PB_DailyChallengeFetch missionIndex */
    missionIndex?: (number|null);
}

/** Represents a PB_DailyChallengeFetch. */
export class PB_DailyChallengeFetch implements IPB_DailyChallengeFetch {

    /**
     * Constructs a new PB_DailyChallengeFetch.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_DailyChallengeFetch);

    /** PB_DailyChallengeFetch missionIndex. */
    public missionIndex: number;

    /**
     * Creates a new PB_DailyChallengeFetch instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_DailyChallengeFetch instance
     */
    public static create(properties?: IPB_DailyChallengeFetch): PB_DailyChallengeFetch;

    /**
     * Encodes the specified PB_DailyChallengeFetch message. Does not implicitly {@link PB_DailyChallengeFetch.verify|verify} messages.
     * @param message PB_DailyChallengeFetch message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_DailyChallengeFetch, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_DailyChallengeFetch message, length delimited. Does not implicitly {@link PB_DailyChallengeFetch.verify|verify} messages.
     * @param message PB_DailyChallengeFetch message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_DailyChallengeFetch, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_DailyChallengeFetch message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_DailyChallengeFetch
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_DailyChallengeFetch;

    /**
     * Decodes a PB_DailyChallengeFetch message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_DailyChallengeFetch
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_DailyChallengeFetch;

    /**
     * Verifies a PB_DailyChallengeFetch message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_DailyChallengeFetch message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_DailyChallengeFetch
     */
    public static fromObject(object: { [k: string]: any }): PB_DailyChallengeFetch;

    /**
     * Creates a plain object from a PB_DailyChallengeFetch message. Also converts values to other types if specified.
     * @param message PB_DailyChallengeFetch
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_DailyChallengeFetch, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_DailyChallengeFetch to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_DailyChallengeInfo. */
export interface IPB_DailyChallengeInfo {

    /** PB_DailyChallengeInfo bossSeq */
    bossSeq?: (number|null);

    /** PB_DailyChallengeInfo isPass */
    isPass?: (number|null);

    /** PB_DailyChallengeInfo missionProgress */
    missionProgress?: (number[]|null);

    /** PB_DailyChallengeInfo fetchFlag */
    fetchFlag?: (number|null);

    /** PB_DailyChallengeInfo battleRound */
    battleRound?: (number|null);
}

/** Represents a PB_DailyChallengeInfo. */
export class PB_DailyChallengeInfo implements IPB_DailyChallengeInfo {

    /**
     * Constructs a new PB_DailyChallengeInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_DailyChallengeInfo);

    /** PB_DailyChallengeInfo bossSeq. */
    public bossSeq: number;

    /** PB_DailyChallengeInfo isPass. */
    public isPass: number;

    /** PB_DailyChallengeInfo missionProgress. */
    public missionProgress: number[];

    /** PB_DailyChallengeInfo fetchFlag. */
    public fetchFlag: number;

    /** PB_DailyChallengeInfo battleRound. */
    public battleRound: number;

    /**
     * Creates a new PB_DailyChallengeInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_DailyChallengeInfo instance
     */
    public static create(properties?: IPB_DailyChallengeInfo): PB_DailyChallengeInfo;

    /**
     * Encodes the specified PB_DailyChallengeInfo message. Does not implicitly {@link PB_DailyChallengeInfo.verify|verify} messages.
     * @param message PB_DailyChallengeInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_DailyChallengeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_DailyChallengeInfo message, length delimited. Does not implicitly {@link PB_DailyChallengeInfo.verify|verify} messages.
     * @param message PB_DailyChallengeInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_DailyChallengeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_DailyChallengeInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_DailyChallengeInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_DailyChallengeInfo;

    /**
     * Decodes a PB_DailyChallengeInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_DailyChallengeInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_DailyChallengeInfo;

    /**
     * Verifies a PB_DailyChallengeInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_DailyChallengeInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_DailyChallengeInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_DailyChallengeInfo;

    /**
     * Creates a plain object from a PB_DailyChallengeInfo message. Also converts values to other types if specified.
     * @param message PB_DailyChallengeInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_DailyChallengeInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_DailyChallengeInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_MainFBOper. */
export interface IPB_MainFBOper {

    /** PB_MainFBOper operType */
    operType?: (number|null);

    /** PB_MainFBOper operParam */
    operParam?: (number[]|null);
}

/** Represents a PB_MainFBOper. */
export class PB_MainFBOper implements IPB_MainFBOper {

    /**
     * Constructs a new PB_MainFBOper.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_MainFBOper);

    /** PB_MainFBOper operType. */
    public operType: number;

    /** PB_MainFBOper operParam. */
    public operParam: number[];

    /**
     * Creates a new PB_MainFBOper instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_MainFBOper instance
     */
    public static create(properties?: IPB_MainFBOper): PB_MainFBOper;

    /**
     * Encodes the specified PB_MainFBOper message. Does not implicitly {@link PB_MainFBOper.verify|verify} messages.
     * @param message PB_MainFBOper message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_MainFBOper, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_MainFBOper message, length delimited. Does not implicitly {@link PB_MainFBOper.verify|verify} messages.
     * @param message PB_MainFBOper message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_MainFBOper, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_MainFBOper message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_MainFBOper
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_MainFBOper;

    /**
     * Decodes a PB_MainFBOper message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_MainFBOper
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_MainFBOper;

    /**
     * Verifies a PB_MainFBOper message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_MainFBOper message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_MainFBOper
     */
    public static fromObject(object: { [k: string]: any }): PB_MainFBOper;

    /**
     * Creates a plain object from a PB_MainFBOper message. Also converts values to other types if specified.
     * @param message PB_MainFBOper
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_MainFBOper, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_MainFBOper to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_MainFBNode. */
export interface IPB_MainFBNode {

    /** PB_MainFBNode level */
    level?: (number|null);

    /** PB_MainFBNode round */
    round?: (number|null);

    /** PB_MainFBNode rewardFlag */
    rewardFlag?: (boolean[]|null);
}

/** Represents a PB_MainFBNode. */
export class PB_MainFBNode implements IPB_MainFBNode {

    /**
     * Constructs a new PB_MainFBNode.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_MainFBNode);

    /** PB_MainFBNode level. */
    public level: number;

    /** PB_MainFBNode round. */
    public round: number;

    /** PB_MainFBNode rewardFlag. */
    public rewardFlag: boolean[];

    /**
     * Creates a new PB_MainFBNode instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_MainFBNode instance
     */
    public static create(properties?: IPB_MainFBNode): PB_MainFBNode;

    /**
     * Encodes the specified PB_MainFBNode message. Does not implicitly {@link PB_MainFBNode.verify|verify} messages.
     * @param message PB_MainFBNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_MainFBNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_MainFBNode message, length delimited. Does not implicitly {@link PB_MainFBNode.verify|verify} messages.
     * @param message PB_MainFBNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_MainFBNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_MainFBNode message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_MainFBNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_MainFBNode;

    /**
     * Decodes a PB_MainFBNode message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_MainFBNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_MainFBNode;

    /**
     * Verifies a PB_MainFBNode message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_MainFBNode message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_MainFBNode
     */
    public static fromObject(object: { [k: string]: any }): PB_MainFBNode;

    /**
     * Creates a plain object from a PB_MainFBNode message. Also converts values to other types if specified.
     * @param message PB_MainFBNode
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_MainFBNode, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_MainFBNode to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_MainFBInfo. */
export interface IPB_MainFBInfo {

    /** PB_MainFBInfo energyBuyCount */
    energyBuyCount?: (number|null);

    /** PB_MainFBInfo fbList */
    fbList?: (IPB_MainFBNode[]|null);

    /** PB_MainFBInfo adReward */
    adReward?: (boolean|null);
}

/** Represents a PB_MainFBInfo. */
export class PB_MainFBInfo implements IPB_MainFBInfo {

    /**
     * Constructs a new PB_MainFBInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_MainFBInfo);

    /** PB_MainFBInfo energyBuyCount. */
    public energyBuyCount: number;

    /** PB_MainFBInfo fbList. */
    public fbList: IPB_MainFBNode[];

    /** PB_MainFBInfo adReward. */
    public adReward: boolean;

    /**
     * Creates a new PB_MainFBInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_MainFBInfo instance
     */
    public static create(properties?: IPB_MainFBInfo): PB_MainFBInfo;

    /**
     * Encodes the specified PB_MainFBInfo message. Does not implicitly {@link PB_MainFBInfo.verify|verify} messages.
     * @param message PB_MainFBInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_MainFBInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_MainFBInfo message, length delimited. Does not implicitly {@link PB_MainFBInfo.verify|verify} messages.
     * @param message PB_MainFBInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_MainFBInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_MainFBInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_MainFBInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_MainFBInfo;

    /**
     * Decodes a PB_MainFBInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_MainFBInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_MainFBInfo;

    /**
     * Verifies a PB_MainFBInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_MainFBInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_MainFBInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_MainFBInfo;

    /**
     * Creates a plain object from a PB_MainFBInfo message. Also converts values to other types if specified.
     * @param message PB_MainFBInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_MainFBInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_MainFBInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_MainFBRewardInfo. */
export interface IPB_MainFBRewardInfo {

    /** PB_MainFBRewardInfo itemId */
    itemId?: (number[]|null);

    /** PB_MainFBRewardInfo itemNum */
    itemNum?: (number[]|null);

    /** PB_MainFBRewardInfo rewardType */
    rewardType?: (number|null);

    /** PB_MainFBRewardInfo rewardTime */
    rewardTime?: (number|null);

    /** PB_MainFBRewardInfo todayBuyCount */
    todayBuyCount?: (number|null);
}

/** Represents a PB_MainFBRewardInfo. */
export class PB_MainFBRewardInfo implements IPB_MainFBRewardInfo {

    /**
     * Constructs a new PB_MainFBRewardInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_MainFBRewardInfo);

    /** PB_MainFBRewardInfo itemId. */
    public itemId: number[];

    /** PB_MainFBRewardInfo itemNum. */
    public itemNum: number[];

    /** PB_MainFBRewardInfo rewardType. */
    public rewardType: number;

    /** PB_MainFBRewardInfo rewardTime. */
    public rewardTime: number;

    /** PB_MainFBRewardInfo todayBuyCount. */
    public todayBuyCount: number;

    /**
     * Creates a new PB_MainFBRewardInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_MainFBRewardInfo instance
     */
    public static create(properties?: IPB_MainFBRewardInfo): PB_MainFBRewardInfo;

    /**
     * Encodes the specified PB_MainFBRewardInfo message. Does not implicitly {@link PB_MainFBRewardInfo.verify|verify} messages.
     * @param message PB_MainFBRewardInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_MainFBRewardInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_MainFBRewardInfo message, length delimited. Does not implicitly {@link PB_MainFBRewardInfo.verify|verify} messages.
     * @param message PB_MainFBRewardInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_MainFBRewardInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_MainFBRewardInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_MainFBRewardInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_MainFBRewardInfo;

    /**
     * Decodes a PB_MainFBRewardInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_MainFBRewardInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_MainFBRewardInfo;

    /**
     * Verifies a PB_MainFBRewardInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_MainFBRewardInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_MainFBRewardInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_MainFBRewardInfo;

    /**
     * Creates a plain object from a PB_MainFBRewardInfo message. Also converts values to other types if specified.
     * @param message PB_MainFBRewardInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_MainFBRewardInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_MainFBRewardInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_MainFBPassNode. */
export interface IPB_MainFBPassNode {

    /** PB_MainFBPassNode roleInfo */
    roleInfo?: (IPB_RoleInfo|null);

    /** PB_MainFBPassNode time */
    time?: (number|null);

    /** PB_MainFBPassNode heroId */
    heroId?: (number[]|null);

    /** PB_MainFBPassNode heroLevel */
    heroLevel?: (number[]|null);
}

/** Represents a PB_MainFBPassNode. */
export class PB_MainFBPassNode implements IPB_MainFBPassNode {

    /**
     * Constructs a new PB_MainFBPassNode.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_MainFBPassNode);

    /** PB_MainFBPassNode roleInfo. */
    public roleInfo?: (IPB_RoleInfo|null);

    /** PB_MainFBPassNode time. */
    public time: number;

    /** PB_MainFBPassNode heroId. */
    public heroId: number[];

    /** PB_MainFBPassNode heroLevel. */
    public heroLevel: number[];

    /**
     * Creates a new PB_MainFBPassNode instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_MainFBPassNode instance
     */
    public static create(properties?: IPB_MainFBPassNode): PB_MainFBPassNode;

    /**
     * Encodes the specified PB_MainFBPassNode message. Does not implicitly {@link PB_MainFBPassNode.verify|verify} messages.
     * @param message PB_MainFBPassNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_MainFBPassNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_MainFBPassNode message, length delimited. Does not implicitly {@link PB_MainFBPassNode.verify|verify} messages.
     * @param message PB_MainFBPassNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_MainFBPassNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_MainFBPassNode message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_MainFBPassNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_MainFBPassNode;

    /**
     * Decodes a PB_MainFBPassNode message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_MainFBPassNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_MainFBPassNode;

    /**
     * Verifies a PB_MainFBPassNode message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_MainFBPassNode message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_MainFBPassNode
     */
    public static fromObject(object: { [k: string]: any }): PB_MainFBPassNode;

    /**
     * Creates a plain object from a PB_MainFBPassNode message. Also converts values to other types if specified.
     * @param message PB_MainFBPassNode
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_MainFBPassNode, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_MainFBPassNode to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_MainFBPassInfo. */
export interface IPB_MainFBPassInfo {

    /** PB_MainFBPassInfo fbLevel */
    fbLevel?: (number|null);

    /** PB_MainFBPassInfo infoList */
    infoList?: (IPB_MainFBPassNode[]|null);
}

/** Represents a PB_MainFBPassInfo. */
export class PB_MainFBPassInfo implements IPB_MainFBPassInfo {

    /**
     * Constructs a new PB_MainFBPassInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_MainFBPassInfo);

    /** PB_MainFBPassInfo fbLevel. */
    public fbLevel: number;

    /** PB_MainFBPassInfo infoList. */
    public infoList: IPB_MainFBPassNode[];

    /**
     * Creates a new PB_MainFBPassInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_MainFBPassInfo instance
     */
    public static create(properties?: IPB_MainFBPassInfo): PB_MainFBPassInfo;

    /**
     * Encodes the specified PB_MainFBPassInfo message. Does not implicitly {@link PB_MainFBPassInfo.verify|verify} messages.
     * @param message PB_MainFBPassInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_MainFBPassInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_MainFBPassInfo message, length delimited. Does not implicitly {@link PB_MainFBPassInfo.verify|verify} messages.
     * @param message PB_MainFBPassInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_MainFBPassInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_MainFBPassInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_MainFBPassInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_MainFBPassInfo;

    /**
     * Decodes a PB_MainFBPassInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_MainFBPassInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_MainFBPassInfo;

    /**
     * Verifies a PB_MainFBPassInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_MainFBPassInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_MainFBPassInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_MainFBPassInfo;

    /**
     * Creates a plain object from a PB_MainFBPassInfo message. Also converts values to other types if specified.
     * @param message PB_MainFBPassInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_MainFBPassInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_MainFBPassInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_MainFBRankUser. */
export interface IPB_MainFBRankUser {

    /** PB_MainFBRankUser roleInfo */
    roleInfo?: (IPB_RoleInfo|null);

    /** PB_MainFBRankUser rankLevel */
    rankLevel?: (number|null);
}

/** Represents a PB_MainFBRankUser. */
export class PB_MainFBRankUser implements IPB_MainFBRankUser {

    /**
     * Constructs a new PB_MainFBRankUser.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_MainFBRankUser);

    /** PB_MainFBRankUser roleInfo. */
    public roleInfo?: (IPB_RoleInfo|null);

    /** PB_MainFBRankUser rankLevel. */
    public rankLevel: number;

    /**
     * Creates a new PB_MainFBRankUser instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_MainFBRankUser instance
     */
    public static create(properties?: IPB_MainFBRankUser): PB_MainFBRankUser;

    /**
     * Encodes the specified PB_MainFBRankUser message. Does not implicitly {@link PB_MainFBRankUser.verify|verify} messages.
     * @param message PB_MainFBRankUser message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_MainFBRankUser, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_MainFBRankUser message, length delimited. Does not implicitly {@link PB_MainFBRankUser.verify|verify} messages.
     * @param message PB_MainFBRankUser message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_MainFBRankUser, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_MainFBRankUser message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_MainFBRankUser
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_MainFBRankUser;

    /**
     * Decodes a PB_MainFBRankUser message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_MainFBRankUser
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_MainFBRankUser;

    /**
     * Verifies a PB_MainFBRankUser message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_MainFBRankUser message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_MainFBRankUser
     */
    public static fromObject(object: { [k: string]: any }): PB_MainFBRankUser;

    /**
     * Creates a plain object from a PB_MainFBRankUser message. Also converts values to other types if specified.
     * @param message PB_MainFBRankUser
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_MainFBRankUser, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_MainFBRankUser to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_MainFBRankInfo. */
export interface IPB_MainFBRankInfo {

    /** PB_MainFBRankInfo beginRank */
    beginRank?: (number|null);

    /** PB_MainFBRankInfo rankList */
    rankList?: (IPB_MainFBRankUser[]|null);

    /** PB_MainFBRankInfo myRank */
    myRank?: (number|null);

    /** PB_MainFBRankInfo myPassLevel */
    myPassLevel?: (number|null);
}

/** Represents a PB_MainFBRankInfo. */
export class PB_MainFBRankInfo implements IPB_MainFBRankInfo {

    /**
     * Constructs a new PB_MainFBRankInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_MainFBRankInfo);

    /** PB_MainFBRankInfo beginRank. */
    public beginRank: number;

    /** PB_MainFBRankInfo rankList. */
    public rankList: IPB_MainFBRankUser[];

    /** PB_MainFBRankInfo myRank. */
    public myRank: number;

    /** PB_MainFBRankInfo myPassLevel. */
    public myPassLevel: number;

    /**
     * Creates a new PB_MainFBRankInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_MainFBRankInfo instance
     */
    public static create(properties?: IPB_MainFBRankInfo): PB_MainFBRankInfo;

    /**
     * Encodes the specified PB_MainFBRankInfo message. Does not implicitly {@link PB_MainFBRankInfo.verify|verify} messages.
     * @param message PB_MainFBRankInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_MainFBRankInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_MainFBRankInfo message, length delimited. Does not implicitly {@link PB_MainFBRankInfo.verify|verify} messages.
     * @param message PB_MainFBRankInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_MainFBRankInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_MainFBRankInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_MainFBRankInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_MainFBRankInfo;

    /**
     * Decodes a PB_MainFBRankInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_MainFBRankInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_MainFBRankInfo;

    /**
     * Verifies a PB_MainFBRankInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_MainFBRankInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_MainFBRankInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_MainFBRankInfo;

    /**
     * Creates a plain object from a PB_MainFBRankInfo message. Also converts values to other types if specified.
     * @param message PB_MainFBRankInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_MainFBRankInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_MainFBRankInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCAdvertisement. */
export interface IPB_SCAdvertisement {

    /** PB_SCAdvertisement seq */
    seq?: (number|null);

    /** PB_SCAdvertisement todayCount */
    todayCount?: (number|null);

    /** PB_SCAdvertisement nextFetchTime */
    nextFetchTime?: (number|null);
}

/** Represents a PB_SCAdvertisement. */
export class PB_SCAdvertisement implements IPB_SCAdvertisement {

    /**
     * Constructs a new PB_SCAdvertisement.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCAdvertisement);

    /** PB_SCAdvertisement seq. */
    public seq: number;

    /** PB_SCAdvertisement todayCount. */
    public todayCount: number;

    /** PB_SCAdvertisement nextFetchTime. */
    public nextFetchTime: number;

    /**
     * Creates a new PB_SCAdvertisement instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCAdvertisement instance
     */
    public static create(properties?: IPB_SCAdvertisement): PB_SCAdvertisement;

    /**
     * Encodes the specified PB_SCAdvertisement message. Does not implicitly {@link PB_SCAdvertisement.verify|verify} messages.
     * @param message PB_SCAdvertisement message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCAdvertisement, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCAdvertisement message, length delimited. Does not implicitly {@link PB_SCAdvertisement.verify|verify} messages.
     * @param message PB_SCAdvertisement message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCAdvertisement, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCAdvertisement message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCAdvertisement
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCAdvertisement;

    /**
     * Decodes a PB_SCAdvertisement message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCAdvertisement
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCAdvertisement;

    /**
     * Verifies a PB_SCAdvertisement message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCAdvertisement message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCAdvertisement
     */
    public static fromObject(object: { [k: string]: any }): PB_SCAdvertisement;

    /**
     * Creates a plain object from a PB_SCAdvertisement message. Also converts values to other types if specified.
     * @param message PB_SCAdvertisement
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCAdvertisement, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCAdvertisement to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SevenDayReq. */
export interface IPB_SevenDayReq {

    /** PB_SevenDayReq operType */
    operType?: (number|null);

    /** PB_SevenDayReq operParam */
    operParam?: (number[]|null);
}

/** Represents a PB_SevenDayReq. */
export class PB_SevenDayReq implements IPB_SevenDayReq {

    /**
     * Constructs a new PB_SevenDayReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SevenDayReq);

    /** PB_SevenDayReq operType. */
    public operType: number;

    /** PB_SevenDayReq operParam. */
    public operParam: number[];

    /**
     * Creates a new PB_SevenDayReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SevenDayReq instance
     */
    public static create(properties?: IPB_SevenDayReq): PB_SevenDayReq;

    /**
     * Encodes the specified PB_SevenDayReq message. Does not implicitly {@link PB_SevenDayReq.verify|verify} messages.
     * @param message PB_SevenDayReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SevenDayReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SevenDayReq message, length delimited. Does not implicitly {@link PB_SevenDayReq.verify|verify} messages.
     * @param message PB_SevenDayReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SevenDayReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SevenDayReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SevenDayReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SevenDayReq;

    /**
     * Decodes a PB_SevenDayReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SevenDayReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SevenDayReq;

    /**
     * Verifies a PB_SevenDayReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SevenDayReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SevenDayReq
     */
    public static fromObject(object: { [k: string]: any }): PB_SevenDayReq;

    /**
     * Creates a plain object from a PB_SevenDayReq message. Also converts values to other types if specified.
     * @param message PB_SevenDayReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SevenDayReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SevenDayReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SevenDayNode. */
export interface IPB_SevenDayNode {

    /** PB_SevenDayNode dayId */
    dayId?: (number|null);

    /** PB_SevenDayNode taskProgress */
    taskProgress?: (number[]|null);

    /** PB_SevenDayNode taskFetch */
    taskFetch?: (boolean[]|null);
}

/** Represents a PB_SevenDayNode. */
export class PB_SevenDayNode implements IPB_SevenDayNode {

    /**
     * Constructs a new PB_SevenDayNode.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SevenDayNode);

    /** PB_SevenDayNode dayId. */
    public dayId: number;

    /** PB_SevenDayNode taskProgress. */
    public taskProgress: number[];

    /** PB_SevenDayNode taskFetch. */
    public taskFetch: boolean[];

    /**
     * Creates a new PB_SevenDayNode instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SevenDayNode instance
     */
    public static create(properties?: IPB_SevenDayNode): PB_SevenDayNode;

    /**
     * Encodes the specified PB_SevenDayNode message. Does not implicitly {@link PB_SevenDayNode.verify|verify} messages.
     * @param message PB_SevenDayNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SevenDayNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SevenDayNode message, length delimited. Does not implicitly {@link PB_SevenDayNode.verify|verify} messages.
     * @param message PB_SevenDayNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SevenDayNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SevenDayNode message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SevenDayNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SevenDayNode;

    /**
     * Decodes a PB_SevenDayNode message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SevenDayNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SevenDayNode;

    /**
     * Verifies a PB_SevenDayNode message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SevenDayNode message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SevenDayNode
     */
    public static fromObject(object: { [k: string]: any }): PB_SevenDayNode;

    /**
     * Creates a plain object from a PB_SevenDayNode message. Also converts values to other types if specified.
     * @param message PB_SevenDayNode
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SevenDayNode, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SevenDayNode to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SevenDayInfo. */
export interface IPB_SevenDayInfo {

    /** PB_SevenDayInfo stageRewardFlag */
    stageRewardFlag?: (number|null);

    /** PB_SevenDayInfo activityEndTime */
    activityEndTime?: (number|null);

    /** PB_SevenDayInfo taskList */
    taskList?: (IPB_SevenDayNode[]|null);

    /** PB_SevenDayInfo sendType */
    sendType?: (number|null);

    /** PB_SevenDayInfo nowStage */
    nowStage?: (number|null);
}

/** Represents a PB_SevenDayInfo. */
export class PB_SevenDayInfo implements IPB_SevenDayInfo {

    /**
     * Constructs a new PB_SevenDayInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SevenDayInfo);

    /** PB_SevenDayInfo stageRewardFlag. */
    public stageRewardFlag: number;

    /** PB_SevenDayInfo activityEndTime. */
    public activityEndTime: number;

    /** PB_SevenDayInfo taskList. */
    public taskList: IPB_SevenDayNode[];

    /** PB_SevenDayInfo sendType. */
    public sendType: number;

    /** PB_SevenDayInfo nowStage. */
    public nowStage: number;

    /**
     * Creates a new PB_SevenDayInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SevenDayInfo instance
     */
    public static create(properties?: IPB_SevenDayInfo): PB_SevenDayInfo;

    /**
     * Encodes the specified PB_SevenDayInfo message. Does not implicitly {@link PB_SevenDayInfo.verify|verify} messages.
     * @param message PB_SevenDayInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SevenDayInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SevenDayInfo message, length delimited. Does not implicitly {@link PB_SevenDayInfo.verify|verify} messages.
     * @param message PB_SevenDayInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SevenDayInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SevenDayInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SevenDayInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SevenDayInfo;

    /**
     * Decodes a PB_SevenDayInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SevenDayInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SevenDayInfo;

    /**
     * Verifies a PB_SevenDayInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SevenDayInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SevenDayInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SevenDayInfo;

    /**
     * Creates a plain object from a PB_SevenDayInfo message. Also converts values to other types if specified.
     * @param message PB_SevenDayInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SevenDayInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SevenDayInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_DailyFBNode. */
export interface IPB_DailyFBNode {

    /** PB_DailyFBNode fbType */
    fbType?: (number|null);

    /** PB_DailyFBNode fbLevel */
    fbLevel?: (number|null);

    /** PB_DailyFBNode fbRound */
    fbRound?: (number|null);

    /** PB_DailyFBNode fightCount */
    fightCount?: (number|null);
}

/** Represents a PB_DailyFBNode. */
export class PB_DailyFBNode implements IPB_DailyFBNode {

    /**
     * Constructs a new PB_DailyFBNode.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_DailyFBNode);

    /** PB_DailyFBNode fbType. */
    public fbType: number;

    /** PB_DailyFBNode fbLevel. */
    public fbLevel: number;

    /** PB_DailyFBNode fbRound. */
    public fbRound: number;

    /** PB_DailyFBNode fightCount. */
    public fightCount: number;

    /**
     * Creates a new PB_DailyFBNode instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_DailyFBNode instance
     */
    public static create(properties?: IPB_DailyFBNode): PB_DailyFBNode;

    /**
     * Encodes the specified PB_DailyFBNode message. Does not implicitly {@link PB_DailyFBNode.verify|verify} messages.
     * @param message PB_DailyFBNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_DailyFBNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_DailyFBNode message, length delimited. Does not implicitly {@link PB_DailyFBNode.verify|verify} messages.
     * @param message PB_DailyFBNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_DailyFBNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_DailyFBNode message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_DailyFBNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_DailyFBNode;

    /**
     * Decodes a PB_DailyFBNode message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_DailyFBNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_DailyFBNode;

    /**
     * Verifies a PB_DailyFBNode message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_DailyFBNode message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_DailyFBNode
     */
    public static fromObject(object: { [k: string]: any }): PB_DailyFBNode;

    /**
     * Creates a plain object from a PB_DailyFBNode message. Also converts values to other types if specified.
     * @param message PB_DailyFBNode
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_DailyFBNode, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_DailyFBNode to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_DailyFBOper. */
export interface IPB_DailyFBOper {

    /** PB_DailyFBOper operType */
    operType?: (number|null);

    /** PB_DailyFBOper param */
    param?: (number[]|null);
}

/** Represents a PB_DailyFBOper. */
export class PB_DailyFBOper implements IPB_DailyFBOper {

    /**
     * Constructs a new PB_DailyFBOper.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_DailyFBOper);

    /** PB_DailyFBOper operType. */
    public operType: number;

    /** PB_DailyFBOper param. */
    public param: number[];

    /**
     * Creates a new PB_DailyFBOper instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_DailyFBOper instance
     */
    public static create(properties?: IPB_DailyFBOper): PB_DailyFBOper;

    /**
     * Encodes the specified PB_DailyFBOper message. Does not implicitly {@link PB_DailyFBOper.verify|verify} messages.
     * @param message PB_DailyFBOper message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_DailyFBOper, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_DailyFBOper message, length delimited. Does not implicitly {@link PB_DailyFBOper.verify|verify} messages.
     * @param message PB_DailyFBOper message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_DailyFBOper, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_DailyFBOper message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_DailyFBOper
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_DailyFBOper;

    /**
     * Decodes a PB_DailyFBOper message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_DailyFBOper
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_DailyFBOper;

    /**
     * Verifies a PB_DailyFBOper message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_DailyFBOper message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_DailyFBOper
     */
    public static fromObject(object: { [k: string]: any }): PB_DailyFBOper;

    /**
     * Creates a plain object from a PB_DailyFBOper message. Also converts values to other types if specified.
     * @param message PB_DailyFBOper
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_DailyFBOper, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_DailyFBOper to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_DailyFBInfo. */
export interface IPB_DailyFBInfo {

    /** PB_DailyFBInfo sendType */
    sendType?: (number|null);

    /** PB_DailyFBInfo fbList */
    fbList?: (IPB_DailyFBNode[]|null);
}

/** Represents a PB_DailyFBInfo. */
export class PB_DailyFBInfo implements IPB_DailyFBInfo {

    /**
     * Constructs a new PB_DailyFBInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_DailyFBInfo);

    /** PB_DailyFBInfo sendType. */
    public sendType: number;

    /** PB_DailyFBInfo fbList. */
    public fbList: IPB_DailyFBNode[];

    /**
     * Creates a new PB_DailyFBInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_DailyFBInfo instance
     */
    public static create(properties?: IPB_DailyFBInfo): PB_DailyFBInfo;

    /**
     * Encodes the specified PB_DailyFBInfo message. Does not implicitly {@link PB_DailyFBInfo.verify|verify} messages.
     * @param message PB_DailyFBInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_DailyFBInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_DailyFBInfo message, length delimited. Does not implicitly {@link PB_DailyFBInfo.verify|verify} messages.
     * @param message PB_DailyFBInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_DailyFBInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_DailyFBInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_DailyFBInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_DailyFBInfo;

    /**
     * Decodes a PB_DailyFBInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_DailyFBInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_DailyFBInfo;

    /**
     * Verifies a PB_DailyFBInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_DailyFBInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_DailyFBInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_DailyFBInfo;

    /**
     * Creates a plain object from a PB_DailyFBInfo message. Also converts values to other types if specified.
     * @param message PB_DailyFBInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_DailyFBInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_DailyFBInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCAdvertisementInfo. */
export interface IPB_SCAdvertisementInfo {

    /** PB_SCAdvertisementInfo adList */
    adList?: (IPB_SCAdvertisement[]|null);

    /** PB_SCAdvertisementInfo isInit */
    isInit?: (number|null);
}

/** Represents a PB_SCAdvertisementInfo. */
export class PB_SCAdvertisementInfo implements IPB_SCAdvertisementInfo {

    /**
     * Constructs a new PB_SCAdvertisementInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCAdvertisementInfo);

    /** PB_SCAdvertisementInfo adList. */
    public adList: IPB_SCAdvertisement[];

    /** PB_SCAdvertisementInfo isInit. */
    public isInit: number;

    /**
     * Creates a new PB_SCAdvertisementInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCAdvertisementInfo instance
     */
    public static create(properties?: IPB_SCAdvertisementInfo): PB_SCAdvertisementInfo;

    /**
     * Encodes the specified PB_SCAdvertisementInfo message. Does not implicitly {@link PB_SCAdvertisementInfo.verify|verify} messages.
     * @param message PB_SCAdvertisementInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCAdvertisementInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCAdvertisementInfo message, length delimited. Does not implicitly {@link PB_SCAdvertisementInfo.verify|verify} messages.
     * @param message PB_SCAdvertisementInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCAdvertisementInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCAdvertisementInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCAdvertisementInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCAdvertisementInfo;

    /**
     * Decodes a PB_SCAdvertisementInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCAdvertisementInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCAdvertisementInfo;

    /**
     * Verifies a PB_SCAdvertisementInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCAdvertisementInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCAdvertisementInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCAdvertisementInfo;

    /**
     * Creates a plain object from a PB_SCAdvertisementInfo message. Also converts values to other types if specified.
     * @param message PB_SCAdvertisementInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCAdvertisementInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCAdvertisementInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSAdvertisementFetch. */
export interface IPB_CSAdvertisementFetch {

    /** PB_CSAdvertisementFetch seq */
    seq?: (number|null);

    /** PB_CSAdvertisementFetch isDia */
    isDia?: (number|null);

    /** PB_CSAdvertisementFetch param */
    param?: (number|null);
}

/** Represents a PB_CSAdvertisementFetch. */
export class PB_CSAdvertisementFetch implements IPB_CSAdvertisementFetch {

    /**
     * Constructs a new PB_CSAdvertisementFetch.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSAdvertisementFetch);

    /** PB_CSAdvertisementFetch seq. */
    public seq: number;

    /** PB_CSAdvertisementFetch isDia. */
    public isDia: number;

    /** PB_CSAdvertisementFetch param. */
    public param: number;

    /**
     * Creates a new PB_CSAdvertisementFetch instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSAdvertisementFetch instance
     */
    public static create(properties?: IPB_CSAdvertisementFetch): PB_CSAdvertisementFetch;

    /**
     * Encodes the specified PB_CSAdvertisementFetch message. Does not implicitly {@link PB_CSAdvertisementFetch.verify|verify} messages.
     * @param message PB_CSAdvertisementFetch message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSAdvertisementFetch, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSAdvertisementFetch message, length delimited. Does not implicitly {@link PB_CSAdvertisementFetch.verify|verify} messages.
     * @param message PB_CSAdvertisementFetch message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSAdvertisementFetch, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSAdvertisementFetch message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSAdvertisementFetch
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSAdvertisementFetch;

    /**
     * Decodes a PB_CSAdvertisementFetch message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSAdvertisementFetch
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSAdvertisementFetch;

    /**
     * Verifies a PB_CSAdvertisementFetch message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSAdvertisementFetch message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSAdvertisementFetch
     */
    public static fromObject(object: { [k: string]: any }): PB_CSAdvertisementFetch;

    /**
     * Creates a plain object from a PB_CSAdvertisementFetch message. Also converts values to other types if specified.
     * @param message PB_CSAdvertisementFetch
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSAdvertisementFetch, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSAdvertisementFetch to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSFirstRechargeOper. */
export interface IPB_CSFirstRechargeOper {
}

/** Represents a PB_CSFirstRechargeOper. */
export class PB_CSFirstRechargeOper implements IPB_CSFirstRechargeOper {

    /**
     * Constructs a new PB_CSFirstRechargeOper.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSFirstRechargeOper);

    /**
     * Creates a new PB_CSFirstRechargeOper instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSFirstRechargeOper instance
     */
    public static create(properties?: IPB_CSFirstRechargeOper): PB_CSFirstRechargeOper;

    /**
     * Encodes the specified PB_CSFirstRechargeOper message. Does not implicitly {@link PB_CSFirstRechargeOper.verify|verify} messages.
     * @param message PB_CSFirstRechargeOper message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSFirstRechargeOper, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSFirstRechargeOper message, length delimited. Does not implicitly {@link PB_CSFirstRechargeOper.verify|verify} messages.
     * @param message PB_CSFirstRechargeOper message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSFirstRechargeOper, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSFirstRechargeOper message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSFirstRechargeOper
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSFirstRechargeOper;

    /**
     * Decodes a PB_CSFirstRechargeOper message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSFirstRechargeOper
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSFirstRechargeOper;

    /**
     * Verifies a PB_CSFirstRechargeOper message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSFirstRechargeOper message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSFirstRechargeOper
     */
    public static fromObject(object: { [k: string]: any }): PB_CSFirstRechargeOper;

    /**
     * Creates a plain object from a PB_CSFirstRechargeOper message. Also converts values to other types if specified.
     * @param message PB_CSFirstRechargeOper
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSFirstRechargeOper, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSFirstRechargeOper to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCFirstRechargeInfo. */
export interface IPB_SCFirstRechargeInfo {

    /** PB_SCFirstRechargeInfo isActive */
    isActive?: (boolean|null);

    /** PB_SCFirstRechargeInfo isFetch */
    isFetch?: (boolean|null);
}

/** Represents a PB_SCFirstRechargeInfo. */
export class PB_SCFirstRechargeInfo implements IPB_SCFirstRechargeInfo {

    /**
     * Constructs a new PB_SCFirstRechargeInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCFirstRechargeInfo);

    /** PB_SCFirstRechargeInfo isActive. */
    public isActive: boolean;

    /** PB_SCFirstRechargeInfo isFetch. */
    public isFetch: boolean;

    /**
     * Creates a new PB_SCFirstRechargeInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCFirstRechargeInfo instance
     */
    public static create(properties?: IPB_SCFirstRechargeInfo): PB_SCFirstRechargeInfo;

    /**
     * Encodes the specified PB_SCFirstRechargeInfo message. Does not implicitly {@link PB_SCFirstRechargeInfo.verify|verify} messages.
     * @param message PB_SCFirstRechargeInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCFirstRechargeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCFirstRechargeInfo message, length delimited. Does not implicitly {@link PB_SCFirstRechargeInfo.verify|verify} messages.
     * @param message PB_SCFirstRechargeInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCFirstRechargeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCFirstRechargeInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCFirstRechargeInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCFirstRechargeInfo;

    /**
     * Decodes a PB_SCFirstRechargeInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCFirstRechargeInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCFirstRechargeInfo;

    /**
     * Verifies a PB_SCFirstRechargeInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCFirstRechargeInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCFirstRechargeInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCFirstRechargeInfo;

    /**
     * Creates a plain object from a PB_SCFirstRechargeInfo message. Also converts values to other types if specified.
     * @param message PB_SCFirstRechargeInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCFirstRechargeInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCFirstRechargeInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCBattleRevive. */
export interface IPB_SCBattleRevive {

    /** PB_SCBattleRevive reviveHp */
    reviveHp?: (number|null);
}

/** Represents a PB_SCBattleRevive. */
export class PB_SCBattleRevive implements IPB_SCBattleRevive {

    /**
     * Constructs a new PB_SCBattleRevive.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCBattleRevive);

    /** PB_SCBattleRevive reviveHp. */
    public reviveHp: number;

    /**
     * Creates a new PB_SCBattleRevive instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCBattleRevive instance
     */
    public static create(properties?: IPB_SCBattleRevive): PB_SCBattleRevive;

    /**
     * Encodes the specified PB_SCBattleRevive message. Does not implicitly {@link PB_SCBattleRevive.verify|verify} messages.
     * @param message PB_SCBattleRevive message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCBattleRevive, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCBattleRevive message, length delimited. Does not implicitly {@link PB_SCBattleRevive.verify|verify} messages.
     * @param message PB_SCBattleRevive message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCBattleRevive, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCBattleRevive message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCBattleRevive
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCBattleRevive;

    /**
     * Decodes a PB_SCBattleRevive message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCBattleRevive
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCBattleRevive;

    /**
     * Verifies a PB_SCBattleRevive message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCBattleRevive message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCBattleRevive
     */
    public static fromObject(object: { [k: string]: any }): PB_SCBattleRevive;

    /**
     * Creates a plain object from a PB_SCBattleRevive message. Also converts values to other types if specified.
     * @param message PB_SCBattleRevive
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCBattleRevive, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCBattleRevive to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCBattleBuffRefresh. */
export interface IPB_SCBattleBuffRefresh {
}

/** Represents a PB_SCBattleBuffRefresh. */
export class PB_SCBattleBuffRefresh implements IPB_SCBattleBuffRefresh {

    /**
     * Constructs a new PB_SCBattleBuffRefresh.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCBattleBuffRefresh);

    /**
     * Creates a new PB_SCBattleBuffRefresh instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCBattleBuffRefresh instance
     */
    public static create(properties?: IPB_SCBattleBuffRefresh): PB_SCBattleBuffRefresh;

    /**
     * Encodes the specified PB_SCBattleBuffRefresh message. Does not implicitly {@link PB_SCBattleBuffRefresh.verify|verify} messages.
     * @param message PB_SCBattleBuffRefresh message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCBattleBuffRefresh, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCBattleBuffRefresh message, length delimited. Does not implicitly {@link PB_SCBattleBuffRefresh.verify|verify} messages.
     * @param message PB_SCBattleBuffRefresh message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCBattleBuffRefresh, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCBattleBuffRefresh message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCBattleBuffRefresh
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCBattleBuffRefresh;

    /**
     * Decodes a PB_SCBattleBuffRefresh message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCBattleBuffRefresh
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCBattleBuffRefresh;

    /**
     * Verifies a PB_SCBattleBuffRefresh message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCBattleBuffRefresh message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCBattleBuffRefresh
     */
    public static fromObject(object: { [k: string]: any }): PB_SCBattleBuffRefresh;

    /**
     * Creates a plain object from a PB_SCBattleBuffRefresh message. Also converts values to other types if specified.
     * @param message PB_SCBattleBuffRefresh
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCBattleBuffRefresh, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCBattleBuffRefresh to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCBattleSpeed3. */
export interface IPB_SCBattleSpeed3 {
}

/** Represents a PB_SCBattleSpeed3. */
export class PB_SCBattleSpeed3 implements IPB_SCBattleSpeed3 {

    /**
     * Constructs a new PB_SCBattleSpeed3.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCBattleSpeed3);

    /**
     * Creates a new PB_SCBattleSpeed3 instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCBattleSpeed3 instance
     */
    public static create(properties?: IPB_SCBattleSpeed3): PB_SCBattleSpeed3;

    /**
     * Encodes the specified PB_SCBattleSpeed3 message. Does not implicitly {@link PB_SCBattleSpeed3.verify|verify} messages.
     * @param message PB_SCBattleSpeed3 message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCBattleSpeed3, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCBattleSpeed3 message, length delimited. Does not implicitly {@link PB_SCBattleSpeed3.verify|verify} messages.
     * @param message PB_SCBattleSpeed3 message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCBattleSpeed3, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCBattleSpeed3 message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCBattleSpeed3
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCBattleSpeed3;

    /**
     * Decodes a PB_SCBattleSpeed3 message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCBattleSpeed3
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCBattleSpeed3;

    /**
     * Verifies a PB_SCBattleSpeed3 message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCBattleSpeed3 message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCBattleSpeed3
     */
    public static fromObject(object: { [k: string]: any }): PB_SCBattleSpeed3;

    /**
     * Creates a plain object from a PB_SCBattleSpeed3 message. Also converts values to other types if specified.
     * @param message PB_SCBattleSpeed3
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCBattleSpeed3, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCBattleSpeed3 to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCAdPassInfo. */
export interface IPB_SCAdPassInfo {

    /** PB_SCAdPassInfo isActive */
    isActive?: (boolean|null);
}

/** Represents a PB_SCAdPassInfo. */
export class PB_SCAdPassInfo implements IPB_SCAdPassInfo {

    /**
     * Constructs a new PB_SCAdPassInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCAdPassInfo);

    /** PB_SCAdPassInfo isActive. */
    public isActive: boolean;

    /**
     * Creates a new PB_SCAdPassInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCAdPassInfo instance
     */
    public static create(properties?: IPB_SCAdPassInfo): PB_SCAdPassInfo;

    /**
     * Encodes the specified PB_SCAdPassInfo message. Does not implicitly {@link PB_SCAdPassInfo.verify|verify} messages.
     * @param message PB_SCAdPassInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCAdPassInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCAdPassInfo message, length delimited. Does not implicitly {@link PB_SCAdPassInfo.verify|verify} messages.
     * @param message PB_SCAdPassInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCAdPassInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCAdPassInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCAdPassInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCAdPassInfo;

    /**
     * Decodes a PB_SCAdPassInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCAdPassInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCAdPassInfo;

    /**
     * Verifies a PB_SCAdPassInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCAdPassInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCAdPassInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCAdPassInfo;

    /**
     * Creates a plain object from a PB_SCAdPassInfo message. Also converts values to other types if specified.
     * @param message PB_SCAdPassInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCAdPassInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCAdPassInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSMiningCaveReq. */
export interface IPB_CSMiningCaveReq {

    /** PB_CSMiningCaveReq opType */
    opType?: (number|null);

    /** PB_CSMiningCaveReq p1 */
    p1?: (number|null);

    /** PB_CSMiningCaveReq p2 */
    p2?: (number|null);
}

/** Represents a PB_CSMiningCaveReq. */
export class PB_CSMiningCaveReq implements IPB_CSMiningCaveReq {

    /**
     * Constructs a new PB_CSMiningCaveReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSMiningCaveReq);

    /** PB_CSMiningCaveReq opType. */
    public opType: number;

    /** PB_CSMiningCaveReq p1. */
    public p1: number;

    /** PB_CSMiningCaveReq p2. */
    public p2: number;

    /**
     * Creates a new PB_CSMiningCaveReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSMiningCaveReq instance
     */
    public static create(properties?: IPB_CSMiningCaveReq): PB_CSMiningCaveReq;

    /**
     * Encodes the specified PB_CSMiningCaveReq message. Does not implicitly {@link PB_CSMiningCaveReq.verify|verify} messages.
     * @param message PB_CSMiningCaveReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSMiningCaveReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSMiningCaveReq message, length delimited. Does not implicitly {@link PB_CSMiningCaveReq.verify|verify} messages.
     * @param message PB_CSMiningCaveReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSMiningCaveReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSMiningCaveReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSMiningCaveReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSMiningCaveReq;

    /**
     * Decodes a PB_CSMiningCaveReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSMiningCaveReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSMiningCaveReq;

    /**
     * Verifies a PB_CSMiningCaveReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSMiningCaveReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSMiningCaveReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSMiningCaveReq;

    /**
     * Creates a plain object from a PB_CSMiningCaveReq message. Also converts values to other types if specified.
     * @param message PB_CSMiningCaveReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSMiningCaveReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSMiningCaveReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCMiningCaveCold. */
export interface IPB_SCMiningCaveCold {

    /** PB_SCMiningCaveCold coldType */
    coldType?: (number|null);

    /** PB_SCMiningCaveCold excavateCount */
    excavateCount?: (number|null);
}

/** Represents a PB_SCMiningCaveCold. */
export class PB_SCMiningCaveCold implements IPB_SCMiningCaveCold {

    /**
     * Constructs a new PB_SCMiningCaveCold.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCMiningCaveCold);

    /** PB_SCMiningCaveCold coldType. */
    public coldType: number;

    /** PB_SCMiningCaveCold excavateCount. */
    public excavateCount: number;

    /**
     * Creates a new PB_SCMiningCaveCold instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCMiningCaveCold instance
     */
    public static create(properties?: IPB_SCMiningCaveCold): PB_SCMiningCaveCold;

    /**
     * Encodes the specified PB_SCMiningCaveCold message. Does not implicitly {@link PB_SCMiningCaveCold.verify|verify} messages.
     * @param message PB_SCMiningCaveCold message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCMiningCaveCold, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCMiningCaveCold message, length delimited. Does not implicitly {@link PB_SCMiningCaveCold.verify|verify} messages.
     * @param message PB_SCMiningCaveCold message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCMiningCaveCold, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCMiningCaveCold message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCMiningCaveCold
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCMiningCaveCold;

    /**
     * Decodes a PB_SCMiningCaveCold message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCMiningCaveCold
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCMiningCaveCold;

    /**
     * Verifies a PB_SCMiningCaveCold message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCMiningCaveCold message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCMiningCaveCold
     */
    public static fromObject(object: { [k: string]: any }): PB_SCMiningCaveCold;

    /**
     * Creates a plain object from a PB_SCMiningCaveCold message. Also converts values to other types if specified.
     * @param message PB_SCMiningCaveCold
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCMiningCaveCold, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCMiningCaveCold to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCMiningCaveInfo. */
export interface IPB_SCMiningCaveInfo {

    /** PB_SCMiningCaveInfo excavateReplyTime */
    excavateReplyTime?: (number|Long|null);

    /** PB_SCMiningCaveInfo nowHigh */
    nowHigh?: (number|Long|null);

    /** PB_SCMiningCaveInfo coldList */
    coldList?: (IPB_SCMiningCaveCold[]|null);

    /** PB_SCMiningCaveInfo metersReward */
    metersReward?: (boolean[]|null);
}

/** Represents a PB_SCMiningCaveInfo. */
export class PB_SCMiningCaveInfo implements IPB_SCMiningCaveInfo {

    /**
     * Constructs a new PB_SCMiningCaveInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCMiningCaveInfo);

    /** PB_SCMiningCaveInfo excavateReplyTime. */
    public excavateReplyTime: (number|Long);

    /** PB_SCMiningCaveInfo nowHigh. */
    public nowHigh: (number|Long);

    /** PB_SCMiningCaveInfo coldList. */
    public coldList: IPB_SCMiningCaveCold[];

    /** PB_SCMiningCaveInfo metersReward. */
    public metersReward: boolean[];

    /**
     * Creates a new PB_SCMiningCaveInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCMiningCaveInfo instance
     */
    public static create(properties?: IPB_SCMiningCaveInfo): PB_SCMiningCaveInfo;

    /**
     * Encodes the specified PB_SCMiningCaveInfo message. Does not implicitly {@link PB_SCMiningCaveInfo.verify|verify} messages.
     * @param message PB_SCMiningCaveInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCMiningCaveInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCMiningCaveInfo message, length delimited. Does not implicitly {@link PB_SCMiningCaveInfo.verify|verify} messages.
     * @param message PB_SCMiningCaveInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCMiningCaveInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCMiningCaveInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCMiningCaveInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCMiningCaveInfo;

    /**
     * Decodes a PB_SCMiningCaveInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCMiningCaveInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCMiningCaveInfo;

    /**
     * Verifies a PB_SCMiningCaveInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCMiningCaveInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCMiningCaveInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCMiningCaveInfo;

    /**
     * Creates a plain object from a PB_SCMiningCaveInfo message. Also converts values to other types if specified.
     * @param message PB_SCMiningCaveInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCMiningCaveInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCMiningCaveInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCInstituteInfo. */
export interface IPB_SCInstituteInfo {

    /** PB_SCInstituteInfo talentLevel */
    talentLevel?: (number[]|null);

    /** PB_SCInstituteInfo upTalentTime */
    upTalentTime?: (number|Long|null);

    /** PB_SCInstituteInfo upTalentId */
    upTalentId?: (number|null);
}

/** Represents a PB_SCInstituteInfo. */
export class PB_SCInstituteInfo implements IPB_SCInstituteInfo {

    /**
     * Constructs a new PB_SCInstituteInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCInstituteInfo);

    /** PB_SCInstituteInfo talentLevel. */
    public talentLevel: number[];

    /** PB_SCInstituteInfo upTalentTime. */
    public upTalentTime: (number|Long);

    /** PB_SCInstituteInfo upTalentId. */
    public upTalentId: number;

    /**
     * Creates a new PB_SCInstituteInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCInstituteInfo instance
     */
    public static create(properties?: IPB_SCInstituteInfo): PB_SCInstituteInfo;

    /**
     * Encodes the specified PB_SCInstituteInfo message. Does not implicitly {@link PB_SCInstituteInfo.verify|verify} messages.
     * @param message PB_SCInstituteInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCInstituteInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCInstituteInfo message, length delimited. Does not implicitly {@link PB_SCInstituteInfo.verify|verify} messages.
     * @param message PB_SCInstituteInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCInstituteInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCInstituteInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCInstituteInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCInstituteInfo;

    /**
     * Decodes a PB_SCInstituteInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCInstituteInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCInstituteInfo;

    /**
     * Verifies a PB_SCInstituteInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCInstituteInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCInstituteInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCInstituteInfo;

    /**
     * Creates a plain object from a PB_SCInstituteInfo message. Also converts values to other types if specified.
     * @param message PB_SCInstituteInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCInstituteInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCInstituteInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCHerotrialInfo. */
export interface IPB_SCHerotrialInfo {

    /** PB_SCHerotrialInfo isFetch */
    isFetch?: (boolean[]|null);
}

/** Represents a PB_SCHerotrialInfo. */
export class PB_SCHerotrialInfo implements IPB_SCHerotrialInfo {

    /**
     * Constructs a new PB_SCHerotrialInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCHerotrialInfo);

    /** PB_SCHerotrialInfo isFetch. */
    public isFetch: boolean[];

    /**
     * Creates a new PB_SCHerotrialInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCHerotrialInfo instance
     */
    public static create(properties?: IPB_SCHerotrialInfo): PB_SCHerotrialInfo;

    /**
     * Encodes the specified PB_SCHerotrialInfo message. Does not implicitly {@link PB_SCHerotrialInfo.verify|verify} messages.
     * @param message PB_SCHerotrialInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCHerotrialInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCHerotrialInfo message, length delimited. Does not implicitly {@link PB_SCHerotrialInfo.verify|verify} messages.
     * @param message PB_SCHerotrialInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCHerotrialInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCHerotrialInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCHerotrialInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCHerotrialInfo;

    /**
     * Decodes a PB_SCHerotrialInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCHerotrialInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCHerotrialInfo;

    /**
     * Verifies a PB_SCHerotrialInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCHerotrialInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCHerotrialInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCHerotrialInfo;

    /**
     * Creates a plain object from a PB_SCHerotrialInfo message. Also converts values to other types if specified.
     * @param message PB_SCHerotrialInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCHerotrialInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCHerotrialInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSGameCircleReq. */
export interface IPB_CSGameCircleReq {

    /** PB_CSGameCircleReq reqType */
    reqType?: (number|null);

    /** PB_CSGameCircleReq reqParam */
    reqParam?: (number[]|null);
}

/** Represents a PB_CSGameCircleReq. */
export class PB_CSGameCircleReq implements IPB_CSGameCircleReq {

    /**
     * Constructs a new PB_CSGameCircleReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSGameCircleReq);

    /** PB_CSGameCircleReq reqType. */
    public reqType: number;

    /** PB_CSGameCircleReq reqParam. */
    public reqParam: number[];

    /**
     * Creates a new PB_CSGameCircleReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSGameCircleReq instance
     */
    public static create(properties?: IPB_CSGameCircleReq): PB_CSGameCircleReq;

    /**
     * Encodes the specified PB_CSGameCircleReq message. Does not implicitly {@link PB_CSGameCircleReq.verify|verify} messages.
     * @param message PB_CSGameCircleReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSGameCircleReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSGameCircleReq message, length delimited. Does not implicitly {@link PB_CSGameCircleReq.verify|verify} messages.
     * @param message PB_CSGameCircleReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSGameCircleReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSGameCircleReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSGameCircleReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSGameCircleReq;

    /**
     * Decodes a PB_CSGameCircleReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSGameCircleReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSGameCircleReq;

    /**
     * Verifies a PB_CSGameCircleReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSGameCircleReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSGameCircleReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSGameCircleReq;

    /**
     * Creates a plain object from a PB_CSGameCircleReq message. Also converts values to other types if specified.
     * @param message PB_CSGameCircleReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSGameCircleReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSGameCircleReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCGameCircleInfo. */
export interface IPB_SCGameCircleInfo {

    /** PB_SCGameCircleInfo todaySignIn */
    todaySignIn?: (boolean|null);

    /** PB_SCGameCircleInfo newReward */
    newReward?: (boolean|null);

    /** PB_SCGameCircleInfo signCount */
    signCount?: (number|null);

    /** PB_SCGameCircleInfo likeCount */
    likeCount?: (number|null);
}

/** Represents a PB_SCGameCircleInfo. */
export class PB_SCGameCircleInfo implements IPB_SCGameCircleInfo {

    /**
     * Constructs a new PB_SCGameCircleInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCGameCircleInfo);

    /** PB_SCGameCircleInfo todaySignIn. */
    public todaySignIn: boolean;

    /** PB_SCGameCircleInfo newReward. */
    public newReward: boolean;

    /** PB_SCGameCircleInfo signCount. */
    public signCount: number;

    /** PB_SCGameCircleInfo likeCount. */
    public likeCount: number;

    /**
     * Creates a new PB_SCGameCircleInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCGameCircleInfo instance
     */
    public static create(properties?: IPB_SCGameCircleInfo): PB_SCGameCircleInfo;

    /**
     * Encodes the specified PB_SCGameCircleInfo message. Does not implicitly {@link PB_SCGameCircleInfo.verify|verify} messages.
     * @param message PB_SCGameCircleInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCGameCircleInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCGameCircleInfo message, length delimited. Does not implicitly {@link PB_SCGameCircleInfo.verify|verify} messages.
     * @param message PB_SCGameCircleInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCGameCircleInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCGameCircleInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCGameCircleInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCGameCircleInfo;

    /**
     * Decodes a PB_SCGameCircleInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCGameCircleInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCGameCircleInfo;

    /**
     * Verifies a PB_SCGameCircleInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCGameCircleInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCGameCircleInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCGameCircleInfo;

    /**
     * Creates a plain object from a PB_SCGameCircleInfo message. Also converts values to other types if specified.
     * @param message PB_SCGameCircleInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCGameCircleInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCGameCircleInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSHorcruxesReq. */
export interface IPB_CSHorcruxesReq {

    /** PB_CSHorcruxesReq reqType */
    reqType?: (number|null);

    /** PB_CSHorcruxesReq reqParam */
    reqParam?: (number[]|null);
}

/** Represents a PB_CSHorcruxesReq. */
export class PB_CSHorcruxesReq implements IPB_CSHorcruxesReq {

    /**
     * Constructs a new PB_CSHorcruxesReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSHorcruxesReq);

    /** PB_CSHorcruxesReq reqType. */
    public reqType: number;

    /** PB_CSHorcruxesReq reqParam. */
    public reqParam: number[];

    /**
     * Creates a new PB_CSHorcruxesReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSHorcruxesReq instance
     */
    public static create(properties?: IPB_CSHorcruxesReq): PB_CSHorcruxesReq;

    /**
     * Encodes the specified PB_CSHorcruxesReq message. Does not implicitly {@link PB_CSHorcruxesReq.verify|verify} messages.
     * @param message PB_CSHorcruxesReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSHorcruxesReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSHorcruxesReq message, length delimited. Does not implicitly {@link PB_CSHorcruxesReq.verify|verify} messages.
     * @param message PB_CSHorcruxesReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSHorcruxesReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSHorcruxesReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSHorcruxesReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSHorcruxesReq;

    /**
     * Decodes a PB_CSHorcruxesReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSHorcruxesReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSHorcruxesReq;

    /**
     * Verifies a PB_CSHorcruxesReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSHorcruxesReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSHorcruxesReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSHorcruxesReq;

    /**
     * Creates a plain object from a PB_CSHorcruxesReq message. Also converts values to other types if specified.
     * @param message PB_CSHorcruxesReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSHorcruxesReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSHorcruxesReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCHorcruxesGift. */
export interface IPB_SCHorcruxesGift {

    /** PB_SCHorcruxesGift seq */
    seq?: (number|null);

    /** PB_SCHorcruxesGift endTime */
    endTime?: (number|Long|null);
}

/** Represents a PB_SCHorcruxesGift. */
export class PB_SCHorcruxesGift implements IPB_SCHorcruxesGift {

    /**
     * Constructs a new PB_SCHorcruxesGift.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCHorcruxesGift);

    /** PB_SCHorcruxesGift seq. */
    public seq: number;

    /** PB_SCHorcruxesGift endTime. */
    public endTime: (number|Long);

    /**
     * Creates a new PB_SCHorcruxesGift instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCHorcruxesGift instance
     */
    public static create(properties?: IPB_SCHorcruxesGift): PB_SCHorcruxesGift;

    /**
     * Encodes the specified PB_SCHorcruxesGift message. Does not implicitly {@link PB_SCHorcruxesGift.verify|verify} messages.
     * @param message PB_SCHorcruxesGift message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCHorcruxesGift, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCHorcruxesGift message, length delimited. Does not implicitly {@link PB_SCHorcruxesGift.verify|verify} messages.
     * @param message PB_SCHorcruxesGift message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCHorcruxesGift, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCHorcruxesGift message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCHorcruxesGift
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCHorcruxesGift;

    /**
     * Decodes a PB_SCHorcruxesGift message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCHorcruxesGift
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCHorcruxesGift;

    /**
     * Verifies a PB_SCHorcruxesGift message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCHorcruxesGift message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCHorcruxesGift
     */
    public static fromObject(object: { [k: string]: any }): PB_SCHorcruxesGift;

    /**
     * Creates a plain object from a PB_SCHorcruxesGift message. Also converts values to other types if specified.
     * @param message PB_SCHorcruxesGift
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCHorcruxesGift, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCHorcruxesGift to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCHorcruxesInfo. */
export interface IPB_SCHorcruxesInfo {

    /** PB_SCHorcruxesInfo drawTimesReward */
    drawTimesReward?: (boolean[]|null);

    /** PB_SCHorcruxesInfo shopBuyCount */
    shopBuyCount?: (number[]|null);

    /** PB_SCHorcruxesInfo giftList */
    giftList?: (IPB_SCHorcruxesGift[]|null);

    /** PB_SCHorcruxesInfo drawCount */
    drawCount?: (number|null);
}

/** Represents a PB_SCHorcruxesInfo. */
export class PB_SCHorcruxesInfo implements IPB_SCHorcruxesInfo {

    /**
     * Constructs a new PB_SCHorcruxesInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCHorcruxesInfo);

    /** PB_SCHorcruxesInfo drawTimesReward. */
    public drawTimesReward: boolean[];

    /** PB_SCHorcruxesInfo shopBuyCount. */
    public shopBuyCount: number[];

    /** PB_SCHorcruxesInfo giftList. */
    public giftList: IPB_SCHorcruxesGift[];

    /** PB_SCHorcruxesInfo drawCount. */
    public drawCount: number;

    /**
     * Creates a new PB_SCHorcruxesInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCHorcruxesInfo instance
     */
    public static create(properties?: IPB_SCHorcruxesInfo): PB_SCHorcruxesInfo;

    /**
     * Encodes the specified PB_SCHorcruxesInfo message. Does not implicitly {@link PB_SCHorcruxesInfo.verify|verify} messages.
     * @param message PB_SCHorcruxesInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCHorcruxesInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCHorcruxesInfo message, length delimited. Does not implicitly {@link PB_SCHorcruxesInfo.verify|verify} messages.
     * @param message PB_SCHorcruxesInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCHorcruxesInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCHorcruxesInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCHorcruxesInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCHorcruxesInfo;

    /**
     * Decodes a PB_SCHorcruxesInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCHorcruxesInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCHorcruxesInfo;

    /**
     * Verifies a PB_SCHorcruxesInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCHorcruxesInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCHorcruxesInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCHorcruxesInfo;

    /**
     * Creates a plain object from a PB_SCHorcruxesInfo message. Also converts values to other types if specified.
     * @param message PB_SCHorcruxesInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCHorcruxesInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCHorcruxesInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCHorcruxesRet. */
export interface IPB_SCHorcruxesRet {

    /** PB_SCHorcruxesRet retType */
    retType?: (number|null);

    /** PB_SCHorcruxesRet retParam */
    retParam?: (number[]|null);
}

/** Represents a PB_SCHorcruxesRet. */
export class PB_SCHorcruxesRet implements IPB_SCHorcruxesRet {

    /**
     * Constructs a new PB_SCHorcruxesRet.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCHorcruxesRet);

    /** PB_SCHorcruxesRet retType. */
    public retType: number;

    /** PB_SCHorcruxesRet retParam. */
    public retParam: number[];

    /**
     * Creates a new PB_SCHorcruxesRet instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCHorcruxesRet instance
     */
    public static create(properties?: IPB_SCHorcruxesRet): PB_SCHorcruxesRet;

    /**
     * Encodes the specified PB_SCHorcruxesRet message. Does not implicitly {@link PB_SCHorcruxesRet.verify|verify} messages.
     * @param message PB_SCHorcruxesRet message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCHorcruxesRet, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCHorcruxesRet message, length delimited. Does not implicitly {@link PB_SCHorcruxesRet.verify|verify} messages.
     * @param message PB_SCHorcruxesRet message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCHorcruxesRet, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCHorcruxesRet message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCHorcruxesRet
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCHorcruxesRet;

    /**
     * Decodes a PB_SCHorcruxesRet message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCHorcruxesRet
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCHorcruxesRet;

    /**
     * Verifies a PB_SCHorcruxesRet message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCHorcruxesRet message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCHorcruxesRet
     */
    public static fromObject(object: { [k: string]: any }): PB_SCHorcruxesRet;

    /**
     * Creates a plain object from a PB_SCHorcruxesRet message. Also converts values to other types if specified.
     * @param message PB_SCHorcruxesRet
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCHorcruxesRet, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCHorcruxesRet to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSRandActivityOperaReq. */
export interface IPB_CSRandActivityOperaReq {

    /** PB_CSRandActivityOperaReq randActivityType */
    randActivityType?: (number|null);

    /** PB_CSRandActivityOperaReq operaType */
    operaType?: (number|null);

    /** PB_CSRandActivityOperaReq param1 */
    param1?: (number|null);

    /** PB_CSRandActivityOperaReq param2 */
    param2?: (number|null);

    /** PB_CSRandActivityOperaReq param3 */
    param3?: (number|null);
}

/** Represents a PB_CSRandActivityOperaReq. */
export class PB_CSRandActivityOperaReq implements IPB_CSRandActivityOperaReq {

    /**
     * Constructs a new PB_CSRandActivityOperaReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSRandActivityOperaReq);

    /** PB_CSRandActivityOperaReq randActivityType. */
    public randActivityType: number;

    /** PB_CSRandActivityOperaReq operaType. */
    public operaType: number;

    /** PB_CSRandActivityOperaReq param1. */
    public param1: number;

    /** PB_CSRandActivityOperaReq param2. */
    public param2: number;

    /** PB_CSRandActivityOperaReq param3. */
    public param3: number;

    /**
     * Creates a new PB_CSRandActivityOperaReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSRandActivityOperaReq instance
     */
    public static create(properties?: IPB_CSRandActivityOperaReq): PB_CSRandActivityOperaReq;

    /**
     * Encodes the specified PB_CSRandActivityOperaReq message. Does not implicitly {@link PB_CSRandActivityOperaReq.verify|verify} messages.
     * @param message PB_CSRandActivityOperaReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSRandActivityOperaReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSRandActivityOperaReq message, length delimited. Does not implicitly {@link PB_CSRandActivityOperaReq.verify|verify} messages.
     * @param message PB_CSRandActivityOperaReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSRandActivityOperaReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSRandActivityOperaReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSRandActivityOperaReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSRandActivityOperaReq;

    /**
     * Decodes a PB_CSRandActivityOperaReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSRandActivityOperaReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSRandActivityOperaReq;

    /**
     * Verifies a PB_CSRandActivityOperaReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSRandActivityOperaReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSRandActivityOperaReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSRandActivityOperaReq;

    /**
     * Creates a plain object from a PB_CSRandActivityOperaReq message. Also converts values to other types if specified.
     * @param message PB_CSRandActivityOperaReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSRandActivityOperaReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSRandActivityOperaReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCChongZhiInfo. */
export interface IPB_SCChongZhiInfo {

    /** PB_SCChongZhiInfo historyChongzhi */
    historyChongzhi?: (number|Long|null);

    /** PB_SCChongZhiInfo historyChongzhiCount */
    historyChongzhiCount?: (number|null);

    /** PB_SCChongZhiInfo todayChongzhi */
    todayChongzhi?: (number|null);

    /** PB_SCChongZhiInfo chongzhiRewardTimes */
    chongzhiRewardTimes?: (number[]|null);
}

/** Represents a PB_SCChongZhiInfo. */
export class PB_SCChongZhiInfo implements IPB_SCChongZhiInfo {

    /**
     * Constructs a new PB_SCChongZhiInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCChongZhiInfo);

    /** PB_SCChongZhiInfo historyChongzhi. */
    public historyChongzhi: (number|Long);

    /** PB_SCChongZhiInfo historyChongzhiCount. */
    public historyChongzhiCount: number;

    /** PB_SCChongZhiInfo todayChongzhi. */
    public todayChongzhi: number;

    /** PB_SCChongZhiInfo chongzhiRewardTimes. */
    public chongzhiRewardTimes: number[];

    /**
     * Creates a new PB_SCChongZhiInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCChongZhiInfo instance
     */
    public static create(properties?: IPB_SCChongZhiInfo): PB_SCChongZhiInfo;

    /**
     * Encodes the specified PB_SCChongZhiInfo message. Does not implicitly {@link PB_SCChongZhiInfo.verify|verify} messages.
     * @param message PB_SCChongZhiInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCChongZhiInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCChongZhiInfo message, length delimited. Does not implicitly {@link PB_SCChongZhiInfo.verify|verify} messages.
     * @param message PB_SCChongZhiInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCChongZhiInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCChongZhiInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCChongZhiInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCChongZhiInfo;

    /**
     * Decodes a PB_SCChongZhiInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCChongZhiInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCChongZhiInfo;

    /**
     * Verifies a PB_SCChongZhiInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCChongZhiInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCChongZhiInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCChongZhiInfo;

    /**
     * Creates a plain object from a PB_SCChongZhiInfo message. Also converts values to other types if specified.
     * @param message PB_SCChongZhiInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCChongZhiInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCChongZhiInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCChongZhiInfoChange. */
export interface IPB_SCChongZhiInfoChange {

    /** PB_SCChongZhiInfoChange historyChongzhi */
    historyChongzhi?: (number|Long|null);

    /** PB_SCChongZhiInfoChange historyChongzhiCount */
    historyChongzhiCount?: (number|null);

    /** PB_SCChongZhiInfoChange todayChongzhi */
    todayChongzhi?: (number|null);

    /** PB_SCChongZhiInfoChange seq */
    seq?: (number|null);

    /** PB_SCChongZhiInfoChange times */
    times?: (number|null);
}

/** Represents a PB_SCChongZhiInfoChange. */
export class PB_SCChongZhiInfoChange implements IPB_SCChongZhiInfoChange {

    /**
     * Constructs a new PB_SCChongZhiInfoChange.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCChongZhiInfoChange);

    /** PB_SCChongZhiInfoChange historyChongzhi. */
    public historyChongzhi: (number|Long);

    /** PB_SCChongZhiInfoChange historyChongzhiCount. */
    public historyChongzhiCount: number;

    /** PB_SCChongZhiInfoChange todayChongzhi. */
    public todayChongzhi: number;

    /** PB_SCChongZhiInfoChange seq. */
    public seq: number;

    /** PB_SCChongZhiInfoChange times. */
    public times: number;

    /**
     * Creates a new PB_SCChongZhiInfoChange instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCChongZhiInfoChange instance
     */
    public static create(properties?: IPB_SCChongZhiInfoChange): PB_SCChongZhiInfoChange;

    /**
     * Encodes the specified PB_SCChongZhiInfoChange message. Does not implicitly {@link PB_SCChongZhiInfoChange.verify|verify} messages.
     * @param message PB_SCChongZhiInfoChange message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCChongZhiInfoChange, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCChongZhiInfoChange message, length delimited. Does not implicitly {@link PB_SCChongZhiInfoChange.verify|verify} messages.
     * @param message PB_SCChongZhiInfoChange message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCChongZhiInfoChange, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCChongZhiInfoChange message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCChongZhiInfoChange
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCChongZhiInfoChange;

    /**
     * Decodes a PB_SCChongZhiInfoChange message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCChongZhiInfoChange
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCChongZhiInfoChange;

    /**
     * Verifies a PB_SCChongZhiInfoChange message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCChongZhiInfoChange message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCChongZhiInfoChange
     */
    public static fromObject(object: { [k: string]: any }): PB_SCChongZhiInfoChange;

    /**
     * Creates a plain object from a PB_SCChongZhiInfoChange message. Also converts values to other types if specified.
     * @param message PB_SCChongZhiInfoChange
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCChongZhiInfoChange, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCChongZhiInfoChange to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCActivityStatus. */
export interface IPB_SCActivityStatus {

    /** PB_SCActivityStatus activityType */
    activityType?: (number|null);

    /** PB_SCActivityStatus status */
    status?: (number|null);

    /** PB_SCActivityStatus isBroadcast */
    isBroadcast?: (number|null);

    /** PB_SCActivityStatus nextStatusSwitchTime */
    nextStatusSwitchTime?: (number|null);

    /** PB_SCActivityStatus param_1 */
    param_1?: (number|null);

    /** PB_SCActivityStatus param_2 */
    param_2?: (number|null);
}

/** Represents a PB_SCActivityStatus. */
export class PB_SCActivityStatus implements IPB_SCActivityStatus {

    /**
     * Constructs a new PB_SCActivityStatus.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCActivityStatus);

    /** PB_SCActivityStatus activityType. */
    public activityType: number;

    /** PB_SCActivityStatus status. */
    public status: number;

    /** PB_SCActivityStatus isBroadcast. */
    public isBroadcast: number;

    /** PB_SCActivityStatus nextStatusSwitchTime. */
    public nextStatusSwitchTime: number;

    /** PB_SCActivityStatus param_1. */
    public param_1: number;

    /** PB_SCActivityStatus param_2. */
    public param_2: number;

    /**
     * Creates a new PB_SCActivityStatus instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCActivityStatus instance
     */
    public static create(properties?: IPB_SCActivityStatus): PB_SCActivityStatus;

    /**
     * Encodes the specified PB_SCActivityStatus message. Does not implicitly {@link PB_SCActivityStatus.verify|verify} messages.
     * @param message PB_SCActivityStatus message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCActivityStatus, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCActivityStatus message, length delimited. Does not implicitly {@link PB_SCActivityStatus.verify|verify} messages.
     * @param message PB_SCActivityStatus message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCActivityStatus, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCActivityStatus message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCActivityStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCActivityStatus;

    /**
     * Decodes a PB_SCActivityStatus message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCActivityStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCActivityStatus;

    /**
     * Verifies a PB_SCActivityStatus message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCActivityStatus message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCActivityStatus
     */
    public static fromObject(object: { [k: string]: any }): PB_SCActivityStatus;

    /**
     * Creates a plain object from a PB_SCActivityStatus message. Also converts values to other types if specified.
     * @param message PB_SCActivityStatus
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCActivityStatus, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCActivityStatus to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSChongZhiConfigReq. */
export interface IPB_CSChongZhiConfigReq {

    /** PB_CSChongZhiConfigReq currency */
    currency?: (number|null);

    /** PB_CSChongZhiConfigReq spidStr */
    spidStr?: (Uint8Array|null);
}

/** Represents a PB_CSChongZhiConfigReq. */
export class PB_CSChongZhiConfigReq implements IPB_CSChongZhiConfigReq {

    /**
     * Constructs a new PB_CSChongZhiConfigReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSChongZhiConfigReq);

    /** PB_CSChongZhiConfigReq currency. */
    public currency: number;

    /** PB_CSChongZhiConfigReq spidStr. */
    public spidStr: Uint8Array;

    /**
     * Creates a new PB_CSChongZhiConfigReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSChongZhiConfigReq instance
     */
    public static create(properties?: IPB_CSChongZhiConfigReq): PB_CSChongZhiConfigReq;

    /**
     * Encodes the specified PB_CSChongZhiConfigReq message. Does not implicitly {@link PB_CSChongZhiConfigReq.verify|verify} messages.
     * @param message PB_CSChongZhiConfigReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSChongZhiConfigReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSChongZhiConfigReq message, length delimited. Does not implicitly {@link PB_CSChongZhiConfigReq.verify|verify} messages.
     * @param message PB_CSChongZhiConfigReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSChongZhiConfigReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSChongZhiConfigReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSChongZhiConfigReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSChongZhiConfigReq;

    /**
     * Decodes a PB_CSChongZhiConfigReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSChongZhiConfigReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSChongZhiConfigReq;

    /**
     * Verifies a PB_CSChongZhiConfigReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSChongZhiConfigReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSChongZhiConfigReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSChongZhiConfigReq;

    /**
     * Creates a plain object from a PB_CSChongZhiConfigReq message. Also converts values to other types if specified.
     * @param message PB_CSChongZhiConfigReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSChongZhiConfigReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSChongZhiConfigReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_ChongzhiInfo. */
export interface IPB_ChongzhiInfo {

    /** PB_ChongzhiInfo seq */
    seq?: (number|null);

    /** PB_ChongzhiInfo extraRewardType */
    extraRewardType?: (number|null);

    /** PB_ChongzhiInfo addGold */
    addGold?: (number|null);

    /** PB_ChongzhiInfo extraReward */
    extraReward?: (number|null);

    /** PB_ChongzhiInfo moneyShow */
    moneyShow?: (number|null);

    /** PB_ChongzhiInfo descriptionFirstChongzhi */
    descriptionFirstChongzhi?: (Uint8Array|null);
}

/** Represents a PB_ChongzhiInfo. */
export class PB_ChongzhiInfo implements IPB_ChongzhiInfo {

    /**
     * Constructs a new PB_ChongzhiInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_ChongzhiInfo);

    /** PB_ChongzhiInfo seq. */
    public seq: number;

    /** PB_ChongzhiInfo extraRewardType. */
    public extraRewardType: number;

    /** PB_ChongzhiInfo addGold. */
    public addGold: number;

    /** PB_ChongzhiInfo extraReward. */
    public extraReward: number;

    /** PB_ChongzhiInfo moneyShow. */
    public moneyShow: number;

    /** PB_ChongzhiInfo descriptionFirstChongzhi. */
    public descriptionFirstChongzhi: Uint8Array;

    /**
     * Creates a new PB_ChongzhiInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_ChongzhiInfo instance
     */
    public static create(properties?: IPB_ChongzhiInfo): PB_ChongzhiInfo;

    /**
     * Encodes the specified PB_ChongzhiInfo message. Does not implicitly {@link PB_ChongzhiInfo.verify|verify} messages.
     * @param message PB_ChongzhiInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_ChongzhiInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_ChongzhiInfo message, length delimited. Does not implicitly {@link PB_ChongzhiInfo.verify|verify} messages.
     * @param message PB_ChongzhiInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_ChongzhiInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_ChongzhiInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_ChongzhiInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_ChongzhiInfo;

    /**
     * Decodes a PB_ChongzhiInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_ChongzhiInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_ChongzhiInfo;

    /**
     * Verifies a PB_ChongzhiInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_ChongzhiInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_ChongzhiInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_ChongzhiInfo;

    /**
     * Creates a plain object from a PB_ChongzhiInfo message. Also converts values to other types if specified.
     * @param message PB_ChongzhiInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_ChongzhiInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_ChongzhiInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCChongZhiConfigInfo. */
export interface IPB_SCChongZhiConfigInfo {

    /** PB_SCChongZhiConfigInfo currencyType */
    currencyType?: (number|null);

    /** PB_SCChongZhiConfigInfo infoCount */
    infoCount?: (number|null);

    /** PB_SCChongZhiConfigInfo infoList */
    infoList?: (IPB_ChongzhiInfo[]|null);
}

/** Represents a PB_SCChongZhiConfigInfo. */
export class PB_SCChongZhiConfigInfo implements IPB_SCChongZhiConfigInfo {

    /**
     * Constructs a new PB_SCChongZhiConfigInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCChongZhiConfigInfo);

    /** PB_SCChongZhiConfigInfo currencyType. */
    public currencyType: number;

    /** PB_SCChongZhiConfigInfo infoCount. */
    public infoCount: number;

    /** PB_SCChongZhiConfigInfo infoList. */
    public infoList: IPB_ChongzhiInfo[];

    /**
     * Creates a new PB_SCChongZhiConfigInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCChongZhiConfigInfo instance
     */
    public static create(properties?: IPB_SCChongZhiConfigInfo): PB_SCChongZhiConfigInfo;

    /**
     * Encodes the specified PB_SCChongZhiConfigInfo message. Does not implicitly {@link PB_SCChongZhiConfigInfo.verify|verify} messages.
     * @param message PB_SCChongZhiConfigInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCChongZhiConfigInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCChongZhiConfigInfo message, length delimited. Does not implicitly {@link PB_SCChongZhiConfigInfo.verify|verify} messages.
     * @param message PB_SCChongZhiConfigInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCChongZhiConfigInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCChongZhiConfigInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCChongZhiConfigInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCChongZhiConfigInfo;

    /**
     * Decodes a PB_SCChongZhiConfigInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCChongZhiConfigInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCChongZhiConfigInfo;

    /**
     * Verifies a PB_SCChongZhiConfigInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCChongZhiConfigInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCChongZhiConfigInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCChongZhiConfigInfo;

    /**
     * Creates a plain object from a PB_SCChongZhiConfigInfo message. Also converts values to other types if specified.
     * @param message PB_SCChongZhiConfigInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCChongZhiConfigInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCChongZhiConfigInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaFriendInfo. */
export interface IPB_SCRaFriendInfo {

    /** PB_SCRaFriendInfo friendCount */
    friendCount?: (number|null);

    /** PB_SCRaFriendInfo rewardFlag */
    rewardFlag?: (number|null);
}

/** Represents a PB_SCRaFriendInfo. */
export class PB_SCRaFriendInfo implements IPB_SCRaFriendInfo {

    /**
     * Constructs a new PB_SCRaFriendInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaFriendInfo);

    /** PB_SCRaFriendInfo friendCount. */
    public friendCount: number;

    /** PB_SCRaFriendInfo rewardFlag. */
    public rewardFlag: number;

    /**
     * Creates a new PB_SCRaFriendInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaFriendInfo instance
     */
    public static create(properties?: IPB_SCRaFriendInfo): PB_SCRaFriendInfo;

    /**
     * Encodes the specified PB_SCRaFriendInfo message. Does not implicitly {@link PB_SCRaFriendInfo.verify|verify} messages.
     * @param message PB_SCRaFriendInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaFriendInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaFriendInfo message, length delimited. Does not implicitly {@link PB_SCRaFriendInfo.verify|verify} messages.
     * @param message PB_SCRaFriendInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaFriendInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaFriendInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaFriendInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaFriendInfo;

    /**
     * Decodes a PB_SCRaFriendInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaFriendInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaFriendInfo;

    /**
     * Verifies a PB_SCRaFriendInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaFriendInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaFriendInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaFriendInfo;

    /**
     * Creates a plain object from a PB_SCRaFriendInfo message. Also converts values to other types if specified.
     * @param message PB_SCRaFriendInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaFriendInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaFriendInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaNewbeeGiftInfo. */
export interface IPB_SCRaNewbeeGiftInfo {

    /** PB_SCRaNewbeeGiftInfo seq */
    seq?: (number|null);
}

/** Represents a PB_SCRaNewbeeGiftInfo. */
export class PB_SCRaNewbeeGiftInfo implements IPB_SCRaNewbeeGiftInfo {

    /**
     * Constructs a new PB_SCRaNewbeeGiftInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaNewbeeGiftInfo);

    /** PB_SCRaNewbeeGiftInfo seq. */
    public seq: number;

    /**
     * Creates a new PB_SCRaNewbeeGiftInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaNewbeeGiftInfo instance
     */
    public static create(properties?: IPB_SCRaNewbeeGiftInfo): PB_SCRaNewbeeGiftInfo;

    /**
     * Encodes the specified PB_SCRaNewbeeGiftInfo message. Does not implicitly {@link PB_SCRaNewbeeGiftInfo.verify|verify} messages.
     * @param message PB_SCRaNewbeeGiftInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaNewbeeGiftInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaNewbeeGiftInfo message, length delimited. Does not implicitly {@link PB_SCRaNewbeeGiftInfo.verify|verify} messages.
     * @param message PB_SCRaNewbeeGiftInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaNewbeeGiftInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaNewbeeGiftInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaNewbeeGiftInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaNewbeeGiftInfo;

    /**
     * Decodes a PB_SCRaNewbeeGiftInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaNewbeeGiftInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaNewbeeGiftInfo;

    /**
     * Verifies a PB_SCRaNewbeeGiftInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaNewbeeGiftInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaNewbeeGiftInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaNewbeeGiftInfo;

    /**
     * Creates a plain object from a PB_SCRaNewbeeGiftInfo message. Also converts values to other types if specified.
     * @param message PB_SCRaNewbeeGiftInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaNewbeeGiftInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaNewbeeGiftInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRAGrowGiftNode. */
export interface IPB_SCRAGrowGiftNode {

    /** PB_SCRAGrowGiftNode seq */
    seq?: (number|null);

    /** PB_SCRAGrowGiftNode endTime */
    endTime?: (number|null);
}

/** Represents a PB_SCRAGrowGiftNode. */
export class PB_SCRAGrowGiftNode implements IPB_SCRAGrowGiftNode {

    /**
     * Constructs a new PB_SCRAGrowGiftNode.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRAGrowGiftNode);

    /** PB_SCRAGrowGiftNode seq. */
    public seq: number;

    /** PB_SCRAGrowGiftNode endTime. */
    public endTime: number;

    /**
     * Creates a new PB_SCRAGrowGiftNode instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRAGrowGiftNode instance
     */
    public static create(properties?: IPB_SCRAGrowGiftNode): PB_SCRAGrowGiftNode;

    /**
     * Encodes the specified PB_SCRAGrowGiftNode message. Does not implicitly {@link PB_SCRAGrowGiftNode.verify|verify} messages.
     * @param message PB_SCRAGrowGiftNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRAGrowGiftNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRAGrowGiftNode message, length delimited. Does not implicitly {@link PB_SCRAGrowGiftNode.verify|verify} messages.
     * @param message PB_SCRAGrowGiftNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRAGrowGiftNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRAGrowGiftNode message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRAGrowGiftNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRAGrowGiftNode;

    /**
     * Decodes a PB_SCRAGrowGiftNode message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRAGrowGiftNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRAGrowGiftNode;

    /**
     * Verifies a PB_SCRAGrowGiftNode message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRAGrowGiftNode message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRAGrowGiftNode
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRAGrowGiftNode;

    /**
     * Creates a plain object from a PB_SCRAGrowGiftNode message. Also converts values to other types if specified.
     * @param message PB_SCRAGrowGiftNode
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRAGrowGiftNode, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRAGrowGiftNode to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaGrowGiftInfo. */
export interface IPB_SCRaGrowGiftInfo {

    /** PB_SCRaGrowGiftInfo giftList */
    giftList?: (IPB_SCRAGrowGiftNode[]|null);
}

/** Represents a PB_SCRaGrowGiftInfo. */
export class PB_SCRaGrowGiftInfo implements IPB_SCRaGrowGiftInfo {

    /**
     * Constructs a new PB_SCRaGrowGiftInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaGrowGiftInfo);

    /** PB_SCRaGrowGiftInfo giftList. */
    public giftList: IPB_SCRAGrowGiftNode[];

    /**
     * Creates a new PB_SCRaGrowGiftInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaGrowGiftInfo instance
     */
    public static create(properties?: IPB_SCRaGrowGiftInfo): PB_SCRaGrowGiftInfo;

    /**
     * Encodes the specified PB_SCRaGrowGiftInfo message. Does not implicitly {@link PB_SCRaGrowGiftInfo.verify|verify} messages.
     * @param message PB_SCRaGrowGiftInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaGrowGiftInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaGrowGiftInfo message, length delimited. Does not implicitly {@link PB_SCRaGrowGiftInfo.verify|verify} messages.
     * @param message PB_SCRaGrowGiftInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaGrowGiftInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaGrowGiftInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaGrowGiftInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaGrowGiftInfo;

    /**
     * Decodes a PB_SCRaGrowGiftInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaGrowGiftInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaGrowGiftInfo;

    /**
     * Verifies a PB_SCRaGrowGiftInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaGrowGiftInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaGrowGiftInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaGrowGiftInfo;

    /**
     * Creates a plain object from a PB_SCRaGrowGiftInfo message. Also converts values to other types if specified.
     * @param message PB_SCRaGrowGiftInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaGrowGiftInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaGrowGiftInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaBarrierPackInfo. */
export interface IPB_SCRaBarrierPackInfo {

    /** PB_SCRaBarrierPackInfo isBuy */
    isBuy?: (boolean[]|null);
}

/** Represents a PB_SCRaBarrierPackInfo. */
export class PB_SCRaBarrierPackInfo implements IPB_SCRaBarrierPackInfo {

    /**
     * Constructs a new PB_SCRaBarrierPackInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaBarrierPackInfo);

    /** PB_SCRaBarrierPackInfo isBuy. */
    public isBuy: boolean[];

    /**
     * Creates a new PB_SCRaBarrierPackInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaBarrierPackInfo instance
     */
    public static create(properties?: IPB_SCRaBarrierPackInfo): PB_SCRaBarrierPackInfo;

    /**
     * Encodes the specified PB_SCRaBarrierPackInfo message. Does not implicitly {@link PB_SCRaBarrierPackInfo.verify|verify} messages.
     * @param message PB_SCRaBarrierPackInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaBarrierPackInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaBarrierPackInfo message, length delimited. Does not implicitly {@link PB_SCRaBarrierPackInfo.verify|verify} messages.
     * @param message PB_SCRaBarrierPackInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaBarrierPackInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaBarrierPackInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaBarrierPackInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaBarrierPackInfo;

    /**
     * Decodes a PB_SCRaBarrierPackInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaBarrierPackInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaBarrierPackInfo;

    /**
     * Verifies a PB_SCRaBarrierPackInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaBarrierPackInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaBarrierPackInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaBarrierPackInfo;

    /**
     * Creates a plain object from a PB_SCRaBarrierPackInfo message. Also converts values to other types if specified.
     * @param message PB_SCRaBarrierPackInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaBarrierPackInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaBarrierPackInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaRoundPassList. */
export interface IPB_SCRaRoundPassList {

    /** PB_SCRaRoundPassList isActive */
    isActive?: (boolean|null);

    /** PB_SCRaRoundPassList isFetch */
    isFetch?: (boolean[]|null);
}

/** Represents a PB_SCRaRoundPassList. */
export class PB_SCRaRoundPassList implements IPB_SCRaRoundPassList {

    /**
     * Constructs a new PB_SCRaRoundPassList.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaRoundPassList);

    /** PB_SCRaRoundPassList isActive. */
    public isActive: boolean;

    /** PB_SCRaRoundPassList isFetch. */
    public isFetch: boolean[];

    /**
     * Creates a new PB_SCRaRoundPassList instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaRoundPassList instance
     */
    public static create(properties?: IPB_SCRaRoundPassList): PB_SCRaRoundPassList;

    /**
     * Encodes the specified PB_SCRaRoundPassList message. Does not implicitly {@link PB_SCRaRoundPassList.verify|verify} messages.
     * @param message PB_SCRaRoundPassList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaRoundPassList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaRoundPassList message, length delimited. Does not implicitly {@link PB_SCRaRoundPassList.verify|verify} messages.
     * @param message PB_SCRaRoundPassList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaRoundPassList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaRoundPassList message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaRoundPassList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaRoundPassList;

    /**
     * Decodes a PB_SCRaRoundPassList message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaRoundPassList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaRoundPassList;

    /**
     * Verifies a PB_SCRaRoundPassList message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaRoundPassList message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaRoundPassList
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaRoundPassList;

    /**
     * Creates a plain object from a PB_SCRaRoundPassList message. Also converts values to other types if specified.
     * @param message PB_SCRaRoundPassList
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaRoundPassList, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaRoundPassList to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaRoundPassInfo. */
export interface IPB_SCRaRoundPassInfo {

    /** PB_SCRaRoundPassInfo list */
    list?: (IPB_SCRaRoundPassList[]|null);

    /** PB_SCRaRoundPassInfo passRound */
    passRound?: (number|null);
}

/** Represents a PB_SCRaRoundPassInfo. */
export class PB_SCRaRoundPassInfo implements IPB_SCRaRoundPassInfo {

    /**
     * Constructs a new PB_SCRaRoundPassInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaRoundPassInfo);

    /** PB_SCRaRoundPassInfo list. */
    public list: IPB_SCRaRoundPassList[];

    /** PB_SCRaRoundPassInfo passRound. */
    public passRound: number;

    /**
     * Creates a new PB_SCRaRoundPassInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaRoundPassInfo instance
     */
    public static create(properties?: IPB_SCRaRoundPassInfo): PB_SCRaRoundPassInfo;

    /**
     * Encodes the specified PB_SCRaRoundPassInfo message. Does not implicitly {@link PB_SCRaRoundPassInfo.verify|verify} messages.
     * @param message PB_SCRaRoundPassInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaRoundPassInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaRoundPassInfo message, length delimited. Does not implicitly {@link PB_SCRaRoundPassInfo.verify|verify} messages.
     * @param message PB_SCRaRoundPassInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaRoundPassInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaRoundPassInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaRoundPassInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaRoundPassInfo;

    /**
     * Decodes a PB_SCRaRoundPassInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaRoundPassInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaRoundPassInfo;

    /**
     * Verifies a PB_SCRaRoundPassInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaRoundPassInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaRoundPassInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaRoundPassInfo;

    /**
     * Creates a plain object from a PB_SCRaRoundPassInfo message. Also converts values to other types if specified.
     * @param message PB_SCRaRoundPassInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaRoundPassInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaRoundPassInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaItemBuyInfo. */
export interface IPB_SCRaItemBuyInfo {

    /** PB_SCRaItemBuyInfo itemBuyCount */
    itemBuyCount?: (number[]|null);
}

/** Represents a PB_SCRaItemBuyInfo. */
export class PB_SCRaItemBuyInfo implements IPB_SCRaItemBuyInfo {

    /**
     * Constructs a new PB_SCRaItemBuyInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaItemBuyInfo);

    /** PB_SCRaItemBuyInfo itemBuyCount. */
    public itemBuyCount: number[];

    /**
     * Creates a new PB_SCRaItemBuyInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaItemBuyInfo instance
     */
    public static create(properties?: IPB_SCRaItemBuyInfo): PB_SCRaItemBuyInfo;

    /**
     * Encodes the specified PB_SCRaItemBuyInfo message. Does not implicitly {@link PB_SCRaItemBuyInfo.verify|verify} messages.
     * @param message PB_SCRaItemBuyInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaItemBuyInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaItemBuyInfo message, length delimited. Does not implicitly {@link PB_SCRaItemBuyInfo.verify|verify} messages.
     * @param message PB_SCRaItemBuyInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaItemBuyInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaItemBuyInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaItemBuyInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaItemBuyInfo;

    /**
     * Decodes a PB_SCRaItemBuyInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaItemBuyInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaItemBuyInfo;

    /**
     * Verifies a PB_SCRaItemBuyInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaItemBuyInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaItemBuyInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaItemBuyInfo;

    /**
     * Creates a plain object from a PB_SCRaItemBuyInfo message. Also converts values to other types if specified.
     * @param message PB_SCRaItemBuyInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaItemBuyInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaItemBuyInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaTaskInfo. */
export interface IPB_SCRaTaskInfo {

    /** PB_SCRaTaskInfo taskProgress */
    taskProgress?: (number[]|null);

    /** PB_SCRaTaskInfo rewardFetch */
    rewardFetch?: (boolean[]|null);
}

/** Represents a PB_SCRaTaskInfo. */
export class PB_SCRaTaskInfo implements IPB_SCRaTaskInfo {

    /**
     * Constructs a new PB_SCRaTaskInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaTaskInfo);

    /** PB_SCRaTaskInfo taskProgress. */
    public taskProgress: number[];

    /** PB_SCRaTaskInfo rewardFetch. */
    public rewardFetch: boolean[];

    /**
     * Creates a new PB_SCRaTaskInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaTaskInfo instance
     */
    public static create(properties?: IPB_SCRaTaskInfo): PB_SCRaTaskInfo;

    /**
     * Encodes the specified PB_SCRaTaskInfo message. Does not implicitly {@link PB_SCRaTaskInfo.verify|verify} messages.
     * @param message PB_SCRaTaskInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaTaskInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaTaskInfo message, length delimited. Does not implicitly {@link PB_SCRaTaskInfo.verify|verify} messages.
     * @param message PB_SCRaTaskInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaTaskInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaTaskInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaTaskInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaTaskInfo;

    /**
     * Decodes a PB_SCRaTaskInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaTaskInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaTaskInfo;

    /**
     * Verifies a PB_SCRaTaskInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaTaskInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaTaskInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaTaskInfo;

    /**
     * Creates a plain object from a PB_SCRaTaskInfo message. Also converts values to other types if specified.
     * @param message PB_SCRaTaskInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaTaskInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaTaskInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaTaskBuyInfo. */
export interface IPB_SCRaTaskBuyInfo {

    /** PB_SCRaTaskBuyInfo itemBuyNum */
    itemBuyNum?: (number[]|null);
}

/** Represents a PB_SCRaTaskBuyInfo. */
export class PB_SCRaTaskBuyInfo implements IPB_SCRaTaskBuyInfo {

    /**
     * Constructs a new PB_SCRaTaskBuyInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaTaskBuyInfo);

    /** PB_SCRaTaskBuyInfo itemBuyNum. */
    public itemBuyNum: number[];

    /**
     * Creates a new PB_SCRaTaskBuyInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaTaskBuyInfo instance
     */
    public static create(properties?: IPB_SCRaTaskBuyInfo): PB_SCRaTaskBuyInfo;

    /**
     * Encodes the specified PB_SCRaTaskBuyInfo message. Does not implicitly {@link PB_SCRaTaskBuyInfo.verify|verify} messages.
     * @param message PB_SCRaTaskBuyInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaTaskBuyInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaTaskBuyInfo message, length delimited. Does not implicitly {@link PB_SCRaTaskBuyInfo.verify|verify} messages.
     * @param message PB_SCRaTaskBuyInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaTaskBuyInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaTaskBuyInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaTaskBuyInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaTaskBuyInfo;

    /**
     * Decodes a PB_SCRaTaskBuyInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaTaskBuyInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaTaskBuyInfo;

    /**
     * Verifies a PB_SCRaTaskBuyInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaTaskBuyInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaTaskBuyInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaTaskBuyInfo;

    /**
     * Creates a plain object from a PB_SCRaTaskBuyInfo message. Also converts values to other types if specified.
     * @param message PB_SCRaTaskBuyInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaTaskBuyInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaTaskBuyInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaShopGiftNode. */
export interface IPB_SCRaShopGiftNode {

    /** PB_SCRaShopGiftNode seq */
    seq?: (number|null);

    /** PB_SCRaShopGiftNode endTime */
    endTime?: (number|null);
}

/** Represents a PB_SCRaShopGiftNode. */
export class PB_SCRaShopGiftNode implements IPB_SCRaShopGiftNode {

    /**
     * Constructs a new PB_SCRaShopGiftNode.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaShopGiftNode);

    /** PB_SCRaShopGiftNode seq. */
    public seq: number;

    /** PB_SCRaShopGiftNode endTime. */
    public endTime: number;

    /**
     * Creates a new PB_SCRaShopGiftNode instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaShopGiftNode instance
     */
    public static create(properties?: IPB_SCRaShopGiftNode): PB_SCRaShopGiftNode;

    /**
     * Encodes the specified PB_SCRaShopGiftNode message. Does not implicitly {@link PB_SCRaShopGiftNode.verify|verify} messages.
     * @param message PB_SCRaShopGiftNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaShopGiftNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaShopGiftNode message, length delimited. Does not implicitly {@link PB_SCRaShopGiftNode.verify|verify} messages.
     * @param message PB_SCRaShopGiftNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaShopGiftNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaShopGiftNode message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaShopGiftNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaShopGiftNode;

    /**
     * Decodes a PB_SCRaShopGiftNode message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaShopGiftNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaShopGiftNode;

    /**
     * Verifies a PB_SCRaShopGiftNode message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaShopGiftNode message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaShopGiftNode
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaShopGiftNode;

    /**
     * Creates a plain object from a PB_SCRaShopGiftNode message. Also converts values to other types if specified.
     * @param message PB_SCRaShopGiftNode
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaShopGiftNode, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaShopGiftNode to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaShopGiftInfo. */
export interface IPB_SCRaShopGiftInfo {

    /** PB_SCRaShopGiftInfo shopList */
    shopList?: (IPB_SCRaShopGiftNode[]|null);
}

/** Represents a PB_SCRaShopGiftInfo. */
export class PB_SCRaShopGiftInfo implements IPB_SCRaShopGiftInfo {

    /**
     * Constructs a new PB_SCRaShopGiftInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaShopGiftInfo);

    /** PB_SCRaShopGiftInfo shopList. */
    public shopList: IPB_SCRaShopGiftNode[];

    /**
     * Creates a new PB_SCRaShopGiftInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaShopGiftInfo instance
     */
    public static create(properties?: IPB_SCRaShopGiftInfo): PB_SCRaShopGiftInfo;

    /**
     * Encodes the specified PB_SCRaShopGiftInfo message. Does not implicitly {@link PB_SCRaShopGiftInfo.verify|verify} messages.
     * @param message PB_SCRaShopGiftInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaShopGiftInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaShopGiftInfo message, length delimited. Does not implicitly {@link PB_SCRaShopGiftInfo.verify|verify} messages.
     * @param message PB_SCRaShopGiftInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaShopGiftInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaShopGiftInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaShopGiftInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaShopGiftInfo;

    /**
     * Decodes a PB_SCRaShopGiftInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaShopGiftInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaShopGiftInfo;

    /**
     * Verifies a PB_SCRaShopGiftInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaShopGiftInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaShopGiftInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaShopGiftInfo;

    /**
     * Creates a plain object from a PB_SCRaShopGiftInfo message. Also converts values to other types if specified.
     * @param message PB_SCRaShopGiftInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaShopGiftInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaShopGiftInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCZombieGoGoGoInfo. */
export interface IPB_SCZombieGoGoGoInfo {

    /** PB_SCZombieGoGoGoInfo fightCount */
    fightCount?: (number[]|null);

    /** PB_SCZombieGoGoGoInfo killRewardIsFetch */
    killRewardIsFetch?: (boolean[]|null);

    /** PB_SCZombieGoGoGoInfo killNum */
    killNum?: (number|null);

    /** PB_SCZombieGoGoGoInfo dailyWeakness */
    dailyWeakness?: (number|null);
}

/** Represents a PB_SCZombieGoGoGoInfo. */
export class PB_SCZombieGoGoGoInfo implements IPB_SCZombieGoGoGoInfo {

    /**
     * Constructs a new PB_SCZombieGoGoGoInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCZombieGoGoGoInfo);

    /** PB_SCZombieGoGoGoInfo fightCount. */
    public fightCount: number[];

    /** PB_SCZombieGoGoGoInfo killRewardIsFetch. */
    public killRewardIsFetch: boolean[];

    /** PB_SCZombieGoGoGoInfo killNum. */
    public killNum: number;

    /** PB_SCZombieGoGoGoInfo dailyWeakness. */
    public dailyWeakness: number;

    /**
     * Creates a new PB_SCZombieGoGoGoInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCZombieGoGoGoInfo instance
     */
    public static create(properties?: IPB_SCZombieGoGoGoInfo): PB_SCZombieGoGoGoInfo;

    /**
     * Encodes the specified PB_SCZombieGoGoGoInfo message. Does not implicitly {@link PB_SCZombieGoGoGoInfo.verify|verify} messages.
     * @param message PB_SCZombieGoGoGoInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCZombieGoGoGoInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCZombieGoGoGoInfo message, length delimited. Does not implicitly {@link PB_SCZombieGoGoGoInfo.verify|verify} messages.
     * @param message PB_SCZombieGoGoGoInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCZombieGoGoGoInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCZombieGoGoGoInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCZombieGoGoGoInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCZombieGoGoGoInfo;

    /**
     * Decodes a PB_SCZombieGoGoGoInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCZombieGoGoGoInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCZombieGoGoGoInfo;

    /**
     * Verifies a PB_SCZombieGoGoGoInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCZombieGoGoGoInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCZombieGoGoGoInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCZombieGoGoGoInfo;

    /**
     * Creates a plain object from a PB_SCZombieGoGoGoInfo message. Also converts values to other types if specified.
     * @param message PB_SCZombieGoGoGoInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCZombieGoGoGoInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCZombieGoGoGoInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_RALostTempleRemainsBox. */
export interface IPB_RALostTempleRemainsBox {

    /** PB_RALostTempleRemainsBox remainsId */
    remainsId?: (number[]|null);

    /** PB_RALostTempleRemainsBox isActive */
    isActive?: (number[]|null);
}

/** Represents a PB_RALostTempleRemainsBox. */
export class PB_RALostTempleRemainsBox implements IPB_RALostTempleRemainsBox {

    /**
     * Constructs a new PB_RALostTempleRemainsBox.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_RALostTempleRemainsBox);

    /** PB_RALostTempleRemainsBox remainsId. */
    public remainsId: number[];

    /** PB_RALostTempleRemainsBox isActive. */
    public isActive: number[];

    /**
     * Creates a new PB_RALostTempleRemainsBox instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_RALostTempleRemainsBox instance
     */
    public static create(properties?: IPB_RALostTempleRemainsBox): PB_RALostTempleRemainsBox;

    /**
     * Encodes the specified PB_RALostTempleRemainsBox message. Does not implicitly {@link PB_RALostTempleRemainsBox.verify|verify} messages.
     * @param message PB_RALostTempleRemainsBox message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_RALostTempleRemainsBox, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_RALostTempleRemainsBox message, length delimited. Does not implicitly {@link PB_RALostTempleRemainsBox.verify|verify} messages.
     * @param message PB_RALostTempleRemainsBox message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_RALostTempleRemainsBox, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_RALostTempleRemainsBox message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_RALostTempleRemainsBox
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_RALostTempleRemainsBox;

    /**
     * Decodes a PB_RALostTempleRemainsBox message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_RALostTempleRemainsBox
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_RALostTempleRemainsBox;

    /**
     * Verifies a PB_RALostTempleRemainsBox message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_RALostTempleRemainsBox message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_RALostTempleRemainsBox
     */
    public static fromObject(object: { [k: string]: any }): PB_RALostTempleRemainsBox;

    /**
     * Creates a plain object from a PB_RALostTempleRemainsBox message. Also converts values to other types if specified.
     * @param message PB_RALostTempleRemainsBox
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_RALostTempleRemainsBox, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_RALostTempleRemainsBox to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_RALostTempleBonfire. */
export interface IPB_RALostTempleBonfire {

    /** PB_RALostTempleBonfire isActive */
    isActive?: (number[]|null);
}

/** Represents a PB_RALostTempleBonfire. */
export class PB_RALostTempleBonfire implements IPB_RALostTempleBonfire {

    /**
     * Constructs a new PB_RALostTempleBonfire.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_RALostTempleBonfire);

    /** PB_RALostTempleBonfire isActive. */
    public isActive: number[];

    /**
     * Creates a new PB_RALostTempleBonfire instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_RALostTempleBonfire instance
     */
    public static create(properties?: IPB_RALostTempleBonfire): PB_RALostTempleBonfire;

    /**
     * Encodes the specified PB_RALostTempleBonfire message. Does not implicitly {@link PB_RALostTempleBonfire.verify|verify} messages.
     * @param message PB_RALostTempleBonfire message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_RALostTempleBonfire, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_RALostTempleBonfire message, length delimited. Does not implicitly {@link PB_RALostTempleBonfire.verify|verify} messages.
     * @param message PB_RALostTempleBonfire message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_RALostTempleBonfire, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_RALostTempleBonfire message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_RALostTempleBonfire
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_RALostTempleBonfire;

    /**
     * Decodes a PB_RALostTempleBonfire message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_RALostTempleBonfire
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_RALostTempleBonfire;

    /**
     * Verifies a PB_RALostTempleBonfire message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_RALostTempleBonfire message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_RALostTempleBonfire
     */
    public static fromObject(object: { [k: string]: any }): PB_RALostTempleBonfire;

    /**
     * Creates a plain object from a PB_RALostTempleBonfire message. Also converts values to other types if specified.
     * @param message PB_RALostTempleBonfire
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_RALostTempleBonfire, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_RALostTempleBonfire to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_RALostTemplePub. */
export interface IPB_RALostTemplePub {

    /** PB_RALostTemplePub isActive */
    isActive?: (number[]|null);

    /** PB_RALostTemplePub eventId */
    eventId?: (number|null);
}

/** Represents a PB_RALostTemplePub. */
export class PB_RALostTemplePub implements IPB_RALostTemplePub {

    /**
     * Constructs a new PB_RALostTemplePub.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_RALostTemplePub);

    /** PB_RALostTemplePub isActive. */
    public isActive: number[];

    /** PB_RALostTemplePub eventId. */
    public eventId: number;

    /**
     * Creates a new PB_RALostTemplePub instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_RALostTemplePub instance
     */
    public static create(properties?: IPB_RALostTemplePub): PB_RALostTemplePub;

    /**
     * Encodes the specified PB_RALostTemplePub message. Does not implicitly {@link PB_RALostTemplePub.verify|verify} messages.
     * @param message PB_RALostTemplePub message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_RALostTemplePub, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_RALostTemplePub message, length delimited. Does not implicitly {@link PB_RALostTemplePub.verify|verify} messages.
     * @param message PB_RALostTemplePub message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_RALostTemplePub, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_RALostTemplePub message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_RALostTemplePub
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_RALostTemplePub;

    /**
     * Decodes a PB_RALostTemplePub message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_RALostTemplePub
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_RALostTemplePub;

    /**
     * Verifies a PB_RALostTemplePub message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_RALostTemplePub message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_RALostTemplePub
     */
    public static fromObject(object: { [k: string]: any }): PB_RALostTemplePub;

    /**
     * Creates a plain object from a PB_RALostTemplePub message. Also converts values to other types if specified.
     * @param message PB_RALostTemplePub
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_RALostTemplePub, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_RALostTemplePub to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_RALostTempleMysteriousShop. */
export interface IPB_RALostTempleMysteriousShop {

    /** PB_RALostTempleMysteriousShop shopIndex */
    shopIndex?: (number|null);

    /** PB_RALostTempleMysteriousShop eventId */
    eventId?: (number|null);

    /** PB_RALostTempleMysteriousShop buyCount */
    buyCount?: (number[]|null);

    /** PB_RALostTempleMysteriousShop endTime */
    endTime?: (number|null);
}

/** Represents a PB_RALostTempleMysteriousShop. */
export class PB_RALostTempleMysteriousShop implements IPB_RALostTempleMysteriousShop {

    /**
     * Constructs a new PB_RALostTempleMysteriousShop.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_RALostTempleMysteriousShop);

    /** PB_RALostTempleMysteriousShop shopIndex. */
    public shopIndex: number;

    /** PB_RALostTempleMysteriousShop eventId. */
    public eventId: number;

    /** PB_RALostTempleMysteriousShop buyCount. */
    public buyCount: number[];

    /** PB_RALostTempleMysteriousShop endTime. */
    public endTime: number;

    /**
     * Creates a new PB_RALostTempleMysteriousShop instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_RALostTempleMysteriousShop instance
     */
    public static create(properties?: IPB_RALostTempleMysteriousShop): PB_RALostTempleMysteriousShop;

    /**
     * Encodes the specified PB_RALostTempleMysteriousShop message. Does not implicitly {@link PB_RALostTempleMysteriousShop.verify|verify} messages.
     * @param message PB_RALostTempleMysteriousShop message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_RALostTempleMysteriousShop, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_RALostTempleMysteriousShop message, length delimited. Does not implicitly {@link PB_RALostTempleMysteriousShop.verify|verify} messages.
     * @param message PB_RALostTempleMysteriousShop message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_RALostTempleMysteriousShop, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_RALostTempleMysteriousShop message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_RALostTempleMysteriousShop
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_RALostTempleMysteriousShop;

    /**
     * Decodes a PB_RALostTempleMysteriousShop message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_RALostTempleMysteriousShop
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_RALostTempleMysteriousShop;

    /**
     * Verifies a PB_RALostTempleMysteriousShop message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_RALostTempleMysteriousShop message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_RALostTempleMysteriousShop
     */
    public static fromObject(object: { [k: string]: any }): PB_RALostTempleMysteriousShop;

    /**
     * Creates a plain object from a PB_RALostTempleMysteriousShop message. Also converts values to other types if specified.
     * @param message PB_RALostTempleMysteriousShop
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_RALostTempleMysteriousShop, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_RALostTempleMysteriousShop to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_RALostTemplePubHero. */
export interface IPB_RALostTemplePubHero {

    /** PB_RALostTemplePubHero heroId */
    heroId?: (number|null);

    /** PB_RALostTemplePubHero heroLevel */
    heroLevel?: (number|null);

    /** PB_RALostTemplePubHero energy */
    energy?: (number|null);
}

/** Represents a PB_RALostTemplePubHero. */
export class PB_RALostTemplePubHero implements IPB_RALostTemplePubHero {

    /**
     * Constructs a new PB_RALostTemplePubHero.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_RALostTemplePubHero);

    /** PB_RALostTemplePubHero heroId. */
    public heroId: number;

    /** PB_RALostTemplePubHero heroLevel. */
    public heroLevel: number;

    /** PB_RALostTemplePubHero energy. */
    public energy: number;

    /**
     * Creates a new PB_RALostTemplePubHero instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_RALostTemplePubHero instance
     */
    public static create(properties?: IPB_RALostTemplePubHero): PB_RALostTemplePubHero;

    /**
     * Encodes the specified PB_RALostTemplePubHero message. Does not implicitly {@link PB_RALostTemplePubHero.verify|verify} messages.
     * @param message PB_RALostTemplePubHero message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_RALostTemplePubHero, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_RALostTemplePubHero message, length delimited. Does not implicitly {@link PB_RALostTemplePubHero.verify|verify} messages.
     * @param message PB_RALostTemplePubHero message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_RALostTemplePubHero, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_RALostTemplePubHero message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_RALostTemplePubHero
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_RALostTemplePubHero;

    /**
     * Decodes a PB_RALostTemplePubHero message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_RALostTemplePubHero
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_RALostTemplePubHero;

    /**
     * Verifies a PB_RALostTemplePubHero message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_RALostTemplePubHero message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_RALostTemplePubHero
     */
    public static fromObject(object: { [k: string]: any }): PB_RALostTemplePubHero;

    /**
     * Creates a plain object from a PB_RALostTemplePubHero message. Also converts values to other types if specified.
     * @param message PB_RALostTemplePubHero
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_RALostTemplePubHero, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_RALostTemplePubHero to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCLostTempleInfo. */
export interface IPB_SCLostTempleInfo {

    /** PB_SCLostTempleInfo passDiff */
    passDiff?: (number|null);

    /** PB_SCLostTempleInfo energyNum */
    energyNum?: (number|null);

    /** PB_SCLostTempleInfo nowDiff */
    nowDiff?: (number|null);

    /** PB_SCLostTempleInfo nowStorey */
    nowStorey?: (number|null);

    /** PB_SCLostTempleInfo nowLine */
    nowLine?: (number|null);

    /** PB_SCLostTempleInfo nowBlock */
    nowBlock?: (number|null);

    /** PB_SCLostTempleInfo nowBlockPass */
    nowBlockPass?: (number|null);

    /** PB_SCLostTempleInfo remainsBox */
    remainsBox?: (IPB_RALostTempleRemainsBox|null);

    /** PB_SCLostTempleInfo bonfire */
    bonfire?: (IPB_RALostTempleBonfire|null);

    /** PB_SCLostTempleInfo pub */
    pub?: (IPB_RALostTemplePub|null);

    /** PB_SCLostTempleInfo shopList */
    shopList?: (IPB_RALostTempleMysteriousShop[]|null);

    /** PB_SCLostTempleInfo pubHeroList */
    pubHeroList?: (IPB_RALostTemplePubHero[]|null);

    /** PB_SCLostTempleInfo remainsList */
    remainsList?: (number[]|null);

    /** PB_SCLostTempleInfo fightHeroId */
    fightHeroId?: (number[]|null);

    /** PB_SCLostTempleInfo moveBlock */
    moveBlock?: (number[]|null);
}

/** Represents a PB_SCLostTempleInfo. */
export class PB_SCLostTempleInfo implements IPB_SCLostTempleInfo {

    /**
     * Constructs a new PB_SCLostTempleInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCLostTempleInfo);

    /** PB_SCLostTempleInfo passDiff. */
    public passDiff: number;

    /** PB_SCLostTempleInfo energyNum. */
    public energyNum: number;

    /** PB_SCLostTempleInfo nowDiff. */
    public nowDiff: number;

    /** PB_SCLostTempleInfo nowStorey. */
    public nowStorey: number;

    /** PB_SCLostTempleInfo nowLine. */
    public nowLine: number;

    /** PB_SCLostTempleInfo nowBlock. */
    public nowBlock: number;

    /** PB_SCLostTempleInfo nowBlockPass. */
    public nowBlockPass: number;

    /** PB_SCLostTempleInfo remainsBox. */
    public remainsBox?: (IPB_RALostTempleRemainsBox|null);

    /** PB_SCLostTempleInfo bonfire. */
    public bonfire?: (IPB_RALostTempleBonfire|null);

    /** PB_SCLostTempleInfo pub. */
    public pub?: (IPB_RALostTemplePub|null);

    /** PB_SCLostTempleInfo shopList. */
    public shopList: IPB_RALostTempleMysteriousShop[];

    /** PB_SCLostTempleInfo pubHeroList. */
    public pubHeroList: IPB_RALostTemplePubHero[];

    /** PB_SCLostTempleInfo remainsList. */
    public remainsList: number[];

    /** PB_SCLostTempleInfo fightHeroId. */
    public fightHeroId: number[];

    /** PB_SCLostTempleInfo moveBlock. */
    public moveBlock: number[];

    /**
     * Creates a new PB_SCLostTempleInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCLostTempleInfo instance
     */
    public static create(properties?: IPB_SCLostTempleInfo): PB_SCLostTempleInfo;

    /**
     * Encodes the specified PB_SCLostTempleInfo message. Does not implicitly {@link PB_SCLostTempleInfo.verify|verify} messages.
     * @param message PB_SCLostTempleInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCLostTempleInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCLostTempleInfo message, length delimited. Does not implicitly {@link PB_SCLostTempleInfo.verify|verify} messages.
     * @param message PB_SCLostTempleInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCLostTempleInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCLostTempleInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCLostTempleInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCLostTempleInfo;

    /**
     * Decodes a PB_SCLostTempleInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCLostTempleInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCLostTempleInfo;

    /**
     * Verifies a PB_SCLostTempleInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCLostTempleInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCLostTempleInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCLostTempleInfo;

    /**
     * Creates a plain object from a PB_SCLostTempleInfo message. Also converts values to other types if specified.
     * @param message PB_SCLostTempleInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCLostTempleInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCLostTempleInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCLostTempleShopInfo. */
export interface IPB_SCLostTempleShopInfo {

    /** PB_SCLostTempleShopInfo templeShopBuyCount */
    templeShopBuyCount?: (number[]|null);
}

/** Represents a PB_SCLostTempleShopInfo. */
export class PB_SCLostTempleShopInfo implements IPB_SCLostTempleShopInfo {

    /**
     * Constructs a new PB_SCLostTempleShopInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCLostTempleShopInfo);

    /** PB_SCLostTempleShopInfo templeShopBuyCount. */
    public templeShopBuyCount: number[];

    /**
     * Creates a new PB_SCLostTempleShopInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCLostTempleShopInfo instance
     */
    public static create(properties?: IPB_SCLostTempleShopInfo): PB_SCLostTempleShopInfo;

    /**
     * Encodes the specified PB_SCLostTempleShopInfo message. Does not implicitly {@link PB_SCLostTempleShopInfo.verify|verify} messages.
     * @param message PB_SCLostTempleShopInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCLostTempleShopInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCLostTempleShopInfo message, length delimited. Does not implicitly {@link PB_SCLostTempleShopInfo.verify|verify} messages.
     * @param message PB_SCLostTempleShopInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCLostTempleShopInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCLostTempleShopInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCLostTempleShopInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCLostTempleShopInfo;

    /**
     * Decodes a PB_SCLostTempleShopInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCLostTempleShopInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCLostTempleShopInfo;

    /**
     * Verifies a PB_SCLostTempleShopInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCLostTempleShopInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCLostTempleShopInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCLostTempleShopInfo;

    /**
     * Creates a plain object from a PB_SCLostTempleShopInfo message. Also converts values to other types if specified.
     * @param message PB_SCLostTempleShopInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCLostTempleShopInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCLostTempleShopInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCLostTempleMissionInfo. */
export interface IPB_SCLostTempleMissionInfo {

    /** PB_SCLostTempleMissionInfo missionProgress */
    missionProgress?: (number[]|null);

    /** PB_SCLostTempleMissionInfo missionFetch */
    missionFetch?: (boolean[]|null);

    /** PB_SCLostTempleMissionInfo missionRewardFetchFlag */
    missionRewardFetchFlag?: (boolean[]|null);
}

/** Represents a PB_SCLostTempleMissionInfo. */
export class PB_SCLostTempleMissionInfo implements IPB_SCLostTempleMissionInfo {

    /**
     * Constructs a new PB_SCLostTempleMissionInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCLostTempleMissionInfo);

    /** PB_SCLostTempleMissionInfo missionProgress. */
    public missionProgress: number[];

    /** PB_SCLostTempleMissionInfo missionFetch. */
    public missionFetch: boolean[];

    /** PB_SCLostTempleMissionInfo missionRewardFetchFlag. */
    public missionRewardFetchFlag: boolean[];

    /**
     * Creates a new PB_SCLostTempleMissionInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCLostTempleMissionInfo instance
     */
    public static create(properties?: IPB_SCLostTempleMissionInfo): PB_SCLostTempleMissionInfo;

    /**
     * Encodes the specified PB_SCLostTempleMissionInfo message. Does not implicitly {@link PB_SCLostTempleMissionInfo.verify|verify} messages.
     * @param message PB_SCLostTempleMissionInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCLostTempleMissionInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCLostTempleMissionInfo message, length delimited. Does not implicitly {@link PB_SCLostTempleMissionInfo.verify|verify} messages.
     * @param message PB_SCLostTempleMissionInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCLostTempleMissionInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCLostTempleMissionInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCLostTempleMissionInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCLostTempleMissionInfo;

    /**
     * Decodes a PB_SCLostTempleMissionInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCLostTempleMissionInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCLostTempleMissionInfo;

    /**
     * Verifies a PB_SCLostTempleMissionInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCLostTempleMissionInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCLostTempleMissionInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCLostTempleMissionInfo;

    /**
     * Creates a plain object from a PB_SCLostTempleMissionInfo message. Also converts values to other types if specified.
     * @param message PB_SCLostTempleMissionInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCLostTempleMissionInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCLostTempleMissionInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCLostTempleItemList. */
export interface IPB_SCLostTempleItemList {

    /** PB_SCLostTempleItemList isActive */
    isActive?: (boolean|null);

    /** PB_SCLostTempleItemList isFetch */
    isFetch?: (boolean[]|null);
}

/** Represents a PB_SCLostTempleItemList. */
export class PB_SCLostTempleItemList implements IPB_SCLostTempleItemList {

    /**
     * Constructs a new PB_SCLostTempleItemList.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCLostTempleItemList);

    /** PB_SCLostTempleItemList isActive. */
    public isActive: boolean;

    /** PB_SCLostTempleItemList isFetch. */
    public isFetch: boolean[];

    /**
     * Creates a new PB_SCLostTempleItemList instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCLostTempleItemList instance
     */
    public static create(properties?: IPB_SCLostTempleItemList): PB_SCLostTempleItemList;

    /**
     * Encodes the specified PB_SCLostTempleItemList message. Does not implicitly {@link PB_SCLostTempleItemList.verify|verify} messages.
     * @param message PB_SCLostTempleItemList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCLostTempleItemList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCLostTempleItemList message, length delimited. Does not implicitly {@link PB_SCLostTempleItemList.verify|verify} messages.
     * @param message PB_SCLostTempleItemList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCLostTempleItemList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCLostTempleItemList message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCLostTempleItemList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCLostTempleItemList;

    /**
     * Decodes a PB_SCLostTempleItemList message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCLostTempleItemList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCLostTempleItemList;

    /**
     * Verifies a PB_SCLostTempleItemList message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCLostTempleItemList message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCLostTempleItemList
     */
    public static fromObject(object: { [k: string]: any }): PB_SCLostTempleItemList;

    /**
     * Creates a plain object from a PB_SCLostTempleItemList message. Also converts values to other types if specified.
     * @param message PB_SCLostTempleItemList
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCLostTempleItemList, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCLostTempleItemList to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCLostTempleItemInfo. */
export interface IPB_SCLostTempleItemInfo {

    /** PB_SCLostTempleItemInfo list */
    list?: (IPB_SCLostTempleItemList[]|null);

    /** PB_SCLostTempleItemInfo itemNum */
    itemNum?: (number|null);
}

/** Represents a PB_SCLostTempleItemInfo. */
export class PB_SCLostTempleItemInfo implements IPB_SCLostTempleItemInfo {

    /**
     * Constructs a new PB_SCLostTempleItemInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCLostTempleItemInfo);

    /** PB_SCLostTempleItemInfo list. */
    public list: IPB_SCLostTempleItemList[];

    /** PB_SCLostTempleItemInfo itemNum. */
    public itemNum: number;

    /**
     * Creates a new PB_SCLostTempleItemInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCLostTempleItemInfo instance
     */
    public static create(properties?: IPB_SCLostTempleItemInfo): PB_SCLostTempleItemInfo;

    /**
     * Encodes the specified PB_SCLostTempleItemInfo message. Does not implicitly {@link PB_SCLostTempleItemInfo.verify|verify} messages.
     * @param message PB_SCLostTempleItemInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCLostTempleItemInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCLostTempleItemInfo message, length delimited. Does not implicitly {@link PB_SCLostTempleItemInfo.verify|verify} messages.
     * @param message PB_SCLostTempleItemInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCLostTempleItemInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCLostTempleItemInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCLostTempleItemInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCLostTempleItemInfo;

    /**
     * Decodes a PB_SCLostTempleItemInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCLostTempleItemInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCLostTempleItemInfo;

    /**
     * Verifies a PB_SCLostTempleItemInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCLostTempleItemInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCLostTempleItemInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCLostTempleItemInfo;

    /**
     * Creates a plain object from a PB_SCLostTempleItemInfo message. Also converts values to other types if specified.
     * @param message PB_SCLostTempleItemInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCLostTempleItemInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCLostTempleItemInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCHouZhaiInfo. */
export interface IPB_SCHouZhaiInfo {

    /** PB_SCHouZhaiInfo passBlock */
    passBlock?: (number|null);

    /** PB_SCHouZhaiInfo passRound */
    passRound?: (number|null);
}

/** Represents a PB_SCHouZhaiInfo. */
export class PB_SCHouZhaiInfo implements IPB_SCHouZhaiInfo {

    /**
     * Constructs a new PB_SCHouZhaiInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCHouZhaiInfo);

    /** PB_SCHouZhaiInfo passBlock. */
    public passBlock: number;

    /** PB_SCHouZhaiInfo passRound. */
    public passRound: number;

    /**
     * Creates a new PB_SCHouZhaiInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCHouZhaiInfo instance
     */
    public static create(properties?: IPB_SCHouZhaiInfo): PB_SCHouZhaiInfo;

    /**
     * Encodes the specified PB_SCHouZhaiInfo message. Does not implicitly {@link PB_SCHouZhaiInfo.verify|verify} messages.
     * @param message PB_SCHouZhaiInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCHouZhaiInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCHouZhaiInfo message, length delimited. Does not implicitly {@link PB_SCHouZhaiInfo.verify|verify} messages.
     * @param message PB_SCHouZhaiInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCHouZhaiInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCHouZhaiInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCHouZhaiInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCHouZhaiInfo;

    /**
     * Decodes a PB_SCHouZhaiInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCHouZhaiInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCHouZhaiInfo;

    /**
     * Verifies a PB_SCHouZhaiInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCHouZhaiInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCHouZhaiInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCHouZhaiInfo;

    /**
     * Creates a plain object from a PB_SCHouZhaiInfo message. Also converts values to other types if specified.
     * @param message PB_SCHouZhaiInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCHouZhaiInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCHouZhaiInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCZombiGoGoGoPassList. */
export interface IPB_SCZombiGoGoGoPassList {

    /** PB_SCZombiGoGoGoPassList isActive */
    isActive?: (boolean|null);

    /** PB_SCZombiGoGoGoPassList isFetch */
    isFetch?: (boolean[]|null);
}

/** Represents a PB_SCZombiGoGoGoPassList. */
export class PB_SCZombiGoGoGoPassList implements IPB_SCZombiGoGoGoPassList {

    /**
     * Constructs a new PB_SCZombiGoGoGoPassList.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCZombiGoGoGoPassList);

    /** PB_SCZombiGoGoGoPassList isActive. */
    public isActive: boolean;

    /** PB_SCZombiGoGoGoPassList isFetch. */
    public isFetch: boolean[];

    /**
     * Creates a new PB_SCZombiGoGoGoPassList instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCZombiGoGoGoPassList instance
     */
    public static create(properties?: IPB_SCZombiGoGoGoPassList): PB_SCZombiGoGoGoPassList;

    /**
     * Encodes the specified PB_SCZombiGoGoGoPassList message. Does not implicitly {@link PB_SCZombiGoGoGoPassList.verify|verify} messages.
     * @param message PB_SCZombiGoGoGoPassList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCZombiGoGoGoPassList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCZombiGoGoGoPassList message, length delimited. Does not implicitly {@link PB_SCZombiGoGoGoPassList.verify|verify} messages.
     * @param message PB_SCZombiGoGoGoPassList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCZombiGoGoGoPassList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCZombiGoGoGoPassList message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCZombiGoGoGoPassList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCZombiGoGoGoPassList;

    /**
     * Decodes a PB_SCZombiGoGoGoPassList message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCZombiGoGoGoPassList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCZombiGoGoGoPassList;

    /**
     * Verifies a PB_SCZombiGoGoGoPassList message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCZombiGoGoGoPassList message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCZombiGoGoGoPassList
     */
    public static fromObject(object: { [k: string]: any }): PB_SCZombiGoGoGoPassList;

    /**
     * Creates a plain object from a PB_SCZombiGoGoGoPassList message. Also converts values to other types if specified.
     * @param message PB_SCZombiGoGoGoPassList
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCZombiGoGoGoPassList, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCZombiGoGoGoPassList to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCZombiGoGoGoPassInfo. */
export interface IPB_SCZombiGoGoGoPassInfo {

    /** PB_SCZombiGoGoGoPassInfo list */
    list?: (IPB_SCZombiGoGoGoPassList[]|null);

    /** PB_SCZombiGoGoGoPassInfo killNum */
    killNum?: (number|null);
}

/** Represents a PB_SCZombiGoGoGoPassInfo. */
export class PB_SCZombiGoGoGoPassInfo implements IPB_SCZombiGoGoGoPassInfo {

    /**
     * Constructs a new PB_SCZombiGoGoGoPassInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCZombiGoGoGoPassInfo);

    /** PB_SCZombiGoGoGoPassInfo list. */
    public list: IPB_SCZombiGoGoGoPassList[];

    /** PB_SCZombiGoGoGoPassInfo killNum. */
    public killNum: number;

    /**
     * Creates a new PB_SCZombiGoGoGoPassInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCZombiGoGoGoPassInfo instance
     */
    public static create(properties?: IPB_SCZombiGoGoGoPassInfo): PB_SCZombiGoGoGoPassInfo;

    /**
     * Encodes the specified PB_SCZombiGoGoGoPassInfo message. Does not implicitly {@link PB_SCZombiGoGoGoPassInfo.verify|verify} messages.
     * @param message PB_SCZombiGoGoGoPassInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCZombiGoGoGoPassInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCZombiGoGoGoPassInfo message, length delimited. Does not implicitly {@link PB_SCZombiGoGoGoPassInfo.verify|verify} messages.
     * @param message PB_SCZombiGoGoGoPassInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCZombiGoGoGoPassInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCZombiGoGoGoPassInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCZombiGoGoGoPassInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCZombiGoGoGoPassInfo;

    /**
     * Decodes a PB_SCZombiGoGoGoPassInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCZombiGoGoGoPassInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCZombiGoGoGoPassInfo;

    /**
     * Verifies a PB_SCZombiGoGoGoPassInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCZombiGoGoGoPassInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCZombiGoGoGoPassInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCZombiGoGoGoPassInfo;

    /**
     * Creates a plain object from a PB_SCZombiGoGoGoPassInfo message. Also converts values to other types if specified.
     * @param message PB_SCZombiGoGoGoPassInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCZombiGoGoGoPassInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCZombiGoGoGoPassInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCSevenDayGiftInfo. */
export interface IPB_SCSevenDayGiftInfo {

    /** PB_SCSevenDayGiftInfo isFetch */
    isFetch?: (boolean[]|null);

    /** PB_SCSevenDayGiftInfo beginTime */
    beginTime?: (number|Long|null);
}

/** Represents a PB_SCSevenDayGiftInfo. */
export class PB_SCSevenDayGiftInfo implements IPB_SCSevenDayGiftInfo {

    /**
     * Constructs a new PB_SCSevenDayGiftInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCSevenDayGiftInfo);

    /** PB_SCSevenDayGiftInfo isFetch. */
    public isFetch: boolean[];

    /** PB_SCSevenDayGiftInfo beginTime. */
    public beginTime: (number|Long);

    /**
     * Creates a new PB_SCSevenDayGiftInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCSevenDayGiftInfo instance
     */
    public static create(properties?: IPB_SCSevenDayGiftInfo): PB_SCSevenDayGiftInfo;

    /**
     * Encodes the specified PB_SCSevenDayGiftInfo message. Does not implicitly {@link PB_SCSevenDayGiftInfo.verify|verify} messages.
     * @param message PB_SCSevenDayGiftInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCSevenDayGiftInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCSevenDayGiftInfo message, length delimited. Does not implicitly {@link PB_SCSevenDayGiftInfo.verify|verify} messages.
     * @param message PB_SCSevenDayGiftInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCSevenDayGiftInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCSevenDayGiftInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCSevenDayGiftInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCSevenDayGiftInfo;

    /**
     * Decodes a PB_SCSevenDayGiftInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCSevenDayGiftInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCSevenDayGiftInfo;

    /**
     * Verifies a PB_SCSevenDayGiftInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCSevenDayGiftInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCSevenDayGiftInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCSevenDayGiftInfo;

    /**
     * Creates a plain object from a PB_SCSevenDayGiftInfo message. Also converts values to other types if specified.
     * @param message PB_SCSevenDayGiftInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCSevenDayGiftInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCSevenDayGiftInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaGeneNewbeeGiftInfo. */
export interface IPB_SCRaGeneNewbeeGiftInfo {

    /** PB_SCRaGeneNewbeeGiftInfo seq */
    seq?: (number|null);
}

/** Represents a PB_SCRaGeneNewbeeGiftInfo. */
export class PB_SCRaGeneNewbeeGiftInfo implements IPB_SCRaGeneNewbeeGiftInfo {

    /**
     * Constructs a new PB_SCRaGeneNewbeeGiftInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaGeneNewbeeGiftInfo);

    /** PB_SCRaGeneNewbeeGiftInfo seq. */
    public seq: number;

    /**
     * Creates a new PB_SCRaGeneNewbeeGiftInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaGeneNewbeeGiftInfo instance
     */
    public static create(properties?: IPB_SCRaGeneNewbeeGiftInfo): PB_SCRaGeneNewbeeGiftInfo;

    /**
     * Encodes the specified PB_SCRaGeneNewbeeGiftInfo message. Does not implicitly {@link PB_SCRaGeneNewbeeGiftInfo.verify|verify} messages.
     * @param message PB_SCRaGeneNewbeeGiftInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaGeneNewbeeGiftInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaGeneNewbeeGiftInfo message, length delimited. Does not implicitly {@link PB_SCRaGeneNewbeeGiftInfo.verify|verify} messages.
     * @param message PB_SCRaGeneNewbeeGiftInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaGeneNewbeeGiftInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaGeneNewbeeGiftInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaGeneNewbeeGiftInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaGeneNewbeeGiftInfo;

    /**
     * Decodes a PB_SCRaGeneNewbeeGiftInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaGeneNewbeeGiftInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaGeneNewbeeGiftInfo;

    /**
     * Verifies a PB_SCRaGeneNewbeeGiftInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaGeneNewbeeGiftInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaGeneNewbeeGiftInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaGeneNewbeeGiftInfo;

    /**
     * Creates a plain object from a PB_SCRaGeneNewbeeGiftInfo message. Also converts values to other types if specified.
     * @param message PB_SCRaGeneNewbeeGiftInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaGeneNewbeeGiftInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaGeneNewbeeGiftInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaTimeLimitRechargeInfo. */
export interface IPB_SCRaTimeLimitRechargeInfo {

    /** PB_SCRaTimeLimitRechargeInfo rechargeNum */
    rechargeNum?: (number|null);

    /** PB_SCRaTimeLimitRechargeInfo isFetch */
    isFetch?: (boolean[]|null);
}

/** Represents a PB_SCRaTimeLimitRechargeInfo. */
export class PB_SCRaTimeLimitRechargeInfo implements IPB_SCRaTimeLimitRechargeInfo {

    /**
     * Constructs a new PB_SCRaTimeLimitRechargeInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaTimeLimitRechargeInfo);

    /** PB_SCRaTimeLimitRechargeInfo rechargeNum. */
    public rechargeNum: number;

    /** PB_SCRaTimeLimitRechargeInfo isFetch. */
    public isFetch: boolean[];

    /**
     * Creates a new PB_SCRaTimeLimitRechargeInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaTimeLimitRechargeInfo instance
     */
    public static create(properties?: IPB_SCRaTimeLimitRechargeInfo): PB_SCRaTimeLimitRechargeInfo;

    /**
     * Encodes the specified PB_SCRaTimeLimitRechargeInfo message. Does not implicitly {@link PB_SCRaTimeLimitRechargeInfo.verify|verify} messages.
     * @param message PB_SCRaTimeLimitRechargeInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaTimeLimitRechargeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaTimeLimitRechargeInfo message, length delimited. Does not implicitly {@link PB_SCRaTimeLimitRechargeInfo.verify|verify} messages.
     * @param message PB_SCRaTimeLimitRechargeInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaTimeLimitRechargeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaTimeLimitRechargeInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaTimeLimitRechargeInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaTimeLimitRechargeInfo;

    /**
     * Decodes a PB_SCRaTimeLimitRechargeInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaTimeLimitRechargeInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaTimeLimitRechargeInfo;

    /**
     * Verifies a PB_SCRaTimeLimitRechargeInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaTimeLimitRechargeInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaTimeLimitRechargeInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaTimeLimitRechargeInfo;

    /**
     * Creates a plain object from a PB_SCRaTimeLimitRechargeInfo message. Also converts values to other types if specified.
     * @param message PB_SCRaTimeLimitRechargeInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaTimeLimitRechargeInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaTimeLimitRechargeInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaCavePassList. */
export interface IPB_SCRaCavePassList {

    /** PB_SCRaCavePassList isActive */
    isActive?: (boolean|null);

    /** PB_SCRaCavePassList isFetch */
    isFetch?: (boolean[]|null);
}

/** Represents a PB_SCRaCavePassList. */
export class PB_SCRaCavePassList implements IPB_SCRaCavePassList {

    /**
     * Constructs a new PB_SCRaCavePassList.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaCavePassList);

    /** PB_SCRaCavePassList isActive. */
    public isActive: boolean;

    /** PB_SCRaCavePassList isFetch. */
    public isFetch: boolean[];

    /**
     * Creates a new PB_SCRaCavePassList instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaCavePassList instance
     */
    public static create(properties?: IPB_SCRaCavePassList): PB_SCRaCavePassList;

    /**
     * Encodes the specified PB_SCRaCavePassList message. Does not implicitly {@link PB_SCRaCavePassList.verify|verify} messages.
     * @param message PB_SCRaCavePassList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaCavePassList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaCavePassList message, length delimited. Does not implicitly {@link PB_SCRaCavePassList.verify|verify} messages.
     * @param message PB_SCRaCavePassList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaCavePassList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaCavePassList message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaCavePassList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaCavePassList;

    /**
     * Decodes a PB_SCRaCavePassList message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaCavePassList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaCavePassList;

    /**
     * Verifies a PB_SCRaCavePassList message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaCavePassList message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaCavePassList
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaCavePassList;

    /**
     * Creates a plain object from a PB_SCRaCavePassList message. Also converts values to other types if specified.
     * @param message PB_SCRaCavePassList
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaCavePassList, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaCavePassList to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaCavePassInfo. */
export interface IPB_SCRaCavePassInfo {

    /** PB_SCRaCavePassInfo list */
    list?: (IPB_SCRaRoundPassList[]|null);

    /** PB_SCRaCavePassInfo meters */
    meters?: (number|null);

    /** PB_SCRaCavePassInfo fetchExRewardCount */
    fetchExRewardCount?: (number|null);
}

/** Represents a PB_SCRaCavePassInfo. */
export class PB_SCRaCavePassInfo implements IPB_SCRaCavePassInfo {

    /**
     * Constructs a new PB_SCRaCavePassInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaCavePassInfo);

    /** PB_SCRaCavePassInfo list. */
    public list: IPB_SCRaRoundPassList[];

    /** PB_SCRaCavePassInfo meters. */
    public meters: number;

    /** PB_SCRaCavePassInfo fetchExRewardCount. */
    public fetchExRewardCount: number;

    /**
     * Creates a new PB_SCRaCavePassInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaCavePassInfo instance
     */
    public static create(properties?: IPB_SCRaCavePassInfo): PB_SCRaCavePassInfo;

    /**
     * Encodes the specified PB_SCRaCavePassInfo message. Does not implicitly {@link PB_SCRaCavePassInfo.verify|verify} messages.
     * @param message PB_SCRaCavePassInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaCavePassInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaCavePassInfo message, length delimited. Does not implicitly {@link PB_SCRaCavePassInfo.verify|verify} messages.
     * @param message PB_SCRaCavePassInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaCavePassInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaCavePassInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaCavePassInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaCavePassInfo;

    /**
     * Decodes a PB_SCRaCavePassInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaCavePassInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaCavePassInfo;

    /**
     * Verifies a PB_SCRaCavePassInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaCavePassInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaCavePassInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaCavePassInfo;

    /**
     * Creates a plain object from a PB_SCRaCavePassInfo message. Also converts values to other types if specified.
     * @param message PB_SCRaCavePassInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaCavePassInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaCavePassInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaGeneGiftInfo. */
export interface IPB_SCRaGeneGiftInfo {

    /** PB_SCRaGeneGiftInfo giftHeroId */
    giftHeroId?: (number[]|null);

    /** PB_SCRaGeneGiftInfo giftEndTime */
    giftEndTime?: ((number|Long)[]|null);
}

/** Represents a PB_SCRaGeneGiftInfo. */
export class PB_SCRaGeneGiftInfo implements IPB_SCRaGeneGiftInfo {

    /**
     * Constructs a new PB_SCRaGeneGiftInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaGeneGiftInfo);

    /** PB_SCRaGeneGiftInfo giftHeroId. */
    public giftHeroId: number[];

    /** PB_SCRaGeneGiftInfo giftEndTime. */
    public giftEndTime: (number|Long)[];

    /**
     * Creates a new PB_SCRaGeneGiftInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaGeneGiftInfo instance
     */
    public static create(properties?: IPB_SCRaGeneGiftInfo): PB_SCRaGeneGiftInfo;

    /**
     * Encodes the specified PB_SCRaGeneGiftInfo message. Does not implicitly {@link PB_SCRaGeneGiftInfo.verify|verify} messages.
     * @param message PB_SCRaGeneGiftInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaGeneGiftInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaGeneGiftInfo message, length delimited. Does not implicitly {@link PB_SCRaGeneGiftInfo.verify|verify} messages.
     * @param message PB_SCRaGeneGiftInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaGeneGiftInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaGeneGiftInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaGeneGiftInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaGeneGiftInfo;

    /**
     * Decodes a PB_SCRaGeneGiftInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaGeneGiftInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaGeneGiftInfo;

    /**
     * Verifies a PB_SCRaGeneGiftInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaGeneGiftInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaGeneGiftInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaGeneGiftInfo;

    /**
     * Creates a plain object from a PB_SCRaGeneGiftInfo message. Also converts values to other types if specified.
     * @param message PB_SCRaGeneGiftInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaGeneGiftInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaGeneGiftInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaPartsGiftInfo. */
export interface IPB_SCRaPartsGiftInfo {

    /** PB_SCRaPartsGiftInfo giftSeq */
    giftSeq?: (number|null);

    /** PB_SCRaPartsGiftInfo beginTime */
    beginTime?: (number|Long|null);

    /** PB_SCRaPartsGiftInfo endTime */
    endTime?: (number|Long|null);
}

/** Represents a PB_SCRaPartsGiftInfo. */
export class PB_SCRaPartsGiftInfo implements IPB_SCRaPartsGiftInfo {

    /**
     * Constructs a new PB_SCRaPartsGiftInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaPartsGiftInfo);

    /** PB_SCRaPartsGiftInfo giftSeq. */
    public giftSeq: number;

    /** PB_SCRaPartsGiftInfo beginTime. */
    public beginTime: (number|Long);

    /** PB_SCRaPartsGiftInfo endTime. */
    public endTime: (number|Long);

    /**
     * Creates a new PB_SCRaPartsGiftInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaPartsGiftInfo instance
     */
    public static create(properties?: IPB_SCRaPartsGiftInfo): PB_SCRaPartsGiftInfo;

    /**
     * Encodes the specified PB_SCRaPartsGiftInfo message. Does not implicitly {@link PB_SCRaPartsGiftInfo.verify|verify} messages.
     * @param message PB_SCRaPartsGiftInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaPartsGiftInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaPartsGiftInfo message, length delimited. Does not implicitly {@link PB_SCRaPartsGiftInfo.verify|verify} messages.
     * @param message PB_SCRaPartsGiftInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaPartsGiftInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaPartsGiftInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaPartsGiftInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaPartsGiftInfo;

    /**
     * Decodes a PB_SCRaPartsGiftInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaPartsGiftInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaPartsGiftInfo;

    /**
     * Verifies a PB_SCRaPartsGiftInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaPartsGiftInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaPartsGiftInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaPartsGiftInfo;

    /**
     * Creates a plain object from a PB_SCRaPartsGiftInfo message. Also converts values to other types if specified.
     * @param message PB_SCRaPartsGiftInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaPartsGiftInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaPartsGiftInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaBackYardInfo. */
export interface IPB_SCRaBackYardInfo {

    /** PB_SCRaBackYardInfo fightCount */
    fightCount?: (number|null);

    /** PB_SCRaBackYardInfo passDay */
    passDay?: (number|null);

    /** PB_SCRaBackYardInfo rewardFlag */
    rewardFlag?: (boolean[]|null);
}

/** Represents a PB_SCRaBackYardInfo. */
export class PB_SCRaBackYardInfo implements IPB_SCRaBackYardInfo {

    /**
     * Constructs a new PB_SCRaBackYardInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaBackYardInfo);

    /** PB_SCRaBackYardInfo fightCount. */
    public fightCount: number;

    /** PB_SCRaBackYardInfo passDay. */
    public passDay: number;

    /** PB_SCRaBackYardInfo rewardFlag. */
    public rewardFlag: boolean[];

    /**
     * Creates a new PB_SCRaBackYardInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaBackYardInfo instance
     */
    public static create(properties?: IPB_SCRaBackYardInfo): PB_SCRaBackYardInfo;

    /**
     * Encodes the specified PB_SCRaBackYardInfo message. Does not implicitly {@link PB_SCRaBackYardInfo.verify|verify} messages.
     * @param message PB_SCRaBackYardInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaBackYardInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaBackYardInfo message, length delimited. Does not implicitly {@link PB_SCRaBackYardInfo.verify|verify} messages.
     * @param message PB_SCRaBackYardInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaBackYardInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaBackYardInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaBackYardInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaBackYardInfo;

    /**
     * Decodes a PB_SCRaBackYardInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaBackYardInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaBackYardInfo;

    /**
     * Verifies a PB_SCRaBackYardInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaBackYardInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaBackYardInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaBackYardInfo;

    /**
     * Creates a plain object from a PB_SCRaBackYardInfo message. Also converts values to other types if specified.
     * @param message PB_SCRaBackYardInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaBackYardInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaBackYardInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCBackYardPassList. */
export interface IPB_SCBackYardPassList {

    /** PB_SCBackYardPassList isActive */
    isActive?: (boolean|null);

    /** PB_SCBackYardPassList isFetch */
    isFetch?: (boolean[]|null);
}

/** Represents a PB_SCBackYardPassList. */
export class PB_SCBackYardPassList implements IPB_SCBackYardPassList {

    /**
     * Constructs a new PB_SCBackYardPassList.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCBackYardPassList);

    /** PB_SCBackYardPassList isActive. */
    public isActive: boolean;

    /** PB_SCBackYardPassList isFetch. */
    public isFetch: boolean[];

    /**
     * Creates a new PB_SCBackYardPassList instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCBackYardPassList instance
     */
    public static create(properties?: IPB_SCBackYardPassList): PB_SCBackYardPassList;

    /**
     * Encodes the specified PB_SCBackYardPassList message. Does not implicitly {@link PB_SCBackYardPassList.verify|verify} messages.
     * @param message PB_SCBackYardPassList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCBackYardPassList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCBackYardPassList message, length delimited. Does not implicitly {@link PB_SCBackYardPassList.verify|verify} messages.
     * @param message PB_SCBackYardPassList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCBackYardPassList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCBackYardPassList message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCBackYardPassList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCBackYardPassList;

    /**
     * Decodes a PB_SCBackYardPassList message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCBackYardPassList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCBackYardPassList;

    /**
     * Verifies a PB_SCBackYardPassList message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCBackYardPassList message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCBackYardPassList
     */
    public static fromObject(object: { [k: string]: any }): PB_SCBackYardPassList;

    /**
     * Creates a plain object from a PB_SCBackYardPassList message. Also converts values to other types if specified.
     * @param message PB_SCBackYardPassList
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCBackYardPassList, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCBackYardPassList to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaBackYardPassInfo. */
export interface IPB_SCRaBackYardPassInfo {

    /** PB_SCRaBackYardPassInfo list */
    list?: (IPB_SCBackYardPassList[]|null);

    /** PB_SCRaBackYardPassInfo passDay */
    passDay?: (number|null);
}

/** Represents a PB_SCRaBackYardPassInfo. */
export class PB_SCRaBackYardPassInfo implements IPB_SCRaBackYardPassInfo {

    /**
     * Constructs a new PB_SCRaBackYardPassInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaBackYardPassInfo);

    /** PB_SCRaBackYardPassInfo list. */
    public list: IPB_SCBackYardPassList[];

    /** PB_SCRaBackYardPassInfo passDay. */
    public passDay: number;

    /**
     * Creates a new PB_SCRaBackYardPassInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaBackYardPassInfo instance
     */
    public static create(properties?: IPB_SCRaBackYardPassInfo): PB_SCRaBackYardPassInfo;

    /**
     * Encodes the specified PB_SCRaBackYardPassInfo message. Does not implicitly {@link PB_SCRaBackYardPassInfo.verify|verify} messages.
     * @param message PB_SCRaBackYardPassInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaBackYardPassInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaBackYardPassInfo message, length delimited. Does not implicitly {@link PB_SCRaBackYardPassInfo.verify|verify} messages.
     * @param message PB_SCRaBackYardPassInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaBackYardPassInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaBackYardPassInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaBackYardPassInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaBackYardPassInfo;

    /**
     * Decodes a PB_SCRaBackYardPassInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaBackYardPassInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaBackYardPassInfo;

    /**
     * Verifies a PB_SCRaBackYardPassInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaBackYardPassInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaBackYardPassInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaBackYardPassInfo;

    /**
     * Creates a plain object from a PB_SCRaBackYardPassInfo message. Also converts values to other types if specified.
     * @param message PB_SCRaBackYardPassInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaBackYardPassInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaBackYardPassInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaFarmingTask. */
export interface IPB_SCRaFarmingTask {

    /** PB_SCRaFarmingTask taskSeq */
    taskSeq?: (number|null);

    /** PB_SCRaFarmingTask taskTypeProgress */
    taskTypeProgress?: (number|Long|null);
}

/** Represents a PB_SCRaFarmingTask. */
export class PB_SCRaFarmingTask implements IPB_SCRaFarmingTask {

    /**
     * Constructs a new PB_SCRaFarmingTask.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaFarmingTask);

    /** PB_SCRaFarmingTask taskSeq. */
    public taskSeq: number;

    /** PB_SCRaFarmingTask taskTypeProgress. */
    public taskTypeProgress: (number|Long);

    /**
     * Creates a new PB_SCRaFarmingTask instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaFarmingTask instance
     */
    public static create(properties?: IPB_SCRaFarmingTask): PB_SCRaFarmingTask;

    /**
     * Encodes the specified PB_SCRaFarmingTask message. Does not implicitly {@link PB_SCRaFarmingTask.verify|verify} messages.
     * @param message PB_SCRaFarmingTask message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaFarmingTask, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaFarmingTask message, length delimited. Does not implicitly {@link PB_SCRaFarmingTask.verify|verify} messages.
     * @param message PB_SCRaFarmingTask message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaFarmingTask, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaFarmingTask message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaFarmingTask
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaFarmingTask;

    /**
     * Decodes a PB_SCRaFarmingTask message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaFarmingTask
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaFarmingTask;

    /**
     * Verifies a PB_SCRaFarmingTask message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaFarmingTask message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaFarmingTask
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaFarmingTask;

    /**
     * Creates a plain object from a PB_SCRaFarmingTask message. Also converts values to other types if specified.
     * @param message PB_SCRaFarmingTask
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaFarmingTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaFarmingTask to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaFarminginfo. */
export interface IPB_SCRaFarminginfo {

    /** PB_SCRaFarminginfo taskList */
    taskList?: (IPB_SCRaFarmingTask[]|null);

    /** PB_SCRaFarminginfo lineRewardFlag */
    lineRewardFlag?: (boolean[]|null);

    /** PB_SCRaFarminginfo cellList */
    cellList?: (boolean[]|null);

    /** PB_SCRaFarminginfo shopBuyCount */
    shopBuyCount?: (number[]|null);

    /** PB_SCRaFarminginfo cellCount */
    cellCount?: (number|null);

    /** PB_SCRaFarminginfo cellCountIsFetch */
    cellCountIsFetch?: (boolean|null);
}

/** Represents a PB_SCRaFarminginfo. */
export class PB_SCRaFarminginfo implements IPB_SCRaFarminginfo {

    /**
     * Constructs a new PB_SCRaFarminginfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaFarminginfo);

    /** PB_SCRaFarminginfo taskList. */
    public taskList: IPB_SCRaFarmingTask[];

    /** PB_SCRaFarminginfo lineRewardFlag. */
    public lineRewardFlag: boolean[];

    /** PB_SCRaFarminginfo cellList. */
    public cellList: boolean[];

    /** PB_SCRaFarminginfo shopBuyCount. */
    public shopBuyCount: number[];

    /** PB_SCRaFarminginfo cellCount. */
    public cellCount: number;

    /** PB_SCRaFarminginfo cellCountIsFetch. */
    public cellCountIsFetch: boolean;

    /**
     * Creates a new PB_SCRaFarminginfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaFarminginfo instance
     */
    public static create(properties?: IPB_SCRaFarminginfo): PB_SCRaFarminginfo;

    /**
     * Encodes the specified PB_SCRaFarminginfo message. Does not implicitly {@link PB_SCRaFarminginfo.verify|verify} messages.
     * @param message PB_SCRaFarminginfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaFarminginfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaFarminginfo message, length delimited. Does not implicitly {@link PB_SCRaFarminginfo.verify|verify} messages.
     * @param message PB_SCRaFarminginfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaFarminginfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaFarminginfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaFarminginfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaFarminginfo;

    /**
     * Decodes a PB_SCRaFarminginfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaFarminginfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaFarminginfo;

    /**
     * Verifies a PB_SCRaFarminginfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaFarminginfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaFarminginfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaFarminginfo;

    /**
     * Creates a plain object from a PB_SCRaFarminginfo message. Also converts values to other types if specified.
     * @param message PB_SCRaFarminginfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaFarminginfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaFarminginfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCArenaPassList. */
export interface IPB_SCArenaPassList {

    /** PB_SCArenaPassList isActive */
    isActive?: (boolean|null);

    /** PB_SCArenaPassList isFetch */
    isFetch?: (boolean[]|null);
}

/** Represents a PB_SCArenaPassList. */
export class PB_SCArenaPassList implements IPB_SCArenaPassList {

    /**
     * Constructs a new PB_SCArenaPassList.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCArenaPassList);

    /** PB_SCArenaPassList isActive. */
    public isActive: boolean;

    /** PB_SCArenaPassList isFetch. */
    public isFetch: boolean[];

    /**
     * Creates a new PB_SCArenaPassList instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCArenaPassList instance
     */
    public static create(properties?: IPB_SCArenaPassList): PB_SCArenaPassList;

    /**
     * Encodes the specified PB_SCArenaPassList message. Does not implicitly {@link PB_SCArenaPassList.verify|verify} messages.
     * @param message PB_SCArenaPassList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCArenaPassList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCArenaPassList message, length delimited. Does not implicitly {@link PB_SCArenaPassList.verify|verify} messages.
     * @param message PB_SCArenaPassList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCArenaPassList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCArenaPassList message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCArenaPassList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCArenaPassList;

    /**
     * Decodes a PB_SCArenaPassList message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCArenaPassList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCArenaPassList;

    /**
     * Verifies a PB_SCArenaPassList message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCArenaPassList message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCArenaPassList
     */
    public static fromObject(object: { [k: string]: any }): PB_SCArenaPassList;

    /**
     * Creates a plain object from a PB_SCArenaPassList message. Also converts values to other types if specified.
     * @param message PB_SCArenaPassList
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCArenaPassList, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCArenaPassList to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaArenaPassInfo. */
export interface IPB_SCRaArenaPassInfo {

    /** PB_SCRaArenaPassInfo list */
    list?: (IPB_SCBackYardPassList[]|null);

    /** PB_SCRaArenaPassInfo score */
    score?: (number|null);

    /** PB_SCRaArenaPassInfo fetchExRewardCount */
    fetchExRewardCount?: (number|null);

    /** PB_SCRaArenaPassInfo level */
    level?: (number|null);
}

/** Represents a PB_SCRaArenaPassInfo. */
export class PB_SCRaArenaPassInfo implements IPB_SCRaArenaPassInfo {

    /**
     * Constructs a new PB_SCRaArenaPassInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaArenaPassInfo);

    /** PB_SCRaArenaPassInfo list. */
    public list: IPB_SCBackYardPassList[];

    /** PB_SCRaArenaPassInfo score. */
    public score: number;

    /** PB_SCRaArenaPassInfo fetchExRewardCount. */
    public fetchExRewardCount: number;

    /** PB_SCRaArenaPassInfo level. */
    public level: number;

    /**
     * Creates a new PB_SCRaArenaPassInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaArenaPassInfo instance
     */
    public static create(properties?: IPB_SCRaArenaPassInfo): PB_SCRaArenaPassInfo;

    /**
     * Encodes the specified PB_SCRaArenaPassInfo message. Does not implicitly {@link PB_SCRaArenaPassInfo.verify|verify} messages.
     * @param message PB_SCRaArenaPassInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaArenaPassInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaArenaPassInfo message, length delimited. Does not implicitly {@link PB_SCRaArenaPassInfo.verify|verify} messages.
     * @param message PB_SCRaArenaPassInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaArenaPassInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaArenaPassInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaArenaPassInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaArenaPassInfo;

    /**
     * Decodes a PB_SCRaArenaPassInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaArenaPassInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaArenaPassInfo;

    /**
     * Verifies a PB_SCRaArenaPassInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaArenaPassInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaArenaPassInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaArenaPassInfo;

    /**
     * Creates a plain object from a PB_SCRaArenaPassInfo message. Also converts values to other types if specified.
     * @param message PB_SCRaArenaPassInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaArenaPassInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaArenaPassInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaFarmingRet. */
export interface IPB_SCRaFarmingRet {

    /** PB_SCRaFarmingRet retType */
    retType?: (number|null);

    /** PB_SCRaFarmingRet param */
    param?: (number[]|null);
}

/** Represents a PB_SCRaFarmingRet. */
export class PB_SCRaFarmingRet implements IPB_SCRaFarmingRet {

    /**
     * Constructs a new PB_SCRaFarmingRet.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaFarmingRet);

    /** PB_SCRaFarmingRet retType. */
    public retType: number;

    /** PB_SCRaFarmingRet param. */
    public param: number[];

    /**
     * Creates a new PB_SCRaFarmingRet instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaFarmingRet instance
     */
    public static create(properties?: IPB_SCRaFarmingRet): PB_SCRaFarmingRet;

    /**
     * Encodes the specified PB_SCRaFarmingRet message. Does not implicitly {@link PB_SCRaFarmingRet.verify|verify} messages.
     * @param message PB_SCRaFarmingRet message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaFarmingRet, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaFarmingRet message, length delimited. Does not implicitly {@link PB_SCRaFarmingRet.verify|verify} messages.
     * @param message PB_SCRaFarmingRet message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaFarmingRet, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaFarmingRet message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaFarmingRet
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaFarmingRet;

    /**
     * Decodes a PB_SCRaFarmingRet message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaFarmingRet
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaFarmingRet;

    /**
     * Verifies a PB_SCRaFarmingRet message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaFarmingRet message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaFarmingRet
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaFarmingRet;

    /**
     * Creates a plain object from a PB_SCRaFarmingRet message. Also converts values to other types if specified.
     * @param message PB_SCRaFarmingRet
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaFarmingRet, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaFarmingRet to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaFishPassList. */
export interface IPB_SCRaFishPassList {

    /** PB_SCRaFishPassList isActive */
    isActive?: (boolean|null);

    /** PB_SCRaFishPassList isFetch */
    isFetch?: (boolean[]|null);
}

/** Represents a PB_SCRaFishPassList. */
export class PB_SCRaFishPassList implements IPB_SCRaFishPassList {

    /**
     * Constructs a new PB_SCRaFishPassList.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaFishPassList);

    /** PB_SCRaFishPassList isActive. */
    public isActive: boolean;

    /** PB_SCRaFishPassList isFetch. */
    public isFetch: boolean[];

    /**
     * Creates a new PB_SCRaFishPassList instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaFishPassList instance
     */
    public static create(properties?: IPB_SCRaFishPassList): PB_SCRaFishPassList;

    /**
     * Encodes the specified PB_SCRaFishPassList message. Does not implicitly {@link PB_SCRaFishPassList.verify|verify} messages.
     * @param message PB_SCRaFishPassList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaFishPassList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaFishPassList message, length delimited. Does not implicitly {@link PB_SCRaFishPassList.verify|verify} messages.
     * @param message PB_SCRaFishPassList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaFishPassList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaFishPassList message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaFishPassList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaFishPassList;

    /**
     * Decodes a PB_SCRaFishPassList message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaFishPassList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaFishPassList;

    /**
     * Verifies a PB_SCRaFishPassList message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaFishPassList message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaFishPassList
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaFishPassList;

    /**
     * Creates a plain object from a PB_SCRaFishPassList message. Also converts values to other types if specified.
     * @param message PB_SCRaFishPassList
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaFishPassList, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaFishPassList to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaFishPassInfo. */
export interface IPB_SCRaFishPassInfo {

    /** PB_SCRaFishPassInfo list */
    list?: (IPB_SCRaRoundPassList[]|null);

    /** PB_SCRaFishPassInfo meters */
    meters?: (number|null);

    /** PB_SCRaFishPassInfo fetchExRewardCount */
    fetchExRewardCount?: (number|null);
}

/** Represents a PB_SCRaFishPassInfo. */
export class PB_SCRaFishPassInfo implements IPB_SCRaFishPassInfo {

    /**
     * Constructs a new PB_SCRaFishPassInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaFishPassInfo);

    /** PB_SCRaFishPassInfo list. */
    public list: IPB_SCRaRoundPassList[];

    /** PB_SCRaFishPassInfo meters. */
    public meters: number;

    /** PB_SCRaFishPassInfo fetchExRewardCount. */
    public fetchExRewardCount: number;

    /**
     * Creates a new PB_SCRaFishPassInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaFishPassInfo instance
     */
    public static create(properties?: IPB_SCRaFishPassInfo): PB_SCRaFishPassInfo;

    /**
     * Encodes the specified PB_SCRaFishPassInfo message. Does not implicitly {@link PB_SCRaFishPassInfo.verify|verify} messages.
     * @param message PB_SCRaFishPassInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaFishPassInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaFishPassInfo message, length delimited. Does not implicitly {@link PB_SCRaFishPassInfo.verify|verify} messages.
     * @param message PB_SCRaFishPassInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaFishPassInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaFishPassInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaFishPassInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaFishPassInfo;

    /**
     * Decodes a PB_SCRaFishPassInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaFishPassInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaFishPassInfo;

    /**
     * Verifies a PB_SCRaFishPassInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaFishPassInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaFishPassInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaFishPassInfo;

    /**
     * Creates a plain object from a PB_SCRaFishPassInfo message. Also converts values to other types if specified.
     * @param message PB_SCRaFishPassInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaFishPassInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaFishPassInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaPickUpInfo. */
export interface IPB_SCRaPickUpInfo {

    /** PB_SCRaPickUpInfo taskProgress */
    taskProgress?: (number[]|null);

    /** PB_SCRaPickUpInfo taskFetch */
    taskFetch?: (boolean[]|null);

    /** PB_SCRaPickUpInfo giftBuyCount */
    giftBuyCount?: (number[]|null);

    /** PB_SCRaPickUpInfo drawCount */
    drawCount?: (number|null);
}

/** Represents a PB_SCRaPickUpInfo. */
export class PB_SCRaPickUpInfo implements IPB_SCRaPickUpInfo {

    /**
     * Constructs a new PB_SCRaPickUpInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaPickUpInfo);

    /** PB_SCRaPickUpInfo taskProgress. */
    public taskProgress: number[];

    /** PB_SCRaPickUpInfo taskFetch. */
    public taskFetch: boolean[];

    /** PB_SCRaPickUpInfo giftBuyCount. */
    public giftBuyCount: number[];

    /** PB_SCRaPickUpInfo drawCount. */
    public drawCount: number;

    /**
     * Creates a new PB_SCRaPickUpInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaPickUpInfo instance
     */
    public static create(properties?: IPB_SCRaPickUpInfo): PB_SCRaPickUpInfo;

    /**
     * Encodes the specified PB_SCRaPickUpInfo message. Does not implicitly {@link PB_SCRaPickUpInfo.verify|verify} messages.
     * @param message PB_SCRaPickUpInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaPickUpInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaPickUpInfo message, length delimited. Does not implicitly {@link PB_SCRaPickUpInfo.verify|verify} messages.
     * @param message PB_SCRaPickUpInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaPickUpInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaPickUpInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaPickUpInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaPickUpInfo;

    /**
     * Decodes a PB_SCRaPickUpInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaPickUpInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaPickUpInfo;

    /**
     * Verifies a PB_SCRaPickUpInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaPickUpInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaPickUpInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaPickUpInfo;

    /**
     * Creates a plain object from a PB_SCRaPickUpInfo message. Also converts values to other types if specified.
     * @param message PB_SCRaPickUpInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaPickUpInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaPickUpInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaArenaDailyGiftInfo. */
export interface IPB_SCRaArenaDailyGiftInfo {

    /** PB_SCRaArenaDailyGiftInfo giftBuyCount */
    giftBuyCount?: (number[]|null);
}

/** Represents a PB_SCRaArenaDailyGiftInfo. */
export class PB_SCRaArenaDailyGiftInfo implements IPB_SCRaArenaDailyGiftInfo {

    /**
     * Constructs a new PB_SCRaArenaDailyGiftInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaArenaDailyGiftInfo);

    /** PB_SCRaArenaDailyGiftInfo giftBuyCount. */
    public giftBuyCount: number[];

    /**
     * Creates a new PB_SCRaArenaDailyGiftInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaArenaDailyGiftInfo instance
     */
    public static create(properties?: IPB_SCRaArenaDailyGiftInfo): PB_SCRaArenaDailyGiftInfo;

    /**
     * Encodes the specified PB_SCRaArenaDailyGiftInfo message. Does not implicitly {@link PB_SCRaArenaDailyGiftInfo.verify|verify} messages.
     * @param message PB_SCRaArenaDailyGiftInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaArenaDailyGiftInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaArenaDailyGiftInfo message, length delimited. Does not implicitly {@link PB_SCRaArenaDailyGiftInfo.verify|verify} messages.
     * @param message PB_SCRaArenaDailyGiftInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaArenaDailyGiftInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaArenaDailyGiftInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaArenaDailyGiftInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaArenaDailyGiftInfo;

    /**
     * Decodes a PB_SCRaArenaDailyGiftInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaArenaDailyGiftInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaArenaDailyGiftInfo;

    /**
     * Verifies a PB_SCRaArenaDailyGiftInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaArenaDailyGiftInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaArenaDailyGiftInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaArenaDailyGiftInfo;

    /**
     * Creates a plain object from a PB_SCRaArenaDailyGiftInfo message. Also converts values to other types if specified.
     * @param message PB_SCRaArenaDailyGiftInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaArenaDailyGiftInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaArenaDailyGiftInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRankNode. */
export interface IPB_SCRankNode {

    /** PB_SCRankNode roleInfo */
    roleInfo?: (IPB_RoleInfo|null);

    /** PB_SCRankNode rankLevel */
    rankLevel?: (number|null);
}

/** Represents a PB_SCRankNode. */
export class PB_SCRankNode implements IPB_SCRankNode {

    /**
     * Constructs a new PB_SCRankNode.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRankNode);

    /** PB_SCRankNode roleInfo. */
    public roleInfo?: (IPB_RoleInfo|null);

    /** PB_SCRankNode rankLevel. */
    public rankLevel: number;

    /**
     * Creates a new PB_SCRankNode instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRankNode instance
     */
    public static create(properties?: IPB_SCRankNode): PB_SCRankNode;

    /**
     * Encodes the specified PB_SCRankNode message. Does not implicitly {@link PB_SCRankNode.verify|verify} messages.
     * @param message PB_SCRankNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRankNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRankNode message, length delimited. Does not implicitly {@link PB_SCRankNode.verify|verify} messages.
     * @param message PB_SCRankNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRankNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRankNode message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRankNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRankNode;

    /**
     * Decodes a PB_SCRankNode message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRankNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRankNode;

    /**
     * Verifies a PB_SCRankNode message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRankNode message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRankNode
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRankNode;

    /**
     * Creates a plain object from a PB_SCRankNode message. Also converts values to other types if specified.
     * @param message PB_SCRankNode
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRankNode, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRankNode to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRankList. */
export interface IPB_SCRankList {

    /** PB_SCRankList type */
    type?: (number|null);

    /** PB_SCRankList listBegin */
    listBegin?: (number|null);

    /** PB_SCRankList ranklist */
    ranklist?: (IPB_SCRankNode[]|null);

    /** PB_SCRankList myRank */
    myRank?: (number|null);

    /** PB_SCRankList myRankValue */
    myRankValue?: (number|Long|null);
}

/** Represents a PB_SCRankList. */
export class PB_SCRankList implements IPB_SCRankList {

    /**
     * Constructs a new PB_SCRankList.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRankList);

    /** PB_SCRankList type. */
    public type: number;

    /** PB_SCRankList listBegin. */
    public listBegin: number;

    /** PB_SCRankList ranklist. */
    public ranklist: IPB_SCRankNode[];

    /** PB_SCRankList myRank. */
    public myRank: number;

    /** PB_SCRankList myRankValue. */
    public myRankValue: (number|Long);

    /**
     * Creates a new PB_SCRankList instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRankList instance
     */
    public static create(properties?: IPB_SCRankList): PB_SCRankList;

    /**
     * Encodes the specified PB_SCRankList message. Does not implicitly {@link PB_SCRankList.verify|verify} messages.
     * @param message PB_SCRankList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRankList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRankList message, length delimited. Does not implicitly {@link PB_SCRankList.verify|verify} messages.
     * @param message PB_SCRankList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRankList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRankList message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRankList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRankList;

    /**
     * Decodes a PB_SCRankList message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRankList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRankList;

    /**
     * Verifies a PB_SCRankList message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRankList message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRankList
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRankList;

    /**
     * Creates a plain object from a PB_SCRankList message. Also converts values to other types if specified.
     * @param message PB_SCRankList
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRankList, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRankList to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSRankReq. */
export interface IPB_CSRankReq {

    /** PB_CSRankReq type */
    type?: (number|null);

    /** PB_CSRankReq listBegin */
    listBegin?: (number|null);
}

/** Represents a PB_CSRankReq. */
export class PB_CSRankReq implements IPB_CSRankReq {

    /**
     * Constructs a new PB_CSRankReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSRankReq);

    /** PB_CSRankReq type. */
    public type: number;

    /** PB_CSRankReq listBegin. */
    public listBegin: number;

    /**
     * Creates a new PB_CSRankReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSRankReq instance
     */
    public static create(properties?: IPB_CSRankReq): PB_CSRankReq;

    /**
     * Encodes the specified PB_CSRankReq message. Does not implicitly {@link PB_CSRankReq.verify|verify} messages.
     * @param message PB_CSRankReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSRankReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSRankReq message, length delimited. Does not implicitly {@link PB_CSRankReq.verify|verify} messages.
     * @param message PB_CSRankReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSRankReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSRankReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSRankReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSRankReq;

    /**
     * Decodes a PB_CSRankReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSRankReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSRankReq;

    /**
     * Verifies a PB_CSRankReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSRankReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSRankReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSRankReq;

    /**
     * Creates a plain object from a PB_CSRankReq message. Also converts values to other types if specified.
     * @param message PB_CSRankReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSRankReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSRankReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PassCheckFetchInfo. */
export interface IPassCheckFetchInfo {

    /** PassCheckFetchInfo fetchFlag */
    fetchFlag?: (boolean[]|null);
}

/** Represents a PassCheckFetchInfo. */
export class PassCheckFetchInfo implements IPassCheckFetchInfo {

    /**
     * Constructs a new PassCheckFetchInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPassCheckFetchInfo);

    /** PassCheckFetchInfo fetchFlag. */
    public fetchFlag: boolean[];

    /**
     * Creates a new PassCheckFetchInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PassCheckFetchInfo instance
     */
    public static create(properties?: IPassCheckFetchInfo): PassCheckFetchInfo;

    /**
     * Encodes the specified PassCheckFetchInfo message. Does not implicitly {@link PassCheckFetchInfo.verify|verify} messages.
     * @param message PassCheckFetchInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPassCheckFetchInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PassCheckFetchInfo message, length delimited. Does not implicitly {@link PassCheckFetchInfo.verify|verify} messages.
     * @param message PassCheckFetchInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPassCheckFetchInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PassCheckFetchInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PassCheckFetchInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PassCheckFetchInfo;

    /**
     * Decodes a PassCheckFetchInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PassCheckFetchInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PassCheckFetchInfo;

    /**
     * Verifies a PassCheckFetchInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PassCheckFetchInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PassCheckFetchInfo
     */
    public static fromObject(object: { [k: string]: any }): PassCheckFetchInfo;

    /**
     * Creates a plain object from a PassCheckFetchInfo message. Also converts values to other types if specified.
     * @param message PassCheckFetchInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PassCheckFetchInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PassCheckFetchInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRaPassCheckInfo. */
export interface IPB_SCRaPassCheckInfo {

    /** PB_SCRaPassCheckInfo isActive */
    isActive?: (number|null);

    /** PB_SCRaPassCheckInfo passCheckLevel */
    passCheckLevel?: (number|null);

    /** PB_SCRaPassCheckInfo passCheckExp */
    passCheckExp?: (number|null);

    /** PB_SCRaPassCheckInfo fetchFlagList */
    fetchFlagList?: (IPassCheckFetchInfo[]|null);
}

/** Represents a PB_SCRaPassCheckInfo. */
export class PB_SCRaPassCheckInfo implements IPB_SCRaPassCheckInfo {

    /**
     * Constructs a new PB_SCRaPassCheckInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRaPassCheckInfo);

    /** PB_SCRaPassCheckInfo isActive. */
    public isActive: number;

    /** PB_SCRaPassCheckInfo passCheckLevel. */
    public passCheckLevel: number;

    /** PB_SCRaPassCheckInfo passCheckExp. */
    public passCheckExp: number;

    /** PB_SCRaPassCheckInfo fetchFlagList. */
    public fetchFlagList: IPassCheckFetchInfo[];

    /**
     * Creates a new PB_SCRaPassCheckInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRaPassCheckInfo instance
     */
    public static create(properties?: IPB_SCRaPassCheckInfo): PB_SCRaPassCheckInfo;

    /**
     * Encodes the specified PB_SCRaPassCheckInfo message. Does not implicitly {@link PB_SCRaPassCheckInfo.verify|verify} messages.
     * @param message PB_SCRaPassCheckInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRaPassCheckInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRaPassCheckInfo message, length delimited. Does not implicitly {@link PB_SCRaPassCheckInfo.verify|verify} messages.
     * @param message PB_SCRaPassCheckInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRaPassCheckInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRaPassCheckInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRaPassCheckInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRaPassCheckInfo;

    /**
     * Decodes a PB_SCRaPassCheckInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRaPassCheckInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRaPassCheckInfo;

    /**
     * Verifies a PB_SCRaPassCheckInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRaPassCheckInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRaPassCheckInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRaPassCheckInfo;

    /**
     * Creates a plain object from a PB_SCRaPassCheckInfo message. Also converts values to other types if specified.
     * @param message PB_SCRaPassCheckInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRaPassCheckInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRaPassCheckInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSRoleFishReq. */
export interface IPB_CSRoleFishReq {

    /** PB_CSRoleFishReq reqType */
    reqType?: (number|null);

    /** PB_CSRoleFishReq p1 */
    p1?: (number|null);

    /** PB_CSRoleFishReq p2 */
    p2?: (number|null);

    /** PB_CSRoleFishReq p3 */
    p3?: (number|null);
}

/** Represents a PB_CSRoleFishReq. */
export class PB_CSRoleFishReq implements IPB_CSRoleFishReq {

    /**
     * Constructs a new PB_CSRoleFishReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSRoleFishReq);

    /** PB_CSRoleFishReq reqType. */
    public reqType: number;

    /** PB_CSRoleFishReq p1. */
    public p1: number;

    /** PB_CSRoleFishReq p2. */
    public p2: number;

    /** PB_CSRoleFishReq p3. */
    public p3: number;

    /**
     * Creates a new PB_CSRoleFishReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSRoleFishReq instance
     */
    public static create(properties?: IPB_CSRoleFishReq): PB_CSRoleFishReq;

    /**
     * Encodes the specified PB_CSRoleFishReq message. Does not implicitly {@link PB_CSRoleFishReq.verify|verify} messages.
     * @param message PB_CSRoleFishReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSRoleFishReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSRoleFishReq message, length delimited. Does not implicitly {@link PB_CSRoleFishReq.verify|verify} messages.
     * @param message PB_CSRoleFishReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSRoleFishReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSRoleFishReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSRoleFishReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSRoleFishReq;

    /**
     * Decodes a PB_CSRoleFishReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSRoleFishReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSRoleFishReq;

    /**
     * Verifies a PB_CSRoleFishReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSRoleFishReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSRoleFishReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSRoleFishReq;

    /**
     * Creates a plain object from a PB_CSRoleFishReq message. Also converts values to other types if specified.
     * @param message PB_CSRoleFishReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSRoleFishReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSRoleFishReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_RoleFishFish. */
export interface IPB_RoleFishFish {

    /** PB_RoleFishFish fishId */
    fishId?: (number|null);

    /** PB_RoleFishFish fishLen */
    fishLen?: (number|null);
}

/** Represents a PB_RoleFishFish. */
export class PB_RoleFishFish implements IPB_RoleFishFish {

    /**
     * Constructs a new PB_RoleFishFish.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_RoleFishFish);

    /** PB_RoleFishFish fishId. */
    public fishId: number;

    /** PB_RoleFishFish fishLen. */
    public fishLen: number;

    /**
     * Creates a new PB_RoleFishFish instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_RoleFishFish instance
     */
    public static create(properties?: IPB_RoleFishFish): PB_RoleFishFish;

    /**
     * Encodes the specified PB_RoleFishFish message. Does not implicitly {@link PB_RoleFishFish.verify|verify} messages.
     * @param message PB_RoleFishFish message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_RoleFishFish, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_RoleFishFish message, length delimited. Does not implicitly {@link PB_RoleFishFish.verify|verify} messages.
     * @param message PB_RoleFishFish message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_RoleFishFish, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_RoleFishFish message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_RoleFishFish
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_RoleFishFish;

    /**
     * Decodes a PB_RoleFishFish message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_RoleFishFish
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_RoleFishFish;

    /**
     * Verifies a PB_RoleFishFish message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_RoleFishFish message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_RoleFishFish
     */
    public static fromObject(object: { [k: string]: any }): PB_RoleFishFish;

    /**
     * Creates a plain object from a PB_RoleFishFish message. Also converts values to other types if specified.
     * @param message PB_RoleFishFish
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_RoleFishFish, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_RoleFishFish to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_RoleFishTaskInfo. */
export interface IPB_RoleFishTaskInfo {

    /** PB_RoleFishTaskInfo taskId */
    taskId?: (number|null);

    /** PB_RoleFishTaskInfo processNum */
    processNum?: (number|null);

    /** PB_RoleFishTaskInfo isFetch */
    isFetch?: (number|null);
}

/** Represents a PB_RoleFishTaskInfo. */
export class PB_RoleFishTaskInfo implements IPB_RoleFishTaskInfo {

    /**
     * Constructs a new PB_RoleFishTaskInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_RoleFishTaskInfo);

    /** PB_RoleFishTaskInfo taskId. */
    public taskId: number;

    /** PB_RoleFishTaskInfo processNum. */
    public processNum: number;

    /** PB_RoleFishTaskInfo isFetch. */
    public isFetch: number;

    /**
     * Creates a new PB_RoleFishTaskInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_RoleFishTaskInfo instance
     */
    public static create(properties?: IPB_RoleFishTaskInfo): PB_RoleFishTaskInfo;

    /**
     * Encodes the specified PB_RoleFishTaskInfo message. Does not implicitly {@link PB_RoleFishTaskInfo.verify|verify} messages.
     * @param message PB_RoleFishTaskInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_RoleFishTaskInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_RoleFishTaskInfo message, length delimited. Does not implicitly {@link PB_RoleFishTaskInfo.verify|verify} messages.
     * @param message PB_RoleFishTaskInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_RoleFishTaskInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_RoleFishTaskInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_RoleFishTaskInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_RoleFishTaskInfo;

    /**
     * Decodes a PB_RoleFishTaskInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_RoleFishTaskInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_RoleFishTaskInfo;

    /**
     * Verifies a PB_RoleFishTaskInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_RoleFishTaskInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_RoleFishTaskInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_RoleFishTaskInfo;

    /**
     * Creates a plain object from a PB_RoleFishTaskInfo message. Also converts values to other types if specified.
     * @param message PB_RoleFishTaskInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_RoleFishTaskInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_RoleFishTaskInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_RoleFishToolInfo. */
export interface IPB_RoleFishToolInfo {

    /** PB_RoleFishToolInfo level */
    level?: (number|null);

    /** PB_RoleFishToolInfo huanHuaId */
    huanHuaId?: (number|null);
}

/** Represents a PB_RoleFishToolInfo. */
export class PB_RoleFishToolInfo implements IPB_RoleFishToolInfo {

    /**
     * Constructs a new PB_RoleFishToolInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_RoleFishToolInfo);

    /** PB_RoleFishToolInfo level. */
    public level: number;

    /** PB_RoleFishToolInfo huanHuaId. */
    public huanHuaId: number;

    /**
     * Creates a new PB_RoleFishToolInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_RoleFishToolInfo instance
     */
    public static create(properties?: IPB_RoleFishToolInfo): PB_RoleFishToolInfo;

    /**
     * Encodes the specified PB_RoleFishToolInfo message. Does not implicitly {@link PB_RoleFishToolInfo.verify|verify} messages.
     * @param message PB_RoleFishToolInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_RoleFishToolInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_RoleFishToolInfo message, length delimited. Does not implicitly {@link PB_RoleFishToolInfo.verify|verify} messages.
     * @param message PB_RoleFishToolInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_RoleFishToolInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_RoleFishToolInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_RoleFishToolInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_RoleFishToolInfo;

    /**
     * Decodes a PB_RoleFishToolInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_RoleFishToolInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_RoleFishToolInfo;

    /**
     * Verifies a PB_RoleFishToolInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_RoleFishToolInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_RoleFishToolInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_RoleFishToolInfo;

    /**
     * Creates a plain object from a PB_RoleFishToolInfo message. Also converts values to other types if specified.
     * @param message PB_RoleFishToolInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_RoleFishToolInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_RoleFishToolInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_RoleFishHistoryInfo. */
export interface IPB_RoleFishHistoryInfo {

    /** PB_RoleFishHistoryInfo fishHistoryLen */
    fishHistoryLen?: (number|null);
}

/** Represents a PB_RoleFishHistoryInfo. */
export class PB_RoleFishHistoryInfo implements IPB_RoleFishHistoryInfo {

    /**
     * Constructs a new PB_RoleFishHistoryInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_RoleFishHistoryInfo);

    /** PB_RoleFishHistoryInfo fishHistoryLen. */
    public fishHistoryLen: number;

    /**
     * Creates a new PB_RoleFishHistoryInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_RoleFishHistoryInfo instance
     */
    public static create(properties?: IPB_RoleFishHistoryInfo): PB_RoleFishHistoryInfo;

    /**
     * Encodes the specified PB_RoleFishHistoryInfo message. Does not implicitly {@link PB_RoleFishHistoryInfo.verify|verify} messages.
     * @param message PB_RoleFishHistoryInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_RoleFishHistoryInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_RoleFishHistoryInfo message, length delimited. Does not implicitly {@link PB_RoleFishHistoryInfo.verify|verify} messages.
     * @param message PB_RoleFishHistoryInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_RoleFishHistoryInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_RoleFishHistoryInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_RoleFishHistoryInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_RoleFishHistoryInfo;

    /**
     * Decodes a PB_RoleFishHistoryInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_RoleFishHistoryInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_RoleFishHistoryInfo;

    /**
     * Verifies a PB_RoleFishHistoryInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_RoleFishHistoryInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_RoleFishHistoryInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_RoleFishHistoryInfo;

    /**
     * Creates a plain object from a PB_RoleFishHistoryInfo message. Also converts values to other types if specified.
     * @param message PB_RoleFishHistoryInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_RoleFishHistoryInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_RoleFishHistoryInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRoleFishInfo. */
export interface IPB_SCRoleFishInfo {

    /** PB_SCRoleFishInfo power */
    power?: (number|null);

    /** PB_SCRoleFishInfo nextPowerTime */
    nextPowerTime?: (number|null);

    /** PB_SCRoleFishInfo level */
    level?: (number|null);

    /** PB_SCRoleFishInfo exp */
    exp?: (number|null);

    /** PB_SCRoleFishInfo huanHuaActiveFlag */
    huanHuaActiveFlag?: (number|Long|null);

    /** PB_SCRoleFishInfo buyTimes */
    buyTimes?: (number[]|null);

    /** PB_SCRoleFishInfo bookRewardFetchFlag */
    bookRewardFetchFlag?: (boolean[]|null);

    /** PB_SCRoleFishInfo fish */
    fish?: (IPB_RoleFishFish|null);

    /** PB_SCRoleFishInfo fishList */
    fishList?: (IPB_RoleFishFish[]|null);

    /** PB_SCRoleFishInfo taskInfo */
    taskInfo?: (IPB_RoleFishTaskInfo[]|null);

    /** PB_SCRoleFishInfo toolInfo */
    toolInfo?: (IPB_RoleFishToolInfo[]|null);

    /** PB_SCRoleFishInfo historyInfo */
    historyInfo?: (IPB_RoleFishHistoryInfo[]|null);

    /** PB_SCRoleFishInfo fishCardTime */
    fishCardTime?: (number|null);

    /** PB_SCRoleFishInfo isFetchCardReward */
    isFetchCardReward?: (number|null);

    /** PB_SCRoleFishInfo areaId */
    areaId?: (number|null);

    /** PB_SCRoleFishInfo baitId */
    baitId?: (number|null);
}

/** Represents a PB_SCRoleFishInfo. */
export class PB_SCRoleFishInfo implements IPB_SCRoleFishInfo {

    /**
     * Constructs a new PB_SCRoleFishInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRoleFishInfo);

    /** PB_SCRoleFishInfo power. */
    public power: number;

    /** PB_SCRoleFishInfo nextPowerTime. */
    public nextPowerTime: number;

    /** PB_SCRoleFishInfo level. */
    public level: number;

    /** PB_SCRoleFishInfo exp. */
    public exp: number;

    /** PB_SCRoleFishInfo huanHuaActiveFlag. */
    public huanHuaActiveFlag: (number|Long);

    /** PB_SCRoleFishInfo buyTimes. */
    public buyTimes: number[];

    /** PB_SCRoleFishInfo bookRewardFetchFlag. */
    public bookRewardFetchFlag: boolean[];

    /** PB_SCRoleFishInfo fish. */
    public fish?: (IPB_RoleFishFish|null);

    /** PB_SCRoleFishInfo fishList. */
    public fishList: IPB_RoleFishFish[];

    /** PB_SCRoleFishInfo taskInfo. */
    public taskInfo: IPB_RoleFishTaskInfo[];

    /** PB_SCRoleFishInfo toolInfo. */
    public toolInfo: IPB_RoleFishToolInfo[];

    /** PB_SCRoleFishInfo historyInfo. */
    public historyInfo: IPB_RoleFishHistoryInfo[];

    /** PB_SCRoleFishInfo fishCardTime. */
    public fishCardTime: number;

    /** PB_SCRoleFishInfo isFetchCardReward. */
    public isFetchCardReward: number;

    /** PB_SCRoleFishInfo areaId. */
    public areaId: number;

    /** PB_SCRoleFishInfo baitId. */
    public baitId: number;

    /**
     * Creates a new PB_SCRoleFishInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRoleFishInfo instance
     */
    public static create(properties?: IPB_SCRoleFishInfo): PB_SCRoleFishInfo;

    /**
     * Encodes the specified PB_SCRoleFishInfo message. Does not implicitly {@link PB_SCRoleFishInfo.verify|verify} messages.
     * @param message PB_SCRoleFishInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRoleFishInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRoleFishInfo message, length delimited. Does not implicitly {@link PB_SCRoleFishInfo.verify|verify} messages.
     * @param message PB_SCRoleFishInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRoleFishInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRoleFishInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRoleFishInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRoleFishInfo;

    /**
     * Decodes a PB_SCRoleFishInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRoleFishInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRoleFishInfo;

    /**
     * Verifies a PB_SCRoleFishInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRoleFishInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRoleFishInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRoleFishInfo;

    /**
     * Creates a plain object from a PB_SCRoleFishInfo message. Also converts values to other types if specified.
     * @param message PB_SCRoleFishInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRoleFishInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRoleFishInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRoleFishPowerInfo. */
export interface IPB_SCRoleFishPowerInfo {

    /** PB_SCRoleFishPowerInfo power */
    power?: (number|null);

    /** PB_SCRoleFishPowerInfo nextPowerTime */
    nextPowerTime?: (number|null);
}

/** Represents a PB_SCRoleFishPowerInfo. */
export class PB_SCRoleFishPowerInfo implements IPB_SCRoleFishPowerInfo {

    /**
     * Constructs a new PB_SCRoleFishPowerInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRoleFishPowerInfo);

    /** PB_SCRoleFishPowerInfo power. */
    public power: number;

    /** PB_SCRoleFishPowerInfo nextPowerTime. */
    public nextPowerTime: number;

    /**
     * Creates a new PB_SCRoleFishPowerInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRoleFishPowerInfo instance
     */
    public static create(properties?: IPB_SCRoleFishPowerInfo): PB_SCRoleFishPowerInfo;

    /**
     * Encodes the specified PB_SCRoleFishPowerInfo message. Does not implicitly {@link PB_SCRoleFishPowerInfo.verify|verify} messages.
     * @param message PB_SCRoleFishPowerInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRoleFishPowerInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRoleFishPowerInfo message, length delimited. Does not implicitly {@link PB_SCRoleFishPowerInfo.verify|verify} messages.
     * @param message PB_SCRoleFishPowerInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRoleFishPowerInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRoleFishPowerInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRoleFishPowerInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRoleFishPowerInfo;

    /**
     * Decodes a PB_SCRoleFishPowerInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRoleFishPowerInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRoleFishPowerInfo;

    /**
     * Verifies a PB_SCRoleFishPowerInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRoleFishPowerInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRoleFishPowerInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRoleFishPowerInfo;

    /**
     * Creates a plain object from a PB_SCRoleFishPowerInfo message. Also converts values to other types if specified.
     * @param message PB_SCRoleFishPowerInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRoleFishPowerInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRoleFishPowerInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRoleFishCommonInfo. */
export interface IPB_SCRoleFishCommonInfo {

    /** PB_SCRoleFishCommonInfo fishCardTime */
    fishCardTime?: (number|null);

    /** PB_SCRoleFishCommonInfo isFetchCardReward */
    isFetchCardReward?: (number|null);

    /** PB_SCRoleFishCommonInfo areaId */
    areaId?: (number|null);

    /** PB_SCRoleFishCommonInfo baitId */
    baitId?: (number|null);
}

/** Represents a PB_SCRoleFishCommonInfo. */
export class PB_SCRoleFishCommonInfo implements IPB_SCRoleFishCommonInfo {

    /**
     * Constructs a new PB_SCRoleFishCommonInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRoleFishCommonInfo);

    /** PB_SCRoleFishCommonInfo fishCardTime. */
    public fishCardTime: number;

    /** PB_SCRoleFishCommonInfo isFetchCardReward. */
    public isFetchCardReward: number;

    /** PB_SCRoleFishCommonInfo areaId. */
    public areaId: number;

    /** PB_SCRoleFishCommonInfo baitId. */
    public baitId: number;

    /**
     * Creates a new PB_SCRoleFishCommonInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRoleFishCommonInfo instance
     */
    public static create(properties?: IPB_SCRoleFishCommonInfo): PB_SCRoleFishCommonInfo;

    /**
     * Encodes the specified PB_SCRoleFishCommonInfo message. Does not implicitly {@link PB_SCRoleFishCommonInfo.verify|verify} messages.
     * @param message PB_SCRoleFishCommonInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRoleFishCommonInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRoleFishCommonInfo message, length delimited. Does not implicitly {@link PB_SCRoleFishCommonInfo.verify|verify} messages.
     * @param message PB_SCRoleFishCommonInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRoleFishCommonInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRoleFishCommonInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRoleFishCommonInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRoleFishCommonInfo;

    /**
     * Decodes a PB_SCRoleFishCommonInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRoleFishCommonInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRoleFishCommonInfo;

    /**
     * Verifies a PB_SCRoleFishCommonInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRoleFishCommonInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRoleFishCommonInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRoleFishCommonInfo;

    /**
     * Creates a plain object from a PB_SCRoleFishCommonInfo message. Also converts values to other types if specified.
     * @param message PB_SCRoleFishCommonInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRoleFishCommonInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRoleFishCommonInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRoleFishFishInfo. */
export interface IPB_SCRoleFishFishInfo {

    /** PB_SCRoleFishFishInfo state */
    state?: (number|null);

    /** PB_SCRoleFishFishInfo fish */
    fish?: (IPB_RoleFishFish|null);
}

/** Represents a PB_SCRoleFishFishInfo. */
export class PB_SCRoleFishFishInfo implements IPB_SCRoleFishFishInfo {

    /**
     * Constructs a new PB_SCRoleFishFishInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRoleFishFishInfo);

    /** PB_SCRoleFishFishInfo state. */
    public state: number;

    /** PB_SCRoleFishFishInfo fish. */
    public fish?: (IPB_RoleFishFish|null);

    /**
     * Creates a new PB_SCRoleFishFishInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRoleFishFishInfo instance
     */
    public static create(properties?: IPB_SCRoleFishFishInfo): PB_SCRoleFishFishInfo;

    /**
     * Encodes the specified PB_SCRoleFishFishInfo message. Does not implicitly {@link PB_SCRoleFishFishInfo.verify|verify} messages.
     * @param message PB_SCRoleFishFishInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRoleFishFishInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRoleFishFishInfo message, length delimited. Does not implicitly {@link PB_SCRoleFishFishInfo.verify|verify} messages.
     * @param message PB_SCRoleFishFishInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRoleFishFishInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRoleFishFishInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRoleFishFishInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRoleFishFishInfo;

    /**
     * Decodes a PB_SCRoleFishFishInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRoleFishFishInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRoleFishFishInfo;

    /**
     * Verifies a PB_SCRoleFishFishInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRoleFishFishInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRoleFishFishInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRoleFishFishInfo;

    /**
     * Creates a plain object from a PB_SCRoleFishFishInfo message. Also converts values to other types if specified.
     * @param message PB_SCRoleFishFishInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRoleFishFishInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRoleFishFishInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRoleFishFishListInfo. */
export interface IPB_SCRoleFishFishListInfo {

    /** PB_SCRoleFishFishListInfo index */
    index?: (number|null);

    /** PB_SCRoleFishFishListInfo fish */
    fish?: (IPB_RoleFishFish|null);
}

/** Represents a PB_SCRoleFishFishListInfo. */
export class PB_SCRoleFishFishListInfo implements IPB_SCRoleFishFishListInfo {

    /**
     * Constructs a new PB_SCRoleFishFishListInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRoleFishFishListInfo);

    /** PB_SCRoleFishFishListInfo index. */
    public index: number;

    /** PB_SCRoleFishFishListInfo fish. */
    public fish?: (IPB_RoleFishFish|null);

    /**
     * Creates a new PB_SCRoleFishFishListInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRoleFishFishListInfo instance
     */
    public static create(properties?: IPB_SCRoleFishFishListInfo): PB_SCRoleFishFishListInfo;

    /**
     * Encodes the specified PB_SCRoleFishFishListInfo message. Does not implicitly {@link PB_SCRoleFishFishListInfo.verify|verify} messages.
     * @param message PB_SCRoleFishFishListInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRoleFishFishListInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRoleFishFishListInfo message, length delimited. Does not implicitly {@link PB_SCRoleFishFishListInfo.verify|verify} messages.
     * @param message PB_SCRoleFishFishListInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRoleFishFishListInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRoleFishFishListInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRoleFishFishListInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRoleFishFishListInfo;

    /**
     * Decodes a PB_SCRoleFishFishListInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRoleFishFishListInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRoleFishFishListInfo;

    /**
     * Verifies a PB_SCRoleFishFishListInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRoleFishFishListInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRoleFishFishListInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRoleFishFishListInfo;

    /**
     * Creates a plain object from a PB_SCRoleFishFishListInfo message. Also converts values to other types if specified.
     * @param message PB_SCRoleFishFishListInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRoleFishFishListInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRoleFishFishListInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRoleFishLevelInfo. */
export interface IPB_SCRoleFishLevelInfo {

    /** PB_SCRoleFishLevelInfo level */
    level?: (number|null);

    /** PB_SCRoleFishLevelInfo exp */
    exp?: (number|null);
}

/** Represents a PB_SCRoleFishLevelInfo. */
export class PB_SCRoleFishLevelInfo implements IPB_SCRoleFishLevelInfo {

    /**
     * Constructs a new PB_SCRoleFishLevelInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRoleFishLevelInfo);

    /** PB_SCRoleFishLevelInfo level. */
    public level: number;

    /** PB_SCRoleFishLevelInfo exp. */
    public exp: number;

    /**
     * Creates a new PB_SCRoleFishLevelInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRoleFishLevelInfo instance
     */
    public static create(properties?: IPB_SCRoleFishLevelInfo): PB_SCRoleFishLevelInfo;

    /**
     * Encodes the specified PB_SCRoleFishLevelInfo message. Does not implicitly {@link PB_SCRoleFishLevelInfo.verify|verify} messages.
     * @param message PB_SCRoleFishLevelInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRoleFishLevelInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRoleFishLevelInfo message, length delimited. Does not implicitly {@link PB_SCRoleFishLevelInfo.verify|verify} messages.
     * @param message PB_SCRoleFishLevelInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRoleFishLevelInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRoleFishLevelInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRoleFishLevelInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRoleFishLevelInfo;

    /**
     * Decodes a PB_SCRoleFishLevelInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRoleFishLevelInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRoleFishLevelInfo;

    /**
     * Verifies a PB_SCRoleFishLevelInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRoleFishLevelInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRoleFishLevelInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRoleFishLevelInfo;

    /**
     * Creates a plain object from a PB_SCRoleFishLevelInfo message. Also converts values to other types if specified.
     * @param message PB_SCRoleFishLevelInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRoleFishLevelInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRoleFishLevelInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRoleFishBookRewardInfo. */
export interface IPB_SCRoleFishBookRewardInfo {

    /** PB_SCRoleFishBookRewardInfo bookRewardFetchFlag */
    bookRewardFetchFlag?: (boolean[]|null);
}

/** Represents a PB_SCRoleFishBookRewardInfo. */
export class PB_SCRoleFishBookRewardInfo implements IPB_SCRoleFishBookRewardInfo {

    /**
     * Constructs a new PB_SCRoleFishBookRewardInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRoleFishBookRewardInfo);

    /** PB_SCRoleFishBookRewardInfo bookRewardFetchFlag. */
    public bookRewardFetchFlag: boolean[];

    /**
     * Creates a new PB_SCRoleFishBookRewardInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRoleFishBookRewardInfo instance
     */
    public static create(properties?: IPB_SCRoleFishBookRewardInfo): PB_SCRoleFishBookRewardInfo;

    /**
     * Encodes the specified PB_SCRoleFishBookRewardInfo message. Does not implicitly {@link PB_SCRoleFishBookRewardInfo.verify|verify} messages.
     * @param message PB_SCRoleFishBookRewardInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRoleFishBookRewardInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRoleFishBookRewardInfo message, length delimited. Does not implicitly {@link PB_SCRoleFishBookRewardInfo.verify|verify} messages.
     * @param message PB_SCRoleFishBookRewardInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRoleFishBookRewardInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRoleFishBookRewardInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRoleFishBookRewardInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRoleFishBookRewardInfo;

    /**
     * Decodes a PB_SCRoleFishBookRewardInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRoleFishBookRewardInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRoleFishBookRewardInfo;

    /**
     * Verifies a PB_SCRoleFishBookRewardInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRoleFishBookRewardInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRoleFishBookRewardInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRoleFishBookRewardInfo;

    /**
     * Creates a plain object from a PB_SCRoleFishBookRewardInfo message. Also converts values to other types if specified.
     * @param message PB_SCRoleFishBookRewardInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRoleFishBookRewardInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRoleFishBookRewardInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRoleFishToolInfo. */
export interface IPB_SCRoleFishToolInfo {

    /** PB_SCRoleFishToolInfo toolInfo */
    toolInfo?: (IPB_RoleFishToolInfo[]|null);

    /** PB_SCRoleFishToolInfo huanHuaActiveFlag */
    huanHuaActiveFlag?: (number|null);
}

/** Represents a PB_SCRoleFishToolInfo. */
export class PB_SCRoleFishToolInfo implements IPB_SCRoleFishToolInfo {

    /**
     * Constructs a new PB_SCRoleFishToolInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRoleFishToolInfo);

    /** PB_SCRoleFishToolInfo toolInfo. */
    public toolInfo: IPB_RoleFishToolInfo[];

    /** PB_SCRoleFishToolInfo huanHuaActiveFlag. */
    public huanHuaActiveFlag: number;

    /**
     * Creates a new PB_SCRoleFishToolInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRoleFishToolInfo instance
     */
    public static create(properties?: IPB_SCRoleFishToolInfo): PB_SCRoleFishToolInfo;

    /**
     * Encodes the specified PB_SCRoleFishToolInfo message. Does not implicitly {@link PB_SCRoleFishToolInfo.verify|verify} messages.
     * @param message PB_SCRoleFishToolInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRoleFishToolInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRoleFishToolInfo message, length delimited. Does not implicitly {@link PB_SCRoleFishToolInfo.verify|verify} messages.
     * @param message PB_SCRoleFishToolInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRoleFishToolInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRoleFishToolInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRoleFishToolInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRoleFishToolInfo;

    /**
     * Decodes a PB_SCRoleFishToolInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRoleFishToolInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRoleFishToolInfo;

    /**
     * Verifies a PB_SCRoleFishToolInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRoleFishToolInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRoleFishToolInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRoleFishToolInfo;

    /**
     * Creates a plain object from a PB_SCRoleFishToolInfo message. Also converts values to other types if specified.
     * @param message PB_SCRoleFishToolInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRoleFishToolInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRoleFishToolInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRoleFishShopInfo. */
export interface IPB_SCRoleFishShopInfo {

    /** PB_SCRoleFishShopInfo buyTimes */
    buyTimes?: (number[]|null);
}

/** Represents a PB_SCRoleFishShopInfo. */
export class PB_SCRoleFishShopInfo implements IPB_SCRoleFishShopInfo {

    /**
     * Constructs a new PB_SCRoleFishShopInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRoleFishShopInfo);

    /** PB_SCRoleFishShopInfo buyTimes. */
    public buyTimes: number[];

    /**
     * Creates a new PB_SCRoleFishShopInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRoleFishShopInfo instance
     */
    public static create(properties?: IPB_SCRoleFishShopInfo): PB_SCRoleFishShopInfo;

    /**
     * Encodes the specified PB_SCRoleFishShopInfo message. Does not implicitly {@link PB_SCRoleFishShopInfo.verify|verify} messages.
     * @param message PB_SCRoleFishShopInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRoleFishShopInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRoleFishShopInfo message, length delimited. Does not implicitly {@link PB_SCRoleFishShopInfo.verify|verify} messages.
     * @param message PB_SCRoleFishShopInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRoleFishShopInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRoleFishShopInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRoleFishShopInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRoleFishShopInfo;

    /**
     * Decodes a PB_SCRoleFishShopInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRoleFishShopInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRoleFishShopInfo;

    /**
     * Verifies a PB_SCRoleFishShopInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRoleFishShopInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRoleFishShopInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRoleFishShopInfo;

    /**
     * Creates a plain object from a PB_SCRoleFishShopInfo message. Also converts values to other types if specified.
     * @param message PB_SCRoleFishShopInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRoleFishShopInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRoleFishShopInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCRoleFishTaskInfo. */
export interface IPB_SCRoleFishTaskInfo {

    /** PB_SCRoleFishTaskInfo taskInfo */
    taskInfo?: (IPB_RoleFishTaskInfo[]|null);
}

/** Represents a PB_SCRoleFishTaskInfo. */
export class PB_SCRoleFishTaskInfo implements IPB_SCRoleFishTaskInfo {

    /**
     * Constructs a new PB_SCRoleFishTaskInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCRoleFishTaskInfo);

    /** PB_SCRoleFishTaskInfo taskInfo. */
    public taskInfo: IPB_RoleFishTaskInfo[];

    /**
     * Creates a new PB_SCRoleFishTaskInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCRoleFishTaskInfo instance
     */
    public static create(properties?: IPB_SCRoleFishTaskInfo): PB_SCRoleFishTaskInfo;

    /**
     * Encodes the specified PB_SCRoleFishTaskInfo message. Does not implicitly {@link PB_SCRoleFishTaskInfo.verify|verify} messages.
     * @param message PB_SCRoleFishTaskInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCRoleFishTaskInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCRoleFishTaskInfo message, length delimited. Does not implicitly {@link PB_SCRoleFishTaskInfo.verify|verify} messages.
     * @param message PB_SCRoleFishTaskInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCRoleFishTaskInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCRoleFishTaskInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCRoleFishTaskInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCRoleFishTaskInfo;

    /**
     * Decodes a PB_SCRoleFishTaskInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCRoleFishTaskInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCRoleFishTaskInfo;

    /**
     * Verifies a PB_SCRoleFishTaskInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCRoleFishTaskInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCRoleFishTaskInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCRoleFishTaskInfo;

    /**
     * Creates a plain object from a PB_SCRoleFishTaskInfo message. Also converts values to other types if specified.
     * @param message PB_SCRoleFishTaskInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCRoleFishTaskInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCRoleFishTaskInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSHeartbeatReq. */
export interface IPB_CSHeartbeatReq {

    /** PB_CSHeartbeatReq reserve */
    reserve?: (number|null);
}

/** Represents a PB_CSHeartbeatReq. */
export class PB_CSHeartbeatReq implements IPB_CSHeartbeatReq {

    /**
     * Constructs a new PB_CSHeartbeatReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSHeartbeatReq);

    /** PB_CSHeartbeatReq reserve. */
    public reserve: number;

    /**
     * Creates a new PB_CSHeartbeatReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSHeartbeatReq instance
     */
    public static create(properties?: IPB_CSHeartbeatReq): PB_CSHeartbeatReq;

    /**
     * Encodes the specified PB_CSHeartbeatReq message. Does not implicitly {@link PB_CSHeartbeatReq.verify|verify} messages.
     * @param message PB_CSHeartbeatReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSHeartbeatReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSHeartbeatReq message, length delimited. Does not implicitly {@link PB_CSHeartbeatReq.verify|verify} messages.
     * @param message PB_CSHeartbeatReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSHeartbeatReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSHeartbeatReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSHeartbeatReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSHeartbeatReq;

    /**
     * Decodes a PB_CSHeartbeatReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSHeartbeatReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSHeartbeatReq;

    /**
     * Verifies a PB_CSHeartbeatReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSHeartbeatReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSHeartbeatReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSHeartbeatReq;

    /**
     * Creates a plain object from a PB_CSHeartbeatReq message. Also converts values to other types if specified.
     * @param message PB_CSHeartbeatReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSHeartbeatReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSHeartbeatReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCHeartbeatResp. */
export interface IPB_SCHeartbeatResp {

    /** PB_SCHeartbeatResp reserve */
    reserve?: (number|null);
}

/** Represents a PB_SCHeartbeatResp. */
export class PB_SCHeartbeatResp implements IPB_SCHeartbeatResp {

    /**
     * Constructs a new PB_SCHeartbeatResp.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCHeartbeatResp);

    /** PB_SCHeartbeatResp reserve. */
    public reserve: number;

    /**
     * Creates a new PB_SCHeartbeatResp instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCHeartbeatResp instance
     */
    public static create(properties?: IPB_SCHeartbeatResp): PB_SCHeartbeatResp;

    /**
     * Encodes the specified PB_SCHeartbeatResp message. Does not implicitly {@link PB_SCHeartbeatResp.verify|verify} messages.
     * @param message PB_SCHeartbeatResp message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCHeartbeatResp, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCHeartbeatResp message, length delimited. Does not implicitly {@link PB_SCHeartbeatResp.verify|verify} messages.
     * @param message PB_SCHeartbeatResp message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCHeartbeatResp, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCHeartbeatResp message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCHeartbeatResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCHeartbeatResp;

    /**
     * Decodes a PB_SCHeartbeatResp message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCHeartbeatResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCHeartbeatResp;

    /**
     * Verifies a PB_SCHeartbeatResp message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCHeartbeatResp message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCHeartbeatResp
     */
    public static fromObject(object: { [k: string]: any }): PB_SCHeartbeatResp;

    /**
     * Creates a plain object from a PB_SCHeartbeatResp message. Also converts values to other types if specified.
     * @param message PB_SCHeartbeatResp
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCHeartbeatResp, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCHeartbeatResp to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCTimeAck. */
export interface IPB_SCTimeAck {

    /** PB_SCTimeAck serverTime */
    serverTime?: (number|null);

    /** PB_SCTimeAck serverRealStartTime */
    serverRealStartTime?: (number|null);

    /** PB_SCTimeAck openDays */
    openDays?: (number|null);

    /** PB_SCTimeAck serverRealCombineTime */
    serverRealCombineTime?: (number|null);
}

/** Represents a PB_SCTimeAck. */
export class PB_SCTimeAck implements IPB_SCTimeAck {

    /**
     * Constructs a new PB_SCTimeAck.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCTimeAck);

    /** PB_SCTimeAck serverTime. */
    public serverTime: number;

    /** PB_SCTimeAck serverRealStartTime. */
    public serverRealStartTime: number;

    /** PB_SCTimeAck openDays. */
    public openDays: number;

    /** PB_SCTimeAck serverRealCombineTime. */
    public serverRealCombineTime: number;

    /**
     * Creates a new PB_SCTimeAck instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCTimeAck instance
     */
    public static create(properties?: IPB_SCTimeAck): PB_SCTimeAck;

    /**
     * Encodes the specified PB_SCTimeAck message. Does not implicitly {@link PB_SCTimeAck.verify|verify} messages.
     * @param message PB_SCTimeAck message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCTimeAck, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCTimeAck message, length delimited. Does not implicitly {@link PB_SCTimeAck.verify|verify} messages.
     * @param message PB_SCTimeAck message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCTimeAck, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCTimeAck message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCTimeAck
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCTimeAck;

    /**
     * Decodes a PB_SCTimeAck message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCTimeAck
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCTimeAck;

    /**
     * Verifies a PB_SCTimeAck message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCTimeAck message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCTimeAck
     */
    public static fromObject(object: { [k: string]: any }): PB_SCTimeAck;

    /**
     * Creates a plain object from a PB_SCTimeAck message. Also converts values to other types if specified.
     * @param message PB_SCTimeAck
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCTimeAck, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCTimeAck to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCDisconnectNotice. */
export interface IPB_SCDisconnectNotice {

    /** PB_SCDisconnectNotice reason */
    reason?: (number|null);

    /** PB_SCDisconnectNotice roleId */
    roleId?: (number|null);

    /** PB_SCDisconnectNotice userName */
    userName?: (string|null);
}

/** Represents a PB_SCDisconnectNotice. */
export class PB_SCDisconnectNotice implements IPB_SCDisconnectNotice {

    /**
     * Constructs a new PB_SCDisconnectNotice.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCDisconnectNotice);

    /** PB_SCDisconnectNotice reason. */
    public reason: number;

    /** PB_SCDisconnectNotice roleId. */
    public roleId: number;

    /** PB_SCDisconnectNotice userName. */
    public userName: string;

    /**
     * Creates a new PB_SCDisconnectNotice instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCDisconnectNotice instance
     */
    public static create(properties?: IPB_SCDisconnectNotice): PB_SCDisconnectNotice;

    /**
     * Encodes the specified PB_SCDisconnectNotice message. Does not implicitly {@link PB_SCDisconnectNotice.verify|verify} messages.
     * @param message PB_SCDisconnectNotice message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCDisconnectNotice, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCDisconnectNotice message, length delimited. Does not implicitly {@link PB_SCDisconnectNotice.verify|verify} messages.
     * @param message PB_SCDisconnectNotice message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCDisconnectNotice, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCDisconnectNotice message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCDisconnectNotice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCDisconnectNotice;

    /**
     * Decodes a PB_SCDisconnectNotice message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCDisconnectNotice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCDisconnectNotice;

    /**
     * Verifies a PB_SCDisconnectNotice message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCDisconnectNotice message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCDisconnectNotice
     */
    public static fromObject(object: { [k: string]: any }): PB_SCDisconnectNotice;

    /**
     * Creates a plain object from a PB_SCDisconnectNotice message. Also converts values to other types if specified.
     * @param message PB_SCDisconnectNotice
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCDisconnectNotice, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCDisconnectNotice to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCTimeDateInfo. */
export interface IPB_SCTimeDateInfo {

    /** PB_SCTimeDateInfo time */
    time?: (number|null);

    /** PB_SCTimeDateInfo year */
    year?: (number|null);

    /** PB_SCTimeDateInfo mon */
    mon?: (number|null);

    /** PB_SCTimeDateInfo day */
    day?: (number|null);

    /** PB_SCTimeDateInfo hour */
    hour?: (number|null);

    /** PB_SCTimeDateInfo minute */
    minute?: (number|null);

    /** PB_SCTimeDateInfo second */
    second?: (number|null);
}

/** Represents a PB_SCTimeDateInfo. */
export class PB_SCTimeDateInfo implements IPB_SCTimeDateInfo {

    /**
     * Constructs a new PB_SCTimeDateInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCTimeDateInfo);

    /** PB_SCTimeDateInfo time. */
    public time: number;

    /** PB_SCTimeDateInfo year. */
    public year: number;

    /** PB_SCTimeDateInfo mon. */
    public mon: number;

    /** PB_SCTimeDateInfo day. */
    public day: number;

    /** PB_SCTimeDateInfo hour. */
    public hour: number;

    /** PB_SCTimeDateInfo minute. */
    public minute: number;

    /** PB_SCTimeDateInfo second. */
    public second: number;

    /**
     * Creates a new PB_SCTimeDateInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCTimeDateInfo instance
     */
    public static create(properties?: IPB_SCTimeDateInfo): PB_SCTimeDateInfo;

    /**
     * Encodes the specified PB_SCTimeDateInfo message. Does not implicitly {@link PB_SCTimeDateInfo.verify|verify} messages.
     * @param message PB_SCTimeDateInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCTimeDateInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCTimeDateInfo message, length delimited. Does not implicitly {@link PB_SCTimeDateInfo.verify|verify} messages.
     * @param message PB_SCTimeDateInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCTimeDateInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCTimeDateInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCTimeDateInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCTimeDateInfo;

    /**
     * Decodes a PB_SCTimeDateInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCTimeDateInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCTimeDateInfo;

    /**
     * Verifies a PB_SCTimeDateInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCTimeDateInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCTimeDateInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCTimeDateInfo;

    /**
     * Creates a plain object from a PB_SCTimeDateInfo message. Also converts values to other types if specified.
     * @param message PB_SCTimeDateInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCTimeDateInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCTimeDateInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCCrossConnectInfo. */
export interface IPB_SCCrossConnectInfo {

    /** PB_SCCrossConnectInfo isConnectedCross */
    isConnectedCross?: (number|null);

    /** PB_SCCrossConnectInfo isCross */
    isCross?: (number|null);
}

/** Represents a PB_SCCrossConnectInfo. */
export class PB_SCCrossConnectInfo implements IPB_SCCrossConnectInfo {

    /**
     * Constructs a new PB_SCCrossConnectInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCCrossConnectInfo);

    /** PB_SCCrossConnectInfo isConnectedCross. */
    public isConnectedCross: number;

    /** PB_SCCrossConnectInfo isCross. */
    public isCross: number;

    /**
     * Creates a new PB_SCCrossConnectInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCCrossConnectInfo instance
     */
    public static create(properties?: IPB_SCCrossConnectInfo): PB_SCCrossConnectInfo;

    /**
     * Encodes the specified PB_SCCrossConnectInfo message. Does not implicitly {@link PB_SCCrossConnectInfo.verify|verify} messages.
     * @param message PB_SCCrossConnectInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCCrossConnectInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCCrossConnectInfo message, length delimited. Does not implicitly {@link PB_SCCrossConnectInfo.verify|verify} messages.
     * @param message PB_SCCrossConnectInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCCrossConnectInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCCrossConnectInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCCrossConnectInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCCrossConnectInfo;

    /**
     * Decodes a PB_SCCrossConnectInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCCrossConnectInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCCrossConnectInfo;

    /**
     * Verifies a PB_SCCrossConnectInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCCrossConnectInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCCrossConnectInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCCrossConnectInfo;

    /**
     * Creates a plain object from a PB_SCCrossConnectInfo message. Also converts values to other types if specified.
     * @param message PB_SCCrossConnectInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCCrossConnectInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCCrossConnectInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSTimeReq. */
export interface IPB_CSTimeReq {

    /** PB_CSTimeReq reserve */
    reserve?: (number|null);
}

/** Represents a PB_CSTimeReq. */
export class PB_CSTimeReq implements IPB_CSTimeReq {

    /**
     * Constructs a new PB_CSTimeReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSTimeReq);

    /** PB_CSTimeReq reserve. */
    public reserve: number;

    /**
     * Creates a new PB_CSTimeReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSTimeReq instance
     */
    public static create(properties?: IPB_CSTimeReq): PB_CSTimeReq;

    /**
     * Encodes the specified PB_CSTimeReq message. Does not implicitly {@link PB_CSTimeReq.verify|verify} messages.
     * @param message PB_CSTimeReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSTimeReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSTimeReq message, length delimited. Does not implicitly {@link PB_CSTimeReq.verify|verify} messages.
     * @param message PB_CSTimeReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSTimeReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSTimeReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSTimeReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSTimeReq;

    /**
     * Decodes a PB_CSTimeReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSTimeReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSTimeReq;

    /**
     * Verifies a PB_CSTimeReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSTimeReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSTimeReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSTimeReq;

    /**
     * Creates a plain object from a PB_CSTimeReq message. Also converts values to other types if specified.
     * @param message PB_CSTimeReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSTimeReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSTimeReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSSevenDayHeroReq. */
export interface IPB_CSSevenDayHeroReq {

    /** PB_CSSevenDayHeroReq reqType */
    reqType?: (number|null);

    /** PB_CSSevenDayHeroReq p1 */
    p1?: (number|null);
}

/** Represents a PB_CSSevenDayHeroReq. */
export class PB_CSSevenDayHeroReq implements IPB_CSSevenDayHeroReq {

    /**
     * Constructs a new PB_CSSevenDayHeroReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSSevenDayHeroReq);

    /** PB_CSSevenDayHeroReq reqType. */
    public reqType: number;

    /** PB_CSSevenDayHeroReq p1. */
    public p1: number;

    /**
     * Creates a new PB_CSSevenDayHeroReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSSevenDayHeroReq instance
     */
    public static create(properties?: IPB_CSSevenDayHeroReq): PB_CSSevenDayHeroReq;

    /**
     * Encodes the specified PB_CSSevenDayHeroReq message. Does not implicitly {@link PB_CSSevenDayHeroReq.verify|verify} messages.
     * @param message PB_CSSevenDayHeroReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSSevenDayHeroReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSSevenDayHeroReq message, length delimited. Does not implicitly {@link PB_CSSevenDayHeroReq.verify|verify} messages.
     * @param message PB_CSSevenDayHeroReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSSevenDayHeroReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSSevenDayHeroReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSSevenDayHeroReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSSevenDayHeroReq;

    /**
     * Decodes a PB_CSSevenDayHeroReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSSevenDayHeroReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSSevenDayHeroReq;

    /**
     * Verifies a PB_CSSevenDayHeroReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSSevenDayHeroReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSSevenDayHeroReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSSevenDayHeroReq;

    /**
     * Creates a plain object from a PB_CSSevenDayHeroReq message. Also converts values to other types if specified.
     * @param message PB_CSSevenDayHeroReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSSevenDayHeroReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSSevenDayHeroReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCSevenDayHeroInfo. */
export interface IPB_SCSevenDayHeroInfo {

    /** PB_SCSevenDayHeroInfo fetchRewardTimes */
    fetchRewardTimes?: (number|null);

    /** PB_SCSevenDayHeroInfo expiryTime */
    expiryTime?: (number|null);

    /** PB_SCSevenDayHeroInfo heroId */
    heroId?: (number[]|null);
}

/** Represents a PB_SCSevenDayHeroInfo. */
export class PB_SCSevenDayHeroInfo implements IPB_SCSevenDayHeroInfo {

    /**
     * Constructs a new PB_SCSevenDayHeroInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCSevenDayHeroInfo);

    /** PB_SCSevenDayHeroInfo fetchRewardTimes. */
    public fetchRewardTimes: number;

    /** PB_SCSevenDayHeroInfo expiryTime. */
    public expiryTime: number;

    /** PB_SCSevenDayHeroInfo heroId. */
    public heroId: number[];

    /**
     * Creates a new PB_SCSevenDayHeroInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCSevenDayHeroInfo instance
     */
    public static create(properties?: IPB_SCSevenDayHeroInfo): PB_SCSevenDayHeroInfo;

    /**
     * Encodes the specified PB_SCSevenDayHeroInfo message. Does not implicitly {@link PB_SCSevenDayHeroInfo.verify|verify} messages.
     * @param message PB_SCSevenDayHeroInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCSevenDayHeroInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCSevenDayHeroInfo message, length delimited. Does not implicitly {@link PB_SCSevenDayHeroInfo.verify|verify} messages.
     * @param message PB_SCSevenDayHeroInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCSevenDayHeroInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCSevenDayHeroInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCSevenDayHeroInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCSevenDayHeroInfo;

    /**
     * Decodes a PB_SCSevenDayHeroInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCSevenDayHeroInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCSevenDayHeroInfo;

    /**
     * Verifies a PB_SCSevenDayHeroInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCSevenDayHeroInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCSevenDayHeroInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCSevenDayHeroInfo;

    /**
     * Creates a plain object from a PB_SCSevenDayHeroInfo message. Also converts values to other types if specified.
     * @param message PB_SCSevenDayHeroInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCSevenDayHeroInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCSevenDayHeroInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSShopBoxReq. */
export interface IPB_CSShopBoxReq {

    /** PB_CSShopBoxReq reqType */
    reqType?: (number|null);

    /** PB_CSShopBoxReq paramList */
    paramList?: (number[]|null);
}

/** Represents a PB_CSShopBoxReq. */
export class PB_CSShopBoxReq implements IPB_CSShopBoxReq {

    /**
     * Constructs a new PB_CSShopBoxReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSShopBoxReq);

    /** PB_CSShopBoxReq reqType. */
    public reqType: number;

    /** PB_CSShopBoxReq paramList. */
    public paramList: number[];

    /**
     * Creates a new PB_CSShopBoxReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSShopBoxReq instance
     */
    public static create(properties?: IPB_CSShopBoxReq): PB_CSShopBoxReq;

    /**
     * Encodes the specified PB_CSShopBoxReq message. Does not implicitly {@link PB_CSShopBoxReq.verify|verify} messages.
     * @param message PB_CSShopBoxReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSShopBoxReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSShopBoxReq message, length delimited. Does not implicitly {@link PB_CSShopBoxReq.verify|verify} messages.
     * @param message PB_CSShopBoxReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSShopBoxReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSShopBoxReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSShopBoxReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSShopBoxReq;

    /**
     * Decodes a PB_CSShopBoxReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSShopBoxReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSShopBoxReq;

    /**
     * Verifies a PB_CSShopBoxReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSShopBoxReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSShopBoxReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSShopBoxReq;

    /**
     * Creates a plain object from a PB_CSShopBoxReq message. Also converts values to other types if specified.
     * @param message PB_CSShopBoxReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSShopBoxReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSShopBoxReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCShopBoxInfo. */
export interface IPB_SCShopBoxInfo {

    /** PB_SCShopBoxInfo boxLevel */
    boxLevel?: (number|null);

    /** PB_SCShopBoxInfo boxExp */
    boxExp?: (number|null);
}

/** Represents a PB_SCShopBoxInfo. */
export class PB_SCShopBoxInfo implements IPB_SCShopBoxInfo {

    /**
     * Constructs a new PB_SCShopBoxInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCShopBoxInfo);

    /** PB_SCShopBoxInfo boxLevel. */
    public boxLevel: number;

    /** PB_SCShopBoxInfo boxExp. */
    public boxExp: number;

    /**
     * Creates a new PB_SCShopBoxInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCShopBoxInfo instance
     */
    public static create(properties?: IPB_SCShopBoxInfo): PB_SCShopBoxInfo;

    /**
     * Encodes the specified PB_SCShopBoxInfo message. Does not implicitly {@link PB_SCShopBoxInfo.verify|verify} messages.
     * @param message PB_SCShopBoxInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCShopBoxInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCShopBoxInfo message, length delimited. Does not implicitly {@link PB_SCShopBoxInfo.verify|verify} messages.
     * @param message PB_SCShopBoxInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCShopBoxInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCShopBoxInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCShopBoxInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCShopBoxInfo;

    /**
     * Decodes a PB_SCShopBoxInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCShopBoxInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCShopBoxInfo;

    /**
     * Verifies a PB_SCShopBoxInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCShopBoxInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCShopBoxInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCShopBoxInfo;

    /**
     * Creates a plain object from a PB_SCShopBoxInfo message. Also converts values to other types if specified.
     * @param message PB_SCShopBoxInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCShopBoxInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCShopBoxInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSShopReq. */
export interface IPB_CSShopReq {

    /** PB_CSShopReq reqType */
    reqType?: (number|null);

    /** PB_CSShopReq paramList */
    paramList?: (number[]|null);
}

/** Represents a PB_CSShopReq. */
export class PB_CSShopReq implements IPB_CSShopReq {

    /**
     * Constructs a new PB_CSShopReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSShopReq);

    /** PB_CSShopReq reqType. */
    public reqType: number;

    /** PB_CSShopReq paramList. */
    public paramList: number[];

    /**
     * Creates a new PB_CSShopReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSShopReq instance
     */
    public static create(properties?: IPB_CSShopReq): PB_CSShopReq;

    /**
     * Encodes the specified PB_CSShopReq message. Does not implicitly {@link PB_CSShopReq.verify|verify} messages.
     * @param message PB_CSShopReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSShopReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSShopReq message, length delimited. Does not implicitly {@link PB_CSShopReq.verify|verify} messages.
     * @param message PB_CSShopReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSShopReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSShopReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSShopReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSShopReq;

    /**
     * Decodes a PB_CSShopReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSShopReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSShopReq;

    /**
     * Verifies a PB_CSShopReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSShopReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSShopReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSShopReq;

    /**
     * Creates a plain object from a PB_CSShopReq message. Also converts values to other types if specified.
     * @param message PB_CSShopReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSShopReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSShopReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCShopNode. */
export interface IPB_SCShopNode {

    /** PB_SCShopNode shopIndex */
    shopIndex?: (number|null);

    /** PB_SCShopNode buyNum */
    buyNum?: (number|null);
}

/** Represents a PB_SCShopNode. */
export class PB_SCShopNode implements IPB_SCShopNode {

    /**
     * Constructs a new PB_SCShopNode.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCShopNode);

    /** PB_SCShopNode shopIndex. */
    public shopIndex: number;

    /** PB_SCShopNode buyNum. */
    public buyNum: number;

    /**
     * Creates a new PB_SCShopNode instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCShopNode instance
     */
    public static create(properties?: IPB_SCShopNode): PB_SCShopNode;

    /**
     * Encodes the specified PB_SCShopNode message. Does not implicitly {@link PB_SCShopNode.verify|verify} messages.
     * @param message PB_SCShopNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCShopNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCShopNode message, length delimited. Does not implicitly {@link PB_SCShopNode.verify|verify} messages.
     * @param message PB_SCShopNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCShopNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCShopNode message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCShopNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCShopNode;

    /**
     * Decodes a PB_SCShopNode message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCShopNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCShopNode;

    /**
     * Verifies a PB_SCShopNode message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCShopNode message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCShopNode
     */
    public static fromObject(object: { [k: string]: any }): PB_SCShopNode;

    /**
     * Creates a plain object from a PB_SCShopNode message. Also converts values to other types if specified.
     * @param message PB_SCShopNode
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCShopNode, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCShopNode to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCShopInfo. */
export interface IPB_SCShopInfo {

    /** PB_SCShopInfo sendType */
    sendType?: (number|null);

    /** PB_SCShopInfo shopList */
    shopList?: (IPB_SCShopNode[]|null);
}

/** Represents a PB_SCShopInfo. */
export class PB_SCShopInfo implements IPB_SCShopInfo {

    /**
     * Constructs a new PB_SCShopInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCShopInfo);

    /** PB_SCShopInfo sendType. */
    public sendType: number;

    /** PB_SCShopInfo shopList. */
    public shopList: IPB_SCShopNode[];

    /**
     * Creates a new PB_SCShopInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCShopInfo instance
     */
    public static create(properties?: IPB_SCShopInfo): PB_SCShopInfo;

    /**
     * Encodes the specified PB_SCShopInfo message. Does not implicitly {@link PB_SCShopInfo.verify|verify} messages.
     * @param message PB_SCShopInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCShopInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCShopInfo message, length delimited. Does not implicitly {@link PB_SCShopInfo.verify|verify} messages.
     * @param message PB_SCShopInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCShopInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCShopInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCShopInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCShopInfo;

    /**
     * Decodes a PB_SCShopInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCShopInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCShopInfo;

    /**
     * Verifies a PB_SCShopInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCShopInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCShopInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCShopInfo;

    /**
     * Creates a plain object from a PB_SCShopInfo message. Also converts values to other types if specified.
     * @param message PB_SCShopInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCShopInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCShopInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSDailyBuyReq. */
export interface IPB_CSDailyBuyReq {

    /** PB_CSDailyBuyReq reqType */
    reqType?: (number|null);

    /** PB_CSDailyBuyReq paramList */
    paramList?: (number[]|null);
}

/** Represents a PB_CSDailyBuyReq. */
export class PB_CSDailyBuyReq implements IPB_CSDailyBuyReq {

    /**
     * Constructs a new PB_CSDailyBuyReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSDailyBuyReq);

    /** PB_CSDailyBuyReq reqType. */
    public reqType: number;

    /** PB_CSDailyBuyReq paramList. */
    public paramList: number[];

    /**
     * Creates a new PB_CSDailyBuyReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSDailyBuyReq instance
     */
    public static create(properties?: IPB_CSDailyBuyReq): PB_CSDailyBuyReq;

    /**
     * Encodes the specified PB_CSDailyBuyReq message. Does not implicitly {@link PB_CSDailyBuyReq.verify|verify} messages.
     * @param message PB_CSDailyBuyReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSDailyBuyReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSDailyBuyReq message, length delimited. Does not implicitly {@link PB_CSDailyBuyReq.verify|verify} messages.
     * @param message PB_CSDailyBuyReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSDailyBuyReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSDailyBuyReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSDailyBuyReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSDailyBuyReq;

    /**
     * Decodes a PB_CSDailyBuyReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSDailyBuyReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSDailyBuyReq;

    /**
     * Verifies a PB_CSDailyBuyReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSDailyBuyReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSDailyBuyReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSDailyBuyReq;

    /**
     * Creates a plain object from a PB_CSDailyBuyReq message. Also converts values to other types if specified.
     * @param message PB_CSDailyBuyReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSDailyBuyReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSDailyBuyReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_DailyBuyItem. */
export interface IPB_DailyBuyItem {

    /** PB_DailyBuyItem itemId */
    itemId?: (number|null);

    /** PB_DailyBuyItem itemNum */
    itemNum?: (number|null);

    /** PB_DailyBuyItem consumeId */
    consumeId?: (number|null);

    /** PB_DailyBuyItem consumeNum */
    consumeNum?: (number|null);

    /** PB_DailyBuyItem isBuy */
    isBuy?: (boolean|null);
}

/** Represents a PB_DailyBuyItem. */
export class PB_DailyBuyItem implements IPB_DailyBuyItem {

    /**
     * Constructs a new PB_DailyBuyItem.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_DailyBuyItem);

    /** PB_DailyBuyItem itemId. */
    public itemId: number;

    /** PB_DailyBuyItem itemNum. */
    public itemNum: number;

    /** PB_DailyBuyItem consumeId. */
    public consumeId: number;

    /** PB_DailyBuyItem consumeNum. */
    public consumeNum: number;

    /** PB_DailyBuyItem isBuy. */
    public isBuy: boolean;

    /**
     * Creates a new PB_DailyBuyItem instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_DailyBuyItem instance
     */
    public static create(properties?: IPB_DailyBuyItem): PB_DailyBuyItem;

    /**
     * Encodes the specified PB_DailyBuyItem message. Does not implicitly {@link PB_DailyBuyItem.verify|verify} messages.
     * @param message PB_DailyBuyItem message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_DailyBuyItem, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_DailyBuyItem message, length delimited. Does not implicitly {@link PB_DailyBuyItem.verify|verify} messages.
     * @param message PB_DailyBuyItem message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_DailyBuyItem, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_DailyBuyItem message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_DailyBuyItem
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_DailyBuyItem;

    /**
     * Decodes a PB_DailyBuyItem message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_DailyBuyItem
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_DailyBuyItem;

    /**
     * Verifies a PB_DailyBuyItem message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_DailyBuyItem message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_DailyBuyItem
     */
    public static fromObject(object: { [k: string]: any }): PB_DailyBuyItem;

    /**
     * Creates a plain object from a PB_DailyBuyItem message. Also converts values to other types if specified.
     * @param message PB_DailyBuyItem
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_DailyBuyItem, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_DailyBuyItem to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCDailyBuyInfo. */
export interface IPB_SCDailyBuyInfo {

    /** PB_SCDailyBuyInfo dayRefreshTimes */
    dayRefreshTimes?: (number|null);

    /** PB_SCDailyBuyInfo itemList */
    itemList?: (IPB_DailyBuyItem[]|null);
}

/** Represents a PB_SCDailyBuyInfo. */
export class PB_SCDailyBuyInfo implements IPB_SCDailyBuyInfo {

    /**
     * Constructs a new PB_SCDailyBuyInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCDailyBuyInfo);

    /** PB_SCDailyBuyInfo dayRefreshTimes. */
    public dayRefreshTimes: number;

    /** PB_SCDailyBuyInfo itemList. */
    public itemList: IPB_DailyBuyItem[];

    /**
     * Creates a new PB_SCDailyBuyInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCDailyBuyInfo instance
     */
    public static create(properties?: IPB_SCDailyBuyInfo): PB_SCDailyBuyInfo;

    /**
     * Encodes the specified PB_SCDailyBuyInfo message. Does not implicitly {@link PB_SCDailyBuyInfo.verify|verify} messages.
     * @param message PB_SCDailyBuyInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCDailyBuyInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCDailyBuyInfo message, length delimited. Does not implicitly {@link PB_SCDailyBuyInfo.verify|verify} messages.
     * @param message PB_SCDailyBuyInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCDailyBuyInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCDailyBuyInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCDailyBuyInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCDailyBuyInfo;

    /**
     * Decodes a PB_SCDailyBuyInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCDailyBuyInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCDailyBuyInfo;

    /**
     * Verifies a PB_SCDailyBuyInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCDailyBuyInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCDailyBuyInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCDailyBuyInfo;

    /**
     * Creates a plain object from a PB_SCDailyBuyInfo message. Also converts values to other types if specified.
     * @param message PB_SCDailyBuyInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCDailyBuyInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCDailyBuyInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_UniqueID. */
export interface IPB_UniqueID {

    /** PB_UniqueID itemUniqueId */
    itemUniqueId?: (number[]|null);
}

/** Represents a PB_UniqueID. */
export class PB_UniqueID implements IPB_UniqueID {

    /**
     * Constructs a new PB_UniqueID.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_UniqueID);

    /** PB_UniqueID itemUniqueId. */
    public itemUniqueId: number[];

    /**
     * Creates a new PB_UniqueID instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_UniqueID instance
     */
    public static create(properties?: IPB_UniqueID): PB_UniqueID;

    /**
     * Encodes the specified PB_UniqueID message. Does not implicitly {@link PB_UniqueID.verify|verify} messages.
     * @param message PB_UniqueID message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_UniqueID, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_UniqueID message, length delimited. Does not implicitly {@link PB_UniqueID.verify|verify} messages.
     * @param message PB_UniqueID message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_UniqueID, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_UniqueID message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_UniqueID
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_UniqueID;

    /**
     * Decodes a PB_UniqueID message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_UniqueID
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_UniqueID;

    /**
     * Verifies a PB_UniqueID message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_UniqueID message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_UniqueID
     */
    public static fromObject(object: { [k: string]: any }): PB_UniqueID;

    /**
     * Creates a plain object from a PB_UniqueID message. Also converts values to other types if specified.
     * @param message PB_UniqueID
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_UniqueID, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_UniqueID to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCNoticeNum. */
export interface IPB_SCNoticeNum {

    /** PB_SCNoticeNum noticeNum */
    noticeNum?: (number|null);
}

/** Represents a PB_SCNoticeNum. */
export class PB_SCNoticeNum implements IPB_SCNoticeNum {

    /**
     * Constructs a new PB_SCNoticeNum.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCNoticeNum);

    /** PB_SCNoticeNum noticeNum. */
    public noticeNum: number;

    /**
     * Creates a new PB_SCNoticeNum instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCNoticeNum instance
     */
    public static create(properties?: IPB_SCNoticeNum): PB_SCNoticeNum;

    /**
     * Encodes the specified PB_SCNoticeNum message. Does not implicitly {@link PB_SCNoticeNum.verify|verify} messages.
     * @param message PB_SCNoticeNum message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCNoticeNum, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCNoticeNum message, length delimited. Does not implicitly {@link PB_SCNoticeNum.verify|verify} messages.
     * @param message PB_SCNoticeNum message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCNoticeNum, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCNoticeNum message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCNoticeNum
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCNoticeNum;

    /**
     * Decodes a PB_SCNoticeNum message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCNoticeNum
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCNoticeNum;

    /**
     * Verifies a PB_SCNoticeNum message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCNoticeNum message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCNoticeNum
     */
    public static fromObject(object: { [k: string]: any }): PB_SCNoticeNum;

    /**
     * Creates a plain object from a PB_SCNoticeNum message. Also converts values to other types if specified.
     * @param message PB_SCNoticeNum
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCNoticeNum, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCNoticeNum to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCSystemMsg. */
export interface IPB_SCSystemMsg {

    /** PB_SCSystemMsg sendTime */
    sendTime?: (number|null);

    /** PB_SCSystemMsg limitLevel */
    limitLevel?: (number|null);

    /** PB_SCSystemMsg msgLength */
    msgLength?: (number|null);

    /** PB_SCSystemMsg displayPos */
    displayPos?: (number|null);

    /** PB_SCSystemMsg color */
    color?: (number|null);

    /** PB_SCSystemMsg msgType */
    msgType?: (number|null);

    /** PB_SCSystemMsg spidId */
    spidId?: (Uint8Array|null);

    /** PB_SCSystemMsg msg */
    msg?: (Uint8Array|null);
}

/** Represents a PB_SCSystemMsg. */
export class PB_SCSystemMsg implements IPB_SCSystemMsg {

    /**
     * Constructs a new PB_SCSystemMsg.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCSystemMsg);

    /** PB_SCSystemMsg sendTime. */
    public sendTime: number;

    /** PB_SCSystemMsg limitLevel. */
    public limitLevel: number;

    /** PB_SCSystemMsg msgLength. */
    public msgLength: number;

    /** PB_SCSystemMsg displayPos. */
    public displayPos: number;

    /** PB_SCSystemMsg color. */
    public color: number;

    /** PB_SCSystemMsg msgType. */
    public msgType: number;

    /** PB_SCSystemMsg spidId. */
    public spidId: Uint8Array;

    /** PB_SCSystemMsg msg. */
    public msg: Uint8Array;

    /**
     * Creates a new PB_SCSystemMsg instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCSystemMsg instance
     */
    public static create(properties?: IPB_SCSystemMsg): PB_SCSystemMsg;

    /**
     * Encodes the specified PB_SCSystemMsg message. Does not implicitly {@link PB_SCSystemMsg.verify|verify} messages.
     * @param message PB_SCSystemMsg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCSystemMsg, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCSystemMsg message, length delimited. Does not implicitly {@link PB_SCSystemMsg.verify|verify} messages.
     * @param message PB_SCSystemMsg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCSystemMsg, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCSystemMsg message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCSystemMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCSystemMsg;

    /**
     * Decodes a PB_SCSystemMsg message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCSystemMsg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCSystemMsg;

    /**
     * Verifies a PB_SCSystemMsg message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCSystemMsg message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCSystemMsg
     */
    public static fromObject(object: { [k: string]: any }): PB_SCSystemMsg;

    /**
     * Creates a plain object from a PB_SCSystemMsg message. Also converts values to other types if specified.
     * @param message PB_SCSystemMsg
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCSystemMsg, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCSystemMsg to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCZeroHour. */
export interface IPB_SCZeroHour {

    /** PB_SCZeroHour reserve */
    reserve?: (number|null);
}

/** Represents a PB_SCZeroHour. */
export class PB_SCZeroHour implements IPB_SCZeroHour {

    /**
     * Constructs a new PB_SCZeroHour.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCZeroHour);

    /** PB_SCZeroHour reserve. */
    public reserve: number;

    /**
     * Creates a new PB_SCZeroHour instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCZeroHour instance
     */
    public static create(properties?: IPB_SCZeroHour): PB_SCZeroHour;

    /**
     * Encodes the specified PB_SCZeroHour message. Does not implicitly {@link PB_SCZeroHour.verify|verify} messages.
     * @param message PB_SCZeroHour message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCZeroHour, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCZeroHour message, length delimited. Does not implicitly {@link PB_SCZeroHour.verify|verify} messages.
     * @param message PB_SCZeroHour message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCZeroHour, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCZeroHour message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCZeroHour
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCZeroHour;

    /**
     * Decodes a PB_SCZeroHour message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCZeroHour
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCZeroHour;

    /**
     * Verifies a PB_SCZeroHour message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCZeroHour message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCZeroHour
     */
    public static fromObject(object: { [k: string]: any }): PB_SCZeroHour;

    /**
     * Creates a plain object from a PB_SCZeroHour message. Also converts values to other types if specified.
     * @param message PB_SCZeroHour
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCZeroHour, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCZeroHour to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCCMDChongZhiRetInfo. */
export interface IPB_SCCMDChongZhiRetInfo {

    /** PB_SCCMDChongZhiRetInfo roleId */
    roleId?: (number|null);

    /** PB_SCCMDChongZhiRetInfo addGold */
    addGold?: (number|null);

    /** PB_SCCMDChongZhiRetInfo orderId */
    orderId?: (Uint8Array|null);

    /** PB_SCCMDChongZhiRetInfo money */
    money?: (number|null);

    /** PB_SCCMDChongZhiRetInfo moneyType */
    moneyType?: (Uint8Array|null);
}

/** Represents a PB_SCCMDChongZhiRetInfo. */
export class PB_SCCMDChongZhiRetInfo implements IPB_SCCMDChongZhiRetInfo {

    /**
     * Constructs a new PB_SCCMDChongZhiRetInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCCMDChongZhiRetInfo);

    /** PB_SCCMDChongZhiRetInfo roleId. */
    public roleId: number;

    /** PB_SCCMDChongZhiRetInfo addGold. */
    public addGold: number;

    /** PB_SCCMDChongZhiRetInfo orderId. */
    public orderId: Uint8Array;

    /** PB_SCCMDChongZhiRetInfo money. */
    public money: number;

    /** PB_SCCMDChongZhiRetInfo moneyType. */
    public moneyType: Uint8Array;

    /**
     * Creates a new PB_SCCMDChongZhiRetInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCCMDChongZhiRetInfo instance
     */
    public static create(properties?: IPB_SCCMDChongZhiRetInfo): PB_SCCMDChongZhiRetInfo;

    /**
     * Encodes the specified PB_SCCMDChongZhiRetInfo message. Does not implicitly {@link PB_SCCMDChongZhiRetInfo.verify|verify} messages.
     * @param message PB_SCCMDChongZhiRetInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCCMDChongZhiRetInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCCMDChongZhiRetInfo message, length delimited. Does not implicitly {@link PB_SCCMDChongZhiRetInfo.verify|verify} messages.
     * @param message PB_SCCMDChongZhiRetInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCCMDChongZhiRetInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCCMDChongZhiRetInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCCMDChongZhiRetInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCCMDChongZhiRetInfo;

    /**
     * Decodes a PB_SCCMDChongZhiRetInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCCMDChongZhiRetInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCCMDChongZhiRetInfo;

    /**
     * Verifies a PB_SCCMDChongZhiRetInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCCMDChongZhiRetInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCCMDChongZhiRetInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCCMDChongZhiRetInfo;

    /**
     * Creates a plain object from a PB_SCCMDChongZhiRetInfo message. Also converts values to other types if specified.
     * @param message PB_SCCMDChongZhiRetInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCCMDChongZhiRetInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCCMDChongZhiRetInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_CSTerritoryReq. */
export interface IPB_CSTerritoryReq {

    /** PB_CSTerritoryReq type */
    type?: (number|null);

    /** PB_CSTerritoryReq param */
    param?: (number[]|null);
}

/** Represents a PB_CSTerritoryReq. */
export class PB_CSTerritoryReq implements IPB_CSTerritoryReq {

    /**
     * Constructs a new PB_CSTerritoryReq.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_CSTerritoryReq);

    /** PB_CSTerritoryReq type. */
    public type: number;

    /** PB_CSTerritoryReq param. */
    public param: number[];

    /**
     * Creates a new PB_CSTerritoryReq instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_CSTerritoryReq instance
     */
    public static create(properties?: IPB_CSTerritoryReq): PB_CSTerritoryReq;

    /**
     * Encodes the specified PB_CSTerritoryReq message. Does not implicitly {@link PB_CSTerritoryReq.verify|verify} messages.
     * @param message PB_CSTerritoryReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_CSTerritoryReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_CSTerritoryReq message, length delimited. Does not implicitly {@link PB_CSTerritoryReq.verify|verify} messages.
     * @param message PB_CSTerritoryReq message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_CSTerritoryReq, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_CSTerritoryReq message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_CSTerritoryReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_CSTerritoryReq;

    /**
     * Decodes a PB_CSTerritoryReq message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_CSTerritoryReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_CSTerritoryReq;

    /**
     * Verifies a PB_CSTerritoryReq message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_CSTerritoryReq message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_CSTerritoryReq
     */
    public static fromObject(object: { [k: string]: any }): PB_CSTerritoryReq;

    /**
     * Creates a plain object from a PB_CSTerritoryReq message. Also converts values to other types if specified.
     * @param message PB_CSTerritoryReq
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_CSTerritoryReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_CSTerritoryReq to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCTerritoryItemNode. */
export interface IPB_SCTerritoryItemNode {

    /** PB_SCTerritoryItemNode seq */
    seq?: (number|null);

    /** PB_SCTerritoryItemNode index */
    index?: (number|null);

    /** PB_SCTerritoryItemNode attackerNum */
    attackerNum?: (number|null);

    /** PB_SCTerritoryItemNode attackerEfficiency */
    attackerEfficiency?: (number|null);

    /** PB_SCTerritoryItemNode attackerInfo */
    attackerInfo?: (IPB_RoleInfo|null);

    /** PB_SCTerritoryItemNode defenderNum */
    defenderNum?: (number|null);

    /** PB_SCTerritoryItemNode defenderEfficiency */
    defenderEfficiency?: (number|null);

    /** PB_SCTerritoryItemNode refreshTime */
    refreshTime?: (number|null);

    /** PB_SCTerritoryItemNode pos */
    pos?: (number|null);

    /** PB_SCTerritoryItemNode endTime */
    endTime?: (number|null);
}

/** Represents a PB_SCTerritoryItemNode. */
export class PB_SCTerritoryItemNode implements IPB_SCTerritoryItemNode {

    /**
     * Constructs a new PB_SCTerritoryItemNode.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCTerritoryItemNode);

    /** PB_SCTerritoryItemNode seq. */
    public seq: number;

    /** PB_SCTerritoryItemNode index. */
    public index: number;

    /** PB_SCTerritoryItemNode attackerNum. */
    public attackerNum: number;

    /** PB_SCTerritoryItemNode attackerEfficiency. */
    public attackerEfficiency: number;

    /** PB_SCTerritoryItemNode attackerInfo. */
    public attackerInfo?: (IPB_RoleInfo|null);

    /** PB_SCTerritoryItemNode defenderNum. */
    public defenderNum: number;

    /** PB_SCTerritoryItemNode defenderEfficiency. */
    public defenderEfficiency: number;

    /** PB_SCTerritoryItemNode refreshTime. */
    public refreshTime: number;

    /** PB_SCTerritoryItemNode pos. */
    public pos: number;

    /** PB_SCTerritoryItemNode endTime. */
    public endTime: number;

    /**
     * Creates a new PB_SCTerritoryItemNode instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCTerritoryItemNode instance
     */
    public static create(properties?: IPB_SCTerritoryItemNode): PB_SCTerritoryItemNode;

    /**
     * Encodes the specified PB_SCTerritoryItemNode message. Does not implicitly {@link PB_SCTerritoryItemNode.verify|verify} messages.
     * @param message PB_SCTerritoryItemNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCTerritoryItemNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCTerritoryItemNode message, length delimited. Does not implicitly {@link PB_SCTerritoryItemNode.verify|verify} messages.
     * @param message PB_SCTerritoryItemNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCTerritoryItemNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCTerritoryItemNode message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCTerritoryItemNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCTerritoryItemNode;

    /**
     * Decodes a PB_SCTerritoryItemNode message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCTerritoryItemNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCTerritoryItemNode;

    /**
     * Verifies a PB_SCTerritoryItemNode message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCTerritoryItemNode message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCTerritoryItemNode
     */
    public static fromObject(object: { [k: string]: any }): PB_SCTerritoryItemNode;

    /**
     * Creates a plain object from a PB_SCTerritoryItemNode message. Also converts values to other types if specified.
     * @param message PB_SCTerritoryItemNode
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCTerritoryItemNode, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCTerritoryItemNode to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCTerritoryInfo. */
export interface IPB_SCTerritoryInfo {

    /** PB_SCTerritoryInfo roleInfo */
    roleInfo?: (IPB_RoleInfo|null);

    /** PB_SCTerritoryInfo territoryLevel */
    territoryLevel?: (number|null);

    /** PB_SCTerritoryInfo botNum */
    botNum?: (number|null);

    /** PB_SCTerritoryInfo botRunNum */
    botRunNum?: (number|null);

    /** PB_SCTerritoryInfo botBuyCount */
    botBuyCount?: (number|null);

    /** PB_SCTerritoryInfo rewardCount */
    rewardCount?: (number|null);

    /** PB_SCTerritoryInfo itemList */
    itemList?: (IPB_SCTerritoryItemNode[]|null);

    /** PB_SCTerritoryInfo reason */
    reason?: (number|null);
}

/** Represents a PB_SCTerritoryInfo. */
export class PB_SCTerritoryInfo implements IPB_SCTerritoryInfo {

    /**
     * Constructs a new PB_SCTerritoryInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCTerritoryInfo);

    /** PB_SCTerritoryInfo roleInfo. */
    public roleInfo?: (IPB_RoleInfo|null);

    /** PB_SCTerritoryInfo territoryLevel. */
    public territoryLevel: number;

    /** PB_SCTerritoryInfo botNum. */
    public botNum: number;

    /** PB_SCTerritoryInfo botRunNum. */
    public botRunNum: number;

    /** PB_SCTerritoryInfo botBuyCount. */
    public botBuyCount: number;

    /** PB_SCTerritoryInfo rewardCount. */
    public rewardCount: number;

    /** PB_SCTerritoryInfo itemList. */
    public itemList: IPB_SCTerritoryItemNode[];

    /** PB_SCTerritoryInfo reason. */
    public reason: number;

    /**
     * Creates a new PB_SCTerritoryInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCTerritoryInfo instance
     */
    public static create(properties?: IPB_SCTerritoryInfo): PB_SCTerritoryInfo;

    /**
     * Encodes the specified PB_SCTerritoryInfo message. Does not implicitly {@link PB_SCTerritoryInfo.verify|verify} messages.
     * @param message PB_SCTerritoryInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCTerritoryInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCTerritoryInfo message, length delimited. Does not implicitly {@link PB_SCTerritoryInfo.verify|verify} messages.
     * @param message PB_SCTerritoryInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCTerritoryInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCTerritoryInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCTerritoryInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCTerritoryInfo;

    /**
     * Decodes a PB_SCTerritoryInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCTerritoryInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCTerritoryInfo;

    /**
     * Verifies a PB_SCTerritoryInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCTerritoryInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCTerritoryInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCTerritoryInfo;

    /**
     * Creates a plain object from a PB_SCTerritoryInfo message. Also converts values to other types if specified.
     * @param message PB_SCTerritoryInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCTerritoryInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCTerritoryInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCTerritoryNeighbourRole. */
export interface IPB_SCTerritoryNeighbourRole {

    /** PB_SCTerritoryNeighbourRole roleInfo */
    roleInfo?: (IPB_RoleInfo|null);

    /** PB_SCTerritoryNeighbourRole itemSeq */
    itemSeq?: (number[]|null);
}

/** Represents a PB_SCTerritoryNeighbourRole. */
export class PB_SCTerritoryNeighbourRole implements IPB_SCTerritoryNeighbourRole {

    /**
     * Constructs a new PB_SCTerritoryNeighbourRole.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCTerritoryNeighbourRole);

    /** PB_SCTerritoryNeighbourRole roleInfo. */
    public roleInfo?: (IPB_RoleInfo|null);

    /** PB_SCTerritoryNeighbourRole itemSeq. */
    public itemSeq: number[];

    /**
     * Creates a new PB_SCTerritoryNeighbourRole instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCTerritoryNeighbourRole instance
     */
    public static create(properties?: IPB_SCTerritoryNeighbourRole): PB_SCTerritoryNeighbourRole;

    /**
     * Encodes the specified PB_SCTerritoryNeighbourRole message. Does not implicitly {@link PB_SCTerritoryNeighbourRole.verify|verify} messages.
     * @param message PB_SCTerritoryNeighbourRole message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCTerritoryNeighbourRole, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCTerritoryNeighbourRole message, length delimited. Does not implicitly {@link PB_SCTerritoryNeighbourRole.verify|verify} messages.
     * @param message PB_SCTerritoryNeighbourRole message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCTerritoryNeighbourRole, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCTerritoryNeighbourRole message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCTerritoryNeighbourRole
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCTerritoryNeighbourRole;

    /**
     * Decodes a PB_SCTerritoryNeighbourRole message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCTerritoryNeighbourRole
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCTerritoryNeighbourRole;

    /**
     * Verifies a PB_SCTerritoryNeighbourRole message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCTerritoryNeighbourRole message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCTerritoryNeighbourRole
     */
    public static fromObject(object: { [k: string]: any }): PB_SCTerritoryNeighbourRole;

    /**
     * Creates a plain object from a PB_SCTerritoryNeighbourRole message. Also converts values to other types if specified.
     * @param message PB_SCTerritoryNeighbourRole
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCTerritoryNeighbourRole, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCTerritoryNeighbourRole to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCTerritoryNeighbourInfo. */
export interface IPB_SCTerritoryNeighbourInfo {

    /** PB_SCTerritoryNeighbourInfo neighbourTime */
    neighbourTime?: (number|null);

    /** PB_SCTerritoryNeighbourInfo neighbourList */
    neighbourList?: (IPB_SCTerritoryNeighbourRole[]|null);

    /** PB_SCTerritoryNeighbourInfo enemyList */
    enemyList?: (IPB_SCTerritoryNeighbourRole[]|null);
}

/** Represents a PB_SCTerritoryNeighbourInfo. */
export class PB_SCTerritoryNeighbourInfo implements IPB_SCTerritoryNeighbourInfo {

    /**
     * Constructs a new PB_SCTerritoryNeighbourInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCTerritoryNeighbourInfo);

    /** PB_SCTerritoryNeighbourInfo neighbourTime. */
    public neighbourTime: number;

    /** PB_SCTerritoryNeighbourInfo neighbourList. */
    public neighbourList: IPB_SCTerritoryNeighbourRole[];

    /** PB_SCTerritoryNeighbourInfo enemyList. */
    public enemyList: IPB_SCTerritoryNeighbourRole[];

    /**
     * Creates a new PB_SCTerritoryNeighbourInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCTerritoryNeighbourInfo instance
     */
    public static create(properties?: IPB_SCTerritoryNeighbourInfo): PB_SCTerritoryNeighbourInfo;

    /**
     * Encodes the specified PB_SCTerritoryNeighbourInfo message. Does not implicitly {@link PB_SCTerritoryNeighbourInfo.verify|verify} messages.
     * @param message PB_SCTerritoryNeighbourInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCTerritoryNeighbourInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCTerritoryNeighbourInfo message, length delimited. Does not implicitly {@link PB_SCTerritoryNeighbourInfo.verify|verify} messages.
     * @param message PB_SCTerritoryNeighbourInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCTerritoryNeighbourInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCTerritoryNeighbourInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCTerritoryNeighbourInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCTerritoryNeighbourInfo;

    /**
     * Decodes a PB_SCTerritoryNeighbourInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCTerritoryNeighbourInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCTerritoryNeighbourInfo;

    /**
     * Verifies a PB_SCTerritoryNeighbourInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCTerritoryNeighbourInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCTerritoryNeighbourInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCTerritoryNeighbourInfo;

    /**
     * Creates a plain object from a PB_SCTerritoryNeighbourInfo message. Also converts values to other types if specified.
     * @param message PB_SCTerritoryNeighbourInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCTerritoryNeighbourInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCTerritoryNeighbourInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCTerritoryBotNode. */
export interface IPB_SCTerritoryBotNode {

    /** PB_SCTerritoryBotNode attackerInfo */
    attackerInfo?: (IPB_RoleInfo|null);

    /** PB_SCTerritoryBotNode attackerNum */
    attackerNum?: (number|null);

    /** PB_SCTerritoryBotNode defenderInfo */
    defenderInfo?: (IPB_RoleInfo|null);

    /** PB_SCTerritoryBotNode defenderNum */
    defenderNum?: (number|null);

    /** PB_SCTerritoryBotNode endTime */
    endTime?: (number|null);

    /** PB_SCTerritoryBotNode itemSeq */
    itemSeq?: (number|null);

    /** PB_SCTerritoryBotNode itemIndex */
    itemIndex?: (number|null);

    /** PB_SCTerritoryBotNode isAttack */
    isAttack?: (boolean|null);
}

/** Represents a PB_SCTerritoryBotNode. */
export class PB_SCTerritoryBotNode implements IPB_SCTerritoryBotNode {

    /**
     * Constructs a new PB_SCTerritoryBotNode.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCTerritoryBotNode);

    /** PB_SCTerritoryBotNode attackerInfo. */
    public attackerInfo?: (IPB_RoleInfo|null);

    /** PB_SCTerritoryBotNode attackerNum. */
    public attackerNum: number;

    /** PB_SCTerritoryBotNode defenderInfo. */
    public defenderInfo?: (IPB_RoleInfo|null);

    /** PB_SCTerritoryBotNode defenderNum. */
    public defenderNum: number;

    /** PB_SCTerritoryBotNode endTime. */
    public endTime: number;

    /** PB_SCTerritoryBotNode itemSeq. */
    public itemSeq: number;

    /** PB_SCTerritoryBotNode itemIndex. */
    public itemIndex: number;

    /** PB_SCTerritoryBotNode isAttack. */
    public isAttack: boolean;

    /**
     * Creates a new PB_SCTerritoryBotNode instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCTerritoryBotNode instance
     */
    public static create(properties?: IPB_SCTerritoryBotNode): PB_SCTerritoryBotNode;

    /**
     * Encodes the specified PB_SCTerritoryBotNode message. Does not implicitly {@link PB_SCTerritoryBotNode.verify|verify} messages.
     * @param message PB_SCTerritoryBotNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCTerritoryBotNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCTerritoryBotNode message, length delimited. Does not implicitly {@link PB_SCTerritoryBotNode.verify|verify} messages.
     * @param message PB_SCTerritoryBotNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCTerritoryBotNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCTerritoryBotNode message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCTerritoryBotNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCTerritoryBotNode;

    /**
     * Decodes a PB_SCTerritoryBotNode message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCTerritoryBotNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCTerritoryBotNode;

    /**
     * Verifies a PB_SCTerritoryBotNode message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCTerritoryBotNode message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCTerritoryBotNode
     */
    public static fromObject(object: { [k: string]: any }): PB_SCTerritoryBotNode;

    /**
     * Creates a plain object from a PB_SCTerritoryBotNode message. Also converts values to other types if specified.
     * @param message PB_SCTerritoryBotNode
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCTerritoryBotNode, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCTerritoryBotNode to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCTerritoryBotInfo. */
export interface IPB_SCTerritoryBotInfo {

    /** PB_SCTerritoryBotInfo botList */
    botList?: (IPB_SCTerritoryBotNode[]|null);
}

/** Represents a PB_SCTerritoryBotInfo. */
export class PB_SCTerritoryBotInfo implements IPB_SCTerritoryBotInfo {

    /**
     * Constructs a new PB_SCTerritoryBotInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCTerritoryBotInfo);

    /** PB_SCTerritoryBotInfo botList. */
    public botList: IPB_SCTerritoryBotNode[];

    /**
     * Creates a new PB_SCTerritoryBotInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCTerritoryBotInfo instance
     */
    public static create(properties?: IPB_SCTerritoryBotInfo): PB_SCTerritoryBotInfo;

    /**
     * Encodes the specified PB_SCTerritoryBotInfo message. Does not implicitly {@link PB_SCTerritoryBotInfo.verify|verify} messages.
     * @param message PB_SCTerritoryBotInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCTerritoryBotInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCTerritoryBotInfo message, length delimited. Does not implicitly {@link PB_SCTerritoryBotInfo.verify|verify} messages.
     * @param message PB_SCTerritoryBotInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCTerritoryBotInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCTerritoryBotInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCTerritoryBotInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCTerritoryBotInfo;

    /**
     * Decodes a PB_SCTerritoryBotInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCTerritoryBotInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCTerritoryBotInfo;

    /**
     * Verifies a PB_SCTerritoryBotInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCTerritoryBotInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCTerritoryBotInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCTerritoryBotInfo;

    /**
     * Creates a plain object from a PB_SCTerritoryBotInfo message. Also converts values to other types if specified.
     * @param message PB_SCTerritoryBotInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCTerritoryBotInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCTerritoryBotInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCTerritoryReportNode. */
export interface IPB_SCTerritoryReportNode {

    /** PB_SCTerritoryReportNode roleInfo */
    roleInfo?: (IPB_RoleInfo|null);

    /** PB_SCTerritoryReportNode reportSub */
    reportSub?: (Uint8Array|null);

    /** PB_SCTerritoryReportNode reportText */
    reportText?: (Uint8Array|null);

    /** PB_SCTerritoryReportNode reportTime */
    reportTime?: (number|null);
}

/** Represents a PB_SCTerritoryReportNode. */
export class PB_SCTerritoryReportNode implements IPB_SCTerritoryReportNode {

    /**
     * Constructs a new PB_SCTerritoryReportNode.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCTerritoryReportNode);

    /** PB_SCTerritoryReportNode roleInfo. */
    public roleInfo?: (IPB_RoleInfo|null);

    /** PB_SCTerritoryReportNode reportSub. */
    public reportSub: Uint8Array;

    /** PB_SCTerritoryReportNode reportText. */
    public reportText: Uint8Array;

    /** PB_SCTerritoryReportNode reportTime. */
    public reportTime: number;

    /**
     * Creates a new PB_SCTerritoryReportNode instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCTerritoryReportNode instance
     */
    public static create(properties?: IPB_SCTerritoryReportNode): PB_SCTerritoryReportNode;

    /**
     * Encodes the specified PB_SCTerritoryReportNode message. Does not implicitly {@link PB_SCTerritoryReportNode.verify|verify} messages.
     * @param message PB_SCTerritoryReportNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCTerritoryReportNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCTerritoryReportNode message, length delimited. Does not implicitly {@link PB_SCTerritoryReportNode.verify|verify} messages.
     * @param message PB_SCTerritoryReportNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCTerritoryReportNode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCTerritoryReportNode message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCTerritoryReportNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCTerritoryReportNode;

    /**
     * Decodes a PB_SCTerritoryReportNode message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCTerritoryReportNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCTerritoryReportNode;

    /**
     * Verifies a PB_SCTerritoryReportNode message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCTerritoryReportNode message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCTerritoryReportNode
     */
    public static fromObject(object: { [k: string]: any }): PB_SCTerritoryReportNode;

    /**
     * Creates a plain object from a PB_SCTerritoryReportNode message. Also converts values to other types if specified.
     * @param message PB_SCTerritoryReportNode
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCTerritoryReportNode, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCTerritoryReportNode to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCTerritoryReportInfo. */
export interface IPB_SCTerritoryReportInfo {

    /** PB_SCTerritoryReportInfo reportList */
    reportList?: (IPB_SCTerritoryReportNode[]|null);
}

/** Represents a PB_SCTerritoryReportInfo. */
export class PB_SCTerritoryReportInfo implements IPB_SCTerritoryReportInfo {

    /**
     * Constructs a new PB_SCTerritoryReportInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCTerritoryReportInfo);

    /** PB_SCTerritoryReportInfo reportList. */
    public reportList: IPB_SCTerritoryReportNode[];

    /**
     * Creates a new PB_SCTerritoryReportInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCTerritoryReportInfo instance
     */
    public static create(properties?: IPB_SCTerritoryReportInfo): PB_SCTerritoryReportInfo;

    /**
     * Encodes the specified PB_SCTerritoryReportInfo message. Does not implicitly {@link PB_SCTerritoryReportInfo.verify|verify} messages.
     * @param message PB_SCTerritoryReportInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCTerritoryReportInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCTerritoryReportInfo message, length delimited. Does not implicitly {@link PB_SCTerritoryReportInfo.verify|verify} messages.
     * @param message PB_SCTerritoryReportInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCTerritoryReportInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCTerritoryReportInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCTerritoryReportInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCTerritoryReportInfo;

    /**
     * Decodes a PB_SCTerritoryReportInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCTerritoryReportInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCTerritoryReportInfo;

    /**
     * Verifies a PB_SCTerritoryReportInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCTerritoryReportInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCTerritoryReportInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCTerritoryReportInfo;

    /**
     * Creates a plain object from a PB_SCTerritoryReportInfo message. Also converts values to other types if specified.
     * @param message PB_SCTerritoryReportInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCTerritoryReportInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCTerritoryReportInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PB_SCTerritoryRedInfo. */
export interface IPB_SCTerritoryRedInfo {

    /** PB_SCTerritoryRedInfo rewardFlag */
    rewardFlag?: (number|null);
}

/** Represents a PB_SCTerritoryRedInfo. */
export class PB_SCTerritoryRedInfo implements IPB_SCTerritoryRedInfo {

    /**
     * Constructs a new PB_SCTerritoryRedInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPB_SCTerritoryRedInfo);

    /** PB_SCTerritoryRedInfo rewardFlag. */
    public rewardFlag: number;

    /**
     * Creates a new PB_SCTerritoryRedInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PB_SCTerritoryRedInfo instance
     */
    public static create(properties?: IPB_SCTerritoryRedInfo): PB_SCTerritoryRedInfo;

    /**
     * Encodes the specified PB_SCTerritoryRedInfo message. Does not implicitly {@link PB_SCTerritoryRedInfo.verify|verify} messages.
     * @param message PB_SCTerritoryRedInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPB_SCTerritoryRedInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PB_SCTerritoryRedInfo message, length delimited. Does not implicitly {@link PB_SCTerritoryRedInfo.verify|verify} messages.
     * @param message PB_SCTerritoryRedInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPB_SCTerritoryRedInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PB_SCTerritoryRedInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PB_SCTerritoryRedInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PB_SCTerritoryRedInfo;

    /**
     * Decodes a PB_SCTerritoryRedInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PB_SCTerritoryRedInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PB_SCTerritoryRedInfo;

    /**
     * Verifies a PB_SCTerritoryRedInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PB_SCTerritoryRedInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PB_SCTerritoryRedInfo
     */
    public static fromObject(object: { [k: string]: any }): PB_SCTerritoryRedInfo;

    /**
     * Creates a plain object from a PB_SCTerritoryRedInfo message. Also converts values to other types if specified.
     * @param message PB_SCTerritoryRedInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PB_SCTerritoryRedInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PB_SCTerritoryRedInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
 
} 
 export {}
