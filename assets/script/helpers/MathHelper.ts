import { IVec2Like, misc, Vec2, Vec3 } from "cc";

export class MathHelper {
    //获取保留小数点几位 不进行四合五入
    static PreciseDecimal = function (num: number, n: number): number {
        let decimal = Math.pow(10, n);
        return Math.floor(num * decimal) / decimal;
    }

    /**
     * 生成范围随机数 [Min,Max]
     * Min 最小值
     * Max 最大值
     */
    static GetRandomNum = function (Min: number, Max: number): number {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    }

    /**
     * FLOAT 生成范围随机数 [Min,Max)
     * Min 最小值
     * Max 最大值
     */
    static GetRandomFloat = function (Min: number, Max: number): number {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Rand * Range);
    }

    // 在一个范围里面随机n个不一样的数字
    static GetRandomNumList(min_num: number, max_num: number, count: number): number[] {
        let pool = [];
        for(let i = min_num; i<= max_num; i++){
            pool.push(i);
        }
        pool = MathHelper.UpsetArr(pool);
        let newList = [];
        for(let i = 0; i < count && i < pool.length; i++){
            newList.push(pool[i])
        }
        return newList;
    }

    //打乱一个数组
    static UpsetArr(arr: any[]) {
        arr.sort((a, b) => {
            let v = this.GetRandomNum(1, 100);
            if (v % 2 == 0) {
                return -1;
            } else {
                return 1;
            }
        })
        return arr;
    }

    // 传一个1-10000的数字，进行概率判定
    static RandomResult(value: number, maxValue: number = 10000) {
        let randNum = MathHelper.GetRandomNum(1, maxValue);
        return randNum < value;
    }
    
    // 传入一个0-100的整数计算百分比概率
    static RndRetPercent(value: number){
        return this.RandomResult(value,100);
    }

    //百分比整数转成0-1的浮点数
    static NumToPer(value :number){
        return value/100;
    }

    //获取两向量的夹角 返回 0-360
    static GetVecAngle(v1: Vec3, v2: Vec3): number {
        let dir = new Vec3(v2.x - v1.x, v2.y - v1.y, 0);
        // 弧度 * 180 / PI
        let nor = dir.normalize();
        let angle = Math.atan2(nor.x, nor.y) * 180 / Math.PI;
        if (angle < 0) {
            angle = 360 + angle;
        }
        return angle;
    }

    private static v2Cache1 = new Vec2()
    private static v2Cache2 = new Vec2();

    //计算从from->to的有符号夹角 (-180, 180]
    static SignAngleVec(from: IVec2Like, to: IVec2Like): number {
        return this.SignAngle(from.x, from.y, to.x, to.y);
    }

    static SignAngle(fromX: number, fromY: number, toX: number, toY: number): number {
        this.v2Cache1.set(fromX, fromY);
        this.v2Cache2.set(toX, toY);
        let signRadian = this.v2Cache1.signAngle(this.v2Cache2);
        let angle = signRadian * 180 / Math.PI;
        return angle;
    }

    //获取向量对应的cocos坐标系z轴旋转角度
    static VecZEulerVec(v1: IVec2Like): number {
        let re = this.SignAngleVec(Vec2.UNIT_Y, v1)
        return re;
    }

    static VecZEuler(x: number, y: number): number {
        return this.SignAngle(Vec2.UNIT_Y.x, Vec2.UNIT_Y.y, x, y);
    }
}