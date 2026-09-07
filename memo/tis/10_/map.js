function getTag(v) {
    return Object.prototype.toString.call(v).slice(8, -1);
}

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
            fin: { fn: v => Number.isFinite(v) && Number.isSafeInteger(v) === false, full: "Finite" },
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

function buildNodes(defMap, parentPath = "", parentFullName = "") {
    const nodes = {};

    for (const [abbr, def] of Object.entries(defMap)) {
        const path = parentPath ? `${parentPath}.${abbr}` : abbr;
        
        const rawFull = def.full || getTag; 
        // Note: actual fallback uses value during evaluation or defaults to key if tag isn't single-value bound. 
        // Better handled during evaluation or by checking value type.
        
        const node = function(v) {
            return def.fn(v);
        };

        node._ = {
            abbr,
            path,
            full: def.full,
            fn: def.fn
        };

        if (def.children) {
            const children = buildNodes(def.children, path, parentFullName);
            Object.assign(node, children);
        }

        nodes[abbr] = node;
    }

    return nodes;
}
