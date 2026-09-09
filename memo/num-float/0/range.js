class Range {
    #min; #max;
    constructor(min, max, MIN, MAX) {
        this.#valid(min, 'min');
        this.#valid(max, 'max');
        if (max <= min) {throw new RangeError(`min,maxは1以上の差がある小大関係であるべきです。`)}
        this.#min = (-Infinity === min ? MIN : min);
        this.#max = ( Infinity === max ? MAX : max);
    }
    #valid(v, n) { if ('number' !== typeof v || Number.isNaN(v)) { throw new TypeError(`${n}はNaN以外のNumberであるべきです。`); } }
    get min() { return this.#min; }
    get max() { return this.#max; }
    within(v) { return this.#min <= v && v <= this.#max; }
    throw(v) {
        Range.throwFin(v);
        if (!this.within(v)) {throw new RangeError(`値v ${v} は範囲外です。min:${this.#min}, max: ${this.#min}`)}
    }
    static throwFin(v) {if(!Number.isFinite(v)){throw new TypeError(`値v ${v} はNumber.isFinite(v)が真を返す値であるべきです。`)}}
}

