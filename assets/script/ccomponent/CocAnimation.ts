import { Animation, Sprite, _decorator } from "cc";

const { ccclass, property } = _decorator;
@ccclass("CocAnimation")
/**重载Cocos动画控件
 * 修复未加载完的动画添加shader会失效
 */
export class CocAnimation extends Animation {
    private _isLoad = false;
    private _list_onLoad: any[];
    private _num_onLoad = 0;
    @property({ type: [Sprite] })
    target: [] = [];
    onLoad() {
        if (this.target.length) {
            this._list_onLoad = [];
            this.target.forEach(element => {
                let onEnable = (element as any)['onEnable'];
                (element as any)['onEnable'] = this.onTargetEnable.bind(this, this._list_onLoad.length);
                this._list_onLoad.push(onEnable)
            });
        } else {
            super.onLoad();
        }
    }
    private onTargetEnable(index: number) {
        let fun: Function = this._list_onLoad[index];
        if (fun) {
            Function.call(fun);
        }
        this._num_onLoad += 1;
        if (this._num_onLoad >= this._list_onLoad.length) {
            super.onLoad();
        }
    }
}