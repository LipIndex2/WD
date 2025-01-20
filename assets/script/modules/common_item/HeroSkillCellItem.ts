import { CfgSkillData } from "config/CfgEntry";
import * as fgui from "fairygui-cc";
import { BattleData } from "modules/Battle/BattleData";
import { BaseItemGB } from "modules/common/BaseItem";
import { ICON_TYPE, SkillBgQuaCfg } from "modules/common/CommonEnum";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";

export interface IHeroSkillCellItemData {
    skill_id: number,
    showType: number,
    level?: number,
    count?: number,
    cfg?: CfgSkillData,
}

export enum HeroSkillShowType {
    Node = 0,
    Level = 1,
    Count = 2,
    Value = 3,
}

export class HeroSkillCell {
    vo: IHeroSkillCellItemData;
    constructor(vo: IHeroSkillCellItemData) {
        this.vo = vo;
    }
    private _cfg: CfgSkillData;
    get cfg(): CfgSkillData {
        if (this._cfg == null) {
            this._cfg = this.vo.cfg ?? BattleData.Inst().GetSkillCfg(this.vo.skill_id);
        }
        return this._cfg;
    }
    get count(): number {
        return this.vo.count ?? 0;
    }
    get level(): number {
        return this.vo.level ?? 0;
    }
    get iconStr(): string {
        return this.cfg.icon_num ?? "";
    }
    get icon(): number | string {
        let res_id = this.cfg.icon_res_id;
        // if(res_id == null || res_id == ""){
        //     res_id = BattleData.Inst().GetSkillOtherIconCfg();
        // }
        return res_id;
    }
    get showType(): number {
        return this.vo.showType ?? HeroSkillShowType.Node;
    }

    private _desc: string;
    get desc(): string {
        if (this._desc) {
            return this._desc;
        }
        let p1 = this.cfg.pram1;
        if (this.count > 1) {
            p1 = p1 * this.count;
        }
        this._desc = HeroSkillCell.GetDesc(this.cfg);
        return this._desc
    }

    static GetDesc(cfg: CfgSkillData): string {
        return TextHelper.Format(cfg.word, cfg.fake_param_1, cfg.fake_param_2, cfg.fake_param_3, cfg.fake_param_4);
    }
}

export class HeroSkillCellItem extends BaseItemGB {
    protected viewNode = {
        BG: <fgui.GLoader>null,
        Icon: <fgui.GLoader>null,
        Count: <fgui.GTextField>null,
        ValueStr: <fgui.GTextField>null,
        Level: <fgui.GTextField>null,
    };
    private showCtrl: fgui.Controller;

    protected onConstruct() {
        super.onConstruct();
        this.showCtrl = this.getController("show_ctrl");
    }

    SetData(data: HeroSkillCell) {
        super.SetData(data);
        this.showCtrl.setSelectedIndex(data.showType);
        switch (data.showType) {
            case HeroSkillShowType.Level: UH.SetText(this.viewNode.Level, "等级" + data.level); break;
            case HeroSkillShowType.Count: UH.SetText(this.viewNode.Count, data.count); break;
            case HeroSkillShowType.Value: UH.SetText(this.viewNode.ValueStr, data.iconStr); break;
        }
        let qua = data.cfg.color;
        UH.SpriteName(this.viewNode.BG, "CommonAtlas", SkillBgQuaCfg[qua])
        UH.SetIcon(this.viewNode.Icon, data.icon, ICON_TYPE.SKILL);
    }
}