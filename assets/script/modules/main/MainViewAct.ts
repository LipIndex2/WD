import { SavingPotData } from 'modules/SavingPot/SavingPotData';

import { HandleCollector } from "core/HandleCollector";
import { ObjectPool } from "core/ObjectPool";
import { RemindGroupMonitor, SMDHandle } from "data/HandleCollectorCfg";
import * as fgui from "fairygui-cc";
import { ModManger } from "manager/ModManger";
import { ActivityData } from "modules/activity/ActivityData";
import { BaseItemGB } from "modules/common/BaseItem";
import { COLORS } from "modules/common/ColorEnum";
import { Mod } from "modules/common/ModuleDefine";
import { RedPoint } from "modules/extends/RedPoint";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { RemindCtrl } from "modules/remind/RemindCtrl";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";
import { UH } from "../../helpers/UIHelper";
import { ActivityAdvertisingData } from 'modules/ActivityAdvertising/ActivityAdvertisingData';
import { ICON_TYPE } from 'modules/common/CommonEnum';
import { GeneOrientationData } from 'modules/GeneOrientation/GeneOrientationData';
import { TimeCtrl } from 'modules/time/TimeCtrl';
import { WECHAT } from 'cc/env';
import { ChannelAgent } from '../../proload/ChannelAgent';
import { RoleData } from 'modules/role/RoleData';
import { Timer } from 'modules/time/Timer';
import { onDestroy } from '../../../../FairyGUIPrj/plugins/ClientTools/main';
import { ViewManager } from 'manager/ViewManager';
import { MainView } from './MainView';
import { EventCtrl } from 'modules/common/EventCtrl';
import { CommonEvent } from 'modules/common/CommonEvent';
import { LoginView } from 'modules/login/LoginView';

export class MainViewActItem extends BaseItemGB {
    protected viewNode = {
        bg: <fgui.GImage>null,
        icon: <fgui.GLoader>null,
        timer: <TimeMeter>null,
        RedPointShow: <RedPoint>null,
        GpBubble: <fgui.GGroup>null,
        NumShow: <fgui.GTextField>null,
        UISpineShow: <UISpineShow>null,
        title: <fgui.GTextField>null,
    };
    // private spShow: UISpineShow = undefined;
    private rand_data = ActivityData.Inst();
    private handleCollector: HandleCollector;

    /**微信游戏圈按钮 */
    // private wx_gameGroup: { show: Function, destroy: Function, hide: Function }
    public SetData(data: any) {
        if (!data) return
        super.SetData(data)
        this.data = data;
        if (this.handleCollector) {
            this.handleCollector.RemoveAll()
        } else {
            this.handleCollector = HandleCollector.Create();
        }
        this.addSmartDataCare(SavingPotData.Inst().ResultData, this.SavingPotShow.bind(this), "SavingPotInfoFlush");

        this.viewNode.timer.SetCallBack(this.CheckRandOpenData.bind(this));

        UH.SetText(this.viewNode.title, data.text);

        this.viewNode.icon.visible = false;

        let effectPath
        let stamp = ActivityAdvertisingData.Inst().GetTimeStampData(data.act_id);
        if (stamp && stamp.main_icon) {
            effectPath = `xianshihuodong_TB/${stamp.main_icon}/${stamp.main_icon}`;
        } else {
            effectPath = data.over_special_effect_id;
        }
        if (effectPath) {
            this.viewNode.UISpineShow.LoadSpine(ResPath.Spine(effectPath), true);
        } else {
            UH.SetIcon(this.viewNode.icon, data.icon || "TuBiaoLiBao", ICON_TYPE.ACT)
            this.viewNode.icon.visible = true;
            this.viewNode.UISpineShow.onDestroy();
        }
        let mod = this.ModKey();

        // if (this.wx_gameGroup) {
        //     this.wx_gameGroup.destroy();
        //     this.wx_gameGroup = undefined;
        // }
        // EventCtrl.Inst().off(CommonEvent.VIEW_OPEN, this.onCheckViewOpen, this);
        // EventCtrl.Inst().off(CommonEvent.VIEW_CLOSE, this.onCheckViewClose, this);
        // if (mod == Mod.MainOther.WeChatGameHub) {
        //     EventCtrl.Inst().on(CommonEvent.VIEW_OPEN, this.onCheckViewOpen, this, false);
        //     EventCtrl.Inst().on(CommonEvent.VIEW_CLOSE, this.onCheckViewClose, this, false);
        //     if (ChannelAgent.wx && WECHAT && !this.wx_gameGroup) {
        //         Timer.Inst().AddRunTimer(() => {
        //             let mod = this.ModKey();
        //             if (ChannelAgent.wx && WECHAT && mod == Mod.MainOther.WeChatGameHub && !this.wx_gameGroup) {
        //                 let btn = this.wx_gameGroup = ChannelAgent.Inst().getWeChatGameHubBtn(this.viewNode.bg);
        //                 if (btn) {
        //                     if (RoleData.Inst().inGame && this.node && this.node.activeInHierarchy && ViewManager.Inst().IsTopView(MainView) && !ViewManager.Inst().IsOpen(LoginView)) {
        //                         btn.show();
        //                     } else {
        //                         btn.hide();
        //                     }
        //                 }
        //             }
        //         }, 1, 0.5, false)
        //     }
        // }

        if (Mod.MainActCollect.Gift == mod || Mod.MainActCollect.activity == mod) {
            this.ActCollectRemind();
        } else {
            this.addRemindCare(data.mod_key, this.viewNode.RedPointShow)
        }

        this.FlushTime();
        this.SavingPotShow();
    }

    private addSmartDataCare(smdata: any, callback: Function, ...keys: string[]) {
        var handle = SMDHandle.Create(smdata, callback, ...keys)
        this.handleCollector.Add(handle);
    };

    SavingPotShow() {
        let mod = this.ModKey();
        if (mod == Mod.SavingPot.View) {
            let num = SavingPotData.Inst().getDiamondShow()
            this.viewNode.GpBubble.visible = true;
            UH.SetText(this.viewNode.NumShow, num);
        } else {
            this.viewNode.GpBubble.visible = false;
        }
    }

    ActCollectRemind() {
        let self = this;
        let actlist = ActivityData.Inst().GetMainActList(this.data.param, 0)
        for (let i = 0; i < actlist.length; i++) {
            let group = ModManger.TabMod(actlist[i].mod_key);
            this.handleCollector.Add(RemindGroupMonitor.Create(group, self.freshActCollectRedPoint.bind(self, actlist)));
        }
    }

    private addRemindCare(mod_key: number, obj: RedPoint) {
        let self = this;
        let group = ModManger.TabMod(mod_key);
        this.handleCollector.Add(RemindGroupMonitor.Create(group, self.freshRedPoint.bind(self, group, obj)));
    }

    private freshRedPoint(group: any, obj: RedPoint) {
        obj.SetNum(RemindCtrl.Inst().GetGroupNum(group));
    }

    private freshActCollectRedPoint(actlist: any[]) {
        let red = 0;
        for (let i = 0; i < actlist.length; i++) {
            let group = ModManger.TabMod(actlist[i].mod_key);
            red += RemindCtrl.Inst().GetGroupNum(group)
        }
        this.viewNode.RedPointShow.SetNum(red);
    }

    CheckRandOpenData() {
        ActivityData.Inst().CheckRandOpenData();
    }

    public FlushTime() {
        this.viewNode.timer.CloseCountDownTime();
        let mod = this.ModKey();
        let count_down = this.rand_data.GetCountDown(mod);
        if (count_down) {
            let time = count_down();
            if (mod == Mod.GeneOrientation.View) {
                //this.data.param.index = this.data.index;
                time = Number(GeneOrientationData.Inst().getEndTime(this.data.index)) - TimeCtrl.Inst().ServerTime;
            }
            this.viewNode.timer.visible = time > 0;
            if (time > 0) {
                this.viewNode.timer.SetOutline(true, COLORS.Brown, 3)
                this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_7);
            }
        } else {
            this.viewNode.timer.visible = false;
        }
    }

    ModKey() {
        return this._data ? this._data.mod_key : 0
    }

    // private onCheckViewOpen() {
    //     let mod = this.ModKey();
    //     if (mod == Mod.MainOther.WeChatGameHub) {
    //         let btn = this.wx_gameGroup;
    //         if (btn && !ViewManager.Inst().IsTopView(MainView))
    //             btn.hide();
    //     }
    // }

    // private onCheckViewClose() {
    //     let mod = this.ModKey();
    //     if (mod == Mod.MainOther.WeChatGameHub) {
    //         let btn = this.wx_gameGroup;
    //         if (btn && ViewManager.Inst().IsTopView(MainView))
    //             btn.show();
    //     }
    // }

    // protected onEnable(): void {
    //     if (this.wx_gameGroup && ViewManager.Inst().IsTopView(MainView)) {
    //         this.wx_gameGroup.show();
    //     }
    // }
    // protected onDisable(): void {
    //     if (this.wx_gameGroup) {
    //         this.wx_gameGroup.hide();
    //     }
    // }

    protected onDestroy(): void {
        super.onDestroy();
        // if (this.spShow) {
        //     ObjectPool.Push(this.spShow);
        //     this.spShow = null;
        // }
        // EventCtrl.Inst().off(CommonEvent.VIEW_OPEN, this.onCheckViewOpen, this);
        // EventCtrl.Inst().off(CommonEvent.VIEW_CLOSE, this.onCheckViewClose, this);
        if (this.handleCollector) {
            HandleCollector.Destory(this.handleCollector);
            this.handleCollector = null;
        }
        this.viewNode.timer.CloseCountDownTime();
        // if (this.wx_gameGroup) {
        //     this.wx_gameGroup.destroy();
        //     this.wx_gameGroup = undefined;
        // }
    }
}