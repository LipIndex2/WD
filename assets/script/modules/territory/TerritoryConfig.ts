
export var TerritoryConfig = {
    ReqType: {
        info: 0,                // 领地界面信息 p1:uid
        neighbour: 1,           // 抢夺界面
        fetch_item: 2,          // 开始拉货 p1:目标uid p2:货箱index p3:工具人数量
        fetch_reward: 3,        // 领取奖励
        buy: 4,                 // 购买工具人
        bot_status: 5,          // 工具人派遣
        refresh_neighbour: 6,   // 刷新邻居
        report: 7,              // 请求日志    
        refresh_item: 8,        // 刷新物品
        open_ui: 9,             // 打开界面
    },

    RetType: {
        info: 0,                // 领地界面信息
        reward_count: 1,        // 拉货次数
        bot_run_num: 2,         // 工具人出动数量
        fetch_item: 3,          // 开始拉货
        buy_bot: 4,             // 购买工具人
        refresh_item: 5,        // 刷新货物
    },

    NeighborType: {
        empty_nei: -2,      // 空邻居
        empty_en: -1,       // 空对立
        neighbour: 0,       // 邻居
        enemy: 1,           // 对立
    },

    // 40/12
    // MovePos: [
    //     [108, 568],
    //     [191, 618],
    //     [274, 669],
    //     [357, 720],
    //     [440, 770],
    // ]

    PosDef: [
        [13, 869],
        [133, 869],
        [253, 869],
        [373, 869],
        [493, 869],
    ],

    PosAttack: [
        [13, 565],
        [133, 565],
        [253, 565],
        [373, 565],
        [493, 565],
    ]

}