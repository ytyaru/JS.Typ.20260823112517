import { tis, getTag, defV } from './tis.js';
import { tow } from './tow.js';
import { isTypeTreeNode } from './tof.js';
/*
const getObjPath = (path, root) => {
    const segments = path.split('.');
    let curr = root;
    for (const segment of segments) {
//        if (!curr || typeof curr !== 'object' && typeof curr !== 'function') return undefined;
        if (!isTypeTreeNode(curr)) return undefined;
        let found = null;
        for (const [key, child] of Object.entries(curr)) {
            //if (child && (typeof child === 'function' || typeof child === 'object') && child._) {
            if (isTypeTreeNode(child)) {
                const abbr = child._.name.abbr;
                const full = child._.name.full || getTag(defV(child));
                // キー名、abbr、fullが一致するかチェック
                if (key === segment || abbr === segment || full === segment) {found = child; break;}
            }
        }
        if (!found) return undefined;
        curr = found;
    }
    if (typeof curr !== 'function') throw new TypeError(`Invalid path for is: ${path}`);
    return curr;
};
*/
const getObjPath = (path, root) => {
    const segments = path.split('.');
    let curr = root;

    for (const segment of segments) {
        if (!curr || (typeof curr !== 'object' && typeof curr !== 'function')) return undefined;

        // 1. まず直接のプロパティ（キー名や短縮名など）として存在するかチェック
        let found = curr[segment];

        // 2. 直接ヒットしない場合、子要素の abbr や full 名から一致するものを探索
        if (!found) {
            for (const child of Object.values(curr)) {
                if (isTypeTreeNode(child)) {
                    const abbr = child._.name.abbr;
                    const full = child._.name.full || getTag(defV(child));
                    if (abbr === segment || full === segment) {
                        found = child;
                        break;
                    }
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
    ow: path => getObjPath(path, tow),
};
const tal = { // Type Call -> tal
    is: (path, ...args) => tet.is(path)(...args),
    ow: (path, ...args) => tet.ow(path)(...args),
};
export { tet, tal };
