import { log, rect, size, error, assetManager, Asset, sys, Event, Director, AssetManager, native } from 'cc';
import { LoginCtrl } from './LoginCtrl';

export class HotUpdateCtrl {
    private assetManager: native.AssetsManager = null;
    private _storagePath: string = '';
    private _updating = false;
    private _callback: Function = null;
    private _remoteVersion: string = '';

    constructor(mainfestUrl: string, remoteHotUpdateUrl: string, callback: Function) {
        this._callback = callback;
        this._storagePath = ((native.fileUtils ? native.fileUtils.getWritablePath() : '/') + 'xibu-remote-assets-dev');
        console.log('远程资源的存储路径：' + this._storagePath);
        console.log('本地manifest的路径: ' + mainfestUrl);
        console.log('远程manifest的路径:' + remoteHotUpdateUrl);

        let data = native.fileUtils.getStringFromFile(mainfestUrl);
        if (data) {
            if (typeof remoteHotUpdateUrl !== 'undefined' && remoteHotUpdateUrl !== "") {
                console.log("有热更链接--使用热更链接替换manifest")
                //有热更链接--使用热更链接替换manifest
                try {
                    const manifestData = JSON.parse(data);
                    manifestData.packageUrl = remoteHotUpdateUrl;
                    manifestData.remoteManifestUrl = `${remoteHotUpdateUrl}/project.manifest`;
                    manifestData.remoteVersionUrl = `${remoteHotUpdateUrl}/version.manifest`;
                    let modifiedManifest = JSON.stringify(manifestData);
                    var manifest = new native.Manifest(modifiedManifest, this._storagePath);
                    this.assetManager = new native.AssetsManager('', this._storagePath, this.versionCompareHandle);
                    this.assetManager.loadLocalManifest(manifest, this._storagePath);

                } catch (error) {
                    console.error('Failed to parse manifest file:', error);
                    this.assetManager = new native.AssetsManager(mainfestUrl, this._storagePath, this.versionCompareHandle);
                }
            } else {
                console.log("没有热更链接--直接使用本地manifest的链接")
                //没有热更链接--直接使用本地manifest的链接
                this.assetManager = new native.AssetsManager(mainfestUrl, this._storagePath, this.versionCompareHandle);
            }
            this.assetManager.setVerifyCallback(function (filePath, asset) {

                var expectedMD5 = asset.md5;
                var relativePath = asset.path;  //服务器端相对路径
                var size = asset.size;  //文件尺寸

                var compressed = asset.compressed;  //是否被压缩
                if (compressed) {
                    return true;
                } else {
                    return true;
                }
            });

            if (sys.os === sys.OS.ANDROID) {
                this.assetManager.setMaxConcurrentTask(10);
            }

        } else {
            console.error(`Failed to load manifest file:${mainfestUrl}, and hotUpdateURL:${remoteHotUpdateUrl}`);
        }
    }

    private formatBytes(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        let k = 1024;
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        let i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    private checkCb(event: native.EventAssetsManager) {
        let ret = { name: '', ext: '' }
        switch (event.getEventCode()) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                ret.name = 'local_mainfest_fail';
                break;
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                ret.name = 'download_mainfest_fail';
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                ret.name = 'no_update';
                break;
            case native.EventAssetsManager.NEW_VERSION_FOUND:
                ret.name = 'check_update';
                ret.ext = this.formatBytes(this.assetManager.getTotalBytes());
                this._remoteVersion = this.assetManager.getRemoteManifest().getVersion();
                break;
            default:
                return;
        }
        this.assetManager.setEventCallback(null);
        this._updating = false;
        console.log("checkCb", JSON.stringify(ret))
        if (this._callback) {
            this._callback(ret)
        }
    }

    private updateCb(event: native.EventAssetsManager) {
        var needRestart = false;
        var failed = false;
        let ret = {
            name: '', ext: {
                percent: 0,
                percentFile: 0,
                downloadFiles: 0,
                downloadBytes: '',
                totalFiles: 0,
                totalBytes: ''
            }
        }
        switch (event.getEventCode()) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                ret.name = 'local_mainfest_fail';
                failed = true;
                break;
            case native.EventAssetsManager.UPDATE_PROGRESSION:
                ret.name = 'update_progress';
                ret.ext = {
                    percent: event.getPercent(),
                    percentFile: event.getPercentByFile(),
                    downloadFiles: event.getDownloadedFiles(),
                    downloadBytes: this.formatBytes(event.getDownloadedBytes()),
                    totalFiles: event.getTotalFiles(),
                    totalBytes: this.formatBytes(event.getTotalBytes())
                }
                break;
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                ret.name = 'download_mainfest_fail';
                failed = true;
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                ret.name = 'no_update';
                failed = true;
                break;
            case native.EventAssetsManager.UPDATE_FINISHED:
                needRestart = true;
                ret.name = 'finished';
                //保存远程文件的version
                if (this._remoteVersion) {
                    sys.localStorage.setItem('localResVersion', this._remoteVersion);
                }
                break;
            case native.EventAssetsManager.UPDATE_FAILED:
                ret.name = 'update_fail';
                this._updating = false;
                break;
            case native.EventAssetsManager.ERROR_UPDATING:
                error('[ERROR_UPDATING] 更新失败.' + event.getAssetId() + ', ' + event.getMessage())
                break;
            case native.EventAssetsManager.ERROR_DECOMPRESS:
                error('[ERROR_UPDATING] 解压失败.' + event.getAssetId() + ', ' + event.getMessage());
                break;
            default:
                break;
        }

        if (this._callback) {
            this._callback(ret)
        }

        if (failed) {
            this.assetManager.setEventCallback(null);
            this._updating = false;
        }
    }

    public gameRestart() {
        this.assetManager.setEventCallback(null);
        // Prepend the manifest's search path
        var searchPaths = native.fileUtils.getSearchPaths();
        var newPaths = this.assetManager.getLocalManifest().getSearchPaths();
        console.log(JSON.stringify(newPaths));
        for (var i = 0; i < newPaths.length; i++) {
            if (searchPaths.indexOf(newPaths[i]) == -1) {
                Array.prototype.unshift.apply(searchPaths, [newPaths[i]]);
            }
        }
        // This value will be retrieved and appended to the default search path during game startup,
        // please refer to samples/js-tests/main.js for detailed usage.
        // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
        sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
        native.fileUtils.setSearchPaths(searchPaths);

        LoginCtrl.OpRestart();
    }

    //修复本地目录
    public repairGame() {
        //删除temp文件
        native.fileUtils.removeDirectory(this._storagePath + '_temp');
        //删除更新目录
        native.fileUtils.removeDirectory(this._storagePath);
    }

    //检查更新
    public checkUpdate() {
        if (!sys.isNative) {
            console.log('checkUpdate:非原生平台，不检查热更新');
            if (this._callback) {
                this._callback({ name: 'no_update', msg: 'no_update' })
            }
            return;
        }
        if (this._updating) {
            console.log('检查是否需要热更新');
            return;
        }
        if (!this.assetManager.getLocalManifest() || !this.assetManager.getLocalManifest().isLoaded()) {
            console.log('Failed to load local manifest ...');
            return;
        }
        this.assetManager.setEventCallback(this.checkCb.bind(this));
        this.assetManager.checkUpdate();
        this._updating = true;
    }

    public hotUpdate() {
        if (!sys.isNative) {
            console.log('非原生平台，不检查热更新');
            return;
        }
        if (this.assetManager && !this._updating) {
            this.assetManager.setEventCallback(this.updateCb.bind(this));
            this.assetManager.update();
            this._updating = true;
        }
    }

    // Setup your own version compare handler, versionA and B is versions in string
    // if the return value greater than 0, versionA is greater than B,
    // if the return value equals 0, versionA equals to B,
    // if the return value smaller than 0, versionA is smaller than B.
    private versionCompareHandle(versionA: any, versionB: any) {
        console.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || 0);
            if (a === b) {
                continue;
            }
            else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        } else {
            return 0;
        }
    };
}
