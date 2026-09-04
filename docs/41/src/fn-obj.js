import { Tys } from './tys.js';
import { TYPE_NAMES } from './type-names.js';

// path文字列（'p.bln', 'o.cls.es6' 等）からマスターデータのエントリを引くための逆引きマップを自動生成
const PATH_MAP = Object.create(null);
for (const key in TYPE_NAMES) {
    const item = TYPE_NAMES[key];
    PATH_MAP[item.path] = item;
}

// 共通の型名解決ヘルパー
function resolveTypeName(rawPath, v, ...args) {
    const item = PATH_MAP[rawPath];
    if (!item) return rawPath;
    return typeof item.name === 'function' ? item.name(v, ...args) : item.name;
}

export class FnObj {
    static mk(someFn, { getters = {}, methods = {} } = {}) {
        const fn = function(...args) {
            if (new.target) throw new ReferenceError('Constructors are not allowed.');
            return someFn(...args);
        };
        fn.some = fn;
        for (const [key, val] of Object.entries(methods)) {
            fn[key] = val;
        }
        for (const [key, val] of Object.entries(getters)) {
            Object.defineProperty(fn, key, { get: () => val });
        }
        return fn;
    }

    static mkEr(isObj, pathStr, rawPath = null) {
        if (rawPath === null) {
            const m = pathStr.match(/\.([pod])\./);
            rawPath = m ? m[1] : '';
        }

        const someFn = (v, ...args) => {
            if (isObj(v, ...args)) return true;
            const exp = resolveTypeName(rawPath, v, ...args);
            throw new TypeError(`Expected: ${exp}\nActual: ${Tys.name(v)}`);
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

                const nextRawPath = rawPath ? `${rawPath}.${key}` : key;

                if (subKeys.length > 0) {
                    const subPathStr = pathStr.replace(/\.some\(v\)$/, `.${key}.some(v)`);
                    getters[key] = FnObj.mkEr(val, subPathStr, nextRawPath);
                } else {
                    methods[key] = (v, ...args) => {
                        if (val(v, ...args)) return true;
                        const exp = resolveTypeName(nextRawPath, v, ...args);
                        throw new TypeError(`Expected: ${exp}\nActual: ${Tys.name(v)}`);
                    };
                }
            }
        }

        if (typeof isObj._ === 'function') {
            methods._ = (n, v, ...args) => {
                if (isObj[n](v, ...args)) return true;
                const nextRawPath = rawPath ? `${rawPath}.${n}` : n;
                const exp = resolveTypeName(nextRawPath, v, ...args);
                throw new TypeError(`Expected: ${exp}\nActual: ${Tys.name(v)}`);
            };
        }

        return this.mk(someFn, { getters, methods });
    }
}
