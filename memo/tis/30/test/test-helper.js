import { tis } from "../src/tis.js";
import { tof } from "../src/tof.js";
class TestError extends Error {
    constructor(message) {
        super(message);
        this.name = "TestError";
    }
}

// ヘルパー：アブブリブーションパスから該当する TypeTreeNode を取得する
const getNodeByPath = (path) => {
    const segments = path.split('.');
    let current = tis;
    for (const seg of segments) {
        current = current[seg];
    }
    return current;
};

export const assertThrow = (fn, expectedAbbrPath, actualValue) => {
    let thrown = false;
    try {fn();}
    catch (e) {
        thrown = true;
        if (!(e instanceof TypeError)) {
            throw new TestError(`[Type Mismatch] Expected TypeError, but got ${e.constructor.name}`);
        }
        const expectedNode = getNodeByPath(expectedAbbrPath);
        const expectedFull = tof.full(expectedNode);
        const actualFull = tof.full(actualValue);
        const actualAbbr = tof.abbr(actualValue);

        const expectedMessage = `Expected: ${expectedFull} (${expectedAbbrPath})\nActual: ${actualFull} (${actualAbbr})`;
        if (e.message !== expectedMessage) {
            throw new TestError(`[Message Mismatch]\n  Expected: ${JSON.stringify(expectedMessage)}\n  Actual:   ${JSON.stringify(e.message)}`);
        }
    }
    if (!thrown) {
        throw new TestError(`[No Exception] Expected TypeError to be thrown for path '${expectedAbbrPath}', but nothing was thrown.`);
    }
}

