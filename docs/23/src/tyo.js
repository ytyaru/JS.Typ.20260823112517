import {Tys} from './tys.js';
import {mkFnObj} from './mk-fn-obj.js';
import {mkErrFnObj} from './mk-err-fn-obj.js';

export class Tyo {
    static get is() { return Tyois; }
    static get er() { return Tyoer; }
}

const TyoisArrFn = mkFnObj(
    v => Tys.name(v).endsWith('ArrowFunction'),
    {
        methods: {
            a: v => 'AsyncArrowFunction' === Tys.name(v),
            s: v => 'ArrowFunction' === Tys.name(v),
        }
    }
);

const TyoisFn = mkFnObj(
    v => {
        const N = Tys.name(v);
        return N.endsWith('Function') || `Bound Native`.split(' ').some(n => N.startsWith(n + 'Function<'));
    },
    {
        getters: { arrow: TyoisArrFn },
        methods: {
            bound: v => Tys.name(v).startsWith(`BoundFunction<`),
            native: v => Tys.name(v).startsWith(`NativeFunction<`),
            a: v => 'AsyncFunction' === Tys.name(v),
            g: v => 'GeneratorFunction' === Tys.name(v),
            ag: v => 'AsyncGeneratorFunction' === Tys.name(v),
            s: v => 'Function' === Tys.name(v),
            anonymous: v => 'AnonymousFunction' === Tys.name(v),
            _some: N => N.endsWith('Function') || `Bound Native`.split(' ').some(n => N.startsWith(n + 'Function<')),
        }
    }
);

const TyoisCls = mkFnObj(
    v => ['','ES5.','Native'].some(n => Tys.name(v).startsWith(`${n}Class<`)),
    {
        methods: {
            es6: v => Tys.name(v).startsWith('Class<'),
            es5: v => Tys.name(v).startsWith('ES5.Class<'),
            native: v => Tys.name(v).startsWith('NativeClass<'),
        }
    }
);

const TyoisIns = mkFnObj(
    (v, C) => ['','ES5.','Native'].some(n => Tys.name(v).startsWith(`${n}Instance<`)) && (C ? v instanceof C : true),
    {
        methods: {
            es6: (v, C) => Tys.name(v).startsWith('Instance<') && (C ? v instanceof C : true),
            es5: (v, C) => Tys.name(v).startsWith('ES5.Instance<') && (C ? v instanceof C : true),
            native: (v, C) => Tys.name(v).startsWith('NativeInstance<') && (C ? v instanceof C : true),
        }
    }
);

const TyoisDesDA = (v, names) => names.map(n => `Descriptor<${n}>`).some(n => n === Tys.name(v));

const TyoisDesD = mkFnObj(
    v => TyoisDesDA(v, 'Value Method'.split(' ')),
    {
        methods: {
            v: v => 'Descriptor<Value>' === Tys.name(v),
            m: v => 'Descriptor<Method>' === Tys.name(v),
        }
    }
);

const TyoisDesA = mkFnObj(
    v => TyoisDesDA(v, 'Getter Setter Accessor'.split(' ')),
    {
        methods: {
            g: v => 'Descriptor<Getter>' === Tys.name(v),
            s: v => 'Descriptor<Setter>' === Tys.name(v),
            a: v => 'Descriptor<Accessor>' === Tys.name(v),
        }
    }
);

const TyoisDes = mkFnObj(
    v => Tys.name(v).startsWith('Descriptor<'),
    {
        getters: { d: TyoisDesD, a: TyoisDesA }
    }
);

const TyoisMd = mkFnObj(
    v => Tys.name(v).endsWith('Method'),
    {
        methods: {
            a: v => 'AsyncMethod' === Tys.name(v),
            g: v => 'GeneratorMethod' === Tys.name(v),
            ag: v => 'AsyncGeneratorMethod' === Tys.name(v),
            s: v => 'Method' === Tys.name(v),
        }
    }
);

const Tyois = mkFnObj(
    v => {
        const N = Tys.name(v);
        return TyoisFn._some(N) || ['Method'].some(n => N.endsWith(n)) || ['PlainObject','Array'].some(n => n === N) || ['Descriptor','Class','Instance'].some(n => N.startsWith(n+'<'));
    },
    {
        getters: { cls: TyoisCls, ins: TyoisIns, des: TyoisDes, fn: TyoisFn, md: TyoisMd },
        methods: {
            obj: v => 'PlainObject' === Tys.name(v),
            ary: v => Array.isArray(v),
        }
    }
);

const Tyoer = mkErrFnObj(Tyois, 'Tyo.is.some(v)');
