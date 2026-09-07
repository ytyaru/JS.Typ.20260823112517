const getTag = v => Object.prototype.toString.call(v).slice(8, -1);

const isSafeNum = v => v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v;
const MAP = {
    und: { fn: v => v === undefined, default: undefined },
    bln: { fn: v => typeof v === "boolean", default: false },
    big: { fn: v => typeof v === "bigint", default: 0n },
    str: { fn: v => typeof v === "string", default: "" },
    sym: { fn: v => typeof v === "symbol", default: Symbol() },
    fn:  { fn: v => typeof v === "function", default: function() {} },
    obj: { fn: v => null !== v && typeof v === "object", default: {} },
    nul: { fn: v => v === null, default: null },
    num: {
        fn: v => typeof v === "number",
        default: 0,
        children: {
            int: { fn: v => Number.isSafeInteger(v), full: "Integer" },
            //fin: { fn: v => Number.isFinite(v) && !Number.isSafeInteger(v), full: "Finite" },
            fin: { fn: v => Number.isFinite(v) && isSafeNum(v), full: "Finite" },
            nan: { fn: v => Number.isNaN(v), full: "NaN", default: NaN },
            inf: {
                fn: v => !Number.isFinite(v) && !Number.isNaN(v),
                full: "Infinity",
                default: Infinity,
                children: {
                    p: { fn: v => v === Infinity, full: "Positive", default: Infinity },
                    n: { fn: v => -Infinity === v, full: "Negative", default: -Infinity }
                }
            },
            over: { fn: v => Number.isFinite(v) && !isSafeNum(v), full: "Overflow", default: Number.MAX_SAFE_INTEGER + 1 }
            //over: { fn: v => typeof v === "number" && !Number.isSafeInteger(v) && Number.isFinite(v), full: "Overflow", default: Number.MAX_SAFE_INTEGER + 1 }
        }
    }
};

const defV = node => {
    let curr = node;
    while (curr) {
        if (curr._ && Object.hasOwn(curr._, 'default')) {
            return curr._.default;
        }
        curr = curr._.parent;
    }
    return undefined;
};

const buildNodes = (defMap, parentNode = null) => {
    const nodes = {};

    for (const [abbr, def] of Object.entries(defMap)) {
        const typeTreeNode = function(v) {
            return def.fn(v);
        };

        typeTreeNode._ = {
            name: {
                abbr,
                full: def.full || null
            },
            parent: parentNode,
            fn: def.fn
        };

        if (Object.hasOwn(def, 'default')) {
            typeTreeNode._.default = def.default;
        }

        if (def.children) {
            const children = buildNodes(def.children, typeTreeNode);
            Object.assign(typeTreeNode, children);
        }

        nodes[abbr] = typeTreeNode;
    }

    return nodes;
};

const rootNodes = buildNodes(MAP);

const tis = function(v) {
    const result = {};
    for (const [abbr, node] of Object.entries(rootNodes)) {
        result[abbr] = node(v);
    }
    return result;
};

Object.assign(tis, rootNodes);

export { tis, rootNodes, getTag, defV };
