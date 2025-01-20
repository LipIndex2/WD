import { Node, Vec3 } from "cc";
import { LogError } from "core/Debugger";
import { NodePools } from "core/NodePools";
import { SceneEffect, SceneEffectConfig } from "modules/scene_obj_spine/Effect/SceneEffect";
import { UIEffectConf } from "modules/scene_obj_spine/Effect/UIEffectConf";
import { TYPE_TIMER, Timer } from "modules/time/Timer";
import { ResPath } from "utils/ResPath";
import { MathHelper } from "../../../helpers/MathHelper";
import { CELL_WIDTH, FIGHT_CELL_WIDTH, IMonsterObjBuffData, MonsterObjBuffType } from "../BattleConfig";
import { BattleCtrl } from "../BattleCtrl";
import { BattleData } from "../BattleData";
import { BattleDebugData } from "../BattleDebugCfg";
import { HeroObj } from "../Object/HeroObj";
import { MonsterObj } from "../Object/MonsterObj";
import { IMoveFuncData, IMovePosInfo, MoveFunc } from "./MoveFunc";
enum BuffEffAlignment {
    Middle = 0, //怪物中心
    Buttom = 1, //怪物脚底
}

export class MonterBuff {

    //英雄造成的Buff伤害默认按照当前攻击力的十分之一处理(早晚得改)
    public static DefaultDamge(atkVal: number): number {
        return atkVal * 0.1;
    }

    //默认buff百分比加成数值
    static get DefaultPer() {
        return 10;
    };

    //默认buff持续时间
    static get DefaultTime() {
        return 2.5;
    };

    protected get path(): string {
        return null;
    };

    protected get effAlignment(): BuffEffAlignment {
        return BuffEffAlignment.Middle;
    }
    dataMap: Set<IMonsterObjBuffData>;
    protected effect: Node;
    protected time_run_ht: TYPE_TIMER
    private _interval: number = 0.1;
    protected get interval() {
        return this._interval * BattleData.Inst().battleInfo.globalTimeScale;
    };

    protected _started = false;

    monster: MonsterObj;
    buffType: MonsterObjBuffType;

    private buffMonsterId: number;

    constructor(monster: MonsterObj, type: MonsterObjBuffType) {
        this.monster = monster;
        this.buffType = type;
        this.buffMonsterId = monster.objId;
    }

    protected LoadBuffEffect() {
        if (this.path == null) {
            return;
        }
        NodePools.Inst().Get(this.path, obj => {
            if (this.monster.hp <= 0 || this.monster.objId != this.buffMonsterId) {
                LogError("buff资源挂载异常！！！！",)
                NodePools.Inst().Put(obj);
                return;
            }
            this.effect = obj;
            let effectCfg = this.effect.getComponent(UIEffectConf);
            if (effectCfg) {
                effectCfg.play();
            }
            obj.setParent(this.monster.node);
            if (this.effAlignment == BuffEffAlignment.Buttom) {
                obj.setPosition(0, 0);
            }
            else {
                obj.setPosition(0, this.monster.h / 2);
            }
            let scale = this.monster.w / FIGHT_CELL_WIDTH;
            // if (scale < 1) {
            // scale = 1;
            // }
            obj.setScale(scale, scale);
        });
    }

    Start() {
        if (this._started) {
            return
        }
        this._started = true;
        this.time_run_ht = Timer.Inst().AddRunTimer(this.Update.bind(this), this._interval, -1);
        this.LoadBuffEffect();
    }

    protected Update() {
        if (BattleData.Inst().battleInfo.isPause || this.dataMap == null) {
            return;
        }
        let removeList: IMonsterObjBuffData[] = []
        this.dataMap.forEach(((data) => {
            data.time -= this.interval;
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
            this.monster.RemoveBuff(this);
        }
    }

    Add(data: IMonsterObjBuffData) {
        if (this.dataMap == null) {
            this.dataMap = new Set();
        }

        if (!BattleDebugData.BATTLE_DEBUG_MODE) {
            if (data.time > MonterBuff.DefaultTime) {
                data.time = MonterBuff.DefaultTime;
            }
        }

        if (this.dataMap.has(data)) {
            // this.dataMap.add(data);
        } else {
            this.dataMap.add(data);
            this.DoStart(data);
        }
    }

    RemoveData(data: IMonsterObjBuffData) {
        if (this.dataMap == null || this.dataMap.size == 0) { return; }
        if (!this.dataMap.has(data)) { return; }
        this.dataMap.delete(data);
        this.DoEnd(data);
        if (this.dataMap.size <= 0) {
            this.monster.RemoveBuff(this);
        }
    }

    RemoveDataByHero(hero: HeroObj) {
        if (this.dataMap == null || this.dataMap.size == 0) {
            return;
        }
        let removeList: IMonsterObjBuffData[] = []
        this.dataMap.forEach((data) => {
            if (data.hero == hero) {
                removeList.push(data);
            }
        });
        removeList.forEach((v) => {
            this.RemoveData(v);
        })
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
    }

    GetBuffCountByHero(hero: HeroObj) {
        let count = 0;
        this.dataMap.forEach((data) => {
            if (data.hero == hero) {
                count++;
            }
        })
        return count;
    }

    HasDataByHeroId(heroId: number) {
        let re = false;
        this.dataMap.forEach((data) => {
            if (data.hero && data.hero.data.hero_id == heroId) {
                re = true;
            }
        });
        return re;
    }

    //加减buff持续时长
    OffsetTime(timeOff: number) {
        this.dataMap.forEach((data) => {
            data.time += timeOff;
        });
    }



    // //////////////// 以下重写 ////////////
    RemoveCallback() {

    }

    protected DoStart(data: IMonsterObjBuffData) {

    }

    protected DoUpdate(data: IMonsterObjBuffData) {

    }

    protected DoEnd(data: IMonsterObjBuffData) {

    }
}

//冰霜减速buff
export class BingShuangJianSuBuff extends MonterBuff {
    protected get path(): string {
        return ResPath.Buff(1019001);
    }
    constructor(monster: MonsterObj, type: MonsterObjBuffType) {
        super(monster, type);
    }


    protected DoStart(data: IMonsterObjBuffData) {
        let effectValue = data.p1;
        this.monster.AddSpeedScale(-effectValue);
    }


    protected DoEnd(data: IMonsterObjBuffData) {
        let effectValue = data.p1;
        this.monster.AddSpeedScale(effectValue);
    }
}

//火炬木减速(效果不叠加)
export class HuoJuJianSuBuff extends MonterBuff {
    //scale 20=减速20%
    public static CreateData(heroObj: HeroObj, scale: number): IMonsterObjBuffData {
        return <IMonsterObjBuffData>{
            buffType: MonsterObjBuffType.HuoJuJianSu,
            hero: heroObj,
            time: Number.MAX_VALUE,
            p1: MathHelper.NumToPer(scale)
        }
    }
    protected get path(): string {
        return null;
    }
    private affactedData: IMonsterObjBuffData = null;
    protected DoStart(data: IMonsterObjBuffData) {
        if (this.affactedData == null) {
            this.affactedData = data;
            this.monster.AddSpeedScale(-this.affactedData.p1);
        } else if (this.affactedData.p1 < data.p1) {
            this.monster.AddSpeedScale(-(data.p1 - this.affactedData.p1));
            this.affactedData = data;
        }
    }

    public static FlushData(mon: MonsterObj, hero: HeroObj, scale: number) {

        let buffData: IMonsterObjBuffData = null;
        let buff: HuoJuJianSuBuff = null;
        if (mon.buffMap.has(MonsterObjBuffType.HuoJuJianSu)) {
            buff = <HuoJuJianSuBuff>mon.buffMap.get(MonsterObjBuffType.HuoJuJianSu);
            if (buff.dataMap != null) {
                buff.dataMap.forEach((da) => {
                    if (da.hero == hero) {
                        buffData = da;
                    }
                });
            }
        }
        if (buffData == null) {
            buffData = HuoJuJianSuBuff.CreateData(hero, scale);
            mon.AddBuff(buffData);
        }
        else {
            scale = MathHelper.NumToPer(scale);
            if (buffData.p1 == scale) {
                return;
            }
            if (buffData == buff.affactedData) {
                mon.AddSpeedScale(-(scale - buffData.p1));
            }
            buffData.p1 = scale;
            buff.flushAffactData();
        }
    }

    private flushAffactData(ignoreData: IMonsterObjBuffData = null) {
        let maxValData: IMonsterObjBuffData = null;
        this.dataMap.forEach((da) => {
            if (ignoreData == da) {
                return;
            }
            if (maxValData == null || maxValData.p1 < da.p1) {
                maxValData = da;
            }
        });
        if (this.affactedData == maxValData) {
            return;
        }
        let oldSc = this.affactedData ? this.affactedData.p1 : 0;
        let newSc = maxValData ? maxValData.p1 : 0;
        this.monster.AddSpeedScale(-(newSc - oldSc));
        this.affactedData = maxValData;
    }

    protected DoEnd(data: IMonsterObjBuffData) {
        if (this.affactedData == data) {
            this.flushAffactData(data);
        }
    }
}


//践踏减速
export class JianTaJianSuBuff extends BingShuangJianSuBuff {
    protected get path(): string {
        return ResPath.Buff(10390001);
    }
}

//弱化 单data生效
export class RuoHuaSuBuff extends MonterBuff {
    private static DEFAULT_SCALE = 50;
    //scale 撞击后宅伤害-{scale}%
    public static CreateData(hero: HeroObj, time: number = MonterBuff.DefaultTime, scale: number = RuoHuaSuBuff.DEFAULT_SCALE) {
        return <IMonsterObjBuffData>{
            buffType: MonsterObjBuffType.RuoHua,
            hero: hero,
            time: time,
            p1: MathHelper.NumToPer(scale),
        }
    }

    protected get path(): string {
        return ResPath.Buff(1058018);
    }

    private affactedData: IMonsterObjBuffData = null;
    // data.p1是弱化效果， 0 ~ 1
    protected DoStart(data: IMonsterObjBuffData) {
        if (this.affactedData == null || this.affactedData.p1 < data.p1) {
            let effectValue = data.p1;
            let oldVal = this.affactedData ? this.affactedData.p1 : 0;
            this.monster.attackHarmScale -= (effectValue - oldVal);
            this.affactedData = data;
        }

    }

    protected DoEnd(data: IMonsterObjBuffData) {
        if (this.affactedData == data) {
            let effectValue = data.p1;
            this.monster.attackHarmScale += effectValue;
            this.affactedData = null;

            //重新生效一个数值最大的data
            let maxValData: IMonsterObjBuffData = null;
            this.dataMap.forEach((da) => {
                if (da == data) {
                    return;
                }
                if (maxValData == null || maxValData.p1 < da.p1) {
                    maxValData = da;
                }
            });
            if (maxValData) {
                this.affactedData = maxValData;
                this.monster.attackHarmScale -= this.affactedData.p1;
            }
        }
    }
}


//击退效果 击退 data.p1格
export class JiTuiBuff extends MonterBuff {
    static DEFAULT_TIME = 0.2;
    static DEFAULT_CELL = 1;
    public static CreateData(heroObj: HeroObj, cell: number = JiTuiBuff.DEFAULT_CELL, jituiTime: number = JiTuiBuff.DEFAULT_TIME): IMonsterObjBuffData {
        return <IMonsterObjBuffData>{
            buffType: MonsterObjBuffType.JiTui,
            hero: heroObj,
            time: jituiTime,
            p1: cell
        }
    }
    protected get path(): string {
        return null;
    }
    protected DoStart(data: IMonsterObjBuffData) {
        let scene = BattleCtrl.Inst().GetBattleScene(this.monster.tag);
        SceneEffect.Inst().Play(SceneEffectConfig.JiTuiMonster, scene.node, this.monster.worldPosition);
        let value = data.p1 ?? 1
        let speed = value * CELL_WIDTH / data.time;
        this.monster.backYByCell(value, speed);
    }
}


//冰冻buff
export class BingShuangBingDongBuff extends MonterBuff {

    protected get path(): string {
        return ResPath.Buff(1019000);
    }
    constructor(monster: MonsterObj, type: MonsterObjBuffType) {
        super(monster, type);
    }

    protected DoStart(data: IMonsterObjBuffData) {
        this.monster.Pause(true);
    }

    protected DoEnd(data: IMonsterObjBuffData) {
        this.monster.Pause(false);
    }
}

//眩晕buff
export class XuanYunBuff extends MonterBuff {
    public static CreateData(heroObj: HeroObj, keepTime: number): IMonsterObjBuffData {
        return <IMonsterObjBuffData>{
            buffType: MonsterObjBuffType.XuanYun,
            hero: heroObj,
            time: keepTime,
        }
    }
    protected get path(): string {
        return ResPath.Buff(1058003);
    }
    constructor(monster: MonsterObj, type: MonsterObjBuffType) {
        super(monster, type);
    }

    protected DoStart(data: IMonsterObjBuffData) {
        this.monster.Pause(true);
    }

    protected DoEnd(): void {
        this.monster.Pause(false);
    }
}

//缠绕buff
export class ChanRaoBuff extends MonterBuff {
    public static CreateData(heroObj: HeroObj, keepTime: number): IMonsterObjBuffData {
        return <IMonsterObjBuffData>{
            buffType: MonsterObjBuffType.ChanRao,
            hero: heroObj,
            time: keepTime,
        }
    }
    protected get path(): string {
        return ResPath.Buff(1058005);
    }

    protected get effAlignment() {
        return BuffEffAlignment.Buttom;
    }

    constructor(monster: MonsterObj, type: MonsterObjBuffType) {
        super(monster, type);
    }

    protected DoStart(data: IMonsterObjBuffData) {
        this.monster.Pause(true);
    }

    protected DoEnd(): void {
        this.monster.Pause(false);
    }
}

//流血buff
export class LiuXueBuff extends MonterBuff {
    private updateT: number = 0;
    protected get path(): string {
        return ResPath.Buff(1058006);
    }

    protected DoUpdate(data: IMonsterObjBuffData) {
        this.updateT += this.interval;
        if (this.updateT >= 1) {
            this.updateT = 0;
            let damScale = data.hero ? data.hero.GetSkillAttri().lixueScale : 1;
            this.monster.BuffDeductHp(data, data.p1 * damScale);
        }
    }
}


//灼烧buff
export class ZuoShaoBuff extends MonterBuff {
    //damage:每次判定造成的伤害 p1
    //damgeInteval:判定的间隔时间 默认为1秒
    public static CreateData(heroObj: HeroObj, keepTime: number,
        damage: number, damgeInteval: number = 1): IMonsterObjBuffData {
        return <IMonsterObjBuffData>{
            buffType: MonsterObjBuffType.ZhuoShao,
            hero: heroObj,
            time: keepTime,
            p1: damage,
            p2: damgeInteval
        }
    }

    private updateT: number = 0;
    protected get path(): string {
        return ResPath.Buff(1058004);
    }

    protected DoUpdate(data: IMonsterObjBuffData) {
        this.updateT += this.interval;
        let damScale = data.hero ? data.hero.GetSkillAttri().zuoshaoScale : 1;
        let damgeInteval = data.p2 ?? 1;
        if (this.updateT >= damgeInteval) {
            this.updateT = 0;
            this.monster.BuffDeductHp(data, data.p1 * damScale);
        }
    }
}

export class DeductHpBuff extends LiuXueBuff {
    protected get path(): string {
        return null;
    }
}

export class ZhongDuBuff extends MonterBuff {
    //damage:每次判定造成的伤害 p1
    //damgeInteval:判定的间隔时间 默认为1秒
    public static CreateData(heroObj: HeroObj, keepTime: number,
        damage: number, damgeInteval: number = 1): IMonsterObjBuffData {
        return <IMonsterObjBuffData>{
            buffType: MonsterObjBuffType.ZhongDu,
            hero: heroObj,
            time: keepTime,
            p1: damage,
            p2: damgeInteval
        }
    }

    private updateT: number = 0;
    protected get path(): string {
        return ResPath.Buff(1058002);
    }

    protected DoUpdate(data: IMonsterObjBuffData) {
        this.updateT += this.interval;
        let damScale = data.hero ? data.hero.GetSkillAttri().zhongduScale : 1;
        if (this.updateT >= 1) {
            this.updateT = 0;
            this.monster.BuffDeductHp(data, data.p1 * damScale);
        }
    }
}

//腐败buff
export class FuBaiBuff extends MonterBuff {

    static CrateData(hero: HeroObj, time: number, damage: number, yishang: number = 0) {
        return <IMonsterObjBuffData>{
            buffType: MonsterObjBuffType.FuBai,
            hero: hero,
            time: time,
            p1: damage,
            p2: yishang,
        }
    }

    private updateT: number = 0;
    protected get path(): string {
        return ResPath.Buff(1019002);
    }

    protected DoStart(data: IMonsterObjBuffData) {
        if (data.p2 && data.p2 != 0) {
            this.monster.damgeScale += (data.p2 / 100)
        }
    }

    protected DoEnd(data: IMonsterObjBuffData) {
        if (data.p2 && data.p2 != 0) {
            this.monster.damgeScale -= (data.p2 / 100)
        }
    }

    protected DoUpdate(data: IMonsterObjBuffData) {
        this.updateT += this.interval;
        if (this.updateT >= 1) {
            this.updateT = 0;
            let damScale = data.hero ? data.hero.GetSkillAttri().fubaiScale : 1;
            this.monster.BuffDeductHp(data, data.p1 * damScale);
        }
    }
}

//禁锢buff
export class JinGuBuff extends MonterBuff {
    static CrateData(hero: HeroObj, time: number) {
        return <IMonsterObjBuffData>{
            buffType: MonsterObjBuffType.JinGu,
            hero: hero,
            time: time,
        }
    }
    protected get path(): string {
        return ResPath.Buff(1058008);
    }
    constructor(monster: MonsterObj, type: MonsterObjBuffType) {
        super(monster, type);
    }

    protected DoStart(data: IMonsterObjBuffData) {
        this.monster.Pause(true);
    }

    protected DoEnd(data: IMonsterObjBuffData) {
        this.monster.Pause(false);
    }
}

//魅惑buff
export class MeiHuoBuff extends MonterBuff {
    protected get path(): string {
        return ResPath.Buff(1058007);
    }
    constructor(monster: MonsterObj, type: MonsterObjBuffType) {
        super(monster, type);
    }

    protected DoStart(data: IMonsterObjBuffData) {
        this.monster.Pause(true);
        if (data.p1) {
            this.monster.damgeScale += (data.p1 / 100)
        }
    }

    protected DoEnd(data: IMonsterObjBuffData) {
        this.monster.Pause(false);
        if (data.p1) {
            this.monster.damgeScale -= (data.p1 / 100)
        }
    }
}

//恐惧buff
export class KongJuBuff extends MonterBuff {
    private kongjuing = false;
    static CrateData(hero: HeroObj, time: number) {
        return <IMonsterObjBuffData>{
            buffType: MonsterObjBuffType.KonJu,
            hero: hero,
            time: time,
        }
    }
    protected get path(): string {
        return ResPath.Buff(1058009);
    }

    constructor(monster: MonsterObj, type: MonsterObjBuffType) {
        super(monster, type);
    }

    protected DoStart(data: IMonsterObjBuffData) {
        if (!this.kongjuing) {
            let scene = BattleCtrl.Inst().GetBattleScene(this.monster.tag);
            let topPos = scene.GetTopPos();
            let curPos = this.monster.centerWorldPos;
            let centerPos = scene.node.worldPosition;//屏幕中心位置
            let dir = curPos.x < centerPos.x ? 0 : 1;
            let letX = this.monster.centerWorldPos.x - dir * FIGHT_CELL_WIDTH;//移动左X 
            let rightX = this.monster.centerWorldPos.x + Math.abs(dir - 1) * FIGHT_CELL_WIDTH;//移动右X 
            let topOffY = 70;
            let luanEnd = topPos.y + topOffY; //移动终点Y
            let distY = (luanEnd - curPos.y); //移动距离
            let moveY = FIGHT_CELL_WIDTH / 3;
            let clipCount = Math.ceil(distY / moveY); //移动次数
            let targetPosList: IMovePosInfo[] = []
            let y: number = curPos.y;
            let x: number;
            for (let i = 1; i <= clipCount; i++) {
                if (i == clipCount) {
                    y = luanEnd;
                    x = curPos.x
                } else {
                    let hafMoveY = moveY * MathHelper.GetRandomFloat(0.5, 1);
                    y += MathHelper.GetRandomFloat(hafMoveY, moveY);
                }
                if (i % 2 == dir) {
                    x = letX;
                } else {
                    x = rightX;
                }
                let posInfo = <IMovePosInfo>{
                    speed: this.monster.speed,
                    pos: new Vec3(x, y, 0),
                }
                targetPosList.push(posInfo);
            }
            let route_data = <IMoveFuncData>{
                node: this.monster.monsterCtrl.node,
                targetPosList: targetPosList,
                ComleteFunc: null,
            }
            if (this.monster.monsterCtrl.moveFunc)
                this.monster.monsterCtrl.moveFunc.Delete();
            this.monster.monsterCtrl.moveFunc = new MoveFunc(route_data, this.monster.tag);
            this.monster.monsterCtrl.moveFunc.start();
            this.kongjuing = true;
            // this.monster.SetMoveDir(-1);
        }

        if (data.p1) {
            this.monster.AddSpeedScale(-data.p1 / 100);
        }
    }

    protected DoEnd(data: IMonsterObjBuffData): void {
        if (this.dataMap.size <= 0) {
            if (this.monster.monsterCtrl.moveFunc)
                this.monster.monsterCtrl.moveFunc.Delete();
            let route_data = this.monster.monsterCtrl.GetRoute()
            this.monster.monsterCtrl.moveFunc = new MoveFunc(route_data, this.monster.tag);
            this.monster.monsterCtrl.moveFunc.start();
            this.kongjuing = false;
            // this.monster.SetMoveDir(1);
        }
        if (data.p1) {
            this.monster.AddSpeedScale(data.p1 / 100);
        }
    }
}

//无敌buff
export class WuDiBuff extends MonterBuff {

}

export class YiShangBuff extends MonterBuff {
    //damScale受到伤害的加成 10=%10
    //defOffset 减多少全属性抗性 20=抗性-%20
    static CrateData(hero: HeroObj, time: number, dameScale: number, defOffset: number = 0) {
        return <IMonsterObjBuffData>{
            buffType: MonsterObjBuffType.YiShang,
            hero: hero,
            time: time,
            p1: dameScale,
            p2: -defOffset,
        }
    }
    protected get path(): string {
        return ResPath.Buff(1058010);
    }

    protected DoStart(data: IMonsterObjBuffData) {
        this.monster.damgeScale += (data.p1 / 100);
        this.monster.defOffset += data.p2;
    }

    protected DoEnd(data: IMonsterObjBuffData) {
        this.monster.damgeScale -= (data.p1 / 100);
        this.monster.defOffset -= data.p2;
    }
}

//冰雪印记buff
export class BingXueYinJiBuff extends MonterBuff {
    private updateT: number = 0;
    protected get path(): string {
        return ResPath.Buff(10480195);
    }
}
