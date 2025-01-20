import * as fgui from "fairygui-cc";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { HeroSkillCell, HeroSkillCellItem, HeroSkillShowType } from "modules/common_item/HeroSkillCellItem";
import { BattleData, ISkillInfoSave } from "../BattleData";
import { MathHelper } from "../../../helpers/MathHelper";
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { ViewManager } from "manager/ViewManager";
import { UH } from "../../../helpers/UIHelper";
import { UISpinePlayData, UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";
import { ObjectPool } from "core/ObjectPool";
import { sys } from "cc";
import { Prefskey } from "modules/common/PrefsKey";
import { BattleFinishView } from "../BattleFinishView";
import { BattleCtrl } from "../BattleCtrl";
import { CommonBoard4 } from "modules/common_board/CommonBoard4";
import { Timer } from "modules/time/Timer";
import { EventCtrl } from "modules/common/EventCtrl";
import { BattleEventType } from "../BattleConfig";
import { EGLoader } from "modules/extends/EGLoader";

@BaseView.registView
export class BattleSaveSkillView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "BattleSaveSkill",
        ViewName: "BattleSaveSkillView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.Block,
    };


    protected viewNode = {
        PlayBtn: <fgui.GButton>null,
        List: <fgui.GList>null,
        bg: <fgui.GImage>null,
        EndEffect: <UIEffectShow>null,
        SkillItem: <BattleSaveSkillItem>null,
        SkillDesc: <fgui.GTextField>null,
        SkillEffect: <UISpineShow>null,
        Board: <CommonBoard4>null,
        GuangEffect: <UIEffectShow>null,
        ZheZhao: <EGLoader>null,
    };

    protected extendsCfg = [
        { ResName: "SkillItem", ExtendsClass: BattleSaveSkillItem }
    ];

    private listData: HeroSkillCell[];
    InitData(listdata?: HeroSkillCell[]) {
        let datas = listdata ?? this.GetListData();
        this.listData = this.SetListData(datas);
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.List.setVirtualAndLoop();
        this.viewNode.List.numItems = this.listData.length;
        this.viewNode.List.on(fgui.Event.SCROLL, this.doSpecialEffect, this);
        this.viewNode.PlayBtn.onceClick(this.OnPlayClick.bind(this));

    }

    private itemRenderer(index: number, item: BattleSaveSkillItem) {
        item.SetData(this.listData[index]);
    }

    InitUI(): void {
        this.ReSetWindowSize();
    }

    private doSpecialEffect(): void {
        //change the scale according to the distance to the middle
        var midX: number = this.viewNode.List.scrollPane.posX + this.viewNode.List.viewWidth / 2;
        //console.log("XX",this.viewNode.List.scrollPane.posX)
        var cnt: number = this.viewNode.List.numChildren;
        for (var i: number = 0; i < cnt; i++) {
            var item: BattleSaveSkillItem = this.viewNode.List.getChildAt(i);
            var obj: fgui.GObject = item.skillcell;
            var dist: number = Math.abs(midX - item.x - item.width / 2);
            if (dist > item.width) //no intersection
                obj.setScale(1, 1);
            else {
                var ss: number = 1 + (1 - dist / obj.width) * 0.24;
                obj.setScale(ss, ss);
            }
        }
    }

    GetListData(): HeroSkillCell[] {
        let list: HeroSkillCell[] = []
        for (let i = 1; i <= 5; i++) {
            let cfg = BattleData.Inst().GetSkillCfg(i);
            let show_type = HeroSkillShowType.Count;
            let skillCell = new HeroSkillCell({ skill_id: cfg.skill_id, count: i, showType: show_type })
            list.push(skillCell);
        }
        return list;
    }

    private showIndex: number = 12;
    private resultData: HeroSkillCell;
    SetListData(datas: HeroSkillCell[]): HeroSkillCell[] {
        datas.forEach(skill => {
            skill.vo.showType = HeroSkillShowType.Value;
            skill.vo.count = 1;
        })

        let resultIndex: number;
        if (datas.length > this.showIndex) {
            resultIndex = this.showIndex;
            datas.length = this.showIndex + 1;
        } else {
            resultIndex = this.showIndex % datas.length;
        }

        let index = MathHelper.GetRandomNum(0, datas.length - 1);
        let data = datas[index];
        this.resultData = data;

        let tdata = datas[resultIndex];
        datas[resultIndex] = data;
        datas[index] = tdata;
        return datas;
    }

    DoOpenWaitHandle() {
        let waitHandle = this.createWaitHandle("loadBG")
        this.AddWaitHandle(waitHandle);
        this.viewNode.Board.FlushShow(() => {
            this.viewNode.ZheZhao.SetIcon("loader/level_up/ZheZhao", () => {
                this.refreshBgSize(this.viewNode.ZheZhao)
                waitHandle.complete = true;
            })
        }, false)

        //容错验证
        setTimeout(() => {
            if (ViewManager.Inst().IsOpen(BattleSaveSkillView) && waitHandle && waitHandle.complete == false) {
                waitHandle.complete = true;
            }
        }, 5000);
    }

    private timeHt: any;
    OpenCallBack() {
        this.doSpecialEffect();
        this.timeHt = Timer.Inst().AddRunTimer(() => {
            if (BattleCtrl.Inst().adapterBattleScene) {
                BattleCtrl.Inst().adapterBattleScene.node.active = false;
            }
        }, 2, 2, false)
    }

    CloseCallBack() {
        Timer.Inst().CancelTimer(this.timeHt);
        ViewManager.Inst().CloseView(BattleFinishView);
        BattleCtrl.Inst().ExitBattle();
    }

    private isComplete: boolean;
    private OnPlayClick() {
        this.isComplete = false;
        let count = this.showIndex - 4;
        let time = 3;
        let tweener = fgui.GTween.to(0, 148 * count, time);
        tweener.setEase(fgui.EaseType.QuadOut);
        tweener.onUpdate((tw: fgui.GTweener) => {
            this.viewNode.List.scrollPane.posX = tw.value.x;
        })
        tweener.onComplete(() => {
            this.isComplete = true;
            this.OnComplete();
        });
        this.viewNode.PlayBtn.visible = false;

        //保留技能
        let saveInfo = <ISkillInfoSave>{
            skillId: this.resultData.cfg.skill_id,
            count: this.resultData.count,
        }
        sys.localStorage.setItem(Prefskey.GetBattleSaveSkillKey(), JSON.stringify(saveInfo));

        //容错验证
        setTimeout(() => {
            if (ViewManager.Inst().IsOpen(BattleSaveSkillView)) {
                if (!this.isComplete) {
                    this.OnComplete();
                }
            }
        }, 5000);
    }


    private OnComplete() {
        console.log("播放完成");
        let data = this.resultData;
        this.viewNode.EndEffect.PlayEff(1208015);
        this.viewNode.SkillItem.SetData(data);
        setTimeout(() => {
            this.viewNode.GuangEffect.PlayEff(1208050);
        }, 1500);
        let desc = data.desc;
        let title = desc.replace(/#036b16/g, "#aeff91")
        UH.SetText(this.viewNode.SkillDesc, title);
        this.view.getTransition("show_skill").play(() => {
            ViewManager.Inst().CloseView(BattleSaveSkillView);
        });

        this.viewNode.SkillEffect.LoadSpine(ResPath.UIEffect(1208016), true, () => {
            let anidata = ObjectPool.Get(UISpinePlayData);
            anidata.name = "idle";
            this.viewNode.SkillEffect.play(anidata)
        })
    }
}


export class BattleSaveSkillItem extends BaseItem {
    protected viewNode = {
        SkillCell: <HeroSkillCellItem>null,
    };

    get skillcell(): HeroSkillCellItem {
        return this.viewNode.SkillCell;
    }

    SetData(data: HeroSkillCell) {
        super.SetData(data);
        this.viewNode.SkillCell.SetData(data);
    }
}