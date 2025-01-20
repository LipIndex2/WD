import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { CfgWordDes } from "config/CfgWordDes";
import { LoginData } from "modules/login/LoginData";
import { PackageData } from "preload/PkgData";
import { HTTP } from "../../helpers/HttpHelper";
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';

class UsertServeFlushData {
    @smartdata
    user_protocol_change: boolean;
}

export class SettingUsertServeData extends DataBase {
    public FlushlData: UsertServeFlushData;
    private rspUserProtocol: any;
    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        let self = this;
        self.FlushlData = CreateSMD(UsertServeFlushData);
    }

    public GetWordDes(id: number) {
        let cfg = CfgWordDes.word.find(cfg => {
            return cfg.index == id;
        })
        if (cfg)
            return cfg
        else {
            return {
                id: -1,
                name: "",
                word: ""
            }
        }
    }

    public SetLoginUserProtocol(data: any) {
        this.rspUserProtocol = data;
        this.FlushlData.user_protocol_change = !this.FlushlData.user_protocol_change;
    }

    public get userInfo() {
        if (!this.rspUserProtocol) {
            this.RequestUserProtocol();
        }
        return this.rspUserProtocol;
    }

    public GetLoginUserProtocol(type: number) {
        if (type == 1) {
            let pkg = PackageData.Inst().getQueryData()
            if (pkg.param_list.publish_info && pkg.param_list.publish_info.customer_gm) {
                return pkg.param_list.publish_info.customer_gm.wx_id;
            }
        } else if (type == 2) {
            return this.userInfo ? this.userInfo.user_agree_content : "";
        } else if (type == 3) {
            return this.userInfo ? this.userInfo.content : "";
        } else {
            let cfg = this.GetWordDes(type);
            if (cfg)
                return cfg.word;
            else
                return "";
        }
    }

    //请求隐私政策
    public RequestUserProtocol() {
        let self = this;
        let pkgData = PackageData.Inst().getQueryData()
        let serverInfo = LoginData.Inst().GetServerInfo();
        if (!serverInfo || !pkgData) return
        HTTP.GetJson(pkgData.param_list.user_protocol_url + "?spid=" + serverInfo.spid, (statusCode: number, resp: any | null, respText: string) => {
            if (resp) {
                self.SetLoginUserProtocol(resp.data[0])
            }
        })
    }

}


