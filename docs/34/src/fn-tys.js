const getTag = v => Function.prototype.toString.call(v),
rmCmt = s => s.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ''),
isNtv = (v,s) => s.includes('[native code]'),
isNtvCls = (v,s) => v.prototype !== undefined && 'object'===typeof v.prototype,
isBnd = (v,s) => v.name.startsWith('bound '),
isArw = (v,s) => !v.hasOwnProperty('prototype') && s.includes('=>'),
isMd = (v,s) => /\bfunction\b/.test(rmCmt(s)) ? false : !s.includes('=>'),
isEs6Cls = (v, s) => /^\s*class\b/.test(rmCmt((s || getTag(v)))),
isEs5Cls = (v, s) => isEs5ClsSub(v,(s || getTag(v)),v.prototype),
isEs5ClsSub = (v, s, proto) => ((isEs6Cls(v, s) || isNtv(v, s) || isArw(v, s)) || (!proto || typeof proto !== 'object') || (proto.constructor !== v)) ? false : isEs5ClsCustom(v,s,proto);
isEs5ClsCustom = (v,s,proto) => isEs5ClsKeys(v,s,proto,Object.getOwnPropertyNames(proto)),
isEs5ClsKeys = (v,s,proto,keys) => isEs5ClsEnd(v.name, rmCmt(s)
    .replace(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, '""')
    .replace(/\/([^\/\n\\]|\\.)+\/[gimsuy]*/g, '//'), 
    keys.length > 1 || (keys.length === 1 && keys[0] !== 'constructor')),
isEs5ClsEnd = (name,s,hasCustomProps) => (hasCustomProps || /\bthis\./.test(s)) ? true : /^[A-Z]/.test(name || ''),
getEsClsNm = (v,s) => getEsClsNmSub(v,isEs6Cls(v,s),isEs5Cls(v,s)),
getEsClsNmSub = (v,is6,is5) => is6 || is5 ? `${is5 ? 'ES5.' : ''}Class<${v.name || '(Anonymous)'}>` : null,
getBndNm = (v,s)=>isBnd(v,s) ? `BoundFunction<${v.name.replace(/bound /, '')}>` : null,
getNtvNm = (v,s)=>isNtv(v,s) ? `Native${(isNtvCls(v) ? 'Class' : 'Function')}<${v.name}>` : null,
getArwNm = (v,s,ag)=>isArw(v,s) ? `${ag}ArrowFunction` : null,
getMdNm = (v,s,ag)=>isMd(v,s) ? `${ag}Method` : null,
getFnNm = (v,ag)=>!ag && !v.name ? 'AnonymousFunction' : `${ag}Function`,
getAgNm = (v,s)=>getAgNmCtor(v.constructor?.name) ? v.constructor?.name.replace(/Function$/, '') : getAgNmS(v,rmCmt(s||getTag(v)).trim()),
//getAgNmCtor = n=>['AsyncGeneratorFunction','GeneratorFunction','AsyncFunction'].some(N=>N===n) ? n : null,
//getAgNmCtor = n=>['AsyncGenerator','Generator','Async'].some(p=>`${p}Function`===n) ? n : null,
getAgNmCtor = n=>'AsyncGeneratorFunction'===n || 'GeneratorFunction'===n || 'AsyncFunction'===n ? n : null,
getAgNmS = (v,s)=>getAgNmS2(/^\s*(?:static\s+)?async\b/.test(s), /(?:function\s*\*|\*\s*[a-zA-Z_$])/.test(s)),
getAgNmS2 = (isA,isG)=>isA && isG ? 'AsyncGenerator' : isG ? 'Generator' : isA ? 'Async' : null,
getAgLikeNm = (v,s,ag)=>isArw(v,s) ? getArwNm(v,s,ag) : isMd(v,s,ag) ? getMdNm(v,s,ag) : getFnNm(v,s,ag),
getNameSub = (v,s)=>(isEs6Cls(v,s) || isEs5Cls(v,s)) ? getEsClsNm(v,s) : isBnd(v,s) ? getBndNm(v,s) : isNtv(v,s) ? getNtvNm(v,s) : getAgLikeNm(v,s,getAgNm(v,s)),
//FnAgTys.name(v, s)
const FnTys = {
    //name: v=>getEsClsNm(v,s) ? getBndNm(v,s) : getNtvNm(v,s) : getArwNm(v,s) : getMdNm(v,s) : getFnNm(v,s),
    name: v=>getNameSub(v, getTag(v)),
    _isEs6Cls: v=>isEs6Cls(v),
    _isEs5Cls:  v=>isEs5Cls(v),
};
export {FnTys};

