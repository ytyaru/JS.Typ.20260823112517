const ANO = 'Anonymous',
NTV = 'Native',
FN = 'Function',
MD = 'Method',
CLS = 'Class',
INS = 'Instance',
ARW = 'Arrow',
AS = 'Async',
SY = 'Sync',
GEN = 'Generator',
DES = 'Descriptor',
O = 'Object',
P = 'Primitive',
DGR = 'Danger',
PT = 'rototype';

const CINm = (i, k, C) => i + k + (C ? `<${C.name || '(' + ANO + ')'}>` : '');
const CNm = (n, C) => CINm(n, CLS, C);
const INm = (n, C) => CINm(n, INS, C);
const DNm = (k, i = '') => DES + `${k}${i}`;
const DDNm = (i) => DNm('.Data', i);
const DANm = (i) => DNm('.Access', i);

export const TYPE_NAMES = {
    Boolean:     { name: 'Boolean', path: 'p.bln' },
    Integer:     { name: 'Integer', path: 'p.int' },
    Finite:      { name: 'Finite', path: 'p.fin' },
    BigInt:      { name: 'BigInt', path: 'p.big' },
    String:      { name: 'String', path: 'p.str' },
    Symbol:      { name: 'Symbol', path: 'p.sym' },
    Primitive:   { name: P, path: 'p' },

    PlainObject: { name: 'Plain' + O, path: 'o.obj' },
    Array:       { name: 'Array', path: 'o.ary' },
    AsyncArrowFn:{ name: AS + ARW + FN, path: 'o.fn.arrow.a' },
    SyncArrowFn: { name: SY + ARW + FN, path: 'o.fn.arrow.s' },
    ArrowFn:     { name: ARW + FN, path: 'o.fn.arrow' },
    BoundFn:     { name: 'Bound' + FN, path: 'o.fn.bound' },
    NativeFn:    { name: NTV + FN, path: 'o.fn.native' },
    AsyncFn:     { name: AS + FN, path: 'o.fn.a' },
    GenFn:       { name: GEN + FN, path: 'o.fn.g' },
    AsyncGenFn:  { name: AS + GEN + FN, path: 'o.fn.ag' },
    SyncFn:      { name: SY + FN, path: 'o.fn.s' },
    AnonFn:      { name: ANO + FN, path: 'o.fn.anonymous' },
    Function:    { name: FN, path: 'o.fn' },
    
    ES6Class:    { name: (v, C) => CNm('ES6.', C), path: 'o.cls.es6' },
    ES5Class:    { name: (v, C) => CNm('ES5.', C), path: 'o.cls.es5' },
    NativeClass: { name: (v, C) => CNm(NTV, C), path: 'o.cls.native' },
    Class:       { name: CLS, path: 'o.cls' },
    
    ES6Inst:     { name: (v, C) => INm('ES6.', C), path: 'o.ins.es6' },
    ES5Inst:     { name: (v, C) => INm('ES5.', C), path: 'o.ins.es5' },
    NativeInst:  { name: (v, C) => INm(NTV, C), path: 'o.ins.native' },
    Instance:    { name: INS, path: 'o.ins' },
    
    DesDataVal:  { name: DDNm('.Value'), path: 'o.des.d.v' },
    DesDataMeth: { name: DDNm('.Method'), path: 'o.des.d.m' },
    DesData:     { name: DDNm(), path: 'o.des.d' },
    DesAccGet:   { name: DANm('.Get'), path: 'o.des.a.g' },
    DesAccSet:   { name: DANm('.Set'), path: 'o.des.a.s' },
    DesAccGetSet:{ name: DANm('.GetSet'), path: 'o.des.a.gs' },
    DesAccess:   { name: DANm(), path: 'o.des.a' },
    Descriptor:  { name: DES, path: 'o.des' },
    
    AsyncMethod: { name: AS + MD, path: 'o.md.a' },
    GenMethod:   { name: GEN + MD, path: 'o.md.g' },
    AsyncGenMeth:{ name: AS + GEN + MD, path: 'o.md.ag' },
    SyncMethod:  { name: SY + MD, path: 'o.md.s' },
    Method:      { name: MD, path: 'o.md' },
    Object:      { name: O, path: 'o' },

    Undefined:   { name: 'Undefined', path: 'd.und' },
    Null:        { name: 'Null', path: 'd.nul' },
    NaNVal:      { name: 'NaN', path: 'd.num.nan' },
    InfinityVal: { name: 'Infinity', path: 'd.num.inf' },
    PosInfinity: { name: 'PositiveInfinity', path: 'd.num.pinf' },
    NegInfinity: { name: 'NegativeInfinity', path: 'd.num.ninf' },
    OverInteger: { name: 'OverInteger', path: 'd.num.oint' },
    OverFinite:  { name: 'OverFinite', path: 'd.num.ofin' },
    DangerNum:   { name: DGR + 'Number', path: 'd.num' },
    BoxedPrim:   { name: 'Boxed' + P, path: 'd.obj.boxed' },
    NoneProtoObj:{ name: 'NoneP' + PT + O, path: 'd.obj.noneProto' },
    PrototypedObj:{ name: 'P' + PT + 'd' + O, path: 'd.obj.prototyped' },
    DangerObj:   { name: DGR + O, path: 'd.obj' },
    Danger:      { name: DGR, path: 'd' }
};
