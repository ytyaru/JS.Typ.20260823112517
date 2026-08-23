import {Tys} from './tys.js';
// Type Object is/error
export class Tyo {
    static get is() {return Tyois}
    static get er() {return Tyoer}
}
class Tyois {
//    static some(v) {return 'des fn'.split(' ').some(n=>this[n].some(v)) || 'obj ary cls ins'.split(' ').some(n=>this[n](v));}
    static some(v) {
        const N = Tys.name(v);
        return 'Function'.split(' ').some(n=>N.ends(n)) || 'PlainObject'===N || 'Description Class Instance'.split(' ').some(n=>N.starts(n+'<'))
    }
//    static obj(v) {return TyoisObj}
//    static obj(v) {return Object.prototype===Object.getPrototypeOf(v)}
    static obj(v) {return 'PlainObject'===Tys.name(v)}
    static ary(v) {return Array.isArray(v)}
    static cls(v) {return Tys.name(v).startsWith('Class<')}
    //static ins(v,C) {return Tys.name(v).startsWith('Instance<')}
    static ins(v,C) {return Tys.name(v).startsWith('Instance<') && (C ? v instanceof C: true);}
    static des(v) {return TyoisDes}
    static fn(v) {return TyoisFn}
    static _isO(v) {return null!==v && 'object'===typeof v}
}
//class TyoisObj {
//    static plain(v) {return Object.prototype===Object.getPrototypeOf(v)}
//    static hasNotProto(v) {return Object.prototype===Object.getPrototypeOf(v)}
//}
class TyoisDes {
    static some(v) {return Tys.name(v).startsWith('Descriptor<')}
    static v(v) {return Tys.name(v).startsWith('Descriptor<Value>')}
    static m(v) {return Tys.name(v).startsWith('Descriptor<Method>')}
    static g(v) {return Tys.name(v).startsWith('Descriptor<Getter>')}
    static s(v) {return Tys.name(v).startsWith('Descriptor<Setter>')}
    static a(v) {return Tys.name(v).startsWith('Descriptor<Accessor>')}
}
class TyoisFn {
    static some() {return return Tys.name(v).endsWith('Function')}
    static bound() {return 'BoundFunction'===Tys.name(v)}
    static native() {return 'NativeFunction'===Tys.name(v)}
    static arrow() {return TyoisArrFn}
    static a() {return 'AsyncFunction'===Tys.name(v)}
    static g() {return 'GeneratorFunction'===Tys.name(v)}
    static ag() {return 'AsyncGeneratorFunction'===Tys.name(v)}
    static s() {return 'Function'===Tys.name(v)}
}
class TyoisArrFn {
    static some() {return return Tys.name(v).endsWith('ArrowFunction')}
    static a() {return 'AsyncArrowFunction'===Tys.name(v)}
    static s() {return 'ArrowFunction'===Tys.name(v)}
}
class Tyoer {
    static some(v) {
        const names = 'bln int fin big str sym';
        const r = names.split(' ').map(n=>({name:n, is:Typis[n](v)}));
        if (r.some(x=>x.is)) return true;
        throw new TypeError(`Expected: a value that makes 'Typis.some(v)' return true.\nActual: ${Tys.name(v)}`);
    }
    static bln(v) {return this._('bln', v);}
    static int(v) {return this._('int', v);}
    static fin(v) {return this._('fin', v);}
    static big(v) {return this._('big', v);}
    static str(v) {return this._('str', v);}
    static sym(v) {return this._('sym', v);}
    static _(n,v) {
        if (Tyois[n](v)) return true;
//        throw new TyoeError(`Expected: '${Tyois[n].toString()}' like value.\nActual: ${v}, typeof: ${typeof v}`);
        throw new TyoeError(`Expected: '${Tyois[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
    }
}
