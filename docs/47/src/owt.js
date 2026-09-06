//import {tof} from './tof.js';
import {mkErFO} from './fn-obj.js';
import {isT} from './ist.js';
export const owT = 'p d o'.split(' ').map(n=>({n,o:mkErFO(isT[n], `isT.${n}.some`)})).reduce((o,v)=>{o[v.n]=v.o;return o;}, {});
/*
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
//const isT = { p, d, o },
//export owT = { p: mkErFO(isT.p, 'isT.p.some'), d: mkErFO(isT.d, 'isT.d.some'), o: mkErFO(isT.o, 'isT.o.some') };
//export owT = 'p d o'.split(' ').map(n=>[n,mkErFO(isT[n], `isT.${n}.some`)]).reduce((o,v)=>{o[v[0]]=v[1];return o;}, {});
//export { isT, owT };
*/
