import { LogError } from "core/Debugger";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { ArenaCtrl } from "modules/Arena/ArenaCtrl";
import { IS_DEBUG_COLLIDER } from "modules/Battle/BattleConfig";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { BattleData } from "modules/Battle/BattleData";
import { LoseTempleCtrl } from "modules/LoseTemple/LoseTempleCtrl";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, viewRegcfg } from "modules/common/BaseView";
import { GMCmdConfig } from "modules/gm_command/GMCmdConfig";
import { GMCmdCtrl } from "modules/gm_command/GMCmdCtrl";
import { GuideCtrl } from "modules/guide/GuideCtrl";
import { LoginData } from "modules/login/LoginData";
import { TaskViewProgress } from "modules/task/TaskView";
import { PackageData } from "preload/PkgData";
import { IS_EDITOR } from "../../GameStart";
import { UH } from "../../helpers/UIHelper";
import { FloatingTextDate } from "./FloatingTextData";
import { TopLayerViewFishScoreItem } from "./TopLayerViewFish";
import { TopLayerViewTaskItem } from "./TopLayerViewTask";


@BaseView.registView
export class TopLayerView extends BaseView {
    private role_cap: number = 0;
    private role_level: number = 0;
    protected viewRegcfg: viewRegcfg = {
        UIPackName: "TopLayer",
        ViewName: "TopLayerView",
        LayerType: ViewLayer.Top - 1,
    };
    protected viewNode = {
        FloatingText: <FloatingText>null,
    };
    protected extendsCfg = [
        { ResName: "FloatingTextItem", ExtendsClass: FloatingTextItem },
        { ResName: "FloatingTextFadeItem", ExtendsClass: FloatingTextFadeItem },
        { ResName: "FloatingText", ExtendsClass: FloatingText },

        { ResName: "GMCmdItem", ExtendsClass: GMCmdItem },
        { ResName: "GMItem", ExtendsClass: GMItem },
        { ResName: "GMParamItem", ExtendsClass: GMParamItem },

        { ResName: "FishScoreItem", ExtendsClass: TopLayerViewFishScoreItem },
        { ResName: "TaskItem", ExtendsClass: TopLayerViewTaskItem },
        { ResName: "ProgressTask", ExtendsClass: TaskViewProgress },
    ];
    InitData() {
        this.AddSmartDataCare(FloatingTextDate.Inst().resultData, this.FlushLabelView.bind(this), "val");
    }
    InitUI() {
    }
    private FlushLabelView() {
        this.viewNode.FloatingText.Init();
    }
}

export class FloatingTextItem extends fgui.GComponent {
    private viewNode = {
        title: <fgui.GTextField>null,
        arrow: <fgui.GLoader>null,
    };
    protected onConstruct() {
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }
    public SetData(data: any) {
        UH.SetText(this.viewNode.title, data.desc);

        let show_arrow = undefined != data.arrow
        this.viewNode.arrow.visible = show_arrow
        if (show_arrow) {
            UH.SpriteName(this.viewNode.arrow, "CommonAtlas", data.arrow > 0 ? "JianTouLv" : "JianTouHong2")
        }
    }
}

export class FloatingTextFadeItem extends fgui.GComponent {
    private viewNode = {
        title: <fgui.GTextField>null,
        arrow: <fgui.GLoader>null,
    };
    protected onConstruct() {
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }
    public SetData(data: any) {
        UH.SetText(this.viewNode.title, data.desc);

        let show_arrow = undefined != data.arrow
        this.viewNode.arrow.visible = show_arrow
        if (show_arrow) {
            UH.SpriteName(this.viewNode.arrow, "CommonAtlas", data.arrow > 0 ? "JianTouLv" : "JianTouHong2")
        }
    }
}


export class GMCmdItem extends fgui.GComponent {
    protected viewNode = {
        Btn: <fgui.GButton>null,
        BtnSend: <fgui.GButton>null,
        BtnTest: <fgui.GButton>null,
        Param: <fgui.GTextInput>null,
        Panel: <fgui.GGroup>null,
        List: <fgui.GList>null,
        bg: <fgui.Image>null,
    };

    static debugPanel: fgui.GGroup;

    protected onConstruct() {
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
        if (this.viewNode.Btn) {
            this.viewNode.Btn.visible = false;
            this.viewNode.BtnTest.visible = false;
        }
        if (IS_EDITOR || (PackageData.Inst().getIsDebug() || LoginData.IsWhite())) {
            // this.onClick((event: fgui.Event) => {
            //     if (event.target == this.node || this.viewNode.bg.node == event.target)
            //         this.viewNode.Panel.visible = false;
            // })
            this.viewNode.Btn.onClick(this.OnClick, this);
            this.viewNode.BtnSend.onClick(this.OnClickSend, this);
            this.viewNode.BtnTest.onClick(this.OnClickTest, this);
            this.viewNode.List.itemRenderer = this.rendererItem.bind(this);
            this.viewNode.List.numItems = GMCmdConfig.List.length;
            this.viewNode.Btn.visible = true;
            this.viewNode.BtnTest.visible = true;
            GMCmdItem.debugPanel = this.viewNode.Panel;
        }
    }
    private rendererItem(index: number, item: GMItem) {
        item.SetData(GMCmdConfig.List[index]);
    }

    private OnClick() {
        this.viewNode.Panel.visible = !this.viewNode.Panel.visible;
    }
    private OnClickSend() {
        if (this.viewNode.Param.text != "") {
            let params_list = this.viewNode.Param.text.split(":");
            GMCmdCtrl.Inst().SendGMCommand(params_list[0], params_list[1] ?? "", this.viewNode.Param.text);
        }
    }
    private OnClickTest() {
        GMCmdCtrl.Inst().TestFunction(this.viewNode.Param.text);
    }
}

export class GMItem extends BaseItem {
    protected viewNode = {
        btn: <fgui.GButton>null,
        item: <GMParamItem[]>Array(3),
    };
    protected onConstruct() {
        super.onConstruct();
        this.viewNode.btn.onClick(this.OnClick, this);
    }
    public SetData(data: any) {
        this.viewNode.btn.title = data.name;
        for (let index = 0; index < this.viewNode.item.length; index++) {
            if (data.params[index]) {
                this.viewNode.item[index].SetData(data.params[index]);
            }
            this.viewNode.item[index].visible = data.params[index] != null;
        }
        this.data = data;
    }
    private OnClick() {
        if (this.IsCanGM()) {
            if (this.data.key == "ReadBattleFile") {
                BattleCtrl.Inst().InputFile();
                return
            }
            if (this.data.key == "LoseTemple") {
                LoseTempleCtrl.Inst().SendLoseStart(1)
                return
            }
            if (this.data.key == "EndBattle") {
                let params = this.GetParams().split(" ");
                let isWin = params[0] == "1" ? true : false;
                BattleCtrl.Inst().isSaveChack = false;
                BattleCtrl.Inst().SendBattleRet(isWin, 0, Number(params[2]), [Number(params[1])]);
                return
            }
            if (this.data.key == "EnterBattle") {
                let params = this.GetParams().split(" ");
                BattleCtrl.Inst().EnterBattle(Number(params[0]));
                //ViewManager.Inst().OpenView(BattleSaveSkillView);
                return
            }
            if (this.data.key == "BattleSetRound") {
                let params = this.GetParams().split(" ");
                BattleData.Inst().battleInfo.roundIndex = Number(params[0]);
                return
            }
            if (this.data.key == "Guide") {
                GuideCtrl.Inst().Start(+this.GetParams())
                return
            }
            if (this.data.key == "StopGuide") {
                GuideCtrl.Inst().ForceStop()
                return
            }
            if (this.data.key == "BattleDebugCollider") {
                IS_DEBUG_COLLIDER.IS_LOG = !IS_DEBUG_COLLIDER.IS_LOG;
                return
            }
            if (this.data.key == "OpenView") {
                let params = this.GetParams().split(" ");
                ViewManager.Inst().OpenView(params[0])
            }
            if (this.data.key == "GMArenaAddScore") {
                ArenaCtrl.Inst().isOpenArenaChange = true;
                GMCmdItem.debugPanel.visible = false;
            }
            if (this.data.key == "settask") {
                BattleCtrl.Inst().SendBattleRet(true, 0, 0, [30]);
                GMCmdCtrl.Inst().SendGMCommand("additem", "40000 10000");
                GMCmdCtrl.Inst().SendGMCommand("additem", "40001 10000");
                GMCmdCtrl.Inst().SendGMCommand("additem", "40002 10000");
            }
            GMCmdCtrl.Inst().SendGMCommand(this.data.key, this.GetParams());
        }
    }
    private GetParams() {
        let params = "";
        for (let index = 0; index < this.data.params.length; index++) {
            let param = this.viewNode.item[index].GetParam();
            params += (param != "" ? param : 0);
            if (index != this.viewNode.item.length - 1) {
                params += " ";
            }
        }
        return params;
    }
    private IsCanGM() {
        for (let index = 0; index < this.viewNode.item.length; index++) {
            if (this.viewNode.item[index].visible && this.viewNode.item[index].GetParam() == "") {
                return false;
            }
        }
        return true;
    }
}

export class GMParamItem extends BaseItem {
    protected viewNode = {
        name: <fgui.GTextField>null,
        param: <fgui.GTextInput>null,
    };
    public SetData(data: any) {
        let split = data.split(":");
        UH.SetText(this.viewNode.name, split[0]);
        UH.SetText(this.viewNode.param, split[1] ?? "");
    }
    public GetParam() {
        return this.viewNode.param.text;
    }
}

export class FloatingText extends fgui.GComponent {
    private index: number = 0;
    private count: number = 0;
    private float_list: any[] = [];
    private pool_list: any[] = [];
    private is_playing = false
    private cache = 0
    protected onConstruct() {
    }
    public Init() {
        // if (this.count == 0 && this.float_list.length == 0) {
        // this.CreateItem();
        // }
        // LogError("? Init fff",this.float_list.length)
        if (this.float_list.length == 0) {
            this.FixCreateItem()
        }
        else {
            this.cache = this.cache + 1
        }
    }
    // 取缓存
    private GetInPool() {
        return this.pool_list.pop()
    }
    // 塞入缓存
    private SetInPool(item: any) {
        this.pool_list.push(item)
    }

    private CreateItem() {
        if (this.count >= 5) {
            this.count = 0;
            this.index = 0;
            return;
        }
        let float_data = FloatingTextDate.Inst().GetFloatQuene();
        if (float_data == undefined) {
            this.count = 0;
            this.index = 0;
            return;
        }
        let FloatingTextItem = <FloatingTextItem>fgui.UIPackage.createObject("TopLayer", "FloatingTextItem").asCom;
        let child = this.addChild(FloatingTextItem);
        FloatingTextItem.SetData(float_data);
        child.setPosition(0, (0 - this.index) * FloatingTextItem.height)//this.index * FloatingTextItem.height);
        let trans = FloatingTextItem.getTransition("t0");
        trans.play(() => {
            this.removeChild(FloatingTextItem);
            this.float_list.pop();
            if (this.float_list.length == 0) {
                this.CreateItem()
            }
        });
        this.float_list.push(true);
        trans.setHook("next", () => {
            this.index++;
            this.count++;
            this.CreateItem();
        });
    }

    private WarnFloat() {
        let cheeck = false
        // 帧级计时
        fgui.GTween.to(0, 1, 2)
            .setEase(fgui.EaseType.Linear)
            .onUpdate((tweener: fgui.GTweener) => {
                if (!this.is_playing && this.cache > 0 && !cheeck) {
                    this.FixCreateItem()
                    cheeck = true
                }
            })
    }

    private FixCreateItem() {
        // LogError("?cur ",this.pool_list.length,this.float_list.length)

        let float_data = FloatingTextDate.Inst().GetFloatQuene();
        if (float_data == undefined) {
            this.WarnFloat()
            return;
        }

        let cache = this.GetInPool()
        if (cache == null) {
            let FloatingTextItem = <FloatingTextFadeItem>fgui.UIPackage.createObject("TopLayer", "FloatingTextFadeItem").asCom;
            let child = this.addChild(FloatingTextItem);
            cache = child
        }
        this.cache = 0
        cache.SetData(float_data);
        this.float_list.unshift(cache) // 往开头添加
        this.PlayFloatItem()
    }

    private PlayFloatItem() {
        let total = this.float_list.length - 1
        let offset = 3
        this.is_playing = true

        for (let i = total; i > -1; i--) {
            let height = this.float_list[i].height + offset
            let end_y = height * i * (-1)
            let start_y = end_y + height + (i == 0 ? 5 * height : 0)

            this.float_list[i].visible = true
            fgui.GTween.to(start_y, end_y, 0.3)
                .setEase(fgui.EaseType.Linear)
                .onUpdate((tweener: fgui.GTweener) => {
                    if (this.float_list[i] != null) {
                        this.float_list[i].y = tweener.value.x
                    }
                }).onComplete(() => {
                    if (i == 0) {
                        this.FixCreateItem()
                        this.is_playing = false
                    }
                })

            if (i == 0) {
                let trans = this.float_list[i].getTransition("t0");
                trans.play(() => {
                    // if(!this.is_playing){
                    //     if(this.cache == 0 ){
                    //         this.cache = this.float_list.length
                    //     }
                    //     else if(this.cache < this.float_list.length){
                    //         this.cache = this.float_list.length
                    //     }
                    //     else {
                    //         this.FixCreateItem()
                    //         this.cache = 0
                    //     }
                    // }
                    let item = this.float_list.pop() // 删除并取出最后一个
                    item.visible = false
                    LogError("??", this.float_list.length)
                    if (this.float_list.length == 0) {
                        this.FixCreateItem()
                    }
                    this.SetInPool(item)
                })
            }
        }
    }
}