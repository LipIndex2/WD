
import { Font, Vec2, js, sys } from "cc";
import { DEBUG, EDITOR } from "cc/env";
import { GetCfgValue } from "config/CfgCommon";
import { LogError, LogWxError } from "core/Debugger";
import { Singleton } from "core/Singleton";
import * as fgui from "fairygui-cc";
//import { BlockShow } from "modules/block/BlockItems";
//import { CommonComboBox } from "modules/box/BoxTrustView";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { LoseTempleHeroitem } from "modules/LoseTemple/LoseTempleHeroitem";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { CommonEvent } from "modules/common/CommonEvent";
import { ConstValue } from "modules/common/ConstValue";
import { EventCtrl } from "modules/common/EventCtrl";
import { LH, Language } from "modules/common/Language";
import { CommonBoard1, CommonBoardTab1 } from "modules/common_board/CommonBoard1";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { CommonBoard4 } from "modules/common_board/CommonBoard4";
import { CommonComboBox } from "modules/common_combo_box/CommonComboBox";
import { HeroSkillCellItem } from "modules/common_item/HeroSkillCellItem";
import { CurrencyShow, ExpShow } from "modules/extends/Currency";
import { EGLoader } from "modules/extends/EGLoader";
import { FlyIcon } from "modules/extends/FlyIcon";
import { HeadItem } from "modules/extends/HeadItem";
import { HeroCell, HeroItem, HeroProgress } from "modules/extends/HeroCell";
import { ItemCell } from "modules/extends/ItemCell";
import { RedPoint } from "modules/extends/RedPoint";
import { TimeMeter } from "modules/extends/TimeMeter";
import { GuideCtrl } from "modules/guide/GuideCtrl";
import { GuideView } from "modules/guide/GuideView";
import { WaitView } from "modules/login/WaitView";
import { MainMenu } from "modules/main/MainMenu";
import { MainView } from "modules/main/MainView";
import { MaskView } from "modules/main/MaskView";
import { TopLayerView } from "modules/main/TopLayerView";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { PreloadToolFuncs } from "preload/PreloadToolFuncs";
import { ResPath } from "utils/ResPath";
import { UtilHelper } from "../helpers/UtilHelper";
import { InputManager } from "./InputManager";
import { ModManger } from "./ModManger";
import { ResManager } from "./ResManager";
import { ChannelAgent } from "../proload/ChannelAgent";


// import { EmptyTip } from "modules/extends/EmptyTip";


export type c_viewRegInfo = {
    viewClass: new (p?: any) => BaseView,
    view?: BaseView,
    key: string,
    param?: any,
    isOpenAready?: boolean,
    isNew?: boolean,
    isOnlyLoad?: boolean
}

export let VIEW_NAME_STATIC: { [key: string]: boolean } = {
    ["GuideView"]: true,
    ["MaskView"]: true,
    ["TopLayerView"]: true,
    ["FillView"]: true,
}

export var SHOW_BATTLE_VIEW: { [key: string]: boolean } = {
    ["BattleView"]: true,
    ["BattlePauseView"]: true,
}

//战斗中缓存的界面
export var BATTLE_CACHE_VIEW: { [key: string]: boolean } = {
    ["FillView"]: true,
    ["LoseTempleView"]: true,
    ["HeroTrialView"]: true,
    ["ArenaMainView"]: true,
}

//主界面
export var MAIN_SHOW_VIEW: { [key: string]: boolean } = {
    ["MainMenu"]: true,
    ["MainView"]: true,
}

export class ViewManager extends Singleton {

    private initCom: () => void = null;
    private sortOrder: { [layer: number]: number[] } = {};
    // private _views: { [key: string]: BaseView };
    private _views: Map<string, BaseView>;
    // private _uniqueId: { [key: string]: string };
    private _regesterInfo: { [key: string]: c_viewRegInfo } = BaseView._regesterInfo
    private _openStart: string[]; //开启中UI
    private _opens: string[]; //开启中UI
    private loadCount = 0;
    private needLoadCount = 2;
    public poolPackages: string[]; //fgui包池
    private windowSizeChangeAction: Function[];
    public mainViewLoaded = false;
    private _commonPkgLoaded = false;
    public get commonPkgLoaded() {
        return this._commonPkgLoaded;
    }

    public Init(onCom: () => void) {
        let self = this;
        self._views = new Map();
        // self._regesterInfo = {};
        // self._uniqueId = {};
        self._opens = [];
        self._openStart = [];
        self.poolPackages = [];
        this.windowSizeChangeAction = [];
        self.initCom = onCom;
        self.loadFont();
        // self.loadLocalization();
        // self.loadCommonPack();
        self.loadFirstShowCommonPack();
        fgui.GRoot.create();
        fgui.GRoot.inst.node.addComponent(InputManager);
        window.onresize = self.windowSizeChange.bind(self);
        fgui.GRoot.inst.on(fgui.Event.TWEENER_ERROR, (e:string|any)=>{
            if (e.stack) {
                LogWxError("fuiTweener报错", e.stack);
            } else {
                LogWxError("fuiTweener报错", e);
            }
        })
    }

    public windowSizeChange() {
        let self = this;
        for (let index = 0; index < self._opens.length; index++) {
            const key = self._opens[index];
            const openView = self._views.get(key);
            if (openView && openView.ReSetWindowSize)
                openView.ReSetWindowSize();
        }
        for (var func of this.windowSizeChangeAction) {
            func();
        }
    }

    public OnWindowChange(func: Function) {
        this.windowSizeChangeAction.push(func);
    }
    public OffWindowChange(func: Function) {
        UtilHelper.ArrayRemove(this.windowSizeChangeAction, func)
    }

    public RegNodeInfo(val: any, view: any) {
        let self = this;
        let nodeInfo = val;
        let propNames = Object.getOwnPropertyNames(nodeInfo);
        const len = propNames.length;
        for (let index = 0; index < len; index++) {
            const key = propNames[index];
            var val_key = nodeInfo[key];
            if (val_key) {
                if (val_key.length != null) {
                    for (let i = 0; i < val_key.length; i++) {
                        val_key[i] = view.getChild(key + i);
                        if (val_key[i] == null) {
                            console.log(key + i);
                        }
                    }
                }
                // else {
                //     let com = view.getChild(key, fgui.GComponent);
                //     self.RegNodeInfo(val_key, com)
                // }
            } else {
                let tmpList: { [key: string]: Node } = {};
                Object.defineProperty(nodeInfo, key, {
                    get: function () {
                        let node = view.getChild(key);
                        if (node == null) {
                            console.error("节点缺失请重新导出UI =====" + view.packageItem.name, key);
                            return;
                        }
                        if (tmpList[key]) {
                            return tmpList[key]
                        } else {
                            tmpList[key] = node;
                            if (DEBUG && node.node) {
                                node.node.name += "-" + key;
                            }
                        }
                        Object.defineProperty(nodeInfo, key, { value: node, writable: true })
                        return node
                    },
                    set: function (val: any) {
                        Object.defineProperty(nodeInfo, key, { value: val, writable: true })
                    }
                })
            }
        }
        return nodeInfo
    }

    public OpenViewByKey(modkey: number | string, param?: any, dont_check?: Boolean): boolean {
        if (typeof (modkey) == "string") {
            modkey = parseInt(modkey);
        }
        if (dont_check == undefined || dont_check != true) {
            let open_t = FunOpen.Inst().GetFunIsOpen(modkey);
            if (!open_t.is_open) {
                PublicPopupCtrl.Inst().Center(open_t.content);
                return false;
            }
        }
        let { key, param_t } = ModManger.Inst().ParseKey(modkey);
        if (ModManger.Inst().IsView(key)) {
            let vClass = ModManger.Inst().GetView(key);
            if (this.IsOpen(vClass)) {
                this.selectTabbar(vClass, modkey);
                let info: c_viewRegInfo = this.getViewRegInfo(vClass);
                EventCtrl.Inst().emit(CommonEvent.VIEW_OPEN, key, info.viewClass)
                // if (modkey == Mod.Main.View) {
                //     this.ShowMain()
                // }
            }
            else {
                this.OpenView(vClass, param ? param : param_t, true);
            }
        }
        return true;
    }

    public CloseViewByKey(modKey: number | string) {
        if (typeof (modKey) == "string") {
            modKey = parseInt(modKey);
        }
        let vClass = ModManger.Inst().GetView(modKey);
        if (vClass != null) {
            this.CloseView(vClass);
        }
    }

    public IsOpenByKey(modKey: number | string) {
        if (typeof (modKey) == "string") {
            modKey = parseInt(modKey);
        }
        let vClass = ModManger.Inst().GetView(modKey);
        let info: c_viewRegInfo = this.getViewRegInfo(vClass);
        if (info) {
            let key = info.key;
            let view: BaseView = this._views.get(key);
            if (view) {
                return true;
            }
        }
        return false;
    }

    private selectTabbar(vClass: any, modkey: number) {
        let info = this.getViewRegInfo(vClass)
        if (info && info.view) {
            info.view.SelectTabbar(modkey);
        }
    }

    /**
     * 打开页面
     * @param vCLass 页面类名
     * @param param 参数
     */
    public OpenView<T extends Function>(vClass: T | string, param?: any, dont_check = false): BaseView {
        let self = this;
        let info: c_viewRegInfo = self.getViewRegInfo(vClass);
        //console.log(ModManger.Inst().GetMod(info.key));
        //console.log(info.key);
        if (!dont_check) {
            let open_t = FunOpen.Inst().GetFunIsOpen(info.key);
            if (!open_t.is_open) {
                PublicPopupCtrl.Inst().Center(open_t.content);
                return;
            }
        }

        if (info) {
            info.param = param;
            let key = info.key;
            let view: BaseView = self._views.get(key);
            if (view) {
                console.error("界面已打开", key);
                return view;
            }
            view = info.view
            let newView = !view || (!info.isNew && !view.ViewRegCfg().ViewCache)
            // let isCreat = false
            if (newView) {
                // isCreat = true
                view = new info.viewClass(info);
                info.view = view;
            }
            view.name = key;
            self.addOpenStart(key);
            EventCtrl.Inst().emit(CommonEvent.VIEW_OPEN, key, info.viewClass)
            self._views.set(key, view);
            // self._uniqueId[view.id] = info.key;
            self.openViewEasy(info, newView);
            let guide_cfg = GuideCtrl.Inst().CurStepCfg();
            if (guide_cfg && guide_cfg.step_param_2 != info.key) {
                GuideCtrl.Inst().ForceStop();
            }
            return view;
        }
    }

    public ShowView<T extends Function>(vClass: T | string, isShow: boolean) {
        let info: c_viewRegInfo = this.getViewRegInfo(vClass);
        if (info) {
            let key = info.key;
            let view: BaseView = this._views.get(key);
            if (view) {
                view.view.visible = isShow;
            }
        }
    }

    public getViewRegInfo<T extends Function>(vClass: T | string | BaseView) {
        let vName = vClass as any;
        let key: string;
        let info: c_viewRegInfo;
        if (vName.name) {
            if (!EDITOR) {
                key = js.getClassName(vClass);
            } else
                key = vName.name
        } else {
            key = vName
        }
        info = this._regesterInfo[key];
        if (!info) {
            LogError("ViewManager getViewRegInfo undefined", key);
        }
        return info;
    }

    private openViewEasy(info: c_viewRegInfo, newView: boolean) {
        let self = this;
        let key = info.key;
        let view = info.view;
        if (newView) {
            view.LoadResource(info, () => {
                view.InitData(info.param);
                view.InitUI();

            }, () => {
                self.addOpens(key);
                view.Open();
                if (view.ViewRegCfg().ViewMask && self.getMask()) {
                    self.getMask().SetParentView(view);
                }
            })
        } else {
            if (view.view) {
                view.InitData(info.param);
                view.InitUI();
                self.addOpens(key);
                view.Open();
                if (view.ViewRegCfg().ViewMask && self.getMask()) {
                    self.getMask().SetParentView(view);
                }
            }
        }
    }

    private getMask() {
        return this._views.get(MaskView.prototype.name);
    }

    private addOpens(key: string, isTop: boolean = false): void {
        let index = this._opens.indexOf(key);
        if (index >= 0) {
            this._opens.splice(index, 1);
        }
        this._opens.push(key);

    }

    private addOpenStart(key: string, isTop: boolean = false): void {
        let index = this._openStart.indexOf(key);
        if (index >= 0) {
            this._openStart.splice(index, 1);
        }
        this._openStart.push(key);
        this._openStart = this._openStart.sort((a: string, b: string) => {
            let a_info = this.getViewRegInfo(a);
            let b_info = this.getViewRegInfo(b);
            let l_a = 0;
            if (a_info && a_info.view) {
                l_a = a_info.view.ViewRegCfg().LayerType;
            }
            let l_b = 0;
            if (b_info && b_info.view) {
                l_b = b_info.view.ViewRegCfg().LayerType;
            }
            if (!l_a || isNaN(l_a)) {
                l_a = 0;
            }
            if (!l_b || isNaN(l_b)) {
                l_b = 0;
            }
            return l_a - l_b;
        })
    }

    public IsOpen(vClassOrObj: any) {
        let info: c_viewRegInfo = this.getViewRegInfo(vClassOrObj);
        if (info) {
            let key = info.key;
            let view: BaseView = this._views.get(key);
            if (view) {
                return true;
            }
        }
        return false;
    }
    //完成了openCallback的界面
    public IsOpened(vClassOrObj: any) {
        let info: c_viewRegInfo = this.getViewRegInfo(vClassOrObj);
        return this._opens.indexOf(info.key) >= 0;
    }

    public getView<T extends BaseView>(vClassOrObj: any): T {
        let info: c_viewRegInfo = this.getViewRegInfo(vClassOrObj);
        if (info) {
            let key = info.key;
            let view: BaseView = this._views.get(key);
            if (view) {
                return view as T;
            }
        }
        return;
    }

    public IsTopView(vClassOrObj: any, in_index?: number) {
        let info: c_viewRegInfo = this.getViewRegInfo(vClassOrObj);
        if (info) {
            let temp = this._openStart.filter((value: string) => {
                return value != this.getViewRegInfo(TopLayerView).key && value != this.getViewRegInfo(MainMenu).key && value != this.getViewRegInfo(GuideView).key && value != this.getViewRegInfo(WaitView).key;
            })
            let key = info.key;
            let index = temp.length - 1
            if (in_index) {
                index -= in_index
            }
            return temp && temp[index] == key;
        }
        return false;
    }

    public CloseView<T extends Function>(vClass: T | string | BaseView) {
        let self = this;
        self.closeEasy(vClass);
    }

    public IsViewOpened(view_name: string) {
        return this._views.has(view_name);
    }
    //简单关闭一个窗口
    private closeEasy(vClass: any) {
        let self = this;
        let info: c_viewRegInfo = self.getViewRegInfo(vClass);
        if (!info) {
            return;
        }

        let key = info.key;
        let view: BaseView = info.view;
        if (view) {
            let viewIndex = self._opens.indexOf(key);
            if (viewIndex >= 0) {
                self._opens.splice(viewIndex, 1);
            }

            let viewIndex2 = self._openStart.indexOf(key);
            if (viewIndex >= 0) {
                self._openStart.splice(viewIndex2, 1);
            }
            self._views.delete(key);
            // delete self._views[key];
            // delete self._uniqueId[view.id];
            view.Close();
            EventCtrl.Inst().emit(CommonEvent.VIEW_CLOSE, key, info.viewClass)
            if (this.getMask()) {
                let viewMask = view.ViewRegCfg().ViewMask;
                if (viewMask == ViewMask.BgBlock || viewMask == ViewMask.BgBlockClose) {
                    this.getMask().ViewNode().BG.visible = false;
                }
                if (viewMask == ViewMask.BlockClose || viewMask == ViewMask.BgBlockClose) {
                    this.getMask().ViewNode().Block.visible = false;
                }
                //判断上一个界面是否有蒙版
                let lase_key = self._opens[self._opens.length - 1];
                if (lase_key && lase_key != undefined) {
                    let last_view = this._views.get(lase_key);
                    if (last_view && last_view != undefined) {
                        if (last_view.ViewRegCfg().ViewMask) {
                            self.getMask().SetParentView(last_view);
                        }
                    }
                }
            }
            if (!info.view.ViewRegCfg().ViewCache && !info.isNew) {
                info.view = undefined;
            }
        }
    }

    public MainViewVisible(visible: boolean, view_name?: string) {
        let show_main = visible || view_name == MainMenu.prototype.name
        // for (let [key, value] of this._views) {
        //     if (value.ViewRegCfg().LayerType == ViewLayer.Buttom && (key != view_name) && (!GetCfgValue(VIEW_NAME_STATIC, key))) {
        //         show_main = false
        //         value.view.visible = visible
        //     } else {
        //         if (!visible && (key != view_name) && (!GetCfgValue(VIEW_NAME_STATIC, key)) && MainView.prototype.name != key) {
        //             this.CloseView(key)
        //         }
        //     }
        // }
        let mView = this._views.get(MainView.prototype.name);
        if (mView)
            mView.visible = show_main
    }

    public ShowMain(isShow: boolean) {
        // for (let [key, value] of this._views) {
        //     if (key == MainView.prototype.name) {
        //         this._views.get(MainView.prototype.name).view.visible = true
        //     } else {
        //         if (!GetCfgValue(VIEW_NAME_STATIC, key)) {
        //             this.CloseView(key)
        //         }
        //     }
        // }

        for (let [key, value] of this._views) {
            let view: BaseView = this._views.get(key)
            if (view) {
                if (MAIN_SHOW_VIEW[key]) {
                    this._views.get(key).view.visible = isShow
                }
            }
        }
    }

    public ShowBattle(show: boolean) {
        for (let [key, value] of this._views) {
            let view: BaseView = this._views.get(key)
            if (view) {
                if (!GetCfgValue(VIEW_NAME_STATIC, key) || BATTLE_CACHE_VIEW[key]) {
                    if (SHOW_BATTLE_VIEW[key]) {
                        this._views.get(key).view.visible = show
                    } else {
                        let layer = view.ViewRegCfg().LayerType;
                        if (layer == ViewLayer.ButtomMain || BATTLE_CACHE_VIEW[key]) {
                            if(this._views.get(key).view){
                                this._views.get(key).view.visible = !show
                            }else{
                                this.CloseView(view);
                            }
                        } else if (show) {
                            this.CloseView(view);
                        }
                    }
                }
            }
        }
    }

    public ShowSkip() {
        for (let [key, value] of this._views) {
            let view: BaseView = this._views.get(key)
            if (view) {
                let layer = view.ViewRegCfg().LayerType;
                if (layer == ViewLayer.Normal) {
                    this.CloseView(view);
                }
            }
        }
    }

    public IsMainViewActive() {
        if (this._views.get(MainView.prototype.name)) {
            return this._views.get(MainView.prototype.name).view.visible;
        }
        return false;
    }

    public AddOrder(layer: number) {
        let self = this;
        let order = 0;
        const orderStack = self.sortOrder[layer];
        if (orderStack == null || orderStack.length == 0) {
            order = layer * 10000;
            const stack: number[] = [];
            stack.push(order);
            self.sortOrder[layer] = stack;
        } else {
            order = orderStack[orderStack.length - 1] + 100;
            orderStack.push(order);
        }

        return order;
    }

    public RemoveOrder(order: number) {
        let self = this;
        const layer = Math.floor(order / 10000);
        const orderStack = self.sortOrder[layer];
        for (let i = 0; i < orderStack.length; ++i) {
            if (orderStack[i] == order) {
                orderStack.splice(i, 1);
                return;
            }
        }
    }

    private loadFont() {
        ResManager.Inst().Load<Font>
            (`font/chuziti`,
                (err, font) => {
                    if (err != null) {
                        console.error(err);
                        return;
                    }
                    fgui.registerFont("chuziti", font);
                    this.loadCount++;
                    this.loadComplete();
                }
            );
    }

    private loadLocalization() {
        ResManager.Inst().Load(LH.LangPath(), (err, xml) => {
            if (err != null) {
                console.error(err);
                return;
            }
            fgui.UIPackage.setStringsSource(xml.toString());
            this.loadCount++;
            this.loadComplete();
        })


    }

    private loadFirstShowCommonPack() {
        const packNames = ConstValue.FirstShowPoolPackNames;
        let loadPackageCount = 0;
        for (let index = 0; index < packNames.length; index++) {
            const packName = packNames[index];
            const path = ResPath.UIPackage(packName);
            let poolPackages = ViewManager.Inst().poolPackages;
            const pIndex = poolPackages.indexOf(packName);
            if (pIndex === -1) {
                fgui.UIPackage.loadPackage(path, (error: any, pkg: fgui.UIPackage) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    loadPackageCount++;
                    const cIndex = ConstValue.PoolPackNames.indexOf(packName);
                    if (cIndex >= 0) {
                        poolPackages.push(packName);
                    }
                    if (loadPackageCount == packNames.length) {
                        this.loadCount++
                        this.firstSceneExtendsPackageItem();
                        this.loadComplete();
                    }
                })
            }
        }
    }

    private firstSceneExtendsPackageItem() {
        fgui.UIObjectFactory.setLoaderExtension(EGLoader);
        let url = fgui.UIPackage.getItemURL("CommonScreen", "UISpineShow");
        fgui.UIObjectFactory.setExtension(url, UISpineShow);
    }

    public LoadCommonPack(onCom: () => void) {
        if (this._commonPkgLoaded) {
            onCom();
            return;
        }
        const packNames = ConstValue.PoolPackNames;
        let loadPackageCount = 0;
        for (let index = 0; index < packNames.length; index++) {
            const packName = packNames[index];
            const path = ResPath.UIPackage(packName);
            let poolPackages = ViewManager.Inst().poolPackages;
            const pIndex = poolPackages.indexOf(packName);
            if (pIndex === -1) {
                fgui.UIPackage.loadPackage(path, (error: any, pkg: fgui.UIPackage) => {
                    if (error) {
                        LogWxError("包加载失败", packName, error);
                        ChannelAgent.Inst().wxModal(Language.Common.LoadAssetFialTitle, Language.Common.LoadAssetFialTips, ()=>{
                            ChannelAgent.Inst().RestartProgram();
                        }, null, false);
                        return;
                    }
                    loadPackageCount++;
                    const cIndex = ConstValue.PoolPackNames.indexOf(packName);
                    if (cIndex >= 0) {
                        poolPackages.push(packName);
                    }
                    if (loadPackageCount == packNames.length) {
                        this.extendsPackageItem();
                        this._commonPkgLoaded = true;
                        onCom();
                    }
                })
            }
        }

    }

    //扩展那些公用的组件
    private extendsPackageItem() {
        let url = "";
        //拓展RedPoint组件
        url = fgui.UIPackage.getItemURL("CommonWidgets", "RedPoint");
        fgui.UIObjectFactory.setExtension(url, RedPoint);

        url = fgui.UIPackage.getItemURL("CommonItem", "UIEffectShow");
        fgui.UIObjectFactory.setExtension(url, UIEffectShow);

        //拓展HeroCell组件
        url = fgui.UIPackage.getItemURL("CommonItem", "HeroCell");
        fgui.UIObjectFactory.setExtension(url, HeroCell);
        //拓展HeroCell组件
        url = fgui.UIPackage.getItemURL("CommonItem", "HeroItem");
        fgui.UIObjectFactory.setExtension(url, HeroItem);
        //拓展HeroCell组件
        url = fgui.UIPackage.getItemURL("CommonItem", "HeroProgress");
        fgui.UIObjectFactory.setExtension(url, HeroProgress);
        //拓展HeroCell组件
        url = fgui.UIPackage.getItemURL("CommonItem", "ItemCell");
        fgui.UIObjectFactory.setExtension(url, BaseItem);
        //拓展HeadItem组件
        url = fgui.UIPackage.getItemURL("CommonItem", "HeadItem");
        fgui.UIObjectFactory.setExtension(url, HeadItem);

        url = fgui.UIPackage.getItemURL("CommonItem", "LoseTempleHeroitem");
        fgui.UIObjectFactory.setExtension(url, LoseTempleHeroitem);

        //拓展CommonBoard1组件
        url = fgui.UIPackage.getItemURL("CommonBoard", "CommonBoard1");
        fgui.UIObjectFactory.setExtension(url, CommonBoard1);

        //拓展CommonBoard2组件
        url = fgui.UIPackage.getItemURL("CommonBoard", "CommonBoard2");
        fgui.UIObjectFactory.setExtension(url, CommonBoard2);

        //拓展CommonBoard3组件
        url = fgui.UIPackage.getItemURL("CommonBoard", "CommonBoard3");
        fgui.UIObjectFactory.setExtension(url, CommonBoard3);

        //拓展CommonBoard4组件
        url = fgui.UIPackage.getItemURL("CommonBoard", "CommonBoard4");
        fgui.UIObjectFactory.setExtension(url, CommonBoard4);

        //拓展CommonBoard5组件
        url = fgui.UIPackage.getItemURL("CommonBoard", "CommonBoard5");
        fgui.UIObjectFactory.setExtension(url, CommonBoard3);

        //拓展ButtonTab1组件
        url = fgui.UIPackage.getItemURL("CommonBoard", "ButtonTab1");
        fgui.UIObjectFactory.setExtension(url, CommonBoardTab1);

        //拓展CurrencyShow组件
        url = fgui.UIPackage.getItemURL("CommonCurrency", "CurrencyShow");
        fgui.UIObjectFactory.setExtension(url, CurrencyShow);

        //拓展ExpShow组件
        url = fgui.UIPackage.getItemURL("CommonCurrency", "ExpShow");
        fgui.UIObjectFactory.setExtension(url, ExpShow);

        //扩展ItemCell组件
        url = fgui.UIPackage.getItemURL("CommonItem", "ItemCell");
        fgui.UIObjectFactory.setExtension(url, ItemCell);

        //拓展TimeMeter组件
        url = fgui.UIPackage.getItemURL("CommonWidgets", "TimeMeter");
        fgui.UIObjectFactory.setExtension(url, TimeMeter);

        url = fgui.UIPackage.getItemURL("CommonItem", "HeroSkillCellItem");
        fgui.UIObjectFactory.setExtension(url, HeroSkillCellItem);

        //扩展CommonComboBox组件
        url = fgui.UIPackage.getItemURL("CommonComboBox", "ComboBox");
        fgui.UIObjectFactory.setExtension(url, CommonComboBox);

        //扩展FlyIcon组件
        url = fgui.UIPackage.getItemURL("CommonWidgets", "FlyIcon");
        fgui.UIObjectFactory.setExtension(url, FlyIcon);
    }

    private loadComplete() {
        let self = this;
        if (self.loadCount === self.needLoadCount) {
            self.initCom();
            self.initCom = null;
            self.loadCount = 0;
        }
    }

    //获取显示屏幕全屏大小
    public GetShowScreenSize(): Vec2 {
        let vec2Cache = new Vec2();
        let width = fgui.GRoot.inst.width;// > 1125 ? 1125 : fgui.GRoot.inst.width;
        let height = fgui.GRoot.inst.height;
        vec2Cache.set(width, height);
        return vec2Cache
    }

    //获取刘海屏幕全屏大小
    public GetLiuHaiScreenSize(): Vec2 {
        let vec2Cache = new Vec2();
        let width = fgui.GRoot.inst.width;// > 1125 ? 1125 : fgui.GRoot.inst.width;
        let height = fgui.GRoot.inst.height;
        if (sys.platform == sys.Platform.WECHAT_GAME || sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
            let wx = PreloadToolFuncs.wx;
            if (wx) {
                let sysinfo = wx.getSystemInfoSync();
                let safeArea = sysinfo.safeArea;
                if (safeArea) {
                    let topOff = sysinfo.platform == "ios" ? 18 : 0;
                    height = height - (height / sysinfo.screenHeight) *
                        ((safeArea.top > topOff) ? (safeArea.top - topOff) : safeArea.top);
                }
            }
        }
        vec2Cache.set(width, height);
        return vec2Cache
    }

    //获取显示屏幕全屏大小2
    public GetLiuHaiScreenSize2(): Vec2 {
        let vec2Cache = new Vec2();
        let width = fgui.GRoot.inst.width;// > 1125 ? 1125 : fgui.GRoot.inst.width;
        let height = fgui.GRoot.inst.height;
        if (sys.platform == sys.Platform.WECHAT_GAME || sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
            let wx = PreloadToolFuncs.wx;
            if (wx) {
                let sysinfo = wx.getSystemInfoSync();
                let safeArea = sysinfo.safeArea;
                if (safeArea) {
                    height = height - 2 * safeArea.top;
                }
            }
        }
        height -= 180;
        vec2Cache.set(width, height);
        return vec2Cache
    }

    public SetExtension(pkgName: string, resName: string, view_class: any) {
        let url = fgui.UIPackage.getItemURL(pkgName, resName);
        fgui.UIObjectFactory.setExtension(url, view_class);
    }

    public GetPackageItem<T extends fgui.GComponent>(pkgName: string, resName: string, parent?: any) {
        let obj = <T>fgui.UIPackage.createObject(pkgName, resName).asCom;
        let child = parent.addChild(obj);
        child.setPosition(0, 0);
        return obj;
    }
    /**
     * name
     */
    public CurViewOnlyMain(): boolean {
        // this._opens.forEach(element => {
        //     console.log(element);
        // });
        // console.log(this._opens.length);
        return this._opens.length <= 5;
    }

    private _regList: { [key: string]: { comp?: fgui.GComponent, data?: { p: fgui.GComponent, index: number }[] } } = {};
    public registComp(vClass: new () => fgui.GComponent, obj: fgui.GComponent) {
        let data: { comp?: fgui.GComponent, data?: { p: fgui.GComponent, index: number }[] } = this._regList[vClass.name];
        if (!data) {
            data = this._regList[vClass.name] = {}
        }
        data.comp = obj;
    }
    public registParent(vClass: new () => fgui.GComponent, newP: fgui.GComponent, index?: number) {
        let data: { comp?: fgui.GComponent, data?: { p: fgui.GComponent, index: number }[] } = this._regList[vClass.name];
        if (!data) {
            return;
        }
        let obj = data.comp;
        let d_comp = data.data;
        if (!d_comp) {
            d_comp = data.data = [];
        }
        d_comp.push({ p: obj.parent, index: obj.node.getSiblingIndex() });
        if (index && !isNaN(index))
            newP.addChildAt(obj, index);
        else {
            newP.addChild(obj)
        }
    }

    public returnParent(vClass: new () => fgui.GComponent) {
        let data_comp: { comp?: fgui.GComponent, data?: { p: fgui.GComponent, index: number }[] } = this._regList[vClass.name];
        if (data_comp) {
            let d_comp = data_comp.data;
            if (d_comp && d_comp.length) {
                let data = data_comp.data.pop();
                let index = data.index;
                if (index && !isNaN(index))
                    data.p.addChildAt(data_comp.comp, index);
                else {
                    data.p.addChild(data_comp.comp)
                }
            }
        }
    }
}

//Debugger.ExportGlobalForDebug('fgui', fgui);