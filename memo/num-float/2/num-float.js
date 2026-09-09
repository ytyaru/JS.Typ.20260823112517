// IEEE754は浮動小数点数が2のマイナス乗単位であり十進数でない。
// これを補うため整数と少数の二つをNumber型の安全整数で実装するのがNumDec。
// Number.MAX_SAFE_INTEGER=9007199254740991; が1の差を維持できる最大値。
// つまり十進数値を保証するなら16桁は途中までしかないから15桁までが上限。
// よく考えたら整数と少数の両方合わせて15桁以内にする必要がある。
// また、少数の場合、最長桁数で入力しなかった場合、最小単位になる。
// つまり少数三桁まで保証すると型指定した時、少数を代入する値として一桁の1を指定したら0.001を意味するのであり0.1ではない。
// もし最長桁数が五桁で1を指定したら0.00001になる。ようするに代入時は同じ1という整数でも実際には指定した桁数次第で値が変わるため非常に分かりにくい。
// これを解決するために常に指定桁数で0埋めしてリテラル表記する工夫がありうるが、それを強制することはできないため対策としては弱すぎる。
import {Range} from './range.js';
import {Figure} from './figure.js';
// 1.2, 2, .1 のような表記を1.2, 2.0, 0.1のように0埋めして[i,f]の形にする。
const parseNumStr = s => (s.includes('.') ? s : s + '.0').split('.').map((v, i) => v.padStart(1 - i, '0').padEnd(1, '0'));
class NumDec {// Number Decimal（Number型で十進数を保証した少数型）
    constructor(fig=1,i=undefined,f=undefined,min=-Infinity,max=Infinity) {
        const F = new Figure(fig);
        const iScale = (10**F.i);
        const fScale = (10**F.f);
        this._ = {
            i:{v:0, fig:F.i, scale:iScale, rng:new Range(-1*iScale,iScale-1)},
            f:{v:0, fig:F.f, scale:fScale, rng:new Range(0,fScale-1)}
        };
        this.i = i===undefined ? 0 : i;
        this.f = f===undefined ? 0 : f;
    }
    #validAry(a) {
        if (2!==a.length) {throw new TypeError(`配列要素数は2個であるべきです。`)}
        this._.i.rng.throw(a[0]);
        this._.f.rng.throw(a[1]);
        return a;
    }
    #validStr(v) {
        let [I,F] = parseNumStr(v);
        if (F.length < this._.f.fig) F = F.padEnd(this._.f.fig - F.length,'0');
        if (this._.f.fig < F.length) {throw new RangeError(`小数部の最大桁数を超過しています。期待値: ${this._.f.fig}, 実際値: {F.length}`)};
        const [i,f] = [I,F].map(x=>Number(x));
        this._.i.rng.throw(i);
        this._.f.rng.throw(f);
        return [i,f];
    }
    valid(...args) {// (i,f) / ([i,f]) / ('i.f') / (new NumDec()) -> [i,f]
        if (2===args.length) {return this.#validAry(args)}
        else if (1===args.length) {
            if (Array.isArray(args[0])) {return this.#validAry(args[0])}
            else if ('string'===typeof args[0]) {return this.#validStr(args[0])}
            else if (args[0] instanceof NumDec) {return [args[0].i, args[0].f]}//OK
            else {throw new TypeError(`引数一つの場合は配列[i,f]／文字列'i.f'／NumDecインスタンスのいずれかであるべきです。`)}
        }
        else {throw new TypeError(`(i,f) / ('i.f') / (new NumDec()) のいずれかであるべきです。iは整数部、fは少数部を意味するNumber型安全整数です。`)}
    }
    get v() {return [this._.i.v, this._.f.v]}
    set v(x) {// [i,f] / 'i.f' / new NumDec()
        const [i,f] = this.valid(x);
        this.i = i;
        this.f = f;
    }
    get i() {return this._.i.v}
    set i(x) {this._.i.v = this._.i.rng.throw(x);}
    get f() {return this._.f.v}
    set f(x) {
        Range.throwInt(x);
        if (this._.f.rng.within(x)) {this._.f.v = x;}
        else {
            this._.i.v += Math.floor(x / this._.scale);
            this._.f.v = x % this._.scale;
        }
    }
    // 算術演算 (i,f) / ([i,f]) / ('i.f') / (new NumDec())
    add(...args) {this.v += this.valid(2===args.length ? args : args[0]);}
    sub(...args) {this.v -= this.valid(2===args.length ? args : args[0]);}
    div(...args) {this.v /= this.valid(2===args.length ? args : args[0]);}
    mul(...args) {this.v *= this.valid(2===args.length ? args : args[0]);}
    mod(...args) {this.v %= this.valid(2===args.length ? args : args[0]);}
    pow(...args) {this.v **= this.valid(2===args.length ? args : args[0]);}
    // 比較演算 (i,f) / ([i,f]) / ('i.f') / (new NumDec())
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
}
