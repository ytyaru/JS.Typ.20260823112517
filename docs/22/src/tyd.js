import {Tys} from './tys.js';
import {mkFnObj} from './mk-fn-obj.js';
// Type danger is/error
export class Tyd {
    static get is() { return Tydis; }
    static get er() { return Tyder; } // Tyderが未定義の場合は適宜実装してください
}
const TydisNum = mkFnObj(
    v => 'nan inf ofin'.split(' ').some(n => TydisNum[n](v)),
    {
        methods: {
            nan: v => Number.isNaN(v),
            inf: v => [Infinity, -Infinity].some(x => x === v),
            pinf: v => Infinity === v,
            ninf: v => -Infinity === v,
            oint: v => Number.isInteger(v) && !Number.isSafeInteger(v),
            ofin: v => Number.isFinite(v) && (Number.MAX_SAFE_INTEGER < v || v < Number.MIN_SAFE_INTEGER),
        }
    }
);
const TydisObj = mkFnObj(
    v => {
        const N = Tys.name(v);
        return N.startsWith(`BoxedPrimitive<`) || 'HasNotPrototypeObject PrototypedObject'.split(' ').some(n => n === N);
    },
    {
        methods: {
            boxed: v => Tys.name(v).startsWith(`BoxedPrimitive<`),
            hasNotProto: v => 'HasNotPrototypeObject' === Tys.name(v),
            prototyped: v => 'PrototypedObject' === Tys.name(v),
        }
    }
);

const Tydis = mkFnObj(
    v => 'und nul'.split(' ').some(n => Tydis[n](v)) || 'num obj'.split(' ').some(n => Tydis[n].some(v)),
    {
        getters: {
            num: TydisNum,
            obj: TydisObj,
        },
        methods: {
            und: v => undefined === v,
            nul: v => null === v,
        }
    }
);

// Type danger is/error
/*
export class Tyd {
    static get is() {return Tydis}
    static get er() {return Tyder}
}
class Tydis {
    static some(v) {return 'und nul'.split(' ').some(n=>this[n](v)) || 'num obj'.split(' ').some(n=>this[n].some(v));}
    static und(v) {return undefined===v}
    static nul(v) {return null===v}
    static get num() {return TydisNum}
    static get obj() {return TydisObj}
}
class TydisNum {
    static some(v) {return 'nan inf ofin'.split(' ').some(n=>this[n](v));}
    static nan(v) {return Number.isNaN(v)}
    static inf(v) {return [Infinity, -Infinity].some(x=>x===v);}
    static pinf(v) {return Infinity===v;}
    static ninf(v) {return -Infinity===v;}
    static oint(v) {return Number.isInteger(v) && !Number.isSafeInteger(v)} // 範囲超過整数。
    static ofin(v) {return Number.isFinite(v) && (Number.MAX_SAFE_INTEGER < v || v < Number.MIN_SAFE_INTEGER);} // 有限数かつ安全範囲超過。
}
class TydisObj {
    static some(v) {
        const N = Tys.name(v);
        return Tys.name(v).startsWith(`BoxedPrimitive<`) || 'HasNotPrototypeObject PrototypedObject'.split(' ').some(n=>n===N);
    }
    static boxed(v) {return Tys.name(v).startsWith(`BoxedPrimitive<`)}
    static hasNotProto(v) {return 'HasNotPrototypeObject'===Tys.name(v)}
    static prototyped(v) {return 'PrototypedObject'===Tys.name(v)}
}
*/
