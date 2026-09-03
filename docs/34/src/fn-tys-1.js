const getTag = v => Function.prototype.toString.call(v),
rmCmt = s => s.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ''),
isNtv = (v,s) => s.includes('[native code]'),
isNtvCls = (v,s) => v.prototype !== undefined && typeof 'object'===v.prototype,
isBnd = (v,s) => v.name.startsWith('bound '),
isArw = (v,s) => !v.hasOwnProperty('prototype') && s.includes('=>'),
isMd = (v,s) => /\bfunction\b/.test(this._removeComments(s)) ? false : !s.includes('=>'),
isEs6Cls = (v, s) => /^\s*class\b/.test(this._removeComments((s || getTag(v)))),
isEs5Cls = (v, s) => isEs5ClsSub(v,(s || this.tag(v)),v.prototype),
isEs5ClsSub = (v, s, proto) => ((this._isEs6Cls(v, s) || this._isNative(v, s) || this._isArrow(v, s)) || (!proto || typeof proto !== 'object') || (proto.constructor !== v)) ? false :  ? isEs5ClsCustom(v,s,proto);
isEs5ClsCustom = (v,s,proto) => isEs5ClsKeys(v,s,proto,Object.getOwnPropertyNames(proto)),
isEs5ClsKeys = (v,s,proto,keys) => isEs5ClsEnd(v.name, rmCmt(s)
    .replace(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, '""')
    .replace(/\/([^\/\n\\]|\\.)+\/[gimsuy]*/g, '//'), 
    keys.length > 1 || (keys.length === 1 && keys[0] !== 'constructor')),
isEs5ClsEnd = (name,s,hasCustomProps) => (hasCustomProps || /\bthis\./.test(s)) ? true : /^[A-Z]/.test(name || ''),
getEsClsNm = (v,s) => getEsClsNmSub(v,isEs6Cls(v,s),isEs5Cls(v,s)),
getEsClsNmSub = (v,is6,is5) => is6 || is5 ? `${is5 ? 'ES5.' : ''}Class<${v.name || '(Anonymous)'}>` : null,
getBndNm = (v,s)=>isBnd(v,s) ? `BoundFunction<${v.name.replace(/bound /, '')}>` : null,
getNtvNm = (v,s)=>isNtv(v,s) ? `Native${(this._isNativeClass(v) ? 'Class' : 'Function')}<${v.name}>` : null,
getArwNm = (v,s)=>isArw(v,s) ? `${FnAgTys.name(v, s)}ArrowFunction` : null,
getMdNm = (v,s,ag)=>isMd(v,s) ? `${ag}Method`,
getFnNm = (v,ag)=>!ag && !v.name ? 'AnonymousFunction' : `${ag}Function`,
getAgNm = (v,s)=>getAgNmCtor(v.constructor?.name) ? v.constructor?.name : getAgNmS(v,rmCmt(s||getTag(v)).trim()),
//getAgNmCtor = n=>['AsyncGeneratorFunction','GeneratorFunction','AsyncFunction'].some(N=>N===n) ? n : null,
//getAgNmCtor = n=>['AsyncGenerator','Generator','Async'].some(p=>`${p}Function`===n) ? n : null,
getAgNmCtor = n=>'AsyncGeneratorFunction'===n || 'GeneratorFunction'===n || 'AsyncFunction'===n ? n : null,
getAgNmS = (v,s)=>getAgNmS2(/^\s*(?:static\s+)?async\b/.test(s), /(?:function\s*\*|\*\s*[a-zA-Z_$])/.test(s)),
getAgNmS2 = (isA,isG)=>isA && isG ? 'AsyncGenerator' : isGenerator ? 'Generator' : isAsync ? 'Async' : null,
getAgLikeNm = (v,s,ag)=>isArw(v,s) ? getArwNm(v,s,ag) : isMd(v,s,ag) ? getMdNm(v,s,ag) : getFnNm(v,s,ag),
getNameSub = (v,s)=>isEsCls(v,s) ? getEsClsNm(v,s) : isBnd(v,s) ? getBndNm(v,s) : isNtv(v,s) ? getNtvNm(v,s) : getAgLikeNm(v,s,getAgNm(v,s)),
//FnAgTys.name(v, s)
const FnTys = {
    //name: v=>getEsClsNm(v,s) ? getBndNm(v,s) : getNtvNm(v,s) : getArwNm(v,s) : getMdNm(v,s) : getFnNm(v,s),
    name: v=>getNameSub(v, getTag(v)),
    _isEs6Cls: v=>isEs6Cls(v),
    _isEs5Cls:  v=>isEs5Cls(v),
};
export {FnTys};
// コメント除去処理を共通化した
class FnTys {
    static name(v) {
        const s = this.tag(v);
        const [isEs6, isEs5] = [this._isEs6Cls(v, s), this._isEs5Cls(v, s)];
        if (isEs6 || isEs5) return `${isEs5 ? 'ES5.' : ''}Class<${v.name || '(Anonymous)'}>`;
        if (this._isBound(v, s)) return `BoundFunction<${v.name.replace(/bound /, '')}>`;
        if (this._isNative(v, s)) return `Native${(this._isNativeClass(v) ? 'Class' : 'Function')}<${v.name}>`;
        if (this._isArrow(v, s)) return `${FnAgTys.name(v, s)}ArrowFunction`;
        if (this._isMethod(v, s)) return `${FnAgTys.name(v, s)}Method`;
        const ag = FnAgTys.name(v, s);
        return !ag && !v.name ? 'AnonymousFunction' : `${ag}Function`;
    }

    static tag(v) { return Function.prototype.toString.call(v); }

    // 【共通化】コメントを除去するヘルパーメソッド
    static _removeComments(s) {
        return s.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
    }

    static _isEs6Cls(v, s) {
        if (!s) s = this.tag(v);
        // コメントを除去してから先頭が class から始まるか判定
        return /^\s*class\b/.test(this._removeComments(s));
    }

    static _isEs5Cls(v, s) {
        if (!s) s = this.tag(v);
        if (this._isEs6Cls(v, s) || this._isNative(v, s) || this._isArrow(v, s)) return false;
        
        const proto = v.prototype;
        if (!proto || typeof proto !== 'object') return false;
        if (proto.constructor !== v) return false;

        const keys = Object.getOwnPropertyNames(proto);
        const hasCustomProps = keys.length > 1 || (keys.length === 1 && keys[0] !== 'constructor');
        
        // 共通メソッドを利用してコメント除去
        const cleanS = this._removeComments(s)
            .replace(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, '""')
            .replace(/\/([^\/\n\\]|\\.)+\/[gimsuy]*/g, '//');

        if (hasCustomProps || /\bthis\./.test(cleanS)) return true;

        const name = v.name || '';
        return /^[A-Z]/.test(name);
    }

    static _isNative(v, s) { return s.includes('[native code]'); }
    static _isNativeClass(v) {
        return v.prototype !== undefined && typeof v.prototype === 'object';
    }
    static _isBound(v, s) { return v.name.startsWith('bound '); }
    static _isArrow(v, s) {
        return !v.hasOwnProperty('prototype') && s.includes('=>');
    }
    static _isMethod(v, s) {
        // 共通メソッドを利用
        return /\bfunction\b/.test(this._removeComments(s)) ? false : !s.includes('=>');
    }
}

class FnAgTys {
    static name(v, s) {
        if (typeof v !== 'function') return '';

        const cName = v.constructor?.name;
        if (cName === 'AsyncGeneratorFunction') return 'AsyncGenerator';
        if (cName === 'GeneratorFunction') return 'Generator';
        if (cName === 'AsyncFunction') return 'Async';

        if (!s) s = Function.prototype.toString.call(v);
        // FnTys の共通メソッドを利用してコメント除去
        const cleanStr = FnTys._removeComments(s).trim();

//        const isAsync = cleanStr.startsWith('async') || cleanStr.includes('async ');
//        const isGenerator = s.includes('*');

        //    const isAsync = cleanStr.startsWith('async') || cleanStr.includes('async ');
        // 修正: 全体検索(.includes)をやめ、先頭が async から始まる（または static async などの後）か判定する
        const isAsync = /^\s*(?:static\s+)?async\b/.test(cleanStr);
        //    const isGenerator = cleanStr.includes('*');
        // 修正: 単なる .includes('*') をやめ、ジェネレータ特有の構文位置を正規表現で判定
        // 例: function* , function *, *methodName
        const isGenerator = /(?:function\s*\*|\*\s*[a-zA-Z_$])/.test(cleanStr);

        return isAsync && isGenerator ? 'AsyncGenerator' : isGenerator ? 'Generator' : isAsync ? 'Async' : '';
    }
}



