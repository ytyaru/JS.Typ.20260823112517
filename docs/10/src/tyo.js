import {Tys} from './tys.js';
// Type Object is/error
export class Tyo {
    static get is() {return Tyois}
    static get er() {return Tyoer}
}
class Tyois {
    static some(v) {
        const N = Tys.name(v);
        return ['Function','Method'].some(n=>N.endsWith(n)) || ['PlainObject','Array'].some(n=>n===N) || ['Descriptor','Class','Instance'].some(n=>N.startsWith(n+'<'));
    }
    static obj(v) {return 'PlainObject'===Tys.name(v)}
    static ary(v) {return Array.isArray(v)}
    static cls(v) {return Tys.name(v).startsWith('Class<')}
    static ins(v,C) {return Tys.name(v).startsWith('Instance<') && (C ? v instanceof C: true);}
    static des(v) {return TyoisDes}
    static fn(v) {return TyoisFn}
    static md(v) {return TyoisMd}
}
class TyoisDes {
    static some(v) {return Tys.name(v).startsWith('Descriptor<')}
    static v(v) {return Tys.name(v).startsWith('Descriptor<Value>')}
    static m(v) {return Tys.name(v).startsWith('Descriptor<Method>')}
    static g(v) {return Tys.name(v).startsWith('Descriptor<Getter>')}
    static s(v) {return Tys.name(v).startsWith('Descriptor<Setter>')}
    static a(v) {return Tys.name(v).startsWith('Descriptor<Accessor>')}
}
class TyoisFn {
    static some() {return Tys.name(v).endsWith('Function')}
    static bound() {return 'BoundFunction'===Tys.name(v)}
    static native() {return 'NativeFunction'===Tys.name(v)}
    static arrow() {return TyoisArrFn}
    static a() {return 'AsyncFunction'===Tys.name(v)}
    static g() {return 'GeneratorFunction'===Tys.name(v)}
    static ag() {return 'AsyncGeneratorFunction'===Tys.name(v)}
    static s() {return 'Function'===Tys.name(v)}
}
class TyoisArrFn {
    static some() {return Tys.name(v).endsWith('ArrowFunction')}
    static a() {return 'AsyncArrowFunction'===Tys.name(v)}
    static s() {return 'ArrowFunction'===Tys.name(v)}
}
class TyoisMd {
    static some() {return Tys.name(v).endsWith('Method')}
    static a() {return 'AsyncMethod'===Tys.name(v)}
    static g() {return 'GeneratorMethod'===Tys.name(v)}
    static ag() {return 'AsyncGeneratorMethod'===Tys.name(v)}
    static s() {return 'Method'===Tys.name(v)}
}
// Error
class Tyoer {
    static some(v) {
        if (Tyois.some(v)) return true;
        throw new TypeError(`Expected: a value that makes 'Tyois.some(v)' return true.\nActual: ${Tys.name(v)}`);
    }
    static obj(v) {return this._('obj', v);}
    static ary(v) {return this._('ary', v);}
    static cls(v) {return this._('cls', v);}
    static ins(v,C) {return this._('ins', v);}
    static des(v) {return TyoerDes}
    static fn(v) {return TyoerFn}
    static _(n,v) {
        if (Tyois[n](v)) return true;
        throw new TyoeError(`Expected: '${Tyois[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
    }
}
class TyoerDes {
    static some(v) {
        if (TyoisDes.some(v)) return true;
        throw new TypeError(`Expected: a value that makes 'Tyois.des.some(v)' return true.\nActual: ${Tys.name(v)}`);
    }
    static v(v) {return }
    static m(v) {return }
    static g(v) {return }
    static s(v) {return }
    static a(v) {return }
    static _(n,v) {
        if (TyoisDes[n](v)) return true;
        throw new TyoeError(`Expected: '${TyoisDes[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
    }
}
class TyoerFn {
    static some(v) {
        if (TyoisFn.some(v)) return true;
        throw new TypeError(`Expected: a value that makes 'Tyois.fn.some(v)' return true.\nActual: ${Tys.name(v)}`);
    }
    static bound() {return }
    static native() {return }
    static arrow() {return TyoerArrFn}
    static a() {return }
    static g() {return }
    static ag() {return }
    static s() {return }
    static _(n,v) {
        if (TyoisFn[n](v)) return true;
        throw new TyoeError(`Expected: '${TyoisFn[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
    }
}
class TyoerArrFn {
    static some(v) {
        if (TyoisArrFn.some(v)) return true;
        throw new TypeError(`Expected: a value that makes 'Tyois.fn.arrow.some(v)' return true.\nActual: ${Tys.name(v)}`);
    }
    static a() {return 'AsyncArrowFunction'===Tys.name(v)}
    static s() {return 'ArrowFunction'===Tys.name(v)}
    static _(n,v) {
        if (TyoisArrFn[n](v)) return true;
        throw new TyoeError(`Expected: '${TyoisArrFn[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
    }
}
