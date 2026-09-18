import { test } from "bun:test";

class TestFailureError extends Error {
    constructor(message) {
        super(message);
        this.name = "TestFailureError";
    }
}

export class Ass {
    static test(fn, ExpectedError, expectedMessage, ...args) {
        const err = Ass.#run(fn);
        Ass.#failThrow(err, ExpectedError);
        const expectedName = new ExpectedError().name;

        if (!(err instanceof ExpectedError) && err.name !== expectedName) {
            throw new TestFailureError(`エラーの型または名前が一致しません。
期待値: Class [${ExpectedError.name}] (name: "${expectedName}")
実際値: Class [${err.constructor?.name}] (name: "${err.name}")`);
        }
        Ass.#failMessage(err, expectedMessage, args);
    }

    static same(fn, ExpectedError, expectedMessage, ...args) {
        const err = Ass.#run(fn);
        Ass.#failThrow(err, ExpectedError);

        if (!(err instanceof ExpectedError)) {
            throw new TestFailureError(`型判定に失敗しました。Realmが異なるか、別の型です。
期待値: ${ExpectedError.name}
実際値: ${err.constructor?.name || "Unknown"}`);
        }
        Ass.#failMessage(err, expectedMessage, args);
    }

    static realm(fn, ExpectedError, expectedMessage, ...args) {
        const err = Ass.#run(fn);
        Ass.#failThrow(err, ExpectedError);
        const expectedName = new ExpectedError().name;

        if (err.name !== expectedName) {
            throw new TestFailureError(`Realmをまたいだ名前比較に失敗しました。
期待値: ${expectedName}
実際値: ${err.name}`);
        }
        Ass.#failMessage(err, expectedMessage, args);
    }

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

    static #failMessage(err, expectedMessage, args) {
        let targetExpect = expectedMessage;
        if (typeof expectedMessage === "function") {
            targetExpect = expectedMessage(...args);
        }

        if (targetExpect instanceof RegExp) {
            if (!targetExpect.test(err.message)) {
                throw new TestFailureError(`エラーメッセージが正規表現にマッチしません。
期待値: ${targetExpect}
実際値: ${err.message}`);
            }
        } else {
            if (err.message !== targetExpect) {
                throw new TestFailureError(`エラーメッセージが一致しません。
期待値: ${targetExpect}
実際値: ${err.message}`);
            }
        }
    }
}

export class Err {
    static test(title, fn, ExpectedError, expectedMessage, cases) {
        // 💡 修正: this.#execute ではなく Err.#execute に変更し、thisの剥がれを根本解決
        Err.#execute(Ass.test, title, fn, ExpectedError, expectedMessage, cases);
    }

    static same(title, fn, ExpectedError, expectedMessage, cases) {
        // 💡 修正: Err.#execute に変更
        Err.#execute(Ass.same, title, fn, ExpectedError, expectedMessage, cases);
    }

    static realm(title, fn, ExpectedError, expectedMessage, cases) {
        // 💡 修正: Err.#execute に変更
        Err.#execute(Ass.realm, title, fn, ExpectedError, expectedMessage, cases);
    }

    static #execute(assMethod, title, fn, ExpectedError, expectedMessage, cases) {
        if (cases !== undefined) {
            if (!Array.isArray(cases)) {
                throw new Error(`[Err API 不正利用] "${title}": casesには配列を渡す必要があります。`);
            }
            if (cases.length === 0) {
                throw new Error(`[Err API 不正利用] "${title}": cases配列が空です。テストデータが1件もありません。`);
            }
            if (Array.isArray(cases) && cases.some(c => !Array.isArray(c) || c.length === 0)) {
                throw new Error(`[Err API 不正利用] "${title}": cases内のネスト配列に空、または配列でない要素が含まれています。`);
            }

            test.each(cases)(title, (...args) => {
                const targetFn = Array.isArray(cases) ? () => fn(...args) : () => fn(args);
                assMethod(targetFn, ExpectedError, expectedMessage, ...args);
            });
        } else {
            test(title, () => assMethod(fn, ExpectedError, expectedMessage));
        }
    }
}
