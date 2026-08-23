export class Tys {// Type string name
    static name(v) {
        if (null===v) return 'Null';
        if (undefined===v) return 'Undefined';
        if ('function'===typeof v) return FnTys.name(v);
        const name = this._name(v);
        if ('Number'===name) return this._num(v, name);
        if ('Object'===name) return this._obj(v, name);
        return name;
    }
    static _name(v) {return Object.prototype.toString.call(v).slice(8, -1);}
    static _num(v, name) {// "number"でなく以下のようにする。
        if (Number.isNaN(v)) return 'NaN';
        if (Infinity===v) return 'Infinity';
        if (-Infinity===v) return '-Infinity';
        if (Number.isSafeInteger(v)) return 'Integer';
        if (Number.isFinite(v)) return 'Finite';
        return name;
    }
    static _obj(v, name) {
        const proto = Object.getPrototypeOf(v);
        if (null===proto) return `HasNotPrototypeObject`;
        if ([Boolean,Number,String].some(C=>v instanceof C)) {return `BoxedPrimitive<${v.constructor.name}>`}
        if (this._isDes(v)) return 'Descriptor';
        if (Object.prototype===proto) return `PlainObject`;
        if (this._isIns(v,proto)) return `Instance<${proto.constructor.name}>`;
        // Object.create()で拡張されたりnew Function()で生成されたES5以前の擬似クラスインスタンスなど上記以外全て。
        return name;
    }
    static _isDes(v) {// Descriptor
        const keys = Object.keys(v);
        const isDescriptor = keys.length > 0 && keys.every(key => 
            ['value', 'writable', 'get', 'set', 'configurable', 'enumerable'].includes(key)
        ) && (keys.includes('value') || keys.includes('writable') || keys.includes('get') || keys.includes('set'));
    }
    static _isIns(v,proto) {// Instance
        const ctor = proto.constructor;
        return 'function'===typeof ctor && FnTys._isEsCls(ctor);
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

