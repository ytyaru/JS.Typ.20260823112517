import { tis, defV, getTag } from './tis.js';

export const isTypeTreeNode = v => {
    if (typeof v !== 'function' || !v._ || typeof v._ !== 'object') return false;
    const meta = v._;
    return (
        meta.name &&
        typeof meta.name === 'object' &&
        typeof meta.name.abbr === 'string' &&
        (meta.name.full === null || typeof meta.name.full === 'string') &&
        (meta.parent === null || isTypeTreeNode(meta.parent)) &&
        typeof meta.fn === 'function'
    );
};

const getPath = (typeTreeNode, key, v) => {
    const segments = [];
    let curr = typeTreeNode;
    while (curr) {
        segments.unshift(key === 'abbr' ? curr._.name.abbr : (curr._.name.full || getTag(v !== undefined ? v : defV(curr))));
        curr = curr._.parent;
    }
    return segments.join('.');
};

export const getAbbr = typeTreeNode => getPath(typeTreeNode, 'abbr');
export const getFull = (typeTreeNode, v) => getPath(typeTreeNode, 'full', v);

const search = (typeTreeNode, v) => {
    if (!typeTreeNode(v)) return null;
    for (const child of Object.values(typeTreeNode)) {
        if (isTypeTreeNode(child)) {
            const deeper = search(child, v);
            if (deeper) return deeper;
        }
    }
    return typeTreeNode;
};

const findTypeTreeNode = v => {
    for (const rootNode of Object.values(tis)) {
        const matched = search(rootNode, v);
        if (matched) return matched;
    }
    throw new TypeError(`Value does not match any defined type: ${v}`);
};

const resolveTarget = input => isTypeTreeNode(input) ? input : findTypeTreeNode(input);

export const tof = v => {
    const typeTreeNode = resolveTarget(v);
    return {
        full: getFull(typeTreeNode, isTypeTreeNode(v) ? undefined : v),
        abbr: getAbbr(typeTreeNode)
    };
};

tof.full = v => {
    const typeTreeNode = resolveTarget(v);
    return getFull(typeTreeNode, isTypeTreeNode(v) ? undefined : v);
};

tof.abbr = v => getAbbr(resolveTarget(v));
