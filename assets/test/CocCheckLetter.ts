import { _decorator, CCBoolean, Component, dynamicAtlasManager, gfx, Label, Node, profiler, Sprite, SpriteFrame } from 'cc';
import { UH } from '../script/helpers/UIHelper';
const { ccclass, property } = _decorator;

@ccclass('CocCheckLetter')
export class CocCheckLetter extends Component {
    @property(Sprite)
    sp: Sprite;
    @property(Label)
    label: Label;
    _showSprit: boolean = false;

    @property({ displayOrder: 0 })
    public get showSprit() {
        return this._showSprit;
    }
    public set showSprit(value) {
        if (this._showSprit === value) {
            return;
        }
        this._showSprit = value;
        this.label.enabled = this._showSprit
        this.sp.node.active = this._showSprit

    }

    start() {
        this.label.enabled = this.showSprit
    }

    update(deltaTime: number) {
        if (!this.sp.spriteFrame) {
            if (this.showSprit && this.label._letterTexture) {
                const spriteFrame = new SpriteFrame();
                // this.label._letterTexture.setAnisotropy(16);
                spriteFrame.texture = (dynamicAtlasManager as any)._atlases[0]._texture; // this.label._letterTexture;

                this.sp.spriteFrame = spriteFrame;
                this.label.node.active = false;
                let sc = UH.GetScreenAdapter(spriteFrame.width, spriteFrame.height);
                this.sp.node.setScale(sc, sc, sc);
            }
        }
        if (profiler._ctx && profiler._device && profiler._statsDone) {
            profiler._statsDone = false;
            let _ctx: CanvasRenderingContext2D = profiler._ctx;
            _ctx.fillStyle = "#000000";
            _ctx.globalAlpha = 0.3
            _ctx.fillRect(0, 0, 280, 280)
            _ctx.save()
            profiler.generateStats()
            _ctx.globalAlpha = 1.0
            _ctx.fillStyle = "#79CDCD";
            profiler.generateStats()
        }
    }
}

