import { describe, test, expect, beforeEach } from "bun:test";
import { Err } from "../src/err.js";

describe("Err API Tests", () => {
    // 各テストケースの前にグローバル環境を少し綺麗にしておく（必要に応じて）
    beforeEach(() => {
        // 必要であればグローバル汚染のクリーンアップなど
    });

    describe("正常系 (Success Cases)", () => {
        test("1. デフォルトの基底クラス（Error）で単一登録できること", () => {
            const values = Err.regist("AppError");
            const AppError = Err.get("AppError");

            expect(AppError).toBeDefined();
            expect(globalThis.AppError).toBe(AppError);
            expect(Err.has("AppError")).toBe(true);

            const err = new AppError("something went wrong");
            expect(err instanceof AppError).toBe(true);
            expect(err instanceof Error).toBe(true);
            expect(err.name).toBe("AppError");
            expect(err.message).toBe("something went wrong");
        });

        test("2. 独自の基底クラスを指定して継承登録できること", () => {
            Err.regist("BaseAppError", "CustomTypeError TypeError");
            Err.regist("SubAppError", "SubAppError BaseAppError");

            const SubAppError = Err.get("SubAppError");
            const causeErr = new TypeError("original error");
            const err = new SubAppError("wrapped error", causeErr);

            expect(err instanceof SubAppError).toBe(true);
            expect(err instanceof Err.get("BaseAppError")).toBe(true);
            expect(err instanceof TypeError).toBe(true);
            expect(err.cause).toBe(causeErr);
        });

        test("3. 可変長引数で複数同時登録ができ、イテレータが返ること", () => {
            const result = Err.regist("ErrorA", "ErrorB ErrorA");
            expect(Err.has("ErrorA")).toBe(true);
            expect(Err.has("ErrorB")).toBe(true);
            
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
            expect(() => Err.regist("BadError", "BadError NonExistentClass")).toThrow(
                /Base class must be an Error type/
            );
        });

        test("6. 基底クラスがError系ではない（ただの関数やオブジェクト）場合、エラーになること", () => {
            globalThis.NotAnError = function() {};
            expect(() => Err.regist("BadError2", "BadError2 NotAnError")).toThrow(
                /Base class must be an Error type/
            );
        });

        test("7. 既に存在するクラス名を再登録しようとした場合、エラーになること", () => {
            Err.regist("DuplicateError");
            expect(() => Err.regist("DuplicateError")).toThrow(
                /Error class already exists/
            );
        });

        test("8. 同時登録引数内で名前が重複している場合、エラーになること", () => {
            expect(() => Err.regist("SameName", "SameName")).toThrow(
                /Duplicate error class name/
            );
        });

        test("9. 途中でエラーが発生した場合にロールバックされ、何も登録されないこと（トランザクション性）", () => {
            const targetName = "RollbackTargetError";
            
            // 2番目の引数でわざとエラーを起こす（存在しない基底クラスを指定）
            expect(() => {
                Err.regist(targetName, "InvalidClass NonExistentParent");
            }).toThrow();

            // 途中で失敗しているので、1番目の名前も登録されていないはず
            expect(Err.has(targetName)).toBe(false);
            expect(globalThis[targetName]).toBeUndefined();
        });
    });
});
