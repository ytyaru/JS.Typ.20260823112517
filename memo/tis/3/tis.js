const N = {
    und: 'undefined',
    bln: 'boolean',
    big: 'bigint',
    str: 'string',
    sym: 'symbol',
    fn: 'function',
}
const M = Object.entries(N).reduce((o,n)=>{o[n[0]]=v=>n[1]===typeof v;return o;},{});
M.obj = v=>null!==v && 'object'===typeof v;
M.nul = v=>null===v;
const isSafeNum = v => v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v;
//const isPInf = v => Infinity===v;
//const isNInf = v => -Infinity===v;
//const isOInt = v => Number.isInteger(v) && !Number.isSafeInteger(v);
//const isOFin = v => Number.isFinite(v) && !isSafeNum(v);
function num(v) {return 'number'===typeof v;}
num.int = v=>Number.isSafeInteger(v);
num.fin = v=>Number.isFinite(v) && isSafeNum(v);
num.nan = v=>Number.isNaN(v);
/*
num.inf = function(v) {
    this.p = isPInf; this.n = isNInf;
    return [Infinity,-Infinity].some(c=>c===v);
}
num.over = function(v) {
    this.int = isOInt; this.fin = isOFin;
    return Number.isFinite(v) && !isSafeNum(v);
}
*/
num.inf = function(v) {return [Infinity,-Infinity].some(c=>c===v);}
num.inf.p = v => Infinity===v;
num.inf.n = v => -Infinity===v;
num.over = function(v) {return Number.isFinite(v) && !isSafeNum(v);}
num.over.int = v => Number.isInteger(v) && !Number.isSafeInteger(v);
num.over.fin = v => Number.isFinite(v) && !isSafeNum(v);
M.num = num;
function tis(v) {return Object.entries(M).reduce((o,n)=>{o[n[0]]=n[1](v);return o;},{});}
for (let [k,v] of Object.entries(M)) {tis[k]=v}
export {tis}

