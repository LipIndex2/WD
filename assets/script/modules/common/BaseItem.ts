import { HandleBase, HandleCollector } from "core/HandleCollector";
import { SMDHandle } from "data/HandleCollectorCfg";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";

export class BaseItem extends fgui.GComponent {
    protected viewNode = {};
    protected _data: any = null;
    protected onConstruct() {
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }
    public SetData(data: any) {
        this._data = data;
    }
    public GetData() {
        return this._data;
    }
}

export class BaseItemGB extends fgui.GButton {
    protected viewNode = {};
    protected _data: any = null;
    protected onConstruct() {
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }
    public SetData(data: any) {
        this._data = data;
    }
    public GetData() {
        return this._data;
    }
}

export class BaseItemGL extends fgui.GLabel {
    protected viewNode = {};
    protected _data: any = null;
    protected onConstruct() {
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }
    public SetData(data: any) {
        this._data = data;
    }
    public GetData() {
        return this._data;
    }
}

export class BaseItemGP extends fgui.GProgressBar {
    protected viewNode = {};
    protected _data: any = null;
    protected onConstruct() {
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }
    public SetData(data: any) {
        this._data = data;
    }
    public GetData() {
        return this._data;
    }
}

export class BaseItemCare extends BaseItem {
    private handleCollector: HandleCollector;


    public constructor() {
        super();
        this.handleCollector = HandleCollector.Create();
    }

    protected onConstruct() {
        super.onConstruct();

        this.InitData();
    }

    protected onEnable() {
        this.InitUI();
    }

    protected onDestroy() {
        super.onDestroy()
        HandleCollector.Destory(this.handleCollector);
        this.handleCollector = null;
    }

    public AddSmartDataCare(smdata: any, callback: Function, ...keys: string[]): HandleBase {
        var handle = SMDHandle.Create(smdata, callback, ...keys)
        this.handleCollector.Add(handle);
        return handle
    }

    InitData() {

    }

    InitUI() {

    }
}

export class BaseItemGBCare extends BaseItemGB {
    private handleCollector: HandleCollector;


    public constructor() {
        super();
        this.handleCollector = HandleCollector.Create();
    }

    protected onConstruct() {
        super.onConstruct();

        this.InitData();
    }

    protected onEnable() {
        this.InitUI();
    }

    protected onDestroy() {
        super.onDestroy()
        HandleCollector.Destory(this.handleCollector);
        this.handleCollector = null;
    }

    public AddSmartDataCare(smdata: any, callback: Function, ...keys: string[]): HandleBase {
        var handle = SMDHandle.Create(smdata, callback, ...keys)
        this.handleCollector.Add(handle);
        return handle
    }

    InitData() {

    }

    InitUI() {

    }
}


export class BaseItemGLCare extends BaseItemGL {
    private handleCollector: HandleCollector;


    public constructor() {
        super();
        this.handleCollector = HandleCollector.Create();
    }

    protected onConstruct() {
        super.onConstruct();

        this.InitData();
    }

    protected onEnable() {
        this.InitUI();
    }

    protected onDestroy() {
        super.onDestroy()
        HandleCollector.Destory(this.handleCollector);
        this.handleCollector = null;
    }

    public AddSmartDataCare(smdata: any, callback: Function, ...keys: string[]): HandleBase {
        var handle = SMDHandle.Create(smdata, callback, ...keys)
        this.handleCollector.Add(handle);
        return handle
    }

    InitData() {

    }

    InitUI() {

    }
}

export class BaseItemGPCare extends BaseItemGP {
    private handleCollector: HandleCollector;


    public constructor() {
        super();
        this.handleCollector = HandleCollector.Create();
    }

    protected onConstruct() {
        super.onConstruct();

        this.InitData();
    }

    protected onEnable() {
        this.InitUI();
    }

    protected onDestroy() {
        super.onDestroy()
        HandleCollector.Destory(this.handleCollector);
        this.handleCollector = null;
    }

    public AddSmartDataCare(smdata: any, callback: Function, ...keys: string[]): HandleBase {
        var handle = SMDHandle.Create(smdata, callback, ...keys)
        this.handleCollector.Add(handle);
        return handle
    }

    InitData() {

    }

    InitUI() {

    }
}