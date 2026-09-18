import { test } from "bun:test";

export class TestFailureError extends Error {
    constructor(message) {
        super(message);
        this.name = "TestFailureError";
    }
}

export class TestDefinitionError extends Error {
    constructor(message) {
        super(message);
        this.name = "TestDefinitionError";
    }
}

export class Ass {
    static test(fn, ExpectedError, expectedMessage, ...args) {
        Ass.#validateArgs(fn, ExpectedError, expectedMessage);
        
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
        Ass.#validateArgs(fn, ExpectedError, expectedMessage);

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
        Ass.#validateArgs(fn, ExpectedError, expectedMessage);

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

    // 💡 解決: 動的な名前取得もリテラルも全廃。簡潔な事実のみを伝える
    static #validateArgs(fn, ExpectedError, expectedMessage) {
        if (typeof fn !== "function") {
            throw new TestDefinitionError(`第1引数(fn)は関数であるべきです。実際値: ${typeof fn}`);
        }
        if (typeof ExpectedError !== "function" || !(ExpectedError.prototype instanceof Error || ExpectedError === Error)) {
            throw new TestDefinitionError(`第2引数(ExpectedError)はError例外型であるべきです。実際値: ${ExpectedError?.name || typeof ExpectedError}`);
        }
        const msgType = typeof expectedMessage;
        if (msgType !== "string" && msgType !== "function" && !(expectedMessage instanceof RegExp)) {
            throw new TestDefinitionError(`第3引数(expectedMessage)は文字列、正規表現、または関数であるべきです。実際値: ${msgType}`);
        }
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
    static test(title, fn, ExpectedError, expectedMessage, cases = undefined) {
        Err.#execute(Ass.test, title, fn, ExpectedError, expectedMessage, cases);
    }

    static same(title, fn, ExpectedError, expectedMessage, cases = undefined) {
        Err.#execute(Ass.same, title, fn, ExpectedError, expectedMessage, cases);
    }

    static realm(title, fn, ExpectedError, expectedMessage, cases = undefined) {
        Err.#execute(Ass.realm, title, fn, ExpectedError, expectedMessage, cases);
    }

    static #execute(assMethod, title, fn, ExpectedError, expectedMessage, cases) {
        if (cases !== undefined) {
            if (!Array.isArray(cases)) {
                throw new TestDefinitionError(`[Err API 不正利用] "${title}": casesには配列を渡す必要があります。`);
            }
            if (cases.length === 0) {
                throw new TestDefinitionError(`[Err API 不正利用] "${title}": cases配列が空です。テストデータが1件もありません。`);
            }

            const isNestedArray = Array.isArray(cases[0]);

            if (isNestedArray && cases.some(c => !Array.isArray(c) || c.length === 0)) {
                throw new TestDefinitionError(`[Err API 不正利用] "${title}": cases内のネスト配列に空、または配列でない要素が含まれています。`);
            }

            test.each(cases)(title, (...args) => {
                // 💡 前々回に全件合格した「直通（仕分けをしない）」論理を完全に維持
                assMethod(() => fn(...args), ExpectedError, expectedMessage, ...args);
            });
        } else {
            test(title, () => assMethod(fn, ExpectedError, expectedMessage));
        }
    }
}
