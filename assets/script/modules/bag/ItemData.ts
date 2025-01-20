import { CfgDebrisData } from "config/CfgDebris";
import { CfgEene } from "config/CfgEene";
import { CfgFishItemData } from "config/CfgFishItem";
import { CfgGift } from "config/CfgGift";
import { CfgOtherData } from "config/CfgOther";
import { CfgRandomDna } from "config/CfgRandomDna";
import { IPoolObject, ObjectPool } from "core/ObjectPool";
import { DataBase } from "data/DataBase";
import { QualityColor, QualityColorOL, QualityColorOLStr, QualityColorStr } from "modules/common/ColorEnum";
import { ITEM_BIG_TYPE, ITEM_SHOW_TYPE, ItemColor } from "modules/common/CommonEnum";
import { CellClicks } from "modules/extends/ItemCellFuncs";
import { HeroData } from "modules/hero/HeroData";
import { TextHelper } from "../../helpers/TextHelper";
import { BagData } from "./BagData";

class ItemPool extends ObjectPool { }

export class ItemCache {
    public static Create(type: number, vo: any, is?: any) {
        let re;
        switch (type) {
            // case ITEM_BIG_TYPE.EQUIP:
            //     re = ItemPool.Get(Equip);
            //     vo = Equip.CreateEquipData(vo);
            //     break;
            // case ITEM_BIG_TYPE.EQUIP_ANGEL:
            //     re = ItemPool.Get(Equip);
            //     break;
            // case ITEM_BIG_TYPE.EQUIP_SHILIAN:
            //     re = ItemPool.Get(EquipShiLian);
            //     break;
            default:
                re = ItemPool.Get(Item);
        }
        re.init(vo, is);
        return re;
    }
    public static Destory(collector: Item) {
        ItemPool.Push(collector);
    }
}

export class Item implements IPoolObject {
    protected vo: any = null;
    protected item_id: number = 0;
    protected is_bind: boolean = false;
    protected num: number | string = 0;

    protected is_gray: boolean = false;
    protected black_icon: boolean = false;
    protected mask_icon: boolean = false;
    // 需填写在UI上面 如{"is_click":false}
    protected is_click: boolean = true;
    protected is_num: boolean = false;
    protected eff: number = 0;

    constructor() {
    }
    onPoolReset(): void {
    }

    public init(vo: any, is?: any): void {
        this.vo = vo;
        if (vo) {
            this.item_id = vo.item_id ?? vo.itemId ?? 0;
            this.is_bind = vo.is_bind ?? false;
            this.num = vo.num ?? vo.itemNum ?? 0;
        } else {
            this.item_id = vo.item_id ?? vo.itemId ?? 0;
            this.is_bind = vo.is_bind ?? false;
            this.num = vo.num ?? vo.itemNum ?? 0;
        }
        this.CheckSet(is ?? {});
    }

    protected CheckSet(is: any): void {
        this.is_gray = is.is_gray ?? false;
        this.black_icon = is.black_icon ?? false;
        this.mask_icon = is.mask_icon ?? false;
        //下面不建议使用 需填写在UI上面 如{"is_num":false}
        this.is_click = is.is_click ?? true;
        this.is_num = is.is_num ?? false;
        this.eff = is.eff ?? 0;
    }

    //静态方法 创建item
    public static Create(vo: any, is?: any) {
        let item_id = vo.item_id ?? vo.itemId;
        if (vo) {
            item_id = vo.itemId;
        }
        return ItemCache.Create(Item.GetBigType(item_id), vo ?? {}, is ?? {})
    }

    //返回表里配的itemlist转换create之后的数组，is默认，可自传
    public static DefaultCreateListItem(list: any[], is = { is_gray: false, is_click: true, is_num: true, eff: 0 }) {
        let list_data = [];
        for (let i = 0; i < list.length; i++) {
            let item_id = list[i].itemId ?? list[i].item_id;
            list_data.push(ItemCache.Create(Item.GetBigType(item_id), list[i], is ?? {}))
        }
        return list_data;
    }

    public ItemId(): number {
        return this.item_id;
    }

    public IsClick(): boolean {
        return this.is_click;
    }

    public IsNum(): boolean {
        return this.is_num;
    }

    public Vo() {
        return this.vo;
    }

    public Config() {
        return Item.GetConfig(this.item_id);
    }

    public BigType() {
        return Item.GetBigType(this.item_id);
    }

    public Name(): string {
        return Item.GetName(this.item_id);
    }

    public Num(): number | string {
        return this.num;
    }

    public Desc(): string {
        return Item.GetDesc(this.item_id);
    }

    public IconId() {
        return Item.GetIconId(this.item_id);
    }

    public Color(): number {
        return Item.GetColor(this.item_id);
    }

    // 是否浅色背景
    public QuaName(shallow?: boolean) {
        let color = shallow ? QualityColorStr[this.Color()] : QualityColorStr[this.Color()];
        return TextHelper.ColorStr(this.Name(), color);
    }

    public static GetConfig(item_id: number) {
        return ItemData.Inst().GetConfig(item_id);
    }

    public static GetBigType(item_id: number) {
        return ItemData.Inst().GetBigType(item_id);
    }

    public static GetShowType(item_id: number): number {
        const co = Item.GetConfig(item_id);
        return co ? co.show_type : 0;
    }

    public static GetGiftlist(item_id: number) {
        const co = Item.GetConfig(item_id);
        return co ? co.gift : [];
    }

    public static QuaNameOL(item_id: number, width?: number, shallow?: boolean) {
        let color = Item.GetColor(item_id);
        let quality_color = shallow ? QualityColorStr[color] : QualityColorStr[color];
        let quality_color_ol = shallow ? QualityColorOLStr[color] : QualityColorOLStr[color];
        return TextHelper.RichTextOutLine(TextHelper.ColorStr(Item.GetName(item_id), quality_color), quality_color_ol, width);
    }

    public static QuaColor(item_id: number) {
        let color = Item.GetColor(item_id);
        let quality_color = QualityColor[color];
        return quality_color;
    }

    public static QuaColorOL(item_id: number) {
        let color = Item.GetColor(item_id);
        let quality_color_ol = QualityColorOL[color];
        return quality_color_ol;
    }

    public static GetName(item_id: number): string {
        const co = Item.GetConfig(item_id);
        return co ? co.name : "";
    }

    public static GetItemType(item_id: number): number {
        const co = Item.GetConfig(item_id);
        return co ? co.item_type : 0;
    }

    public static GetNum(item_id: number): number {
        return BagData.Inst().GetItemNum(item_id);
    }

    public static GetDesc(item_id: number): string {
        const co = Item.GetConfig(item_id);
        return co ? co.description : "";
    }

    public static GetColor(item_id: number): number {
        const co = Item.GetConfig(item_id);
        return co ? (co.quality ? co.quality : co.color) : ItemColor.None;
    }

    public static GetIconId(item_id: number): string {
        if (ITEM_SHOW_TYPE.HERO_PIECE == Item.GetShowType(item_id)) {
            return Item.GetHeroPieceIconId(item_id)
        }
        const co = Item.GetConfig(item_id);
        return co ? (co.icon_id ? co.icon_id : co.color) : 0;
    }

    public static GetHeroPieceIconId(item_id: number): string {
        return HeroData.Inst().GetDebrisHeroIcon(item_id);
    }

    public static IsGeneBagMax(item?: any[]): boolean {
        if(item){
            let isGene = Item.IsGeneItem(item);
            if (isGene) {
                return HeroData.Inst().IsGeneBagMax();
            }
        }else{
            return HeroData.Inst().IsGeneBagMax();
        }
        return false
    }

    public static IsGeneItem(item?: any[]): boolean {
        for (let i = 0; i < item.length; i++) {
            const id = item[i].item_id || item[i].itemId
            const type = Item.GetBigType(id);
            if (type == ITEM_BIG_TYPE.GENE || type == ITEM_BIG_TYPE.RANDOM_DNA) {
                return true
            } else if (type == ITEM_BIG_TYPE.GIFT) {
                const gift = Item.GetGiftlist(id)
                this.IsGeneItem(gift)
            }
        }
        return false
    }

    public static OnItemInfo(itemId: number) {
        let big_type = Item.GetBigType(itemId);
        if (CellClicks[big_type]) {
            CellClicks[big_type](itemId);
        } else {
            CellClicks[-1](itemId)
        }
    }
}


export class ItemData extends DataBase {
    private all_item_config: any[] = [
        CfgOtherData,
        CfgDebrisData,
        CfgGift,
        CfgEene,
        CfgRandomDna,
        CfgFishItemData,
    ]

    public GetConfig(item_id: number) {
        for (let i = 0; i < this.all_item_config.length; i++) {
            if (this.all_item_config[i][item_id]) {
                return this.all_item_config[i][item_id];
            }
        }
        return null;
    }

    public GetBigType(item_id: number) {
        for (let i = 0; i < this.all_item_config.length; i++) {
            if (this.all_item_config[i][item_id]) {
                return i;
            }
        }
        return null;
    }
}    