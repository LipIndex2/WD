import { HeroData } from 'modules/hero/HeroData';

import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { ICON_TYPE, ITEM_SHOW_TYPE } from "modules/common/CommonEnum";
import { RoleData } from "modules/role/RoleData";
import { Timer } from 'modules/time/Timer';
import { DataHelper } from "../../helpers/DataHelper";
import { UH } from "../../helpers/UIHelper";
import { GetCfgValue } from 'config/CfgCommon';
import { Language } from 'modules/common/Language';
import { GeneOrientationView } from 'modules/GeneOrientation/GeneOrientationView';
import { ConstValue } from 'modules/common/ConstValue';

@BaseView.registView
export class RewardGetView extends BaseView {
    private showList: any[]
    TwShow: fgui.GTweener = null;
    private timer_show: any = null;
    private isShow: boolean = false;

    protected viewRegcfg = {
        UIPackName: "RewardGet",
        ViewName: "RewardGetView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        NotHideAnim: true,
        // OpenAudio: AudioTag.HuoDeDaoJu,
    };

    protected viewNode = {
        BtnContinue: <fgui.GButton>null,
        ButtonShow: <fgui.GButton>null,
        ShowList: <fgui.GList>null,
        GeneShowList: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "ItemShow", ExtendsClass: RewardGetViewShowItem },
        { ResName: "GeneShow", ExtendsClass: RewardGetViewGeneShow },
    ];

    InitData(param?: { reward_data: IPB_ItemData[] }) {
        this.viewNode.BtnContinue.onClick(this.OnClickContinue, this);
        this.viewNode.ButtonShow.onClick(this.OnClickShow, this);
        let itemList = [];
        let geneNum: any = 0;
        for (let i = 0; i < param.reward_data.length; i++) {
            let item = param.reward_data[i];
            let type = Item.GetItemType(item.itemId);
            if (type == 4) {
                geneNum += item.num;
            } else {
                if (type === 3) {
                    // 必须是ui的英雄才显示
                    if (ConstValue.LegalHeroArr.includes(item.itemId)) {
                        itemList.push(item)
                    }
                } else {
                    if (item.itemId === 40003) {
                        item.itemId = 40001;
                    }
                    itemList.push(item);
                }
            }
        }

        this.viewNode.GeneShowList.itemRenderer = this.renderGeneListItem.bind(this);

        this.viewNode.ShowList.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.ShowList.touchable = false
        this.viewNode.GeneShowList.touchable = false

        let geneRow = Math.floor(+geneNum / 3) + 1
        this.viewNode.GeneShowList.width = geneNum < 3 ? Math.min(713, geneNum * 220 + (geneNum - 1) * 25) : 713
        this.viewNode.GeneShowList.height = Math.min(640, geneRow * 320)

        let count = itemList.length;
        let row = Math.floor(count / 5) + 1
        let col = 0 == (count % 5) ? 5 : (count % 5)
        this.viewNode.ShowList.width = count < 5 ? Math.min(710, col * 134 + (col - 1) * 10) : 710
        this.viewNode.ShowList.height = Math.min(450, row * 144)

        this.viewNode.GeneShowList.numItems = geneNum;
        this.showList = itemList;
        this.viewNode.ShowList.numItems = this.showList.length;
        this.viewNode.BtnContinue.visible = 0 == this.showList.length;
    }

    InitUI() {
        this.EffectShow()
    }

    CloseCallBack() {
        if (this.TwShow) {
            this.TwShow.kill();
            this.TwShow = null
        }
        Timer.Inst().CancelTimer(this.timer_show)
        RoleData.Inst().ShowRewardGet = false
        if (RoleData.Inst().ShowLevelUp) {
            RoleData.Inst().ShowLevelUp = true
        }
    }

    OnClickContinue() {
        ViewManager.Inst().CloseView(RewardGetView)
    }

    OnClickShow() {
        this.isShow = true;
        Timer.Inst().CancelTimer(this.timer_show)
        for (let i = 0; i < this.showList.length; i++) {
            let item = <RewardGetViewShowItem>this.viewNode.ShowList.getChildAt(i)
            if (item) {
                item.SetGpShowVisible(true);
            }
        }
        this.viewNode.BtnContinue.visible = true
        this.viewNode.ShowList.touchable = true
        this.viewNode.GeneShowList.touchable = true
    }

    private renderGeneListItem(index: number, item: RewardGetViewGeneShow) {
        item.SetData(index);
    }

    private renderListItem(index: number, item: RewardGetViewShowItem) {
        item.SetData(this.showList[index]);
    }

    EffectShow() {
        let show: Function = () => {
            Timer.Inst().CancelTimer(this.timer_show)
            this.timer_show = Timer.Inst().AddRunTimer(() => {
                let item = (this.viewNode.ShowList && this.viewNode.ShowList.numItems > 0) ? <RewardGetViewShowItem>this.viewNode.ShowList.getChildAt(cur_index) : null;
                if (item) {
                    AudioManager.Inst().PlaySceneAudio(AudioTag.HuoDeDaoJu, 0);
                    item.EffShow()
                }
                if (cur_index % 5 == 4 && cur_index > 0) {
                    if (cur_index > 4) {
                        this.viewNode.ShowList.scrollPane.scrollDown(130 / 25)
                    } else {
                        this.viewNode.ShowList.scrollPane.scrollDown(2)
                    }
                }
                if (this.isShow) {
                    return;
                }
                cur_index++;
                if (cur_index < this.showList.length) {
                    show();
                } else {
                    //等动效播完在显示
                    Timer.Inst().CancelTimer(this.timer_show)
                    this.timer_show = Timer.Inst().AddRunTimer(() => {
                        this.viewNode.BtnContinue.visible = true
                        this.viewNode.ShowList.touchable = true
                        this.viewNode.GeneShowList.touchable = true
                    }, 0.4, 1, false)

                }
            }, 0.15, 1, false)
        }
        let cur_index: number = 0
        show()
    }
}

export class RewardGetViewShowItem extends BaseItem {
    TwShow: fgui.GTweener = null;

    protected viewNode = {
        GpShow: <fgui.GGroup>null,
        // CellShow: <ItemCell>null,
        QuaIcon: <fgui.GLoader>null,
        Icon: <fgui.GLoader>null,
        RbTxt: <fgui.GTextField>null,
        PieceShow: <fgui.GImage>null,
    };

    SetData(data: any) {
        let icon_id = Item.GetIconId(data.itemId) ?? 0;
        // let scale = ITEM_SHOW_TYPE.HERO_PIECE == Item.GetShowType(data.itemId) ? 0.8 : 1
        UH.SpriteName(this.viewNode.QuaIcon, "CommonAtlas", `PinZhi${Item.GetColor(data.itemId)}`);
        UH.SetIcon(this.viewNode.Icon, icon_id, ITEM_SHOW_TYPE.HERO_PIECE == Item.GetShowType(data.itemId) ? ICON_TYPE.ROLE : ICON_TYPE.ITEM);
        // this.viewNode.Icon.setScale(scale, scale)
        this.viewNode.RbTxt.text = (data.num != 0) ? DataHelper.ConverMoney(data.num) : "";
        this.viewNode.PieceShow.visible = ITEM_SHOW_TYPE.HERO_PIECE == Item.GetShowType(data.itemId)
    }

    EffShow() {
        let show: Function = () => {
            this.TwShow = fgui.GTween.to(0.8, 1.1, 0.12)
                .setEase(fgui.EaseType.QuartOut)
                .onUpdate((tweener: fgui.GTweener) => {
                    if (this.node) {
                        this.scaleX = tweener.value.x
                        this.scaleY = tweener.value.x
                    }
                }).onComplete(() => {
                    this.TwShow = fgui.GTween.to(1.1, 1, 0.12)
                        .setEase(fgui.EaseType.QuartOut)
                        .onUpdate((tweener: fgui.GTweener) => {
                            if (this.node) {
                                this.scaleX = tweener.value.x
                                this.scaleY = tweener.value.x
                            }
                        }).onComplete(() => {
                            this.TwShow = null
                        })
                })
        }
        this.viewNode.GpShow.visible = true
        show();
    }

    SetGpShowVisible(visible: boolean) {
        this.viewNode.GpShow.visible = visible;
    }

    protected onDestroy() {
        super.onDestroy()
        if (this.TwShow) {
            this.TwShow.kill();
            this.TwShow = null
        }
    }
}

export class RewardGetViewGeneShow extends BaseItem {
    TwShow: fgui.GTweener = null;

    protected viewNode = {
        GpShow: <fgui.GGroup>null,
        Icon: <fgui.GLoader>null,
        AttrIcon: <fgui.GLoader>null,
        Bg: <fgui.GLoader>null,
        Lv: <fgui.GTextField>null,
        AttrNum1: <fgui.GTextField>null,
        AttrNum2: <fgui.GTextField>null,
    };

    SetData(index: number) {
        let num = HeroData.Inst().GetGeneNum()
        let info = HeroData.Inst().GetGeneInfoIndex(num - index - 1)
        let gene = HeroData.Inst().GetGeneCfg(info.geneId)
        let item = Item.GetConfig(info.geneId);
        UH.SetText(this.viewNode.Lv, "Lv." + item.item_level)
        UH.SpriteName(this.viewNode.Bg, "CommonAtlas", "TuBiaoDi" + item.color)
        if (gene.hero_id) {
            UH.SetIcon(this.viewNode.AttrIcon, gene.hero_id, ICON_TYPE.HEROSMALL);
        } else {
            UH.SpriteName(this.viewNode.AttrIcon, "CommonAtlas", "HeroAttr" + 1)
        }
        UH.SetIcon(this.viewNode.Icon, item.icon_id, ICON_TYPE.ITEM);

        let attrName1 = GetCfgValue(Language.Hero.fixedType, info.randAttr) + "：";
        let attrName2 = GetCfgValue(Language.Hero.fixedType, item.unfixed_type) + "：";

        let att = item.fixed_att.split("|");
        if (item.unfixed_type == 1) {
            UH.SetText(this.viewNode.AttrNum1, `${attrName2}${item.unfixed_att}`)
        } else {
            UH.SetText(this.viewNode.AttrNum1, `${attrName2}${(item.unfixed_att / 100)}%`)
        }
        if (info.randAttr == 1) {
            UH.SetText(this.viewNode.AttrNum2, `${attrName1}${att[0]}`)
        } else {
            UH.SetText(this.viewNode.AttrNum2, `${attrName1}${(+att[info.randAttr - 1] / 100)}%`)
        }
    }

    EffShow() {
        let show: Function = () => {
            this.TwShow = fgui.GTween.to(0.8, 1.1, 0.12)
                .setEase(fgui.EaseType.QuartOut)
                .onUpdate((tweener: fgui.GTweener) => {
                    if (this.node) {
                        this.scaleX = tweener.value.x
                        this.scaleY = tweener.value.x
                    }
                }).onComplete(() => {
                    this.TwShow = fgui.GTween.to(1.1, 1, 0.12)
                        .setEase(fgui.EaseType.QuartOut)
                        .onUpdate((tweener: fgui.GTweener) => {
                            if (this.node) {
                                this.scaleX = tweener.value.x
                                this.scaleY = tweener.value.x
                            }
                        }).onComplete(() => {
                            this.TwShow = null
                        })
                })
        }
        this.viewNode.GpShow.visible = true
        show();
    }

    protected onDestroy() {
        super.onDestroy()
        if (this.TwShow) {
            this.TwShow.kill();
            this.TwShow = null
        }
    }
}


