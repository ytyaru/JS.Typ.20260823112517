import {tof} from './tof.js';
const mkFO = (someFn, mds = {}) => {
    // 戻り値となる関数本体
    const fn = function(v, ...args) {
        if (new.target) throw new ReferenceError('Constructors are not allowed.');
        return someFn(v, ...args);
    };
    
    // someFn 自身を .some として保持
    fn.some = someFn;

    // 子のメソッド群をバインドして割り当て
    for (const [k, v] of Object.entries(mds)) {
        fn[k] = v;
    }

    return fn;
};
const mkErFO = (fo, pathStr) => {
    const someFn = (v, ...args) => {
        if (fo.some(v, ...args)) return true;
        //throw new TypeError(`Expected: a value that makes '${pathStr}' return true.\nActual: ${tof(v)}`);
        throw new TypeError(`Expected: a value that makes '${pathStr}(v)' return true.\nActual: ${tof(v)}`);
    };

    const props = {};
    
    for (const key of Object.getOwnPropertyNames(fo)) {
        if (['some', 'length', 'name', 'prototype', 'caller', 'arguments'].includes(key)) continue;
        const val = fo[key];
        
        if (typeof val === 'function') {
            const subKeys = Object.getOwnPropertyNames(val).filter(
                k => !['some', 'length', 'name', 'prototype', 'caller', 'arguments'].includes(k)
            );
            
            // 子がさらに子を持つ場合（ネスト構造）または mkFO で作られた関数階層の場合
            if (subKeys.length > 0 || typeof val.some === 'function') {
                const subPathStr = pathStr.replace(/\.some$/, `.${key}.some`);
                props[key] = mkErFO(val, subPathStr);
            } else {
                props[key] = (v, ...args) => {
                    if (val(v, ...args)) return true;
                    throw new TypeError(`Expected: '${val.toString()}' like value.\nActual: ${tof(v)}`);
                };
            }
        }
    }
    return mkFO(someFn, props);
};
export {mkFO,mkErFO}
