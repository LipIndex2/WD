import { Node, UITransform, Vec2, Vec3 } from "cc";
import { Singleton } from "core/Singleton";
import { CameraManager } from "manager/CameraManager";
import { BattleModel, BattleObjTag, CELL_OFFSET_POS, CELL_WIDTH, DEF_CELL_OFFSET_POS, DEF_CELL_WIDTH } from "./BattleConfig";
import { BattleCtrl } from "./BattleCtrl";
import { IBattleScene } from "./BattleScene";
import { HeroObj } from "./Object/HeroObj";

// 通过这个可以设置对象在场景中哪个层级上
// 值越大，层级越往上
export enum BattleSceneLayerType{
    BGRoot = 1,         //背景根节点
    BGTop = 2,

    HeroBottom = 11,
    HeroRoot = 12,      //英雄跟节点
    HeroTop = 13,

    MonsterBottom = 21,
    MonsterRoot = 22,   //怪物根节点
    MonsterTop = 23,

    Skill = 31,         //一般播放技能的位置

    Top = 101,          //最上层
}

export class BattleHelper{
    /**
     * 通过ij获取世界位置
     * @param zeroPos 0，0的位置 
     * @param i 行
     * @param j 列
     * @param cellW 格子宽
     * @param scale 比例
     */
    static GetWorldPosByIJ(zeroPos: Vec2|Vec3, i:number, j:number, cellW:number, scale:number = 1, outPos?:Vec3):Vec3{
        outPos = outPos ?? new Vec3();
        outPos.x = zeroPos.x + (cellW * j * scale);
        outPos.y = zeroPos.y + (cellW * i * scale);
        let scene = BattleCtrl.Inst().battleScene ?? BattleCtrl.Inst().battleSceneDef;
        scene.getComponent(UITransform).convertToWorldSpaceAR(outPos, outPos);
        return outPos;
    }

    // 获取守护后院的世界位置
    static GetDefWorldPos(i:number, j:number):Vec3{
        return BattleHelper.GetWorldPosByIJ(DEF_CELL_OFFSET_POS, i, j, DEF_CELL_WIDTH);
    }

    // 获取正常玩法世界位置
    static GetNormalWorldPos(i:number, j:number):Vec3{
        return BattleHelper.GetWorldPosByIJ(CELL_OFFSET_POS, i, j, CELL_WIDTH);
    }

    // 自动匹配世界位置
    static GetWorldPos(i:number, j:number, tag:number = BattleObjTag.Player):Vec3{
        let battleModel = BattleCtrl.Inst().battleModel;
        if(battleModel == BattleModel.Defense){
            return this.GetDefWorldPos(i,j);
        }else if(battleModel == BattleModel.Arena){
            let scene = BattleCtrl.Inst().GetBattleScene(tag);
            return scene.battleBG.GetWorldPos(i,j);
        }
        else{
            return this.GetNormalWorldPos(i,j);
        }
    }


    //行列转换
    static NumToIJ(num: number, map_col:number): Vec2 {
        let i = Math.ceil((num + 1) / map_col) - 1;
        let j = num % map_col;
        return new Vec2(j, i);
    }
    static IJToNum(v2: Vec2, map_col:number): number {
        let num = v2.y * map_col + v2.x;
        return num;
    }
    static IJTonum2(i: number, j: number, map_col:number) {
        let num = i * map_col + j;
        return num;
    }


    static GetNodeParent(layerType:BattleSceneLayerType, scene?:IBattleScene):Node{
        scene = scene ?? BattleCtrl.Inst().adapterBattleScene;
        switch(layerType){
            case BattleSceneLayerType.BGRoot: return scene.BGRoot;
            case BattleSceneLayerType.BGTop: return scene.BottomSkillRoot;

            case BattleSceneLayerType.HeroBottom: return scene.BottomSkillRoot;
            case BattleSceneLayerType.HeroRoot: return scene.HeroRoot;
            case BattleSceneLayerType.HeroTop: return scene.HeroRoot;

            case BattleSceneLayerType.MonsterBottom: return scene.BottomEffectRoot;
            case BattleSceneLayerType.MonsterRoot: return scene.MonsterRoot;
            case BattleSceneLayerType.MonsterTop: return scene.TopSkillRoot;

            case BattleSceneLayerType.Skill: return scene.TopRoot;
            case BattleSceneLayerType.Top: return scene.node;
        }
        return scene.node;
    }

    static SetParent(obj:Node, layerType:BattleSceneLayerType, scene:IBattleScene){
        let parent = BattleHelper.GetNodeParent(layerType, scene);
        obj.setParent(parent);
    }

    // 遍历英雄
    static ForeachHeros(arr: HeroObj[][], func: (v: HeroObj, row: number, col: number) => void | boolean) {
        if (arr == null || arr.length == 0) {
            return;
        }
        for (let j = 0; j < arr.length; j++) {
            if (arr[j] == null || arr[j].length == 0) {
                continue;
            }
            let row = arr[j].length;
            for (let i = 0; i < row; i++) {
                let hero = arr[j][i]
                if (hero) {
                    if (func(hero, i, j) == true) {
                        return;
                    }
                }
            }
        }
    }
}