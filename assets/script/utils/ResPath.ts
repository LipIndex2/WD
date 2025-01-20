
export class ResPath {
    static RoleIcon(res_id: string | number) {
        return `loader/icon/role/${res_id}/spriteFrame`;
    }

    static ItemIcon(res_id: string | number) {
        return `loader/icon/item/${res_id}/spriteFrame`;
    }

    static SkillEffect(res_path: string | number, color?: number) {
        if (color) {
            switch (color) {
                case 1: return `effect/greenheros/${res_path}`;
                case 2: return `effect/blueheros/${res_path}`;
                case 3: return `effect/purpleheros/${res_path}`;
            }
        }
        return `effect/${res_path}`;
    }

    static SkillAsset(res_name: string | number) {
        return `skill_asset/${res_name}`;
    }

    static Monster(res_id: string | number) {
        return this.Actors(`monster/${res_id}`);
    }

    static Scene(res_id: string | number) {
        return `scene/${res_id}`;
    }

    static Buff(res_id: string | number) {
        return `effect/buff/${res_id}`;
    }

    static UIEffect(effect_id: string | number) {
        return `effect/ui/${effect_id}`;
    }

    static Audio(res_id: string | number) {
        return `audio/${res_id}`;
    }



    // private static root = ""
    static Actors(path: string) {
        return `actors/${path}`;
    }

    static ActorRole(res_id: string | number) {
        return this.Actors(`role/${res_id}`)
    }

    static ActorWeapon(res_id: string | number) {
        return this.Actors(`weapon/${res_id}`);
    }

    static ActorShiled(res_id: string | number) {
        return this.Actors(`shiled/${res_id}`);
    }

    static ActorHelmet(res_id: string | number) {
        return this.Actors(`helmet/${res_id}`);
    }

    static ActorBody(res_id: string | number, id2: string | number = 1) {
        return this.Actors(`armor/${res_id}/${res_id}_${id2}`);
    }

    static Fazheng(res_id: string | number) {
        return `effect/Uitexiao/${res_id}`
    }

    static UIPackage(packName: string) {
        return `ui/${packName}/${packName}`
    }

    static Npc(res_id: string | number) {
        return this.Actors(`npc/${res_id}`);
    }

    static Ride(res_id: string | number) {
        return this.Actors(`ride/${res_id}`);
    }

    static JiNengEffect(effect_id: string | number) {
        return `effect/jineng/${effect_id}`;
    }

    static Shizhuang(effect_id: string | number) {
        return `effect/Shizhuang/${effect_id}`;
    }

    static Box(level: number) {
        return `box/sp_box${level}`;
    }

    static Spine(res_name: string) {
        return `spine/${res_name}`;
    }

    static WxAvatar(url: string) {
        return `${url}?aaa=aa.jpg`;
    }

    static BattleBuff(url: string) {
        return `loader/battle_buff/${url}`;
    }

    static Shader(name: string) {
        return `effect/shader/${name}`;
    }

    static FishTool(name: string) {
        return `fish/${name}`;
    }

    static Fish(name: string | number) {
        return `spine/fish/${name}`;
    }
}