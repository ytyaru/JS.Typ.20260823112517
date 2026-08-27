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
    fn: [[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map]],
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
