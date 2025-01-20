import { BaseItemGB } from './../common/BaseItem';
import * as fgui from "fairygui-cc";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { CommonId, ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { ExpShow, CurrencyShow } from "modules/extends/Currency";
import { EGLoader } from "modules/extends/EGLoader";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { LoseTempleData } from './LoseTempleData';
import { Item } from 'modules/bag/ItemData';
import { UH } from '../../helpers/UIHelper';
import { LoseTempleCtrl } from './LoseTempleCtrl';
import { PublicPopupCtrl } from 'modules/public_popup/PublicPopupCtrl';
import { UISpineShow } from 'modules/scene_obj_spine/UISpineShow';
import { ViewManager } from 'manager/ViewManager';
import { ObjectPool } from 'core/ObjectPool';
import { ResPath } from 'utils/ResPath';
import { CocHighPerfList } from '../../ccomponent/CocHighPerfList';
import { MainTaskRewardView } from 'modules/main/MainTaskRewardView';
import { ItemCell } from 'modules/extends/ItemCell';
import { AudioTag } from 'modules/audio/AudioManager';
//任务
@BaseView.registView
export class LoseTempleAchievementView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "LoseTempleAchievement",
        ViewName: "LoseTempleAchievementView",
        LayerType: ViewLayer.Normal,
        OpenAudio: AudioTag.TanChuJieMian,
    };

    protected viewNode: { [key: string]: any } = {
        fullscreen: <fgui.GComponent>null,
        liuhaiscreen: <fgui.GComponent>null,
        bg: <EGLoader>null,
        list: <fgui.GList>null,
        ProgressBar0: <fgui.GProgressBar>null,
        ProgressBar1: <fgui.GProgressBar>null,
        ProgressBar2: <fgui.GProgressBar>null,
        ProgressBar3: <fgui.GProgressBar>null,
        ProgressBar4: <fgui.GProgressBar>null,
        ProgressBar5: <fgui.GProgressBar>null,
        BtnBox1: <TempleAchievementBtnBox>null,
        BtnBox2: <TempleAchievementBtnBox>null,
        BtnBox3: <TempleAchievementBtnBox>null,
        BtnBox4: <TempleAchievementBtnBox>null,
        BtnBox5: <TempleAchievementBtnBox>null,
        BtnBox6: <TempleAchievementBtnBox>null,
        BtnClose: <fgui.GButton>null,
        timer: <TimeMeter>null,
        ExpShow: <ExpShow>null,
        Currency1: <CurrencyShow>null,
        Currency2: <CurrencyShow>null,
        Currency3: <CurrencyShow>null,
    };

    protected extendsCfg = [
        { ResName: "TaskItem", ExtendsClass: TempleAchievementTaskItem },
        { ResName: "BtnBox", ExtendsClass: TempleAchievementBtnBox },
    ];
    listData: any[];

    InitData() {
        this.viewNode.BtnClose.onClick(this.closeView, this);

        this.AddSmartDataCare(LoseTempleData.Inst().FlushData, this.FlushData.bind(this), "FlushTaskInfo");

        this.viewNode.Currency1.SetCurrency(CommonId.Gold);
        this.viewNode.Currency2.SetCurrency(CommonId.WeekIntegral);
        this.viewNode.Currency3.SetCurrency(CommonId.Diamond);
        // this.viewNode.Currency2.BtnAddShow(true);
        this.viewNode.list.setVirtual();

        this.FlushData();
        this.FlushFlushTime();
    }

    InitUI() {
    }

    FlushData() {
        let BoxCfg = LoseTempleData.Inst().GetTaskBox();
        let num = LoseTempleData.Inst().GetIntegralNum(BoxCfg[0].stage_item);
        for (let i = 0; i < 6; i++) {
            if (!BoxCfg[i]) continue;
            this.viewNode["BtnBox" + (i + 1)].FlushShow({ cfg: BoxCfg[i], num: num });
            if (this.viewNode["ProgressBar" + i]) {
                this.viewNode["ProgressBar" + i].min = BoxCfg[i - 1] ? BoxCfg[i].stage_need : 0;
                this.viewNode["ProgressBar" + i].max = BoxCfg[i].stage_need;
                this.viewNode["ProgressBar" + i].value = num;
            }
        }

        let taskList = LoseTempleData.Inst().GetTask();
        taskList.sort((a, b) => {
            if (a.isFetch && !b.isFetch) {
                return 1;
            }
            else if (!a.isFetch && b.isFetch) {
                return -1;
            }
            let fetchAbleA = (a.value ?? 0) >= a.cfg.pram1
            let fetchAbleB = (b.value ?? 0) >= b.cfg.pram1
            if (fetchAbleA && !fetchAbleB) {
                return -1;
            }
            else if (!fetchAbleA && fetchAbleB) {
                return 1;
            }
            return a.cfg.seq - b.cfg.seq;
        });
        this.viewNode.list.itemRenderer = this.itemRenderer.bind(this);
        this.listData = taskList;
        this.viewNode.list.numItems = taskList.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    private FlushFlushTime() {
        let time = LoseTempleData.Inst().getEndTime();
        this.viewNode.timer.visible = time > 0
        this.viewNode.timer.CloseCountDownTime()
        if (time > 0) {
            this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_7, Language.Common.Refresh + ":");
        }
    }

    WindowSizeChange() {
        this.refreshBgSize(this.viewNode.bg)
    }

    DoOpenWaitHandle() {
        let waitHandle = this.createWaitHandle("loadBG")
        this.AddWaitHandle(waitHandle);
        this.viewNode.bg.SetIcon("loader/LoseTemple/LoseTempleAchievementBg", () => {
            waitHandle.complete = true;
            this.refreshBgSize(this.viewNode.bg)
        })
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        this.viewNode.timer.CloseCountDownTime();
    }
}

export class TempleAchievementTaskItem extends BaseItem {
    protected viewNode = {
        IconShow: <fgui.GLoader>null,
        DescShow: <fgui.GTextField>null,
        ItemNum: <fgui.GTextField>null,
        BtnGet: <fgui.GButton>null,
        ProgressShow: <fgui.GProgressBar>null,
        MaskShow: <fgui.GGroup>null,
        ItemCell: <ItemCell>null,
    };
    SetData(data: any) {
        super.SetData(data)
        this.data = data;
        let item0 = data.cfg.suc[0]

        this.viewNode.ItemCell.SetData(Item.Create(item0, { is_num: true }));

        this.viewNode.BtnGet.onClick(this.OnClickGet, this);

        UH.SetIcon(this.viewNode.IconShow, Item.GetIconId(item0.item_id), ICON_TYPE.ITEM)
        UH.SetText(this.viewNode.ItemNum, item0.num)
        UH.SetText(this.viewNode.DescShow, data.cfg.describe)

        let value = data.value ?? 0
        this.viewNode.ProgressShow.value = value;
        this.viewNode.ProgressShow.max = data.cfg.pram1;
        this.viewNode.MaskShow.visible = data.isFetch;
        this.viewNode.BtnGet.grayed = value < data.cfg.pram1
        this.viewNode.BtnGet.visible = !data.isFetch
    }

    OnClickGet() {
        if (this.data.value < this.data.cfg.pram1) {
            PublicPopupCtrl.Inst().Center(Language.ServiceSevenDay.TaskTip);
            return
        } else if (this.data.isFetch) {
            PublicPopupCtrl.Inst().Center(Language.ServiceSevenDay.TaskFetchTip);
            return
        }
        LoseTempleCtrl.Inst().SendLoseMission(this.data.cfg.seq)
    }
}

export class TempleAchievementBtnBox extends BaseItemGB {
    isBox: boolean;
    private spShow: UISpineShow = undefined;
    protected viewNode = {
        icon: <fgui.GLabel>null,
    };
    protected onConstruct() {
        this.onClick(this.getPrize, this);
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }
    public FlushShow(data: any) {
        this.data = data;
        this.isBox = LoseTempleData.Inst().TaskBoxFetch[this.data.cfg.seq];
        this.title = data.cfg.stage_need;
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null;
        }
        if (data.num >= data.cfg.stage_need && !this.isBox) {
            this.viewNode.icon.visible = false;
            this.spShow = ObjectPool.Get(UISpineShow, ResPath.Spine("lihe/lihe"), true, (obj: any) => {
                obj.setPosition(40, -82);
                this._container.insertChild(obj, 2);
            });
        } else {
            let img = this.isBox ? "LiHeKai" : "LiHe";
            UH.SpriteName(this.viewNode.icon, "LoseTempleAchievement", img);
            this.viewNode.icon.visible = true;
        }

    }
    public getPrize() {
        let num = this.data.num;
        let cfg = this.data.cfg;
        let isBoxReward = this.isBox
        if (isBoxReward) {
            PublicPopupCtrl.Inst().Center(Language.ActCommon.JiangLiYiLingQu);
            return;
        }
        if (num < cfg.stage_need) {
            let x = cfg.seq == 5 ? this.node.worldPosition.x - 140 : this.node.worldPosition.x - 61;
            ViewManager.Inst().OpenView(MainTaskRewardView, { x: x, y: 1600 - this.node.worldPosition.y - 200, rewards: cfg.stage });
        } else {
            LoseTempleCtrl.Inst().SendLoseMissionReward(cfg.seq)
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null;
        }
    }
}