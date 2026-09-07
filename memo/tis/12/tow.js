import { tis } from './tis.js';
import { tof, getAbbr, getFull, isTypeTreeNode } from './tof.js';

const createAssertNode = typeTreeNode => {
    const assertFn = v => {
        if (!typeTreeNode(v)) {
            const expectedAbbr = getAbbr(typeTreeNode);
            const expectedFull = getFull(typeTreeNode);
            const actualAbbr = tof.abbr(v);
            const actualFull = tof.full(v);
            throw new TypeError(`Expected: ${expectedFull} (${expectedAbbr})\nActual: ${actualFull} (${actualAbbr})`);
        }
        return true;
    };

    assertFn._ = typeTreeNode._;

    for (const [key, child] of Object.entries(typeTreeNode)) {
        if (isTypeTreeNode(child)) {
            assertFn[key] = createAssertNode(child);
        }
    }

    return assertFn;
};

const assertM = {};
for (const [key, typeTreeNode] of Object.entries(tis)) {
    assertM[key] = createAssertNode(typeTreeNode);
}

export const tow = assertM;
