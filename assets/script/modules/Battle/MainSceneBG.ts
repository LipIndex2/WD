import { _decorator, Component, Node, view, UITransform, Input, Sprite, SpriteFrame, instantiate, Vec2, math, Vec3, Widget } from 'cc';
import { CfgSceneMainBG } from 'config/CfgSceneBG';
import { LogError, LogWxError } from 'core/Debugger';
import * as fgui from "fairygui-cc";
import { ResManager } from 'manager/ResManager';
import { ViewManager } from 'manager/ViewManager';
import { BattleState, CellSPTypeMap, CELL_OFFSET_POS, CELL_WIDTH, FIGHT_SCALE, INIT_MAP_ROW, MAP_COL, MAX_MAP_ROW } from './BattleConfig';
import { BattleData } from './BattleData';
import { Camera } from 'cc';
import { game } from 'cc';
import { CameraManager } from 'manager/CameraManager';
import { UtilHelper } from '../../helpers/UtilHelper';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { BattleCtrl } from './BattleCtrl';
import { CfgSpeBlock } from 'config/CfgScene';
import { BaseCellSpCell } from './Function/CellSpFunc';
import { BattleScene, IBattleBG } from './BattleScene';
import { HeroObj } from './Object/HeroObj';
import { BattleSpCellInfoView1 } from './View/BattleSpCellInfoView1';
const { ccclass, property } = _decorator;

@ccclass('MainSceneBG')
export class MainSceneBG extends Component implements IBattleBG {
    @property(Sprite)
    TopIcon: Sprite;
    @property(Sprite)
    BottomIcon: Sprite;
    @property(Sprite)
    LeftIcon: Sprite;
    @property(Sprite)
    RightIcon: Sprite;
    @property(Sprite)
    ZhuangShi1: Sprite;
    @property(Sprite)
    ZhuangShi2: Sprite;
    @property(Sprite)
    BGIcon: Sprite;

    @property(UITransform)
    TopImg: UITransform;
    @property(UITransform)
    BottomImg: UITransform;
    @property(Node)
    Home: Node;


    @property(Node)
    CellRoot: Node;

    @property([Node])
    MaskList: Node[]

    @property(Node)
    CellItem: Node;

    @property([Node])
    BossRange: Node[];

    private cells: Node[][] = [];
    private maskCell: Node[] = [];

    data: CfgSceneMainBG;
    loadCallback: Function;

    //特殊格子
    private spCellCfg: CfgSpeBlock[];
    private spCellMap: Map<number, BaseCellSpCell>;

    get Row() {
        if (this.cells.length < INIT_MAP_ROW) {
            return INIT_MAP_ROW;
        }
        return this.cells.length;
    }

    get maxCol(){
        return MAP_COL;
    }

    private sizeChange = this.OnWindowSizeChange.bind(this);
    onLoad() {
        ViewManager.Inst().OnWindowChange(this.sizeChange);
        this.OnWindowSizeChange();
    }

    onDestroy() {
        ViewManager.Inst().OffWindowChange(this.sizeChange);
        if(this.spCellMap){
            this.spCellMap.forEach((cell, k)=>{
                cell.Delete();
            })
            this.spCellMap.clear();
            this.spCellMap = null;
        }
    }

    SetData(data: CfgSceneMainBG) {
        this.data = data;
        this.LoadIcon();
    }

    SetSpCellData(datas: CfgSpeBlock[]){
        if(datas == null || datas.length == 0 || this.spCellMap != null){
            return;
        }
        this.spCellCfg = datas;
        this.spCellMap = new Map<number, BaseCellSpCell>()
        //ViewManager.Inst().OpenView(BattleSpCellInfoView1);
    }

    GetSpCells():Map<number, BaseCellSpCell>{
        return this.spCellMap;
    }

    SetSpCellHero(hero:HeroObj){
        if(!this.spCellCfg){
            return;
        }
        let ijNum = hero.ijNum;
        if(this.spCellMap.has(ijNum)){
            let cell = this.spCellMap.get(ijNum);
            cell.hero = hero;
        }
    }

    SetLoadedCallback(func: Function) {
        this.loadCallback = func;
    }

    //加载图片
    private topSpriteFrame: SpriteFrame;
    private bottomSpriteFrame: SpriteFrame;
    private bgSrpiteFrame: SpriteFrame;
    private leftSpriteFrame: SpriteFrame;
    private rightSpriteFrame: SpriteFrame;
    private smallSpriteFrame: SpriteFrame;
    private cellSpriteFrame1: SpriteFrame;
    private cellSpriteFrame2: SpriteFrame;
    private loadProgres: number = -1;

    LoadIcon(callback?: Function) {
        this.SetLoadedCallback(callback);
        let topPath = "loader/scene/adorn/" + this.data.up_res_id;
        let downPath = "loader/scene/adorn/" + this.data.down_res_id;
        let bgPath = "loader/scene/cell/" + this.data.gezi1_id;
        let leftPath = "loader/scene/adorn/" + this.data.left_res_id;
        let rightPath = "loader/scene/adorn/" + this.data.right_res_id;
        let smallPath = "loader/scene/adorn/" + this.data.small_res_id;

        let cell1Path = "loader/scene/cell/" + this.data.gezi2_id;
        let cell2Path = "loader/scene/cell/" + this.data.gezi3_id;
        this.loadProgres = 16;
        ResManager.Inst().LoadSpriteFrame<SpriteFrame>(topPath, (err, icon) => {
            this.loadProgres--;
            if (err != null) {
                LogWxError("背景icon加载失败", topPath)
            }
            if(this.node == null){
                return;
            }
            this.topSpriteFrame = icon;
            this.TopIcon.spriteFrame = icon;
            this.CheckLoad();
        })
        ResManager.Inst().LoadSpriteFrame<SpriteFrame>(downPath, (err, icon) => {
            this.loadProgres--;
            if (err != null) {
                LogWxError("背景icon加载失败", downPath)
            }
            if(this.node == null){
                return;
            }
            this.bottomSpriteFrame = icon;
            this.BottomIcon.spriteFrame = icon;
            this.CheckLoad();
        })
        ResManager.Inst().LoadSpriteFrame<SpriteFrame>(bgPath, (err, icon) => {
            this.loadProgres--;
            if (err != null) {
                LogWxError("背景icon加载失败", bgPath)
            }
            if(this.node == null){
                return;
            }
            this.bgSrpiteFrame = icon;
            this.BGIcon.spriteFrame = icon;
            this.CheckLoad();
        })
        ResManager.Inst().LoadSpriteFrame<SpriteFrame>(cell1Path, (err, icon) => {
            this.loadProgres--;
            if (err != null) {
                LogWxError("背景icon加载失败", cell1Path)
            }
            this.cellSpriteFrame1 = icon;
            this.CheckLoad();
        })
        ResManager.Inst().LoadSpriteFrame<SpriteFrame>(cell2Path, (err, icon) => {
            this.loadProgres--;
            if (err != null) {
                LogWxError("背景icon加载失败", cell2Path)
            }
            this.cellSpriteFrame2 = icon;
            this.CheckLoad();
        })

        ResManager.Inst().LoadSpriteFrame<SpriteFrame>(leftPath, (err, icon) => {
            this.loadProgres--;
            if (err != null) {
                LogWxError("背景icon加载失败", leftPath)
            }
            if(this.node == null){
                return;
            }
            this.leftSpriteFrame = icon;
            this.LeftIcon.spriteFrame = icon;
            this.CheckLoad();
        })

        ResManager.Inst().LoadSpriteFrame<SpriteFrame>(rightPath, (err, icon) => {
            this.loadProgres--;
            if (err != null) {
                LogWxError("背景icon加载失败", rightPath)
            }
            if(this.node == null){
                return;
            }
            this.rightSpriteFrame = icon;
            this.RightIcon.spriteFrame = icon;
            this.CheckLoad();
        })

        ResManager.Inst().LoadSpriteFrame<SpriteFrame>(smallPath, (err, icon) => {
            this.loadProgres--;
            if (err != null) {
                LogWxError("背景icon加载失败", smallPath)
            }
            if(this.node == null){
                return;
            }
            this.smallSpriteFrame = icon;
            this.ZhuangShi1.spriteFrame = icon;
            this.ZhuangShi2.spriteFrame = icon;
            this.CheckLoad();
        })

    }

    private CheckLoad() {
        //console.log("检查了");
        if (this.loadProgres == 0) {
            this.loadProgres = -1;
            this.Show();
            if (this.loadCallback) {
                this.loadCallback();
            }
        }
    }

    private Show() {

    }

    //设置失败图片
    SetFailImg(cp?: () => void) {
        let path = "loader/scene/adorn/" + this.data.def_id;
        ResManager.Inst().LoadSpriteFrame<SpriteFrame>(path, (err, icon) => {
            if (err != null) {
                LogWxError("背景icon加载失败", path)
            }
            if(this.node == null){
                return;
            }
            this.BottomIcon.spriteFrame = icon;
            if (cp) {
                cp();
            }
        })
    }


    OnWindowSizeChange() {
        //console.log("窗口变化OnWindowSizeChange", );
        let scale = (fgui.GRoot.inst.width / fgui.GRoot.inst.height) / 0.5
        let topScale = scale;
        let bottomScale = scale;
        //console.log("比例", scale);
        if (bottomScale < 1) {
            bottomScale = 1 + (1 - scale);
        }
        if (topScale < 1.1) {
            topScale = 1.1 + (1.1 - scale);
        }

        //适配方案2
        let size = this.TopImg.contentSize;
        this.TopImg.setContentSize(size.width * topScale, size.height * topScale);

        size = this.BottomImg.contentSize;
        this.BottomImg.setContentSize(size.width * bottomScale, size.height * bottomScale);
    }

    SetInitMap(row?: number) {
        row = row ?? this.Row;
        for (let i = 0; i < row; i++) {
            this.CrateRowCell(i, false);
        }
        this.SetMask();
    }


    CrateRowCell(i: number, isSetMask: boolean = true) {
        //console.error("CrateRowCell", i);
        if (this.cells[i] == null) {
            this.cells[i] = []
        }
        for (let j = 0; j < MAP_COL; j++) {
            let node: Node;
            if (this.cells[i][j] == null) {
                node = instantiate(this.CellItem);
            } else {
                node = this.cells[i][j];
            }
            this.CellRoot.addChild(node);
            node.active = true;
            node.position = this.GetPos(i, j);
            let img = node.getComponent(Sprite);
            if ((i % 2 == 0 && j % 2 == 0) || (i % 2 == 1 && j % 2 == 1)) {
                img.spriteFrame = this.cellSpriteFrame1;
            } else {
                img.spriteFrame = this.cellSpriteFrame2;
            }
            this.cells[i][j] = node;
        }
        if (isSetMask == true) {
            this.SetMask();
        }
        this.FlushBossRangeSize();
        this.CreateAllSpCell();
    }

    CreateAllSpCell(){
        if(this.spCellCfg == null || this.spCellCfg.length == 0){
            return;
        }
        this.spCellCfg.forEach((data)=>{
            this.CreateSpCell(data);
        })
    }

    CreateSpCell(data:CfgSpeBlock){
        if(this.cells[data.pos_i] == null){
            return;
        }
        if(this.cells[data.pos_i][data.pos_j] == null){
            return;
        }
        let ijNum = BattleScene.IJTonum2(data.pos_i, data.pos_j);
        if(this.spCellMap.has(ijNum)){
            return;
        }
        let cellClass = CellSPTypeMap[data.block_type];
        let obj = new cellClass();
        obj.SetData(data);
        obj.Start();
        this.spCellMap.set(ijNum, obj);
    }

    private SetMask() {
        if (this.maskCell.length > 0) {
            this.maskCell.forEach((v) => {
                let worldPos = v.worldPosition;
                v.parent = this.CellRoot;
                v.worldPosition = worldPos;
            })
            this.maskCell = [];
        }
        let cell_ld = this.cells[0][0];
        let cell_rd = this.cells[0][MAP_COL - 1];
        let len = this.cells.length;
        let cell_lu = this.cells[len - 1][0];
        let cell_ru = this.cells[len - 1][MAP_COL - 1];
        this.MaskList[0].position = cell_ld.position;
        this.MaskList[1].position = cell_lu.position;
        this.MaskList[2].position = cell_rd.position;
        this.MaskList[3].position = cell_ru.position;
        cell_ld.parent = this.MaskList[0];
        cell_lu.parent = this.MaskList[1];
        cell_rd.parent = this.MaskList[2];
        cell_ru.parent = this.MaskList[3];
        cell_ld.setPosition(0, 0);
        cell_lu.setPosition(0, 0);
        cell_rd.setPosition(0, 0);
        cell_ru.setPosition(0, 0);
        this.maskCell.push(cell_ld);
        this.maskCell.push(cell_rd);
        this.maskCell.push(cell_lu);
        this.maskCell.push(cell_ru);
    }

    GetPos(i: number, j: number): Vec3 {
        let pos = new Vec3();
        pos.x = j * CELL_WIDTH + CELL_OFFSET_POS.x;
        pos.y = i * CELL_WIDTH + CELL_OFFSET_POS.y;
        if (i < 0) {
            pos.y -= 50;
        }
        return pos;
    }

    GetWorldPos(i: number, j: number): Vec3 {
        let offsetPos = this.cells[0][0].worldPosition;
        let scale = BattleData.Inst().battleInfo.GetBattleState() == BattleState.Figth ? FIGHT_SCALE : 1;
        let x = offsetPos.x + (CELL_WIDTH * j * scale);
        let y = offsetPos.y + (CELL_WIDTH * i * scale);
        return new Vec3(x, y, 0);
    }

    GetCell(i: number, j: number): Node {
        return this.cells[i][j];
    }

    GetMapLeftX() {
        return this.cells[0][0].worldPosition.x - CELL_WIDTH / 2;
    }
    GetMapRightX() {
        return this.cells[0][MAP_COL - 1].worldPosition.x + CELL_WIDTH / 2;
    }
    GetMapTopY() {
        return this.cells[this.Row - 1][0].worldPosition.y + CELL_WIDTH / 2;
    }
    /**
     * 获取顶部怪物出生位置
     * @param col 列数 0 - 5
     * @param row 行数 0 - 8 默认MAX_MAP_ROW = 9
     * @returns Vec3 世界坐标
     */
    GetTopMonsterPos(col: number, row = MAX_MAP_ROW): Vec3 {
        // let y = this.Top.worldPosition.y;
        // let x = this.cells[0][col].worldPosition.x;
        // return new Vec3(x,y,0);
        return this.GetWorldPos(row, col);
    }


    SetBossRange(cols: number[]) {
        if (cols == null) {
            this.BossRange.forEach(v => {
                v.active = false;
            })
            return;
        }
        if (this.BossRange.length < cols.length) {
            let target = this.BossRange[0]
            for (let i = this.BossRange.length; i < cols.length; i++) {
                let obj = instantiate(target);
                obj.parent = target.parent;
                this.BossRange.push(obj);
            }
        }
        cols.forEach((v, i) => {
            let obj = this.BossRange[i];
            let pos = this.GetPos(0, v);
            obj.setPosition(pos.x, pos.y - (CELL_WIDTH / 2));
            obj.active = true;
        })
        AudioManager.Inst().PlaySceneAudio(AudioTag.boss);
        this.FlushBossRangeSize();
    }

    FlushBossRangeSize(){
        if(this.BossRange == null || this.BossRange.length == 0){
            return;
        }
        this.BossRange.forEach((obj)=>{
            if(obj.active){
                obj.getComponent(UITransform).setContentSize(CELL_WIDTH * 3, 954 + (this.Row - INIT_MAP_ROW) * CELL_WIDTH);
                obj.children.forEach(child=>{
                    let widget = child.getComponent(Widget);
                    if(widget){
                        widget.updateAlignment();
                    }
                })
            }
        })
    }

    // 这里ij是反的，i是列，j是行
    GetIJByPos(pos: Vec3, isInverse:boolean = false): { i: number, j: number } {
        let i = 0, j = MAX_MAP_ROW;
        let offsetPos = this.cells[0][0].worldPosition;
        let scale = BattleData.Inst().battleInfo.GetBattleState() == BattleState.Figth ? FIGHT_SCALE : 1;
        for (let col = 0; col < MAP_COL; col++) {
            let x = offsetPos.x + (CELL_WIDTH * col * scale);
            if (x >= pos.x) {
                i = col;
                break;
            }
        }
        for (let row = 0; row < MAX_MAP_ROW; row++) {
            let y = offsetPos.y + (CELL_WIDTH * row * scale);
            if (y >= pos.y) {
                j = row;
                break;
            }
        }
        if(isInverse){
            return {i : j, j : i};
        }
        return { i: i, j: j };
    }

    // 世界位置转格子位置
    WorldPosConvertIJPos(pos:Vec3):Vec3{
        let ij = this.GetIJByPos(pos, true);
        return this.GetWorldPos(ij.i, ij.j);
    }

    /**获取怪物能后退的最顶点 */
    GetSceneTop(): number {
        let topPos = BattleCtrl.Inst().battleScene.battleBG.TopImg.node.getWorldPosition();
        return topPos.y + 70;
    }

}

