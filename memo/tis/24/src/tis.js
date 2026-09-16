//import {Ag} from './is/ag.js';
//import {Fn} from './is/fn.js';
//import {Obj,Des,Ins} from './is/obj.js';
import {tnm,N} from './tnm.js';
const getTag = v => Object.prototype.toString.call(v).slice(8, -1);
//const isSafeNum = v => v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v;
const isSafeNum = v => 'number'===typeof v && v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v;
//const Ps = 'boolean number string bigint symbol'.split(' ');
//const Os = 'object function'.split(' ');
//const dObj = v => {
//    const o = Obj.getFlag(v);
//    return !o.nul && o.is && (o.none || o.proto || o.boxed.is)
//};
const dObj = v => {
    const N = tnm(v);
//    return (N.startsWith('BoxedPrimitive<') || ['NonePrototype','Prototyped'].some(n=>`${n}Object`));
    return (N.startsWith('BoxedPrimitive<') || ['NonePrototype','Prototyped'].some(n=>N===`${n}Object`));
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
    //ary: { fn: v => Array.isArray(v), default: [] },
//    ary: { fn: (v,T) => Array.isArray(v) && ('function'===typeof T ? v.every(x=>T(x)) : true), default: [] },
    ary: {fn:v=>Array.isArray(v), default: [], // とにかく値が配列であれば内容がどんな状態であれ真を返す
        children: {
            empty: {fn:v=>Array.isArray(v) && 0===v.length, full:'Empty'}, // 配列かつ内容が空
            filled: {fn:(v,T)=>Array.isArray(v) && 0<v.length && ('function'===typeof T ? v.every(x=>T(x)) : true), full:'Filled'}, // 配列かつ内容が一つ以上ある
//            gen: {fn:(v,T)=>Array.isArray(v) && (0===v.length ? true : ('function'===typeof T ? v.every(x=>T(x)) : true), full:'Generics'}, // 内容が空または一つ以上ある時は全要素が第二引数の判定式で真を返すこと
//            gen: {fn:(v,T)=>Array.isArray(v) && (0===v.length ? true : ('function'===typeof T ? v.every(x=>T(x)) : true)), full:'Generics'}, // 内容が空または一つ以上ある時は全要素が第二引数の判定式で真を返すこと
            gen: {fn:(v,T)=>{
                if ('function'!==typeof T) {throw new TypeError(`tis.ary.gen requires a validation function as the second argument.`)}
                return Array.isArray(v) && (0===v.length ? true : v.every(x=>T(x)))}, full:'Generics'}, // 内容が空または一つ以上ある時は全要素が第二引数の判定式で真を返す時真を返す
        }
    },
    obj: { fn: v => 'PlainObject'===tnm(v), full:'PlainObject', default:{} },
    run: {fn:v=>{const T = tnm(v); return ['Function','Method'].some(n=>T.endsWith(n))}, 
        full:'Run', default: null, children: {
        fn: {fn:v=>tnm(v).endsWith('Function'), default:null, full:'Function',
            bound: {fn:v=>'BoundFunction'===tnm(v), full:'Bound'},
            native: {fn:v=>'NativeFunction'===tnm(v), full:'Native'},
            arrow: {fn:v=>tnm(v).endsWith('ArrowFunction'), full:'Arrow',
                children: {
                    s: {fn:v=>'ArrowFunction'===tnm(v), full:'Sync'},
                    a: {fn:v=>'AsyncArrowFunction'===tnm(v), full:'Async'},
                },
            },
            es5: {fn:v=>tnm(v).endsWith('Function') && !['Bound','Native','Arrow'].some(n=>v.startsWith(n)), full:'ES5', default:null,
                s: {fn:v=>'Function'===tnm(v), full:'Sync', children: {
                    n: {fn:v=>'Function'===tnm(v), full:'Named'},
                    a: {fn:v=>'AnonymousFunction'===tnm(v), full:'Anonymous'},
                } },
                a: {fn:v=>'AsyncFunction'===tnm(v), full:'Async'},
                g: {fn:v=>'GeneratorFunction'===tnm(v), full:'Generator'},
                ag: {fn:v=>'AsyncGeneratorFunction'===tnm(v), full:'AsyncGenerator'},
            },
        },
        md: {fn:v=>tnm(v).endsWith('Method'), default:null, full:'Method',
            s: {fn:v=>'Method'===tnm(v), full:'Sync'},
            a: {fn:v=>'AsyncMethod'===tnm(v), full:'Async'},
            g: {fn:v=>'GeneratorMethod'===tnm(v), full:'Generator'},
            ag: {fn:v=>'AsyncGeneratorMethod'===tnm(v), full:'AsyncGenerator'},
        },
    } },
    cls: {fn:(v,P)=>tnm(v).includes('Class<') && (P ? v.prototype instanceof P : true), full:N.c, default:null, children:{
        es6: {fn:(v,P)=>v.startsWith('Class<') && (P ? v.prototype instanceof P : true), full:N.es6},
        es5: {fn:(v,P)=>v.startsWith('ES5.Class<') && (P ? v.prototype instanceof P : true), full:N.es5},
        native: {fn:(v,P)=>v.startsWith(`NativeClass<`) && (P ? v.prototype instanceof P : true), full:N.n},
    } },
    ins: {fn:(v,P)=>tnm(v).includes('Instance<') && (P ? v instanceof P : true), full:N.i, default:null, children:{
        es6: {fn:(v,P)=>v.startsWith('Instance<') && (P ? v instanceof P : true), full:N.es6},
        es5: {fn:(v,P)=>v.startsWith('ES5.Instance<') && (P ? v instanceof P : true), full:N.es5},
        native: {fn:v=>v.startsWith('NativeInstance<') && (P ? v instanceof P : true), full:N.n},
    } },
    des: {fn:v=>tnm(v).startsWith(`${N.d}<`), full:N.d, default:null, children:{
        d: {fn:v=>{const N = tnm(v); return ['Value','Method'].some(n=>`${N.d}<${n}>`===N);}, full:'Data',
            v:{fn:v=>`${N.d}<${N.D.v}>`===tnm(v), full:N.D.v},
            m:{fn:v=>`${N.d}<${N.m}>`===tnm(v), full:N.D.m},
        },
        a: {fn:v=>{const N=tnm(v); return [N.D.g, N.D.s, N.D.a].some(n=>`${N.d}<${n}>`===N);},
            full:'Access', children:{
            g: {fn:v=>`${N.d}<${N.D.g}>`===tnm(v), full:'Get'},
            s: {fn:v=>`${N.d}<${N.D.s}>`===tnm(v), full:'Set'},
            gs: {fn:v=>`${N.d}<${N.D.a}>`===tnm(v), full:'GetSet'},
            hasG: {fn:v=>{const N=tnm(v); return [N.D.g, N.D.a].some(n=>`${N.d}<${n}>`===N);},full:'HasGet'},
            hasS: {fn:v=>{const N=tnm(v); return [N.D.s, N.D.a].some(n=>`${N.d}<${n}>`===N);},full:'HasSet'},
        },
    } } },
    d: {fn:v=>[undefined,null,Infinity,-Infinity].some(x=>x===v) || Number.isNaN(v) || (Number.isFinite(v) && (!Number.isSafeInteger(v) || !isSafeNum(v))) || dObj(v), full:'Danger', 
        num: {fn:v=>'number'===typeof v, full:'Number', default: 0, children: {
            nan: {fn:v=>Number.isNaN(v), full:'NaN', default: NaN },
            inf: {fn:v=>'number'===typeof v && !Number.isFinite(v) && !Number.isNaN(v), full:'Infinity', default:Infinity, children: {
                p: {fn:v=> Infinity===v, full:'Positive', default: Infinity },
                n: {fn:v=>-Infinity===v, full:'Negative', default:-Infinity }
            } },
            flt: { fn:v => Number.isFinite(v) && isSafeNum(v) && !Number.isSafeInteger(v), full:'Float', default:0 },
            over: { fn:v => Number.isFinite(v) && !isSafeNum(v), full: 'Over', default: Number.MAX_SAFE_INTEGER + 1 }
        } },
        obj: {fn:dObj, full:'Object', children:{
            none: {fn:v=>'NonePrototypeObject'===tnm(v), full:'NonePrototype'},
            proto: {fn:v=>'PrototypedObject'===tnm(v), full:'Prototyped'},
            boxed: {fn:v=>tnm(v).startsWith('BoxedPrimitive<'), full:'BoxedPrimitive', children: {
                bln: {fn:v=>`BoxedPrimitive<Boolean>`===tnm(v), full:'Boolean'},
                num: {fn:v=>`BoxedPrimitive<Number>`===tnm(v), full:'Number'},
                str: {fn:v=>`BoxedPrimitive<String>`===tnm(v), full:'String'},
            } },
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
//        const typeTreeNode = function(v) {
//            return def.fn(v);
//        };
        // vだけでなく、渡された引数をすべて def.fn に転送する
        const typeTreeNode = function(...args) {return def.fn(...args);};
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
