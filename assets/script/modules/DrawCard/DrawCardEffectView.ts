import { UH } from '../../helpers/UIHelper';
import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { DrawCardData } from './DrawCardData';
import { BaseItem } from 'modules/common/BaseItem';
import { HeroData } from 'modules/hero/HeroData';
import { ICON_TYPE } from 'modules/common/CommonEnum';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { EGLoader } from 'modules/extends/EGLoader';
import { ObjectPool } from 'core/ObjectPool';
import { UISpineShow } from 'modules/scene_obj_spine/UISpineShow';
import { ResPath } from 'utils/ResPath';
import { Timer } from 'modules/time/Timer';
import { BagData } from 'modules/bag/BagData';
import { Item } from 'modules/bag/ItemData';
import { PublicPopupCtrl } from 'modules/public_popup/PublicPopupCtrl';
import { DialogTipsToggle, DialogTipsToggleKey } from 'modules/public_popup/PublicPopupData';
import { TextHelper } from '../../helpers/TextHelper';
import { DrawCardCtrl } from './DrawCardCtrl';
import { ViewManager } from 'manager/ViewManager';

@BaseView.registView
export class DrawCardEffectView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "DrawCardEffect",
        ViewName: "DrawCardEffectView",
        LayerType: ViewLayer.Normal,
    };

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,

        bg2: <EGLoader>null,
        bg: <EGLoader>null,
        ShowList: <fgui.GList>null,
        // HeroCell: <HeroCell>null,

        WaterSpine: <UISpineShow>null,
        GpShow: <fgui.GGroup>null,
        CostIcon: <fgui.GLoader>null,
        CostTxt: <fgui.GTextField>null,
        BtnClose: <fgui.GButton>null,
        BtnReward: <fgui.GButton>null,
    };

    protected extendsCfg = [
        { ResName: "HeroCell", ExtendsClass: HeroCell },
        { ResName: "HeroItemShow", ExtendsClass: HeroItemShow },
    ];

    private reward: IPB_ItemData[]
    private showList: IPB_ItemData[][]
    TwShow1: fgui.GTweener = null;
    private timer_show: any = null;
    private stateCtrler: fgui.Controller
    listData: IPB_ItemData[][];

    InitData(param: { reward_data: IPB_ItemData[] }) {
        this.viewNode.BtnClose.onClick(this.closeView, this);
        this.viewNode.BtnReward.onClick(this.onClickDraw, this);
        this.viewNode.bg2.onClick(this.onClickEffect, this);

        this.stateCtrler = this.view.getController("ShowState");

        let reward = param.reward_data ?? []
        // if (reward.length == 1) {
        //     this.viewNode.HeroCell.SetData(param.reward_data[0])
        //     this.viewNode.HeroCell.EffShow()
        // } else if (reward.length > 1) {
        let data = [];
        data.push(reward.slice(0, 3))
        if (reward.length > 1) {
            data.push(reward.slice(3, 7))
            data.push(reward.slice(7, 10))
            data.push([])
        }
        this.reward = reward;
        this.showList = data;

        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = data;
        this.viewNode.ShowList.numItems = data.length;
        // }
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    InitUI() {
        const otherCfg = DrawCardData.Inst().GetOtherCfg();
        let item;
        if (this.reward.length == 1) {
            item = otherCfg.extract_item2[0]
        } else {
            item = otherCfg.ten_extract_item2[0]
        }
        let itemNum = BagData.Inst().GetItemNum(item.item_id)
        UH.SetIcon(this.viewNode.CostIcon, Item.GetIconId(item.item_id), ICON_TYPE.ITEM);
        UH.SetText(this.viewNode.CostTxt, `${itemNum}/${item.num}`);

        this.viewNode.WaterSpine.LoadSpine(ResPath.UIEffect(`1208136`))
    }

    onClickEffect() {
        this.stateCtrler.selectedIndex = 1
        this.EffectShow();
    }

    EffectShow() {
        let show: Function = () => {
            Timer.Inst().CancelTimer(this.timer_show)
            this.timer_show = Timer.Inst().AddRunTimer(() => {
                let item = <HeroItemShow>this.viewNode.ShowList.getChildAt(cur_index)
                if (item) {
                    item.EffShow()
                }
                cur_index++;
                if (cur_index < this.showList.length) {
                    show();
                } else {
                    this.viewNode.GpShow.visible = true
                }
            }, 0 == cur_index ? 0 : 1.2, 1, false)
        }
        let cur_index: number = 0
        show()
    }

    onClickDraw() {
        let num = this.reward.length;
        const otherCfg = DrawCardData.Inst().GetOtherCfg();
        let icon = TextHelper.RichTextImg("CommonCurrency", "Small40163")
        let str = TextHelper.RichTextOutLine("x" + otherCfg.extract_item2[0].num * num, "491914", 3)
        let tips = TextHelper.Format(Language.DrawCard.DrawTips, icon, str, num);
        PublicPopupCtrl.Inst().DialogTips(tips, () => {
            ViewManager.Inst().CloseView(DrawCardEffectView)
            DrawCardCtrl.Inst().SendDrawCard(num)
        }, null, null, null, null, DialogTipsToggle.CreateDay(DialogTipsToggleKey.DrawCard), true);

    }

    WindowSizeChange() {
        this.refreshBgSize(this.viewNode.bg)
    }

    DoOpenWaitHandle() {
        let waitHandle = this.createWaitHandle("loadBG")
        this.AddWaitHandle(waitHandle);
        this.viewNode.bg.SetIcon("loader/ui_bg/DrawCardEffectBg", () => {
            waitHandle.complete = true;
            this.refreshBgSize(this.viewNode.bg)
        })
    }

    CloseCallBack() {
        super.CloseCallBack()
        if (this.TwShow1) {
            this.TwShow1.kill();
            this.TwShow1 = null
        }
        Timer.Inst().CancelTimer(this.timer_show)
    }
}

class HeroItemShow extends BaseItem {
    protected viewNode = {
        ShowList: <fgui.GList>null,
    };
    private Listdata: IPB_ItemData[]
    private TwShow1: fgui.GTweener = null;
    private timer_show: any = null;

    public SetData(data: IPB_ItemData[]) {
        this.Listdata = data
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.ShowList.numItems = data.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.Listdata[index]);
    }

    EffShow() {
        if (this.Listdata.length <= 0) return
        let show: Function = () => {
            Timer.Inst().CancelTimer(this.timer_show)
            this.timer_show = Timer.Inst().AddRunTimer(() => {
                let item = <HeroCell>this.viewNode.ShowList.getChildAt(cur_index)
                if (item) {
                    item.EffShow()
                }
                cur_index++;
                if (cur_index < this.Listdata.length) {
                    show();
                }
            }, 0 == cur_index ? 0 : 0.3, 1, false)
        }
        let cur_index: number = 0
        show()
    }

    protected onDestroy() {
        super.onDestroy()
        if (this.TwShow1) {
            this.TwShow1.kill();
            this.TwShow1 = null
        }
        Timer.Inst().CancelTimer(this.timer_show)
    }
}

class HeroCell extends BaseItem {
    protected viewNode = {
        Num: <fgui.GTextField>null,
        Name: <fgui.GTextField>null,
        bg: <fgui.GLoader>null,
        Box: <fgui.GLoader>null,
        HeroIcon: <fgui.GLoader>null,
        RaceIcon: <fgui.GLoader>null,
        GpShow: <fgui.GGroup>null,
        Spine: <UISpineShow>null,
    };
    private spShow: UISpineShow = undefined;
    TwShow: fgui.GTweener = null;

    public SetData(data: IPB_ItemData) {
        let hero = HeroData.Inst().GetDebrisHeroCfg(data.itemId);
        let LevelHero = HeroData.Inst().GetHeroLevelCfg(hero.hero_id, 1);
        UH.SetText(this.viewNode.Num, "x" + data.num);
        UH.SetText(this.viewNode.Name, hero.hero_name);
        UH.SetIcon(this.viewNode.HeroIcon, LevelHero.res_id, ICON_TYPE.ROLE);
        UH.SpriteName(this.viewNode.RaceIcon, "CommonAtlas", "HeroAttr" + hero.hero_race);
        UH.SpriteName(this.viewNode.bg, "CommonAtlas", "HeroBgPinZhi" + hero.hero_color);
        UH.SpriteName(this.viewNode.Box, "DrawCardEffect", hero.hero_color == 2 ? "lan" : "zi");

        this.viewNode.Box.visible = hero.hero_color != 1;
        if (hero.hero_color != 1) {
            this.viewNode.Spine.LoadSpine(ResPath.UIEffect(hero.hero_color == 2 ? "1208137" : "1208138"))
        }
    }

    EffShow() {
        AudioManager.Inst().PlaySceneAudio(AudioTag.baoxiangdan, 0);
        this.viewNode.GpShow.visible = true
        this.spShow = ObjectPool.Get(UISpineShow, ResPath.UIEffect(`1208026`), true, (obj: any) => {
            obj.setPosition(85, -105);
            this._container.insertChild(obj, 2);
            let show: Function = () => {
                this.TwShow = fgui.GTween.to(0, 1.6, 0.12)
                    .setEase(fgui.EaseType.QuartOut)
                    .onUpdate((tweener: fgui.GTweener) => {
                        if (this.node) {
                            this.scaleX = tweener.value.x
                            this.scaleY = tweener.value.x
                        }
                    }).onComplete(() => {
                        this.TwShow = fgui.GTween.to(1.6, 0.9, 0.12)
                            .setEase(fgui.EaseType.QuartOut)
                            .onUpdate((tweener: fgui.GTweener) => {
                                if (this._node) {
                                    this.scaleX = tweener.value.x
                                    this.scaleY = tweener.value.x
                                }
                            }).onComplete(() => {
                                this.TwShow = fgui.GTween.to(0.9, 1, 0.12)
                                    .setEase(fgui.EaseType.QuartOut)
                                    .onUpdate((tweener: fgui.GTweener) => {
                                        if (this.node) {
                                            this.scaleX = tweener.value.x
                                            this.scaleY = tweener.value.x
                                        }
                                    }).onComplete(() => {
                                        this.viewNode.Spine.visible = true
                                    })
                            })
                    })
            }
            show();
        });
    }

    protected onDestroy() {
        super.onDestroy()
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null
        }
        if (this.TwShow) {
            this.TwShow.kill();
            this.TwShow = null
        }
    }
}

