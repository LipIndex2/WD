import { _decorator, Component, Node } from 'cc';
import { HandleBase, HandleCollector } from 'core/HandleCollector';
import { SMDHandle } from 'data/HandleCollectorCfg';
const { ccclass, property } = _decorator;

@ccclass('BaseControl')
export class BaseControl extends Component {
    protected handleCollector: HandleCollector;

    protected onLoad(): void {
        this.handleCollector = HandleCollector.Create();
    }

    public AddSmartDataCare(smdata: any, callback: Function, ...keys: string[]): HandleBase {
        let self = this;
        var handle = SMDHandle.Create(smdata, callback, ...keys)
        self.handleCollector.Add(handle);
        return handle
    }

    public RemoveSmartDataCare() {
        let self = this;
        HandleCollector.Destory(self.handleCollector);
        self.handleCollector = null;
    }

    protected onDestroy(): void {
        this.unscheduleAllCallbacks();
        this.RemoveSmartDataCare();
    }

    Delete(){
        
    }
}

