// Number型(IEEE754)で不動少数点を使う時、誤差をなくすには2のマイナス乗単位で計算することで実現できる。
// 普通の算術計算ではそれ以外の数が発生してしまい誤差が生じる。
// そこで2のマイナス乗を最小単位（分解能）とするカウンタを作ってみた。
// e=1:1/2, e=2:1/4, e=3:1/8, e=4:1/16, ..., e=52:1/(2**52) = (Number.EPSILON)
// StepFloatは分解能の単位で一致した値のみ代入でき、さもなくば例外発生する。
// up,downは通常分解能単位で増減するが、引数n次第では分解能*nで増減できる。
// しかしそれだと誤差を許容して概算値を表示することができない。
// そこでStepFloatは分解能の単位でない誤差まみれの浮動小数点数を許容し、値の取得roundedの時に分解能の単位で丸めた数を返却するように実装する。
class Range {// StepFloatRange
    #min; #max;
    constructor(e, scale, min, max) {
        const MIN = Number.MIN_SAFE_INTEGER / scale; 
        const MAX = Number.MAX_SAFE_INTEGER / scale;
        this.#valid(min,'min');
        this.#valid(max,'max');
        if (max <= min) {throw new RangeError(`min,maxは1以上の差がある小大関係であるべきです。`)}
        this.#range(e,min,min<MIN,'min','下',MIN);
        this.#range(e,max,MAX<max,'max','上',MAX);
        this.#min = (-Infinity===min ? MIN : min);
        this.#max = ( Infinity===max ? MAX : max);
    }
    #valid(v,n) {if ('number'!==typeof v || Number.isNaN(v)) {throw new TypeError(`${n}はNaN以外のNumberであるべきです。`)}}
    #range(e,v,c,n,l,M) {if (Number.isFinite(v) && c) {throw new RangeError(`${n}が${l}限値を超過しています。分解能指数eが${e}の時${n}の最${'min'===n ? '小' : '大'}値は${M}です。これ以${'min'===n ? '上' : '下'}の数値にしてください。${l}限値を指定したい時は${'min'===n ? '-' : ''}Infinityにしてください。`)}}
    within(v) {return this.#min <= v && v <= this.#max;}
    get min() {return this.#min}
    get max() {return this.#max}
}
class StepFloat {
    static Overflow = Object.freeze({
        throw: (self, isDown, nextV) => { 
            throw new RangeError(`値範囲超過。期待値: ${self.min}〜${self.max} 実際値:${nextV}`); 
        },
        ignore: (self, isDown, nextV) => self._.v,
        stop: (self, isDown, nextV) => self._.v = (isDown ? self.min : self.max),
        zero: (self, isDown, nextV) => self._.v = 0,
        reverse: (self, isDown, nextV) => self._.v = isDown ? self.max : self.min,
    });
    constructor(e, over = StepFloat.Overflow.throw, min=-Infinity, max=Infinity) {// e:分解能指数(1/2**e)
        if (!(Number.isSafeInteger(e) && (1 <= e && e <= 52))) {
            throw new RangeError(`eは1〜52までの整数値であるべきです。指定値: ${e}`);
        }
        if (!Object.values(StepFloat.Overflow).includes(over)) {
            throw new Error(`overはStepFloat.Overflowのいずれかであるべきです。`);
        }
        const scale = 2 ** e;
        this._ = {
            e,
            scale,
            resolution: 1 / scale, 
            v: 0, 
            rng: new Range(e, scale, min, max),
            over,
        };
    }
    get min() { return this._.rng.min; }
    get max() { return this._.rng.max; }
    get resolution() { return this._.resolution; }
    get isIgnore() { return this._.over === StepFloat.Overflow.ignore; }
    get v() { return this._.v; }
    set v(x) {
        // 1. 数値型かどうかの基本的なチェック
        if (!Number.isFinite(x)) {throw new TypeError(`代入値はNumber.isFinite(x)が真を返す値のみ有効です。`);}
        // 2. 分解能（2のe乗の目盛り）に沿っているかどうかの厳密なチェック
        // max以下の値なので、掛け算してもMAX_SAFE_INTEGERを超えず、誤差なく整数判定可能
        if (!Number.isInteger(x * (this._.scale))) {throw new TypeError(`代入値 ${x} は、現在の分解能 (1 / 2**${this._.e} = ${this.resolution}) の単位に合致しません。`);}
        // 3. 範囲内（min〜max）かどうかのチェック
        this._.v = this._.rng.within(x) ? x : this._.over(this, (x < this._.v), x);
    }
    #count(isDown = false, n=1) {
        if (!Number.isSafeInteger(n)) {throw new TypeError(`nは1以上の安全な整数値であるべきです。`)}
        const nextV = this._.v + (this._.resolution * (isDown ? -n : n));
        return this._.rng.within(nextV) ? (this._.v = nextV) : this._.over(this, isDown, nextV);
    }
    up(n=1) { return this.#count(false, n); }
    down(n=1) { return this.#count(true, n); }
}

// --- 動作検証 ---

// 1. reverseパターン (ワープする挙動)
const cReverse = new StepFloat(52, StepFloat.Overflow.reverse);

console.log(`【e=52の限界値】 min: ${cReverse.min}, max: ${cReverse.max}`);

// --- 下限突破のテスト ---
// 現在値をあらかじめ最小値（min）に強制設定
cReverse._.v = cReverse.min; 
console.log("現在値（最小値）:", cReverse.v);

// 最小値からさらに down させる（下限突破 → maxへワープするはず）
cReverse.down();
console.log("最小値からdownした値（最大値へ）:", cReverse.v); 
console.assert(cReverse.v === cReverse.max, "下限突破でmaxにワープしていません");


// --- 上限突破のテスト ---
// 現在値をあらかじめ最大値（max）に強制設定
cReverse._.v = cReverse.max; 
console.log("現在値（最大値）:", cReverse.v);

// 最大値からさらに up させる（上限突破 → minへワープするはず）
cReverse.up();
console.log("最大値からupした値（最小値へ）:", cReverse.v); 
console.assert(cReverse.v === cReverse.min, "上限突破でminにワープしていません");




// --- 動作検証 ---
const c = new StepFloat(2); // e=2, 分解能は 1/4 = 0.25

// 正常系：正しい目盛りの値を代入
c.v = 100.25; 
console.assert(c.v === 100.25);

c.v = -50.75;
console.assert(c.v === -50.75);

// 異常系1：範囲超過
try {
    c.v = 3000000000000000; // maxを超える巨大な数
} catch(e) {
    console.log("期待通りのエラー(範囲外):", e.message);
}

// 異常系2：分解能の不一致 (0.25刻みなので、0.1 や 0.3 は弾かれるべき)
try {
    c.v = 10.3; // 2進数で無限小数になり、目盛りにも合わないので即座に弾かれる
} catch(e) {
    console.log("期待通りのエラー(分解能不一致):", e.message);
}
