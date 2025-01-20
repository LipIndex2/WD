import { _decorator, Component, Node, Sprite, UITransform, SpriteFrame } from 'cc';
import { ViewManager } from 'manager/ViewManager';
import * as fgui from "fairygui-cc";
import { CfgSceneMainBG } from 'config/CfgSceneBG';
import { ResManager } from 'manager/ResManager';
import { LogWxError } from 'core/Debugger';
import { IBattleBG } from './BattleScene';
const { ccclass, property } = _decorator;

@ccclass('DefSceneBG')
export class DefSceneBG extends Component implements IBattleBG {
    @property(Sprite)
    TopIcon: Sprite;
    @property(Sprite)
    BottomIcon: Sprite;

    @property(UITransform)
    TopImg: UITransform;
    @property(UITransform)
    BottomImg: UITransform;
    @property(Node)
    Home:Node;

    private sizeChange = this.OnWindowSizeChange.bind(this);
    data: CfgSceneMainBG;
    private loadCallback: Function;
    onLoad() {
        ViewManager.Inst().OnWindowChange(this.sizeChange);
        this.OnWindowSizeChange();
    }

    onDestroy() {
        ViewManager.Inst().OffWindowChange(this.sizeChange);
    }

    OnWindowSizeChange() {
        //console.log("窗口变化OnWindowSizeChange", );
        let scale = (fgui.GRoot.inst.width / fgui.GRoot.inst.height) / 0.5
        let topScale = scale;
        let bottomScale = scale;
        //console.log("比例", scale);
        if (bottomScale < 1) {
            bottomScale = 1 + (1 - scale);
        }
        if (topScale < 1.1) {
            topScale = 1.1 + (1.1 - scale);
        }

        //适配方案2
        let size = this.TopImg.contentSize;
        this.TopImg.setContentSize(size.width * topScale, size.height * topScale);

        size = this.BottomImg.contentSize;
        this.BottomImg.setContentSize(size.width * bottomScale, size.height * bottomScale);
    }


    
    SetData(data: CfgSceneMainBG) {
        this.data = data;
        this.LoadIcon();
    }

    private loadProgres: number = -1;
    LoadIcon(callback?: Function) {
        this.SetLoadedCallback(callback);
        let topPath = "loader/scene/adorn/" + this.data.up_res_id;
        let downPath = "loader/scene/adorn/" + this.data.down_res_id;
        //let bgPath = "loader/scene/cell/" + this.data.gezi1_id;
        this.loadProgres = 4;
        ResManager.Inst().LoadSpriteFrame<SpriteFrame>(topPath, (err, icon) => {
            this.loadProgres--;
            if (err != null) {
                LogWxError("背景icon加载失败", topPath)
            }
            this.TopIcon.spriteFrame = icon;
            this.CheckLoad();
        })
        ResManager.Inst().LoadSpriteFrame<SpriteFrame>(downPath, (err, icon) => {
            this.loadProgres--;
            if (err != null) {
                LogWxError("背景icon加载失败", downPath)
            }
            this.BottomIcon.spriteFrame = icon;
            this.CheckLoad();
        })
    }

    private CheckLoad() {
        //console.log("检查了");
        if (this.loadProgres == 0) {
            this.loadProgres = -1;
            if (this.loadCallback) {
                this.loadCallback();
            }
        }
    }

    SetLoadedCallback(func: Function) {
        this.loadCallback = func;
    }

    //设置失败图片
    SetFailImg(cp?: () => void) {
        let path = "loader/scene/adorn/" + this.data.def_id;
        ResManager.Inst().LoadSpriteFrame<SpriteFrame>(path, (err, icon) => {
            if (err != null) {
                LogWxError("背景icon加载失败", path)
            }
            this.BottomIcon.spriteFrame = icon;
            if (cp) {
                cp();
            }
        })
    }

    GetMapLeftX(){
        return 0;
    }
    GetMapRightX(){
        return 0;
    }
    GetMapTopY(){
        return 0;
    }
}


