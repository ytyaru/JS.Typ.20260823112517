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
            nan: Object.assign(v => Number.isNaN(v), { typeName: 'NaN' }),
            inf: Object.assign(v => [Infinity, -Infinity].some(x => x === v), { typeName: 'Infinity' }),
            pinf: Object.assign(v => Infinity === v, { typeName: 'Infinity' }),
            ninf: Object.assign(v => -Infinity === v, { typeName: '-Infinity' }),
            oint: Object.assign(v => Number.isInteger(v) && !Number.isSafeInteger(v), { typeName: 'Finite' }),
            ofin: Object.assign(v => Number.isFinite(v) && (Number.MAX_SAFE_INTEGER < v || v < Number.MIN_SAFE_INTEGER), { typeName: 'Finite' }),
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
            boxed: Object.assign(v => Tys.name(v).startsWith(`BoxedPrimitive<`), { typeName: 'BoxedPrimitive' }),
            hasNotProto: Object.assign(v => 'HasNotPrototypeObject' === Tys.name(v), { typeName: 'HasNotPrototypeObject' }),
            prototyped: Object.assign(v => 'PrototypedObject' === Tys.name(v), { typeName: 'PrototypedObject' }),
        }
    }
);

export const Tydis = FnObj.mk(
    v => 'und nul'.split(' ').some(n => Tydis[n](v)) || 'num obj'.split(' ').some(n => Tydis[n].some(v)),
    {
        getters: { num: TydisNum, obj: TydisObj },
        methods: {
            und: Object.assign(v => undefined === v, { typeName: 'Undefined' }),
            nul: Object.assign(v => null === v, { typeName: 'Null' }),
        }
    }
);
