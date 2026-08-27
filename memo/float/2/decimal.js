class Decimal {
    constructor(fig=1, i=0, f=0) {
        this._{fig, i, f};
    }
    get fig() {return this._.fig}
    set fig(v) {
        if (!(Number.isSafeInteger(v) && 0 < v)) {throw new TypeError(`figは1以上のNumber型整数であるべきです。`)}
        this._.fig
    }
    get i() {return this._.i}
    get f() {return this._.f}
}
class DecimalNumber {
    constructor(fig=1, i=0, f=0) {
        this._{fig, i, f, min:Number.MIN_SAFE_INTEGER, max:Number.MAX_SAFE_INTEGER};
    }
    get fig() {return this._.fig}
    set fig(v) {
        if ('number'!==typeof v) {throw new TypeError(`figはNumberであるべきです。`)}
        if (!(Number.isSafeInteger(v) && 0 < v)) {throw new RangeError(`figは1以上のNumber型整数であるべきです。`)}
        this._.fig
    }
    get i() {return this._.i}
    get f() {return this._.f}
    get v() {return this._.v}
    set v(x) {
        
    }
}
class DecimalBigInt {
    constructor(fig=1n, i=0n, f=0n) {
        this._{fig, i, f};
    }
    get fig() {return this._.fig}
    set fig(v) {
        if ('bigint'!==typeof v) {throw new TypeError(`figはBigIntであるべきです。`)}
        if (v <= 0n) {throw new RangeError(`figは1以上のBigInt型整数であるべきです。`)}
        this._.fig
    }
    get i() {return this._.i}
    get f() {return this._.f}
}
