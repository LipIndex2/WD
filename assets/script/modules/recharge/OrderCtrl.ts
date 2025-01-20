import { LogError } from "core/Debugger";
import * as fgui from "fairygui-cc";
import { NetManager } from "manager/NetManager";
import { Item } from "modules/bag/ItemData";
import { BaseCtrl } from "modules/common/BaseCtrl";
import { CommonId } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { LoginData } from "modules/login/LoginData";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { RoleData } from "modules/role/RoleData";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { TYPE_TIMER, Timer } from "modules/time/Timer";
import { PackageData } from "preload/PkgData";
import { UH } from "../../helpers/UIHelper";
import { ChannelAgent } from "../../proload/ChannelAgent";
import { RechargeCtrl } from "./RechargeCtrl";
import { RechargeData } from "./RechargeData";
import { CfgRechargeData } from "config/CfgRecharge";

export class OrderCtrl extends BaseCtrl {
    constructor() {
        super();
    }

    /**生成订单 
     * (直购gm:cmdbuy:role_id add_gold money type param1 param2)
    */
    public static generateOrder(orderInfo: Order_Data) {
        let has_item_num = Item.GetNum(CommonId.WanNengKa);
        let cost_item_num = orderInfo.moneyAmount;
        if (has_item_num >= cost_item_num) {
            let func = () => {
                let money = orderInfo.moneyAmount;
                let add_pay_gold = orderInfo.currencyAmount;
                RechargeCtrl.Inst().SendBuyByItem(cost_item_num, money, add_pay_gold, orderInfo.type, orderInfo.param1, orderInfo.param2);
            }
            PublicPopupCtrl.Inst().DialogTips("是否消耗" + cost_item_num + "个万能卡？\n万能卡：" + has_item_num + "个", func);
            return;
        }

        let open_chongzhi = LoginData.GetUrlParm().param_list.switch_list.open_chongzhi;
        if (open_chongzhi)
            ChannelAgent.Inst().Mai(orderInfo);
        else
            PublicPopupCtrl.Inst().Center(Language.Recharge.noOpen)
    }

    private _ht: TYPE_TIMER;
    public CheckMaiCallBack(msg: number = 0) {
        if (this._ht) {
            Timer.Inst().CancelTimer(this._ht);
        }
        if (msg) {
            this._ht = Timer.Inst().AddRunTimer(() => {
                this.CheckMaiCallBack(0)
            }, 1, msg, false);
            return
        }
        this._ht = Timer.Inst().AddRunTimer(() => {
            if (NetManager.Inst().hasSession()) {
                let notice = this.GetProtocol(PB_CSNoticeTimeReq)
                notice.type = 0;
                notice.param = TimeCtrl.Inst().ServerTime;
                this.SendToServer(notice);
            }
        }, 1, 15, false);
    }

    private _btnList: { [key: string]: { btn: fgui.GButton, time: number, text: string, GrayedFun: Function } } = {};

    /**
     * 检测购买按钮是否能支付
     * @param key 
     * @param btn 
     */
    public CheckMaiButton(key: string, btn: fgui.GButton, text?: string, GrayedFun?: Function) {
        let data_btn = this._btnList[key];
        if (btn) {
            let key_buy = btn.key_buy
            if (key_buy && key_buy != key) {
                let last_data_btn = this._btnList[key_buy];
                if (last_data_btn && last_data_btn.btn && last_data_btn.time) {
                    this._btnList[key_buy].btn = undefined;
                }
            }
            btn.key_buy = key;
        }
        if (!data_btn) {
            data_btn = this._btnList[key] = { btn: btn, time: 0, text: text ? text : btn.text, GrayedFun: GrayedFun }
        } else {

            data_btn.btn = btn;
            data_btn.text = text ? text : btn.text;
        }

        // else {
        //     data_btn.time = 0;
        // }

        if (data_btn.time) {
            btn.grayed = true
            UH.SetText(data_btn.btn, data_btn.time);
        } else {
            let is_grayed = false;
            if (GrayedFun) {
                is_grayed = GrayedFun();
            }
            data_btn.btn.grayed = is_grayed;
            UH.SetText(data_btn.btn, data_btn.text);
        }
    }

    public CheckButtonState(key: string) {
        let data_btn = this._btnList[key];
        if (data_btn) {
            if (data_btn.time) {
                return false;
            }
        }
        return true;
    }

    //按钮倒计时 默认显示_btn_djs_time-1秒
    private _btn_djs_time = 10;
    public CheckMaiButtonClick(key: string) {
        let data_btn = this._btnList[key];
        if (data_btn) {
            if (data_btn.time) {
                return false;
            }
            data_btn.time = this._btn_djs_time;
            if (data_btn.btn)
                data_btn.btn.grayed = true
            this.startTimeOut();
        }
        return true;
    }
    private _ht_btn: TYPE_TIMER;
    private startTimeOut() {
        if (this._ht_btn) {
            return
        }
        this._ht_btn = Timer.Inst().AddRunTimer(() => {
            let end = true;
            for (const key in this._btnList) {
                const data_btn = this._btnList[key];
                if (data_btn) {
                    if (data_btn.time) {
                        end = false;
                        data_btn.time -= 1;
                        if (data_btn.btn) {
                            if (!data_btn.btn.isDisposed) {
                                if (data_btn.time)
                                    UH.SetText(data_btn.btn, data_btn.time);
                                else {
                                    UH.SetText(data_btn.btn, data_btn.text);
                                    let is_grayed = false;
                                    if (data_btn.GrayedFun) {
                                        is_grayed = data_btn.GrayedFun();
                                    }
                                    data_btn.btn.grayed = is_grayed;
                                    // data_btn.btn.grayed = false;
                                }
                            } else {
                                data_btn.btn = undefined;
                            }
                        }
                    }
                }
            }
            if (end) {
                Timer.Inst().CancelTimer(this._ht_btn);
                this._ht_btn = undefined;
            }
        }, 1, -1, true)
    }

    public static PrefixByGold(value: number, middle: string = "") {
        return RechargeData.Inst().GetLocalSign() + middle + (Order_Data.getShowMoney(value));
    }
}

export class Order_Data {
    moneyAmount: number;			//金额
    currencyAmount: number;			//获得游戏币数量
    currencyName: string = "";		//游戏币名称
    productId: string = "";			//商品id  可以""
    productName: string;			//商品名称
    productDescription: string = "";//商品描述 = 商品名称
    count: number = 1;				//数量  一般都是1
    orderId: string;				//订单ID
    type: number;				    //充值类型
    param1: number;				    //param1
    param2: number;				    //param2
    /**创建订单信息
    *	@param seq 与服务端商定的param1
    *	@param type 充值类型（RechargeType 或者活动ID）
    *	@param moneyAmount 真实充值金额 
    *	@param currencyAmount (配置的钻石数)货币数量 
    *	@param productName 礼包名字
    *  @param chargeID 与服务端商定的param2
    */
    public static initOrder(seq: number | string, type: number, moneyAmount: number, currencyAmount: number, productName: string, chargeID = 0) {
        let orderData = new Order_Data();
        orderData.moneyAmount = moneyAmount / 10;
        orderData.currencyAmount = currencyAmount;
        orderData.currencyName = Language.Recharge.Diamond;
        orderData.productId = "";
        orderData.productName = productName;
        orderData.productDescription = productName;
        orderData.count = 1;
        orderData.type = type;
        orderData.param1 = +seq;
        orderData.param2 = chargeID;
        // 生成订单ID		
        let serverID = LoginData.Inst().ResultData.currentId;
        let roleID = RoleData.Inst().InfoRoleId;
        let agent_id = LoginData.Inst().GetServerInfo().spid;
        let userID = LoginData.Inst().GetLoginRespUserData().uid;
        let currentTime = Math.floor(TimeCtrl.Inst().ServerTime);
        let version = PackageData.Inst().getQueryData().version_info.assets_info.resources
        orderData.orderId = serverID + "_" + roleID + "_" + agent_id + "_" + userID + "_" + currentTime + "_"
            + version + "_" + type + "-" + seq + "-" + chargeID;
        LogError("下单信息！！请注意监测！！ 商品名字：" + orderData.productName, orderData)
        return orderData;
    }

    public static getShowMoney(moneyAmount: number) {
        let cfg_chongzhi = CfgRechargeData.reward_0;
        for (const iterator of cfg_chongzhi) {
            if (iterator.chongzhi == moneyAmount) {
                return iterator.rmb_show;
            }
        }
        return moneyAmount / 10;
    }
}

// 直购枚举
export enum RechargeType {
    BUY_TIME_TYPE_CHONGZHI = 1,//充值
    BUY_TYPE_MONEY_BOX = 2,//存钱罐
    BUY_TYPE_SEVEN_DAY_HERO = 3,//七日英雄
    BUY_TYPE_GROWTH_FUND = 4,//成长基金
    BUY_TYPE_AD_PASS = 5,//广告特权
    BUY_TYPE_GENE_GIFT = 6,//基因礼包
    BUY_TYPE_FISH_CARD = 6,//渔夫卡
    BUY_TYPE_ARENA_SKIN = 7,    //竞技场皮肤
}