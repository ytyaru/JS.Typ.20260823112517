// 整数と少数の二つ合わせて十進数値の15桁以内であること。
export class Figure {
    static #TOTAL = 15;
    constructor(fig=1) {
        const full = new Range(1,Figure.#TOTAL-1);
        full.throw(fig);
        this._{i:Figure.#TOTAL-fig, f:fig};
//        if (!(Number.isSafeInteger(fig) && 0<fig && fig<16)) {throw new RangeError(`figは1〜14の整数であるべきです。これは小数部の桁数です。整数、少数、両方合わせて15桁以内にすべきです。`)}
    }
    get i() {return this._.i}
    get f() {return this._.f}
    get t() {return this._.i+this._.f}
}
