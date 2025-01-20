import { HandleCollector } from "core/HandleCollector";
import { SMDHandle } from "data/HandleCollectorCfg";
import { BattleObjTag, BattleState } from "../BattleConfig";
import { BattleData } from "../BattleData";

export class HeroSkillChangeListener{

    private skillChangeFuncs : Map<number, (skillId:number,oldNum:number,newNum:number)=>void> = new Map();

    private skillCountRec : Map<number,number> = new Map();

    protected handleCollector: HandleCollector;

    tag:BattleObjTag = BattleObjTag.Player;

    constructor(tag?:BattleObjTag){
        if(tag){
            this.tag = tag;
        }
        this.handleCollector = HandleCollector.Create();
        let handle = SMDHandle.Create(BattleData.Inst().battleInfo, this.onSkillListChange.bind(this), "skillListMap");
        this.handleCollector.Add(handle);
    }
    
    //采集当前技能数量并添加技能监听
    public AddLinsten(skillId:number, func:(skillId:number,oldNum:number,newNum:number)=>void){
        this.skillChangeFuncs.set(skillId,func);
        BattleData.Inst().HandleSkill(skillId,(cfg)=>{
            this.skillCountRec.set(skillId,BattleData.Inst().GetSkillCount(cfg, this.tag));
        }, this.tag)
    }

    private onSkillListChange(){
        if(BattleData.Inst().battleInfo.battleState != BattleState.Figth){
            return;
        }
        this.skillChangeFuncs.forEach((func,skillId)=>{
            if(!BattleData.Inst().IsHasSkill(skillId)){
                return;
            }
            let cfg = BattleData.Inst().GetSkillCfg(skillId);
            let newNum = BattleData.Inst().GetSkillCount(cfg, this.tag);
            let oldNum = 0;
            if(this.skillCountRec.has(skillId)){
                oldNum = this.skillCountRec.get(skillId);
            }
            if(newNum != oldNum){
                this.skillCountRec.set(skillId,newNum);
                func(skillId,oldNum,newNum);
            }
        })
    }

    public Detroy(){
        HandleCollector.Destory(this.handleCollector);
        this.handleCollector = null;
    }
}