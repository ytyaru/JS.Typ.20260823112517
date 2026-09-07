import { M } from './tis.js';

export function tof(v) {
    function search(node) {
        if (!node(v)) return null;
        for (const child of Object.values(node)) {
            if (typeof child === 'function' && child._) {
                const deeper = search(child);
                if (deeper) return deeper;
            }
        }
        return node._.path;
    }

    for (const rootNode of Object.values(M)) {
        const matched = search(rootNode);
        if (matched) return matched;
    }
    return 'unknown';
}
