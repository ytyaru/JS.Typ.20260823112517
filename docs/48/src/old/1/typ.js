import {FnObj} from './fn-obj.js';
export const Typis = FnObj.mk(
    v => 'bln int fin big str sym'.split(' ').some(n => Typis[n](v)),
    {
        methods: {
            bln: v => 'boolean' === typeof v,
            int: v => Number.isSafeInteger(v),
            fin: v => Number.isFinite(v) && v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v,
            big: v => 'bigint' === typeof v,
            str: v => 'string' === typeof v,
            sym: v => 'symbol' === typeof v,
        }
    }
);
