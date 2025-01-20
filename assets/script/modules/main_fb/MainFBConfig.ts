
export var MainFBConfig = {
    ReqType: {
        info: 0,                // 请求信息 p:关卡id
        fetch_box: 1,           // 领取宝箱 p:宝箱seq
        fetch_time_info: 2,     // 请求挂机奖励列表
        fetch_time: 3,          // 领取挂机收益
        fetch_quick_info: 4,    // 请求快速收益列表
        fetch_quick: 5,         // 领取快速收益
        energy_buy: 6,          // 购买体力
        relive: 7,              // 复活
        pass_info: 8,           // 通关信息 p:fb_level
        rank_info: 9,           // 排行榜 p1:begin_rank
    },

    RoundRewadPos: {
        [2]: [360, 549],
        [3]: [279, 414, 549],
    }
}