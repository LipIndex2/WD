import { sys } from 'cc';
import { GetCfgValue } from 'config/CfgCommon';
import { ViewManager } from 'manager/ViewManager';
import { Item } from 'modules/bag/ItemData';
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { Language } from 'modules/common/Language';
import { WaitView } from 'modules/login/WaitView';
import { FloatingTextDate } from 'modules/main/FloatingTextData';
import { TimeCtrl } from 'modules/time/TimeCtrl';
import { TYPE_TIMER, Timer } from 'modules/time/Timer';
import { DialogTipsView } from './DialogTipsView';
import { DialogTipsToggle, DialogTipsToggleType } from './PublicPopupData';
import { HelpTipsView } from './HelpTipsView';
import { CfgWordDes } from 'config/CfgWordDes';
import { SettingUsertServeData } from 'modules/setting/SettingUsertServeData';

export class PublicPopupCtrl extends BaseCtrl {
    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCNoticeNum, func: this.onSCNoticeNum },
            { msgType: PB_SCItemNotEnoughNotice, func: this.onSCItemNotEnoughNotice },
            // { msgType: PB_SCSystemMsg, func: this.onSCSystemMsg },
            // { msgType: PB_SCZeroHour, func: this.onSCZeroHou },
            // { msgType: PB_SCCMDChongZhiRetInfo, func: this.onSCCMDChongZhiRetInfo },
        ]
    }

    //系统通知
    private onSCNoticeNum(protocol: PB_SCNoticeNum) {
        if (GetCfgValue(Language.ErrorInfo, protocol.noticeNum)) {
            this.Center(GetCfgValue(Language.ErrorInfo, protocol.noticeNum));
        }
    }

    //物品不足通知
    private onSCItemNotEnoughNotice(data: { itemId: number }) {
        this.ItemNotEnoughNotice(data.itemId);
    }

    public ItemNotEnoughNotice(itemId: number) {
        let name = Item.GetName(itemId);
        let desc = name + Language.Common.NotHasTip;
        PublicPopupCtrl.Inst().Center(desc);
    }

    //系统消息
    private onSCSystemMsg(protocol: PB_SCSystemMsg) {
        // if (RoleData.Inst().GetRoleLevel() < protocol.limitLevel) {
        //     return;
        // }
        console.error(protocol.msg);
    }
    //0点通知
    private onSCZeroHou(protocol: PB_SCZeroHour) {
    }
    //玩家充值返回
    private onSCCMDChongZhiRetInfo(protocol: PB_SCCMDChongZhiRetInfo) {
    }
    //弹出飘字
    public Center(str: string) {
        FloatingTextDate.Inst().AddFloatText({ desc: str });
    }

    public CenterAttr(str: string, arrow: number) {
        FloatingTextDate.Inst().AddFloatText({ desc: str, arrow: arrow });
    }

    public HelpTip(help_tip: number | string, title?: string) {
        if (typeof (help_tip) == "number") {
            let cfg = SettingUsertServeData.Inst().GetWordDes(help_tip);
            if (cfg != null) {
                help_tip = cfg.word;
            } else {
                help_tip = help_tip.toString();
            }
        }
        ViewManager.Inst().OpenView(HelpTipsView, { desc: help_tip, title: title });
    }

    //弹出获取途径
    public GetWay(item_id: number) {
        // GetWayView.OpenWithItem(Item.Create({item_id:item_id}));
    }
    private _ht_ShowWait: TYPE_TIMER
    public ShowWait(desc: string, time = 0) {
        FloatingTextDate.Inst().WaitDesc = desc;
        if (!ViewManager.Inst().IsOpen(WaitView)) {
            ViewManager.Inst().OpenView(WaitView);
        }
        if (this._ht_ShowWait) {
            Timer.Inst().CancelTimer(this._ht_ShowWait);
        }
        if (time) {
            this._ht_ShowWait = Timer.Inst().AddRunTimer(this.HideWait.bind(this), time, 1, false);
        }
    }

    public HideWait() {
        ViewManager.Inst().CloseView(WaitView);
        if (this._ht_ShowWait) {
            Timer.Inst().CancelTimer(this._ht_ShowWait);
            this._ht_ShowWait = undefined;
        }
    }

    public DialogTips(content: string, confirmFunc?: Function, confirmText?: string, titleShow?: string, cancelFunc?: Function, cancelText?: string, toggle?: DialogTipsToggle, isRichtext?: boolean) {
        if (toggle && this.CheckToggle(toggle)) {
            if (confirmFunc) {
                confirmFunc();
            }
            return;
        }
        ViewManager.Inst().OpenView(DialogTipsView, {
            content: content, confirmFunc: confirmFunc, confirmText: confirmText, titleShow: titleShow, cancelFunc: cancelFunc, cancelText: cancelText,
            toggleObj: toggle, isRichtext: isRichtext,
        })
    }

    public DialogTipsAndToggle(content: string, confirmFunc: Function, toggle: DialogTipsToggle) {
        this.DialogTips(content, confirmFunc, null, null, null, null, toggle);
    }

    private CheckToggle(toggle: DialogTipsToggle): boolean {
        let type = toggle.type;
        if (type == DialogTipsToggleType.DayTime) {
            let value = sys.localStorage.getItem(toggle.key);
            if (value == null || value == "") {
                return false;
            }
            let timeMark = Number(value);
            if (Number.isNaN(timeMark)) {
                return false;
            }
            let time = TimeCtrl.Inst().ServerTime;
            if (time <= timeMark) {
                return true;
            }
            this.SetToggle(toggle, false);
        }
        return false;
    }

    SetToggle(toggle: DialogTipsToggle, isOn: boolean) {
        let type = toggle.type;
        if (type == DialogTipsToggleType.DayTime) {
            if (isOn) {
                sys.localStorage.setItem(toggle.key, TimeCtrl.Inst().tomorrowStarTime.toString());
            } else {
                sys.localStorage.setItem(toggle.key, "");
            }
        }
    }
}