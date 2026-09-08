// Number型(IEEE754)で不動少数点を使う時、誤差をなくすには2のマイナス乗単位で計算することで実現できる。
// 普通の算術計算ではそれ以外の数が発生してしまい誤差が生じる。
// そこで2のマイナス乗を最小単位（分解能）とするカウンタを作ってみた。
// e=1:1/2, e=2:1/4, e=3:1/8, e=4:1/16, ..., e=52:1/(2**52) = (Number.EPSILON)
// StepFloatは分解能の単位で一致した値のみ代入でき、さもなくば例外発生する。
// しかしそれだと誤差を許容して概算値を表示することができない。
// そこでRoundFloatは分解能の単位でない誤差まみれの浮動小数点数を許容し、値の取得roundedの時に分解能の単位で丸めた数を返却するように実装する。
class RoundFloat {
    // 四捨五入の名称として「nearest（最も近い目盛りへの丸め）」を採用
    static RoundMethod = Object.freeze({
        floor: (v, scale) => Math.floor(v * scale) / scale,
        trunc: (v, scale) => Math.trunc(v * scale) / scale,
        ceil: (v, scale) => Math.ceil(v * scale) / scale,
        nearest: (v, scale) => Math.round(v * scale) / scale, // 四捨五入
        even: (v, scale) => { // 偶数丸め（銀行家丸め / round half to even）
            const scaled = v * scale;
            const t = Math.trunc(scaled);
            const diff = scaled - t;
            if (Math.abs(diff) === 0.5) {
                return (t % 2 === 0 ? t : t + Math.sign(scaled)) / scale;
            }
            return Math.round(scaled) / scale;
        }
    });

    static Overflow = StepFloat.Overflow;

    constructor(e, method = RoundFloat.RoundMethod.nearest, over = StepFloat.Overflow.throw, min = -Infinity, max = Infinity) {
        if (!(Number.isSafeInteger(e) && (1 <= e && e <= 52))) {
            throw new RangeError(`eは1〜52までの整数値であるべきです。指定値: ${e}`);
        }
        if (!Object.values(RoundFloat.RoundMethod).includes(method)) {
            throw new Error(`methodはRoundFloat.RoundMethodのいずれかであるべきです。`);
        }
        if (!Object.values(RoundFloat.Overflow).includes(over)) {
            throw new Error(`overはStepFloat.Overflowのいずれかであるべきです。`);
        }
        const scale = 2 ** e;
        this._ = {
            e,
            scale,
            resolution: 1 / scale,
            v: 0,
            method,
            rng: new Range(e, scale, min, max),
            over,
        };
    }

    get min() { return this._.rng.min; }
    get max() { return this._.rng.max; }
    get resolution() { return this._.resolution; }
    get v() { return this._.v; }
    
    // 誤差のある数値をそのまま代入可能（StepFloatとは異なり分解能チェックを行わない）
    set v(x) {
        if (!Number.isFinite(x)) {
            throw new TypeError(`代入値はNumber.isFinite(x)が真を返す値のみ有効です。`);
        }
        this._.v = this._.rng.within(x) ? x : this._.over(this, (x < this._.v), x);
    }

    // 指定した丸め方法で分解能単位に丸められた値を取得
    get rounded() {
        return this._.method(this._.v, this._.scale);
    }

    #count(isDown = false, n=1) {
        if (!Number.isSafeInteger(n)) {throw new TypeError(`nは1以上の安全な整数値であるべきです。`)}
        const nextV = this._.v + (this._.resolution * (isDown ? -n : n));
        return this._.rng.within(nextV) ? (this._.v = nextV) : this._.over(this, isDown, nextV);
    }
    up(n=1) { return this.#count(false, n); }
    down(n=1) { return this.#count(true, n); }
}

// --- 動作検証 ---

const rf = new RoundFloat(2, RoundFloat.RoundMethod.nearest); // e=2 (分解能 0.25), 四捨五入

// 誤差まみれの浮動小数点数を代入してみる
rf.v = 10.3; // 0.25刻みではない誤差を含む値
console.log("生の値 (v):", rf.v); // 10.3
console.log("丸めた値 (rounded):", rf.rounded); // 10.25 (10.3に最も近い0.25刻み)

// 切り捨て(floor)バージョンでも試す
const rfFloor = new RoundFloat(2, RoundFloat.RoundMethod.floor);
rfFloor.v = 10.3;
console.log("切り捨て丸め (rounded):", rfFloor.rounded); // 10.2 (10.25未満の切り捨て)
