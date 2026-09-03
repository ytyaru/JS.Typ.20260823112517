import {Tys} from './tys.js';
import {FnObj} from './fn-obj.js';

export class Tyd {
    static get is() { return Tydis; }
    static get er() { return Tyder; }
}

const TydisNum = FnObj.mk(
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

const TydisObj = FnObj.mk(
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

export const Tydis = FnObj.mk(
    v => 'und nul'.split(' ').some(n => Tydis[n](v)) || 'num obj'.split(' ').some(n => Tydis[n].some(v)),
    {
        getters: { num: TydisNum, obj: TydisObj },
        methods: {
            und: v => undefined === v,
            nul: v => null === v,
        }
    }
);

