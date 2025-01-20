import * as fgui from "fairygui-cc";

import { BlockInputEvents, js } from "cc";
import { HandleBase, HandleCollector } from "core/HandleCollector";
import { LooperHandle, SMDHandle } from "data/HandleCollectorCfg";
import { ViewManager, c_viewRegInfo } from "manager/ViewManager";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";

import { EDITOR } from "cc/env";
import { GetCfgValue } from "config/CfgCommon";
import { LogError, LogWxError } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { tabberInfo } from "modules/common_board/BoardData";
import { BaseBoard } from "modules/extends/BaseBoard";
import { ResPath } from "utils/ResPath";
import { Vec2 } from "../../../../extensions/cocos-build-template/@types/packages/scene/@types/public";
import { CommonEvent } from "./CommonEvent";
import { ConstValue } from "./ConstValue";
import { EventCtrl } from "./EventCtrl";
import { IBaseView } from "./IBaseVIew";
import { QuoteCtrl } from "./QuoteCtrl";
import { HTTP } from "../../helpers/HttpHelper";

const showHideAnimation = false;

//界面层级

export enum ViewLayer {
    ButtomMain = 10,
    /**隐藏主界面 */
    Buttom = 15,
    Normal = 20,
    Top = 30,
    OpenData = 40,
    Battle,
    BgBlockClose,
    BgBlock
}


//窗口遮罩方式
export enum ViewMask {
    None = 0,
    Block = 1,				//只遮挡下层事件
    BgBlock = 2,			//遮挡下层事件并显示半透明背景
    BlockClose = 3,			//遮挡下层事件并点击关闭
    BgBlockClose = 4,		//遮挡下层事件并显示半透明背景且点击关闭
}
enum ViewState {
    Close = 0,//关闭
    Load = 1,//加载中
    Loaded = 2,//加载完毕
    Open = 3,//打开
}
//UIPackName 导出包路径
//ViewName  界面
//LayerType 层级 enum:ViewLayer
//ViewMask  窗口遮罩方式 enum:ViewMask
export type viewRegcfg = {
    UIPackName: string,
    /**依赖资源包 */
    RelyOnPack?: string[],
    ViewName: string,
    LayerType?: number,
    ViewMask?: number,
    ShowAnim?: boolean,
    OpenAudio?: AudioTag,
    CloseAudio?: AudioTag,
    NotHideAnim?: boolean,
    ViewCache?: boolean,
}

export type boardCfg = {
    BoardTitle?: string,
    TabberCfg?: tabberInfo[],
    HideTabbar?: boolean,   //true隐藏标签页
    Vect?: Vec2,
    ShowTabName?: boolean,  //标题是否显示Tab名字
}


export type extendsInfo = {
    ResName: string,
    ExtendsClass: any,
    PkgName?: string
}

export type WaitHandle = {
    handleName: string,
    complete: boolean;
}

let handleKeys = {
    WaitOpen: "WaitOpen"
}


/**
 * 面板加载完成函数执行顺序
 * InitData() //面板数据初始化
 * InitUI()  //面板进行显示初始化
 * DoOpenWaitHandle() //面板开启前等待已添加Handle完成
 * OpenCallBack() // 面板开启执行函数
 * CloseCallBack() //面板关闭执行函数
*/

export var ViewShowAnimPivot = {
    ["MainOtherView"]: { x: 0.96, y: 0.1 },
    ["BoxPreviewView"]: { x: 0.5, y: 0.2 },
    ["HeroSkillInfoView"]: { x: 0.5, y: 0.5 },
}

let VIEW_NAME_INIT: { [key: string]: boolean } = {
    ["HeroView"]: true,
    ["ShopView"]: true,
}

export class BaseView implements IBaseView {
    static InitShowReady: boolean
    static registerComp<T extends fgui.GComponent>(constructor: new (p?: any) => T): void {
        BaseView.RegisterComp(constructor)
    }
    private static RegisterComp<T extends fgui.GComponent | BaseView>(vClass: new (p?: any) => T): string {
        let key: string
        if (!EDITOR) {
            let frameInfo = (cc['_RF'] as any).peek();
            js.setClassName(frameInfo.script, vClass);
            key = js.getClassName(vClass);
        } else {
            key = vClass.name;
        }
        vClass.prototype.name = key
        return key;
    }
    public name: string;
    static registView<T extends BaseView>(constructor: new (p?: any) => T): void {
        BaseView.RegisterView(constructor)
    }
    static regNewView<T extends BaseView>(constructor: new (p?: any) => T): void {
        BaseView.RegisterView(constructor, true)
    }
    public static readonly _regesterInfo: { [key: string]: c_viewRegInfo } = {};
    private static RegisterView<T extends BaseView>(vClass: new (p?: any) => T, isNew: boolean = false): void {
        if (vClass == null) {
            return;
        }
        let key: string
        key = BaseView.RegisterComp(vClass)
        let regInfo = BaseView._regesterInfo;
        if (regInfo[key]) {
            return;
        }
        let value = {
            viewClass: vClass,
            key: key,
            isNew: isNew,
        }
        regInfo[key] = value;
    }
    private static onExtendsCfg: { [key: string]: boolean } = {};
    protected viewNode: { [key: string]: fgui.GObject } = null;
    protected viewRegcfg: viewRegcfg = null;
    protected boardCfg: boardCfg = null;
    protected extendsCfg: extendsInfo[] = null;
    protected extendsCfgOther: extendsInfo[] = null;
    protected handleCollector: HandleCollector;
    public get handleCollectors() {
        return this.handleCollector
    }
    /**类名 */
    private cName: string;
    private loadPacks: string[] = [];
    private waitHandles: Set<WaitHandle> = new Set<WaitHandle>();
    private addComponents: fgui.GComponent[] = [];
    private viewParams: any;
    private viewBoard: BaseBoard;
    private screenShowSize: Vec2;
    private screenLiuHaiSize: Vec2;
    private rely: string[];
    private hasLoading: boolean;
    private _visible = true;
    public set visible(v: boolean) {
        this._visible = v;
        if (this.view) {
            this.view.visible = v;
        }
    }
    private state = ViewState.Close;
    //是否加载完成
    private _isLoaded = false;
    get isLoaded() {
        return this._isLoaded;
    }

    constructor() {
        // v && (this.cName = v.key);
        this.handleCollector = HandleCollector.Create();
    }

    protected mView: fgui.GComponent;
    public get view(): fgui.GComponent {
        return this.mView;
    }
    public set view(v: fgui.GComponent) {
        this.mView = v;
    }

    public ViewRegCfg(): viewRegcfg {
        return this.viewRegcfg;
    }

    public BoardCfg(): boardCfg {
        return this.boardCfg;
    }

    public ExtendsCfg(): extendsInfo[] {
        return this.extendsCfg;
    }

    public ExtendsCfgOther(): extendsInfo[] {
        return this.extendsCfgOther;
    }

    public ViewNode(): any {
        return this.viewNode;
    }

    public ViewParams(): any {
        return this.viewParams;
    }

    public fguiData(): string {
        if (this.mView && this.mView.baseUserData && (typeof (this.mView.baseUserData) == "string")) {
            return this.mView.baseUserData
        }
    }

    private openCallBack(): void {
        if (this.ViewRegCfg().ShowAnim) {
            let pivot = GetCfgValue(ViewShowAnimPivot, this.ViewRegCfg().ViewName)
            this.view.pivotX = pivot ? pivot.x : 0.5
            this.view.pivotY = pivot ? pivot.y : 0.5
            this.view.scaleX = 0.8
            this.view.scaleY = 0.8
            this.view.visible = true
            let show: Function = () => {
                fgui.GTween.to(0.8, 1.1, 0.12)
                    .setEase(fgui.EaseType.QuartOut)
                    .onUpdate((tweener: fgui.GTweener) => {
                        if (this.view && this.view.node) {
                            this.view.scaleX = tweener.value.x
                            this.view.scaleY = tweener.value.x
                        }
                    }).onComplete(() => {
                        fgui.GTween.to(1.1, 1, 0.12)
                            .setEase(fgui.EaseType.QuartOut)
                            .onUpdate((tweener: fgui.GTweener) => {
                                if (this.view && this.view.node) {
                                    this.view.scaleX = tweener.value.x
                                    this.view.scaleY = tweener.value.x
                                }
                            }).onComplete(() => {
                                this.openCallBackEnd();
                            })
                    })
            }
            show();
        } else {
            this.openCallBackEnd();
        }
        if (this.ViewRegCfg().OpenAudio) {
            AudioManager.Inst().PlayUIAudio(this.ViewRegCfg().OpenAudio)
        }
        const lType = this.ViewRegCfg().LayerType ?? ViewLayer.Normal;
        if (ViewLayer.Buttom == lType) {
            ViewManager.Inst().MainViewVisible(false, this.ViewRegCfg().ViewName);
        }
    }

    private closeCallBack(callback: Function): void {
        if (showHideAnimation && this.ViewRegCfg().ShowAnim && !this.ViewRegCfg().NotHideAnim) {
            let pivot = GetCfgValue(ViewShowAnimPivot, this.ViewRegCfg().ViewName)
            this.view.pivotX = pivot ? pivot.x : 0.5
            this.view.pivotY = pivot ? pivot.y : 0.5
            this.view.scaleX = 1
            this.view.scaleY = 1
            this.view.visible = true
            let show: Function = () => {
                fgui.GTween.to(1, 1.1, 0.02)
                    .setEase(fgui.EaseType.QuartIn)
                    .onUpdate((tweener: fgui.GTweener) => {
                        if (this.view && this.view.node) {
                            this.view.scaleX = tweener.value.x
                            this.view.scaleY = tweener.value.x
                        }
                    }).onComplete(() => {
                        fgui.GTween.to(1.1, 0.2, 0.1)
                            .setEase(fgui.EaseType.QuartIn)
                            .onUpdate((tweener: fgui.GTweener) => {
                                if (this.view && this.view.node) {
                                    this.view.scaleX = tweener.value.x
                                    this.view.scaleY = tweener.value.x
                                }
                            }).onComplete(() => {
                                callback();
                            })
                    })
            }
            show();
        } else {
            callback()
        }
        if (this.ViewRegCfg().CloseAudio) {
            AudioManager.Inst().PlayUIAudio(this.ViewRegCfg().CloseAudio)
        }
        const lType = this.ViewRegCfg().LayerType ?? ViewLayer.Normal;
        if (ViewLayer.Buttom == lType) {
            ViewManager.Inst().MainViewVisible(true);
        }
    }

    closeView() {
        ViewManager.Inst().CloseView(this);
    }

    InitData(param: any): void {

    }

    InitUI(): void {

    }

    DoOpenWaitHandle(): void {

    }

    OpenCallBack(): void {

    }

    CloseCallBack(): void {

    }

    WindowSizeChange() {

    }

    /**
     * 面板进行显示初始化
     */
    InitListener(): void { }

    protected onShowEnd() {

    }

    public Open(): void {
        let self = this
        self.view.visible = (!BaseView.InitShowReady || !GetCfgValue(VIEW_NAME_INIT, this.ViewRegCfg().ViewName)) && (!self.ViewRegCfg().ShowAnim ?? true);
        self.loadComplete = null;
        self.initComplete = null;
        this.state = ViewState.Open;
        self.OpenCallBack();
        fgui.GRoot.inst.addChild(self.view);
        self.openCallBack();
    }

    public Close(): void {
        let self = this;
        this.state = ViewState.Close;
        if (!self._isLoaded) {
            self.loadComplete = null;
            self.initComplete = null;
            self = null;
            return;
        }

        self.CloseCallBack();
        self.closeCallBack(() => {
            if (self.ViewRegCfg().ViewCache) {
                self.view && (self.view.visible = false)
                return
            }
            if (self.view) {
                self.RemoveSmartDataCare();
                self.removePackages()
                ViewManager.Inst().RemoveOrder(self.view.sortingOrder);
                if (ViewManager.Inst().getViewRegInfo(this).isNew) {
                    fgui.GRoot.inst.removeChild(self.view);
                } else {
                    self.view.dispose();
                    self.view = null;
                }
            }
            // self.viewHeight
            // self.dispose();
            self.loadComplete = null;
            self.initComplete = null;
            self = null;
        });
    }

    private openCallBackEnd() {
        if (this.state == ViewState.Open) {
            this.onShowEnd();
        }
    }

    public createWaitHandle(name: string): WaitHandle {
        let handle: WaitHandle = {
            handleName: name,
            complete: false
        }
        return handle
    }

    public AddWaitHandle(handle: WaitHandle) {
        this.waitHandles.add(handle);
    }

    public AddSmartDataCare(smdata: any, callback: Function, ...keys: string[]): HandleBase {
        let self = this;
        var handle = SMDHandle.Create(smdata, callback, ...keys)
        self.handleCollector.Add(handle);
        return handle
    }

    public RemoveSmartDataCare() {
        let self = this;
        if (!ViewManager.Inst().getViewRegInfo(this).isNew) {
            if (self.handleCollector) {
                HandleCollector.Destory(self.handleCollector);
            }
            self.handleCollector = null;
        } else {
            self.handleCollector.RemoveAll();
            for (const key in self.viewNode) {
                const element = self.viewNode[key];
                if (element)
                    element.clearClick();
            }
        }
    }


    public AddComponent(com: fgui.GComponent) {
        let self = this;
        self.addComponents.push(com);
    }

    public ReSetWindowSize() {
        let self = this;
        self.view.center();
        self.updataView();
    }

    private updataView() {
        let self = this;
        self.screenShowSize = ViewManager.Inst().GetShowScreenSize();
        self.screenLiuHaiSize = ViewManager.Inst().GetLiuHaiScreenSize();
        let fullscreen = self.view.getChild("fullscreen");
        if (fullscreen) {
            fullscreen.setSize(self.screenShowSize.x, self.screenShowSize.y);
            fullscreen.center();
        }

        let liuhaiscreen = self.view.getChild("liuhaiscreen");
        if (liuhaiscreen) {
            // liuhaiscreen.center()
            liuhaiscreen.setSize(self.screenLiuHaiSize.x, self.screenLiuHaiSize.y);
        }

        let liuhaiscreen2 = self.view.getChild("liuhaiscreen2");
        if (liuhaiscreen2) {
            let liuhaisize2 = ViewManager.Inst().GetLiuHaiScreenSize2();
            liuhaiscreen2.setSize(liuhaisize2.x, liuhaisize2.y);
            liuhaiscreen2.center();
        }

        var board: BaseBoard = self.view.getChild("board");
        if (board) {
            fullscreen = board.getChild("fullscreen");
            if (fullscreen) {
                fullscreen.setSize(self.screenShowSize.x, self.screenShowSize.y);
                fullscreen.center();
            }
            liuhaiscreen = board.getChild("liuhaiscreen");
            if (liuhaiscreen) {
                // liuhaiscreen.center()
                liuhaiscreen.setSize(self.screenLiuHaiSize.x, self.screenLiuHaiSize.y);
            }
            board.WindowSizeChange();
        }
        self.WindowSizeChange();
    }

    /**
     * 加载面板所需资源
     */
    private loadComplete: Function;
    private initComplete: Function;
    private loadPackageCount = 0;
    public LoadResource(info: c_viewRegInfo, loadComplete: Function, initComplete: Function): void {
        let self = this;
        self.loadPackageCount = 0;
        self.screenShowSize = ViewManager.Inst().GetShowScreenSize();
        self.screenLiuHaiSize = ViewManager.Inst().GetLiuHaiScreenSize();
        self.viewParams = info.param;
        self.loadPacks = self.ViewRegCfg().UIPackName.split(",");
        self.loadComplete = loadComplete;
        self.initComplete = initComplete;
        for (let index = 0; index < self.loadPacks.length; index++) {
            const packName = self.loadPacks[index];
            const path = ResPath.UIPackage(packName);
            // let poolPackages = ViewManager.Inst().poolPackages;
            // const pIndex = poolPackages.indexOf(packName);
            let has = ResManager.Inst().hasPackage(packName);
            let hasLoading = QuoteCtrl.Inst().Has(packName);
            let hasLoading2 = ResManager.Inst().hasLoading(packName);
            QuoteCtrl.Inst().Add(packName, CommonEvent.FGUI_PACKAGE);
            if (!has) {
                self.hasLoading = true;
                if (hasLoading && hasLoading2) {
                    EventCtrl.Inst().on(CommonEvent.FGUI_PACKAGE_ONLOAD, this.onOnePackLoadByEvent, this)
                } else {
                    ResManager.Inst().addLoading(packName)
                    fgui.UIPackage.loadPackage(path, (error: any, pkg: fgui.UIPackage) => {
                        if (error) {
                            ResManager.Inst().removeLoading(packName);
                            console.error(error);
                            return;
                        }
                        ResManager.Inst().onLoadPackage(packName);
                        // const cIndex = ConstValue.PoolPackNames.indexOf(packName);
                        // if (cIndex >= 0) {
                        //     poolPackages.push(packName);
                        // }
                        self.onOnePackLoad();
                    })
                }
            } else {
                self.hasLoading = false;
                self.onOnePackLoad();
            }
        }
    }

    private onOnePackLoadByEvent(name: string) {
        let t = this;
        const index = t.loadPacks.indexOf(name)
        if (index != -1) {
            t.onOnePackLoad();
        }
    }

    private onOnePackLoad() {
        let t = this;
        t.loadPackageCount++;
        if (t.loadPackageCount === t.loadPacks.length) {
            EventCtrl.Inst().off(CommonEvent.FGUI_PACKAGE_ONLOAD, this.onOnePackLoadByEvent, this)
            t.beginLoad();
        }
    }

    private beginLoad() {
        let self = this;
        const pName = self.loadPacks[0];
        const vName = self.ViewRegCfg().ViewName;
        let extendCfg = self.ExtendsCfg();
        if (extendCfg && !BaseView.onExtendsCfg[this.name]) {
            for (let index = 0; index < extendCfg.length; index++) {
                const cfg = extendCfg[index];
                self.setComponentExtension(cfg);
            }
            BaseView.onExtendsCfg[this.name] = true
            // Object.defineProperty(this, key, { value: val, writable: true })
        }
        if (self.view && !self.hasLoading) {
            self.loadCompleteCallBack(self);
        } else {
            for (const key in self.viewNode) {
                self.viewNode[key] = null;
            }
            let handler = new fgui.AsyncOperation();
            handler.callback = (obj: fgui.GObject) => {
                self.loadCompleteCallBack(self, obj);
            }
            handler.createObject(pName, vName);

            // let obj = fgui.UIPackage.createObject(pName, vName);
            // self.loadCompleteCallBack(self, obj);
        }

    }

    private loadCompleteCallBack(self: BaseView, obj?: fgui.GObject) {
        try {


            if (self.initComplete) {
                const vName = self.ViewRegCfg().ViewName;
                const lType = self.ViewRegCfg().LayerType ?? ViewLayer.Normal;
                obj && (self.view = obj.asCom)
                self.view.visible = false;
                self.view.name = vName;
                self.view.sortingOrder = ViewManager.Inst().AddOrder(lType)
                self.view.node.name = self.view.name
                self.view.center();


                this.rely = self.ViewRegCfg().RelyOnPack;
                let fguiData = this.fguiData()
                if (fguiData) {
                    let j_fguiData = JSON.parse(fguiData);
                    if (j_fguiData) {
                        if (j_fguiData[ConstValue.FGUIBaseUserData.FGUIBaseUserValue]) {
                            ConstValue.FGUIBaseUserValue = j_fguiData[ConstValue.FGUIBaseUserData.FGUIBaseUserValue]
                        }
                        if (j_fguiData[ConstValue.FGUIBaseUserData.Rely])
                            this.rely = j_fguiData[ConstValue.FGUIBaseUserData.Rely]
                        if (j_fguiData[ConstValue.FGUIBaseUserData.Quete])
                            QuoteCtrl.c_time = +j_fguiData[ConstValue.FGUIBaseUserData.Quete]
                        if (j_fguiData[ConstValue.FGUIBaseUserData.NewView] != undefined) {
                            ViewManager.Inst().getViewRegInfo(this).isNew = j_fguiData[ConstValue.FGUIBaseUserData.NewView]
                        }
                        if (j_fguiData[ConstValue.FGUIBaseUserData.poolHttp] != undefined) {
                            HTTP.isPool = j_fguiData[ConstValue.FGUIBaseUserData.poolHttp]
                        }
                    }
                }

                if (this.rely) {
                    this.rely.forEach(element => {
                        QuoteCtrl.Inst().Add(element, CommonEvent.FGUI_PACKAGE);
                    });
                }
                if (obj) {
                    let fullscreen = self.view.getChild("fullscreen");
                    if (fullscreen) {
                        fullscreen.setSize(self.screenShowSize.x, self.screenShowSize.y);
                        fullscreen.center();
                    }

                    let liuhaiscreen = self.view.getChild("liuhaiscreen");
                    if (liuhaiscreen) {
                        // liuhaiscreen.center()
                        liuhaiscreen.setSize(self.screenLiuHaiSize.x, self.screenLiuHaiSize.y);
                    }

                    if (self.ViewNode()) {
                        self.RegNodeInfo();
                    }
                    if (self.BoardCfg()) {
                        self.initCommonBoard();
                    }
                    this.InitListener();
                }
                self.loadComplete && self.loadComplete();
                self.DoOpenWaitHandle();
                self.doWaitHandles();
                this._isLoaded = true;
            }
        } catch (e) {
            if (e.stack) {
                LogWxError("view-" + self.name, e.stack);
            } else {
                LogWxError("view-" + self.name);
            }
            LogError(self.name, e)
        }
    }

    addChild(child: fgui.GObject): fgui.GObject {
        return this.view.addChild(child)
    }

    addChildAt(child: fgui.GObject, index: number): fgui.GObject {
        return this.view.addChildAt(child, index);
    }

    ResetExtension(){
        for (let index = 0; index < this.extendsCfg.length; index++) {
            const cfg = this.extendsCfg[index];
            this.setComponentExtension(cfg);
        }
    }

    protected setComponentExtension(cfg: extendsInfo) {
        let self = this;
        //let url = UIPackage.getItemURL(self.ViewRegCfg().UIPackName, cfg.ResName);
        let url = fgui.UIPackage.getItemURL(cfg.PkgName ?? self.loadPacks[0], cfg.ResName);
        if (url) {
            fgui.UIObjectFactory.setExtension(url, cfg.ExtendsClass);
        } else {
            console.error("setComponentExtension url is null", cfg.ExtendsClass);
        }
    }

    private RegNodeInfo() {
        let nodeInfo = ViewManager.Inst().RegNodeInfo(this.ViewNode(), this.view);
        return nodeInfo
    }

    private initCommonBoard() {
        let self = this;
        let board: BaseBoard = null;
        board = self.view.getChild("board");
        self.viewBoard = board;
        board.SetParentView(self);
        let fullscreen = board.getChild("fullscreen");
        if (fullscreen) {
            fullscreen.setSize(self.screenShowSize.x, self.screenShowSize.y);
            fullscreen.center();
        }

        let liuhaiscreen = board.getChild("liuhaiscreen");
        if (liuhaiscreen) {
            // liuhaiscreen.center()
            liuhaiscreen.setSize(self.screenLiuHaiSize.x, self.screenLiuHaiSize.y);
        }
        board.WindowSizeChange();
        board.SetData();
    }

    protected KeyVN<T>(key: string): T {
        return this.ViewNode()[key];
    }

    public SelectTabbar(modkey: number) {
        let self = this;
        if (self.viewBoard) {
            self.viewBoard.SelectTabbar(modkey);
        }
    }

    private doWaitHandles() {
        let self = this;
        if (self.waitHandles.size > 0) {
            this.handleCollector.KeyAdd(handleKeys.WaitOpen, LooperHandle.Create(this.checkWaitHandles.bind(this)));
        } else if (self.initComplete) {
            self.initComplete();
        }
    }

    private checkWaitHandles() {
        let self = this;
        let isComplete = true;
        let handles = self.waitHandles;
        for (let handle of handles) {
            if (handle.complete === false) {
                isComplete = false;
                break;
            }
        }
        if (isComplete === true) {
            this.handleCollector.KeyRemove(handleKeys.WaitOpen);
            self.initComplete && self.initComplete();
        }
    }

    private removePackages() {
        let self = this;
        if (this.rely) {
            this.rely.forEach(element => {
                QuoteCtrl.Inst().RemoveRef(element);
            });
        }
        // let poolPackages = ViewManager.Inst().poolPackages;
        for (let index = 0; index < self.loadPacks.length; index++) {
            const packName = self.loadPacks[index];
            QuoteCtrl.Inst().Remove(packName);
            // const pIndex = poolPackages.indexOf(packName);
            // if (pIndex === -1) {
            //     // fgui.UIPackage.removePackage(packName);
            // }
        }
    }
    public SetParentView(parentView: BaseView) {
    }

    public set Touchable(touchable: boolean) {
        this.view.touchable = touchable;
        this.TouchThrow = touchable;
    }

    public set TouchThrow(t: boolean) {
        let comp = this.view.node.getComponent(BlockInputEvents);
        if (!comp)
            comp = this.view.node.addComponent(BlockInputEvents);
        comp.enabled = !t;
    }

    public refreshBgSize(obj: fgui.GObject) {
        let self = this;
        let imgWidth = 800;//self.viewNode.bg.width;
        let imgHeight = 1600;//self.viewNode.bg.height;
        let fullscreen = self.view.getChild("fullscreen");
        let scWidth = fullscreen ? fullscreen.width : imgWidth;
        let scHeight = fullscreen ? fullscreen.height : imgHeight;
        let imgAsp = imgWidth / imgHeight;
        let scAsp = scWidth / scHeight;
        // console.error(`screen:[${scWidth},${scHeight}],img:[${self.viewNode.bg.width},${self.viewNode.bg.height}]`);
        var scale = 1.0;
        if (imgAsp >= scAsp) {
            scale = scHeight / imgHeight;
        }
        else {
            scale = scWidth / imgWidth;
        }
        obj.width = scale * imgWidth;
        obj.height = scale * imgHeight;

    }


    private _hide: boolean = false;
    get hide(): boolean {
        return this._hide;
    }
    set hide(isHide: boolean) {
        if (this._hide != isHide) {
            if (isHide) {
                this.view.alpha = 0;
                this.view.touchable = false;
            } else {
                this.view.alpha = 1;
                this.view.touchable = true;
            }
        }

        this._hide = isHide;
    }
}
