class Range {
    #min; #max;
    constructor(e, scale, min, max) {
        const MIN = Number.MIN_SAFE_INTEGER / scale; 
        const MAX = Number.MAX_SAFE_INTEGER / scale;
        this.#valid(min, 'min');
        this.#valid(max, 'max');
        if (max <= min) {throw new RangeError(`min,maxは1以上の差がある小大関係であるべきです。`)}
        this.#range(e, min, min < MIN, 'min', '下', MIN);
        this.#range(e, max, MAX < max, 'max', '上', MAX);
        this.#min = (-Infinity === min ? MIN : min);
        this.#max = ( Infinity === max ? MAX : max);
    }
    #valid(v, n) { if ('number' !== typeof v || Number.isNaN(v)) { throw new TypeError(`${n}はNaN以外のNumberであるべきです。`); } }
    #range(e, v, c, n, l, M) { 
        if (Number.isFinite(v) && c) { 
            throw new RangeError(`${n}が${l}限値を超過しています。分解能指数eが${e}の時${n}の${'min' === n ? '小' : '大'}値は${M}です。これ${'min' === n ? '以上の' : '以下の'}数値にしてください。${l}限値を指定したい時は${'min' === n ? '-' : ''}Infinityにしてください。`); 
        } 
    }
    within(v) { return this.#min <= v && v <= this.#max; }
    get min() { return this.#min; }
    get max() { return this.#max; }
}

// 共通の基底クラス（DRY原則の適用）
class ResolutionFloat {
    constructor(e, min = -Infinity, max = Infinity) {
        if (!(Number.isSafeInteger(e) && (1 <= e && e <= 52))) {
            throw new RangeError(`eは1〜52までの整数値であるべきです。指定値: ${e}`);
        }
        const scale = 2 ** e;
        this._ = {
            e,
            scale,
            resolution: 1 / scale,
            v: 0,
            rng: new Range(e, scale, min, max),
        };
    }
    get min() { return this._.rng.min; }
    get max() { return this._.rng.max; }
    get resolution() { return this._.resolution; }
    get v() { return this._.v; }

    #count(isDown = false, n = 1) {
        if (!Number.isSafeInteger(n)) { throw new TypeError(`nは1以上の安全な整数値であるべきです。`); }
        const nextV = this._.v + (this._.resolution * (isDown ? -n : n));
        return this._.rng.within(nextV) ? (this._.v = nextV) : this.handleOverflow(isDown, nextV);
    }
    up(n = 1) { return this.#count(false, n); }
    down(n = 1) { return this.#count(true, n); }
}

class StepFloat extends ResolutionFloat {
    static Overflow = Object.freeze({
        throw: (self, isDown, nextV) => { 
            throw new RangeError(`値範囲超過。期待値: ${self.min}〜${self.max} 実際値:${nextV}`); 
        },
        ignore: (self, isDown, nextV) => self._.v,
        stop: (self, isDown, nextV) => self._.v = (isDown ? self.min : self.max),
        zero: (self, isDown, nextV) => self._.v = 0,
        reverse: (self, isDown, nextV) => self._.v = isDown ? self.max : self.min,
    });

    constructor(e, over = StepFloat.Overflow.throw, min = -Infinity, max = Infinity) {
        super(e, min, max);
        if (!Object.values(StepFloat.Overflow).includes(over)) {
            throw new Error(`overはStepFloat.Overflowのいずれかであるべきです。`);
        }
        this._.over = over;
    }

    handleOverflow(isDown, nextV) {
        return this._.over(this, isDown, nextV);
    }

    set v(x) {
        if (!Number.isFinite(x)) { throw new TypeError(`代入値はNumber.isFinite(x)が真を返す値のみ有効です。`); }
        if (!Number.isInteger(x * this._.scale)) { 
            throw new TypeError(`代入値 ${x} は、現在の分解能の単位に合致しません。`); 
        }
        this._.v = this._.rng.within(x) ? x : this._.over(this, (x < this._.v), x);
    }
}

class RoundFloat extends ResolutionFloat {
    static RoundMethod = Object.freeze({
        floor: (v, scale) => Math.floor(v * scale) / scale,
        trunc: (v, scale) => Math.trunc(v * scale) / scale,
        ceil: (v, scale) => Math.ceil(v * scale) / scale,
        round: (v, scale) => Math.round(v * scale) / scale, // 四捨五入
        even: (v, scale) => { // 偶数丸め（銀行家丸め）
            const scaled = v * scale;
            const t = Math.trunc(scaled);
            const diff = scaled - t;
            if (Math.abs(diff) === 0.5) {
                return (t % 2 === 0 ? t : t + Math.sign(scaled)) / scale;
            }
            return Math.round(scaled) / scale;
        }
    });

    constructor(e, method = RoundFloat.RoundMethod.round, min = -Infinity, max = Infinity) {
        super(e, min, max);
        if (!Object.values(RoundFloat.RoundMethod).includes(method)) {
            throw new Error(`methodはRoundFloat.RoundMethodのいずれかであるべきです。`);
        }
        this._.method = method;
    }

    // RoundFloatでは範囲超過は例外にする（勝手に広げない）
    handleOverflow(isDown, nextV) {
        throw new RangeError(`値範囲超過。期待値: ${this.min}〜${this.max} 実際値:${nextV}`);
    }

    set v(x) {
        if (!Number.isFinite(x)) { throw new TypeError(`代入値はNumber.isFinite(x)が真を返す値のみ有効です。`); }
        if (!this._.rng.within(x)) {
            throw new RangeError(`代入値が許容範囲を超えています。範囲: ${this.min} 〜 ${this.max}, 入力値: ${x}`);
        }
        this._.v = x; // 誤差のある数値をそのまま許容して保持
    }

    get rounded() {
        return this._.method(this._.v, this._.scale);
    }
}

// --- 動作検証 ---

const rf = new RoundFloat(2, RoundFloat.RoundMethod.round); // e=2 (分解能 0.25), 四捨五入
rf.v = 10.3; // 誤差を含む値を代入
console.log("生の値 (v):", rf.v); // 10.3
console.log("丸めた値 (rounded):", rf.rounded); // 10.25

// 範囲外の代入はエラーになることのテスト
try {
    rf.v = 10000; 
} catch (e) {
    console.log("期待通りの範囲外エラー:", e.message);
}
