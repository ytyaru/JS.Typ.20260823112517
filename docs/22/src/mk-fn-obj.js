export function mkFnObj(someFn, { getters = {}, methods = {} } = {}) {
    const fn = function(...args) {
        if (new.target) throw new ReferenceError('コンストラクタ生成禁止です。');
        return someFn(...args);
    };
    fn.some = fn;

    for (const [key, val] of Object.entries(methods)) {
        fn[key] = val;
    }
    for (const [key, val] of Object.entries(getters)) {
        Object.defineProperty(fn, key, { get: () => val });
    }
    return fn;
}


