import { Node, Vec3 } from "cc";
import { CfgMonsterSkillData } from "config/CfgMonster";
import { ObjectPool } from "core/ObjectPool";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { SceneEffect, SceneEffectConfig } from "modules/scene_obj_spine/Effect/SceneEffect";
import { MonsterCreateInfo, MONSTER_SKILL_INDEX, BattleObjTag } from "../BattleConfig";
import { BattleCtrl } from "../BattleCtrl";
import { BattleData } from "../BattleData";
import { MoveFunc, IMoveFuncData, IMovePosInfo } from "../Function/MoveFunc";
import { SkillMonster } from "../Function/SkillMonster";
import { MonsterObj } from "../Object/MonsterObj";
import { BaseControl } from "./BaseControl";
import { SkillFunc, SkillColliderEvent } from "../Function/SkillFunc";
import { BattleHelper, BattleSceneLayerType } from "../BattleHelper";
import { IBattleScene } from "../BattleScene";
import { NATIVE } from "cc/env";


// 正常怪物的行为，笔直向下进攻
export class MonsterControl extends BaseControl {
    protected creatInfo: MonsterCreateInfo;
    protected ctrl_skill: SkillMonster[];
    attacking: boolean = false;

    moveFunc: MoveFunc;
    monsterObj: MonsterObj;

    get scene(): IBattleScene {
        return BattleCtrl.Inst().GetBattleScene(this.monsterObj ? this.monsterObj.tag : BattleObjTag.Player);
    }

    get homePos(): Vec3 {
        return this.scene.GetHomePos();
    }

    start() {
        if (!this.monsterObj)
            this.monsterObj = this.node.getComponent(MonsterObj);
        this.StartAttack();
    }

    StartAttack() {
        if (this.attacking) {
            return;
        }
        this.attacking = true;
        let data = this.GetRoute();
        this.moveFunc = new MoveFunc(data, this.monsterObj.tag);
        this.moveFunc.start();
        this.SetMoveSpeed();
        if (this.ctrl_skill)
            this.ctrl_skill.forEach(element => {
                element.Start();
            });
    }
    private t: number = 0;
    protected update(dt: number): void {
        if (BattleData.Inst().battleInfo.isPause) {
            return;
        }
        if (BattleData.Inst().battleInfo.globalTimeScale != 1) {
            dt *= BattleData.Inst().battleInfo.globalTimeScale;
        }
        //this.PreloadSkillAsset();
        this.t += dt;
        if (this.t >= 1) {
            this.Play(1);
            this.t = 0;
        }
    }

    private Play(dt: number) {
        if (this.ctrl_skill && this.monsterObj.hp > 0)
            this.ctrl_skill.forEach(element => {
                element.play(dt);
            });
    }

    addSkill(cfg_skill: CfgMonsterSkillData) {
        if (MONSTER_SKILL_INDEX[cfg_skill.skill_type]) {
            if (!this.ctrl_skill) {
                this.ctrl_skill = [];
            }
            let skill = ObjectPool.Get(MONSTER_SKILL_INDEX[cfg_skill.skill_type], cfg_skill, this);
            skill.init();
            this.ctrl_skill.push(skill);
        }
    }

    Pause(isPause: boolean) {
        if (this.moveFunc) {
            this.moveFunc.Pause(isPause);
        }
    }

    SetMoveSpeed() {
        if (this.moveFunc) {
            let scale = this.monsterObj.speedScale;
            this.moveFunc.SetSpeedScale(scale);
        }
    }

    SetMoveDir(dir: number) {
        if (this.moveFunc) {
            this.moveFunc.SetDir(<1 | -1>dir);
        }
    }

    //定制攻击路线
    GetRoute(): IMoveFuncData {
        let homePos = this.homePos;
        let tPos = new Vec3(this.node.worldPosition.x, homePos.y, 0);
        let posInfo = <IMovePosInfo>{
            speed: this.monsterObj.speed,
            pos: tPos,
        }
        let data = <IMoveFuncData>{
            node: this.node,
            targetPosList: [posInfo],
            ComleteFunc: this.MoveComlete.bind(this),
        }
        return data;
    }

    Die() {
        if (this.ctrl_skill) {
            this.ctrl_skill.forEach(element => {
                element.Die();
            });
            this.ctrl_skill.length = 0;
        }

    }

    Hit(value: number) {
        if (this.ctrl_skill)
            this.ctrl_skill.forEach(element => {
                element.Hit(value);
            });
    }

    //怪物移动完毕：就是怪物撞到城堡
    protected MoveComlete() {
        if (this.monsterObj == null || this.monsterObj.IsDied == null || this.monsterObj.IsDied()) {
            return;
        }
        this.monsterObj.ClearHeadInfo();
        let pos = this.node.worldPosition;
        //Native环境下怪物会闪烁的问题
        if (NATIVE) {
            setTimeout(() => {
                SceneEffect.Inst().Play(SceneEffectConfig.MonsterDie, this.scene.node, pos);
            }, 0);
        }
        else {
            SceneEffect.Inst().Play(SceneEffectConfig.MonsterDie, this.scene.node, pos);
        }

        AudioManager.Inst().Play(AudioTag.GuaiWuZhuangJi);
        this.monsterObj.hp = 0;
        this.scene.BeAttacked(this.monsterObj);

    }

    CrateSkillFunc(path: string, call?: (skill: SkillFunc) => void, onHit?: (event: SkillColliderEvent) => void, OnStop?: (skill: SkillFunc) => any, parent?: Node, offset?: Vec3) {
        if (this.monsterObj == null) {
            return;
        }
        let scene = this.scene;
        scene.dynamic.GetSkillAsset(path, (obj: Node) => {
            if (obj) {
                parent = parent ?? BattleHelper.GetNodeParent(BattleSceneLayerType.Skill, this.scene);
                parent.addChild(obj);
                let mono = obj.getComponent(SkillFunc);
                mono.Reset();
                obj.worldPosition = this.node.worldPosition;
                if (offset) {
                    obj.worldPosition = obj.worldPosition.add(offset);
                }
                mono.OnHit(onHit);
                mono.OnStop(OnStop);
                // this.skillFuncs.push(mono);
                if (call) {
                    call(mono);
                }
            }
        });
    }

    public setCreatInfo(info: MonsterCreateInfo) {
        this.creatInfo = info;
    }

    protected onDisable(): void {
        if (this.moveFunc) {
            this.moveFunc.Delete();
            this.moveFunc = null;
        }
        if (this.ctrl_skill) {
            this.ctrl_skill.forEach(element => {
                ObjectPool.Push(element);
            });
            this.ctrl_skill = null;
        }
    }
}




