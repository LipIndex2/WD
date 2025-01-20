export var GMCmdConfig = {
    List: [
        { key: "GMArenaAddScore", name: "竞技场加积分", params: ["积分:50"] },
        { key: "EndBattle", name: "结算战斗", params: ["输/赢:1", "场景:1", "回合:0"] },
        { key: "additem", name: "添加道具", params: ["道具ID:40000", "数量:100"] },
        { key: "ranextstate", name: "开启活动", params: ["活动id:2075"] },
        { key: "settask", name: "一键大号", params: ["id:322",] },
        { key: "OpenView", name: "打开界面", params: ["view:DrawCardView"] },
        { key: "allHerounlock", name: "解锁全部英雄", params: [] },
        { key: "allHeroMax", name: "升级全部英雄", params: [] },
        { key: "gmsettask", name: "完成所有任务", params: [] },
        { key: "langswitch", name: "切换语言", params: ["类型(1中文2英文):1"] },
        { key: "ReadBattleFile", name: "读取存档", params: [] },
        { key: "EnterBattle", name: "进入战斗", params: ["场景Id:1"] },
        { key: "BattleDebugCollider", name: "打印LOG", params: [] },
        { key: "Guide", name: "指引", params: ["指引id:1"] },
        { key: "StopGuide", name: "停止指引", params: ["不管:1"] },
        { key: "reloadconfig", name: "热更配置", params: ["类型:0"] },
        { key: "mailtest", name: "邮件测试", params: ["类型(1普通2系统):1", "数量:1", "几秒后过期:300"] },
        { key: "OpenViewByKey", name: "打开界面", params: ["ModKey:113000"] },
        { key: "setrolelevel", name: "设置等级", params: ["角色等级:50"] },
        { key: "addchongzhi", name: "充值", params: ["钻石:60"] },
        { key: "gmmainfb", name: "挂机时间", params: ["不管-1:-1", "时间:3600"] },
        { key: "GMRALTSet", name: "失落神殿", params: ["行:1", "格:1"] },
        { key: "LoseTemple", name: "失落神殿重置", params: [] },
        { key: "mb", name: "储钱罐", params: ["累计值:300"] },
        { key: "closeGm", name: "关闭GM", params: [] },
    ],
}