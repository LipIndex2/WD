import { MAP_COL, SanXiaoMarkType } from "./BattleConfig";
import { BattleData } from "./BattleData";
import { BattleDebugData } from "./BattleDebugCfg";
import { BattleScene } from "./BattleScene";
import { HeroObj } from "./Object/HeroObj";

export interface IHeroRemind{
    hero:HeroObj,
    dir:number,
}

// ********** 三消逻辑 **********
export class SanXiaoLogic{
    items:HeroObj[][];

    private cellOKGroups:HeroObj[][];

    private remindHeros:IHeroRemind[];

    constructor(items:HeroObj[][]){
        this.items = items;
        this.cellOKGroups = [];
        this.remindHeros = [];
    }

    //检测消除
    GetcellOKGroups():HeroObj[][]{
        if(BattleDebugData.BATTLE_DEBUG_MODE && BattleDebugData.Inst().CloseSystemSkill){
            return null;
        }

        this.cellOKGroups = [];
        BattleScene.ForeachHeros(this.items,(hero, i, j)=>{
            if(hero){
                this.CheckHero(hero); 
            }
        })
        //每次交换都清空一遍提醒，会造成下次获取重新计算所有的结果
        //if(this.cellOKGroups.length > 0){
            this.ClearRemind();
        //}
        return this.cellOKGroups;
    }

    private CheckHero(hero:HeroObj){
        //查找竖向的
        let rowGroup:HeroObj[] = []
        let row = this.items[hero.j].length;
        for(let i = hero.i; i < row; i++){
            let v = this.items[hero.j][i];
            if(this.isOK(hero, v, SanXiaoMarkType.Row)){
                rowGroup.push(v);
            }else{
                break;
            }
        }
        for(let i = hero.i - 1; i >= 0; i--){
            let v = this.items[hero.j][i];
            if(this.isOK(hero, v, SanXiaoMarkType.Row)){
                rowGroup.push(v);
            }else{
                break
            }
        }
        if(rowGroup.length >= 3){
            this.MarkItems(rowGroup, SanXiaoMarkType.Row);
            this.cellOKGroups.push(rowGroup);
        }
        //查找横向的
        let colGroup:HeroObj[] = []
        let col = MAP_COL;
        for(let j = hero.j; j < col; j++){
            let v = this.items[j][hero.i];
            if(this.isOK(hero, v, SanXiaoMarkType.Col)){
                colGroup.push(v);
            }else{
                break;
            }
        }
        for(let j = hero.j - 1; j >= 0; j--){
            let v = this.items[j][hero.i];
            if(this.isOK(hero, v, SanXiaoMarkType.Col)){
                colGroup.push(v);
            }else{
                break;
            }
        }
        if(colGroup.length >= 3){
            this.MarkItems(colGroup, SanXiaoMarkType.Col);
            this.cellOKGroups.push(colGroup);
        }

    }

    private MarkItems(items:HeroObj[], type:SanXiaoMarkType){
        for(var v of items){
            v.sanxiaoMark = type;
        }
    }

    // 是否一致
    private isOK(selfHero:HeroObj, hero:HeroObj, type:SanXiaoMarkType):boolean{
        if(selfHero == null || hero == null){
            return false;
        }
        if(hero.sanxiaoMark != SanXiaoMarkType.None && hero.sanxiaoMark == type){
            return false
        }
        if(selfHero.IsFull() || hero.IsFull()){
            return false
        }
        if(selfHero.data.hero_id == hero.data.hero_id && selfHero.data.stage == hero.data.stage){
            return true;
        }
        return false;
    }

    private isRemindOk(heroId:number, level:number, hero:HeroObj){
        if(hero != null && heroId == hero.data.hero_id && level == hero.data.stage){
            return true;
        }
        return false;
    }


    //清空提醒列表
    ClearRemind(){
        if(this.remindHeros.length > 0){
            this.remindHeros = [];
        }
    }

    //获取提醒的item
    GetRemindCell():IHeroRemind{
        if(this.remindHeros.length > 0){
            return this.remindHeros.shift();
        }
        for(let condition = 4; condition >= 2; condition--){
            let result = null;
            BattleScene.ForeachHeros(this.items, (v)=>{
                if(v){
                    let dir = this.HeroRemindDir(v, condition);
                    if(dir != null){
                        result = <IHeroRemind>{hero:v, dir:dir};
                        this.remindHeros.push(result);
                    }
                }
            })
        }

        //还为0就跨过去检查三消
        if(this.remindHeros.length == 0){
            let result = null;
            BattleScene.ForeachHeros(this.items, (v)=>{
                if(v){
                    let dir = this.HeroRemindDirIsTow(v);
                    if(dir != null){
                        result = <IHeroRemind>{hero:v, dir:dir};
                        this.remindHeros.push(result);
                        return true;
                    }
                }
            })
        }

        if(this.remindHeros.length == 0){
            let result = null;
            BattleScene.ForeachHeros(this.items, (v)=>{
                if(v){
                    let dir = this.HeroRemindDir(v, 1);
                    if(dir != null){
                        result = <IHeroRemind>{hero:v, dir:dir};
                        this.remindHeros.push(result);
                    }
                }
            })
        }

        if(this.remindHeros.length > 0){
            return this.remindHeros.shift();
        }
        return null;
    }

    //这个英雄是否提醒
    private HeroRemindDir(hero:HeroObj, condition:number = 2, hero_id?:number, hero_stage?:number):number{
        if(hero.IsFull()){
            return null;
        }
        if(hero_id == null){
            hero_id = hero.data.hero_id;
        }
        if(hero_stage == null){
            hero_stage = hero.data.stage;
        }
        let is_can_xiejiao = BattleData.Inst().battleInfo.skillAttri.isCanXieJiao;
        for(let dir = 1; dir<=8; dir++){
            let i,j;
            switch(dir){
                case 1:i=hero.i + 1,j=hero.j + 0;break;
                case 2:if(is_can_xiejiao) i=hero.i + 1,j=hero.j + 1;break;
                case 3:i=hero.i + 0,j=hero.j + 1;break;
                case 4:if(is_can_xiejiao)i=hero.i - 1,j=hero.j + 1;break;
                case 5:i=hero.i - 1,j=hero.j + 0;break;
                case 6:if(is_can_xiejiao)i=hero.i - 1,j=hero.j - 1;break;
                case 7:i=hero.i + 0,j=hero.j - 1;break;
                case 8:if(is_can_xiejiao)i=hero.i + 1,j=hero.j - 1;break;
            }
            if(j >= 0 && j < this.items.length){
                let otherHero = this.items[j][i];
                if(otherHero && otherHero.data != hero.data){
                    let isRemind = this.IsRemindCondition(hero, otherHero, hero_id, hero_stage, condition);
                    if(isRemind){
                        return dir;
                    }
                }
            }
        }
        return null;
    }


    //单独计算2消的提醒
    private HeroRemindDirIsTow(hero:HeroObj):number{
        if(hero.IsFull()){
            return null;
        }

        // let count = this.GetEqualCount(hero);
        // if(count < 3){
        //     return null;
        // }

        let condition = 2;

        let is_can_xiejiao = BattleData.Inst().battleInfo.skillAttri.isCanXieJiao;
        for(let dir = 1; dir<=8; dir++){
            let i,j;
            switch(dir){
                case 1:i=hero.i + 1,j=hero.j + 0;break;
                case 2:if(is_can_xiejiao) i=hero.i + 1,j=hero.j + 1;break;
                case 3:i=hero.i + 0,j=hero.j + 1;break;
                case 4:if(is_can_xiejiao)i=hero.i - 1,j=hero.j + 1;break;
                case 5:i=hero.i - 1,j=hero.j + 0;break;
                case 6:if(is_can_xiejiao)i=hero.i - 1,j=hero.j - 1;break;
                case 7:i=hero.i + 0,j=hero.j - 1;break;
                case 8:if(is_can_xiejiao)i=hero.i + 1,j=hero.j - 1;break;
            }
            if(j >= 0 && j < this.items.length){
                let otherHero = this.items[j][i];
                if(otherHero && otherHero.data != hero.data){
                    let isRemind = this.HeroRemindDir(otherHero, condition, hero.data.hero_id, hero.data.stage);
                    if(isRemind){
                        return dir;
                    }
                }
            }
        }
        return null;
    }


    //这个格子是否具备提醒条件
    private IsRemindCondition(original:HeroObj, hero:HeroObj, heroId:number, level:number, condition:number = 2):boolean{
        //查找竖向的
        let rowGroup:HeroObj[] = []
        let row = this.items[hero.j].length;
        for(let i = hero.i + 1; i < row; i++){
            let v = this.items[hero.j][i];
            if(v != original && this.isRemindOk(heroId, level,v)){
                rowGroup.push(v);
            }else{
                break;
            }
        }
        for(let i = hero.i - 1; i >= 0; i--){
            let v = this.items[hero.j][i];
            if(v != original && this.isRemindOk(heroId, level,v)){
                rowGroup.push(v);
            }else{
                break
            }
        }
        if(rowGroup.length >= condition){
            return true;
        }
        //查找横向的
        let colGroup:HeroObj[] = []
        let col = MAP_COL;
        for(let j = hero.j + 1; j < col; j++){
            let v = this.items[j][hero.i];
            if(v != original && this.isRemindOk(heroId, level,v)){
                colGroup.push(v);
            }else{
                break;
            }
        }
        for(let j = hero.j - 1; j >= 0; j--){
            let v = this.items[j][hero.i];
            if(v != original && this.isRemindOk(heroId, level,v)){
                colGroup.push(v);
            }else{
                break;
            }
        }
        if(colGroup.length >= condition){
            return true;
        }
        return false;
    }

    //行列是否合法
    IsIJSafety(i:number, j:number):boolean{
        if(j < 0 || j >= this.items.length){
            return false;
        }
        if(i < 0 || this.items[j] == null || i >= this.items[j].length){
            return false;
        }
        return true;
    }

    //判断这个id在这个位置是否合法。  //弃用！！！
    IsIdSafety(id:number, i:number, j:number, level:number = 0):boolean{
        //上方向
        let count:number = 0;
        for(let n = 1; n <= 4; ++n){
            let t_i,t_j;
            switch(n){
                case 1: t_i = i + 1, t_j = j; break;
                case 2: t_i = i + 2, t_j = j; break;
                case 3: t_i = i + 1, t_j = j - 1; break;
                case 4: t_i = i + 1, t_j = j + 1; break;
            }
            if(this.IsIJSafety(t_i, t_j) && this.IsEqual(id, level, t_i, t_j)){
                count++;
            }else{
                break;
            }
        }
        if(count >= 4){
            return false
        }
        //下方向
        count = 0;
        for(let n = 1; n <= 4; ++n){
            let t_i,t_j;
            switch(n){
                case 1: t_i = i - 1, t_j = j; break;
                case 2: t_i = i - 2, t_j = j; break;
                case 3: t_i = i - 1, t_j = j - 1; break;
                case 4: t_i = i - 1, t_j = j + 1; break;
            }
            if(this.IsIJSafety(t_i, t_j) && this.IsEqual(id, level, t_i, t_j)){
                count++;
            }else{
                break
            }
        }
        if(count >= 4){
            return false
        }
        //左方向
        count = 0;
        for(let n = 1; n <= 4; ++n){
            let t_i,t_j;
            switch(n){
                case 1: t_i = i, t_j = j - 1; break;
                case 2: t_i = i, t_j = j - 2; break;
                case 3: t_i = i + 1, t_j = j - 1; break;
                case 4: t_i = i - 1, t_j = j - 1; break;
            }
            if(this.IsIJSafety(t_i, t_j) && this.IsEqual(id, level, t_i, t_j)){
                count++;
            }else{
                break;
            }
        }
        if(count >= 4){
            return false
        }
        //右方向
        count = 0;
        for(let n = 1; n <= 4; ++n){
            let t_i,t_j;
            switch(n){
                case 1: t_i = i, t_j = j + 1; break;
                case 2: t_i = i, t_j = j + 2; break;
                case 3: t_i = i + 1, t_j = j + 1; break;
                case 4: t_i = i - 1, t_j = j + 1; break;
            }
            if(this.IsIJSafety(t_i, t_j) && this.IsEqual(id, level, t_i, t_j)){
                count++;
            }else{
                break;
            }
        }
        if(count >= 4){
            return false
        }
        return true;
    }

    IsEqual(id:number, level:number, i:number, j:number):boolean{
        let item = this.items[j][i];
        if(item){
            if(item.data.hero_id == id && item.data.stage == level){
                return true;
            }
        }
        return false;
    }

    //有多少个相同的英雄
    GetEqualCount(hero:HeroObj):number{
        let count = 0;
        BattleScene.ForeachHeros(this.items, (v)=>{
            if(v && v.data == hero.data){
                count++;
            }
        })
        return count;
    }
}