import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BattleHarmShowIconType, BattleHarmShowItem, BattleHarmShowLabel, BossHeadInfo } from "../BattleView";
import { SmallObjPool } from "core/SmallObjPool";
import { BattleData } from "../BattleData";
import { UH } from "../../../helpers/UIHelper";
import { ArenaData } from "modules/Arena/ArenaData";
import { DataHelper } from "../../../helpers/DataHelper";
import { RoleData } from "modules/role/RoleData";
import { ViewManager } from "manager/ViewManager";
import { BattlePauseView } from "../BattlePauseView";
import { EventCtrl } from "modules/common/EventCtrl";
import { BattleEventType } from "../BattleConfig";
import { Prefskey } from "modules/common/PrefsKey";

@BaseView.registView
export class BattleArenaView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "Battle",
        ViewName: "BattleArenaView",
        LayerType: ViewLayer.Normal,
    };

    private harmItemPool: SmallObjPool<BattleHarmShowItem>;

    protected viewNode = {
        LeftName: <fgui.GTextField>null,
        RightName: <fgui.GTextField>null,
        LeftKill: <fgui.GTextField>null,
        RightKill: <fgui.GTextField>null,
        HpNumL: <fgui.GTextField>null,
        HpNumR: <fgui.GTextField>null,
        HpProgerssBarA: <fgui.GProgressBar>null,
        HpProgerssBarB: <fgui.GProgressBar>null,

        PauseBtn: <fgui.GButton>null,
        AddSpeedBtn: <fgui.GButton>null,
    };

    protected extendsCfg = [
        { ResName: "BossHeadInfo", ExtendsClass: BossHeadInfo },
        { ResName: "HarmShowItem", ExtendsClass: BattleHarmShowItem },
        { ResName: "HarmShowLabal", ExtendsClass: BattleHarmShowLabel },
    ];

    InitData() {
        this.AddSmartDataCare(BattleData.Inst().otherInfo, this.CenterHarmTip.bind(this), "harmTipList");
        this.AddSmartDataCare(BattleData.Inst().battleInfo, this.FlushHpL.bind(this), "hp", "maxHp");
        this.AddSmartDataCare(BattleData.Inst().robotBattleInfo, this.FlushHpR.bind(this), "hp", "maxHp");
        this.AddSmartDataCare(BattleData.Inst().battleInfo, this.FlushKillL.bind(this), "killCount");
        this.AddSmartDataCare(BattleData.Inst().robotBattleInfo, this.FlushKillR.bind(this), "killCount");
        this.AddSmartDataCare(BattleData.Inst().battleInfo, this.FlushSpeedScale.bind(this), "globalTimeScaleShow")

        this.viewNode.PauseBtn.onClick(this.OnPauseClick.bind(this));
        this.viewNode.AddSpeedBtn.onClick(this.OnAddSpeedClick.bind(this));

        this.harmItemPool = new SmallObjPool(undefined, 150);
        this.harmItemPool.isNode = false;
        this.harmItemPool.SetCreateFunc(() => {
            let tipItem = <BattleHarmShowItem>fgui.UIPackage.createObject("Battle", "HarmShowItem").asCom;
            this.addChild(tipItem);
            return tipItem;
        })
        this.harmItemPool.SetDestroyFunc((item: BattleHarmShowItem) => {
            item.dispose();
            item = null;
        })

        this.viewNode.HpProgerssBarA.min = 0;
        this.viewNode.HpProgerssBarB.min = 0;

        UH.SetText(this.viewNode.LeftName, DataHelper.BytesToString(RoleData.Inst().ResultData.RoleInfo.roleinfo.name));
        let matchInfo = ArenaData.Inst().matchInfo;
        let roleName = DataHelper.BytesToString(matchInfo.roleInfo.name);
        UH.SetText(this.viewNode.RightName, roleName);
    }

    InitUI() {
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
        this.FlushHpL();
        this.FlushHpR();
        this.FlushKillL();
        this.FlushKillR();
        this.FlushSpeedScale();
    }

    CloseCallBack() {
    }

    // 伤害飘字
    CenterHarmTip() {
        let list = BattleData.Inst().otherInfo.harmTipList;
        if (list.length < 1) {
            return;
        }
        list.forEach(v => {
            let tipItem = this.harmItemPool.Get();
            tipItem.visible = true;
            if (v.iconType == BattleHarmShowIconType.baoji || v.iconType == BattleHarmShowIconType.zhongji) {
                tipItem.setScale(2.5, 2.5);
            }
            tipItem.SetData(v);
            tipItem.SetEndCallback(this.HramTipEndCallback.bind(this));
        })
        BattleData.Inst().ClearHarmTip();
    }
    HramTipEndCallback(item: BattleHarmShowItem) {
        item.setPosition(0, 0);
        item.setScale(1, 1);
        this.harmItemPool.Put(item);
    }

    FlushHpL(){
        let hp = BattleData.Inst().battleInfo.GetHP();
        let maxHp = BattleData.Inst().battleInfo.maxHp;
        this.viewNode.HpProgerssBarA.max = maxHp;
        this.viewNode.HpProgerssBarA.tweenValue(hp, 0.5);
        UH.SetText(this.viewNode.HpNumL, hp + "/" + maxHp);
    }

    FlushHpR(){
        let hp = BattleData.Inst().robotBattleInfo.GetHP();
        let maxHp = BattleData.Inst().robotBattleInfo.maxHp;
        this.viewNode.HpProgerssBarB.max = maxHp;
        this.viewNode.HpProgerssBarB.tweenValue(hp, 0.5);
        UH.SetText(this.viewNode.HpNumR, hp + "/" + maxHp);
    }

    FlushKillL(){
        UH.SetText(this.viewNode.LeftKill, BattleData.Inst().battleInfo.killCount);
    }

    FlushKillR(){
        UH.SetText(this.viewNode.RightKill, BattleData.Inst().robotBattleInfo.killCount);
    }
    FlushSpeedScale() {
        let num = BattleData.Inst().battleInfo.globalTimeScaleShow;
        this.viewNode.AddSpeedBtn.title = num.toString();
    }

    OnPauseClick() {
        let battleInfo = BattleData.Inst().battleInfo;
        if (battleInfo.isPause || battleInfo.isGuiding) {
            return;
        }
        ViewManager.Inst().OpenView(BattlePauseView);
    }

    OnAddSpeedClick() {
        let num = BattleData.Inst().battleInfo.globalTimeScaleShow;
        num++;
        if (num > BattleData.Inst().MaxSpeedScale()) {
            num = 1;
        }
        BattleData.Inst().battleInfo.globalTimeScaleShow = num;
        EventCtrl.Inst().emit(BattleEventType.Speed, num);

        let k = Prefskey.GetBattleSpeedScaleKey();
        Prefskey.SetValue(k, num);
    }
}