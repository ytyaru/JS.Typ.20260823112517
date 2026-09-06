import { Tys } from './tys.js';

// 各パスに対応する型名やリゾルバの定義（従来型）
const TYPE_MAP = {
    'p.bln': 'Boolean',
    'p.int': 'Integer',
    'p.fin': 'Finite',
    'p.big': 'BigInt',
    'p.str': 'String',
    'p.sym': 'Symbol',
    'p': 'Primitive',

    'o.obj': 'PlainObject',
    'o.ary': 'Array',
    'o.fn.arrow.a': 'AsyncArrowFunction',
    'o.fn.arrow.s': 'SyncArrowFunction',
    'o.fn.arrow': 'ArrowFunction',
    'o.fn.bound': 'BoundFunction',
    'o.fn.native': 'NativeFunction',
    'o.fn.a': 'AsyncFunction',
    'o.fn.g': 'GeneratorFunction',
    'o.fn.ag': 'AsyncGeneratorFunction',
    'o.fn.s': 'SyncFunction',
    'o.fn.anonymous': 'AnonymousFunction',
    'o.fn': 'Function',
    
    'o.cls.es6': (v, C) => `ES6.Class<${C?.name || '(Anonymous)'}>`,
    'o.cls.es5': (v, C) => `ES5.Class<${C?.name || '(Anonymous)'}>`,
    'o.cls.native': (v, C) => `NativeClass<${C?.name || ''}>`,
    'o.cls': 'Class',
    
    'o.ins.es6': (v, C) => `ES6.Instance<${C?.name || '(Anonymous)'}>`,
    'o.ins.es5': (v, C) => `ES5.Instance<${C?.name || '(Anonymous)'}>`,
    'o.ins.native': (v, C) => `NativeInstance<${C?.name || ''}>`,
    'o.ins': 'Instance',
    
    'o.des.d.v': 'Descriptor.Data.Value',
    'o.des.d.m': 'Descriptor.Data.Method',
    'o.des.d': 'Descriptor.Data',
    'o.des.a.g': 'Descriptor.Access.Get',
    'o.des.a.s': 'Descriptor.Access.Set',
    'o.des.a.gs': 'Descriptor.Access.GetSet',
    'o.des.a': 'Descriptor.Access',
    'o.des': 'Descriptor',
    
    'o.md.a': 'AsyncMethod',
    'o.md.g': 'GeneratorMethod',
    'o.md.ag': 'AsyncGeneratorMethod',
    'o.md.s': 'Method',
    'o.md': 'Method',
    'o': 'Object',

    'd.und': 'Undefined',
    'd.nul': 'Null',
    'd.num.nan': 'NaN',
    'd.num.inf': 'Infinity',
    'd.num.pinf': 'PositiveInfinity',
    'd.num.ninf': 'NegativeInfinity',
    'd.num.oint': 'OverInteger',
    'd.num.ofin': 'OverFinite',
    'd.num': 'DangerNumber',
    'd.obj.boxed': 'BoxedPrimitive',
    'd.obj.noneProto': 'NonePrototypeObject',
    'd.obj.prototyped': 'PrototypedObject',
    'd.obj': 'DangerObject',
    'd': 'Danger'
};

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
            const resolver = TYPE_MAP[rawPath];
            const exp = typeof resolver === 'function' ? resolver(v, ...args) : (resolver || pathStr);
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
                        const resolver = TYPE_MAP[nextRawPath];
                        const exp = typeof resolver === 'function' ? resolver(v, ...args) : (resolver || val.toString());
                        throw new TypeError(`Expected: ${exp}\nActual: ${Tys.name(v)}`);
                    };
                }
            }
        }

        if (typeof isObj._ === 'function') {
            methods._ = (n, v, ...args) => {
                if (isObj[n](v, ...args)) return true;
                const nextRawPath = rawPath ? `${rawPath}.${n}` : n;
                const resolver = TYPE_MAP[nextRawPath];
                const exp = typeof resolver === 'function' ? resolver(v, ...args) : (resolver || isObj[n].toString());
                throw new TypeError(`Expected: ${exp}\nActual: ${Tys.name(v)}`);
            };
        }

        return this.mk(someFn, { getters, methods });
    }
}
