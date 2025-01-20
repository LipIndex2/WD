import { _decorator, Component, Node } from 'cc';
import { HandleBase, HandleCollector } from 'core/HandleCollector';
import { SMDHandle } from 'data/HandleCollectorCfg';
import { BaseControl } from '../Control/BaseControl';
import { BattleObjTag } from '../BattleConfig';
import { IBattleScene } from '../BattleScene';
import { BattleCtrl } from '../BattleCtrl';
const { ccclass, property } = _decorator;

@ccclass('BattleObj')
export class BattleObj extends Component {
    data:any;
    private _lastData:any;

    tag:BattleObjTag = BattleObjTag.Player;

    protected ctrlList:Component[] = [];

    get scene():IBattleScene{
        return BattleCtrl.Inst().GetBattleScene(this.tag);
    }

    SetData(data:any){
        if(this.data != null){
            this._lastData = this.data;
        }
        this.data = data;
    }

    GetData(){
        return this.data;
    }

    GetLastData(){
        return this._lastData ?? this.data;
    }

    protected AddCtrl(ctrl:Component){
        this.ctrlList.push(ctrl);
    }

    Delete(){
        if(this.ctrlList){
            this.ctrlList.forEach((v:BaseControl)=>{
                v.Delete();
                v.destroy();
            })
            this.ctrlList = [];
        }
    }
}

