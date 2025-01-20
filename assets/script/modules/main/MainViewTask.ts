import { TrafficPermitData } from 'modules/TrafficPermit/TrafficPermitData';

import { GetCfgValue } from 'config/CfgCommon';
import { ObjectPool } from 'core/ObjectPool';
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { FunOpen } from 'modules/FunUnlock/FunOpen';
import { MainLevelInfoView } from 'modules/MainLevelInfo/MainLevelInfoView';
import { TrafficPermitView } from "modules/TrafficPermit/TrafficPermitView";
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { BagData } from 'modules/bag/BagData';
import { BaseItemCare, BaseItemGB } from "modules/common/BaseItem";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { RedPoint } from 'modules/extends/RedPoint';
import { MainFBConfig } from 'modules/main_fb/MainFBConfig';
import { MainFBCtrl } from "modules/main_fb/MainFBCtrl";
import { MainFBData } from "modules/main_fb/MainFBData";
import { RoleData } from "modules/role/RoleData";
import { UISpineShow } from 'modules/scene_obj_spine/UISpineShow';
import { ResPath } from 'utils/ResPath';
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { MainTaskRewardView } from './MainTaskRewardView';
import { Mod } from 'modules/common/ModuleDefine';

export class MainViewTask extends BaseItemCare {
    private sp_show: UISpineShow = undefined;
    private sp_show2: UISpineShow = undefined;
    private sp_obj: any = undefined;

    protected viewNode = {
        BgSp: <fgui.GLoader>null,

        BtnReward: <MainViewTaskRewardButton1>null,
        BtnRewardRedPoint: <RedPoint>null,
        ArrowLastRed: <RedPoint>null,
        ArrowNextRed: <RedPoint>null,
        BtnReward1: <MainViewTaskRewardButton2>null,
        BtnReward2: <MainViewTaskRewardButton2>null,
        BtnReward3: <MainViewTaskRewardButton2>null,
        BtnArrowLast: <fgui.GButton>null,
        BtnArrowNext: <fgui.GButton>null,
        BtnLevelInfo: <fgui.GButton>null,

        NameShow: <fgui.GTextField>null,
        RecordShow: <fgui.GTextField>null,

        ProgressShow: <fgui.GProgressBar>null,
    };

    protected onEnable() {
        MainFBData.Inst().SelId = -1
        this.FlushInfo()
    }

    protected onDestroy(): void {
        super.onDestroy();
        if (this.sp_show) {
            ObjectPool.Push(this.sp_show);
            this.sp_show = null;
        }
        if (this.sp_show2) {
            ObjectPool.Push(this.sp_show2);
            this.sp_show2 = null;
        }
    }

    InitData() {
        this.viewNode.BtnReward.onClick(this.OnClickCollectReward, this);
        // this.viewNode.BtnLevelInfo.onClick(this.OnClickLevelInfo, this);
        this.viewNode.BtnArrowLast.onClick(this.OnClickArrowLast.bind(this, 3));
        this.viewNode.BtnArrowNext.onClick(this.OnClickArrowNext.bind(this, 3));

        this.AddSmartDataCare(MainFBData.Inst().FlushData, this.FlushInfo.bind(this), "FlushInfo");
        this.AddSmartDataCare(MainFBData.Inst().FlushData, this.FlushRoleInfo.bind(this), "FlushInfo");
        this.AddSmartDataCare(RoleData.Inst().FlushData, this.FlushRoleInfo.bind(this), "FlushRoleInfo");
        this.AddSmartDataCare(TrafficPermitData.Inst().FlushData, this.FlushTraficRedPoint.bind(this), "FlushInfo");
        this.AddSmartDataCare(BagData.Inst().BagItemData, this.FlushTraficRedPoint.bind(this), "OtherChange")

        // this.sp_show = ObjectPool.Get(UISpineShow, ResPath.Spine("shoujijiangli/shoujijiangli"), true, (obj: any) => {
        //     this.sp_obj = obj
        //     obj.setPosition(290, -89);
        //     this.viewNode.BtnReward._container.insertChild(obj, 1);
        //     this.FlushTraficRedPoint()
        // });

        this.sp_show2 = ObjectPool.Get(UISpineShow, ResPath.Spine("zhujiemianshu/zhujiemianshu"), true, (obj: any) => {
            obj.setPosition(55, -95);
            this.viewNode.BtnLevelInfo._container.insertChild(obj, 1);
        });
    }

    InitUI() {
        this.FlushRoleInfo();
    }

    FlushRoleInfo() {
        // let isOpen = FunOpen.Inst().GetFunIsOpen(Mod.MainLevelInfo.View);
        this.viewNode.BtnLevelInfo.visible = false// isOpen.is_open;

        this.viewNode.BtnReward.visible = false// FunOpen.Inst().checkAudit(1) && TrafficPermitData.Inst().GetIsActiveOver();

    }

    FlushTraficRedPoint() {
        let reward_num = TrafficPermitData.Inst().IsRewardCanGet()
        if (this.sp_obj) {
            this.sp_obj.active = 1 == reward_num
        }
        this.viewNode.BtnRewardRedPoint.SetNum(TrafficPermitData.Inst().IsRewardCanGet());
        // this.viewNode.BtnReward.FlushShow();
    }

    FlushInfo() {
        if (MainFBData.Inst().SelId < 0) {
            MainFBData.Inst().SelId = MainFBData.Inst().GetMainTaskShowLevel()
        }
        let arrow_show_l = false
        let arrow_show_r = false
        this.viewNode.BtnArrowLast.touchable = true
        this.viewNode.BtnArrowNext.touchable = true
        let info = MainFBData.Inst().GetInfoFbInfoByLevel(MainFBData.Inst().SelId)
        if (info) {
            let co = MainFBData.Inst().CfgBarrierInfoMainInfo(info.level)
            if (co) {
                UH.SetIcon(this.viewNode.BgSp, co.barrier_icon, ICON_TYPE.MainFB);
                this.viewNode.ProgressShow.value = info.round
                this.viewNode.ProgressShow.max = co.round_max
                arrow_show_l = co.barrier_id > 1
                arrow_show_r = info.round >= co.round_max && co.barrier_id < MainFBData.Inst().CfgBarrierInfoMainInfoCount()
                this.viewNode.BtnArrowLast.visible = arrow_show_l
                this.viewNode.BtnArrowNext.visible = arrow_show_r
                UH.SetText(this.viewNode.NameShow, `${co.barrier_id}.${co.barrier_name}`)
                UH.SetText(this.viewNode.RecordShow, TextHelper.Format(Language.MainFB.RecordShow, info.round > co.round_max ? co.round_max : info.round))

                let co_items = MainFBData.Inst().CfgBarrierInfoMainItemInfo(co.barrier_id, co.round_max)
                if (co_items) {
                    this.viewNode.BtnReward1.SetData({ info: info, co: co_items[0], index: 0, count: co_items.length })
                    this.viewNode.BtnReward2.SetData({ info: info, co: co_items[1], index: 1, count: co_items.length })
                    this.viewNode.BtnReward3.SetData({ info: info, co: co_items[2], index: 2, count: co_items.length })
                }
            }
        }
        this.viewNode.ArrowLastRed.SetNum(arrow_show_l ? MainFBData.Inst().InfoRedLeft : 0);
        this.viewNode.ArrowNextRed.SetNum(arrow_show_r ? MainFBData.Inst().InfoRedRight : 0);
    }

    FlushInfoShow(level: number) {
        let co = MainFBData.Inst().CfgBarrierInfoMainInfo(level)
        if (co) {
            UH.SetIcon(this.viewNode.BgSp, co.barrier_icon, ICON_TYPE.MainFB);
        }
    }

    OnClickCollectReward() {
        ViewManager.Inst().OpenView(TrafficPermitView);
    }

    OnClickLevelInfo() {
        ViewManager.Inst().OpenView(MainLevelInfoView, MainFBData.Inst().SelId);
    }

    OnClickArrowLast() {
        AudioManager.Inst().PlayUIAudio(AudioTag.TongYongClick);
        this.viewNode.BtnArrowLast.touchable = false
        MainFBData.Inst().SelId--;
        this.FlushInfo()
    }

    OnClickArrowNext() {
        AudioManager.Inst().PlayUIAudio(AudioTag.TongYongClick);
        this.viewNode.BtnArrowNext.touchable = false
        MainFBData.Inst().SelId++;
        this.FlushInfo()
    }
}

export class MainViewTaskRewardButton1 extends BaseItemGB {
    protected viewNode = {
        Icon: <fgui.GLoader>null,
        Icon2: <fgui.GLoader>null,
    };
    FlushShow() {
        let id = TrafficPermitData.Inst().GetHeroSmallIcon();
        UH.SetIcon(this.viewNode.Icon, id, ICON_TYPE.HEROSMALL)
        UH.SetIcon(this.viewNode.Icon2, id, ICON_TYPE.HEROSMALL)
    }
}

export class MainViewTaskRewardButton2 extends BaseItemGB {
    private spShow: UISpineShow = undefined;

    protected viewNode = {
        icon: <fgui.GLoader>null,
        redPoint: <RedPoint>null,
    };

    protected onConstruct() {
        super.onConstruct()
        this.onClick(this.OnClickReward, this);
    }

    protected onDestroy(): void {
        super.onDestroy();
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null;
        }
    }

    SetData(data: { info: any, co: any, index: any, count: number }) {
        super.SetData(data)
        this.visible = undefined != data.co
        if (data.co) {
            if (data.info.round >= data.co.round_num && !data.info.rewardFlag[data.index]) {
                if (!this.spShow) {
                    this.spShow = ObjectPool.Get(UISpineShow, ResPath.Spine("lihe/lihe"), true, (obj: any) => {
                        obj.setPosition(40, -82);
                        this._container.insertChild(obj, 2);
                    });
                }
                this.viewNode.redPoint.SetNum(1);
                // this.icon = "";
                this.viewNode.icon.visible = false;
            } else {
                if (this.spShow) {
                    ObjectPool.Push(this.spShow);
                    this.spShow = null;
                }
                this.viewNode.icon.visible = true;
                this.icon = fgui.UIPackage.getItemURL("Main", data.info.rewardFlag[data.index] ? "LiHeKai" : "LiHe");
                this.viewNode.redPoint.SetNum(0);
            }
            this.title = data.co.round_num
            this.x = GetCfgValue(MainFBConfig.RoundRewadPos, data.count)[data.index]
        }
    }

    OnClickReward() {
        if (this._data) {
            if (this._data.info.round >= this._data.co.round_num && !this._data.info.rewardFlag[this._data.index]) {
                MainFBCtrl.Inst().SendMainFBOperFetchBox(this._data.co.seq)
            } else {
                ViewManager.Inst().OpenView(MainTaskRewardView, { x: this.x - 76, y: 707, rewards: this._data.co.win })
            }
        }
    }
}
