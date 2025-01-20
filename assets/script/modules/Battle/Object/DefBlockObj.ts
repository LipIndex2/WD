import { _decorator, Component, Node, Sprite, Color, Vec3 } from 'cc';
import { CfgSceneBlockPosDef } from 'config/CfgSceneDef';
const { ccclass, property } = _decorator;

export enum DefBlockType{
    Hero = 1,   //放置英雄的
    Block = 2,  //障碍物
}

// 守护后院的地板格子
@ccclass('DefBlockObj')
export class DefBlockObj extends Component {
    @property(Node)
    Block:Node;
    @property(Node)
    Pot:Node;

    get blockType(): DefBlockType{
        return this.data.block_type;
    }

    data:CfgSceneBlockPosDef;
    SetData(data:CfgSceneBlockPosDef){
        this.data = data;
        this.Pot.active = data.block_type == DefBlockType.Hero;
        this.Block.active = data.block_type == DefBlockType.Block;
    }

    PutPos():Vec3{
        let potPos = this.Pot.worldPosition;
        return new Vec3(potPos.x, potPos.y + 40, 0);
    }
}


