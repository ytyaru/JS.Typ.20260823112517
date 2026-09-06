const N = {
    und: 'undefined',
    bln: 'boolean',
    num: 'number',
    big: 'bigint',
    str: 'string',
    sym: 'symbol',
    fn: 'function',
}
const M = Object.entries(N).reduce((o,n)=>{o[n[0]]=v=>n[1]===typeof v;return o;},{});
M.obj = v=>null!==v && 'object'===typeof v;
M.nul = v=>null===v;
//M.ary = v=>Array.is(v);
function tis(v) {return Object.entries(M).reduce((o,n)=>{o[n[0]]=n[1](v);return o;},{});}
for (let [k,v] of Object.entries(M)) {tis[k]=v}
export {tis}
