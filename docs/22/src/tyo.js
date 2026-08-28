import {Tys} from './tys.js';
import {mkFnObj} from './mk-fn-obj.js';
// --- Type Object is/error ---
export class Tyo {
    static get is() { return Tyois; }
    static get er() { return Tyoer; }
}

// --- Tyois (is) ---
const TyoisArrFn = mkFnObj(
    v => Tys.name(v).endsWith('ArrowFunction'),
    {
        methods: {
            some: v => Tys.name(v).endsWith('ArrowFunction'),
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
        getters: {
            arrow: TyoisArrFn,
        },
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
        getters: {
            d: TyoisDesD,
            a: TyoisDesA,
        }
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
        getters: {
            cls: TyoisCls,
            ins: TyoisIns,
            des: TyoisDes,
            fn: TyoisFn,
            md: TyoisMd,
        },
        methods: {
            obj: v => 'PlainObject' === Tys.name(v),
            ary: v => Array.isArray(v),
        }
    }
);


// --- Tyoer (Error) ---
const TyoerArrFn = mkFnObj(
    v => {
        if (TyoisArrFn.some(v)) return true;
        throw new TypeError(`Expected: a value that makes 'Tyo.is.fn.arrow.some(v)' return true.\nActual: ${Tys.name(v)}`);
    },
    {
        methods: {
            a: v => TyoerArrFn._('a', v),
            s: v => TyoerArrFn._('s', v),
            _:(n, v) => TyoisArrFn[n](v) || (() => { throw new TypeError(`Expected: '${TyoisArrFn[n].toString()}' like value.\nActual: ${Tys.name(v)}`); })()
        }
    }
);

const TyoerFn = mkFnObj(
    v => {
        if (TyoisFn.some(v)) return true;
        throw new TypeError(`Expected: a value that makes 'Tyo.is.fn.some(v)' return true.\nActual: ${Tys.name(v)}`);
    },
    {
        getters: {
            arrow: TyoerArrFn,
        },
        methods: {
            bound: v => TyoerFn._('bound', v),
            native: v => TyoerFn._('native', v),
            a: v => TyoerFn._('a', v),
            g: v => TyoerFn._('g', v),
            ag: v => TyoerFn._('ag', v),
            s: v => TyoerFn._('s', v),
            anonymous: v => TyoerFn._('anonymous', v),
            _:(n, v) => TyoisFn[n](v) || (() => { throw new TypeError(`Expected: '${TyoisFn[n].toString()}' like value.\nActual: ${Tys.name(v)}`); })()
        }
    }
);

const TyoerCls = mkFnObj(
    v => {
        if (TyoisCls.some(v)) return true;
        throw new TypeError(`Expected: a value that makes 'Tyo.is.cls.some(v)' return true.\nActual: ${Tys.name(v)}`);
    },
    {
        methods: {
            es6: v => TyoerCls._('es6', v),
            es5: v => TyoerCls._('es5', v),
            native: v => TyoerCls._('native', v),
            _:(n, v) => TyoisCls[n](v) || (() => { throw new TypeError(`Expected: '${Tyois.cls[n].toString()}' like value.\nActual: ${Tys.name(v)}`); })()
        }
    }
);

const TyoerIns = mkFnObj(
    (v, C) => {
        if (TyoisIns.some(v)) return true;
        throw new TypeError(`Expected: a value that makes 'Tyo.is.ins.some(v)' return true.\nActual: ${Tys.name(v)}`);
    },
    {
        methods: {
            es6: (v, C) => TyoerIns._('es6', v, C),
            es5: (v, C) => TyoerIns._('es5', v, C),
            native: (v, C) => TyoerIns._('native', v, C),
            _:(n, v, C) => TyoisIns[n](v, C) || (() => { throw new TypeError(`Expected: '${Tyois.ins[n].toString()}' like value.\nActual: ${Tys.name(v)}`); })()
        }
    }
);

const TyoerDesDA = (v, n, names) => {
    const N = Tys.name(v);
    if (names.map(name => `Descriptor<${name}>`).some(name => name === N)) return true;
    throw new TypeError(`Expected: a value that makes 'Tyo.is.des.${n}.some(v)' return true.\nActual: ${Tys.name(v)}`);
};

const TyoerDesD = mkFnObj(
    v => TyoerDesDA(v, 'd', 'Value Method'.split(' ')),
    {
        methods: {
            v: v => TyoerDesD._('v', v),
            m: v => TyoerDesD._('m', v),
            _:(n, v) => TyoisDesD[n](v) || (() => { throw new TypeError(`Expected: '${Tyois.des.d[n].toString()}' like value.\nActual: ${Tys.name(v)}`); })()
        }
    }
);

const TyoerDesA = mkFnObj(
    v => TyoerDesDA(v, 'a', 'Getter Setter Accessor'.split(' ')),
    {
        methods: {
            g: v => TyoerDesA._('g', v),
            s: v => TyoerDesA._('s', v),
            a: v => TyoerDesA._('a', v),
            _:(n, v) => TyoisDesA[n](v) || (() => { throw new TypeError(`Expected: '${Tyois.des.a[n].toString()}' like value.\nActual: ${Tys.name(v)}`); })()
        }
    }
);

const TyoerDes = mkFnObj(
    v => {
        if (TyoisDes.some(v)) return true;
        throw new TypeError(`Expected: a value that makes 'Tyo.is.des.some(v)' return true.\nActual: ${Tys.name(v)}`);
    },
    {
        getters: {
            d: TyoerDesD,
            a: TyoerDesA,
        }
    }
);

const TyoerMd = mkFnObj(
    v => {
        if (TyoisMd.some(v)) return true;
        throw new TypeError(`Expected: a value that makes 'Tyo.is.md.some(v)' return true.\nActual: ${Tys.name(v)}`);
    },
    {
        methods: {
            a: v => TyoerMd._('a', v),
            g: v => TyoerMd._('g', v),
            ag: v => TyoerMd._('ag', v),
            s: v => TyoerMd._('s', v),
            _:(n, v) => TyoisMd[n](v) || (() => { throw new TypeError(`Expected: '${TyoisMd[n].toString()}' like value.\nActual: ${Tys.name(v)}`); })()
        }
    }
);

const Tyoer = mkFnObj(
    v => {
        if (Tyois.some(v)) return true;
        throw new TypeError(`Expected: a value that makes 'Tyo.is.some(v)' return true.\nActual: ${Tys.name(v)}`);
    },
    {
        getters: {
            cls: TyoerCls,
            ins: TyoerIns,
            des: TyoerDes,
            fn: TyoerFn,
            md: TyoerMd,
        },
        methods: {
            obj: v => Tyoer._('obj', v),
            ary: v => Tyoer._('ary', v),
            _:(n, v) => Tyois[n](v) || (() => { throw new TypeError(`Expected: '${Tyois[n].toString()}' like value.\nActual: ${Tys.name(v)}`); })()
        }
    }
);
