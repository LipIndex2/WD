import { _decorator, Node, Rect, Vec3, UITransform, Tween, tween, Color, easing, Skeleton, sp, Vec2, math } from 'cc';
import * as fgui from "fairygui-cc";
import { BattleCtrl } from '../BattleCtrl';
import { MonsterControl } from '../Control/MonsterControl';
import { BattleObj } from './BattleObj';
import { IColliderRectNode } from '../BattleCollider';
import { CfgMonsterData } from 'config/CfgMonster';
import { NodePools } from 'core/NodePools';
import { ResPath } from 'utils/ResPath';
import { MathHelper } from '../../../helpers/MathHelper';
import { MonsterDieEffectConfig, SceneEffect, SceneEffectConfig } from 'modules/scene_obj_spine/Effect/SceneEffect';
import { BattleEventType, BATTLE_HP_NO_SHOW, BuffToHarmType, CELL_WIDTH, FIGHT_CELL_WIDTH, HeroObjBuffType, IMonsterObjBuffData, MonsterBUffTypeMap, MonsterCreateInfo, MonsterCtrlMap, MonsterEventType, MonsterHarmType, MonsterObjBuffType, MonsterType, MONSTER_MIN_SPEED_SCALE, ZHONG_JI_SCALE, BattleModel, SceneType } from '../BattleConfig';
import { BattleData, BattleInfo } from '../BattleData';
import { HeroObj } from './HeroObj';
import { BattleHarmShowIconType, BossHeadInfo, IBossHeadInfoData } from '../BattleView';
import { MonterBuff } from '../Function/MonsterBuff';
import { UtilHelper } from '../../../helpers/UtilHelper';
import { ObjectPool } from 'core/ObjectPool';
import { EventCtrl } from 'modules/common/EventCtrl';
import { LogError } from 'core/Debugger';
import { BattleDynamicHelper } from '../BattleDynamicHelper';
import { CocSpriteGradient } from '../../../ccomponent/CocSpriteGradient';
import { NATIVE } from 'cc/env';
const { ccclass, property } = _decorator;

export type MonsterEventAction = (monster: MonsterObj) => void;
export type MonsterEventActionHT = { type: MonsterEventType, action: MonsterEventAction };

@ccclass('MonsterObj')
export class MonsterObj extends BattleObj implements IColliderRectNode {
    @property(Node)
    ShowRoot: Node;
    data: CfgMonsterData;
    createInfo: MonsterCreateInfo;
    private model: Node;

    get worldPosition(): Vec3 {
        return this.node.worldPosition;
    };
    private _wordAABB: Rect;
    get wordAABB(): Rect {
        if (this.colliderTrans == null) {
            this._wordAABB = new Rect(this.worldPosition.x - this.w / 2, this.worldPosition.y, this.w, this.h);
        } else {
            this._wordAABB = BattleDynamicHelper.SmallTransformToRect(this.colliderTrans, this.worldPosition, this.nodeScale, this._wordAABB);
        }
        return this._wordAABB;
    }
    get centerWorldPos(): Vec3 {
        let worldPos = this.node.getWorldPosition();
        if (this.colliderTrans == null) {
            return worldPos;
        }
        let h = this.colliderTrans.height;
        return new Vec3(worldPos.x, worldPos.y + (h / 2), 0);
    }
    public colliderTrans: UITransform;

    objId: number;
    exp: number = 0;

    get w(): number {
        if (this.colliderTrans == null) {
            return FIGHT_CELL_WIDTH;
        }
        return this.colliderTrans.width;
    }
    get h(): number {
        if (this.colliderTrans == null) {
            return FIGHT_CELL_WIDTH;
        }
        return this.colliderTrans.height;
    }

    get nodeScale(): Vec3 {
        return this.ShowRoot.scale;
    }

    hp: number = 100;
    maxHp: number = 100;
    get hpProgress(): number {
        if (this.hp <= 0) {
            return 0;
        }
        return this.hp / this.maxHp;
    }
    speed: number = 0;
    speedScaleBuff: number = 0;
    get speedScale(): number {
        let scale = this.battleInfo.skillAttri.monsterMoveParcent + this.speedScaleBuff;
        if (scale < MONSTER_MIN_SPEED_SCALE) {
            scale = MONSTER_MIN_SPEED_SCALE;
        }
        return scale;
    }

    //伤害
    private _attackHarmScale: number = 1;
    get attackHarmScale(): number {
        return this._attackHarmScale;
    }
    set attackHarmScale(v: number) {
        this._attackHarmScale = v;
    }
    get attackHarm(): number {
        return this.data.attack * this.attackHarmScale;
    }

    //BuffReduce血量变化时的伤害加成
    private _buffReduceScale: number = 0;
    set buffReduceScale(v: number) {
        this._buffReduceScale = v;
    }
    get buffReduceScale(): number {
        return this._buffReduceScale;
    }

    //所有扣血时的伤害加成
    private _damgeScale: number = 0;
    set damgeScale(v: number) {
        this._damgeScale = v;
    }
    get damgeScale(): number {
        return this._damgeScale;
    }

    //全属性抗性提升、降低[例:-20 代表抗性-20%]
    private _defOffset: number = 0;
    set defOffset(v: number) {
        this._defOffset = v;
    }
    get defOffset(): number {
        return this._defOffset;
    }

    monsterCtrl: MonsterControl;

    buffMap: Map<MonsterObjBuffType, MonterBuff>;

    //伤害战报
    report: IPB_SCBattleMonsterInfo;

    //事件订阅
    private eventMap: Map<MonsterEventType, MonsterEventAction[]> = new Map();

    //buff抗性
    private buffDefMap: Map<MonsterObjBuffType, number> = new Map();

    private initPos: Vec3;
    private builtin: CocSpriteGradient;
    // 是否移动过了 只做简单判断
    get isMoved(): boolean {
        if (this.initPos == null) {
            return false;
        }
        return this.initPos.y != this.node.worldPosition.y || this.initPos.x != this.node.worldPosition.x;
    }

    get battleInfo(): BattleInfo {
        return BattleData.Inst().GetBattleInfo(this.tag);
    }

    SetData(data: CfgMonsterData) {
        super.SetData(data);
        this.initPos = new Vec3(this.node.worldPosition.x, this.node.worldPosition.y);
        this.SetHp();
        this.speedScaleBuff = 0;
        this._attackHarmScale = 1;
        this._buffReduceScale = 0;
        this._damgeScale = 0;
        this._defOffset = 0;
        this.buffMap = new Map();
        this.LoadModel();
        this.SetShow();

        let mono = MonsterCtrlMap[this.createInfo.cfg_ctrl.move_type];
        this.monsterCtrl = this.node.addComponent(mono);
        this.monsterCtrl.setCreatInfo(this.createInfo);
        this.AddCtrl(this.monsterCtrl);
        this.monsterCtrl.monsterObj = this;
        if (data.skill && BattleCtrl.Inst().battleModel == BattleModel.Normal) {
            let skills = ((data.skill as any) + "").split("|");
            skills.forEach(skillID => {
                let skill = BattleData.Inst().GetSceneMonsterSkillCfg(+skillID);
                if (skill)
                    this.monsterCtrl.addSkill(skill);
            });
        }
        if (this.createInfo.defautBuff) {
            this.createInfo.defautBuff.forEach(element => {
                this.AddBuff(element);
            });
        }

        this.report = <IPB_SCBattleMonsterInfo>{ id: this.data.monster_id, hp: this.hp, attackList: [] }

        this.InitBuffDef();
    }

    SetHp() {
        let scene_add_hp = 0;
        if (BattleData.Inst().battleInfo.sceneType == SceneType.Main && BattleCtrl.Inst().battleScene) {
            let attCfg = BattleCtrl.Inst().battleScene.dataModel?.curStage?.AttCfg();
            if (attCfg && attCfg.hp_add > 0) {
                scene_add_hp = Math.floor(this.data.hp * attCfg.hp_add / 10000);
            }
        }

        this.hp = this.data.hp + this.data.hp * this.battleInfo.skillAttri.monsterHpPrecent + scene_add_hp;
        switch (this.data.monster_type) {
            case MonsterType.JingYing: this.hp += this.data.hp * this.battleInfo.skillAttri.jingyingHpPercent; break;
            case MonsterType.Boss: this.hp += this.data.hp * this.battleInfo.skillAttri.bossHpPercent; break;
            case MonsterType.Normal: this.hp += this.data.hp * this.battleInfo.skillAttri.xiaoguaiHpPercent; break;
        }
        this.maxHp = this.hp;
    }

    /**
     * 使怪物停止移动 可以调backY,backYByCell使怪物强制位移
     * @param isPause 
     */
    Pause(isPause: boolean) {
        this.monsterCtrl.Pause(isPause);
    }

    LoadModel() {
        if (this.model == null) {
            let resPath = ResPath.Monster(this.data.res_id);
            NodePools.Inst().Get(resPath, (obj) => {
                if (obj == null) {
                    return
                }
                if (this.ShowRoot == null) {
                    NodePools.Inst().Put(obj);
                    return
                }
                this.DeleteModel();
                this.model = obj;
                this.colliderTrans = obj.children[0].getComponent(UITransform);
                this._wordAABB = null;
                this.ShowRoot.addChild(obj);
                obj.setPosition(0, 0);

                if (this.data.monster_type == MonsterType.Boss) {
                    this.BindHeadInfo();
                }
            })
        } else {
            if (this.data.monster_type == MonsterType.Boss) {
                this.BindHeadInfo();
            }
        }
    }



    AddSpeedScale(scale: number) {
        this.speedScaleBuff += scale;
        this.monsterCtrl.SetMoveSpeed()
    }

    SetMoveDir(dir: number) {
        this.monsterCtrl.SetMoveDir(dir);
    }

    //设置表现
    SetShow() {
        this._wordAABB = null;

        if (BattleCtrl.Inst().battleModel == BattleModel.Arena) {
            this.speed = Math.floor((this.data.speed_min + this.data.speed_max) / 2);
            this.ShowRoot.setScale(1, 1);
        } else {
            this.speed = MathHelper.GetRandomNum(this.data.speed_min, this.data.speed_max * (this.createInfo.cfg_ctrl.speed / 10000));
            let scale = MathHelper.GetRandomNum(this.data.size_min * 10, this.data.size_max * 10) / 10;
            if (this.data.monster_type == MonsterType.Boss) {
                this.ShowRoot.setScale(1, 1);
            } else {
                this.ShowRoot.setScale(scale, scale);
            }
        }
    }

    private headInfo: BossHeadInfo;
    //绑定头部信息
    BindHeadInfo() {
        let headInfo = <BossHeadInfo>fgui.UIPackage.createObject("Battle", "BossHeadInfo").asCom
        this.node.addChild(headInfo.node);
        headInfo.node.setSiblingIndex(0);
        headInfo.node.setPosition(0, this.h + this.ShowRoot.position.y);
        this.headInfo = headInfo;
        let data = <IBossHeadInfoData>{ maxHp: this.hp, hp: this.hp, bubble: this.data.boss_dec1 };
        this.headInfo.SetData(data);
    }

    //非角色攻击扣血
    OtherDeductHp(value: number, icontype?: BattleHarmShowIconType) {
        if (this.IsDied()) {
            return
        }
        let pp = new Vec3(this.centerWorldPos);
        pp.x += MathHelper.GetRandomNum(-10, 10);
        pp.y += MathHelper.GetRandomNum(-10, 10);
        BattleData.Inst().CenterHarmTip(pp, value, 1, icontype, this.data);
        this.DoHp(value);
    }

    //角色攻击扣血
    DeductHp(hero: HeroObj, value: number, icontype?: BattleHarmShowIconType) {
        if (this.IsDied()) {
            return
        }
        if (value == null) {
            value = 0;
        }

        //暴击判断
        if (icontype != BattleHarmShowIconType.baoji) {
            let baoji = hero.baoji;
            if (baoji > 0) {
                if (MathHelper.RandomResult(baoji, 100)) {
                    value *= hero.baojiScale;
                    icontype = BattleHarmShowIconType.baoji;
                }
            }
        }

        //判断重击 和 暴击
        if (icontype != BattleHarmShowIconType.zhongji) {
            if (icontype != BattleHarmShowIconType.baoji || hero.baojiScale < ZHONG_JI_SCALE) {
                let zhongji = hero.zhongji;
                if (zhongji > 0) {
                    if (MathHelper.RandomResult(zhongji, 100)) {
                        value *= ZHONG_JI_SCALE;
                        icontype = BattleHarmShowIconType.zhongji;
                    }
                }
            }
        }

        let defMap = BattleData.Inst().GetMonsterDefType(this.data);
        let hreoType = hero.baseCfg.hero_race
        let _xishu = 0;
        if (defMap.has(hreoType)) {
            _xishu = defMap.get(hreoType);
        }
        _xishu += (this.defOffset * 100);
        if (_xishu != 0) {
            if (icontype == null) {
                icontype = _xishu > 0 ? BattleHarmShowIconType.dunpai : BattleHarmShowIconType.pojia;
            }
            value = value * ((10000 - _xishu) / 10000);
        }
        value = this.GetBuffAddHarm(value, this.damgeScale);

        if (this.data.monster_type == MonsterType.Boss) {
            if (this.battleInfo.skillAttri.bossHarmAdd > 0) {
                value += value * this.battleInfo.skillAttri.bossHarmAdd;
            }
        }

        value = Math.floor(value);
        let pp = new Vec3(this.centerWorldPos);
        pp.x += MathHelper.GetRandomNum(-10, 10);
        pp.y += MathHelper.GetRandomNum(-10, 10);
        BattleData.Inst().CenterHarmTip(pp, value, hreoType, icontype, this.data);
        this.DoHp(value);
        BattleData.Inst().AddRecordAttackValue(hero.data.hero_id, value, this.tag);

        this.RecordReport(hero.reportIndex, value);
        if (this.hp <= 0) {
            EventCtrl.Inst().emit(BattleEventType.MonsterDieByHero, this, hero);
        }
    }

    //Buff扣血
    BuffDeductHp(buff: IMonsterObjBuffData, value: number) {
        if (this.IsDied()) {
            return
        }
        if (buff.hero == null) {
            return
        }
        if (value == null) {
            value = 1;
        }
        if (value < 1) {
            value = 1;
        }
        let harmType = BuffToHarmType[buff.buffType];
        value = this.GetBuffAddHarm(value, this.buffReduceScale + this.damgeScale);
        value = Math.floor(value);
        BattleData.Inst().CenterHarmTip(this.centerWorldPos, value, harmType, null, this.data);
        this.DoHp(value);
        BattleData.Inst().AddRecordAttackValue(buff.hero.data.hero_id, value, this.tag);

        this.RecordReport(buff.hero.reportIndex, value);
        if (this.hp <= 0) {
            EventCtrl.Inst().emit(BattleEventType.MonsterDieByHero, this, buff);
        }
    }

    //计算buff造成的额外伤害
    //addScale全局伤害加深
    GetBuffAddHarm(value: number, addScale: number): number {
        let newValue = value;
        this.buffMap.forEach((v, k) => {
            let scale = this.battleInfo.skillAttri.GetMonsterBuffHarmScale(k);
            if (scale != 0) {
                newValue += value * scale;
            }
        })
        newValue += (value * addScale);
        return newValue;
    }

    //斩杀
    ZhanSha(hero: HeroObj) {
        if (this.IsDied()) {
            return
        }
        let value = this.hp;
        let hreoType = hero.baseCfg.hero_race
        BattleData.Inst().CenterHarmTip(this.centerWorldPos, value, hreoType, BattleHarmShowIconType.baoji, this.data);
        this.DoHp(value);
        BattleData.Inst().AddRecordAttackValue(hero.data.hero_id, value, this.tag);

        this.RecordReport(hero.reportIndex, value);

        if (this.hp <= 0) {
            EventCtrl.Inst().emit(BattleEventType.MonsterDieByHero, this, hero);
        }
    }

    RecordReport(heroIndex: number, damage: number) {
        if (BattleCtrl.Inst().battleModel != BattleModel.Normal) {
            return;
        }

        let attackerTime = this.scene.report.totalTime;
        let reportInfo = <IPB_SCBattleAttackInfo>{ heroIndex: heroIndex, attackerTime: attackerTime, damage: damage }
        this.report.attackList.push(reportInfo);
        this.report.hp = this.hp;
    }

    private DoHp(value: number) {
        if (Number.isNaN(value)) {
            LogError("有伤害为NaN一定要看!!!!")
            value = 0;
        }
        this.hp -= value;
        if (this.headInfo) {
            this.headInfo.SetHpValue(this.hp);
        }
        if (this.hp <= 0) {
            this.EmitEvent(MonsterEventType.Die);
            this.Die();
        }
        this.monsterCtrl.Hit(value);
    }


    //死亡
    Die() {
        if (this.hp > 0) {
            this.hp = 0;
        }
        let effect = MonsterDieEffectConfig[BattleData.Inst().battleInfo.sceneType] ?? SceneEffectConfig.MonsterDie;

        let pos = this.node.worldPosition;
        //Native环境下怪物会闪烁的问题
        if (NATIVE) {
            setTimeout(() => {
                SceneEffect.Inst().Play(effect, this.scene.node, pos);
            }, 0);
        }
        else {
            SceneEffect.Inst().Play(effect, this.scene.node, pos);
        }
        if (this.data.monster_type == MonsterType.JingYing) {
            this.battleInfo.kill_elite++;
        } else if (this.data.monster_type == MonsterType.Boss) {
            this.battleInfo.kill_boss++;
        } else {
            this.battleInfo.kill_monster++;
        }

        this.ClearHeadInfo();
        this.monsterCtrl.Die();
        this.scene.MonsterDie(this);
    }

    IsDied() {
        return this.hp <= 0;
    }

    ClearHeadInfo() {
        if (this.headInfo) {
            this.headInfo.EndShow(this.data.boss_dec2);
            let wPos = this.headInfo.node.worldPosition;
            //BattleCtrl.Inst().battleScene.node.addChild(this.headInfo.node);
            fgui.GRoot.inst.addChild(this.headInfo);
            this.headInfo.node.worldPosition = wPos;
            this.headInfo = null;
        }
    }

    Delete() {
        super.Delete();
        this.ClearBuff();
        this.ClearEvent();
        this.headInfo = null;
        this.initPos = null;
        this.DeleteModel();
    }

    DeleteModel() {
        if (this.model != null) {
            NodePools.Inst().Put(this.model);
            this.model = null;
            this.colliderTrans = null;
        }
    }

    AddBuff(buffData: IMonsterObjBuffData, isMove?: boolean) {
        if (this.IsDied()) {
            return;
        }
        if (BATTLE_HP_NO_SHOW[this.data.res_id]) {
            return;
        }
        if (!this.isMoved && isMove != true) {
            LogError("怪物没有移动的时候是无敌的，无法添加buff", this.hp, this.hpProgress, buffData);
            return;
        }
        if (buffData.time == null) {
            buffData.time = MonterBuff.DefaultTime;
        }

        let def = this.GetBuffDef(buffData.buffType);
        buffData.time = buffData.time - (buffData.time * def);
        if (buffData.time <= 0) {
            return;
        }
        if (!this.buffMap.has(buffData.buffType)) {
            let buffClass = MonsterBUffTypeMap[buffData.buffType];
            let buff = new buffClass(this, buffData.buffType);
            this.buffMap.set(buffData.buffType, buff);
            buff.Start();
            buff.Add(buffData);
        } else {
            let buff = this.buffMap.get(buffData.buffType);
            buff.Add(buffData);
        }
    }
    RemoveBuff(buff: MonterBuff) {
        if (this.buffMap.has(buff.buffType)) {
            this.buffMap.delete(buff.buffType);
        }
        buff.RemoveCallback();
        buff.Delete();
    }

    //移除对应英雄施加的buff
    RemoveBuffByHero(hero: HeroObj, buffType: MonsterObjBuffType) {
        if (!this.buffMap.has(buffType)) {
            return;
        }
        let buff = this.buffMap.get(buffType);
        buff.RemoveDataByHero(hero);
    }

    ClearBuff() {
        if (this.buffMap == null || this.buffMap.size == 0) {
            return;
        }
        this.buffMap.forEach(v => {
            v.RemoveCallback();
            v.Delete();
        })
        this.buffMap.clear();
    }
    HasBuff(buffType: MonsterObjBuffType): boolean {
        return this.buffMap.has(buffType);
    }

    //是否异常（有buff）
    IsBuffed(): boolean {
        return this.buffMap.size > 0;
    }

    //初始化|获取|设置buff抗性
    InitBuffDef() {
        this.buffDefMap.clear();
        if (this.data.control_def == "" || this.data.control_def == 0) {
            return;
        }
        let list = this.data.control_def.toString().split("|");
        if (list.length > 0) {
            list.forEach(str => {
                let info = str.split(",");
                this.SetBuffDef(Number(info[0]), Number(info[1]) / 10000)
            })
        }
    }
    //num = 0-1
    SetBuffDef(buffType: MonsterObjBuffType, num: number) {
        this.buffDefMap.set(buffType, num);
    }
    GetBuffDef(buffType: MonsterObjBuffType): number {
        if (!this.buffDefMap.has(buffType)) {
            return 0;
        }
        return this.buffDefMap.get(buffType);
    }


    OnEvent(type: MonsterEventType, action: MonsterEventAction): MonsterEventActionHT {
        if (!this.eventMap.has(type)) {
            this.eventMap.set(type, []);
        }
        this.eventMap.get(type).push(action);
        return <MonsterEventActionHT>{ type: type, action: action };
    }
    OffEvent(ht: MonsterEventActionHT) {
        if (ht == null || !this.eventMap.has(ht.type)) {
            return
        }
        UtilHelper.ArrayRemove(this.eventMap.get(ht.type), ht.action);
    }
    EmitEvent(type: MonsterEventType) {
        if (!this.eventMap.has(type)) {
            return
        }
        let events = this.eventMap.get(type);
        events.forEach((action) => {
            action(this);
        })
    }

    ClearEvent() {
        this.eventMap.clear();
    }

    //获取这个buff被英熊叠了几层
    GetBuffCountByHero(buffType: MonsterObjBuffType, hero: HeroObj): number {
        if (!this.HasBuff(buffType)) {
            return 0;
        }
        let buff = this.buffMap.get(buffType);
        let count = buff.GetBuffCountByHero(hero);
        return count;
    }

    //身上是否有被某个英雄施加的buff
    HasBuffByHeroId(buffType: MonsterObjBuffType, heroId: number) {
        if (!this.HasBuff(buffType)) {
            return false;
        }
        let buff = this.buffMap.get(buffType);
        return buff.HasDataByHeroId(heroId);
    }

    //buff持续时长变化,timeOff:变化值
    OffsetBuffTime(buffType: MonsterObjBuffType, timeOff: number) {
        if (!this.HasBuff(buffType)) {
            return;
        }
        let buff = this.buffMap.get(buffType);
        buff.OffsetTime(timeOff);
    }

    backX(x: number) {
        this.monsterCtrl.moveFunc.backX(x)
    }

    /**
     * 击退 像素
     * @param y 像素
     */
    backY(y: number) {
        this.monsterCtrl.moveFunc.backY(y);
        let mat = this.builtin;
        if (mat) {
            mat.addColor(1.0, 0.0);
        } else {
            this.builtin = this.model.addComponent(CocSpriteGradient);
            this.builtin.scene = this.scene;
            this.builtin.sprite = this.model.getComponent(sp.Skeleton)
            this.builtin.setMaterialName("shader_spine", undefined, true);
        }
    }

    /**
     * 击退 格子数
     * @param y 格子数 
     */
    backYByCell(cell: number, speed = 5000) {
        this.monsterCtrl.moveFunc.backYByCell(cell, speed);
        let mat = this.builtin;
        if (mat) {
            mat.addColor(1.0, 0.0, 1);
        } else {
            this.builtin = this.model.addComponent(CocSpriteGradient);
            this.builtin.scene = this.scene;
            this.builtin.sprite = this.model.getComponent(sp.Skeleton)
            this.builtin.setMaterialName("shader_spine", undefined, true);
        }
    }
}