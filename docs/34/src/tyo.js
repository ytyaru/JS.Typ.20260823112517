//import {Tys} from './tys.js';
import {tof} from './tof.js';
import {FnObj} from './fn-obj.js';

const TyoisArrFn = FnObj.mk(
    v => tof(v).endsWith('ArrowFunction'),
    {
        methods: {
            a: v => 'AsyncArrowFunction' === tof(v),
            s: v => 'ArrowFunction' === tof(v),
        }
    }
);

const TyoisFn = FnObj.mk(
    v => {
        const N = tof(v);
        return N.endsWith('Function') || `Bound Native`.split(' ').some(n => N.startsWith(n + 'Function<'));
    },
    {
        getters: { arrow: TyoisArrFn },
        methods: {
            bound: v => tof(v).startsWith(`BoundFunction<`),
            native: v => tof(v).startsWith(`NativeFunction<`),
            a: v => 'AsyncFunction' === tof(v),
            g: v => 'GeneratorFunction' === tof(v),
            ag: v => 'AsyncGeneratorFunction' === tof(v),
            s: v => 'Function' === tof(v),
            anonymous: v => 'AnonymousFunction' === tof(v),
            _some: N => N.endsWith('Function') || `Bound Native`.split(' ').some(n => N.startsWith(n + 'Function<')),
        }
    }
);

const TyoisCls = FnObj.mk(
    v => ['','ES5.','Native'].some(n => tof(v).startsWith(`${n}Class<`)),
    {
        methods: {
            es6: v => tof(v).startsWith('Class<'),
            es5: v => tof(v).startsWith('ES5.Class<'),
            native: v => tof(v).startsWith('NativeClass<'),
        }
    }
);

const TyoisIns = FnObj.mk(
    (v, C) => ['','ES5.','Native'].some(n => tof(v).startsWith(`${n}Instance<`)) && (C ? v instanceof C : true),
    {
        methods: {
            es6: (v, C) => tof(v).startsWith('Instance<') && (C ? v instanceof C : true),
            es5: (v, C) => tof(v).startsWith('ES5.Instance<') && (C ? v instanceof C : true),
            native: (v, C) => tof(v).startsWith('NativeInstance<') && (C ? v instanceof C : true),
        }
    }
);

const TyoisDesDA = (v, names) => names.map(n => `Descriptor<${n}>`).some(n => n === tof(v));

const TyoisDesD = FnObj.mk(
    v => TyoisDesDA(v, 'Value Method'.split(' ')),
    {
        methods: {
            v: v => 'Descriptor<Value>' === tof(v),
            m: v => 'Descriptor<Method>' === tof(v),
        }
    }
);

const TyoisDesA = FnObj.mk(
    v => TyoisDesDA(v, 'Getter Setter Accessor'.split(' ')),
    {
        methods: {
            g: v => 'Descriptor<Getter>' === tof(v),
            s: v => 'Descriptor<Setter>' === tof(v),
            a: v => 'Descriptor<Accessor>' === tof(v),
        }
    }
);

const TyoisDes = FnObj.mk(
    v => tof(v).startsWith('Descriptor<'),
    {
        getters: { d: TyoisDesD, a: TyoisDesA }
    }
);

const TyoisMd = FnObj.mk(
    v => tof(v).endsWith('Method'),
    {
        methods: {
            a: v => 'AsyncMethod' === tof(v),
            g: v => 'GeneratorMethod' === tof(v),
            ag: v => 'AsyncGeneratorMethod' === tof(v),
            s: v => 'Method' === tof(v),
        }
    }
);

export const Tyois = FnObj.mk(
    v => {
        const N = tof(v);
        return TyoisFn._some(N) || ['Method'].some(n => N.endsWith(n)) || ['PlainObject','Array'].some(n => n === N) || ['Descriptor','Class','Instance'].some(n => N.startsWith(n+'<'));
    },
    {
        getters: { cls: TyoisCls, ins: TyoisIns, des: TyoisDes, fn: TyoisFn, md: TyoisMd },
        methods: {
            obj: v => 'PlainObject' === tof(v),
            ary: v => Array.isArray(v),
        }
    }
);

