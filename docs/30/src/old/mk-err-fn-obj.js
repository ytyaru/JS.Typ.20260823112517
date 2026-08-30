import {Tys} from './tys.js';
import {mkFnObj} from './mk-fn-obj.js';

export function mkErrFnObj(isObj, pathStr) {
    const someFn = (v, ...args) => {
        if (isObj(v, ...args)) return true;
        throw new TypeError(`Expected: a value that makes '${pathStr}' return true.\nActual: ${Tys.name(v)}`);
    };

    const methods = {};
    const getters = {};

    for (const key of Object.getOwnPropertyNames(isObj)) {
        if (['some', '_some', '_', 'length', 'name', 'prototype', 'caller', 'arguments'].includes(key)) continue;

        const val = isObj[key];
        if (typeof val === 'function') {
            const subKeys = Object.getOwnPropertyNames(val).filter(
                k => !['length', 'name', 'prototype', 'caller', 'arguments'].includes(k)
            );

            if (subKeys.length > 0) {
                const subPathStr = pathStr.replace(/\.some\(v\)$/, `.${key}.some(v)`);
                getters[key] = mkErrFnObj(val, subPathStr);
            } else {
                methods[key] = (v, ...args) => {
                    if (val(v, ...args)) return true;
                    throw new TypeError(`Expected: '${val.toString()}' like value.\nActual: ${Tys.name(v)}`);
                };
            }
        }
    }

    if (typeof isObj._ === 'function') {
        methods._ = (n, v, ...args) => {
            if (isObj[n](v, ...args)) return true;
            throw new TypeError(`Expected: '${isObj[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
        };
    }

    return mkFnObj(someFn, { getters, methods });
}
