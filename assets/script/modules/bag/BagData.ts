import { DataBase } from "data/DataBase";
import { SMDMap } from "data/SMDMap";
import { CreateSMD, smartdata } from "data/SmartData";
import { CommonId, ITEM_BIG_TYPE } from "modules/common/CommonEnum";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { Item } from "./ItemData";
import { ArenaData } from "modules/Arena/ArenaData";

export class BagItemData {
    @smartdata
    OtherChange: boolean; // 被动消耗类数据发生改变
    @smartdata
    GeneChange: boolean; // 基因类数据发生改变
    @smartdata
    FishChange: boolean; // 鱼类数据发生改变
}

export class BagData extends DataBase {
    public ItemData: SMDMap<number, number>;
    public BagItemData: BagItemData;
    public ItemTypeData: Map<number, Map<number, number>>

    public isShowRewardBox: boolean = false;//显示宝箱奖励界面


    constructor() {
        super();
        this.createSmartData();
    }

    public get ShowRewardBox() {
        return this.isShowRewardBox
    }

    public set ShowRewardBox(value: boolean) {
        this.isShowRewardBox = value
    }

    private createSmartData() {
        this.ItemData = CreateSMD<SMDMap<number, number>>(SMDMap);
        this.BagItemData = CreateSMD(BagItemData);
        this.ItemTypeData = new Map()
    }

    public SetKnapsackAllInfo(protocol: PB_SCKnapsackAllInfo) {
        for (let i = 0; i < protocol.itemList.length; i++) {
            this.SetItemNum(protocol.itemList[i]);
        }
    }

    public SetKnapsackSingleInfo(data: PB_SCKnapsackSingleInfo) {
        this.SetItemNum(data.item, true)
    }

    protected onSwitch() {
        if (this.ItemData) {
            this.ItemData.clear();
        }
        if (this.ItemTypeData) {
            this.ItemTypeData.clear();
        }
    }

    public SetItemNum(data: IPB_ItemData, isSingle = false) {
        this.ItemData.set(data.itemId, data.num);

        let big_type = Item.GetBigType(data.itemId)
        switch (big_type) {
            case ITEM_BIG_TYPE.OTHER:/*  */
                this.ItemTypeData.set(big_type, this.GetItemMap(big_type, data));
                this.BagItemData.OtherChange = !this.BagItemData.OtherChange
                break
            case ITEM_BIG_TYPE.GENE:/*  */
                this.ItemTypeData.set(big_type, this.GetItemMap(big_type, data));
                this.BagItemData.GeneChange = !this.BagItemData.GeneChange
                break
            case ITEM_BIG_TYPE.FISH:/*  */
                this.ItemTypeData.set(big_type, this.GetItemMap(big_type, data));
                this.BagItemData.FishChange = !this.BagItemData.FishChange
                break
        }
    }

    public GetItemMap(big_type: number, data?: IPB_ItemData) {
        let map = this.ItemTypeData.get(big_type)
        map = map ? map : new Map()
        if (data) {
            map.set(data.itemId, data.num)
        }
        return map
    }

    public GetItemNum(item_id: number) {
        if(item_id == CommonId.ArenaItemId){
            return ArenaData.Inst().fightItemNum;
        }
        let num = this.ItemData.get(+item_id);
        return num ? +num : 0;
    }

    public IsItemEnough(item_id: number, need_num: number) {
        let is_enough = BagData.Inst().GetItemNum(item_id) >= need_num
        if (!is_enough) {
            PublicPopupCtrl.Inst().ItemNotEnoughNotice(item_id)
        }
        return is_enough
    }
}