class Range {
    #min; #max; #isFloat;
    constructor(min=-Infinity, max=Infinity, MIN=undefined, MAX=undefined, isFloat=false) {
        this.#isFloat = 'boolean'===typeof isFloat ? isFloat : false;
        MIN = Number.isFinite(MIN) ? MIN : Number.MIN_SAFE_INTEGER;
        MAX = Number.isFinite(MAX) ? MAX : Number.MAX_SAFE_INTEGER;
        if (MAX <= MIN) {throw new RangeError(`MIN,MAXは1以上の差がある小大関係であるべきです。`)}
        this.#valid(min, 'min');
        this.#valid(max, 'max');
        if (max <= min) {throw new RangeError(`min,maxは1以上の差がある小大関係であるべきです。`)}
        this.#min = (-Infinity === min ? MIN : min);
        this.#max = ( Infinity === max ? MAX : max);
    }
    #valid(v, n) { if ('number' !== typeof v || Number.isNaN(v)) { throw new TypeError(`${n}はNaN以外のNumberであるべきです。`); } }
    get min() { return this.#min; }
    get max() { return this.#max; }
//    within(v) { return (this.#isFloat ? Number.isFinite(v) : Number.isSafeInteger(v)) &&  (this.#min <= v && v <= this.#max); }
    within(v) { return Number[`is${this.#isFloat ? 'Finite' : 'SafeInteger'}`](v) && (this.#min<=v && v<=this.#max); }
    throw(v) {
        Range.throwFin(v);
        if (!this.within(v)) {throw new RangeError(`値v ${v} は範囲外です。min:${this.#min}, max: ${this.#max}`)}
        return v;
    }
    static isFin(v) {return Number.isFinite(v)}
    static isInt(v) {return Number.isSafeInteger(v)}
    static throwFin(v) {
        if(!Number.isFinite(v)){throw new TypeError(`値v ${v} はNumber.isFinite(v)が真を返す値であるべきです。`)}
        return v;
    }
    static throwInt(v) {
        if(!Number.isSafeInteger(v)){throw new TypeError(`値v ${v} はNumber.isSafeInteger(v)が真を返す値であるべきです。`)}
        return v;
    }
}

