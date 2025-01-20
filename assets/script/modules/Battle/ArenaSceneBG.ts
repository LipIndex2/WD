import { _decorator, Component, instantiate, isValid, Node, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import { ARENA_CELL_OFFSET_POS, ARENA_MAP_COL, ARENA_MAP_ROW, BattleState, CELL_OFFSET_POS, CELL_WIDTH, FIGHT_SCALE } from './BattleConfig';
import { CfgSceneArenaBG, CfgSceneMainBG } from 'config/CfgSceneBG';
import { ViewManager } from 'manager/ViewManager';
import * as fgui from "fairygui-cc";
import { ResManager } from 'manager/ResManager';
import { LogWxError } from 'core/Debugger';
import { BattleData } from './BattleData';
import { IBattleBG } from './BattleScene';
const { ccclass, property } = _decorator;

@ccclass('ArenaSceneBG')
export class ArenaSceneBG extends Component implements IBattleBG {
    @property(Sprite)
    TopIcon: Sprite;
    @property(Sprite)
    BottomIcon: Sprite;
    @property(Sprite)
    BGIcon: Sprite;
    @property(UITransform)
    TopImg: UITransform;
    @property(UITransform)
    BottomImg: UITransform;
    @property(Node)
    Home:Node;

    @property(Node)
    CellRoot: Node;
    @property(Node)
    CellItem: Node;
    @property([Node])
    MaskList: Node[] = [];

    private cells: Node[][] = [];
    private maskCell: Node[] = [];

    private cellSpriteFrame1: SpriteFrame;
    private cellSpriteFrame2: SpriteFrame;
    private loadProgres: number = -1;

    get maxCol(){
        return ARENA_MAP_COL;
    }


    private sizeChange = this.OnWindowSizeChange.bind(this);
    data: CfgSceneArenaBG;
    private loadCallback: Function;
    onLoad() {
        ViewManager.Inst().OnWindowChange(this.sizeChange);
        this.OnWindowSizeChange();
    }

    onDestroy() {
        ViewManager.Inst().OffWindowChange(this.sizeChange);
    }

    OnWindowSizeChange() {
        //console.log("屏幕的宽高", fgui.GRoot.inst.width, fgui.GRoot.inst.height);
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

        this.BGIcon.node.getComponent(UITransform).setContentSize(fgui.GRoot.inst.width / 2 / FIGHT_SCALE, fgui.GRoot.inst.height / FIGHT_SCALE);
    }

    SetInitMap(row?: number) {
        row = row ?? ARENA_MAP_ROW;
        for (let i = 0; i < row; i++) {
            this.CrateRowCell(i, false);
        }
        this.SetMask();
    }

    SetData(data: CfgSceneArenaBG) {
        this.data = data;
        this.LoadIcon();
    }

    SetLoadedCallback(func: Function) {
        this.loadCallback = func;
    }

    LoadIcon(callback?: Function) {
        this.SetLoadedCallback(callback);
        let topPath = "loader/scene/arena/" + this.data.up_res_id;
        let downPath = "loader/scene/adorn/" + this.data.down_res_id;
        let bgPath = "loader/scene/cell/" + this.data.gezi1_id;

        let cell1Path = "loader/scene/cell/" + this.data.gezi2_id;
        let cell2Path = "loader/scene/cell/" + this.data.gezi3_id;
        this.loadProgres = 10;

        ResManager.Inst().LoadSpriteFrame<SpriteFrame>(topPath, (err, icon) => {
            this.loadProgres--;
            if (err != null) {
                LogWxError("背景icon加载失败", topPath)
            }else{
                this.TopIcon.spriteFrame = icon;
            }
            this.CheckLoad();
        })

        ResManager.Inst().LoadSpriteFrame<SpriteFrame>(downPath, (err, icon) => {
            this.loadProgres--;
            if (err != null) {
                LogWxError("背景icon加载失败", downPath)
            }
            this.BottomIcon.spriteFrame = icon;
            this.CheckLoad();
        })

        ResManager.Inst().LoadSpriteFrame<SpriteFrame>(bgPath, (err, icon) => {
            this.loadProgres--;
            if (err != null) {
                LogWxError("背景icon加载失败", bgPath)
            }else{
                this.BGIcon.spriteFrame = icon;
            }
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

    }

    private CheckLoad() {
        if (this.loadProgres == 0) {
            this.loadProgres = -1;
            if (this.loadCallback) {
                this.loadCallback();
            }
        }
    }



    CrateRowCell(i: number, isSetMask: boolean = true) {
        //console.error("CrateRowCell", i);
        if (this.cells[i] == null) {
            this.cells[i] = []
        }
        for (let j = 0; j < ARENA_MAP_COL; j++) {
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
    }

    GetPos(i: number, j: number): Vec3 {
        let pos = new Vec3();
        pos.x = j * CELL_WIDTH + ARENA_CELL_OFFSET_POS.x;
        pos.y = i * CELL_WIDTH + ARENA_CELL_OFFSET_POS.y;
        if (i < 0) {
            pos.y -= 50;
        }
        return pos;
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
        let cell_rd = this.cells[0][ARENA_MAP_COL - 1];
        let len = this.cells.length;
        let cell_lu = this.cells[len - 1][0];
        let cell_ru = this.cells[len - 1][ARENA_MAP_COL - 1];
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

    GetTopMonsterPos(col: number, row = ARENA_MAP_ROW): Vec3 {
        return this.GetWorldPos(row, col);
    }

    GetWorldPos(i: number, j: number): Vec3 {
        let offsetPos = this.cells[0][0].worldPosition;
        let scale = BattleData.Inst().battleInfo.GetBattleState() == BattleState.Figth ? FIGHT_SCALE : 1;
        let x = offsetPos.x + (CELL_WIDTH * j * scale);
        let y = offsetPos.y + (CELL_WIDTH * i * scale);
        return new Vec3(x, y, 0);
    }

    //设置失败图片
    SetFailImg(cp?: () => void) {
        let path = "loader/scene/adorn/" + this.data.def_id;
        ResManager.Inst().LoadSpriteFrame<SpriteFrame>(path, (err, icon) => {
            if (err != null) {
                LogWxError("背景icon加载失败", path)
            }
            if(!this.node || !isValid(this.node) || !this.BottomIcon){
                return
            }
            this.BottomIcon.spriteFrame = icon;
            if (cp) {
                cp();
            }
        })
    }

    GetMapLeftX() {
        return this.cells[0][0].worldPosition.x - CELL_WIDTH / 2;
    }
    GetMapRightX() {
        return this.cells[0][ARENA_MAP_COL - 1].worldPosition.x + CELL_WIDTH / 2;
    }
    GetMapTopY() {
        return this.cells[ARENA_MAP_ROW - 1][0].worldPosition.y + CELL_WIDTH / 2;
    }
}


