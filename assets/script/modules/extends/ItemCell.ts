import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { ItemCache } from "modules/bag/ItemData";
// import { ItemInfoView } from "modules/item_info/ItemInfoView";
import { CellClicks, CellFlushs } from "./ItemCellFuncs";

export class ItemCell extends fgui.GComponent {
    private viewNode: { [key: string]: any } = {
        QuaIcon: <fgui.GLoader>null,
        Icon: <fgui.GLoader>null,
        RbTxt: <fgui.GTextField>null,
        PieceShow: <fgui.GImage>null,
        SShow: <fgui.GImage>null,
    };
    private _data: any = null;
    private _config: any = null;
    public constructor() {
        super();
    }
    protected onConstruct(): void {
        this.onClick(this.OnClick, this);
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }
    //data == Item.New
    public SetData(data: any): void {
        if (!data) {
            this.ClearFlush();
            return
        }
        if (this._data) {
            if (this._data.ItemId() != this._data.ItemId()) {
                this.ClearFlush();
            }
        }
        this._data = data;
        CellFlushs.ReadyItem(this);
    }
    //这里的view是Item的子节点
    public get view(): any {
        return this.viewNode;
    }
    //ClearFlush
    private ClearFlush() {
        this.view.QuaIcon.icon = null;
        this.view.Icon.icon = null;
        this.view.RbTxt.text = "";
        this.view.PieceShow.visible = false;
        this.view.SShow.visible = false;
    }
    //OnClick外部点击
    private OnClick(): void {
        if (this._data == null) {
            return;
        }
        if (this.Config("is_click") == false) {
            return;
        }
        if (this._data.IsClick() == false) {
            return;
        }
        if (this._data.ItemId() != 0) {
            let big_type = this._data.BigType();
            if (CellClicks[big_type]) {
                CellClicks[big_type](this._data);
            } else {
                CellClicks[-1](this._data)
            }
        }
    }
    //onDestroy
    protected onDestroy(): void {
        if (this._data) {
            ItemCache.Destory(this._data);
            this._data = null;
        }
    }

    //Item.New
    public GetData(): any {
        return this._data;
    }

    //UI 自定义配置 JSON写法
    public Config(key?: string): any {
        if (this.data != undefined) {
            if (this._config == null) {
                this._config = JSON.parse(this.data);
            }
        }
        if (this._config && key != null) {
            return this._config[key]
        }
        return this._config;
    }
}