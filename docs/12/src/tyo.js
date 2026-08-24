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
    static get des() {return TyoisDes}
    static get fn() {return TyoisFn}
    static get md() {return TyoisMd}
}
class TyoisDes {
    static some(v) {return Tys.name(v).startsWith('Descriptor<')}
    static get d() {return TyoisDesD}
    static get a() {return TyoisDesA}
}
class TyoisDesDA {
    static some(v, names) {
        const N = Tys.name(v);
        const ns = names.map(n=>`Descriptor<${n}>`);
        return ns.some(n=>n===N);
    }
}
// Data/Accessor
class TyoisDesD extends TyoisDesDA {
    static some(v) {return super.some(v, 'Value Method'.split(' '))}
    static v(v) {return 'Descriptor<Value>'===Tys.name(v)}
    static m(v) {return 'Descriptor<Method>'===Tys.name(v)}
}
class TyoisDesA extends TyoisDesDA {
    static some(v) {return super.some(v, 'Getter Setter Accessor'.split(' '))}
    static g(v) {return 'Descriptor<Getter>'===Tys.name(v)}
    static s(v) {return 'Descriptor<Setter>'===Tys.name(v)}
    static a(v) {return 'Descriptor<Accessor>'===Tys.name(v)}
}
class TyoisFn {
    static some(v) {return Tys.name(v).endsWith('Function')}
    static bound(v) {return 'BoundFunction'===Tys.name(v)}
    static native(v) {return 'NativeFunction'===Tys.name(v)}
    static get arrow() {return TyoisArrFn}
    static a(v) {return 'AsyncFunction'===Tys.name(v)}
    static g(v) {return 'GeneratorFunction'===Tys.name(v)}
    static ag(v) {return 'AsyncGeneratorFunction'===Tys.name(v)}
    static s(v) {return 'Function'===Tys.name(v)}
}
class TyoisArrFn {
    static some(v) {return Tys.name(v).endsWith('ArrowFunction')}
    static a(v) {return 'AsyncArrowFunction'===Tys.name(v)}
    static s(v) {return 'ArrowFunction'===Tys.name(v)}
}
class TyoisMd {
    static some(v) {return Tys.name(v).endsWith('Method')}
    static a(v) {return 'AsyncMethod'===Tys.name(v)}
    static g(v) {return 'GeneratorMethod'===Tys.name(v)}
    static ag(v) {return 'AsyncGeneratorMethod'===Tys.name(v)}
    static s(v) {return 'Method'===Tys.name(v)}
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
    static get des() {return TyoerDes}
    static get fn() {return TyoerFn}
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
    static bound() {return this._('bound',v)}
    static native() {return this._('native',v)}
    static get arrow() {return TyoerArrFn}
    static a() {return this._('a',v)}
    static g() {return this._('g',v)}
    static ag() {return this._('ag',v)}
    static s() {return this._('s',v)}
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
    static a() {return this._('a',v)}
    static s() {return this._('s',v)}
    static _(n,v) {
        if (TyoisArrFn[n](v)) return true;
        throw new TyoeError(`Expected: '${TyoisArrFn[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
    }
}
