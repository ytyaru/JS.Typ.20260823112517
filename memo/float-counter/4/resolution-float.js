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
    get min() { return this._min; } // 内部参照用（修正：#min）
    get max() { return this._max; }
}
class ResolutionFloat {
    #isThrowNotUnit;
    static Overflow = Object.freeze({
        throw: (self, isDown, nextV) => { 
            throw new RangeError(`値範囲超過。期待値: ${self.min}〜${self.max} 実際値:${nextV}`); 
        },
        ignore: (self, isDown, nextV) => self._.v,
        stop: (self, isDown, nextV) => self._.v = (isDown ? self.min : self.max),
        zero: (self, isDown, nextV) => self._.v = 0,
        reverse: (self, isDown, nextV) => self._.v = isDown ? self.max : self.min,
    });
    constructor(isThrowNotUnit=false, e, over = ResolutionFloat.Overflow.throw, min = -Infinity, max = Infinity) {
        this.#isThrowNotUnit = isThrowNotUnit;
        if (!(Number.isSafeInteger(e) && (1 <= e && e <= 52))) {
            throw new RangeError(`eは1〜52までの整数値であるべきです。指定値: ${e}`);
        }
        if (!Object.values(ResolutionFloat.Overflow).includes(over)) {
            throw new Error(`overはResolutionFloat.Overflowのいずれかであるべきです。`);
        }
        const scale = 2 ** e;
        this._ = {
            e,
            scale,
            resolution: 1 / scale,
            v: 0,
            rng: new Range(e, scale, min, max),
            over,
            ,
        };
    }
    get min() { return this._.rng.min; }
    get max() { return this._.rng.max; }
    get resolution() { return this._.resolution; }
    get v() { return this._.v; }
    set v(x) {
        if (!Number.isFinite(x)) { throw new TypeError(`代入値はNumber.isFinite(x)が真を返す値のみ有効です。`); }
        if (this.#isThrowNotUnit && !Number.isInteger(x * this._.scale)) { 
            throw new TypeError(`代入値 ${x} は、現在の分解能の単位に合致しません。`); 
        }
        this._.v = this._.rng.within(x) ? x : this._.over(this, (x < this._.v), x);
    }
    #count(isDown = false, n = 1) {
        if (!Number.isSafeInteger(n)) { throw new TypeError(`nは1以上の安全な整数値であるべきです。`); }
        const nextV = this._.v + (this._.resolution * (isDown ? -n : n));
        return this._.rng.within(nextV) ? (this._.v = nextV) : this._.over(this, isDown, nextV);
    }
    up(n = 1) { return this.#count(false, n); }
    down(n = 1) { return this.#count(true, n); }
}
class StepFloat extends ResolutionFloat {
    constructor(e, over = ResolutionFloat.Overflow.throw, min = -Infinity, max = Infinity) {
        super(true, e, over, min, max);
    }
}
class RoundFloat extends ResolutionFloat {
    static Method = Object.freeze({
        floor: (v, scale) => Math.floor(v * scale) / scale,
        trunc: (v, scale) => Math.trunc(v * scale) / scale,
        ceil: (v, scale) => Math.ceil(v * scale) / scale,
        round: (v, scale) => Math.round(v * scale) / scale,
        even: (v, scale) => { 
            const scaled = v * scale;
            const t = Math.trunc(scaled);
            const diff = scaled - t;
            if (Math.abs(diff) === 0.5) {
                return (t % 2 === 0 ? t : t + Math.sign(scaled)) / scale;
            }
            return Math.round(scaled) / scale;
        }
    });
    constructor(e, method = RoundFloat.Method.round, over = ResolutionFloat.Overflow.throw, min = -Infinity, max = Infinity) {
        super(false, e, over, min, max);
        if (!Object.values(RoundFloat.Method).includes(method)) {
            throw new Error(`methodはRoundFloat.Methodのいずれかであるべきです。`);
        }
        this._.method = method;
    }
    get rounded() {return this._.method(this._.v, this._.scale);}
}
