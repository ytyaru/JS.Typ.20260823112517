import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { Err } from "../src/err.js";

// テストで使い回す固定の名前リスト（グローバル汚染のクリーンアップ対象）
const FIXED_NAMES = [
    "TestA",
    "TestB",
    "TestDup",
    "BaseTestErr",
    "SubTestErr",
    "RollbackErr",
    "InvalidClass"
];

// テストごとにグローバルと内部マップを完全に掃除するヘルパー
const cleanupGlobal = () => {
    for (const name of FIXED_NAMES) {
        delete globalThis[name];
    }
};

describe("Err API Tests (Fixed Name & Cleanup Approach)", () => {
    beforeEach(() => {
        cleanupGlobal();
    });

    afterEach(() => {
        cleanupGlobal();
    });

    describe("正常系 (Success Cases)", () => {
        test("1. デフォルトの基底クラス（Error）で単一登録できること", () => {
            Err.regist("TestA");
            const Cls = Err.get("TestA");

            expect(Cls).toBeDefined();
            expect(globalThis.TestA).toBe(Cls);
            expect(Err.has("TestA")).toBe(true);

            const err = new Cls("test message");
            expect(err instanceof Cls).toBe(true);
            expect(err instanceof Error).toBe(true);
            expect(err.name).toBe("TestA");
        });

        test("2. 独自の基底クラスを指定して継承登録できること", () => {
            Err.regist("BaseTestErr TypeError");
            Err.regist("SubTestErr BaseTestErr");

            const SubCls = Err.get("SubTestErr");
            const causeErr = new TypeError("original");
            const err = new SubCls("wrapped", causeErr);

            expect(err instanceof SubCls).toBe(true);
            expect(err instanceof Err.get("BaseTestErr")).toBe(true);
            expect(err instanceof TypeError).toBe(true);
            expect(err.cause).toBe(causeErr);
        });

        test("3. 可変長引数で複数同時登録ができ、イテレータが返ること", () => {
            const result = Err.regist("TestA", "TestB TestA");
            expect(Err.has("TestA")).toBe(true);
            expect(Err.has("TestB")).toBe(true);
            
            const classes = Array.from(result);
            expect(classes.length).toBe(2);
        });
    });

    describe("異常系・バリデーション (Error & Validation Cases)", () => {
        test("4. 文字列以外の引数を渡した場合、TypeErrorになること", () => {
            expect(() => Err.regist(123)).toThrow(TypeError);
            expect(() => Err.regist(null)).toThrow(TypeError);
        });

        test("5. 存在しない基底クラスを指定した場合、エラーになること", () => {
            expect(() => Err.regist("TestA NonExistentParent")).toThrow(
                /Base class must be an Error type/
            );
        });

        test("6. 基底クラスがError系ではない場合、エラーになること", () => {
            globalThis.NotAnError = function() {};
            expect(() => Err.regist("TestA NotAnError")).toThrow(
                /Base class must be an Error type/
            );
            delete globalThis.NotAnError;
        });

        test("7. 既に存在するクラス名を再登録しようとした場合、エラーになること", () => {
            Err.regist("TestDup");
            expect(() => Err.regist("TestDup")).toThrow(
                /Error class already exists/
            );
        });

        test("8. 同時登録引数内で名前が重複している場合、エラーになること", () => {
            expect(() => Err.regist("TestDup", "TestDup")).toThrow(
                /Duplicate error class name/
            );
        });

        test("9. 途中でエラーが発生した場合にロールバックされ、何も登録されないこと", () => {
            expect(() => {
                Err.regist("RollbackErr", "InvalidClass NonExistentParent");
            }).toThrow();

            expect(Err.has("RollbackErr")).toBe(false);
            expect(globalThis.RollbackErr).toBeUndefined();
        });
    });
});
