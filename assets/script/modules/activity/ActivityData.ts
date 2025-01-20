import { CfgActivityMain } from './../../config/CfgActivityMain';
import { FunOpen } from 'modules/FunUnlock/FunOpen';
import { LogError } from 'core/Debugger';
import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { LocalStorageHelper } from "../../helpers/LocalStorageHelper";
import { ACTIVITY_TYPE, ActStatusType } from "./ActivityEnum";
import { HandleBase, HandleCollector } from 'core/HandleCollector';
import { SMDHandle } from 'data/HandleCollectorCfg';
import { CfgRandactivityopen } from 'config/CfgRandactivityopen';
import { TimeCtrl } from 'modules/time/TimeCtrl';
import { Timer } from 'modules/time/Timer';
import { ViewManager } from 'manager/ViewManager';
import { GeneGiftFlushData, GeneOrientationData } from 'modules/GeneOrientation/GeneOrientationData';
import { Mod } from 'modules/common/ModuleDefine';
import { sys } from 'cc';
import { PreloadToolFuncs } from 'preload/PreloadToolFuncs';
import { DEBUG } from 'cc/env';
import { GAME_PLANT } from 'preload/PkgData';

export class ActivityResultData {
    @smartdata
    is_activity_status_change: boolean;//当前激活活动变化[用于活动列表监听]
}

export class ActivityData extends DataBase {
    public result_data: ActivityResultData;
    public activity_status_list: { [act_type: number]: PB_SCActivityStatus } = {};
    private activity_count_down_list: { [mod_key: number]: Function };
    private register_list: { [mod_key: number]: Function };
    private origin_list: { [mod_key: number]: any };
    private rand_list: { [mod_key: number]: any };
    private activity_status_event: { [mod_key: number]: any };
    private origin_handle: { [mod_key: number]: HandleBase };
    private handleCollector: HandleCollector;

    constructor() {
        super();
        this.createSmartData();
        this.InitActivityRandData();
    }

    public InitActivityRandData() {
        this.activity_count_down_list = {};
        this.register_list = {};
        this.origin_list = {};
        this.origin_handle = {};
        this.rand_list = {};
        this.activity_status_event = {};
        this.handleCollector = HandleCollector.Create();
    }

    public get ResuleData() {
        return this.result_data;
    }
    private createSmartData() {
        let self = this;
        self.result_data = CreateSMD(ActivityResultData);
    }

    public SetActivityStatus(protocol: PB_SCActivityStatus) {
        this.CheckActivityStatusChange(protocol);
        this.activity_status_list[protocol.activityType] = protocol;
        this.CheckStatusTimer();
    }

    //检查当前激活活动是否变化
    private CheckActivityStatusChange(protocol: PB_SCActivityStatus) {
        if (!this.activity_status_list[protocol.activityType]) return
        if (this.activity_status_list[protocol.activityType] && this.activity_status_list[protocol.activityType].status == protocol.status)
            return;
        if (protocol.status == ActStatusType.Close) {
            ActivityData.Inst().OpenClose(protocol.activityType);
        };
        this.CheckRandOpenData();
    }

    /** 
     * 活动状态改变倒计时[发请求给服务端，更新客户端内数据]
     * 取 [活动切换状态时间,明日0点] 最小值
    */
    private check_act_status_ht: any;
    public CheckStatusTimer() {
        let temp_time;
        let cur_time = TimeCtrl.Inst().ServerTime;
        for (let key in this.activity_status_list) {
            let act_next_time = this.activity_status_list[key].nextStatusSwitchTime;
            if (act_next_time > cur_time && (!temp_time || act_next_time < temp_time)) {
                temp_time = act_next_time;
            }
        }
        if (this.check_act_status_ht) {
            Timer.Inst().CancelTimer(this.check_act_status_ht);
            this.check_act_status_ht = null;
        }
        if (!temp_time)
            return;
        let time = Math.min(temp_time, TimeCtrl.Inst().tomorrowStarTime) - cur_time + 1;
        Timer.Inst().AddRunTimer(() => {
            TimeCtrl.Inst().sendTimeReq();
            Timer.Inst().CancelTimer(this.check_act_status_ht);
            this.check_act_status_ht = null;
            this.CheckStatusTimer();
        }, time, 1, false)
    }

    // 主界面随机活动图标强制手动刷新
    public CheckRandOpenData() {
        this.result_data.is_activity_status_change = !this.result_data.is_activity_status_change;
    }

    //获取活动状态
    public GetActivityStatus(act_type: ACTIVITY_TYPE): ActStatusType {
        let status_info = this.GetActivityStatusInfo(act_type);
        if (!status_info)
            return ActStatusType.Close;
        return status_info.status;
    }

    //活动状态是否开启
    public IsOpen(act_type: ACTIVITY_TYPE): boolean {
        let isOpen = false;
        if (this.GetActivityStatus(act_type) == ActStatusType.Open) {
            isOpen = true;
        }
        return isOpen;
    }

    //活动打开或者关闭 switch = true  打开 false 关闭
    public OpenClose(act_type: number) {
        let config = this.GetConfig(act_type);
        if (config && config.act_id && ViewManager.Inst().IsOpenByKey(config.mod_key)) {
            ViewManager.Inst().CloseViewByKey(config.mod_key);
        }
    }

    public GetConfig(act_type: number) {
        return CfgActivityMain.main_activity.find(cfg => {
            return cfg.act_id == act_type
        })
    }

    public GetActListCfg(type: number, location: number) {
        return CfgActivityMain.main_activity.filter(cfg => {
            return cfg.gather_icon == type && cfg.icon_location == location
        })
    }

    public GetMainActList(type: number, location: number) {
        let cfg = CfgActivityMain.main_activity.filter(cfg => {
            return cfg.gather_icon == type && cfg.icon_location == location
        })
        let list = this.MainActOpen(cfg);
        return list
    }

    public MainActOpen(mainAct: any[]): any {
        let data = [];
        // let funOpenShow = FunOpen.Inst().GetFunOpenShowMod();
        for (let i = 0; i < mainAct.length; i++) {
            let isOpen = this.ActfunOpen(mainAct[i].mod_key, mainAct[i].act_id);
            this.rand_list[mainAct[i].mod_key] = mainAct[i];
            this.activity_status_event[mainAct[i].mod_key] = { isOpen: isOpen, act_type: mainAct[i].act_id };
            // if (mainAct[i].NoFunViewShow && funOpenShow.indexOf(mainAct[i].mod_key) == -1) continue;
            if (!mainAct[i].is_open) continue
            if (isOpen) {
                if (mainAct[i].mod_key == 70001 || mainAct[i].mod_key == 70002) {
                    let list = this.GetMainActList(mainAct[i].param, 0)
                    if (list.length > 1) {
                        data.push(mainAct[i]);
                    } else if (list.length == 1) {
                        data.push(list[0])
                    }
                } else if (mainAct[i].mod_key == 110000) {
                    let geneData = GeneOrientationData.Inst().Info;
                    for (let ind = 0; ind < geneData.giftEndTime.length; ind++) {
                        let eTime = geneData.giftEndTime[ind];
                        if (Number(eTime) > TimeCtrl.Inst().ServerTime) {
                            let act = JSON.parse(JSON.stringify(mainAct[i]))
                            act.index = ind
                            data.push(act);
                        }
                    }
                } else if (mainAct[i].mod_key == Mod.MainOther.WeChatGameHub) {
                    if ((sys.platform == sys.Platform.WECHAT_GAME && PreloadToolFuncs.wx) || DEBUG) {
                        data.push(mainAct[i]);
                    }
                } else if (mainAct[i].mod_key == Mod.AddDesktop.View) {
                    if ((GAME_PLANT.DOUYIN && PreloadToolFuncs.wx) || DEBUG) {
                        data.push(mainAct[i]);
                    }
                } else {
                    data.push(mainAct[i]);
                }
            }

        }
        return data;
    }


    public ActfunOpen(modkey: number, actType?: number) {
        let is_funOpen = FunOpen.Inst().GetFunIsOpen(modkey);
        if (!is_funOpen.is_open) {
            return false;
        }

        if (actType) {//活动
            let is_actOpen = this.IsOpen(actType);
            if (!is_actOpen) {
                return false;
            }
        }

        let count_down = this.GetCountDown(modkey)
        if (count_down) {//时间
            let time = count_down();
            if (time <= 0) {
                return false;
            }
        }

        let is_open = this.GetRegisterOpen(modkey);
        if (!is_open) {
            return false;
        }

        return true;
    }

    //下一次的开启时间
    GetStartTimeCfg(act_type: ACTIVITY_TYPE) {
        let time = TimeCtrl.Inst().ServerTime;
        let cfg = CfgRandactivityopen.base_on_day_cfg.filter(cfg => {
            return cfg.activity_type == act_type
        })
        for (let i = 0; i < cfg.length; i++) {
            let beginDay = cfg[i].begin_day.split("_");
            let endDay = cfg[i - 1] ? cfg[i - 1].end_day.split("_") : [];
            let start = new Date(+beginDay[0], +beginDay[1] - 1, +beginDay[2]).getTime() / 1000
            let end = endDay.length > 0 ? new Date(+endDay[0], +endDay[1] - 1, +endDay[2]).getTime() / 1000 : 0
            if (time <= start && time >= end) {
                return cfg[i];
            }
        }
        return null
    }

    //获取活动开启时间戳
    public GetStartStampTime(act_type: ACTIVITY_TYPE): number {
        let act_info = this.GetActivityStatusInfo(act_type)
        return act_info ? act_info.param_1 : 0;
    }

    //获取活动结束时间戳
    public GetEndStampTime(act_type: ACTIVITY_TYPE) {
        let act_info = this.GetActivityStatusInfo(act_type);
        return act_info ? act_info.param_2 : 0;
    }

    //获取活动信息 活动状态接口
    public GetActivityStatusInfo(act_type: ACTIVITY_TYPE) {
        return this.activity_status_list[act_type];
    }

    //设置活动自己的提醒方式[存本地]
    public SetRemind(act_type: number, value: number) {
        LocalStorageHelper.PrefsInt(LocalStorageHelper.ActivityIsRemind(act_type), value);
    }

    //获取活动自己的提醒方式
    public GetRemind(act_type: number) {
        return LocalStorageHelper.PrefsInt(LocalStorageHelper.ActivityIsRemind(act_type));
    }

    //注册主界面活动按钮下面倒计时 Time
    public RegisterCountDown(mod_key: number, func: Function) {
        this.activity_count_down_list[mod_key] = func;
    }

    public GetCountDown(mod_key: number) {
        return this.activity_count_down_list[mod_key];
    }

    public GetRegisterOpen(mod_key: number) {
        let open_func = this.register_list[mod_key];
        if (open_func) {
            return open_func();
        }
        return true;
    }

    //获取活动入口按钮列表
    public GetActBtnList(type: number) {
        let open_list: any[] = [];
        for (let key in this.rand_list) {
            let value = this.rand_list[key];
            if (type == value.type) {
                open_list.push(value);
            }
        }
        return open_list;
    }

    //外部注册自己的图标解锁条件
    public Register(modkey: number, check_func: Function, origin?: any) {
        if (this.register_list[modkey] == null && check_func) {
            this.register_list[modkey] = check_func;
        }
        if (this.origin_list[modkey] == null && origin) {
            this.origin_list[modkey] = origin;
        }
        this.RegisterCare(modkey, this.CheckBtn.bind(this, modkey))
    }

    //注册单个活动监听方式
    private RegisterCare(modkey: number, func: Function) {
        let handle = SMDHandle.Create(this.origin_list[modkey], func);
        this.origin_handle[modkey] = handle;
        this.handleCollector.KeyAdd(modkey + "", handle);
        return handle;
    }

    private CheckBtn(mod_key: number) {
        let old = this.activity_status_event[mod_key];
        if (old) {
            let newStatus = this.ActfunOpen(mod_key, old.act_type);
            if (old.isOpen != newStatus) {
                this.CheckRandOpenData();
            }
        }

    }
}
