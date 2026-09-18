import { test, expect } from "bun:test";

// テスト失敗を明示するためのカスタムエラー
class TestFailureError extends Error {
    constructor(message) {
        super(message);
        this.name = "TestFailureError"; // JSの欠陥対策としてnameを手動セット
    }
}

export class Err {
    /**
     * 1. 兼用API (基本は型チェック、Realm差異の可能性があれば救済)
     */
    static test(title, fn, ExpectedError, expectedMessage) {
        test(title, () => {
            const err = this.#run(fn);
            this.#failThrow(err, ExpectedError);
            /*
             let err = null;
            try {
                fn();
            } catch (error) {
                err = error;
            }

            // ── 欠陥1対策: 例外が一切発生しなかった場合
            if (err === null) {
                throw new TestFailureError(`期待された例外 [${ExpectedError.name}] が発生しませんでした。`);
            }
            */
            const expectedName = new ExpectedError().name;

            // 型（instanceof）も nameプロパティも一致しない場合は完全な別物
            if (!(err instanceof ExpectedError) && err.name !== expectedName) {
                throw new TestFailureError(
//                    `エラーの型（または名前）が一致しません。\n` +
                    `エラーの型も名前も一致しません。\n` +
                    `期待値: Class [${ExpectedError.name}] (name: "${expectedName}")\n` +
                    `実際値: Class [${err.constructor?.name}] (name: "${err.name}")`
                );
            }
            this.#failMessage(err, expectedMessage);
            /*
            // メッセージの検証
            if (err.message !== expectedMessage) {
                throw new TestFailureError(
                    `エラーメッセージが一致しません。\n` +
                    `期待値: "${expectedMessage}"\n` +
                    `実際値: "${err.message}"`
                );
            }
            */
        });
    }

    /**
     * 2. Realm同一用API (プロトタイプチェーンまで厳格に型判定)
     */
    static same(title, fn, ExpectedError, expectedMessage) {
        test(title, () => {
            const err = this.#run(fn);
            this.#failThrow(err, ExpectedError);
            /*
            let err = null;
            try { fn(); } catch (error) { err = error; }

            if (err === null) {
                throw new TestFailureError(`期待された例外 [${ExpectedError.name}] が発生しませんでした。`);
            }
            */
            // 厳格な型（プロトタイプ）判定
            if (!(err instanceof ExpectedError)) {
                throw new TestFailureError(
                    `厳格な型判定に失敗しました。Realmが異なるか、別型のエラーです。\n` +
                    `期待値: ${ExpectedError.name}\n` +
                    `実際値: ${err.constructor?.name || "Unknown"}`
                );
            }

//            if (err.message !== expectedMessage) {
//                throw new TestFailureError(`メッセージ不一致: 期待 "${expectedMessage}" / 実際 "${err.message}"`);
//            }
            this.#failMessage(err, expectedMessage);
        });
    }

    /**
     * 3. Realm差異用API (型を無視し、name文字列とメッセージだけで判定)
     */
    static realm(title, fn, ExpectedError, expectedMessage) {
        test(title, () => {
            const err = this.#run(fn);
            this.#failThrow(err, ExpectedError);
    
//            let err = null;
//            try { fn(); } catch (error) { err = error; }

//            if (err === null) {
//                throw new TestFailureError(`期待された例外 [${ExpectedError.name}] が発生しませんでした。`);
//            }

            const expectedName = new ExpectedError().name;

            // 型は無視して、nameプロパティの文字列だけで判定（偶然の一致リスクを許容）
            if (err.name !== expectedName) {
                throw new TestFailureError(`Realmをまたいだ名前比較に失敗: 期待 "${expectedName}" / 実際 "${err.name}"`);
            }

//            if (err.message !== expectedMessage) {
//                throw new TestFailureError(`メッセージ不一致: 期待 "${expectedMessage}" / 実際 "${err.message}"`);
//            }
            this.#failMessage(err, expectedMessage);
        });
    }
    static #run(fn) {
        let err = null;
        try { fn(); } catch (error) { err = error; }
        return err;
    }
    static #failThrow(err, ExpectedError) {
        if (err === null) {
            throw new TestFailureError(`期待された例外 [${ExpectedError.name}] が発生しませんでした。`);
        }
    }
    static #failMessage(err, expectedMessage) {
        if (err.message !== expectedMessage) {
            throw new TestFailureError(
                `エラーメッセージが一致しません。\n` +
                `期待値: "${expectedMessage}"\n` +
                `実際値: "${err.message}"`
            );
        }
    }
}
