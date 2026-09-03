const A = ['value', 'writable', 'get', 'set', 'configurable', 'enumerable'],
isObj = v => v && typeof v === 'object',
getKeys = v => Object.getOwnPropertyNames(v),
isValidKeys = k => k.length && k.every(x => A.includes(x)),
getN = (v, l, w, g, s) => g && s ? 'Accessor' : g ? 'Getter' : s ? 'Setter' : l && typeof v.value == 'function' ? 'Method' : 'Value',
parseDes = (v, k, l = k.includes('value'), w = k.includes('writable'), g = k.includes('get') && v.get !== undefined, s = k.includes('set') && v.set !== undefined) => 
    !(((l || w) && (g || s)) || (g && typeof v.get != 'function') || (s && typeof v.set != 'function') || (!l && !w && !g && !s)) && `Descriptor<${getN(v, l, w, g, s)}>`,
evalDes = (v, k) => isValidKeys(k) && parseDes(v, k),
getName = v => isObj(v) && evalDes(v, getKeys(v)) || '',
DesTys = {
    name: v => getName(v)
};
export {DesTys};
