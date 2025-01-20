export const HeroSkillId = {
//--------------樱桃炸弹 5-------------------
    YingTaoZhaDan: {
        ThreeBomb: 80,//樱桃修补匠朝随机方向投出<color=#036b16>{0}</color>枚炸弹
        HitZhuoshaoBingdong: 81,//樱桃修补匠攻击灼烧或冰冻的敌人，对其伤害+<color=#036b16>{0}</color>%
        BuffZhuoshao: 82,//樱桃修补匠的炸弹会使敌人灼烧<color=#036b16>{0}</color>秒，每秒造成{1}%伤害
        DamZhuoShao: 83,//樱桃修补匠造成的灼烧伤害+<color=#036b16>{0}</color>%
        AddBombRange: 84,//樱桃修补匠的炸弹爆炸范围+<color=#036b16>{0}</color>格
        AddAttack: 85,//樱桃修补匠攻击力+<color=#036b16>{0}</color>%
        ShootEnemy: 86,//樱桃修补匠每攻击<color=#036b16>{0}</color>次，随机选中{1}个敌人发射{2}枚导弹
        Skill8: 342,    //<color=#036b16>樱桃炸弹</color>每次攻击单次丢出<color=#036b16>{0}枚</color>炸弹
        Skill9: 343,    //<color=#036b16>樱桃炸弹</color>每隔<color=#036b16>{0}秒</color>，会在自己的前方<color=#036b16>2格</color>处埋下<color=#036b16>{1}颗</color>地雷，对敌人造成<color=#036b16>{2}%</color>伤害
        Skill10: 418,   //<color=#036b16>樱桃炸弹</color>灼烧累积造成伤害<color=#036b16>+{0}%</color>
    },
//-------------菜森 8-------------------
    CaiSen : {
        DoubleAtk : 101,    //菜森前后出拳，同时打身前和身后
        ZhuoShaoDam : 102,  //菜森攻击灼烧的敌人，伤害+<color=#036b16>{0}</color>%
        JiTui : 103, //菜森攻击HP<<color=#036b16>{0}</color>%的敌人，将其击退{1}格
        JiTuiEasy : 104,    //菜森击退敌人的触发血量+<color=#036b16>{0}</color>%
        QiGong : 105, //菜森每攻击<color=#036b16>{0}</color>次，发射{1}个气功波，造成{2}%伤害
        QiGongDam : 106,//菜森气功波造成的伤害+<color=#036b16>{0}</color>%
        QiGongBigger: 107, //菜森的气功波变得更大
        FourthQiGong:348,//菜森同时向前后左右发出气功波
        ZhanSha:349,//菜森对于血量小于等于{1}%的敌人，会直接将其斩杀
        JiTuiDis:421,//菜森造成的击退距离增加{0}%
    },
//-------------墓碑破坏者 14-------------------
    MuBei : {
        ChanRao : 143,  //墓碑破坏者命中敌人时，<color=#036b16>{0}</color>%几率将其缠绕{1}秒
        ChanRaoRate : 144,//墓碑破坏者攻击眩晕敌人时，敌人被缠绕几率+<color=#036b16>{0}</color>%    叠层
        ZhongDuDam : 145,//墓碑破坏者造成的中毒伤害+<color=#036b16>{0}</color>%     叠层
        DoubleAtk : 146,//墓碑破坏者攻击时连续扔出<color=#036b16>{0}</color>个鞭子
        ChanRaoInfect : 147,//墓碑破坏者使<color=#036b16>{0}</color>个敌人被缠绕时，以其为中心，周围{1}格的敌人都被缠绕
        ChanRaoRange : 148,//墓碑破坏者触发群体缠绕的范围+<color=#036b16>{0}</color>%
        ThroughAtk : 149,//墓碑破坏者的长鞭可贯穿所有敌人
        DisDamage:360,//距离墓碑破坏者的敌人越远，受到其伤害越高，最高至{0}%
        JiTui:361,//墓碑破坏者每次攻击有{0}%的几率使被攻击的敌人被击退一格，每次攻击最多击退{1}个敌人
        DoubleAtk2 : 427,//墓碑破坏者攻击时连续扔出{0}根藤蔓
    },

//--------------玉米工程师 11-------------------
    GongChengShi : {
        DaoDan : 122, //工程师攻击时<color=#DF7401>{0}</color>%几率发射{1}枚追踪导弹
        RobotAtk : 123,//工程师发射导弹时，<color=#036b16>{0}</color>%几率命令相邻{1}格的玉米机器人同时发射导弹
        BiggerBomb : 124,//工程师的导弹爆炸范围扩大至周围<color=#036b16>{0}</color>格
        AtkCount : 125,//工程师的攻击传递次数+<color=#036b16>{0}</color>
        DaoDanCount : 126,//工程师<color=#036b16>{0}</color>%几率一次性发射出{1}枚导弹
        DaoDanRate : 127,//工程师发射导弹几率+<color=#036b16>{0}</color>%
        RanShaoDan : 128,//工程师攻击时，<color=#036b16>{0}</color>%几率扔出追踪的燃烧弹，命中时对敌人造成{1}%伤害
        DaoDanDam : 328,//工程师的导弹伤害+<color=#036b16>+{0}%</color> 叠层
        DaoDanCount2 : 354,//<color=#036b16>工程师</color>每次发射<color=#036b16>{0}颗</color>导弹
        NBomb: 355,//全场的<color=#036b16>工程师</color>每释放<color=#036b16>{0}颗</color>导弹，会发射一颗核弹，对场上所有敌人造成<color=#036b16>{1}%</color>伤害，并附带<color=#036b16>{2}层</color>灼烧效果
        DaoDanFire:424 //工程师的导弹会在地上造成火焰，持续{0}秒，造成{1}%伤害
    },

    //  毁灭菇 ////
    HuiMieGu : {
        LianXuFeiXing : 94, //连续飞行x周
        TianJiaBianFu : 95, //多x个蝙蝠
        LiuXueShangXian: 96,//流血上限
        DatDef: 97,         //守护蝙蝠
        DatDefCount: 98,    //守护数量+x
        JiZhongLiuXue: 99,  //击中流血
        FiveBat: 100,       //创建5只蝙蝠保护城堡
        Skill8: 346,        //<color=#036b16>毁灭菇</color>的守护蝙蝠攻击时产生爆炸，对敌人造成<color=#036b16>{0}%</color>伤害
        Skill9: 347,        //<color=#036b16>毁灭菇</color>每隔<color=#036b16>{0}秒</color>召唤一群蝙蝠攻击敌人，对敌人造成<color=#036b16>{1}%</color>伤害
        Skill10: 420,       //<color=#036b16>毁灭菇</color>造成的流血伤害<color=#036b16>+{0}%</color>
        Skill11: 562,       //蝙蝠连续飞行x周
        Skill12: 563,       //蝙蝠x只
        Skill13: 564,       //<color=#036b16>蝙蝠菇</color>造成的流血效果层数上限<color=#036b16>+{0}</color>
        Skill14: 565,       //<color=#036b16>蝙蝠菇</color>的攻击蝙蝠击倒僵尸时后，对其周围僵尸造成<color=#036b16>{0}%</color>伤害并增加<color=#036b16>{1}层</color>流血效果
    },
    
    //--------------吸铁花 9-------------------
    XiTieHua: {
        TwoDianBo: 108,  // 磁铁花向左右两边发射电波
        HitZhuoShao: 109,// 磁铁花攻击灼烧的敌人（精英怪除外）<color=#036b16>{0}</color>%几率将其引爆
        AddYinBaoRange: 110,// 磁铁花造成的引爆范围+<color=#036b16>{0}</color>%
        HitBingDong: 111,// 磁铁花攻击冰冻的敌人，<color=#036b16>{0}</color>%几率对其造成{1}倍伤害
        FourDianBo: 112,// 磁铁花同时向四个方向发射电波
        AddBanTime: 113,// 磁铁花禁锢敌人的时间+<color=#036b16>{0}</color>秒
        MultipleDianBo: 114,// 磁铁花一次性发射<color=#036b16>{0}</color>个电波
        Skill8: 350,    //<color=#036b16>磁铁花</color>每击杀<color=#036b16>{0}个</color>禁锢状态下的敌人，会给自己增加<color=#036b16>{1}%</color>攻击力，持续到本回合结束
        Skill9: 351,    //全场的<color=#036b16>磁铁花</color>每攻击<color=#036b16>{0}次</color>，会对场上所有的敌人释放一次天雷，造成<color=#036b16>{1}%</color>伤害
        Skill10: 422,   //<color=#036b16>磁铁花</color>造成的引爆伤害<color=#036b16>+{0}%</color>
    },
    //木乃梨
    MuNaiLi:{
        LianXU: 129,    //连续喷射
        ZhongDuJiaShang: 130,       //木乃梨攻击中毒的敌人，对其伤害+<color=#036b16>{0}</color>%
        FuBaiJiaShang: 131,         //木乃梨造成的腐败伤害+<color=#036b16>{0}</color>%
        GongSu: 132,    //攻速
        ZuZou: 133,     //诅咒
        GongJiLi: 134,  //攻击力
        ZhanSha: 135,   //木乃梨的腐败气体击中HP<<color=#036b16>{0}</color>%的敌人，敌人立刻死亡
        Skill8: 356,    //<color=#036b16>木乃梨</color>每次攻击连续喷射<color=#036b16>{0}次</color>腐败气体
        Skill9: 357,    //被<color=#036b16>木乃梨</color>腐败的敌人，受到的所有伤害<color=#036b16>+{0}%</color>
        Skill10: 425,   //<color=#036b16>木乃梨</color>造成的腐败伤害增加到<color=#036b16>{0}%</color>
    },
    //--------------魅惑菇 15-------------------
    MeiHuoGu:{
        MeiHuo:150,           //魅惑菇攻击时<color=#036b16>{0}</color>%几率使周围{1}个敌人进入魅惑状态
        DamFear:151,          //魅惑菇攻击恐惧下的敌人，伤害+<color=#036b16>{0}</color>%
        MeiHuoNum:152,        //魅惑菇魅惑敌人数量+<color=#036b16>{0}</color>
        MeiHuoRate:153,       //魅惑菇释放魅惑几率+<color=#036b16>{0}</color>%
        AttackDis:154,        //魅惑菇攻击距离延长<color=#036b16>{0}</color>格
        Attack:155,           //魅惑菇攻击力+<color=#036b16>{0}</color>%
        KillFearAddAttack:156,//魅惑菇击杀恐惧下的敌人，魅惑菇攻击力+<color=#036b16>{0}</color>%，持续{1}秒
        AddMeiHuoTime:329,    //魅惑菇魅惑时间+<color=#036b16>+{0}</color>秒
        Skill9:362,           //被<color=#036b16>魅惑菇</color>魅惑的敌人，受到的所有伤害<color=#036b16>+{0}%</color>
        Skill10:363,          //<color=#036b16>魅惑菇</color>魅惑敌人时，会使其周围的<color=#036b16>{0}个</color>敌人也受到魅惑（不会再次触发对周围敌人的魅惑
        Skill11:428,            //<color=#036b16>魅惑菇</color>的魅惑时间<color=#036b16>+{0}秒</color>
    },
    //倭瓜
    WoGua:{
        JianTa:297,         //倭瓜践踏伤害+<color=#036b16>{0}</color>%，并使敌人减速{1}秒
        KongJuJiaShang:298, //倭瓜攻击恐惧下的敌人，伤害+<color=#036b16>{0}</color>%
        JianTaFanWei:299,   //倭瓜践踏范围+<color=#036b16>{0}</color>格
        GongJiLi:300,       //倭瓜攻击力+<color=#036b16>{0}</color>%
        SiWangJiaShang:301, //战斗开始时，每有<color=#036b16>{0}</color>个敌人在倭瓜周围死亡，倭瓜攻击力+{1}%，效果持续到本回合结束
        JianSu:302,         //倭瓜造成的减速效果+<color=#036b16>{0}</color>%
        JiShaJiaGongSu:303, //倭瓜每击杀<color=#036b16>{0}</color>个敌人，攻击速度+{1}%，持续1秒
        Skill8:396,         //<color=#036b16>倭瓜</color>每攻击<color=#036b16>{0}次</color>会对前后左右发射一道冲击波，造成<color=#036b16>{1}%</color>的伤害
        Skill9:397,         //<color=#036b16>倭瓜</color>的冲击波会造成地裂，眩晕敌人<color=#036b16>{0}秒</color>
        Skill10:445,        //<color=#036b16>倭瓜</color>造成的减速效果<color=#036b16>+{0}%</color>
    },

    //睡莲
    ShuiLian:{
        HaiLang:164,            //睡莲攻击时，<color=#036b16>{0}</color>%几率召唤一个向前的海浪，海浪最多击退<color=#036b16>{1}</color>个敌人
        JiTuiBingDong:165,      //睡莲的攻击会击退冰冻的敌人
        JiaJiTuiShuLinag:166,   //睡莲的海浪击退数量+<color=#036b16>{0}</color>
        JiaJiTuiGaiLv:167,      //睡莲召唤海浪的几率+<color=#036b16>{0}</color>%
        JiaJiTuiGaiLv2:168,     //睡莲周围<color=#036b16>{0}</color>格每有<color=#036b16>{1}</color>个冰冻菇或冰霜，发射海浪几率+<color=#036b16>{2}</color>%
        JiaGongJi:169,          //睡莲攻击力+<color=#036b16>{0}</color>%
        JuFeng:170,             //全场睡莲每累积杀死<color=#036b16>{0}</color>个敌人，召唤<color=#036b16>{1}</color>个水飓风
        Skill8:366,             //<color=#036b16>睡莲</color>的海浪会对沿途敌人造成<color=#036b16>{0}%</color>的伤害
        Skill9:367,             //<color=#036b16>睡莲</color>同时攻击前后左右的敌人
        Skill10:430,            //<color=#036b16>睡莲</color>的水飓风造成的伤害<color=#036b16>+{0}%</color>
    },
    //--------------莲藕麦克风 19-------------------
    LianOuMaiKeFeng:{
        MultipleNum:178,    //莲藕麦克风的龙卷风变为<color=#036b16>{0}</color>个
        HitZhuoShao:179,    //莲藕麦克风命中灼烧敌人，额外+<color=#036b16>{0}</color>%伤害，并刷新其灼烧效果
        AddDis:180,    //莲藕麦克风的龙卷风最远距离变为<color=#036b16>{0}</color>格
        AttackSpeed:181,    //莲藕麦克风攻击速度+<color=#036b16>{0}</color>%
        RuoHua:182,    //莲藕麦克风攻击时<color=#036b16>{0}</color>%几率发射音符，使命中的敌人进入弱化状态（弱化：撞击城堡伤害-<color=#036b16>{1}</color>%）
        Attack:183,    //莲藕麦克风攻击力+<color=#036b16>{0}</color>%
        JuFeng:184,    //莲藕麦克风龙卷风变为闪电飓风，额外造成<color=#036b16>{0}</color>%伤害，<color=#036b16>{1}</color>%几率使敌人眩晕<color=#036b16>{2}</color>秒
        AddXuanYunTime:326,//	莲藕麦克风眩晕时间+<color=#036b16>+{0}</color>秒
        Skill9: 370,        //<color=#036b16>莲藕麦克风</color>每次释放的龙卷风数量变为<color=#036b16>{0}个</color>
        Skill10: 371,       //<color=#036b16>莲藕麦克风</color>的龙卷风有<color=#036b16>{0}%</color>的概率击退敌人一格
        Skill11: 432,       //<color=#036b16>莲藕麦克风</color>命中灼烧的敌人时，伤害增加到<color=#036b16>{0}%</color>
    },
    //--------------荆棘草 18-------------------
    JingJiCao:{
        LianXu:171,   //荆棘草的攻击连续出现<color=#036b16>{0}</color>次
        XueBao:172,   //荆棘草攻击流血的敌人,<color=#036b16>{0}</color>%几率使其身上出现<color=#036b16>{1}</color>次血爆，造成<color=#036b16>{2}</color>%伤害且流血层数+<color=#036b16>{3}</color>
        JuLi:173,   //荆棘草出现尖刺的距离+<color=#036b16>{0}</color>格 固定为1格
        GongSu:174,   //荆棘草攻击速度+<color=#036b16>{0}</color>%
        ShenChang:175,   //荆棘草伸出的尖刺更长，伤害+<color=#036b16>{0}</color>%，<color=#036b16>{1}</color>%几率使敌人禁锢<color=#036b16>{2}</color>秒
        GongJiLi:176,   //荆棘草攻击力+<color=#036b16>{0}</color>%
        FourDirect:177,   //荆棘草朝前后左右发出荆棘
        Skill8:368,     //<color=#036b16>荆棘草</color>的禁锢时间增加<color=#036b16>{0}秒</color>
        Skill9:369,     //<color=#036b16>荆棘草</color>攻击<color=#036b16>HP<{0}%</color>的敌人时，必定重击
        Skill10:431,    //<color=#036b16>荆棘草</color>的攻击连续出现<color=#036b16>{0}次</color>

        Skill11:572,    //<color=#036b16>荆棘草</color>攻击流血的僵尸,<color=#036b16>{0}%</color>几率造成<color=#036b16>{1}次</color>血液沸腾，造成<color=#036b16>{2}%</color>伤害且流血层数<color=#036b16>+{3}</color>
        Skill12:573,    //<color=#036b16>荆棘草</color>的伤害<color=#036b16>+{0}%</color>，<color=#036b16>{1}%</color>几率禁锢僵尸<color=#036b16>{2}秒</color>
        Skill13:574,    //<color=#036b16>荆棘草</color>攻击<color=#036b16>HP<{0}%</color>的僵尸时，必定重击
        Skill14:575,    //<color=#036b16>荆棘草</color>连续释放<color=#036b16>{0}次</color>地刺
    },
     //--------------幽灵辣椒 20-------------------
     YouLingLaJiao:{
        Bomb:185,	     //幽灵辣椒的泡泡飞行到终点时产生爆炸，对周围敌人造成<color=#036b16>{0}%</color>伤害，并使敌人中毒
        HitXuanYun:186,	     //幽灵辣椒攻击眩晕的敌人，伤害<color=#036b16>+{0}%</color>
        AddDis:187,	     //幽灵辣椒的泡泡最远飞行距离增加<color=#036b16>{0}</color>格，且攻击力<color=#036b16>+{1}%</color>
        AddAttack:188,	     //幽灵辣椒攻击力<color=#036b16>+{0}%</color>
        BombTenShape:189,	     //幽灵辣椒的泡泡爆炸时，爆炸形状变为十字型
        AddAttackSpeed:190,	     //幽灵辣椒攻击速度<color=#036b16>+{0}%</color>
        BombMiShape:191,	     //幽灵辣椒的泡泡爆炸时，爆炸形状变为米字形，且爆炸伤害<color=#036b16>+{0}%</color>
        Skill8:372,     //<color=#036b16>幽灵辣椒</color>的攻击有<color=#036b16>{0}%</color>的概率恐惧敌人
        Skill9:373,     //<color=#036b16>幽灵辣椒</color>的攻击距离变为无限远，伤害增加<color=#036b16>{0}%</color>，且每伤害到一次敌人就触发一次爆炸
        Skill10:433,    //<color=#036b16>幽灵辣椒</color>对眩晕的敌人造成的伤害<color=#036b16>+{0}%</color>
    },
     //--------------海带恶魔 22-------------------
     HaiDaiEMo:{
        ChanRao:199,      	//海带恶魔攻击时<color=#036b16>{0}%</color>几率发射一道死亡缠绕，命中敌人后使其恐惧（恐惧时，敌人四处逃走）
        KangFen:200,      	//敌人恐惧时死亡，海带恶魔亢奋<color=#036b16>{0}</color>秒（亢奋：增加<color=#036b16>{1}%</color>攻速，攻击同时放出<color=#036b16>{2}</color>道烈焰）
        DamZhuoShaoBingDong:201,      	//海带恶魔亢奋时攻击灼烧敌人，伤害<color=#036b16>+{0}%</color>，攻击冰冻敌人，伤害<color=#036b16>+{1}%</color>
        AddKongJuTime:202,      	//海带恶魔的死亡缠绕造成的恐惧时间<color=#036b16>+{0}</color>秒
        AddDam:203,      	//海带恶魔造成的灼烧伤害<color=#036b16>+{0}%</color>
        ChanRaoChuanDi:204,      	//海带恶魔的死亡缠绕传递次数<color=#036b16>+{0}</color>
        Ray:205,      	//海带恶魔每击杀<color=#036b16>{0}</color>个敌人，发射<color=#036b16>{1}</color>次死亡射线，死亡射线造成<color=#036b16>{2}</color>——<color=#036b16>{3}</color>倍伤害
        AddKangFenTime:331, //海带恶魔亢奋时间+<color=#036b16>+{0}</color>秒
        Skill9: 376,    //被<color=#036b16>海带恶魔</color>恐惧的敌人，移速降低<color=#036b16>{0}%</color>
        Skill10: 377,   //<color=#036b16>海带恶魔</color>每次对<color=#036b16>{0}个</color>敌人发射死亡射线
        Skill11: 435,   //<color=#036b16>海带恶魔</color>死亡缠绕的恐惧几率增加<color=#036b16>{0}%</color>
        Skill12: 522,   //<color=#036b16>海带恶魔</color>穿透数量<color=#036b16>+{0}</color>
    },
     //--------------蚕豆小丑 24-------------------
     CDXiaoChou:{
        BombFeiDao : 213,  //蚕豆小丑每攻击<color=#036b16>{0}</color>次，向周围抛出环形飞刀
        JiTui : 214,        //蚕豆小丑攻击禁锢的敌人，<color=#036b16>{0}%</color>几率将其击退<color=#036b16>{1}</color>格 叠层
        YiShangDam : 215,   //蚕豆小丑易伤加成的伤害提升至<color=#036b16>{0}%</color>   叠层
        YiShangNum : 216,     //蚕豆小丑造成的易伤层数上限<color=#036b16>+{0}</color>    叠层
        BombPoke : 217,     //蚕豆小丑击杀易伤状态下的敌人时，在被击杀敌人周围散出扑克牌
        AtkSpeed : 218,     //蚕豆小丑攻击速度<color=#036b16>+{0}%</color>  叠层
        KongJuBomb : 219,     //每隔一段时间，蚕豆小丑开启惊吓盒子，恐惧周围敌人<color=#036b16>{0}</color>秒
        FeiDaoCount : 380,//<color=#036b16>蚕豆小丑</color>连续释放<color=#036b16>{0}次</color>环形飞刀
        YiShangDefOff : 381,//处于<color=#036b16>蚕豆小丑</color>造成的易伤状态下的敌人，其所有抗性降低<color=#036b16>{0}%</color>
        FeiDaoDam : 437,//蚕豆小丑的环形飞刀造成的伤害+{0}%
    },
    //--------------忧郁蘑菇 25-------------------
    YYMoGu:{
        DuWu:220,//忧郁蘑菇的迷雾变成毒雾，使雾中的敌人中毒，额外造成<color=#036b16>{0}%</color>伤害
        AtkScope:221,//忧郁蘑菇的雾的范围扩大<color=#036b16>{0}%</color>
        ZhongDuDam:222,//忧郁蘑菇造成的中毒伤害<color=#036b16>+{0}%</color>  叠层
        BuffDam:223,//处于异常状态的敌人进入忧郁蘑菇的迷雾，异常状态的伤害<color=#036b16>+{0}%</color>
        AddAtk:224,//忧郁蘑菇攻击力<color=#036b16>+{0}%</color>  叠层
        DamAdd:225,//进入忧郁蘑菇雾中的敌人，受到伤害<color=#036b16>+{0}%</color>    叠层
        KongJu:226,//忧郁蘑菇放出致幻雾，<color=#036b16>{0}%</color>几率使进入雾中的敌人恐惧<color=#036b16>{1}</color>秒
        BuffTime:332,//忧郁蘑菇异常状态时间+<color=#036b16>+{0}</color>秒   叠层
        AllZhongDu : 382,//<color=#036b16>忧郁蘑菇</color>每造成<color=#036b16>{0}次</color>中毒，就为全场敌人附加一次中毒（本次附加不再次计数）
        DefOffset : 383,//<color=#036b16>忧郁蘑菇</color>会降低雾气范围内敌人所有抗性<color=#036b16>{0}%</color>
        ZhongDuTime : 438,//忧郁蘑菇造成的中毒时间+{0}秒
    },
    //-----------------咖啡豆僵尸 28--------------------
    KFDou:{
        Sleep:241,      //咖啡豆攻击力+X%，但每隔{1}秒会进入{2}秒沉睡
        Critical:242,   //咖啡豆在攻击有流血或者腐败状态的敌人时，有X%几率造成重击伤害
        SleepTime:243,  //咖啡豆沉睡时间-X秒        叠层
        AddAtk:244,     //咖啡豆攻击力+X%           叠层
        Sword:245,      //咖啡豆每X秒向前方投掷{1}把道士剑，命中时对敌人造成{2}%伤害并定身{3}秒
        CriticalRate:246,   //咖啡豆暴击率+X%       叠层
        ShiXue:247,     //战斗开始时，咖啡豆累计击杀X个敌人后进入嗜血状态（攻击力+{1}%），持续到本回合结束
        JinGuTime:388,//咖啡豆禁锢敌人的时间增加{0}秒  叠层
        TrackSword:389,//咖啡豆发射的咖啡豆可以追踪敌人
        CriticalDam : 441,//咖啡豆的重击伤害+{0}%
    },
    //-------------大丽花 27------------------------
    DaLiHua : {
        FenLie:234,  //大丽花击杀敌人后，<color=#036b16>{0}%</color>几率从敌人位置出现<color=#036b16>{1}</color>发分裂箭，随机追踪一个敌人
        AddAtk:235,  //战斗开始时，大丽花每击杀<color=#036b16>{0}</color>个恐惧下的敌人，其攻击力增加<color=#036b16>{1}%</color>，直至本次战斗结束
        AtkCount:236,  //大丽花射出并排的<color=#036b16>{0}</color>支箭
        FenLieRate:237,  //大丽花分裂箭触发的概率<color=#036b16>+{0}%</color>    叠层
        FenLieCount:238,  //大丽花触发分裂箭时，额外多发射<color=#036b16>{0}</color>发
        AtkSpeed:239,  //大丽花攻击速度<color=#036b16>+{0}%</color>    叠层
        AtkBomb:240,  //大丽花普攻和分裂箭附带爆炸效果，命中时对敌人周围<color=#036b16>{0}</color>格造成爆炸伤害
        ShenYing:386,    //<color=#036b16>大丽花</color>攻击时，<color=#036b16>{0}%</color>几率发射一发穿透所有敌人的神影箭，造成<color=#036b16>{1}%</color>伤害
        TimeFenLie:387,  //<color=#036b16>大丽花</color>每隔<color=#036b16>{0}秒</color>，发出<color=#036b16>{1}发</color>分裂水晶追踪敌人
        AddAtk2 : 440,//大丽花击杀恐惧敌人时增加的攻击力提高到{0}%
    },
    //-------------棱镜草(艾米) 29------------------------
    LingJing:{
        FeiDan:400,//艾米攻击时，{0}%概率发出{1}枚圣光飞弹自动追踪敌人，对命中的敌人造成{2}%伤害
        ZhongDuDam:401,//艾米攻击中毒状态下的敌人，伤害加{0}%
        FeiDanBomb:402,//艾米的圣光飞弹命中敌人时产生一次圣光爆炸，对附近的敌人造成{0}%伤害
        FeiDanCount:403,//艾米发射圣光飞弹的数量+{0}
        BombRuoHua:404,//艾米圣光爆炸命中敌人时，{0}%几率使敌人进入弱化状态（弱化，撞击城堡伤害-50%）
        AtkAdd:405,//艾米攻击力+{0}%    叠层
        Ray:406,//艾米每攻击10次，释放一次圣光射线，贯穿路径上所有敌人，造成{0}伤害
        FeiDanRate : 447,//艾米发射圣光飞弹的几率增加+{0}%
        FeiDanBombDam : 448,//棱镜草的圣光爆炸造成的伤害增加{0}%，并使敌人眩晕{1}秒
        GuangJian : 449,//棱镜草每发射{0}枚圣光飞弹，就会召唤光之箭，对所有敌人造成{1}%伤害
        AtkSpeed : 460,//棱镜草的攻击速度+{0}%
    },
    //--------------火炬木 31-----------------------
    HuoJu:{
        BuffPower:262,  //处于火炬木增益范围内的英雄，获得增益变为<color=#036b16>{0}%</color>
        BuffScope:263,  //火炬木增益有效范围扩大至周围<color=#036b16>{0}格</color>
        BuffAtk:264,  //火炬木为友军提供的攻击力<color=#036b16>+{0}%</color>  叠层
        DamAdd:265,  //进入火炬木增益区域内的敌人，受到的伤害<color=#036b16>+{0}%</color>  叠层
        BuffSpeed:266,  //火炬木为友军提供的攻速<color=#036b16>+{0}%</color>  叠层
        HpRecover:267,  //本回合结束时，场上每有<color=#036b16>{0}个</color>火炬木，为后宅恢复<color=#036b16>{1}点</color>血量
        YiShangBuff:268,  //火炬木长满尖刺，经过火炬木的敌人进入易伤状态，持续<color=#036b16>{0}秒</color>
        SpeedDown : 392,//进入火炬木范围内的敌人，会被减速{0}%  叠层
        NumGain : 393,//场上每存在一个<color=#036b16>火炬木</color>，其增益就提高<color=#036b16>{0}%</color>
        BuffPower2 : 443, //<color=#036b16>火炬木</color>的增益效果变为<color=#036b16>{0}%</color>
    },
    //--------------辣比 33-------------------
    Labi : {
        TowFire : 276,      //辣比向前方同时发射出2发火球
        FuBaiDam : 277, //辣比攻击腐败状态下的敌人，伤害+<color=#DF7401>{0}</color>%
        HitBaoZha : 278,    //辣比的火球命中敌人后产生爆炸，对附近的敌人造成伤害
        ZhuoShaoDam : 279,  //辣比造成的灼烧伤害+<color=#DF7401>{0}</color>%
        ThreeFire : 280,//辣比同时发射出扇形范围的3发火球
        GongSU : 281,//辣比攻击速度+<color=#DF7401>{0}</color>%
        BigFire : 282,//辣比攻击时，<color=#DF7401>{0}</color>%几率向前吐出{1}个巨型火球，巨型火球能穿透路径上所有敌人
        ZhuoShaoTime: 394,//辣比造成的灼烧时间+{0}秒		叠层
        PenHuo:395,//辣比每攻击{0}次，就会对前方喷射一次火焰，对敌人造成{1}%伤害，并附加灼烧
        FireCount : 444,//辣比同时向前方发射出{0}颗火球
    },
    //-------------------香蕉船长 35------------
    XJChanZhang: {
        KongJu:290,//香蕉船长的香蕉命中敌人时，{0}%几率使其恐惧{1}秒，并对其额外造成{2}%伤害
        JinGuExtend:291,//香蕉船长攻击禁锢状态下的敌人，其被禁锢时长<color=#036b16>+{0}秒</color>
        DoubleAtk:292,//香蕉船长向左右两边同时投掷香蕉
        KongJuRate:293,//香蕉船长使敌人恐惧的几率<color=#036b16>+{0}%</color>    叠层
        FourthAtk:294,//香蕉船长同时向前后左右投掷香蕉
        KongJuTime:295,//香蕉船长造成的恐惧时长<color=#036b16>+{0}秒</color>     叠层
        HitBomb:296,//香蕉船长的香蕉命中敌人时，<color=#036b16>{0}%</color>几率造成一次恶灵爆炸，对附近的敌人造成<color=#036b16>{1}%</color>伤害
        ChuanMao:398,//被香蕉船长恐惧的敌人死亡时，有{0}%几率挥舞船锚攻击自身附近的敌人，造成{1}%伤害
        BombKongJu:399,//香蕉船长的爆炸香蕉可以使敌人恐惧
        KongJuTime2 : 446,//香蕉船长的恐惧时间+{0}秒
        AtkSpeed : 463,//香蕉船长的攻击速度+{0}%
        AddAtk : 464,//香蕉船长的攻击力+{0}%
    },

    //-------------------南瓜马车 26------------
    NanGua:{
        ZhaoHuanJuFeng:227,     //南瓜马车攻击时<color=#036b16>{0}%</color>几率召唤出火焰飓风
        YanChangXuanYun:228,    //南瓜马车攻击眩晕的敌人，其眩晕时长延长<color=#036b16>{0}秒</color>
        JiaJuFeng:229,          //南瓜马车每次召唤火焰飓风数量变为<color=#036b16>{0}个</color>
        JiaZuoShaoShangHai:230, //南瓜马车造成的灼烧伤害<color=#036b16>+{0}%</color>
        JiaJuFengGaiLv:231,     //南瓜马车召唤火焰飓风的概率<color=#036b16>+{0}%</color>
        JiaJuFengShiJian:232,   //南瓜马车火焰飓风持续的时间<color=#036b16>+{0}秒</color>
        GongJiQuanBu:233,       //所有南瓜马车的火焰飓风每攻击<color=#036b16>{0}次</color>，对所有怪物造成<color=#036b16>{1}%</color>伤害
        Skill8:384,             //<color=#036b16>南瓜马车</color>的火焰范围扩大<color=#036b16>{0}%</color>
        Skill9:385,             //<color=#036b16>南瓜马车</color>每次攻击时有<color=#036b16>{0}%</color>的几率召唤一次火雨，对敌人造成<color=#036b16>{1}%</color>伤害，并附加<color=#036b16>{2}层</color>灼烧
        Skill10:439,            //<color=#036b16>南瓜马车</color>的火焰飓风的伤害<color=#036b16>+{0}%</color>
    },

    //-------------------葡萄球 34------------
    PuTaoQiu:{
        Skill1:283,             //<color=#036b16>葡萄弹</color>连续喷射<color=#036b16>{0}次</color>毒气     *
        Skill2:284,             //<color=#036b16>葡萄弹</color>攻击禁锢状态下的敌人，伤害<color=#036b16>+{0}%</color>   *
        Skill3:285,             //<color=#036b16>葡萄弹</color>喷射的毒气长度<color=#036b16>+{0}格</color>  *
        Skill4:286,             //<color=#036b16>葡萄弹</color>造成的中毒伤害<color=#036b16>+{0}%</color>   *
        Skill5:287,             //<color=#036b16>葡萄弹</color>击杀敌人后，留下一滩<color=#036b16>葡萄弹</color>    *
        SKill6:288,             //<color=#036b16>葡萄弹</color>攻击力<color=#036b16>+{0}%</color>
        Skill7:289,             //<color=#036b16>葡萄弹</color>的毒气命中HP<<color=#036b16>{0}%</color>的敌人时，敌人立即死亡   *
        Skill8:450,             //<color=#036b16>葡萄弹</color>的重击率提高<color=#036b16>{0}%</color>
        Skill9:451,             //<color=#036b16>葡萄弹</color>连续喷射<color=#036b16>{0}次</color>毒气
        Skill10:452,            //<color=#036b16>葡萄弹</color>造成的中毒会传染给周围一格的敌人
    },

    //-------------------斯巴达竹 32------------
    SiBaDaZhu:{
        Skill1:269,             //<color=#036b16>斯巴达竹</color>同时掷出<color=#036b16>{0}把</color>幻影竹     *
        Skill2:270,             //<color=#036b16>斯巴达竹</color>攻击禁锢状态下的敌人，伤害<color=#036b16>+{0}%</color>
        Skill3:271,             //<color=#036b16>斯巴达竹</color>命中敌人时，使其进入流血状态<color=#036b16>{0}秒</color>，每秒造成<color=#036b16>{1}%</color>伤害  *
        Skill4:272,             //<color=#036b16>斯巴达竹</color>造成的流血伤害<color=#036b16>+{0}%</color>     *
        Skill5:273,             //<color=#036b16>斯巴达竹</color>的幻影竹伤害范围<color=#036b16>+{0}%</color>
        SKill6:274,             //<color=#036b16>斯巴达竹</color>攻击力<color=#036b16>+{0}%</color>     *
        Skill7:275,             //每隔一段时间，<color=#036b16>斯巴达竹</color>向四周掷出幻影竹,造成<color=#036b16>{0}%</color>伤害
        Skill8:456,             //<color=#036b16>斯巴达竹</color>对禁锢敌人造成的伤害增加到<color=#036b16>{0}%</color>
        Skill9:457,             //<color=#036b16>斯巴达竹</color>至多投出<color=#036b16>{0}个</color>幻影竹
        Skill10:458,            //<color=#036b16>斯巴达竹</color>攻击时有<color=#036b16>{0}%</color>的概率对前方扇形范围的敌人造成<color=#036b16>{0}%</color>的伤害
    },

    //-------------------玫瑰法师 37------------
    MeiGui:{
        Skill1:407,             //<color=#036b16>玫瑰法师</color>命中敌人时，使其进入腐败状态<color=#036b16>{0}秒</color>，每秒造成<color=#036b16>{1}%</color>伤害  *
        Skill2:408,             //<color=#036b16>玫瑰法师</color>攻击中毒状态下的敌人，<color=#036b16>{0}%</color>几率造成重击伤害
        Skill3:409,             //<color=#036b16>玫瑰法师</color>造成的腐败伤害<color=#036b16>+{0}%</color>
        Skill4:410,             //<color=#036b16>玫瑰法师</color>攻击溅射范围<color=#036b16>+{0}%</color>   *
        Skill5:411,             //<color=#036b16>玫瑰法师</color>击杀敌人时，<color=#036b16>{0}%</color>几率在其死亡位置出现一堆玫瑰花瓣，对附近敌人每秒造成<color=#036b16>{1}%</color>伤害，持续<color=#036b16>{2}秒</color> *
        SKill6:412,             //<color=#036b16>玫瑰法师</color>造成的腐败时长<color=#036b16>+{0}秒</color>
        Skill7:413,             //<color=#036b16>玫瑰法师</color>每击杀<color=#036b16>{0}个</color>敌人，身边出现<color=#036b16>{0}只</color>守护玫瑰   *
        Skill8:453,             //<color=#036b16>玫瑰法师</color>造成的腐败伤害增加到<color=#036b16>{0}%</color>
        Skill9:454,             //<color=#036b16>玫瑰法师</color>的攻击有<color=#036b16>{0}%</color>的概率缠绕敌人
        Skill10:455,            //全场的<color=#036b16>玫瑰法师</color>每攻击<color=#036b16>{0}次</color>，就会降下玫瑰花雨，对所有敌人造成<color=#036b16>{1}%</color>伤害，并使其易伤<color=#036b16>{2}秒</color>
    },

    //-------------------铁锤兰 38------------
    TieChuiLan:{
        Skill1:465,             //<color=#036b16>铁锤兰</color>每攻击<color=#036b16>{0}次</color>，下一次攻击会使用圣光之力，对僵尸造成<color=#036b16>{1}%</color>伤害，并眩晕僵尸<color=#036b16>{2}秒</color>
        Skill2:466,             //<color=#036b16>铁锤兰</color>对流血的僵尸伤害<color=#036b16>+{0}%</color>
        Skill3:467,             //<color=#036b16>铁锤兰</color>的圣光之力造成的眩晕，持续时间<color=#036b16>+{0}秒</color>
        Skill4:468,             //<color=#036b16>铁锤兰</color>的圣光之力造成的伤害<color=#036b16>+{0}%</color>
        Skill5:469,             //<color=#036b16>铁锤兰</color>会在每回合开始时，为我方随机<color=#036b16>{0}个</color>英雄释放光明祝福，受到祝福的英雄攻速<color=#036b16>+{1}%</color>，持续到回合结束
        SKill6:470,             //<color=#036b16>铁锤兰</color>的攻击力<color=#036b16>+{0}%</color>
        Skill7:471,             //全场的<color=#036b16>铁锤兰</color>每累计攻击<color=#036b16>{0}次</color>，释放一次圣光大审判，对所有僵尸造成<color=#036b16>{1}%</color>伤害
        Skill8:472,             //<color=#036b16>铁锤兰</color>的攻击速度<color=#036b16>+{0}%</color>
        Skill9:473,             //<color=#036b16>铁锤兰</color>的攻击范围<color=#036b16>+{0}%</color>
        Skill10:474,            //<color=#036b16>铁锤兰</color>的攻速每增加<color=#036b16>{0}%</color>，伤害增加<color=#036b16>{1}%</color>
        Skill11:475,            //<color=#036b16>铁锤兰</color>的圣光大审判会斩杀<color=#036b16>HP<{0}%</color>以下的僵尸
    },

    //-------------------闪电芦苇 39------------
    LuWei:{
        Skill1:476,         //<color=#036b16>闪电芦苇</color>每次攻击最多射出<color=#036b16>{0}道</color>闪电
        Skill2:477,         //<color=#036b16>闪电芦苇</color>的闪电对于冰冻状态下的僵尸伤害<color=#036b16>+{0}%</color>，并且可以传导<color=#036b16>{1}次</color>
        Skill3:478,         //<color=#036b16>闪电芦苇</color>的攻击距离<color=#036b16>+{0}%</color>
        Skill4:479,         //<color=#036b16>闪电芦苇</color>攻速<color=#036b16>+{0}%</color>
        Skill5:480,         //<color=#036b16>闪电芦苇</color>攻击时，<color=#036b16>{0}%</color>几率发射一个会自动返回的球状闪电，造成<color=#036b16>{1}%</color>伤害
        Skill6:481,         //<color=#036b16>闪电芦苇</color>攻击力<color=#036b16>+{0}%</color>
        Skill7:482,         //<color=#036b16>闪电芦苇</color>击杀<color=#036b16>{0}个</color>僵尸后，发出一道巨型闪电，造成<color=#036b16>{1}%</color>伤害，最多传导<color=#036b16>{2}%</color>次
        Skill8:483,         //<color=#036b16>闪电芦苇</color>的重击率<color=#036b16>+{0}%</color>
        Skill9:484,         //<color=#036b16>闪电芦苇</color>的闪电有<color=#036b16>{0}%</color>的概率禁锢僵尸
        Skill10:485,        //<color=#036b16>闪电芦苇</color>至多发出<color=#036b16>{0}%</color>道闪电
    },

    //-------------------霸王榴莲 40------------
    LiuLian:{
        Skill1:486,         //回合开始时，<color=#036b16>霸王榴莲</color>会召唤榴莲风暴，持续对所有僵尸造成攻击力<color=#036b16>{0}%</color>伤害
        Skill2:487,         //<color=#036b16>霸王榴莲</color>对眩晕的僵尸有<color=#036b16>{0}%</color>几率造成<color=#036b16>{1}%</color>伤害
        Skill3:488,         //场上每有一只<color=#036b16>霸王榴莲</color>，榴莲风暴伤害<color=#036b16>+{0}%</color>
        Skill4:489,         //<color=#036b16>霸王榴莲</color>身上的刺的大小<color=#036b16>+{0}%</color>
        Skill5:490,         //<color=#036b16>霸王榴莲</color>的榴莲风暴有<color=#036b16>{0}%</color>几率使僵尸减速<color=#036b16>{1}秒</color>
        Skill6:491,         //<color=#036b16>霸王榴莲</color>的攻击力<color=#036b16>+{0}%</color>
        Skill7:492,         //<color=#036b16>霸王榴莲</color>的沙尘暴有<color=#036b16>{0}%</color>几率禁锢僵尸<color=#036b16>{1}秒</color>
        Skill8:493,         //<color=#036b16>霸王榴莲</color>攻速<color=#036b16>+{0}%</color>
        Skill9:494,         //<color=#036b16>霸王榴莲</color>的重击率<color=#036b16>+{0}%</color>
        Skill10:495,        //<color=#036b16>霸王榴莲</color>身上的刺触碰到僵尸时，<color=#036b16>{0}%</color>几率使僵尸易伤
        Skill11:496,        //被<color=#036b16>霸王榴莲</color>禁锢的僵尸死亡时，在死亡的僵尸附近散射出针刺，造成<color=#036b16>{0}%</color>伤害
    },

    //-------------------地狱火龙果 41------------
    HuoLongGuo:{
        Skill1:497,         //<color=#036b16>地狱火龙果</color>攻击时随机朝<color=#036b16>{0}个</color>僵尸发射火球     *
        Skill2:498,         //<color=#036b16>地狱火龙果</color>造成的的地狱烈火燃烧时间<color=#036b16>+{0}秒</color>    *
        Skill3:499,         //<color=#036b16>地狱火龙果</color>攻击时，<color=#036b16>{0}%</color>几率释放地狱罡风，地狱罡风会延长火的距离和范围 *
        Skill4:500,         //<color=#036b16>地狱火龙果</color>对恐惧的僵尸伤害<color=#036b16>+{0}%</color>     *
        Skill5:501,         //<color=#036b16>地狱火龙果</color>的地狱罡风有<color=#036b16>{0}%</color>几率击退身前至多<color=#036b16>{1}个</color>僵尸 *
        Skill6:502,         //<color=#036b16>地狱火龙果</color>攻击力<color=#036b16>+{0}%</color> *
        Skill7:503,         //<color=#036b16>地狱火龙果</color>每隔<color=#036b16>{0}秒</color>释放一次爆裂魔法，造成<color=#036b16>{1}%</color>伤害。爆裂魔法触碰到地上的火焰时，会出现火焰风暴，持续<color=#036b16>{2}秒</color> *
        Skill8:504,         //<color=#036b16>地狱火龙果</color>攻速<color=#036b16>+{0}%</color> *
        Skill9:505,         //<color=#036b16>地狱火龙果</color>释放地狱罡风的几率提高<color=#036b16>{0}%</color> *
        Skill10:506,        //<color=#036b16>地狱火龙果</color>的地狱罡风吹到火焰时，<color=#036b16>{0}%</color>几率将地狱烈火升级为复仇烈焰，造成的伤害提高<color=#036b16>{1}%</color>
        Skill11:507,        //爆裂魔咒触碰到复仇烈焰时，火焰风暴变为复仇飓风，每秒造成<color=#036b16>{0}%</color>伤害，其持续时间增加<color=#036b16>{1}秒</color>
    },
    //-------------------大嘴花 43------------
    DaZuiHua:{
        Skill1:248,         //<color=#036b16>大嘴花</color>攻击时，<color=#036b16>{0}%</color>几率直接吞食掉僵尸（BOSS除外），吞食僵尸后进入吞咽状态
        Skill2:249,         //<color=#036b16>大嘴花</color>吞咽到灼烧的僵尸将其立即向前方吐出，穿透路径上所有僵尸，造成<color=#036b16>{0}%</color>伤害
        Skill3:250,         //<color=#036b16>大嘴花</color>吞咽上限<color=#036b16>+{0}</color>
        Skill4:251,         //<color=#036b16>大嘴花</color>吞咽几率<color=#036b16>+{0}%</color>
        Skill5:252,         //<color=#036b16>大嘴花</color>吞咽时间<color=#036b16>-{0}秒</color>，对不可吞食的僵尸触发吞食时，对其造成<color=#036b16>{1}%</color>伤害
        Skill6:253,         //<color=#036b16>大嘴花</color>攻击力<color=#036b16>+{0}%</color>
        Skill7:254,         //<color=#036b16>大嘴花</color>吞咽上限再<color=#036b16>+{0}</color>
        Skill8:518,         //<color=#036b16>大嘴花</color>吞咽状态的时间<color=#036b16>-{0}秒</color>
        Skill9:519,         //<color=#036b16>大嘴花</color>吞到异常状态的僵尸将其立即向前方吐出，穿透路径上所有僵尸，造成<color=#036b16>{0}%</color>伤害
        Skill10:520,        //<color=#036b16>大嘴花</color>每次吞食有概率吞食周围的僵尸，至多一次吞食<color=#036b16>{0}</color>只
    }
}