import { RoleData } from 'modules/role/RoleData';
import { ICON_TYPE } from 'modules/common/CommonEnum';
import { SpriteFrame } from "cc";
import * as fgui from "fairygui-cc";
import { BaseItem } from "modules/common/BaseItem";
import { AvatarCell, AvatarData } from "./AvatarCell";
import { ENUM_OBJ } from "core/ObjectPool";
import { ResManager } from "manager/ResManager";
import { ResPath } from "utils/ResPath";
import { UH } from "../../helpers/UIHelper";
import { ConstValue } from 'modules/common/ConstValue';

export class HeadItem extends BaseItem {
    protected viewNode = {
        Head: <fgui.GLoader>null,
        HeadFrame: <fgui.GLoader>null,
    };

    public SetData(data: AvatarData) {
        super.SetData(data)
        if (data.headPicId == 0 && data.avatarUrl && data.avatarUrl != "") {
            let sf = AvatarCell.pool_avatarSp[data.avatarUrl];
            if (!sf) {
                ResManager.Inst().LoadOutSprite(ENUM_OBJ.AVATAR_WX, ResPath.WxAvatar(data.avatarUrl), (spf: SpriteFrame) => {
                    this.SeSpriteFrame(spf);
                    AvatarCell.pool_avatarSp[data.avatarUrl] = spf
                })
            } else {
                this.SeSpriteFrame(sf);
            }
        } else {
            this.setDefaut((data.headPicId));
        }
        let headId = data.headFrameId ? data.headFrameId : 1;
        this.SetHeadFrame(headId);
    }

    public setDefaut(id: number) {
        let cfg = RoleData.Inst().CfgRoleHeadIcon(id);
        if (cfg) {
            UH.SetIcon(this.viewNode.Head, cfg.head_id, ICON_TYPE.HEADICON)
        } else {
            UH.SpriteName(this.viewNode.Head, ConstValue.PKGNAME.CommonItem, "TouXiangDaXiao")
        }
    }

    public SetHeadFrame(id: number) {
        let headid = id > 0 ? id : 1
        let cfg = RoleData.Inst().CfgRoleHeadFrame(headid);
        UH.SetIcon(this.viewNode.HeadFrame, cfg.res_id, ICON_TYPE.HEADFRAME)
    }

    public SeSpriteFrame(sf: SpriteFrame) {
        if (sf && this.viewNode && this.viewNode.Head && !this.isDisposed) {
            try {
                this.viewNode.Head.texture = sf
            } catch (e) {
            }
            // this.viewNode.Head.setSize(this.viewNode.Head.sourceWidth, this.viewNode.Head.sourceHeight)
        }
    }
}