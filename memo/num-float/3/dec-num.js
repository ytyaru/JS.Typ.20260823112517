// IEEE754は浮動小数点数が2のマイナス乗単位であり十進数でない。
// これを補うため整数と少数の二つを単一のNumber型の安全整数で実装する。
// Number.MAX_SAFE_INTEGER=9007199254740991; が1の差を維持できる最大値。
// 整数部、少数部、合計15桁までが十進数を保証できる範囲内である。
// なので少数の桁数を指定させることで自動的に整数の桁数も算出できる。
import {Range} from './range.js';
const parseNumStr = s => (s.includes('.') ? s : s + '.0').split('.').map((v, i) => v.padStart(1 - i, '0').padEnd(1, '0'));
const TOTAL_FIG = 15;
class NumDec {
    constructor(fig) {//, max, min, i, f
        if (!(Number.isSafeInteger(fig) && 0<fig && fig<TOTAL_FIG)) {throw new TypeError(`figは1〜14の整数であるべきです。`)}
        this._= {
            v:0,
            i:{v:0, fig:TOTAL_FIG-fig, scale:0},
            f:{v:0, fig:fig, scale:10**fig},
        };
        this._.i.scale = 10**this._.i.fig;
        this._.i.rng = new Range(this._.i.scale*-1, this._.i.scale-1);
        this._.f.rng = new Range(0, this._.f.scale-1);
    }
    #total(i,f) {return i * this._.f.scale + (i < 0 ? -f : f);}
    #validAry(a) {
        if (2!==a.length) {throw new TypeError(`配列要素数は2個であるべきです。`)}
        this._.i.rng.throw(a[0]);
        this._.f.rng.throw(a[1]);
        //return a;
        return this.#total(...a);
    }
    #validStr(v) {
        let [I,F] = parseNumStr(v);
        if (F.length < this._.f.fig) F = F.padEnd(this._.f.fig - F.length,'0');
        if (this._.f.fig < F.length) {throw new RangeError(`小数部の最大桁数を超過しています。期待値: ${this._.f.fig}, 実際値: ${F.length}`)};
        const [i,f] = [I,F].map(x=>Number(x));
        this._.i.rng.throw(i);
        this._.f.rng.throw(f);
//        return [i,f];
        return this.#total(i,f);
    }
    valid(...args) {// (i,f) / ([i,f]) / ('i.f') / (new NumDec()) -> [i,f]
        if (2===args.length) {return this.#validAry(args)}
        else if (1===args.length) {
            if (Array.isArray(args[0])) {return this.#validAry(args[0])}
            else if ('string'===typeof args[0]) {return this.#validStr(args[0])}
            //else if (args[0] instanceof NumDec) {return [args[0].i, args[0].f]}//OK
            else if (args[0] instanceof NumDec) {return args[0].v}//OK
            else if (Number.isSafeInteger(args[0])) {
                this._.i.rng.throw(args[0]);
                return this.#total(args[0], 0);
//                return Math.trunc(args[0] * this._.f.scale);
            }
            else {throw new TypeError(`引数一つの場合は配列[i,f]／文字列'i.f'／NumDecインスタンスのいずれかであるべきです。`)}
        }
        else {throw new TypeError(`(i,f) / ('i.f') / (new NumDec()) のいずれかであるべきです。iは整数部、fは少数部を意味するNumber型安全整数です。`)}
    }
    //get v() {return [this._.i.v, this._.f.v]}
    get v() {return this._.v}
    // [i,f] / 'i.f' / new NumDec()
    set v(x) {this._.v = this.valid(x);}
    /*
    set v(x) {// [i,f] / 'i.f' / new NumDec()
        const [i,f] = this.valid(x);
        this.i = i;
        this.f = f;
    }
    */
    get i() {return this._.i.v}
    set i(x) {this._.i.v = this._.i.rng.throw(x);}
    get f() {return this._.f.v}
    set f(x) {
        Range.throwInt(x);
        if (this._.f.rng.within(x)) {this._.f.v = x;}
        else {
            this._.i.v += Math.floor(x / this._.f.scale);
            this._.f.v = x % this._.f.scale;
        }
    }
    // 算術演算 (i,f) / ([i,f]) / ('i.f') / (new NumDec())
    add(...args) { this.v += this.valid(2 === args.length ? args : args[0]); }
    sub(...args) { this.v -= this.valid(2 === args.length ? args : args[0]); }
    div(...args) { 
        const other = this.valid(2 === args.length ? args : args[0]);
        if (other === 0) { throw new Error('ゼロ除算です。'); }
        this.v = Math.trunc((this._.v * this._.f.scale) / other); 
    }
    mul(...args) { 
        const other = this.valid(2 === args.length ? args : args[0]);
        this.v = Math.trunc((this._.v * other) / this._.f.scale); 
    }
    mod(...args) { this.v %= this.valid(2 === args.length ? args : args[0]); }
    pow(...args) { 
        const other = this.valid(2 === args.length ? args : args[0]) / this._.f.scale;
        this.v = Math.trunc((this._.v / this._.f.scale) ** other * this._.f.scale); 
    }
    // 比較演算 (i,f) / ([i,f]) / ('i.f') / (new NumDec())
    #compare(x) { return this._.v - this.valid(x); }
    e(...args) { return this.#compare(2 === args.length ? args : args[0]) === 0; }
    n(...args) { return this.#compare(2 === args.length ? args : args[0]) !== 0; }
    l(...args) { return this.#compare(2 === args.length ? args : args[0]) < 0; }
    g(...args) { return this.#compare(2 === args.length ? args : args[0]) > 0; }
    le(...args) { return this.#compare(2 === args.length ? args : args[0]) <= 0; }
    ge(...args) { return this.#compare(2 === args.length ? args : args[0]) >= 0; }
    three(...args) {
        const diff = this.#compare(2 === args.length ? args : args[0]);
        return diff < 0 ? -1 : diff > 0 ? 1 : 0;
    }
    /*
    add(...args) {this._.v += this.valid(2===args.length ? args : args[0]);}
    sub(...args) {this._.v -= this.valid(2===args.length ? args : args[0]);}
    div(...args) {this._.v /= this.valid(2===args.length ? args : args[0]);}
    mul(...args) {this._.v *= this.valid(2===args.length ? args : args[0]);}
    mod(...args) {this._.v %= this.valid(2===args.length ? args : args[0]);}
    pow(...args) {this._.v **= this.valid(2===args.length ? args : args[0]);}
    */
    /*
    #e(i,f) {return i===this.i && f===this.f}
    #l(i,f) {return this.i < i || (this.i===i && f<this.f)}
    #g(i,f) {return i < this.i || (this.i===i && this.f<f)}
    e(...args) {const [i,f]=this.valid(2===args.length ? args : args[0]); return this.#e(i,f);}
    n(...args) {const [i,f]=this.valid(2===args.length ? args : args[0]); return i!==this.i || f!==this.f;}
    l(...args) {const [i,f]=this.valid(2===args.length ? args : args[0]); return this.#l(i,f);}
    g(...args) {const [i,f]=this.valid(2===args.length ? args : args[0]); return this.#g(i,f);}
    le(...args){const [i,f]=this.valid(2===args.length ? args : args[0]); return this.i < i || (this.i===i && f<=this.f);}
    ge(...args){const [i,f]=this.valid(2===args.length ? args : args[0]); return i < this.i || (this.i===i && this.f<=f);}
    three(...args){const [i,f]=this.valid(2===args.length ? args : args[0]); return this.#l(i,f) ? -1 : this.#g(i,f) ? 1 : 0;}
    */
}
