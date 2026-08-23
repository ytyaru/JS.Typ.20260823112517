export class Tys {// Type string name
    static name(v) {
        if (null===v) return 'Null';
        if (undefined===v) return 'Undefined';
        if (Array.isArray(v)) return 'Array';
        const to = typeof v;
        if ('function'===to) return FnTys.name(v);
        const name = this._name(v);
        if ('object'===to) return this._obj(v, name);
        if ('Number'===name) return this._num(v, name);
//        if ('Object'===name) return this._obj(v, name);
        return name;
    }
    static _name(v) {return Object.prototype.toString.call(v).slice(8, -1);}
    static _num(v, name) {// "number"でなく以下のようにする。
        if (Number.isNaN(v)) return 'NaN';
        if (Infinity===v) return 'Infinity';
        if (-Infinity===v) return '-Infinity';
        if (Number.isSafeInteger(v)) return 'Integer';
        if (Number.isFinite(v)) return 'Finite';
        return name; // ここは通らないはず
    }
    static _obj(v, name) {
        const proto = Object.getPrototypeOf(v);
        if (null===proto) return `HasNotPrototypeObject`;
        if ([Boolean,Number,String].some(C=>v instanceof C)) {return `BoxedPrimitive<${v.constructor.name}>`}
        const des = DesTys.name(v);
        if (des) return des;
        const isPlain = Object.prototype===proto;
        if (isPlain) return `PlainObject`;
        const isIns = this._isIns(v,proto);
        if (!isPlain && 'Object'!==name && !isIns) return `BuiltinObject<${name}>`;
        if (isIns) return `Instance<${proto.constructor.name}>`;
        // Object.create()で拡張されたりnew Function()で生成されたES5以前の擬似クラスインスタンスなど上記以外全て。
        return 'PrototypedObject';
        //return name;
    }
    /*
    static _isIns(v,proto) {// Instance
        const ctor = proto.constructor;
        return 'function'===typeof ctor && FnTys._isEsCls(ctor);
    }
    */
    static _isIns(v, proto) {
        const ctor = proto.constructor;
        if (typeof ctor !== 'function') return false;
        return FnTys._isEsCls(ctor);
//        const str = Function.prototype.toString.call(ctor);
        // Bunの最適化やコメントに対応した正規表現で class 構文か判定
//        return /^\s*(?:\/\*[\s\S]*?\*\/\s*)*class\b/.test(str);
    }
}
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

        // データ記述子とアクセサ記述子の混在不可ルール
        if ((hasValue || hasWritable) && (hasGet || hasSet)) return false;

        // 型チェック
        if (hasGet && typeof v.get !== 'function' && v.get !== undefined) return false;
        if (hasSet && typeof v.set !== 'function' && v.set !== undefined) return false;

        // いずれのキーも無ければディスクリプタではない
        if (!hasValue && !hasWritable && !hasGet && !hasSet) return false;

        return this._naming(v, hasValue, hasGet, hasSet);
    }
    static _naming(v, hasValue, hasGet, hasSet) {
        // 1. アクセサ系 (get または set がある場合)
        if (hasGet || hasSet) {return (hasGet && hasSet) ? 'Accessor' : (hasGet ? 'Getter' : 'Setter');}
        // 2. データ系 (value または writable がある場合)
        return (hasValue && typeof v.value === 'function') ? 'Method' : 'Value';
    }
    static name(v) {
        const type = this.is(v);
        return type ? `Descriptor<${type}>` : '';
    }
}
class FnTys {// クラスと関数を分け、関数を更に細分化する
    static name(v) {
        const s = Function.prototype.toString.call(v);
        if (this._isEsCls(v)) return `Class<${v.name}>`;
        if (this._isBound(v)) return `BoundFunction<${v.name.replace(/bound /,'')}>`;
        //if (this._isBuiltin(v)) return 'BuiltinFunction';
        if (this._isBuiltin(v)) return `BuiltinFunction<${v.name}>`;
        //if (this._isBind(v)) return 'BindFunction';
        //if (this._isBound(v)) return `BoundFunction<${v.name}>`;
        //if (this._isBound(v)) return `BoundFunction<${s.replace(/^bound /,'')}>`;
        if (this._isArrow(v)) return 'ArrowFunction';
        if (this._isMethod(v)) return 'Method';
        return 'Function';
    }
    //static _isEsCls(v) {return Function.prototype.toString.call(v).startsWith('class\b')}
    static _isEsCls(v) {
        const str = Function.prototype.toString.call(v);
        // Bunの最適化やコメントに対応した正規表現で class 構文か判定
        return /^\s*(?:\/\*[\s\S]*?\*\/\s*)*class\b/.test(str);
    }
    static _isBuiltin(v) {
        return Function.prototype.toString.call(v).includes('[native code]');
    }
    static _isBound(v) {
        return v.name.startsWith('bound ');
//        return Function.prototype.toString.call(v).includes('bound ');
    }
    static _isArrow(v) {
        // アロー関数は prototype プロパティを持たない特徴を利用
        // ※ただし一部のBuiltinやメソッドと競合しないよう補助的に判定
        const str = Function.prototype.toString.call(v);
        return !v.hasOwnProperty('prototype') && str.includes('=>');
    }
    static _isMethod(v) {
        const str = Function.prototype.toString.call(v);
        // メソッド構文（ES6 method shorthand など）の簡易判定
        return !v.hasOwnProperty('prototype') && !str.includes('=>') && !str.startsWith('function\b');
    }
}

