import { sys } from "cc";
import { CfgFunOpen } from "config/CfgFunOpen";
import { HandleCollector } from "core/HandleCollector";
import { SMDHandle } from "data/HandleCollectorCfg";
import { ViewManager } from "manager/ViewManager";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { ActivityData } from 'modules/activity/ActivityData';
import { BaseCtrl } from "modules/common/BaseCtrl";
import { CommonEvent } from "modules/common/CommonEvent";
import { EventCtrl } from "modules/common/EventCtrl";
import { LoginData } from "modules/login/LoginData";
import { MainFBData } from 'modules/main_fb/MainFBData';
import { RoleData } from "modules/role/RoleData";
import { Timer } from 'modules/time/Timer';
import { PackageData } from "preload/PkgData";
import { FunUnlockView } from "./FunUnlockView";
import { CfgAgentAdapt } from "config/CfgAgentAdapt";

export class FunOpen extends BaseCtrl {

    protected handleCollector: HandleCollector;

    private static audit_check: { [key: number]: number } = {
        1: 0,
        /**战斗结算首充提示 */
        2: 0,
        100000: 0,
        // 52000: 0,
        12000: 0,
        53000: 0,
        54000: 0,
        7000: 0,
        50000: 0,
        51000: 0,
        56000: 0,
        57000: 0,
        63000: 0,
        60000: 0,
        65000: 0,
        // 101000:0,
        102000: 0,
        104000: 0,
        111000: 0,
        110000: 0,
        106000: 0,
        120000: 0,
        115000: 0,
        11402: 0,
    }

    private shield_check: Map<number, number> = new Map()

    checkOpenFuncs: Map<number | string, Function> = new Map<number | string, Function>();
    checkOpenFuncs2: Map<number | string, Function> = new Map<number | string, Function>();
    openedMap: Map<number | string, boolean> = new Map<number | string, boolean>();
    firstCheck: boolean = false
    private timer_handle: any = null;

    initCtrl() {
        this.handleCollector = HandleCollector.Create();
        this.checkOpenFuncs.clear();
        this.openedMap.clear();
        this.AddSmartDataCare(RoleData.Inst().ResultData, this.OnFunOpenChange.bind(this), "FlushRoleInfo")
        EventCtrl.Inst().on(CommonEvent.FIRST_GET_SEVER_TIME, this.ShieldCheck, this, true);
        EventCtrl.Inst().on(CommonEvent.FIRST_GET_SEVER_TIME, this.OnFunOpenChange, this, true);
    }

    //注册检查方法
    public RgCheckFunc(key: number | string, func: Function) {
        if (!this.checkOpenFuncs.has(key)) {
            this.checkOpenFuncs.set(key, func);
        }
    }
    //删除检查
    public ClearRgFunc(key: number | string) {
        this.checkOpenFuncs.delete(key)
    }
    public AddSmartDataCare(smdata: any, callback: Function, ...keys: string[]) {
        var handle = SMDHandle.Create(smdata, callback, ...keys)
        this.handleCollector.Add(handle);
    }
    public RemoveSmartDataCare() {
        HandleCollector.Destory(this.handleCollector);
        this.handleCollector = null;
    }
    protected onDestroy(): void {
        this.RemoveSmartDataCare()
    }

    ShieldCheck() {
        let spid = PackageData.Inst().getPackage_spid()
        this.shield_check.clear()
        let co = CfgAgentAdapt.agent_adapt.find((cfg) => cfg.spid == spid)
        if (co) {
            if (!co.yxq_xs) {
                this.shield_check.set(5001, 0)
            }
            if (!co.yqhy_xs) {
                this.shield_check.set(13000, 0)
            }
        }
    }

    GetFunIsOpen(key: number | string) {
        let result = { is_open: true, content: "" }
        let cfg = this.GetFunOpenModCfg(key);
        if (key && cfg) {
            let lv = RoleData.Inst().InfoRoleLevel;
            let isBarrier = this.IsBarrierPass(cfg.open_barrier);
            if (lv < cfg.open_level) {
                result.is_open = false
            }
            if (!isBarrier) {
                result.is_open = false
            }
        }
        let isShield = this.checkShield(+key);
        if (!isShield) {
            result.is_open = false
        } else {
            let isAudit = this.checkAudit(+key);
            if (!isAudit) {
                result.is_open = false
            }
        }
        return result
    }

    IsBarrierPass(barrier: number) {
        let Level = RoleData.Inst().InfoMainSceneLevel;
        let round = RoleData.Inst().InfoMainSceneRound;
        if (Level < barrier) {
            return false
        } else if (Level == barrier) {
            let co = MainFBData.Inst().CfgBarrierInfoMainInfo(Level)
            if (co && round < co.round_max) {
                return false
            }
        }
        return true
    }

    GetFunOpenModCfg(key: number | string) {
        if (!key || !CfgFunOpen) return null;
        return CfgFunOpen.funopen.find(cfg => {
            return cfg.client_id == key
        })
    }

    GetFunOpenShowMod() {
        let data = [];
        let id = RoleData.Inst().InfoRoleId;
        let json = sys.localStorage.getItem(id + "FunUnlockView");
        if (json) {
            data = JSON.parse(json);
        }
        return data;
    }

    OnFunOpenViewShow(force = false) {
        if (!force) {
            if (BattleCtrl.Inst().IsBattle() || RoleData.Inst().ShowLevelUp) {
                RoleData.Inst().ShowFunOpen = true
                return
            }
        } else {
            RoleData.Inst().ShowLevelUp = false
        }
        let data = this.GetFunOpenShowMod();
        for (let cfg of CfgFunOpen.funopen) {
            let count_down = ActivityData.Inst().GetCountDown(+cfg.client_id);
            if (count_down) {//时间
                let time = count_down();
                if (time <= 0) continue;
            }
            let isOpen = this.GetFunIsOpen(cfg.client_id);
            if (cfg.interface && isOpen.is_open && data.indexOf(cfg.client_id) == -1) {
                //ViewManager.Inst().OpenView(FunUnlockView, cfg)
                return;
            }
        }
    }

    OnFunOpenViewChange(modKey: number) {
        Timer.Inst().CancelTimer(this.timer_handle)
        this.timer_handle = Timer.Inst().AddRunTimer(() => {
            this.OnFunOpenViewShow();
        }, 0.5, 1, false)
        let id = RoleData.Inst().InfoRoleId;
        let data = this.GetFunOpenShowMod();
        data.push(modKey);
        sys.localStorage.setItem(id + "FunUnlockView", JSON.stringify(data));
    }

    OnFunOpenChange() {
        let result
        this.checkOpenFuncs.forEach((func, key) => {
            result = this.GetFunIsOpen(key)
            func.call(func, key, result.is_open)
        });
        this.checkOpenFuncs2.forEach((func, key) => {
            result = this.GetFunIsOpen(key)
            func.call(func, key, result.is_open)
        });
    }

    checkShield(mod = 0) {
        if (this.shield_check.has(mod)) {
            return false
        }
        return true
    }

    /**
     * 审核服下屏蔽内容
     * @param mod 模块ID
     * @returns ture: 显示 false：屏蔽显示
     */
    checkAudit(mod = 0) {
        if (LoginData.GetUrlParm() && !PackageData.Inst().getIsDebug()) {
            let audit: boolean
            if (sys.platform == sys.Platform.WECHAT_GAME || sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
                audit = LoginData.GetUrlParm().param_list.switch_list.wx_audit_version
            } else {
                audit = LoginData.GetUrlParm().param_list.switch_list.audit_version
            }
            if (audit) {
                if (FunOpen.audit_check[mod] != undefined) {
                    return FunOpen.audit_check[mod]
                }
            }
        }
        return true
    }

}