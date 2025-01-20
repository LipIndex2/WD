import { _decorator, Color, Component, EffectAsset, Material, Sprite, UIRenderer, Vec4 } from "cc";
import { ResManager } from "manager/ResManager";
import { ResPath } from "utils/ResPath";
import * as fgui from "fairygui-cc";
import { LogError } from "core/Debugger";
import TGA from "tga-js";
import { IS_BATTLE_TWEENER_AUTO } from "modules/Battle/BattleConfig";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { BattleTweenerType } from "modules/Battle/BattleDynamic";
import { IBattleScene } from "modules/Battle/BattleScene";


const { ccclass, property } = _decorator;

@ccclass("CocSpriteGradient")
export class CocSpriteGradient extends Component {
    @property(UIRenderer)
    sprite: UIRenderer;
    public _mat: Material;
    private mat_name: string;
    private _active = true;
    public value: number = 0;
    public get mat() {
        return this._mat;
    }
    public set active(v: boolean) {
        this._active = v;
        if (this.sprite) {
            if (!this._active) {
                this.sprite.setMaterial(undefined, 0);
                this.sprite.customMaterial = undefined;
            } else if (this._mat) {
                this.sprite.setMaterial(this._mat, 0);
                this.sprite.customMaterial = this._mat;
            }
        }
    }

    scene: IBattleScene;

    protected onLoad(): void {

    }

    protected onEnable(): void {
        if (!this.sprite) {
            let sprite = this.node.getComponent(Sprite);
            if (!sprite) {
                sprite = this.node.getComponent(fgui.Image);
            }
            this.sprite = sprite;
        }
        if (!this._mat) {
            this.loadMat();
        }
    }

    protected start(): void {
        if (!this.sprite) {
            let sprite = this.node.getComponent(Sprite);
            if (!sprite) {
                sprite = this.node.getComponent(fgui.Image);
            }
            this.sprite = sprite;
        }
        if (!this._mat) {
            this.loadMat();
        }
    }

    private loadMat(com?: () => void) {
        if (this.node && this.mat_name) {
            if (!this.sprite) {
                let sprite = this.node.getComponent(Sprite);
                if (!sprite) {
                    sprite = this.node.getComponent(fgui.Image);
                }
                this.sprite = sprite;
            }
            if (this.sprite) {
                if (this.nnew) {
                    ResManager.Inst().Load<EffectAsset>(ResPath.Shader(this.mat_name), (err: Error | null, ass: EffectAsset) => {
                        let mat = new Material();
                        mat.initialize({
                            effectAsset: ass
                        })
                        this._mat = mat;
                        this._mat.addRef();
                        if (mat && this._active) {
                            // this.sprite.setMaterial(mat, 0);
                            if (this.sprite)
                                this.sprite.customMaterial = mat;
                            com && com();
                        }
                    })
                } else
                    ResManager.Inst().Load<Material>(ResPath.Shader(this.mat_name), (err: Error | null, mat: Material) => {
                        if (mat) {
                            this._mat = mat;
                            this._mat.addRef();
                            if (this._active) {
                                // this.sprite.setMaterialInstance(mat, 0);
                                // this._mat = this.sprite.getMaterialInstance(0)
                                if (this.sprite)
                                    this.sprite.customMaterial = this._mat;
                                com && com();
                            }
                        }
                    })
            }
        }
    }
    nnew: boolean
    public setMaterialName(name: string, com?: () => void, nnew = false) {
        let mat_name = this.mat_name;
        this.mat_name = name;
        this.nnew = nnew;
        if (mat_name != name) {
            this.loadMat(com);
        } else if (this._mat && this.sprite) {
            this.sprite.setMaterial(this._mat, 0);
            this.sprite.customMaterial = this._mat;
        }
    }

    public setColor(s: Color, e: Color) {
        this._mat.setProperty("startColor", s)
        this._mat.setProperty("endColor", e)
    }
    private to: fgui.GTweener;
    private handler: number;
    public addColor(s: number, e: number, time: number = 1, comp?: () => void) {
        if (!this._mat) {
            return
        }
        if (!this.scene) {
            return;
        }
        if (this.to) {
            this.to.kill();
            this.to = null;
        }
        if (!this.handler) {
            this.handler = this._mat.passes[0].getHandle("addColor")
        }
        let to = this.to = fgui.GTween.to(s, e, time);
        to.onComplete(() => {
            this.to = null;
            comp && comp();
        })
        to.onUpdate((target: fgui.GTweener) => {
            this._mat.passes[0].setUniform(this.handler, new Vec4(target.value.x, target.value.x, target.value.x, 0.0))
            this.sprite.customMaterial = this._mat;
        })
    }

    protected onDestroy(): void {
        if (this.to && this.scene) {
            this.to.kill();
            this.to = undefined;
        }
        if (this._mat) {
            this._mat.decRef();
        }
        this._mat = undefined;
        this.name = undefined;
        this.mat_name = undefined;
        this._active = true;
    }
}