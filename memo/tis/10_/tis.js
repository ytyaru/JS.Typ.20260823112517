// tis.js
const getTag = v => Object.prototype.toString.call(v).slice(8, -1);

const MAP = {
    und: { fn: v => v === undefined },
    bln: { fn: v => typeof v === "boolean" },
    big: { fn: v => typeof v === "bigint" },
    str: { fn: v => typeof v === "string" },
    sym: { fn: v => typeof v === "symbol" },
    fn:  { fn: v => typeof v === "function" },
    obj: { fn: v => null !== v && typeof v === "object" },
    nul: { fn: v => v === null },
    num: {
        fn: v => typeof v === "number",
        children: {
            int: { fn: v => Number.isSafeInteger(v), full: "Integer" },
            fin: { fn: v => Number.isFinite(v) && !Number.isSafeInteger(v), full: "Finite" },
            nan: { fn: v => Number.isNaN(v), full: "NaN" },
            inf: {
                fn: v => !Number.isFinite(v) && !Number.isNaN(v),
                full: "Infinity",
                children: {
                    p: { fn: v => v === Infinity, full: "Positive" },
                    n: { fn: v => -Infinity === v, full: "Negative" }
                }
            },
            over: { fn: v => typeof v === "number" && !Number.isSafeInteger(v) && Number.isFinite(v), full: "Overflow" }
        }
    }
};

const buildNodes = (defMap, parentNode = null) => {
    const nodes = {};

    for (const [abbr, def] of Object.entries(defMap)) {
        const node = v => def.fn(v);

        node._ = {
            name: {
                abbr,
                full: def.full || null
            },
            parent: parentNode,
            fn: def.fn
        };

        if (def.children) {
            const children = buildNodes(def.children, node);
            Object.assign(node, children);
        }

        nodes[abbr] = node;
    }

    return nodes;
};

export const tis = buildNodes(MAP);
export { getTag };
