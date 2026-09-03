import {safeNum,getTag,CORE,OBJ,CLS,FN} from './core.js';
const nNm = v=>Number.isNaN(v) ? 'NaN' : Infinity===v ? 'Infinity' : -Infinity===v ? '-Infinity' : Number.isSafeInteger(v) ? 'Integer' : Number.isFinite(v) ? 'Finite' : false,
getBoxedName = (v) =>[Boolean, Number, String].some(C => v instanceof C) ? `BoxedPrimitive<${v.constructor.name}>` : null,
isInsEs6 = (proto, ctor)=>(typeof ctor !== 'function') ? false : FnTys._isEs6Cls(ctor),
isInsEs5 = (proto, ctor)=>typeof ctor !== 'function' || (ctor === Object || ctor === Function) || (FnTys._isEs6Cls(ctor) || FnTys._isNative(ctor, Function.prototype.toString.call(ctor))) ? false : (FnTys._isEs5Cls(ctor) || (proto !== Object.prototype && proto !== Function.prototype)),
getInstanceName = (v, proto, ctor, tag) => {
    const isEs6 = isInsEs6(proto, ctor);
    const isEs5 = isInsEs5(proto, ctor);
    return (isEs6 || isEs5) ? `${isEs5 ? 'ES5.' : ''}Instance<${ctor.name || '(Anonymous)'}>` : 
        ('Object' !== tag) ? `NativeInstance<${tag}>` : null;
},
getHasObjNm = (v, tag, proto, boxed, des, inst) => boxed ? boxed :
    des ? des :
    (proto === Object.prototype) ? 'PlainObject' :
    inst ? inst : 'PrototypedObject',
oNm = (v, tag, proto) => proto === null ? 'HasNotPrototypeObject'
    : getHasObjNm(v, tag, proto, getBoxedName(v), DesTys.name(v), getInstanceName(v, proto, proto.constructor, tag)),
onNm = (v,to,tag)=>'object' === to ? oNm(v, tag, Object.getPrototypeOf(v))
    : 'Number' === tag ? nNm(v, tag) : tag,
foNm = (v,to,tag)=> 'function' === to ? FnTys.name(v)
    : onNm(v,to,getTag(v)),
tof = v => null === v ? 'Null' 
    : undefined === v ? 'Undefined' 
    : Array.isArray(v) ? 'Array' 
    : foNm(v, typeof v);
class DesTys {
    static is(v) {
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
        ) ? false : this._naming(v, hasValue, hasGet, hasSet);
        /*
        // データ記述子とアクセサ記述子の混在不可ルール
        if ((hasValue || hasWritable) && (hasGet || hasSet)) return false;

        // 型チェック
        if (hasGet && typeof v.get !== 'function' && v.get !== undefined) return false;
        if (hasSet && typeof v.set !== 'function' && v.set !== undefined) return false;

        // いずれのキーも無ければディスクリプタではない
        if (!hasValue && !hasWritable && !hasGet && !hasSet) return false;

        return this._naming(v, hasValue, hasGet, hasSet);
        */
    }
    static _naming(v, hasValue, hasGet, hasSet) {
        // 1. アクセサ系 (get または set がある場合)
//        if (hasGet || hasSet) {return (hasGet && hasSet) ? 'Accessor' : (hasGet ? 'Getter' : 'Setter');}
        // 2. データ系 (value または writable がある場合)
//        return (hasValue && typeof v.value === 'function') ? 'Method' : 'Value';
        return (hasGet || hasSet) ? ((hasGet && hasSet) ? 'Accessor' : (hasGet ? 'Getter' : 'Setter')) : ((hasValue && typeof v.value === 'function') ? 'Method' : 'Value');
    }
    static name(v) {
        const type = this.is(v);
        return type ? `Descriptor<${type}>` : '';
    }
}
class FnTys {// クラスと関数を分け、関数を更に細分化する
    static name(v) {
        const s = this.tag(v);
        const [isEs6,isEs5] = [this._isEs6Cls(v,s), this._isEs5Cls(v,s)];
        if (isEs6 || isEs5) return `${isEs5 ? 'ES5.' : ''}Class<${v.name || '(Anonymous)'}>`
        if (this._isBound(v,s)) return `BoundFunction<${v.name.replace(/bound /,'')}>`;
        if (this._isNative(v,s)) return `Native${(this._isNativeClass(v) ? 'Class' : 'Function')}<${v.name}>`
        if (this._isArrow(v,s)) return `${FnAgTys.name(v,s)}ArrowFunction`;
        if (this._isMethod(v,s)) return `${FnAgTys.name(v,s)}Method`;
        const ag = FnAgTys.name(v,s);
        return !ag && !v.name ? 'AnonymousFunction' : `${ag}Function`; // AsyncもGeneratorも名前もない場合のみAnonymous。逆に名前がなくてもAsyncやGeneratorであればAnonymousにはならずAsyncFunctionなどになる。Anonymouseはあくまで通常関数の詳細として細分化する時だけに使うべき。それ以外は匿名か否かなどどうでもいい。それより重要な性質があるし、名前の有無は不要。
    }
    static tag(v) {return Function.prototype.toString.call(v)}
    static _isEs6Cls(v,s) {
        if (!s) s = this.tag(v); // Instance判定時に呼び出す時用に必要
        // Bunの最適化やコメントに対応した正規表現で class 構文か判定
        return /^\s*(?:\/\*[\s\S]*?\*\/\s*)*class\b/.test(s);
    }
    static _isEs5Cls(v,s) {
        if (!s) s = this.tag(v);
        if (this._isEs6Cls(v,s) || this._isNative(v,s) || this._isArrow(v,s)) return false;
        
        const proto = v.prototype;
        if (!proto || typeof proto !== 'object') return false;
        
        const isCtorSelf = proto.constructor === v;
        if (!isCtorSelf) return false;

        const keys = Object.getOwnPropertyNames(proto);
        const hasCustomProps = keys.length > 1 || (keys.length === 1 && keys[0] !== 'constructor');
        
        // 文字列リテラル、コメント、テンプレートリテラル内を除外した「実行コード部分」を抽出
        const cleanS = s
            .replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '') // コメント除去
            .replace(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, '""') // 文字列リテラル（'' , "" , ``）を空文字に置換
            .replace(/\/([^\/\n\\]|\\.)+\/[gimsuy]*/g, '//'); // 正規表現リテラルを除外

        if (hasCustomProps || /\bthis\./.test(cleanS)) return true;

        const name = v.name || '';
        return /^[A-Z]/.test(name);
    }
    //static _isBuiltin(v,s) {return s.includes('[native code]');}
    static _isNative(v,s) {return s.includes('[native code]');}
    static _isNativeClass(v) {
        // 組込コンストラクタ（Map, Array, Dateなど）は prototype を持ち、それがオブジェクトである
        return v.prototype !== undefined && typeof v.prototype === 'object';
    }
    static _isBound(v,s) {return v.name.startsWith('bound ');}
    static _isArrow(v,s) {
        // アロー関数は prototype プロパティを持たない特徴を利用
        // ※ただし一部のBuiltinやメソッドと競合しないよう補助的に判定
        return !v.hasOwnProperty('prototype') && s.includes('=>');
    }
    static _isMethod(v,s) {
        /*
        // コメント等を除外した実質的なコード文字列を作成
        const cleanSrc = s.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');

        // 1. 通常の関数や非同期関数（async function）には必ず 'function' 単語が含まれます。
        //    これらが含まれている場合は絶対メソッドではないので false を返します。
        if (/\bfunction\b/.test(cleanSrc)) return false;

        // 2. 'function' を含まない、かつアロー関数（=>）でもない関数は、仕様上「メソッド」しか残りません。
        return !s.includes('=>');
        */
        return /\bfunction\b/.test(s.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '')) ? false : !s.includes('=>');
    }
}
class FnAgTys {
    static name(v,s) {
        if (typeof v !== 'function') return '';

        // 1. コンストラクタ名による高速・確実な判定
        const cName = v.constructor?.name;
        if (cName === 'AsyncGeneratorFunction') return 'AsyncGenerator';
        if (cName === 'GeneratorFunction') return 'Generator';
        if (cName === 'AsyncFunction') return 'Async';

        // 2. 万が一のための文字列判定フォールバック
        if (!s) s = Function.prototype.toString.call(v);
        const cleanStr = s.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '').trim();

        const isAsync = cleanStr.startsWith('async') || cleanStr.includes('async ');
        const isGenerator = s.includes('*');

        /*
        if (isAsync && isGenerator) return 'AsyncGenerator';
        if (isGenerator) return 'Generator';
        if (isAsync) return 'Async';

        return '';
        */
        return isAsync && isGenerator ? 'AsyncGenerator' : isGenerator ? 'Generator' : isAsync ? 'Async' : '';
    }
}
export {tof};

/*
class ObjTys {
    static is(v, tag) {
        const proto = Object.getPrototypeOf(v);
        if (null===proto) return `HasNotPrototypeObject`;
        if ([Boolean,Number,String].some(C=>v instanceof C)) {return `BoxedPrimitive<${v.constructor.name}>`}
        const des = DesTys.name(v);
        if (des) return des;
        const isPlain = Object.prototype===proto;
        if (isPlain) return `PlainObject`;
        const ctor = proto.constructor;
        const isEs6Ins = this._isInsEs6(proto, ctor);
        const isEs5Ins = this._isInsEs5(v, proto, ctor);
        if (!isPlain && 'Object'!==tag && !isEs6Ins && !isEs5Ins) return `NativeInstance<${tag}>`;
        if (isEs6Ins || isEs5Ins) return `${isEs5Ins ? 'ES5.' : ''}Instance<${ctor.name || '(Anonymous)'}>`
        return 'PrototypedObject';
    }
    static _isInsEs6(proto, ctor) {
        if (typeof ctor !== 'function') return false;
        return FnTys._isEs6Cls(ctor);
    }
    static _isInsEs5(v, proto, ctor) {
        return typeof ctor !== 'function' || (ctor === Object || ctor === Function) || (FnTys._isEs6Cls(ctor) || FnTys._isNative(ctor, Function.prototype.toString.call(ctor))) ? false : (FnTys._isEs5Cls(ctor) || (proto !== Object.prototype && proto !== Function.prototype));
    }
}
*/

