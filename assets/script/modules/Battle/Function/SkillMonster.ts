import { CfgMonsterSkillData } from "config/CfgMonster";
import { IPoolObject } from "core/ObjectPool";
import { MathHelper } from "../../../helpers/MathHelper";
import { FIGHT_CELL_WIDTH, IHeroObjBuffData, HeroObjBuffType, MAP_COL, IMonsterObjBuffData, MonsterObjBuffType } from "../BattleConfig";
import { BattleCtrl } from "../BattleCtrl";
import { BattleScene } from "../BattleScene";
import { MonsterControl } from "../Control/MonsterControl";
import { HeroObj } from "../Object/HeroObj";
import { Vec3 } from "cc";
import { SceneEffect, SceneEffectConfig } from "modules/scene_obj_spine/Effect/SceneEffect";
import { ResPath } from "utils/ResPath";
import { SkillLeiShe } from "./SkillLeiShe";
import { LogError } from "core/Debugger";
import { BattleDynamicHelper } from "../BattleDynamicHelper";


export class SkillMonster implements IPoolObject {
    private t: number = 0;
    private _skill_time = 0;
    reInit(cfg: CfgMonsterSkillData, ctrl: MonsterControl): void {
        this.cfg = cfg;
        this.ctrl = ctrl;
    }
    onPoolReset(): void {
        this.cfg = undefined;
        this.ctrl = undefined;
        this._skill_time = 0;
        this.t = 0;
    }
    constructor(cfg: CfgMonsterSkillData, ctrl: MonsterControl) {
        this.reInit(cfg, ctrl);
    }
    protected cfg: CfgMonsterSkillData
    protected ctrl: MonsterControl;
    init() { }
    Start() { }
    play(dt: number) {
        if (this._skill_time < 0) {
            return
        }
        let player_speed = this.cfg.parm1;
        // if (player_speed) {
        this._skill_time += dt;
        this.t += dt;
        if (this.t >= player_speed) {
            let time = this.doPlay();
            if (time && time != 0 && this._skill_time >= time) {
                this._skill_time = -1;
                this.doEnd();
            }
            this.t = 0;
        }
        // }
    }

    /**
     * 执行技能
     * @return <1> (value = void|0：不计算时间每秒执行一次技能)  <2> (value > 0：技能持续时间 超过技能时间后将不再释放技能 并且调用doEnd)
     */
    protected doPlay(): number | void {

    }

    /**
     * 执行：技能释放完毕  根据doPlay返回的时间判断
     */
    doEnd(): void {

    }

    /**
     * 怪物死亡Die
     */
    Die() {

    }

    Hit(value: number) {

    }

    protected creatMonster(pos: Vec3, bom_pos: { i: number, j: number }, defautBuff?: IMonsterObjBuffData[]) {
        BattleCtrl.Inst().battleScene.PlayRoundAction(this.cfg, false, pos, defautBuff);
    }

    protected creatMonster2() {
        BattleCtrl.Inst().battleScene.PlayRoundAction(this.cfg);
    }
}

export class SkillMonster1 extends SkillMonster {
    doPlay(): void {
        let monster_obj = this.ctrl.monsterObj;
        let pos = monster_obj.worldPosition;
        let bos_ij = BattleCtrl.Inst().battleScene.battleBG.GetIJByPos(pos);
        this.creatMonster(pos, bos_ij)
    }
}

export class SkillMonster2 extends SkillMonster {
    doPlay(): void {
        this.creatMonster2();
    }
}

export class SkillMonster3 extends SkillMonster {
    Die(): void {
        let monster_obj = this.ctrl.monsterObj;
        let pos = monster_obj.worldPosition;
        let bos_ij = BattleCtrl.Inst().battleScene.battleBG.GetIJByPos(pos);
        this.creatMonster(pos, bos_ij)
    }
}

export class SkillMonster4 extends SkillMonster {
    Die(): void {
        this.creatMonster2();
    }
}

/**受伤害往前冲 */
export class SkillMonster5 extends SkillMonster {
    private propose: number;
    private menmb_hp: number;
    init() {
        let propose = this.cfg.parm2;
        let hp = this.ctrl.monsterObj.maxHp;
        this.propose = hp * (propose / 10000);
        this.menmb_hp = hp;
    }

    Hit(value: number) {
        if (this.menmb_hp == this.ctrl.monsterObj.hp) {
            return;
        }
        let dis = this.menmb_hp - this.ctrl.monsterObj.hp;
        if (dis >= this.propose) {
            this.ctrl.moveFunc.backY(-this.cfg.parm3);
            this.menmb_hp = this.ctrl.monsterObj.hp;
        }
    }

    onPoolReset(): void {
        super.onPoolReset();
        this.propose = undefined;
        this.menmb_hp = 0;
    }
}

/**超过英雄的使英雄眩晕 */
export class SkillMonster6 extends SkillMonster {
    private markHero: { [key: string]: boolean };
    init() {
        this.markHero = {};
    }
    doPlay(): void {
        let heros = BattleCtrl.Inst().battleScene.heros;
        let monster_pos = this.ctrl.monsterObj.worldPosition;
        let col_monster = this.ctrl.monsterObj.createInfo.j;
        let col_monster_left = col_monster - 1;
        let col_monster_right = col_monster + 1;
        BattleScene.ForeachHeros(heros, (v: HeroObj, row: number, col: number) => {
            if (v.data.stage > 0) {
                let hero_pos = v.heroCtrl.hero.worldPosition;
                if (monster_pos.y < hero_pos.y && (col == col_monster || col == col_monster_left || col == col_monster_right)) {
                    let key = "" + row + col;
                    if (!this.markHero[key]) {
                        let data = <IHeroObjBuffData>{
                            buffType: HeroObjBuffType.XuanYun,
                            time: +this.cfg.parm2,
                        }
                        v.AddBuff(data);
                    }
                }
            }
        })
    }
    onPoolReset(): void {
        super.onPoolReset();
        this.markHero = undefined;
    }
}

/**消灭棋子 */
export class SkillMonster7 extends SkillMonster {
    doPlay(): void {
        let hero = BattleCtrl.Inst().battleScene.GetRandomHero();
        if (hero) {
            let data = <IHeroObjBuffData>{
                buffType: HeroObjBuffType.WaitDie,
                time: Number.MAX_VALUE,
            }
            hero.AddBuff(data);
            this.ctrl.moveFunc.Pause(true)
            this.ctrl.CrateSkillFunc(SceneEffectConfig.BOSS_15022.path, (skill: SkillLeiShe) => {
                if (this.ctrl.monsterObj.IsDied()) {
                    return
                }
                skill.endPoint = hero.node.worldPosition
                SceneEffect.Inst().Play(SceneEffectConfig.BOSS_15025, BattleCtrl.Inst().battleScene.node, hero.node.worldPosition);
                BattleDynamicHelper.PlaySkill(skill, hero.tag);
            }, undefined, () => {
                if (!this.ctrl.moveFunc) {
                    return
                }
                this.ctrl.moveFunc.Pause(false);
            }, undefined, new Vec3(0, this.ctrl.monsterObj.h / 2))
            // SceneEffect.Inst().Play(SceneEffectConfig.BOSS_15022, BattleCtrl.Inst().battleScene.node, this.ctrl.monsterObj.worldPosition);
            // SceneEffect.Inst().Play(SceneEffectConfig.BOSS_15025, BattleCtrl.Inst().battleScene.node, this.hero.worldPosition);
        }
    }
}

/**使英雄间隔攻击 */
export class SkillMonster8 extends SkillMonster {
    doPlay(): void {
        let heros = BattleCtrl.Inst().battleScene.heros;
        BattleScene.ForeachHeros(heros, (hero: HeroObj, row: number, col: number) => {
            if (hero && hero.data.stage > 0) {
                let data = <IHeroObjBuffData>{
                    buffType: HeroObjBuffType.Stop,
                    time: +this.cfg.parm2,
                }
                hero.AddBuff(data);
            }
        })
        SceneEffect.Inst().Play(SceneEffectConfig.BOSS_15020, BattleCtrl.Inst().battleScene.node);
    }
}

/**棋子换位置 */
export class SkillMonster9 extends SkillMonster {
    doPlay(): void {
        // let heros = BattleCtrl.Inst().battleScene.heros;
        // let num = +this.cfg.parm2;
        // if(!num){
        //     num = 1;
        // }
        // let num_col = MAP_COL - 1;
        // let num_row = BattleCtrl.Inst().battleScene.battleBG.Row;
        // for (let index = 0; index < num; index++) {
        //     let col = MathHelper.GetRandomNum(0, num_col);
        //     let row = MathHelper.GetRandomNum(0, num_row);
        //     let hero = heros[col][row];

        //     let addCol = MathHelper.GetRandomNum(0, 1);
        //     let addrow = MathHelper.GetRandomNum(0, 1);
        //     let col2: number;
        //     let row2: number;
        //     if (addCol) {
        //         col2 += addrow ? 1 : -1;
        //     } else {
        //         row2 += addrow ? 1 : -1;
        //     }
        //     let hero2 = heros[col2][row2];
        //     BattleCtrl.Inst().battleScene.SwapHero(hero, hero2);
        //     SceneEffect.Inst().Play(SceneEffectConfig.BOSS_15027, hero.node);
        //     SceneEffect.Inst().Play(SceneEffectConfig.BOSS_15027, hero.node);
        // }

        let hero1 = BattleCtrl.Inst().battleScene.GetRandomHero();
        if (hero1) {
            let hero2 = BattleCtrl.Inst().battleScene.GetRandomHero(hero1);
            if (hero2) {
                BattleCtrl.Inst().battleScene.SwapHero(hero1, hero2, undefined, false);
                SceneEffect.Inst().Play(SceneEffectConfig.BOSS_15027, BattleCtrl.Inst().battleScene.node, hero1.node.worldPosition);
                SceneEffect.Inst().Play(SceneEffectConfig.BOSS_15027, BattleCtrl.Inst().battleScene.node, hero2.node.worldPosition);
            }
        }


        SceneEffect.Inst().Play(SceneEffectConfig.BOSS_15023, this.ctrl.monsterObj.node);
        SceneEffect.Inst().Play(SceneEffectConfig.BOSS_15026, this.ctrl.monsterObj.node);

    }
}

/**变羊 */
export class SkillMonster10 extends SkillMonster {
    doPlay(): void {
        let hero = BattleCtrl.Inst().battleScene.GetRandomHero();
        if (hero) {
            let data = <IHeroObjBuffData>{
                buffType: HeroObjBuffType.Yang,
                time: +this.cfg.parm2,
            }
            hero.AddBuff(data);
        }
    }
}

/**召唤火球 */
export class SkillMonster11 extends SkillMonster {
    private _times = 0;
    Start() {
        this.ctrl.moveFunc.Pause(true);

        let monster = this.ctrl.monsterObj;
        monster.AddBuff(<IMonsterObjBuffData>{
            buffType: MonsterObjBuffType.WuDi,
            time: this.cfg.parm7 + 1,
            hero: undefined
        })
    }
    doPlay(): number {
        this._times
        let monster_obj = this.ctrl.monsterObj;
        let pos = monster_obj.worldPosition;
        let bos_ij = BattleCtrl.Inst().battleScene.battleBG.GetIJByPos(pos);
        this.creatMonster(pos, bos_ij
            //     , [<IMonsterObjBuffData>{
            //     buffType: MonsterObjBuffType.WuDi,
            //     time: Number.MAX_VALUE,
            //     hero: undefined
            // }]
        )
        return +this.cfg.parm7;
    }
    doEnd(): void {
        this.ctrl.moveFunc.Pause(false);
    }
}


/**召唤怪物 */
export class SkillMonster12 extends SkillMonster {
    Start(): void {
        this.ctrl.moveFunc.Pause(true);

        let monster = this.ctrl.monsterObj;
        monster.AddBuff(<IMonsterObjBuffData>{
            buffType: MonsterObjBuffType.WuDi,
            time: this.cfg.parm7 + 1,
            hero: undefined
        })
    }
    doPlay(): number {
        let monster_obj = this.ctrl.monsterObj;
        let pos = monster_obj.worldPosition;
        let bos_ij = BattleCtrl.Inst().battleScene.battleBG.GetIJByPos(pos);
        this.creatMonster(pos, bos_ij)
        return +this.cfg.parm7;
    }
    doEnd(): void {
        this.ctrl.monsterObj.Die();
    }
}