import {Tys} from './tys.js';

// パスやコンテキストから期待される型名を自動導出するマップ
const ANO = 'Anonymous',
NTV = 'Native',
FN = 'Function',
MD = 'Method',
CLS = 'Class',
INS = 'Instance',
ARW = 'Arrow',
AS = 'Async',
GEN = 'Generator',
DES = 'Descriptor',
OBJ = 'Object',
;
const TYPE_MAP = {
    // Typis (p)
    'p.bln': 'Boolean',
    'p.int': 'Integer',
    'p.fin': 'Finite',
    'p.big': 'BigInt',
    'p.str': 'String',
    'p.sym': 'Symbol',
    'p': 'Primitive',

    // Tyois (o)
    'o.obj': 'PlainObject',
    'o.ary': 'Array',
    'o.fn.arrow.a': 'AsyncArrowFunction',
    'o.fn.arrow.s': 'ArrowFunction',
    'o.fn.arrow': 'ArrowFunction',
    'o.fn.bound': 'BoundFunction',
    'o.fn.native': 'NativeFunction',
    'o.fn.a': 'AsyncFunction',
    'o.fn.g': 'GeneratorFunction',
    'o.fn.ag': 'AsyncGeneratorFunction',
    'o.fn.s': 'Function',
    'o.fn.anonymous': 'AnonymousFunction',
    'o.fn': 'Function',
    //'o.cls.es6': (v, C) => C ? `ES6.Class<${C.name || '(Anonymous)'}>` : 'ES6.Class',
    //'o.cls.es5': (v, C) => C ? `ES5.Class<${C.name || '(Anonymous)'}>` : 'ES5.Class',
    //'o.cls.native': (v, C) => C ? `NativeClass<${C.name || '(Anonymous)'}>` : 'NativeClass',
    'o.cls.es6': (v, C) => 'ES6.Class'+(C ? `<${C.name || '(Anonymous)'}>` : ''})`,
    'o.cls.es5': (v, C) => 'ES5.Class'+`(C ? `<${C.name || '(Anonymous)'}>` : ''}),
    'o.cls.native': (v, C) => 'NativeClass'+(C ? `<${C.name || '(Anonymous)'}>` : ''}),
    'o.cls': 'Class',
    'o.ins.es6': (v, C) => 'ES6.Instance'+(C ? `<${C.name || '(Anonymous)'}>` : ''}),
    'o.ins.es5': (v, C) => 'ES5.Instance'+(C ? `<${C.name || '(Anonymous)'}>` : ''}),
    'o.ins.native': (v, C) => 'NativeInstance'+(C ? `<${C.name || '(Anonymous)'}>` : ''}),
//    'o.ins.es6': (v, C) => C ? `Instance<${C.name || '(Anonymous)'}>` : 'Instance',
//    'o.ins.es5': (v, C) => C ? `ES5.Instance<${C.name || '(Anonymous)'}>` : 'ES5.Instance',
//    'o.ins.native': (v, C) => C ? `NativeInstance<${C.name || '(Anonymous)'}>` : 'NativeInstance',
    'o.ins': 'Instance',
    'o.des.d.v': 'Descriptor<Value>',
    'o.des.d.m': 'Descriptor<Method>',
    'o.des.d': 'Descriptor',
    'o.des.a.g': 'Descriptor<Getter>',
    'o.des.a.s': 'Descriptor<Setter>',
    'o.des.a.a': 'Descriptor<Accessor>',
    'o.des.a': 'Descriptor',
    'o.des': 'Descriptor',
    'o.md.a': 'AsyncMethod',
    'o.md.g': 'GeneratorMethod',
    'o.md.ag': 'AsyncGeneratorMethod',
    'o.md.s': 'Method',
    'o.md': 'Method',
    'o': 'Object',

    // Tydis (d)
    'd.und': 'Undefined',
    'd.nul': 'Null',
    'd.num.nan': 'NaN',
    'd.num.inf': 'Infinity',
    'd.num.pinf': 'Infinity',
    'd.num.ninf': '-Infinity',
    'd.num.oint': 'Finite',
    'd.num.ofin': 'Finite',
    'd.num': 'Number',
    'd.obj.boxed': 'BoxedPrimitive',
    'd.obj.hasNotProto': 'HasNotPrototypeObject',
    'd.obj.prototyped': 'PrototypedObject',
    'd.obj': 'Object',
    'd': 'Data'
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

    static mkEr(isObj, pathStr, rawPath = '') {
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
