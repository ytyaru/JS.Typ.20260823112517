import {Tys} from './tys.js';

// Type Object is/error
export class Tyo {
    static get is() {return Tyois}
    static get er() {return Tyoer}
}

// --- Tyois (is) ---
function Tyois(v) {
    if (new.target) throw new ReferenceError('コンストラクタ生成禁止です。');
    const N = Tys.name(v);
    return TyoisFn._some(N) || ['Method'].some(n=>N.endsWith(n)) || ['PlainObject','Array'].some(n=>n===N) || ['Descriptor','Class','Instance'].some(n=>N.startsWith(n+'<'));
}
Tyois.some = Tyois;
Tyois.obj = v => 'PlainObject' === Tys.name(v);
Tyois.ary = v => Array.isArray(v);
Object.defineProperty(Tyois, 'cls', { get() { return TyoisCls; } });
Object.defineProperty(Tyois, 'ins', { get() { return TyoisIns; } });
Object.defineProperty(Tyois, 'des', { get() { return TyoisDes; } });
Object.defineProperty(Tyois, 'fn', { get() { return TyoisFn; } });
Object.defineProperty(Tyois, 'md', { get() { return TyoisMd; } });


function TyoisCls(v) {
    if (new.target) throw new ReferenceError('コンストラクタ生成禁止です。');
    const N = Tys.name(v);
    return ['','ES5.','Native'].some(n=>N.startsWith(`${n}Class<`));
}
TyoisCls.some = TyoisCls;
TyoisCls.es6 = v => Tys.name(v).startsWith('Class<');
TyoisCls.es5 = v => Tys.name(v).startsWith('ES5.Class<');
TyoisCls.native = v => Tys.name(v).startsWith('NativeClass<');


function TyoisIns(v, C) {
    if (new.target) throw new ReferenceError('コンストラクタ生成禁止です。');
    const N = Tys.name(v);
    return ['','ES5.','Native'].some(n=>N.startsWith(`${n}Instance<`)) && (C ? v instanceof C: true);
}
TyoisIns.some = TyoisIns;
TyoisIns.es6 = (v, C) => Tys.name(v).startsWith('Instance<') && (C ? v instanceof C: true);
TyoisIns.es5 = (v, C) => Tys.name(v).startsWith('ES5.Instance<') && (C ? v instanceof C: true);
TyoisIns.native = (v, C) => Tys.name(v).startsWith('NativeInstance<') && (C ? v instanceof C: true);


function TyoisDes(v) {
    if (new.target) throw new ReferenceError('コンストラクタ生成禁止です。');
    return Tys.name(v).startsWith('Descriptor<');
}
TyoisDes.some = TyoisDes;
Object.defineProperty(TyoisDes, 'd', { get() { return TyoisDesD; } });
Object.defineProperty(TyoisDes, 'a', { get() { return TyoisDesA; } });


function TyoisDesDA(v, names) {
    if (new.target) throw new ReferenceError('コンストラクタ生成禁止です。');
    const N = Tys.name(v);
    const ns = names.map(n=>`Descriptor<${n}>`);
    return ns.some(n=>n===N);
}


function TyoisDesD(v) {
    if (new.target) throw new ReferenceError('コンストラクタ生成禁止です。');
    return TyoisDesDA(v, 'Value Method'.split(' '));
}
TyoisDesD.some = TyoisDesD;
TyoisDesD.v = v => 'Descriptor<Value>' === Tys.name(v);
TyoisDesD.m = v => 'Descriptor<Method>' === Tys.name(v);


function TyoisDesA(v) {
    if (new.target) throw new ReferenceError('コンストラクタ生成禁止です。');
    return TyoisDesDA(v, 'Getter Setter Accessor'.split(' '));
}
TyoisDesA.some = TyoisDesA;
TyoisDesA.g = v => 'Descriptor<Getter>' === Tys.name(v);
TyoisDesA.s = v => 'Descriptor<Setter>' === Tys.name(v);
TyoisDesA.a = v => 'Descriptor<Accessor>' === Tys.name(v);


function TyoisFn(v) {
    if (new.target) throw new ReferenceError('コンストラクタ生成禁止です。');
    const N = Tys.name(v);
    return N.endsWith('Function') || `Bound Native`.split(' ').some(n=>N.startsWith(n+'Function<'));
}
TyoisFn.some = TyoisFn;
TyoisFn.bound = v => Tys.name(v).startsWith(`BoundFunction<`);
TyoisFn.native = v => Tys.name(v).startsWith(`NativeFunction<`);
Object.defineProperty(TyoisFn, 'arrow', { get() { return TyoisArrFn; } });
TyoisFn.a = v => 'AsyncFunction' === Tys.name(v);
TyoisFn.g = v => 'GeneratorFunction' === Tys.name(v);
TyoisFn.ag = v => 'AsyncGeneratorFunction' === Tys.name(v);
TyoisFn.s = v => 'Function' === Tys.name(v);
TyoisFn.anonymous = v => 'AnonymousFunction' === Tys.name(v);
TyoisFn._some = N => N.endsWith('Function') || `Bound Native`.split(' ').some(n=>N.startsWith(n+'Function<'));


function TyoisArrFn(v) {
    if (new.target) throw new ReferenceError('コンストラクタ生成禁止です。');
    return Tys.name(v).endsWith('ArrowFunction');
}
TyoisArrFn.some = TyoisArrFn;
TyoisArrFn.a = v => 'AsyncArrowFunction' === Tys.name(v);
TyoisArrFn.s = v => 'ArrowFunction' === Tys.name(v);


function TyoisMd(v) {
    if (new.target) throw new ReferenceError('コンストラクタ生成禁止です。');
    return Tys.name(v).endsWith('Method');
}
TyoisMd.some = TyoisMd;
TyoisMd.a = v => 'AsyncMethod' === Tys.name(v);
TyoisMd.g = v => 'GeneratorMethod' === Tys.name(v);
TyoisMd.ag = v => 'AsyncGeneratorMethod' === Tys.name(v);
TyoisMd.s = v => 'Method' === Tys.name(v);


// --- Tyoer (Error) ---
function Tyoer(v) {
    if (new.target) throw new ReferenceError('コンストラクタ生成禁止です。');
    if (Tyois.some(v)) return true;
    throw new TypeError(`Expected: a value that makes 'Tyo.is.some(v)' return true.\nActual: ${Tys.name(v)}`);
}
Tyoer.some = Tyoer;
Tyoer.obj = v => Tyoer._('obj', v);
Tyoer.ary = v => Tyoer._('ary', v);
Object.defineProperty(Tyoer, 'cls', { get() { return TyoerCls; } });
Object.defineProperty(Tyoer, 'ins', { get() { return TyoerIns; } });
Object.defineProperty(Tyoer, 'des', { get() { return TyoerDes; } });
Object.defineProperty(Tyoer, 'fn', { get() { return TyoerFn; } });
Object.defineProperty(Tyoer, 'md', { get() { return TyoerMd; } });
Tyoer._ = (n, v) => {
    if (Tyois[n](v)) return true;
    throw new TypeError(`Expected: '${Tyois[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
};


function TyoerCls(v) {
    if (new.target) throw new ReferenceError('コンストラクタ生成禁止です。');
    if (TyoisCls.some(v)) return true;
    throw new TypeError(`Expected: a value that makes 'Tyo.is.cls.some(v)' return true.\nActual: ${Tys.name(v)}`);
}
TyoerCls.some = TyoerCls;
TyoerCls.es6 = v => TyoerCls._('es6', v);
TyoerCls.es5 = v => TyoerCls._('es5', v);
TyoerCls.native = v => TyoerCls._('native', v);
TyoerCls._ = (n, v) => {
    if (TyoisCls[n](v)) return true;
    throw new TypeError(`Expected: '${Tyois.cls[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
};


function TyoerIns(v, C) {
    if (new.target) throw new ReferenceError('コンストラクタ生成禁止です。');
    if (TyoisIns.some(v)) return true;
    throw new TypeError(`Expected: a value that makes 'Tyo.is.ins.some(v)' return true.\nActual: ${Tys.name(v)}`);
}
TyoerIns.some = TyoerIns;
TyoerIns.es6 = (v, C) => TyoerIns._('es6', v, C);
TyoerIns.es5 = (v, C) => TyoerIns._('es5', v, C);
TyoerIns.native = (v, C) => TyoerIns._('native', v, C);
TyoerIns._ = (n, v, C) => {
    if (TyoisIns[n](v, C)) return true;
    throw new TypeError(`Expected: '${Tyois.ins[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
};


function TyoerDes(v) {
    if (new.target) throw new ReferenceError('コンストラクタ生成禁止です。');
    if (TyoisDes.some(v)) return true;
    throw new TypeError(`Expected: a value that makes 'Tyo.is.des.some(v)' return true.\nActual: ${Tys.name(v)}`);
}
TyoerDes.some = TyoerDes;
Object.defineProperty(TyoerDes, 'd', { get() { return TyoerDesD; } });
Object.defineProperty(TyoerDes, 'a', { get() { return TyoerDesA; } });


function TyoerDesDA(v, n, names) {
    if (new.target) throw new ReferenceError('コンストラクタ生成禁止です。');
    const N = Tys.name(v);
    const ns = names.map(n=>`Descriptor<${n}>`);
    if (ns.some(n=>n===N)) return true;
    throw new TypeError(`Expected: a value that makes 'Tyo.is.des.${n}.some(v)' return true.\nActual: ${Tys.name(v)}`);
}


function TyoerDesD(v) {
    if (new.target) throw new ReferenceError('コンストラクタ生成禁止です。');
    return TyoerDesDA(v, 'd', 'Value Method'.split(' '));
}
TyoerDesD.some = TyoerDesD;
TyoerDesD.v = v => TyoerDesD._('v', v);
TyoerDesD.m = v => TyoerDesD._('m', v);
TyoerDesD._ = (n, v) => {
    if (TyoisDesD[n](v)) return true;
    throw new TypeError(`Expected: '${Tyois.des.d[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
};


function TyoerDesA(v) {
    if (new.target) throw new ReferenceError('コンストラクタ生成禁止です。');
    return TyoerDesDA(v, 'a', 'Getter Setter Accessor'.split(' '));
}
TyoerDesA.some = TyoerDesA;
TyoerDesA.g = v => TyoerDesA._('g', v);
TyoerDesA.s = v => TyoerDesA._('s', v);
TyoerDesA.a = v => TyoerDesA._('a', v);
TyoerDesA._ = (n, v) => {
    if (TyoisDesA[n](v)) return true;
    throw new TypeError(`Expected: '${Tyois.des.a[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
};


function TyoerFn(v) {
    if (new.target) throw new ReferenceError('コンストラクタ生成禁止です。');
    if (TyoisFn.some(v)) return true;
    throw new TypeError(`Expected: a value that makes 'Tyo.is.fn.some(v)' return true.\nActual: ${Tys.name(v)}`);
}
TyoerFn.some = TyoerFn;
TyoerFn.bound = v => TyoerFn._('bound', v);
TyoerFn.native = v => TyoerFn._('native', v);
Object.defineProperty(TyoerFn, 'arrow', { get() { return TyoerArrFn; } });
TyoerFn.a = v => TyoerFn._('a', v);
TyoerFn.g = v => TyoerFn._('g', v);
TyoerFn.ag = v => TyoerFn._('ag', v);
TyoerFn.s = v => TyoerFn._('s', v);
TyoerFn.anonymous = v => TyoerFn._('anonymous', v);
TyoerFn._ = (n, v) => {
    if (TyoisFn[n](v)) return true;
    throw new TypeError(`Expected: '${TyoisFn[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
};


function TyoerArrFn(v) {
    if (new.target) throw new ReferenceError('コンストラクタ生成禁止です。');
    if (TyoisArrFn.some(v)) return true;
    throw new TypeError(`Expected: a value that makes 'Tyo.is.fn.arrow.some(v)' return true.\nActual: ${Tys.name(v)}`);
}
TyoerArrFn.some = TyoerArrFn;
TyoerArrFn.a = v => TyoerArrFn._('a', v);
TyoerArrFn.s = v => TyoerArrFn._('s', v);
TyoerArrFn._ = (n, v) => {
    if (TyoisArrFn[n](v)) return true;
    throw new TypeError(`Expected: '${TyoisArrFn[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
};


function TyoerMd(v) {
    if (new.target) throw new ReferenceError('コンストラクタ生成禁止です。');
    if (TyoisMd.some(v)) return true;
    throw new TypeError(`Expected: a value that makes 'Tyo.is.md.some(v)' return true.\nActual: ${Tys.name(v)}`);
}
TyoerMd.some = TyoerMd;
TyoerMd.a = v => TyoerMd._('a', v);
TyoerMd.g = v => TyoerMd._('g', v);
TyoerMd.ag = v => TyoerMd._('ag', v);
TyoerMd.s = v => TyoerMd._('s', v);
TyoerMd._ = (n, v) => {
    if (TyoisMd[n](v)) return true;
    throw new TypeError(`Expected: '${TyoisMd[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
};
