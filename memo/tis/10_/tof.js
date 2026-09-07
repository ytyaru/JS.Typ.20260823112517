// tof.js
import { tis, getTag } from './tis.js';

const getPath = (node, key, v) => {
    const segments = [];
    let curr = node;
    while (curr) {
        segments.unshift(key === 'abbr' ? curr._.name.abbr : (curr._.name.full || getTag(v)));
        curr = curr._.parent;
    }
    return segments.join('.');
};

export const getAbbr = node => getPath(node, 'abbr');
export const getFull = (v, node) => getPath(node, 'full', v);

const search = (node, v) => {
    if (!node(v)) return null;
    for (const child of Object.values(node)) {
        if (typeof child === 'function' && child._) {
            const deeper = search(child, v);
            if (deeper) return deeper;
        }
    }
    return node;
};

const findNode = v => {
    for (const rootNode of Object.values(tis)) {
        const matched = search(rootNode, v);
        if (matched) return matched;
    }
    throw new TypeError(`Value does not match any defined type: ${v}`);
};

export const tof = v => {
    const node = findNode(v);
    return {
        full: getFull(v, node),
        abbr: getAbbr(node)
    };
};

tof.full = v => getFull(v, findNode(v));
tof.abbr = v => getAbbr(findNode(v));
