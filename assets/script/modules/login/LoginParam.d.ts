/*
 * @Author: caiyunpeng
 * @Date: 2024-03-30 18:29:06
 * @FilePath: \xd-hclient\@types\LoginParam.d.ts
 * @Description: 登录配置项
 */
/**
 * game param
 */
declare namespace LoginParam {

    // /**游戏内地址结构 */
    // export class BaseUrl {
    //     switcher: string;   //switcher url
    //     gate: string;       //网关 url
    //     report: string;     //上报 url
    //     rebill?: string;    //audit bill url
    //     server_range?: number[];
    // }

    /**sdk 平台参数 */
    export class SdkInfo {
        gameId: string;         //游戏标识
        platform: string;       //平台标识
        apiSecretId: string;    //id
        apiSecretKey: string;   //key
        packageName: string;    //包名
    }

    /**游戏版权信息 */
    export class GameInfo {
        name: string;       //游戏名
        company: string;    //公司
        address: string;    //公司地址
        email: string;      //联系方式
        vc: string;         //版号信息
        isMJ?: boolean;
        openWechatChat?: boolean;   //是否开启同玩同聊
        isReport?: boolean;      //是否需要上报登录数据
    }

    /** 平台号。本地和SDK的平台号不同 */
    export var platform: string;

    /** GM初始化接口平台号 */
    export var gmInitPlatform: string;

    /** GM通用参数的AppId */
    export var gmAppId: string;

    /** 主语言 */
    export var language: string;

    /**GM地址 */
    export var gmUrl: string;

    /**sdk相关参数 */
    export var sdkInfo: SdkInfo;

    /**游戏版权等信息 */
    export var gameInfo: GameInfo;

    // /**版本号(10201 -> 1.2.1) */
    // export var reportVersion: number;


    // export var versionUrl: string;

    // /**正式地址 */
    // export var zs: BaseUrl;

    // /**提审地址 */
    // export var ts: BaseUrl;

    // //体验地址
    // export var ty: BaseUrl;

    // //开发地址
    // export var dev: BaseUrl;

    // /**yim聊天Key */
    // export var yimKey: string;

    // /**yim聊天secret */
    // export var yimSecret: string | undefined;

    // /**分享资源地址 */
    // export var sharedUrl: string | undefined;

    // /**是否关闭分享 */
    // export var closeShare: boolean | undefined;

    // /**是否显示更新提示 */
    // export var showUpdateTips: boolean | undefined;

    // /**转端活动是否开启 */
    // export var openZdAct: boolean | undefined;
}