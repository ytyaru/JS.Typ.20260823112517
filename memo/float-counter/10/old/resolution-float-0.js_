class Range {
    #min; #max;
    constructor(e, scale, min, max) {
        const MIN = Number.MIN_SAFE_INTEGER / scale; 
        const MAX = Number.MAX_SAFE_INTEGER / scale;
        this.#valid(min, 'min');
        this.#valid(max, 'max');
        if (max <= min) {throw new RangeError(`min,maxは1以上の差がある小大関係であるべきです。`)}
        this.#range('min', e, min, MIN);
        this.#range('max', e, max, MAX);
        this.#min = (-Infinity === min ? MIN : min);
        this.#max = ( Infinity === max ? MAX : max);
    }
    #valid(v, n) { if ('number' !== typeof v || Number.isNaN(v)) { throw new TypeError(`${n}はNaN以外のNumberであるべきです。`); } }
    #range(n, e, v, M) { 
        const {c,m,l,o,s} = this.#msg(n,v,M);
        if (Number.isFinite(v) && c) { 
            throw new RangeError(`${n}が${l}限値を超過しています。分解能指数eが${e}の時${n}の${m}値は${M}です。これ$以{o}の数値にしてください。${l}限値を指定したい時は${s}Infinityにしてください。`); 
        } 
    }
    #msg(n,v,M) {return 'min'===n ? ({c:(min < MIN),m:'小',l:'下',o:'上',s:'-'}) : {c:(MAX < max),m:'大',l:'上',o:'下',s:''}
    /*
    #msg(n,v,M) {return {
        c: 'min'===n ? (min < MIN) : (MAX < max),
        m: 'min'===n ? '小' : '大',
        l: 'min'===n ? '下' : '上',
        o: 'min'===n ? '上' : '下',
        s: 'min'===n ? '-' : '',
    }}
    */
    within(v) { return this.#min <= v && v <= this.#max; }
    get min() { return this.#min; }
    get max() { return this.#max; }
}
class SafeFloat {
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
    constructor(isThrowNotUnit=false, e, over = SafeFloat.Overflow.throw, min = -Infinity, max = Infinity) {
        this.#isThrowNotUnit = isThrowNotUnit;
        if (!(Number.isSafeInteger(e) && (1 <= e && e <= 52))) {
            throw new RangeError(`eは1〜52までの整数値であるべきです。指定値: ${e}`);
        }
        if (!Object.values(SafeFloat.Overflow).includes(over)) {
            throw new Error(`overはSafeFloat.Overflowのいずれかであるべきです。`);
        }
        const scale = 2 ** e;
        this._ = {
            e,
            scale,
            resolution: 1 / scale,
            v: 0,
            rng: new Range(e, scale, min, max),
            over,
        };
    }
    get rng() { return this._.rng }
    get resolution() { return this._.resolution; }
    get v() { return this._.v; }
    set v(x) {
        if (!Number.isFinite(x)) { throw new TypeError(`代入値はNumber.isFinite(x)が真を返す値のみ有効です。`); }
        if (this.#isThrowNotUnit && !Number.isInteger(x * (this._.scale))) {throw new TypeError(`代入値 ${x} は、現在の分解能 (1 / 2**${this._.e} = ${this.resolution}) の単位に合致しません。`);}
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
class StepFloat extends SafeFloat {
    constructor(e, over = SafeFloat.Overflow.throw, min = -Infinity, max = Infinity) {
        super(true, e, over, min, max);
    }
}
class RoundFloat extends SafeFloat {
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
    constructor(e, method = RoundFloat.Method.round, over = SafeFloat.Overflow.throw, min = -Infinity, max = Infinity) {
        super(false, e, over, min, max);
        if (!Object.values(RoundFloat.Method).includes(method)) {
            throw new Error(`methodはRoundFloat.Methodのいずれかであるべきです。`);
        }
        this._.method = method;
    }
    get rounded() {return this._.method(this._.v, this._.scale);}
}
export {StepFloat,RoundFloat}
