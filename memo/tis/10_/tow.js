import { tis } from './tis.js';
import { tof, getAbbr, getFull } from './tof.js';

const createAssertNode = node => {
    const assertFn = v => {
        if (!node(v)) {
            const expectedAbbr = getAbbr(node);
            const expectedFull = getFull(v, node);
            const actualAbbr = tof.abbr(v);
            const actualFull = tof.full(v);
            throw new TypeError(`Expected: ${expectedFull} (${expectedAbbr})\nActual: ${actualFull} (${actualAbbr})`);
        }
        return true;
    };

    assertFn._ = node._;

    for (const [key, child] of Object.entries(node)) {
        if (typeof child === 'function' && child._) {
            assertFn[key] = createAssertNode(child);
        }
    }

    return assertFn;
};

const assertM = {};
for (const [key, node] of Object.entries(tis)) {
    assertM[key] = createAssertNode(node);
}

export const tow = assertM;
