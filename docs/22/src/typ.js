import {Tys} from './tys.js';
export class Typ {
    static get is() {return Typis}
    static get er() {return Typer}
}
class Typis {
    static some(v) {return 'bln int fin big str sym'.split(' ').some(n=>this[n](v));}
    static bln(v) {return 'boolean'===typeof v}
    static int(v) {return Number.isSafeInteger(v)}
    static fin(v) {return Number.isFinite(v) && v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v;}
    static big(v) {return 'bigint'===typeof v}
    static str(v) {return 'string'===typeof v}
    static sym(v) {return 'symbol'===typeof v}
    //static flt(v) {return this.fin(v) && !this.int(v);} // 1.0等少数値が0は対象外
    //static flt(v) {return Number.isFinite(v) && v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v;}
//    static flt(v,f=1) {
//        const [MIN,MAX] = this.getFloatRange(f);
//        return Number.isFinite(v) && v <= MAX && MIN <= v;
//    }
    /**
     * Number型における十進数からみた指定小数桁数を安全に扱える範囲を返却する
     * @param {number} f - 小数部の最長桁数（1以上の整数）
     * @returns {[number, number]} [min, max] の範囲
     */
     /*
    function getFloatRange(f) {
        // 引数のバリデーション
        if (!Number.isInteger(f)) {throw new TypeError("小数部の桁数 f はNumber型整数であるべきです。");}
        if (f < 1) {throw new RangeError("小数部の桁数 f は1以上の整数であるべきです。");}
        const maxSafeInt = Number.MAX_SAFE_INTEGER; // 9007199254740991
        const factor = 10 ** f; // 修正箇所
        if (factor > maxSafeInt) {throw new RangeError(`小数部 ${f} 桁は安全な精度限界を超えているため扱えません。`);}
        const max = Math.floor(maxSafeInt / factor);
        const min = -max;
        return [min, max];
    }
    */
}
class Typer {
    static some(v) {
        const names = 'bln int fin big str sym';
        const r = names.split(' ').map(n=>({name:n, is:Typis[n](v)}));
        if (r.some(x=>x.is)) return true;
        throw new TypeError(`Expected: a value that makes 'Typis.some(v)' return true.\nActual: ${Tys.name(v)}`);
    }
    static bln(v) {return this._('bln', v);}
    static int(v) {return this._('int', v);}
    static fin(v) {return this._('fin', v);}
    static flt(v) {return this._('flt', v);}
    static big(v) {return this._('big', v);}
    static str(v) {return this._('str', v);}
    static sym(v) {return this._('sym', v);}
    static _(n,v) {
        if (Typis[n](v)) return true;
        throw new TypeError(`Expected: '${Typis[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
    }
}
