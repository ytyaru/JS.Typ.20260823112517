export class Tys {// Type string name
    static name(v) {
        if (null===v) return 'Null';
        if (undefined===v) return 'Undefined';
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
        //if (this._isDes(v)) return 'Descriptor';
        //if (DesTys.is(v)) return 'Descriptor';
        const des = DesTys.name(v);
        if (des) return des;
        if (Object.prototype===proto) return `PlainObject`;
        if (this._isIns(v,proto)) return `Instance<${proto.constructor.name}>`;
        // Object.create()で拡張されたりnew Function()で生成されたES5以前の擬似クラスインスタンスなど上記以外全て。
        return name;
    }
    /*
    static _isDes(v) {// Descriptor
        const keys = Object.keys(v);
        keys.['value', 'writable'].includes(key)
        const isDescriptor = keys.length > 0 && keys.every(key => 
            ['value', 'writable', 'get', 'set', 'configurable', 'enumerable'].includes(key)
        ) && (keys.includes('value') || keys.includes('writable') || keys.includes('get') || keys.includes('set'));
    }
    */
    static _isIns(v,proto) {// Instance
        const ctor = proto.constructor;
        return 'function'===typeof ctor && FnTys._isEsCls(ctor);
    }
}
/*
class DesTys {
    static is(v) {
        const keys = Object.getOwnPropertyNames(v);
        console.log(`DesTys keys.length:${keys.length}`);
        if (keys.length === 0) return false;

        // 許可される全キー
        const allowedKeys = ['value', 'writable', 'get', 'set', 'configurable', 'enumerable'];
        if (!keys.every(key => allowedKeys.includes(key))) return false;

        // `in` 演算子はプロトタイプチェーンまで見てしまうため、
        // keys（自身のプロパティ一覧）に含まれているかでチェックするのが確実
        const hasValue = keys.includes('value');
        const hasWritable = keys.includes('writable');
        const hasGet = keys.includes('get');
        const hasSet = keys.includes('set');

        // データ記述子とアクセサ記述子の両方を同時に持つことはできない
        if ((hasValue || hasWritable) && (hasGet || hasSet)) return false;

        // get/setがある場合は関数でなければならない
        if (hasGet && typeof v.get !== 'function' && v.get !== undefined) return false;
        if (hasSet && typeof v.set !== 'function' && v.set !== undefined) return false;

        // ディスクリプタとして最低限必要なキーのいずれかが存在する
        return hasValue || hasWritable || hasGet || hasSet;
    }
}
*/
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
        if (this._isEsCls(v)) return `Class<${v.constructor.name}>`;
        if (this._isBuiltin(v)) return 'BuiltinFunction';
        if (this._isBind(v)) return 'BindFunction';
        if (this._isArrow(v)) return 'ArrowFunction';
        if (this._isMethod(v)) return 'Method';
        return 'Function';
    }
    static _isEsCls(v) {return Function.prototype.toString.call(v).startsWith('class\b')}
    static _isBuiltin(v) {
        return Function.prototype.toString.call(v).includes('[native code]');
    }
    static _isBind(v) {
        return Function.prototype.toString.call(v).includes('bound ');
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

