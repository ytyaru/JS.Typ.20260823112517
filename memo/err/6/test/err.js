import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { Err } from "../src/err.js";

const FIXED_NAMES = [
    "TestA",
    "TestB",
    "TestDup",
    "BaseTestErr",
    "SubTestErr",
    "RollbackErr",
    "InvalidClass",
    "CustomTestErr",
    "ExtraErr",
    "MyErr",
    "BizError"
];

const cleanup = () => {
    for (const name of FIXED_NAMES) {
        delete globalThis[name];
    }
};

describe("Err API Tests (Complete Coverage & Use Cases)", () => {
    beforeEach(cleanup);
    afterEach(cleanup);

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
            
            expect(Err.isIns(err)).toBe(true);
            expect(Err.isCls(Cls)).toBe(true);
            expect(Err.is(err)).toBe(true);
            expect(Err.is(Cls)).toBe(true);
            
            expect(Err.items.length).toBe(1);
            expect(Err.items).toContain(Cls);
        });

        test("2. 独自の基底クラスを指定して継承登録できること ＆ itemsの累計保持確認", () => {
            expect(Err.items.length).toBe(0);

            Err.regist("BaseTestErr TypeError");
            expect(Err.items.length).toBe(1);
            expect(Err.items).toContain(Err.get("BaseTestErr"));

            Err.regist("SubTestErr BaseTestErr");
            
            expect(Err.items.length).toBe(2);
            expect(Err.items).toContain(Err.get("BaseTestErr"));
            expect(Err.items).toContain(Err.get("SubTestErr"));

            const BaseCls = Err.get("BaseTestErr");
            const SubCls = Err.get("SubTestErr");
            const causeErr = new TypeError("original");
            const err = new SubCls("wrapped", causeErr);

            expect(err instanceof SubCls).toBe(true);
            expect(err instanceof BaseCls).toBe(true);
            expect(err instanceof TypeError).toBe(true);
            expect(err.cause).toBe(causeErr);
            expect(Err.isIns(err)).toBe(true);
            expect(Err.isCls(SubCls)).toBe(true);
        });

        test("3. 可変長引数で複数同時登録ができ、イテレータが返ること・itemsの動作", () => {
            expect(Err.items.length).toBe(0);

            const result = Err.regist("TestA", "TestB TestA");
            expect(Err.has("TestA")).toBe(true);
            expect(Err.has("TestB")).toBe(true);
            
            const classes = Array.from(result);
            expect(classes.length).toBe(2);

            const items = Err.items;
            expect(items.length).toBe(2);
            expect(items).toContain(Err.get("TestA"));
            expect(items).toContain(Err.get("TestB"));

            Err.regist("ExtraErr");
            expect(Err.items.length).toBe(3);
            expect(Err.items).toContain(Err.get("ExtraErr"));
        });
    });

    describe("実践的ユースケース (Real-world Use Cases)", () => {
        test("11. try-catch構文で独自例外型と非独自型（TypeError等）を正しく分岐できること", () => {
            const [MyErr] = Err.regist("MyErr");

            // ケースA: 独自例外が発生した場合 -> Err.is(e) が true になること（falseならテスト失敗）
            try {
                throw new MyErr("business logic failed");
            } catch (e) {
                expect(Err.is(e)).toBe(true);
                expect(Err.isIns(e)).toBe(true);
                expect(e.name).toBe("MyErr");
            }

            // ケースB: 非独自例外（TypeErrorなど）が発生した場合 -> Err.is(e) が false になること（trueならテスト失敗）
            try {
                throw new TypeError("unexpected system error");
            } catch (e) {
                expect(Err.is(e)).toBe(false);
                expect(Err.isIns(e)).toBe(false);
                expect(e instanceof TypeError).toBe(true);
            }
        });
    });
    describe("判定・検証APIの網羅系 (Inspection API Cases)", () => {
        test("10. isCls, isIns, is が不正な値に対して安全にfalseを返すこと", () => {
            Err.regist("CustomTestErr");
            const Cls = Err.get("CustomTestErr");
            const err = new Cls("msg");

            expect(Err.isCls(null)).toBe(false);
            expect(Err.isCls(undefined)).toBe(false);
            expect(Err.isCls(Error)).toBe(false);
            expect(Err.isCls(function() {})).toBe(false);
            expect(Err.isCls("CustomTestErr")).toBe(false);

            expect(Err.isIns(null)).toBe(false);
            expect(Err.isIns(undefined)).toBe(false);
            expect(Err.isIns(new Error("std"))).toBe(false);
            expect(Err.isIns({})).toBe(false);
            expect(Err.isIns("error string")).toBe(false);

            expect(Err.is(null)).toBe(false);
            expect(Err.is(undefined)).toBe(false);
            expect(Err.is(123)).toBe(false);
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
            expect(Err.items.length).toBe(0);
        });
    });
});
