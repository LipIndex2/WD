import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { UH } from "../../helpers/UIHelper";
import { ActivityCombatCtrl } from "./ActivityCombatCtrl";
import { ActivityCombatData } from "./ActivityCombatData";
import { ViewManager } from "manager/ViewManager";
import { SceneType } from "modules/Battle/BattleConfig";

@BaseView.registView
export class ActivityCombatMopUpView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "ActivityCombatMopUp",
        ViewName: "ActivityCombatMopUpView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard2>null,
        Consume: <fgui.GTextField>null,
        Num: <fgui.GTextField>null,
        BtnMopUp: <fgui.GButton>null,
        BtnSubtract: <fgui.GButton>null,
        BtnAdd: <fgui.GButton>null,
        BtnMax: <fgui.GButton>null,
        BtnMin: <fgui.GButton>null,
    };
    data: any;
    private num: number = 1;
    InitData(parme: any) {
        this.data = parme;
        this.viewNode.Board.SetData(new BoardData(ActivityCombatMopUpView));
        this.viewNode.BtnAdd.onClick(this.OnClickAdd, this);
        this.viewNode.BtnSubtract.onClick(this.OnClickSubtract, this);
        this.viewNode.BtnMax.onClick(this.OnClickMax, this);
        this.viewNode.BtnMin.onClick(this.OnClickMin, this);
        this.viewNode.BtnMopUp.onClick(this.OnClickMopUp, this);

        this.FlushData();
    }

    FlushData() {
        let energy = ActivityCombatData.Inst().GetEnergyNum();
        UH.SetText(this.viewNode.Num, this.num)
        UH.SetText(this.viewNode.Consume, energy + " -> " + (energy - this.num * this.data.consume))
    }

    OnClickMopUp() {
        let type = this.data.type == 0 ? SceneType.Coin : SceneType.Fragment;
        ActivityCombatCtrl.Inst().SendGrowPassReward(type, this.data.level, this.num);
        ViewManager.Inst().CloseView(ActivityCombatMopUpView)
    }

    OnClickAdd() {
        let maxNum = ActivityCombatData.Inst().GetMopUpNum(this.data.type, this.data.level);
        if (this.num >= maxNum) {
            this.num = maxNum
        } else {
            this.num++;
        }
        this.FlushData();
    }

    OnClickSubtract() {
        if (this.num <= 1) {
            this.num = 1
        } else {
            this.num--;
        }
        this.FlushData();
    }

    OnClickMax() {
        let maxNum = ActivityCombatData.Inst().GetMopUpNum(this.data.type, this.data.level);
        this.num = maxNum;
        this.FlushData();
    }

    OnClickMin() {
        this.num = 1;
        this.FlushData();
    }

    InitUI() {
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }
}