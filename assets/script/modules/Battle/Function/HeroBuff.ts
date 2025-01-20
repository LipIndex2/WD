import { isValid, Node } from "cc";
import { NodePools } from "core/NodePools";
import { UIEffectConf } from "modules/scene_obj_spine/Effect/UIEffectConf";
import { Timer, TYPE_TIMER } from "modules/time/Timer";
import { ResPath } from "utils/ResPath";
import { BattleState, HeroObjBuffType, IHeroObjBuffData, IMonsterObjBuffData, MonsterObjBuffType } from "../BattleConfig";
import { BattleCtrl } from "../BattleCtrl";
import { BattleData } from "../BattleData";
import { BattleProgressBar } from "../Object/BattleProgressBar";
import { HeroObj } from "../Object/HeroObj";
import { MonsterObj } from "../Object/MonsterObj";
import { SceneEffect, SceneEffectConfig } from "modules/scene_obj_spine/Effect/SceneEffect";

export class HeroBuff {
    protected get path(): string {
        return null;
    };
    protected get effectParent(): Node {
        return this.hero.node;
    };
    protected get interval(): number {
        return 0.1;
    }
    dataMap: Set<IHeroObjBuffData>;
    protected effect: Node;
    protected time_run_ht: TYPE_TIMER

    protected _started = false;
    protected isValid = false;
    hero: HeroObj;
    buffType: HeroObjBuffType;

    constructor(hero: HeroObj, type: HeroObjBuffType) {
        this.hero = hero;
        this.buffType = type;
        this.isValid = false;
    }

    protected LoadBuffEffect() {
        NodePools.Inst().Get(this.path, obj => {
            if (!isValid(this.hero.node) || this.hero.node.active == false || BattleData.Inst().battleInfo.GetBattleState() != BattleState.Figth) {
                NodePools.Inst().Put(obj);
                return;
            }
            this.effect = obj;
            let effectCfg = this.effect.getComponent(UIEffectConf);
            if (effectCfg) {
                effectCfg.play();
            }
            obj.setParent(this.effectParent);
            obj.setPosition(0, 0);
            obj.setScale(1, 1);
        });
    }

    Start() {
        if (this._started) {
            return
        }
        this._started = true;
        this.time_run_ht = Timer.Inst().AddRunTimer(this.Update.bind(this), this.interval, -1);
        this.LoadBuffEffect();
    }

    protected Update() {
        if (BattleData.Inst().battleInfo.isPause || this.dataMap == null) {
            return;
        }
        let removeList: IHeroObjBuffData[] = []
        this.dataMap.forEach(((data) => {
            data.time -= this.interval * BattleData.Inst().battleInfo.globalTimeScale;
            if (data.time <= 0) {
                removeList.push(data);
            } else {
                this.DoUpdate(data);
            }
        }))

        removeList.forEach((v) => {
            this.dataMap.delete(v);
            this.DoEnd(v);
        })

        if (this.dataMap.size <= 0) {
            this.hero.RemoveBuff(this);
        }
    }

    Add(data: IHeroObjBuffData) {
        if (this.dataMap == null) {
            this.dataMap = new Set();
        }
        if (this.dataMap.has(data)) {
            // this.dataMap.add(data);
        } else {
            this.dataMap.add(data);
            this.DoStart(data);
        }
    }


    Delete() {
        this.dataMap.forEach((data) => {
            this.DoEnd(data);
        })
        if (this.effect) {
            let effectCfg = this.effect.getComponent(UIEffectConf);
            if (effectCfg) {
                effectCfg.stop();
                effectCfg.clean();
            } else {
                NodePools.Inst().Put(this.effect);
            }
            this.effect = null;
        }
        if (this.time_run_ht) {
            Timer.Inst().CancelTimer(this.time_run_ht);
            this.time_run_ht = undefined;
        }
        this.isValid = true;
    }

    RemoveBuffData(data: IHeroObjBuffData) {
        if (this.dataMap == null) {
            return false;
        }
        if (!this.dataMap.has(data)) {
            return false;
        }
        this.dataMap.delete(data);
        this.DoEnd(data);
        return true;
    }

    get BuffDataCount(): number {
        if (this.dataMap == null) {
            return 0;
        }
        return this.dataMap.size;
    }

    // //////////////// 以下重写 ////////////
    RemoveCallback() {

    }

    protected DoStart(data: IHeroObjBuffData) {

    }

    protected DoUpdate(data: IHeroObjBuffData) {

    }

    protected DoEnd(data: IHeroObjBuffData) {

    }
}

//充电buff
export class ChongDianBuff extends HeroBuff {
    private updateT: number = 0;
    protected get path(): string {
        return ResPath.Buff(1018001);
    }

    protected DoStart(data: IHeroObjBuffData) {
        this.hero.LocalAttriBuff.harmScale += data.p1;
    }

    protected DoEnd(data: IHeroObjBuffData) {
        this.hero.LocalAttriBuff.harmScale -= data.p1;
    }
}

//激励buff
export class H_JiLiBuff extends ChongDianBuff{
    protected get path(): string {
        return ResPath.SkillEffect(10480214, 3);
    }
}

//光明祝福 加攻速的
export class H_GuangMingZhuFuBuff extends HeroBuff {
    private updateT: number = 0;
    protected get path(): string {
        return ResPath.SkillEffect(10480154, 3);
    }

    protected DoStart(data: IHeroObjBuffData) {
        this.hero.LocalAttriBuff.attackSpeed += data.p1;
    }

    protected DoEnd(data: IHeroObjBuffData) {
        this.hero.LocalAttriBuff.attackSpeed -= data.p1;
    }
}

//嗜血buff
export class H_ShiXueBuff extends HeroBuff {
    static CrateData(time: number, harmScale: number) {
        return <IHeroObjBuffData>{
            buffType: HeroObjBuffType.ShiXue,
            time: time,
            p1: harmScale,
        }
    }
    protected get path(): string {
        return ResPath.Buff(10480051);
    }

    protected DoStart(data: IHeroObjBuffData) {
        this.hero.LocalAttriBuff.harmScale += data.p1;
    }

    protected DoEnd(data: IHeroObjBuffData) {
        this.hero.LocalAttriBuff.harmScale -= data.p1;
    }
}

//眩晕
export class H_XuanYunBuff extends HeroBuff {
    protected get path(): string {
        return ResPath.Buff(1058003);
    }
    protected DoStart(data: IHeroObjBuffData) {
        this.hero.heroCtrl && this.hero.heroCtrl.addPauseNum(true);
    }

    protected DoEnd(data: IHeroObjBuffData) {
        this.hero.heroCtrl && this.hero.heroCtrl.addPauseNum(false);
    }
}

//羊buff
export class H_YangBuff extends HeroBuff {
    private yang: Node
    protected DoStart(data: IHeroObjBuffData) {

        this.hero.heroCtrl && this.hero.heroCtrl.addPauseNum(true);
        this.hero.Icon.node.active = false;
        if (!this.yang) {
            let scene = BattleCtrl.Inst().GetBattleScene(this.hero.tag);

            SceneEffect.Inst().Play(SceneEffectConfig.BOSS_15024, scene.node, this.hero.node.worldPosition);
            SceneEffect.Inst().Play(SceneEffectConfig.BOSS_15029, scene.node, this.hero.node.worldPosition);

            SceneEffect.Inst().Play(SceneEffectConfig.BOSS_15028, this.hero.node, undefined, (yang: Node) => {
                if (this.isValid) {
                    NodePools.Inst().Put(yang);
                    return true
                }
                this.yang = yang;
            });
        }
    }

    protected DoEnd(data: IHeroObjBuffData): void {
        this.hero.heroCtrl && this.hero.heroCtrl.addPauseNum(false);
    }

    Delete() {
        super.Delete()
        this.hero.Icon.node.active = true;
        if (this.yang) {
            NodePools.Inst().Put(this.yang);
            this.yang = undefined;
            return
        }
    }
}

//攻击间隔buff
export class H_Stopff extends HeroBuff {

    protected DoStart(data: IHeroObjBuffData) {
        this.hero.heroCtrl && this.hero.heroCtrl.addPauseNum(true);
    }

    protected DoEnd(data: IHeroObjBuffData) {
        this.hero.heroCtrl && this.hero.heroCtrl.addPauseNum(false);
    }
}

//等待回合结束死亡buff
export class H_WaitDieBuff extends HeroBuff {

    protected DoStart(data: IHeroObjBuffData) {
        this.hero.node.active = false;
    }

    RemoveCallback(): void {
        this.hero.node.active = false;
    }
}

//沉睡buff
export class H_SleepBuff extends HeroBuff {
    static CrateData(time: number) {
        return <IHeroObjBuffData>{
            buffType: HeroObjBuffType.Sleep,
            time: time,
        }
    }

    protected get path(): string {
        return ResPath.Buff(1043007);
    }

    protected DoStart(data: IHeroObjBuffData) {
        this.hero.heroCtrl && this.hero.heroCtrl.addPauseNum(true);
    }

    protected DoEnd(data: IHeroObjBuffData) {
        this.hero.heroCtrl && this.hero.heroCtrl.addPauseNum(false);
    }
}


//进度条显示buff
export class H_TimeProgressBuff extends HeroBuff {

    static Create(time: number): IHeroObjBuffData {
        return <IHeroObjBuffData>{ buffType: HeroObjBuffType.TimeProgress, time: time }
    }

    protected get path(): string {
        return "battle/ProgressBar";
    }

    protected get effectParent(): Node {
        let scene = BattleCtrl.Inst().GetBattleScene(this.hero.tag);
        return scene.BottomEffectRoot;
    };

    protected get interval(): number {
        return 0.03;
    }

    private progress: BattleProgressBar;
    private initTime: number;

    protected DoUpdate(data: IHeroObjBuffData): void {
        if (this.effect) {
            if (this.progress == null) {
                this.progress = this.effect.getComponent(BattleProgressBar);
                this.progress.SetActive(true);
                this.progress.node.setWorldPosition(this.hero.worldPosition.x, this.hero.worldPosition.y + 35, 0);
                this.initTime = data.time;
            }
            let value = (this.initTime - data.time) / this.initTime;
            this.progress.SetValue(value);
        }
    }

    protected DoEnd(data: IHeroObjBuffData): void {
        if (this.progress) {
            this.progress.SetActive(false);
        }
    }
}

//火炬木专属buff
export class H_HuoJuBuff extends HeroBuff {
    
    affectData : IHeroObjBuffData = null; 

    static idC = 0;
    //如要使用FlushAttri接口，请务必填上hero字段
    static CrateData(harmVal: number, atkSp: number, hero: HeroObj = null) {
        this.idC = this.idC+1;
        return <IHeroObjBuffData>{
            buffType: HeroObjBuffType.HuoJu,
            time: Number.MAX_VALUE,
            p1: harmVal,
            p2: atkSp,
            hero: hero,
            // bid : this.idC,
            // effLv:effLv,
        }
    }

    static FlushAttri(data: IHeroObjBuffData, harmVal: number, atkSp: number) {
        let harmOff = harmVal - data.p1;
        let speedOff = atkSp - data.p2;
        let buff = data.hero.buffMap.get(HeroObjBuffType.HuoJu)
        if(buff && buff instanceof H_HuoJuBuff && buff.affectData == data){
            // console.error(`HuoJuBuff FlushAttri,id=${data.bid}`)
            data.hero.LocalAttriBuff.harmValue += harmOff;
            data.hero.LocalAttriBuff.attackSpeed += speedOff;
        }
        data.p1 = harmVal;
        data.p2 = atkSp;
    }

    protected get path(): string {

        //10480051
        // let effLv = 1;
        // this.dataMap.forEach()
        // this.LoadBuffEffect
        return ResPath.Buff(10380241);
    }

    protected DoStart(data: IHeroObjBuffData) {
        if(this.affectData != data){
            return;
        }
        // console.error(`HuoJuBuff DoStart,id=${data.bid}`)
        this.hero.LocalAttriBuff.harmValue += data.p1;
        this.hero.LocalAttriBuff.attackSpeed += data.p2;
    }

    protected DoEnd(data: IHeroObjBuffData) {
        if(this.affectData != data){
            return;
        }
        // console.error(`HuoJuBuff DoEnd,id=${data.bid}`)
        this.hero.LocalAttriBuff.harmValue -= data.p1;
        this.hero.LocalAttriBuff.attackSpeed -= data.p2;
    }

    Add(data: IHeroObjBuffData) {
        if (this.affectData == null || this.affectData.p1 < data.p1) {
            if(this.affectData){
                this.DoEnd(this.affectData);
            }
            this.affectData = data;
        }
        super.Add(data);
    }

    RemoveBuffData(data: IHeroObjBuffData) {
        let re = super.RemoveBuffData(data);
        if(data == this.affectData){ 
            this.reaffectNewData();
        }
        return re;
    }

    protected Update() {
        super.Update();
        if(this.affectData != null && !this.dataMap.has(this.affectData)){
            this.reaffectNewData();
        }
    }

    reaffectNewData(){
        if(this.dataMap.size > 0){
            this.affectData = this.dataMap.entries().next().value;
            let maxValData: IHeroObjBuffData = null;
            this.dataMap.forEach((da) => {
                if (maxValData == null || maxValData.p1 < da.p1) {
                    maxValData = da;
                }
            });
            if (maxValData) {
                this.affectData = maxValData;
            }
            this.DoStart(this.affectData);
        }
        else{
            this.affectData = null;
        }       
    }

    Delete(){
        super.Delete();
        this.affectData = null;
    }
}


//狂怒状态
export class H_KuangNuBuff extends HeroBuff {
    protected get path(): string {
        return ResPath.SkillEffect(10480213, 3);
    }
}

