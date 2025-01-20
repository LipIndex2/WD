import { _decorator, Component, Node, Vec3 } from 'cc';
import { BattleCtrl } from '../BattleCtrl';
import { IMoveFuncData, IMovePosInfo } from '../Function/MoveFunc';
import { MonsterControl } from './MonsterControl';
import { BattleRouteModelDef } from '../DefBattleScene';
import { LogError } from 'core/Debugger';
import { BattleHelper } from '../BattleHelper';
import { SceneEffect, SceneEffectConfig } from 'modules/scene_obj_spine/Effect/SceneEffect';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';

// 守护后院的怪物行为
export class DefMonsterControl extends MonsterControl {
    //定制攻击路线
    GetRoute():IMoveFuncData{
        if(this.creatInfo.param == null){
            LogError("守护后院的怪物行为异常")
            return;
        }

        let data = <IMoveFuncData>{
            node:this.node,
            targetPosList:[],
            ComleteFunc:this.MoveComlete.bind(this),
        }

        let route = <BattleRouteModelDef>this.creatInfo.param;
        let ijList = route.IJList();
        ijList.forEach((v,index)=>{
            if(index > 0){
                let tPos = BattleHelper.GetDefWorldPos(v.i, v.j);
                let posInfo = <IMovePosInfo>{
                    speed:this.monsterObj.speed,
                    pos : tPos,
                }
                data.targetPosList.push(posInfo);
            } 
        })
        return data;
    }

    //怪物移动完毕：就是怪物撞到城堡
    // protected MoveComlete() {
    //     if (this.monsterObj.IsDied()) {
    //         return;
    //     }
    //     this.monsterObj.ClearHeadInfo();
    //     SceneEffect.Inst().Play(SceneEffectConfig.MonsterDie, BattleCtrl.Inst().adapterBattleScene.node, this.node.worldPosition);
    //     AudioManager.Inst().Play(AudioTag.GuaiWuZhuangJi);
    //     this.monsterObj.hp = 0;
    //     BattleCtrl.Inst().adapterBattleScene.BeAttacked(this.monsterObj);
    // }
}

