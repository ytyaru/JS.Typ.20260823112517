import {Tys} from './tys.js';
// Type danger is/error
export class Vp {
    static get is() {return Vpis}
    static get er() {return Vper}
}
class Vpis {
    static get bln() {return VpisBln}
    static get num() {return VpisNum}
    static get big() {return VpisBig}
}
class VpisBln {
    static t(v) {return true===v}
    static f(v) {return false===v}
}
class VpisNum {
    static flt(v,f=1) {return Float.is(v,f)}
    static p2(v, e=1, sign=false) {return NumPowOf2.is(v,e,sign)}
    static u8(v) {return NumPowOf2.is(v, 8)}
    static u16(v) {return NumPowOf2.is(v, 16)}
    static u32(v) {return NumPowOf2.is(v, 32)}
    static i8(v) {return NumPowOf2.is(v, 8, true)}
    static i16(v) {return NumPowOf2.is(v, 16, true)}
    static i32(v) {return NumPowOf2.is(v, 32, true)}
    static within(v,min,max) {
        if (![v,min,max].every(x=>Number.isSafeInteger(x))) {throw new TypeError(`v,min,maxは全て安全な整数であるべきです。`)}
        return min<=v && v<=max;
    }
//    static compare(a,b) {return a===b ? 0 : ((b < a) ? 1 : -1);}
//    static compares(a,...v) {return v.map(x=>this.compare(a,x));}
}
class VpisBig {
    static p2(v, e=1, sign=false) {return BigPowOf2.is(v,e,sign)}
    static u64(v) {return this.p2(v, 64)}
    static u128(v) {return this.p2(v, 128)}
    static u256(v) {return this.p2(v, 256)}
    static i64(v) {return this.p2(v, 64, true)}
    static i128(v) {return this.p2(v, 128, true)}
    static i256(v) {return this.p2(v, 256, true)}
    static within(v,min,max) {
        if (![v,min,max].every(x=>'bigint'===typeof x)) {throw new TypeError(`v,min,maxは全てBigIntであるべきです。`)}
        return min<=v && v<=max;
    }
}
class NumPowOf2 {
    static is(v, e=1, sign=false) {
        const [min,max] = this.range(v,e,sign);
        return v <= min && max <= v;
    }
    static range(v, e=1, sign=false) {
        if ('number'!==typeof v) {throw new TypeError(`vはNumber型であるべきです。`)}
        if (!Number.isSafeInteger(v)) {throw new RangeError(`vは安全な整数値であるべきです。`)}
        if ('number'!==typeof e) {throw new TypeError(`eはNumber型であるべきです。`)}
        if (!Number.isSafeInteger(e) && 0<e && e<54) {throw new RangeError(`eは1〜53の整数値であるべきです。`)}
        if ('boolean'!==typeof sign) {throw new RangeError(`signはBoolean型であるべきです。`)}
        if (sign) return [0, 2**e-1];
        const half = (2**e)/2;
        return [-half, half-1];
    }
}
class BigPowOf2 {
    static is(v, e=1, sign=false) {
        const [min,max] = this.range(v,e,sign);
        return v <= min && max <= v;
    }
    static range(v, e=1, sign=false) {
        if ('bigint'!==typeof v) {throw new TypeError(`vはBigInt型であるべきです。`)}
        if (Number.isSafeInteger(v)) {e=BigInt(e);}
        if ('bigint'!==typeof e) {throw new TypeError(`eはBigInt型かNumber型(安全な整数)であるべきです。`)}
        if (53n<e) {throw new RangeError(`eは54n以上であるべきです。`)}
        if ('boolean'!==typeof sign) {throw new RangeError(`signはBoolean型であるべきです。`)}
        if (sign) return [0n, 2n**e-1n];
        const half = (2n**e)/2n;
        return [-half, half-1n];
    }
}
class Float {
    static is(v,f=1) {
        const [MIN,MAX] = this.getRange(f);
        /*
        console.log(`MIN: `, MIN);
        console.log(`MAX: `, MAX);
        console.log(`Number.isFinite(v): `, Number.isFinite(v));
        console.log(`v <= MAX:`, Number.isFinite(v) && v <= MAX);
        console.log(`MIN <= v:`, Number.isFinite(v) && MIN <= v);
        */
        return Number.isFinite(v) && v <= MAX && MIN <= v;
    }
    static getRange(f) {
        // 引数のバリデーション
        if (!Number.isInteger(f)) {throw new TypeError("小数部の桁数 f はNumber型整数であるべきです。");}
        if (f < 1) {throw new RangeError("小数部の桁数 f は1以上の整数であるべきです。");}
        const maxSafeInt = Number.MAX_SAFE_INTEGER; // 9007199254740991
        const factor = 10 ** f; // 修正箇所
        if (factor > maxSafeInt) {throw new RangeError(`小数部 ${f} 桁は安全な精度限界を超えているため扱えません。`);}
        const max = Math.floor(maxSafeInt / factor);
        const min = -max;
        return [min, max];
    }
}

