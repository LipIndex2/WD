import { sys } from 'cc';
export class GameVersion {

    //打包版本号 main.js 
    //版本号,版本,打包时间 (逗号替换为0) 1.2.3 => 10203
    static versionCode: number = 0;
    static version: string = '0.3.0';
    static buildTime: string = '1';

    //热更新版本号
    static assetVersion: string = '';

    static InitVersion() {
        let packageVersion = sys.localStorage.getItem('packageVersionStr');
        if (packageVersion) {
            let versions = packageVersion.split(',');
            if (versions.length >= 3) {
                this.versionCode = Number(versions[0])
                this.version = versions[1]
                this.buildTime = versions[2]
            }
        }
        this.assetVersion = sys.localStorage.getItem('localResVersion') || this.version;
    }
}
