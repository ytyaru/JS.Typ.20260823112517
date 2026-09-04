import {Tys} from './tys.js';
import {FnObj} from './fn-obj.js';

const TyoisArrFn = FnObj.mk(
    v => Tys.name(v).endsWith('ArrowFunction'),
    {
        methods: {
            a: Object.assign(v => 'AsyncArrowFunction' === Tys.name(v), { typeName: 'AsyncArrowFunction' }),
            s: Object.assign(v => 'ArrowFunction' === Tys.name(v), { typeName: 'ArrowFunction' }),
        }
    }
);

const TyoisFn = FnObj.mk(
    v => {
        const N = Tys.name(v);
        return N.endsWith('Function') || `Bound Native`.split(' ').some(n => N.startsWith(n + 'Function<'));
    },
    {
        getters: { arrow: TyoisArrFn },
        methods: {
            bound: Object.assign(v => Tys.name(v).startsWith(`BoundFunction<`), { typeName: 'BoundFunction' }),
            native: Object.assign(v => Tys.name(v).startsWith(`NativeFunction<`), { typeName: 'NativeFunction' }),
            a: Object.assign(v => 'AsyncFunction' === Tys.name(v), { typeName: 'AsyncFunction' }),
            g: Object.assign(v => 'GeneratorFunction' === Tys.name(v), { typeName: 'GeneratorFunction' }),
            ag: Object.assign(v => 'AsyncGeneratorFunction' === Tys.name(v), { typeName: 'AsyncGeneratorFunction' }),
            s: Object.assign(v => 'Function' === Tys.name(v), { typeName: 'Function' }),
            anonymous: Object.assign(v => 'AnonymousFunction' === Tys.name(v), { typeName: 'AnonymousFunction' }),
            _some: N => N.endsWith('Function') || `Bound Native`.split(' ').some(n => N.startsWith(n + 'Function<')),
        }
    }
);

const TyoisCls = FnObj.mk(
    v => ['','ES5.','Native'].some(n => Tys.name(v).startsWith(`${n}Class<`)),
    {
        methods: {
            es6: Object.assign((v, C) => Tys.name(v).startsWith('Class<') && (C ? v === C : true), { typeName: (v, C) => C ? `Class<${C.name || '(Anonymous)'}>` : 'Class' }),
            es5: Object.assign((v, C) => Tys.name(v).startsWith('ES5.Class<') && (C ? v === C : true), { typeName: (v, C) => C ? `ES5.Class<${C.name || '(Anonymous)'}>` : 'ES5.Class' }),
            native: Object.assign((v, C) => Tys.name(v).startsWith('NativeClass<') && (C ? v === C : true), { typeName: (v, C) => C ? `NativeClass<${C.name || '(Anonymous)'}>` : 'NativeClass' }),
        }
    }
);

const TyoisIns = FnObj.mk(
    (v, C) => ['','ES5.','Native'].some(n => Tys.name(v).startsWith(`${n}Instance<`)) && (C ? v instanceof C : true),
    {
        methods: {
            es6: Object.assign((v, C) => Tys.name(v).startsWith('Instance<') && (C ? v instanceof C : true), { typeName: (v, C) => C ? `Instance<${C.name || '(Anonymous)'}>` : 'Instance' }),
            es5: Object.assign((v, C) => Tys.name(v).startsWith('ES5.Instance<') && (C ? v instanceof C : true), { typeName: (v, C) => C ? `ES5.Instance<${C.name || '(Anonymous)'}>` : 'ES5.Instance' }),
            native: Object.assign((v, C) => Tys.name(v).startsWith('NativeInstance<') && (C ? v instanceof C : true), { typeName: (v, C) => C ? `NativeInstance<${C.name || '(Anonymous)'}>` : 'NativeInstance' }),
        }
    }
);

const TyoisDesDA = (v, names) => names.map(n => `Descriptor<${n}>`).some(n => n === Tys.name(v));

const TyoisDesD = FnObj.mk(
    v => TyoisDesDA(v, 'Value Method'.split(' ')),
    {
        methods: {
            v: Object.assign(v => 'Descriptor<Value>' === Tys.name(v), { typeName: 'Descriptor<Value>' }),
            m: Object.assign(v => 'Descriptor<Method>' === Tys.name(v), { typeName: 'Descriptor<Method>' }),
        }
    }
);

const TyoisDesA = FnObj.mk(
    v => TyoisDesDA(v, 'Getter Setter Accessor'.split(' ')),
    {
        methods: {
            g: Object.assign(v => 'Descriptor<Getter>' === Tys.name(v), { typeName: 'Descriptor<Getter>' }),
            s: Object.assign(v => 'Descriptor<Setter>' === Tys.name(v), { typeName: 'Descriptor<Setter>' }),
            a: Object.assign(v => 'Descriptor<Accessor>' === Tys.name(v), { typeName: 'Descriptor<Accessor>' }),
        }
    }
);

const TyoisDes = FnObj.mk(
    v => Tys.name(v).startsWith('Descriptor<'),
    {
        getters: { d: TyoisDesD, a: TyoisDesA }
    }
);

const TyoisMd = FnObj.mk(
    v => Tys.name(v).endsWith('Method'),
    {
        methods: {
            a: Object.assign(v => 'AsyncMethod' === Tys.name(v), { typeName: 'AsyncMethod' }),
            g: Object.assign(v => 'GeneratorMethod' === Tys.name(v), { typeName: 'GeneratorMethod' }),
            ag: Object.assign(v => 'AsyncGeneratorMethod' === Tys.name(v), { typeName: 'AsyncGeneratorMethod' }),
            s: Object.assign(v => 'Method' === Tys.name(v), { typeName: 'Method' }),
        }
    }
);

export const Tyois = FnObj.mk(
    v => {
        const N = Tys.name(v);
        return TyoisFn._some(N) || ['Method'].some(n => N.endsWith(n)) || ['PlainObject','Array'].some(n => n === N) || ['Descriptor','Class','Instance'].some(n => N.startsWith(n+'<'));
    },
    {
        getters: { cls: TyoisCls, ins: TyoisIns, des: TyoisDes, fn: TyoisFn, md: TyoisMd },
        methods: {
            obj: Object.assign(v => 'PlainObject' === Tys.name(v), { typeName: 'PlainObject' }),
            ary: Object.assign(v => Array.isArray(v), { typeName: 'Array' }),
        }
    }
);
