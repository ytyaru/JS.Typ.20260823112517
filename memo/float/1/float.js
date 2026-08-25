// Number型における十進数からみて安全に扱える少数。
class Float {
    /**
     * Number型における十進数からみた指定小数桁数を安全に扱える範囲を返却する
     * @param {number} fig - 小数部の最長桁数（1以上の整数）
     * @returns {{number, number}} {min, max} の範囲
     */
    static getRange(fig) {
        // 引数のバリデーション
        if (!Number.isInteger(fig)) {throw new TypeError("小数部の桁数 fig はNumber型整数であるべきです。");}
        if (fig < 1) {throw new RangeError("小数部の桁数 fig は1以上の整数であるべきです。");}
        const maxSafeInt = Number.MAX_SAFE_INTEGER; // 9007199254740991
        const factor = 10 ** fig;
        if (factor > maxSafeInt) {throw new RangeError(`小数部 ${fig} 桁は安全な精度限界を超えているため扱えません。`);}
        const max = Math.floor(maxSafeInt / factor);
        const min = -max;
        return {min, max, factor};
    }
    constructor(fig=1, v=0) {
        this._ = {v, fig, ...Float.getRange(fig)};
        this.v = v;
    }
    get fig() {return this._.fig}
    get min() {return this._.min}
    get max() {return this._.max}
    get v() {return this._.v;}
    set v(x) {
        if (!Number.isFinite(x)) {throw new TypeError("値 v は有限数であるべきです。");}
        if (x < this._.min || this._.max < x) {throw new RangeError(`${x} は範囲を超過しました。Expected: ${this._.min}〜${this._.max}`)}
        this._.v = this._truncTo(x);
    }
    _to(v, method='trunc') {
        // 浮動小数点の乗算誤差を抑えるため、整数値にスケールして安全範囲内か確認
        // 文字列化または正確な丸め処理を行う
        const scaled = v * this._.factor;
        if (!Number.isFinite(scaled) || Math.abs(scaled) > Number.MAX_SAFE_INTEGER) {
            throw new RangeError(`${v} を 小数部 ${this.fig} 桁で扱うには安全な精度限界を超えています。`);
        }
        const rounded = Math[method](scaled);
        return round / this._.factor;
    }
    /*
    _truncTo(v) {
        // 浮動小数点の乗算誤差を抑えるため、整数値にスケールして安全範囲内か確認
        // 文字列化または正確な丸め処理を行う
        const scaled = v * this._.factor;
        if (!Number.isFinite(scaled) || Math.abs(scaled) > Number.MAX_SAFE_INTEGER) {
            throw new RangeError(`${v} を 小数部 ${this.fig} 桁で扱うには安全な精度限界を超えています。`);
        }
        // 切り捨て処理（Math.truncを使用）
        const truncated = Math.trunc(scaled);
        return truncated / this._.factor;
    }
    */
}
