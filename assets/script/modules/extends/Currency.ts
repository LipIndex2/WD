import * as fgui from "fairygui-cc";
// import { RoleData } from "modules/role/RoleData";
import { ViewManager } from "manager/ViewManager";
import { BagData } from "modules/bag/BagData";
import { Item } from "modules/bag/ItemData";
import { BaseItemGLCare, BaseItemGPCare } from "modules/common/BaseItem";
import { COLORS } from "modules/common/ColorEnum";
import { CommonId, ICON_TYPE } from "modules/common/CommonEnum";
import { FishData } from "modules/fish/FishData";
import { MainData } from "modules/main/MainData";
import { EnergyBuyView } from "modules/main_fb/EnergyBuyView";
import { RoleCtrl } from "modules/role/RoleCtrl";
import { RoleData } from "modules/role/RoleData";
import { ShopView } from "modules/shop/ShopView";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { DataHelper } from "../../helpers/DataHelper";
import { UH } from "../../helpers/UIHelper";
import { TimeFormatType, TimeMeter } from "./TimeMeter";
import { ArenaItemBuyView, ArenaItemBuyViewParam } from "modules/Arena/ArenaItemBuyView";
import { CfgArena } from "config/CfgArena";
import { ArenaCtrl, ArenaReq } from "modules/Arena/ArenaCtrl";
import { ArenaData } from "modules/Arena/ArenaData";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { Language } from "modules/common/Language";
import { FishCtrl } from "modules/fish/FishCtrl";
import { Format } from "../../helpers/TextHelper";


export class CurrencyShow extends BaseItemGLCare {
    protected viewNode = {
        icon: <fgui.GLoader>null,
        title: <fgui.GTextField>null,
        BtnAdd: <fgui.GButton>null,
        TimeShow: <TimeMeter>null,
    };

    private currnecyType: number;
    private addCallback: Function;

    InitData(): void {
        this.viewNode.BtnAdd.onClick(this.OnClickAdd, this);

        this.AddSmartDataCare(BagData.Inst().BagItemData, this.FlushNumShow.bind(this), "OtherChange")
    }

    public FlushNumShow() {
        if (this.currnecyType) {
            let num = BagData.Inst().GetItemNum(this.currnecyType);
            let text = DataHelper.ConverMoney(+num);
            switch (this.currnecyType) {
                case CommonId.Energy:
                    UH.SetText(this.viewNode.title, `${text}/${RoleData.Inst().CfgPlayerLevelOtherPowerMax()}`);
                    this.FlushTimeShow(RoleData.Inst().InfoRoleEnergyUpTime)
                    break;
                case FishData.Inst().CfgOtherBreadId:
                    UH.SetText(this.viewNode.title, `${FishData.Inst().InfoPower}/${FishData.Inst().CfgOtherBreadMax}`);
                    this.FlushTimeShow(FishData.Inst().InfoNextPowerTime)
                    break;
                default:
                    if (this.viewNode.title["_node"]) {
                        UH.SetText(this.viewNode.title, text)
                    }
                    this.viewNode.TimeShow.SetTime("")
                    break;
            }
        }
    }

    public setNum(num: number) {
        let text = DataHelper.ConverMoney(+num);
        UH.SetText(this.viewNode.title, CommonId.Energy == this.currnecyType ? `${text}/${RoleData.Inst().CfgPlayerLevelOtherPowerMax()}` : text);

        switch (this.currnecyType) {
            case CommonId.Energy:
                this.FlushTimeShow(RoleData.Inst().InfoRoleEnergyUpTime)
                break;
            case FishData.Inst().CfgOtherBreadId:
                this.FlushTimeShow(FishData.Inst().InfoNextPowerTime)
                break;
            default:
                this.viewNode.TimeShow.SetTime("")
                break;
        }
    }

    public SetCurrency(item_id: number, icon_show: boolean = false, icon_id?: number, scale?: number) {
        this.currnecyType = item_id;

        if (icon_show) {
            UH.SetIcon(this.viewNode.icon, icon_id ? icon_id : Item.GetIconId(item_id), ICON_TYPE.ITEM);
        } else {
            UH.SpriteName(this.viewNode.icon, "CommonCurrency", `Big${this.currnecyType}`);
        }

        if (scale) {
            this.viewNode.icon.setScale(scale, scale)
        } else {
            this.viewNode.icon.setScale(icon_show ? 0.6 : 1, icon_show ? 0.6 : 1)
        }

        this.FlushNumShow();
    }

    private OnClickAdd() {
        switch (this.currnecyType) {
            case CommonId.Energy:
                ViewManager.Inst().OpenView(EnergyBuyView)
                break;
            case CommonId.Diamond:
                ViewManager.Inst().OpenView(ShopView);
                MainData.Inst().FlushMainMenu();
                break;
            case CommonId.ArenaItemId:
                if (ArenaData.Inst().fightItemNum >= ArenaData.Inst().maxFightItemNum) {
                    PublicPopupCtrl.Inst().Center(Language.Arena.tips1);
                    return;
                }

                let remindCount = ArenaData.Inst().GetRemainBuyCount();
                if (remindCount <= 0) {
                    PublicPopupCtrl.Inst().Center(Language.Arena.tips15);
                    return;
                }

                let param = new ArenaItemBuyViewParam(CommonId.ArenaItemId, 1, CfgArena.other[0].challenge_item_price, CommonId.Diamond, (num) => {
                    if (num && num > 0) {
                        ArenaCtrl.Inst().SendReq(ArenaReq.BuyChallengeItem, [num]);
                    }
                });
                param.maxNum = remindCount;
                ViewManager.Inst().OpenView(ArenaItemBuyView, param);
            default:
                break
        }
        this.addCallback && this.addCallback()
    }

    public BtnAddShow(visible: boolean, pos_num?: any, add_callback?: Function) {
        this.viewNode.BtnAdd.visible = visible
        if (pos_num) {
            this.viewNode.title.setPosition(pos_num.x, pos_num.y)
        }
        this.addCallback = add_callback
    }

    public FlushTimeShow(time: number, format_type = TimeFormatType.TYPE_TIME_0) {
        if (!this["_node"]) {
            this.onDestroy();
            return;
        }
        if (time > TimeCtrl.Inst().ServerTime) {
            this.viewNode.TimeShow.SetOutline(true, COLORS.Brown, 3)
            this.viewNode.TimeShow.StampTime(time, format_type)
            this.viewNode.TimeShow.SetCallBack(() => {
                this.FlushTimeShow(RoleData.Inst().InfoRoleEnergyUpTime);
                switch (this.currnecyType) {
                    case CommonId.Energy:
                        RoleCtrl.Inst().SendRoleSystemSetReq()
                        break;
                    case FishData.Inst().CfgOtherBreadId:
                        FishCtrl.Inst().SendRoleFishReqInfo()
                        break;
                }
            })
        }
        else {
            this.viewNode.TimeShow.SetTime("")
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
    }
}

export class ExpShow extends BaseItemGPCare {
    protected viewNode = {
        LevelShow: <fgui.GTextField>null,
        txHint: <fgui.GTextField>null,
        bar: <fgui.GImage>null,
        bg: <fgui.GImage>null,
    };

    InitData() {
        this.AddSmartDataCare(RoleData.Inst().FlushData, this.FlushRoleInfo.bind(this), "FlushRoleInfo");
    }

    InitUI() {
        this.FlushRoleInfo();
    }

    FlushRoleInfo() {
        this.value = RoleData.Inst().InfoCurExp;
        this.max = RoleData.Inst().CfgPlayerLevelLevelLevelUp()
        let level = Math.min(RoleData.Inst().InfoRoleLevel, 30);
        if (level >= 30) {
            this.viewNode.bar.visible = false;
            this.viewNode.bg.visible = false;
            this.viewNode.txHint.visible = true;
        } else {
            this.viewNode.bar.visible = true;
            this.viewNode.bg.visible = true;
            this.viewNode.txHint.visible = false
        }
        UH.SetText(this.viewNode.LevelShow, `${level}`)
    }
    protected onDestroy(): void {
        super.onDestroy();
    }
}