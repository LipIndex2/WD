import { HandleBase, HandleCollector } from "core/HandleCollector";
import { FrameTimerHandle, RemindGroupMonitor, SMDHandle } from "data/HandleCollectorCfg";
import * as fgui from "fairygui-cc";
import { ModManger } from "manager/ModManger";
import { ViewManager } from "manager/ViewManager";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { Language } from "modules/common/Language";
import { Mod } from "modules/common/ModuleDefine";
import { RedPoint } from "modules/extends/RedPoint";
import { GuideCtrl } from "modules/guide/GuideCtrl";
import { HeroData } from 'modules/hero/HeroData';
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { RemindCtrl } from "modules/remind/RemindCtrl";
import { RoleData } from "modules/role/RoleData";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { MainData } from "./MainData";

interface IMainMenuTabData {
    index: number,
    tabTitle: string,
    tabIcon: string,
    modKey: number,
}

@BaseView.registView
export class MainMenu extends BaseView {
    private timer_handle: any
    static InitShowReady: boolean
    static SkipIndex: number = 2

    private tabList: IMainMenuTabData[] = [
        <IMainMenuTabData>{ index: 1, tabTitle: Language.MainMenu.Tab0, tabIcon: "JiaYuan", modKey: Mod.Territory.View, fightIndex: 1 },
        <IMainMenuTabData>{ index: 2, tabTitle: Language.MainMenu.Tab1, tabIcon: "ShangDian", modKey: Mod.Shop.View },
        <IMainMenuTabData>{ index: 3, tabTitle: Language.MainMenu.Tab2, tabIcon: "ZhuJieMian", modKey: Mod.Main.View, fightIndex: 0 },
        <IMainMenuTabData>{ index: 4, tabTitle: Language.MainMenu.Tab3, tabIcon: "YingXiong", modKey: Mod.Hero.View },
        <IMainMenuTabData>{ index: 5, tabTitle: Language.MainMenu.Tab4, tabIcon: "HuoDongGuanQia", modKey: Mod.ActivityCombat.View },
    ]

    protected viewRegcfg = {
        UIPackName: "MainMenu",
        ViewName: "MainMenu",
        LayerType: ViewLayer.Buttom,
    };

    protected viewNode = {
        List: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "TabItem", ExtendsClass: MainMenuTabItem },
        { ResName: "IconItem", ExtendsClass: MainMenuIconItem }
    ];

    index: number;

    InitData(param: { tabIndex: number } = { tabIndex: 2 }) {
        this.AddSmartDataCare(MainData.Inst().FlushData, this.FlushShopData.bind(this), "MainMenuShopFlush");
        this.AddSmartDataCare(MainData.Inst().FlushData, this.FlushMainStart.bind(this), "MainStart");
        this.AddSmartDataCare(MainData.Inst().FlushData, this.FlushSkip.bind(this), "flushSkipIndex");
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.List.numItems = this.tabList.length;
        this.viewNode.List.selectedIndex = param.tabIndex;
        this.viewNode.List.on(fgui.Event.CLICK_ITEM, this.OnTabClick, this)
        let tabData = this.tabList[param.tabIndex];
        ViewManager.Inst().OpenViewByKey(tabData.modKey);
        this.index = this.viewNode.List.selectedIndex;

        // this.InitShow(this.tabList[1], () => {
        //     BaseView.InitShowReady = true
        //     this.InitShow(this.tabList[0], () => {
        //         this.InitShow(this.tabList[2], () => {
        //             BaseView.InitShowReady = false
        //         })
        //     })
        // }, false)
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.tabList[index])
    }

    InitUI() {
        // if(this.viewNode.List.selectedIndex != -1){
        //     let data = this.tabList[this.viewNode.List.selectedIndex];
        //     ViewManager.Inst().OpenViewByKey(data.modKey);
        // }
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
        if (RoleData.Inst().IsGuideNum(1)) {
            GuideCtrl.Inst().Start(1);
            return;
        }
    }

    FlushShopData() {
        this.index = 1;
        this.viewNode.List.selectedIndex = 1;
    }

    FlushSkip() {
        let index = MainData.Inst().GetFlushSkipIndex();
        this.index = index;
        this.viewNode.List.selectedIndex = index;
    }

    FlushMainStart() {
        // this.InitShow(this.tabList[1], () => {
        //     BaseView.InitShowReady = true
        //     this.InitShow(this.tabList[0], () => {
        //         this.InitShow(this.tabList[2], () => {
        //             BaseView.InitShowReady = false
        //         })
        //     })
        // }, false)
        ViewManager.Inst().mainViewLoaded = true;
        BaseView.InitShowReady = true
        this.InitShow(this.tabList[1], () => {
            this.InitShow(this.tabList[3], () => {
                BaseView.InitShowReady = false
            })
        })
    }

    CloseCallBack() {
        for (var tabData of this.tabList) {
            ViewManager.Inst().CloseViewByKey(tabData.modKey);
        }
    }

    private OnTabClick(item: MainMenuTabItem) {
        BaseView.InitShowReady = false
        let data = item.GetData();
        let modKey = data.modKey;
        let vClass = ModManger.Inst().GetView(modKey);
        if ((this.index == this.viewNode.List.selectedIndex) && !GuideCtrl.Inst().CurStepCfg()) return;
        // if (ViewManager.Inst().IsOpen(vClass)) {
        //     return
        // } else {

        if (Mod.ActivityCombat.View == data.modKey) {
            let is_ActivityCombatOpen = FunOpen.Inst().GetFunIsOpen(Mod.ActivityCombat.View);
            let co = FunOpen.Inst().GetFunOpenModCfg(Mod.ActivityCombat.View);
            if (!is_ActivityCombatOpen.is_open) {
                this.viewNode.List.selectedIndex = this.index
                PublicPopupCtrl.Inst().Center(TextHelper.Format(Language.MainFB.LockShow, co.open_barrier))
                return
            }

        } else if (Mod.Main.View == data.modKey && data.fightIndex == 1) {
            let is_MainFBOpen = FunOpen.Inst().GetFunIsOpen(Mod.Main.EverydayFB);
            let co = FunOpen.Inst().GetFunOpenModCfg(Mod.Main.EverydayFB);
            if (!is_MainFBOpen.is_open) {
                this.viewNode.List.selectedIndex = this.index
                PublicPopupCtrl.Inst().Center(TextHelper.Format(Language.MainFB.LockShow, co.open_barrier))
                return
            }
        } else if (Mod.Territory.View == data.modKey) {
            let is_TerritoryOpen = FunOpen.Inst().GetFunIsOpen(Mod.Territory.View);
            let co = FunOpen.Inst().GetFunOpenModCfg(Mod.Territory.View);
            if (!is_TerritoryOpen.is_open) {
                this.viewNode.List.selectedIndex = this.index
                PublicPopupCtrl.Inst().Center(TextHelper.Format(Language.MainFB.LockShow, co.open_barrier))
                return
            }
        }

        this.index = this.viewNode.List.selectedIndex;
        this.viewNode.List.touchable = false
        ViewManager.Inst().OpenViewByKey(modKey)
        // if (data.modKey != Mod.Main.View && ViewManager.Inst().IsOpen(ActivityCombatView)) {
        //     ViewManager.Inst().CloseView(ActivityCombatView)
        // }
        if (data.modKey != Mod.Hero.View) {
            HeroData.Inst().selectHeroId = 0;
            HeroData.Inst().heroBattleid = 0;
        }
        if (data.modKey == Mod.Main.View) {
            MainData.Inst().FightIndex = data.fightIndex
        }
        this.handleCollector.KeyAdd("WaitViewReady", FrameTimerHandle.Create(() => {
            if (ViewManager.Inst().IsOpened(vClass)) {
                this.viewNode.List.touchable = true
                this.handleCollector.KeyRemove("WaitViewReady");
                for (var tabData of this.tabList) {
                    if (tabData.modKey != modKey) {
                        ViewManager.Inst().CloseViewByKey(tabData.modKey)
                    }
                }

            }
        }, 1, 999999999, false));
    }

    private InitShow(data: any, func?: Function, remove = true) {
        let modKey = data.modKey;
        let vClass = ModManger.Inst().GetView(modKey);
        ViewManager.Inst().OpenViewByKey(modKey, undefined, true)
        this.WaitViewReady(() => {
            if (ViewManager.Inst().IsOpened(vClass)) {
                this.handleCollector.KeyRemove("WaitViewReady");
                if (remove) {
                    ViewManager.Inst().CloseViewByKey(modKey)
                    this.WaitViewReady(() => {
                        if (!ViewManager.Inst().IsOpened(vClass)) {
                            this.handleCollector.KeyRemove("WaitViewReady");
                            func()
                        }
                    })
                } else {
                    func()
                }
            }
        })
    }

    private WaitViewReady(func: Function) {
        this.handleCollector.KeyAdd("WaitViewReady", FrameTimerHandle.Create(() => {
            func()
        }, 1, 999999999, false));
    }
}


export class MainMenuTabItem extends BaseItemGB {
    private handleCollector: HandleCollector;
    protected viewNode = {
        IconShow: <MainMenuIconItem>null,
        IconSel: <MainMenuIconItem>null,
        title: <fgui.GTextField>null,
        titleSel: <fgui.GTextField>null,
        redPoint: <RedPoint>null,

        GpLock: <fgui.GGroup>null,
        LockShow: <fgui.GTextField>null,
    };
    public SetData(data: IMainMenuTabData) {
        super.SetData(data);
        if (this.handleCollector) {
            this.handleCollector.RemoveAll()
        } else {
            this.handleCollector = HandleCollector.Create();
        }
        UH.SetText(this.viewNode.title, data.tabTitle)
        UH.SetText(this.viewNode.titleSel, data.tabTitle)
        this.viewNode.IconShow.SetData(data, true)
        this.viewNode.IconSel.SetData(data, false)
        this.FlushRoleInfo()


        this.addRemindCare(data.modKey, this.viewNode.redPoint)
        this.AddSmartDataCare(RoleData.Inst().FlushData, this.FlushRoleInfo.bind(this), "FlushRoleInfo");
    }

    FlushRoleInfo() {
        if (Mod.ActivityCombat.View == this._data.modKey) {
            let is_ActivityCombatOpen = FunOpen.Inst().GetFunIsOpen(Mod.ActivityCombat.View);
            let co = FunOpen.Inst().GetFunOpenModCfg(Mod.ActivityCombat.View);
            this.viewNode.GpLock.visible = !is_ActivityCombatOpen.is_open
            this.viewNode.IconShow.alpha = is_ActivityCombatOpen.is_open ? 1 : 0.5
            this.viewNode.title.alpha = is_ActivityCombatOpen.is_open ? 1 : 0.5
            UH.SetText(this.viewNode.LockShow, TextHelper.Format(Language.MainFB.LockShowLine, co.open_barrier))

        } else if (Mod.Main.View == this._data.modKey && this._data.fightIndex == 1) {
            let is_MainFBOpen = FunOpen.Inst().GetFunIsOpen(Mod.Main.EverydayFB);
            let co = FunOpen.Inst().GetFunOpenModCfg(Mod.Main.EverydayFB);
            this.viewNode.GpLock.visible = !is_MainFBOpen.is_open
            this.viewNode.IconShow.alpha = is_MainFBOpen.is_open ? 1 : 0.5
            this.viewNode.title.alpha = is_MainFBOpen.is_open ? 1 : 0.5
            UH.SetText(this.viewNode.LockShow, TextHelper.Format(Language.MainFB.LockShowLine, co.open_barrier))

        } else if (Mod.Territory.View == this._data.modKey) {
            let is_TerritoryOpen = FunOpen.Inst().GetFunIsOpen(Mod.Territory.View);
            let co = FunOpen.Inst().GetFunOpenModCfg(Mod.Territory.View);
            this.viewNode.GpLock.visible = !is_TerritoryOpen.is_open
            this.viewNode.IconShow.alpha = is_TerritoryOpen.is_open ? 1 : 0.5
            this.viewNode.title.alpha = is_TerritoryOpen.is_open ? 1 : 0.5
            UH.SetText(this.viewNode.LockShow, TextHelper.Format(Language.MainFB.LockShowLine, co.open_barrier))
        }
        let group = ModManger.TabMod(this._data.modKey);
        this.freshRedPoint(group, this.viewNode.redPoint);
    }

    private addRemindCare(mod_key: number, obj: RedPoint) {
        let self = this;
        let group = ModManger.TabMod(mod_key);
        this.handleCollector.Add(RemindGroupMonitor.Create(group, self.freshRedPoint.bind(self, group, obj)));
    }

    public AddSmartDataCare(smdata: any, callback: Function, ...keys: string[]): HandleBase {
        var handle = SMDHandle.Create(smdata, callback, ...keys)
        this.handleCollector.Add(handle);
        return handle
    }

    private freshRedPoint(group: any, obj: RedPoint) {
        let funOpen = FunOpen.Inst().GetFunIsOpen(this._data.modKey)
        if (funOpen.is_open) {
            obj.SetNum(RemindCtrl.Inst().GetGroupNum(group));
        }
    }

    protected onDestroy(): void {
        super.onDestroy()
        if (this.handleCollector) {
            HandleCollector.Destory(this.handleCollector);
            this.handleCollector = null;
        }
    }
}

export class MainMenuIconItem extends BaseItemGB {
    protected viewNode = {
        IconShow: <fgui.GLoader>null,
    }

    public SetData(data: IMainMenuTabData, guide?: boolean) {
        super.SetData(data)
        UH.SpriteName(this.viewNode.IconShow, "MainMenu", guide ? `${data.tabIcon}1` : data.tabIcon)
        if (guide) {
            GuideCtrl.Inst().AddGuideUi("MainMenuBtn" + data.index, this.viewNode.IconShow);
        }
    }

    protected onDestroy(): void {
        super.onDestroy()
        GuideCtrl.Inst().ClearGuideUi("MainMenuBtn" + this._data.index);
    }
}
