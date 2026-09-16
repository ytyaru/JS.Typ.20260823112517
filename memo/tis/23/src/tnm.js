export const N = {
    t: {o: 'object', f: 'function'},
    o: 'Object',
    f: 'Function',
    n: 'Native',
    es6: 'ES6',
    es5: 'ES5',
    c: 'Class',
    i: 'Instance',
    m: 'Method',
    s: 'Sync',
    a: 'Async',
    g: 'Generator',
    ag: 'AsyncGenerator',
    A: 'Anonymous',
    N: {
        i: 'Integer',
        f: 'Finite',
        I: 'Infinity',
        n: 'NaN',
    },
    d: 'Descriptor',
    D: {
        v: 'Value',
        a: 'Accessor',
        g: 'Getter',
        s: 'Setter',
    },
};
export const tnm = v => {
    const t = typeof v;
    const tag = Object.prototype.toString.call(v).slice(8, -1);
    if ([null,undefined].some(x=>x===v) || Array.isArray(v)) return tag;
    return ([null,undefined].some(x=>x===v) || Array.isArray(v)) ? tag
    : 'function'===t ? FnTys.name(v)
    : 'object'===t ? ObjTys.name(v,tag)
    : Number.isNaN(v) ? 'NaN' : Infinity===v ? 'Infinity' : -Infinity===v ? '-Infinity' : Number.isSafeInteger(v) ? 'Integer' : Number.isFinite(v) ? 'Finite' : tag
}
// 文字列リテラル、コメント、テンプレートリテラル内を除外した「実行コード部分」を抽出
const getCode = v => Function.prototype.toString.call(v)
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '') // コメント削除
    .replace(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, '""') // 文字列リテラル（'' , "" , ``）を空文字に置換
    .replace(/\/([^\/\n\\]|\\.)+\/[gimsuy]*/g, '//') // 正規表現リテラルを除外
    .trim();
class ObjTys {
    static name(v, tag) {
        const proto = Object.getPrototypeOf(v);
        if (null===proto) return 'NonePrototypeObject';
        if ([Boolean,Number,String].some(C=>v instanceof C)) {return `BoxedPrimitive<${v.constructor.name}>`}
        const des = DesTys.name(v);
        if (des) return des;
        const isPlain = Object.prototype===proto;
        if (isPlain) return `PlainObject`;
        const ctor = proto.constructor;
        const isEs6Ins = this.#isEs6Ins(proto, ctor);
        const isEs5Ins = this.#isEs5Ins(proto, ctor);
        if (!isPlain && 'Object'!==tag && !isEs6Ins && !isEs5Ins) return `NativeInstance<${tag}>`;
        if (isEs6Ins || isEs5Ins) return `${isEs5Ins ? 'ES5.' : ''}Instance<${ctor.name || '(Anonymous)'}>`
        return 'PrototypedObject';
    }
    static #isEs6Ins(proto, ctor) {return (typeof ctor !== 'function') ? false : FnTys._isEs6Cls(ctor, getCode(ctor))}
    static #isEs5Ins(proto, ctor) {
        const f = typeof ctor === 'function';
        const s = f ? getCode(ctor) : '';
        return !f || (ctor === Object || ctor === Function) || (FnTys._isEs6Cls(ctor, s) || FnTys._isNative(ctor, s)) ? false : (FnTys._isEs5Cls(ctor, s) || (proto !== Object.prototype && proto !== Function.prototype));
    }
}
class DesTys {
    static name(v) {
        const keys = Object.getOwnPropertyNames(v);
        if (keys.length === 0) return false;

        // 許可される全キー
        const allowedKeys = ['value', 'writable', 'get', 'set', 'configurable', 'enumerable'];
        if (!keys.every(key => allowedKeys.includes(key))) return false;

        // 存在チェック。getter/setterは片方だけ作成されると、作成されなかったほうが勝手に作成され値がundefinedになる仕様に対応した。但しvalueはundefinedという値が代入されうるため存在確認として使わない。
        const hasValue = keys.includes('value');
        const hasWritable = keys.includes('writable');
        const hasGet = keys.includes('get') && v.get !== undefined;
        const hasSet = keys.includes('set') && v.set !== undefined;

        return (
        // データ記述子とアクセサ記述子の混在不可ルール
            ((hasValue || hasWritable) && (hasGet || hasSet))
        // 型チェック
        || (hasGet && typeof v.get !== 'function' && v.get !== undefined)
        || (hasSet && typeof v.set !== 'function' && v.set !== undefined)
        // いずれのキーも無ければディスクリプタではない
        || (!hasValue && !hasWritable && !hasGet && !hasSet)
        ) ? '' : `Descriptor<${this.#naming(v, hasValue, hasGet, hasSet)}>`;
    }
    static #naming(v, hasValue, hasGet, hasSet) {
        return (hasGet || hasSet) ? ((hasGet && hasSet) ? 'Accessor' : (hasGet ? 'Getter' : 'Setter')) : ((hasValue && typeof v.value === 'function') ? 'Method' : 'Value');
    }
}
class FnTys {// クラスと関数を分け、関数を更に細分化する
    static name(v) {
        const s = getCode(v);
        const isEs6 = this._isEs6Cls(v,s);
        const isEs5 = this._isEs5Cls(v,s);
        return (isEs6 || isEs5) ? `${isEs5 ? 'ES5.' : ''}Class<${v.name || '(Anonymous)'}>`
            : this.#isBound(v,s) ? `BoundFunction<${v.name.replace(/bound /,'')}>`
            : this._isNative(v,s) ? `Native${(this.#isNativeClass(v) ? 'Class' : 'Function')}<${v.name}>`
            : this.#isArrow(v,s) ? `${FnAgTys.name(v,s)}ArrowFunction`
            : this.#isMethod(v,s) ? `${FnAgTys.name(v,s)}Method`
            : this.#getFnNm(v,FnAgTys.name(v,s));
    }
    static #getFnNm(v,ag) {return `${(!ag && !v.name ? 'Anonymous' : ag)}Function`}
    static _isEs6Cls(v,s) {return /^\s*class\b/.test(s);}
    static _isEs5Cls(v,s) {
        if (this._isEs6Cls(v,s) || this._isNative(v,s) || this.#isArrow(v,s)) return false;
        
        const proto = v.prototype;
        if (!proto || typeof proto !== 'object') return false;
        
        const isCtorSelf = proto.constructor === v;
        if (!isCtorSelf) return false;

        const keys = Object.getOwnPropertyNames(proto);
        const hasCustomProps = keys.length > 1 || (keys.length === 1 && keys[0] !== 'constructor');
        if (hasCustomProps || /\bthis\./.test(s)) return true;

        const name = v.name || '';
        return /^[A-Z]/.test(name);
    }
    static _isNative(v,s) {return s.includes('[native code]');}
    static #isNativeClass(v) {return v.prototype !== undefined && typeof v.prototype === 'object';}
    static #isBound(v,s) {return v.name.startsWith('bound ');}
    static #isArrow(v,s) {return !v.hasOwnProperty('prototype') && s.includes('=>');}
    static #isMethod(v,s) {return /\bfunction\b/.test(s) ? false : !s.includes('=>');}
}
class FnAgTys {
    static name(v, s) {
        const cName = v.constructor?.name;
        if (['AsyncGenerator','Generator','Async'].some(n=>`${n}Function`===cName)) return cName.replace(/Function$/,'')
        const isAsync = /^\s*(?:static\s+)?async\b/.test(s);
        const isGenerator = /(?:function\s*\*|\*\s*[a-zA-Z_$])/.test(s);
        return isAsync && isGenerator ? 'AsyncGenerator' : isGenerator ? 'Generator' : isAsync ? 'Async' : '';
    }
}

