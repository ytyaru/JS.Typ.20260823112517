export const baseTypeCases = [
    { name: "undefined", value: undefined, expectedKey: "und" },
    { name: "boolean", value: true, expectedKey: "bln" },
    { name: "bigint", value: 10n, expectedKey: "big" },
    { name: "string", value: "text", expectedKey: "str" },
    { name: "symbol", value: Symbol(), expectedKey: "sym" },
    { name: "function", value: () => {}, expectedKey: "fn" },
    { name: "object", value: {}, expectedKey: "obj" },
    { name: "null", value: null, expectedKey: "nul" },
    { name: "safe integer", value: 42, expectedKey: "num" },
    { name: "safe float / decimal", value: 100.5, expectedKey: "num" },
    { name: "NaN", value: NaN, expectedKey: "num" },
    { name: "positive Infinity", value: Infinity, expectedKey: "num" },
    { name: "negative Infinity", value: -Infinity, expectedKey: "num" },
    { name: "overflow int (MAX + 1)", value: Number.MAX_SAFE_INTEGER + 1, expectedKey: "num" },
    { name: "overflow int (MIN - 1)", value: Number.MIN_SAFE_INTEGER - 1, expectedKey: "num" },
];

export const leafTypeCases = [
    { name: "undefined", value: undefined, tofPath: "und" },
    { name: "boolean", value: true, tofPath: "bln" },
    { name: "bigint", value: 10n, tofPath: "big" },
    { name: "string", value: "text", tofPath: "str" },
    { name: "symbol", value: Symbol(), tofPath: "sym" },
    { name: "function", value: () => {}, tofPath: "fn" },
    { name: "object", value: {}, tofPath: "obj" },
    { name: "null", value: null, tofPath: "nul" },
    { name: "safe integer", value: 100, tofPath: "num.int" },
    //{ name: "safe float / decimal", value: 100.5, tofPath: "num.fin" },
    { name: "safe float / decimal", value: 100.5, tofPath: "num.bin.flt" },
    { name: "NaN", value: NaN, tofPath: "num.nan" },
    { name: "positive Infinity", value: Infinity, tofPath: "num.inf.p" },
    { name: "negative Infinity", value: -Infinity, tofPath: "num.inf.n" },
//    { name: "overflow int (MAX + 1)", value: Number.MAX_SAFE_INTEGER + 1, tofPath: "num.over" },
//    { name: "overflow int (MIN - 1)", value: Number.MIN_SAFE_INTEGER - 1, tofPath: "num.over" },
    { name: "overflow int (MAX + 1)", value: Number.MAX_SAFE_INTEGER + 1, tofPath: "num.bin.over" },
    { name: "overflow int (MIN - 1)", value: Number.MIN_SAFE_INTEGER - 1, tofPath: "num.bin.over" },
];

export const intermediateTypeCases = [
    { name: "safe int for num", value: 100, path: "num" },
    { name: "safe float for num", value: 100.5, path: "num" },
    { name: "NaN for num", value: NaN, path: "num" },
    { name: "positive Infinity for num", value: Infinity, path: "num" },
    { name: "negative Infinity for num", value: -Infinity, path: "num" },
    { name: "overflow MAX for num", value: Number.MAX_SAFE_INTEGER + 1, path: "num" },
    { name: "overflow MIN for num", value: Number.MIN_SAFE_INTEGER - 1, path: "num" },
    { name: "positive Infinity for num.inf", value: Infinity, path: "num.inf" },
    { name: "negative Infinity for num.inf", value: -Infinity, path: "num.inf" },
];

export const numSubCases = [
    { desc: "safe integer", val: 100, checks: { int: true, bin: false, nan: false, inf: false, over: false } },
    { desc: "MAX_SAFE_INTEGER", val: Number.MAX_SAFE_INTEGER, checks: { int: true, bin: false, nan: false, inf: false, over: false } },
    { desc: "MIN_SAFE_INTEGER", val: Number.MIN_SAFE_INTEGER, checks: { int: true, bin: false, nan: false, inf: false, over: false } },
    { desc: "safe float / decimal", val: 100.5, checks: { int: false, bin: true, nan: false, inf: false, over: false } },
    { desc: "NaN", val: NaN, checks: { int: false, bin: false, nan: true, inf: false, over: false } },
    { desc: "positive Infinity", val: Infinity, checks: { int: false, bin: false, nan: false, inf: true, over: false, p: true, n: false } },
    { desc: "negative Infinity", val: -Infinity, checks: { int: false, bin: false, nan: false, inf: true, over: false, p: false, n: true } },
    { desc: "overflow int (MAX + 1)", val: Number.MAX_SAFE_INTEGER + 1, checks: { int: false, bin: true, nan: false, inf: false, over: true } },
    { desc: "overflow int (MIN - 1)", val: Number.MIN_SAFE_INTEGER - 1, checks: { int: false, bin: true, nan: false, inf: false, over: true } },
];

/**
 * 指定した関数を実行し、期待する例外型とメッセージが完全に一致してスローされるか検証する
 * @param fn 検証対象の関数
 * @param expectedErrorClass 期待する例外のコンストラクタ（例: TyoeError, CustomError など）
 * @param expectedMessage 期待する完全一致のエラーメッセージ
 */
function assertThrow(Err, msg, fn) {
    let err = null;
    try {fn();} catch (error) {err = error;}
    expect(err).not.toBeNull();
    expect(err).toBeInstanceOf(Err);
    expect(err.message).toBe(msg);
}
/*
// テストデータ
class C {
    static get sg() {}
    static set ss(v) {}
    static get sa() {}
    static set sa(v) {}
    get g() {}
    set s(v) {}
    get a() {}
    set a(v) {}
    static sm(){}
    static *sgm(){}
    static async sam(){}
    static async *sagm(){}
    m(){}
    *gm(){}
    async am(){}
    async *agm(){}
}
const c = new C();
function fn(){}
function *gfn(){}
async function afn(){}
async function *agfn(){}
const arrFn = ()=>{};
const aarrFn = async()=>{};
const getDes = (o,d)=>Object.getOwnPropertyDescriptor(Object.defineProperty(o, 'd', d), 'd');
const _obj = {m(){}, *gm(){}, async am(){}, async *agm(){}};
const des = {
    o: [[{}, {value:0}], [{}, {value(){}}], [{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]),
    c: [[C,'sg'],[C,'ss'],[C,'sa']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]),
    i: [[c,'g'],[c,'s'],[c,'a']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]),
};
const cal = {
    fn: [[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map],[function f(){1*2}],[function f(){async()=>{}}],[()=>1*2],[()=>{async()=>{}}]],
    md: [[_obj.m],[_obj.gm],[_obj.am],[_obj.agm],[C.sm],[C.sgm],[C.sam],[C.sagm],[c.m],[c.gm],[c.am],[c.agm]],
}
const prims = [[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0.1],[0n],[''],[Symbol()]];
const objs = [[{}],[[]],[C],[class{}],[class C{}],[new C()],[new (class{})],[new (class C{})], ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md];
const dangers = [[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})]];
const cls = {
    es6: [[C],[class{}],[class C{}]],
    // 匿名かつthisに何もセットしてないと関数。先頭文字が大文字なら疑似クラス。
    es5: [[function Fn(){}],[function fn(){this.x=0}],[function(){this.x=0}]], 
    native: [[Map],[Uint8Array],[Blob]],
};
const ins = {
    es6: [[C],[class{}],[class C{}]].map(v=>[new (v[0])()]),
    // 匿名かつthisに何もセットしてなくともnewされたら擬似クラスのインスタンスと判定する。
    es5: [[function(){}],[function Fn(){}],[function fn(){this.x=0}],[function(){this.x=0}]].map(v=>[new (v[0])()]),
    native: [[Map],[Uint8Array],[Blob]].map(v=>[new (v[0])()]),
};
export {assertThrow,C,c,fn,gfn,afn,agfn,arrFn,aarrFn,des,cal,prims,objs,dangers,cls,ins,_obj,getDes};
*/
