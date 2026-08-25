import {Tys} from './tys.js';
export class Typ {
    static get is() {return Typis}
    static get er() {return Typer}
}
class Typis {
    static some(v) {return 'bln int fin big str sym'.split(' ').some(n=>this[n](v));}
    static bln(v) {return 'boolean'===typeof v}
    static int(v) {return Number.isSafeInteger(v)}
    static fin(v) {return Number.isFinite(v)}
    static big(v) {return 'bigint'===typeof v}
    static str(v) {return 'string'===typeof v}
    static sym(v) {return 'symbol'===typeof v}
}
class Typer {
    //static some(v) {return 'bln int fin big str sym'.split(' ').some(n=>this._(n,v));}
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
        if (Typis[n](v)) return true;
        throw new TypeError(`Expected: '${Typis[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
    }
}
