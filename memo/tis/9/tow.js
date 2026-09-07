import { M } from './tis.js';
import { tof } from './tof.js';

function mkTow(node, tofFn) {
    const wrapper = function(v, ...args) {
        const isValid = node(v, ...args);
        if (!isValid) {
            const actualType = tofFn(v);
            throw new TypeError(`Expected: ${node._.path}\nActual: ${actualType}`);
        }
        return true;
    };
    Object.setPrototypeOf(wrapper, Object.getPrototypeOf(node));
    wrapper._ = {
        name: node._.name,
        parent: node._.parent,
        get path() { return node._.path; }
    };

    for (const [key, child] of Object.entries(node)) {
        if (typeof child === 'function' && child._) {
            wrapper[key] = mkTow(child, tofFn);
        }
    }
    return wrapper;
}

const tow = {};
for (const [k, rootNode] of Object.entries(M)) {
    tow[k] = mkTow(rootNode, tof);
}

export { tow };


