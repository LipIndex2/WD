
export var Language = LanguageSC

export var LanguageShow = [
    "简体中文", "English",
]

import { sys } from "cc"
import { ViewManager } from "manager/ViewManager"
import { DialogTipsView } from "modules/public_popup/DialogTipsView"
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl"
import { LanguageEn } from "./LanguageEN"
import { LanguageSC } from "./LanguageSC"
import { Prefskey } from "./PrefsKey"

export class LH {
    static langType: number = +sys.localStorage.getItem(Prefskey.GetLanguageKey())

    static set LangType(langType: number) {
        let langTypePre = LH.langType
        let path = LH.LangPath(langType)
        if (path) {
            ViewManager.Inst().OpenView(DialogTipsView, {
                content: Language.Setting.LangSwitchTips, confirmFunc: () => {
                    sys.localStorage.setItem(Prefskey.GetLanguageKey(), `${langType}`);
                    PublicPopupCtrl.Inst().Center("重启游戏确认提示(编辑器手动重启)")
                }, confirmText: Language.Common.Confirm, titleShow: Language.Setting.LangSwitchTitle, cancelFunc: null, cancelText: null, btnShow: true
            })
        }
        LH.langType = langTypePre
    }

    static get LangType() {
        return LH.langType
    }

    static get LangTypeStr() {
        return `${LH.langType}`
    }

    static get LangCbTypes() {
        return ["0", "1"]
    }

    static LangPath(langType?: number) {
        let path
        langType = 0
        switch (langType ?? +sys.localStorage.getItem(Prefskey.GetLanguageKey())) {
            case 0:
                Language = LanguageSC
                path = "LocalizationSC"
                break;
            case 1:
                Language = LanguageEn
                path = "LocalizationEn"
                break;
            default:
                Language = LanguageSC
                path = "LocalizationEn"
                break;
        }
        return `localization/${path}`
    }
}