import { CfgSpeBlock } from "config/CfgScene";
import { NodePools } from "core/NodePools";
import { UIEffectConf } from "modules/scene_obj_spine/Effect/UIEffectConf";
import { HeroObj } from "../Object/HeroObj";
import { Node, Vec3 } from "cc";
import { ResPath } from "utils/ResPath";
import { BattleCtrl } from "../BattleCtrl";
import { Timer, TYPE_TIMER } from "modules/time/Timer";
import { BattleData } from "../BattleData";
import { BattleState, HeroObjBuffType, IHeroObjBuffData } from "../BattleConfig";

enum CellSpCellEffectLayer{
    Normal = 1,
    HeroTop = 2,
}

interface ICellSpCellEffectCfg{
    effectId: number|string;
    layerType?: CellSpCellEffectLayer;
}

// 特殊地形功能
export class BaseCellSpCell{
    data:CfgSpeBlock;

    private _hero:HeroObj;
    public get hero():HeroObj{
        return this._hero;
    }
    public set hero(obj:HeroObj){
        let _hero = this._hero;
        this._hero = obj;
        this.HandleEffect();
        if(_hero != obj){
            if(_hero != null){
                this.OnExit(_hero);
            }
            this.OnEnter(obj);
        }
    }

    public get isActive():boolean{
        if(this._hero == null || this._hero.IsItem()){
            return false;
        }
        return this._hero.data.stage > 0;
    }

    public get pos():Vec3{
        let pos = BattleCtrl.Inst().battleScene.battleBG.GetWorldPos(this.data.pos_i, this.data.pos_j);
        return pos;
    }

    protected get notActiveEffectCfg():ICellSpCellEffectCfg[]{return null};
    protected get activeEffectCfg():ICellSpCellEffectCfg[]{return null};
    protected effectMap:Map<number|string, Node> = new Map<number|string, Node>();

    SetData(data:CfgSpeBlock){
        this.data = data;
        this.HandleEffect();
    }

    protected HandleEffect(){
        let cfg = this.isActive ? this.activeEffectCfg : this.notActiveEffectCfg;
        if(cfg == null){
            return;
        }
        let needDeleteEffect:any[] = [];
        this.effectMap.forEach((value, key)=>{
            let isdelete = true;
            for(let i = 0; i < cfg.length; i++){
                if(cfg[i].effectId == key){
                    isdelete = false;
                    break;
                }
            }
            if(isdelete){
                needDeleteEffect.push(key);
            }
        })
        for(let i = 0; i < needDeleteEffect.length; i++){
            let key = needDeleteEffect[i];
            let effect = this.effectMap.get(key);
            if(effect != null){
                NodePools.Inst().Put(effect);
            }
            this.effectMap.delete(needDeleteEffect[i]);
        }

        cfg.forEach(info=>{
            if(!this.effectMap.has(info.effectId)){
                this.effectMap.set(info.effectId, null);
                let path = ResPath.UIEffect(info.effectId);
                NodePools.Inst().Get(path, obj => {
                    if(obj == null){
                        return;
                    }
                    if(this.effectMap == null){
                        return;
                    }
                    let effectCfg = obj.getComponent(UIEffectConf);
                    if (effectCfg) {
                        effectCfg.play();
                    }
                    let parent = info.layerType == CellSpCellEffectLayer.HeroTop ?  BattleCtrl.Inst().battleScene.TopSkillRoot : BattleCtrl.Inst().battleScene.BottomSkillRoot;
                    obj.setParent(parent);
                    this.effectMap.set(info.effectId, obj);
                    obj.setWorldPosition(this.pos);
                });
            }
        })
    }

    Start(){

    }

    //战斗开始
    OnFightStart(){
    }

    protected OnEnter(obj:HeroObj){
    }

    protected OnExit(obj:HeroObj){
    }

    Delete(){
        if (this.effectMap) {
            this.effectMap.forEach((effect, key)=>{
                if(effect){
                    let effectCfg = effect.getComponent(UIEffectConf);
                    if (effectCfg) {
                        effectCfg.stop();
                        effectCfg.clean();
                    } else {
                        NodePools.Inst().Put(effect);
                    }
                }
            })
            this.effectMap.clear();
            this.effectMap = null;
        }
    }
}


// 1=增加或减少英雄攻击力（百分比）
export class CellSpCellHarm extends BaseCellSpCell{
    static notActiveEffectA:ICellSpCellEffectCfg[] = [
        {effectId:1208065},
        {effectId:1208063, layerType:CellSpCellEffectLayer.HeroTop},
    ]
    static ActiveEffectA:ICellSpCellEffectCfg[] = [
        {effectId:1208065},
        //{effectId:1208058, layerType:CellSpCellEffectLayer.HeroTop},
        {effectId:1208059, layerType:CellSpCellEffectLayer.HeroTop},
    ]
    static ActiveEffectB:ICellSpCellEffectCfg[] = [
        {effectId:1208069},
        {effectId:1208060, layerType:CellSpCellEffectLayer.HeroTop},
    ]
    protected get activeEffectCfg():ICellSpCellEffectCfg[]{
        if(this.data.pram >= 0){
            return CellSpCellHarm.ActiveEffectA;
        }else{
            return CellSpCellHarm.ActiveEffectB;
        }
    };
    protected get notActiveEffectCfg():ICellSpCellEffectCfg[]{
        return CellSpCellHarm.notActiveEffectA;
    };

    protected OnEnter(obj:HeroObj){
        obj.LocalAttriBuff.harmScale += this.data.pram / 100
    }

    protected OnExit(obj:HeroObj){
        obj.LocalAttriBuff.harmScale -= this.data.pram / 100
    }
}

// 2=增加或降低英雄攻速（百分比）
export class CellSpCellAttackSpeed extends BaseCellSpCell{
    static notActiveEffectA:ICellSpCellEffectCfg[] = [
        {effectId:1208065},
        {effectId:1208064, layerType:CellSpCellEffectLayer.HeroTop},
    ]
    static notActiveEffectB:ICellSpCellEffectCfg[] = [
        {effectId:1208066},
        {effectId:1208064, layerType:CellSpCellEffectLayer.HeroTop},
    ]
    static ActiveEffectA:ICellSpCellEffectCfg[] = [
        {effectId:1208065},
        //{effectId:1208058, layerType:CellSpCellEffectLayer.HeroTop},
        {effectId:1208061, layerType:CellSpCellEffectLayer.HeroTop},
    ]
    static ActiveEffectB:ICellSpCellEffectCfg[] = [
        {effectId:1208069},
        {effectId:1208062, layerType:CellSpCellEffectLayer.HeroTop},
    ]

    protected get activeEffectCfg():ICellSpCellEffectCfg[]{
        if(this.data.pram >= 0){
            return CellSpCellAttackSpeed.ActiveEffectA;
        }else{
            return CellSpCellAttackSpeed.ActiveEffectB;
        }
    };
    protected get notActiveEffectCfg():ICellSpCellEffectCfg[]{
        if(this.data.pram >= 0){
            return CellSpCellAttackSpeed.notActiveEffectA;
        }else{
            return CellSpCellAttackSpeed.notActiveEffectB;
        }
    };

    protected OnEnter(obj:HeroObj){
        obj.LocalAttriBuff.attackSpeed += this.data.pram / 100
    }

    protected OnExit(obj:HeroObj){
        obj.LocalAttriBuff.attackSpeed -= this.data.pram / 100
    }
}

// 3=每隔xs，眩晕英雄1s
export class CellSpCellDizziness extends BaseCellSpCell{
    static notActiveEffectA:ICellSpCellEffectCfg[] = [
        {effectId:1208067},
    ]
    static ActiveEffectA:ICellSpCellEffectCfg[] = [
        {effectId:1208057},
    ]
    protected get activeEffectCfg():ICellSpCellEffectCfg[]{
        return CellSpCellDizziness.ActiveEffectA;
    };
    protected get notActiveEffectCfg():ICellSpCellEffectCfg[]{
        return CellSpCellDizziness.notActiveEffectA;
    };

    private time_run_ht: TYPE_TIMER
    private interval = 0.1;
    private _time = 0;
    
    Start(){
        this.time_run_ht = Timer.Inst().AddRunTimer(this.Update.bind(this), this.interval, -1);
    }

    OnFightStart(): void {
        this._time = 0;
    }

    Update(){
        if(!this.isActive){
            return;
        }
        if(BattleData.Inst().battleInfo.GetBattleState() != BattleState.Figth){
            return;
        }
        this._time += this.interval * BattleData.Inst().battleInfo.globalTimeScale;
        if(this._time >= this.data.pram){
            console.log("添加了buff");
            this._time = 0;
            let data = <IHeroObjBuffData>{
                buffType: HeroObjBuffType.XuanYun,
                time: 1
            }
            this.hero.AddBuff(data);
        }
    }

    protected OnExit(obj:HeroObj){
        this._time = 0;
    }

    Delete(): void {
        if(this.time_run_ht){
            Timer.Inst().CancelTimer(this.time_run_ht);
            this.time_run_ht = undefined;
        }
    }
}

// 4=与随机位置的棋子交换位置
export class CellSpCellSwap extends BaseCellSpCell{
    static notActiveEffectA:ICellSpCellEffectCfg[] = [
        {effectId:1208068},
    ]
    static ActiveEffectA:ICellSpCellEffectCfg[] = [
        {effectId:1208056},
    ]
    protected get activeEffectCfg():ICellSpCellEffectCfg[]{
        return CellSpCellSwap.ActiveEffectA;
    };
    protected get notActiveEffectCfg():ICellSpCellEffectCfg[]{
        return CellSpCellSwap.notActiveEffectA;
    };

    //战斗开始
    OnFightStart(){
        if(this.hero == null){
            return;
        }
        let hero1 = BattleCtrl.Inst().battleScene.GetRandomHero();
        if (hero1) {
            console.log("交换了");
            BattleCtrl.Inst().battleScene.SwapHero(this.hero, hero1, undefined, false);
        }
    }
}

export class CellSpCellProperty extends BaseCellSpCell{
    protected get activeEffectCfg():ICellSpCellEffectCfg[]{
        return [{effectId:"cell_race_" + this.data.pram}];
    };
    protected get notActiveEffectCfg():ICellSpCellEffectCfg[]{
        return [{effectId:"cell_race_" + this.data.pram}];
    };

    protected OnEnter(obj:HeroObj){
        if(!obj.IsItem() && obj.level > 0 && obj.baseCfg.hero_race == this.data.pram){
            if(this.data.pram2){
                obj.LocalAttriBuff.harmScale += this.data.pram2 / 100
            }
        }
    }

    protected OnExit(obj:HeroObj){
        if(!obj.IsItem() && obj.level > 0 && obj.baseCfg.hero_race == this.data.pram){
            if(this.data.pram2){
                obj.LocalAttriBuff.harmScale -= this.data.pram2 / 100
            }
        }
    }
}
