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
SY = 'Sync',
GEN = 'Generator',
DES = 'Descriptor',
O = 'Object',
P = 'Primitive',
DGR = 'Danger',
PT = 'rototype';
const CINm = (i,k,C) => i+k+(C ? `<${C.name || '('+ANO+')'}>` : '');
//const CNm = (n,C) => CINm(n,CLS);
//const INm = (n,C) => CINm(n,INS);
const CNm = (n,C) => CINm(n,CLS,C);
const INm = (n,C) => CINm(n,INS,C);
const DNm = (k,i='') => DES+`${k}${i}`;
const DDNm = (i) => DNm('.Data',i);
const DANm = (i) => DNm('.Access',i);
const TYPE_MAP = {
    // Typis (p)
    'p.bln': 'Boolean',
    'p.int': 'Integer',
    'p.fin': 'Finite',
    'p.big': 'BigInt',
    'p.str': 'String',
    'p.sym': 'Symbol',
    'p': P,

    // Tyois (o)
    'o.obj': 'Plain'+O,
    'o.ary': 'Array',
    'o.fn.arrow.a': AS+ARW+FN, // 'AsyncArrowFunction'
    'o.fn.arrow.s': SY+ARW+FN, // 'SyncArrowFunction'
    'o.fn.arrow': ARW+FN,// 'ArrowFunction'
    'o.fn.bound': 'Bound'+FN,//'BoundFunction',
    'o.fn.native': NTV+FN,//'NativeFunction',
    'o.fn.a': AS+FN,//'AsyncFunction',
    'o.fn.g': GEN+FN,//'GeneratorFunction',
    'o.fn.ag': AS+GEN+FN,//'AsyncGeneratorFunction',
    'o.fn.s': FN,//'Function',
    'o.fn.anonymous': ANO+FN,//'AnonymousFunction',
    'o.fn': FN,//'Function',
    'o.cls.es6': (v, C) => CNm('ES6.',C),
    'o.cls.es5': (v, C) => CNm('ES5.',C),
    'o.cls.native': (v, C) => CNm(NTV,C),
    'o.cls': CLS,
    'o.ins.es6': (v, C) => INm('ES6.',C),
    'o.ins.es5': (v, C) => INm('ES5.',C),
    'o.ins.native': (v, C) => INm(NTV,C),
    'o.ins': INS,
    // Descriptor.(Data|Access).(Value|Method|Get|Set|GetSet)
    'o.des.d.v': DDNm('.Value'),
    'o.des.d.m': DDNm('.Method'),
    'o.des.d': DDNm(),
    'o.des.a.g': DANm('.Get'),//'Descriptor.Access.Get',
    'o.des.a.s': DANm('.Set'),//'Descriptor.Access.Set',
    //'o.des.a.a': DANm('.GetSet'),//'Descriptor.Access.GetSet',
    'o.des.a.gs': DANm('.GetSet'),//'Descriptor.Access.GetSet',
    'o.des.a': DANm(),//'Descriptor.Access',
    'o.des': DES, // 'Descriptor'
    'o.md.a': AS+MD,//'AsyncMethod',
    'o.md.g': GEN+MD,//'GeneratorMethod',
    'o.md.ag': AS+GEN+MD,//'AsyncGeneratorMethod',
    'o.md.s': SY+MD,//'Method',
    'o.md': MD,//'Method',
    'o': O,//'Object',

    // Tydis (d)
    'd.und': 'Undefined',
    'd.nul': 'Null',
    'd.num.nan': 'NaN',
    'd.num.inf': 'Infinity',
    'd.num.pinf': 'PositiveInfinity',
    'd.num.ninf': 'NegativeInfinity',
    'd.num.oint': 'OverInteger',
    'd.num.ofin': 'OverFinite',
    'd.num': DGR+'Number',
    'd.obj.boxed': 'Boxed'+P,
    //'d.obj.hasNotProto': 'HasNotP'+PT+O,
    'd.obj.noneProto': 'NoneP'+PT+O,
    'd.obj.prototyped': 'P'+PT+'d'+O,
    'd.obj': DGR+O,
    'd': DGR
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
        // pathStr (例: 'isT.p.some(v)') から自動で初期 rawPath ('p') を割り出す
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
