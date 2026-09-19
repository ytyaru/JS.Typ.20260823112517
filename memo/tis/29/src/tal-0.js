import { tis, getTag, defV } from './tis.js';
import { tow } from './tow.js';

const getObjPath = (path, root) => {
    const segments = path.split('.');
    let curr = root;

    for (const segment of segments) {
        if (!curr || typeof curr !== 'object' && typeof curr !== 'function') return undefined;

        let found = null;
        for (const [key, child] of Object.entries(curr)) {
            if (child && (typeof child === 'function' || typeof child === 'object') && child._) {
                const abbr = child._.name.abbr;
                const full = child._.name.full || getTag(defV(child));

                // キー名、abbr、fullが一致するかチェック（大文字小文字を問わない比較も許容するか否か）
                if (
                    key === segment ||
                    abbr === segment ||
//                    (full && full.toLowerCase() === segment.toLowerCase()) ||
//                    abbr.toLowerCase() === segment.toLowerCase()
                ) {
                    found = child;
                    break;
                }
            }
        }
        if (!found) return undefined;
        curr = found;
    }
    if (typeof curr !== 'function') throw new TypeError(`Invalid path for is: ${path}`);
    return curr;
};

const tet = { // Type tree node Get -> tet
    is: path => getObjPath(path, tis),
    throw: path => getObjPath(path, tow),
};

const tal = { // Type Call -> tal
    is: (path, ...args) => {
        const fn = tet.is(path);
//        if (typeof fn !== 'function') throw new TypeError(`Invalid path for is: ${path}`);
        return fn(...args);
    },
    throw: (path, ...args) => {
        const fn = tet.throw(path);
//        if (typeof fn !== 'function') throw new TypeError(`Invalid path for throw: ${path}`);
        return fn(...args);
    },
};

export { tet, tal };
