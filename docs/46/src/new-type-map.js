//import { Tys } from './tys.js';
import {tof} from './tof.js';
const mkFO = (full, abbr, someFn, children = {}, path = {full:'',abbr:''}) => {
    // 戻り値となる関数本体
    const fn = function(v, ...args) {
        if (new.target) throw new ReferenceError('Constructors are not allowed.');
        return someFn(v, ...args);
    };
    // 隠しプロパティ_に型名をセットする
    fn._ = {name:{full, abbr}, path}
    // someFn 自身を .some として保持
    fn.some = someFn;

    // 子のメソッド群をバインドして割り当て
    for (const [k, v] of Object.entries(children)) {
        // ここでネスト構造を処理したい
        // vは配列のはず。第三引数が存在し、かつオブジェクトなら再帰する（childrenを第三引数にして）
        // 第三引数が存在しなければ再帰する（childrenなし）
        // どちらの場合もkをabbrとしてセットする。
        // 尚、full, abbrは先祖の名前を.で追加していく。
        if (!Array.isArray(v)) {throw new Error(``)}
        if (v.length < 2) {throw new Error(``)}
        fn[k] = mkFO(v[0], k, v[1], (2===v.length ? {} : v[2]), {full:fn._.path.full+'.'+full, abbr:fn._.path.abbr+'.'+abbr})
    }
    return fn;
};
const mkErFO = (fo, pathStr) => {
    const someFn = (v, ...args) => {
        if (fo.some(v, ...args)) return true;
        //throw new TypeError(`Expected: a value that makes '${pathStr}' return true.\nActual: ${tof(v)}`);
        //throw new TypeError(`Expected: a value that makes '${pathStr}(v)' return true.\nActual: ${tof(v)}`);
        throw new TypeError(`Expected: ${fo._.name.full} (${fo._.name.abbr})\nActual: ${tof(v)}`);
    };

    const props = {};
    
    for (const key of Object.getOwnPropertyNames(fo)) {
        if (['some', 'length', 'name', 'prototype', 'caller', 'arguments'].includes(key)) continue;
        const val = fo[key];
        
        if (typeof val === 'function') {
            const subKeys = Object.getOwnPropertyNames(val).filter(
                k => !['some', 'length', 'name', 'prototype', 'caller', 'arguments'].includes(k)
            );
            
            // 子がさらに子を持つ場合（ネスト構造）または mkFO で作られた関数階層の場合
            if (subKeys.length > 0 || typeof val.some === 'function') {
                const subPathStr = pathStr.replace(/\.some$/, `.${key}.some`);
                props[key] = mkErFO(val, subPathStr);
            } else {
                props[key] = (v, ...args) => {
                    if (val(v, ...args)) return true;
//                    throw new TypeError(`Expected: '${val.toString()}' like value.\nActual: ${tof(v)}`);
                    throw new TypeError(`Expected: ${fo._.name.full} (${fo._.name.abbr})\nActual: ${tof(v)}`);
                };
            }
        }
    }

    return mkFO(someFn, props);
};

// 全名, 短縮名, some系処理, 子の4引数
const p = mkFO('Primitive', 'p',
    v => 'bln int fin big str sym'.split(' ').some(n => p[n](v)), {
    bln: ['Boolean', v => 'boolean' === typeof v)],
    int: ['Integer', v => Number.isSafeInteger(v)],
    fin: ['Finite', v => Number.isFinite(v) && v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v),
    big: ['BigInt', v => 'bigint' === typeof v),
    str: ['String', v => 'string' === typeof v),
    sym: ['Symbol', v => 'symbol' === typeof v),
});
//const isSafeNum = v => (v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v);
const isOverNum = v => (Number.MAX_SAFE_INTEGER < v || v < Number.MIN_SAFE_INTEGER);
const d = mkFO('Danger', 'd', // 短縮名 mkFOは短縮名が必要
    v => 'p o'.split(' ').some(n => d[n](v)), {
    p: ['Primitive', 
        v => 'und nul'.split(' ').some(n => d[n](v)) || 'num obj'.split(' ').some(n => d[n].some(v)), {
        und: ['Undefined', v => undefined === v)],
        nul: ['Null', v => null === v)],
        num: ['Number', v=>'nan inf over'.split(' ').some(n=>d.p.num[n](v)), {
            nan: ['NaN', v => Number.isNaN(v)],
            inf: ['Infinity',v=>[Infinity, -Infinity].some(x => x === v),{
                p: ['Positive', v => Infinity === v],
                n: ['Negative', v => -Infinity === v],
            }],
            over: ['Over',v=>Number.isFinite(v) && isOverNum(v),{
                int: ['Integer', v=>Number.isInteger(v) && !Number.isSafeInteger(v)],
                flt: ['Float', v=>Number.isFinite(v) && !Number.isInteger(v) && isOverNum(v)],
            }]
        }],
    }],
    o: ['Object', v=>{
        const N = tof(v);
        return N.startsWith(`BoxedPrimitive<`) || 'NonePrototypeObject PrototypedObject'.split(' ').some(n => n === N);
        }, {
            box: ['BoxedPrimitive', v=>[Boolean,Number,String].some(C=>v instanceof C), {
                bln: ['Boolean', v=>v instanceof Boolean],
                num: ['Number', v=>v instanceof Number],
                str: ['String', v=>v instanceof String],
            }],
            none: ['NonePrototype', v=>'NonePrototypeObject'===tof(v)],
            proto: ['Prototyped', v=>'PrototypedObject'===tof(v)]
    }],
]);
const isDes = (N, ns) => ns.some(n => N === `Descriptor<${n}>`);
const isCI = (p, b, N) => N.startsWith(`${p}${b}<`);
const isIns = (p, C, N) => isCI(p,'Instance',N) && (C ? v instanceof C : true);
const isCls = (p, N) => isCI(p,'Class',N);
const o = mkFO('Object', 'o', // 短縮名 mkFOは短縮名が必要
    v => {
        const N = tof(v);
        return isFn(N) || N.endsWith('Method') || ['PlainObject', 'Array'].some(n => n === N) || ['Descriptor', 'Class', 'Instance'].some(n => N.startsWith(n + '<'));
    }, {
    obj: ['Plain', v => 'PlainObject' === tof(v)],
    ary: ['Array', v => Array.isArray(v)],
    des: ['Descriptor', v=>isDes(tof(v), ['Value', 'Method', 'Getter', 'Setter', 'Accessor']), {
        d: ['Data', v=>isDes(tof(v), ['Value', 'Method'], {
            v: ['Value', v=>isDes(tof(v), ['Value'])],
            m: ['Method', v=>isDes(tof(v), ['Method'])],
        }],
        a: ['Access', v=>isDes(tof(v), ['Getter', 'Setter', 'Accessor'], {
            g: ['Value', v=>isDes(tof(v), ['Getter'])],
            s: ['Method', v=>isDes(tof(v), ['Setter'])],
            gs: ['Accessor', v=>isDes(tof(v), ['Accessor'])],
        }],
    }],
    ins: ['Instance', (v,C)=>{
        const N = tof(v);
        return ['', 'ES5.', 'Native'].some(p=>isIns(p,C,N))
        }, {
        es6: ['ES6', (v,C)=>isIns('',C,tof(v))],
        es5: ['ES5', (v,C)=>isIns('ES5.',C,tof(v))],
        native: ['Native', (v,C)=>isIns('Native',C,tof(v))],
    }],
    cls: ['Class', v=>{
        const N = tof(v);
        return ['', 'ES5.', 'Native'].some(p=>isCls(p,N));
        }, {
        es6: ['ES6', v=>isCls('',tof(v))],
        es5: ['ES5', v=>isCls('ES5.',tof(v))],
        native: ['Native', v=>isCls('Native',tof(v))],
    }],
//    ins: ['Instance', (v,C)=>['', 'ES5.', 'Native'].some(n => tof(v).startsWith(`${n}Instance<`) && (C ? v instanceof C : true)), {
//        es6: ['ES6', v=>tof(v).startsWith('Instance<') && (C ? v instanceof C : true)],
//        es5: ['ES5', v=>tof(v).startsWith('ES5.Instance<') && (C ? v instanceof C : true)],
//        native: ['Native', v=>tof(v).startsWith('NativeInstance<') && (C ? v instanceof C : true)],
//    }],
//    cls: ['Class', v=>['', 'ES5.', 'Native'].some(n => tof(v).startsWith(`${n}Class<`)), {
//        es6: ['ES6', v=>tof(v).startsWith('Class<')],
//        es5: ['ES5', v=>tof(v).startsWith('ES5.Class<')],
//        native: ['Native', v=>tof(v).startsWith('NativeClass<')],
//    }],
    md: [],
    fn: [],
});
o.cls = mkFO(
    v => ['', 'ES5.', 'Native'].some(n => tof(v).startsWith(`${n}Class<`)),
    {
        es6: v => tof(v).startsWith('Class<'),
        es5: v => tof(v).startsWith('ES5.Class<'),
        native: v => tof(v).startsWith('NativeClass<'),
    }
);

o.ins = mkFO(
    (v, C) => {
        const N = tof(v);
        return ['', 'ES5.', 'Native'].some(n => N.startsWith(`${n}Instance<`)) && (C ? v instanceof C : true);
    },
    {
        es6: (v, C) => tof(v).startsWith('Instance<') && (C ? v instanceof C : true),
        es5: (v, C) => tof(v).startsWith('ES5.Instance<') && (C ? v instanceof C : true),
        native: (v, C) => tof(v).startsWith('NativeInstance<') && (C ? v instanceof C : true),
    }
);


o.des.d = mkFO(
    v => isDes(tof(v), ['Value', 'Method']),
    {
        v: v => 'Descriptor<Value>' === tof(v),
        m: v => 'Descriptor<Method>' === tof(v),
    }
);


/*
const mkFO = (someFn, mds = {}) => {
    // 戻り値となる関数本体
    const fn = function(v, ...args) {
        if (new.target) throw new ReferenceError('Constructors are not allowed.');
        return someFn(v, ...args);
    };
    
    // someFn 自身を .some として保持
    fn.some = someFn;

    // 子のメソッド群をバインドして割り当て
    for (const [k, v] of Object.entries(mds)) {
        fn[k] = v;
    }

    return fn;
};

const mkErFO = (fo, pathStr) => {
    const someFn = (v, ...args) => {
        if (fo.some(v, ...args)) return true;
        //throw new TypeError(`Expected: a value that makes '${pathStr}' return true.\nActual: ${tof(v)}`);
        throw new TypeError(`Expected: a value that makes '${pathStr}(v)' return true.\nActual: ${tof(v)}`);
    };

    const props = {};
    
    for (const key of Object.getOwnPropertyNames(fo)) {
        if (['some', 'length', 'name', 'prototype', 'caller', 'arguments'].includes(key)) continue;
        const val = fo[key];
        
        if (typeof val === 'function') {
            const subKeys = Object.getOwnPropertyNames(val).filter(
                k => !['some', 'length', 'name', 'prototype', 'caller', 'arguments'].includes(k)
            );
            
            // 子がさらに子を持つ場合（ネスト構造）または mkFO で作られた関数階層の場合
            if (subKeys.length > 0 || typeof val.some === 'function') {
                const subPathStr = pathStr.replace(/\.some$/, `.${key}.some`);
                props[key] = mkErFO(val, subPathStr);
            } else {
                props[key] = (v, ...args) => {
                    if (val(v, ...args)) return true;
                    throw new TypeError(`Expected: '${val.toString()}' like value.\nActual: ${tof(v)}`);
                };
            }
        }
    }

    return mkFO(someFn, props);
};

const isFn = N => N.endsWith('Function') || `Bound Native`.split(' ').some(n => N.startsWith(n + 'Function<'));

const p = mkFO(
    v => 'bln int fin big str sym'.split(' ').some(n => p[n](v)),
    {
        bln: v => 'boolean' === typeof v,
        int: v => Number.isSafeInteger(v),
        fin: v => Number.isFinite(v) && v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v,
        big: v => 'bigint' === typeof v,
        str: v => 'string' === typeof v,
        sym: v => 'symbol' === typeof v,
    }
);

const d = mkFO(
    v => 'und nul'.split(' ').some(n => d[n](v)) || 'num obj'.split(' ').some(n => d[n].some(v)),
    {
        und: v => undefined === v,
        nul: v => null === v,
    }
);

const o = mkFO(
    v => {
        const N = tof(v);
        return isFn(N) || N.endsWith('Method') || ['PlainObject', 'Array'].some(n => n === N) || ['Descriptor', 'Class', 'Instance'].some(n => N.startsWith(n + '<'));
    },
    {
        obj: v => 'PlainObject' === tof(v),
        ary: v => Array.isArray(v),
    }
);

o.cls = mkFO(
    v => ['0', 'ES5.', 'Native'].some(n => tof(v).startsWith(`${n === '0' ? '' : n}Class<`)),
    {
        es6: v => tof(v).startsWith('Class<'),
        es5: v => tof(v).startsWith('ES5.Class<'),
        native: v => tof(v).startsWith('NativeClass<'),
    }
);

o.ins = mkFO(
    (v, C) => {
        const N = tof(v);
        return ['', 'ES5.', 'Native'].some(n => N.startsWith(`${n}Instance<`)) && (C ? v instanceof C : true);
    },
    {
        es6: (v, C) => tof(v).startsWith('Instance<') && (C ? v instanceof C : true),
        es5: (v, C) => tof(v).startsWith('ES5.Instance<') && (C ? v instanceof C : true),
        native: (v, C) => tof(v).startsWith('NativeInstance<') && (C ? v instanceof C : true),
    }
);

o.des = mkFO(v => tof(v).startsWith('Descriptor<'));
const isDes = (N, ns) => ns.some(n => N === `Descriptor<${n}>`);

o.des.d = mkFO(
    v => isDes(tof(v), ['Value', 'Method']),
    {
        v: v => 'Descriptor<Value>' === tof(v),
        m: v => 'Descriptor<Method>' === tof(v),
    }
);

o.des.a = mkFO(
    v => isDes(tof(v), ['Getter', 'Setter', 'Accessor']),
    {
        g: v => 'Descriptor<Getter>' === tof(v),
        s: v => 'Descriptor<Setter>' === tof(v),
        a: v => 'Descriptor<Accessor>' === tof(v),
    }
);

o.fn = mkFO(
    v => isFn(tof(v)),
    {
        bound: v => tof(v).startsWith(`BoundFunction<`),
        native: v => tof(v).startsWith(`NativeFunction<`),
        a: v => 'AsyncFunction' === tof(v),
        g: v => 'GeneratorFunction' === tof(v),
        ag: v => 'AsyncGeneratorFunction' === tof(v),
        s: v => 'Function' === tof(v),
        anonymous: v => 'AnonymousFunction' === tof(v),
    }
);

o.fn.arrow = mkFO(
    v => tof(v).endsWith('ArrowFunction'),
    {
        a: v => 'AsyncArrowFunction' === tof(v),
        s: v => 'ArrowFunction' === tof(v),
    }
);

o.md = mkFO(
    v => tof(v).endsWith('Method'),
    {
        s: v => 'Method' === tof(v),
        a: v => 'AsyncMethod' === tof(v),
        g: v => 'GeneratorMethod' === tof(v),
        ag: v => 'AsyncGeneratorMethod' === tof(v),
    }
);

d.num = mkFO(
    v => 'nan inf ofin'.split(' ').some(n => d.num[n](v)),
    {
        nan: v => Number.isNaN(v),
        inf: v => [Infinity, -Infinity].some(x => x === v),
        pinf: v => Infinity === v,
        ninf: v => -Infinity === v,
        oint: v => Number.isInteger(v) && !Number.isSafeInteger(v),
        ofin: v => Number.isFinite(v) && (Number.MAX_SAFE_INTEGER < v || v < Number.MIN_SAFE_INTEGER),
    }
);

d.obj = mkFO(
    v => {
        const N = tof(v);
        return N.startsWith(`BoxedPrimitive<`) || 'NonePrototypeObject PrototypedObject'.split(' ').some(n => n === N);
    },
    {
        boxed: v => tof(v).startsWith(`BoxedPrimitive<`),
        noneProto: v => 'NonePrototypeObject' === tof(v),
        prototyped: v => 'PrototypedObject' === tof(v),
    }
);

const isT = { p, d, o },
      owT = { p: mkErFO(p, 'isT.p.some'), d: mkErFO(d, 'isT.d.some'), o: mkErFO(o, 'isT.o.some') };

export { isT, owT };
*/
