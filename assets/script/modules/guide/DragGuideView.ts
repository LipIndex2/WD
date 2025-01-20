import { Vec2 } from "cc";
import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { UH } from "../../helpers/UIHelper";


export class DragGuideViewParam{
    rectW: number;
    rectH: number;
    rectPos: Vec2;
    desc:string;

    constructor(w:number, h:number, rectPos:Vec2, desc:string){
        this.rectH = h;
        this.rectW = w;
        this.rectPos = rectPos;
        this.desc = desc;
    }
}


@BaseView.registView
export class DragGuideView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "BattleGuide",
        ViewName: "DragGuideView",
        LayerType: ViewLayer.Normal + 5,
        ViewMask: ViewMask.None,
    };

    protected viewNode = {
        Block: <fgui.GComponent>null,
        ShouZhi: <fgui.GComponent>null,
        Word: <fgui.GTextField>null,
    };

    private rect: fgui.GObject;
    private param: DragGuideViewParam;

    InitData(param:DragGuideViewParam) {
        this.param = param;
        this.rect = this.viewNode.Block.getChild("Rect");
    }

    OpenCallBack() {
        this.SetRectSize();
        this.ShowShouZhi();
        this.GuideDrag();
    }

    CloseCallBack() {

    }

    GuideDrag(){

    }



    SetRectSize(){
        this.rect.width = this.param.rectW;
        this.rect.height = this.param.rectH;
        this.rect.setPosition(this.param.rectPos.x, this.param.rectPos.y);
    }

    private anima:fgui.Transition;
    ShowShouZhi(){
        let pos = new Vec2(this.rect.x + 100, this.rect.y)
        this.viewNode.ShouZhi.setPosition(pos.x, pos.y);
        this.viewNode.ShouZhi.sortingOrder = 10;
        this.viewNode.ShouZhi.visible = true;
        if(this.anima){
            this.anima.stop();
        }
        this.anima = this.viewNode.ShouZhi.getTransition("right_move");
        if(this.anima){
            this.anima.play(null, -1);
        }
        
        this.viewNode.Word.setPosition(pos.x, pos.y + 150);
        UH.SetText(this.viewNode.Word, this.param.desc);
    }
}