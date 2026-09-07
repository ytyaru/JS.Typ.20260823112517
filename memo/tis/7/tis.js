const N = {
    und: 'undefined',
    bln: 'boolean',
    big: 'bigint',
    str: 'string',
    sym: 'symbol',
    fn: 'function',
};

function createNode(fn, name, parent = null) {
    const node = function(v) { return fn(v); };
    Object.setPrototypeOf(node, Object.getPrototypeOf(fn));
    
    // 内部メタデータはすべて _ プロパティ内に隠蔽する
    node._ = {
        name,
        parent,
        get path() {
            return this.parent ? `${this.parent._.path}.${this.name}` : this.name;
        }
    };
    return node;
}

const M = {};
for (const [k, typeStr] of Object.entries(N)) {
    M[k] = createNode(v => typeStr === typeof v, k);
}
M.obj = createNode(v => null !== v && 'object' === typeof v, 'obj');
M.nul = createNode(v => null === v, 'nul');

const isSafeNum = v => v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v;
const numFn = createNode(v => 'number' === typeof v, 'num');
numFn.int = createNode(v => Number.isSafeInteger(v), 'int', numFn);
numFn.fin = createNode(v => Number.isFinite(v) && isSafeNum(v), 'fin', numFn);
numFn.nan = createNode(v => Number.isNaN(v), 'nan', numFn);

const infFn = createNode(v => [Infinity, -Infinity].some(c => c === v), 'inf', numFn);
infFn.p = createNode(v => Infinity === v, 'p', infFn);
infFn.n = createNode(v => -Infinity === v, 'n', infFn);
numFn.inf = infFn;

numFn.over = createNode(v => Number.isFinite(v) && !isSafeNum(v), 'over', numFn);
M.num = numFn;

function tis(v) {
    return Object.entries(M).reduce((o, [k, n]) => { o[k] = n(v); return o; }, {});
}
for (const [k, v] of Object.entries(M)) { tis[k] = v; }

export { tis, M };
