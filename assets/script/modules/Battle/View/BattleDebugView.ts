import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BattleDebugData, BattleGMItemData, BattleGMList } from "../BattleDebugCfg";
import { BattleCtrl } from "../BattleCtrl";
import { BattleTweenerType } from "../BattleDynamic";
import { BaseItem } from "modules/common/BaseItem";
import { sys } from "cc";
import { BattleData } from "../BattleData";
import { BattleModel, BattleState } from "../BattleConfig";
import { UH } from "../../../helpers/UIHelper";
import { GMItem } from "modules/main/TopLayerView";

@BaseView.registView
export class BattleDebugView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "BattleDebug",
        ViewName: "BattleDebugView",
        LayerType: ViewLayer.Top,
        ViewMask: ViewMask.None,
    };


    protected viewNode = {
        HeroAttackBtn: <fgui.GButton>null,
        MonsterAttackBtn: <fgui.GButton>null,
        JumpBtn: <fgui.GButton>null,
        OpenBtn: <fgui.GButton>null,
        Panel: <BattleDebugPanel>null,
        SaveBtn: <fgui.GButton>null,
        SceneId: <fgui.GTextField>null,
    };

    protected extendsCfg = [
        { ResName: "BattleDebugPanel", ExtendsClass: BattleDebugPanel },
        { ResName: "GMItem", ExtendsClass: BattleDebugGMItem },
        { ResName: "InputItem", ExtendsClass: BattleDebugParamItem },
    ];

    InitData() {
        this.viewNode.HeroAttackBtn.onClick(this.OnHeroAttackClick, this);
        this.viewNode.MonsterAttackBtn.onClick(this.OnMonsterAttackClick, this);
        this.viewNode.JumpBtn.onClick(this.OnJumpClick, this);
        this.viewNode.OpenBtn.onClick(this.OnOpenClick, this);
        this.viewNode.SaveBtn.onClick(this.OnSaveFileClick, this);
        this.view.getController("show").setSelectedIndex(BattleDebugData.BATTLE_DEBUG_MODE ? 1 : 0);

        this.viewNode.JumpBtn.visible = BattleCtrl.Inst().battleModel == BattleModel.Normal;
    }

    OpenCallBack() {
        UH.SetText(this.viewNode.SceneId, "场景类型：" + BattleData.Inst().battleInfo.sceneType + "  场景id：" + BattleData.Inst().battleInfo.sceneId);
    }

    CloseCallBack() {
    }

    OnHeroAttackClick() {
        BattleDebugData.Inst().IsHeroAttack = !BattleDebugData.Inst().IsHeroAttack;
    }

    OnMonsterAttackClick() {
        BattleDebugData.Inst().IsMonsterAttack = !BattleDebugData.Inst().IsMonsterAttack;
        BattleCtrl.Inst().battleScene.dynamic.PauseAllTweenr(BattleTweenerType.Monster, !BattleDebugData.Inst().IsMonsterAttack);
    }

    OnJumpClick() {
        let state = BattleData.Inst().battleInfo.GetBattleState();
        if (state == BattleState.SanXiao) {
            BattleCtrl.Inst().battleScene.CheckStep(0);
        }
    }

    OnOpenClick() {
        this.viewNode.Panel.visible = !this.viewNode.Panel.visible;
        let list: BattleGMItemData[] = [];
        BattleGMList.forEach(v => {
            if (v.tags.has(BattleCtrl.Inst().battleModel)) {
                list.push(v);
            }
        });
        if (this.viewNode.Panel.GetData() == null) {
            this.viewNode.Panel.SetData({ list: list });
        }
    }

    OnSaveFileClick() {
        if (BattleCtrl.Inst().battleModel == BattleModel.Defense) {
            BattleCtrl.Inst().SaveBattleDef();
        } else {
            BattleCtrl.Inst().SaveBattle();
        }
        BattleCtrl.Inst().SaveFileToLocal();
    }
}

export interface IBattleDebugPanelData {
    list: BattleGMItemData[];
}
export class BattleDebugPanel extends BaseItem {
    protected viewNode = {
        List: <fgui.GList>null,
        BG: <fgui.GObject>null,
    };
    listData: BattleGMItemData[];

    public SetData(data: IBattleDebugPanelData): void {
        super.SetData(data);
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.listData = data.list;
        this.viewNode.List.numItems = data.list.length;
        this.viewNode.BG.height = 30 + 70 * data.list.length;
    }

    private itemRenderer(index: number, item: GMItem) {
        item.SetData(this.listData[index]);
    }
}

export class BattleDebugGMItem extends BaseItem {
    protected viewNode = {
        ParamList: <fgui.GList>null,
        Btn: <fgui.GButton>null,
    };
    listData: string[];

    public SetData(data: BattleGMItemData): void {
        this._data = data;
        this.viewNode.ParamList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = data.paramList;
        this.viewNode.ParamList.numItems = data.paramList.length;
        this.viewNode.Btn.title = data.btnText;
        this.viewNode.Btn.onClick(this.OnBtnClick, this);
    }

    private itemRenderer(index: number, item: GMItem) {
        item.SetData(this.listData[index]);
    }

    public OnBtnClick() {
        let params: number[] = [];
        for (let i = 0; i < this._data.paramList.length; i++) {
            let item = this.viewNode.ParamList.getChildAt<BattleDebugParamItem>(i);
            params.push(item.GetInputValue());
        }
        console.log(this._data.btnText, params);
        this._data.Func(params);
    }
}

export class BattleDebugParamItem extends BaseItem {
    protected viewNode = {
        Text: <fgui.GTextField>null,
        Input: <fgui.GTextInput>null,
    };

    public SetData(data: string): void {
        this._data = data;
        this.viewNode.Text.text = data + ":";
        let oldValue = sys.localStorage.getItem("BattleDebugParamItem" + data);
        if (oldValue != null) {
            this.viewNode.Input.text = oldValue;
        } else {
            this.viewNode.Input.text = "0";
        }
        this.viewNode.Input.on(fgui.Event.TEXT_CHANGE, this.OnInputChange, this);
    }

    private OnInputChange() {
        sys.localStorage.setItem("BattleDebugParamItem" + this._data, this.viewNode.Input.text);
    }

    public GetInputValue(): number {
        if (this.viewNode.Input.text == null || this.viewNode.Input.text == "") {
            return 0;
        }
        return Number(this.viewNode.Input.text);
    }
}