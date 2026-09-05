const mkFO = (someFn, mds) => {
    return function(...args) {
        if (new.target) throw new ReferenceError('Constructors are not allowed.');
        someFn(...args); // 実行内容
        // 子セット
        this.some = someFn;
        for (let [k,v] of Object.entries(mds)) {this[k]=v;}
    }
};
const mkErFO = (fo, pathStr) => {
    const someFn = (v, ...args) => {
        if (fo(v, ...args)) return true;
        throw new TypeError(`Expected: a value that makes '${pathStr}' return true.\nActual: ${Tys.name(v)}`);
    };
    const props = {}; // 
//    const methods = {};
//    const getters = {};
    for (const key of Object.getOwnPropertyNames(fo)) {
        if (['some', '_some', '_', 'length', 'name', 'prototype', 'caller', 'arguments'].includes(key)) continue;
        const val = fo[key];
        if (typeof val === 'function') {
            const subKeys = Object.getOwnPropertyNames(val).filter(
                k => !['length', 'name', 'prototype', 'caller', 'arguments'].includes(k)
            );
            if (subKeys.length > 0) {
                const subPathStr = pathStr.replace(/\.some\(v\)$/, `.${key}.some(v)`);
                //getters[key] = mkErFO(val, subPathStr);
                props[key] = mkErFO(val, subPathStr);
            } else {
                //methods[key] = (v, ...args) => {
                props[key] = (v, ...args) => {
                    if (val(v, ...args)) return true;
                    throw new TypeError(`Expected: '${val.toString()}' like value.\nActual: ${Tys.name(v)}`);
                };
            }
        }
    }
    /*
    //if (typeof isObj._ === 'function') {
    if (typeof fo._ === 'function') {
        props._ = (n, v, ...args) => {
            if (fo[n](v, ...args)) return true;
            throw new TypeError(`Expected: '${isObj[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
        };
    }
    */
    return mkFO(someFn, props);
};
const isFn = N=>N.endsWith('Function') || `Bound Native`.split(' ').some(n => N.startsWith(n + 'Function<'));
const p = mkFO(
    v => 'bln int fin big str sym'.split(' ').some(n=>p[n](v)),
    {
        bln: v => 'boolean' === typeof v,
        int: v => Number.isSafeInteger(v),
        fin: v => Number.isFinite(v) && v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v,
        big: v => 'bigint' === typeof v,
        str: v => 'string' === typeof v,
        sym: v => 'symbol' === typeof v,
    });
const d = mkFO(
    v => 'und nul'.split(' ').some(n => d[n](v)) || 'num obj'.split(' ').some(n => d[n].some(v)),
    {
        und: v => undefined === v,
        nul: v => null === v,
    });
const o = mkFO(
    v => {
        const N = Tys.name(v);
        return isFn(N) || N.endsWith('Method') || ['PlainObject','Array'].some(n => n === N) || ['Descriptor','Class','Instance'].some(n => N.startsWith(n+'<'));
        //return TyoisFn._some(N) || ['Method'].some(n => N.endsWith(n)) || ['PlainObject','Array'].some(n => n === N) || ['Descriptor','Class','Instance'].some(n => N.startsWith(n+'<'));
    },
    {
        obj: v => 'PlainObject' === Tys.name(v),
        ary: v => Array.isArray(v),
//        getters: { cls: TyoisCls, ins: TyoisIns, des: TyoisDes, fn: TyoisFn, md: TyoisMd },
    });
o.cls = mkFO(
    v => ['','ES5.','Native'].some(n => Tys.name(v).startsWith(`${n}Class<`)),
//    v => ['ES6.','ES5.','Native'].some(n => Tys.name(v).startsWith(`${n}Class<`)),
    {
//        es6: v => Tys.name(v).startsWith('ES6.Class<'),
        es6: v => Tys.name(v).startsWith('Class<'),
        es5: v => Tys.name(v).startsWith('ES5.Class<'),
        native: v => Tys.name(v).startsWith('NativeClass<'),
    });
o.ins = mkFO(
    (v, C) => {
        const N = Tys.name(v);
        return ['','ES5.','Native'].some(n => N.startsWith(`${n}Instance<`)) && (C ? v instanceof C : true);
    },
//    (v, C) => ['','ES5.','Native'].some(n => Tys.name(v).startsWith(`${n}Instance<`)) && (C ? v instanceof C : true),
//  (v, C) => ['ES6.','ES5.','Native'].some(n => Tys.name(v).startsWith(`${n}Instance<`)) && (C ? v instanceof C : true),
    {
        methods: {
            es6: (v, C) => Tys.name(v).startsWith('Instance<') && (C ? v instanceof C : true),
//            es6: (v, C) => Tys.name(v).startsWith('ES6.Instance<') && (C ? v instanceof C : true),
            es5: (v, C) => Tys.name(v).startsWith('ES5.Instance<') && (C ? v instanceof C : true),
            native: (v, C) => Tys.name(v).startsWith('NativeInstance<') && (C ? v instanceof C : true),
        }
    });
o.des = mkFO(v => Tys.name(v).startsWith('Descriptor<'));
const isDes = (N,ns) => ns.some(n=>N===`Descriptor<${n}>`);
o.des.d = mkFO(
    v => isDes(Tys.name(v),['Value','Method']),
    {
        v: v => 'Descriptor<Value>' === Tys.name(v),
        m: v => 'Descriptor<Method>' === Tys.name(v),
    }),
o.des.a = mkFO(
    v => isDes(Tys.name(v),['Getter','Setter','Accessor']),
    {
        g: v => 'Descriptor<Getter>' === Tys.name(v),
        s: v => 'Descriptor<Setter>' === Tys.name(v),
        a: v => 'Descriptor<Accessor>' === Tys.name(v),
        //gs: v => 'Descriptor<Accessor>' === Tys.name(v),
    });
o.fn = mkFO(
    v => isFn(Tys.name(v)),
//    v => {
//        const N = Tys.name(v);
//        return N.endsWith('Function') || `Bound Native`.split(' ').some(n => N.startsWith(n + 'Function<'));
//    },
    {
        bound: v => Tys.name(v).startsWith(`BoundFunction<`),
        native: v => Tys.name(v).startsWith(`NativeFunction<`),
        a: v => 'AsyncFunction' === Tys.name(v),
        g: v => 'GeneratorFunction' === Tys.name(v),
        ag: v => 'AsyncGeneratorFunction' === Tys.name(v),
        s: v => 'Function' === Tys.name(v),
//        s: v => 'SyncFunction' === Tys.name(v),
        anonymous: v => 'AnonymousFunction' === Tys.name(v),
//        _some: N => N.endsWith('Function') || `Bound Native`.split(' ').some(n => N.startsWith(n + 'Function<')),
    });
o.fn.arrow = mkFO(
    v => Tys.name(v).endsWith('ArrowFunction'),
    {
        a: v => 'AsyncArrowFunction' === Tys.name(v),
        s: v => 'ArrowFunction' === Tys.name(v),
        //s: v => 'SyncArrowFunction' === Tys.name(v),
    });
o.md = mkFO(
    v => Tys.name(v).endsWith('Method'),
    {
        //s: v => 'SyncMethod' === Tys.name(v),
        s: v => 'Method' === Tys.name(v),
        a: v => 'AsyncMethod' === Tys.name(v),
        g: v => 'GeneratorMethod' === Tys.name(v),
        ag: v => 'AsyncGeneratorMethod' === Tys.name(v),
    });
d.num = mkFO(
    v => 'nan inf ofin'.split(' ').some(n => d.num[n](v)),
    {
        nan: v => Number.isNaN(v),
        inf: v => [Infinity, -Infinity].some(x => x === v),
        pinf: v => Infinity === v,
        ninf: v => -Infinity === v,
        oint: v => Number.isInteger(v) && !Number.isSafeInteger(v),
        ofin: v => Number.isFinite(v) && (Number.MAX_SAFE_INTEGER < v || v < Number.MIN_SAFE_INTEGER),
    });
d.obj = mkFO(
    v => {
        const N = Tys.name(v);
        return N.startsWith(`BoxedPrimitive<`) || 'NonePrototypeObject PrototypedObject'.split(' ').some(n => n === N);
    },
    {
        boxed: v => Tys.name(v).startsWith(`BoxedPrimitive<`),
        //hasNotProto: v => 'HasNotPrototypeObject' === Tys.name(v),
        noneProto: v => 'NonePrototypeObject' === Tys.name(v),
        prototyped: v => 'PrototypedObject' === Tys.name(v),
    });
const isT = {p,d,o},
owT = {p:mkErFO(p,'p.some'), d:mkErFO(d,'d.some'), o:mkErFO(o,'o.some')};
export {isT,owT};
