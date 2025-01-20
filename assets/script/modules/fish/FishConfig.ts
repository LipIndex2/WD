
export var FishConfig = {
    ORDER_STAR_MAX: 5,
    BOX_FISH_SPEED: 1,

    ReqType: {
        info: 0,                // 请求所有信息
        fish: 1,                // 钓鱼 p1:场地类型 p2:鱼饵
        put: 2,                 // 放入水族馆
        sub_task: 3,            // 提交任务
        task_reward: 4,         // 领取任务奖励 p1:task_index
        flush_task: 5,          // 刷新任务 p1:task_index
        sell: 6,                // 出售
        sell_fish: 7,           // 出售水族馆的鱼 p1:index
        fectch_handbook: 8,     // 领取图鉴奖励 p1:reward_seq
        up_tool: 9,             // 升级钓鱼工具 p1:tool_id
        fashion: 10,            // 幻化 p1:tool_id p2:要使用幻化id
        fashion_sell: 11,       // 出售幻化 p1:幻化id
        buy: 12,                // 购买 p1:item_seq p2:数量
        card_reward: 13,        // 渔夫卡每日奖励
        enter_map: 14,          // 设置岛屿 p1:场地类型
        set_bait: 15,           // 设置鱼饵 p1:鱼饵id
    },

    StateType: {
        succ: 1,
        escape: 2,
        off_line: 3,
    },

    FishState: {
        idle: 0,
        idle2: 1,
        idle3: 2,
        paogan: 3,
        qigan: 4,
    },

    FishAnimName: [
        "idle",
        "idle2",
        "idle3",
        "paogan",
        "qigan",
    ],

    FishAnimLoop: [
        true,
        true,
        true,
        false,
        false,
    ],

    FishAnimTime: [
        1,
        1,
        1,
        1,
        4,
    ],

    FishSkin: [
        "gan",
        "",
        "yuxian",
        "gou",
    ]
}