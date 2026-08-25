import {Tys} from './tys.js';
// Type danger is/error
export class Tyd {
    static get is() {return Tydis}
    static get er() {return Tyder}
}
class Tydis {
    static some(v) {return 'und nul fn'.split(' ').some(n=>this[n](v)) || 'num obj'.split(' ').some(n=>this[n].some(v));}
    static und(v) {return undefined===v}
    static nul(v) {return null===v}
    static num(v) {return TydisNum}
    static obj(v) {return TydisObj}
    static fn(v) {return 'AnonymousBlankFunction'===Tys.name(v)} // 関数またはES5擬似クラスのどちらで使われるか識別不能
}
class TydisNum {
    static some(v) {return 'nan inf fin'.split(' ').some(n=>this[n](v));}
    static nan(v) {return Number.isNaN(v)}
    static inf(v) {return Number.isInfinite(v)}
    static pinf(v) {return Infinity===v;}
    static ninf(v) {return -Infinity===v;}
    static fin(v) {return !Number.isSafeInteger(v)} // 非整数または整数だが安全範囲超過（浮動小数点数または安全超過整数）
    //static fin(v) {return Number.isFinite(v)} // これだと安全な整数も含んでしまう。それは危険値でない。
}
class TydisObj {
    //static some(v) {return 'box hasNotProto builtin prototyped'.split(' ').some(n=>this[n](v));}
    static some(v) {
        const N = Tys.name(v);
        return 'BoxedPrimitive HasNotPrototypeObject BuiltinObject PrototypedObject'.some(n=>n===N);
    }
    static boxed(v) {return [Boolean,Number,String].some(C=>v instanceof C)}
    static hasNotProto(v) {return 'HasNotPrototypeObject'===Tys.name(v)}
//    static builtin(v) {return 'BuiltinObject'===Tys.name(v)}
    static prototyped(v) {return 'PrototypedObject'===Tys.name(v)}
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
