import {Tys} from './tys.js';
// Type danger is/error
export class Tyd {
    static get is() {return Tydis}
    static get er() {return Tyder}
}
class Tydis {
    //static some(v) {return 'und nul fn'.split(' ').some(n=>this[n](v)) || 'num obj'.split(' ').some(n=>this[n].some(v));}
    static some(v) {return 'und nul'.split(' ').some(n=>this[n](v)) || 'num obj'.split(' ').some(n=>this[n].some(v));}
    static und(v) {return undefined===v}
    static nul(v) {return null===v}
    static get num() {return TydisNum}
    static get obj() {return TydisObj}
//    static fn(v) {return 'AnonymousFunction'===Tys.name(v)} // 関数またはES5擬似クラスのどちらで使われるか識別不能。`function(){}`だと'AnonymousBlankFunction'で関数なのに、`new (function(){})`だと'ES5.Instance<(Anonymous)>'になる曖昧型。
}
class TydisNum {
    static some(v) {return 'nan inf err'.split(' ').some(n=>this[n](v));}
    static nan(v) {return Number.isNaN(v)}
    static inf(v) {return [Infinity, -Infinity].some(x=>x===v);}
    static pinf(v) {return Infinity===v;}
    static ninf(v) {return -Infinity===v;}
    static oint(v) {return Number.isInteger(v) && !Number.isSafeInteger(v)} // 範囲超過整数。
    //static fin(v) {return Number.isFinite(v)} // 有限数。安全な整数も含む。
    static ofin(v) {return Number.isFinite(v) && Number.MAX_SAFE_INTEGER < v && v < Number.MIN_SAFE_INTEGER;} // 有限数かつ安全範囲超過。
    //static flt(v) {return Number.isFinite(v) && !Number.isInteger(v)} // 不動少数。有限数かつ非整数な値。IEEE754誤差。
    static flt(v,f=1) {return Float.is(v,f)} // 不動少数。有限数かつ非整数な値。IEEE754誤差。
    //static err(v) {return this.ofin(v) || this.flt(v)} // 誤差が発生しうる値。
    static err(v) {return Number.isFinite(v) && !Number.isInteger(v)} // 誤差が発生しうる値。
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
class TydisObj {
    static some(v) {
        const N = Tys.name(v);
        return Tys.name(v).startsWith(`BoxedPrimitive<`) || 'HasNotPrototypeObject PrototypedObject'.split(' ').some(n=>n===N);
    }
    static boxed(v) {return Tys.name(v).startsWith(`BoxedPrimitive<`)}
    static hasNotProto(v) {return 'HasNotPrototypeObject'===Tys.name(v)}
    static prototyped(v) {return 'PrototypedObject'===Tys.name(v)}
    //static some(v) {return 'box hasNotProto builtin prototyped'.split(' ').some(n=>this[n](v));}
    //static boxed(v) {return [Boolean,Number,String].some(C=>v instanceof C)}
//    static builtin(v) {return 'BuiltinObject'===Tys.name(v)}
//        return 'BoxedPrimitive HasNotPrototypeObject BuiltinObject PrototypedObject'.some(n=>n===N);
}
/*
Tyd.is.some(v); // 以下どれか
Tyd.is.und(v); // Undefined
Tyd.is.nul(v); // Null
Tyd.is.nan(v); // NaN
Tyd.is.inf(v); // 無限
Tyd.is.pinf(v); // 正無限
Tyd.is.ninf(v); // 負無限
Tyd.is.num(v); // Number: 非数や無限数（NaN,Infinity,-Infinity）を含む。
Tyd.is.fin(v); // Number: 有限数のみ。
Tyd.is.box(v); // BoxedPrimitive（new Boolean | Number | String の3インスタンス）
Tyd.is.nob(v); // Prototypeが無いObject（Object.create(null)で作成された等）
*/
