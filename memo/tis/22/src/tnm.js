export const tof = v => {
    if (null===v) return 'Null';
    if (undefined===v) return 'Undefined';
    if (Array.isArray(v)) return 'Array';
    const to = typeof v;
    if ('function'===to) return FnTys.name(v);
    const tag = Object.prototype.toString.call(v).slice(8, -1);
    return 'object'===to ? ObjTys.name(v, tag) : 'Number'===tag ? isNum(v, name) : tag;
}
// 文字列リテラル、コメント、テンプレートリテラル内を除外した「実行コード部分」を抽出
const getCode = v => Function.prototype.toString.call(v)
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '') // コメント削除
    .replace(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, '""') // 文字列リテラル（'' , "" , ``）を空文字に置換
    .replace(/\/([^\/\n\\]|\\.)+\/[gimsuy]*/g, '//') // 正規表現リテラルを除外
    .trim();
const isNum = (v, tag) => Number.isNaN(v) ? 'NaN' : Infinity===v ? 'Infinity' : -Infinity===v ? '-Infinity' : Number.isSafeInteger(v) ? 'Integer' : Number.isFinite(v) ? 'Finite' : tag;
class ObjTys {
    static name(v, name) {
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
        if (!isPlain && 'Object'!==name && !isEs6Ins && !isEs5Ins) return `NativeInstance<${name}>`;
        if (isEs6Ins || isEs5Ins) return `${isEs5Ins ? 'ES5.' : ''}Instance<${ctor.name || '(Anonymous)'}>`
        return 'PrototypedObject';
    }
    static #isEs6Ins(proto, ctor) {return (typeof ctor !== 'function') ? false : FnTys._isEs6Cls(ctor, getCode(ctor))}
    static #isEs5Ins(proto, ctor) {
        const f = typeof ctor === 'function';
        const s = f ? getCode(ctor) : '';
        return !f || (ctor === Object || ctor === Function) || (FnTys._isEs6Cls(ctor, s) || FnTys._isNative(ctor, s)) ? false : (FnTys._isEs5Cls(ctor, s) || (proto !== Object.prototype && proto !== Function.prototype));
        //return typeof ctor !== 'function' || (ctor === Object || ctor === Function) || (FnTys._isEs6Cls(ctor, s) || FnTys._isNative(ctor, s)) ? false : (FnTys._isEs5Cls(ctor, s) || (proto !== Object.prototype && proto !== Function.prototype));
    }
}
class DesTys {
    static name(v) {
//    static is(v) {
//        if (v === null || typeof v !== 'object') return false;

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
        //) ? false : this._naming(v, hasValue, hasGet, hasSet);
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
    static _isEs6Cls(v,s) {
//        if (!s) s = Function.prototype.toString.call(v); // Instance判定時に呼び出す時用に必要
        return /^\s*class\b/.test(s);
    }
    static _isEs5Cls(v,s) {
//        if (!s) s = Function.prototype.toString.call(v);
        if (this._isEs6Cls(v,s) || this._isNative(v,s) || this.#isArrow(v,s)) return false;
        
        const proto = v.prototype;
        if (!proto || typeof proto !== 'object') return false;
        
        const isCtorSelf = proto.constructor === v;
        if (!isCtorSelf) return false;

        const keys = Object.getOwnPropertyNames(proto);
        const hasCustomProps = keys.length > 1 || (keys.length === 1 && keys[0] !== 'constructor');
        
        // 文字列リテラル、コメント、テンプレートリテラル内を除外した「実行コード部分」を抽出
//        const cleanS = s.replace(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, '""') // 文字列リテラル（'' , "" , ``）を空文字に置換
//            .replace(/\/([^\/\n\\]|\\.)+\/[gimsuy]*/g, '//'); // 正規表現リテラルを除外

//        if (hasCustomProps || /\bthis\./.test(cleanS)) return true;
        if (hasCustomProps || /\bthis\./.test(s)) return true;

        const name = v.name || '';
        return /^[A-Z]/.test(name);
    }
    static _isNative(v,s) {return s.includes('[native code]');}
    static #isNativeClass(v) {
        // 組込コンストラクタ（Map, Array, Dateなど）は prototype を持ち、それがオブジェクトである
        return v.prototype !== undefined && typeof v.prototype === 'object';
    }
    static #isBound(v,s) {return v.name.startsWith('bound ');}
    static #isArrow(v,s) {
        // アロー関数は prototype プロパティを持たない特徴を利用
        // ※ただし一部のBuiltinやメソッドと競合しないよう補助的に判定
        return !v.hasOwnProperty('prototype') && s.includes('=>');
    }
    static #isMethod(v,s) {
        /*
        // コメント等を除外した実質的なコード文字列を作成
        const cleanSrc = s.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');

        // 1. 通常の関数や非同期関数（async function）には必ず 'function' 単語が含まれます。
        //    これらが含まれている場合は絶対メソッドではないので false を返します。
        if (/\bfunction\b/.test(cleanSrc)) return false;

        // 2. 'function' を含まない、かつアロー関数（=>）でもない関数は、仕様上「メソッド」しか残りません。
        return !s.includes('=>');
        */
        return /\bfunction\b/.test(s) ? false : !s.includes('=>');
    }
}
class FnAgTys {
    static name(v, s) {
//        if (typeof v !== 'function') return '';

        const cName = v.constructor?.name;
        if (['AsyncGenerator','Generator','Async'].some(n=>`${n}Function`===cName)) return cName.replace(/Function$/,'')
//        if (cName === 'AsyncGeneratorFunction') return 'AsyncGenerator';
//        if (cName === 'GeneratorFunction') return 'Generator';
//        if (cName === 'AsyncFunction') return 'Async';

//        if (!s) s = Function.prototype.toString.call(v);
//        const cleanStr = FnTys._removeComments(s).trim();

        //const isAsync = /^\s*(?:static\s+)?async\b/.test(cleanStr);
        const isAsync = /^\s*(?:static\s+)?async\b/.test(s);
        
        // 修正: 単なる .includes('*') をやめ、ジェネレータ特有の構文位置を正規表現で判定
        // 例: function* , function *, *methodName
        //const isGenerator = /(?:function\s*\*|\*\s*[a-zA-Z_$])/.test(cleanStr);
        const isGenerator = /(?:function\s*\*|\*\s*[a-zA-Z_$])/.test(s);

        return isAsync && isGenerator ? 'AsyncGenerator' : isGenerator ? 'Generator' : isAsync ? 'Async' : '';
    }
}

