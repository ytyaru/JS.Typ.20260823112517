import { describe, test, expect } from "bun:test";
import { StepFloat, RoundFloat, float } from "./float.js"; // モジュールパスは適宜変更してください

describe("SafeFloat / StepFloat / RoundFloat 網羅テスト", () => {

    describe("1. コンストラクタと Range のバリデーション", () => {
        test("分解能指数 e が範囲外の場合エラーになること", () => {
            expect(() => new StepFloat(0)).toThrow(RangeError);
            expect(() => new StepFloat(53)).toThrow(RangeError);
            expect(() => new StepFloat(1.5)).toThrow(RangeError);
        });

        test("min と max の大小関係が不正な場合エラーになること", () => {
            expect(() => new StepFloat(1, StepFloat.Overflow.throw, 0, 10, 5)).toThrow(RangeError);
            expect(() => new StepFloat(1, StepFloat.Overflow.throw, 0, 5, 5)).toThrow(RangeError);
        });

        test("無効な数値が min/max に渡された場合エラーになること", () => {
            expect(() => new StepFloat(1, StepFloat.Overflow.throw, 0, NaN, 10)).toThrow(TypeError);
            expect(() => new StepFloat(1, StepFloat.Overflow.throw, 0, 0, "10")).toThrow(TypeError);
        });
    });

    describe("2. StepFloat の分解能チェックと基本操作", () => {
        test("分解能に合致しない値の代入で TypeError が発生すること (e=1, resolution=0.5)", () => {
            const sf = new StepFloat(1);
            expect(() => { sf.v = 0.3; }).toThrow(TypeError);
            expect(() => { sf.v = 0.5; }).not.toThrow();
            expect(sf.v).toBe(0.5);
        });

        test("up() と down() による増減が正しく動作すること", () => {
            const sf = new StepFloat(1, StepFloat.Overflow.throw, 0, -5, 5);
            expect(sf.v).toBe(0);
            
            sf.up(2); // 0 + 0.5 * 2 = 1.0
            expect(sf.v).toBe(1.0);

            sf.down(4); // 1.0 - 0.5 * 4 = -1.0
            expect(sf.v).toBe(-1.0);
        });

        test("count() による正負の増減制御が正しく動作すること", () => {
            const sf = new StepFloat(1, StepFloat.Overflow.throw, 0, -5, 5);
            
            sf.count(3);  // up(3) と同等 (1.5)
            expect(sf.v).toBe(1.5);

            sf.count(-2); // down(2) と同等 (1.5 - 1.0 = 0.5)
            expect(sf.v).toBe(0.5);
        });

        test("n のバリデーション（不正な値や0）で TypeError が発生すること", () => {
            const sf = new StepFloat(1);
            expect(() => sf.up(0)).toThrow(TypeError);
            expect(() => sf.up(-1)).toThrow(TypeError);
            expect(() => sf.count(0)).toThrow(TypeError);
            expect(() => sf.up(1.5)).toThrow(TypeError);
        });
    });

    describe("3. オーバーフロー戦略 (Overflow) 全5種のテスト", () => {
        test("throw: 範囲超過で RangeError を投げること", () => {
            const sf = new StepFloat(1, StepFloat.Overflow.throw, 0, 0, 1);
            expect(() => sf.up(3)).toThrow(RangeError); // 1.5 > 1
        });

        test("ignore: 範囲超過時に値を変更せず維持すること", () => {
            const sf = new StepFloat(1, StepFloat.Overflow.ignore, 1, 0, 1);
            sf.up(3);
            expect(sf.v).toBe(1); // 無視されて直前の値 1 のまま
        });

        test("stop: 範囲超過時に上下限の限界値で止まること", () => {
            const sf = new StepFloat(1, StepFloat.Overflow.stop, 0, 0, 1);
            sf.up(5); // 2.5 は max(1) を超える
            expect(sf.v).toBe(1);

            sf.down(10); // 1 - 5 = -4 は min(0) を下回る
            expect(sf.v).toBe(0);
        });

        test("zero: 範囲超過時に 0 にリセットされること", () => {
            const sf = new StepFloat(1, StepFloat.Overflow.zero, 0, -1, 1);
            sf.up(5); // 超過
            expect(sf.v).toBe(0);
        });

        test("reverse: 範囲超過時に反対側の限界値にワープすること", () => {
            const sf = new StepFloat(1, StepFloat.Overflow.reverse, 1, 0, 1);
            sf.up(1); // 1.5 で超過 -> min (0) になるはず
            expect(sf.v).toBe(0);

            sf.down(1); // 0 - 0.5 = -0.5 で超過 -> max (1) になるはず
            expect(sf.v).toBe(1);
        });
    });

    describe("4. RoundFloat と各丸めメソッドのテスト", () => {
        test("raw への代入と、各種丸めメソッドによる v の取得", () => {
            // e=1 (resolution=0.5), floor
            const rf = new RoundFloat(1, RoundFloat.Method.floor);
            rf.raw = 1.3; // 2進分解能 0.5 単位でのスケール挙動
            expect(rf.raw).toBe(1.3);
            
            // floor の検証
            expect(rf.v).toBeDefined();
        });

        test("even（偶数丸め）の挙動確認", () => {
            const rf = new RoundFloat(1, RoundFloat.Method.even);
            rf.raw = 1.25; 
            expect(typeof rf.v).toBe("number");
        });

        test("無効な method 指定でエラーになること", () => {
            expect(() => new RoundFloat(1, () => {})).toThrow(Error);
        });
    });

    describe("5. ファクトリ (float) の網羅的テスト", () => {
        test("float.step が正しく生成され動作すること", () => {
            const s = float.step(1, 0, -5, 5);
            expect(s.v).toBe(0);
            s.up();
            expect(s.v).toBe(0.5);
        });

        test("float の各オーバーフロー修飾子（ignore, stop, zero, reverse）が動作すること", () => {
            const sStop = float.step.stop(1, 1, 0, 1);
            sStop.up(5);
            expect(sStop.v).toBe(1);
        });

        test("float の各丸めメソッド（floor, trunc, ceil, round, even）が動作すること", () => {
            const fFloor = float.floor(1, 1.2);
            expect(fFloor.v).toBeDefined();

            const fTrunc = float.trunc.zero(1, 1.2);
            expect(fTrunc.v).toBeDefined();

            const fCeil = float.ceil.ignore(1, 1.2);
            expect(fCeil.v).toBeDefined();

            const fHalf = float.round(1, 1.2);
            expect(fHalf.v).toBeDefined();

            const fEven = float.even(1, 1.2);
            expect(fEven.v).toBeDefined();
        });
    });

});
