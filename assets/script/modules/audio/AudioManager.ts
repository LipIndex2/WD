
import { AudioClip, AudioSource, _decorator, game } from "cc";
import { Debugger, LogError } from "core/Debugger";
import { SingletonCom } from "core/SingletonCom";
import * as fgui from "fairygui-cc";
import { ResManager } from "manager/ResManager";
import { ROLE_SETTING_TYPE } from "modules/common/CommonEnum";
import { CommonEvent } from "modules/common/CommonEvent";
import { EventCtrl } from "modules/common/EventCtrl";
import { LoginData } from "modules/login/LoginData";
//import { RoleData } from "modules/role/RoleData";
import { ResPath } from "utils/ResPath";
const { ccclass, property } = _decorator;

export enum AudioTagType {
    scene = 1,
    fgui = 2,
}

export enum AudioTag {
    ZhuJieMian = "zhujiemian",
    ZhanDouAudio = "ZhanDouAudio",
    TongYongClick = "dianjianniu",
    TanChuJieMian = "tanchujiemian",
    HuoDeDaoJu = "huodedaoju",
    baoxiangquanbu = "baoxiangquanbu",      //宝箱获得全部奖励
    baoxiangdan = "baoxiangdan",            //宝箱单个奖励

    HeroLevelUp = "yingxiongshengji",
    HeroChange = "zhuanjieduan",
    WaJue = "wajue",                //挖掘
    WaJueHuoBi = "wajuehuobi",      //挖掘货币
    ZuanTou = "zuantou",            //钻头
    ZhaDan = "zhadan",              //炸弹

    //战斗相关
    ChengBaoBaoZha = "chengbaobaozha",       //城堡爆炸
    GuaiWuZhuangJi = "zhuangjichengbao",    //怪物撞到城堡
    ZhanDouShengLi = "shengli",             //战斗胜利
    ZhanDouShiBai = "shibai",               //战斗失败
    SanXiao = "sanxiao",                    //三消
    SiXiao = "sixiao",                      //四消
    WuXiao = "wuxiao",                      //五消
    //英雄
    TouDanShouJiZhong = "toudanshou",   //投蛋手子弹打到敌人
    ErMoJiZhong = "xiaoemo",            //小恶魔打到敌人
    DiCiGongJiShi = "dici",             //地刺攻击时
    ShiLaiMuJiZhong = "shilaimu",   //史莱姆攻击到人
    BingShuangJiZhong = "bingshuang",   //冰霜击中
    HuiMieGu = "huimiegu",  //毁灭菇
    XiTieHua = "xitiehua",  //吸铁花
    MeiHuoGu = "meihuogu",  //魅惑菇
    YeZiGongJi = "yezidapaogongji",    //椰子大炮攻击
    YeZiBaoZha = "yezidapaobaozha",     //椰子爆炸
    CaiSen = "caisen",      //菜森
    GongChengShi = "dijinggongchengshi",  //工程师
    huixuanhua = "huixuanhua",         //回旋花 
    youlinglajiaofashe = "youlinglajiaofashe",      //幽灵辣椒发射
    youlinglajiaobaozha = "youlinglajiaobaozha",    //幽灵辣椒爆炸
    youyumogu = "youyumogu",        //忧郁蘑菇
    dalihua = "dalihua",            //大丽花
    dazuihua = "dazuihua",          //大嘴花
    xiangpumao = "xiangpumao",      //香浦猫攻击时
    bingdonggu = "nova",            //冰冻姑攻击时
    yumijiqiren = "duyejiqiren",    //玉米机器人攻击时
    guidie = "guidie",              //鬼蝶      暂无
    nangua = "huonv",               //南瓜攻击时
    kafeidou = "jiangshi",          //咖啡豆攻击时
    haidei = "kongjumowang",        //海带攻击时
    labi = "labi",                  //辣笔攻击时
    jianguo = "luoqi",              //坚果攻击时
    munaili = "munaiyi",            //木乃梨击中时
    shuilian = "najia",             //睡莲攻击时
    lianou = "sairen",              //莲藕攻击时
    xianrenzhang = "xianrenzhang",  //仙人掌击中时
    candou = "xiaochou",            //蚕豆攻击时
    mubei = "xiaolu",               //墓碑击中时
    wogua = "xiaopang",             //倭瓜攻击时
    jingjicaoxuebao = "jingjicaoxuebao",    //地刺血爆
    GongChengShiBomb = "gongchengshi",//工程师导弹爆炸
    bingshuangshouji = "bingshuangshouji", //冰霜西瓜攻击到人
    huixuanhuashouji = "huixuanhuashouji",  //回旋花攻击到人
    jianguoshouji = "jianguoshouji",        //坚果墙的石头攻击到人
    haidaiemoshouji = "haidaiemoshouji",    //海带恶魔攻击到人
    kafeidoushouji = "kafeidou",            //咖啡豆攻击到人
    xiangjiaoshouji = "xiangjiaoshouji",    //香蕉船长攻击到人
    xiangjiaobaozha = "xiangjiaobaozha",    //香蕉船长香蕉爆炸
    lingJincao = "dijinggongchengshi",      //零镜草
    sibadazu = "huixuanhua",                //斯巴达竹
    meiguifashi = "bingshuang",             //玫瑰法师
    yingtaobaozha = "gongchengshi",         //樱桃爆炸

    bingjian = "bingjian",              //滴水冰莲冰箭打到人
    bawangliulian = "bawangliulian",    //霸王榴莲针刺扎到人
    shandianluwei = "shandianluwei",    //闪电芦苇攻击
    diyuhuolongguoshouji = "diyuhuolongguoshouji",      //地狱火龙果打到人
    tiechuilan = "tiechuilan",          //铁锤兰攻击
    shenpan = "shenpan",                //铁锤兰圣光之力打到人

    zhandoumanji = "zhandoumanji",  //战斗内英雄满级音效
    guaiwulaixi = "guaiwulaixi",    //怪物来袭
    boss = "boss",                  //Boss来袭

    pipeizhong = "pipeizhong",      //匹配中
    pipeidao = "pipeidao",          //匹配到
    shengjie = "shengjie",          //升级

    huigan = "huigan",              //钓鱼音效
    yugourushui = "yugourushui",
    huodeyu = "huodeyu",
    diaoyuzhong = "diaoyuzhong",
}


@ccclass('AudioManager')
export class AudioManager extends SingletonCom {
    @property({ type: AudioSource })
    audioSource: AudioSource;
    // audioEngine: AudioSource;
    private pools: { [key: string]: AudioClip } = {};
    private loadedBg: { [key: string]: boolean } = {}
    private lastBgTag: AudioTag;

    private playAudioQueue: Map<AudioTag, number> = new Map();

    private idledSources: Map<AudioClip, AudioSource[]> = new Map();

    private playedClipQueue: AudioClip[] = [];//播放过的clip队列，最新播放的clip会被放到最后

    private waitRecycleSources: Map<AudioSource, number> = new Map();


    private sourceCount = 0;

    private getSourceCount = 0;


    private changeClipCount = 0;
    get curTimeMark(): number {
        return game.totalTime;
    }
    private sourceSet: Set<AudioSource> = new Set();
    private maxAudioCount = 24;
    start() {
        console.log("最大音效播放数量：", AudioSource.maxAudioChannel);
        if (AudioSource.maxAudioChannel - 2 < this.maxAudioCount) {
            this.maxAudioCount = AudioSource.maxAudioChannel - 2;
        }
        EventCtrl.Inst().on(CommonEvent.GAME_SHOW, this.OnGameShow, this);
        this.node.on(AudioSource.EventType.ENDED, this.onSourcePlayEnded, this);
        setInterval(() => {
            if (this.waitRecycleSources.size == 0) { return; }
            this.waitRecycleSources.forEach((tm, as) => {
                if (this.curTimeMark - tm >= 5000) {
                    this.sourceSet.add(as);
                }
            })
            if (this.sourceSet.size > 0) {
                this.sourceSet.forEach((as) => {
                    as.stop();
                    this.onSourcePlayEnded(as);
                });
                this.sourceSet.clear();
            }
        }, 5000);
    }

    onTouchStartEvent() {

    }

    public LogDebugInfo() {
        let logStr =
            `waitRecycleSourcesLen=${this.waitRecycleSources.size},sourceCount=${this.sourceCount},
ccCount=${this.changeClipCount},gsCount=${this.getSourceCount},ccRate=${this.changeClipCount / this.getSourceCount * 100}%`
        console.info(logStr);
        let queueClipsStr = "";
        for (let i = 0; i != this.playedClipQueue.length; ++i) {
            queueClipsStr += `${this.playedClipQueue[i].name},`;
            if ((i + 1) % 5 == 0) {
                queueClipsStr += "\n";
            }
        }
        console.info(
            `=============ClipQueue===============
${queueClipsStr}
======================================`);
        let idledSouStr = "";
        this.idledSources.forEach((sours, clip) => {
            if (sours.length == 0) {
                return;
            }
            idledSouStr += `${clip.name}=${sours.length}\n`;
        });
        console.info(
            `=============IdledSources===============
${idledSouStr}
======================================`);
    }

    private onSourcePlayEnded(source: AudioSource) {
        if (!this.waitRecycleSources.has(source)) {
            return;
        }
        this.waitRecycleSources.delete(source);
        let clip = source.clip;
        let clipSous: AudioSource[] = null;
        if (this.idledSources.has(clip)) {
            clipSous = this.idledSources.get(clip);
        }
        else {
            clipSous = [];
            this.idledSources.set(clip, clipSous);
        }
        clipSous.push(source);
    }

    private OnGameShow() {
        console.log("AudioManager OnGameShow!!!!!!!!!!", this.audioSource.playing, this.lastBgTag);
        if (this.lastBgTag == null) {
            return;
        }
        if (this.audioSource.playing) {
            // this.audioSource.pause();
            this.audioSource.play();
        } else {
            this.PlayBg(this.lastBgTag);
        }
    }

    public PlayBg(tag: AudioTag) {
        let t = this;
        if (t.checkBg(tag)) {
            return
        }
        if (this.audioSource.clip && 1 == LoginData.Inst().GetRoleSystemSetInfo(ROLE_SETTING_TYPE.SettingMusic)) {
            return
        }
        let clip = t.pools[tag];
        if (!clip) {
            //let url = fgui.UIPackage.getItemURL("Audio", tag)
            let url = fgui.UIPackage.getItemURL(tag, tag)
            let pi = fgui.UIPackage.getItemByURL(url)
            if (pi) {
                clip = t.pools[tag] = pi.owner.getItemAsset(pi) as AudioClip
            } else {
                Debugger.LogError("AudioManager", "pi undefined");
                return;
            }
        } else {
            if (!clip.isValid) {
                delete t.pools[tag];
                t.loadedBg[tag] = false;
                t.PlayBg(tag);
                return
            }
        }
        t.audioSource.stop();
        t.audioSource.clip = clip;
        //t.audioSource.volume = 1
        t.audioSource.loop = true;
        if (1 == LoginData.Inst().GetRoleSystemSetInfo(ROLE_SETTING_TYPE.SettingMusic)) {
            return
        }
        this.lastBgTag = tag;
        t.audioSource.play();
    }
    private checkBg(tag: AudioTag): boolean {
        let t = this;
        let loaded = t.loadedBg[tag];
        if (!loaded) {
            const path = ResPath.UIPackage(tag);
            fgui.UIPackage.loadPackage(path, (error: any, pkg: fgui.UIPackage) => {
                if (error) {
                    console.error(error);
                    return;
                }
                t.loadedBg[tag] = true;
                t.PlayBg(tag);
            })
            return true
        }
    }

    public RePlayBg() {
        if (this.audioSource.playing) {
            return
        }
        this.audioSource.play();
    }
    //0-1
    public BgVolume(value: number) {
        this.audioSource.volume = value
    }
    public StopBg() {
        this.audioSource.stop()
    }

    public Play(tag: AudioTag, type: AudioTagType = AudioTagType.scene) {
        if (type == AudioTagType.scene) {
            this.PlaySceneAudio(tag);
        } else {
            this.PlayUIAudio(tag);
        }
    }
    public ReEffect() {
        fgui.GRoot.inst.volumeScale = 1
    }
    public StopEffect() {
        fgui.GRoot.inst.volumeScale = 0
    }


    private GetSource(clip: AudioClip): AudioSource {
        //优先把sourcePool填满
        if (this.sourceCount < this.maxAudioCount) {
            let source = this.addComponent(AudioSource);
            this.waitRecycleSources.set(source, this.curTimeMark);
            ++this.sourceCount;
            return source;
        }

        //source缓存已满，查找最合适的source并返回
        if (this.waitRecycleSources.size >= this.sourceCount) { //播放队列已满，忽略播放请求
            return null;
        }
        ++this.getSourceCount;
        //先找相同clip的空闲source对象
        if (this.idledSources.has(clip)) {
            let sours = this.idledSources.get(clip);
            if (sours.length > 0) {
                let sou = sours.shift();
                this.waitRecycleSources.set(sou, this.curTimeMark);
                return sou;
            }
        }
        ++this.changeClipCount;
        //先找最长时间没使用的clip对应的source
        for (let i = 0; i != this.playedClipQueue.length; ++i) {
            let cl = this.playedClipQueue[i];
            if (cl == clip) { continue; }
            if (!this.idledSources.has(cl)) { continue; }
            let sours = this.idledSources.get(cl);
            if (sours.length > 0) {
                let sou = sours.shift();
                this.waitRecycleSources.set(sou, this.curTimeMark);
                return sou;
            }
        }
        return null;
    }


    public PlaySceneAudio(tag: AudioTag, time: number = 200) {
        if (this.playAudioQueue.has(tag)) {
            let lastTime = this.playAudioQueue.get(tag);
            if (this.curTimeMark < lastTime) {
                return;
            }
        }
        this.playAudioQueue.set(tag, this.curTimeMark + time);
        this.DoPlaySceneAudio(tag);
    }


    private DoPlaySceneAudio(tag: AudioTag) {
        if (1 == LoginData.Inst().GetRoleSystemSetInfo(ROLE_SETTING_TYPE.SettingAudio)) {
            return
        }

        this.GetClip(tag, this.PlayClip.bind(this));
    }

    public PlayUIAudio(tag: AudioTag) {
        if (1 == LoginData.Inst().GetRoleSystemSetInfo(ROLE_SETTING_TYPE.SettingAudio)) {
            return
        }

        // this.GetClip(tag, (clip, tag) => {
        //     fgui.GRoot.inst.playOneShotSound(clip)
        // })
        this.DoPlaySceneAudio(tag);
    }

    private clipLoadingCalls: Map<string, ((clip: AudioClip, tag: AudioTag) => any)[]> = new Map();


    GetClip(tag: AudioTag, call: (clip: AudioClip, tag: AudioTag) => any) {
        let clip = this.pools[tag];
        if (clip) {
            call(clip, tag);
        } else {
            let path = ResPath.Audio(tag)
            let cbs: ((clip: AudioClip, tag: AudioTag) => any)[] = null;
            if (this.clipLoadingCalls.has(path)) {
                cbs = this.clipLoadingCalls.get(path);
            }
            else {
                cbs = [];
                this.clipLoadingCalls.set(path, cbs);
            }
            cbs.push(call);
            ResManager.Inst().Load<AudioClip>(path, (error, obj) => {
                if (error != null) {
                    LogError(error);
                    return;
                }
                this.pools[tag] = <AudioClip>obj;
                if (this.clipLoadingCalls.has(path)) {
                    let callBacks = this.clipLoadingCalls.get(path);
                    this.clipLoadingCalls.delete(path);
                    callBacks.forEach((cb) => {
                        cb(this.pools[tag], tag);
                    })
                }
            });
        }
    }

    private PlayClip(clip: AudioClip, tag: AudioTag) {
        let source = this.GetSource(clip);
        if (source) {
            let queueI = this.playedClipQueue.indexOf(clip);
            if (queueI != -1) {
                if (queueI != this.playedClipQueue.length - 1) {//已经是放在最后了，不需要再重置队列状态了
                    this.playedClipQueue.splice(queueI, 1);
                    this.playedClipQueue.push(clip);
                }
            }
            else {
                this.playedClipQueue.push(clip);
            }
            source.clip = clip;
            source.play();
            // source.playOneShot(clip);
        }
    }

    PreloadClip(tag: AudioTag) {
        if (this.pools[tag] != null) {
            return;
        }
        let path = ResPath.Audio(tag)
        ResManager.Inst().Load<AudioClip>(path, (error, obj) => {
            if (error != null) {
                LogError(error);
                return;
            }
            this.pools[tag] = <AudioClip>obj;
        });
    }
}
