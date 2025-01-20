import {  ForwardPipeline, Mat4, Node, rect, Rect, UITransform, Vec2, Vec3 } from "cc";
import { MathHelper } from "../../helpers/MathHelper";
import { BattleCtrl } from "./BattleCtrl";
import { SkillFunc } from "./Function/SkillFunc";
import { MonsterObj } from "./Object/MonsterObj";
import { BattleObjTag } from "./BattleConfig";

export class BattleDynamicHelper {
    // static get monsters():Map<number, MonsterObj>{
    //     return BattleCtrl.Inst().adapterBattleScene.dynamic.monsters
    // }

    private static GetBattleDynamic(tag: BattleObjTag){
        let scene = BattleCtrl.Inst().GetBattleScene(tag);
        return scene.dynamic;
    }

    static GetMonsterMap(tag : BattleObjTag = BattleObjTag.Player){
        let battleDynamic = BattleDynamicHelper.GetBattleDynamic(tag);
        return battleDynamic.monsters;
    }

    static PlaySkill(skill:SkillFunc, tag : BattleObjTag = BattleObjTag.Player){
        let battleDynamic = BattleDynamicHelper.GetBattleDynamic(tag);
        battleDynamic.PlaySkillFunc(skill);
    }
    static StopSkill(skill:SkillFunc, tag : BattleObjTag = BattleObjTag.Player){
        let battleDynamic = BattleDynamicHelper.GetBattleDynamic(tag);
        battleDynamic.StopSkillFunc(skill);
    }


    //查找离输入位置最近的怪
    public static FindClosestMonster(pos : Vec3,excludeMos : MonsterObj[] = null, tag : BattleObjTag = BattleObjTag.Player) : MonsterObj{
        let monseter = null;
        let disCache = Number.MAX_VALUE;
        let battleDynamic = BattleDynamicHelper.GetBattleDynamic(tag);
        battleDynamic.ForeachMonsters((mo:MonsterObj)=>{
            if(mo.IsDied()){
                return false;
            }
            if(excludeMos != null){
                if(excludeMos.indexOf(mo) >= 0){
                    return false;
                }
            }
            let dis = Vec2.squaredDistance(pos ,mo.worldPosition);
            if(dis < disCache){
                monseter = mo;
                disCache = dis;
            }
            return false;
        })
        return monseter;
    } 

    private static setCache = new Set<number>(); 
    //随机找一个怪物
    public static FindRandomMonster(excludeMos : MonsterObj[] = null, tag : BattleObjTag = BattleObjTag.Player) : MonsterObj{
        let battleDynamic = BattleDynamicHelper.GetBattleDynamic(tag);
        let monsterArr = Array.from(battleDynamic.monsters.values());
        if(monsterArr.length == 0){
            return null;
        }
        if(excludeMos != null && excludeMos.length == monsterArr.length){
            let isSame = true;
            for(let mo of excludeMos){
                if(monsterArr.indexOf(mo) < 0){
                    isSame = false;
                    break;
                }
                if(isSame){ //exclude的怪物与要查找的怪物表一样
                    return null;
                }
            }  
        }
        this.setCache.clear();
        while(true){
            if(this.setCache.size >= monsterArr.length){
                return null;
            }
            let rndIdx = MathHelper.GetRandomNum(0,monsterArr.length-1);
            if(this.setCache.has(rndIdx)){
                continue;
            }
            this.setCache.add(rndIdx);
            let re = monsterArr[rndIdx];
            if(re == null || re.IsDied == null || re.IsDied()){
                continue;
            }
            if(excludeMos != null && excludeMos.indexOf(re) >= 0){
                continue;
            }
            return re;
        }
    }


    //轻量级UiTransform转矩形 有 旋转且非正方形 的请使用TransformToRect
    public static SmallTransformToRect(trans:UITransform, worldPos:Vec3, scale:Vec3, outRect?:Rect): Rect{
        if (outRect == null) {
            outRect = new Rect();
        }
        outRect.width = trans.width * scale.x;
        outRect.height = trans.height * scale.y;
        outRect.x = worldPos.x - trans.anchorX * outRect.width;
        outRect.y = worldPos.y - trans.anchorY * outRect.height;
        return outRect;
    }

    //UiTransform转矩形
    private static cacheMat4:Mat4 = new Mat4();
    private static cacheMat4B:Mat4 = new Mat4();
    public static TransformToRect(trans:UITransform, scale:Vec3, outRect?:Rect): Rect{
        if (outRect == null) {
            outRect = new Rect();
        }

        trans.node.parent.getWorldMatrix(this.cacheMat4);
        Mat4.fromRTS(this.cacheMat4B, trans.node.getRotation(), trans.node.getPosition(), scale ?? trans.node.getScale());
        outRect.width = trans.width;
        outRect.height = trans.height;
        outRect.x = -trans.anchorX * trans.width;
        outRect.y = -trans.anchorY * trans.height;

        Mat4.multiply(this.cacheMat4, this.cacheMat4, this.cacheMat4B);
        outRect.transformMat4(this.cacheMat4);
        return outRect;
    }
}