import {Tys} from './tys.js';
import {FnObj} from './fn-obj.js';

const TyoisArrFn = FnObj.mk(
    v => Tys.name(v).endsWith('ArrowFunction'),
    {
        methods: {
            a: v => 'AsyncArrowFunction' === Tys.name(v),
            s: v => 'SyncArrowFunction' === Tys.name(v),
        }
    }
);

const TyoisFn = FnObj.mk(
    v => {
        const N = Tys.name(v);
        return N.endsWith('Function') || `Bound Native`.split(' ').some(n => N.startsWith(n + 'Function<'));
//        return N.endsWith('Function') || N === 'Function' || N.includes('Function<');
    },
    {
        getters: { arrow: TyoisArrFn },
        methods: {
            bound: v => Tys.name(v).startsWith(`BoundFunction<`),
            native: v => Tys.name(v).startsWith(`NativeFunction<`),
            a: v => 'AsyncFunction' === Tys.name(v),
            g: v => 'GeneratorFunction' === Tys.name(v),
            ag: v => 'AsyncGeneratorFunction' === Tys.name(v),
            //s: v => 'Function' === Tys.name(v),
            s: v => 'SyncFunction' === Tys.name(v),
            anonymous: v => 'AnonymousFunction' === Tys.name(v),
            _some: N => N.endsWith('Function') || `Bound Native`.split(' ').some(n => N.startsWith(n + 'Function<')),
//            _some: N => N.endsWith('Function') || N === 'Function' || N.includes('Function<'),
        }
    }
);

const TyoisCls = FnObj.mk(
    //v => ['','ES5.','Native'].some(n => Tys.name(v).startsWith(`${n}Class<`)),
    v => ['ES6.','ES5.','Native'].some(n => Tys.name(v).startsWith(`${n}Class<`)),
    {
        methods: {
            //es6: v => Tys.name(v).startsWith('Class<'),
            es6: v => Tys.name(v).startsWith('ES6.Class<'),
            es5: v => Tys.name(v).startsWith('ES5.Class<'),
            native: v => Tys.name(v).startsWith('NativeClass<'),
        }
    }
);

const TyoisIns = FnObj.mk(
    //(v, C) => ['','ES5.','Native'].some(n => Tys.name(v).startsWith(`${n}Instance<`)) && (C ? v instanceof C : true),
    (v, C) => ['ES6.','ES5.','Native'].some(n => Tys.name(v).startsWith(`${n}Instance<`)) && (C ? v instanceof C : true),
    {
        methods: {
            //es6: (v, C) => Tys.name(v).startsWith('Instance<') && (C ? v instanceof C : true),
            es6: (v, C) => Tys.name(v).startsWith('ES6.Instance<') && (C ? v instanceof C : true),
            es5: (v, C) => Tys.name(v).startsWith('ES5.Instance<') && (C ? v instanceof C : true),
            native: (v, C) => Tys.name(v).startsWith('NativeInstance<') && (C ? v instanceof C : true),
        }
    }
);

/*
const TyoisDesDA = (v, names) => names.map(n => `Descriptor<${n}>`).some(n => n === Tys.name(v));

const TyoisDesD = FnObj.mk(
    v => TyoisDesDA(v, 'Value Method'.split(' ')),
    {
        methods: {
            v: v => 'Descriptor<Value>' === Tys.name(v),
            m: v => 'Descriptor<Method>' === Tys.name(v),
        }
    }
);

const TyoisDesA = FnObj.mk(
    v => TyoisDesDA(v, 'Getter Setter Accessor'.split(' ')),
    {
        methods: {
            g: v => 'Descriptor<Getter>' === Tys.name(v),
            s: v => 'Descriptor<Setter>' === Tys.name(v),
            //a: v => 'Descriptor<Accessor>' === Tys.name(v),
            gs: v => 'Descriptor<Accessor>' === Tys.name(v),
        }
    }
);
*/
// Descriptor.Data系
const TyoisDesD = FnObj.mk(
    v => Tys.name(v).startsWith('Descriptor.Data.'),
    {
        methods: {
            v: v => 'Descriptor.Data.Value' === Tys.name(v),
            m: v => 'Descriptor.Data.Method' === Tys.name(v),
        }
    }
);

// Descriptor.Access系
const TyoisDesA = FnObj.mk(
    v => Tys.name(v).startsWith('Descriptor.Access.'),
    {
        methods: {
            g: v => 'Descriptor.Access.Get' === Tys.name(v),
            s: v => 'Descriptor.Access.Set' === Tys.name(v),
            gs: v => 'Descriptor.Access.GetSet' === Tys.name(v),
        }
    }
);

const TyoisDes = FnObj.mk(
    //v => Tys.name(v).startsWith('Descriptor<'),
    v => Tys.name(v).startsWith('Descriptor.'),
    {
        getters: { d: TyoisDesD, a: TyoisDesA }
    }
);

const TyoisMd = FnObj.mk(
//    v => Tys.name(v).endsWith('Method'),
    v => {
        const N = Tys.name(v);
        // Descriptor 内の Method や、そもそも Descriptor であるものを除外する
        return N.endsWith('Method') && !N.startsWith('Descriptor.');
//        return (N.endsWith('Method') || N === 'Method' || N.includes('Method')) && !N.startsWith('Descriptor.');
    },
/*
*/
//    v => /^(?:Sync|Async|Generator|AsyncGenerator)?Method$/.test(Tys.name(v)),
    {
        methods: {
            a: v => 'AsyncMethod' === Tys.name(v),
            g: v => 'GeneratorMethod' === Tys.name(v),
            ag: v => 'AsyncGeneratorMethod' === Tys.name(v),
            s: v => 'SyncMethod' === Tys.name(v),
            //s: v => 'Method' === Tys.name(v),
        }
    }
);

export const Tyois = FnObj.mk(
    v => {
        const N = Tys.name(v);
        //return TyoisFn._some(N) || ['Method'].some(n => N.endsWith(n)) || ['PlainObject','Array'].some(n => n === N) || ['Descriptor','Class','Instance'].some(n => N.startsWith(n+'<'));
        //return TyoisFn._some(N) || ['Method'].some(n => N.endsWith(n)) || ['PlainObject','Array'].some(n => n === N) || N.startsWith('Descriptor') || /^(?:ES5.\|ES6.\|Native)?(Class|Instance)\b/.test(N);
        //return TyoisFn._some(N) || (N.endsWith('Method') && !N.startsWith('Descriptor.')) || ['PlainObject','Array'].some(n => n === N) || N.startsWith('Descriptor') || /^(?:ES5.\|ES6.\|Native)?(Class|Instance)\b/.test(N);
        return TyoisFn._some(N) ||
            (N.endsWith('Method') && !N.startsWith('Descriptor.')) ||
            ['PlainObject','Array'].some(n => n === N) ||
            N.startsWith('Descriptor') ||
            ['ES6.', 'ES5.', 'Native'].some(n => N.startsWith(`${n}Class<`) || N.startsWith(`${n}Instance<`));
    },
    {
        getters: { cls: TyoisCls, ins: TyoisIns, des: TyoisDes, fn: TyoisFn, md: TyoisMd },
        methods: {
            obj: v => 'PlainObject' === Tys.name(v),
            ary: v => Array.isArray(v),
        }
    }
);

