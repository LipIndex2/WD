import { Vec2 } from "cc";
import { GetCfgValue } from "config/CfgCommon";
import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer, viewRegcfg } from 'modules/common/BaseView';
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { Timer } from "modules/time/Timer";
import { GuideCtrl } from "./GuideCtrl";
import { GuideData } from "./GuideData";
/* 
baseview虽然继承了fgui的组件
但是在涉及节点变化时不可以直接调用，需使用this.view
 */
@BaseView.registView
export class GuideView extends BaseView {
    guide_ctrl = GuideCtrl.Inst()
    EffectShow: UIEffectShow = null;
    targetInfo: { target: any, parent: any, posX: any, posY: any, index?: number }
    blockShow: boolean
    timer_rt: any

    constructor() {
        super();
        GuideData.Inst().SetGuideView(this);
    }


    protected viewRegcfg: viewRegcfg = {
        UIPackName: "Guide",
        ViewName: "GuideView",
        LayerType: ViewLayer.Top,
    };

    /* protected boardCfg = {
        BoardTitle: Language.Temp.Title,
        TabberCfg: [
            { panel: TempPanel, viewName: "TempPanel", titleName: Language.Temp.TabberTemp },
        ]
    }; */



    protected viewNode = {
        fullscreen: <fgui.GComponent>null,
        Word1: <fgui.GTextField>null,
        Word2: <fgui.GTextField>null,
        Block: <fgui.GButton>null,
        Finger: <fgui.GComponent>null,
        Parent: <fgui.GComponent>null,
    };

    InitData() {
        this.guide_ctrl.SetGuideView(this)
    }

    InitUI() {

    }

    DoOpenWaitHandle() {

    }

    OpenCallBack() {
        if (!this.EffectShow) {
            this.EffectShow = this.viewNode.Finger.getChild("EffectShow");
        }


        this.viewNode.Block.onClick(this.OnClickTarget, this)
        this.viewNode.Block.visible = false
        this.viewNode.Finger.visible = false

        // this.EffectShow.PlayEff(4164001)

        if (this.pos2) {
            this.Show(this.pos2);
            this.pos2 = undefined;
        }
    }

    CloseCallBack() {

    }

    OnClickTarget() {
        if (this.blockShow) {
            this.Hide()
            GuideCtrl.Inst().click_button.OnClick();
        }
    }
    private pos2: Vec2
    public Show(pos: Vec2, targetInfo?: { target: any, parent: fgui.GObject, posX: any, posY: any, posYN: any, index?: number }) {
        if (this.viewNode.Block && this.viewNode.Finger) {
            //显示手指等特效
            this.blockShow = true
            this.viewNode.Block.visible = true
            this.viewNode.Finger.setPosition(pos.x, pos.y)
            this.viewNode.Finger.visible = true
            if (targetInfo) {
                targetInfo.index = targetInfo.target.parent.getChildIndex(targetInfo.target)
                this.targetInfo = targetInfo
                targetInfo.target.touchable = false
                this.viewNode.Parent.addChild(targetInfo.target)
                targetInfo.target.setPosition(targetInfo.posX, targetInfo.posYN)
                if (1 == GuideCtrl.Inst().CurStepCfg().arrow_dir) {
                    this.viewNode.Word1.text = GuideCtrl.Inst().CurStepCfg().arrow_tip
                } else {
                    this.viewNode.Word2.text = GuideCtrl.Inst().CurStepCfg().arrow_tip
                }
                GuideCtrl.Inst().CurStepCfg().arrow_dir
            }
            this.viewNode.Finger.scaleY = this.viewNode.Finger.y > 1200 ? -1 : 1
        } else {
            this.pos2 = pos;
        }
    }
    public Hide() {
        //隐藏特效
        if (this.targetInfo) {
            this.targetInfo.target.touchable = true
            this.targetInfo.parent.addChildAt(this.targetInfo.target, this.targetInfo.index)
            let pos = GetCfgValue(GuidePos, GuideCtrl.Inst().CurStepCfg().step_id + "_" + GuideCtrl.Inst().CurStepCfg().index)
            this.targetInfo.target.setPosition(pos ? pos.x : this.targetInfo.posX, pos ? pos.y : this.targetInfo.posY)
            this.targetInfo = undefined
        }
        this.blockShow = false
        this.viewNode.Finger.scaleY = 1
        this.viewNode.Block.visible = !GuideCtrl.Inst().LastStep()
        this.viewNode.Finger.visible = false
        this.viewNode.Word1.text = ""
        this.viewNode.Word2.text = ""


        this.timer_rt = Timer.Inst().AddRunTimer(() => {
            this.viewNode.Block.visible = !!GuideCtrl.Inst().CurGuide()
        }, 2, 1, false)
    }
}

export var GuidePos: { [key: string]: any } = {
    ["1_2"]: { x: 0, y: 0 },
    ["3_1"]: { x: 0, y: 0 },
    ["4_1"]: { x: 208, y: 208 },
    ["7_1"]: { x: 118, y: 74 },
    ["9_3"]: { x: 118, y: 74 },
}