import { _decorator, CCFloat, CCInteger, Collider2D, Component, Node, Vec3, CCBoolean, UITransform, Rect, Sprite, Widget, SpriteFrame, Color, Vec2, Mat4, ccenum, Enum } from 'cc';
import { GTweener } from 'fairygui-cc/tween/GTweener';
import { BattleCtrl } from '../BattleCtrl';
import { NodePools } from 'core/NodePools';
import { MonsterObj } from '../Object/MonsterObj';
import { BattleTweenerType } from '../BattleDynamic';
import { UtilHelper } from '../../../helpers/UtilHelper';
import { UIEffectConf } from 'modules/scene_obj_spine/Effect/UIEffectConf';
import { LogError } from 'core/Debugger';
import { BattleDynamicHelper } from '../BattleDynamicHelper';
import { ResManager } from 'manager/ResManager';
import { BattleDebugData } from '../BattleDebugCfg';
import { BattleObjTag } from '../BattleConfig';
import { IBattleScene } from '../BattleScene';

// 怪物固定是矩形的
export enum ColliderCheckType{
    RectRect = 1,       //矩形对矩形
    RectPolygon = 2,    //矩形对多边形
}
ccenum(ColliderCheckType);


export class SkillColliderEvent{
    skillFunc:SkillFunc;
    objs:MonsterObj[];      //所有被击中的怪物

    private _firstHitObj:MonsterObj;

    //获取最开始击中的目标
    GetFirstHitObj(){
        if(this._firstHitObj != null){
            return this._firstHitObj;
        }
        if(this.objs.length == 0){
            return null;
        }
        if(this.objs.length == 1 || this.objs == null){
            this._firstHitObj = this.objs[0];
        }else{
            this.objs.sort((a,b)=>{
                return this.GetObjDis(this.skillFunc.playPos, a) - this.GetObjDis(this.skillFunc.playPos,b)
            })
            this._firstHitObj = this.objs[0];
        }
        return this._firstHitObj;
    }

    //获取怪物离发射点的距离
    GetObjDis(shootPos:Vec3, obj:MonsterObj):number{
        if(shootPos == null){
            LogError("请设置playPos")
            return 0;
        }
        let pos = obj.node.getWorldPosition();
        let dir = new Vec3();
        Vec3.subtract(dir, pos, shootPos);
        if(pos.y + obj.h < shootPos.y){
            pos.add(dir.normalize().multiplyScalar(obj.h));
        }
        let distance = Vec3.distance(shootPos, pos);
        return distance;
    }

    //排除单个怪物
    SetExcludeObj(obj:MonsterObj){
        this.skillFunc.SetExcludeObj(obj);
    }
    //排除全部怪物
    SetAllExcludeObj(){
        if(this.objs != null && this.objs.length > 0){
            this.objs.forEach(obj=>{this.skillFunc.SetExcludeObj(obj);})
        }
    }
}

const { ccclass, property, type } = _decorator;

@ccclass('SkillFunc')
export class SkillFunc extends Component {
    @property(UITransform)
    colliderTrans:UITransform;
    @type(ColliderCheckType)
    colliderType:ColliderCheckType = 1;
    @property(Node)
    playNode:Node;
    @property(CCFloat)
    playTime:number = 1;
    @property(UIEffectConf)
    uieffectConf:UIEffectConf;
    // 超出屏幕是否剔除
    @property(CCBoolean)
    isScreenEliminate:boolean = true;
    // 这个技能是否需要计算旋转的矩形
    @property(CCBoolean)
    isHasRotation:boolean = true

    playPos:Vec3;      //攻击的位置
    hp:number;         //生命值
    scale:number;       //系数

    isCheckCollider:boolean = true;

    tag: BattleObjTag = BattleObjTag.Player;

    private _worldAABB:Rect;
    get worldAABB():Rect{
        if(this.isHasRotation){
            this._worldAABB = BattleDynamicHelper.TransformToRect(this.colliderTrans, this.nodeScale, this._worldAABB);
        }else{
            this._worldAABB = BattleDynamicHelper.SmallTransformToRect(this.colliderTrans, this.playNode.worldPosition, this.nodeScale, this._worldAABB);
        }
        this.DrawCollider(this._worldAABB);
        return this._worldAABB;
    }

    // 获取uiTransform的4个顶点
    private _worldPoints:Vec2[];
    get worldPoints():Vec2[]{
        var uiTransform = this.colliderTrans;
        var width = uiTransform.width;
        var height = uiTransform.height;

        var matrix = new Mat4();
        this.playNode.getWorldMatrix(matrix);

        this._worldPoints = [
            new Vec2(-width / 2, -height / 2),
            new Vec2(-width / 2, height / 2),
            new Vec2(width / 2, height / 2),
            new Vec2(width / 2, -height / 2)
        ];

        var position = new Vec3();
        for (var i = 0; i < this._worldPoints.length; i++) {
            position.set(this._worldPoints[i].x, this._worldPoints[i].y, 0);
            Vec3.transformMat4(position, position, matrix);
            this._worldPoints[i].set(position.x, position.y);
        }
        return this._worldPoints;
    }

    private _tweener:GTweener;
    get tweener():GTweener{
        return this._tweener;
    }
    set tweener(v:GTweener){
        this._tweener = v;
    }
    protected tweenerList:GTweener[];
    protected hitEvent:(event:SkillColliderEvent)=>any;
    protected stopEvent:(skill:SkillFunc)=>any;

    get nodeScale():Vec3{
        if(this.colliderTrans.node.scale.x != 1 || this.colliderTrans.node.scale.y != 1){
            return this.colliderTrans.node.scale;
        }
        if(this.playNode.scale.x != 1 || this.playNode.scale.y != 1){
            return this.playNode.scale;
        }
        return this.node.scale;
    }

    //排除已经击中过的对象
    excludeMap:Map<MonsterObj, number> = new Map();


    private defaultPlayTime:number;

    get scene():IBattleScene{
        return BattleCtrl.Inst().GetBattleScene(this.tag);
    }

    onLoad(){
        this.defaultPlayTime = this.playTime;
    }

    Play(){
        if(this.uieffectConf){
            this.uieffectConf.play();
        }
        this.playPos = this.node.worldPosition;
    }

    Stop(){
        if(this.stopEvent){
            this.stopEvent(this);
            this.stopEvent = null;
        }

        if(this.uieffectConf){
            this.uieffectConf.stop();
        }
        this.ClearExclude();

        let scene = this.scene;

        if(this.tweener){
            //UtilHelper.KillFGuiTweenr(this.tweener);
            scene.dynamic.RemoveTweenr(BattleTweenerType.Skill, this.tweener);
            this.tweener = null;
        }
        if(this.tweenerList){
            this.tweenerList.forEach(tw=>{
                scene.dynamic.RemoveTweenr(BattleTweenerType.Skill, tw)
            })
            this.tweenerList = null;
        }
        //NodePools.Inst().Put(this.node);
        scene.dynamic.PutSkillAsset(this.node);
    }

    onDisable(){
        if(this.drawColliderTrans){
            this.drawColliderTrans.node.destroy();
            this.drawColliderTrans = null;
        }
    }

    Pause(isPause:boolean){
        if(this.tweener){
            this.tweener.setPaused(isPause);
        }

        if(this.tweenerList){
            this.tweenerList.forEach(tw=>{
                tw.setPaused(isPause);
            })
        }
    }

    Reset(){
        this.node.setScale(1,1);
        this.playNode.setScale(1,1);
        this.node.setRotationFromEuler(0,0,0);
        this.playNode.setPosition(0,0);
        this.playNode.setRotationFromEuler(0,0,0);
        this.scale = 1;
        this.playTime = this.defaultPlayTime;
        this.isCheckCollider = true;
    }

    IsCompleted():boolean{
        return this.tweener.completed
    }

    SetExcludeObj(obj:MonsterObj, value:number = 1){
        this.excludeMap.set(obj, value);
    }
    RemoveExcludeObj(obj:MonsterObj){
        if(obj && this.excludeMap.has(obj)){
            this.excludeMap.delete(obj);
        }
    }
    IsExclude(obj:MonsterObj):boolean{
        if(!this.excludeMap.has(obj)){
            return false;
        }
        return this.excludeMap.get(obj) == 1;
    }
    ClearExclude(){
        this.excludeMap.clear();
    }

    ColliderHit(objs:MonsterObj[]){
        if(objs && objs.length > 0 && this.hitEvent){
            let event = new SkillColliderEvent();
            event.skillFunc = this;
            event.objs = objs;
            this.hitEvent(event);
        }
    }


    OnHit(func:(event:SkillColliderEvent)=>any){
        this.hitEvent = func;
    }

    OnStop(func:(skill:SkillFunc)=>any){
        this.stopEvent = func;
    }

    GetEulerAngle(){
        return this.node.angle;
    }

    SetEulerAngle(angle:number){
        this.node.setRotationFromEuler(0,0,angle);
    }

    SetPlayNodeEulerAngle(angle:number){
        this.playNode.setRotationFromEuler(0,0,angle);
    }

    SetScale(scale:number){
        this.playNode.setScale(scale,scale);
    }

    DeductHp(value:number = 1){
        this.hp --;
        if(this.hp <= 0){
            this.StopSkill(this);
        }
    }

    private drawColliderTrans:UITransform
    DrawCollider(aabb:Rect){
        if(!BattleDebugData.BATTLE_DEBUG_MODE || !BattleDebugData.Inst().IsDrawCollider){
            return;
        }

        if(this.drawColliderTrans == null){
            let obj = new Node();
            let scene = this.scene;
            obj.setParent(scene.node);
            this.drawColliderTrans = obj.addComponent(UITransform);
            let sprite = obj.addComponent(Sprite);
            sprite.color = new Color(255,0,0,150);
            let path = "loader/scene/cell/houyuan_1_1/spriteFrame";
            this.drawColliderTrans.anchorX = 0;
            this.drawColliderTrans.anchorY = 0;
            obj.setWorldPosition(aabb.x,aabb.y,0);
            ResManager.Inst().Load<SpriteFrame>(path, (error, img) => {
                if(this.drawColliderTrans == null){
                    return;
                }
                if (error != null) {
                    LogError(error);
                }else{
                    sprite.spriteFrame = img;
                }
                this.drawColliderTrans.width = aabb.width;
                this.drawColliderTrans.height = aabb.height;
            });
        }else{
            this.drawColliderTrans.node.setWorldPosition(aabb.x,aabb.y,0);
            this.drawColliderTrans.width = aabb.width;
            this.drawColliderTrans.height = aabb.height;
        }
    }

    PlaySkill(skill:SkillFunc){
        BattleDynamicHelper.PlaySkill(skill, this.tag);
    }
    StopSkill(skill:SkillFunc){
        BattleDynamicHelper.StopSkill(skill, this.tag);
    }
}

