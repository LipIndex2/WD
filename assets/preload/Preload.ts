import { assetManager, Component, director, _decorator } from 'cc';
import { ReportManager, ReportType } from '../script/proload/ReportManager';
import { PackageData, param_List, server_Info, server_List_Info, url_parm, version_Info } from './PkgData';
import { PreloadToolFuncs } from './PreloadToolFuncs';
import { Debugger } from 'core/Debugger';
import { Language } from 'modules/common/Language';
import { TimeCtrl } from 'modules/time/TimeCtrl';
const { ccclass } = _decorator;

@ccclass('Preload')
export class Preload extends Component {
    protected _reconnectTimer: any = null;
    protected _reconnectTimes: number = 0;

    start() {
        Debugger.init();
        // console.error("!!!!!!Preload=====!!!!!!!!!!!");
        this._reconnectTimes = 5
        PackageData.Inst().init();
        // this.requestQueryData()

        this.getLocalServerResp();

        // console.error("!!!!!!Preload=====!!!!!!!!!!!END!!===========");
    }

    private getLocalServerResp() {
        let paramList: param_List = {
            'client_ip': '127.0.0.1',
            'update_package': '0',
            'config_url': "http://192.168.51.188/query2.php",
            'update_url': '',
            'upload_url': "http://192.168.51.188/",
            'report_url': "http://192.168.51.188/report.php",
            'report_url2': "http://192.168.51.188/report.php",
            'verify_url': "http://192.168.51.188/login_verify.php",
            'verify_url2': "http://192.168.51.188/login_verify.php",
            'event_url': "http://192.168.51.188/report_event.php",
            'pay_event_url': "http://192.168.51.188/report_event.php",
            'gm_report_url': "http://192.168.51.188/report",
            'gift_fetch_url': "http://192.168.51.188/use_card.php",
            // 'notice_query_url': "http://192.168.51.188/fetch_info.php",
            // 'notice_query_url2': "http://192.168.51.188/fetch_notice_content.php",
            'switch_list': {
                'update_package': false,
                'update_assets': true,
                'audit_version': false,
                'log_print': true,
                'error_screen': false,
                'testin_report': true,
                'countly_report': true,
                'open_chongzhi': true,
                'open_gm': true,
                'qqvip_gift': true,
            }
        };

        let versionInfo: version_Info = {
            'package_info': {
                'version': '',
                'name': '',
                'desc': '',
                'url': '',
                'size': 0,
                'md5': '',
                'msg': '',
            },
            'assets_info': {
                'resources': '',
                'res': '',
                'version': '1.0',
            },
            'assets_info_white': {
                'resources': '',
                'res': '',
                'version': '1.0',
            },
            'update_data': '',
        };

        let time = new Date().getTime() / 1000;

        let serverInfo: server_Info = {
            'last_server': 1,
            'server_time': time,
            'server_list': [],
            'spid': PackageData.Inst().getSpid(),
        };
        let serverTmp: server_List_Info = {
            'id': 1,
            'name': '测试区',
            'ip': '139.155.129.88',
            'port': 60510,
            'open_time': time,
            'ahead_time': 5 * 60,
            'flag': 2,
            'avatar': "1",
            'role_name': 'xxx',
            'role_level': 10,
            fsid: 0,
            noHeandIp: '',
        };
        serverInfo.server_list.push(serverTmp);

        let resp: url_parm = {
            param_list: paramList,
            server_info: serverInfo,
            version_info: versionInfo,
            white_flag: 1,
        };

        this.requestCallBack(0, resp);
    }

    private requestQueryData() {
        ReportManager.Inst().sendPoint(ReportType.loading);
        let url = PackageData.Inst().query_url;
        // console.error(`${url}`);
        PreloadToolFuncs.HttpGetJson(url, this.requestCallBack.bind(this));
    }

    private requestCallBack(statusCode: number, resp: url_parm | null) {
        // console.error(`${statusCode},${respText}`);
        // console.table(resp);
        // ReportManager.Inst().sendPoint(ReportType.endQuery);
        clearTimeout(this._reconnectTimer)
        if (-1 != statusCode && null != resp) {
            PackageData.Inst().setQueryData(resp);
            this.requestOnComplete();
        } else if (this._reconnectTimes > 0) {
            this._reconnectTimes--
            this._reconnectTimer = setTimeout(() => {
                this.requestQueryData();
            }, 0.5);
        } else {
            let MainAgent = (window as any)['MainAgent'];
            if (MainAgent) {
                // this.MainAgent.wxModal(title, content, confirm_func, cancel_func, showCancel, confirmText, cancelText);
                MainAgent.wxModal(Language.Login.Tip, Language.Login.NetCloseTip, () => {
                    MainAgent.exitMiniProgram()
                }, null, false);
            }
        }
    }

    private requestOnComplete() {
        let queData = PackageData.Inst().getQueryData();
        if (queData.param_list && queData.param_list.chang_res) {
            PackageData.Inst().setChangRes(JSON.parse(queData.param_list.chang_res))
        }
        PreloadToolFuncs.reportGameStart2();
        if (PackageData.Inst().getHotUpdate()) {
            let funcName = 'SetRemoteBundleInfo'
            let setRemoteBundleInfo = (window as any)[funcName];
            if (setRemoteBundleInfo) {
                if (queData && queData.param_list && queData.param_list.update_url &&
                    queData.version_info && queData.version_info.assets_info) {
                    setRemoteBundleInfo(queData.param_list.update_url, queData.version_info.assets_info);
                }
                else {
                    console.error('Hotupdate SetRemoteBundleInfo ERROR,query data Exception');
                }
            }
            else {
                console.error(`Open hotupdate ERROR,function [${funcName}] not in windows!`);
            }
        }

        assetManager.loadBundle("resources", (err, bundle) => {
            if (err) {
                console.error(`Load Resources Bundle ERROR:${err}`);
            }
            else {
                director.loadScene("Game");
            }
        })
    }
}