import { HeroInfoView } from 'modules/hero/HeroInfoView';
import { HeroData } from 'modules/hero/HeroData';
import { LogError } from 'core/Debugger';
import * as fgui from "fairygui-cc";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewShowAnimPivot } from 'modules/common/BaseView';
import { CommonId, ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { ExpShow, CurrencyShow } from "modules/extends/Currency";
import { OpenServiceSevenDayCtrl } from "./OpenServiceSevenDayCtrl";
import { OpenServiceSevenDayData } from "./OpenServiceSevenDayData";
import { UH } from "../../helpers/UIHelper";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { SMDHandle } from 'data/HandleCollectorCfg';
import { HandleCollector } from 'core/HandleCollector';
import { ViewManager } from 'manager/ViewManager';
import { PublicPopupCtrl } from 'modules/public_popup/PublicPopupCtrl';
import { EGLoader } from 'modules/extends/EGLoader';
import { BoxPreviewView } from './BoxPreviewView';
import { AudioTag } from 'modules/audio/AudioManager';
import { RedPoint } from 'modules/extends/RedPoint';
import { TextHelper } from '../../helpers/TextHelper';
import { ObjectPool } from 'core/ObjectPool';
import { UISpineShow } from 'modules/scene_obj_spine/UISpineShow';
import { ResPath } from 'utils/ResPath';
import { CocHighPerfList } from '../../ccomponent/CocHighPerfList';
import { CommonEvent } from 'modules/common/CommonEvent';
import { EventCtrl } from 'modules/common/EventCtrl';

@BaseView.registView
export class OpenServiceSevenDayView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "OpenServiceSevenDay",
        ViewName: "OpenServiceSevenDayView",
        LayerType: ViewLayer.Normal,
        OpenAudio: AudioTag.TanChuJieMian,
    };

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,
        liuhaiscreen: <fgui.GComponent>null,
        ExpShow: <ExpShow>null,
        Currency1: <CurrencyShow>null,
        Currency2: <CurrencyShow>null,
        Currency3: <CurrencyShow>null,

        scheduleShow: <scheduleShow>null,

        bg: <EGLoader>null,
        Time: <fgui.GTextField>null,
        timer: <TimeMeter>null,
        List: <fgui.GList>null,
        TabList: <fgui.GList>null,
        BtnClose: <fgui.GButton>null,
    };

    protected extendsCfg = [
        { ResName: "taskCell", ExtendsClass: taskCell },
        { ResName: "scheduleShow", ExtendsClass: scheduleShow },
        { ResName: "TabCell", ExtendsClass: TabCell },
        { ResName: "BtnBox", ExtendsClass: BtnBox },
    ];
    private cache_timer: number = 0;
    private day: number = 0;
    private isScrollTo: boolean = false;
    listData: { seq: number; day: number; maxNum: number; value: number; isFetch: boolean; }[];

    InitData() {

        this.viewNode.List._container.addComponent(CocHighPerfList);
        this.viewNode.TabList._container.addComponent(CocHighPerfList);
        // this.viewNode.scheduleShow._container.addComponent(CocHighPerfList);

        this.viewNode.Currency1.SetCurrency(CommonId.Gold);
        this.viewNode.Currency2.SetCurrency(CommonId.Energy);
        this.viewNode.Currency3.SetCurrency(CommonId.Diamond);
        this.viewNode.Currency2.BtnAddShow(true);
        this.viewNode.BtnClose.onClick(this.closeView.bind(this));
        this.viewNode.scheduleShow.SetData();

        this.AddSmartDataCare(OpenServiceSevenDayData.Inst().FlushData, this.FulshListData.bind(this), "FlushInfo");
        EventCtrl.Inst().on(CommonEvent.TIME_ZERO, this.OnFulshTimeZero, this);

        this.viewNode.timer.SetCallBack(this.FlushFlushTime.bind(this));
        this.cache_timer = OpenServiceSevenDayData.Inst().getEndTime();

        this.viewNode.TabList.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.TabList.setVirtual();
        this.viewNode.TabList.on(fgui.Event.CLICK_ITEM, this.OnClickItem, this)
        this.day = OpenServiceSevenDayData.Inst().GetActivityDay() - 1;

        this.FulshListData();
        this.FlushFlushTime();

        this.viewNode.TabList.selectedIndex = this.day;
    }

    private renderListItem(index: number, item: TabCell) {
        item.SetData(index);
    }
    private FulshListData() {
        this.viewNode.List.setVirtual();
        let taskList = OpenServiceSevenDayData.Inst().GetDayTask(this.day + 1);
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.listData = taskList;
        this.viewNode.List.numItems = taskList.length;
        this.viewNode.List.scrollPane.scrollTop();

        this.viewNode.TabList.numItems = 7;
        if (!this.isScrollTo) {
            this.viewNode.TabList.scrollToView(this.day);
            this.viewNode.TabList.selectedIndex = this.day;
            this.isScrollTo = true;
        }

    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    private FlushFlushTime() {
        let time = this.cache_timer;
        this.viewNode.timer.visible = time > 0
        this.viewNode.timer.CloseCountDownTime()
        if (time > 0) {
            this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_4);
        }
    }

    OnClickItem() {
        this.day = this.viewNode.TabList.selectedIndex;
        this.FulshListData();
    }

    OnFulshTimeZero() {
        OpenServiceSevenDayCtrl.Inst().SendSevenDayReqInfo()
    }
    InitUI() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        this.viewNode.timer.CloseCountDownTime();
    }
}

export class taskCell extends BaseItem {
    protected viewNode = {
        MaskShow: <fgui.GGroup>null,
        ProgressBar: <fgui.GProgressBar>null,
        Num: <fgui.GTextField>null,
        Title: <fgui.GTextField>null,
        Icon: <fgui.GLoader>null,
        BtnPrize: <fgui.GButton>null,
        ItemNum: <fgui.GTextField>null,
        ItemIcon: <fgui.GLoader>null,
    };
    private info: any;
    public SetData(info: any) {
        this.data = OpenServiceSevenDayData.Inst().GetTasCfg(info.day, info.seq);
        this.info = info;
        this.viewNode.BtnPrize.onClick(this.getPrize, this);
        UH.SetIcon(this.viewNode.ItemIcon, this.data.suc2[0].item_id, ICON_TYPE.ITEM);
        UH.SetIcon(this.viewNode.Icon, this.data.suc1[0].item_id, ICON_TYPE.ITEM);
        UH.SetText(this.viewNode.ItemNum, this.data.suc2[0].num);
        UH.SetText(this.viewNode.Title, this.data.word);
        UH.SetText(this.viewNode.Num, this.data.suc1[0].num);

        let isfetch = info.isFetch;
        this.viewNode.BtnPrize.grayed = info.value < info.maxNum;
        this.viewNode.BtnPrize.visible = !isfetch;
        this.viewNode.MaskShow.visible = isfetch
        this.viewNode.ProgressBar.max = this.data.pram1;
        this.viewNode.ProgressBar.value = OpenServiceSevenDayData.Inst().GetTaskProgress(this.data.day, this.data.seq);
    }

    getPrize() {
        let value = OpenServiceSevenDayData.Inst().GetTaskProgress(this.data.day, this.data.seq);
        if (value < this.data.pram1) {
            PublicPopupCtrl.Inst().Center(Language.ServiceSevenDay.TaskTip);
            return
        } else if (this.info.isFetch) {
            PublicPopupCtrl.Inst().Center(Language.ServiceSevenDay.TaskFetchTip);
            return
        }
        OpenServiceSevenDayCtrl.Inst().SendSevenDayTaskReq(this.data.day, this.data.seq)
    }
}
//fillStart

export class scheduleShow extends BaseItem {
    protected viewNode: { [key: string]: any } = {
        bar0: <fgui.GProgressBar>null,
        bar1: <fgui.GProgressBar>null,
        bar2: <fgui.GProgressBar>null,
        bar3_1: <fgui.GProgressBar>null,
        bar3_2: <fgui.GProgressBar>null,
        bar4: <fgui.GProgressBar>null,
        bar5_1: <fgui.GProgressBar>null,
        bar5_2: <fgui.GProgressBar>null,
        bar6: <fgui.GProgressBar>null,
        bar7: <fgui.GProgressBar>null,
        BtnBox0: <BtnBox>null,
        BtnBox1: <BtnBox>null,
        BtnBox2: <BtnBox>null,
        BtnBox3: <BtnBox>null,
        BtnBox4: <BtnBox>null,
        BtnBox5: <BtnBox>null,
        BtnBox6: <BtnBox>null,
        BtnBox7: <BtnBox>null,
        Num: <fgui.GTextField>null,
        Icon: <fgui.GLoader>null,
    };
    handleCollector: any;
    protected onDestroy(): void {
        super.onDestroy();
        if (this.handleCollector) {
            HandleCollector.Destory(this.handleCollector);
            this.handleCollector = null;
        }
    }
    public SetData() {
        if (this.handleCollector) {
            this.handleCollector.RemoveAll()
        } else {
            this.handleCollector = HandleCollector.Create();
        }
        this.addSmartDataCare(OpenServiceSevenDayData.Inst().FlushData, this.FlushData.bind(this), "FlushInfo");

        let icon = OpenServiceSevenDayData.Inst().getCfgStageItem();
        UH.SetIcon(this.viewNode.Icon, icon, ICON_TYPE.ITEM)
        this.FlushData();
    }
    public FlushData() {
        let num = OpenServiceSevenDayData.Inst().GetIntegralNum();
        let cfg = OpenServiceSevenDayData.Inst().getSevenGift();

        UH.SetText(this.viewNode.Num, num);
        for (let i = 0; i < 8; i++) {
            this.viewNode["BtnBox" + i].SetData({ index: i, cfg: cfg[i], num: num });
            let min = (cfg[i - 1] && cfg[i - 1].stage_need) || 0
            if (i != 3 && i != 5) {
                this.viewNode["bar" + i].min = min;
                this.viewNode["bar" + i].max = cfg[i].stage_need;
                this.viewNode["bar" + i].value = num;
            } else {
                this.viewNode["bar" + i + "_1"].min = min;
                this.viewNode["bar" + i + "_1"].max = (min + cfg[i].stage_need) / 2;
                this.viewNode["bar" + i + "_1"].value = num;
                this.viewNode["bar" + i + "_2"].min = (min + cfg[i].stage_need) / 2;
                this.viewNode["bar" + i + "_2"].max = cfg[i].stage_need;
                this.viewNode["bar" + i + "_2"].value = num;
            }
        }

    }

    private addSmartDataCare(smdata: any, callback: Function, ...keys: string[]) {
        var handle = SMDHandle.Create(smdata, callback, ...keys)
        this.handleCollector.Add(handle);
    };
}

export class BtnBox extends BaseItemGB {
    isBox: boolean;
    private spShow: UISpineShow = undefined;
    protected viewNode = {
        icon: <fgui.GLoader>null,
    };
    protected onConstruct() {
        this.onClick(this.getPrize, this);
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }
    public SetData(data: any) {
        this.data = data;
        this.isBox = OpenServiceSevenDayData.Inst().IsBoxReward(data.index);
        // this.viewNode.Light.visible = false
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null;
        }
        this.title = data.cfg.stage_need;
        if (data.index == 7) {
            let heroData = HeroData.Inst().GetHeroLevelCfg(data.cfg.show, 1);
            this.icon = "loader/icon/role/" + heroData.res_id;
            UH.SetIcon(this.viewNode.icon, heroData.res_id, ICON_TYPE.ROLE);
            return
        }
        if (data.num >= data.cfg.stage_need && !this.isBox) {
            this.viewNode.icon.visible = false;
            this.spShow = ObjectPool.Get(UISpineShow, ResPath.Spine("jianianhua/jianianhua"), true, (obj: any) => {
                obj.setPosition(25, -45);
                this._container.insertChild(obj, 1);
                CocHighPerfList.emit(this.node);
            });
        } else {
            let img = this.isBox ? "XiaoBaoXiangYiLingQu" : "BaoXiangicon";
            UH.SpriteName(this.viewNode.icon, "OpenServiceSevenDay", img);
            this.viewNode.icon.visible = true;
        }

    }
    public getPrize() {
        let index = this.data.index;
        let num = this.data.num;
        let cfg = this.data.cfg;
        let isBoxReward = this.isBox
        if (isBoxReward) {
            PublicPopupCtrl.Inst().Center(Language.ActCommon.JiangLiYiLingQu);
            return;
        }
        if (num < cfg.stage_need) {
            if (index == 7) {
                let heroid = HeroData.Inst().GetDebrisHeroId(cfg.stage[0].item_id)
                ViewManager.Inst().OpenView(HeroInfoView, heroid);
            } else {
                ViewShowAnimPivot.BoxPreviewView = ShowAnimPivot[index]
                ViewManager.Inst().OpenView(BoxPreviewView, { pos: this.node.worldPosition, data: cfg });
            }
        } else {
            OpenServiceSevenDayCtrl.Inst().SendSevenDayStageReq(index)
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
export class TabCell extends BaseItemGB {
    protected viewNode = {
        Lock: <fgui.GImage>null,
        icon: <fgui.GLoader>null,
        title: <fgui.GTextField>null,
        title1: <fgui.GTextField>null,
        redPoint: <RedPoint>null,
    };
    public SetData(data: number) {
        let day = OpenServiceSevenDayData.Inst().GetActivityDay();
        this.enabled = data < day;
        this.viewNode.Lock.visible = data >= day;
        let img = data < day ? "RiLi" : "WeiKaiQiTianShu";
        UH.SpriteName(this.viewNode.icon, "OpenServiceSevenDay", img);
        UH.SetText(this.viewNode.title, TextHelper.Format(Language.OpenServiceSevenDay.day, data + 1));
        UH.SetText(this.viewNode.title1, TextHelper.Format(Language.OpenServiceSevenDay.day, data + 1));
        if (data < day) {
            let num = OpenServiceSevenDayData.Inst().GetDayTaskRed(data + 1)
            this.viewNode.redPoint.SetNum(num)
        } else {
            this.viewNode.redPoint.SetNum(0)
        }
    }
}

let ShowAnimPivot: { [key: number]: { x: number, y: number } } = {
    [0]: { x: 0.3, y: 0.16 },
    [1]: { x: 0.53, y: 0.16 },
    [2]: { x: 0.75, y: 0.16 },
    [3]: { x: 0.61, y: 0.21 },
    [4]: { x: 0.4, y: 0.21 },
    [5]: { x: 0.3, y: 0.26 },
    [6]: { x: 0.53, y: 0.26 },
}