import {FnObj} from './fn-obj.js';
export const Typis = FnObj.mk(
    v => 'bln int fin big str sym'.split(' ').some(n => Typis[n](v)),
    {
        methods: {
            bln: Object.assign(v => 'boolean' === typeof v, { typeName: 'Boolean' }),
            int: Object.assign(v => Number.isSafeInteger(v), { typeName: 'Integer' }),
            fin: Object.assign(v => Number.isFinite(v) && v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v, { typeName: 'Finite' }),
            big: Object.assign(v => 'bigint' === typeof v, { typeName: 'BigInt' }),
            str: Object.assign(v => 'string' === typeof v, { typeName: 'String' }),
            sym: Object.assign(v => 'symbol' === typeof v, { typeName: 'Symbol' }),
        }
    }
);
