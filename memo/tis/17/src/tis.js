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
    ary: { fn: v => Array.isArray(v), default: [] },
    nul: { fn: v => v === null, default: null },
    num: {
        fn: v => typeof v === "number",
        default: 0,
        children: {
            int: { fn: v => Number.isSafeInteger(v), full: "Integer" },
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
            bin: {
                fn: v => Number.isFinite(v) && !Number.isSafeInteger(v),
                full: "Binary",
                default: 0.5,
                children: {
                    flt: { fn: v => Number.isFinite(v) && isSafeNum(v), full: "Float", default: 0 },
                    over: { fn: v => Number.isFinite(v) && !isSafeNum(v), full: "Over", default: Number.MAX_SAFE_INTEGER + 1 }
                }
            },
//            over: { fn: v => Number.isFinite(v) && !isSafeNum(v), full: "Overflow", default: Number.MAX_SAFE_INTEGER + 1 }
//            fin: { fn: v => Number.isFinite(v) && isSafeNum(v), full: "Finite" },
        }
    },
    run: {
        fn: v => Fn.getFlag(v).is,
        default: null,
        full: 'Run',
        children: {
            fn: {
                bound: {fn:v=>Fn.getFlag(v).bound, full:Fn.N.b},
                native: {fn:v=>Fn.getFlag(v).native, full:Fn.N.n},
                arrow: {
                    fn:v=>!Cls.getFlag(v,Fn.getCode(v)).arrow,
                    default: null,
                    full:Fn.N.a,
                    children: {
                        s: {fn:v=>Fn.getFlag(v).arrow.s, full:Ag.N.s},
                        a: {fn:v=>Fn.getFlag(v).arrow.a, full:Ag.N.a},
                    },
                },
                es5: {
                    fn:v=>!Cls.getFlag(v,Fn.getCode(v)).fn.is,
                    default: null,
                    full:Fn.N.f,
                    s: {fn:v=>Fn.getFlag(v).fn.s.n, full:Ag.N.s},
                    a: {fn:v=>Fn.getFlag(v).fn.a, full:Ag.N.a},
                    g: {fn:v=>Fn.getFlag(v).fn.g, full:Ag.N.g},
                    ag: {fn:v=>Fn.getFlag(v).fn.ag, full:Ag.N.ag},
                    anonymous: {fn:v=>Fn.getFlag(v).fn.s.a, full:Fn.N.A},
                },
            },
            md: {
                fn:v=>!Cls.getFlag(v,Fn.getCode(v)).md.is,
                default: null,
                full:Fn.N.m,
                s: {fn:v=>Fn.getFlag(v).method.s, full:Ag.N.s},
                a: {fn:v=>Fn.getFlag(v).method.a, full:Ag.N.a},
                g: {fn:v=>Fn.getFlag(v).method.g, full:Ag.N.g},
                ag: {fn:v=>Fn.getFlag(v).method.ag, full:Ag.N.ag},
            },
        }
    },
    cls: {
        fn: v => Fn.getFlag(v,Fn.getCode(v)).cls.is,
        default: null,
        children: {
            es6: {fn:v=>Fn.getFlag(v,Fn.getCode(v)).cls.es6, full:Fn.N.es6},
            es5: {fn:v=>Fn.getFlag(v,Fn.getCode(v)).cls.es5, full:Fn.N.es5},
            native: {fn:v=>Fn.getFlag(v,Fn.getCode(v)).cls.native, full:Fn.N.n},
        }
    },
    ins: {

    },
    des: {

    },
    d: {
        num: {
            fn: v => 'number'===typeof v,
            default: 0,
            children: {
                int: { fn: v => Number.isSafeInteger(v), full: "Integer" },
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
                flt: { fn:v => Number.isFinite(v) && isSafeNum(v) && !Number.isSafeInteger(v), full:"Float", default:0 },
                over: { fn:v => Number.isFinite(v) && !isSafeNum(v), full: "Over", default: Number.MAX_SAFE_INTEGER + 1 }
            }
        },
        obj: {
            fn: v => 'object'===typeof v,

        }
    },
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
