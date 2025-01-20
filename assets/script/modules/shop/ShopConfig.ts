
export var ShopConfig = {

    BoxReqType: {
        open: 0,            // 开启宝箱 p:宝箱类型
        info: 1,            // 请求信息
    },

    ShopReqType: {
        buy: 0,            // 购买 p:seq|num
        info: 1,            // 请求信息
    },

    DiscountReqType: {
        buy: 0,             // 购买物品 p:index[0,5]
        refresh: 1,         // 刷新
        info: 2,            // 请求信息
    },

    ShopSendType: {
        init: 0,            // 初始化
        single: 1,          // 单个
    },

    BoxGetSpine: [
        "1208029",
        "1208030",
        "1208022",

        "1208044",
        "1208045",
        "1208046",
        "1208047",//胜利广告宝箱
    ]
}