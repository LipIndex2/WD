import { _decorator, sp, js, Color, SpriteFrame, Sprite, Texture2D, CCBoolean } from "cc";
import { COCOSPLAY, EDITOR, HTML5, NATIVE } from "cc/env";
import { LogError } from "./Debugger";
export const spine = NATIVE ? (window as any).spine : (sp as any).spine;

const { ccclass, property } = _decorator;
let handleKeys = {
    preload: "preload"
}
export class SpColor extends sp.spine.Color {
    private color_sf: Sprite;
    setSpriteColor(value: Sprite) {
        this.color_sf = value;
    }
    set(r: number, g: number, b: number, a: number) {
        super.set(r, g, b, a)
        this.color_sf && (this.color_sf.color = new Color(this.r * 255, this.g * 255, this.b * 255, this.a * 255))
        return this;
    }
    // add(r: number, g: number, b: number, a: number) {
    //     super.add(r, g, b, a)
    //     this.color_sf && (this.color_sf.color = new Color(this.r * 255, this.g * 255, this.b * 255, this.a * 255))
    //     return this;
    // }
    // setFromColor(c: any) {
    //     super.setFromColor(c);
    //     this.color_sf && (this.color_sf.color = new Color(this.r * 255, this.g * 255, this.b * 255, this.a * 255))
    //     return this;
    // };
}
@ccclass('SpSkeletonBase')
export class SpSkeletonBase extends sp.Skeleton {
    @property({ tooltip: "是否复制skeData" })
    copySkeletonData: boolean = false
    static spinePreviewMode() {
        if (EDITOR) {
            Texture2D.PixelFormat
            // 重写update方法 达到在编辑模式下 自动播放动画的功能
            sp.Skeleton.prototype['update'] = function (dt) {

                if (EDITOR) {
                    (cc['engine'] as any)._animatingInEditMode = 1;
                    (cc['engine'] as any).animatingInEditMode = 1;
                }
                if (this.paused) return;
                dt *= this.timeScale * sp['timeScale'];
                if (this.isAnimationCached()) {
                    console.log("isAnimationCached");

                    // Cache mode and has animation queue.
                    if (this._isAniComplete) {

                        if (this._animationQueue.length === 0 && !this._headAniInfo) {

                            let frameCache = this._frameCache;
                            if (frameCache && frameCache.isInvalid()) {

                                frameCache.updateToFrame();
                                let frames = frameCache.frames;
                                this._curFrame = frames[frames.length - 1];
                            }
                            return;
                        }
                        if (!this._headAniInfo) {

                            this._headAniInfo = this._animationQueue.shift();
                        }
                        this._accTime += dt;
                        if (this._accTime > this._headAniInfo.delay) {

                            let aniInfo = this._headAniInfo;
                            this._headAniInfo = null;
                            this.setAnimation(0, aniInfo.animationName, aniInfo.loop);
                        }
                        return;
                    }
                    this._updateCache(dt);
                } else {
                    this._updateRealtime(dt);
                }
            }
        }
    }
    protected _onPreLoad: Function;
    protected _isPreLoad: boolean = false;
    private _cp_ske_data: sp.SkeletonData;

    constructor() {
        super();
    }

    public __preload(isPre = true) {
        super.__preload();
        let t = this;
        t._isPreLoad = true;
        isPre && t._onPreLoad && t._onPreLoad();
    }

    // set skeletonData(value: sp.SkeletonData) {
    //     let t = this;
    //     t._cp_ske_data = new sp.SkeletonData();
    //     js.mixin(t._cp_ske_data, value);
    //     super.skeletonData = t._cp_ske_data;
    // }
    public copySkeData(): void {
        let t = this;
        if (this.copySkeletonData && t.skeletonData) {
            if (t._cp_ske_data == undefined) {
                t._cp_ske_data = new sp.SkeletonData();
            }
            js.mixin(t._cp_ske_data, t.skeletonData);
            t._cp_ske_data._uuid = t.skeletonData._uuid + "_copy";
            t._cp_ske_data.name = t.skeletonData.name + "copy";
            // t._cp_ske_data.initDefault && t._cp_ske_data.initDefault();
            t.skeletonData = t._cp_ske_data;
        }
    }
    // public setSkeletonData(skeletonData: sp.SkeletonData): void {
    //     let t = this;
    //     t._cp_ske_data = new sp.SkeletonData();
    //     js.mixin(t._cp_ske_data, skeletonData);
    //     t.skeletonData = t._cp_ske_data;
    //     super.setSkeletonData(t._cp_ske_data);
    // }

    public setOnPreLoad(on: Function) {
        let t = this;
        t._onPreLoad = on;
        if (t._isPreLoad) {
            on && on();
        }
    }

    onDestroy() {
        super.onDestroy();
        let t = this;
        t._isPreLoad = false;
        t._onPreLoad = undefined;
        t._cp_ske_data = undefined;
    }
}
SpSkeletonBase.spinePreviewMode();