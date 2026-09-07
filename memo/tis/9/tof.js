import { M } from './tis.js';

function search(node, v) {
    if (!node(v)) return null;
    for (const child of Object.values(node)) {
        if (typeof child === 'function' && child._) {
            const deeper = search(child, v);
            if (deeper) return deeper;
        }
    }
    return node._.path;
}

export function tof(v) {
    for (const rootNode of Object.values(M)) {
        const matched = search(rootNode, v);
        if (matched) return matched;
    }
    return 'unknown';
}
