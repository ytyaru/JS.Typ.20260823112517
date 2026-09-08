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
    #msg(n,v,M) {return 'min'===n ? ({c:(v < M),m:'小',l:'下',o:'上',s:'-'}) : {c:(M < v),m:'大',l:'上',o:'下',s:''}}
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
        stop: (self, isDown, nextV) => (isDown ? self.rng.min : self.rng.max),
        zero: (self, isDown, nextV) => 0,
        reverse: (self, isDown, nextV) => (isDown ? self.rng.max : self.rng.min),
//        stop: (self, isDown, nextV) => (isDown ? self.min : self.max),
//        zero: (self, isDown, nextV) => 0,
//        reverse: (self, isDown, nextV) => (isDown ? self.max : self.min),
    });
    constructor(isThrowNotUnit=false, e, over = SafeFloat.Overflow.throw, v = undefined, min = -Infinity, max = Infinity) {
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
        this.#setInitValue(v);
//        this.#set(0, false); // isDownは不明。
//        if (undefined!==v && !this._.rng.within(0)) {SafeFloat.Overflow.throw(this, false, v)}
//        this._.v = this._.rng.within(0) ? 0 : this._.rng.min;
    }
    #setInitValue(v) {
        this._.v = undefined === v ? (this._.rng.within(0) ? 0 : this._.rng.min) : this.#validInitValue(v);
    }
    #validInitValue(v) {
        this.#validResolutionUnit(v);
        return this._.rng.within(v) ? v : this._.over(this, false, v);
    }
    #validResolutionUnit(x) {if (this.#isThrowNotUnit && !Number.isInteger(x * (this._.scale))) {throw new TypeError(`代入値 ${x} は、現在の分解能 (1 / 2**${this._.e} = ${this.resolution}) の単位に合致しません。`);}}
    get rng() { return this._.rng }
    get resolution() { return this._.resolution; }
    get v() { return this._.v; }
    set v(x) {
        if (!Number.isFinite(x)) { throw new TypeError(`代入値はNumber.isFinite(x)が真を返す値のみ有効です。`); }
        this.#validResolutionUnit(x);
//        if (this.#isThrowNotUnit && !Number.isInteger(x * (this._.scale))) {throw new TypeError(`代入値 ${x} は、現在の分解能 (1 / 2**${this._.e} = ${this.resolution}) の単位に合致しません。`);}
//        this._.v = this._.rng.within(x) ? x : this._.over(this, (x < this._.v), x);
        this.#set(x, (x < this._.v));
    }
    count(n = 1) { return this.#count(true, n < 0, Math.abs(n)); }
    up(n = 1) { return this.#count(false, false, n); }
    down(n = 1) { return this.#count(false, true, n); }
    #count(isCount, isDown = false, n = 1) {
        this.#validateN(n, isCount);
        return this.#set(this._.v + (this._.resolution * (isDown ? -n : n)), isDown);
    }
    #validateN(n, isCount = false) {
        if (!Number.isSafeInteger(n) || (isCount ? n === 0 : n < 1)) {
            const {t,s} = this.#msg(isCount);
            throw new TypeError(`nは${t}の安全な整数であるべきです。${s}`);
        }
    }
    #msg(isCount) {return isCount ? {t:'0以外',s:'（正数ならup, 負数ならdownです）'} : {t:'1以上',s:''}}
    #set(nextV, isDown) {return this._.v = this._.rng.within(nextV) ? nextV : this._.over(this, isDown, nextV)}
//    #set(nextV, isDown) {return this._.v = (this._.rng.within(nextV) ? nextV : this._.over(this, isDown, nextV));}
}
class StepFloat extends SafeFloat {
    constructor(e, over = SafeFloat.Overflow.throw, v = undefined, min = -Infinity, max = Infinity) {
        super(true, e, over, v, min, max);
    }
}
class RoundFloat extends SafeFloat {
    static Method = Object.freeze({
        ...Object.fromEntries(['floor', 'trunc', 'ceil', 'round'].map(name => [
            name, 
            (self) => Math[name](self._.v * self._.scale) / self._.scale
        ])),
        even: (self) => { 
            const scaled = self._.v * self._.scale;
            const t = Math.trunc(scaled);
            const diff = scaled - t;
            if (Math.abs(diff) === 0.5) {
                return (t % 2 === 0 ? t : t + Math.sign(scaled)) / self._.scale;
            }
            return Math.round(scaled) / self._.scale;
        }
    });
    constructor(e, method = RoundFloat.Method.round, over = SafeFloat.Overflow.throw, v = undefined, min = -Infinity, max = Infinity) {
        super(false, e, over, v, min, max);
        if (!Object.values(RoundFloat.Method).includes(method)) {
            throw new Error(`methodはRoundFloat.Methodのいずれかであるべきです。`);
        }
        this._.method = method;
    }
    get raw() {return super.v;} // 分解能の単位でない可能性がある生の数
    set raw(v) {super.v = v;}
    get v() {return this._.method(this);} // 分解能の単位で丸めた数
    set v(v) {throw new TypeError(`代入はrawに対して行ってください。rawは任意値であり、それを内部で丸めた結果をvで取得します。`);}
}
// ヘルパー：オーバーフロー戦略ごとにメソッドを生やすオブジェクトを作る
const createOverflowMethods = (factoryFn) => {
    const obj = {};
    for (const [key, overFn] of Object.entries(SafeFloat.Overflow)) {
        obj[key] = (e, v, min, max) => factoryFn(e, overFn, v, min, max);
    }
    return obj;
};

// float オブジェクトの構築
const createFloatInterface = () => {
    // 1. step のベース関数（デフォルトは throw）
    const stepFn = (e, v, min, max) => new StepFloat(e, SafeFloat.Overflow.throw, v, min, max);
    // step に各オーバーフロー戦略を生やす
    const stepObj = Object.assign(stepFn, createOverflowMethods((e, over, v, min, max) => new StepFloat(e, over, v, min, max)));

    const interfaceObj = { step: stepObj };

    // 2. 丸め系メソッド（floor, trunc, ceil, half, even）
    for (const [methodName, methodFunc] of Object.entries(RoundFloat.Method)) {
        // デフォルトは half / throw
        const defaultOver = SafeFloat.Overflow.throw;
        const defaultMethod = methodFunc;

        const roundFn = (e, v, min, max) => new RoundFloat(e, defaultMethod, defaultOver, v, min, max);
        
        // 各戦略を生やす
        const roundObj = Object.assign(roundFn, createOverflowMethods((e, over, v, min, max) => new RoundFloat(e, defaultMethod, over, v, min, max)));

        interfaceObj[methodName] = roundObj;
    }

    return interfaceObj;
};
export const float = createFloatInterface();
export {StepFloat,RoundFloat}
