import { test } from "bun:test";

class TestFailureError extends Error {
    constructor(message) {
        super(message);
        this.name = "TestFailureError";
    }
}

/**
 * 純粋な例外検証（アサーション）のみを行うクラス
 * test.each など、すでにテストブロックが用意されている場所で使用する
 */
export class Ass {
    /**
     * 1. 兼用 (基本は型チェック、Realm差異の可能性があれば救済)
     */
    static test(fn, ExpectedError, expectedMessage) {
        const err = this.#run(fn);
        this.#failThrow(err, ExpectedError);
        const expectedName = new ExpectedError().name;

        if (!(err instanceof ExpectedError) && err.name !== expectedName) {
            throw new TestFailureError(`エラーの型も名前も一致しません。
期待値: Class [${ExpectedError.name}] (name: "${expectedName}")
実際値: Class [${err.constructor?.name}] (name: "${err.name}")`);
        }
        this.#failMessage(err, expectedMessage);
    }

    /**
     * 2. Realm同一用 (プロトタイプチェーンまで厳格に型判定)
     */
    static same(fn, ExpectedError, expectedMessage) {
        const err = this.#run(fn);
        this.#failThrow(err, ExpectedError);

        if (!(err instanceof ExpectedError)) {
            throw new TestFailureError(`型判定に失敗しました。Realmが異なるか、別の型です。
期待値: ${ExpectedError.name}
実際値: ${err.constructor?.name || "Unknown"}`);
        }
        this.#failMessage(err, expectedMessage);
    }

    /**
     * 3. Realm差異用 (型を無視し、name文字列とメッセージだけで判定)
     */
    static realm(fn, ExpectedError, expectedMessage) {
        const err = this.#run(fn);
        this.#failThrow(err, ExpectedError);
        const expectedName = new ExpectedError().name;

        if (err.name !== expectedName) {
            throw new TestFailureError(`Realmをまたいだ名前比較に失敗しました。
期待値: ${expectedName}
実際値: ${err.name}`);
        }
        this.#failMessage(err, expectedMessage);
    }

    // ── 内部ヘルパー ──

    static #run(fn) {
        let err = null;
        try { fn(); } catch (error) { err = error; }
        return err;
    }

    static #failThrow(err, ExpectedError) {
        if (err === null) {
            throw new TestFailureError(`例外発生が期待された所で発生しませんでした。: ${ExpectedError.name}`);
        }
    }

    static #failMessage(err, expectedMessage) {
        if (expectedMessage instanceof RegExp) {
            if (!expectedMessage.test(err.message)) {
                throw new TestFailureError(`エラーメッセージが正規表現にマッチしません。
期待値: ${expectedMessage}
実際値: ${err.message}`);
            }
        } else {
            if (err.message !== expectedMessage) {
                throw new TestFailureError(`エラーメッセージが一致しません。
期待値: ${expectedMessage}
実際値: ${err.message}`);
            }
        }
    }
}

/**
 * テストケース宣言（testブロック）を自動でラップするクラス
 * 単発の例外テストを簡潔に書きたい場合に使用する
 */
export class Err {
    static test(title, fn, ExpectedError, expectedMessage) {
        test(title, () => Ass.test(fn, ExpectedError, expectedMessage));
    }

    static same(title, fn, ExpectedError, expectedMessage) {
        test(title, () => Ass.same(fn, ExpectedError, expectedMessage));
    }

    static realm(title, fn, ExpectedError, expectedMessage) {
        test(title, () => Ass.realm(fn, ExpectedError, expectedMessage));
    }
}
