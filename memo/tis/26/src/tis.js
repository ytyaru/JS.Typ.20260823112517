import {Ag} from './is/ag.js';
import {Fn} from './is/fn.js';
import {Obj,Des,Ins} from './is/obj.js';
const getTag = v => Object.prototype.toString.call(v).slice(8, -1);
const isSafeNum = v => v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v;
const dObj = v => {
    const o = Obj.getFlag(v);
    return !o.nul && o.is && (o.none || o.proto || o.boxed.is)
};
const MAP = {
    und: { fn: v => v === undefined, default: undefined },
    bln: { fn: v => typeof v === 'boolean', default: false },
    big: { fn: v => typeof v === 'bigint', default: 0n },
    str: { fn: v => typeof v === 'string', default: '' },
    sym: { fn: v => typeof v === 'symbol', default: Symbol() },
    int: { fn: v => Number.isSafeInteger(v), full: 'Integer', default: 0 },
    fin: { fn: v => Number.isFinite(v) && isSafeNum(v), full: 'Finite', default: 0 },
    nul: { fn: v => v === null, default: null },
    obj: { fn: v => Obj.getFlag(v).plain, full:'PlainObject', default:{} },
    ary: {fn:v=>Array.isArray(v), default: [], children: {// 値が配列なら真（要素の状態を問わず）
        empty: {fn:v=>Array.isArray(v) && 0===v.length, full:'Empty'}, // 要素が空なら真
        filled: {fn:(v,T)=>{// 要素が一つ以上なら真
            const t = Fn.getFlag(T).is;
            if (undefined!==T && !t) {throw new TypeError(`tis.ary.filled requires a validation function as the second argument.`)}
            return Array.isArray(v) && 0<v.length && (t ? v.every(x=>T(x)) : true)
        }, full:'Filled'},
        gen: {fn:(v,T)=>{// 要素が空なら真、一つ以上なら全要素が指定した型なら真
            if (!Fn.getFlag(T).is) {throw new TypeError(`tis.ary.gen requires a validation function as the second argument.`)}
            return Array.isArray(v) && (0===v.length ? true : v.every(x=>T(x)))}, full:'Generics'}, // 内容が空または一つ以上ある時は全要素が第二引数の判定式で真を返す時真を返す
    } },
    run: { fn: v => Fn.getFlag(v).is, default: null, full: 'Run', children: {
        fn: {
            bound: {fn:v=>Fn.getFlag(v).fn.bound, full:Fn.N.b},
            native: {fn:v=>Fn.getFlag(v).fn.native, full:Fn.N.n},
            arrow: {fn:v=>Fn.getFlag(v).fn.arrow, default: null, full:Fn.N.a,
                children: {
                    s: {fn:v=>Fn.getFlag(v).fn.arrow.s, full:Ag.N.s},
                    a: {fn:v=>Fn.getFlag(v).fn.arrow.a, full:Ag.N.a},
                },
            },
            es5: {fn:v=>!Cls.getFlag(v,Fn.getCode(v)).fn.is, default: null, full:Fn.N.f,
                //s: {fn:v=>Fn.getFlag(v).fn.s.n, full:Ag.N.s},
                //anonymous: {fn:v=>Fn.getFlag(v).fn.s.a, full:Fn.N.A},
                s: {fn:v=>Fn.getFlag(v).fn.s.n, full:Ag.N.s, children: {
                    n: {fn:v=>Fn.getFlag(v).fn.s.n, full:Fn.N.f},
                    a: {fn:v=>Fn.getFlag(v).fn.s.a, full:Ag.N.A},
                } },
                a: {fn:v=>Fn.getFlag(v).fn.a, full:Ag.N.a},
                g: {fn:v=>Fn.getFlag(v).fn.g, full:Ag.N.g},
                ag: {fn:v=>Fn.getFlag(v).fn.ag, full:Ag.N.ag},
            },
        },
        md: {fn:v=>Fn.getFlag(v).md.is, default:null, full:Fn.N.m,
            s: {fn:v=>Fn.getFlag(v).method.s, full:Ag.N.s},
            a: {fn:v=>Fn.getFlag(v).method.a, full:Ag.N.a},
            g: {fn:v=>Fn.getFlag(v).method.g, full:Ag.N.g},
            ag: {fn:v=>Fn.getFlag(v).method.ag, full:Ag.N.ag},
        },
    } },
    cls: {fn: v => Fn.getFlag(v,Fn.getCode(v)).cls.is, default: null, children: {
        es6: {fn:v=>Fn.getFlag(v,Fn.getCode(v)).cls.es6, full:Fn.N.es6},
        es5: {fn:v=>Fn.getFlag(v,Fn.getCode(v)).cls.es5, full:Fn.N.es5},
        native: {fn:v=>Fn.getFlag(v,Fn.getCode(v)).cls.native, full:Fn.N.n},
    } },
    ins: {fn: v => Obj.getFlag(v).ins.is, default:null, children:{
        es6: {fn:v=>Obj.getFlag(v).ins.es6, full:Fn.N.es6},
        es5: {fn:v=>Obj.getFlag(v).ins.es5, full:Fn.N.es5},
        native: {fn:v=>Obj.getFlag(v).ins.native, full:Fn.N.n},
    } },
    des: {fn: v => Obj.getFlag(v).des.is, full:Des.N.D, default:null, children:{
        d: {fn: v => Obj.getFlag(v).des.d, full:Des.N.d,
            is: {fn:v=>Obj.getFlag(v).des.d, full:Des.N.d},
            v: {fn:v=>Obj.getFlag(v).des.d.v, full:Des.N.v},
            m: {fn:v=>Obj.getFlag(v).des.d.m, full:Des.N.m},
        },
        a: {fn: v => Obj.getFlag(v).des.a, full:Des.N.a,
            is: {fn:v=>Obj.getFlag(v).des.a, full:Des.N.a},
            g: {fn:v=>Obj.getFlag(v).des.a.g, full:Des.N.g},
            s: {fn:v=>Obj.getFlag(v).des.a.s, full:Des.N.s},
            gs: {fn:v=>Obj.getFlag(v).des.a.gs, full:Des.N.gs},
        },
    } },
//    d: {fn: v => [undefined,null,Infinity,-Infinity].some(x=>x===v) || Number.isNaN(v) || (Number.isFinite(v) && (!Number.isSafeInteger(v) || !isSafeNum(v))) || tis.d.obj(v), full:Des.N.a, 
    d: {fn: v => [undefined,null,Infinity,-Infinity].some(x=>x===v) || Number.isNaN(v) || (Number.isFinite(v) && (!Number.isSafeInteger(v) || !isSafeNum(v))) || dObj(v), full:Des.N.a, 
        num: {fn: v => 'number'===typeof v, full:'Danger', default: 0, children: {
            int: { fn: v => Number.isSafeInteger(v), full: 'Integer' },
            nan: { fn: v => Number.isNaN(v), full: 'NaN', default: NaN },
            inf: {fn: v => !Number.isFinite(v) && !Number.isNaN(v), full:'Infinity', default:Infinity, children:{
                p: { fn: v => v === Infinity, full:'Positive', default:Infinity },
                n: { fn: v => -Infinity === v, full:'Negative', default:-Infinity }
            } },
            flt: { fn:v => Number.isFinite(v) && isSafeNum(v) && !Number.isSafeInteger(v), full:'Float', default:0 },
            over: { fn:v => Number.isFinite(v) && !isSafeNum(v), full: 'Over', default: Number.MAX_SAFE_INTEGER + 1 }
        } },
        obj: {fn:dObj, full:'Object', children:{
            none: {fn:v=>Obj.getFlag(v).none, full:'NonePrototype'},
            proto: {fn:v=>Obj.getFlag(v).proto, full:'Prototyped'},
            boxed: {fn:v=>Obj.getFlag(v).boxed.is, full:'BoxedPrimitive', 
                children: {
                    bln: {fn:v=>Obj.getFlag(v).boxed.bln, full:'Boolean'},
                    num: {fn:v=>Obj.getFlag(v).boxed.num, full:'Number'},
                    str: {fn:v=>Obj.getFlag(v).boxed.str, full:'String'},
                },
            },
        } }
    },
    g: {fn: v => true, default:0, full:'Group', children:{
        nun: {fn:v=>Number.isNaN(v) || [null,undefined].some(x=>x===v), full:'NullUndefinedNaN'},
        p: {full: 'Primitive', default: null,
            fn: v=> {
                const t = typeof v;
                return [null,undefined].some(x=>x===v)
                    || 'boolean number string bigint symbol'.split(' ').some(n=>n===t);
            },
        },
        o: {full:'Object', default:null,
            fn: v=> {
                const t = typeof v;
                return null!==v && 'object function'.split(' ').some(n=>n===t);
            },
            children: {
                cr: {fn:v=>'funtion'===typeof v, full:'ClassOrRun'},
                ctn: {fn:v=>'object'===typeof v || tis.cls(v), full:'Container'},
            }
        },
    } },
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
