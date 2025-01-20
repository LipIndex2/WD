import { Singleton } from "core/Singleton";
import { LoginData } from "modules/login/LoginData";
import { PackageData } from "preload/PkgData";
import { Base64 } from "../helpers/Base64";
import { HTTP } from "../helpers/HttpHelper";
import { VERSION, sys } from "cc";
import { PreloadToolFuncs } from "preload/PreloadToolFuncs";
import { LocalStorageHelper } from "../helpers/LocalStorageHelper";


export class ReportManager extends Singleton {

    _loginTime: number;
    private reportOnce: { [key: string]: number }
    public sendPoint(type: ReportType, param: any = [], onceID?: string) {
        return;
        if (onceID) {
            if (!this.reportOnce) {
                let str_reportOnce = LocalStorageHelper.PrefsString(LocalStorageHelper.ReportOnce())
                let obj_reportOnce;
                if (str_reportOnce) {
                    obj_reportOnce = JSON.parse(str_reportOnce);
                }
                if (obj_reportOnce) {
                    this.reportOnce = obj_reportOnce;
                } else {
                    this.reportOnce = {};
                }
            }
            if (this.reportOnce[onceID]) {
                return
            } else {
                this.reportOnce[onceID] = 1;
                LocalStorageHelper.PrefsString(LocalStorageHelper.ReportOnce(), JSON.stringify(this.reportOnce))
            }
        }
        let UrlParm = LoginData.GetUrlParm();
        if (!UrlParm)
            return;
        let data = this.getHttpParam(type, param);
        let url: string = UrlParm.param_list.report_url + "?data=" + Base64.encode(data);
        // // console.log("上报url：" + url)
        HTTP.GetJson(url);
    }

    private getHttpParam(type: ReportType, param: string[] = []) {
        let agent_id = PackageData.Inst().getSpid();
        if (agent_id == null)
            agent_id = PackageData.Inst().getPackage_spid();
        let PhomeUniqueid = PackageData.Inst().getDevice();
        let packageVersion = PackageData.Inst().getPkg();//4.包版本号
        let sourceVersion = LoginData.GetUrlParm() ? LoginData.GetUrlParm().version_info.assets_info.version : 0;
        sourceVersion = sourceVersion ? sourceVersion : PackageData.Inst().getVersion()
        let session_id = 0;

        let loginTime = this.getLoginTime();
        let netState = 1;
        let currentTime = Math.floor(new Date().getTime() / 1000);
        let imea = PackageData.Inst().getIMEA();
        let channelID = PackageData.Inst().getPlatSpid() ? PackageData.Inst().getPlatSpid() : 0;;

        let params = [
            //     	1 					2 					3
            type.toString(), agent_id.toString(), PhomeUniqueid.toString(),
            //4 							   5 			   				6 				  			7 			  				8 		            9
            packageVersion.toString(), sourceVersion.toString(), session_id.toString(), loginTime.toString(), netState.toString(), currentTime.toString(),
            //10 					   11 			         
            imea.toString(), channelID.toString()
        ];
        for (let i = 0; i < param.length; i++) {
            params.push(param[i].toString());
        }
        let str = "";
        for (let i = 0; i < params.length; i++) {
            str += params[i];
            if (i != params.length - 1) {
                str += "\t";
            }
        }
        // console.log("埋点内容：", params);
        return str;
    }

    private getLoginTime() {
        if (!this._loginTime) {
            this._loginTime = Math.floor(new Date().getTime() / 1000);
        }
        return this._loginTime;
    }

    /**
     * 大数据上报  自动设置参数只需填Report2Type里的 p_
     * @param params ID  设备型号：model
     */
    public reportGameStart2(params: string[]) {
        //{/**事件ID */ ID: string,/**设备 */ model?: string, /**系统 */ system?: string }
        let pkgData = PackageData.Inst().getQueryData();
        let url_rep2 = pkgData.param_list.report_url2;

        if (url_rep2 && url_rep2 != "") {
            let system = "";
            let model = ""; // let queData = PackageData.Inst().getQueryData();

            if (sys.platform == sys.Platform.WECHAT_GAME || sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
                let wx = PreloadToolFuncs.wx;

                if (wx) {
                    let sysinfo = wx.getSystemInfoSync();
                    system = sysinfo.system;
                    model = sysinfo.model;
                }
            } else {
                system = sys.os;
                model = sys.platform;
            }

            // let params = [
            //     //12 客户端事件ID 操作系统 设备型号 设备ID 引擎版本 资源版本
            //     "12", "100", system, model, PackageData.Inst().getDevice(), VERSION, PackageData.Inst().getQueryData().version_info.assets_info.resources
            // ];
            let str = "";
            params.forEach(element => {
                if (element === Report2Type.p_model) {
                    element = model;
                } else if (element === Report2Type.p_system) {
                    element = system;
                }
                if (str != "") {
                    str += "\t";
                }
                str += element;
            });
            let url = url_rep2 + "?data=" + PreloadToolFuncs.Base64Encode(str);
            PreloadToolFuncs.HttpGetJson(url);
        }
    }
}

export let Report2Type = {
    /**进入游戏 */
    ID_12: "12",

    /**主线任务 */
    ID_13: "13",
    p_model: "model",
    p_system: "system"
}
export enum ReportType {
    loading = 10,			    //进度条加载中
    openGame = 100,			//游戏启动
    beginQuery = 160,         //query开始
    endQuery = 180,           //query结束
    beginLoadConfig = 200,	//获取配置开始
    endLoadConfig = 300,		//获取配置结束
    beginUpdataSource = 400,	//更新资源开始
    endUpdataSource = 500,	//更新资源结束
    beginLogin = 600,			//登录验证开始
    endLogin = 700, 			//登录验证结束
    beginConnectServer = 800, //连接服务器开始
    endConnectServer = 900,	//连接服务器结束
    beginCreateRole = 1000,	//创建角色开始
    endCreateRole = 1100,		//创建角色结束
    roleLogin = 1200,         //角色登录
    ConnectServerFail = 1300, //连接服务器失败
    beginGame = 2000,			//开始游戏
    scoket = 2100,			//心跳 等级变化
    gameModelInfo = 3000      //游戏模块信息上报    
}