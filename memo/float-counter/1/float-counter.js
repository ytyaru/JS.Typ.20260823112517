// Number型(IEEE754)で不動少数点を使う時、誤差をなくすには2のマイナス乗単位で計算することで実現できる。
// 普通の算術計算ではそれ以外の数が発生してしまい誤差が生じる。
// そこで2のマイナス乗を最小単位（分解能）とするカウンタを作ってみた。
// e=1:1/2, e=2:1/4, e=3:1/8, e=4:1/16, ..., e=52:1/(2**52) = (Number.EPSILON)
class FloatCounter {
    static Overflow = Object.freeze({
        throw: (self, isDown, nextV) => { 
            throw new RangeError(`値範囲超過。期待値: ${self.min}〜${self.max} 実際値:${nextV}`); 
        },
        ignore: (self, isDown, nextV) => self._.v,
        zero: (self, isDown, nextV) => self._.v = 0,
        reverse: (self, isDown, nextV) => self._.v = isDown ? self.max : self.min,
    });

    constructor(e, over = FloatCounter.Overflow.throw) {
        if (!(Number.isSafeInteger(e) && (1 <= e && e <= 52))) {
            throw new RangeError(`eは1〜52までの整数値であるべきです。指定値: ${e}`);
        }

        if (!Object.values(FloatCounter.Overflow).includes(over)) {
            throw new Error(`overはFloatCounter.Overflowのいずれかであるべきです。`);
        }

        const scale = 2 ** e;
        const max = Number.MAX_SAFE_INTEGER / scale;
        const min = Number.MIN_SAFE_INTEGER / scale;

        this._ = {
            e,
            v: 0, 
            resolution: 1 / scale, 
            min, 
            max,
            over,
        };
    }

    get min() { return this._.min; }
    get max() { return this._.max; }
    get resolution() { return this._.resolution; }
    get isIgnore() { return this._.over === FloatCounter.Overflow.ignore; }
    get v() { return this._.v; }

    // 【追加】値を直接代入するセッター
    set v(x) {
        // 1. 数値型かどうかの基本的なチェック
        //if (typeof x !== 'number' || Number.isNaN(x)) {
            //throw new TypeError(`代入値は有効な数値である必要があります。`);
        if (!Number.isFinite(x)) {
            throw new TypeError(`代入値はNumber.isFinite(x)が真を返す値のみ有効です。`);
        }

        // 2. 範囲内（min〜max）かどうかのチェック
        if (!this.valid(x)) {
            throw new RangeError(`代入値が許容範囲を超えています。範囲: ${this.min} 〜 ${this.max}, 入力値: ${x}`);
        }

        // 3. 分解能（2のe乗の目盛り）に沿っているかどうかの厳密なチェック
        // max以下の値なので、掛け算してもMAX_SAFE_INTEGERを超えず、誤差なく整数判定可能
        if (!Number.isInteger(x * (2 ** this._.e))) {
            throw new TypeError(`代入値 ${x} は、現在の分解能 (1 / 2^${this._.e} = ${this.resolution}) の単位に合致しません。`);
        }

        this._.v = x;
    }

    valid(v) { return this._.min <= v && v <= this._.max; }

    #set(isDown = false) {
        const nextV = this._.v + (this._.resolution * (isDown ? -1 : 1));
        return this.valid(nextV) ? (this._.v = nextV) : this._.over(this, isDown, nextV);
    }

    up() { return this.#set(); }
    down() { return this.#set(true); }
}

// --- 動作検証 ---

// 1. reverseパターン (ワープする挙動)
const cReverse = new FloatCounter(52, FloatCounter.Overflow.reverse);

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
const c = new FloatCounter(2); // e=2, 分解能は 1/4 = 0.25

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
