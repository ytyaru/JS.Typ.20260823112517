import {Tys} from './tys.js';
export class Typ {
    static get is() {return Typis}
    static get er() {return Typer}
}
class Typis {
    static bln(v) {return 'boolean'===typeof v}
    static int(v) {return Number.isSafeInteger(v)}
    static big(v) {return 'bigint'===typeof v}
    static str(v) {return 'string'===typeof v}
    static sym(v) {return 'symbol'===typeof v}
}
class Typer {
    static bln(v) {return this._('bln', v);}
    static int(v) {return this._('int', v);}
    static big(v) {return this._('big', v);}
    static str(v) {return this._('str', v);}
    static sym(v) {return this._('sym', v);}
    static _(n,v) {
        if (Typis[n](v)) return true;
//        throw new TypeError(`Expected: '${Typis[n].toString()}' like value.\nActual: ${v}, typeof: ${typeof v}`);
        throw new TypeError(`Expected: '${Typis[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
    }
}
